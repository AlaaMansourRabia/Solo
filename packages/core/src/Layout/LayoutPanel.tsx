'use client';

/**
 * @file LayoutPanel.tsx
 * @input Uses React, Tailwind classes, LayoutAreaContext, LayoutSlotsContext
 * @output Exports LayoutPanel component and LayoutPanelProps
 * @position Sidebar panel for Layout start/end slots. Use for navigation panels,
 *   settings sidebars, detail panels, or any fixed-width side content.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Layout/Layout.doc.mjs
 * - /apps/storybook/stories/Layout.stories.tsx
 */

import type {AriaRole, ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {use} from 'react';
import {LayoutAreaContext} from './LayoutAreaContext';
import {LayoutSlotsContext} from './LayoutSlotsContext';
import {mergeProps} from '../utils';
import type {SizeValue, SpacingStep} from '../utils/types';
import type {ResizableProps} from '../Resizable/useResizable';
import {themeProps} from '../utils/themeProps';
import {cn, cssLength} from '../utils/cn';
import {
  paddingStyles,
  containerPaddingInlineVarStyles,
  containerPaddingBlockStartVarStyles,
  containerPaddingBlockEndVarStyles,
} from './padding.styles';

const styles = {
  panel: cn(
    'box-border shrink-0 overflow-clip',
    // Default: inner padding on all sides (will be overridden by position-specific styles)
    'ps-[var(--layout-padding-inner-x,var(--spacing-4))] pe-[var(--layout-padding-inner-x,var(--spacing-4))] pbs-[var(--layout-padding-inner-y,var(--spacing-4))] pbe-[var(--layout-padding-inner-y,var(--spacing-4))]',
    '[--container-padding-inline-start:var(--layout-padding-inner-x,var(--spacing-4))] [--container-padding-inline-end:var(--layout-padding-inner-x,var(--spacing-4))]',
    '[--container-padding-block-start:var(--layout-padding-inner-y,var(--spacing-4))] [--container-padding-block-end:var(--layout-padding-inner-y,var(--spacing-4))]',
  ),
  // Start panel: outer-x on left edge
  startPanel: 'ps-[var(--layout-padding-outer-x,var(--spacing-4))]',
  // End panel: outer-x on right edge
  endPanel: 'pe-[var(--layout-padding-outer-x,var(--spacing-4))]',
  // When no header: outer-y on top
  noHeader: 'pbs-[var(--layout-padding-outer-y,var(--spacing-4))]',
  // When no footer: outer-y on bottom
  noFooter: 'pbe-[var(--layout-padding-outer-y,var(--spacing-4))]',
  fullBleed: cn(
    'ps-0 pe-0 pbs-0 pbe-0',
    '[--container-padding-inline-start:0px] [--container-padding-inline-end:0px]',
    '[--container-padding-block-start:0px] [--container-padding-block-end:0px]',
  ),
  scrollable: 'overflow-auto',
  // For start panel: divider on end edge
  dividerEnd:
    '[border-inline-end-width:1px] [border-inline-end-style:solid] [border-inline-end-color:var(--color-border)]',
  // For end panel: divider on start edge
  dividerStart:
    '[border-inline-start-width:1px] [border-inline-start-style:solid] [border-inline-start-color:var(--color-border)]',
  // When no divider, collapse spacing on the side facing content
  // Start panel: collapse end (right in LTR) to merge with content
  // End panel: collapse start (left in LTR) to merge with content
  collapseStart: 'ms-[calc(-1_*_var(--layout-padding-inner-x,var(--spacing-4)))]',
  collapseEnd: 'me-[calc(-1_*_var(--layout-padding-inner-x,var(--spacing-4)))]',
  // Dynamic `width`, routed through a scoped custom property.
  width: 'w-(--_layout-panel-width)',
} as const;

export interface LayoutPanelProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Content to render inside the panel.
   */
  children?: ReactNode;

  /**
   * Adds a themed border on the appropriate edge.
   * - Start panel: border on end edge (right in LTR)
   * - End panel: border on start edge (left in LTR)
   * When false, spacing collapse is applied automatically for seamless visual flow.
   *
   * Note: When using `resizable` with an adjacent `ResizeHandle hasDivider`,
   * set this to `false` to avoid a double-line artifact.
   * @default false
   */
  hasDivider?: boolean;

  /**
   * Internal padding of the panel using the spacing scale.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   * Overrides the default padding from the layout container.
   */
  padding?: SpacingStep;

  /**
   * Enables scrollable overflow for the panel.
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
   * Use 'navigation' or 'complementary' only for top-level layouts (not nested).
   */
  role?: AriaRole;

  /**
   * Width of the panel.
   * Numbers are treated as pixels, strings are used as-is.
   * When `resizable` is provided, this is ignored — the hook controls width.
   */
  width?: SizeValue;

  /**
   * Resize props from `useResizable()`. When provided, the panel width
   * is driven by the hook and a resize handle should be placed adjacent
   * to this panel.
   *
   * @example
   * ```
   * const sidebar = useResizable({ defaultSize: 250, minSize: 200 });
   * <LayoutPanel resizable={sidebar.props}>
   *   <Navigation />
   * </LayoutPanel>
   * <ResizeHandle resizable={sidebar.props} />
   * ```
   */
  resizable?: ResizableProps;
}

