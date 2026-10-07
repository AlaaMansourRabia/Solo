'use client';

/**
 * @file TopNavMenu.tsx
 * @input Uses React, Tailwind classes, usePopover, useMenuHover, useListFocus,
 *   useTypeahead, TopNavItem tokens, and the shared navigation policy
 * @output Exports TopNavMenu component and related types
 * @position Navigation item with hover-triggered overflow menu for TopNav
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/TopNav/TopNav.doc.mjs
 * - /packages/core/src/TopNav/TopNavMenu.test.tsx
 * - /packages/core/src/TopNav/index.ts
 */

import React, {
  useCallback,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {cn} from '../utils/cn';
import {usePopover} from '../Popover/usePopover';
import {useMenuHover} from '../hooks/useMenuHover';
import {useListFocus} from '../hooks/useListFocus';
import {useTypeahead} from '../hooks/useTypeahead';
import {Icon} from '../Icon';
import {mergeProps, composeEventHandlers} from '../utils';
import {useMergedRefs} from '../hooks/useMergedRefs';
import type {BaseProps} from '../BaseProps';
import {navItemStyles} from '../NavItem/navItemStyles.styles';
import {useTopNavSlot} from './TopNavContext';
import {useTopNavRenderMode} from './TopNavRenderContext';
import {useAppShellMobile} from '../AppShell/AppShellMobileContext';
import {useLinkComponent} from '../Link/useLinkComponent';
import {isSafeUrl} from '../utils/safeUrl';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';
import {spacingVars} from '../theme/tokenVars';

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
  menuContainer: 'flex flex-col gap-(--spacing-1) min-w-[280px] p-(--spacing-1)',
  menuItem: cn(
    'flex items-center gap-(--spacing-3) py-(--spacing-3) px-(--spacing-3)',
    'rounded-(--radius-element) [text-decoration:none]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition-property:background-color]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
    'bg-transparent can-hover:usable:hover:bg-(--color-overlay-hover)',
    '[border-width:0] [border-style:none]',
  ),
  menuItemIcon: cn(
    'flex items-center justify-center w-[40px] h-[40px] rounded-(--radius-element)',
    'bg-(--color-neutral) shrink-0',
  ),
  menuItemContent: 'flex flex-col gap-(--spacing-1) min-w-0',
  menuItemTitle: cn(
    'text-(length:--text-label-size) leading-(--text-label-leading)',
    'font-(number:--font-weight-semibold) text-(--color-text-primary)',
  ),
  menuItemDescription: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'font-(number:--font-weight-normal) text-(--color-text-secondary)',
  ),
} as const;

const drawerStyles = {
  section: 'flex flex-col',
  header: 'justify-between [border-width:0] [border-style:none] bg-transparent',
  chevron: cn(
    'inline-flex',
    // Same em pin as styles.chevron above — the drawer header inherits
    // --text-label-size from navItemStyles.item.
    'w-[1em] h-[1em] text-[length:inherit]',
    '[transition-property:transform]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  chevronExpanded: '[transform:rotate(180deg)]',
  items: cn(
    'grid [grid-template-rows:0fr] [transition-property:grid-template-rows]',
    '[transition-duration:var(--duration-medium)] [transition-timing-function:var(--ease-standard)]',
  ),
  itemsExpanded: '[grid-template-rows:1fr]',
  itemsInner: 'overflow-hidden min-h-0',
  item: 'ps-(--spacing-6) [text-decoration:none]',
  itemIcon: 'shrink-0 w-[20px] h-[20px]',
  itemText: 'flex flex-col gap-(--spacing-0-5)',
  itemDescription: cn(
    'text-(length:--text-supporting-size) text-(--color-text-secondary)',
    'font-(number:--font-weight-normal)',
  ),
} as const;

// =============================================================================
// Types
// =============================================================================

/**
 * An item in the TopNav overflow menu.
 */
export interface TopNavMenuItemData {
  /**
   * Display title for the menu item.
   */
  title: string;

  /**
   * Optional description text displayed below the title.
   */
  description?: string;

  /**
   * Optional icon element displayed to the left.
   */
  icon?: ReactNode;

  /**
   * URL to navigate to when clicked.
   */
  href?: string;

  /**
   * Callback when item is clicked.
   */
  onClick?: () => void;
}

function getMenuItemKey(item: TopNavMenuItemData): string {
  return item.title;
}

export interface TopNavMenuProps extends BaseProps<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
  /**
   * The visible label for the nav item trigger.
   */
  label: string;

  /**
   * Menu items to display in the hover popover.
   */
  items: TopNavMenuItemData[];

  /**
   * Delay before showing the menu on hover (ms).
   * @default 150
   */
  delay?: number;

  /**
   * Delay before hiding the menu after mouse leaves (ms).
   * @default 200
   */
  hideDelay?: number;
}

