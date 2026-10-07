/**
 * @file containerReveal.styles.ts
 * @input Uses theme tokens (Tailwind classes)
 * @output The container style that publishes the reveal state, the suspended
 *   and hover-delay container variants, and the four content style blocks
 *   (reveal / conceal, each with a layout-preserved variant) that read it.
 * @position Internal to useContainerReveal.
 *
 * HOW THE SCOPING WORKS: the container declares its own reveal state as
 * inherited custom properties on itself, and content reads them. Because a
 * nested container re-declares the same properties on itself, its subtree sees
 * the inner value and never the ancestor's — nesting isolation falls out of the
 * cascade, with one static style block for any number of containers.
 *
 * Every entry is a class string except `hoverDelay(delay)`, which returns an
 * inline style object (`{'--_hover-delay': delay}`) — inline style beats the
 * container's `[--_hover-delay:0s]` class.
 *
 * Variant chains used throughout (KEEP THEM IDENTICAL across blocks so `cn()`
 * — tailwind-merge — replaces a block's classes per property AND condition):
 *   hover  `can-hover:hover:usable:`  → @media (hover: hover) { :hover:where(:not(:disabled,[aria-disabled="true"])) }
 *   focus  `focus-within:`
 *   coarse `[@media(any-pointer:coarse)]:`
 * Generated order is default → focus-within → hover → coarse, so hover wins
 * over focus-within on ties (coarse has lower specificity).
 *
 * SYNC: When the block shape changes, update useContainerReveal.ts.
 */

import type {CSSProperties} from 'react';
import {cn} from '../utils/cn';

// The hover-intent gate (`--_hover-delay`): how long the pointer must dwell
// before the hover branch takes effect. Declared on every container so a
// nested one never inherits its ancestor's dwell. Rest delay is
// `0s, var(--duration-fast)`.

