/**
 * @file navItemStyles.styles.ts
 * @input Uses theme tokens (color, spacing, radius, typography, transition, size)
 * @output Exports shared nav item appearance styles and NavItemSize type
 * @position Shared styles consumed by SideNavItem, TopNavItem (drawer mode),
 *   TopNavMenu (drawer mode), and any custom nav items that need to match.
 *
 * Centralizes the nav item appearance (layout, colors, hover/active/selected states,
 * disabled state) so all nav-like components stay in sync — especially important
 * when TopNav items render inside MobileNav drawers alongside SideNav items.
 *
 * Individual components layer their own overrides (e.g. collapsed mode,
 * indentation) via `cn(...)` composition (later classes win per property).
 *
 * The focus ring is not defined here. Compose
 * `focusOutlineStyles.focusVisible` (utils/focusOutline.styles.ts) at the call
 * site, on whichever element actually takes focus — in a split-action row that
 * is the link and the toggle, not the row that contains them.
 */

export type NavItemSize = 'sm' | 'md' | 'lg';

import {cn} from '../utils/cn';

/**
 * Base class sets shared by all nav item components (Record<key, string>).
 * Apply as a foundation and override specific properties as needed.
 *
 * @example
 * ```
 * import {navItemStyles} from '@solo/core/navItemStyles';
 *
 * <a className={cn(navItemStyles.item, 'ps-(--spacing-6)')}>
 *   Dashboard
 * </a>
 * ```
 */
export const navItemStyles = {
  /** Base interactive nav item — layout, typography, hover/active states */
  item: cn(
    'flex items-center gap-(--spacing-2) w-full h-(--size-element-md)',
    'px-(--spacing-2) py-0 rounded-(--radius-element)',
    '[border-width:0] [border-style:none] bg-transparent',
    'text-(--color-text-primary) [text-decoration:none]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[font-family:inherit] text-(length:--text-label-size)',
    'font-(number:--font-weight-normal) leading-(--text-label-leading)',
    'text-start box-border',
  ),

  /**
   * Selected/active page indicator — deemphasized background, medium weight.
   *
   * Forced colors flatten `--color-neutral` away, leaving the current page
   * unmarked; Highlight/HighlightText is the platform convention, as in
   * ToggleButton and SegmentedControlItem. No `forced-color-adjust: none`
   * here — a nav row is not a native control, so the keywords land without
   * it, and it would inherit into `endContent` and pin a Badge's own fill.
   *
   * `selected` replaces a composed `backgroundColor` wholesale (every
   * condition), dropping `interactionOverlayStyles.backgroundColor`'s hover
   * and pressed arms. The classes below use the SAME variant chains as that
   * overlay so `cn()` (tailwind-merge) drops them when `selected` is composed
   * after it.
   */
  selected: cn(
    'bg-(--color-neutral) forced-colors:bg-[Highlight]',
    'forced-colors:text-[HighlightText]',
    'font-(number:--font-weight-medium)',
    // Nested, not a sibling `(hover: hover) and (forced-colors: active)`
    // block: as siblings `item`'s hover overlay ties on specificity and wins
    // on source order, erasing the fill.
    'can-hover:usable:hover:bg-(--color-neutral)',
    'can-hover:forced-colors:usable:hover:bg-[Highlight]',
    'active:bg-(--color-neutral) forced-colors:active:bg-[Highlight]',
    'usable:active:bg-(--color-neutral) can-hover:usable:active:bg-(--color-neutral)',
    // The enabled-guard press arms above (there only to displace the overlay's)
    // sort after `forced-colors:active:`; restate Highlight under each.
    'forced-colors:usable:active:bg-[Highlight] can-hover:forced-colors:usable:active:bg-[Highlight]',
  ),

  /** Disabled state — muted color, no interaction */
  disabled: 'text-(--color-text-disabled) cursor-default pointer-events-none',

  /** Small size variant */
  sm: 'h-(--size-element-sm) px-(--spacing-1)',

  /** Medium size variant (default) */
  md: 'h-(--size-element-md) px-(--spacing-2)',

  /** Large size variant */
  lg: 'h-(--size-element-lg) px-(--spacing-2)',
} as const;
