'use client';

/**
 * @file TopNavItem.tsx
 * @input Uses React, ReactNode, BaseProps, LinkComponentType
 * @output Exports TopNavItem component and TopNavItemProps
 * @position Navigation item component for TopNav startContent
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/TopNav/TopNav.doc.mjs
 * - /packages/core/src/TopNav/TopNav.test.tsx
 * - /packages/core/src/TopNav/index.ts
 * - /apps/storybook/stories/TopNav.stories.tsx
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {cn} from '../utils/cn';
import {useLinkComponent} from '../Link/useLinkComponent';
import type {LinkComponentType} from '../Link/types';
import {useTopNavRenderMode} from './TopNavRenderContext';
import {navItemStyles, type NavItemSize} from '../NavItem/navItemStyles.styles';
import {mergeProps} from '../utils';
import {useAppShellMobile} from '../AppShell/AppShellMobileContext';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';

/**
 * NavItem styles with hover/selected states
 */
const styles = {
  base: cn(
    'inline-flex items-center gap-(--spacing-2) py-(--spacing-1-5) px-(--spacing-3)',
    'rounded-(--radius-element) text-(length:--text-label-size) leading-(--text-label-leading)',
    'font-(number:--font-weight-medium) text-(--color-text-secondary) [text-decoration:none]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition-property:background-color,color] [transition-duration:var(--duration-fast)]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  // `selected` replaces a composed `backgroundColor` wholesale (every
  // condition), dropping `interactionOverlayStyles.backgroundColor`'s hover
  // and pressed arms. The classes below repeat that overlay's variant chains
  // so `cn()` drops them when `selected` is composed after it.
  selected: cn(
    'text-(--color-text-primary) font-(number:--font-weight-semibold)',
    'bg-(--color-neutral) can-hover:usable:hover:bg-(--color-neutral)',
    'active:bg-(--color-neutral)',
    'usable:active:bg-(--color-neutral) can-hover:usable:active:bg-(--color-neutral)',
  ),
  iconOnly: 'px-(--spacing-2)',
  // Drawer mode — focus outline (base item + selected come from navItemStyles)
} as const;

export interface TopNavItemProps extends BaseProps<HTMLAnchorElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLAnchorElement>;
  /** Link destination URL. */
  href?: string;
  /** Where to open the linked document. */
  target?: string;
  /** Link relationship. */
  rel?: string;
  /** Causes the browser to download the linked URL. */
  download?: string | boolean;
  /** Referrer policy for the link. */
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  /**
   * Custom component to render instead of `<a>`.
   * Overrides the provider-level default set by LinkProvider.
   * Must accept href, className, style, and children props.
   */
  as?: LinkComponentType;
  /**
   * The accessible label for the nav item.
   * Rendered as visible text by default. When `isIconOnly` is true,
   * used as aria-label instead.
   */
  label: string;
  /**
   * Whether this nav item is currently selected/highlighted.
   * @default false
   */
  isSelected?: boolean;
  /**
   * Whether the nav item is disabled.
   * A disabled item renders as a plain anchor without an href (and without
   * target), so it cannot navigate and is removed from the tab order.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Renders the item as a square icon-only element.
   * When true, `label` becomes the aria-label and visible text is hidden.
   * Requires `icon` to be set.
   * @default false
   */
  isIconOnly?: boolean;
  /**
   * Optional icon to display before the label.
   */
  icon?: ReactNode;
  /**
   * Optional content to render instead of the label.
   */
  children?: ReactNode;
  /**
   * Size variant for the nav item. Has no effect in horizontal mode;
   * controls height/padding in drawer mode.
   * @default 'md'
   */
  size?: NavItemSize;
}

/**
 * Click handler for disabled items. The disabled anchor renders without an
 * href, so there is no navigation to block in practice; preventDefault is a
 * defensive guard against synthetic/programmatic clicks.
 */
function preventDefaultClick(event: React.MouseEvent<HTMLAnchorElement>): void {
  event.preventDefault();
}

/**
 * A navigation item for use within TopNav startContent.
 *
 * Renders as an anchor element with hover/selected states.
 * Supports icons and selected state indication with highlighted appearance.
 *
 * @example
 * ```
 * <TopNav
 *   startContent={
 *     <>
 *       <TopNavItem label="Home" href="/" isSelected />
 *       <TopNavItem label="Products" href="/products" />
 *       <TopNavItem label="Settings" href="/settings" icon={<GearIcon />} isIconOnly />
 *     </>
 *   }
 * />
 * ```
 */
export function TopNavItem({
  as,
  href,
  target,
  onClick,
  label,
  isSelected = false,
  isDisabled = false,
  isIconOnly = false,
  icon,
  children,
  size = 'md',
  className,
  style,
  ref,
  ...props
}: TopNavItemProps) {
  const LinkComponent = useLinkComponent(as);
  const renderMode = useTopNavRenderMode();
  const {closeMobileNav} = useAppShellMobile();

  // A disabled item renders as a plain <a> with no href: an href-less anchor
  // is not focusable and exposes no link affordance, so programmatic focus +
  // Enter, AT activation commands, and middle-click cannot navigate or fire
  // the consumer onClick. The router LinkComponent is deliberately skipped —
  // a disabled item performs no navigation, and custom router links may
  // require a live href. target is omitted with the href. (Mirrors the
  // disabled paths of Link and SideNavItem.)
  const Root = isDisabled ? 'a' : LinkComponent;

  // =========================================================================
  // Drawer mode — render as a SideNavItem-style vertical list element
  // =========================================================================
  if (renderMode === 'drawer') {
    const handleDrawerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isDisabled) {
        preventDefaultClick(e);
        return;
      }
      // Forward the original onClick if present
      onClick?.(e);
      closeMobileNav();
    };

    return (
      <Root
        ref={ref}
        href={isDisabled ? undefined : href}
        target={isDisabled ? undefined : target}
        aria-label={isIconOnly ? label : undefined}
        aria-current={isSelected ? 'page' : undefined}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : undefined}
        {...mergeProps(
          themeProps('top-nav-item', {
            mode: 'drawer',
            selected: isSelected ? 'selected' : null,
          }),
          {className: cn(focusOutlineStyles.focusVisible, navItemStyles.item, interactionOverlayStyles.backgroundColor, navItemStyles[size], isSelected && navItemStyles.selected, isDisabled && navItemStyles.disabled)},
          className,
          style,
        )}
        {...props}
        onClick={handleDrawerClick}>
        {icon}
        {!isIconOnly && (children ?? label)}
      </Root>
    );
  }

  // =========================================================================
  // Default / mobile-bar mode — standard horizontal nav item
  // =========================================================================

  return (
    <Root
      ref={ref}
      href={isDisabled ? undefined : href}
      target={isDisabled ? undefined : target}
      onClick={isDisabled ? preventDefaultClick : onClick}
      aria-label={isIconOnly ? label : undefined}
      aria-current={isSelected ? 'page' : undefined}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : undefined}
      {...mergeProps(
        themeProps('top-nav-item', {
          selected: isSelected ? 'selected' : null,
        }),
        {className: cn(focusOutlineStyles.focusVisible, styles.base, interactionOverlayStyles.backgroundColor, isSelected && styles.selected, isDisabled && navItemStyles.disabled, isIconOnly && styles.iconOnly)},
        className,
        style,
      )}
      {...props}>
      {icon}
      {!isIconOnly && (children ?? label)}
    </Root>
  );
}

TopNavItem.displayName = 'TopNavItem';
