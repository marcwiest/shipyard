// `init [module...]`: installs core and the named modules.
import { readFileSync } from 'node:fs';
import { blockChecksum, blockTemplate, importsAgents, withBlock } from './agents.js';
import { kitFile, modules, needs, npx, ordered, partFiles, sha256, version } from './kit.js';
import { Stop, apply, read, readRecord, recordPath, recordText, recordedParts, requireGit } from './repo.js';
import { filterSettings, missingSettings, missingSettingsStep, settingsPath, settingsTemplate } from './settings.js';

// Core's templates the repo copies once and then owns, at the settings template's default paths.
const templates = [
  ['core/templates/spec-index.md', 'docs/product/index.md'],
  ['core/templates/agent-rules-index.md', 'docs/agents/index.md'],
  ['core/templates/context.md', 'docs/context.md'],
];

export function parseModules(args) {
  const known = modules();
  for (const arg of args) {
    if (arg.startsWith('-')) {
      throw new Stop(`Unknown option for init: ${arg}.`, [`Run \`${npx} --help\` to see the options.`], 2);
    }
    if (arg !== 'core' && !known.includes(arg)) {
      throw new Stop(`Unknown module: ${arg}. The modules are ${known.join(', ')}.`, [
        `Run \`${npx} init\` again with module names from that list.`,
      ], 2);
    }
  }
  return args.filter((arg) => arg !== 'core');
}

// Refuses when a part's Needs line names a part that isn't taken.
export function requireNeeds(taken, named) {
  for (const part of taken) {
    const missing = needs(part).filter((need) => !taken.includes(need));
    if (missing.length) {
      throw new Stop(`${part} needs ${missing.join(' and ')}, which ${missing.length > 1 ? "aren't" : "isn't"} taken.`, [
        `Run \`${npx} init ${ordered([...named, ...missing]).join(' ')}\` to take ${missing.length > 1 ? 'them' : 'it'} too, or leave out ${part}.`,
      ]);
    }
  }
}

// Adds the parts' files to the writes and returns each one's checksum, keyed by its path in `.shipyard/`.
export function addParts(writes, parts) {
  const files = {};
  for (const path of parts.flatMap(partFiles)) {
    const content = readFileSync(kitFile(path));
    writes.set(`.shipyard/${path}`, content);
    files[path] = sha256(content);
  }
  return files;
}

export const ownStep =
  "Keep this repo's own instructions in its agent rules, `docs/agents/index.md` by default, and its opinions in that file's House rules section, where they win over kit text. Never edit files in `.shipyard/` other than `settings.yml`: updates replace them.";

// Adds the named parts to an install, at its release, leaving the settings file to the repo.
function addToInstall(cwd, named, record) {
  if (record.release !== version) {
    const installed = record.release ? `Shipyard ${record.release} is installed` : 'Shipyard is installed from a copy by hand';
    throw new Stop(`${installed}, and this CLI is ${version}. Parts are added only at the installed release.`, [
      `Run \`${npx} update\` first and commit what it wrote, then run this \`init\` again.`,
    ]);
  }
  const installed = recordedParts(record);
  const added = ordered(named.filter((part) => !installed.includes(part)));
  if (!added.length) {
    return { report: `Already installed: ${ordered(installed).join(', ')}.`, next: [] };
  }
  const parts = ordered([...installed, ...added]);
  requireNeeds(parts, named);

  const writes = new Map();
  const files = { ...record.files, ...addParts(writes, added) };
  writes.set(recordPath, recordText({ release: version, agentsBlock: record.agentsBlock, files }));
  apply(cwd, writes);

  const next = [`Commit what this wrote, and nothing else, such as \`chore: add shipyard ${added.join(', ')}\`.`];
  const settings = missingSettingsStep(missingSettings(read(cwd, settingsPath) ?? '', parts, installed));
  if (settings) next.push(settings);
  return { report: `Added to shipyard ${version} in \`.shipyard/\`: ${added.join(', ')}.`, next };
}

export function init(args, { cwd }) {
  const named = parseModules(args);
  requireGit(cwd);
  const record = readRecord(cwd);
  if (record) return addToInstall(cwd, named, record);
  const parts = ordered(['core', ...named]);
  requireNeeds(parts, named);

  const writes = new Map();
  const files = addParts(writes, parts);
  const report = [`Installed shipyard ${version} in \`.shipyard/\`: ${parts.join(', ')}.`];
  const next = [`Commit what this wrote, and nothing else, such as \`chore: adopt shipyard ${version}\`.`];

  if (read(cwd, settingsPath) === null) {
    writes.set(settingsPath, filterSettings(settingsTemplate(), parts));
    report.push(`Wrote \`${settingsPath}\`, with the keys the taken parts read.`);
    next.push(
      `Fill in \`${settingsPath}\`, matching what the repo already runs: the planning agent's tool and start under \`roles\`, the folders under \`paths\` if they differ from the defaults, the branch names, the install, check and test commands CI runs, and the seams. Leave a value empty until it exists.`,
    );
  } else {
    report.push(`Kept the existing \`${settingsPath}\`.`);
  }

  const agents = withBlock(read(cwd, 'AGENTS.md'), blockTemplate());
  writes.set('AGENTS.md', agents);
  report.push('Added the shipyard block to `AGENTS.md`.');

  const claude = read(cwd, 'CLAUDE.md');
  if (claude === null) {
    writes.set('CLAUDE.md', '@AGENTS.md\n');
    report.push('Wrote `CLAUDE.md`, holding `@AGENTS.md`.');
  } else if (!importsAgents(claude)) {
    next.push('Add a line holding only `@AGENTS.md` to `CLAUDE.md`, so Claude Code loads `AGENTS.md`.');
  }

  const copied = [];
  const skipped = [];
  for (const [source, target] of templates) {
    if (read(cwd, target) === null) {
      writes.set(target, readFileSync(kitFile(source)));
      copied.push(target);
    } else {
      skipped.push(target);
    }
  }
  if (copied.length) {
    report.push(`Copied templates to ${copied.map((path) => `\`${path}\``).join(', ')}.`);
    next.push(
      `Fill in the placeholders, in angle brackets, in ${copied.map((path) => `\`${path}\``).join(', ')}. Where there is nothing for a section yet, delete its placeholder line and keep the heading.`,
    );
  }
  if (skipped.length) {
    report.push(`Skipped templates where a file exists: ${skipped.map((path) => `\`${path}\``).join(', ')}.`);
  }

  writes.set(recordPath, recordText({ release: version, agentsBlock: blockChecksum(agents), files }));
  apply(cwd, writes);
  next.push(ownStep);
  return { report: report.join('\n'), next };
}
