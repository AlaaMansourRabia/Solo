/**
 * @file Shared hover and pressed overlay states
 * @input Uses the semantic interaction-overlay color tokens (Tailwind classes)
 * @output Exports reusable background-color and background-image state styles
 * @position Internal styling utility for interactive core surfaces
 *
 * Every surface that paints a press composes one of these (or carries its own
 * `:active` rule), so a change to how the system answers a press is made here
 * once. `pressedBackgroundColor` is the press without the hover, for controls
 * whose hover is a colour or nothing.
 *
 * Every state sits behind the same zero-specificity enabled guard
 * (`:where(:not(:disabled,[aria-disabled="true"]))`). Hover is gated on
 * `@media (hover: hover)`, and `:active`
 * is repeated inside the media branch so a press always paints over a hover —
 * Tailwind sorts `active` after `hover`, so the pressed rule wins on ties.
 * The bare `:active` branch remains the touch fallback, where
 * `(hover: hover)` does not match.
 */

// `usable:` is the zero-specificity enabled guard and `can-hover:` the
// `@media (hover: hover)` gate — both defined in tailwind-preset.css.

const HOVER_IMAGE =
  'linear-gradient(var(--color-overlay-hover),var(--color-overlay-hover))';
const PRESSED_IMAGE =
  'linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed))';
const NEUTRAL_IMAGE = 'linear-gradient(var(--color-neutral),var(--color-neutral))';

export const interactionOverlayStyles = {
  backgroundColor: [
    'bg-transparent',
    'usable:active:bg-(--color-overlay-pressed)',
    'can-hover:usable:hover:bg-(--color-overlay-hover)',
    'can-hover:usable:active:bg-(--color-overlay-pressed)',
  ].join(' '),
  backgroundImage: [
    'usable:active:[background-image:linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed))]',
    'can-hover:usable:hover:[background-image:linear-gradient(var(--color-overlay-hover),var(--color-overlay-hover))]',
    'can-hover:usable:active:[background-image:linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed))]',
  ].join(' '),
  backgroundImageOnNeutral: [
    '[background-image:linear-gradient(var(--color-neutral),var(--color-neutral))]',
    'usable:active:[background-image:linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed)),linear-gradient(var(--color-neutral),var(--color-neutral))]',
    'can-hover:usable:hover:[background-image:linear-gradient(var(--color-overlay-hover),var(--color-overlay-hover)),linear-gradient(var(--color-neutral),var(--color-neutral))]',
    'can-hover:usable:active:[background-image:linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed)),linear-gradient(var(--color-neutral),var(--color-neutral))]',
  ].join(' '),
  /**
   * The pressed arm alone, for a control whose hover answer is its own — a
   * text link changes colour, a disclosure row has none — so a press paints
   * the system's pressed overlay without adding a hover surface the control
   * never had. Same enabled guard as the paired states above.
   */
  pressedBackgroundColor:
    'usable:active:bg-(--color-overlay-pressed)',
} as const;

/** The overlay gradients as CSS values, for imperative/inline use. */
export const INTERACTION_OVERLAY_IMAGES = {
  hover: HOVER_IMAGE,
  pressed: PRESSED_IMAGE,
  neutral: NEUTRAL_IMAGE,
} as const;
