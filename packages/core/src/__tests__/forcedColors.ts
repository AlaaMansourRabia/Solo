/**
 * @file forcedColors.ts
 * @input Uses the jsdom document and the Tailwind compiler (./tailwindCss)
 * @output Exports getForcedColorsRules, getAllInjectedCss test helpers
 * @position Shared test utility for asserting forced-colors style output
 *
 * jsdom cannot emulate `@media (forced-colors: active)` rendering, so
 * component tests assert the next-best thing: that the Tailwind classes the
 * rendered tree carries compile to the forced-colors rules a component relies
 * on for Windows High Contrast support (WCAG 1.4.11). Only the classes in the
 * current document are compiled, so the result reflects what is rendered.
 * Visual behavior needs manual verification in a forced-colors environment.
 */

import {compiledRules, documentClasses} from './tailwindCss';

/**
 * Collects the cssText of every compiled CSS rule scoped to
 * `@media (forced-colors: active)`, including rules nested in other
 * conditions. Returns one string for substring assertions.
 */
export function getForcedColorsRules(): string {
  return compiledRules(documentClasses())
    .map(rule => rule.cssText)
    .filter(text => text.includes('forced-colors: active'))
    .join('\n');
}

/**
 * Collects the cssText of every compiled CSS rule, regardless of condition.
 * Use to assert declarations that live OUTSIDE `@media (forced-colors: active)`
 * yet still exist for forced-colors support — e.g. `forced-color-adjust: none`
 * (an unconditional declaration) or a hover tint gated behind
 * `(forced-colors: none)` so it cannot override the forced-colors state.
 */
export function getAllInjectedCss(): string {
  return compiledRules(documentClasses())
    .map(rule => rule.cssText)
    .join('\n');
}
