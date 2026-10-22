/**
 * Writes the agent-facing docs from the component .doc.mjs files, so an AI
 * coding agent gets the same decision rules a human reads on the docs site:
 *
 *   llms.txt       index: every component, one line on what it is for
 *   llms-full.txt  full catalog: purpose, do / don't, props, hooks
 *   AGENTS.md      how to build with Solo (choosing components, RTL, tokens)
 *
 * and copies each component's purpose + don'ts into an `@agentGuidance` block
 * in the component's own JSDoc — the text an agent sees on hover or when it
 * reads the source.
 *
 * Usage: node scripts/generate-agent-docs.mjs [--check]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const P = (...p) => path.join(root, ...p);

function walk(dir, pred, out = []) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    if (e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, pred, out);
    else if (pred(p)) out.push(p);
  }
  return out;
}

const clean = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const isHook = name => /^use[A-Z]/.test(name);

// ---------------------------------------------------------------------------
// Collect docs. A sub-component can appear twice — as a bare {name} entry in
// its parent's `components` list and in its own doc file — so merge, keeping
// whichever entry has content.
// ---------------------------------------------------------------------------

const docFiles = [
  ...walk(P('packages/core/src'), f => f.endsWith('.doc.mjs')),
  ...walk(P('packages/charts/src'), f => f.endsWith('.doc.mjs')),
].sort();

const entries = new Map();
function add(doc, {pkg, parent, file}) {
  const name = doc?.name;
  if (!name) return;
  const usage = doc.usage ?? {};
  const bp = usage.bestPractices ?? [];
  const next = {
    name,
    pkg,
    file,
    parent: doc.subComponentOf ?? parent ?? null,
    category: doc.category ?? null,
    description: clean(usage.description ?? doc.description),
    do: bp.filter(b => b.guidance).map(b => clean(b.description)),
    dont: bp.filter(b => !b.guidance).map(b => clean(b.description)),
    props: (doc.props ?? []).map(p => ({
      name: p.name,
      type: clean(p.type),
      description: clean(p.description),
      default: p.default,
      required: !!p.required,
    })),
    params: (doc.params ?? []).map(p => ({name: p.name, type: clean(p.type), description: clean(p.description)})),
    returns: doc.returns ? clean(doc.returns.description ?? doc.returns.type ?? '') : '',
    hidden: !!doc.isHiddenFromOverview || !!doc.hidden,
  };
  const prev = entries.get(name);
  const weight = e => e.description.length + e.props.length + e.do.length + e.dont.length;
  if (!prev || weight(next) > weight(prev)) entries.set(name, {...next, parent: next.parent ?? prev?.parent ?? null, category: next.category ?? prev?.category ?? null});
}

for (const file of docFiles) {
  const mod = await import(pathToFileURL(file).href);
  const doc = mod.docs;
  if (!doc) continue;
  const pkg = file.includes('/packages/charts/') ? '@solo/charts' : '@solo/core';
  const rel = path.relative(root, file);
  add(doc, {pkg, parent: null, file: rel});
  for (const c of doc.components ?? []) add(c, {pkg, parent: doc.name, file: rel});
}

const all = [...entries.values()];
const components = all.filter(e => !isHook(e.name)).sort((a, b) => a.name.localeCompare(b.name));
const hooks = all.filter(e => isHook(e.name)).sort((a, b) => a.name.localeCompare(b.name));
const topLevel = components.filter(c => !c.parent);
const childrenOf = name => components.filter(c => c.parent === name);
const categoryOf = c => c.category ?? (c.pkg === '@solo/charts' ? 'Charts' : 'Other');
const categories = [...new Set(topLevel.map(categoryOf))].sort();

const firstSentence = s => (/^(.+?[.!?])(\s|$)/.exec(s)?.[1] ?? s);

// ---------------------------------------------------------------------------
// llms.txt / llms-full.txt
// ---------------------------------------------------------------------------

const HEADER = `# Solo

> Solo is a React design system — accessible components, design tokens and charts — styled with Tailwind CSS v4, with first-class Arabic and right-to-left support. Components are imported from \`@solo/core\` (charts from \`@solo/charts\`).

Pick components by role, not by look: each entry says what the component is for and what to use instead when it is the wrong fit. Style with logical start/end utilities (\`ms-4\`, \`text-start\`), never left/right. See AGENTS.md for the full rules.
`;

let llms = HEADER + '\n';
llms += '- [Full catalog](llms-full.txt): purpose, do / don\'t, props and hooks for every component\n';
llms += '- [Agent guide](AGENTS.md): how to choose components, RTL rules, tokens, checks\n';
for (const cat of categories) {
  llms += `\n## ${cat}\n\n`;
  for (const c of topLevel.filter(c => categoryOf(c) === cat)) {
    llms += `- ${c.name}: ${firstSentence(c.description) || '(see llms-full.txt)'}\n`;
    // Parts are listed too: some (Section, TableRow…) are the right answer
    // on their own, and an agent that only reads the index must see them.
    for (const child of childrenOf(c.name)) {
      llms += `  - ${child.name}: ${firstSentence(child.description) || `part of ${c.name}`}\n`;
    }
  }
}

// Props every component shares; documented once in AGENTS.md.
const COMMON_PROPS = new Set(['className', 'style', 'ref', 'children']);
const clip = (text, max) => (text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text);

function propLine(p) {
  const bits = [`\`${p.name}${p.required ? '' : '?'}: ${clip(p.type, 90)}\``];
  if (p.default !== undefined) bits.push(`default ${clip(String(p.default), 30)}`);
  const desc = clip(firstSentence(p.description), 140);
  return `  - ${bits.join(', ')}${desc ? ` — ${desc}` : ''}`;
}

function componentBlock(c, depth) {
  const h = '#'.repeat(depth);
  let s = `${h} ${c.name}\n\n`;
  s += `Import: \`import {${c.name}} from '${c.pkg}';\`${c.parent ? ` · Part of ${c.parent}` : ''}\n\n`;
  if (c.description) s += `${c.description}\n\n`;
  if (c.do.length) s += `Do:\n${c.do.map(d => `- ${d}`).join('\n')}\n\n`;
  if (c.dont.length) s += `Don't:\n${c.dont.map(d => `- ${d}`).join('\n')}\n\n`;
  const props = c.props.filter(p => !COMMON_PROPS.has(p.name));
  if (props.length) s += `Props:\n${props.map(propLine).join('\n')}\n\n`;
  return s;
}

let full = HEADER + '\n';
for (const cat of categories) {
  full += `## ${cat}\n\n`;
  for (const c of topLevel.filter(c => categoryOf(c) === cat)) {
    full += componentBlock(c, 3);
    for (const child of childrenOf(c.name)) full += componentBlock(child, 4);
  }
}
const orphans = components.filter(c => c.parent && !entries.has(c.parent));
if (orphans.length) {
  full += '## Other parts\n\n';
  for (const c of orphans) full += componentBlock(c, 3);
}
full += '## Hooks\n\n';
for (const h of hooks) {
  full += `### ${h.name}\n\nImport: \`import {${h.name}} from '${h.pkg}';\`\n\n`;
  if (h.description) full += `${h.description}\n\n`;
  if (h.params.length) full += `Parameters:\n${h.params.map(p => `  - \`${p.name}: ${p.type}\`${p.description ? ` — ${p.description}` : ''}`).join('\n')}\n\n`;
  if (h.returns) full += `Returns: ${h.returns}\n\n`;
}

// ---------------------------------------------------------------------------
// AGENTS.md
// ---------------------------------------------------------------------------

const agents = `# Building with Solo — guide for AI coding agents

<!-- Generated by scripts/generate-agent-docs.mjs — do not edit by hand. -->

Solo is a React design system (${topLevel.length} components, ${hooks.length} hooks) styled with
Tailwind CSS v4, built for English and Arabic in one codebase. Read
[llms-full.txt](llms-full.txt) before choosing a component.

## Choosing a component

1. Describe what the UI element is **for**, then find the component whose
   purpose matches in [llms-full.txt](llms-full.txt). Names describe roles
   (\`AlertDialog\` confirms a destructive action, \`Toast\` reports a finished
   one), not looks.
2. Read its **Don't** list before writing code — that is where the docs say
   which sibling to use instead (e.g. Card → "use Section for page regions";
   Selector → "use Typeahead past ~20 options").
3. If nothing fits, compose from layout primitives (\`Stack\`, \`Grid\`,
   \`Section\`, \`Text\`, \`Heading\`) rather than restyling a component that
   was built for something else.

## Right-to-left (Arabic) is not optional

Every layout must mirror under \`dir="rtl"\`. A left/right style looks perfect
in the English screenshot and is broken in Arabic.

- Use logical utilities: \`ms-*\` / \`me-*\`, \`ps-*\` / \`pe-*\`, \`start-*\` /
  \`end-*\`, \`text-start\` / \`text-end\`, \`border-s\` / \`border-e\`,
  \`rounded-s\` / \`rounded-e\`. Never \`ml-*\`, \`mr-*\`, \`pl-*\`, \`pr-*\`,
  \`left-*\`, \`right-*\`, \`text-left\`, \`text-right\`.
- In inline styles use \`marginInlineStart\`, \`paddingInlineEnd\`,
  \`insetInlineStart\`, \`textAlign: 'start'\` — never \`marginLeft\`, \`left\`,
  \`textAlign: 'left'\`.
- Component props are logical too: placements and positions take \`start\` /
  \`end\` (e.g. \`<ChartAxis position="start" />\`).
- Enforce it: add \`@solo/eslint-plugin\` to the app's ESLint config —
  \`import solo from '@solo/eslint-plugin'; export default [solo.configs.recommended];\`
  — its \`logical-direction\` rule flags physical classes and inline styles and
  names the logical replacement.
- Icons that point a direction (chevrons, arrows) are mirrored by the
  components that own them; don't flip them yourself.

## Styling

- Every component also accepts \`className\`, \`style\` and \`ref\` (not
  repeated in the catalog). Pass \`className\` to adjust a component; classes merge with tailwind-merge,
  so a conflicting utility wins over the component default.
- Use the design tokens (CSS variables such as \`--color-text-secondary\`,
  \`--spacing-4\`) through Tailwind: \`text-(--color-text-secondary)\`. No raw
  colors, no literal font families — Arabic text switches to IBM Plex Sans
  Arabic through tokens.
- In inline styles and arbitrary values (\`style={{color: 'var(--…)'}}\`,
  \`bg-[var(--…)]\`) use only the runtime tokens defined in
  \`@solo/core/tokens.css\` (e.g. \`--color-background-orange\`,
  \`--color-text-secondary\`, \`--spacing-4\`). Names that exist only in the
  Tailwind theme (\`tailwind-theme.css\`, e.g. \`--color-orange-vivid\`) work
  in utility classes but resolve to nothing in a hand-written \`var()\`.
- Style variants with the \`data-*\` attributes components emit
  (\`[data-variant="primary"]\`), not with internal class names.

## Text and locales

- All user-facing text comes from props (\`label\`, \`description\`, …) — never
  hard-code English inside a component you build on top of Solo.
- Wrap the app in \`<InternationalizationProvider locale="ar-SA" dir="rtl">\`
  for Arabic; built-in strings (pagination, date pickers, …) are translated.

## Checks (in this repository)

\`\`\`
pnpm typecheck && pnpm test && pnpm docs:check
\`\`\`

\`docs:check\` includes \`rtl-physical-classes\`: physical classes and physical
inline styles fail the build.
`;

// ---------------------------------------------------------------------------
// @agentGuidance in each component's JSDoc
// ---------------------------------------------------------------------------

const MAX_DONTS = 4;

function wrap(text, width, first, rest) {
  const words = text.split(' ').map(w => (w.startsWith('@') ? `\`${w}\`` : w));
  const lines = [];
  let line = '';
  for (const w of words) {
    const prefix = lines.length ? rest : first;
    if (line && (prefix + line + ' ' + w).length > width) {
      lines.push(prefix + line);
      line = w;
    } else line = line ? `${line} ${w}` : w;
  }
  if (line) lines.push((lines.length ? rest : first) + line);
  return lines;
}

function guidanceLines(c) {
  const safe = s => s.replace(/\*\//g, '*\\/');
  const out = [' * @agentGuidance'];
  out.push(...wrap(safe(c.description), 80, ' * ', ' * '));
  const donts = c.dont.slice(0, MAX_DONTS);
  if (donts.length) {
    out.push(' *', " * Don't:");
    for (const d of donts) out.push(...wrap(safe(d), 80, ' * - ', ' *   '));
  }
  return out;
}

function findComponentSource(c) {
  const dir = path.dirname(P(c.file));
  const candidates = [path.join(dir, `${c.name}.tsx`), ...walk(dir, f => f.endsWith('.tsx') && !f.includes('.test.') && !f.includes('__tests__'))];
  const re = new RegExp(`^export function ${c.name}\\b[<(]`, 'm');
  return candidates.find(f => fs.existsSync(f) && re.test(fs.readFileSync(f, 'utf8')));
}

/** Insert or replace the @agentGuidance block in the JSDoc right above `export function Name`. */
function applyGuidance(source, name, block) {
  const lines = source.split('\n');
  const fnLine = lines.findIndex(l => new RegExp(`^export function ${name}\\b[<(]`).test(l));
  if (fnLine < 0) return source;
  let end = fnLine - 1;
  if (!/^\s*\*\/\s*$/.test(lines[end] ?? '')) {
    // No JSDoc yet: create one.
    lines.splice(fnLine, 0, '/**', ...block, ' */');
    return lines.join('\n');
  }
  let start = end;
  while (start > 0 && !/^\s*\/\*\*/.test(lines[start])) start--;
  // Remove an existing block (up to the next tag or the closing */). The
  // blank line before it stays, so re-generating is idempotent.
  const existing = lines.slice(start, end + 1).findIndex(l => /^\s*\* @agentGuidance\b/.test(l));
  if (existing >= 0) {
    const from = start + existing;
    let to = from + 1;
    while (to < end && !/^\s*\* @/.test(lines[to])) to++;
    lines.splice(from, to - from);
    end -= to - from;
  }
  // Insert before the first tag, or before the closing */.
  let at = start + 1;
  while (at < end && !/^\s*\* @/.test(lines[at])) at++;
  const prevIsBlank = at === start + 1 || /^\s*\*\s*$/.test(lines[at - 1]);
  const insert = [...(prevIsBlank ? [] : [' *']), ...block, ...(at < end ? [' *'] : [])];
  lines.splice(at, 0, ...insert);
  return lines.join('\n');
}

