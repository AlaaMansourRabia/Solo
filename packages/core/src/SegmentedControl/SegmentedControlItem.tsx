'use client';

/**
 * @file SegmentedControlItem.tsx
 * @input Uses React, Tailwind classes, SegmentedControlContext
 * @output Exports SegmentedControlItem component and SegmentedControlItemProps type
 * @position Child item; renders as a radio button within the segmented control
 *
 * SYNC: When modified, update:
 * - /packages/core/src/SegmentedControl/SegmentedControl.doc.mjs
 * - /packages/core/src/SegmentedControl/index.ts
 * - /packages/core/src/SegmentedControl/SegmentedControl.test.tsx
 */

import React, {type ReactNode} from 'react';
import {useSegmentedControlContext} from './SegmentedControlContext';
import type {SegmentedControlSize} from './SegmentedControlContext';
import {cn, mergeProps, composeEventHandlers} from '../utils';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';

export interface SegmentedControlItemProps extends BaseProps<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
  /**
   * Unique value for this segment. Matched against the parent's value.
   */
  value: string;
  /**
   * Accessible label for this segment (required for accessibility).
   * Used as visible text, or as aria-label when isLabelHidden is true.
   */
  label: string;
  /**
   * Whether the label is visually hidden. When true, only the icon is
   * displayed and the label is used as aria-label for accessibility.
   * @default false
   */
  isLabelHidden?: boolean;
  /**
   * Icon element displayed before the label.
   */
  icon?: ReactNode;
  /**
   * Whether this individual item is disabled.
   * @default false
   */
  isDisabled?: boolean;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  base: cn(
    'relative inline-flex items-center justify-center gap-(--spacing-1) px-(--spacing-3)',
    'bg-transparent [border-width:0] [border-style:none]',
    '[font-family:inherit] text-(length:--text-label-size) leading-(--text-label-leading) font-(number:--font-weight-medium)',
    'text-(--color-text-secondary)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'whitespace-nowrap',
    // In both layouts a segment may be narrower than its label, so the
    // label's ellipsis can engage when the control is capped by its container.
    'min-w-0',
    '[transition-property:color,background-color,box-shadow]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  selected: cn(
    // Forced colors (Windows High Contrast) strips the painted surface fill
    // and box shadow, which would leave the selected segment with no state
    // indication beyond font weight. Highlight/HighlightText is the platform
    // convention for a selected item (WCAG 1.4.11).
    //
    // forced-color-adjust must be `none` here: the segment is a <button>, and
    // the UA keeps native form-control colors (ButtonFace surface) for it under
    // forced colors, ignoring the authored Highlight fill — the label kept its
    // HighlightText color, giving white text on a white surface. Opting the
    // selected segment out of UA remapping makes both the Highlight surface and
    // the HighlightText label render as authored, restoring figure-ground.
    'forced-color-adjust-none',
    'text-(--color-text-primary) forced-colors:[color:HighlightText]',
    'font-(number:--font-weight-semibold)',
    'bg-(--color-background-surface) forced-colors:[background-color:Highlight]',
    '[box-shadow:var(--shadow-low)]',
  ),
  disabled:
    'cursor-default [&:is(:disabled,[aria-disabled=true])]:cursor-default text-(--color-text-disabled)',
  fill: 'flex-1 min-w-0 justify-center',
  // An icon-only segment has no label to truncate, so it keeps its size.
  iconOnly: 'shrink-0',
  icon: 'inline-flex items-center justify-center shrink-0',
  labelText: 'overflow-hidden text-ellipsis min-w-0',
} as const;

