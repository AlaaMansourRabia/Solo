'use client';

/**
 * @file Wheel.tsx
 * @input Option list, selected value, change callback
 * @output Exports Wheel — a snap-scrolling picker column
 * @position Internal component; consumed by MonthYearWheels.tsx
 *
 * A wheel is a scroll container, not a custom gesture surface. Momentum,
 * rubber-banding, and the settle animation are the platform's; all this adds
 * is `scroll-snap-align: center` on each option, half a viewport of padding at
 * each end so the first and last option can reach the middle, and a commit
 * when the scrolling stops.
 *
 * The falloff (rows fading and tipping away from the centre) is a CSS
 * scroll-driven animation on a `view()` timeline — the browser interpolates it
 * against each row's own position in the scrollport, so it stays glued to the
 * finger with no JS in the frame loop. It is guarded by `@supports`, because a
 * browser that does not understand `animation-timeline` would otherwise run
 * the same keyframes on the document timeline and simply play them once.
 *
 * Accessibility: this is a listbox, not a novel widget. It is one tab stop
 * with arrow/Home/End/PageUp/PageDown keys, `aria-activedescendant` tracking
 * the active row, and every row reachable by tap — none of which depends on
 * the scroll-driven decoration.
 *
 * SYNC: When modified, update:
 * - /packages/core/src/DateInput/TouchDateField.tsx
 * - /packages/core/src/DateTimeInput/TouchDateTimeField.tsx
 * - /packages/core/src/DateInput/DateInput.doc.mjs
 * - /packages/core/src/DateInput/DateInputTouch.test.tsx
 */

import {useCallback, useEffect, useId, useRef, useState} from 'react';
import {cn, focusOutlineStyles} from '../utils';
import {useOwnScrollGesture} from './useOwnScrollGesture';
import {usePointerDragScroll} from './usePointerDragScroll';
import {useScrollSettle} from './useScrollSettle';

// Geometry from ./tokens.styles, spelled out literally (Tailwind needs literal
// class strings): ITEM_BLOCK_SIZE = dateInputTouchSizes.wheelItemSize (28px),
// paneBlockSize = calc(6 * 44px), wheelEdgePadding = calc((6 * 44px - 28px) / 2).

/**
 * Rows tip away from the centre of the wheel. 0% is a row just entering at the
 * bottom of the scrollport, 50% is a row centred in it, 100% is a row leaving
 * at the top — which is what a `view()` timeline over the `cover` range means,
 * and why this reads as a cylinder rotating under the finger.
 *
 * Keyframes `solo-date-input-wheel-falloff` and the motion-free
 * `solo-date-input-wheel-fade` (the depth cue survives as opacity alone)
 * live in DateInput.css.
 */

