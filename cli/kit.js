// The package's own files: its release, the kit's parts and their files.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const kitRoot = join(packageRoot, 'kit');
export const version = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')).version;
export const npx = `npx shipyard-kit@${version}`;

export function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

export function allParts() {
  return readdirSync(kitRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function modules() {
  return allParts().filter((part) => part !== 'core');
}

// The parts a part needs: those its Needs line's first sentence names by folder name.
export function needs(part) {
  const index = readFileSync(join(kitRoot, part, 'index.md'), 'utf8');
  const line = index.match(/^- Needs:\s*(.*)$/m);
  if (!line) return [];
  const firstSentence = line[1].split(/\.(?:\s|$)/)[0];
  return allParts().filter(
    (other) => other !== part && new RegExp(`(^|[^\\w-])${other}($|[^\\w-])`).test(firstSentence),
  );
}

// The part's files, as paths relative to the kit with forward slashes, such as `core/plans.md`.
export function partFiles(part) {
  const files = [];
  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) walk(join(dir, entry.name), path);
      else if (entry.isFile()) files.push(path);
    }
  };
  walk(join(kitRoot, part), part);
  return files.sort();
}

export function kitFile(path) {
  return join(kitRoot, ...path.split('/'));
}

// A copy's parts in install order: core first, then the modules by name.
export function ordered(parts) {
  const unique = [...new Set(parts)];
  return [...unique.filter((part) => part === 'core'), ...unique.filter((part) => part !== 'core').sort()];
}

// Compares two releases, `x.y.z`; an empty release is older than any other.
export function compareReleases(a, b) {
  const parse = (release) => (release ? release.split('-')[0].split('.').map(Number) : [-1, -1, -1]);
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < 3; i += 1) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  return 0;
}
