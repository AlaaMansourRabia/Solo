/**
 * @file tailwindCss.ts
 * @input Uses @tailwindcss/node (the same compiler scripts/tw-explain.mjs uses)
 * @output Exports compileClasses, documentClasses, compiledRules test helpers
 * @position Shared test utility: turns the Tailwind classes a rendered element
 *   carries into real CSS rules, for the few tests that must assert a
 *   declaration rather than a class name (forced-colors, pressed state).
 *
 * Tests run in jsdom with no compiled stylesheet, so most style assertions
 * should simply use `toHaveClass(...)`. When a test genuinely needs the CSS a
 * class compiles to, these helpers compile ONLY the classes in play under the
 * library's preset (src/tailwind-preset.css) and parse the result with jsdom's
 * CSSOM, so rule text reads exactly as `document.styleSheets` used to.
 */

import path from 'node:path';
import {createRequire} from 'node:module';

const coreRoot = path.resolve(__dirname, '..', '..');
const requireFromCore = createRequire(path.join(coreRoot, 'package.json'));
const tailwindNodePath = requireFromCore.resolve('@tailwindcss/node', {
  paths: [
    path.dirname(requireFromCore.resolve('@tailwindcss/cli/package.json')),
  ],
});
const {compile} = (await import(tailwindNodePath)) as {
  compile: (
    css: string,
    opts: {base: string; onDependency: (path: string) => void},
  ) => Promise<{build: (candidates: string[]) => string}>;
};

const INPUT =
  '@import "./tailwind-preset.css";\n@import "tailwindcss/utilities.css" source(none);\n';

const compiler = await compile(INPUT, {
  base: path.join(coreRoot, 'src'),
  onDependency() {},
});

function classList(el: Element): string[] {
  const raw = el.getAttribute('class') ?? '';
  return raw.split(/\s+/).filter(Boolean);
}

/** Every class used by an element in the current document (or `root`). */
export function documentClasses(root: ParentNode = document): string[] {
  const out = new Set<string>();
  const scope = root as ParentNode & Partial<Element>;
  if (typeof scope.getAttribute === 'function') {
    classList(scope as Element).forEach(c => out.add(c));
  }
  root.querySelectorAll('[class]').forEach(el => {
    classList(el).forEach(c => out.add(c));
  });
  return [...out];
}

/**
 * Compiles `classes` to CSS text. The @property registrations and the
 * properties-layer fallback block Tailwind appends are dropped: they are
 * bookkeeping, not declarations a component makes.
 */
export function compileClasses(classes: readonly string[]): string {
  return compiler
    .build([...classes])
    .replace(/\/\*![^*]*\*\/\s*/, '')
    .replace(/@property [^{]+\{[^}]*\}\s*/g, '')
    .replace(/@layer properties\s*;\s*/g, '')
    .replace(/@layer properties\s*\{\s*@supports[\s\S]*$/, '')
    .trim();
}

function walk(list: CSSRuleList, visit: (rule: CSSRule) => void): void {
  for (const rule of Array.from(list)) {
    visit(rule);
    const nested = (rule as CSSGroupingRule).cssRules;
    if (nested != null) {
      walk(nested, visit);
    }
  }
}

/** The unescaped class a Tailwind utility selector starts with, if any. */
function leadingClass(selector: string): string | null {
  const match = /^\.((?:\\.|[\w-])+)/.exec(selector);
  return match == null ? null : match[1].replace(/\\(.)/g, '$1');
}

/**
 * Deletes (in place) every style rule whose leading class is not in `keep`,
 * and every grouping rule (`@media`, `@supports`, …) left empty by that.
 */
function pruneToClasses(list: CSSRuleList, keep: ReadonlySet<string>): void {
  for (let i = list.length - 1; i >= 0; i--) {
    const rule = list[i];
    let drop = false;
    if (rule instanceof CSSStyleRule) {
      const cls = leadingClass(rule.selectorText);
      drop = cls != null && !keep.has(cls);
    } else {
      const nested = (rule as CSSGroupingRule).cssRules;
      if (nested != null) {
        pruneToClasses(nested, keep);
        drop = nested.length === 0;
      }
    }
    if (drop) {
      const parent = rule.parentRule as CSSGroupingRule | null;
      if (parent != null) {
        parent.deleteRule(i);
      } else {
        rule.parentStyleSheet?.deleteRule(i);
      }
    }
  }
}

/**
 * Compiles `classes` and returns the top-level CSS rules as jsdom parsed them.
 * `visitNested` also yields the style rules nested in `@media` / `@supports`.
 */
export function compiledRules(
  classes: readonly string[],
  {visitNested = false}: {visitNested?: boolean} = {},
): CSSRule[] {
  const styleEl = document.createElement('style');
  styleEl.textContent = compileClasses(classes);
  document.head.appendChild(styleEl);
  try {
    const sheet = styleEl.sheet;
    if (sheet == null) {
      return [];
    }
    // The Tailwind compiler is incremental: `build()` returns CSS for every
    // candidate it has ever seen, so drop rules for classes not asked for.
    pruneToClasses(sheet.cssRules, new Set(classes));
    if (!visitNested) {
      return Array.from(sheet.cssRules);
    }
    const out: CSSRule[] = [];
    walk(sheet.cssRules, rule => out.push(rule));
    return out;
  } finally {
    styleEl.remove();
  }
}

/** The classes on one element. */
export function elementClasses(el: Element): string[] {
  return classList(el);
}
