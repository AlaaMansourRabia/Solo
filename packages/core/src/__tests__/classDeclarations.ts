/**
 * @file classDeclarations.ts
 * @input Uses the Tailwind compiler (./tailwindCss) and jsdom's CSSOM
 * @output declaredValue — the CSS value a rendered element's classes actually
 *   declare for a property
 * @position Shared test helper; imported by component tests that need to prove
 *   a style prop reached the element. Prefer `toHaveClass` in new tests.
 *
 * The element's Tailwind classes are compiled under the library preset and
 * parsed by jsdom; asserting on the declaration a class carries — rather than
 * on the class name itself — keeps an assertion stable across equivalent
 * spellings (`opacity-50` vs `[opacity:0.5]`).
 *
 * Only unconditional rules count: a rule whose selector does not match the
 * element as rendered (`:hover`, `:focus-visible`, …) or that sits inside a
 * media/supports block is ignored. Later rules win, matching the cascade for
 * equal-specificity utilities.
 *
 * SYNC: When modified, update this header.
 */

import {compiledRules, elementClasses} from './tailwindCss';

/**
 * Read back the value the element's classes declare for `property`.
 *
 * @param el Rendered element to inspect.
 * @param property CSS property name, e.g. `'opacity'` or `'width'`.
 * @returns The declared value, or `null` when no class on the element declares
 *   the property.
 */
export function declaredValue(el: Element, property: string): string | null {
  let value: string | null = null;
  for (const rule of compiledRules(elementClasses(el))) {
    if (!(rule instanceof CSSStyleRule)) {
      continue;
    }
    let matches = false;
    try {
      matches = el.matches(rule.selectorText);
    } catch {
      matches = false;
    }
    if (!matches) {
      continue;
    }
    const declared = rule.style.getPropertyValue(property);
    if (declared !== '') {
      value = declared;
    }
  }
  return value;
}
