/**
 * @file container.styles.ts
 * @input Uses spacing tokens from theme (Tailwind classes)
 * @output `container()` utility returning `{className, style}` for layout
 *   container styling
 * @position Layout utility; used by Card, Section components
 *
 * ## Public API for themes
 *
 * Themes set `padding` on container component overrides. The theme build
 * pipeline expands this to component-scoped CSS custom properties, emitting
 * the `--solo-*` tokens that the component reads:
 *
 *   --solo-card-padding            (shorthand — all sides; emitted)
 *   --solo-card-padding-inline     (horizontal)
 *   --solo-card-padding-block-start
 *   --solo-card-padding-block-end
 *
 * Read order per level: `var(--solo-…, <next level>)`, terminating at
 * `--spacing-4`. Same pattern for section and dialog.
 *
 * ```ts
 * components: {
 *   card: { base: { padding: '20px' } },          // → --solo-card-padding: 20px
 *   section: { base: { padding: '12px 20px' } },  // → directional tokens
 *   dialog: { base: { padding: '16px' } },
 * }
 * ```
 *
 * Internal variables (`--layout-padding-inner-x`, `--container-padding-*`,
 * `--_section-padding-propagated`) are implementation details and must not be
 * referenced by themes. They also do not cross an overlay boundary — see
 * `overlayPaddingReset` in padding.styles.ts.
 *
 * SYNC: When modified, update /packages/core/src/Layout/Layout.doc.mjs
 */

import {cn} from '../utils/cn';

/**
 * Spacing token keys for padding props.
 */
export type SpacingToken =
  | 'spacing0'
  | 'spacing0_5'
  | 'spacing1'
  | 'spacing1_5'
  | 'spacing2'
  | 'spacing3'
  | 'spacing4'
  | 'spacing5'
  | 'spacing6'
  | 'spacing7'
  | 'spacing8'
  | 'spacing9'
  | 'spacing10'
  | 'spacing11'
  | 'spacing12';

const baseStyles = {
  container: cn(
    'box-border',
    'ps-(--container-padding-inline-start) pe-(--container-padding-inline-end)',
    'pbs-(--container-padding-block-start) pbe-(--container-padding-block-end)',
  ),
} as const;

/**
 * Component-scoped padding tokens.
 *
 * Each container component (card, section, dialog) has public CSS custom
 * properties that themes can set. The pipeline emits the `--solo-*` names,
 * which the component reads via `var(--solo-…, …)`:
 *
 *   --solo-card-padding          (shorthand — all sides)
 *   --solo-card-padding-inline
 *   --solo-card-padding-inline-start
 *   --solo-card-padding-inline-end
 *   --solo-card-padding-block-start
 *   --solo-card-padding-block-end
 *
 * The theme build pipeline maps `padding: '20px'` on a container component
 * to these tokens. The component reads them with var() fallbacks to --spacing-4.
 *
 * Chains, per component: --solo-* then the next specificity level,
 * terminating at --spacing-4 (written out literally in each class — Tailwind
 * needs literal class strings; see naming.ts for the prefix policy):
 *
 *   shorthand    = var(--solo-X-padding, var(--spacing-4))
 *   inline       = var(--solo-X-padding-inline, shorthand)
 *   inline-start = var(--solo-X-padding-inline-start, inline)
 *   inline-end   = var(--solo-X-padding-inline-end, inline)
 *   block-start  = var(--solo-X-padding-block-start, shorthand)
 *   block-end    = var(--solo-X-padding-block-end, shorthand)
 *
 * Section's shorthand reads `--_section-padding-propagated` (set by an
 * ancestor Section with explicit padding) AHEAD of the public theme token, so
 * a propagated value still wins over the theme for nested sections. Splitting
 * the two names is what lets an overlay drop the inherited value at its
 * boundary while keeping the theme's — see `overlayPaddingReset` in
 * padding.styles.ts.
 */
