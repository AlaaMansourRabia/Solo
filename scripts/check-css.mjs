/**
 * Compiles the package stylesheets and fails on output Tailwind silently
 * mangled. Known trap: inside an arbitrary value `_` means space, so
 * `mbs-[calc(-1*var(--_x))]` compiles to `var(-- x)` — an invalid declaration
 * the browser drops. Use a shorthand (`-mbs-(--_x)`) or keep `var(--_x)` as
 * the first token of the value.
 *
 * Usage: node scripts/check-css.mjs
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bin = path.join(root, 'node_modules/.bin/tailwindcss');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'solo-css-'));
let failed = false;

const ENTRIES = [
  'core/src/styles.css',
  'core/src/components.css',
  'charts/src/styles.css',
  'charts/src/components.css',
  'examples/src/styles.css',
  'templates/src/styles.css',
];
for (const entry of ENTRIES) {
  const pkg = entry;
  const input = path.join(root, 'packages', entry);
  const out = path.join(tmp, entry.replace(/\//g, '_'));
  execFileSync(bin, ['-i', input, '-o', out], {stdio: 'pipe'});
  const css = fs.readFileSync(out, 'utf8');
  const lines = css.split('\n');
  lines.forEach((line, i) => {
    if (/var\(--\s/.test(line)) {
      failed = true;
      const selector = lines.slice(Math.max(0, i - 3), i).reverse().find(l => l.includes('{'));
      console.error(`${pkg}: mangled custom property in ${selector?.trim()}\n    ${line.trim()}`);
    }
  });
}

fs.rmSync(tmp, {recursive: true, force: true});
if (failed) process.exit(1);
console.log('check-css: ok');
