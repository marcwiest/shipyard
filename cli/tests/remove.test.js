import assert from 'node:assert/strict';
import { test } from 'node:test';
import { commit, put, read, repo, run, status } from './helpers.js';

const install = (files = {}) => {
  const cwd = repo(files);
  assert.equal(run(cwd, ['init']).code, 0);
  commit(cwd);
  return cwd;
};

test('remove deletes .shipyard and an AGENTS.md holding only the block, and lists what it left', () => {
  const cwd = install();
  const { code, stdout } = run(cwd, ['remove']);
  assert.equal(code, 0);
  assert.equal(read(cwd, '.shipyard/version.yml'), null);
  assert.equal(read(cwd, 'AGENTS.md'), null);
  assert.equal(read(cwd, 'CLAUDE.md'), '@AGENTS.md\n');
  assert.match(stdout, /Left in place, as the repo's own: `CLAUDE\.md`, `docs\/product\/index\.md`, `docs\/agents\/index\.md`, `docs\/context\.md`\./);
  assert.match(stdout, /\d\. `CLAUDE\.md` loads `AGENTS\.md`, which is gone/);
  assert.match(stdout, /\d\. Remove the pointers to `\.shipyard\/` left in `docs\/agents\/index\.md`/);
});

test("remove keeps AGENTS.md's own text", () => {
  const cwd = install({ 'AGENTS.md': '# Agents\n\nOur own rules.\n' });
  assert.equal(run(cwd, ['remove']).code, 0);
  assert.equal(read(cwd, 'AGENTS.md'), '# Agents\n\nOur own rules.\n');
  assert.doesNotMatch(status(cwd), /CLAUDE|docs\//);
});

test('remove stops on an uncommitted settings file', () => {
  const cwd = install();
  put(cwd, { '.shipyard/settings.yml': 'edited: true\n' });
  const { code, stderr } = run(cwd, ['remove']);
  assert.equal(code, 1);
  assert.match(stderr, /- \.shipyard\/settings\.yml/);
  assert.equal(read(cwd, '.shipyard/settings.yml'), 'edited: true\n');
});
