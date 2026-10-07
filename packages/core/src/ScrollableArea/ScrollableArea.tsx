'use client';

/**
 * @file ScrollableArea.tsx
 * @input Logical scroll intent, accessible name, overscroll policy, viewport sizing, content padding, and content
 * @output Native scroll viewport with an observed real content box
 * @position Reference composition over useScrollableArea
 *
 * SYNC: When modified, update:
 * - /packages/core/src/ScrollableArea/ScrollableArea.test.tsx
 * - /packages/core/src/ScrollableArea/ScrollableArea.doc.mjs
 * - /apps/storybook/stories/ScrollableArea.stories.tsx
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {
  paddingStyles,
  paddingInlineStyles,
  paddingInlineStartStyles,
  paddingInlineEndStyles,
  paddingBlockStyles,
  paddingBlockStartStyles,
  paddingBlockEndStyles,
  containerPaddingInlineVarStyles,
  containerPaddingInlineStartVarStyles,
  containerPaddingInlineEndVarStyles,
  containerPaddingBlockStartVarStyles,
  containerPaddingBlockEndVarStyles,
} from '../Layout/padding.styles';
import type {SizeValue, SpacingStep} from '../utils/types';
import {
  useScrollableArea,
  type ScrollAxis,
  type ScrollOverscroll,
  type ScrollStickyContainment,
} from '../hooks/useScrollableArea';
import {cn, cssLength} from '../utils/cn';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {mergeProps} from '../utils/mergeProps';
import {themeProps} from '../utils/themeProps';

const styles = {
  viewport: cn(
    'box-border [max-inline-size:100%] [max-block-size:100%]',
    '[-webkit-overflow-scrolling:touch]',
    '[scrollbar-color:var(--color-neutral)_transparent] forced-colors:[scrollbar-color:auto]',
    '[scrollbar-width:auto] [scrollbar-gutter:auto]',
    // Chromium can resolve CSS-only stuck/edge presentation for descendants.
    // Unsupported engines keep the hook state as the behavior source of truth.
    'supports-[container-type:scroll-state]:[container-type:scroll-state]',
  ),
  fullBleed: cn(
    'ms-[calc(-1*var(--container-padding-inline-start,0px))]',
    'me-[calc(-1*var(--container-padding-inline-end,0px))]',
    '[max-inline-size:calc(100%_+_var(--container-padding-inline-start,0px)_+_var(--container-padding-inline-end,0px))]',
    'first:mbs-[calc(-1*var(--container-padding-block-start,0px))]',
    'last:mbe-[calc(-1*var(--container-padding-block-end,0px))]',
  ),
  content: 'box-border [min-inline-size:100%] [min-block-size:100%]',
  contentWithInlineOverflow: '[inline-size:max-content]',
} as const;

// Consumer sizing travels through scoped custom properties set inline (see
// sizingStyle), so `className` can still override it.
const sizingStyles = {
  width: 'w-(--_scroll-area-width)',
  height: 'h-(--_scroll-area-height)',
  maxWidth: 'max-w-(--_scroll-area-max-width)',
  minHeight: 'min-h-(--_scroll-area-min-height)',
} as const;

function sizingStyle(
  width: SizeValue | undefined,
  height: SizeValue | undefined,
  maxWidth: SizeValue | undefined,
  minHeight: SizeValue | undefined,
): React.CSSProperties | undefined {
  if (width == null && height == null && maxWidth == null && minHeight == null) {
    return undefined;
  }
  return {
    '--_scroll-area-width': cssLength(width),
    '--_scroll-area-height': cssLength(height),
    '--_scroll-area-max-width': cssLength(maxWidth),
    '--_scroll-area-min-height': cssLength(minHeight),
  } as React.CSSProperties;
}

export type ScrollableAreaStickyContainment = ScrollStickyContainment;

export interface ScrollableAreaProps extends Omit<
  BaseProps<HTMLDivElement>,
  'aria-label' | 'children' | 'role' | 'tabIndex'
> {
  /** Content rendered inside the observed content box. */
  children?: ReactNode;
  /** Logical axis or axes where scrolling is allowed. @default 'block' */
  axis?: ScrollAxis;
  /** Accessible name used when an effective viewport enters the tab order. */
  label: string;
  /** Semantics for the named scroll viewport. @default 'group' */
  role?: 'group' | 'region';
  /** Whether effective axes pass scroll gestures to ancestors at an edge. @default 'allow' */
  overscroll?: ScrollOverscroll;
  /** Width of the viewport; numbers are interpreted as pixels. */
  width?: SizeValue;
  /** Height of the viewport; numbers are interpreted as pixels. */
  height?: SizeValue;
  /** Maximum width of the viewport. */
  maxWidth?: SizeValue;
  /** Minimum height of the viewport. */
  minHeight?: SizeValue;
  /** Whether a fitting viewport deliberately remains a Sticky containing boundary. @default 'whenScrollable' */
  stickyContainment?: ScrollableAreaStickyContainment;
  /** Content padding using the shared spacing scale. @default 0 */
  padding?: SpacingStep;
  /** Logical inline-axis content padding; overrides `padding` on that axis. */
  paddingInline?: SpacingStep;
  /** Logical inline-start content padding; overrides broader padding values. */
  paddingInlineStart?: SpacingStep;
  /** Logical inline-end content padding; overrides broader padding values. */
  paddingInlineEnd?: SpacingStep;
  /** Logical block-axis content padding; overrides `padding` on that axis. */
  paddingBlock?: SpacingStep;
  /** Logical block-start content padding; overrides broader padding values. */
  paddingBlockStart?: SpacingStep;
  /** Logical block-end content padding; overrides broader padding values. */
  paddingBlockEnd?: SpacingStep;
  /** Let the viewport escape inherited container padding. @default false */
  isFullBleed?: boolean;
  /** Ref connected to the native scroll viewport. */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * A native scroll viewport with axis-aware accessibility and chaining.
 *
 * The root is the viewport. Its single child is a normal block content box with
 * a 100% minimum size; children participate in that box rather than directly in
 * viewport flex/grid layout. Inline scrolling gives the box max-content inline
 * sizing, and its minimum block size deliberately does not create a definite
 * percentage-height basis. Use the hook on owned structure when those formatting
 * semantics must stay unchanged. Native scrolling and platform scrollbars remain
 * authoritative.
 *
 * @example
 * ```
 * <ScrollableArea axis="block" label="Activity history">
 *   <ActivityList />
 * </ScrollableArea>
 * ```
 */
