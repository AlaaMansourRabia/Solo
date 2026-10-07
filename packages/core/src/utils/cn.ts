/**
 * @file cn.ts
 * @input Uses clsx, tailwind-merge
 * @output Exports cn (class composition) and cssLength (numeric length coercion)
 * @position Styling primitive; the class composition helper used throughout core
 *
 * `cn()` composes class names: it accepts conditional shapes
 * (`cond && styles.x`) and resolves conflicts so the LAST class for a given
 * property wins. That "application order" guarantee is what lets a consumer's
 * `className` override a component's internal styles.
 */

import {clsx, type ClassValue} from 'clsx';
import {extendTailwindMerge} from 'tailwind-merge';

/**
 * Conflicts resolve per CSS property. tailwind-merge, by default,
 * also drops an earlier `leading-*` when a later font-size utility appears
 * (because Tailwind's `text-sm` sets both). Our font-size utilities are
 * single-property (`text-(length:--x)`), so that cross-property rule would
 * silently lose line-heights set by an earlier utility — disable it.
 */
const twMerge = extendTailwindMerge({
  override: {
    conflictingClassGroups: {
      'font-size': [],
    },
  },
});

export type {ClassValue};

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Coerces a `SizeValue` to a CSS length. Bare numbers mean pixels for length
 * props, but inline CSS custom properties do not add a unit, so dynamic sizes
 * routed through a custom property (e.g. `style={{'--_w': cssLength(width)}}`)
 * go through here.
 */
export function cssLength(value: number | string): string;
export function cssLength(
  value: number | string | null | undefined,
): string | undefined;
export function cssLength(
  value: number | string | null | undefined,
): string | undefined {
  if (value == null) {
    return undefined;
  }
  return typeof value === 'number' ? `${value}px` : value;
}
