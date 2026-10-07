/**
 * @file padding.styles.ts
 * @input Uses spacing tokens from theme (Tailwind classes)
 * @output Class-string maps (Record<SpacingStep, string>) for the numeric
 *   padding prop on layout components
 * @position Layout utility; used by Card, Section, and Layout sub-components
 */

import type {SpacingStep} from '../utils/types';

/**
 * Maps numeric SpacingStep values to SpacingToken keys used by the container system.
 */
export const spacingStepToToken: Record<SpacingStep, string> = {
  0: 'spacing0',
  0.5: 'spacing0_5',
  1: 'spacing1',
  1.5: 'spacing1_5',
  2: 'spacing2',
  3: 'spacing3',
  4: 'spacing4',
  5: 'spacing5',
  6: 'spacing6',
  8: 'spacing8',
  10: 'spacing10',
};

/**
 * Padding styles for all sides using spacing tokens.
 * Each key applies uniform padding to all four sides.
 */
export const paddingStyles = {
  0: 'ps-(--spacing-0) pe-(--spacing-0) pbs-(--spacing-0) pbe-(--spacing-0)',
  0.5: 'ps-(--spacing-0-5) pe-(--spacing-0-5) pbs-(--spacing-0-5) pbe-(--spacing-0-5)',
  1: 'ps-(--spacing-1) pe-(--spacing-1) pbs-(--spacing-1) pbe-(--spacing-1)',
  1.5: 'ps-(--spacing-1-5) pe-(--spacing-1-5) pbs-(--spacing-1-5) pbe-(--spacing-1-5)',
  2: 'ps-(--spacing-2) pe-(--spacing-2) pbs-(--spacing-2) pbe-(--spacing-2)',
  3: 'ps-(--spacing-3) pe-(--spacing-3) pbs-(--spacing-3) pbe-(--spacing-3)',
  4: 'ps-(--spacing-4) pe-(--spacing-4) pbs-(--spacing-4) pbe-(--spacing-4)',
  5: 'ps-(--spacing-5) pe-(--spacing-5) pbs-(--spacing-5) pbe-(--spacing-5)',
  6: 'ps-(--spacing-6) pe-(--spacing-6) pbs-(--spacing-6) pbe-(--spacing-6)',
  8: 'ps-(--spacing-8) pe-(--spacing-8) pbs-(--spacing-8) pbe-(--spacing-8)',
  10: 'ps-(--spacing-10) pe-(--spacing-10) pbs-(--spacing-10) pbe-(--spacing-10)',
} as const satisfies Record<SpacingStep, string>;

/**
 * Container padding inline CSS variable styles for edge compensation.
 * Sets --container-padding-inline-start and --container-padding-inline-end so
 * edge-compensating children know the inline padding to compensate against.
 */
export const containerPaddingInlineVarStyles = {
  0: '[--container-padding-inline-start:var(--spacing-0)] [--container-padding-inline-end:var(--spacing-0)]',
  0.5: '[--container-padding-inline-start:var(--spacing-0-5)] [--container-padding-inline-end:var(--spacing-0-5)]',
  1: '[--container-padding-inline-start:var(--spacing-1)] [--container-padding-inline-end:var(--spacing-1)]',
  1.5: '[--container-padding-inline-start:var(--spacing-1-5)] [--container-padding-inline-end:var(--spacing-1-5)]',
  2: '[--container-padding-inline-start:var(--spacing-2)] [--container-padding-inline-end:var(--spacing-2)]',
  3: '[--container-padding-inline-start:var(--spacing-3)] [--container-padding-inline-end:var(--spacing-3)]',
  4: '[--container-padding-inline-start:var(--spacing-4)] [--container-padding-inline-end:var(--spacing-4)]',
  5: '[--container-padding-inline-start:var(--spacing-5)] [--container-padding-inline-end:var(--spacing-5)]',
  6: '[--container-padding-inline-start:var(--spacing-6)] [--container-padding-inline-end:var(--spacing-6)]',
  8: '[--container-padding-inline-start:var(--spacing-8)] [--container-padding-inline-end:var(--spacing-8)]',
  10: '[--container-padding-inline-start:var(--spacing-10)] [--container-padding-inline-end:var(--spacing-10)]',
} as const satisfies Record<SpacingStep, string>;

