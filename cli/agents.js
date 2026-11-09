// The AGENTS.md block.
import { readFileSync } from 'node:fs';
import { kitFile, sha256 } from './kit.js';

const start = '<!-- shipyard:start -->';
const end = '<!-- shipyard:end -->';

// Core's block template, with trigger labels and skills "none" while the kit has no skills or dispatcher.
export function blockTemplate() {
  return readFileSync(kitFile('core/templates/agents-block.md'), 'utf8')
    .trimEnd()
    .replace(/^- Trigger labels:.*$/m, '- Trigger labels: none')
    .replace(/^- Skills:.*$/m, '- Skills: none');
}

// The block's place in a file: the indexes of its marker lines, or null.
function find(lines) {
  const first = lines.findIndex((line) => line.trim() === start);
  if (first === -1) return null;
  const last = lines.findIndex((line, i) => i > first && line.trim() === end);
  return last === -1 ? null : { first, last };
}

// The SHA-256 of the lines between the markers, each ending in a newline; null without a block.
export function blockChecksum(text) {
  if (text === null) return null;
  const lines = text.split('\n');
  const place = find(lines);
  if (!place) return null;
  return sha256(lines.slice(place.first + 1, place.last).map((line) => `${line}\n`).join(''));
}

// The file with the block in place: its contents replaced, or the block added at the end.
export function withBlock(text, block) {
  if (text === null || !text.trim()) return `${block}\n`;
  const lines = text.split('\n');
  const place = find(lines);
  if (place) {
    lines.splice(place.first, place.last - place.first + 1, ...block.split('\n'));
    return lines.join('\n');
  }
  return `${text.trimEnd()}\n\n${block}\n`;
}

// The file without the block, or null when nothing else is left in it.
export function withoutBlock(text) {
  const lines = text.split('\n');
  const place = find(lines);
  if (!place) return text;
  lines.splice(place.first, place.last - place.first + 1);
  const rest = lines.join('\n').replace(/\n{3,}/g, '\n\n');
  return rest.trim() ? `${rest.trimEnd()}\n` : null;
}
