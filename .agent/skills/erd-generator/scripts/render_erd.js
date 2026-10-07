#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const input = process.argv[2] || 'docs/architecture/schema.mmd';
const output = 'docs/architecture/erd.svg';

if (!fs.existsSync(input)) {
  console.error(`SYNTAX_ERROR: input not found: ${input}`);
  process.exit(1);
}
if (fs.existsSync(output)) fs.unlinkSync(output);

const res = spawnSync('npx', ['mmdc', '-i', input, '-o', output, '-q'], {
  encoding: 'utf8',
  shell: process.platform === 'win32',
});

if (res.status !== 0 || !fs.existsSync(output)) {
  const err = (res.stderr || '') + (res.error ? res.error.message : '');
  console.error(`SYNTAX_ERROR: ${err.trim() || 'mmdc failed'}`);
  process.exit(1);
}
console.log('SUCCESS');
process.exit(0);
