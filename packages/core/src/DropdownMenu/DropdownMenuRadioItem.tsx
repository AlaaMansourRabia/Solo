'use client';

/**
 * @file DropdownMenuRadioItem.tsx
 * @input React, Tailwind classes, Item + Icon + DropdownMenu context + tokens from core
 * @output DropdownMenuRadioItem — a single option in a radio group.
 * @position Sub-component; must be used inside a DropdownMenuRadioGroup.
 *
 * A menu item representing one option in a single-select group
 * (role="menuitemradio"). The row owns the role and aria-checked; there is no
 * nested native <input> (per the WAI-ARIA menuitemradio pattern). Selection
 * state + onChange come from DropdownMenuRadioGroupContext. Keyboard nav +
 * Enter/Space activation come from the parent DropdownMenu.
 *
 * The round radio visual is the shared radio indicator, decorative
 * (aria-hidden) — the row owns the checked state, and menu radios pick up the
 * same `radio` theming (and any theme replacement) as RadioList. This row keeps
 * the marker box: its size is derived from the menu's item size and it swaps to
 * the inline-end of the row on coarse-pointer (touch) devices via CSS `order`.
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
import {useDropdownMenuRadioGroupContext} from './DropdownMenuContext';

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
  // Rendered in Item's `marker` slot as a raw flex child. On touch it moves to
  // the inline-end of the row via `order`.
  // Layout box for the decorative marker. The painted circle is the radio
  // indicator inside it, which carries the shared `radio` theme target.
  // Placement of the marker within the row. The indicator draws its own box
  // (size, fill, border) — these are only the rules the MENU owns: where the
  // marker sits in the row, and that it never takes the pointer.
  marker: 'pointer-events-none order-0 pointer-coarse:order-1 ms-0 pointer-coarse:ms-auto',
} as const;

// Matches the control sizes RadioList uses, so a radio reads the same in a
// menu row as it does in a radio group.
export interface DropdownMenuRadioItemProps extends Omit<
  BaseProps,
  'role' | 'aria-checked' | 'tabIndex'
> {
  /**
   * The value this item represents within its group. The group's `value`
   * matches against this to determine the checked state.
   */
  value: string;
  /**
   * Primary label text identifying the option.
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
   * Whether this individual radio item is disabled. Disabled items stay
   * focusable (via `aria-disabled`) so they remain discoverable by keyboard
   * and assistive technology, but selection is blocked.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Content to render after the label and description, such as a badge or
   * metadata.
   */
  endContent?: ReactNode;
  /** Ref forwarded to the row root — the element carrying `role="menuitemradio"`. */
  ref?: React.Ref<HTMLElement>;
}

/**
 * A single option in a DropdownMenuRadioGroup (role="menuitemradio").
 *
 * @example
 * ```
 * <DropdownMenuRadioGroup value={sort} onChange={setSort} label="Sort by">
 *   <DropdownMenuRadioItem value="newest" label="Newest" />
 *   <DropdownMenuRadioItem value="oldest" label="Oldest" icon="clock" />
 * </DropdownMenuRadioGroup>
 * ```
 */
export function DropdownMenuRadioItem({
  value,
  label,
  description,
  icon,
  isDisabled = false,
  endContent,
  className,
  style,
  ...rest
}: DropdownMenuRadioItemProps) {
  const menuCtx = useDropdownMenuContext();
  const groupCtx = useDropdownMenuRadioGroupContext();
  if (!groupCtx) {
    throw new Error(
      'DropdownMenuRadioItem must be used within a DropdownMenuRadioGroup',
    );
  }
  const menuSize = menuCtx?.menuSize ?? 'md';
  const controlSize = menuSize === 'sm' ? 'sm' : 'md';
  const isChecked = groupCtx.value === value;
  const RadioControl = useIndicator('radio');

  const handleClick = useCallback(() => {
    if (isDisabled) {
      return;
    }
    groupCtx.onChange(value);
    if (groupCtx.hasCloseOnSelect) {
      menuCtx?.closeMenu();
    }
  }, [isDisabled, groupCtx, value, menuCtx]);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => focusMenuItemOnHover(e, isDisabled),
    [isDisabled],
  );

  return (
    <Item
      {...rest}
      role="menuitemradio"
      aria-checked={isChecked}
      tabIndex={isDisabled ? undefined : -1}
      onPointerMove={handlePointerMove}
      marker={
        // No wrapper — see DropdownMenuCheckboxItem: the target belongs on the
        // visible circle, and the indicator already owns its control size.
        <RadioControl
          state={isChecked ? 'checked' : 'unchecked'}
          size={controlSize}
          isDisabled={isDisabled}
          {...mergeProps(
            themeProps('dropdown-menu-radio', {
              size: controlSize,
              checked: isChecked ? 'checked' : null,
              disabled: isDisabled ? 'disabled' : null,
            }),
            {className: styles.marker},
          )}
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

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';
