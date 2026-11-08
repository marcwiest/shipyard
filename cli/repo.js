// The adopting repo: its git state and the version record.
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const recordPath = '.shipyard/version.yml';

export class Stop extends Error {
  constructor(message, next = [], code = 1) {
    super(message);
    this.next = next;
    this.code = code;
  }
}

export function requireGit(cwd) {
  if (!existsSync(join(cwd, '.git'))) {
    throw new Stop('This folder has no `.git`. Shipyard installs at the root of a git repo.', [
      "Run the command again from the repo's root folder, the one holding `.git`.",
    ]);
  }
}

// Stops when any of the paths has uncommitted changes, including untracked files.
export function requireCommitted(cwd, paths) {
  let output;
  try {
    output = execFileSync(
      'git',
      ['--literal-pathspecs', 'status', '--porcelain=v1', '-z', '--untracked-files=all', '--', ...paths],
      { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
  } catch (error) {
    throw new Stop(`git status failed: ${String(error.stderr || error.message).trim()}`, [
      'Fix what git reports, then run the command again.',
    ]);
  }
  const entries = output.split('\0').filter(Boolean);
  const changed = [];
  for (let i = 0; i < entries.length; i += 1) {
    const status = entries[i].slice(0, 2);
    changed.push(entries[i].slice(3));
    if (status.includes('R') || status.includes('C')) i += 1;
  }
  if (changed.length) {
    throw new Stop(
      `Files this command would write have uncommitted changes:\n${changed.map((path) => `- ${path}`).join('\n')}`,
      ['Commit them first, then run the command again, so its changes stay apart from yours.'],
    );
  }
}

export function read(cwd, path) {
  const file = join(cwd, path);
  return existsSync(file) ? readFileSync(file, 'utf8') : null;
}

// Refuses a path with a symlink in it, so no write lands outside the repo.
export function requireNoSymlink(cwd, path) {
  let current = cwd;
  for (const segment of path.split('/')) {
    current = join(current, segment);
    if (!existsSync(current) && !isLink(current)) return;
    if (isLink(current)) {
      throw new Stop(`\`${path}\` goes through a symlink, \`${current.slice(cwd.length + 1)}\`. Shipyard writes only real files in the repo.`, [
        'Replace the symlink with a real folder or file, commit that, then run the command again.',
      ]);
    }
  }
}

function isLink(file) {
  try {
    return lstatSync(file).isSymbolicLink();
  } catch {
    return false;
  }
}

export function write(cwd, path, content) {
  requireNoSymlink(cwd, path);
  const file = join(cwd, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

const unquote = (value) => {
  const trimmed = value.trim();
  const quoted = trimmed.match(/^(["'])(.*?)\1(\s+#.*)?$/);
  if (quoted) return quoted[2];
  return trimmed.replace(/\s+#.*$/, '');
};

// The version record: `release`, `commit` for a copy by hand, `agents-block` and `files`.
export function readRecord(cwd) {
  const text = read(cwd, recordPath);
  if (text === null) return null;
  const record = { release: '', commit: '', agentsBlock: '', files: {} };
  let inFiles = false;
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const entry = line.match(/^(\s*)(.+?):(?:\s+(.*))?$/);
    if (!entry) continue;
    const [, indent, key, value = ''] = entry;
    if (indent && inFiles) {
      const path = unquote(key);
      if (path.split('/').some((segment) => !segment || segment === '.' || segment === '..') || path.includes('\\')) {
        throw new Stop(`\`${recordPath}\` lists \`${path}\`, which isn't a path inside \`.shipyard/\`.`, [
          `Fix or remove that line in \`${recordPath}\` and commit it, then run the command again.`,
        ]);
      }
      record.files[path] = unquote(value);
      continue;
    }
    inFiles = key === 'files';
    if (key === 'release') record.release = unquote(value);
    if (key === 'commit') record.commit = unquote(value);
    if (key === 'agents-block') record.agentsBlock = unquote(value);
  }
  return record;
}

export function recordText({ release, agentsBlock, files }) {
  const lines = [
    '# Written by shipyard-kit. Managed: the CLI rewrites it on each install or update.',
    `release: ${release}`,
  ];
  if (agentsBlock) lines.push(`agents-block: ${agentsBlock}`);
  lines.push('files:');
  for (const path of Object.keys(files).sort()) lines.push(`  ${path}: ${files[path]}`);
  return `${lines.join('\n')}\n`;
}

// Writes and deletes files, once none of them has uncommitted changes or goes through a symlink.
export function apply(cwd, writes, deletes = [], { recursive = false } = {}) {
  const paths = [...writes.keys(), ...deletes];
  if (!paths.length) return;
  requireCommitted(cwd, paths);
  for (const path of paths) requireNoSymlink(cwd, path);
  for (const [path, content] of writes) write(cwd, path, content);
  for (const path of deletes) rmSync(join(cwd, path), { force: true, recursive });
}

// The parts a record lists, from the first folder of each managed file's path.
export function recordedParts(record) {
  return [...new Set(Object.keys(record.files).map((path) => path.split('/')[0]))];
}
