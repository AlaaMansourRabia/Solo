'use client';

/**
 * @file SideNavItem.tsx
 * @input Uses React, ReactNode, Tailwind classes, Icon, IconType, useMenuHover
 * @output Exports SideNavItem component and SideNavItemProps
 * @position Core implementation; used inside SideNav children
 *
 * Navigation item with icon, selected state, row-level actions, and nesting.
 * Collapsed icon-only controls use a meaningful consumer `aria-label` when
 * provided and fall back to `label` when it is missing or blank.
 *
 * Collapsed items with children open their submenu flyout through
 * `useMenuHover`, the shared hover-intent hook (same one `SideNavHeading` and
 * `TopNavMenu` use). Hover is a progressive enhancement over the popover's
 * click behavior and is inert on coarse pointers.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/SideNav/SideNav.doc.mjs
 * - /packages/core/src/SideNav/SideNav.test.tsx
 * - /packages/core/src/SideNav/index.ts
 * - /apps/storybook/stories/SideNav.stories.tsx
 */

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {Icon, renderIconSlot, type IconType} from '../Icon';
import {useLinkComponent} from '../Link/useLinkComponent';
import type {LinkComponentType} from '../Link/types';
import {usePopover} from '../Popover/usePopover';
import {useMenuHover} from '../hooks/useMenuHover';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {Tooltip} from '../Tooltip';
import {navItemStyles, type NavItemSize} from '../NavItem/navItemStyles.styles';
import {SizeProvider} from '../SizeContext/SizeContext';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';
import {
  useSideNavCollapse,
  SideNavCollapseContext,
} from './SideNavCollapseContext';
import {useSideNavRenderMode} from './SideNavRenderContext';
import {useAppShellMobile} from '../AppShell/AppShellMobileContext';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';

import {useMergedRefs} from '../hooks/useMergedRefs';
// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: 'flex flex-col w-full',
  itemCollapsed: 'justify-center w-(--size-element-md) px-0',
  itemCollapsedSm: 'w-(--size-element-sm)',
  itemCollapsedLg: 'w-(--size-element-lg)',
  label: 'flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap',
  endContent: 'shrink-0 flex items-center',
  // Row-level secondary controls (actions slot) — siblings of the primary
  // element at the trailing edge of the row. pointerEvents opts back in when
  // a disabled row's navItemStyles.disabled sets pointer-events: none on the
  // wrapper: the slot is passthrough, so each control owns its own disabled
  // state (keyboard focus already reaches it either way).
  actions: 'shrink-0 flex items-center gap-(--spacing-1) pointer-events-auto',
  children: 'ps-(--spacing-6)',
  childrenCollapsible: cn(
    'grid [grid-template-rows:1fr] [transition-property:grid-template-rows]',
    '[transition-duration:var(--duration-medium)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  childrenCollapsed: '[grid-template-rows:0fr]',
  childrenInner: 'overflow-hidden min-h-0 ps-(--spacing-6)',
  expandChevron: cn(
    'inline-flex items-center justify-center w-(--spacing-6) h-(--spacing-6)',
    // Icon's `lg` would also set font-size: 1.5rem, and the registry chevron
    // is a 1em SVG — that would blow the glyph up from the 14px it inherits
    // from the row to the full 24px box. The 24px box is the touch/alignment
    // target, not the glyph size, so keep the glyph on the inherited size.
    'text-[length:inherit]',
    '[transition-property:transform]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)] shrink-0',
  ),
  expandChevronExpanded: '[transform:rotate(180deg)]',
  // Standalone toggle button for the chevron when collapsible + href.
  // Boxed like a `size="sm"` icon Button so it and whatever sits in
  // `actions` paint one size of hover pill; without a box of its own it
  // shrank to the 24px chevron beside a 28px menu button.
  // SYNC: matches ROW_CONTROL_SIZE below.
  expandToggle: cn(
    'w-(--size-element-sm) h-(--size-element-sm) inline-flex items-center justify-center',
    'shrink-0 p-0 m-0 [border-width:0] [border-style:none] bg-transparent text-inherit',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'rounded-(--radius-element)',
  ),
  // Primary action element inside the split-action row (link or button).
  // Flex:1 so it fills remaining space, giving a wide click target.
  // `alignSelf: stretch` makes it fill the row's height too — without it the
  // element collapses to its line box (20px), under the 24px WCAG 2.5.8
  // target-size floor even though the row it sits in is 32px tall.
  // Resets both link and button appearance so it blends into the row.
  splitAction: cn(
    'flex items-center self-stretch gap-(--spacing-2) flex-1 min-w-0',
    'text-inherit [text-decoration:none] p-0 m-0 [border-width:0] [border-style:none]',
    'bg-transparent [font-family:inherit] text-[length:inherit] [font-weight:inherit]',
    'leading-[inherit] text-start',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  ),
  // No border and no background: `usePopover` paints the panel this renders
  // into. Drawing a second surface here put square corners inside its rounded
  // ones. The radius matches so a theme retargeting `--radius-container`
  // keeps the two in step.
  popoverSurface:
    'rounded-(--radius-container) py-(--spacing-1) px-(--spacing-1) min-w-[180px]',
  // The gap from the rail belongs on the positioned layer, where
  // `DropdownMenu` keeps it. On the content div it insets the content instead,
  // leaving the panel flush against the rail.
  popoverGap: 'ms-(--spacing-1) me-(--spacing-1)',
  popoverHeader: cn(
    'px-(--spacing-2) py-(--spacing-1) text-(length:--text-supporting-size)',
    'font-(number:--font-weight-semibold) text-(--color-text-secondary)',
    'leading-(--text-supporting-leading)',
  ),
} as const;