const styles = {
  column: 'relative flex-[1_1_0] min-w-0',
  scroller: cn(
    '[block-size:calc(6*44px)]',
    // Load-bearing, and stated rather than inherited from the reset (whose
    // rule is zero-specificity `:where`): with content-box the end padding
    // below would be added to the scrollport instead of sitting inside it,
    // and every snap position would be wrong.
    'box-border overflow-y-auto overflow-x-hidden',
    // Snap every row to the middle of the scrollport, where the selection band
    // sits. `mandatory` (not `proximity`) because a wheel has no valid resting
    // position between two options.
    '[scroll-snap-type:y_mandatory] overscroll-contain',
    // Room for row 0 and row n-1 to reach the centre.
    '[padding-block:calc((6*44px-28px)/2)]',
    // Gives the rotateX falloff somewhere to recede to.
    '[perspective:520px] [transform-style:preserve-3d]',
    '[scrollbar-width:none] [outline:none] [touch-action:pan-y]',
  ),
  item: cn(
    'flex items-center justify-center [block-size:28px] px-(--spacing-2)',
    '[scroll-snap-align:center] [border-width:0] [border-style:none] bg-transparent',
    // Larger than body text, and larger than the calendar's day numbers: on
    // a wheel the value under the band is the whole interface, and the rows
    // above and below are read at a glance while moving.
    'text-(length:--text-large-size) font-(number:--font-weight-normal)',
    'text-(--color-text-primary) whitespace-nowrap',
    // NO `overflow: hidden` here. It would make the row itself a scroll
    // container, and `view()` binds to the subject's nearest ancestor scroll
    // container — the falloff would measure the row against itself and sit
    // frozen at 50% forever. Clipping belongs on the inner element.
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'select-none [transition-property:color,font-weight]',
    '[transition-duration:var(--duration-fast)]',
  ),
  /**
   * The falloff rides an inner element, never the row itself.
   *
   * A snap area is the element's TRANSFORMED border box, so animating the row
   * would move the very positions the scroller is snapping to — the wheel
   * settles a few pixels off, and the offset feeds back into the animation.
   * Transforming a child leaves the row's box, and every snap offset, exact.
   */
  itemInner: cn(
    'flex items-center justify-center [inline-size:100%] [block-size:100%]',
    'overflow-hidden text-ellipsis',
    // The wheel look. Held behind @supports so browsers without scroll-driven
    // animations get a plain, fully legible list instead of these keyframes
    // playing themselves out once on the document timeline. Under reduced
    // motion the same timeline drives opacity only — the depth cue survives,
    // the tipping does not.
    'supports-[animation-timeline:view()]:[animation-name:solo-date-input-wheel-falloff]',
    'supports-[animation-timeline:view()]:motion-reduce:[animation-name:solo-date-input-wheel-fade]',
    '[animation-timeline:view(y)] [animation-range:cover_0%_cover_100%]',
    '[animation-fill-mode:both] [animation-duration:auto] [animation-timing-function:linear]',
    'backface-hidden',
  ),
  itemActive: 'text-(--color-text-accent) font-(number:--font-weight-semibold)',
  itemDisabled:
    'text-(--color-text-disabled) cursor-default [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  /**
   * The selection band: a single centred row-height plate behind the options.
   * Purely decorative — the committed value is announced by `aria-selected`.
   */
  band: cn(
    'absolute inset-x-0 [inset-block-start:calc(50%-(28px/2))] [block-size:28px]',
    'rounded-(--radius-element)',
    // `--color-neutral`, not `--color-background-muted`. Muted is 4.7% alpha,
    // which puts the whole plate 17 units of colour away from the sheet
    // behind it — so when the wheels fade in, the band's animation has 17
    // units to happen in while the text beside it travels 412. It did not
    // read as fading, it read as appearing. Neutral is 10%, which doubles the
    // range to 36 and is still quiet enough to sit under text.
    'bg-(--color-neutral) pointer-events-none',
  ),
} as const;

export interface WheelOption {
  /** Stable numeric identity of the row (a month 1-12, or a year). */
  value: number;
  /** Row text. */
  label: string;
  /** Rows outside min/max stay visible but cannot be committed. */
  isDisabled?: boolean;
}

export interface WheelProps {
  /** Accessible name for the column, e.g. "Month". */
  label: string;
  /** Rows, top to bottom. */
  options: ReadonlyArray<WheelOption>;
  /** Committed value; must match one option's `value`. */
  value: number;
  /** Fired when the wheel comes to rest on a different, enabled row. */
  onChange: (value: number) => void;
  /**
   * False while the wheel is hidden — scroll offsets of a display:none
   * scroller are meaningless, so listeners and the initial scroll wait.
   */
  isActive?: boolean;
}

/**
 * One snap-scrolling picker column.
 *
 * @example
 * ```
 * <Wheel
 *   label="Month"
 *   options={monthOptions}
 *   value={month}
 *   onChange={setMonth}
 * />
 * ```
 */