export function ScrollableArea({
  children,
  axis = 'block',
  label,
  role = 'group',
  overscroll = 'allow',
  width,
  height,
  maxWidth,
  minHeight,
  stickyContainment = 'whenScrollable',
  padding = 0,
  paddingInline,
  paddingInlineStart,
  paddingInlineEnd,
  paddingBlock,
  paddingBlockStart,
  paddingBlockEnd,
  isFullBleed = false,
  ref,
  className,
  style,
  ...props
}: ScrollableAreaProps) {
  const {getViewportProps, getContentProps} = useScrollableArea({
    axis,
    keyboardAccess: {owner: 'viewport', label, role},
    overscroll,
    stickyContainment,
  });

  const mergedViewportProps = mergeProps(
    themeProps('scrollable-area', {axis}),
    {
      className: cn(
        styles.viewport,
        isFullBleed && styles.fullBleed,
        focusOutlineStyles.focusVisible,
        width != null && sizingStyles.width,
        height != null && sizingStyles.height,
        maxWidth != null && sizingStyles.maxWidth,
        minHeight != null && sizingStyles.minHeight,
      ),
      style: sizingStyle(width, height, maxWidth, minHeight),
    },
    className,
    style,
  );
  const viewportProps = getViewportProps<HTMLDivElement>({
    ...props,
    ref,
    ...mergedViewportProps,
  });

  return (
    <div {...viewportProps}>
      <div
        {...getContentProps<HTMLDivElement>({
          className: cn(
            styles.content,
            axis !== 'block' && styles.contentWithInlineOverflow,
            paddingStyles[padding],
            containerPaddingInlineVarStyles[padding],
            containerPaddingBlockStartVarStyles[padding],
            containerPaddingBlockEndVarStyles[padding],
            paddingInline != null && paddingInlineStyles[paddingInline],
            paddingInline != null &&
              containerPaddingInlineVarStyles[paddingInline],
            paddingBlock != null && paddingBlockStyles[paddingBlock],
            paddingBlock != null &&
              containerPaddingBlockStartVarStyles[paddingBlock],
            paddingBlock != null &&
              containerPaddingBlockEndVarStyles[paddingBlock],
            paddingInlineStart != null &&
              paddingInlineStartStyles[paddingInlineStart],
            paddingInlineStart != null &&
              containerPaddingInlineStartVarStyles[paddingInlineStart],
            paddingInlineEnd != null &&
              paddingInlineEndStyles[paddingInlineEnd],
            paddingInlineEnd != null &&
              containerPaddingInlineEndVarStyles[paddingInlineEnd],
            paddingBlockStart != null &&
              paddingBlockStartStyles[paddingBlockStart],
            paddingBlockStart != null &&
              containerPaddingBlockStartVarStyles[paddingBlockStart],
            paddingBlockEnd != null && paddingBlockEndStyles[paddingBlockEnd],
            paddingBlockEnd != null &&
              containerPaddingBlockEndVarStyles[paddingBlockEnd],
          ),
        })}>
        {children}
      </div>
    </div>
  );
}

ScrollableArea.displayName = 'ScrollableArea';