const cardDefaultPaddingStyles = {
  containerPaddingInlineStart:
    '[--container-padding-inline-start:var(--solo-card-padding-inline-start,var(--solo-card-padding-inline,var(--solo-card-padding,var(--spacing-4))))]',
  containerPaddingInlineEnd:
    '[--container-padding-inline-end:var(--solo-card-padding-inline-end,var(--solo-card-padding-inline,var(--solo-card-padding,var(--spacing-4))))]',
  containerPaddingBlockStart:
    '[--container-padding-block-start:var(--solo-card-padding-block-start,var(--solo-card-padding,var(--spacing-4)))]',
  containerPaddingBlockEnd:
    '[--container-padding-block-end:var(--solo-card-padding-block-end,var(--solo-card-padding,var(--spacing-4)))]',
  layoutPaddingOuterX: '[--layout-padding-outer-x:var(--solo-card-padding-inline-start,var(--solo-card-padding-inline,var(--solo-card-padding,var(--spacing-4))))]',
  layoutPaddingOuterY: '[--layout-padding-outer-y:var(--solo-card-padding-block-start,var(--solo-card-padding,var(--spacing-4)))]',
  layoutPaddingInnerX: '[--layout-padding-inner-x:var(--solo-card-padding-inline-start,var(--solo-card-padding-inline,var(--solo-card-padding,var(--spacing-4))))]',
  layoutPaddingInnerY: '[--layout-padding-inner-y:var(--solo-card-padding-block-start,var(--solo-card-padding,var(--spacing-4)))]',
} as const;

const sectionDefaultPaddingStyles = {
  containerPaddingInlineStart:
    '[--container-padding-inline-start:var(--solo-section-padding-inline-start,var(--solo-section-padding-inline,var(--_section-padding-propagated,var(--solo-section-padding,var(--spacing-4)))))]',
  containerPaddingInlineEnd:
    '[--container-padding-inline-end:var(--solo-section-padding-inline-end,var(--solo-section-padding-inline,var(--_section-padding-propagated,var(--solo-section-padding,var(--spacing-4)))))]',
  containerPaddingBlockStart:
    '[--container-padding-block-start:var(--solo-section-padding-block-start,var(--_section-padding-propagated,var(--solo-section-padding,var(--spacing-4))))]',
  containerPaddingBlockEnd:
    '[--container-padding-block-end:var(--solo-section-padding-block-end,var(--_section-padding-propagated,var(--solo-section-padding,var(--spacing-4))))]',
  layoutPaddingOuterX: '[--layout-padding-outer-x:var(--solo-section-padding-inline-start,var(--solo-section-padding-inline,var(--_section-padding-propagated,var(--solo-section-padding,var(--spacing-4)))))]',
  layoutPaddingOuterY: '[--layout-padding-outer-y:var(--solo-section-padding-block-start,var(--_section-padding-propagated,var(--solo-section-padding,var(--spacing-4))))]',
  layoutPaddingInnerX: '[--layout-padding-inner-x:var(--solo-section-padding-inline-start,var(--solo-section-padding-inline,var(--_section-padding-propagated,var(--solo-section-padding,var(--spacing-4)))))]',
  layoutPaddingInnerY: '[--layout-padding-inner-y:var(--solo-section-padding-block-start,var(--_section-padding-propagated,var(--solo-section-padding,var(--spacing-4))))]',
} as const;

const dialogDefaultPaddingStyles = {
  containerPaddingInlineStart:
    '[--container-padding-inline-start:var(--solo-dialog-padding-inline-start,var(--solo-dialog-padding-inline,var(--solo-dialog-padding,var(--spacing-4))))]',
  containerPaddingInlineEnd:
    '[--container-padding-inline-end:var(--solo-dialog-padding-inline-end,var(--solo-dialog-padding-inline,var(--solo-dialog-padding,var(--spacing-4))))]',
  containerPaddingBlockStart:
    '[--container-padding-block-start:var(--solo-dialog-padding-block-start,var(--solo-dialog-padding,var(--spacing-4)))]',
  containerPaddingBlockEnd:
    '[--container-padding-block-end:var(--solo-dialog-padding-block-end,var(--solo-dialog-padding,var(--spacing-4)))]',
  layoutPaddingOuterX: '[--layout-padding-outer-x:var(--solo-dialog-padding-inline-start,var(--solo-dialog-padding-inline,var(--solo-dialog-padding,var(--spacing-4))))]',
  layoutPaddingOuterY: '[--layout-padding-outer-y:var(--solo-dialog-padding-block-start,var(--solo-dialog-padding,var(--spacing-4)))]',
  layoutPaddingInnerX: '[--layout-padding-inner-x:var(--solo-dialog-padding-inline-start,var(--solo-dialog-padding-inline,var(--solo-dialog-padding,var(--spacing-4))))]',
  layoutPaddingInnerY: '[--layout-padding-inner-y:var(--solo-dialog-padding-block-start,var(--solo-dialog-padding,var(--spacing-4)))]',
} as const;

