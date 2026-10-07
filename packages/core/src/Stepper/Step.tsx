'use client';

/**
 * @file Step.tsx
 * @input Uses React, Tailwind classes, theme tokens (including the motion duration token
 *   the connector fill animates on), StepperContext, and per-step theme selector
 *   state
 * @output Exports Step component and StepProps
 * @position Individual step item; used inside Stepper
 *
 * Every connector this file draws — the separated progress bars and the
 * on-track segments alike — paints its accent fill as a scaled ::before rather
 * than by swapping a background color, so a step the flow advances into grows
 * its line along the track. See the CONNECTOR FILL block in the styles below
 * for the axis/RTL/reduced-motion rules that go with it.
 *
 * Exactly one change animates: advancing a single step. Going back, jumping
 * forward by more than one, and mounting mid-flow all land at once. The rule
 * and the reasoning behind it sit above the styles; the arithmetic that keeps
 * the one animated span reading as a single front — an on-track span is drawn
 * by two steps, three where a content slot splits it — is in the component.
 * Nothing about it is public API: Stepper hands each Step the step it came
 * from through context, and the rest is derived. In a compact horizontal
 * Stepper, each track node is presentational rather than clickable; navigation
 * moves to the named previous/next controls in the summary row. The on-track
 * layout keeps each indicator on the rail and does not repeat the active one
 * beside the summary label. Each public content slot stays mounted and is
 * hidden to preserve local state.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Stepper/Stepper.doc.mjs
 * - /packages/core/src/Stepper/Stepper.test.tsx
 * - /packages/core/src/Stepper/index.ts
 * - /apps/storybook/stories/Stepper.stories.tsx
 */

import {useLayoutEffect, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {cn} from '../utils/cn';

import {colorVars, spacingVars, durationVars} from '../theme/tokenVars';
import {
  focusOutlineStyles,
  mergeProps,
  isRenderable,
  themeProps,
} from '../utils';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';
import type {BaseProps} from '../BaseProps';
import {Icon} from '../Icon';
import {VisuallyHidden} from '../VisuallyHidden';
import {useTranslator} from '../i18n';
import {useStepperInternalContext} from './StepperContext';
import {stepMarker} from './stepper.styles';
import type {StepStatus} from './StepStatus';

/**
 * Built-in indicator presets. Anything other than these strings passed to
 * `indicator` is treated as a custom ReactNode (e.g. an `<Icon />`).
 * - 'auto': numbered badge for not-yet-reached steps, a check once completed
 *   (default)
 * - 'number': always a numbered badge
 * - 'none': no indicator — just the progress bar and label
 */
export type StepIndicatorPreset = 'auto' | 'number' | 'none';
export type StepDensity = 'compact' | 'balanced' | 'spacious';

export interface StepProps extends BaseProps<HTMLLIElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLLIElement>;
  /**
   * Zero-based index of this step. Used to derive progress (completed /
   * active / not-started) relative to the parent's `activeStep`.
   */
  step: number;
  /**
   * Step label text.
   */
  label: string;
  /**
   * Optional description shown below the label.
   */
  description?: string;
  /**
   * Content rendered below the label and description. Useful in vertical
   * steppers to show form fields or detailed content for each step. Compact
   * horizontal steppers hide it without unmounting it, preserving local state.
   */
  children?: ReactNode;

  /**
   * Semantic status for the step, mapped to the global Solo semantic tokens
   * (`accent`, `success`, `warning`, `error`). In the default `auto` indicator
   * mode it sets both the indicator color and a matching glyph: `success` shows
   * a green check-circle, `warning`/`error` show the shared Input status icons.
   * `accent` is color-only. The current (in-progress) step always keeps its
   * current-step indicator regardless of `status`. Never recolors the
   * connector/track.
   *
   * Because the indicator glyphs are decorative (aria-hidden), the status also
   * reaches assistive technology as text: visually hidden "completed" /
   * "warning" / "error" next to the label, and composed into the accessible
   * name of clickable steps.
   */
  status?: StepStatus;
  /**
   * Disable interaction for this step.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Marks the step as optional, appending an "Optional" affordance after the
   * label.
   * @default false
   */
  isOptional?: boolean;
  /**
   * Trailing content rendered at the end of the label row (e.g. a timestamp
   * or status chip).
   */
  endContent?: ReactNode;
  /**
   * What to show as the step indicator. Accepts a preset string or any
   * ReactNode:
   * - 'auto': numbered badge until completed, then a check (default)
   * - 'number': always a numbered badge
   * - 'none': no indicator, just the bar + label
   * - ReactNode: any custom icon or element to render as the indicator
   * @default 'auto'
   */
  indicator?: StepIndicatorPreset | ReactNode;
  /**
   * Controls vertical padding of the step. Falls back to the stepper-level
   * density when unset.
   * - 'compact': minimal padding (4px block)
   * - 'balanced': default (8px block)
   * - 'spacious': generous (12px block, 12px inline)
   */
  density?: StepDensity;
}

// --- Default progress icons (16px) ---
//
// The `completed` progress state and the current-step ring are drawn as local
// <svg> glyphs rather than sourced from the Icon registry. This is a deliberate
// exception to the "glyphs come from the registry" convention (audit rule T17),
// for two reasons:
//
//  1. `CurrentIcon` (a dot inside a ring) has no registry equivalent — it is a
//     progress affordance, not a general-purpose icon.
//  2. `CheckCircleIcon` (a filled circle with a check) is intentionally NOT the
//     registry `success` glyph, even though the two look similar. They mean
//     different things and must stay independently restyleable: `completed`
//     marks *progress through the sequence* (every step you've passed), while
//     the semantic `success` status marks a step's *outcome*. A stepper can
//     show a completed step that also carries a `warning`/`error` status, so
//     collapsing the two glyphs would conflate progress with outcome. The
//     semantic `success`/`warning`/`error` STATUS glyphs DO defer to the themed
//     registry (see the status branch below), so those share one visual
//     language; only the progress marks are local.
//
// Both glyphs paint via `currentColor`, so the indicator's color is still
// controlled by tokens on the wrapper (never hardcoded), and the wrapper
// carries the `solo-step-indicator` theme target.

/** Filled circle with a check — shown for a completed step in 'auto' mode. */
function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path
        d="M4.75 8.25 7 10.5l4.25-4.5"
        stroke={colorVars['--color-background-surface']}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Filled dot in a ring — shown for the active step in 'auto' mode. */
function CurrentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="8" r="4" fill="currentColor" />
    </svg>
  );
}

// --- Styles ---

const BAR_WIDTH = spacingVars['--spacing-1'];

/**
 * How much of itself a connector gives up where it meets the indicator, read
 * from the public `--step-connector-gap` declared on the Stepper root.
 *
 * Clipped, not padded. The gap has to apply to two layers — the track, which is
 * the segment's own background, and the accent fill, which is an absolutely
 * placed `::before`. Spending it on each separately meant two declarations on
 * two boxes: a percentage then resolved against a different containing block
 * for each and stopped them ~1.2px apart. `clip-path` is ONE declaration on the
 * segment that clips the element and its pseudo-element together, against one
 * reference box — so every accepted value behaves the same way on both layers,
 * which is what a public input owes its full value domain.
 *
 * Clipping also cannot change layout: the segment keeps its box, so the node it
 * positions cannot move and the Stepper cannot grow. A raw `1rem` padding grew
 * a 180px stepper to 240px.
 *
 * Still clamped, because the value arrives with nothing in between to reject
 * it. Both halves earn their place, and not for the reasons padding needed:
 *
 * - `max(0px, …)` — `inset()` ACCEPTS a negative length. Chromium computes
 *   `inset(0 0 -4px 0)` as-is rather than dropping it, which is the opposite
 *   of padding (there CSS clamps a negative to `0` for you). This normalises
 *   it to `0` so a negative gap means "no gap" rather than a clip rect
 *   stretched outside the segment's own box.
 * - `min(…, --spacing-2)` — the flexible segment's own `min-height`, so an
 *   oversized gap leaves a short track rather than an unbounded one.
 *
 * The Stepper root explicitly inherits the property, so a horizontal Stepper
 * can receive a consumer value (or its 0px default) from the styled frame while
 * a theme can still set the property directly on the `stepper` target. The
 * use-site fallback supplies the same default to an unframed vertical Stepper.
 */
