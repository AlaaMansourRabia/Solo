'use client';

/**
 * @file TopNavMegaMenu.tsx
 * @input Uses React, Tailwind classes, usePopover (Popover API + CSS anchor positioning)
 * @output Exports TopNavMegaMenu component and related types
 * @position Navigation item with hover-triggered full-width mega menu for TopNav
 *
 * Uses usePopover to promote the panel to the top layer via the Popover API,
 * eliminating z-index stacking. CSS anchor positioning places the panel below
 * the nav wrapper.
 *
 * The default (desktop) trigger opens on hover and click. Hover opens are
 * transient; click/keyboard opens are pinned. A click shortly after hover-open
 * confirms and pins the panel instead of closing it. The panel remains an auto
 * popover for native dismissal and sibling exclusivity; `popoverTarget`
 * registers the trigger as its native invoker so the guard runs before any
 * dismiss.
 *
 * Supports three render modes via TopNavRenderContext:
 * - 'default': desktop popover mega menu (hover/click triggered)
 * - 'mobile-bar': returns null (hidden in compact mobile bar)
 * - 'drawer': drill-down navigation with back button
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/TopNav/TopNav.doc.mjs
 * - /packages/core/src/TopNav/index.ts
 */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {cn} from '../utils/cn';
import {usePopover} from '../Popover/usePopover';
import {useMenuHover} from '../hooks/useMenuHover';
import {Grid} from '../Grid/Grid';
import {Icon} from '../Icon';
import {mergeProps, composeEventHandlers} from '../utils';
import type {BaseProps} from '../BaseProps';
import {navItemStyles} from '../NavItem/navItemStyles.styles';
import {useTopNavSlot} from './TopNavContext';
import {useTopNavRenderMode} from './TopNavRenderContext';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';

import {useMergedRefs} from '../hooks/useMergedRefs';
// =============================================================================
// Styles
// =============================================================================

