'use client';

/**
 * @file TabMenu.tsx
 * @input Uses React, Tailwind classes, usePopover, TabListContext
 * @output Exports TabMenu component, TabMenuProps type, TabMenuOption type
 * @position Menu trigger button; opens dropdown of overflow menu items and
 *   mirrors selected tab indicator positioning
 *
 * SYNC: When modified, update:
 * - /packages/core/src/TabList/TabList.doc.mjs
 * - /packages/core/src/TabList/index.ts
 * - /packages/core/src/TabList/TabList.test.tsx
 */

import React, {useCallback, useId, useRef, type ReactNode} from 'react';
import {Icon} from '../Icon';
import {renderIconSlot, type IconType} from '../Icon';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';
import {usePopover} from '../Popover/usePopover';
import {MENU_ITEM_SELECTOR} from '../DropdownMenu/menuItemRoles';
import {useListFocus} from '../hooks/useListFocus';
import {useTabListContext} from './TabListContext';
import type {TabListSize} from './TabListContext';
import {tabScope} from './tab.markers.styles';
import {mergeProps} from '../utils';
import {useMergedRefs} from '../hooks/useMergedRefs';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';

export interface TabMenuOption {
  value: string;
  label: string;
  /**
   * Icon to display before the label.
   */
  icon?: ReactNode | IconType;
}

export interface TabMenuProps extends Pick<
  BaseProps<HTMLButtonElement>,
  'className' | 'style'