/**
 * Cascaded to the `actions` slot through `SizeContext` so a consumer's row
 * controls come out the same height as the built-in expand/collapse toggle,
 * the way `SideNav` already cascades one size to its footer icons. An
 * explicit `size` on a supplied control still wins.
 *
 * SYNC: `styles.expandToggle` carries the matching box.
 */
const ROW_CONTROL_SIZE = 'sm';

// Non-collapsed state for popover children — ensures nested items render expanded
const EXPANDED_COLLAPSE_STATE = {
  isCollapsed: false,
  toggle: () => {},
  isCollapsible: false,
};

// =============================================================================
// NavItemElement — resolves link vs button based on props
// =============================================================================

interface NavItemElementProps {
  href?: string;
  as?: LinkComponentType;
  isDisabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  ref?: React.Ref<HTMLElement>;
  children: ReactNode;
  [key: string]: unknown;
}

/**
 * Renders `<a>` (via LinkComponent) when `href` is set, otherwise `<button>`.
 * Centralizes the link-vs-button decision used across all SideNavItem paths.
 */
function NavItemElement({
  href,
  as,
  isDisabled,
  onClick,
  ref,
  children,
  ...rest
}: NavItemElementProps) {
  const LinkComponent = useLinkComponent(as);
  if (href && !isDisabled) {
    return (
      <LinkComponent
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        {...rest}>
        {children}
      </LinkComponent>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      {...rest}>
      {children}
    </button>
  );
}

// =============================================================================
// Types
// =============================================================================

export interface SideNavItemProps extends BaseProps<HTMLElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLElement>;
  /**
   * Custom component to render instead of `<a>` for link items.
   * Overrides the provider-level default set by LinkProvider.
   * Only applies when `href` is provided. Must accept href, className, style, and children props.
   */
  as?: LinkComponentType;
  /**
   * Item label.
   */
  label: string;
  /**
   * Icon (outline variant).
   */
  icon?: ReactNode | IconType;
  /**
   * Icon when selected (filled variant).
   */
  selectedIcon?: ReactNode | IconType;
  /**
   * Current page indicator.
   * @default false
   */
  isSelected?: boolean;
  /**
   * Whether the item is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Navigation URL.
   */
  href?: string;
  /**
   * Click handler.
   */
  onClick?: (e: React.MouseEvent) => void;
  /**
   * Passive right-side content only (badges, counts). Interactive
   * controls (icon buttons, menus) go in `actions`. `endContent`
   * renders inside the primary link or button.
   */
  endContent?: ReactNode;
  /**
   * Row-level secondary controls (icon buttons, menus) rendered as siblings
   * of the primary element at the trailing edge of the row — after the
   * expand/collapse toggle, and before any nested children in DOM and focus
   * order. Content is passthrough: each control owns its accessible name,
   * keyboard behavior, and disabled state. Hidden while the SideNav rail is
   * collapsed.
   *
   * Controls inherit the row's control size through `SizeContext`, so an
   * unsized icon button comes out the same box as the built-in
   * expand/collapse toggle. An explicit `size` still wins.
   */
  actions?: ReactNode;
  /**
   * Sub-items for nesting.
   */
  children?: ReactNode;
  /**
   * Enables collapse behavior for items with children.
   * When true, clicking the item toggles visibility of sub-items.
   *
   * - `true` — collapsible with defaults (starts expanded)
   * - Object — controlled/configured:
   *   - `defaultIsCollapsed` — start collapsed (default: false)
   *   - `isCollapsed` + `onCollapsedChange` — controlled mode
   *
   * @default false
   */
  collapsible?:
    | boolean
    | {
        defaultIsCollapsed?: boolean;
        isCollapsed?: boolean;
        onCollapsedChange?: (isCollapsed: boolean) => void;
      };
  /**
   * Size variant for the nav item.
   * @default 'md'
   */
  size?: NavItemSize;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Navigation item for SideNav.
 *
 * Supports icons, selected state, nesting, and end content like badges or
 * counts. Interactive row-level controls (menus, icon buttons) go in
 * `actions`, which renders them as siblings of the primary element — never
 * nested inside it — before any nested children in DOM and focus order.
 *
 * @example
 * ```
 * <SideNavItem
 *   label="Dashboard"
 *   icon={HomeIcon}
 *   selectedIcon={HomeIconSolid}
 *   isSelected
 *   href="/dashboard"
 * />
 * <SideNavItem label="Settings" icon={CogIcon}>
 *   <SideNavItem label="General" href="/settings/general" />
 *   <SideNavItem label="Security" href="/settings/security" />
 * </SideNavItem>
 * <SideNavItem
 *   label="Projects"
 *   href="/projects"
 *   collapsible
 *   actions={<MoreMenu label="Project actions" items={items} />}>
 *   <SideNavItem label="Alpha" href="/projects/alpha" />
 * </SideNavItem>
 * ```
 */
export function SideNavItem({
  as,
  label,
  icon,
  selectedIcon,
  isSelected = false,
  isDisabled = false,
  href,
  onClick,
  endContent,
  actions,
  children,
  collapsible: itemCollapsible,
  size = 'md',
  'data-testid': testId,
  ref,
  className,
  ...rest
}: SideNavItemProps) {
  const t = useTranslator();
  const {isCollapsed} = useSideNavCollapse();
  const renderMode = useSideNavRenderMode();
  const {closeMobileNav} = useAppShellMobile();
  const isInDrawer = renderMode === 'drawer' || renderMode === 'drawer-content';
  const id = useId();
  const hasChildren = !!children;
  const itemRef = useRef<HTMLDivElement>(null);

  // Popover for collapsed items with children
  const popover = usePopover({
    hasLightDismiss: true,
    hasAutoFocus: true,
    hasCloseButton: false,
    dialogLabel: t('@solo.sideNavItem.submenuLabel', {label}),
  });
  const mergedTriggerRef = useMergedRefs(ref, popover.triggerRef);

  // Collapse state for items with children
  const itemCollapsibleConfig = useMemo(
    () => (typeof itemCollapsible === 'object' ? itemCollapsible : {}),
    [itemCollapsible],
  );
  const isItemCollapsible = hasChildren && itemCollapsible !== false;
  const itemControlledCollapsed = itemCollapsibleConfig.isCollapsed;
  const isItemControlled = itemControlledCollapsed !== undefined;
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(
    itemCollapsibleConfig.defaultIsCollapsed ?? false,
  );
  const isItemCollapsed = isItemControlled
    ? itemControlledCollapsed
    : uncontrolledCollapsed;

  const toggleItemCollapse = useCallback(() => {
    const next = !isItemCollapsed;
    if (!isItemControlled) {
      setUncontrolledCollapsed(next);
    }
    itemCollapsibleConfig.onCollapsedChange?.(next);
  }, [isItemCollapsed, isItemControlled, itemCollapsibleConfig]);

  const displayIcon = isSelected && selectedIcon ? selectedIcon : icon;

  // When collapsible + a primary action (href or onClick), the action and
  // toggle are independent: clicking the label navigates/fires onClick,
  // clicking the chevron expands/collapses children.
  const hasPrimaryAction = !!href || !!onClick;
  const hasIndependentToggle =
    isItemCollapsible && hasPrimaryAction && !isCollapsed;
  const hasActions = !!actions;

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    if (isItemCollapsible && !hasIndependentToggle && !isCollapsed) {
      e.preventDefault();
      toggleItemCollapse();
      return;
    }
    onClick?.(e);
    // Close the mobile nav when a nav item is activated inside the drawer
    if (isInDrawer) {
      closeMobileNav();
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItemCollapse();
  };

  // Pointer half only. The hook's `onKeyDown`/`menuRef` drive a `useListFocus`
  // over `[role="menuitem"]`, and this flyout is a focus-trapped dialog of
  // links — wiring them would swallow arrow keys rather than navigate with
  // them. Keyboard stays with `usePopover`'s trap, as in DropdownMenuSubMenu.
  const {triggerProps: hoverTriggerProps, contentProps: hoverContentProps} =
    useMenuHover({
      show: popover.show,
      hide: popover.hide,
      isOpen: popover.isOpen,
      isEnabled: isCollapsed && hasChildren,
      // Standard popover toggling: the flyout opens beside the rail, not over
      // the icon, so the click after a hover-open is a deliberate dismissal
      // rather than the hover-then-click confirmation the nav menus need.
      clickGuardMs: 0,
      ownsFocus: false,
    });

  // In collapsed mode: hide items without icons
  if (isCollapsed && !icon) {
    return null;
  }

  // =========================================================================
  // Collapsed mode — icon-only items, popover for items with children
  // =========================================================================
  if (isCollapsed) {
    const collapsedIcon =
      displayIcon &&
      renderIconSlot(displayIcon, {
        size: 'sm',
        // `inherit` so a selected row's icon follows the row to HighlightText
        // under forced colors. Identical to `primary` otherwise: both token
        // families are emitted from one expression.
        color: isSelected ? 'inherit' : isDisabled ? 'disabled' : 'secondary',
      });

    // Shared collapsed item styles — used by trigger, link, and button.
    // All three render a focusable element, so each draws the shared ring.
    const collapsedItemStyles = mergeProps(
      themeProps('side-nav-item', {
        size,
        selected: isSelected ? 'selected' : null,
        disabled: isDisabled ? 'disabled' : null,
      }),
      {
        className: cn(
          focusOutlineStyles.focusVisible,
          navItemStyles.item,
          interactionOverlayStyles.backgroundColor,
          navItemStyles[size],
          styles.itemCollapsed,
          size === 'sm' && styles.itemCollapsedSm,
          size === 'lg' && styles.itemCollapsedLg,
          isSelected && navItemStyles.selected,
          isDisabled && navItemStyles.disabled,
        ),
      },
    );

    const collapsedAccessibleLabel =
      rest['aria-label'] != null && rest['aria-label'].trim() !== ''
        ? rest['aria-label']
        : label;

    // Items with children: popover trigger + popover
    if (hasChildren) {
      return (
        <div className={cn(styles.root, className)}>
          <button
            ref={mergedTriggerRef}
            type="button"
            {...rest}
            {...hoverTriggerProps}
            aria-label={collapsedAccessibleLabel}
            data-testid={testId}
            {...popover.triggerProps}
            {...collapsedItemStyles}>
            {collapsedIcon}
          </button>
          {popover.render(
            <div
              className={styles.popoverSurface}
              onMouseEnter={hoverContentProps.onMouseEnter}
              onMouseLeave={hoverContentProps.onMouseLeave}
              onClick={() => popover.hide()}>
              <div className={styles.popoverHeader}>{label}</div>
              <SideNavCollapseContext value={EXPANDED_COLLAPSE_STATE}>
                {children}
              </SideNavCollapseContext>
            </div>,
            {placement: 'end', alignment: 'start', className: styles.popoverGap},
          )}
        </div>
      );
    }

    // Items without children: icon-only link/button with tooltip
    const collapsedAriaProps = {
      'aria-current': isSelected ? ('page' as const) : undefined,
      'aria-disabled': isDisabled || undefined,
      'aria-label': collapsedAccessibleLabel,
      'data-testid': testId,
    };

    const collapsedElement = (
      <NavItemElement
        ref={ref}
        href={href}
        as={as}
        isDisabled={isDisabled}
        onClick={handleClick}
        {...rest}
        {...collapsedAriaProps}
        {...collapsedItemStyles}>
        {collapsedIcon}
      </NavItemElement>
    );

    return (
      <div ref={itemRef} className={cn(styles.root, className)}>
        {collapsedElement}
        <Tooltip content={label} placement="end" anchorRef={itemRef} />
      </div>
    );
  }

  const itemContent = (
    <>
      {displayIcon &&
        renderIconSlot(displayIcon, {
          size: 'sm',
          // `inherit` — see the collapsed path above.
          color: isSelected ? 'inherit' : isDisabled ? 'disabled' : 'secondary',
        })}
      {!isCollapsed && <span className={styles.label}>{label}</span>}
      {!isCollapsed && endContent && (
        <span className={styles.endContent}>{endContent}</span>
      )}
      {!isCollapsed && isItemCollapsible && !hasIndependentToggle && (
        <Icon
          icon="chevronDown"
          size="lg"
          color="inherit"
          className={cn(
            styles.expandChevron,
            !isItemCollapsed && styles.expandChevronExpanded,
          )}
        />
      )}
    </>
  );

  const itemThemeProps = themeProps('side-nav-item', {
    size,
    selected: isSelected ? 'selected' : null,
    disabled: isDisabled ? 'disabled' : null,
  });

  const itemStyleClasses = cn(
    navItemStyles.item,
    interactionOverlayStyles.backgroundColor,
    navItemStyles[size],
    isSelected && navItemStyles.selected,
    isDisabled && navItemStyles.disabled,
  );

  // Three shapes of the same row appearance:
  // - `rowProps` — split-action path (toggle, no actions): presentational
  //   <div>; the ring belongs on each child tab stop.
  // - `focusableRowProps` — ordinary row: the row element is the control.
  // - `actionsRowProps` — same pill, but the ring is drawn for the primary
  //   only. The wrapper is not a tab stop, so `:focus-visible` on it would
  //   never match, and matching any descendant instead would light the whole
  //   row around the chevron's or an action's own ring.
  const rowProps = mergeProps(itemThemeProps, {className: itemStyleClasses});
  const focusableRowProps = mergeProps(itemThemeProps, {
    className: cn(focusOutlineStyles.focusVisible, itemStyleClasses),
  });
  const actionsRowProps = mergeProps(itemThemeProps, {
    className: cn(focusOutlineStyles.focusWithinFirstChild, itemStyleClasses),
  });

  // Row-wrapper path: primary element + row controls as siblings.
  //
  // Used when the row carries more than one control: an independent
  // expand/collapse toggle (collapsible + href/onClick), consumer-supplied
  // actions, or both. A <div> is the styled flex row; the primary link or
  // button, the chevron toggle, and the actions slot render as siblings so
  // no interactive element nests inside another, and every row-level
  // control precedes the nested children group in DOM and focus order.
  const hasRowWrapper = hasIndependentToggle || hasActions;

  let itemElement;

  if (hasRowWrapper) {
    // aria-expanded/-controls stay on the primary element only when the
    // whole row is the collapse toggle (no independent chevron button).
    const rowPrimaryAriaProps = hasIndependentToggle
      ? {'aria-current': isSelected ? ('page' as const) : undefined}
      : {
          'aria-current': isSelected ? ('page' as const) : undefined,
          'aria-disabled': isDisabled || undefined,
          'aria-expanded': isItemCollapsible ? !isItemCollapsed : undefined,
          'aria-controls': isItemCollapsible ? `${id}-children` : undefined,
        };

    itemElement = (
      <div data-testid={testId} {...(hasActions ? actionsRowProps : rowProps)}>
        <NavItemElement
          ref={ref}
          href={href}
          as={as}
          isDisabled={isDisabled}
          onClick={handleClick}
          {...rest}
          {...rowPrimaryAriaProps}
          {...(hasActions
            ? // The wrapper rings for this element; suppressing here is what
              // keeps the UA's own ring from painting inside that one.
              {className: cn(focusOutlineStyles.suppressed, styles.splitAction)}
            : {
                className: cn(
                  focusOutlineStyles.focusVisible,
                  styles.splitAction,
                ),
              })}>
          {itemContent}
        </NavItemElement>
        {hasIndependentToggle && (
          <button
            type="button"
            onClick={handleToggleClick}
            aria-label={
              isItemCollapsed
                ? t('@solo.sideNavItem.expand', {label})
                : t('@solo.sideNavItem.collapse', {label})
            }
            aria-expanded={!isItemCollapsed}
            aria-controls={`${id}-children`}
            className={cn(
              focusOutlineStyles.focusVisible,
              styles.expandToggle,
              interactionOverlayStyles.backgroundColor,
            )}>
            <Icon
              icon="chevronDown"
              size="lg"
              color="inherit"
              className={cn(
                styles.expandChevron,
                !isItemCollapsed && styles.expandChevronExpanded,
              )}
            />
          </button>
        )}
        {hasActions && (
          <span className={styles.actions}>
            <SizeProvider value={ROW_CONTROL_SIZE}>{actions}</SizeProvider>
          </span>
        )}
      </div>
    );
  } else {
    const ariaProps = {
      'aria-current': isSelected ? ('page' as const) : undefined,
      'aria-disabled': isDisabled || undefined,
      'aria-expanded': isItemCollapsible ? !isItemCollapsed : undefined,
      'aria-controls': isItemCollapsible ? `${id}-children` : undefined,
      'data-testid': testId,
    };

    itemElement = (
      <NavItemElement
        ref={ref}
        href={href}
        as={as}
        isDisabled={isDisabled}
        onClick={handleClick}
        {...rest}
        {...ariaProps}
        {...focusableRowProps}>
        {itemContent}
      </NavItemElement>
    );
  }

  const item = (
    <div ref={itemRef} className={cn(styles.root, className)}>
      {itemElement}
      {hasChildren && !isCollapsed && (
        <div
          id={`${id}-children`}
          role="group"
          aria-labelledby={`${id}-label`}
          aria-hidden={isItemCollapsed}
          inert={isItemCollapsed ? true : undefined}
          className={cn(
            styles.childrenCollapsible,
            isItemCollapsed && styles.childrenCollapsed,
          )}>
          <div className={styles.childrenInner}>
            <span id={`${id}-label`} hidden>
              {label}
            </span>
            {children}
          </div>
        </div>
      )}
    </div>
  );

  return item;
}

SideNavItem.displayName = 'SideNavItem';