const CONNECTOR_GAP = `max(0px, min(var(--step-connector-gap, 0px), ${spacingVars['--spacing-2']}))`;

// Every indicator — check, ring, custom icon, number badge — occupies the same
// box, so the `auto` mode swapping a number for a check as a step completes
// never nudges the label or the track.
const INDICATOR_SIZE = spacingVars['--spacing-4'];
// Indicator (16px) + the label-row gap (8px). The indent that lines a
// description or a content slot up with the label above it.
const INDICATOR_GUTTER = spacingVars['--spacing-6'];

// --- Connector fill motion ---
//
// One change animates: advancing exactly one step. Going back, jumping
// forward by more than one, and mounting mid-flow all apply at once.
//
// Animating the others was tried and read worse than not animating them. A
// retreat is the clearest case: run forward, the transition ends with a bar
// that is nearly full, and nearly full is indistinguishable from full, so the
// eye calls it arrived well before it settles. Run backward, the same curve
// ends with a shrinking stub of accent still on the track, and a remnant that
// is still there reads unmistakably as not finished. Identical arithmetic in
// both directions — measurably so — and the backward one still feels slow,
// because the tail is what is visible rather than what is hidden. No easing
// fixes that; only not animating it does. A multi-step jump fails differently:
// it is a navigation rather than a progression, and sweeping a front across
// four segments makes the user sit through a journey they asked to skip.
//
// What is left is the one gesture where the movement carries the meaning: the
// flow went forward one step, and the line grows to show it. That span takes
// the medium band — a fill crossing a whole segment is a spatial change, not a
// micro-interaction, so per the motion guidance it sits above the fast band
// reserved for high-frequency states like hover.
const FILL_SPAN_TIME = durationVars['--duration-medium'];

// Share of one node-to-node span owned by the segment *arriving* at the far
// node; the segment leaving the near node takes the rest. On-track spans are
// drawn by two steps (see the ON-TRACK section), and the time has to be split
// the way the length is or the two halves sweep at visibly different speeds.
//
// Horizontal: both halves are `flex: 1` inside equal-width steps, so an even
// split is the proportional one.
//
// Vertical: the halves are nothing like equal, and no constant can be right
// for all of them. The arriving half is otSegLeadV, a cap fixed at one density
// space; the leaving half is otSegFlexV, grown to whatever is left of the step
// row, so its length turns on label and description lengths this file cannot
// see. Measured in the browser the cap is 40% of a plain balanced span (8 of
// 20px) but 21% once the step carries a description (8 of 38px). 0.3 is the
// value that minimises the worse of those two: it leaves the cap ~1.6x off the
// rail's speed either way, where tuning to one case puts the other past 2x.
// Matching each case exactly would mean measuring the rendered rail, a layout
// read this system avoids.
const OT_ARRIVAL_SHARE_H = 0.5;
const OT_ARRIVAL_SHARE_V = 0.3;
// A vertical step carrying a content slot draws a third segment down the side
// of it (otContentSegV) which continues the leaving half past the row, so the
// leaving half's time splits again. A slot runs several times the rail left
// above it — 34px of rail to 108px of slot in the spacious content story — and
// this is the middle of that range. Matching it exactly would mean measuring
// the rendered slot; the ordering is what keeps the front contiguous, and this
// keeps its speed in the right neighbourhood.
const OT_RAIL_SHARE_OF_LEAVING = 0.25;

/** Scale a CSS `<time>` by a unitless factor, collapsing the trivial cases. */
function fillTimeSlice(time: string, factor: number): string {
  if (factor <= 0) {
    return '0s';
  }
  if (factor === 1) {
    return time;
  }
  // Rounded because the factors are sums of shares, and float noise would
  // otherwise reach the emitted custom property as `calc(... * 0.7000000001)`.
  return `calc(${time} * ${Number(factor.toFixed(4))})`;
}

/** Class string, or a dynamic style's `{className, style}` pair. */
type StylePart =
  | string
  | false
  | null
  | undefined
  | {className: string; style?: React.CSSProperties};

/**
 * Composes static class strings and dynamic `{className, style}` pairs — the
 * local counterpart of `sx()` for this file's dynamic styles. Later
 * classes win per property (via `cn`), and dynamic custom properties merge.
 */
function sx(...parts: StylePart[]): {
  className: string;
  style?: React.CSSProperties;
} {
  const classes: string[] = [];
  let style: React.CSSProperties | undefined;
  for (const part of parts) {
    if (!part) {
      continue;
    }
    if (typeof part === 'string') {
      classes.push(part);
    } else {
      classes.push(part.className);
      if (part.style) {
        style = {...style, ...part.style};
      }
    }
  }
  return {className: cn(classes), style};
}

/** A dynamic value routed through a scoped custom property. */
function dyn(className: string, vars: Record<string, string>) {
  return {className, style: vars as React.CSSProperties};
}

const TRANSITION_FAST_MIN = cn(
  '[transition-property:background-color]',
  '[transition-duration:var(--duration-fast-min)] motion-reduce:[transition-duration:0s]',
  '[transition-timing-function:var(--ease-standard)]',
);

const CURSOR = cn(
  'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
);

