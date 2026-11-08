// Reads the arguments, runs one command and prints its output and next steps.
import { modules, npx, version } from './kit.js';
import { init } from './init.js';
import { remove } from './remove.js';
import { update } from './update.js';
import { Stop } from './repo.js';

const commands = {
  init: { usage: 'init [module...]', summary: 'Install core and the named modules, or add modules to an install.', run: init },
  update: { usage: 'update [--force]', summary: 'Update the installed parts to this release. --force overwrites edited managed files.', run: update },
  remove: { usage: 'remove', summary: "Remove shipyard, leaving the files the repo owns.", run: remove },
};

function help() {
  const width = Math.max(...Object.values(commands).map((command) => command.usage.length), 'Options'.length) + 3;
  return [
    `shipyard-kit ${version}: installs, updates and removes shipyard's parts in a git repo.`,
    `Run it from the repo root: ${npx} <command>`,
    '',
    'Commands:',
    ...Object.values(commands).map((command) => `  ${command.usage.padEnd(width)}${command.summary}`),
    '',
    'Options:',
    `  ${'--help'.padEnd(width)}Show this help.`,
    `  ${'--version'.padEnd(width)}Print the release.`,
    '',
    `Modules: ${modules().join(', ')}.`,
    'Exit codes: 0 done, 1 refused or stopped, 2 wrong arguments. Nothing is written unless it exits 0.',
  ].join('\n');
}

function numbered(steps) {
  if (!steps.length) return 'Next steps: none. Nothing is left to do.';
  const lines = steps.map((step, i) => `${i + 1}. ${step.replace(/\n/g, '\n   ')}`);
  return `Next steps:\n${lines.join('\n')}`;
}

export function main(argv, { cwd, stdout, stderr }) {
  if (argv.includes('--help') || argv.includes('-h')) {
    stdout.write(`${help()}\n`);
    return 0;
  }
  if (argv.includes('--version') || argv.includes('-v')) {
    stdout.write(`${version}\n`);
    return 0;
  }
  const [name, ...args] = argv;
  try {
    const command = commands[name];
    if (!command) {
      throw new Stop(
        name ? `Unknown command: ${name}.` : 'No command given.',
        [`Run \`${npx} --help\` to see the commands.`],
        2,
      );
    }
    const { report, next } = command.run(args, { cwd });
    stdout.write(`${report}\n\n${numbered(next)}\n`);
    return 0;
  } catch (error) {
    if (!(error instanceof Stop)) throw error;
    stderr.write(`${error.message}\n\n${numbered(error.next)}\n`);
    return error.code;
  }
}