export const styles = {
  container: cn(
    '[--_hover-delay:0s]',
    '[--_reveal-opacity:0] can-hover:hover:usable:[--_reveal-opacity:1] focus-within:[--_reveal-opacity:1] [@media(any-pointer:coarse)]:[--_reveal-opacity:1]',
    '[--_reveal-position:absolute] can-hover:hover:usable:[--_reveal-position:static] focus-within:[--_reveal-position:static] [@media(any-pointer:coarse)]:[--_reveal-position:static]',
    '[--_reveal-delay:0s,_var(--duration-fast)] can-hover:hover:usable:[--_reveal-delay:var(--_hover-delay,_0s),_var(--_hover-delay,_0s)] focus-within:[--_reveal-delay:0s,_0s] [@media(any-pointer:coarse)]:[--_reveal-delay:0s,_0s]',
    '[--_reveal-delay-reduced:0s,_0s] can-hover:hover:usable:[--_reveal-delay-reduced:var(--_hover-delay,_0s),_var(--_hover-delay,_0s)] focus-within:[--_reveal-delay-reduced:0s,_0s] [@media(any-pointer:coarse)]:[--_reveal-delay-reduced:0s,_0s]',
    '[--_conceal-opacity:1] can-hover:hover:usable:[--_conceal-opacity:0]',
    '[--_fade-delay:0s] can-hover:hover:usable:[--_fade-delay:var(--_hover-delay,_0s)] focus-within:[--_fade-delay:0s] [@media(any-pointer:coarse)]:[--_fade-delay:0s]',
  ),
  // stateInactive is `container` with the hover branch pinned to its rest
  // value, so the pointer stops driving the reveal while a caller holds the
  // container inactive. Keyboard focus and coarse pointers keep their branches:
  // an inactive container must never hide content from a keyboard or touch
  // user. Every property repeats the full condition shape of `container` (same
  // variant chains) so `cn()` drops the container's class for each condition.
  stateInactive: cn(
    '[--_reveal-opacity:0] can-hover:hover:usable:[--_reveal-opacity:0] focus-within:[--_reveal-opacity:1] [@media(any-pointer:coarse)]:[--_reveal-opacity:1]',
    '[--_reveal-position:absolute] can-hover:hover:usable:[--_reveal-position:absolute] focus-within:[--_reveal-position:static] [@media(any-pointer:coarse)]:[--_reveal-position:static]',
    '[--_reveal-delay:0s,_var(--duration-fast)] can-hover:hover:usable:[--_reveal-delay:0s,_var(--duration-fast)] focus-within:[--_reveal-delay:0s,_0s] [@media(any-pointer:coarse)]:[--_reveal-delay:0s,_0s]',
    '[--_reveal-delay-reduced:0s,_0s] can-hover:hover:usable:[--_reveal-delay-reduced:0s,_0s] focus-within:[--_reveal-delay-reduced:0s,_0s] [@media(any-pointer:coarse)]:[--_reveal-delay-reduced:0s,_0s]',
    '[--_conceal-opacity:1] can-hover:hover:usable:[--_conceal-opacity:1]',
    '[--_fade-delay:0s] can-hover:hover:usable:[--_fade-delay:0s] focus-within:[--_fade-delay:0s] [@media(any-pointer:coarse)]:[--_fade-delay:0s]',
  ),
  // stateActive pins the other end: every branch reads as pointed-at, so
  // revealed content stays in and inverted content stays out, with no dwell to
  // wait through.
  stateActive: cn(
    '[--_reveal-opacity:1] can-hover:hover:usable:[--_reveal-opacity:1] focus-within:[--_reveal-opacity:1] [@media(any-pointer:coarse)]:[--_reveal-opacity:1]',
    '[--_reveal-position:static] can-hover:hover:usable:[--_reveal-position:static] focus-within:[--_reveal-position:static] [@media(any-pointer:coarse)]:[--_reveal-position:static]',
    '[--_reveal-delay:0s,_0s] can-hover:hover:usable:[--_reveal-delay:0s,_0s] focus-within:[--_reveal-delay:0s,_0s] [@media(any-pointer:coarse)]:[--_reveal-delay:0s,_0s]',
    '[--_reveal-delay-reduced:0s,_0s] can-hover:hover:usable:[--_reveal-delay-reduced:0s,_0s] focus-within:[--_reveal-delay-reduced:0s,_0s] [@media(any-pointer:coarse)]:[--_reveal-delay-reduced:0s,_0s]',
    '[--_conceal-opacity:0] can-hover:hover:usable:[--_conceal-opacity:0]',
    '[--_fade-delay:0s] can-hover:hover:usable:[--_fade-delay:0s] focus-within:[--_fade-delay:0s] [@media(any-pointer:coarse)]:[--_fade-delay:0s]',
  ),
  hoverDelay: (delay: string): CSSProperties =>
    ({'--_hover-delay': delay}) as CSSProperties,
  // The position flip is discrete, so it transitions with allow-discrete and
  // a state-conditional delay: the dwell on entry (flips into flow when the
  // gate opens, then fades in) and the fade duration on exit (stays in flow
  // until the fade finishes, then snaps out). Reduced motion drops the exit
  // sequencing but keeps the dwell: an intent gate is timing, not motion.
  // The fallbacks make content spread outside a reveal container fail visible
  // rather than invisible.
  reveal: cn(
    '[transition-property:opacity,position]',
    '[transition-duration:var(--duration-fast),_0s] motion-reduce:[transition-duration:0s,_0s]',
    '[transition-timing-function:var(--ease-standard)]',
    '[transition-behavior:allow-discrete]',
    '[transition-delay:var(--_reveal-delay,_0s,_0s)] motion-reduce:[transition-delay:var(--_reveal-delay-reduced,_0s,_0s)]',
    'opacity-[var(--_reveal-opacity,_1)] [position:var(--_reveal-position,_static)]',
  ),
  revealLayoutPreserved: cn(
    '[transition-property:opacity]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
    '[transition-delay:var(--_fade-delay,_0s)]',
    'opacity-[var(--_reveal-opacity,_1)]',
  ),
  // Conceal is a mouse-only visual swap: `--_conceal-opacity` reads hover
  // alone (no :focus-within, no coarse-pointer branch).
  conceal: cn(
    '[transition-property:opacity]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
    '[transition-delay:var(--_fade-delay,_0s)]',
    'opacity-[var(--_conceal-opacity,_1)]',
  ),
  concealLayoutPreserved: cn(
    '[transition-property:opacity]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
    '[transition-delay:var(--_fade-delay,_0s)]',
    'opacity-[var(--_conceal-opacity,_1)]',
  ),
  // Per-element overrides. These read no container state at all — they are the
  // caller saying what THIS element looks like, whatever the container is
  // doing, so they are plain values rather than custom properties. The
  // `motion-reduce:` arm shadows the reveal block's reduced-motion delay, so
  // the replacement holds per property.
  contentShown:
    'opacity-100 [position:static] [transition-delay:0s] motion-reduce:[transition-delay:0s]',
  // Hidden yields to focus: a forced-hidden element is still mounted and still
  // tabbable, so it has to reappear when focus lands inside it — otherwise a
  // keyboard user tabs into something they cannot see.
  contentHidden: cn(
    'opacity-0 focus-within:opacity-100',
    '[position:absolute] focus-within:[position:static]',
    '[transition-delay:0s] motion-reduce:[transition-delay:0s]',
  ),
  // Layout-preserved content has no discrete position to flip, so its hidden
  // variant is opacity alone.
  contentHiddenLayoutPreserved: cn(
    'opacity-0 focus-within:opacity-100',
    '[transition-delay:0s] motion-reduce:[transition-delay:0s]',
  ),
} as const;
