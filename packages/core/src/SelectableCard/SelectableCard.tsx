'use client';

/**
 * @file SelectableCard.tsx
 * @input Uses Card, useClickableContainer, Tailwind classes
 * @output Exports SelectableCard component and SelectableCardProps
 * @position Interactive card for toggle selection
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/SelectableCard/SelectableCard.doc.mjs (props table, features)
 * - /packages/core/src/SelectableCard/index.ts (exports if types change)
 * - /apps/storybook/stories/SelectableCard.stories.tsx (storybook stories)
 *
 * Composes Card for all visual styling. Adds selection state with
 * an inset box-shadow (zero layout jitter) and useClickableContainer
 * for safe nested interactive elements.
 *
 * A hidden <input type="checkbox"> inside the card provides the accessible
 * role, label, and checked state — the card surface itself has no role/tabIndex.
 * Space toggles it natively; Enter is wired up as an additional toggle key.
 *
 * For static display, use Card.
 * For navigation or action cards, use ClickableCard.
 */

import {
  type ReactNode,
  type MouseEvent,
  type KeyboardEvent,
  useRef,
  useCallback,
  type Ref,
} from 'react';
import type {Elevation, SizeValue, SpacingStep} from '../utils/types';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {Card} from '../Card/Card';
import type {CardVariant} from '../Card/Card';
import {useClickableContainer} from '../hooks/useClickableContainer';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';

import {useMergedRefs} from '../hooks/useMergedRefs';
// =============================================================================
// Styles — selection + interaction; Card handles the rest
// =============================================================================