/**
 * Map from component name to its theme default padding styles.
 * Each component reads from its own public CSS custom property.
 */
const themeDefaultStyles = {
  card: cardDefaultPaddingStyles,
  section: sectionDefaultPaddingStyles,
  dialog: dialogDefaultPaddingStyles,
};

export type ContainerComponent = keyof typeof themeDefaultStyles;

/**
 * Container inline padding styles for edge compensation.
 * Sets --container-padding-inline-start and --container-padding-inline-end so
 * edge-compensating children (bleed tables, dividers, etc.) know the inline
 * padding to compensate against.
 */
const containerPaddingInlineStartStyles = {
  spacing0: '[--container-padding-inline-start:var(--spacing-0)]',
  spacing0_5: '[--container-padding-inline-start:var(--spacing-0-5)]',
  spacing1: '[--container-padding-inline-start:var(--spacing-1)]',
  spacing1_5: '[--container-padding-inline-start:var(--spacing-1-5)]',
  spacing2: '[--container-padding-inline-start:var(--spacing-2)]',
  spacing3: '[--container-padding-inline-start:var(--spacing-3)]',
  spacing4: '[--container-padding-inline-start:var(--spacing-4)]',
  spacing5: '[--container-padding-inline-start:var(--spacing-5)]',
  spacing6: '[--container-padding-inline-start:var(--spacing-6)]',
  spacing7: '[--container-padding-inline-start:var(--spacing-7)]',
  spacing8: '[--container-padding-inline-start:var(--spacing-8)]',
  spacing9: '[--container-padding-inline-start:var(--spacing-9)]',
  spacing10: '[--container-padding-inline-start:var(--spacing-10)]',
  spacing11: '[--container-padding-inline-start:var(--spacing-11)]',
  spacing12: '[--container-padding-inline-start:var(--spacing-12)]',
} as const satisfies Record<SpacingToken, string>;

const containerPaddingInlineEndStyles = {
  spacing0: '[--container-padding-inline-end:var(--spacing-0)]',
  spacing0_5: '[--container-padding-inline-end:var(--spacing-0-5)]',
  spacing1: '[--container-padding-inline-end:var(--spacing-1)]',
  spacing1_5: '[--container-padding-inline-end:var(--spacing-1-5)]',
  spacing2: '[--container-padding-inline-end:var(--spacing-2)]',
  spacing3: '[--container-padding-inline-end:var(--spacing-3)]',
  spacing4: '[--container-padding-inline-end:var(--spacing-4)]',
  spacing5: '[--container-padding-inline-end:var(--spacing-5)]',
  spacing6: '[--container-padding-inline-end:var(--spacing-6)]',
  spacing7: '[--container-padding-inline-end:var(--spacing-7)]',
  spacing8: '[--container-padding-inline-end:var(--spacing-8)]',
  spacing9: '[--container-padding-inline-end:var(--spacing-9)]',
  spacing10: '[--container-padding-inline-end:var(--spacing-10)]',
  spacing11: '[--container-padding-inline-end:var(--spacing-11)]',
  spacing12: '[--container-padding-inline-end:var(--spacing-12)]',
} as const satisfies Record<SpacingToken, string>;

/**
 * Container block-start/block-end padding styles for vertical bleed.
 * Split into start and end because Layout areas have asymmetric block padding
 * (e.g., Header: block-start=outer-y, block-end=inner-y).
 */
