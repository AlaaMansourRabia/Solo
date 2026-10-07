/**
 * @file selectorPresentation.styles.ts
 * @input Uses field border tokens
 * @output Shared focus-return styles for Selector and MultiSelector
 * @position Internal visual policy for selector presentation changes
 *
 * `pointerRestoredFocus` replaces the trigger's whole border color, box shadow
 * and outline — their `:focus-within`, hover and `:has(:focus-visible)` states
 * included — so the field's conditional classes are restated with the resting
 * value (same variant chains as `inputWrapperStyles.base` and
 * `focusOutlineStyles.focusWithin`, so `cn()` drops them). Compose it after
 * those sets.
 */

export const selectorPresentationStyles = {
  pointerRestoredFocus: [
    'border-(--color-border-emphasized) focus-within:border-(--color-border-emphasized)',
    '[box-shadow:none] focus-within:[box-shadow:none]',
    'can-hover:hover:[&:not(:focus-within)]:usable:[box-shadow:none]',
    '[outline-width:0] has-[:focus-visible]:[outline-width:0]',
    '[outline-style:none] has-[:focus-visible]:[outline-style:none]',
  ].join(' '),
} as const;