const styles = {
  trigger: cn(
    'inline-flex items-center gap-(--spacing-2) py-(--spacing-1-5) px-(--spacing-3)',
    'rounded-(--radius-element) text-(length:--text-label-size) leading-(--text-label-leading)',
    'font-(number:--font-weight-medium) text-(--color-text-secondary) [text-decoration:none]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition-property:background-color,color]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
    'bg-transparent can-hover:usable:hover:bg-(--color-overlay-hover)',
    '[border-width:0] [border-style:none] [font-family:inherit]',
  ),
  // Replaces `trigger`'s backgroundColor wholesale (hover arm included);
  // the hover class repeats the chain so `cn()` drops it.
  triggerOpen: cn(
    'text-(--color-text-primary) bg-(--color-overlay-hover)',
    'can-hover:usable:hover:bg-(--color-overlay-hover)',
  ),
  chevron: cn(
    'inline-flex items-center',
    // The registry chevron is a 1em SVG, so it has always rendered at the
    // trigger's own font size (--text-label-size). Icon's size box would repin
    // it to a fixed rem (the nearest, sm, is 1rem = 16px vs the 14px here), so
    // hold it on the inherited em: same pixels, and still tracks the type
    // scale when a theme changes the label size.
    'w-[1em] h-[1em] text-[length:inherit]',
    '[transition-property:transform]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  chevronOpen: '[transform:rotate(180deg)]',
  // Animation styles applied to the layer's popover element.
  panelAnimation: cn(
    'opacity-0 [&:popover-open]:opacity-100',
    '[transform:translateY(-4px)] [&:popover-open]:[transform:translateY(0)]',
    '[transition-property:opacity,transform,overlay,display]',
    '[transition-duration:var(--duration-medium-min)] [transition-timing-function:var(--ease-standard)]',
    '[transition-behavior:allow-discrete]',
    'starting:opacity-0 starting:[transform:translateY(-4px)]',
  ),
  // Clamp the anchored layer to the space available below the nav so a tall
  // menu never runs off the bottom of the viewport. The layer is positioned
  // with position-area: self-block-end, so its containing block spans from
  // the nav's block-end to the viewport edge — 100% is exactly that space.
  // The layer is a flex column so panelContainer can shrink and scroll its
  // own content, keeping the surface radius/shadow static at the edges.
  // Internal scroll is a stopgap until the mobile bottom-sheet lands.
  panelViewportFit: cn(
    'hidden [&:popover-open]:flex flex-col',
    'max-h-[calc(100%_-_var(--spacing-3))]',
  ),
  // Visual styles for the panel content container.
  panelContainer: cn(
    'bg-(--color-background-popover) [border-top-width:var(--border-width)]',
    '[border-top-style:solid] [border-top-color:var(--color-border)]',
    'rounded-(--radius-container) [box-shadow:var(--shadow-low)] overflow-hidden',
    // Allow the container to shrink inside the height-clamped layer so its
    // content (panelContent) can scroll rather than overflow the viewport.
    'flex flex-col min-h-0',
  ),
  panelContent: cn(
    'flex flex-wrap gap-(--spacing-6) py-(--spacing-3) px-(--spacing-3)',
    // Clamp to the viewport (minus a gutter) so the anchored panel never
    // overflows the screen edge on narrow viewports; caps at 960px otherwise.
    'max-w-[min(960px,_calc(100dvw_-_var(--spacing-4)))] box-border',
    // Scroll internally when the menu is taller than the available space
    // below the nav (paired with panelViewportFit on the layer).
    'overflow-y-auto [overscroll-behavior:contain]',
  ),
  menuWrapper: 'grow-2 shrink basis-[300px] min-w-0',
  featured: cn(
    'grow shrink basis-[200px] rounded-(--radius-container)',
    'bg-(--color-background-muted) overflow-hidden flex flex-col',
  ),
  // =========================================================================
  // Drawer mode styles (composes navItemStyles.item as base)
  // =========================================================================
  drawerSection: 'flex flex-col',
  // Header button override — justifyContent and button resets only,
  // base layout/colors come from navItemStyles.item
  drawerHeader: 'justify-between [border-width:0] [border-style:none] bg-transparent',
  drawerChevron: cn(
    'inline-flex',
    // Same em pin as styles.chevron above — the drawer header inherits
    // --text-label-size from navItemStyles.item.
    'w-[1em] h-[1em] text-[length:inherit]',
    '[transition-property:transform]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  drawerChevronExpanded: '[transform:rotate(180deg)]',
  drawerItems: cn(
    'grid [grid-template-rows:0fr] [transition-property:grid-template-rows]',
    '[transition-duration:var(--duration-medium)] [transition-timing-function:var(--ease-standard)]',
  ),
  drawerItemsExpanded: '[grid-template-rows:1fr]',
  drawerItemsInner: 'overflow-hidden min-h-0',

  // Featured card in drawer — compact version
  drawerFeatured: cn(
    'mbs-(--spacing-2) ms-(--spacing-6) rounded-(--radius-container)',
    'bg-(--color-background-muted) overflow-hidden',
  ),
} as const;

// =============================================================================
// Types
// =============================================================================

export interface TopNavMegaMenuProps extends BaseProps<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
  /** The visible label for the nav item trigger. */
  label: string;
  /**
   * Menu items slot — typically one or more TopNavMegaMenuItem components,
   * but accepts any ReactNode for custom layouts.
   */
  items?: ReactNode;
  /**
   * Featured content slot — rendered in the right panel on desktop,
   * and below the items in the mobile drawer.
   */
  featured?: ReactNode;
  /** Delay before showing the menu on hover (ms). @default 150 */
  delay?: number;
  /** Delay before hiding the menu after mouse leaves (ms). @default 250 */
  hideDelay?: number;
  /**
   * Callback fired when the mega menu opens or closes.
   * Useful for coordinating wrapper styles (e.g. hiding other shadows).
   */
  onOpenChange?: (isOpen: boolean) => void;
}

// =============================================================================
// TopNavMegaMenu
// =============================================================================

/**
 * A navigation item that displays a full-width mega menu on hover.
 *
 * Uses a composed children API with sub-components:
 * - `items` — ReactNode slot, typically TopNavMegaMenuItem components
 * - `featured` — ReactNode slot for the right-panel / drawer featured card
 *
 * Supports three render modes via TopNavRenderContext:
 * - `'default'`: desktop popover with hover/click trigger
 * - `'mobile-bar'`: hidden (returns null)
 * - `'drawer'`: inline collapsible matching TopNavMenu pattern
 *
 * @example
 * ```
 * <TopNav
 *   startContent={
 *     <TopNavMegaMenu
 *       label="Products"
 *       items={
 *         <>
 *           <TopNavMegaMenuItem
 *             title="Analytics"
 *             description="Track behavior"
 *             icon={<ChartIcon />}
 *             href="/analytics"
 *           />
 *           <TopNavMegaMenuItem
 *             title="Messaging"
 *             description="Real-time comms"
 *             icon={<ChatIcon />}
 *             href="/messaging"
 *           />
 *         </>
 *       }
 *       featured={
 *         <>
 *           <strong>New: AI Features</strong>
 *           <p>Explore our latest AI-powered tools.</p>
 *         </>
 *       }
 *     />
 *   }
 * />
 * ```
 */
export function TopNavMegaMenu({
  ref,
  label,
  items,
  featured,
  delay = 150,
  hideDelay = 250,
  onOpenChange,
  ...rest
}: TopNavMegaMenuProps) {
  const renderMode = useTopNavRenderMode();

  // =========================================================================
  // Mobile-bar mode — hidden
  // =========================================================================
  if (renderMode === 'mobile-bar') {
    return null;
  }

  // =========================================================================
  // Drawer mode — inline collapsible
  // =========================================================================
  if (renderMode === 'drawer') {
    return (
      <DrawerMegaMenu
        label={label}
        items={items}
        featured={featured}
        {...rest}
      />
    );
  }

  // =========================================================================
  // Default mode — desktop popover
  // =========================================================================
  return (
    <DefaultMegaMenu
      ref={ref}
      label={label}
      items={items}
      featured={featured}
      delay={delay}
      hideDelay={hideDelay}
      onOpenChange={onOpenChange}
      {...rest}
    />
  );
}

TopNavMegaMenu.displayName = 'TopNavMegaMenu';

// =============================================================================
// DefaultMegaMenu — desktop popover mode
// =============================================================================

/** The panel is a grid of links, not `role="menuitem"` rows. */
const PANEL_ITEM_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function DefaultMegaMenu({
  ref,
  label,
  items,
  featured,
  delay = 150,
  hideDelay = 250,
  onOpenChange,
  className,
  style,
  onClick: onClickProp,
  onMouseEnter: onMouseEnterProp,
  onMouseLeave: onMouseLeaveProp,
  ...rest
}: TopNavMegaMenuProps) {
  const slot = useTopNavSlot();
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  const handlePopoverShow = useCallback(() => {
    onOpenChange?.(true);
  }, [onOpenChange]);

  const handlePopoverHide = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const popover = usePopover({
    // role: 'none' — the panel exposes its own role="group" labeled by
    // `label`. Pointer/hover opens keep focus on the trigger; keyboard and
    // assistive-tech opens move focus into the panel (a labeled group you exit
    // with Escape or by tabbing out). Either way role="dialog"
    // aria-modal="true" would be wrong: it announces an unnamed modal dialog
    // around a grid of links (and, when focus stays on the trigger, marks the
    // focused control inert).
    role: 'none',
    // hasSurface: false — mega menu provides its own surface (panelContainer)
    // with border-top and custom overflow. Animation is applied via the
    // render() call's className (panelAnimation), not the hook options.
    hasSurface: false,
    // Keep native outside-click/Escape dismissal and sibling exclusivity.
    // The trigger's popoverTarget association prevents its activation from
    // being treated as an ordinary outside interaction.
    hasLightDismiss: true,
    onShow: handlePopoverShow,
    onHide: handlePopoverHide,
  });

  // Set the CSS anchor to the parent <nav> element (the TopNav).
  useEffect(() => {
    const nav = triggerButtonRef.current?.closest('nav');
    if (nav) {
      popover.triggerRef(nav);
    }
    return () => {
      popover.triggerRef(null);
    };
  }, [popover]);

  const {
    triggerProps: hoverTriggerProps,
    contentProps,
    menuRef,
    setTriggerEl,
  } = useMenuHover<HTMLDivElement>({
    show: popover.show,
    hide: popover.hide,
    isOpen: popover.isOpen,
    isEnabled: true,
    showDelay: delay,
    hideDelay,
    itemSelector: PANEL_ITEM_SELECTOR,
    // Trigger sits outside an auto popover; the invoker relationship exempts it
    // from light dismiss.
    popoverId: popover.id,
  });

  return (
    <>
      <button
        ref={useMergedRefs(triggerButtonRef, setTriggerEl, ref)}
        type="button"
        {...rest}
        {...popover.triggerProps}
        {...hoverTriggerProps}
        onClick={composeEventHandlers(onClickProp, hoverTriggerProps.onClick)}
        onMouseEnter={composeEventHandlers(
          onMouseEnterProp,
          hoverTriggerProps.onMouseEnter,
        )}
        onMouseLeave={composeEventHandlers(
          onMouseLeaveProp,
          hoverTriggerProps.onMouseLeave,
        )}
        {...mergeProps(
          themeProps('top-nav-mega-menu'),
          {className: cn(focusOutlineStyles.focusVisible, styles.trigger, popover.isOpen && styles.triggerOpen)},
          className,
          style,
        )}>
        {label}
        <Icon
          icon="chevronDown"
          size="sm"
          color="inherit"
          className={cn(styles.chevron, popover.isOpen && styles.chevronOpen)}
        />
      </button>
      {popover.render(
        <div
          // role="group" — a mega menu is a browsing grid of links, not an
          // ARIA menu of menuitems (per the WAI-ARIA APG, the menu role is
          // for action menus; link mega menus are the documented anti-case).
          ref={menuRef}
          role="group"
          aria-label={label}
          {...contentProps}
          className={styles.panelContainer}>
          <div className={styles.panelContent}>
            {/* Menu items section */}
            {items != null && (
              <Grid columns={2} gap={2} className={styles.menuWrapper}>
                {items}
              </Grid>
            )}

            {/* Featured section */}
            {featured != null && (
              <div className={styles.featured}>{featured}</div>
            )}
          </div>
        </div>,
        {
          placement: 'below',
          alignment: slot,
          className: cn(styles.panelAnimation, styles.panelViewportFit),
        },
      )}
    </>
  );
}

// =============================================================================
// DrawerMegaMenu — mobile drawer inline collapsible mode
// =============================================================================

function DrawerMegaMenu({
  label,
  items,
  featured,
  className,
  style,
  onClick: onClickProp,
  ...rest
}: Pick<TopNavMegaMenuProps, 'label' | 'items' | 'featured'> &
  BaseProps<HTMLButtonElement>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuId = `mega-menu-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.drawerSection}>
      {/* Header toggle — same pattern as TopNavMenu drawer */}
      <button
        type="button"
        {...rest}
        onClick={composeEventHandlers(onClickProp, () =>
          setIsExpanded(v => !v),
        )}
        aria-expanded={isExpanded}
        aria-controls={`${menuId}-items`}
        {...mergeProps(
          themeProps('top-nav-mega-menu', {mode: 'drawer'}),
          // No overlay: `drawerHeader`'s `backgroundColor: 'transparent'` replaces
          // the overlay's hover/press arms wholesale.
          {className: cn(focusOutlineStyles.focusVisible, navItemStyles.item, styles.drawerHeader)},
          className,
          style,
        )}>
        {label}
        <Icon
          icon="chevronDown"
          size="sm"
          color="inherit"
          className={cn(styles.drawerChevron, isExpanded && styles.drawerChevronExpanded)}
        />
      </button>

      {/* Animated expand/collapse container */}
      <div
        id={`${menuId}-items`}
        className={cn(styles.drawerItems, isExpanded && styles.drawerItemsExpanded)}>
        <div className={styles.drawerItemsInner}>
          {/* Items render themselves in drawer mode via TopNavRenderContext */}
          {items}

          {/* Featured card */}
          {featured != null && (
            <div className={styles.drawerFeatured}>{featured}</div>
          )}
        </div>
      </div>
    </div>
  );
}
