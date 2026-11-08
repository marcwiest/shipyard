// `remove`: takes shipyard out of the repo, leaving the files the repo owns.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { blockChecksum, withoutBlock } from './agents.js';
import { npx } from './kit.js';
import { Stop, apply, read, requireGit } from './repo.js';

const repoOwned = ['CLAUDE.md', 'docs/product/index.md', 'docs/agents/index.md', 'docs/context.md'];

export function remove(args, { cwd }) {
  if (args.length) {
    throw new Stop(`Unknown argument for remove: ${args[0]}.`, [`Run \`${npx} --help\` to see the options.`], 2);
  }
  requireGit(cwd);
  const agents = read(cwd, 'AGENTS.md');
  const installed = existsSync(join(cwd, '.shipyard'));
  const hasBlock = blockChecksum(agents) !== null;
  if (!installed && !hasBlock) {
    return { report: "Shipyard isn't installed here: there's no `.shipyard/` and no AGENTS.md block.", next: [] };
  }

  const writes = new Map();
  const deletes = installed ? ['.shipyard'] : [];
  const rest = hasBlock ? withoutBlock(agents) : agents;
  if (hasBlock && rest === null) deletes.push('AGENTS.md');
  else if (hasBlock) writes.set('AGENTS.md', rest);
  apply(cwd, writes, deletes, { recursive: true });

  const removed = [installed && '`.shipyard/`', hasBlock && 'the AGENTS.md block', rest === null && '`AGENTS.md`, which held nothing else']
    .filter(Boolean);
  const left = repoOwned.filter((path) => read(cwd, path) !== null);
  const report = [`Removed ${removed.join(', ')}.`];
  if (left.length) report.push(`Left in place, as the repo's own: ${left.map((path) => `\`${path}\``).join(', ')}.`);

  const next = ['Commit what this removed, and nothing else, such as `chore: remove shipyard`.'];
  if (rest === null && left.includes('CLAUDE.md')) {
    next.push('`CLAUDE.md` loads `AGENTS.md`, which is gone: remove its `@AGENTS.md` line, or delete `CLAUDE.md` if nothing else is in it.');
  }
  const pointing = left.filter((path) => read(cwd, path).includes('.shipyard/'));
  if (pointing.length) {
    next.push(`Remove the pointers to \`.shipyard/\` left in ${pointing.map((path) => `\`${path}\``).join(', ')}, such as the kit glossary in a reading order.`);
  }
  return { report: report.join('\n'), next };
}