const containerPaddingBlockStartStyles = {
  spacing0: '[--container-padding-block-start:var(--spacing-0)]',
  spacing0_5: '[--container-padding-block-start:var(--spacing-0-5)]',
  spacing1: '[--container-padding-block-start:var(--spacing-1)]',
  spacing1_5: '[--container-padding-block-start:var(--spacing-1-5)]',
  spacing2: '[--container-padding-block-start:var(--spacing-2)]',
  spacing3: '[--container-padding-block-start:var(--spacing-3)]',
  spacing4: '[--container-padding-block-start:var(--spacing-4)]',
  spacing5: '[--container-padding-block-start:var(--spacing-5)]',
  spacing6: '[--container-padding-block-start:var(--spacing-6)]',
  spacing7: '[--container-padding-block-start:var(--spacing-7)]',
  spacing8: '[--container-padding-block-start:var(--spacing-8)]',
  spacing9: '[--container-padding-block-start:var(--spacing-9)]',
  spacing10: '[--container-padding-block-start:var(--spacing-10)]',
  spacing11: '[--container-padding-block-start:var(--spacing-11)]',
  spacing12: '[--container-padding-block-start:var(--spacing-12)]',
} as const satisfies Record<SpacingToken, string>;

const containerPaddingBlockEndStyles = {
  spacing0: '[--container-padding-block-end:var(--spacing-0)]',
  spacing0_5: '[--container-padding-block-end:var(--spacing-0-5)]',
  spacing1: '[--container-padding-block-end:var(--spacing-1)]',
  spacing1_5: '[--container-padding-block-end:var(--spacing-1-5)]',
  spacing2: '[--container-padding-block-end:var(--spacing-2)]',
  spacing3: '[--container-padding-block-end:var(--spacing-3)]',
  spacing4: '[--container-padding-block-end:var(--spacing-4)]',
  spacing5: '[--container-padding-block-end:var(--spacing-5)]',
  spacing6: '[--container-padding-block-end:var(--spacing-6)]',
  spacing7: '[--container-padding-block-end:var(--spacing-7)]',
  spacing8: '[--container-padding-block-end:var(--spacing-8)]',
  spacing9: '[--container-padding-block-end:var(--spacing-9)]',
  spacing10: '[--container-padding-block-end:var(--spacing-10)]',
  spacing11: '[--container-padding-block-end:var(--spacing-11)]',
  spacing12: '[--container-padding-block-end:var(--spacing-12)]',
} as const satisfies Record<SpacingToken, string>;

const paddingOuterXStyles = {
  spacing0: '[--layout-padding-outer-x:var(--spacing-0)]',
  spacing0_5: '[--layout-padding-outer-x:var(--spacing-0-5)]',
  spacing1: '[--layout-padding-outer-x:var(--spacing-1)]',
  spacing1_5: '[--layout-padding-outer-x:var(--spacing-1-5)]',
  spacing2: '[--layout-padding-outer-x:var(--spacing-2)]',
  spacing3: '[--layout-padding-outer-x:var(--spacing-3)]',
  spacing4: '[--layout-padding-outer-x:var(--spacing-4)]',
  spacing5: '[--layout-padding-outer-x:var(--spacing-5)]',
  spacing6: '[--layout-padding-outer-x:var(--spacing-6)]',
  spacing7: '[--layout-padding-outer-x:var(--spacing-7)]',
  spacing8: '[--layout-padding-outer-x:var(--spacing-8)]',
  spacing9: '[--layout-padding-outer-x:var(--spacing-9)]',
  spacing10: '[--layout-padding-outer-x:var(--spacing-10)]',
  spacing11: '[--layout-padding-outer-x:var(--spacing-11)]',
  spacing12: '[--layout-padding-outer-x:var(--spacing-12)]',
} as const satisfies Record<SpacingToken, string>;

const paddingOuterYStyles = {
  spacing0: '[--layout-padding-outer-y:var(--spacing-0)]',
  spacing0_5: '[--layout-padding-outer-y:var(--spacing-0-5)]',
  spacing1: '[--layout-padding-outer-y:var(--spacing-1)]',
  spacing1_5: '[--layout-padding-outer-y:var(--spacing-1-5)]',
  spacing2: '[--layout-padding-outer-y:var(--spacing-2)]',
  spacing3: '[--layout-padding-outer-y:var(--spacing-3)]',
  spacing4: '[--layout-padding-outer-y:var(--spacing-4)]',
  spacing5: '[--layout-padding-outer-y:var(--spacing-5)]',
  spacing6: '[--layout-padding-outer-y:var(--spacing-6)]',
  spacing7: '[--layout-padding-outer-y:var(--spacing-7)]',
  spacing8: '[--layout-padding-outer-y:var(--spacing-8)]',
  spacing9: '[--layout-padding-outer-y:var(--spacing-9)]',
  spacing10: '[--layout-padding-outer-y:var(--spacing-10)]',
  spacing11: '[--layout-padding-outer-y:var(--spacing-11)]',
  spacing12: '[--layout-padding-outer-y:var(--spacing-12)]',
} as const satisfies Record<SpacingToken, string>;

