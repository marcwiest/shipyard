import assert from 'node:assert/strict';
import { symlinkSync } from 'node:fs';
import { test } from 'node:test';
import { commit, files, put, read, repo, run, sha256, status, version } from './helpers.js';

test('init copies core and the named modules and records each checksum', () => {
  const cwd = repo();
  const { code, stdout } = run(cwd, ['init', 'building', 'dispatch']);
  assert.equal(code, 0);
  assert.deepEqual(files(cwd, '.shipyard').filter((path) => path.endsWith('index.md') && path.split('/').length === 2), [
    'building/index.md',
    'core/index.md',
    'dispatch/index.md',
  ]);
  const record = read(cwd, '.shipyard/version.yml');
  assert.match(record, new RegExp(`^release: ${version}$`, 'm'));
  assert.doesNotMatch(record, /^commit:/m);
  assert.match(record, new RegExp(`^  core/plans\\.md: ${sha256(cwd, '.shipyard/core/plans.md')}$`, 'm'));
  assert.match(record, new RegExp(`^  building/phases\\.md: ${sha256(cwd, '.shipyard/building/phases.md')}$`, 'm'));
  assert.match(stdout, /Next steps:\n1\. Commit what this wrote, and nothing else/);
});

test('init refuses a folder without .git and writes nothing', () => {
  const cwd = repo({}, { git: false });
  const { code, stderr } = run(cwd, ['init']);
  assert.equal(code, 1);
  assert.match(stderr, /This folder has no `\.git`/);
  assert.deepEqual(files(cwd, '.'), []);
});

test("init refuses a module whose Needs line names a part not taken, naming it", () => {
  const cwd = repo();
  const { code, stderr } = run(cwd, ['init', 'building']);
  assert.equal(code, 1);
  assert.match(stderr, /building needs dispatch, which isn't taken\./);
  assert.match(stderr, /init building dispatch/);
  assert.equal(status(cwd), '');
});

test('init refuses an unknown module with exit 2', () => {
  const cwd = repo();
  const { code, stderr } = run(cwd, ['init', 'deploy']);
  assert.equal(code, 2);
  assert.match(stderr, /Unknown module: deploy\./);
  assert.equal(status(cwd), '');
});

test('init stops on an uncommitted change to a file it would write', () => {
  const cwd = repo();
  put(cwd, { '.shipyard/core/plans.md': 'mine\n' });
  const { code, stderr } = run(cwd, ['init']);
  assert.equal(code, 1);
  assert.match(stderr, /uncommitted changes:\n- \.shipyard\/core\/plans\.md/);
  assert.match(stderr, /1\. Commit them first/);
  assert.equal(read(cwd, '.shipyard/core/plans.md'), 'mine\n');
  assert.deepEqual(files(cwd, '.shipyard'), ['core/plans.md']);
});

test('init refuses to write through a symlink and writes nothing', () => {
  const outside = repo({}, { git: false });
  const cwd = repo();
  symlinkSync(outside, `${cwd}/.shipyard`);
  commit(cwd);
  const { code, stderr } = run(cwd, ['init']);
  assert.equal(code, 1);
  assert.match(stderr, /goes through a symlink, `\.shipyard`/);
  assert.deepEqual(files(outside, '.'), []);
});