/**
 * Sidebar or side panel for Layout. Use in the `start` slot for left navigation
 * or in the `end` slot for detail/inspector panels.
 * Renders with optional divider and context-aware padding.
 * Divider position is auto-detected based on which slot the panel is in.
 *
 * Already provides its own padding and scroll — don't add padding or
 * overflow to children. Use `padding={0}` if you need edge-to-edge content.
 *
 * @example
 * ```
 * <LayoutContainer variant="card">
 *   <Layout
 *     start={
 *       <LayoutPanel hasDivider role="navigation">
 *         <Navigation />
 *       </LayoutPanel>
 *     }
 *     content={<LayoutContent>Main content</LayoutContent>}
 *     end={
 *       <LayoutPanel hasDivider role="complementary">
 *         <Sidebar />
 *       </LayoutPanel>
 *     }
 *   />
 * </LayoutContainer>
 * ```
 */
export function LayoutPanel({
  children,
  hasDivider = false,
  isScrollable = true,
  label,
  padding,
  role,
  width,
  resizable,
  className,
  style,
  ref,
  ...props
}: LayoutPanelProps) {
  const area = use(LayoutAreaContext);
  const {hasHeader, hasFooter} = use(LayoutSlotsContext);

  // When resizable props are provided, use the hook-driven size
  const effectiveWidth = resizable ? resizable._size : width;

  // Determine panel position
  const isStartPanel = area === 'start';
  const isEndPanel = area === 'end';

  const isZeroPadding = padding === 0;

  // When no divider, collapse spacing for seamless visual flow
  const shouldCollapseSpacing =
    !hasDivider && !isZeroPadding && padding == null;

  // Select divider style based on position
  const dividerStyle = isStartPanel
    ? styles.dividerEnd
    : isEndPanel
      ? styles.dividerStart
      : null;

  // Select collapse style based on position (collapse the side where divider would be)
  const collapseStyle = isStartPanel
    ? styles.collapseEnd
    : isEndPanel
      ? styles.collapseStart
      : null;

  return (
    <div
      ref={ref}
      role={role}
      aria-label={label}
      {...mergeProps(
        themeProps('layout-panel'),
        cn(
          styles.panel,
          effectiveWidth != null && styles.width,
          // Outer padding on container edges (unless component is full bleed)
          isStartPanel &&
            !isZeroPadding &&
            padding == null &&
            styles.startPanel,
          isEndPanel && !isZeroPadding && padding == null && styles.endPanel,
          !hasHeader && !isZeroPadding && padding == null && styles.noHeader,
          !hasFooter && !isZeroPadding && padding == null && styles.noFooter,
          isScrollable && styles.scrollable,
          isZeroPadding && styles.fullBleed,
          padding != null && paddingStyles[padding],
          padding != null && containerPaddingInlineVarStyles[padding],
          padding != null && containerPaddingBlockStartVarStyles[padding],
          padding != null && containerPaddingBlockEndVarStyles[padding],
          hasDivider && dividerStyle,
          shouldCollapseSpacing && collapseStyle,
          className,
        ),
        effectiveWidth != null
          ? ({
              '--_layout-panel-width': cssLength(effectiveWidth),
              ...style,
            } as React.CSSProperties)
          : style,
      )}
      {...props}>
      {children}
    </div>
  );
}

LayoutPanel.displayName = 'LayoutPanel';