const paddingInnerXStyles = {
  spacing0: '[--layout-padding-inner-x:var(--spacing-0)]',
  spacing0_5: '[--layout-padding-inner-x:var(--spacing-0-5)]',
  spacing1: '[--layout-padding-inner-x:var(--spacing-1)]',
  spacing1_5: '[--layout-padding-inner-x:var(--spacing-1-5)]',
  spacing2: '[--layout-padding-inner-x:var(--spacing-2)]',
  spacing3: '[--layout-padding-inner-x:var(--spacing-3)]',
  spacing4: '[--layout-padding-inner-x:var(--spacing-4)]',
  spacing5: '[--layout-padding-inner-x:var(--spacing-5)]',
  spacing6: '[--layout-padding-inner-x:var(--spacing-6)]',
  spacing7: '[--layout-padding-inner-x:var(--spacing-7)]',
  spacing8: '[--layout-padding-inner-x:var(--spacing-8)]',
  spacing9: '[--layout-padding-inner-x:var(--spacing-9)]',
  spacing10: '[--layout-padding-inner-x:var(--spacing-10)]',
  spacing11: '[--layout-padding-inner-x:var(--spacing-11)]',
  spacing12: '[--layout-padding-inner-x:var(--spacing-12)]',
} as const satisfies Record<SpacingToken, string>;

const paddingInnerYStyles = {
  spacing0: '[--layout-padding-inner-y:var(--spacing-0)]',
  spacing0_5: '[--layout-padding-inner-y:var(--spacing-0-5)]',
  spacing1: '[--layout-padding-inner-y:var(--spacing-1)]',
  spacing1_5: '[--layout-padding-inner-y:var(--spacing-1-5)]',
  spacing2: '[--layout-padding-inner-y:var(--spacing-2)]',
  spacing3: '[--layout-padding-inner-y:var(--spacing-3)]',
  spacing4: '[--layout-padding-inner-y:var(--spacing-4)]',
  spacing5: '[--layout-padding-inner-y:var(--spacing-5)]',
  spacing6: '[--layout-padding-inner-y:var(--spacing-6)]',
  spacing7: '[--layout-padding-inner-y:var(--spacing-7)]',
  spacing8: '[--layout-padding-inner-y:var(--spacing-8)]',
  spacing9: '[--layout-padding-inner-y:var(--spacing-9)]',
  spacing10: '[--layout-padding-inner-y:var(--spacing-10)]',
  spacing11: '[--layout-padding-inner-y:var(--spacing-11)]',
  spacing12: '[--layout-padding-inner-y:var(--spacing-12)]',
} as const satisfies Record<SpacingToken, string>;

export interface ContainerOptions {
  /**
   * Shortcut to set all padding values at once.
   * Sets paddingOuterX, paddingOuterY, paddingInnerX, and paddingInnerY
   * to the same value. Individual properties override this when set.
   * @default 'spacing4'
   */
  padding?: SpacingToken;

  /**
   * Outer horizontal padding (left/right).
   * Sets --container-padding-inline-start/end and --layout-padding-outer-x CSS variables.
   * Overrides `padding` for the horizontal outer axis.
   */
  paddingOuterX?: SpacingToken;

  /**
   * Outer vertical padding (top/bottom).
   * Sets --container-padding-block-start, --container-padding-block-end, and --layout-padding-outer-y CSS variables.
   * Overrides `padding` for the vertical outer axis.
   */
  paddingOuterY?: SpacingToken;

  /**
   * Inner horizontal padding for content areas.
   * Sets --layout-padding-inner-x CSS variable.
   * Overrides `padding` for the horizontal inner axis.
   */
  paddingInnerX?: SpacingToken;

  /**
   * Inner vertical padding for content areas.
   * Sets --layout-padding-inner-y CSS variable.
   * Overrides `padding` for the vertical inner axis.
   */
  paddingInnerY?: SpacingToken;

