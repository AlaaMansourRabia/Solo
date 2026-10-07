/**
 * @file RadioIndicator.tsx
 * @input Indicator state props
 * @output Exports RadioIndicator — the default radio selection visual
 * @position Decorative radio visual shared by RadioList, decorative menu
 *           markers, and any selection slot themed to use a radio
 */

import {cn, isRenderable, mergeProps, themeProps} from '../utils';
import type {IndicatorProps} from './types';

// Hover tints read the owner's `indicatorScope` group
// (`group-hover/indicator:`, see indicator.markers.styles.ts), gated on
// `(hover: hover)`.
const styles = {
  circle: cn(
    'box-border flex items-center justify-center shrink-0',
    '[border-width:var(--border-width)] [border-style:solid]',
    // A circle, in tokens: --radius-full is the house "fully rounded" value
    // (9999px) and renders pixel-identical to 50% on a square box, which the
    // size styles below guarantee. Themeable through --radius-full, unlike a
    // raw 50%.
    'rounded-(--radius-full)',
    '[transition-property:background-color,border-color]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  unchecked: cn(
    '[border-color:var(--color-border-emphasized)]',
    'can-hover:group-hover/indicator:[border-color:color-mix(in_srgb,var(--color-border-emphasized),var(--color-tint-hover)_20%)]',
    '[background-color:var(--color-background-surface)]',
    'can-hover:group-hover/indicator:[background-color:color-mix(in_srgb,var(--color-background-surface),var(--color-tint-hover)_5%)]',
  ),
  checked: cn(
    '[border-color:var(--color-accent)]',
    'can-hover:group-hover/indicator:[border-color:color-mix(in_srgb,var(--color-accent),var(--color-tint-hover)_15%)]',
    '[background-color:var(--color-accent)]',
    'can-hover:group-hover/indicator:[background-color:color-mix(in_srgb,var(--color-accent),var(--color-tint-hover)_15%)]',
  ),
  disabled: cn(
    'opacity-50',
    '[border-color:var(--color-border)]',
    'can-hover:group-hover/indicator:[border-color:var(--color-border)]',
  ),
  disabledUnchecked: cn(
    '[background-color:var(--color-background-muted)]',
    'can-hover:group-hover/indicator:[background-color:var(--color-background-muted)]',
  ),
  dot: cn(
    'rounded-(--radius-full)',
    // Forced colors (Windows High Contrast) strips painted backgrounds,
    // which would make the selected dot invisible — checked and unchecked
    // radios would look identical. CanvasText keeps the dot perceivable on
    // the Canvas circle fill (WCAG 1.4.11).
    '[background-color:var(--color-on-accent)] forced-colors:[background-color:CanvasText]',
  ),
} as const;

const circleSizeStyles = {
  sm: 'w-[20px] h-[20px]',
  md: 'w-[24px] h-[24px]',
} as const;

const dotSizeStyles = {
  sm: 'w-[8px] h-[8px]',
  md: 'w-[10px] h-[10px]',
} as const;

/**
 * The default radio visual: a circle with a filled inner dot when selected.
 *
 * Decorative and non-interactive — it renders `aria-hidden` and owns no input,
 * role, or focus behavior. Themes replace it wholesale through
 * `defineTheme({indicators: {radio: MyRadio}})`, or restyle it through the
 * `radio` / `radio-dot` theme targets like any other component.
 *
 * Unlike an icon, a radio draws in *both* states — an empty circle when
 * unchecked. That is what makes it usable as a selection indicator in
 * components whose default is "a checkmark when selected, nothing otherwise".
 *
 * @example
 * ```
 * <RadioIndicator state="checked" size="md" />
 * ```
 */
export function RadioIndicator({
  state,
  size = 'md',
  isDisabled = false,
  children,
  ref,
  className,
  style,
  ...rest
}: IndicatorProps<'singleSelection'>) {
  // A radio has no partial state; anything other than unchecked reads as
  // selected.
  const isChecked = state !== 'unchecked';

  return (
    <span
      // `{...rest}` first, own contract after. TypeScript cannot reject a
      // hyphenated JSX attribute (see IndicatorProps), so attribute order is
      // what actually keeps a caller from un-hiding a decorative element —
      // rubric P3, "owned aria-* set after {...rest}".
      {...rest}
      ref={ref}
      aria-hidden="true"
      {...mergeProps(
        themeProps(
          'radio-indicator',
          {
            size,
            checked: isChecked ? 'checked' : null,
            disabled: isDisabled ? 'disabled' : null,
          },
          // `radio` was the target before indicators existed; keep it emitted
          // so existing themes continue to work.
          {legacyNames: ['radio']},
        ),
        {
          className: cn(
            styles.circle,
            circleSizeStyles[size],
            isChecked ? styles.checked : styles.unchecked,
            isDisabled && styles.disabled,
            isDisabled && !isChecked && styles.disabledUnchecked,
          ),
        },
        className,
        style,
      )}>
      {isRenderable(children)
        ? children
        : isChecked && (
            <span
              {...mergeProps(
                themeProps(
                  'radio-indicator-dot',
                  {size},
                  {legacyNames: ['radio-dot']},
                ),
                {className: cn(styles.dot, dotSizeStyles[size])},
              )}
            />
          )}
    </span>
  );
}

RadioIndicator.displayName = 'RadioIndicator';