> {
  ref?: React.Ref<HTMLButtonElement>;
  /**
   * Label for the trigger button and dropdown heading.
   * Displayed as trigger text when no option is selected.
   */
  label: string;
  /**
   * Menu options rendered in the dropdown.
   */
  options: TabMenuOption[];
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  trigger: cn(
    'relative inline-flex items-center justify-center gap-(--spacing-1) px-(--spacing-3)',
    'bg-transparent [border-width:0] [border-style:none] rounded-(--radius-element)',
    '[font-family:inherit] text-(length:--text-label-size) leading-(--text-label-leading)',
    'font-(number:--font-weight-normal) text-(--color-text-secondary)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[text-decoration:none] [transition-property:color]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  triggerSelected:
    'text-(--color-text-primary) font-(number:--font-weight-semibold)',
  triggerLabel: 'relative inline-grid items-center self-stretch',
  triggerLabelText: 'row-start-1 col-start-1',
  triggerLabelSizer:
    'row-start-1 col-start-1 invisible pointer-events-none font-(number:--font-weight-semibold)',
  indicator: cn(
    'absolute',
    // Mirrors Tab's indicator: sits on the bottom edge by default (-1px), or
    // drops onto the divider rail when an ancestor (TabList `hasDivider` or a
    // Toolbar with a bottom divider) sets `--_tab-indicator-bottom`.
    'bottom-(--_tab-indicator-bottom,-1px)',
    'start-(--spacing-3) end-(--spacing-3) h-[2px] rounded-(--radius-full) pointer-events-none',
    '[transition-property:opacity,background-color]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  indicatorSelected: 'bg-(--color-icon-primary) opacity-100',
  hoverBg: cn(
    'absolute inset-0 m-auto w-full rounded-(--radius-element) pointer-events-none',
    'bg-transparent can-hover:group-hover/tab:bg-(--color-overlay-hover)',
    '[transition-property:background-color]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  chevron: 'w-(--spacing-4) h-(--spacing-4) shrink-0',
  // Applied to the chevron <Icon> (via `className`) rather than its wrapper, so the
  // element that rotates is the element a theme targets.
  chevronIcon: cn('[transition-property:transform]', '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]'),
  chevronOpen: '[transform:rotate(180deg)]',
  dropdown: 'flex flex-col gap-(--spacing-0-5) py-(--spacing-1) px-(--spacing-1)',
  menuItem: cn(
    'flex items-center justify-between gap-(--spacing-2) py-(--spacing-2) px-(--spacing-3)',
    'rounded-(--radius-element) [font-family:inherit] text-(length:--text-label-size)',
    'leading-(--text-label-leading) font-(number:--font-weight-normal) text-(--color-text-primary)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition-property:background-color]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
    'bg-transparent can-hover:usable:hover:bg-(--color-overlay-hover)',
  ),
  menuItemSelected: 'font-(number:--font-weight-medium)',
  menuItemContent: 'flex items-center gap-(--spacing-2)',
  itemCheckmark: 'shrink-0 w-[16px] h-[16px] text-(--color-icon-primary)',
  menuHeading: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'font-(number:--font-weight-semibold) text-(--color-text-secondary)',
    'py-(--spacing-1) px-(--spacing-3)',
  ),
} as const;

const sizeStyles = {
  sm: 'h-(--size-element-sm)',
  md: 'h-(--size-element-md)',
  lg: 'h-(--size-element-lg)',
} as const;

// Hover bg uses the standard element size (one step smaller than tab)
const hoverSizeStyles = {
  sm: 'h-(--size-element-sm)',
  md: 'h-(--size-element-md)',
  lg: 'h-(--size-element-lg)',
} as const;

/**
 * Tab menu trigger that opens a dropdown of additional tab options.
 * Shows the selected option's label as trigger text when an option is active.
 * Dropdown includes a heading showing the menu's label prop.
 *
 * @example
 * ```
 * <TabList value={tab} onChange={setTab}>
 *   <Tab value="overview" label="Overview" />
 *   <TabMenu label="More" options={[
 *     { value: "settings", label: "Settings" },
 *     { value: "history", label: "History" },
 *   ]} />
 * </TabList>
 * ```
 */
export function TabMenu({
  ref,
  label,
  options,
  className,
  style,
}: TabMenuProps) {
  const tabListCtx = useTabListContext();
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const popover = usePopover({
    hasLightDismiss: true,
    hasCloseButton: false,
    hasAutoFocus: false,
    // The popup's own role="menu" is the exposed semantics; a modal dialog
    // wrapper would announce an unnamed dialog around the menu.
    role: 'none',
    // Return focus to the trigger when the menu closes (Escape, Tab, select,
    // or light dismiss) so keyboard focus is never dropped to <body>.
    onHide: useCallback(() => {
      buttonRef.current?.focus();
    }, []),
  });

  // The overflow menu is a composite widget: a single roving tab stop with
  // arrow-key navigation between items, per the APG menu pattern. The hook owns
  // item tabindex — items render tabIndex={-1} and exactly one is promoted to 0.
  const {
    listRef,
    handleKeyDown: handleListKeyDown,
    handleFocus,
    focusFirst,
  } = useListFocus<HTMLDivElement>({
    hasRovingTabIndex: true,
    // Options render as menuitemradio (single-select menu), which the
    // default '[role="menuitem"]' selector would not match.
    itemSelector: MENU_ITEM_SELECTOR,
    onEscape: () => popover.hide(),
  });

  const handleToggle = useCallback(() => {
    if (popover.isOpen) {
      popover.hide();
    } else {
      popover.show();
      // Move focus into the menu on open so arrow navigation works and the
      // roving tab stop lands on a real item (APG menu-button focus-on-open).
      requestAnimationFrame(() => focusFirst());
    }
  }, [popover, focusFirst]);

  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // APG menu-button: Tab leaves the menu rather than walking its items.
      // Close and let onHide return focus to the trigger, from which the
      // browser's default Tab continues to the next element.
      if (e.key === 'Tab') {
        popover.hide();
        return;
      }
      handleListKeyDown(e);
    },
    [handleListKeyDown, popover],
  );

  const selectedOption = options.find(o => o.value === tabListCtx.value);
  const triggerLabel = selectedOption?.label ?? label;
  const hasSelectedOption = selectedOption != null;

  const size: TabListSize = tabListCtx.size;

  const handleSelect = useCallback(
    (value: string) => {
      tabListCtx.onChange(value);
      popover.hide();
    },
    [tabListCtx, popover],
  );

  const setButtonRef = useMergedRefs<HTMLButtonElement>(
    popover.triggerRef,
    buttonRef,
    ref,
  );

  return (
    <>
      <button
        ref={setButtonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={popover.isOpen}
        aria-controls={menuId}
        data-tab-menu=""
        tabIndex={hasSelectedOption ? 0 : -1}
        onClick={handleToggle}
        {...mergeProps(
          themeProps('tab-menu'),
          {
            className: cn(
              focusOutlineStyles.focusVisible,
              styles.trigger,
              sizeStyles[size],
              hasSelectedOption && styles.triggerSelected,
              tabScope,
            ),
          },
          className,
          style,
        )}>
        <span
          aria-hidden="true"
          className={cn(styles.hoverBg, hoverSizeStyles[size])}
        />
        <span className={styles.triggerLabel}>
          <span className={styles.triggerLabelText}>{triggerLabel}</span>
          <span aria-hidden="true" className={styles.triggerLabelSizer}>
            {triggerLabel}
          </span>
        </span>
        <span aria-hidden="true" className={styles.chevron}>
          <Icon
            icon="chevronDown"
            size="sm"
            color="inherit"
            className={cn(styles.chevronIcon, popover.isOpen && styles.chevronOpen)}
          />
        </span>
        {hasSelectedOption && (
          <span
            {...mergeProps(
              themeProps('tab-indicator', {selected: 'selected'}),
              {className: cn(styles.indicator, styles.indicatorSelected)},
            )}
          />
        )}
      </button>
      {popover.render(
        <div
          ref={listRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={handleMenuKeyDown}
          onFocus={handleFocus}
          {...mergeProps(
            themeProps('tab-menu-dropdown'),
            {className: styles.dropdown},
          )}>
          <span role="presentation" className={styles.menuHeading}>
            {label}
          </span>
          {options.map(option => {
            const isSelected = tabListCtx.value === option.value;
            return (
              <div
                key={option.value}
                // The menu is single-select: exactly one option can be the
                // active tab, so options are radio menu items with
                // aria-checked (APG menu-button), not plain menuitems with
                // aria-current.
                role="menuitemradio"
                tabIndex={-1}
                aria-checked={isSelected}
                onClick={() => handleSelect(option.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(option.value);
                  }
                }}
                {...mergeProps(
                  themeProps('tab-menu-item'),
                  {
                    className: cn(
                      focusOutlineStyles.focusVisible,
                      styles.menuItem,
                      isSelected && styles.menuItemSelected,
                    ),
                  },
                )}>
                <span className={styles.menuItemContent}>
                  {option.icon &&
                    renderIconSlot(option.icon, {
                      size: 'sm',
                      color: 'secondary',
                    })}
                  {option.label}
                </span>
                {isSelected && <Icon icon="check" size="sm" color="accent" />}
              </div>
            );
          })}
        </div>,
        {placement: 'below', alignment: 'start'},
      )}
    </>
  );
}

TabMenu.displayName = 'TabMenu';
