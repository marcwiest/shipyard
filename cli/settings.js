// The settings file: core's template, filtered by the `# read by:` marks, and the lines a file lacks.
import { readFileSync } from 'node:fs';
import { kitFile } from './kit.js';

export const settingsPath = '.shipyard/settings.yml';

export function settingsTemplate() {
  return readFileSync(kitFile('core/templates/settings.yml'), 'utf8');
}

const keyLine = /^(\s*)([A-Za-z0-9_-]+):(?:\s|$)/;
const indentOf = (line) => line.match(/^\s*/)[0].length;
const isComment = (line) => line.trim().startsWith('#');

// The template's keys as a tree. Each node spans its leading comments, its line and its children.
function parse(lines) {
  const root = { path: [], children: [], indent: -1 };
  const stack = [root];
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(keyLine);
    if (!match || isComment(lines[i])) continue;
    const indent = match[1].length;
    while (stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1);
    let start = i;
    while (start > 0 && isComment(lines[start - 1]) && indentOf(lines[start - 1]) === indent) start -= 1;
    let end = i + 1;
    while (end < lines.length && lines[end].trim() && indentOf(lines[end]) > indent) end += 1;
    const readBy = lines[i].match(/#\s*read by:\s*([^.;]*)/);
    const node = {
      key: match[2],
      path: [...parent.path, match[2]],
      indent,
      start,
      end,
      readBy: readBy ? readBy[1].split(',').map((part) => part.trim()).filter(Boolean) : null,
      children: [],
    };
    parent.children.push(node);
    stack.push(node);
  }
  return root;
}

// The template without the keys whose `# read by:` parts are all left out.
export function filterSettings(template, parts) {
  const lines = template.split('\n');
  const drop = new Set();
  const visit = (node) => {
    if (node.readBy && !node.readBy.some((part) => parts.includes(part))) {
      for (let i = node.start; i < node.end; i += 1) drop.add(i);
      return;
    }
    node.children.forEach(visit);
  };
  visit(parse(lines));
  const kept = lines.filter((_, i) => !drop.has(i));
  return `${kept.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
}

// The key paths a settings file holds, such as `roles.builder-bot`.
function keyPaths(text) {
  const paths = new Set();
  const stack = [];
  for (const line of text.split('\n')) {
    const match = line.match(keyLine);
    if (!match || isComment(line)) continue;
    const indent = match[1].length;
    while (stack.length && stack.at(-1).indent >= indent) stack.pop();
    stack.push({ indent, key: match[2] });
    paths.add(stack.map((entry) => entry.key).join('.'));
  }
  return paths;
}

// The template's lines, for the given parts, that the settings file lacks, and where each goes.
export function missingSettings(settings, parts, alreadyRead = null) {
  const template = filterSettings(settingsTemplate(), parts);
  const lines = template.split('\n');
  const present = keyPaths(settings);
  const known = alreadyRead ? keyPaths(filterSettings(settingsTemplate(), alreadyRead)) : null;
  const missing = [];
  const visit = (node) => {
    const path = node.path.join('.');
    if (!present.has(path)) {
      if (known && known.has(path)) return;
      const parents = node.path.slice(0, -1);
      missing.push({
        where: parents.length ? `under ${parents.map((key) => `\`${key}:\``).join(' → ')}` : 'at the top level',
        text: lines.slice(node.start, node.end).join('\n'),
      });
      return;
    }
    node.children.forEach(visit);
  };
  parse(lines).children.forEach(visit);
  return missing;
}

export function missingSettingsStep(missing) {
  if (!missing.length) return null;
  const blocks = missing.map(({ where, text }) => `${where}:\n${text}`);
  return `Add these lines to \`${settingsPath}\`, where each says, then fill in their values, in their own commit:\n${blocks.join('\n')}`;
}