/**
 * Container padding block-start/block-end CSS variable styles for vertical bleed.
 * Sets --container-padding-block-start and --container-padding-block-end so bleed children (Table, Divider, Section)
 * know the block padding to compensate against when first/last child.
 */
export const containerPaddingBlockStartVarStyles = {
  0: '[--container-padding-block-start:var(--spacing-0)]',
  0.5: '[--container-padding-block-start:var(--spacing-0-5)]',
  1: '[--container-padding-block-start:var(--spacing-1)]',
  1.5: '[--container-padding-block-start:var(--spacing-1-5)]',
  2: '[--container-padding-block-start:var(--spacing-2)]',
  3: '[--container-padding-block-start:var(--spacing-3)]',
  4: '[--container-padding-block-start:var(--spacing-4)]',
  5: '[--container-padding-block-start:var(--spacing-5)]',
  6: '[--container-padding-block-start:var(--spacing-6)]',
  8: '[--container-padding-block-start:var(--spacing-8)]',
  10: '[--container-padding-block-start:var(--spacing-10)]',
} as const satisfies Record<SpacingStep, string>;

export const containerPaddingBlockEndVarStyles = {
  0: '[--container-padding-block-end:var(--spacing-0)]',
  0.5: '[--container-padding-block-end:var(--spacing-0-5)]',
  1: '[--container-padding-block-end:var(--spacing-1)]',
  1.5: '[--container-padding-block-end:var(--spacing-1-5)]',
  2: '[--container-padding-block-end:var(--spacing-2)]',
  3: '[--container-padding-block-end:var(--spacing-3)]',
  4: '[--container-padding-block-end:var(--spacing-4)]',
  5: '[--container-padding-block-end:var(--spacing-5)]',
  6: '[--container-padding-block-end:var(--spacing-6)]',
  8: '[--container-padding-block-end:var(--spacing-8)]',
  10: '[--container-padding-block-end:var(--spacing-10)]',
} as const satisfies Record<SpacingStep, string>;

/**
 * Layout outer X padding CSS variable styles.
 */
export const layoutPaddingOuterXVarStyles = {
  0: '[--layout-padding-outer-x:var(--spacing-0)]',
  0.5: '[--layout-padding-outer-x:var(--spacing-0-5)]',
  1: '[--layout-padding-outer-x:var(--spacing-1)]',
  1.5: '[--layout-padding-outer-x:var(--spacing-1-5)]',
  2: '[--layout-padding-outer-x:var(--spacing-2)]',
  3: '[--layout-padding-outer-x:var(--spacing-3)]',
  4: '[--layout-padding-outer-x:var(--spacing-4)]',
  5: '[--layout-padding-outer-x:var(--spacing-5)]',
  6: '[--layout-padding-outer-x:var(--spacing-6)]',
  8: '[--layout-padding-outer-x:var(--spacing-8)]',
  10: '[--layout-padding-outer-x:var(--spacing-10)]',
} as const satisfies Record<SpacingStep, string>;

/**
 * Layout outer Y padding CSS variable styles.
 */
export const layoutPaddingOuterYVarStyles = {
  0: '[--layout-padding-outer-y:var(--spacing-0)]',
  0.5: '[--layout-padding-outer-y:var(--spacing-0-5)]',
  1: '[--layout-padding-outer-y:var(--spacing-1)]',
  1.5: '[--layout-padding-outer-y:var(--spacing-1-5)]',
  2: '[--layout-padding-outer-y:var(--spacing-2)]',
  3: '[--layout-padding-outer-y:var(--spacing-3)]',
  4: '[--layout-padding-outer-y:var(--spacing-4)]',
  5: '[--layout-padding-outer-y:var(--spacing-5)]',
  6: '[--layout-padding-outer-y:var(--spacing-6)]',
  8: '[--layout-padding-outer-y:var(--spacing-8)]',
  10: '[--layout-padding-outer-y:var(--spacing-10)]',
} as const satisfies Record<SpacingStep, string>;

