/**
 * @file Center.tsx
 * @input Uses React, Tailwind classes for centering, Layout padding.styles for spacing-scale padding
 * @output Exports Center component and CenterProps
 * @position Center component for one- or two-axis flex centering
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Center/Center.doc.mjs
 * - /packages/core/src/Center/Center.test.tsx
 * - /apps/storybook/stories/Center.stories.tsx
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import type {SizeValue, SpacingStep} from '../utils/types';
import {
  paddingInlineStartStyles,
  paddingInlineEndStyles,
  paddingBlockStartStyles,
  paddingBlockEndStyles,
} from '../Layout/padding.styles';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn, cssLength} from '../utils/cn';

const styles = {
  base: 'flex',
  inline: 'inline-flex',
  alignItemsCenter: 'items-center',
  justifyContentCenter: 'justify-center',
} as const;

// Dynamic sizing props travel through scoped custom properties (set inline)
// so a consumer className can still override them.
const sizingStyles = {
  width: 'w-(--_center-width)',
  height: 'h-(--_center-height)',
  maxWidth: 'max-w-(--_center-max-width)',
  minHeight: 'min-h-(--_center-min-height)',
} as const;

export type CenterAxis = 'both' | 'horizontal' | 'vertical';

export interface CenterProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Center mode. In horizontal writing:
   * - `both`: Center on the flex main and cross axes (default)
   * - `horizontal`: Center on the flex main/inline axis
   * - `vertical`: Center on the flex cross/block axis
   *
   * In vertical writing, the current single-axis behavior still follows those
   * logical flex axes rather than the physical names. `both` centers both axes.
   * @default 'both'
   */
  axis?: CenterAxis;

  /**
   * Width of the container.
   * Numbers are treated as pixels, strings are used as-is (e.g., '100%').
   */
  width?: SizeValue;

  /**
   * Height of the container.
   * Numbers are treated as pixels, strings are used as-is (e.g., '100%').
   */
  height?: SizeValue;

  /**
   * Maximum width of the container.
   * Numbers are treated as pixels, strings are used as-is (e.g., '100%').
   */
  maxWidth?: SizeValue;

  /**
   * Minimum height of the container.
   * Numbers are treated as pixels, strings are used as-is (e.g., '100%').
   */
  minHeight?: SizeValue;

  /**
   * Inner padding on all sides, using the spacing scale.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   *
   * Matches the `padding` prop on `Stack`, `Card`, `LayoutContent`, and `LayoutPanel`.
   */
  padding?: SpacingStep;

  /**
   * Logical inline-axis padding, using the spacing scale.
   * Overrides `padding` on the inline axis when both are set.
   */
  paddingInline?: SpacingStep;

  /**
   * Logical inline-start padding, using the spacing scale. The resolved
   * physical edge depends on writing mode and direction.
   * Overrides `paddingInline` and `padding` on that edge only.
   */
  paddingInlineStart?: SpacingStep;

  /**
   * Logical inline-end padding, using the spacing scale. The resolved
   * physical edge depends on writing mode and direction.
   * Overrides `paddingInline` and `padding` on that edge only.
   */
  paddingInlineEnd?: SpacingStep;

  /**
   * Logical block-axis padding, using the spacing scale.
   * Overrides `padding` on the block axis when both are set.
   */
  paddingBlock?: SpacingStep;

  /**
   * Logical block-start padding, using the spacing scale. The resolved physical
   * edge depends on writing mode.
   * Overrides `paddingBlock` and `padding` on that edge only.
   */
  paddingBlockStart?: SpacingStep;

  /**
   * Logical block-end padding, using the spacing scale. The resolved physical
   * edge depends on writing mode.
   * Overrides `paddingBlock` and `padding` on that edge only.
   */
  paddingBlockEnd?: SpacingStep;

  /**
   * Whether to make the container inline-flex (useful for text/icons).
   * @default false
   */
  isInline?: boolean;

  /**
   * Content to render inside the center container.
   */
  children: ReactNode;
}

/**
 * Center component for centering children on one or both flex axes.
 *
 * In horizontal writing, the single-axis names match physical horizontal and
 * vertical dimensions. In vertical writing, the current single-axis behavior
 * follows flex main/cross axes; `both` still centers on both axes.
 *
 * @example
 * ```
 * <Center width={300} height={200}>
 *   <Content />
 * </Center>
 * ```
 */
export function Center({
  axis = 'both',
  width,
  height,
  maxWidth,
  minHeight,
  padding,
  paddingInline,
  paddingInlineStart,
  paddingInlineEnd,
  paddingBlock,
  paddingBlockStart,
  paddingBlockEnd,
  isInline = false,
  children,
  className,
  style,
  ref,
  ...props
}: CenterProps) {
  // Resolve padding to per-edge values. Most specific wins, per edge:
  // edge prop -> axis prop -> `padding`.
  const resolvedPaddingInlineStart =
    paddingInlineStart ?? paddingInline ?? padding;
  const resolvedPaddingInlineEnd = paddingInlineEnd ?? paddingInline ?? padding;
  const resolvedPaddingBlockStart =
    paddingBlockStart ?? paddingBlock ?? padding;
  const resolvedPaddingBlockEnd = paddingBlockEnd ?? paddingBlock ?? padding;

  const sizingVars: Record<string, string> = {};
  if (width != null) sizingVars['--_center-width'] = cssLength(width);
  if (height != null) sizingVars['--_center-height'] = cssLength(height);
  if (maxWidth != null) sizingVars['--_center-max-width'] = cssLength(maxWidth);
  if (minHeight != null) {
    sizingVars['--_center-min-height'] = cssLength(minHeight);
  }
  const hasSizing = Object.keys(sizingVars).length > 0;

  const mergedProps = mergeProps(
    themeProps('center', {axis}),
    cn(
      isInline ? styles.inline : styles.base,
      (axis === 'both' || axis === 'vertical') && styles.alignItemsCenter,
      (axis === 'both' || axis === 'horizontal') && styles.justifyContentCenter,
      width != null && sizingStyles.width,
      height != null && sizingStyles.height,
      maxWidth != null && sizingStyles.maxWidth,
      minHeight != null && sizingStyles.minHeight,
      resolvedPaddingInlineStart != null &&
        paddingInlineStartStyles[resolvedPaddingInlineStart],
      resolvedPaddingInlineEnd != null &&
        paddingInlineEndStyles[resolvedPaddingInlineEnd],
      resolvedPaddingBlockStart != null &&
        paddingBlockStartStyles[resolvedPaddingBlockStart],
      resolvedPaddingBlockEnd != null &&
        paddingBlockEndStyles[resolvedPaddingBlockEnd],
      className,
    ),
    hasSizing || style != null
      ? ({...sizingVars, ...style} as React.CSSProperties)
      : undefined,
  );

  return (
    <div ref={ref} {...props} {...mergedProps}>
      {children}
    </div>
  );
}

Center.displayName = 'Center';
