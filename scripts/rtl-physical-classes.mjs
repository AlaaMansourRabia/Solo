/**
 * Lists every Tailwind class in the package stylesheets that sets a
 * physical-direction property (left/right margins, padding, insets, borders,
 * corner radii, text-align, float…). Logical utilities (ms/me/ps/pe/start/end/
 * text-start/border-s/rounded-s…) are what mirror under dir="rtl"; a physical
 * class must be on the allow-list (scripts/rtl-allowlist.json) with a reason.
 *
 * Used by docs:check (`rtl-physical-classes`). Standalone:
 *   node scripts/rtl-physical-classes.mjs [--all]   (--all: include allowed)
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENTRIES = {
  core: 'packages/core/src/styles.css',
  charts: 'packages/charts/src/styles.css',
  examples: 'packages/examples/src/styles.css',
  templates: 'packages/templates/src/styles.css',
};
const PHYSICAL = /(?:^|[\s;{])(margin-left|margin-right|padding-left|padding-right|left|right|border-left(?:-[\w-]+)?|border-right(?:-[\w-]+)?|border-top-left-radius|border-top-right-radius|border-bottom-left-radius|border-bottom-right-radius|scroll-margin-left|scroll-margin-right|scroll-padding-left|scroll-padding-right|float|clear|text-align)\s*:\s*([^;}]*)/;

const unescape = sel => sel.replace(/\\(.)/g, '$1');

/** class name → {pkg, decl} for every physical class in the compiled CSS. */
export function findPhysicalClasses() {
  const bin = path.join(root, 'node_modules/.bin/tailwindcss');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'solo-rtl-'));
  const found = new Map();
  for (const [pkg, entry] of Object.entries(ENTRIES)) {
    const out = path.join(tmp, `${pkg}.css`);
    execFileSync(bin, ['-i', path.join(root, entry), '-o', out], {stdio: 'pipe'});
    const css = fs.readFileSync(out, 'utf8');
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = m[1].trim();
      if (!selector.startsWith('.')) continue;
      for (const decl of m[2].split(';')) {
        const d = PHYSICAL.exec(' ' + decl.trim());
        if (!d) continue;
        if (d[1] === 'text-align' && !/^(left|right)\b/.test(d[2].trim())) continue;
        if ((d[1] === 'float' || d[1] === 'clear') && !/^(left|right)\b/.test(d[2].trim())) continue;
        // class name = first simple class in the selector, unescaped
        const raw = /^\.((?:\\.|[^\s.:,>~+[\]()])+)/.exec(selector)?.[1];
        if (!raw) continue;
        const cls = unescape(raw);
        if (!found.has(cls)) found.set(cls, {pkg, decl: `${d[1]}: ${d[2].trim()}`});
      }
    }
  }
  fs.rmSync(tmp, {recursive: true, force: true});
  return found;
}

export function loadAllowlist() {
  const file = path.join(root, 'scripts/rtl-allowlist.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const found = findPhysicalClasses();
  const allow = loadAllowlist();
  let bad = 0;
  for (const [cls, {pkg, decl}] of found) {
    const ok = cls in allow;
    if (!ok) bad++;
    if (!ok || process.argv.includes('--all')) console.log(`${ok ? 'allowed' : 'PHYSICAL'}\t${pkg}\t${cls}\t${decl}${ok ? `\t(${allow[cls]})` : ''}`);
  }
  console.log(`${found.size} physical classes, ${bad} not allow-listed`);
  process.exit(bad ? 1 : 0);
}
