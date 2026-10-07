/**
 * @file Skeleton.tsx
 * @input Uses React, CSS keyframes and theme tokens
 * @output Exports Skeleton component, SkeletonProps, SkeletonRadius types
 * @position Core implementation of skeleton loading placeholder
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Skeleton/Skeleton.doc.mjs
 * - /packages/core/src/Skeleton/index.ts
 * - /apps/storybook/stories/Skeleton.stories.tsx
 */

import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn, cssLength} from '../utils/cn';

// =============================================================================
// Animation Timing Constants
// =============================================================================

/**
 * Initial delay before animation starts (ms).
 * Prevents flash of animation for fast-loading content.
 */
const DELAY_TIME = 1000;

/**
 * Stagger increment between sequential skeleton elements (ms).
 * Creates a wave effect when multiple skeletons are used together.
 */
const STAGGER_TIME = 100;

// =============================================================================
// Animation Keyframes
// =============================================================================

// Keyframes `solo-skeleton-fade` (opacity 0.25 → 1) live in Skeleton.css.

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: cn(
    'bg-(--color-skeleton)',
    'contrast-more:[background-color:color-mix(in_srgb,var(--color-skeleton),var(--color-text-primary)_30%)]',
    // Forced colors (Windows High Contrast) strips painted backgrounds,
    // which would make the placeholder invisible. GrayText is a system
    // color, so it survives forcing and keeps the placeholder visible
    // (WCAG 1.4.11). Listed after prefers-contrast so it wins when both
    // media features are active.
    'forced-colors:bg-[GrayText]',
    'opacity-25',
    // The resting 0.25 opacity would render GrayText nearly invisible on
    // Canvas; full opacity keeps the static placeholder perceivable (the
    // fade animation still pulses when motion is allowed).
    'forced-colors:[opacity:1]',
  ),
  animate: cn(
    '[animation-direction:alternate] [animation-duration:var(--duration-medium-max)] [animation-iteration-count:infinite]',
    // Disable the pulse under reduced-motion; the static placeholder still
    // reads as loading (complex-20).
    '[animation-name:solo-skeleton-fade] motion-reduce:[animation-name:none]',
    '[animation-timing-function:steps(10,end)]',
  ),
  // Dynamic values travel through scoped custom properties (set inline) so a
  // consumer className can still override them.
  dimensions: 'w-(--_skeleton-width) h-(--_skeleton-height)',
  animationDelay: '[animation-delay:var(--_skeleton-animation-delay)]',
} as const;

const radiusStyles = {
  // Numeric scale names (preferred)
  none: 'rounded-none',
  0: 'rounded-(--radius-none)',
  1: 'rounded-(--radius-inner)',
  2: 'rounded-(--radius-element)',
  3: 'rounded-(--radius-container)',
  4: 'rounded-(--radius-container)',
  rounded: 'rounded-(--radius-full)',
} as const;

// =============================================================================
// Types
// =============================================================================

export type SkeletonRadius = keyof typeof radiusStyles;

// =============================================================================
// Component
// =============================================================================

export interface SkeletonProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Width of the skeleton.
   * Accepts a number (pixels) or string (any CSS value).
   * @default '100%'
   */
  width?: number | string;
  /**
   * Height of the skeleton.
   * Accepts a number (pixels) or string (any CSS value).
   * @default '100%'
   */
  height?: number | string;
  /**
   * Border radius of the skeleton, using design token scale.
   * - 'none': No border radius (sharp corners)
   * - 0: radius-0 token (0px)
   * - 1: radius-1 token (4px)
   * - 2: radius-2 token (8px)
   * - 3: radius-3 token (12px, default)
   * - 4: radius-4 token (16px)
   * - 'rounded': Fully rounded (for avatars, pills)
   * @default 3
   */
  radius?: SkeletonRadius;
  /**
   * Index for staggered animation timing.
   * Use sequential indices (0, 1, 2, ...) for multiple skeletons
   * to create a wave effect.
   * @default 0
   */
  index?: number;
  /**
   * Test ID for testing purposes.
   */
  'data-testid'?: string;
}

/**
 * A placeholder shape that indicates content is loading.
 * Renders a pulsing block with configurable width, height, and border radius.
 * Use the `index` prop to stagger animation timing across multiple skeletons.
 *
 * @example
 * ```
 * <Skeleton width={200} height={20} />
 * <Skeleton width={40} height={40} radius="rounded" />
 * <Skeleton width={300} height={16} index={0} />
 * <Skeleton width={280} height={16} index={1} />
 * ```
 */
export function Skeleton({
  width = '100%',
  height = '100%',
  radius: radiusProp = 3,
  index = 0,
  'data-testid': testId,
  className,
  style,
  ref,
  ...props
}: SkeletonProps) {
  return (
    <div
      ref={ref}
      // Purely decorative loading placeholder — hide from assistive tech so it
      // isn't announced as empty content. The surrounding region should convey
      // the loading/busy state (e.g. aria-busy) (complex-20). Consumers can
      // override via props if a specific skeleton must be exposed.
      aria-hidden="true"
      data-testid={testId}
      {...mergeProps(
        themeProps('skeleton'),
        {
          className: cn(
            styles.root,
            styles.animate,
            radiusStyles[radiusProp],
            styles.dimensions,
            styles.animationDelay,
            className,
          ),
          style: {
            '--_skeleton-width': cssLength(width),
            '--_skeleton-height': cssLength(height),
            '--_skeleton-animation-delay': `${DELAY_TIME + STAGGER_TIME * index}ms`,
            ...style,
          } as React.CSSProperties,
        },
      )}
      {...props}
    />
  );
}

Skeleton.displayName = 'Skeleton';