/**
 * Inline-only padding styles.
 * Use when a component needs to set inline (horizontal) padding independently
 * of block padding — e.g. the `paddingX` prop on Stack.
 */
export const paddingInlineStyles = {
  0: 'ps-(--spacing-0) pe-(--spacing-0)',
  0.5: 'ps-(--spacing-0-5) pe-(--spacing-0-5)',
  1: 'ps-(--spacing-1) pe-(--spacing-1)',
  1.5: 'ps-(--spacing-1-5) pe-(--spacing-1-5)',
  2: 'ps-(--spacing-2) pe-(--spacing-2)',
  3: 'ps-(--spacing-3) pe-(--spacing-3)',
  4: 'ps-(--spacing-4) pe-(--spacing-4)',
  5: 'ps-(--spacing-5) pe-(--spacing-5)',
  6: 'ps-(--spacing-6) pe-(--spacing-6)',
  8: 'ps-(--spacing-8) pe-(--spacing-8)',
  10: 'ps-(--spacing-10) pe-(--spacing-10)',
} as const satisfies Record<SpacingStep, string>;

/**
 * Block-only padding override styles.
 * Use when a component needs to override block padding independently
 * of inline padding (e.g., Toolbar sets tight block padding while
 * inheriting inline padding from its container).
 */
export const paddingBlockStyles = {
  0: 'pbs-(--spacing-0) pbe-(--spacing-0)',
  0.5: 'pbs-(--spacing-0-5) pbe-(--spacing-0-5)',
  1: 'pbs-(--spacing-1) pbe-(--spacing-1)',
  1.5: 'pbs-(--spacing-1-5) pbe-(--spacing-1-5)',
  2: 'pbs-(--spacing-2) pbe-(--spacing-2)',
  3: 'pbs-(--spacing-3) pbe-(--spacing-3)',
  4: 'pbs-(--spacing-4) pbe-(--spacing-4)',
  5: 'pbs-(--spacing-5) pbe-(--spacing-5)',
  6: 'pbs-(--spacing-6) pbe-(--spacing-6)',
  8: 'pbs-(--spacing-8) pbe-(--spacing-8)',
  10: 'pbs-(--spacing-10) pbe-(--spacing-10)',
} as const satisfies Record<SpacingStep, string>;

/**
 * Inline-start-only padding override styles.
 * Use when a component needs to override the inline-start edge independently
 * of inline-end. Logical, so it follows the writing direction (left in LTR,
 * right in RTL).
 */
export const paddingInlineStartStyles = {
  0: 'ps-(--spacing-0)',
  0.5: 'ps-(--spacing-0-5)',
  1: 'ps-(--spacing-1)',
  1.5: 'ps-(--spacing-1-5)',
  2: 'ps-(--spacing-2)',
  3: 'ps-(--spacing-3)',
  4: 'ps-(--spacing-4)',
  5: 'ps-(--spacing-5)',
  6: 'ps-(--spacing-6)',
  8: 'ps-(--spacing-8)',
  10: 'ps-(--spacing-10)',
} as const satisfies Record<SpacingStep, string>;

/**
 * Inline-end-only padding override styles.
 * The inline-end counterpart of paddingInlineStartStyles.
 */
export const paddingInlineEndStyles = {
  0: 'pe-(--spacing-0)',
  0.5: 'pe-(--spacing-0-5)',
  1: 'pe-(--spacing-1)',
  1.5: 'pe-(--spacing-1-5)',
  2: 'pe-(--spacing-2)',
  3: 'pe-(--spacing-3)',
  4: 'pe-(--spacing-4)',
  5: 'pe-(--spacing-5)',
  6: 'pe-(--spacing-6)',
  8: 'pe-(--spacing-8)',
  10: 'pe-(--spacing-10)',
} as const satisfies Record<SpacingStep, string>;

