import assert from 'node:assert/strict';
import { test } from 'node:test';
import { commit, packageCopy, read, repo, run, sha256, status, version } from './helpers.js';

const coreInstall = () => {
  const cwd = repo();
  assert.equal(run(cwd, ['init']).code, 0);
  commit(cwd);
  return cwd;
};

test('init adds parts to an install, leaving the settings file alone', () => {
  const cwd = coreInstall();
  const before = sha256(cwd, '.shipyard/settings.yml');
  const { code, stdout } = run(cwd, ['init', 'building', 'dispatch']);
  assert.equal(code, 0);
  assert.equal(sha256(cwd, '.shipyard/settings.yml'), before);
  const record = read(cwd, '.shipyard/version.yml');
  assert.match(record, new RegExp(`^  building/index\\.md: ${sha256(cwd, '.shipyard/building/index.md')}$`, 'm'));
  assert.match(record, new RegExp(`^  core/plans\\.md: ${sha256(cwd, '.shipyard/core/plans.md')}$`, 'm'));
  assert.match(stdout, /^1\. Commit what this wrote, and nothing else, such as `chore: add shipyard building, dispatch`\.$/m);
  assert.match(stdout, /- under `roles:`, after its last key:\n {9}orchestrator-bot: +# read by: building, weekly-drift-check\n/);
  assert.match(stdout, /- at the end of the file:\n {7}labels: +# read by: dispatch\n/);
  assert.doesNotMatch(stdout, /planning-agent|drift-check:/);
  assert.ok(stdout.endsWith("3. Run the adoption check in `.shipyard/core/adoption-check.md`: find where the repo's own agent instructions, glossary and tooling conflict with the parts installed, and ask the human to settle each one before this merges.\n"));
});

test('init names nothing left when the parts are already installed', () => {
  const cwd = coreInstall();
  const { code, stdout } = run(cwd, ['init']);
  assert.equal(code, 0);
  assert.match(stdout, /Already installed: core\.\n\nNext steps: none\. Nothing is left to do\.\n$/);
  assert.equal(status(cwd), '');
});

test('init refuses to add parts when the CLI is another release than the install', () => {
  const cwd = coreInstall();
  const { code, stderr } = run(cwd, ['init', 'verification'], { pkg: packageCopy({ version: '9.0.0' }) });
  assert.equal(code, 1);
  assert.ok(stderr.includes(`Shipyard ${version} is installed, and this CLI is 9.0.0.`));
  assert.match(stderr, /1\. Run `npx shipyard-kit@9\.0\.0 update` first/);
  assert.equal(status(cwd), '');
});