export function Wheel({
  label,
  options,
  value,
  onChange,
  isActive = true,
}: WheelProps) {
  const id = useId();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const selectedIndex = Math.max(
    0,
    options.findIndex(option => option.value === value),
  );
  // Which row is under the band right now. Tracks the finger during a scroll;
  // `selectedIndex` only catches up when the wheel settles.
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  // Row height in px, read from layout rather than assumed, so a theme that
  // retunes --date-input-touch-wheel-item-size still lands on the right row.
  const itemBlockSize = useCallback((): number => {
    const first = scrollerRef.current?.firstElementChild;
    return first instanceof HTMLElement && first.offsetHeight > 0
      ? first.offsetHeight
      : 0;
  }, []);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const scroller = scrollerRef.current;
      const size = itemBlockSize();
      if (scroller == null || size === 0) {
        return;
      }
      scroller.scrollTo({top: index * size, behavior});
    },
    [itemBlockSize],
  );

  // Commit on rest. A disabled row is bounced back to the committed one
  // rather than silently keeping a value the wheel is not showing.
  //
  // Declared here, above the park effect, because that effect consults the
  // `isAtRestRef` this returns before it repositions anything.
  const {isAtRestRef} = useScrollSettle(
    scrollerRef,
    scroller => {
      const size = itemBlockSize();
      if (size === 0) {
        return;
      }
      const index = Math.min(
        options.length - 1,
        Math.max(0, Math.round(scroller.scrollTop / size)),
      );
      const option = options[index];
      if (option == null || option.isDisabled) {
        scrollToIndex(selectedIndex, 'smooth');
        return;
      }
      if (option.value !== value) {
        onChange(option.value);
      }
    },
    isActive,
  );

  // Park the committed row under the band whenever the wheel is shown, or the
  // value is changed from outside (the calendar scrolled to another month).
  //
  // NEVER while the wheel is still moving. A scroller that is mid-gesture or
  // still carrying momentum is the user's, and repositioning it does not stop
  // the momentum — on iOS it feeds a cycle where the scroll this causes reads
  // as a new settle, commits the next row along, and parks again. See
  // useScrollSettle. The settle handler re-checks the position afterwards, so
  // a correction that is genuinely needed still happens, just at rest.
  useEffect(() => {
    if (!isActive || !isAtRestRef.current) {
      return;
    }
    const size = itemBlockSize();
    const scroller = scrollerRef.current;
    if (scroller == null || size === 0) {
      return;
    }
    if (Math.round(scroller.scrollTop / size) !== selectedIndex) {
      scroller.scrollTo({top: selectedIndex * size, behavior: 'auto'});
    }
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- the highlight follows a scroll position, which only exists after layout
    setActiveIndex(selectedIndex);
  }, [isActive, selectedIndex, itemBlockSize, isAtRestRef]);

  // Highlight follows the finger. rAF-throttled: a scroll can fire far more
  // often than the display refreshes, and this only feeds a repaint.
  const frameRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller == null || !isActive) {
      return;
    }
    const onScroll = () => {
      if (frameRef.current != null) {
        return;
      }
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = undefined;
        const size = itemBlockSize();
        if (size === 0) {
          return;
        }
        const index = Math.min(
          options.length - 1,
          Math.max(0, Math.round(scroller.scrollTop / size)),
        );
        setActiveIndex(index);
      });
    };
    scroller.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
    };
  }, [isActive, options.length, itemBlockSize]);

  // Keep the finger. Inside a BottomSheet the sheet would otherwise read a
  // downward drag here as swipe-to-dismiss; see useOwnScrollGesture. Gated on
  // isActive because the hidden panel keeps its layout box.
  // 'all': a wheel scrolls vertically, the same axis the sheet wants, so
  // there is no way to share — it takes every touch that lands on it.
  useOwnScrollGesture(scrollerRef, 'all', {isEnabled: isActive});

  // A mouse cannot drag a scroll container, so without this the wheel ignores
  // the one gesture its shape invites. Touch is untouched — it pans natively,
  // with momentum this could not match. See usePointerDragScroll.
  usePointerDragScroll(scrollerRef, isActive);

  const moveBy = useCallback(
    (delta: number) => {
      const next = Math.min(
        options.length - 1,
        Math.max(0, activeIndex + delta),
      );
      const option = options[next];
      if (option == null || option.isDisabled) {
        return;
      }
      setActiveIndex(next);
      scrollToIndex(next, 'smooth');
      if (option.value !== value) {
        onChange(option.value);
      }
    },
    [activeIndex, options, scrollToIndex, value, onChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          moveBy(1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          moveBy(-1);
          break;
        case 'PageDown':
          event.preventDefault();
          moveBy(10);
          break;
        case 'PageUp':
          event.preventDefault();
          moveBy(-10);
          break;
        case 'Home':
          event.preventDefault();
          moveBy(-activeIndex);
          break;
        case 'End':
          event.preventDefault();
          moveBy(options.length - 1 - activeIndex);
          break;
        default:
          break;
      }
    },
    [moveBy, activeIndex, options.length],
  );

  return (
    <div className={cn(styles.column)}>
      <div aria-hidden="true" className={cn(styles.band)} />
      <div
        ref={scrollerRef}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`${id}-${options[activeIndex]?.value}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(styles.scroller, focusOutlineStyles.focusVisible)}>
        {options.map((option, index) => (
          <div
            key={option.value}
            id={`${id}-${option.value}`}
            role="option"
            aria-selected={option.value === value}
            aria-disabled={option.isDisabled || undefined}
            onClick={() => {
              if (option.isDisabled) {
                return;
              }
              setActiveIndex(index);
              scrollToIndex(index, 'smooth');
              if (option.value !== value) {
                onChange(option.value);
              }
            }}
            className={cn(
              styles.item,
              index === activeIndex && styles.itemActive,
              option.isDisabled && styles.itemDisabled,
            )}>
            <span className={cn(styles.itemInner)}>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Wheel.displayName = 'Wheel';
