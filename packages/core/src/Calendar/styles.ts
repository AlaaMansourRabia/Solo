/**
 * @file styles.ts
 * @input Uses theme tokens (Tailwind classes)
 * @output Exports calendar styles (structural) and theme styles (customizable)
 * @position Shared styles; used by Calendar
 *
 * Style Organization:
 * - *Styles objects: Structural/layout styles (spacing, sizing, positioning)
 * - *Theme objects: Themeable styles (colors, borders) that can be overridden
 *
 * SYNC: When modified, update this header
 */

import {cn} from '../utils/cn';

// =============================================================================
// Calendar Container Styles
// =============================================================================

export const calendarStyles = {
  calendar: 'inline-block p-(--spacing-3) min-w-[220px]',
  header: cn(
    'flex items-center justify-between',
    'mb-(--spacing-2) gap-(--spacing-2)',
  ),
  monthYearLabel: cn(
    'flex-1 text-center font-(number:--font-weight-semibold)',
    'text-(length:--text-label-size) text-(--color-text-primary)',
  ),
  // Wraps rather than overflowing: two months side by side need ~488px, so
  // an unwrapped row scrolls the document sideways below that and puts the
  // next-month button off-viewport (WCAG 1.4.10). Above 488px nothing moves.
  monthsContainer: 'flex flex-wrap gap-(--spacing-4)',
  /**
   * Wrapper for the month nav chevrons. RTL mirroring is applied by
   * composing the shared `rtlStyles.mirror` transform onto this wrapper
   * at the call site (see Calendar.tsx).
   */
  navIcon: 'inline-flex',
} as const;

// =============================================================================
// Month Grid Styles
// =============================================================================

export const monthGridStyles = {
  monthGrid: 'flex-[1_1_0]',
  dayName: cn(
    'w-(--size-element-md)',
    // Restores the small gap the standalone header used to have below it.
    'h-[calc(var(--size-element-md)+var(--spacing-1))]',
    'pb-(--spacing-1) box-border flex items-center justify-center',
    'text-(length:--text-supporting-size) font-(number:--font-weight-normal)',
    'text-(--color-text-secondary)',
  ),
  weekNumberHeader: 'w-(--size-element-md)',
  daysGrid: 'grid [grid-template-columns:repeat(7,1fr)]',
  daysGridWithNumbers: '[grid-template-columns:auto_repeat(7,1fr)]',
  weekNumber: cn(
    'w-(--size-element-md) h-(--size-element-md)',
    'flex items-center justify-center',
    'text-(length:--text-supporting-size) text-(--color-text-secondary)',
  ),
  weekRow: 'contents',
} as const;

// =============================================================================
// Day Cell Styles - Structural (layout, sizing, positioning)
// =============================================================================

// Half the gap between the day button and its cell — (--size-element-md minus
// --size-element-sm) / 2 — so the band's rounded caps line up with the button
// and the button's ::before bleeds out to meet its neighbour's. Deliberately a
// literal and NOT a spacing token: this is a layout value derived from the two
// size tokens, and pinning it to --spacing-0-5 desynchronises it from them
// (matcha sets that step to 3px, which overlaps adjacent days' hit targets by
// 2px). Deriving it with calc() from the size tokens would be better still and
// would close butter's 4px dead gap; that needs its own measured change.
// BAND_INSET = 2px and HIT_BLEED = -2px, spelled out in the classes below.

export const dayCellStyles = {
  // Cell container
  cell: 'relative flex items-center justify-center h-(--size-element-md) isolate',

  // Range background - structural positioning
  rangeBg: 'absolute top-[2px] bottom-[2px] start-0 end-0',
  rangeBgRadiusStart:
    'start-[2px] rounded-ss-(--radius-full) rounded-es-(--radius-full)',
  rangeBgRadiusEnd:
    'end-[2px] rounded-se-(--radius-full) rounded-ee-(--radius-full)',
  rangeInsetStart: 'start-[2px]',
  rangeInsetEnd: 'end-[2px]',

  // Preview background - structural positioning
  previewBg: 'absolute top-[2px] bottom-[2px] start-0 end-0',
  previewBgRadiusStart:
    'start-[2px] rounded-ss-(--radius-full) rounded-es-(--radius-full)',
  previewBgRadiusEnd:
    'end-[2px] rounded-se-(--radius-full) rounded-ee-(--radius-full)',
  previewStart:
    'start-[2px] rounded-ss-(--radius-full) rounded-es-(--radius-full)',
  previewEnd: 'end-[2px] rounded-se-(--radius-full) rounded-ee-(--radius-full)',

  // Day button - structural
  day: cn(
    'w-(--size-element-sm) h-(--size-element-sm)',
    'flex items-center justify-center rounded-(--radius-full)',
    '[border-width:0] [border-style:none]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[font-family:inherit] text-(length:--text-body-size) p-0 relative z-1',
    '[transition-property:background-color,color] motion-reduce:[transition-property:none]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
    // Expand hit target so adjacent days meet with no gap
    "before:content-[''] before:absolute before:top-[-2px] before:end-[-2px] before:bottom-[-2px] before:start-[-2px]",
  ),

  // State modifiers - structural only
  dayOutside: 'opacity-50',
  dayToday: '',
  dayTodayInRange: '',
  daySelected: '',
  // Replaces the day's whole cursor (both arms).
  dayDisabled:
    'cursor-default [&:is(:disabled,[aria-disabled=true])]:cursor-default',
} as const;

// =============================================================================
// Day Cell Theme - Colors and visual appearance (customizable)
// =============================================================================

export const dayCellTheme = {
  // Range background color
  rangeBg: 'bg-(--color-accent-muted)',

  // Preview background (muted overlay)
  previewBg: 'bg-(--color-overlay-hover)',

  // Day button - default state
  day: 'text-(--color-text-primary) bg-transparent',

  // Outside days (adjacent months)
  dayOutside: 'text-(--color-text-secondary)',

  // Today indicator
  dayToday: '[box-shadow:inset_0_0_0_1px_var(--color-border-emphasized)]',

  // Today when inside a selected range
  dayTodayInRange: '[box-shadow:inset_0_0_0_1px_var(--color-text-primary)]',

  // Selected state (single selection or range endpoints)
  // Forced colors (Windows High Contrast) strips the accent fill, which
  // leaves the selected date looking exactly like every other day.
  // Highlight/HighlightText is the platform convention for a selected
  // control (WCAG 1.4.11), and `forced-color-adjust: none` is required
  // because this is a <button>: the UA otherwise keeps the native
  // ButtonFace surface and ignores the authored fill, the same trap
  // ToggleButton documents.
  daySelected: cn(
    '[forced-color-adjust:none]',
    'bg-(--color-accent) forced-colors:bg-[Highlight]',
    'text-(--color-on-accent) forced-colors:text-[HighlightText]',
  ),

  // Disabled state. Replaces every arm of the shared overlay's
  // background-image (same variant chains), so `cn()` drops them all.
  dayDisabled: cn(
    'opacity-[0.3]',
    '[background-image:none]',
    'usable:active:[background-image:none]',
    'can-hover:usable:hover:[background-image:none]',
    'can-hover:usable:active:[background-image:none]',
  ),
} as const;