/**
 * Container padding inline-start CSS variable style, set independently of
 * inline-end so a per-edge override keeps edge-compensating children (Card,
 * Divider, a nested Section) compensating against the padding actually
 * applied on that edge.
 */
export const containerPaddingInlineStartVarStyles = {
  0: '[--container-padding-inline-start:var(--spacing-0)]',
  0.5: '[--container-padding-inline-start:var(--spacing-0-5)]',
  1: '[--container-padding-inline-start:var(--spacing-1)]',
  1.5: '[--container-padding-inline-start:var(--spacing-1-5)]',
  2: '[--container-padding-inline-start:var(--spacing-2)]',
  3: '[--container-padding-inline-start:var(--spacing-3)]',
  4: '[--container-padding-inline-start:var(--spacing-4)]',
  5: '[--container-padding-inline-start:var(--spacing-5)]',
  6: '[--container-padding-inline-start:var(--spacing-6)]',
  8: '[--container-padding-inline-start:var(--spacing-8)]',
  10: '[--container-padding-inline-start:var(--spacing-10)]',
} as const satisfies Record<SpacingStep, string>;

/**
 * Container padding inline-end CSS variable style, the counterpart of
 * containerPaddingInlineStartVarStyles.
 */
export const containerPaddingInlineEndVarStyles = {
  0: '[--container-padding-inline-end:var(--spacing-0)]',
  0.5: '[--container-padding-inline-end:var(--spacing-0-5)]',
  1: '[--container-padding-inline-end:var(--spacing-1)]',
  1.5: '[--container-padding-inline-end:var(--spacing-1-5)]',
  2: '[--container-padding-inline-end:var(--spacing-2)]',
  3: '[--container-padding-inline-end:var(--spacing-3)]',
  4: '[--container-padding-inline-end:var(--spacing-4)]',
  5: '[--container-padding-inline-end:var(--spacing-5)]',
  6: '[--container-padding-inline-end:var(--spacing-6)]',
  8: '[--container-padding-inline-end:var(--spacing-8)]',
  10: '[--container-padding-inline-end:var(--spacing-10)]',
} as const satisfies Record<SpacingStep, string>;

/**
 * Block-start-only padding override styles.
 * Use when a component needs to override the block-start (top) edge
 * independently of block-end — e.g. a section that sits under a sticky
 * header and needs less padding above than below.
 */
export const paddingBlockStartStyles = {
  0: 'pbs-(--spacing-0)',
  0.5: 'pbs-(--spacing-0-5)',
  1: 'pbs-(--spacing-1)',
  1.5: 'pbs-(--spacing-1-5)',
  2: 'pbs-(--spacing-2)',
  3: 'pbs-(--spacing-3)',
  4: 'pbs-(--spacing-4)',
  5: 'pbs-(--spacing-5)',
  6: 'pbs-(--spacing-6)',
  8: 'pbs-(--spacing-8)',
  10: 'pbs-(--spacing-10)',
} as const satisfies Record<SpacingStep, string>;

/**
 * Block-end-only padding override styles.
 * The block-end counterpart of paddingBlockStartStyles.
 */
export const paddingBlockEndStyles = {
  0: 'pbe-(--spacing-0)',
  0.5: 'pbe-(--spacing-0-5)',
  1: 'pbe-(--spacing-1)',
  1.5: 'pbe-(--spacing-1-5)',
  2: 'pbe-(--spacing-2)',
  3: 'pbe-(--spacing-3)',
  4: 'pbe-(--spacing-4)',
  5: 'pbe-(--spacing-5)',
  6: 'pbe-(--spacing-6)',
  8: 'pbe-(--spacing-8)',
  10: 'pbe-(--spacing-10)',
} as const satisfies Record<SpacingStep, string>;

