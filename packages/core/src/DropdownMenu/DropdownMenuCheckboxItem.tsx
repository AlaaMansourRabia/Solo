'use client';

/**
 * @file DropdownMenuCheckboxItem.tsx
 * @input React, Tailwind classes, Item + CheckboxInput + DropdownMenu context + tokens from core
 * @output DropdownMenuCheckboxItem — a standalone checkable menu item.
 * @position Sub-component; used inside DropdownMenu.
 *
 * A menu item that toggles an independent boolean (role="menuitemcheckbox").
 * Unlike CheckboxInput, there is no nested native <input> that participates in
 * accessibility: the row itself owns the role and aria-checked, per the
 * WAI-ARIA menuitemcheckbox pattern. Keyboard navigation (arrows/typeahead) and
 * Enter/Space activation come from the parent DropdownMenu's useListFocus +
 * activation path, which matches menuitemcheckbox alongside plain menuitem rows.
 *
 * The checkbox visual is the shared checkbox indicator, decorative
 * (aria-hidden) — the row owns the role, checked state, and accessible name, so
 * there is no nested native <input> to shim out of the accessibility tree. It
 * picks up the same `checkbox` theming (and any theme replacement) as
 * CheckboxInput. The control size is derived from the menu's item size (a `sm`
 * menu gets the compact control; `md`/`lg` get the standard one) and the marker
 * box swaps to the inline-end of the row on coarse-pointer (touch) devices via
 * CSS `order`, so it lands where selection toggles are conventionally placed on
 * mobile.
 */

import {useCallback, type PointerEvent, type ReactNode} from 'react';
import {renderIconSlot, type IconType} from '../Icon';
import {useIndicator} from '../Indicator';
import {Item} from '../Item';
import {useDropdownMenuContext} from './DropdownMenuContext';
import {focusMenuItemOnHover} from './menuItemHover';
import {mergeProps, themeProps} from '../utils';
import {cn} from '../utils/cn';
import type {BaseProps} from '../BaseProps';

const styles = {
  root: cn(
    'w-full',
    'rounded-[max(0px,calc(var(--_dropdown-menu-radius,var(--spacing-2))_-_var(--_dropdown-menu-padding,var(--spacing-1))))]',
    'text-(--color-text-primary) bg-transparent focus:bg-(--color-overlay-hover)',
    // This replaces Item's whole interaction-overlay background, so Item's
    // hover/press arms are restated (same variant chains, for
    // `cn()` to drop) with the value the row would otherwise show: the focus
    // highlight when focused, transparent otherwise.
    '[--_menu-item-rest-bg:transparent] focus:[--_menu-item-rest-bg:var(--color-overlay-hover)]',
    'usable:active:bg-(--_menu-item-rest-bg) can-hover:usable:hover:bg-(--_menu-item-rest-bg) can-hover:usable:active:bg-(--_menu-item-rest-bg)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[outline:none]',
  ),
  disabled: 'opacity-50 cursor-default',
  // Rendered in Item's `marker` slot as a raw flex child, so `order` moves it
  // relative to the label within the row. On touch it moves to the inline-end.
  // `aria-hidden` + `inert` + pointer-events:none keep the composed CheckboxInput
  // decorative: it adds no accessible name, and clicks fall through to the row,
  // which owns the role and activation.
  // Placement of the marker within the row. The indicator draws its own box
  // (size, fill, border) — these are only the rules the MENU owns: where the
  // marker sits in the row, and that it never takes the pointer.
  marker: 'pointer-events-none order-0 pointer-coarse:order-1 ms-0 pointer-coarse:ms-auto',
} as const;

// Matches the control sizes CheckboxInput uses, so a checkbox reads the same in
// a menu row as it does in a form.
export interface DropdownMenuCheckboxItemProps extends Omit<
  BaseProps,
  'onChange' | 'role' | 'aria-checked' | 'tabIndex'
