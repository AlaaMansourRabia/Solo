'use client';

/**
 * @file TopNavMegaMenuItem.tsx
 * @input Uses React, Tailwind classes, theme tokens, navItemStyles, TopNavRenderContext
 * @output Exports TopNavMegaMenuItem component and props
 * @position Individual item inside an TopNavMegaMenu — renders itself in both
 *   desktop (popover) and mobile drawer modes.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/TopNav/TopNav.doc.mjs
 * - /packages/core/src/TopNav/index.ts
 */

import React, {type ReactNode} from 'react';
import {cn} from '../utils/cn';
import {navItemStyles} from '../NavItem/navItemStyles.styles';
import {useLinkComponent} from '../Link/useLinkComponent';
import type {LinkComponentType} from '../Link/types';
import {useTopNavRenderMode} from './TopNavRenderContext';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {useAppShellMobile} from '../AppShell/AppShellMobileContext';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';

// =============================================================================
// Styles
// =============================================================================

const styles = {
  // Desktop popover item
  desktop: cn(
    'flex items-start gap-(--spacing-3) py-(--spacing-3) px-(--spacing-3)',
    'rounded-(--radius-element) [text-decoration:none]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition-property:background-color] [transition-duration:var(--duration-fast)]',
    '[transition-timing-function:var(--ease-standard)]',
    '[border-width:0] [border-style:none] text-inherit [font-family:inherit] text-start',
    'box-border w-full',
  ),
  desktopIcon: cn(
    'flex items-center justify-center w-[40px] h-[40px] rounded-(--radius-element)',
    'bg-(--color-neutral) shrink-0 text-(--color-icon-secondary)',
  ),
  desktopContent: 'flex flex-col gap-(--spacing-1) min-w-0',
  desktopTitle: cn(
    'text-(length:--text-label-size) leading-(--text-label-leading)',
    'font-(number:--font-weight-semibold) text-(--color-text-primary)',
  ),
  desktopDescription: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'font-(number:--font-weight-normal) text-(--color-text-secondary)',
  ),
  // Drawer item overrides (base from navItemStyles.item)
  drawerItem: 'ps-(--spacing-6) items-start [text-decoration:none]',
  drawerItemIcon: cn(
    'flex items-center justify-center w-[32px] h-[32px] rounded-(--radius-element)',
    'bg-(--color-neutral) shrink-0 text-(--color-icon-secondary) mbs-(--spacing-0-5)',
  ),
  drawerItemContent: 'flex flex-col gap-(--spacing-0-5) min-w-0',
  drawerItemDescription: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary) font-(number:--font-weight-normal)',
  ),
} as const;

// =============================================================================
// Types
// =============================================================================

export interface TopNavMegaMenuItemProps extends Omit<
  BaseProps<HTMLElement>,
  'onClick'
> {
  ref?: React.Ref<HTMLElement>;
  /** Display title for the menu item. */
  title: string;
  /** Optional description text displayed below the title. */
  description?: string;
  /** Optional icon element displayed to the left. */
  icon?: ReactNode;
  /** URL to navigate to when clicked. */
  href?: string;
  /** Callback when item is clicked. */
  onClick?: () => void;
  /**
   * Custom component to render instead of `<a>` for link items.
   * Overrides the provider-level default set by LinkProvider.
   */
  as?: LinkComponentType;
}

// =============================================================================
// Component
// =============================================================================

/**
 * An individual item inside an TopNavMegaMenu.
 *
 * Renders itself in both desktop (popover grid) and mobile drawer modes
 * using TopNavRenderContext to switch appearance.
 *
 * @example
 * ```
 * <TopNavMegaMenu
 *   label="Products"
 *   items={
 *     <>
 *       <TopNavMegaMenuItem
 *         title="Analytics"
 *         description="Track and analyze user behavior"
 *         icon={<ChartIcon />}
 *         href="/analytics"
 *       />
 *       <TopNavMegaMenuItem title="Reports" href="/reports" />
 *     </>
 *   }
 * />
 * ```
 */
export function TopNavMegaMenuItem({
  ref,
  title,
  description,
  icon,
  href,
  onClick,
  as,
  tabIndex,
}: TopNavMegaMenuItemProps) {
  const renderMode = useTopNavRenderMode();
  const LinkComponent = useLinkComponent(as);
  const {closeMobileNav} = useAppShellMobile();

  // =========================================================================
  // Drawer mode — matches SideNavItem / TopNavMenu drawer appearance
  // =========================================================================
  if (renderMode === 'drawer') {
    const Element = href ? LinkComponent : 'button';
    const elementProps = Element === 'button' ? {type: 'button' as const} : {};
    const handleDrawerClick = () => {
      onClick?.();
      closeMobileNav();
    };
    return (
      <Element
        ref={ref}
        href={href}
        onClick={handleDrawerClick}
        {...elementProps}
        {...mergeProps(
          themeProps('top-nav-mega-menu-item', {mode: 'drawer'}),
          {className: cn(focusOutlineStyles.focusVisible, navItemStyles.item, interactionOverlayStyles.backgroundColor, styles.drawerItem)},
        )}>
        {icon && <div className={styles.drawerItemIcon}>{icon}</div>}
        <div className={styles.drawerItemContent}>
          {title}
          {description && (
            <span className={styles.drawerItemDescription}>
              {description}
            </span>
          )}
        </div>
      </Element>
    );
  }

  // =========================================================================
  // Default mode — desktop popover item with large icon + description
  // =========================================================================
  const Element = href ? LinkComponent : 'div';
  return (
    <Element
      ref={ref}
      href={href}
      onClick={onClick}
      tabIndex={tabIndex}
      {...mergeProps(
        themeProps('top-nav-mega-menu-item'),
        {className: cn(focusOutlineStyles.focusVisible, styles.desktop, interactionOverlayStyles.backgroundColor)},
      )}>
      {icon && <div className={styles.desktopIcon}>{icon}</div>}
      <div className={styles.desktopContent}>
        <span className={styles.desktopTitle}>{title}</span>
        {description && (
          <span className={styles.desktopDescription}>
            {description}
          </span>
        )}
      </div>
    </Element>
  );
}

TopNavMegaMenuItem.displayName = 'TopNavMegaMenuItem';