/**
 * Propagation styles for `--_section-padding-propagated`.
 * When a parent section sets explicit padding, this propagates the value
 * through the CSS custom property cascade so nested sections that use
 * useThemeDefault inherit the parent's padding instead of the theme default.
 *
 * This is deliberately NOT the public `--solo-section-padding` token. The
 * two carry different authority: the public token is the THEME's section
 * padding, set once at the theme root, while this one is one ancestor
 * Section's padding, propagated down the tree. An overlay has to drop the
 * inherited value at its boundary (see {@link overlayPaddingReset}) without
 * dropping the theme's — impossible while both live under one name.
 * `container.styles.ts` reads this ahead of the public token, so a propagated
 * value still wins over the theme for nested sections, as before.
 */
export const sectionPaddingPropagationStyles = {
  0: '[--_section-padding-propagated:var(--spacing-0)]',
  0.5: '[--_section-padding-propagated:var(--spacing-0-5)]',
  1: '[--_section-padding-propagated:var(--spacing-1)]',
  1.5: '[--_section-padding-propagated:var(--spacing-1-5)]',
  2: '[--_section-padding-propagated:var(--spacing-2)]',
  3: '[--_section-padding-propagated:var(--spacing-3)]',
  4: '[--_section-padding-propagated:var(--spacing-4)]',
  5: '[--_section-padding-propagated:var(--spacing-5)]',
  6: '[--_section-padding-propagated:var(--spacing-6)]',
  8: '[--_section-padding-propagated:var(--spacing-8)]',
  10: '[--_section-padding-propagated:var(--spacing-10)]',
} as const satisfies Record<SpacingStep, string>;

/**
 * Padding-variable reset for overlay roots (Dialog, BottomSheet, Drawer,
 * MobileNav, Lightbox, and every layer surface).
 *
 * ## Why an overlay needs this
 *
 * The container padding system talks to descendants through inherited custom
 * properties: a padded container announces its padding, and children read the
 * value either to apply it or to cancel it with a negative margin
 * (`Section`, `Divider`, `Layout`, `Table`).
 *
 * Inheritance follows the DOM, but an overlay leaves its parent's visual box —
 * a fixed/top-layer `<dialog>` is a DOM descendant of the padded page while
 * being nowhere near it on screen. It inherits values describing padding that
 * is not there, and its content compensates against phantom space: a `Section`
 * inside a 640px sheet rendered 672px wide and hung off both edges.
 *
 * Two families leak, and they need opposite treatments:
 *
 * - `--container-padding-*` -> `0px`. Descendants SUBTRACT these (bleed
 *   margins). The overlay root has no padding of its own to escape, so the
 *   honest answer is zero. Nested containers that do set padding (a Dialog's
 *   content wrapper) re-announce their own values below this point, so
 *   legitimate edge-to-edge bleed inside the overlay is unaffected.
 * - `--layout-padding-*` and `--_section-padding-propagated` -> `initial`.
 *   Descendants ADD these, so zeroing them would strip padding rather than
 *   restore it. `initial` makes each guaranteed-invalid, so readers fall
 *   through their own `var(…, fallback)` chain and land on the theme default —
 *   which is what an overlay at the top of the tree should show.
 *
 * `initial` is also why propagation moved off `--solo-section-padding`: that
 * name is public theme surface, set at the theme root, and making it invalid
 * here would blank the theme's own section padding inside every overlay.
 *
 * Apply on the overlay's outermost styled element.
 *
 * @example
 * ```
 * <dialog className={cn(styles.dialog, overlayPaddingReset.reset)} />
 * ```
 */
export const overlayPaddingReset = {
  reset: [
    // Subtracted by descendants — the overlay root has no padding to escape.
    '[--container-padding-inline-start:0px] [--container-padding-inline-end:0px]',
    '[--container-padding-block-start:0px] [--container-padding-block-end:0px]',
    // Added by descendants — fall through to each reader's own default.
    '[--layout-padding-outer-x:initial] [--layout-padding-outer-y:initial]',
    '[--layout-padding-inner-x:initial] [--layout-padding-inner-y:initial]',
    '[--_section-padding-propagated:initial]',
  ].join(' '),
} as const;
