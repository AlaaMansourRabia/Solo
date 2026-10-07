/**
 * Prints the CSS that a list of Tailwind classes compiles to under the
 * library's configuration (packages/core/src/tailwind-preset.css).
 *
 * Use it to confirm a utility emits the intended property and value — and
 * to catch classes that compile to nothing.
 *
 * Usage: node scripts/tw-explain.mjs "bg-(--color-accent) hover:opacity-50 ..."
 */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'packages/core/package.json'));
const {compile} = await import(
  require.resolve('@tailwindcss/node', {paths: [path.dirname(require.resolve('@tailwindcss/cli/package.json'))]})
);

const classes = process.argv.slice(2).join(' ').split(/\s+/).filter(Boolean);
if (classes.length === 0) {
  console.error('Usage: node scripts/tw-explain.mjs "class1 class2 ..."');
  process.exit(1);
}

const base = path.join(root, 'packages/core/src');
const input = `@import "./tailwind-preset.css";\n@import "tailwindcss/utilities.css" source(none);\n`;
for (const cls of classes) {
  const compiler = await compile(input, {base, onDependency() {}});
  const empty = compiler.build([]);
  const css = compiler.build([cls]);
  console.log(`\n### ${cls}`);
  if (css === empty) {
    console.log('!! NO CSS GENERATED — not a valid utility under this config');
    continue;
  }
  // Drop the banner, the @property registrations and the properties-layer
  // fallback block; keep the rules themselves.
  const body = css
    .replace(/\/\*![^*]*\*\/\s*/, '')
    .replace(/@property [^{]+\{[^}]*\}\s*/g, '')
    .replace(/@layer properties\s*;\s*/g, '')
    .replace(/@layer properties\s*\{\s*@supports[\s\S]*$/, '')
    .trim();
  console.log(body);
}
