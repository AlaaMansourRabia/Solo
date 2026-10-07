/**
 * @file focusOutline.styles.ts
 * @input Uses theme color tokens
 * @output Exports shared focus-outline prop builders
 * @position Internal utility for consistent keyboard focus outlines across core components
 *
 * Centralizes the standard Solo focus outline, shown only for keyboard focus.
 * Every focusable surface drew the same 2px accent ring already; writing it per
 * component meant dozens of identical definitions to keep in step, and they did
 * not stay in step — offsets drifted and one ring was a border-width thick.
 *
 * Every ring in core and lab is drawn from here, with one exception recorded in
 * Switch: its condition is a component-scoped ancestor marker, which cannot be
 * shared without leaking focus state between components. A component may still
 * override the OFFSET (a ring that must sit inset, or clear of a field border);
 * width, style and color are not restated anywhere.
 *
 * Every value comes from the `--focus-outline-*` tokens, which is how a theme
 * restyles the ring: one override reaches every component at once. The
 * `:focus-visible` condition is not themeable and stays here, so a theme can
 * change what the ring looks like but cannot show it to pointer users.
 */

import {focusVars} from '../theme/tokenVars';

const FOCUS_OUTLINE_WIDTH = focusVars['--focus-outline-width'];
const FOCUS_OUTLINE_STYLE = focusVars['--focus-outline-style'];
const FOCUS_OUTLINE_COLOR = focusVars['--focus-outline-color'];

const FOCUS_OUTLINE_OFFSET = focusVars['--focus-outline-offset'];

/**
 * The ring as a single `outline` value, for reading it at runtime — an
 * assertion, or an element styled imperatively.
 *
 * A component whose condition {@link focusOutlineStyles} cannot express
 * (Switch, whose ring keys off a component-scoped ancestor marker) composes
 * the `--focus-outline-*` tokens itself with its own variant.
 */
export const FOCUS_OUTLINE = `${FOCUS_OUTLINE_WIDTH} ${FOCUS_OUTLINE_STYLE} ${FOCUS_OUTLINE_COLOR}`;

/**
 * Written as longhands rather than the `outline` shorthand.
 *
 * A shorthand resets every longhand it covers, so `outline: 2px solid accent`
 * would clobber a later `outlineColor` no matter the order — which is how
 * destructive buttons silently lost their red ring. With longhands, a variant
 * can re-color the ring and inherit width, style and offset.
 */
const focusOutlineLonghands = {
  outlineWidth: FOCUS_OUTLINE_WIDTH,
  outlineStyle: FOCUS_OUTLINE_STYLE,
  outlineColor: FOCUS_OUTLINE_COLOR,
} as const;

/**
 * The standard focus ring as plain CSS values, for the one case that has to
 * apply it imperatively: a control whose focusable input is visually hidden and
 * whose ring must land on a *themeable indicator* beside it (see
 * `useIndicatorFocusRing`). Everything else should use the styles above.
 *
 * Longhands, not the `outline` shorthand, for the same reason the styles are:
 * a shorthand resets every longhand it covers, so a caller could not re-color
 * the ring without restating its width and style. Split, each part is
 * independently overridable — and every part stays a var, so a theme's
 * `--focus-outline-*` overrides still flow through.
 *
 * Keys are camelCase to match `HTMLElement.style`, so this spreads straight
 * onto an element:
 *
 * ```ts
 * Object.assign(el.style, FOCUS_OUTLINE_PARTS);        // draw
 * Object.assign(el.style, FOCUS_OUTLINE_PARTS_NONE);   // clear
 * ```
 */
export const FOCUS_OUTLINE_PARTS = {
  outlineWidth: FOCUS_OUTLINE_WIDTH,
  outlineStyle: FOCUS_OUTLINE_STYLE,
  outlineColor: FOCUS_OUTLINE_COLOR,
  outlineOffset: FOCUS_OUTLINE_OFFSET,
} as const;

/** Clears {@link FOCUS_OUTLINE_PARTS}, one key per part so nothing lingers. */
export const FOCUS_OUTLINE_PARTS_NONE = {
  outlineWidth: '',
  outlineStyle: '',
  outlineColor: '',
  outlineOffset: '',
} as const;

/**
 * Focus ring class sets. Compose with `cn(focusOutlineStyles.focusVisible, …)`
 * — later classes override earlier ones, so a component can re-color the ring
 * (`focus-visible:[outline-color:var(--color-error)]`) or move its offset.
 *
 * Longhands only, never the `outline` shorthand (see above).
 */
export const focusOutlineStyles = {
  focusVisible: [
    '[outline-width:0] [outline-style:none] [outline-offset:0]',
    'focus-visible:[outline-width:var(--focus-outline-width)]',
    'focus-visible:[outline-style:var(--focus-outline-style)]',
    'focus-visible:[outline-color:var(--focus-outline-color)]',
    'focus-visible:[outline-offset:var(--focus-outline-offset)]',
  ].join(' '),
  focusWithin: [
    '[outline-width:0] [outline-style:none] [outline-offset:0]',
    'has-[:focus-visible]:[outline-width:var(--focus-outline-width)]',
    'has-[:focus-visible]:[outline-style:var(--focus-outline-style)]',
    'has-[:focus-visible]:[outline-color:var(--focus-outline-color)]',
    'has-[:focus-visible]:[outline-offset:var(--focus-outline-offset)]',
  ].join(' '),
  /**
   * Like {@link focusOutlineStyles.focusWithin}, but only for the element's
   * FIRST child — for a wrapper that paints the ring on behalf of one primary
   * control while its siblings ring themselves. Pair it with
   * {@link focusOutlineStyles.suppressed} on the primary.
   */
  focusWithinFirstChild: [
    '[outline-width:0] [outline-style:none] [outline-offset:0]',
    'has-[>:first-child:focus-visible]:[outline-width:var(--focus-outline-width)]',
    'has-[>:first-child:focus-visible]:[outline-style:var(--focus-outline-style)]',
    'has-[>:first-child:focus-visible]:[outline-color:var(--focus-outline-color)]',
    'has-[>:first-child:focus-visible]:[outline-offset:var(--focus-outline-offset)]',
  ].join(' '),
  /**
   * Draws no ring, and keeps the UA's own off — for an element whose ring an
   * ancestor paints.
   */
  suppressed: '[outline-width:0] [outline-style:none] [outline-offset:0]',
  publishFocusVisibleVars: [
    '[--_focus-outline:none] [--_focus-outline-offset:0]',
    'focus-visible:[--_focus-outline:var(--focus-outline-width)_var(--focus-outline-style)_var(--focus-outline-color)]',
    'focus-visible:[--_focus-outline-offset:var(--focus-outline-offset)]',
  ].join(' '),
  focusWithinOrPublished: [
    '[outline:var(--_focus-outline,none)] [outline-offset:var(--_focus-outline-offset,0)]',
    'has-[:focus-visible]:[outline:var(--focus-outline-width)_var(--focus-outline-style)_var(--focus-outline-color)]',
    'has-[:focus-visible]:[outline-offset:var(--focus-outline-offset)]',
  ].join(' '),
} as const;
