/**
 * @file Card.tsx
 * @input Uses container utility, Tailwind classes
 * @output Exports Card component, CardProps, CardVariant types
 * @position Core card container component
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Card/Card.doc.mjs (props table, features)
 * - /packages/core/src/Card/index.ts (exports if types change)
 * - /apps/storybook/stories/Card.stories.tsx (storybook stories)
 */

import type {ReactNode} from 'react';
import {container} from '../Layout/container.styles';
import type {SpacingToken} from '../Layout/container.styles';
import {spacingStepToToken} from '../Layout/padding.styles';
import type {Elevation, SizeValue, SpacingStep} from '../utils/types';
import {mergeProps} from '../utils';
import {cn, cssLength} from '../utils/cn';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import type {CardVariantMap} from './index';

// =============================================================================
// Variant type
// =============================================================================

/**
 * Background color variant for Card, derived from CardVariantMap.
 * Extensible via module augmentation of CardVariantMap.
 *
 * - `default`: standard card background with visible border
 * - `transparent`: no background, no visible border — for grouping content without visual weight
 * - `muted`: subtle muted background for de-emphasised cards
 * - Non-semantic palette: `blue | cyan | gray | green | orange | pink | purple | red | teal | yellow`
 *   Each uses the corresponding `--color-background-<name>` token (20% opacity tint).
 *
 * Only `default` draws a visible border. Its border width is subtracted from
 * the padding so the total inset (border + padding) equals the padding token —
 * keeping content geometry faithful to the spacing scale and identical to the
 * borderless variants. Themes can override borderWidth/borderColor.
 */
export type CardVariant = keyof CardVariantMap;

// =============================================================================
// Styles
// =============================================================================

const styles = {
  card: cn(
    '[--_card-radius:var(--radius-container)]',
    'rounded-(--_card-radius)',
    'overflow-clip',
    // Resting elevation is set via --_card-elevation (see elevationStyles).
    // The shadow list also reads --_card-ring so composing surfaces — e.g.
    // SelectableCard's inset selection ring — can layer their own shadow
    // alongside elevation instead of clobbering the single box-shadow property.
    // Unset vars fall back to a transparent no-op shadow.
    '[box-shadow:var(--_card-ring,0_0_transparent),var(--_card-elevation,0_0_transparent)]',
  ),
  // The border is drawn *inside* the padding — its width is subtracted from
  // each side — so total inset (border + padding) equals the padding token
  // rather than exceeding it by the border width.
  withBorder: cn(
    '[border-width:var(--border-width)] [border-style:solid] border-(--color-border)',
    'ps-[calc(var(--container-padding-inline-start)-var(--border-width))]',
    'pe-[calc(var(--container-padding-inline-end)-var(--border-width))]',
    'pbs-[calc(var(--container-padding-block-start)-var(--border-width))]',
    'pbe-[calc(var(--container-padding-block-end)-var(--border-width))]',
  ),
  // Fixed-height cards scroll content; overflow: auto also clips to border-radius
  scrollable: 'overflow-auto',
} as const;

// Background variant styles — each maps to a design token. Typed as PARTIAL
// over CardVariant: a theme can add a variant, and the record deliberately has
// no entry for it, so the lookup is undefined, `cn` drops it, and the card
// takes base styles for the theme rule to paint over.
const variantStyles: Partial<Record<CardVariant, string>> = {
  default: 'bg-(--color-background-card)',
  transparent: 'bg-transparent',
  muted: 'bg-(--color-background-muted)',
  blue: 'bg-(--color-background-blue)',
  cyan: 'bg-(--color-background-cyan)',
  gray: 'bg-(--color-background-gray)',
  green: 'bg-(--color-background-green)',
  orange: 'bg-(--color-background-orange)',
  pink: 'bg-(--color-background-pink)',
  purple: 'bg-(--color-background-purple)',
  red: 'bg-(--color-background-red)',
  teal: 'bg-(--color-background-teal)',
  yellow: 'bg-(--color-background-yellow)',
};

// Elevation → shadow-token map. Sets the private --_card-elevation variable
// (not box-shadow directly) so it composes with --_card-ring in the shadow
// list above — a selection ring and a resting elevation coexist without one
// overwriting the other. 'none' is a transparent no-op (not the CSS literal
// `none`, which would be invalid inside the comma-separated shadow list).
const elevationStyles = {
  none: '[--_card-elevation:0_0_transparent]',
  low: '[--_card-elevation:var(--shadow-low)]',
  med: '[--_card-elevation:var(--shadow-med)]',
  high: '[--_card-elevation:var(--shadow-high)]',
} as const;

// Dynamic sizing props travel through scoped custom properties so a
// `className` can still override them.
const sizingStyles = {
  width: 'w-(--_card-width)',
  height: 'h-(--_card-height)',
  maxWidth: 'max-w-(--_card-max-width)',
  minHeight: 'min-h-(--_card-min-height)',
} as const;

