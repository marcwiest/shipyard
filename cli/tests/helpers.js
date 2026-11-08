// Drives the CLI at its seam: arguments in; files, stdout, stderr and exit code out.
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const version = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')).version;

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' });

// A throwaway git repo holding the given files, committed.
export function repo(files = {}, { git: withGit = true } = {}) {
  const cwd = mkdtempSync(join(tmpdir(), 'shipyard-test-'));
  if (withGit) {
    git(cwd, 'init', '-q', '-b', 'main');
    git(cwd, 'config', 'user.email', 'test@example.com');
    git(cwd, 'config', 'user.name', 'Test');
    git(cwd, 'config', 'commit.gpgsign', 'false');
  }
  put(cwd, files);
  if (withGit) commit(cwd);
  return cwd;
}

export function put(cwd, files) {
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(cwd, path)), { recursive: true });
    writeFileSync(join(cwd, path), content);
  }
}

export function commit(cwd) {
  git(cwd, 'add', '-A');
  git(cwd, 'commit', '-q', '--allow-empty', '-m', 'test');
}

export function status(cwd) {
  return git(cwd, 'status', '--porcelain', '--untracked-files=all');
}

export function run(cwd, args, { pkg = packageRoot } = {}) {
  const result = spawnSync(process.execPath, [join(pkg, 'cli', 'bin.js'), ...args], { cwd, encoding: 'utf8' });
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
}

export function read(cwd, path) {
  return existsSync(join(cwd, path)) ? readFileSync(join(cwd, path), 'utf8') : null;
}

export function sha256(cwd, path) {
  return createHash('sha256').update(readFileSync(join(cwd, path))).digest('hex');
}

export function files(cwd, dir) {
  if (!existsSync(join(cwd, dir))) return [];
  return readdirSync(join(cwd, dir), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name).slice(join(cwd, dir).length + 1))
    .sort();
}

// A copy of the package whose version and changelog a test can change.
export function packageCopy({ version: copyVersion, changelog } = {}) {
  const pkg = mkdtempSync(join(tmpdir(), 'shipyard-pkg-'));
  for (const path of ['cli', 'kit', 'package.json', 'CHANGELOG.md']) {
    if (existsSync(join(packageRoot, path))) cpSync(join(packageRoot, path), join(pkg, path), { recursive: true });
  }
  if (copyVersion) {
    const manifest = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8'));
    writeFileSync(join(pkg, 'package.json'), JSON.stringify({ ...manifest, version: copyVersion }));
  }
  if (changelog !== undefined) writeFileSync(join(pkg, 'CHANGELOG.md'), changelog);
  return pkg;
}
