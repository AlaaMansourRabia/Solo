'use client';

/**
 * @file SideNav.tsx
 * @input Uses React, HTMLAttributes, ReactNode, Tailwind classes
 * @output Exports SideNav component and SideNavProps
 * @position Core implementation; consumed by index.ts, tested by SideNav.test.tsx
 *
 * Sidebar navigation container with five zones: header + topContent (sticky together),
 * children (scrollable), footer, and footerIcons (sticky bottom).
 *
 * Supports optional resize via a drag handle at the inline-end edge. The
 * resizable wrapper clips handle overflow while keeping its focus ring inside.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/SideNav/SideNav.doc.mjs
 * - /packages/core/src/SideNav/SideNav.test.tsx
 * - /packages/core/src/SideNav/index.ts
 * - /apps/storybook/stories/SideNav.stories.tsx
 */

import {useCallback, useImperativeHandle, useRef, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {cn} from '../utils/cn';
import {mergeProps} from '../utils';
import {
  SideNavCollapseContext,
  type SideNavCollapseState,
  type SideNavCollapsibleConfig,
  type SideNavImperativeCollapseHandle,
} from './SideNavCollapseContext';
import {SideNavCollapseButton} from './SideNavCollapseButton';
import {useSideNavRenderMode} from './SideNavRenderContext';
import {MobileNav} from '../MobileNav/MobileNav';
import {useResizable} from '../Resizable/useResizable';
import type {ResizableConfig} from '../Resizable/useResizable';
import {ResizeHandle} from '../Resizable/ResizeHandle';
import {themeProps} from '../utils/themeProps';
import {SizeProvider} from '../SizeContext/SizeContext';
import {useDevWarning} from '../hooks/useDevWarning';
import {useTranslator} from '../i18n';

import {useMergedRefs} from '../hooks/useMergedRefs';
// =============================================================================
// Constants
// =============================================================================

/** Width below which dragging collapses the sidebar (when collapsible). */
const COLLAPSE_THRESHOLD = 160;

// =============================================================================
// Collapse config
// =============================================================================

interface ResolvedCollapseConfig {
  isCollapsible: boolean;
  defaultIsCollapsed: boolean;
  isCollapsed: boolean | undefined;
  onCollapsedChange: ((isCollapsed: boolean) => void) | undefined;
  /** Dev-warning text when both props address the same state, else null. */
  conflict: string | null;
}

/**
 * `collapsible` and `resizable` can each carry collapse state, so they are
 * normalized here into one config with one owner — two independently
 * initialized copies of the same boolean is what rendered an expanded nav at
 * width 0. `resizable` is the superset, so its keys win.
 */
function resolveCollapseConfig(
  collapsible: boolean | SideNavCollapsibleConfig,
  resizable: boolean | ResizableConfig,
): ResolvedCollapseConfig {
  const fromCollapsible = typeof collapsible === 'object' ? collapsible : {};
  const fromResizable = typeof resizable === 'object' ? resizable : {};

  const resizableCarriesCollapse =
    fromResizable.defaultIsCollapsed !== undefined ||
    fromResizable.isCollapsed !== undefined ||
    fromResizable.onCollapseChange !== undefined;

  return {
    isCollapsible: !!collapsible || resizableCarriesCollapse,
    defaultIsCollapsed:
      (resizableCarriesCollapse
        ? fromResizable.defaultIsCollapsed
        : fromCollapsible.defaultIsCollapsed) ?? false,
    isCollapsed: resizableCarriesCollapse
      ? fromResizable.isCollapsed
      : fromCollapsible.isCollapsed,
    onCollapsedChange: resizableCarriesCollapse
      ? fromResizable.onCollapseChange
      : fromCollapsible.onCollapsedChange,
    conflict: describeCollapseConflict(fromCollapsible, fromResizable),
  };
}

/**
 * Names the keys that address the same collapse state on both props, and
 * which one won. Silent for the common non-overlapping combinations —
 * `collapsible: true` alongside a resize config is not a conflict.
 */
function describeCollapseConflict(
  collapsible: SideNavCollapsibleConfig,
  resizable: ResizableConfig,
): string | null {
  const collapsibleKeys = [
    collapsible.defaultIsCollapsed !== undefined && 'defaultIsCollapsed',
    collapsible.isCollapsed !== undefined && 'isCollapsed',
    collapsible.onCollapsedChange !== undefined && 'onCollapsedChange',
  ].filter((key): key is string => key !== false);
  const resizableKeys = [
    resizable.defaultIsCollapsed !== undefined && 'defaultIsCollapsed',
    resizable.isCollapsed !== undefined && 'isCollapsed',
    resizable.onCollapseChange !== undefined && 'onCollapseChange',
  ].filter((key): key is string => key !== false);

  if (collapsibleKeys.length === 0 || resizableKeys.length === 0) {
    return null;
  }

  return (
    `${collapsibleKeys.map(key => `collapsible.${key}`).join(', ')} and ` +
    `${resizableKeys.map(key => `resizable.${key}`).join(', ')} address the ` +
    `same collapse state. resizable wins; the collapsible ` +
    `${collapsibleKeys.length === 1 ? 'value is' : 'values are'} ignored.`
  );
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: cn(
    'flex flex-col h-full w-[260px] [background-color:inherit] box-border overflow-hidden',
  ),
  rootCollapsed: 'w-(--spacing-12)',
  stickyTop: cn(
    'flex flex-col shrink-0 sticky top-0 z-1 [background-color:inherit]',
    'pbs-(--spacing-2) pbe-(--spacing-2) px-(--spacing-2) gap-(--spacing-2)',
  ),
  stickyTopCollapsed: 'items-center',
  topContent: '',
  scrollable: 'flex-1 overflow-y-auto overflow-x-hidden px-(--spacing-2)',
  scrollableCollapsed: 'flex flex-col items-center',
  scrollableNoTop: 'pbs-(--spacing-2)',
  scrollableWithTop: 'pbs-(--spacing-1)',
  scrollableNoBottom: 'pbe-(--spacing-2)',
  scrollableWithBottom: 'pbe-(--spacing-1)',
  stickyBottom: cn(
    'flex flex-col shrink-0 mt-auto sticky bottom-0 [background-color:inherit]',
    'gap-(--spacing-2) px-(--spacing-2) pbs-(--spacing-1) pbe-(--spacing-2)',
  ),
  footerRow: 'flex items-center gap-(--spacing-1)',
  footerRowCollapsed: 'flex-col-reverse',
  footerIcons: 'flex items-center gap-(--spacing-1)',
  footerIconsCollapsed: 'flex-col items-center',
  stickyBottomCollapsed: 'pbs-0 items-center',
  // Drawer footer — pushed to bottom of the scrollable content area
  drawerFooter: 'flex flex-col mbs-auto gap-(--spacing-2) pbs-(--spacing-2)',
  drawerFooterIcons: 'flex items-center gap-(--spacing-1)',
  // Resizable container — wraps the nav and the drag handle
  resizableContainer: 'relative flex shrink-0 h-full overflow-clip',
  // Keep the shared ring inside the clipping boundary. The wrapper cannot
  // use overflow-clip-margin: that paint allowance also contributes the
  // overlay's half-pixel spill to AppShell's scrollable overflow.
  resizableHandle: cn(
    '[outline-offset:0]',
    'focus-visible:[outline-offset:calc(0px_-_var(--focus-outline-width))]',
  ),
  // Topbar mode — horizontal layout for mobile top bar
  topbar: cn(
    'flex flex-row items-center justify-between h-[48px] w-full',
    '[background-color:inherit] box-border overflow-hidden',
  ),
  topbarIcons: 'flex items-center gap-(--spacing-1) ms-auto',
} as const;

/**
 * Cascaded to the icon rows through `SizeContext` so the built-in collapse
 * button and the consumer's `footerIcons` come out one height. An explicit
 * `size` on a child still wins.
 */
const FOOTER_ICON_SIZE = 'sm';

// =============================================================================
// Types
// =============================================================================

export interface SideNavProps extends BaseProps<HTMLElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLElement>;

  /**
   * Imperative collapse handle for SideNavCollapseButton instances rendered
   * outside this SideNav. This intentionally stays separate from `ref`, which
   * continues to expose the root HTMLElement.
   *
   * @deprecated Hand the same controlled `collapsible` config to SideNav and
   * to the outside button instead.
   */
  handleRef?: React.Ref<SideNavImperativeCollapseHandle>;

  /**
   * Header area — typically SideNavHeading. Sticky at top.
   */
  header?: ReactNode;
  /**
   * Content pinned below header (e.g., create button, top-level items). Sticky.
   */
  topContent?: ReactNode;
  /**
   * Navigation sections and items. Scrollable.
   */
  children: ReactNode;
  /**
   * Footer area above icon bar (e.g., promo cards).
   */
  footer?: ReactNode;
  /**
   * Footer icon bar (e.g., help, notifications, avatar).
   */
  footerIcons?: ReactNode;
  /**
   * CSS class name(s) merged onto the root element; later classes win per
   * property, so these override the component's own.
   */
  className?: string;
  /**
   * Inline styles to apply to the root element. Spread after the
   * component's own inline styles, so these values take priority.
   */
  style?: React.CSSProperties;
  /**
   * Test ID for the root element.
   */
  'data-testid'?: string;

  /**
   * Enables a resize handle at the inline-end edge for resizing the sidebar.
   * Uses `useResizable` internally and renders `ResizeHandle` in
   * overlay mode. When collapsed, the handle is hidden.
   *
   * - `true` — resizable with defaults (260px initial, 180–480px range)
   * - Object — configured via `ResizableConfig`:
   *   - `defaultWidth` — initial width in pixels (default: 260)
   *   - `minWidth` — minimum width in pixels (default: 180)
   *   - `maxWidth` — maximum width in pixels (default: 480)
   *   - `autoSaveId` — localStorage key for persisting width and collapse state
   *   - `onWidthChange` — called when the width changes
   *   - `defaultIsCollapsed` / `isCollapsed` / `onCollapseChange` — collapse
   *     state, when `resizable` should own it rather than `collapsible`
   *
   * When both props carry collapse state, `resizable` wins and a dev warning
   * names the conflicting keys.
   *
   * @default false
   */
  resizable?: boolean | ResizableConfig;

  /**
   * Enables collapse behavior. The sidebar can be collapsed to a narrow
   * icon-only toolbar.
   *
   * - `true` — enables collapse with default toggle button and uncontrolled state
   * - Object — enables collapse with advanced configuration:
   *   - `defaultIsCollapsed` — start collapsed (uncontrolled)
   *   - `isCollapsed` + `onCollapsedChange` — controlled mode. Pass the same
   *     object to a `SideNavCollapseButton` rendered outside this SideNav
   *   - `hasButton` — render built-in collapse button (default: true)
   *   - `buttonLabel` — accessibility label for the collapse button
   *
   * @default false
   */
  collapsible?: boolean | SideNavCollapsibleConfig;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Sidebar navigation container for application pages.
 *
 * Five vertical zones: sticky header + action area at top,
 * scrollable nav content in the middle, and sticky footer + icon bar at bottom.
 *
 * @example
 * ```
 * <SideNav
 *   header={<SideNavHeading heading="My App" headingHref="/" />}
 *   topContent={<Button label="Create new" variant="primary" />}>
 *   <SideNavSection heading="Main">
 *     <SideNavItem label="Dashboard" isSelected href="/dashboard" />
 *     <SideNavItem label="Projects" href="/projects" />
 *   </SideNavSection>
 * </SideNav>
 * ```
 */
export function SideNav({
  header,
  topContent,
  children,
  footer,
  footerIcons,
  collapsible = false,
  resizable = false,
  className,
  style,
  'data-testid': testId,
  ref,
  handleRef,
  ...props
}: SideNavProps) {
  const t = useTranslator();
  // Parse collapsible prop
  const collapsibleConfig = typeof collapsible === 'object' ? collapsible : {};
  const hasCollapseButton = collapsibleConfig.hasButton ?? true;

  // Resizable config
  const resizableConfig = typeof resizable === 'object' ? resizable : {};
  const isResizable = !!resizable;

  const collapseConfig = resolveCollapseConfig(collapsible, resizable);
  const {isCollapsible, onCollapsedChange} = collapseConfig;

  useDevWarning(
    'SideNav',
    collapseConfig.conflict ?? '',
    collapseConfig.conflict != null,
  );

  const navRef = useRef<HTMLElement>(null);
  const mergedNavRef = useMergedRefs(ref, navRef);
  const collapseStateRef = useRef<SideNavCollapseState>({
    isCollapsed: false,
    toggle: () => {},
    isCollapsible,
  });

  // useResizable is the sole collapse owner in every SideNav mode. Keeping that
  // owner mounted when resize is toggled preserves the current collapse state.
  const resizableHook = useResizable({
    defaultSize: resizableConfig.defaultWidth ?? 260,
    minSize: resizableConfig.minWidth ?? 180,
    maxSize: resizableConfig.maxWidth ?? 480,
    collapsible: isCollapsible,
    collapsedSize: COLLAPSE_THRESHOLD,
    autoSaveId: resizableConfig.autoSaveId,
    defaultIsCollapsed: collapseConfig.defaultIsCollapsed,
    isCollapsed: collapseConfig.isCollapsed,
    onSizeChange: resizableConfig.onWidthChange,
    onCollapseChange: onCollapsedChange,
  });

  const collapsed = resizableHook.isCollapsed;

  const toggle = useCallback(() => {
    const next = !collapsed;

    // Deprecated `handleRef` path only: an out-of-tree button reads this
    // snapshot while rendering, which can happen before SideNav re-renders.
    collapseStateRef.current = {
      ...collapseStateRef.current,
      isCollapsed: next,
    };

    if (next) {
      resizableHook.collapse();
    } else {
      resizableHook.expand();
    }
  }, [collapsed, resizableHook]);

  const showResizeHandle = isResizable && !collapsed;

  collapseStateRef.current = {
    isCollapsed: collapsed,
    toggle,
    isCollapsible,
  };

  const collapseContext = {
    isCollapsed: collapsed,
    toggle,
    isCollapsible,
  };

  useImperativeHandle(
    handleRef,
    () => ({
      getCollapseState: () => collapseStateRef.current,
    }),
    [],
  );

  // Render mode — when inside AppShell mobile layout, render subsets
  const renderMode = useSideNavRenderMode();

  // =========================================================================
  // Topbar mode — heading + footerIcons in a horizontal bar
  // =========================================================================
  if (renderMode === 'topbar') {
    return (
      <div
        data-testid={testId}
        {...mergeProps(
          themeProps('side-nav', {mode: 'topbar'}),
          {className: styles.topbar},
          className,
          style,
        )}>
        {header}
        <div className={styles.topbarIcons}>
          <SizeProvider value={FOOTER_ICON_SIZE}>{footerIcons}</SizeProvider>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Drawer mode — render inside MobileNav with heading as header
  // =========================================================================
  const hasDrawerFooter = !!(footer || footerIcons);

  if (renderMode === 'drawer') {
    return (
      <MobileNav
        header={header}
        data-testid={testId}
        className={className}
        style={style}
        {...props}>
        {topContent}
        {children}
        {hasDrawerFooter && (
          <div className={styles.drawerFooter}>
            {footer}
            {footerIcons && (
              <div className={styles.drawerFooterIcons}>
                <SizeProvider value={FOOTER_ICON_SIZE}>
                  {footerIcons}
                </SizeProvider>
              </div>
            )}
          </div>
        )}
      </MobileNav>
    );
  }

  // =========================================================================
  // Drawer-content mode — render just items (no MobileNav wrapper)
  // Used when TopNav owns the drawer and SideNav items are nested inside
  // =========================================================================
  if (renderMode === 'drawer-content') {
    return (
      <>
        {topContent}
        {children}
        {hasDrawerFooter && (
          <div className={styles.drawerFooter}>
            {footer}
            {footerIcons && (
              <div className={styles.drawerFooterIcons}>
                <SizeProvider value={FOOTER_ICON_SIZE}>
                  {footerIcons}
                </SizeProvider>
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  // =========================================================================
  // Default mode — full sidebar
  // =========================================================================
  const hasStickyTop = !!(header || topContent);
  const hasStickyBottom = !!(footer || footerIcons);
  // The built-in collapse button only renders when collapse is enabled and it
  // hasn't been opted out via `collapsible.hasButton: false` (e.g. when the
  // consumer places a SideNavCollapseButton in the header instead).
  const showCollapseButton = isCollapsible && hasCollapseButton;

  // When resizable, override the nav width via inline style
  const resizableNavStyle: React.CSSProperties | undefined = isResizable
    ? {...(style ?? {}), width: collapsed ? undefined : resizableHook.size}
    : style;

  const navElement = (
    <nav
      ref={mergedNavRef}
      role="navigation"
      aria-label={t('@solo.sideNav.label')}
      data-testid={testId}
      {...mergeProps(
        themeProps('side-nav'),
        {className: cn(styles.root, collapsed && styles.rootCollapsed)},
        className,
        resizableNavStyle,
      )}
      {...props}>
      {hasStickyTop && (
        <div
          className={cn(styles.stickyTop, collapsed && styles.stickyTopCollapsed)}>
          {header}
          {topContent && (
            <div className={styles.topContent}>{topContent}</div>
          )}
        </div>
      )}
      <div
        className={cn(styles.scrollable, collapsed && styles.scrollableCollapsed, hasStickyTop ? styles.scrollableWithTop : styles.scrollableNoTop, hasStickyBottom ? styles.scrollableWithBottom : styles.scrollableNoBottom)}>
        {children}
      </div>
      {(hasStickyBottom || showCollapseButton) && (
        <div
          className={cn(styles.stickyBottom, collapsed && styles.stickyBottomCollapsed)}>
          {footer}
          <div
            className={cn(styles.footerRow, collapsed && styles.footerRowCollapsed)}>
            <SizeProvider value={FOOTER_ICON_SIZE}>
              {showCollapseButton && <SideNavCollapseButton />}
              {footerIcons}
            </SizeProvider>
          </div>
        </div>
      )}
    </nav>
  );

  // Overlay drag handle inside the nav when resizable.
  // Uses ResizeHandle in overlay mode so the handle sits inside
  // the panel's overflow: clip bounds.
  const content = showResizeHandle ? (
    <div className={styles.resizableContainer}>
      {navElement}
      <ResizeHandle
        data-testid="solo-sidenav-resize-handle"
        direction="horizontal"
        position="overlay"
        pillPlacement="end"
        isAlwaysVisible={false}
        className={styles.resizableHandle}
        resizable={resizableHook.props}
        label={t('@solo.sideNav.resizeSidebar')}
      />
    </div>
  ) : (
    navElement
  );

  if (isCollapsible) {
    return (
      <SideNavCollapseContext value={collapseContext}>
        {content}
      </SideNavCollapseContext>
    );
  }

  return content;
}

SideNav.displayName = 'SideNav';