// CONCENTRIC_RADIUS =
//   'max(0px, calc(var(--_segmented-control-radius) - var(--_segmented-control-padding)))'
// spelled out in each size below (Tailwind needs literal class strings).
const sizeStyles = {
  // `sm` swaps the font size; the label leading is restated after it because
  // `cn()` treats a font-size class as overriding an earlier `leading-*`.
  sm: cn(
    'h-[calc(var(--size-element-sm)_-_4px)]',
    'rounded-[max(0px,calc(var(--_segmented-control-radius)_-_var(--_segmented-control-padding)))]',
    'px-(--spacing-2) text-(length:--text-supporting-size) leading-(--text-label-leading)',
  ),
  md: cn(
    'h-[calc(var(--size-element-md)_-_4px)]',
    'rounded-[max(0px,calc(var(--_segmented-control-radius)_-_var(--_segmented-control-padding)))]',
    'px-(--spacing-3)',
  ),
  lg: cn(
    'h-[calc(var(--size-element-lg)_-_4px)]',
    'rounded-[max(0px,calc(var(--_segmented-control-radius)_-_var(--_segmented-control-padding)))]',
    'px-(--spacing-3)',
  ),
} as const;

const iconSizeStyles = {
  sm: 'w-[14px] h-[14px]',
  md: 'w-[16px] h-[16px]',
  lg: 'w-[18px] h-[18px]',
} as const;

/**
 * Individual segment item within an SegmentedControl.
 * Renders as a radio button with visual segment styling.
 *
 * @example
 * ```
 * <SegmentedControlItem value="grid" label="Grid" icon={<GridIcon />} />
 * ```
 */
export function SegmentedControlItem({
  ref,
  value,
  label,
  isLabelHidden = false,
  icon,
  isDisabled = false,
  onClick: onClickProp,
  className,
  ...rest
}: SegmentedControlItemProps) {
  const ctx = useSegmentedControlContext();

  const isSelected = ctx.value === value;
  const isItemDisabled = isDisabled || ctx.isDisabled;
  // When the whole group is disabled with a disabledMessage, keep the selected
  // segment focusable so the group's reason tooltip is keyboard-discoverable.
  // Per-item disabling (`isDisabled` on the item) always drops out of the tab
  // order. Activation stays blocked by the isItemDisabled guard in handleClick.
  const keepsSelectedFocusable =
    isSelected && (ctx.hasDisabledMessage ?? false) && !isDisabled;
  const size: SegmentedControlSize = ctx.size;
  const isFill = ctx.layout === 'fill';

  // Consumer-first: a consumer onClick can call preventDefault() to opt out of
  // selection; otherwise selection proceeds when enabled and not selected.
  const handleClick = composeEventHandlers(onClickProp, () => {
    if (!isItemDisabled && !isSelected) {
      ctx.onChange(value);
    }
  });

  const iconElement = icon ? (
    <span className={cn(styles.icon, iconSizeStyles[size])}>{icon}</span>
  ) : null;

  return (
    <button
      ref={ref}
      {...rest}
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-disabled={isItemDisabled || undefined}
      aria-label={isLabelHidden ? label : undefined}
      data-value={value}
      // Disabled items (including when the whole group is disabled) are not tab
      // stops — otherwise the selected segment stays keyboard-focusable but is
      // silently dead (arrows and activation are no-ops) (navigation-13). The
      // exception is a whole-group disabledMessage, where the selected segment
      // stays focusable so the reason tooltip is keyboard-discoverable.
      tabIndex={
        (isSelected && !isItemDisabled) || keepsSelectedFocusable ? 0 : -1
      }
      onClick={handleClick}
      {...mergeProps(
        themeProps('segmented-control-item', {
          size,
          selected: isSelected ? 'selected' : null,
          disabled: isItemDisabled ? 'disabled' : null,
        }),
        {
          className: cn(
            focusOutlineStyles.focusVisible,
            styles.base,
            sizeStyles[size],
            isFill && styles.fill,
            isLabelHidden && styles.iconOnly,
            isSelected && styles.selected,
            // The shared hover and pressed overlay, on the segments a press can
            // change: the selected segment keeps its raised surface as it is.
            !isSelected &&
              !isItemDisabled &&
              interactionOverlayStyles.backgroundColor,
            isItemDisabled && styles.disabled,
          ),
        },
        className,
      )}>
      {iconElement}
      {!isLabelHidden && <span className={styles.labelText}>{label}</span>}
    </button>
  );
}

SegmentedControlItem.displayName = 'SegmentedControlItem';