const styles = {
  // ===================== VERTICAL LAYOUT =====================
  verticalRoot: 'flex flex-row items-stretch relative gap-(--spacing-0-5)',

  // 4px progress bar segment. Its filled/unfilled paint comes from the shared
  // connector styles below, not from here.
  verticalBar: 'w-(--spacing-1) rounded-(--radius-full) shrink-0 self-stretch',

  // Step body — the selectable area
  verticalBody: 'flex flex-col flex-1',

  // ===================== HORIZONTAL LAYOUT =====================
  horizontalStep: cn(
    'flex flex-col',
    // Stretch, not flex-start: a flex-start child is sized to fit-content,
    // which is floored at its own min-content and would spill the label past
    // the step's slice of the track and into the next step. Stretched, the
    // label row is exactly as wide as the step and the label ellipsizes
    // inside it.
    'items-stretch flex-1',
    // `flex: 1` alone does not make the steps equal: a flex item's default
    // `min-width: auto` floors it at its own min-content width, so a step
    // labelled "Integrations" claims a wider slice of the track than one
    // labelled "Team". Zeroing the floor lets the even distribution actually
    // apply, which is what keeps every progress segment the same width.
    'min-w-0',
    // density padding applied via density styles below
  ),

  // Full-width progress bar segment sitting above each horizontal step.
  // Each step owns its own segment (filled from its derived progress) so the
  // parent never has to introspect children to build the bar.
  horizontalBar:
    'w-full h-(--spacing-1) rounded-(--radius-full) shrink-0 mbe-(--spacing-0-5)',

  // ===================== CONNECTOR FILL =====================
  // Shared by every connector the four layout combinations draw: the separated
  // bars (verticalBar, horizontalBar) and the on-track segments (otSegBaseV,
  // otSegH, otContentSegV).
  //
  // The segment element is the *unfilled* track and never changes color; the
  // accent fill is a ::before scaled along the track axis. Advancing a step
  // grows it out of the segment's leading edge, so the line reads as progress
  // travelling rather than a bar changing state. The obvious alternative,
  // transitioning `background-color` between accent and border on the segment
  // itself, lights the whole segment at once: a flash, with no direction in
  // it. Going the other way the scale still returns to zero, but instantly —
  // only a single step forward is given a duration to cross (see the motion
  // block above).
  //
  // A pseudo-element rather than a real child element, because the connector is
  // emitted from seven places and several of them size themselves in ways a
  // child would have to re-derive (otSegFlexV grows, otSegLeadV is fixed,
  // otContentSegV is absolutely positioned). ::before inherits the box for
  // free, so one style covers all of them.
  //
  // Mount is deliberately not animated, and falls out of how transitions work:
  // interpolation needs a previous computed value and a freshly rendered
  // element has none. A stepper that opens on step 3 paints the segments behind
  // it filled, instantly, instead of playing its whole history back.
  connectorTrack: cn(
    'relative bg-(--color-border)',
    "before:content-[''] before:absolute before:inset-0",
    // Follows whatever the segment itself rounds to: the full pill of a
    // separated bar, the square ends the on-track segments need in order to
    // stack into one continuous line.
    'before:[border-radius:inherit]',
    'before:bg-(--color-accent)',
    'before:[transition-property:transform]',
    // Resting duration, for a segment moving on its own. connectorTiming
    // below replaces it on every connector — each one is handed either its
    // slice of the animated span or a zero — so this is the fallback that
    // applies if a connector is ever rendered without it.
    'before:[transition-duration:var(--duration-medium)]',
    'motion-reduce:before:[transition-duration:0s]',
    // Linear, deliberately, and not the `--ease-standard` the rest of the
    // system transitions on. A node-to-node span is not always one element:
    // in the on-track layouts the segment leaving one node and the segment
    // arriving at the next draw it between them, and a vertical step with a
    // content slot splits it three ways. A curve applied per segment
    // restarts its deceleration at every seam, so the front lurches, stalls
    // at the joint, and the joint becomes the most visible thing in the
    // animation — the fill stops reading as one line growing and starts
    // reading as two pieces taking turns. Linear is the only timing that
    // stitches into a single constant-speed front. The separated bars run
    // linear too: a lone segment gives up very little by it, and the two
    // layouts should not animate with different character.
    'before:[transition-timing-function:linear]',
  ),
  // This segment's slice of the animated span, or a pair of zeros for a
  // segment that is not part of it (see the motion block above the styles).
  // Dynamic because which segments animate, and over what part of the span,
  // depends on where the active step just moved from — known only at render.
  // The values are routed through custom properties, so these are still
  // generated rules and not inline transition styles.
  //
  // Restates the reduced-motion escape connectorTrack declares, with the same
  // variant chain, so `cn()` drops connectorTrack's pair (a redefined
  // property is replaced wholesale, conditions included). Without it a
  // reduced-motion user would get an on-track span as two instant snaps spaced
  // apart by the delay — motion smuggled back in as timing. Zeroing the delay
  // alongside the duration lands the whole span at once instead.
  connectorTiming: (duration: string, delay: string) =>
    dyn(
      cn(
        'before:[transition-duration:var(--_step-fill-duration)]',
        'motion-reduce:before:[transition-duration:0s]',
        'before:[transition-delay:var(--_step-fill-delay)]',
        'motion-reduce:before:[transition-delay:0s]',
      ),
      {'--_step-fill-duration': duration, '--_step-fill-delay': delay},
    ),
  // Vertical track: progress runs down the block axis under both LTR and RTL
  // (direction only mirrors the inline axis), so the growth anchors at the
  // physical top either way.
  connectorFillV:
    'before:[transform-origin:center_top] before:[transform:scaleY(1)]',
  connectorEmptyV:
    'before:[transform-origin:center_top] before:[transform:scaleY(0)]',
  // Horizontal track: progress runs along the reading direction, so the growth
  // anchors at the inline-start edge — physically left in LTR, right in RTL.
  // `transform-origin` accepts no logical keywords, so the flip is spelled out
  // with the same `:is([dir="rtl"] *)` hook Switch's thumb travel and the
  // shared rtlStyles.mirror use. Stated on both states rather than hoisted onto
  // connectorTrack, which is axis-agnostic and shared with the vertical
  // segments.
  connectorFillH: cn(
    'before:[transform-origin:left_center]',
    '[&:is([dir=rtl]_*)]:before:[transform-origin:right_center]',
    'before:[transform:scaleX(1)]',
  ),
  connectorEmptyH: cn(
    'before:[transform-origin:left_center]',
    '[&:is([dir=rtl]_*)]:before:[transform-origin:right_center]',
    'before:[transform:scaleX(0)]',
  ),

  // ===================== SHARED =====================

  // Icon + Label in one row
  iconLabelRow: cn(
    'flex flex-row items-center gap-(--spacing-2)',
    // The row is a flex item wherever a step stacks it under a bar, so it
    // needs the floor released too — otherwise it holds itself open at the
    // label's min-content width and the label never reaches its ellipsis.
    'min-w-0',
  ),

  // Indicator icon container
  icon: 'flex items-center justify-center w-(--spacing-4) h-(--spacing-4) shrink-0',
  iconCompleted: 'text-(--color-accent)',
  iconInProgress: 'text-(--color-accent)',
  iconNotStarted: 'text-(--color-icon-secondary)',
  iconDisabled: 'text-(--color-icon-disabled) opacity-50',
  // Semantic status overrides for the icon — color only.
  iconAccent: 'text-(--color-accent)',
  iconSuccess: 'text-(--color-success)',
  iconWarning: 'text-(--color-warning)',
  iconError: 'text-(--color-error)',

  // Number badge — same box as every other indicator (see INDICATOR_SIZE).
  numberBadge: cn(
    'grid place-items-center w-(--spacing-4) h-(--spacing-4) rounded-(--radius-full)',
    // The digit has to read at the same optical weight as the check glyph it
    // alternates with inside a 16px circle, which the supporting size (12px)
    // overfills — it leaves no room for a two-digit step. This is the scale
    // step below it, still a token so themes rescale it. The digit is centered
    // by the grid (placeItems), so no explicit line-height is needed — this
    // matches how Avatar/AvatarGroup center a single glyph in a circle.
    'text-(length:--font-size-xs) font-(number:--font-weight-semibold)',
    'shrink-0 text-center',
  ),
  numberCompleted: 'bg-(--color-accent) text-(--color-background-surface)',
  numberInProgress: 'bg-(--color-accent) text-(--color-background-surface)',
  numberNotStarted: 'bg-(--color-background-muted) text-(--color-text-secondary)',
  numberDisabled:
    'bg-(--color-background-muted) text-(--color-text-disabled) opacity-50',
  // Semantic status overrides for the number badge — color only.
  numberAccent: 'bg-(--color-accent) text-(--color-on-accent)',
  numberSuccess: 'bg-(--color-success) text-(--color-on-success)',
  numberWarning: 'bg-(--color-warning) text-(--color-on-warning)',
  numberError: 'bg-(--color-error) text-(--color-on-error)',

  // Label
  label: cn(
    'text-(length:--text-body-size) leading-(--text-body-leading)',
    'font-(number:--font-weight-normal) text-(--color-text-primary)',
    // Horizontal steps divide the track evenly, so a label can end up with
    // less room than it wants. It stays on one line and ellipsizes rather than
    // wrapping, so every step in a row keeps the same height and the track
    // below them stays straight. minWidth releases the flex floor that would
    // otherwise hold the label at its min-content width and let it overlap the
    // neighbouring step. Inert wherever there is room, which is most vertical
    // steppers. The full string stays in the accessible name either way.
    'min-w-0 whitespace-nowrap overflow-hidden text-ellipsis',
  ),
  labelInProgress: 'font-(number:--font-weight-semibold)',
  labelNotStarted: 'text-(--color-text-secondary)',
  labelDisabled: 'text-(--color-text-disabled)',

  // Optional tag
  optionalDot: 'text-(length:--text-body-size) text-(--color-text-secondary)',
  optionalText: 'text-(length:--text-body-size) text-(--color-text-secondary)',

  // Description
  descriptionRow: 'ps-(--spacing-0)',
  descriptionRowWithIndicator: 'ps-(--spacing-6)',
  description: cn(
    // Block, not inline. An inline span is laid out in a line box belonging to
    // its parent, and that box is floored by the parent's strut — the invisible
    // box every block container reserves from its own font and line-height. The
    // row inherits the page's 16px/24px, so an inline description sat in a 24px
    // line box no matter how tight its own leading was, padding the gap under
    // the label. Blockifying moves the strut onto this span, where the metrics
    // below apply and the box hugs the text at 16px.
    'block text-(length:--text-supporting-size)',
    // The supporting-leading token (1.667 → 20px at 12px) reads too loose for
    // a caption sitting under its label; a fixed 16px line box (the --spacing-4
    // step) is tighter without collapsing the text the way capsize trim did,
    // and stays on the spacing scale rather than a raw literal.
    'leading-(--spacing-4) text-(--color-text-secondary)',
  ),

  // Step content (children / flex slot)
  stepContent: 'pbs-(--spacing-2)',
  // The label row sits inside the density-padded hover target, but the content
  // slot is that target's *sibling* — a <button> cannot contain the buttons and
  // inputs a content slot usually holds, so the slot has to live outside it.
  // Left alone the slot therefore starts at the step edge while the label above
  // starts one density pad in. Reproducing that pad here is what keeps the two
  // flush; the gutter on top of it is what lines the content up with the label
  // rather than with the indicator.
  contentIndent: (inlinePad: string, gutter: string) =>
    dyn('ps-(--_step-indent-start) pe-(--_step-indent-end)', {
      '--_step-indent-start': `calc(${inlinePad} + ${gutter})`,
      '--_step-indent-end': inlinePad,
    }),

  // Density. Block padding only — the inline half comes from densityInline,
  // which is passed in so the content slot outside this wrapper can apply the
  // same value.
  densityCompact: 'py-(--spacing-1)',
  densityBalanced: 'py-(--spacing-2)',
  densitySpacious: 'py-(--spacing-3)',
  densityInline: (value: string) =>
    dyn('px-(--_step-density-inline)', {'--_step-density-inline': value}),

  // Button reset for clickable steps
  buttonReset: cn(
    'text-start items-stretch flex flex-col w-full',
    CURSOR,
    'rounded-(--radius-element)',
    TRANSITION_FAST_MIN,
    'bg-transparent',
  ),

  // ===================== ON-TRACK LAYOUT =====================
  // Indicator is slotted into the connector line as a node on the track.
  // Each step draws the connector segments that flank its own indicator; the
  // segment *before* the indicator is hidden on the first step (step === 0) so
  // the track starts at the first node. Segments abut the indicator directly,
  // so no child introspection or total-count is needed.

  otVerticalRoot: 'flex flex-col relative',
  otHorizontalRoot: 'flex flex-col flex-1 min-w-0',

  // Interactive wrapper (indicator + label act as one click target).
  otInteractive: cn(
    'box-border',
    // Force start alignment so vertical labels/descriptions read left-aligned. Horizontal
    // labels re-center via otLabelWrapH (a deeper element).
    'text-start',
    CURSOR,
    'rounded-(--radius-element)',
    TRANSITION_FAST_MIN,
    'bg-transparent',
  ),

  otRowWrap: 'flex flex-row items-stretch gap-(--spacing-2) w-full',
  otColWrap: 'flex flex-col items-stretch w-full',

  // Vertical indicator column: [segment] [indicator] [segment] stacked.
  otIndicatorColV:
    'flex flex-col items-center w-(--spacing-4) shrink-0 self-stretch',
  // Shared segment base: square ends so stacked segments read as one
  // continuous line (no radius).
  otSegBaseV: 'w-(--spacing-1) shrink-0 rounded-none',
  // The gap a connector leaves where it meets the indicator, spent on the side
  // that faces the node so the pair leaves a symmetric hole around it.
  //
  // Clip the segment rather than changing its box: one `clip-path` clips the
  // segment's own track and its absolutely positioned `::before` fill against
  // the same reference box. The indicator stays put, the Stepper cannot grow,
  // and percentage values cannot resolve differently between the two layers.
  // The inherited value is clamped in CONNECTOR_GAP; its default is declared
  // once on the Stepper root, where a generated theme override can replace it.
  //
  // A public var rather than a per-segment theme vocabulary: "do not touch the
  // indicator" is one intent, and naming the segments would publish which
  // pieces this layout happens to be drawn from today.
  otSegGapLeadV:
    '[clip-path:inset(0_0_max(0px,min(var(--step-connector-gap,0px),var(--spacing-2)))_0)]',
  otSegGapRailV:
    '[clip-path:inset(max(0px,min(var(--step-connector-gap,0px),var(--spacing-2)))_0_0_0)]',
  // The horizontal pair is PHYSICAL: `clip-path: inset()` takes top/right/
  // bottom/left and has no logical form, while the row itself reverses under
  // `dir="rtl"`. Left unflipped, the leading segment sits to the RIGHT of the
  // node in RTL and still clips its right edge — opening the hole at the join
  // between steps instead of at the indicator. The block axis needs no such
  // handling: `dir` does not reverse it.
  otSegGapLeadH: cn(
    '[clip-path:inset(0_max(0px,min(var(--step-connector-gap,0px),var(--spacing-2)))_0_0)]',
    '[&:is([dir=rtl]_*)]:[clip-path:inset(0_0_0_max(0px,min(var(--step-connector-gap,0px),var(--spacing-2))))]',
  ),
  otSegGapRailH: cn(
    '[clip-path:inset(0_0_0_max(0px,min(var(--step-connector-gap,0px),var(--spacing-2))))]',
    '[&:is([dir=rtl]_*)]:[clip-path:inset(0_max(0px,min(var(--step-connector-gap,0px),var(--spacing-2)))_0_0)]',
  ),
  // Flexible segment (below the node) — grows to fill the step height and
  // meets the next node's leading segment.
  otSegFlexV: 'flex-1 min-h-(--spacing-2)',
  // Fixed leading segment (above the node) — its height offsets the node down
  // so it aligns with the label's first line instead of the step's center.
  otSegLeadV: (value: string) =>
    dyn('h-(--_step-lead-height)', {'--_step-lead-height': value}),

  // Horizontal track row: [segment] [indicator] [segment] in a line.
  otTrackRowH: 'flex flex-row items-center w-full',
  otSegH: 'h-(--spacing-1) flex-1 min-w-(--spacing-2) rounded-none',

  // Structural first/last hiding keyed off the step's own <li> position via
  // stepMarker, so it never depends on the parent counting children (which
  // breaks when steps are grouped in a fragment). Scoped to stepMarker so only
  // the parent <li> is checked, not the outer <ol> (also a :first/:last-child).
  otSegHiddenIfFirst: 'visible group-first/step:invisible',
  otSegHiddenIfLast: 'visible group-last/step:invisible',

  otBodyV: 'flex flex-col justify-start flex-1 gap-(--spacing-0-5) min-w-0',
  otLabelWrapH: cn(
    'flex flex-col',
    // Stretch rather than center for the same reason as horizontalStep: a
    // centered child is fit-content sized and would spill past its node.
    // The label still reads centered under the node — otLabelRowCenter
    // centers it inside the full-width row.
    'items-stretch gap-(--spacing-0-5) text-center',
  ),
  otLabelRowStart: 'flex flex-row items-center gap-(--spacing-2)',
  otLabelRowCenter:
    'flex flex-row items-center justify-center flex-wrap gap-(--spacing-1)',

  // Inline offset comes from contentIndent, and only in the vertical layout —
  // a horizontal on-track step pads its hover target on the block axis alone,
  // so its content slot already starts flush with the column above it.
  otContent: 'pbs-(--spacing-2)',
  // A vertical on-track step draws its connector inside the row holding the
  // indicator and label, and the content slot sits below that row rather than
  // in it (the row is a <button> when the step is clickable, which cannot
  // contain the controls a content slot usually holds). So the line stops at
  // the label and the track breaks open wherever a step carries content.
  // otContentSegV continues it: a segment spanning the slot's full height, on
  // the same rail the row's segments run down, which closes the gap between
  // this step's indicator and the next one's.
  otContentWrapV: 'relative',
  otContentSegV: (inlinePad: string) =>
    dyn(
      cn(
        'absolute [inset-block:0]',
        // Center on the rail: the row pads itself by inlinePad, then centers a
        // BAR_WIDTH line inside an INDICATOR_SIZE-wide column.
        'start-(--_step-rail-inset)',
        'w-(--spacing-1)',
      ),
      {
        '--_step-rail-inset': `calc(${inlinePad} + (${INDICATOR_SIZE} - ${BAR_WIDTH}) / 2)`,
      },
    ),

  // Density-driven spacing. The connector runs along the "track axis"
  // (vertical = block, horizontal = inline), so density is only ever applied
  // to the *cross* axis — padding the track axis would break the line into
  // gapped segments.
  //
  // Vertical: pad the whole step row (indicator rail + label) so density adds
  // breathing room *around the indicators*, not just the text. Applied to the
  // hover target itself.
  otRowPadV: (value: string) =>
    dyn('py-(--_step-row-pad) px-(--_step-row-pad)', {'--_step-row-pad': value}),
  // The rail draws the connector, so it must span the row's full block extent
  // to keep the line continuous. A negative block margin cancels the wrapper's
  // block padding, letting the line bridge step-to-step while the label still
  // sits inside the padding.
  otRailBridgeV: (value: string) =>
    dyn('my-(--_step-rail-bridge)', {
      '--_step-rail-bridge': `calc(-1 * ${value})`,
    }),
  // Horizontal: block padding around the track+label column (inside the hover
  // target) adds vertical breathing room while the inline track stays flush.
  otPadBlock: (value: string) =>
    dyn('py-(--_step-pad-block)', {'--_step-pad-block': value}),
  otMarginTop: (value: string) =>
    dyn('mbs-(--_step-margin-top)', {'--_step-margin-top': value}),
  // The current step, named below a track whose own labels have collapsed.
  // Centred rather than indented under an indicator: there is one of these and
  // it sits under the whole track, so it lines up with the track's middle and
  // not with any one segment of it.
  summaryRoot: 'items-center flex flex-col gap-(--spacing-0-5) min-w-0',
} as const;

