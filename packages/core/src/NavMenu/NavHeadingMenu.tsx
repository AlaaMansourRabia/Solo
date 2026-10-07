'use client';

/**
 * @file NavHeadingMenu.tsx
 * @input Uses React, Tailwind classes, useListFocus, NavMenuContext
 * @output Exports NavHeadingMenu component and NavHeadingMenuProps type
 * @position Core implementation; consumed by index.ts
 *
 * SYNC: When modified, update:
 * - /packages/core/src/NavMenu/index.ts
 */

import React, {useCallback, useMemo, type ReactNode} from 'react';
import {composeEventHandlers, mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {useListFocus} from '../hooks/useListFocus';
import {useTypeahead} from '../hooks/useTypeahead';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';
import {
  NavHeadingMenuContext,
  useNavHeadingCloseContext,
  type NavHeadingMenuSize,
} from './NavMenuContext';

import {useMergedRefs} from '../hooks/useMergedRefs';
const styles = {
  root: 'flex flex-col gap-(--spacing-0-5)',
} as const;

const sizeStyles = {
  sm: 'min-w-[160px]',
  md: 'min-w-[200px]',
  lg: 'min-w-[240px]',
} as const;

export interface NavHeadingMenuProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /** Menu items (NavHeadingMenuItem, dividers, custom content). */
  children: ReactNode;

  /**
   * Size — controls min-width and flows to items for padding.
   * @default 'md'
   */
  size?: NavHeadingMenuSize;

  /**
   * Minimum width override. Takes precedence over size-based defaults.
   */
  minWidth?: number | string;
}

/**
 * Accessible menu container for nav heading popovers.
 *
 * Provides `role="menu"` with arrow-key navigation (Home/End/Escape)
 * and a size context that flows to child items for consistent padding.
 * Pass as the `menu` prop of SideNavHeading or TopNavHeading.
 *
 * The parent heading component injects the close callback via context,
 * so items automatically dismiss the popover on selection.
 *
 * @example
 * ```
 * <SideNavHeading
 *   heading="Products"
 *   menu={
 *     <NavHeadingMenu size="lg">
 *       <NavHeadingMenuItem label="Dashboard" href="/dashboard" />
 *       <NavHeadingMenuItem label="Analytics" href="/analytics" />
 *     </NavHeadingMenu>
 *   }
 * />
 * ```
 */
export function NavHeadingMenu({
  ref,
  children,
  size = 'md',
  minWidth,
  className,
  style: styleProp,
  'data-testid': testId,
  onKeyDown: onKeyDownProp,
  ...rest
}: NavHeadingMenuProps) {
  const closeCtx = useNavHeadingCloseContext();
  const closeMenu = closeCtx?.closeMenu;

  const {listRef, handleKeyDown, focusItem} = useListFocus({
    itemSelector: '[role="menuitem"]:not([aria-disabled="true"])',
    onEscape: closeMenu,
  });

  // First-character typeahead over the (enabled) menu items (menus-11).
  const getMenuItems = useCallback(
    (): HTMLElement[] =>
      listRef.current
        ? Array.from(
            listRef.current.querySelectorAll<HTMLElement>(
              '[role="menuitem"]:not([aria-disabled="true"])',
            ),
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
  const listKeyDown = useCallback(
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

  const ctx = useMemo(
    () => ({
      closeMenu: closeMenu ?? (() => {}),
      size,
    }),
    [closeMenu, size],
  );

  const inlineStyle = minWidth != null ? {...styleProp, minWidth} : styleProp;

  return (
    <NavHeadingMenuContext value={ctx}>
      <div
        ref={useMergedRefs(ref, listRef)}
        data-testid={testId}
        {...mergeProps(
          themeProps('nav-heading-menu', {size}),
          {className: cn(styles.root, sizeStyles[size])},
          className,
          inlineStyle,
        )}
        {...rest}
        role="menu"
        onKeyDown={composeEventHandlers(onKeyDownProp, listKeyDown)}>
        {children}
      </div>
    </NavHeadingMenuContext>
  );
}

NavHeadingMenu.displayName = 'NavHeadingMenu';
