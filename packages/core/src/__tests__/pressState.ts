/**
 * @file pressState.ts
 * @input Uses the Tailwind compiler (./tailwindCss) and jsdom's CSSOM
 * @output Exports rulesDeclaredFor and expectPressedArm test helpers
 * @position Shared test helper for asserting a control paints a pressed state
 *
 * jsdom does not compute `:active` (there is no real pointer), so a component
 * test asserts the next-best thing: that the element's own Tailwind classes
 * compile to a rule that paints the design system's pressed overlay token
 * while the control is pressed. The selector shape is deliberately not pinned
 * — a press may be read off the element itself (`.x:active`) or off an
 * ancestor group (`.x:is(:where(.group\/name):active *)`).
 *
 * SYNC: When modified, update this header.
 */

import {compiledRules, elementClasses} from './tailwindCss';

const PRESSED_TOKEN = '--color-overlay-pressed';

/**
 * Every compiled style rule (rules nested in `@media` included) for the
 * element's own classes, as `selector {declarations}` text.
 */
export function rulesDeclaredFor(el: Element): string[] {
  return compiledRules(elementClasses(el), {visitNested: true})
    .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
    .map(rule => `${rule.selectorText} {${rule.style.cssText}}`);
}

/**
 * The selector of a rule with the class name itself blanked out: Tailwind
 * class names carry their variants (`active:…`), so only the part after the
 * escaped class name is a real condition.
 */
function conditionOf(rule: string): string {
  const selector = rule.slice(0, rule.indexOf('{'));
  // Drop the leading escaped class name (`.foo\:bar\[x\]`).
  return selector.replace(/^\.(?:\\.|[\w-])+/, '');
}

/** The rules on `el` whose selector matches `pseudo` (e.g. `:active`). */
export function rulesWithSelector(el: Element, pseudo: string): string[] {
  return rulesDeclaredFor(el).filter(rule => conditionOf(rule).includes(pseudo));
}

/**
 * Does one of the element's own rules paint the pressed overlay token while
 * `pseudo` matches? `pseudo` defaults to `:active`, the arm a mouse press
 * takes.
 */
export function hasPressedArm(el: Element, pseudo = ':active'): boolean {
  return rulesWithSelector(el, pseudo).some(rule =>
    rule.includes(PRESSED_TOKEN),
  );
}

/**
 * Does one of the element's own classes paint the pressed overlay token
 * unconditionally — no pseudo-class, no ancestor group — because the component
 * applies the class while it holds the press itself (a dragged slider thumb)?
 */
export function declaresPressedOverlay(el: Element): boolean {
  return rulesDeclaredFor(el).some(
    rule => !conditionOf(rule).includes(':') && rule.includes(PRESSED_TOKEN),
  );
}