// =============================================================================
// TopNavMenu
// =============================================================================

/**
 * A navigation item that displays a hover-triggered overflow menu.
 *
 * Renders as a nav item in TopNav's startContent slot. On hover,
 * shows a popover with rich menu items containing an icon, title,
 * and optional description.
 *
 * @example
 * ```
 * <TopNav
 *   startContent={
 *     <>
 *       <TopNavItem label="Home" href="/" isSelected />
 *       <TopNavMenu
 *         label="Products"
 *         items={[
 *           {
 *             title: 'Analytics',
 *             description: 'Track and analyze user behavior',
 *             icon: <ChartBarIcon />,
 *             href: '/products/analytics',
 *           },
 *           {
 *             title: 'Messaging',
 *             description: 'Real-time communication tools',
 *             icon: <ChatBubbleIcon />,
 *             href: '/products/messaging',
 *           },
 *         ]}
 *       />
 *     </>
 *   }
 * />
 * ```
 */

export function TopNavMenu({
  ref,
  label,
  items,
  delay = 150,
  hideDelay = 200,
  className,
  style,
  onClick: onClickProp,
  onMouseEnter: onMouseEnterProp,
  onMouseLeave: onMouseLeaveProp,
  ...rest
}: TopNavMenuProps) {
  const renderMode = useTopNavRenderMode();
  const {closeMobileNav} = useAppShellMobile();
  const LinkComponent = useLinkComponent();
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const menuId = useId();

  const slot = useTopNavSlot();
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  const popover = usePopover({
    // The popup's own role="menu" is the exposed semantics; a modal dialog
    // wrapper would announce an unnamed dialog around the menu and make the
    // trigger claim aria-haspopup="dialog" for menu content (see TabMenu).
    role: 'none',
  });

  const {triggerProps, contentProps, menuRef, setTriggerEl, close} =
    useMenuHover<HTMLDivElement>({
      show: popover.show,
      hide: popover.hide,
      isOpen: popover.isOpen,
      isEnabled: true,
      showDelay: delay,
      hideDelay,
      // Trigger sits outside an auto popover; the invoker relationship exempts
      // it from light dismiss.
      popoverId: popover.id,
    });

  const setTriggerRef = useMergedRefs<HTMLButtonElement>(
    triggerButtonRef,
    popover.triggerRef,
    setTriggerEl,
    ref,
  );

  // The desktop popup is a composite menu widget per the APG menu pattern:
  // a single roving tab stop with ArrowUp/ArrowDown traversal (wrapping),
  // Home/End, and first-character typeahead. The hook owns item tabindex —
  // items render tabIndex={-1} and exactly one is promoted to 0. The
  // composition mirrors NavHeadingMenu.
  const {listRef, handleKeyDown, handleFocus, focusItem} =
    useListFocus<HTMLDivElement>({
      itemSelector: '[role="menuitem"]',
      hasRovingTabIndex: true,
      // Not popover.hide: Escape must also restore focus to the trigger.
      onEscape: close,
    });

  // First-character typeahead over the menu items (menus-11).
  const getMenuItems = useCallback(
    (): HTMLElement[] =>
      listRef.current
        ? Array.from(
            listRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]'),
          )
        : [],
    [listRef],
  );
  const typeahead = useTypeahead({
    getItemLabels: () => getMenuItems().map(el => el.textContent),
    onMatch: focusItem,
    getCurrentIndex: () =>
      getMenuItems().findIndex(
        el =>
          el === document.activeElement || el.contains(document.activeElement),
      ),
  });

  // Extend useListFocus with Enter/Space activation. Items rendered without an
  // `href` are `<div role="menuitem">` elements, which have no native keyboard
  // activation — without this, Enter/Space on a focused onClick-only item does
  // nothing. Anchor items (with `href`) already activate on Enter natively.
  const menuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const focused = document.activeElement as HTMLElement | null;
        if (focused?.getAttribute('role') === 'menuitem') {
          e.preventDefault();
          focused.click();
          return;
        }
      }
      if (typeahead.onKeyDown(e)) {
        e.preventDefault();
        return;
      }
      handleKeyDown(e);
    },
    [handleKeyDown, typeahead],
  );

  // Menu container carries both the hover hook's ref (for its open/close
  // focus management) and the list-focus ref (for roving tabindex/typeahead).
  const setMenuRef = useMergedRefs<HTMLDivElement>(menuRef, listRef);

  // Mobile bar: hide menus entirely
  if (renderMode === 'mobile-bar') {
    return null;
  }

  // Drawer mode: collapsible section
  if (renderMode === 'drawer') {
    return (
      <div className={drawerStyles.section}>
        <button
          type="button"
          {...rest}
          onMouseEnter={onMouseEnterProp}
          onMouseLeave={onMouseLeaveProp}
          onClick={composeEventHandlers(onClickProp, () =>
            setDrawerExpanded(v => !v),
          )}
          aria-expanded={drawerExpanded}
          aria-controls={`${menuId}-items`}
          {...mergeProps(
            // No overlay: `header`'s `backgroundColor: 'transparent'` replaces the
            // overlay's hover/press arms wholesale.
            {className: cn(focusOutlineStyles.focusVisible, navItemStyles.item, drawerStyles.header)},
            className,
            style,
          )}>
          {label}
          <Icon
            icon="chevronDown"
            size="sm"
            color="inherit"
            className={cn(drawerStyles.chevron, drawerExpanded && drawerStyles.chevronExpanded)}
          />
        </button>
        <div
          id={`${menuId}-items`}
          className={cn(drawerStyles.items, drawerExpanded && drawerStyles.itemsExpanded)}>
          <div className={drawerStyles.itemsInner}>
            {items.map(item => (
              <LinkComponent
                key={getMenuItemKey(item)}
                href={item.href}
                onClick={(_e: React.MouseEvent) => {
                  item.onClick?.();
                  closeMobileNav();
                }}
                className={cn(focusOutlineStyles.focusVisible, navItemStyles.item, interactionOverlayStyles.backgroundColor, drawerStyles.item)}>
                {item.icon && (
                  <span className={drawerStyles.itemIcon}>
                    {item.icon}
                  </span>
                )}
                <span className={drawerStyles.itemText}>
                  {item.title}
                  {item.description && (
                    <span className={drawerStyles.itemDescription}>
                      {item.description}
                    </span>
                  )}
                </span>
              </LinkComponent>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default: desktop popover
  return (
    <>
      <button
        ref={setTriggerRef}
        type="button"
        {...rest}
        {...popover.triggerProps}
        {...triggerProps}
        onClick={composeEventHandlers(onClickProp, triggerProps.onClick)}
        onMouseEnter={composeEventHandlers(
          onMouseEnterProp,
          triggerProps.onMouseEnter,
        )}
        onMouseLeave={composeEventHandlers(
          onMouseLeaveProp,
          triggerProps.onMouseLeave,
        )}
        {...mergeProps(
          themeProps('top-nav-menu'),
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
          ref={setMenuRef}
          role="menu"
          aria-label={label}
          {...contentProps}
          // After the contentProps spread so the full APG composition (roving
          // tabindex + typeahead + Enter/Space activation) replaces the hover
          // hook's basic arrow-key handler.
          onKeyDown={menuKeyDown}
          onFocus={handleFocus}
          className={styles.menuContainer}>
          {items.map(item => {
            const Element = item.href ? 'a' : 'div';
            return (
              <Element
                key={getMenuItemKey(item)}
                role="menuitem"
                // Single tab stop: useListFocus owns the roving tabindex and
                // promotes exactly one item to 0.
                tabIndex={-1}
                href={
                  item.href != null && isSafeUrl(item.href)
                    ? item.href
                    : undefined
                }
                onClick={item.onClick}
                className={cn(focusOutlineStyles.focusVisible, styles.menuItem)}>
                <div className={styles.menuItemIcon}>{item.icon}</div>
                <div className={styles.menuItemContent}>
                  <span className={styles.menuItemTitle}>
                    {item.title}
                  </span>
                  {item.description && (
                    <span className={styles.menuItemDescription}>
                      {item.description}
                    </span>
                  )}
                </div>
              </Element>
            );
          })}
        </div>,
        {
          placement: 'below',
          alignment: slot,
          offset: spacingVars['--spacing-1'],
        },
      )}
    </>
  );
}

TopNavMenu.displayName = 'TopNavMenu';
