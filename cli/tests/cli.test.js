import assert from 'node:assert/strict';
import { test } from 'node:test';
import { repo, run, version } from './helpers.js';

test('--help lists the commands and exits 0', () => {
  const { code, stdout } = run(repo(), ['--help']);
  assert.equal(code, 0);
  assert.match(stdout, /init \[module\.\.\.\]/);
  assert.match(stdout, /Modules: building, coverage-floor, dispatch/);
});

test('--version prints the release', () => {
  const { code, stdout } = run(repo(), ['--version']);
  assert.equal(code, 0);
  assert.equal(stdout, `${version}\n`);
});

test('an unknown command exits 2 with a next step', () => {
  const { code, stdout, stderr } = run(repo(), ['install']);
  assert.equal(code, 2);
  assert.equal(stdout, '');
  assert.match(stderr, /Unknown command: install\./);
  assert.match(stderr, /Next steps:\n1\. Run `npx shipyard-kit@.+ --help`/);
});
