import assert from 'node:assert/strict';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { commit, files, packageCopy, put, read, repo, run, sha256, status } from './helpers.js';

const v1 = packageCopy({ version: '1.0.0' });
const block = readFileSync(join(v1, 'kit/core/templates/agents-block.md'), 'utf8');
const settings = readFileSync(join(v1, 'kit/core/templates/settings.yml'), 'utf8');
const v2 = packageCopy({
  version: '1.1.0',
  files: {
    'kit/core/plans.md': '# Plans, rewritten\n',
    'kit/core/human-steps.md': null,
    'kit/core/templates/agents-block.md': block.replace('Before any work:', 'Before any work, always:'),
    'kit/core/templates/settings.yml': `${settings}new-key: ""\n`,
  },
});

const install = (args = []) => {
  const cwd = repo();
  assert.equal(run(cwd, ['init', ...args], { pkg: v1 }).code, 0);
  commit(cwd);
  return cwd;
};

test('update replaces managed files and the block, deletes dropped files and rewrites the record', () => {
  const cwd = install();
  const ownSettings = read(cwd, '.shipyard/settings.yml');
  const { code, stdout } = run(cwd, ['update'], { pkg: v2 });
  assert.equal(code, 0);
  assert.equal(read(cwd, '.shipyard/core/plans.md'), '# Plans, rewritten\n');
  assert.equal(read(cwd, '.shipyard/core/human-steps.md'), null);
  assert.match(read(cwd, 'AGENTS.md'), /Before any work, always:/);
  const record = read(cwd, '.shipyard/version.yml');
  assert.match(record, /^release: 1\.1\.0$/m);
  assert.match(record, new RegExp(`^  core/plans\\.md: ${sha256(cwd, '.shipyard/core/plans.md')}$`, 'm'));
  assert.doesNotMatch(record, /human-steps/);
  assert.equal(read(cwd, '.shipyard/settings.yml'), ownSettings);
  assert.deepEqual(status(cwd).split('\n').filter(Boolean).sort(), [
    ' D .shipyard/core/human-steps.md',
    ' M .shipyard/core/plans.md',
    ' M .shipyard/core/templates/agents-block.md',
    ' M .shipyard/core/templates/settings.yml',
    ' M .shipyard/version.yml',
    ' M AGENTS.md',
  ]);
  assert.match(stdout, /^1\. Commit what this wrote, and nothing else, such as `chore: update shipyard to 1\.1\.0`\.$/m);
  assert.match(stdout, /^2\. In their own commit, add these lines[^\n]*\n {3}- at the end of the file:\n {7}new-key: ""$/m);
});

test('update stops on an edited managed file and an edited block, and --force overwrites them', () => {
  const cwd = install();
  put(cwd, { '.shipyard/core/plans.md': 'our edit\n', 'AGENTS.md': read(cwd, 'AGENTS.md').replace('Skills: none', 'Skills: ours') });
  commit(cwd);
  const stopped = run(cwd, ['update'], { pkg: v2 });
  assert.equal(stopped.code, 1);
  assert.ok(stopped.stderr.includes(`- \`.shipyard/core/plans.md\`: edited; its new version is \`${v2}/kit/core/plans.md\`.`));
  assert.match(stopped.stderr, /- The AGENTS\.md block: edited;/);
  assert.match(stopped.stderr, /1\. For each, ask the human whether the change belongs in a repo-owned file/);
  assert.equal(status(cwd), '');

  const forced = run(cwd, ['update', '--force'], { pkg: v2 });
  assert.equal(forced.code, 0);
  assert.equal(read(cwd, '.shipyard/core/plans.md'), '# Plans, rewritten\n');
  assert.match(read(cwd, 'AGENTS.md'), /^Skills: none$/m);
});

test('update stops on a deleted managed file', () => {
  const cwd = install();
  rmSync(join(cwd, '.shipyard/core/roles.md'));
  commit(cwd);
  const { code, stderr } = run(cwd, ['update'], { pkg: v2 });
  assert.equal(code, 1);
  assert.match(stderr, /- `\.shipyard\/core\/roles\.md`: deleted;/);
});

test('update refuses a record naming a newer release and points to reverting', () => {
  const cwd = install();
  const { code, stderr } = run(cwd, ['update'], { pkg: packageCopy({ version: '0.9.0' }) });
  assert.equal(code, 1);
  assert.match(stderr, /Shipyard 1\.0\.0 is installed, which is newer than this CLI, 0\.9\.0\./);
  assert.match(stderr, /2\. To go back to an older release, revert the commit that updated shipyard to 1\.0\.0/);
  assert.equal(status(cwd), '');
});

test('update reads a record written by hand', () => {
  const cwd = install();
  const record = read(cwd, '.shipyard/version.yml');
  const byHand = record
    .replace(/^# .*\n/, '')
    .replace(/^release: .*$/m, 'release: ""   # none yet\ncommit: b524c1ee6139c25596919aefbd4e57ec9eb45576')
    .replace(/^agents-block: .*\n/m, '');
  put(cwd, { '.shipyard/version.yml': byHand });
  commit(cwd);
  const { code, stdout } = run(cwd, ['update'], { pkg: v2 });
  assert.equal(code, 0);
  assert.match(stdout, /Updated shipyard from a copy by hand to 1\.1\.0: core\./);
  const rewritten = read(cwd, '.shipyard/version.yml');
  assert.match(rewritten, /^release: 1\.1\.0$/m);
  assert.doesNotMatch(rewritten, /^commit:/m);
  assert.match(rewritten, /^agents-block: [0-9a-f]{64}$/m);
});

test('update prints the changelog entries after the installed release, oldest first', () => {
  const changelog = [
    '# Changelog', '',
    '## 1.2.0', '', 'Renames a plan field.', '', '### What a repo must do', '', '- Rename `Goal` to `Aim` in open plans.', '',
    '## 1.1.0', '', 'Adds a PR shape.', '', '### What a repo must do', '',
    '## 1.0.0', '', 'The first release.', '', '### What a repo must do', '', '- Adopt it.', '',
  ].join('\n');
  const cwd = install();
  const { code, stdout } = run(cwd, ['update'], { pkg: packageCopy({ version: '1.2.0', changelog }) });
  assert.equal(code, 0);
  assert.match(
    stdout,
    /for each release since 1\.0\.0, oldest first, each step in its own commit:\n {3}1\.1\.0: Adds a PR shape\.\n {5}Nothing to do\.\n {3}1\.2\.0: Renames a plan field\.\n {5}- Rename `Goal` to `Aim` in open plans\.\n/,
  );
  assert.doesNotMatch(stdout, /The first release|Adopt it/);
});
