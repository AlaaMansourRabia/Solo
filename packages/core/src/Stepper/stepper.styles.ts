/**
 * @file stepper.styles.ts
 * @input None (Tailwind named group)
 * @output stepMarker — the group name applied to each Step's <li>
 * @position Shared group name consumed by Step for structural selectors
 *
 * Applied to each Step's root `<li>` so the on-track connector segments can
 * key their first/last-node visibility off `group-first/step:` /
 * `group-last/step:` — matching only the parent step row, never the
 * outer `<ol>`. This replaces counting children in the parent, so steps behave
 * correctly regardless of how the consumer groups them (arrays, fragments).
 */

export const stepMarker = 'group/step';
