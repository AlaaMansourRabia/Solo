/**
 * @file ChartSwatch.tsx
 * @input Caller-owned CSS color and optional square or line shape
 * @output Color swatch primitive for legends, tooltips, and standalone use
 * @position Composable primitive — used by ChartLegend and ChartTooltip, or
 *           independently anywhere a series indicator is needed.
 *
 * @example
 * ```
 * <ChartSwatch color="#3b82f6" variant="square" />
 * <ChartSwatch color="#f59e0b" variant="line" />
 * ```
 */

import {memo, type CSSProperties} from 'react';
import {cn} from '@solo/core/utils/cn';

/**
 * Visual variant — drives shape.
 * - `'square'` — square chip (bar series)
 * - `'line'` — short stroke (line, dot, area, and other non-bar series)
 */
export type ChartSwatchVariant = 'square' | 'line';

export interface ChartSwatchProps {
  /** Fill color — typically a series color token */
  color: string;
  /** Visual variant. Default: `'square'`. */
  variant?: ChartSwatchVariant;
}

const styles = {
  base: 'shrink-0',
  square: 'w-[8px] h-[8px] rounded-[2px] mx-[1px]',
  line: 'w-[10px] h-[3px] rounded-[1.5px]',
  // Runtime color → scoped custom property consumed by a class.
  fill: 'bg-(--_chart-swatch-color)',
} as const;

/**
 * Color swatch primitive.
 *
 * Used by ChartLegend (and ChartTooltip) to render the colored
 * indicator next to a series label. Exported as a primitive so consumers
 * can build their own custom legend/tooltip layouts while keeping visuals
 * consistent.
 */
function ChartSwatchImpl({color, variant = 'square'}: ChartSwatchProps) {
  return (
    <div
      aria-hidden
      className={cn(styles.base, styles[variant], styles.fill)}
      style={{'--_chart-swatch-color': color} as CSSProperties}
    />
  );
}

/**
 * Memoized — swatches are static for a given (color, variant) tuple
 * and can render many times in a tooltip/legend with several series.
 */
export const ChartSwatch = memo(ChartSwatchImpl);

/**
 * Map a SeriesDef.type string to its swatch variant.
 *
 * Bar series get a square chip; everything else (line, dot, area, and any
 * other non-bar mark) gets a short stroke. Centralized so legend, tooltip,
 * and any custom chrome stay consistent.
 */
export function swatchVariantForType(
  type: string | undefined,
): ChartSwatchVariant {
  return type === 'bar' ? 'square' : 'line';
}
