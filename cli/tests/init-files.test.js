import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { put, read, repo, run, status } from './helpers.js';

const blockSha = (agents) => {
  const lines = agents.split('\n');
  const inner = lines.slice(lines.indexOf('<!-- shipyard:start -->') + 1, lines.indexOf('<!-- shipyard:end -->'));
  return createHash('sha256').update(inner.map((line) => `${line}\n`).join('')).digest('hex');
};

test('init with core alone leaves out the keys only other parts read', () => {
  const cwd = repo();
  assert.equal(run(cwd, ['init']).code, 0);
  const settings = read(cwd, '.shipyard/settings.yml');
  assert.match(settings, /^ {2}planning-agent:$/m);
  assert.match(settings, /^seams: \[\]$/m);
  assert.doesNotMatch(settings, /builder-bot|sizing-log|drift-check|labels:|notify:|coverage-floor:/);
});

test('init with building and dispatch keeps the keys they read', () => {
  const cwd = repo();
  assert.equal(run(cwd, ['init', 'building', 'dispatch']).code, 0);
  const settings = read(cwd, '.shipyard/settings.yml');
  assert.match(settings, /^ {2}builder-bot: +# read by: building$/m);
  assert.match(settings, /^ {2}sizing-log: ""/m);
  assert.match(settings, /^labels: +# read by: dispatch$/m);
  assert.match(settings, /^notify: mention/m);
  assert.doesNotMatch(settings, /^ *drift-check:|coverage-floor:|verification-skill/m);
});

test('init keeps an existing settings file', () => {
  const cwd = repo({ '.shipyard/settings.yml': 'mine: true\n' });
  const { code, stdout } = run(cwd, ['init']);
  assert.equal(code, 0);
  assert.equal(read(cwd, '.shipyard/settings.yml'), 'mine: true\n');
  assert.match(stdout, /Kept the existing `\.shipyard\/settings\.yml`/);
});

test("init adds the block after AGENTS.md's own text and records its checksum", () => {
  const cwd = repo({ 'AGENTS.md': '# Agents\n\nOur own rules.\n' });
  assert.equal(run(cwd, ['init']).code, 0);
  const agents = read(cwd, 'AGENTS.md');
  assert.match(agents, /^# Agents\n\nOur own rules\.\n\n<!-- shipyard:start -->\n/);
  assert.match(agents, /^Trigger labels: none\nSkills: none\n<!-- shipyard:end -->\n$/m);
  assert.match(read(cwd, '.shipyard/version.yml'), new RegExp(`^agents-block: ${blockSha(agents)}$`, 'm'));
});

test('init creates AGENTS.md and CLAUDE.md when missing', () => {
  const cwd = repo();
  assert.equal(run(cwd, ['init']).code, 0);
  assert.match(read(cwd, 'AGENTS.md'), /^<!-- shipyard:start -->\nThis repo uses shipyard\./);
  assert.equal(read(cwd, 'CLAUDE.md'), '@AGENTS.md\n');
});

test('init leaves a CLAUDE.md without the import and names it as a next step', () => {
  const cwd = repo({ 'CLAUDE.md': 'Be brief.\n' });
  const { stdout } = run(cwd, ['init']);
  assert.equal(read(cwd, 'CLAUDE.md'), 'Be brief.\n');
  assert.match(stdout, /\d\. Add a line holding only `@AGENTS\.md` to `CLAUDE\.md`/);
});

test('init copies the templates only where no file exists, naming the skipped ones', () => {
  const cwd = repo({ 'docs/product/index.md': '# Ours\n' });
  const { stdout } = run(cwd, ['init']);
  assert.equal(read(cwd, 'docs/product/index.md'), '# Ours\n');
  assert.match(read(cwd, 'docs/agents/index.md'), /^# Agents\n/);
  assert.match(read(cwd, 'docs/context.md'), /^# Context\n/);
  assert.match(stdout, /Skipped templates where a file exists: `docs\/product\/index\.md`\./);
  assert.match(stdout, /\d\. Keep this repo's own instructions in its agent rules[^\n]*\n$/);
});

test('init stops on an uncommitted change to AGENTS.md and writes nothing', () => {
  const cwd = repo({ 'AGENTS.md': 'Ours.\n' });
  put(cwd, { 'AGENTS.md': 'Ours, edited.\n' });
  const { code, stderr } = run(cwd, ['init']);
  assert.equal(code, 1);
  assert.match(stderr, /uncommitted changes:\n- AGENTS\.md\n/);
  assert.equal(status(cwd), ' M AGENTS.md\n');
});
