/**
 * @file inputStyles.styles.ts
 * @input Uses theme tokens (color, spacing, radius, shadow, transition)
 * @output Exports shared input wrapper appearance styles
 * @position Shared styles consumed by TextInput, TextArea, NumberInput, DateInput,
 *   TimeInput, Selector, Typeahead, and Tokenizer
 *
 * Centralizes the input wrapper appearance (borders, focus outlines, hover shadows,
 * disabled state, status variants) so all input components stay in sync.
 * Individual components layer their own overrides (padding, alignment, etc.)
 * via `cn(...)` composition (later classes win per property).
 *
 * Every export is a Record<key, string> of class strings.
 *
 * An overriding set replaces a composed property WHOLESALE — every condition
 * of it — so e.g. `disabled`'s `boxShadow: 'none'` also removes the base hover
 * and focus-within rings. The overriding sets below repeat the base's
 * conditional variants with the overriding value, using the SAME variant
 * chains, so `cn()` (tailwind-merge) drops the base classes.
 */

import {cn} from '../utils/cn';

/**
 * Base wrapper styles shared by all input components.
 * Components apply these as a foundation and override specific properties
 * (e.g. padding, alignItems, gap) as needed.
 */
export const inputWrapperStyles = {
  base: cn(
    'box-border relative z-1 flex items-center gap-(--spacing-2)',
    'py-(--spacing-1) px-(--spacing-2)',
    '[border-width:var(--border-width)] [border-style:solid]',
    'border-(--color-border-emphasized) focus-within:border-(--color-accent)',
    '[--_field-radius:var(--radius-element)] rounded-(--_field-radius)',
    'bg-(--color-background-surface)',
    '[transition-property:border-color,box-shadow]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
    '[box-shadow:none]',
    'can-hover:hover:[&:not(:focus-within)]:usable:[box-shadow:inset_0px_0px_0px_2px_color-mix(in_srgb,var(--color-border-emphasized)_30%,transparent)]',
    'focus-within:[box-shadow:inset_0px_0px_0px_2px_var(--color-accent-muted)]',
    '[outline:none]',
  ),
  disabled: cn(
    'cursor-default opacity-50',
    'border-(--color-border-emphasized) focus-within:border-(--color-border-emphasized)',
    // Suppress the base hover ring — a disabled control must not react to hover.
    '[box-shadow:none] can-hover:hover:[&:not(:focus-within)]:usable:[box-shadow:none] focus-within:[box-shadow:none]',
  ),
} as const;

/**
 * Status border colors for input wrappers.
 * Keyed by InputStatusType.
 */
export const inputStatusBorderStyles = {
  warning: 'border-(--color-warning) focus-within:border-(--color-warning)',
  error: 'border-(--color-error) focus-within:border-(--color-error)',
  success: 'border-(--color-success) focus-within:border-(--color-success)',
} as const;

/**
 * Status hover shadow styles for input wrappers.
 * Keyed by InputStatusType.
 */
export const inputStatusHoverShadowStyles = {
  warning: cn(
    '[box-shadow:none] focus-within:[box-shadow:none]',
    'can-hover:hover:[&:not(:focus-within)]:usable:[box-shadow:var(--shadow-inset-warning)]',
  ),
  error: cn(
    '[box-shadow:none] focus-within:[box-shadow:none]',
    'can-hover:hover:[&:not(:focus-within)]:usable:[box-shadow:var(--shadow-inset-error)]',
  ),
  success: cn(
    '[box-shadow:none] focus-within:[box-shadow:none]',
    'can-hover:hover:[&:not(:focus-within)]:usable:[box-shadow:var(--shadow-inset-success)]',
  ),
} as const;

/**
 * Status focus border styles using :focus-within.
 * Used by input wrappers that contain a child input/textarea element.
 * Keyed by InputStatusType.
 */
export const inputStatusFocusWithinStyles = {
  warning: 'border-(--color-warning) focus-within:border-(--color-warning)',
  error: 'border-(--color-error) focus-within:border-(--color-error)',
  success: 'border-(--color-success) focus-within:border-(--color-success)',
} as const;

/**
 * Status focus border styles using :focus.
 * Used by components where the wrapper itself receives focus (e.g. Selector button).
 * Keyed by InputStatusType. (The `focus-within:` arm only shadows the base's
 * accent focus-within border, so the whole property is replaced.)
 */
export const inputStatusFocusStyles = {
  warning:
    'border-(--color-warning) focus:border-(--color-warning) focus-within:border-(--color-warning)',
  error:
    'border-(--color-error) focus:border-(--color-error) focus-within:border-(--color-error)',
  success:
    'border-(--color-success) focus:border-(--color-success) focus-within:border-(--color-success)',
} as const;
