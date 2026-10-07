'use client';

/**
 * @file NavHeadingMenuItem.tsx
 * @input Uses React, Tailwind classes, Icon, Text, NavMenuContext, useLinkComponent
 * @output Exports NavHeadingMenuItem component and NavHeadingMenuItemProps type
 * @position Core implementation; consumed by index.ts
 *
 * SYNC: When modified, update:
 * - /packages/core/src/NavMenu/index.ts
 */

import React, {useCallback, type ReactNode} from 'react';
import {renderIconSlot, type IconType} from '../Icon';
import {Text} from '../Text';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {useNavHeadingMenuContext} from './NavMenuContext';
import {useLinkComponent} from '../Link/useLinkComponent';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

const styles = {
  root: cn(
    'box-border flex items-center gap-(--spacing-2) w-full',
    'rounded-(--radius-element) font-(family-name:--font-family-body)',
    'text-(length:--text-label-size) text-(--color-text-primary)',
    'bg-transparent focus:bg-(--color-overlay-hover)',
    'can-hover:usable:hover:bg-(--color-overlay-hover)',
    '[border-width:0] [border-style:none]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'text-start [outline:none] [text-decoration:none]',
  ),
  content: 'flex flex-col [flex:1] min-w-0',
  disabled: 'opacity-50 cursor-default',
} as const;

const sizeStyles = {
  sm: 'py-(--spacing-1) px-(--spacing-2)',
  md: 'py-(--spacing-2) px-(--spacing-2)',
  lg: 'py-(--spacing-3) px-(--spacing-3)',
} as const;

export interface NavHeadingMenuItemProps extends Omit<
  BaseProps<HTMLElement>,
  'onClick'
> {
  ref?: React.Ref<HTMLElement>;
  /** Icon to display before the label. */
  icon?: ReactNode | IconType;
  /** Primary label text. */
  label: ReactNode;
  /** Secondary description text displayed below the label. */
  description?: ReactNode;
  /** URL to navigate to. Renders as an anchor element when provided. */
  href?: string;
  /** Callback when the item is selected. */
  onClick?: () => void;
  /** Whether the item is disabled. @default false */
  isDisabled?: boolean;
}

/**
 * Menu item for nav heading popovers.
 *
 * Reads size from the parent NavHeadingMenu for consistent padding.
 * Automatically dismisses the menu on click via context.
 * Renders as a link when `href` is provided.
 *
 * @example
 * ```
 * <NavHeadingMenu>
 *   <NavHeadingMenuItem label="Dashboard" href="/dashboard" />
 *   <NavHeadingMenuItem label="Settings" icon={GearIcon} onClick={open} />
 * </NavHeadingMenu>
 * ```
 */
export function NavHeadingMenuItem({
  ref,
  icon,
  label,
  description,
  href,
  onClick,
  isDisabled = false,
  className,
  style,
  'data-testid': testId,
}: NavHeadingMenuItemProps) {
  const ctx = useNavHeadingMenuContext();
  const size = ctx?.size ?? 'md';

  const handleClick = useCallback(() => {
    if (isDisabled) {
      return;
    }
    onClick?.();
    ctx?.closeMenu();
  }, [isDisabled, onClick, ctx]);

  const LinkComponent = useLinkComponent();
  const Element = href ? LinkComponent : 'div';

  return (
    <Element
      ref={ref}
      role="menuitem"
      tabIndex={isDisabled ? undefined : -1}
      aria-disabled={isDisabled || undefined}
      href={href}
      onClick={handleClick}
      data-testid={testId}
      {...mergeProps(
        themeProps('nav-heading-menu-item', {size}),
        {
          className: cn(
            styles.root,
            sizeStyles[size],
            isDisabled && styles.disabled,
          ),
        },
        className,
        style,
      )}>
      {icon && renderIconSlot(icon, {size: 'sm', color: 'secondary'})}
      <span className={styles.content}>
        {typeof label === 'string' ? (
          <Text type="body" maxLines={1}>
            {label}
          </Text>
        ) : (
          label
        )}
        {description && (
          <Text type="supporting" maxLines={1}>
            {description}
          </Text>
        )}
      </span>
    </Element>
  );
}

NavHeadingMenuItem.displayName = 'NavHeadingMenuItem';
