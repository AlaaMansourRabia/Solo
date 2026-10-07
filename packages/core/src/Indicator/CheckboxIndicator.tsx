/**
 * @file CheckboxIndicator.tsx
 * @input Indicator state props
 * @output Exports CheckboxIndicator — the default checkbox selection visual
 * @position Decorative checkbox visual shared by CheckboxInput, CheckboxList,
 *           and decorative menu markers
 */

import {cn, isRenderable, mergeProps, themeProps} from '../utils';
import type {IndicatorProps} from './types';

// Hover tints read the owner's `indicatorScope` group
// (`group-hover/indicator:`, see indicator.markers.styles.ts), gated on
// `(hover: hover)`.
const styles = {
  box: cn(
    'box-border flex items-center justify-center shrink-0',
    '[border-width:var(--border-width)] [border-style:solid]',
    'rounded-(--radius-inner)',
    '[transition-property:background-color,border-color]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  // State-dependent colors with ancestor hover behavior
  unchecked: cn(
    // Foreground for the inherit-shade loading spinner (reads currentColor):
    // brand accent on the light surface fill.
    '[color:var(--color-accent)]',
    '[border-color:var(--color-border-emphasized)]',
    'can-hover:group-hover/indicator:[border-color:color-mix(in_srgb,var(--color-border-emphasized),var(--color-tint-hover)_20%)]',
    '[background-color:var(--color-background-surface)]',
    'can-hover:group-hover/indicator:[background-color:color-mix(in_srgb,var(--color-background-surface),var(--color-tint-hover)_5%)]',
  ),
  checked: cn(
    // Foreground for the inherit-shade loading spinner (reads currentColor):
    // on-accent color against the accent fill.
    '[color:var(--color-on-accent)]',
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
  checkmark: cn(
    'hidden',
    // Forced colors (Windows High Contrast) does not reliably force an SVG
    // stroke painted with currentColor, so the check stays the same white as
    // the flattened (Canvas) box fill — a white check on a white box.
    // CanvasText keeps it perceivable on the Canvas box, matching the
    // indeterminate mark (WCAG 1.4.11).
    '[color:var(--color-on-accent)] forced-colors:[color:CanvasText]',
  ),
  checkmarkVisible: 'block',
  indeterminateMark: cn(
    'hidden',
    // Forced colors (Windows High Contrast) strips painted backgrounds,
    // which would make the indeterminate bar invisible; CanvasText keeps it
    // perceivable on the Canvas box fill (WCAG 1.4.11). The checkmark carries
    // the matching CanvasText treatment on its own style.
    '[background-color:var(--color-on-accent)] forced-colors:[background-color:CanvasText]',
    'rounded-(--radius-full)',
  ),
  indeterminateMarkVisible: 'block',
} as const;

const boxSizeStyles = {
  sm: 'w-[20px] h-[20px]',
  md: 'w-[24px] h-[24px]',
} as const;

const checkmarkSizeStyles = {
  sm: 'w-[12px] h-[12px]',
  md: 'w-[14px] h-[14px]',
} as const;

const indeterminateSizeStyles = {
  sm: 'w-[10px] h-[2px]',
  md: 'w-[12px] h-[2px]',
} as const;

/**
 * The default checkbox visual: a square box with a checkmark or an
 * indeterminate bar.
 *
 * Decorative and non-interactive — it renders `aria-hidden` and owns no input,
 * role, or focus behavior. The owning control keeps focus semantics and paints its
 * standard focus ring onto this indicator element (see CheckboxInput), so a
 * replacement's root radius determines the ring shape. Themes replace it
 * wholesale through `defineTheme({indicators: {checkbox: MyCheckbox}})`, or
 * restyle it through the canonical `checkbox-indicator` theme target.
 *
 * @example
 * ```
 * <CheckboxIndicator state="indeterminate" size="sm" />
 * ```
 */
export function CheckboxIndicator({
  state,
  size = 'md',
  isDisabled = false,
  children,
  ref,
  className,
  style,
  ...rest
}: IndicatorProps<'multiSelection'>) {
  const isChecked = state === 'checked';
  const isIndeterminate = state === 'indeterminate';
  const isCheckedOrIndeterminate = isChecked || isIndeterminate;

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
          'checkbox-indicator',
          {
            size,
            checked: isChecked
              ? 'checked'
              : isIndeterminate
                ? 'indeterminate'
                : null,
            disabled: isDisabled ? 'disabled' : null,
          },
          // `checkbox` was the target before indicators existed; keep it
          // emitted so existing themes continue to work.
          {legacyNames: ['checkbox']},
        ),
        {
          className: cn(
            styles.box,
            boxSizeStyles[size],
            isCheckedOrIndeterminate ? styles.checked : styles.unchecked,
            isDisabled && styles.disabled,
            isDisabled && !isCheckedOrIndeterminate && styles.disabledUnchecked,
          ),
        },
        className,
        style,
      )}>
      {isRenderable(children) ? (
        children
      ) : (
        <>
          <svg
            viewBox="0 0 10 10"
            {...mergeProps(themeProps('checkbox-indicator-check', {size}), {
              className: cn(
                styles.checkmark,
                checkmarkSizeStyles[size],
                isChecked && styles.checkmarkVisible,
              ),
            })}>
            <path
              d="M8.5 2.5L4 7.5L1.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            {...mergeProps(themeProps('checkbox-indicator-dash', {size}), {
              className: cn(
                styles.indeterminateMark,
                indeterminateSizeStyles[size],
                isIndeterminate && styles.indeterminateMarkVisible,
              ),
            })}
          />
        </>
      )}
    </span>
  );
}

CheckboxIndicator.displayName = 'CheckboxIndicator';
