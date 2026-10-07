'use client';

/**
 * @file LayoutContent.tsx
 * @input Uses React, Tailwind classes, LayoutSlotsContext
 * @output Exports LayoutContent component and LayoutContentProps
 * @position Scrollable main content area for Layout. Wraps the primary body content
 *   with automatic scroll containment and context-aware padding.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Layout/Layout.doc.mjs
 * - /apps/storybook/stories/Layout.stories.tsx
 */

import type {AriaRole, ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {use} from 'react';
import {LayoutSlotsContext} from './LayoutSlotsContext';
import {mergeProps} from '../utils';
import type {SpacingStep} from '../utils/types';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';
import {
  paddingStyles,
  containerPaddingInlineVarStyles,
  containerPaddingBlockStartVarStyles,
  containerPaddingBlockEndVarStyles,
} from './padding.styles';

const styles = {
  content: cn(
    'box-border h-full flex-[1] min-h-0 overflow-clip',
    // Default: inner padding on all sides (will be overridden by position-specific styles)
    'ps-[var(--layout-padding-inner-x,var(--spacing-4))] pe-[var(--layout-padding-inner-x,var(--spacing-4))]',
    'pbs-[var(--layout-padding-inner-y,var(--spacing-4))] pbe-[var(--layout-padding-inner-y,var(--spacing-4))]',
    // Publish container padding vars for bleed children (Table, Divider, etc.)
    '[--container-padding-inline-start:var(--layout-padding-inner-x,var(--spacing-4))] [--container-padding-inline-end:var(--layout-padding-inner-x,var(--spacing-4))]',
    '[--container-padding-block-start:var(--layout-padding-inner-y,var(--spacing-4))] [--container-padding-block-end:var(--layout-padding-inner-y,var(--spacing-4))]',
  ),
  // The `default` marker is the Layout's inner wrapper (`group`). A later
  // style that sets the same padding edge would replace these conditions
  // wholesale, so they are applied only when nothing else sets that edge (see the
  // component).
  // When header has no divider, collapse top padding for seamless visual flow
  headerCollapse:
    'group-has-[>.solo-layout-header:not([data-divider])]:pbs-0',
  // When footer has no divider, collapse bottom padding for seamless visual flow
  footerCollapse:
    'group-has-[>.solo-layout-footer:not([data-divider])]:pbe-0',
  // When no start panel: outer-x on left edge
  noStart: cn(
    'ps-[var(--layout-padding-outer-x,var(--spacing-4))]',
    '[--container-padding-inline-start:var(--layout-padding-outer-x,var(--spacing-4))] [--container-padding-inline-end:var(--layout-padding-outer-x,var(--spacing-4))]',
  ),
  // When no end panel: outer-x on right edge
  noEnd: 'pe-[var(--layout-padding-outer-x,var(--spacing-4))]',
  // When no header: outer-y on top
  noHeader: 'pbs-[var(--layout-padding-outer-y,var(--spacing-4))] [--container-padding-block-start:var(--layout-padding-outer-y,var(--spacing-4))]',
  // When no footer: outer-y on bottom
  noFooter: 'pbe-[var(--layout-padding-outer-y,var(--spacing-4))] [--container-padding-block-end:var(--layout-padding-outer-y,var(--spacing-4))]',
  scrollable: 'overflow-auto',
  // Keep LayoutContent as the scroll and padding owner. These styles only add
  // the gutter needed to align its direct children to contentWidth.
  constrainedNoPanelsStart:
    'ps-[max(var(--container-padding-inline-start,0px),calc((100cqi_-_var(--layout-alignment-width))_/_2_+_var(--container-padding-inline-start,0px)))]',
  constrainedNoPanelsEnd:
    'pe-[max(var(--container-padding-inline-end,0px),calc((100cqi_-_var(--layout-alignment-width))_/_2_+_var(--container-padding-inline-end,0px)))]',
  // A one-panel middle query box excludes the panel-side centered gutter, so
  // its full difference from contentWidth is the missing opposite-side gutter.
  constrainedSingleStartPanel:
    'pe-[max(var(--container-padding-inline-end,0px),calc(100cqi_-_var(--layout-alignment-width)_+_var(--container-padding-inline-end,0px)))]',
  constrainedSingleEndPanel:
    'ps-[max(var(--container-padding-inline-start,0px),calc(100cqi_-_var(--layout-alignment-width)_+_var(--container-padding-inline-start,0px)))]',
  fullBleed: cn(
    'ps-0 pe-0 pbs-0 pbe-0',
    '[--container-padding-inline-start:0px] [--container-padding-inline-end:0px]',
    '[--container-padding-block-start:0px] [--container-padding-block-end:0px]',
  ),
} as const;

export interface LayoutContentProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Content to render inside the content area.
   */
  children?: ReactNode;

  /**
   * Internal padding of the content area using the spacing scale.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   * Overrides the default padding from the layout container.
   */
  padding?: SpacingStep;

  /**
   * Enables scrollable overflow for the content area.
   * Set to false for auto-height layouts where sticky positioning
   * needs to work with parent containers.
   * @default true
   */
  isScrollable?: boolean;

  /**
   * Accessible label for the landmark.
   * Required when role is set and multiple landmarks of the same type exist.
   */
  label?: string;

  /**
   * ARIA landmark role for accessibility.
   * Use 'main' only for the primary content area of the page (not in nested layouts).
   */
  role?: AriaRole;
}

