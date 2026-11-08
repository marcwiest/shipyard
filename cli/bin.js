#!/usr/bin/env node
import { main } from './main.js';

process.exitCode = main(process.argv.slice(2), {
  cwd: process.cwd(),
  stdout: process.stdout,
  stderr: process.stderr,
});
