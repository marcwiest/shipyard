// `update [--force]`: brings the installed parts to this release.
import { existsSync, readFileSync, readdirSync, rmdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { blockChecksum, blockTemplate, withBlock } from './agents.js';
import { changelogSince, changelogStep } from './changelog.js';
import { addParts } from './init.js';
import { allParts, compareReleases, kitFile, npx, ordered, sha256, version } from './kit.js';
import { Stop, apply, read, readRecord, recordPath, recordText, recordedParts, requireGit } from './repo.js';
import { missingSettings, missingSettingsStep, settingsPath } from './settings.js';

export function requireRecord(cwd) {
  const record = readRecord(cwd);
  if (!record) {
    throw new Stop("Shipyard isn't installed here: `.shipyard/version.yml` is missing.", [
      `Run \`${npx} init\` to install it.`,
    ]);
  }
  return record;
}

function same(cwd, path, content) {
  const file = join(cwd, path);
  return existsSync(file) && readFileSync(file).equals(Buffer.from(content));
}

// Removes folders in `.shipyard/` that deleting files left empty.
function pruneEmpty(cwd, paths) {
  for (const path of paths) {
    let dir = dirname(join(cwd, path));
    while (dir.startsWith(join(cwd, '.shipyard', '/')) && existsSync(dir) && !readdirSync(dir).length) {
      rmdirSync(dir);
      dir = dirname(dir);
    }
  }
}

const count = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;

// Names a file's new version by its path in the release, then its path in the package.
function newVersion(path) {
  const releasePath = ['kit', ...path.split('/')].join('/');
  return `its new version is \`${releasePath}\` in \`shipyard-kit@${version}\`, at \`${kitFile(path)}\``;
}

export function update(args, { cwd }) {
  const unknown = args.filter((arg) => arg !== '--force');
  if (unknown.length) {
    throw new Stop(`Unknown argument for update: ${unknown[0]}.`, [`Run \`${npx} --help\` to see the options.`], 2);
  }
  const force = args.includes('--force');
  requireGit(cwd);
  const record = requireRecord(cwd);
  if (record.release && compareReleases(record.release, version) > 0) {
    throw new Stop(`Shipyard ${record.release} is installed, which is newer than this CLI, ${version}.`, [
      `To update, run \`npx shipyard-kit@<release> update\` with ${record.release} or newer.`,
      `To go back to an older release, revert the commit that updated shipyard to ${record.release}, and the commits that finished its steps. This CLI can't undo a newer release's manual steps.`,
    ]);
  }

  const parts = ordered(recordedParts(record).filter((part) => allParts().includes(part)));
  const writes = new Map();
  const files = addParts(writes, parts);

  const changed = [];
  for (const [path, sum] of Object.entries(record.files)) {
    const file = join(cwd, '.shipyard', ...path.split('/'));
    const state = !existsSync(file) ? 'deleted' : sha256(readFileSync(file)) !== sum ? 'edited' : null;
    if (!state) continue;
    const now = path in files ? newVersion(path) : 'this release drops it';
    changed.push(`- \`.shipyard/${path}\`: ${state}; ${now}.`);
  }
  const agentsText = read(cwd, 'AGENTS.md');
  const block = blockChecksum(agentsText);
  if (record.agentsBlock && block !== record.agentsBlock) {
    const state = block === null ? 'deleted' : 'edited';
    changed.push(
      `- The AGENTS.md block: ${state}; ${newVersion('core/templates/agents-block.md')}, with trigger labels and skills "none".`,
    );
  }
  if (changed.length && !force) {
    throw new Stop(`Managed files were changed in this repo, and updating would overwrite them:\n${changed.join('\n')}`, [
      "For each, ask the human whether the change belongs in a repo-owned file, such as the agent rules' House rules section or `.shipyard/settings.yml`, and move it there in its own commit.",
      `Then run \`${npx} update --force\`, which overwrites them.`,
    ]);
  }

  const agents = withBlock(agentsText, blockTemplate());
  writes.set('AGENTS.md', agents);
  writes.set(recordPath, recordText({ release: version, agentsBlock: blockChecksum(agents), files }));
  for (const [path, content] of writes) if (same(cwd, path, content)) writes.delete(path);
  const deletes = Object.keys(record.files)
    .filter((path) => !(path in files) && existsSync(join(cwd, '.shipyard', ...path.split('/'))))
    .map((path) => `.shipyard/${path}`);
  apply(cwd, writes, deletes);
  pruneEmpty(cwd, deletes);

  const next = [];
  const written = writes.size + deletes.length;
  if (written) next.push(`Commit what this wrote, and nothing else, such as \`chore: update shipyard to ${version}\`.`);
  const settings = missingSettingsStep(missingSettings(read(cwd, settingsPath) ?? '', parts));
  if (settings) next.push(settings);
  const changelog = changelogStep(changelogSince(record.release, version), record.release);
  if (changelog && compareReleases(record.release, version) < 0) next.push(changelog);

  const from = record.release || 'a copy by hand';
  const report = written
    ? `Updated shipyard from ${from} to ${version}: ${parts.join(', ')}. ${count(writes.size, 'file')} written, ${deletes.length} deleted.`
    : `Shipyard ${version} is installed and matches this release: ${parts.join(', ')}.`;
  return { report: force && changed.length ? `${report}\nOverwrote:\n${changed.join('\n')}` : report, next };
}