  /**
   * When set to a component name ('card' | 'section'), internal layout
   * padding variables cascade from the component-specific public CSS
   * container tokens (set by theme pipeline from `padding` shorthand)
   * instead of being set to explicit spacing token values.
   *
   * This allows themes to override container padding via component-specific
   * public CSS custom properties without touching internal vars.
   *
   * Used by Card and Section when no explicit padding prop is provided.
   * @default undefined (uses explicit spacing token values)
   */
  useThemeDefault?: ContainerComponent;

  /**
   * Maximum height constraint for the container.
   * Sets --container-max-height CSS variable that Layout reads
   * to enable scroll containment in fill mode.
   * Accepts CSS length values (e.g., '75vh', '500px').
   */
  maxHeight?: string;
}

/**
 * The result of {@link container}: classes plus the inline custom property
 * for `maxHeight` (the one dynamic value). Spread both onto the element.
 */
export interface ContainerResult {
  className: string;
  style: React.CSSProperties | undefined;
}

/**
 * Utility to add layout container styles to any element.
 *
 * Returns `{className, style}`. `style` carries
 * `--container-max-height` when `maxHeight` is set, otherwise it is undefined.
 *
 * Sets CSS variables for padding that child layout components read:
 * - `--container-padding-inline-start` / `--container-padding-inline-end` — Inline padding for edge compensation and bleed
 * - `--container-padding-block-start` / `--container-padding-block-end` — Block padding for vertical bleed
 * - `--layout-padding-outer-x`, `--layout-padding-outer-y` (internal)
 * - `--layout-padding-inner-x`, `--layout-padding-inner-y` (internal)
 *
 * Themes should use `padding` (or `paddingBlock`/`paddingInline`) in
 * component overrides to adjust padding. Do not reference
 * `--layout-padding-*` variables directly.
 *
 * @example
 * ```
 * import { container } from '@solo/core/Layout';
 *
 * // Card container with default padding (theme-overridable via padding shorthand)
 * const c = container({ useThemeDefault: 'card' });
 * <div className={c.className} style={c.style}>
 *   <Layout ... />
 * </div>
 *
 * // Asymmetric — padding as base, paddingOuterY overrides vertical
 * const c = container({ padding: 'spacing3', paddingOuterY: 'spacing2' });
 * <div className={cn(c.className, customStyles.card)} style={c.style}>
 *   <Layout ... />
 * </div>
 * ```
 */
export function container({
  padding = 'spacing4',
  paddingOuterX,
  paddingOuterY,
  paddingInnerX,
  paddingInnerY,
  useThemeDefault,
  maxHeight,
}: ContainerOptions): ContainerResult {
  const outerX = paddingOuterX ?? padding;
  const outerY = paddingOuterY ?? padding;
  const innerX = paddingInnerX ?? padding;
  const innerY = paddingInnerY ?? padding;

  const style = maxHeight
    ? ({'--container-max-height': maxHeight} as React.CSSProperties)
    : undefined;

  // When useThemeDefault is a component name, cascade from the component's
  // public CSS container tokens (set by theme pipeline from `padding` shorthand)
  // so themes can override each component's padding independently.
  if (useThemeDefault) {
    const defaults = themeDefaultStyles[useThemeDefault];
    return {
      className: cn(
        baseStyles.container,
        defaults.containerPaddingInlineStart,
        defaults.containerPaddingInlineEnd,
        defaults.containerPaddingBlockStart,
        defaults.containerPaddingBlockEnd,
        defaults.layoutPaddingOuterX,
        defaults.layoutPaddingOuterY,
        defaults.layoutPaddingInnerX,
        defaults.layoutPaddingInnerY,
      ),
      style,
    };
  }

  return {
    className: cn(
      baseStyles.container,
      containerPaddingInlineStartStyles[outerX],
      containerPaddingInlineEndStyles[outerX],
      containerPaddingBlockStartStyles[outerY],
      containerPaddingBlockEndStyles[outerY],
      paddingOuterXStyles[outerX],
      paddingOuterYStyles[outerY],
      paddingInnerXStyles[innerX],
      paddingInnerYStyles[innerY],
    ),
    style,
  };
}