/**
 * Scrollable main content area for Layout. Wraps the primary body content
 * with automatic scroll containment and context-aware padding.
 *
 * Already provides its own padding and scroll — don't add padding or overflow
 * to children. Use `padding={0}` if you need edge-to-edge content.
 *
 * @example
 * ```
 * <LayoutContainer variant="card">
 *   <Layout
 *     header={<LayoutHeader>Title</LayoutHeader>}
 *     content={<LayoutContent>Main body content</LayoutContent>}
 *   />
 * </LayoutContainer>
 * <LayoutContainer variant="card">
 *   <Layout
 *     content={
 *       <LayoutContent padding={0}>
 *         <Table />
 *       </LayoutContent>
 *     }
 *   />
 * </LayoutContainer>
 * <LayoutContainer variant="card">
 *   <Layout
 *     content={
 *       <LayoutContent isScrollable={false}>
 *         <StickyElement />
 *       </LayoutContent>
 *     }
 *   />
 * </LayoutContainer>
 * ```
 */
export function LayoutContent({
  children,
  isScrollable = true,
  padding,
  label,
  role,
  className,
  style,
  ref,
  ...props
}: LayoutContentProps) {
  const {hasHeader, hasFooter, hasStart, hasEnd} = use(LayoutSlotsContext);

  const isZeroPadding = padding === 0;

  return (
    <div
      ref={ref}
      role={role}
      aria-label={label}
      {...mergeProps(
        themeProps('layout-content'),
        cn(
          styles.content,
          // The ancestor-collapse conditions only survive when no later style
          // replaces that padding edge (noHeader/noFooter, padding, fullBleed).
          hasHeader && padding == null && styles.headerCollapse,
          hasFooter && padding == null && styles.footerCollapse,
          // Outer padding on container edges (unless content is full bleed)
          !hasStart && !isZeroPadding && padding == null && styles.noStart,
          !hasEnd && !isZeroPadding && padding == null && styles.noEnd,
          !hasHeader && !isZeroPadding && padding == null && styles.noHeader,
          !hasFooter && !isZeroPadding && padding == null && styles.noFooter,
          isScrollable && styles.scrollable,
          isZeroPadding && styles.fullBleed,
          padding != null && paddingStyles[padding],
          padding != null && containerPaddingInlineVarStyles[padding],
          padding != null && containerPaddingBlockStartVarStyles[padding],
          padding != null && containerPaddingBlockEndVarStyles[padding],
          !hasStart &&
            !hasEnd &&
            !isZeroPadding &&
            styles.constrainedNoPanelsStart,
          !hasStart &&
            !hasEnd &&
            !isZeroPadding &&
            styles.constrainedNoPanelsEnd,
          hasStart &&
            !hasEnd &&
            !isZeroPadding &&
            styles.constrainedSingleStartPanel,
          !hasStart &&
            hasEnd &&
            !isZeroPadding &&
            styles.constrainedSingleEndPanel,
          className,
        ),
        style,
      )}
      {...props}>
      {children}
    </div>
  );
}

LayoutContent.displayName = 'LayoutContent';
