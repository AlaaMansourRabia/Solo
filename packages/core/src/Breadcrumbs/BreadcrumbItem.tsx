'use client';

/**
 * @file BreadcrumbItem.tsx
 * @input Uses React use/useRef/useEffect, Tailwind classes, theme tokens, BreadcrumbContext,
 *   rtlStyles for the contextual default slash, and (for the menu trigger)
 *   usePopover + the shared DropdownMenu item API (renderDropdownItems,
 *   DropdownMenuContext, MENU_ITEM_SELECTOR, useListFocus)
 * @output Exports BreadcrumbItem component and BreadcrumbItemProps
 * @position Individual breadcrumb item; used inside Breadcrumbs
 *
 * A `menu` prop turns the item's link-styled button into a menu trigger whose
 * popover reuses DropdownMenu's item pipeline — the same wiring ContextMenu
 * uses — so menu-item definitions are portable across the menu family.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Breadcrumbs/Breadcrumbs.doc.mjs
 * - /packages/core/src/Breadcrumbs/Breadcrumbs.test.tsx
 * - /packages/core/src/Breadcrumbs/index.ts
 * - /apps/storybook/stories/Breadcrumbs.stories.tsx
 */

import React, {
  use,
  useCallback,
  useId,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from 'react';
import {BreadcrumbContext, type BreadcrumbsVariant} from './Breadcrumbs';
import {useLinkComponent} from '../Link/useLinkComponent';
import type {LinkComponentType} from '../Link/types';
import {mergeProps, rtlStyles} from '../utils';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';
import {Icon} from '../Icon';
import {usePopover} from '../Popover/usePopover';
import {useListFocus} from '../hooks/useListFocus';
import {useTypeahead} from '../hooks/useTypeahead';
import {layerAnimations} from '../Layer/layerAnimations.styles';
import {renderDropdownItems} from '../DropdownMenu/renderDropdownItems';
import {
  DropdownMenuContext,
  type DropdownMenuContextValue,
  type DropdownMenuSize,
} from '../DropdownMenu/DropdownMenuContext';
import {
  MENU_ITEM_ROLES,
  MENU_ITEM_SELECTOR,
  MENU_BOUNDARY_SELECTOR,
} from '../DropdownMenu/menuItemRoles';
import type {DropdownMenuOption} from '../DropdownMenu/DropdownMenu';

import {useMergedRefs} from '../hooks/useMergedRefs';
// =============================================================================
// Props
// =============================================================================

export interface BreadcrumbItemProps extends Omit<
  BaseProps<HTMLLIElement>,
  'onClick'
> {
  ref?: React.Ref<HTMLLIElement>;
  /**
   * Custom component to render instead of `<a>` for breadcrumb links.
   * Overrides the provider-level default set by LinkProvider.
   * Only applies for non-current items. Must accept href, className, style, and children props.
   */
  as?: LinkComponentType;
  /**
   * Label content of the breadcrumb item.
   */
  children: ReactNode;
  /**
   * URL for the breadcrumb link. Omit for the current page.
   */
  href?: string;
  /**
   * Click handler. Works with or without href.
   */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /**
   * Marks this item as the current page. Renders as a span with aria-current="page".
   * When omitted, the last item is auto-detected as current if no item is
   * explicitly current. Pass `false` to opt this item out of auto-detection.
   * @default undefined
   */
  isCurrent?: boolean;
  /**
   * Optional icon rendered before the label.
   */
  startIcon?: ReactNode;
  /**
   * Menu opened when the item is activated. Accepts the SAME item API as
   * DropdownMenu / MoreMenu / ContextMenu, so a consumer's existing menu-item
   * definitions are portable into a breadcrumb with no rewrite:
   * - a `DropdownMenuOption[]` data array (items, sections, dividers), or
   * - composed `DropdownMenuItem` / `DropdownMenuCheckboxItem` /
   *   `DropdownMenuRadioGroup` children.
   *
   * When set, the item renders as a link-styled menu trigger (button + a
   * trailing chevron, `aria-haspopup="menu"` / `aria-expanded`) whose popover
   * is a `role="menu"` container that provides `DropdownMenuContext` and runs
   * `useListFocus`. Takes precedence over `href` / `onClick` (which are
   * ignored when `menu` is set — a dev-time warning is logged).
   */
  menu?: DropdownMenuOption[] | ReactNode;
  /**
   * Size passed to the menu items via `DropdownMenuContext` (item
   * padding/typography). Defaults from the breadcrumb variant:
   * `'supporting'` → `'sm'`, otherwise `'md'`.
   */
  menuSize?: DropdownMenuSize;
}

// =============================================================================
// Styles
// =============================================================================

const itemStyles = {
  root: cn(
    'flex items-center gap-(--spacing-1) m-0',
    '[--separator-display:flex] first:[--separator-display:none]',
  ),
  defaultSize: 'text-(length:--text-body-size) leading-(--text-body-leading)',
  supportingSize:
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
  contentWrapper: 'flex items-center gap-(--spacing-1)',
  link: cn(
    'flex items-center gap-(--spacing-1) py-(--spacing-1)',
    '[text-decoration:none] can-hover:usable:hover:[text-decoration:underline]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  ),
  // Reset native button styles so onClick-only items match link appearance.
  // paddingInline rather than padding: a blanket `padding` also overrides the
  // paddingBlock `link` sets above, which shrank the button crumbs to 20px
  // against their sibling links' 28px.
  buttonReset:
    'bg-transparent [border-width:0] [border-style:none] px-0 m-0 [font:inherit]',
  defaultLink: 'text-(--color-text-secondary)',
  supportingLink: 'text-(--color-text-secondary)',
  current: 'font-(number:--font-weight-semibold)',
  defaultCurrent: 'text-(--color-text-primary)',
  supportingCurrent: 'text-(--color-text-secondary)',
  icon: 'flex items-center shrink-0',
  // Sized off supporting text (12px) — exactly Icon's `xsm` box at the
  // default type scale. Width/height stay on the token so the box and the
  // glyph keep matching if a theme retunes the supporting step.
  chevron: cn(
    'flex items-center shrink-0',
    'w-(--text-supporting-size) h-(--text-supporting-size)',
    'text-(length:--text-supporting-size)',
  ),
  separator: cn(
    '[display:var(--separator-display)] items-center',
    'text-(--color-text-secondary) py-(--spacing-1) select-none',
  ),
} as const;

function BreadcrumbSeparator({separator}: {separator: ReactNode}) {
  return (
    <span aria-hidden="true" className={itemStyles.separator}>
      {separator === '/' ? (
        <span className={rtlStyles.mirror}>/</span>
      ) : (
        separator
      )}
    </span>
  );
}

const menuStyles = {
  menu: cn(
    'box-border flex flex-col gap-(--spacing-0-5) max-h-[300px] overflow-y-auto',
    '[--_dropdown-menu-radius:var(--radius-container)]',
    '[--_dropdown-menu-padding:var(--spacing-1)]',
    'p-(--spacing-1) rounded-(--_dropdown-menu-radius) select-none',
  ),
  popover: 'min-w-[160px] my-(--spacing-1)',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * An individual breadcrumb item. Renders as a link (`<a>`) or a span
 * depending on whether it represents the current page.
 *
 * Each item renders its own leading separator, hidden on :first-child via
 * CSS. Auto-current detection uses a post-render effect that checks the
 * DOM — no React child introspection.
 *
 * @example
 * ```
 * <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
 * <BreadcrumbItem isCurrent>My Project</BreadcrumbItem>
 * ```
 */
export function BreadcrumbItem({
  ref,
  as,
  children,
  href,
  onClick,
  isCurrent: isCurrentProp,
  startIcon,
  menu,
  menuSize,
  className,
  style,
  'data-testid': testId,
  ...rest
}: BreadcrumbItemProps) {
  const ctx = use(BreadcrumbContext);
  const LinkComponent = useLinkComponent(as);
  const isSupporting = ctx.variant === 'supporting';
  const liRef = useRef<HTMLLIElement>(null);
  // Points at the element we render to hold the item's content (the
  // link/button/span in the auto-candidate path). Auto-current detection sets
  // aria-current on this instead of guessing the <li>'s last child.
  const contentRef = useRef<HTMLElement>(null);

  const isCurrent = isCurrentProp === true;
  const isAutoCandidate = isCurrentProp == null;
  const hasMenu = menu != null;
  const resolvedMenuSize: DropdownMenuSize =
    menuSize ?? (isSupporting ? 'sm' : 'md');

  // `menu` owns the click interaction; a label can't both navigate/act and
  // open a menu on the same activation. Warn once so the (ignored) href/onClick
  // don't silently disappear on the consumer.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && hasMenu) {
      if (href != null) {
        console.warn(
          'BreadcrumbItem: `menu` and `href` are mutually exclusive; `menu` ' +
            'takes precedence and `href` is ignored.',
        );
      } else if (onClick != null) {
        console.warn(
          'BreadcrumbItem: `menu` and `onClick` are mutually exclusive; ' +
            '`menu` takes precedence and `onClick` is ignored.',
        );
      }
    }
  }, [hasMenu, href, onClick]);

  // Auto-detect: if no sibling has aria-current="page" and this is the last
  // non-separator item, set aria-current on our content element.
  // Runs as useEffect (not layout) — only sets an aria attribute, no visual change.
  // Placed on the item's content element (the link/button/span after the
  // separator), matching where the explicit `isCurrent` path sets it, so
  // aria-current lands on the actual interactive element — including when the
  // last item is a link — rather than on the outer <li> (navigation-11).
  useEffect(() => {
    if (!isAutoCandidate) {
      return;
    }

    const li = liRef.current;
    if (!li) {
      return;
    }
    const ol = li.parentElement;
    if (!ol) {
      return;
    }

    // All breadcrumb items (li without aria-hidden are items, with aria-hidden are separators — but we no longer have separator lis)
    const items = Array.from(ol.children) as HTMLElement[];
    const isLast = items.length > 0 && items[items.length - 1] === li;
    const hasExplicit = ol.querySelector('[aria-current="page"]');

    if (isLast && !hasExplicit) {
      // We control the element that holds the content (see the auto-candidate
      // render path below), so set aria-current on that ref rather than
      // assuming a positional last child. Fall back to the <li> only if the
      // ref is somehow unresolved.
      const target = contentRef.current ?? li;
      target.setAttribute('aria-current', 'page');
      return () => {
        target.removeAttribute('aria-current');
      };
    }
  });

  const mergedItemRef = useMergedRefs(ref, liRef);

  const content = (
    <>
      {startIcon && <span className={itemStyles.icon}>{startIcon}</span>}
      {children}
    </>
  );

  if (isCurrent) {
    return (
      <li
        ref={mergedItemRef}
        {...mergeProps(
          themeProps('breadcrumb-item', {variant: ctx.variant}),
          {
            className: cn(
              itemStyles.root,
              isSupporting ? itemStyles.supportingSize : itemStyles.defaultSize,
            ),
          },
          className,
          style,
        )}
        data-testid={testId}
        {...rest}>
        <BreadcrumbSeparator separator={ctx.separator} />
        {hasMenu ? (
          // A current crumb can also open a sibling menu — the trigger keeps
          // both aria-current="page" and aria-haspopup="menu".
          <BreadcrumbMenuTrigger
            ref={contentRef}
            menu={menu}
            menuSize={resolvedMenuSize}
            variant={ctx.variant}
            isCurrent>
            {content}
          </BreadcrumbMenuTrigger>
        ) : (
          <span
            className={cn(
              itemStyles.contentWrapper,
              itemStyles.current,
              isSupporting
                ? itemStyles.supportingCurrent
                : itemStyles.defaultCurrent,
            )}
            aria-current="page">
            {content}
          </span>
        )}
      </li>
    );
  }

  // Items without isCurrent set render as links (if href) or plain spans.
  // The effect handles adding aria-current for auto-last detection.
  return (
    <li
      ref={mergedItemRef}
      {...mergeProps(
        themeProps('breadcrumb-item', {variant: ctx.variant}),
        {
          className: cn(
            itemStyles.root,
            isSupporting ? itemStyles.supportingSize : itemStyles.defaultSize,
          ),
        },
        className,
        style,
      )}
      data-testid={testId}
      {...rest}>
      <BreadcrumbSeparator separator={ctx.separator} />
      {hasMenu ? (
        <BreadcrumbMenuTrigger
          ref={contentRef}
          menu={menu}
          menuSize={resolvedMenuSize}
          variant={ctx.variant}>
          {content}
        </BreadcrumbMenuTrigger>
      ) : href != null ? (
        <LinkComponent
          ref={contentRef}
          href={href}
          onClick={onClick}
          className={cn(
            focusOutlineStyles.focusVisible,
            itemStyles.link,
            isSupporting ? itemStyles.supportingLink : itemStyles.defaultLink,
          )}>
          {content}
        </LinkComponent>
      ) : onClick != null ? (
        <button
          ref={contentRef as React.RefObject<HTMLButtonElement | null>}
          type="button"
          onClick={onClick}
          className={cn(
            focusOutlineStyles.focusVisible,
            itemStyles.link,
            itemStyles.buttonReset,
            isSupporting ? itemStyles.supportingLink : itemStyles.defaultLink,
          )}>
          {content}
        </button>
      ) : (
        <span
          ref={contentRef}
          className={cn(
            itemStyles.contentWrapper,
            itemStyles.current,
            isSupporting
              ? itemStyles.supportingCurrent
              : itemStyles.defaultCurrent,
          )}>
          {content}
        </span>
      )}
    </li>
  );
}

