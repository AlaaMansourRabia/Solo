'use client';
/**
 * @file CommandPaletteItem.tsx
 * @input Uses React, Tailwind classes, CommandPaletteContext, DialogContext
 * @output Exports CommandPaletteItem component
 * @position Sub-component; individual selectable item
 *
 * SYNC: When modified, update:
 */

import {useCallback, useEffect, useMemo, useRef, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {composeEventHandlers} from '../utils/composeEventHandlers';
import {useCommandPaletteContext} from './CommandPaletteContext';
import {useDialogContext} from '../Dialog/DialogContext';
import {themeProps} from '../utils/themeProps';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';

import {useMergedRefs} from '../hooks/useMergedRefs';
import {cn} from '../utils/cn';

const styles = {
  item: cn(
    'flex items-center gap-(--spacing-2) w-full px-(--spacing-3) py-(--spacing-2)',
    'rounded-(--radius-inner) font-(family-name:--font-family-body) text-(length:--text-label-size)',
    'text-(--color-text-primary) bg-transparent [border-width:0] [border-style:none]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'text-start [outline:none] select-none',
  ),
  // These replace the whole background, the shared overlay's hover/pressed
  // states included, so the overlay's variant chains are restated.
  itemHighlighted: cn(
    'bg-(--color-overlay-hover) usable:active:bg-(--color-overlay-hover)',
    'can-hover:usable:hover:bg-(--color-overlay-hover) can-hover:usable:active:bg-(--color-overlay-hover)',
  ),
  itemDisabled: 'opacity-50 cursor-default',
  itemSelected: cn(
    'bg-(--color-accent-muted) usable:active:bg-(--color-accent-muted)',
    'can-hover:usable:hover:bg-(--color-accent-muted) can-hover:usable:active:bg-(--color-accent-muted)',
  ),
} as const;

export interface CommandPaletteItemProps extends Omit<
  BaseProps<HTMLDivElement>,
  'onChange' | 'onSelect'
> {
  /** Ref forwarded to the root element. */
  ref?: React.Ref<HTMLDivElement>;
  /** Unique value for identification and selection. */
  value: string;
  /** Called when this item is selected (via click or Enter). */
  onSelect?: (value: string) => void;
  /**
   * Whether this item is visually highlighted (keyboard focus).
   * When omitted inside CommandPalette, derived from context.
   * @default false
   */
  isHighlighted?: boolean;
  /**
   * Whether this item is currently selected (picker mode).
   * @default false
   */
  isSelected?: boolean;
  /**
   * Whether the item is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /** Item content. Fully custom — render icons, descriptions, shortcuts, etc. */
  children: ReactNode;
}

/**
 * A selectable item in the command palette.
 * Accepts arbitrary children for full rendering control.
 *
 * When used inside CommandPalette, registers with context for
 * keyboard navigation and selection. Can also be used
 * standalone with explicit isHighlighted/isSelected props.
 *
 * @compositionHint Place inside CommandPaletteList or CommandPaletteGroup.
 *
 * @example
 * ```
 * <CommandPaletteItem value="settings" onSelect={() => navigate('/settings')}>
 *   Settings
 * </CommandPaletteItem>
 * ```
 */
export function CommandPaletteItem({
  value,
  onSelect,
  isHighlighted: controlledHighlighted,
  isSelected: controlledSelected,
  isDisabled = false,
  children,
  ref,
  className,
  style,
  onClick: onClickProp,
  onMouseEnter: onMouseEnterProp,
  ...props
}: CommandPaletteItemProps) {
  const ctx = useCommandPaletteContext();
  const dialogContext = useDialogContext();
  const isInlineDialog = dialogContext?.isInline === true;
  const itemRef = useRef<HTMLDivElement>(null);
  const didMountRef = useRef(false);

  // Find this item's index in the flat selectable items list (DOM order).
  // This aligns with useCombobox's index-based navigation.
  const itemIndex = useMemo(
    () => ctx?.selectableItems.findIndex(item => item.value === value) ?? -1,
    [ctx?.selectableItems, value],
  );

  // Highlight from useCombobox: index-based, matches DOM order
  const isHighlighted =
    controlledHighlighted ??
    (ctx ? ctx.highlightedIndex === itemIndex && itemIndex >= 0 : false);
  const isSelected = controlledSelected ?? (ctx ? ctx.value === value : false);

  useEffect(() => {
    // Inside CommandPalette the shared useHighlightedOptionScroll (via
    // useCombobox) is the single scrollIntoView owner; a second owner
    // here doubled every keyboard scroll and scrolled on hover. Standalone
    // items (no context) keep their own scroll.
    if (ctx) {
      return;
    }

    // Inline dialogs are documentation/showcase previews. Avoid scrolling the
    // surrounding page when picker mode auto-highlights its selected item on
    // mount, while preserving scroll-into-view after user navigation.
    const shouldSkipInitialInlineScroll =
      isInlineDialog && !didMountRef.current;
    didMountRef.current = true;

    if (shouldSkipInitialInlineScroll) {
      return;
    }

    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView?.({block: 'nearest'});
    }
  }, [ctx, isHighlighted, isInlineDialog]);

  const handleClick = useCallback(() => {
    if (isDisabled) {
      return;
    }
    onSelect?.(value);
    if (ctx) {
      ctx.selectItem(value);
      ctx.onClose();
    }
  }, [isDisabled, value, onSelect, ctx]);

  return (
    <div
      ref={useMergedRefs(ref, itemRef)}
      {...props}
      id={ctx && itemIndex >= 0 ? ctx.getItemId(itemIndex) : undefined}
      role="option"
      aria-selected={isSelected}
      aria-disabled={isDisabled || undefined}
      data-value={value}
      onClick={composeEventHandlers(onClickProp, handleClick)}
      onMouseEnter={onMouseEnterProp}
      {...mergeProps(
        themeProps('command-palette-item'),
        {
          className: cn(
            styles.item,
            !isDisabled && interactionOverlayStyles.backgroundColor,
            isHighlighted && styles.itemHighlighted,
            isSelected && styles.itemSelected,
            isDisabled && styles.itemDisabled,
          ),
        },
        className,
        style,
      )}>
      {children}
    </div>
  );
}

CommandPaletteItem.displayName = 'CommandPaletteItem';