const sourceUpdates = new Map();
let missingSources = [];
for (const c of topLevel) {
  if (!c.description && !c.dont.length) continue;
  const file = findComponentSource(c);
  if (!file) {
    missingSources.push(c.name);
    continue;
  }
  const before = sourceUpdates.get(file) ?? fs.readFileSync(file, 'utf8');
  sourceUpdates.set(file, applyGuidance(before, c.name, guidanceLines(c)));
}

// ---------------------------------------------------------------------------
// Write or check
// ---------------------------------------------------------------------------

const outputs = new Map([
  [P('llms.txt'), llms],
  [P('llms-full.txt'), full],
  [P('AGENTS.md'), agents],
  ...sourceUpdates,
]);

const stale = [];
for (const [file, text] of outputs) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (current === text) continue;
  if (CHECK) stale.push(path.relative(root, file));
  else fs.writeFileSync(file, text);
}
if (CHECK) {
  if (stale.length) {
    console.error(`agent docs are stale (${stale.length} files) — run node scripts/generate-agent-docs.mjs\n  ${stale.slice(0, 10).join('\n  ')}`);
    process.exit(1);
  }
  console.log(`agent docs: ${topLevel.length} components, ${hooks.length} hooks, ${sourceUpdates.size} sources up to date`);
} else {
  console.log(`wrote llms.txt, llms-full.txt, AGENTS.md; @agentGuidance in ${sourceUpdates.size} sources (${topLevel.length} components, ${hooks.length} hooks)`);
  if (missingSources.length) console.log(`no \`export function\` source found for: ${missingSources.join(', ')}`);
}
