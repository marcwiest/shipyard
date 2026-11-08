// `init [module...]`: installs core and the named modules.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { kitFile, modules, needs, npx, ordered, partFiles, sha256, version } from './kit.js';
import { Stop, requireCommitted, requireGit, requireNoSymlink, writeRecord } from './repo.js';

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

// Copies the parts' files into `.shipyard/` and returns each one's checksum.
export function copyParts(cwd, parts) {
  const paths = parts.flatMap(partFiles);
  for (const path of paths) requireNoSymlink(cwd, `.shipyard/${path}`);
  const files = {};
  for (const path of paths) {
    const target = join(cwd, '.shipyard', ...path.split('/'));
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(kitFile(path), target);
    files[path] = sha256(readFileSync(target));
  }
  return files;
}

export function init(args, { cwd }) {
  const named = parseModules(args);
  requireGit(cwd);
  const parts = ordered(['core', ...named]);
  requireNeeds(parts, named);
  requireCommitted(cwd, ['.shipyard']);

  const files = copyParts(cwd, parts);
  writeRecord(cwd, { release: version, files });

  return {
    report: `Installed shipyard ${version} in \`.shipyard/\`: ${parts.join(', ')}.`,
    next: [`Commit what this wrote, and nothing else, such as \`chore: adopt shipyard ${version}\`.`],
  };
}
