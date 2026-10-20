/**
 * @file ChartLegend.tsx
 * @input Legend items plus logical position and alignment
 * @output Standalone chart legend component
 * @position Can be used inside Chart via the `legend` prop, or independently
 *
 * @example
 * ```
 * <Chart
 *   data={data}
 *   xKey="month"
 *   series={series}
 *   legend={{position: 'top', alignment: 'start'}}
 * />
 * ```
 */

'use client';

import {HStack, Text, useTranslator, VStack} from '@solo/core';
import {ChartSwatch, swatchVariantForType} from './ChartSwatch';
import type {LegendItem} from './legend';

export type {LegendItem};

export type LegendPosition = 'top' | 'bottom' | 'start' | 'end';
export type LegendAlignment = 'start' | 'center' | 'end';

export interface ChartLegendProps {
  /** Legend items to display */
  items?: LegendItem[];
  /** Position of the legend relative to the chart. Default: 'bottom' */
  position?: LegendPosition;
  /** Alignment of the legend within its position. Default: 'start' */
  alignment?: LegendAlignment;
}

/**
 * @agentGuidance
 * ChartLegend pairs series labels with decorative mark-shaped color swatches.
 * Use Chart legend options for the generated legend, or render ChartLegend
 * directly when the caller already owns the legend items.
 *
 * Don't:
 * - Use the legend as the chart’s only text alternative. Give the parent Chart
 *   an accessible name and preserve an equivalent data view or summary when the
 *   data requires one.
 * - Assume arbitrary series colors will remain distinguishable in every theme.
 *   Verify the complete chart and legend together against the surfaces where
 *   they render.
 */
export function ChartLegend({
  items = [],
  position = 'bottom',
  alignment = 'start',
}: ChartLegendProps) {
  const t = useTranslator();

  if (items.length === 0) {
    return null;
  }

  const isVertical = position === 'start' || position === 'end';

  // Rows are stateless, but labels aren't guaranteed unique (two series can
  // share a label), so disambiguate with the index to keep keys collision-free.
  const legendItems = items.map((item, i) => (
    <HStack key={`${item.label}-${i}`} gap={2} vAlign="center" role="listitem">
      <ChartSwatch
        color={item.color}
        variant={swatchVariantForType(item.type)}
      />
      <Text type="supporting">{item.label}</Text>
    </HStack>
  ));

  if (isVertical) {
    return (
      <VStack
        gap={2}
        hAlign={alignment}
        role="list"
        aria-label={t('@solo.chartLegend.label')}>
        {legendItems}
      </VStack>
    );
  }

  return (
    <HStack
      gap={4}
      justify={alignment}
      vAlign="center"
      wrap="wrap"
      role="list"
      aria-label={t('@solo.chartLegend.label')}>
      {legendItems}
    </HStack>
  );
}