> {
  /**
   * Primary label text identifying the item.
   */
  label: ReactNode;
  /**
   * Secondary description text displayed below the label.
   */
  description?: ReactNode;
  /**
   * Icon to display before the label. Accepts a semantic icon name (see
   * the `IconName` type in the Icon docs) or a rendered node.
   */
  icon?: ReactNode | IconType;
  /**
   * Whether the item is checked. Controlled — pair with `onChange`.
   */
  value: boolean;
  /**
   * Callback fired with the next checked state when the item is toggled.
   */
  onChange?: (checked: boolean) => void;
  /**
   * Whether the item is disabled. Disabled items stay focusable (via
   * `aria-disabled`) so they remain discoverable by keyboard and assistive
   * technology, but activation is blocked.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether toggling the item closes the menu. Checkbox items default to
   * staying open so several can be toggled in a single session, unlike radio
   * items which default to closing on selection.
   * @default false
   */
  hasCloseOnSelect?: boolean;
  /** Ref forwarded to the row root — the element carrying `role="menuitemcheckbox"`. */
  ref?: React.Ref<HTMLElement>;
  /**
   * Content to render after the label and description, such as a keyboard
   * shortcut hint or badge.
   */
  endContent?: ReactNode;
}

/**
 * A checkable dropdown menu item (role="menuitemcheckbox").
 *
 * Must be used inside a DropdownMenu. Toggles an independent boolean; for a
 * one-of-N choice use DropdownMenuRadioGroup + DropdownMenuRadioItem instead.
 *
 * @example
 * ```
 * import {DropdownMenuCheckboxItem} from '@solo/core/DropdownMenu';
 * <DropdownMenu button={{label: 'View'}}>
 *   <DropdownMenuCheckboxItem
 *     label="Show archived"
 *     value={showArchived}
 *     onChange={setShowArchived}
 *   />
 * </DropdownMenu>
 * ```
 */
export function DropdownMenuCheckboxItem({
  label,
  description,
  icon,
  value,
  onChange,
  isDisabled = false,
  hasCloseOnSelect = false,
  endContent,
  className,
  style,
  ...rest
}: DropdownMenuCheckboxItemProps) {
  const ctx = useDropdownMenuContext();
  const menuSize = ctx?.menuSize ?? 'md';
  const controlSize = menuSize === 'sm' ? 'sm' : 'md';
  const CheckboxControl = useIndicator('checkbox');

  const handleClick = useCallback(() => {
    if (isDisabled) {
      return;
    }
    onChange?.(!value);
    if (hasCloseOnSelect) {
      ctx?.closeMenu();
    }
  }, [isDisabled, onChange, value, hasCloseOnSelect, ctx]);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => focusMenuItemOnHover(e, isDisabled),
    [isDisabled],
  );

  return (
    <Item
      {...rest}
      role="menuitemcheckbox"
      aria-checked={value}
      tabIndex={isDisabled ? undefined : -1}
      onPointerMove={handlePointerMove}
      marker={
        // No wrapper, and no menu-specific theme target: the shared
        // `solo-checkbox` target is already on this element (main reached
        // the menu checkbox through it too), so the menu adds only its own
        // placement rules. A wrapper here would have duplicated the
        // indicator's control size and moved nothing themeable.
        <CheckboxControl
          state={value ? 'checked' : 'unchecked'}
          size={controlSize}
          isDisabled={isDisabled}
          className={styles.marker}
        />
      }
      startContent={
        icon
          ? renderIconSlot(icon, {size: 'sm', color: 'secondary'})
          : undefined
      }
      label={label}
      description={description}
      endContent={endContent}
      onClick={handleClick}
      isDisabled={isDisabled}
      {...mergeProps(themeProps('dropdown-menu-item', {size: menuSize}), {
        className: cn(styles.root, isDisabled && styles.disabled, className),
        style,
      })}
    />
  );
}

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';