const styles = {
  interactive: cn(
    // Declared here, on the element that carries the `solo-selectable-card`
    // target, so a theme has something to override — the ring for a variant
    // only the theme knows about reads it (see selectedUnknown).
    '[--selectable-card-ring-color:var(--color-accent)]',
    'relative cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition-property:box-shadow,border-color]',
    '[transition-duration:var(--duration-fast)]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  // Hover overlay — guarded by @media (hover: hover) so touch devices
  // don't show a stuck hover state. Active/pressed state works everywhere.
  overlay: cn(
    "after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none",
    'after:[transition-property:background-color]',
    'after:[transition-duration:var(--duration-fast)]',
    'after:[transition-timing-function:var(--ease-standard)]',
    'after:bg-transparent',
    'active:after:bg-(--color-overlay-pressed)',
  ),
  hoverOnPointer:
    'can-hover:hover:usable:after:bg-(--color-overlay-hover)',
  disabled: 'cursor-default opacity-50',
  srOnly: cn(
    'absolute w-[1px] h-[1px] p-0 m-[-1px] overflow-hidden',
    '[clip:rect(0,0,0,0)] whitespace-nowrap [border-width:0]',
  ),
  // Selection indicator — an inset ring drawn via the card's --_card-ring
  // shadow slot (zero layout jitter) plus a borderColor change on the card's
  // own border for a cohesive look. Routing the ring through --_card-ring
  // (rather than box-shadow directly) lets it compose with the card's
  // elevation instead of clobbering it.
  selected: 'border-(--color-accent) [--_card-ring:inset_0_0_0_2px_var(--color-accent)]',
  selectedBlue: 'border-(--color-border-blue) [--_card-ring:inset_0_0_0_2px_var(--color-border-blue)]',
  selectedCyan: 'border-(--color-border-cyan) [--_card-ring:inset_0_0_0_2px_var(--color-border-cyan)]',
  selectedGray: 'border-(--color-border-gray) [--_card-ring:inset_0_0_0_2px_var(--color-border-gray)]',
  selectedGreen: 'border-(--color-border-green) [--_card-ring:inset_0_0_0_2px_var(--color-border-green)]',
  selectedOrange: 'border-(--color-border-orange) [--_card-ring:inset_0_0_0_2px_var(--color-border-orange)]',
  selectedPink: 'border-(--color-border-pink) [--_card-ring:inset_0_0_0_2px_var(--color-border-pink)]',
  selectedPurple: 'border-(--color-border-purple) [--_card-ring:inset_0_0_0_2px_var(--color-border-purple)]',
  selectedRed: 'border-(--color-border-red) [--_card-ring:inset_0_0_0_2px_var(--color-border-red)]',
  selectedTeal: 'border-(--color-border-teal) [--_card-ring:inset_0_0_0_2px_var(--color-border-teal)]',
  selectedYellow: 'border-(--color-border-yellow) [--_card-ring:inset_0_0_0_2px_var(--color-border-yellow)]',
  // A theme-added variant paints with colours the component cannot know, so no
  // token is guaranteed to contrast with it — an accent ring disappears against
  // an accent fill, and an outset one is no better. The theme that supplied the
  // fill is the only thing that can pick a ring, so it gets a lever beside it;
  // the var defaults to the accent, keeping every built-in unchanged.
  selectedUnknown:
    '[--_card-ring:inset_0_0_0_2px_var(--selectable-card-ring-color)]',
} as const;

const selectedStyleForVariant = (variant: CardVariant) => {
  switch (variant) {
    case 'default':
    case 'transparent':
    case 'muted':
      return styles.selected;
    case 'blue':
      return styles.selectedBlue;
    case 'cyan':
      return styles.selectedCyan;
    case 'gray':
      return styles.selectedGray;
    case 'green':
      return styles.selectedGreen;
    case 'orange':
      return styles.selectedOrange;
    case 'pink':
      return styles.selectedPink;
    case 'purple':
      return styles.selectedPurple;
    case 'red':
      return styles.selectedRed;
    case 'teal':
      return styles.selectedTeal;
    case 'yellow':
      return styles.selectedYellow;
    // CardVariant is open — a theme can add a variant this switch has never
    // seen, and it still has to look selected.
    default:
      return styles.selectedUnknown;
  }
};

// =============================================================================
// Props
// =============================================================================

export interface SelectableCardProps extends Omit<BaseProps, 'onChange'> {
  /** Ref forwarded to the root element. */
  ref?: Ref<HTMLDivElement>;

  /**
   * Accessibility label for the card.
   * Used as `aria-label` — provides the accessible name for screen readers.
   */
  label: string;

  /**
   * Controlled selection state.
   * When true, the card shows an inset accent border indicating selection.
   */
  isSelected: boolean;

  /**
   * Selection change handler.
   * Called with the new selection state when the card is toggled.
   */
  onChange: (isSelected: boolean) => void;

  /**
   * Set to true to disable the card.
   * Disabled cards remain focusable (tabIndex 0) with aria-disabled
   * so screen reader users can discover them.
   */
  isDisabled?: boolean;

  /** Content to render inside the card. */
  children?: ReactNode;

  /**
   * Internal padding of the card using the spacing scale.
   * @default 4 (16px)
   */
  padding?: SpacingStep;

  /**
   * Background color variant.
   * @default 'default'
   */
  variant?: CardVariant;

  /**
   * Resting elevation — the shadow depth the card sits at.
   * The selection ring composes on top, so a selected card keeps its shadow.
   * @default 'none'
   */
  elevation?: Elevation;

  /** Width of the card. */
  width?: SizeValue;

  /** Height of the card. */
  height?: SizeValue;

  /** Maximum width of the card. */
  maxWidth?: SizeValue;
}

// =============================================================================
// Component
// =============================================================================

/**
 * A card that toggles between selected and unselected states.
 *
 * Composes Card for visual styling and adds selection state with
 * an inset box-shadow (zero layout jitter vs plain Card). Supports
 * hover, pressed, focus, and disabled states.
 *
 * A visually-hidden <input type="checkbox"> inside the card provides
 * the accessible role, label, and checked state. The card surface
 * is a plain <div> — no role or tabIndex on the container.
 *
 * @compositionHint Use for multi-select or single-select card groups.
 * Manage selection state externally — use a Set for multi-select
 * or a single value for radio-style selection.
 * For navigation/action cards, use ClickableCard instead.
 *
 * @example
 * ```
 * <SelectableCard
 *   label="Option A"
 *   isSelected={selected === 'a'}
 *   onChange={() => setSelected('a')}>
 *   <Text type="body" weight="bold">Option A</Text>
 * </SelectableCard>
 * ```
 */
export function SelectableCard({
  label,
  isSelected,
  onChange,
  onClick: onClickProp,
  onMouseUp: onMouseUpProp,
  isDisabled = false,
  children,
  padding,
  variant = 'default',
  elevation = 'none',
  width,
  height,
  maxWidth,
  ref,
  className: classNameProp,
  style,
  ...props
}: SelectableCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const interactiveRef = useRef<HTMLInputElement | null>(null);

  const handleClick = useCallback(
    (_event: MouseEvent<HTMLElement>) => {
      if (!isDisabled) {
        onChange(!isSelected);
      }
    },
    [isDisabled, isSelected, onChange],
  );

  // The focusable control is a native checkbox, which toggles on Space but
  // ignores Enter. Add Enter as an extra toggle key; Space keeps its native
  // handling, so we deliberately do not toggle on Space here (would double).
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (isDisabled) {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
        }
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        onChange(!isSelected);
      }
    },
    [isDisabled, isSelected, onChange],
  );

  const {onClick, onMouseUp} = useClickableContainer({
    containerRef,
    interactiveRef,
    onClick: handleClick,
    disabled: isDisabled,
  });

  const composedOnClick = onClickProp
    ? (e: MouseEvent<HTMLElement>) => {
        onClick(e);
        onClickProp(e);
      }
    : onClick;

  const composedOnMouseUp = onMouseUpProp
    ? (e: MouseEvent<HTMLElement>) => {
        onMouseUp(e);
        onMouseUpProp(e);
      }
    : onMouseUp;

  return (
    <Card
      ref={useMergedRefs(ref, containerRef)}
      width={width}
      height={height}
      maxWidth={maxWidth}
      padding={padding}
      variant={variant}
      elevation={elevation}
      {...mergeProps(
        themeProps('selectable-card', {
          variant,
          selected: isSelected ? 'true' : 'false',
        }),
        {
          className: cn(
            styles.interactive,
            isSelected && selectedStyleForVariant(variant),
            !isDisabled && styles.overlay,
            !isDisabled && styles.hoverOnPointer,
            isDisabled && styles.disabled,
            focusOutlineStyles.focusWithin,
          ),
        },
        classNameProp,
        style,
      )}
      onClick={!isDisabled ? composedOnClick : undefined}
      onMouseUp={!isDisabled ? composedOnMouseUp : undefined}
      {...props}>
      <input
        ref={interactiveRef}
        type="checkbox"
        checked={isSelected}
        aria-label={label}
        aria-disabled={isDisabled ? 'true' : undefined}
        onChange={() => {
          if (isDisabled) {
            return;
          }
          onChange(!isSelected);
        }}
        onKeyDown={handleKeyDown}
        className={styles.srOnly}
      />
      {children}
    </Card>
  );
}

SelectableCard.displayName = 'SelectableCard';