export type {SizeValue} from '../utils/types';

export interface CardProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Width of the card.
   * Numbers are treated as pixels, strings are used as-is.
   */
  width?: SizeValue;

  /**
   * Height of the card.
   * Numbers are treated as pixels, strings are used as-is.
   */
  height?: SizeValue;

  /**
   * Maximum width of the card.
   * Numbers are treated as pixels, strings are used as-is.
   */
  maxWidth?: SizeValue;

  /**
   * Minimum height of the card.
   * Numbers are treated as pixels, strings are used as-is.
   */
  minHeight?: SizeValue;

  /**
   * Content to render inside the card.
   * Should typically be Layout child components.
   */
  children?: ReactNode;

  /**
   * Internal padding of the card using the spacing scale.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   *
   * Omit it and the card takes the theme's card padding rather than a step, so
   * passing a step is a decision to override the theme, not a way to restate
   * the default.
   *
   * @default the theme's card padding (spacing step 4 with no theme)
   */
  padding?: SpacingStep;

  /**
   * Background color variant.
   * - `default`: standard card background with visible border
   * - `transparent`: no background, no visible border — for grouping without visual weight
   * - `muted`: subtle muted background for de-emphasised cards
   * - Non-semantic: `blue`, `cyan`, `gray`, `green`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow`
   * @default 'default'
   */
  variant?: CardVariant;

  /**
   * Resting elevation — the shadow depth the card sits at.
   * `none` is flat; `low`/`med`/`high` map to the shadow token scale.
   * @default 'none'
   */
  elevation?: Elevation;
}

/**
 * A card container with border and themed styling.
 *
 * Applies card-specific appearance (background, border, border-radius)
 * and sets CSS variables for child layout components.
 *
 * @compositionHint Use as a top-level container for elevated content.
 * Pair with Layout for structured header/content/footer layouts.
 *
 * @example
 * ```
 * <Card width={400} height={300}>
 *   <Layout
 *     header={<LayoutHeader hasDivider>Title</LayoutHeader>}
 *     content={<LayoutContent>Content</LayoutContent>}
 *     footer={<LayoutFooter hasDivider>Actions</LayoutFooter>}
 *   />
 * </Card>
 * ```
 *
 * @example
 * ```
 * <Card variant="blue" width={300}>
 *   <p>Blue tinted card</p>
 * </Card>
 * ```
 *
 * @example
 * ```
 * <Card variant="muted" width={300}>
 *   <p>Subtle de-emphasised card</p>
 * </Card>
 * ```
 */
export function Card({
  width,
  height,
  maxWidth,
  minHeight,
  children,
  padding,
  variant = 'default',
  elevation = 'none',
  className,
  style,
  ref,
  ...props
}: CardProps) {
  // Only enable scrolling when card has a fixed height (not null/undefined and not "auto")
  const hasFixedHeight = height != null && height !== 'auto';

  // When no explicit padding prop, use theme default (set via container tokens)
  const useThemeDefault = padding == null;
  const paddingToken = useThemeDefault
    ? undefined
    : (spacingStepToToken[padding] as SpacingToken);

  const containerProps = container(
    paddingToken == null
      ? {useThemeDefault: 'card'}
      : {
          paddingInnerX: paddingToken,
          paddingInnerY: paddingToken,
          paddingOuterX: paddingToken,
          paddingOuterY: paddingToken,
        },
  );
  const hasSizing =
    width != null || height != null || maxWidth != null || minHeight != null;
  const internalStyle =
    hasSizing || containerProps.style
      ? ({
          ...(hasSizing && {
            '--_card-width': cssLength(width),
            '--_card-height': cssLength(height),
            '--_card-max-width': cssLength(maxWidth),
            '--_card-min-height': cssLength(minHeight),
          }),
          ...containerProps.style,
        } as React.CSSProperties)
      : undefined;

  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('card', {variant, elevation}),
        {
          className: cn(
            styles.card,
            // A theme's own variant is not a key here: the lookup is
            // undefined, `cn` drops it, and the theme rule paints over base
            // styles.
            variantStyles[variant],
            elevationStyles[elevation],
            hasFixedHeight && styles.scrollable,
            width != null && sizingStyles.width,
            height != null && sizingStyles.height,
            maxWidth != null && sizingStyles.maxWidth,
            minHeight != null && sizingStyles.minHeight,
            containerProps.className,
            // Applied after the container padding so the border-inset calc
            // wins; it reads the --container-padding-* vars set above.
            variant === 'default' && styles.withBorder,
          ),
          style: internalStyle,
        },
        className,
        style,
      )}
      {...props}>
      {children}
    </div>
  );
}

Card.displayName = 'Card';