/**
 * An individual step within an Stepper. Renders a 4px progress-bar segment,
 * an indicator (numbered badge, check, or any custom icon), a label with
 * optional description, and an optional content slot.
 *
 * Progress (completed / active / not-started) is derived from the parent's
 * `activeStep` and this step's `step` prop. The optional `status` prop layers a
 * semantic meaning on top: in the default `auto` indicator mode it recolors the
 * indicator and swaps in a matching glyph (`success` → green check-circle,
 * `warning`/`error` → the shared Input status icons). The current step always
 * keeps its current-step ring. `status` never recolors the connector/track.
 *
 * @example
 * ```
 * <Step step={0} label="Account details" description="Enter your email" />
 * ```
 *
 * @example
 * ```
 * <Step step={1} label="Payment" status="error" />
 * ```
 */
export function Step({
  step,
  label,
  description,
  children,
  status,
  isDisabled = false,
  isOptional = false,
  endContent,
  indicator: indicatorProp,
  density: densityProp,
  className,
  style,
  ref,
  'data-testid': dataTestId,
  ...rest
}: StepProps) {
  const t = useTranslator();
  const ctx = useStepperInternalContext();
  const {
    activeStep,
    previousActiveStep,
    orientation,
    onStepClick,
    density: ctxDensity,
    indicatorPosition,
    registerStep,
    isCompact,
    summarySlot,
  } = ctx;

  // Register this step index with the parent Stepper, which uses the tally to
  // warn about duplicate indices and work out how much width each step gets.
  // The optional getter keeps disabled state owned by this Step while compact
  // navigation can read its latest registration.
  //
  // A layout effect, not an effect: the width each step has is the stepper's
  // width divided by this count, so a stepper narrow enough to collapse can
  // only know it once every step is counted. Running after paint would show
  // the full stepper for a frame and then snap it shut.
  useLayoutEffect(
    () => registerStep(step, {getIsDisabled: () => isDisabled}),
    [registerStep, step, isDisabled],
  );

  const density = densityProp ?? ctxDensity;
  // Inline padding of a separated step's hover target. Density varies the block
  // padding freely, but the inline value has to be readable from out here: the
  // content slot renders outside that target and re-applies it to stay aligned
  // (see contentIndent), so keeping it in one place is what stops the two
  // drifting apart.
  const separatedDensityInline =
    density === 'spacious'
      ? spacingVars['--spacing-3']
      : spacingVars['--spacing-2'];

  // Resolve indicator prop — may be a preset string or a custom ReactNode.
  const isCustomIndicator =
    indicatorProp != null && typeof indicatorProp !== 'string';
  const indicator: StepIndicatorPreset = isCustomIndicator
    ? 'auto'
    : ((indicatorProp as StepIndicatorPreset | undefined) ?? 'auto');

  // Internal progress, derived from the parent's activeStep. This is NOT the
  // public `status` prop — `status` controls semantic color only.
  const progress: 'completed' | 'in-progress' | 'not-started' =
    step === activeStep
      ? 'in-progress'
      : step < activeStep
        ? 'completed'
        : 'not-started';

  const isVertical = orientation === 'vertical';
  const isActive = progress === 'in-progress';
  // A compact horizontal stepper moves navigation to the named controls in its
  // summary row. Its track — including the on-track indicators — stays purely
  // presentational so it does not expose a second, denser set of click targets.
  const isClickable = !isDisabled && onStepClick != null && !isCompact;

  const handleClick = () => {
    if (isClickable && onStepClick) {
      onStepClick(step);
    }
  };

  // Bar fill is purely progress-based. `status` never recolors the bar — it
  // only recolors the indicator (icon / number badge) below.
  const isBarFilled = progress === 'completed' || progress === 'in-progress';

  // --- This step's slice of the animated span ---
  // Both layouts are measured in the same unit, the node-to-node span: on-track
  // span k runs from node k to node k+1, and a separated step's lone bar is the
  // span arriving at it (bar s fills on exactly the condition span s-1 does).
  // So one rule serves both, and neither needs to know the step count.
  //
  // Only a single forward step animates, and the span it crosses is the one
  // leaving the step the flow came from. Every other segment — the untouched
  // ones, and every segment of a jump or a retreat — is handed a zero
  // duration, so it lands at once and carries no stale delay into a later
  // change.
  const isSingleAdvance = activeStep === previousActiveStep + 1;
  const animatedSpan = previousActiveStep;

  /**
   * Timing for the segment covering `[offset, offset + share)` of span
   * `spanIndex`, both expressed as fractions of that span.
   */
  const fillTiming = (spanIndex: number, offset: number, share: number) => {
    if (!isSingleAdvance || spanIndex !== animatedSpan) {
      return styles.connectorTiming('0s', '0s');
    }
    return styles.connectorTiming(
      fillTimeSlice(FILL_SPAN_TIME, share),
      fillTimeSlice(FILL_SPAN_TIME, offset),
    );
  };

  // A separated step draws the whole span arriving at it, so it fills for the
  // span's entire slice with nothing to sequence against.
  const barTiming = fillTiming(step - 1, 0, 1);

  // --- Build indicator node ---
  // 'auto': number for not-started, check/dot icon once reached
  // 'number': always number badge
  // 'none': nothing
  // custom ReactNode (or `icon` prop): render as-is
  let indicatorNode: ReactNode = null;

  const customIcon = isCustomIndicator ? indicatorProp : null;

  // Semantic `status` drives a distinct indicator glyph (default 'auto' mode,
  // no custom icon), all sourced from the themed Icon registry so a step reads
  // the same as the rest of the system:
  //  - success → the themed `success` glyph (same check-circle as a completed
  //    step), tinted success — i.e. a green check
  //  - warning → the themed `warning` glyph
  //  - error   → the themed `error` glyph
  // The current (in-progress) step always shows the current-step ring — its
  // indicator "replaces" any status glyph. `accent` has no distinct glyph and
  // falls through to the progress-derived default.
  const statusGlyph: 'success' | 'warning' | 'error' | null =
    indicator === 'auto' &&
    customIcon == null &&
    !isActive &&
    (status === 'success' || status === 'warning' || status === 'error')
      ? status
      : null;

  if (indicator !== 'none') {
    const showNumber =
      customIcon == null &&
      statusGlyph == null &&
      (indicator === 'number' ||
        (indicator === 'auto' && progress === 'not-started'));

    if (showNumber) {
      // Status only fills the badge once the step is reached. A not-started
      // step stays neutral — otherwise `accent` (which has no glyph to swap in)
      // would paint an inverted accent badge on an upcoming step, making it
      // read as active/completed.
      const isReached = progress === 'completed' || progress === 'in-progress';
      const numberColorStyle = isDisabled
        ? styles.numberDisabled
        : isReached && status === 'accent'
          ? styles.numberAccent
          : isReached && status === 'success'
            ? styles.numberSuccess
            : isReached && status === 'warning'
              ? styles.numberWarning
              : isReached && status === 'error'
                ? styles.numberError
                : progress === 'completed'
                  ? styles.numberCompleted
                  : progress === 'in-progress'
                    ? styles.numberInProgress
                    : styles.numberNotStarted;

      indicatorNode = (
        <div
          aria-hidden="true"
          {...mergeProps(
            themeProps('step-indicator', {
              progress,
              status: status ?? undefined,
            }),
            sx(styles.numberBadge, numberColorStyle),
          )}>
          {step + 1}
        </div>
      );
    } else {
      // Priority: explicit custom icon → status glyph (non-current steps) →
      // progress-derived default (check when completed, ring when current).
      const iconContent: ReactNode =
        customIcon != null ? (
          customIcon
        ) : statusGlyph === 'success' ? (
          <Icon
            icon="success"
            size="sm"
            color={isDisabled ? 'disabled' : 'success'}
          />
        ) : statusGlyph === 'warning' ? (
          <Icon
            icon="warning"
            size="sm"
            color={isDisabled ? 'disabled' : 'warning'}
          />
        ) : statusGlyph === 'error' ? (
          <Icon
            icon="error"
            size="sm"
            color={isDisabled ? 'disabled' : 'error'}
          />
        ) : progress === 'completed' ? (
          <CheckCircleIcon />
        ) : (
          <CurrentIcon />
        );

      // Wrapper tint drives the currentColor glyphs (check-circle / ring /
      // custom icon). The <Icon> status glyphs set their own color, but we tint
      // the wrapper to match so the indicator's color reflects `status` too.
      const iconColorStyle = isDisabled
        ? styles.iconDisabled
        : customIcon != null
          ? status === 'accent'
            ? styles.iconAccent
            : status === 'success'
              ? styles.iconSuccess
              : status === 'warning'
                ? styles.iconWarning
                : status === 'error'
                  ? styles.iconError
                  : progress === 'completed'
                    ? styles.iconCompleted
                    : progress === 'in-progress'
                      ? styles.iconInProgress
                      : styles.iconNotStarted
          : statusGlyph === 'success'
            ? styles.iconSuccess
            : statusGlyph === 'warning'
              ? styles.iconWarning
              : statusGlyph === 'error'
                ? styles.iconError
                : progress === 'completed'
                  ? styles.iconCompleted
                  : progress === 'in-progress'
                    ? styles.iconInProgress
                    : styles.iconNotStarted;

      indicatorNode = (
        <div
          aria-hidden="true"
          {...mergeProps(
            themeProps('step-indicator', {
              progress,
              status: status ?? undefined,
            }),
            sx(styles.icon, iconColorStyle),
          )}>
          {iconContent}
        </div>
      );
    }
  }

  // Every indicator glyph above is aria-hidden (pure decoration), so the
  // step's progress/status must also reach assistive tech as text
  // (WCAG 1.4.1 / 1.3.1). `error`/`warning` announce the semantic status;
  // `success` and a completed step both announce "completed". The current
  // step is announced via aria-current="step" instead, and not-started steps
  // stay silent (the default state needs no qualifier).
  const statusText: string | null =
    status === 'error'
      ? t('@solo.step.status.error')
      : status === 'warning'
        ? t('@solo.step.status.warning')
        : status === 'success' || progress === 'completed'
          ? t('@solo.step.status.completed')
          : null;

  // Rendered next to the label: hidden text for static steps, and composed
  // into the button's accessible name for clickable ones (an aria-label on
  // the button would otherwise override the hidden text). Two separate keys
  // rather than string concatenation so translations control the joiner.
  const statusTextNode = isRenderable(statusText) ? (
    <VisuallyHidden>{statusText}</VisuallyHidden>
  ) : null;
  const stepAriaLabel =
    statusText != null
      ? t('@solo.step.goToStepWithStatus', {
          stepNumber: step + 1,
          label,
          status: statusText,
        })
      : t('@solo.step.goToStep', {stepNumber: step + 1, label});

  const hasIndicator = indicator !== 'none';

  const labelColorStyle = isDisabled
    ? styles.labelDisabled
    : progress === 'not-started'
      ? styles.labelNotStarted
      : isActive
        ? styles.labelInProgress
        : undefined;

  // Both text parts carry {progress, status}, the phase vocabulary of
  // `step-indicator` above. The label additionally owns Stepper's disabled
  // paint, so it alone carries disabled below.
  const labelThemeProps = themeProps('step-label', {
    progress,
    status: status ?? undefined,
    // The label owns Stepper's disabled paint (`styles.labelDisabled` above),
    // so it owns the selector too. The description does not change under
    // disabled and deliberately keeps the smaller {progress, status} surface.
    disabled: isDisabled ? 'disabled' : null,
  });
  const descriptionThemeProps = themeProps('step-description', {
    progress,
    status: status ?? undefined,
  });

  // Indicator + Label row. In compact on-track mode the indicator remains
  // visible on the rail, so the summary reuses this row without drawing the
  // active indicator a second time beside the label.
  const iconLabelNode = (
    <div {...sx(styles.iconLabelRow)}>
      {(!isCompact || indicatorPosition !== 'on-track') && indicatorNode}
      <span
        {...mergeProps(
          labelThemeProps,
          sx(styles.label, labelColorStyle),
        )}>
        {label}
      </span>
      {statusTextNode}
      {isOptional && (
        <>
          <span {...sx(styles.optionalDot)}>•</span>
          <span {...sx(styles.optionalText)}>
            {t('@solo.step.optional')}
          </span>
        </>
      )}
      {endContent}
    </div>
  );

  const descriptionNode = isRenderable(description) ? (
    <div
      {...sx(
        hasIndicator
          ? styles.descriptionRowWithIndicator
          : styles.descriptionRow,
      )}>
      <span
        {...mergeProps(
          descriptionThemeProps,
          sx(styles.description),
        )}>
        {description}
      </span>
    </div>
  ) : null;

  // Compact horizontal layouts hide public step content without unmounting it,
  // so local state survives as the container crosses the threshold.
  const contentNode = isRenderable(children) ? (
    <div
      hidden={isCompact || undefined}
      {...sx(
        styles.stepContent,
        styles.contentIndent(
          separatedDensityInline,
          hasIndicator ? INDICATOR_GUTTER : '0px',
        ),
      )}>
      {children}
    </div>
  ) : null;

  // Theme data attributes reflect progress + optional semantic status.
  const stepThemeProps = themeProps('step', {
    progress,
    status: status ?? undefined,
  });

  // ======= SUMMARY: this step, drawn below a collapsed track =======
  //
  // Only the current step draws one, into a row the stepper owns and keeps
  // outside the `<ol>` — so the list is left with exactly the children it was
  // given, and the on-track connectors go on reading their own
  // `:first-child`/`:last-child` position to decide which caps to hide.
  //
  // Rendered here rather than handed up as data because it reuses
  // `iconLabelNode`: indicator resolution, status glyphs, completed checks,
  // disabled tints, and the compact on-track rule above stay in one place. The
  // description is re-wrapped, though — the row version indents itself under
  // an indicator, and centred under a track there is nothing to line it up with.
  const summaryNode =
    isCompact && isActive && summarySlot != null
      ? createPortal(
          <div
            {...mergeProps(stepThemeProps, sx(styles.summaryRoot))}>
            {iconLabelNode}
            {isRenderable(description) ? (
              <span {...sx(styles.description)}>{description}</span>
            ) : null}
          </div>,
          summarySlot,
        )
      : null;

  // Every compact step is presentational, including on-track indicators, so
  // each item restores its label and status as hidden text. The list stays a
  // complete ordered sequence with `aria-current` intact, while the summary row
  // below it owns the compact navigation controls and remains decorative apart
  // from those buttons.
  const compactNameNode = isCompact ? (
    <>
      <VisuallyHidden>{label}</VisuallyHidden>
      {statusTextNode}
    </>
  ) : null;

  // ======= ON-TRACK: indicator is a node on the connector =======
  if (indicatorPosition === 'on-track') {
    // Connector fill is purely progress-based (matches the separated bar):
    // the segment before the indicator is "reached" once we're at/past this
    // step; the segment after is filled only once this step is completed.
    // `status` never recolors the connector — only the indicator.
    const beforeFilled = step <= activeStep;
    const afterFilled = step < activeStep;
    // Both segments animate their fill along the track (see connectorTrack), so
    // the pair is picked by orientation: the vertical column scales down its
    // block axis, the horizontal row along the reading direction.
    const segFilledStyle = isVertical
      ? styles.connectorFillV
      : styles.connectorFillH;
    const segEmptyStyle = isVertical
      ? styles.connectorEmptyV
      : styles.connectorEmptyH;
    const beforeSegStyle = beforeFilled ? segFilledStyle : segEmptyStyle;
    const afterSegStyle = afterFilled ? segFilledStyle : segEmptyStyle;
    // First/last connector visibility is decided structurally from the step's
    // own <li> position (see otSegHiddenIfFirst/Last), not by counting children
    // in the parent — so grouping steps in a fragment can't break it.

    // A node-to-node span is drawn by two steps: this one's trailing segments
    // leave its own node, the next one's leading cap arrives at the next node.
    // Both flip on the same condition, so left to themselves they fill together
    // and one gap between two nodes reads as two dashes converging on the space
    // between them. Handing each its own slice of the span's time, in track
    // order — the leaving half first, then the arriving one — is what closes
    // that into a single line growing.
    const arrivalShare = isVertical ? OT_ARRIVAL_SHARE_V : OT_ARRIVAL_SHARE_H;
    const leavingShare = 1 - arrivalShare;
    // A content slot's segment continues the leaving half below the row, so the
    // two divide the leaving time between them; with no slot the rail segment
    // takes all of it. Each step can work this out for its own trailing side
    // alone: the arriving cap always takes the span's last `arrivalShare`, so
    // the step drawing it never has to know whether the step before it carries
    // a slot.
    const hasContentSeg = isVertical && isRenderable(children);
    const railShare =
      leavingShare * (hasContentSeg ? OT_RAIL_SHARE_OF_LEAVING : 1);
    const contentShare = leavingShare - railShare;

    const beforeTiming = fillTiming(step - 1, leavingShare, arrivalShare);
    const railTiming = fillTiming(step, 0, railShare);
    const contentTiming = fillTiming(step, railShare, contentShare);

    const densitySpace =
      density === 'compact'
        ? spacingVars['--spacing-1']
        : density === 'spacious'
          ? spacingVars['--spacing-3']
          : spacingVars['--spacing-2'];

    const labelLineNode = (
      <div
        {...sx(
          isVertical ? styles.otLabelRowStart : styles.otLabelRowCenter,
        )}>
        <span
          {...mergeProps(
            labelThemeProps,
            sx(styles.label, labelColorStyle),
          )}>
          {label}
        </span>
        {statusTextNode}
        {isOptional && (
          <>
            <span {...sx(styles.optionalDot)}>•</span>
            <span {...sx(styles.optionalText)}>
              {t('@solo.step.optional')}
            </span>
          </>
        )}
        {endContent}
      </div>
    );

    const otDescriptionNode = isRenderable(description) ? (
      <span
        {...mergeProps(
          descriptionThemeProps,
          sx(styles.description),
        )}>
        {description}
      </span>
    ) : null;

    const otContentNode = !isRenderable(children) ? null : isVertical ? (
      <div {...sx(styles.otContentWrapV)}>
        <div
          aria-hidden="true"
          {...mergeProps(
            themeProps('step-connector'),
            sx(
              // connectorTrack first: it declares `position: relative` to
              // anchor its fill layer, but this segment is absolutely placed
              // on the rail beside the content slot and must keep that. An
              // absolute box is a containing block too, so the fill still
              // pins to it.
              styles.connectorTrack,
              styles.otContentSegV(densitySpace),
              afterSegStyle,
              contentTiming,
              styles.otSegHiddenIfLast,
            ),
          )}
        />
        <div
          {...sx(
            styles.otContent,
            styles.contentIndent(densitySpace, INDICATOR_GUTTER),
          )}>
          {children}
        </div>
      </div>
    ) : (
      <div hidden={isCompact || undefined} {...sx(styles.otContent)}>
        {children}
      </div>
    );

    if (isVertical) {
      const inner = (
        <>
          <div
            {...sx(
              styles.otIndicatorColV,
              styles.otRailBridgeV(densitySpace),
            )}>
            <div
              aria-hidden="true"
              {...mergeProps(
                themeProps('step-connector'),
                sx(
                  styles.otSegBaseV,
                  styles.otSegLeadV(densitySpace),
                  styles.connectorTrack,
                  hasIndicator && styles.otSegGapLeadV,
                  beforeSegStyle,
                  beforeTiming,
                  styles.otSegHiddenIfFirst,
                ),
              )}
            />
            {indicatorNode}
            <div
              aria-hidden="true"
              {...mergeProps(
                themeProps('step-connector'),
                sx(
                  styles.otSegBaseV,
                  styles.otSegFlexV,
                  styles.connectorTrack,
                  hasIndicator && styles.otSegGapRailV,
                  afterSegStyle,
                  railTiming,
                  styles.otSegHiddenIfLast,
                ),
              )}
            />
          </div>
          <div {...sx(styles.otBodyV)}>
            {labelLineNode}
            {otDescriptionNode}
          </div>
        </>
      );

      return (
        <li
          ref={ref}
          {...mergeProps(
            stepThemeProps,
            sx(stepMarker, styles.otVerticalRoot),
            className,
            style,
          )}
          aria-current={isActive ? 'step' : undefined}
          data-testid={dataTestId}
          {...rest}>
          {isClickable ? (
            <button
              type="button"
              onClick={handleClick}
              aria-label={stepAriaLabel}
              {...sx(
                styles.otInteractive,
                interactionOverlayStyles.backgroundColor,
                styles.otRowWrap,
                styles.otRowPadV(densitySpace),
                focusOutlineStyles.focusVisible,
              )}>
              {inner}
            </button>
          ) : (
            <div
              {...sx(
                styles.otRowWrap,
                styles.otRowPadV(densitySpace),
              )}>
              {inner}
            </div>
          )}
          {otContentNode}
        </li>
      );
    }

    // Horizontal on-track
    const innerH = (
      <>
        <div {...sx(styles.otTrackRowH)}>
          <div
            aria-hidden="true"
            {...mergeProps(
              themeProps('step-connector'),
              sx(
                styles.otSegH,
                styles.connectorTrack,
                hasIndicator && styles.otSegGapLeadH,
                beforeSegStyle,
                beforeTiming,
                styles.otSegHiddenIfFirst,
              ),
            )}
          />
          {indicatorNode}
          <div
            aria-hidden="true"
            {...mergeProps(
              themeProps('step-connector'),
              sx(
                styles.otSegH,
                styles.connectorTrack,
                hasIndicator && styles.otSegGapRailH,
                afterSegStyle,
                railTiming,
                styles.otSegHiddenIfLast,
              ),
            )}
          />
        </div>
        {/* The on-track indicator remains visible as a node on the rail at
            compact widths, but the wrapper becomes presentational with its
            label. Navigation moves to the named controls in the summary row. */}
        {!isCompact && (
          <div
            {...sx(
              styles.otLabelWrapH,
              styles.otMarginTop(densitySpace),
            )}>
            {labelLineNode}
            {otDescriptionNode}
          </div>
        )}
      </>
    );

    return (
      <li
        ref={ref}
        {...mergeProps(
          stepThemeProps,
          sx(stepMarker, styles.otHorizontalRoot),
          className,
          style,
        )}
        aria-current={isActive ? 'step' : undefined}
        data-testid={dataTestId}
        {...rest}>
        {isClickable ? (
          <button
            type="button"
            onClick={handleClick}
            aria-label={stepAriaLabel}
            {...sx(
              styles.otInteractive,
              interactionOverlayStyles.backgroundColor,
              styles.otColWrap,
              styles.otPadBlock(densitySpace),
              focusOutlineStyles.focusVisible,
            )}>
            {innerH}
          </button>
        ) : (
          <div
            {...sx(
              styles.otColWrap,
              styles.otPadBlock(densitySpace),
            )}>
            {innerH}
          </div>
        )}
        {compactNameNode}
        {otContentNode}
        {summaryNode}
      </li>
    );
  }

  // ======= VERTICAL =======
  if (isVertical) {
    return (
      <li
        ref={ref}
        {...mergeProps(
          stepThemeProps,
          sx(stepMarker, styles.verticalRoot),
          className,
          style,
        )}
        aria-current={isActive ? 'step' : undefined}
        data-testid={dataTestId}
        {...rest}>
        {/* 4px progress bar */}
        <div
          {...mergeProps(
            themeProps('step-bar'),
            sx(
              styles.verticalBar,
              styles.connectorTrack,
              isBarFilled ? styles.connectorFillV : styles.connectorEmptyV,
              barTiming,
            ),
          )}
          aria-hidden="true"
        />
        {/* Body: button wraps only label area, children render outside */}
        <div {...sx(styles.verticalBody)}>
          {isClickable ? (
            <button
              type="button"
              onClick={handleClick}
              aria-label={stepAriaLabel}
              {...sx(
                styles.buttonReset,
                interactionOverlayStyles.backgroundColor,
                focusOutlineStyles.focusVisible,
                density === 'compact' && styles.densityCompact,
                density === 'balanced' && styles.densityBalanced,
                density === 'spacious' && styles.densitySpacious,
                styles.densityInline(separatedDensityInline),
              )}>
              {iconLabelNode}
              {descriptionNode}
            </button>
          ) : (
            <div
              {...sx(
                density === 'compact' && styles.densityCompact,
                density === 'balanced' && styles.densityBalanced,
                density === 'spacious' && styles.densitySpacious,
                styles.densityInline(separatedDensityInline),
              )}>
              {iconLabelNode}
              {descriptionNode}
            </div>
          )}
          {contentNode}
        </div>
      </li>
    );
  }

  // ======= HORIZONTAL =======
  return (
    <li
      ref={ref}
      {...mergeProps(
        stepThemeProps,
        sx(stepMarker, styles.horizontalStep),
        className,
        style,
      )}
      aria-current={isActive ? 'step' : undefined}
      data-testid={dataTestId}
      {...rest}>
      {/* 4px progress bar segment for this step */}
      <div
        {...mergeProps(
          themeProps('step-bar'),
          sx(
            styles.horizontalBar,
            styles.connectorTrack,
            isBarFilled ? styles.connectorFillH : styles.connectorEmptyH,
            barTiming,
          ),
        )}
        aria-hidden="true"
      />
      {/* The click target goes with the label, deliberately. A step narrow
          enough to lose its label is narrow enough that all that would be left
          to press is a 4px bar; the stepper puts a pair of named controls
          under the track instead. */}
      {isCompact ? (
        compactNameNode
      ) : isClickable ? (
        <button
          type="button"
          onClick={handleClick}
          aria-label={stepAriaLabel}
          {...sx(
            styles.buttonReset,
            interactionOverlayStyles.backgroundColor,
            focusOutlineStyles.focusVisible,
            density === 'compact' && styles.densityCompact,
            density === 'balanced' && styles.densityBalanced,
            density === 'spacious' && styles.densitySpacious,
            styles.densityInline(separatedDensityInline),
          )}>
          {iconLabelNode}
          {descriptionNode}
        </button>
      ) : (
        <div
          {...sx(
            density === 'compact' && styles.densityCompact,
            density === 'balanced' && styles.densityBalanced,
            density === 'spacious' && styles.densitySpacious,
            styles.densityInline(separatedDensityInline),
          )}>
          {iconLabelNode}
          {descriptionNode}
        </div>
      )}
      {contentNode}
      {summaryNode}
    </li>
  );
}

Step.displayName = 'Step';
