// The package's changelog: one entry per release under `## x.y.z`, with a "What a repo must do" list.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { compareReleases, packageRoot } from './kit.js';

const release = /^\d+\.\d+\.\d+$/;

export function readChangelog() {
  const file = join(packageRoot, 'CHANGELOG.md');
  if (!existsSync(file)) return [];
  const sections = readFileSync(file, 'utf8').split(/^## /m).slice(1);
  return sections
    .map((section) => {
      const [heading, ...body] = section.split('\n');
      const text = body.join('\n');
      const at = text.search(/^### What a repo must do\s*$/m);
      const summary = (at === -1 ? text : text.slice(0, at)).trim().replace(/\s*\n\s*/g, ' ');
      const steps = at === -1 ? [] : text.slice(at).split('\n').slice(1).filter((line) => line.trim());
      return { version: heading.trim(), summary, steps };
    })
    .filter((entry) => release.test(entry.version));
}

// The entries after the installed release, up to and including this one, oldest first.
// With no installed release, every entry up to this one.
export function changelogSince(installed, current) {
  return readChangelog()
    .filter((entry) => compareReleases(entry.version, installed) > 0 && compareReleases(entry.version, current) <= 0)
    .sort((a, b) => compareReleases(a.version, b.version));
}

export function changelogStep(entries, installed) {
  if (!entries.length) return null;
  const since = installed ? `since ${installed}` : 'up to this one';
  const lines = entries.flatMap(({ version, summary, steps }) => [
    `${version}: ${summary}`,
    ...(steps.length ? steps.map((step) => `  ${step}`) : ['  Nothing to do.']),
  ]);
  return `Do what the changelog asks for each release ${since}, oldest first, each step in its own commit:\n${lines.join('\n')}`;
}