BreadcrumbItem.displayName = 'BreadcrumbItem';

// =============================================================================
// Menu trigger
// =============================================================================

interface BreadcrumbMenuTriggerProps {
  ref: React.Ref<HTMLElement>;
  /** The link-styled label content rendered inside the trigger button. */
  children: ReactNode;
  menu: DropdownMenuOption[] | ReactNode;
  menuSize: DropdownMenuSize;
  variant: BreadcrumbsVariant;
  isCurrent?: boolean;
}

/**
 * The link-styled `<button>` trigger + its `role="menu"` popover. Reuses the
 * DropdownMenu item pipeline (`renderDropdownItems` for arrays, the item
 * components for children) inside a `useListFocus` container that provides
 * `DropdownMenuContext` — the same wiring ContextMenu uses — so menu-item
 * definitions are portable into a breadcrumb with no rewrite.
 */
function BreadcrumbMenuTrigger({
  ref,
  children,
  menu,
  menuSize,
  variant,
  isCurrent = false,
}: BreadcrumbMenuTriggerProps) {
  const menuId = useId();
  const triggerId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isSupporting = variant === 'supporting';

  const popover = usePopover({
    hasLightDismiss: true,
    hasCloseButton: false,
    hasAutoFocus: false,
    // The popup's own role="menu" is the exposed semantics; a modal dialog
    // wrapper would announce an unnamed dialog around the menu.
    role: 'none',
  });

  const closeMenu = useCallback(() => {
    popover.hide();
  }, [popover]);

  const {
    listRef,
    handleKeyDown: listNavKeyDown,
    focusFirst,
    focusItem,
    ownsEvent,
    getItems: getMenuItems,
  } = useListFocus<HTMLDivElement>({
    itemSelector: MENU_ITEM_SELECTOR,
    boundarySelector: MENU_BOUNDARY_SELECTOR,
    wrap: false,
    onEscape: closeMenu,
  });

  const typeahead = useTypeahead({
    getItemLabels: () => getMenuItems().map(el => el.textContent),
    onMatch: focusItem,
    getCurrentIndex: () =>
      getMenuItems().findIndex(
        el =>
          el === document.activeElement || el.contains(document.activeElement),
      ),
  });

  const listKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // A submenu flyout renders inline inside this menu; its key events bubble
      // up here. Let that level own them — only handle events from this level.
      if (!ownsEvent(e)) {
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const focused = document.activeElement as HTMLElement | null;
        if (
          focused &&
          MENU_ITEM_ROLES.has(focused.getAttribute('role') ?? '')
        ) {
          focused.click();
        }
        return;
      }
      // APG menu-button pattern: Tab closes the menu (items are tabIndex={-1}).
      if (e.key === 'Tab') {
        closeMenu();
        return;
      }
      if (typeahead.onKeyDown(e)) {
        e.preventDefault();
        return;
      }
      listNavKeyDown(e);
    },
    [listNavKeyDown, closeMenu, typeahead, ownsEvent],
  );

  const openAndFocus = useCallback(() => {
    popover.show();
    requestAnimationFrame(() => focusFirst());
  }, [popover, focusFirst]);

  const handleClick = useCallback(() => {
    if (popover.isOpen) {
      popover.hide();
    } else {
      openAndFocus();
    }
  }, [popover, openAndFocus]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!popover.isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openAndFocus();
        }
      }
    },
    [popover.isOpen, openAndFocus],
  );

  const contextValue = useMemo<DropdownMenuContextValue>(
    () => ({closeMenu, menuSize}),
    [closeMenu, menuSize],
  );

  const menuContent = Array.isArray(menu) ? renderDropdownItems(menu) : menu;

  return (
    <>
      <button
        ref={useMergedRefs(
          ref as React.Ref<HTMLButtonElement>,
          buttonRef,
          popover.triggerRef,
        )}
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...popover.triggerProps}
        id={triggerId}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-current={isCurrent ? 'page' : undefined}
        {...mergeProps(
          themeProps('breadcrumb-item-menu-trigger', {variant}),
          // Through mergeProps, not a second spread: a sibling className
          // spread replaces the className themeProps() built, which is how the
          // documented breadcrumb-item-menu-trigger target came to render on
          // nothing.
          {
            className: cn(
              focusOutlineStyles.focusVisible,
              itemStyles.link,
              itemStyles.buttonReset,
              isSupporting ? itemStyles.supportingLink : itemStyles.defaultLink,
            ),
          },
        )}>
        {children}
        <Icon
          icon="chevronDown"
          // 0.75rem — the 12px supporting-text box the bare glyph already
          // rendered at; `itemStyles.chevron` keeps that box on the token.
          size="xsm"
          // The chevron reads as part of the link label, so it takes the
          // trigger's link color rather than an icon color.
          color="inherit"
          className={itemStyles.chevron}
        />
      </button>

      {popover.render(
        <div
          ref={listRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          onKeyDown={listKeyDown}
          {...mergeProps(
            themeProps('breadcrumb-menu'),
            {className: menuStyles.menu},
          )}>
          <DropdownMenuContext value={contextValue}>
            {menuContent}
          </DropdownMenuContext>
        </div>,
        {
          placement: 'below',
          alignment: 'start',
          className: cn(menuStyles.popover, layerAnimations.below),
        },
      )}
    </>
  );
}

BreadcrumbMenuTrigger.displayName = 'BreadcrumbMenuTrigger';
