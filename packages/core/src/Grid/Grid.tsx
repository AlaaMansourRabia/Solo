/**
 * @file Grid.tsx
 * @input Uses React, Tailwind classes, spacing tokens
 * @output Exports Grid component, GridProps, and GridColumns
 * @position Grid component; provides CSS Grid-based layout
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Grid/Grid.doc.mjs
 * - /packages/core/src/Grid/Grid.test.tsx
 * - /apps/storybook/stories/Grid.stories.tsx
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import type {SpacingStep} from '../utils/types';
import type {SizeValue} from '../utils/types';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';

/**
 * Grid alignment options for align-items and justify-items.
 */

export type GridAlignment = 'start' | 'center' | 'end' | 'stretch';

/**
 * Column configuration for Grid.
 *
 * - `number` — fixed equal-width columns (e.g. `columns={3}`)
 * - `object` — responsive columns based on minimum child width:
 *   - `minWidth` — minimum width (px) for each column track
 *   - `repeat` — `'fill'` (default) preserves empty tracks for consistent widths;
 *     `'fit'` collapses empty tracks so items stretch to fill
 *   - `max` — caps the maximum number of columns. The grid stretches to 100%
 *     of its parent and the columns that are present always fill the row, so a
 *     layout collapsing to a single column on mobile stretches to full width
 *     (no dead space on the right).
 */
export type GridColumns =
  | number
  | {
      minWidth: number;
      max?: number;
      repeat?: 'fill' | 'fit';
    };

export interface GridProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Column configuration.
   * - `number` — fixed equal-width columns
   * - `{minWidth, max?, repeat?}` — responsive columns
   *
   * @see GridColumns
   */
  columns?: GridColumns;

  /**
   * Width of the grid container.
   * Numbers are treated as pixels, strings are used as-is (e.g., '100%').
   */
  width?: SizeValue;

  /**
   * Height of the grid container.
   * Numbers are treated as pixels, strings are used as-is (e.g., '100%').
   */
  height?: SizeValue;

  /**
   * Maximum width of the grid container.
   * Numbers are treated as pixels, strings are used as-is (e.g., '100%').
   */
  maxWidth?: SizeValue;

  /**
   * Minimum height of the grid container.
   * Numbers are treated as pixels, strings are used as-is (e.g., '100%').
   */
  minHeight?: SizeValue;

  /**
   * Spacing between all grid items (both row and column).
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   */
  gap?: SpacingStep;

  /**
   * Spacing between rows. Overrides gap for rows.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   */
  rowGap?: SpacingStep;

  /**
   * Spacing between columns. Overrides gap for columns.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   */
  columnGap?: SpacingStep;

  /**
   * Height of each implicit row track in pixels.
   * Sets `grid-auto-rows` — use with `GridSpan rows={N}` to create
   * masonry-style layouts where items span varying numbers of rows.
   *
   * @example
   * ```
   * <Grid columns={3} rowHeight={80} gap={3}>
   *   <GridSpan rows={4}>Tall</GridSpan>
   *   <GridSpan rows={2}>Short</GridSpan>
   * </Grid>
   * ```
   */
  rowHeight?: number;

  /**
   * Vertical alignment of grid items (align-items).
   * @default 'stretch'
   */
  align?: GridAlignment;

  /**
   * Horizontal alignment of grid items (justify-items).
   * @default 'stretch'
   */
  justify?: GridAlignment;

  /**
   * Content to render inside the grid.
   */
  children?: ReactNode;
}

const baseStyles = {
  grid: 'grid',
} as const;

// Dynamic track values go through scoped CSS variables + a class-level
// declaration (grid-template-columns: var(--x)) instead of a raw inline style,
// so consumer `className` overrides — including ones inside @media queries —
// can still win. A raw inline `grid-template-columns` would beat any class.
const dynamicStyles = {
  templateColumns: 'grid-cols-(--_grid-template-columns)',
  autoRows: 'auto-rows-(--_grid-auto-rows)',
} as const;

const alignStyles = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const;

const justifyStyles = {
  start: 'justify-items-start',
  center: 'justify-items-center',
  end: 'justify-items-end',
  stretch: 'justify-items-stretch',
} as const;

const gapStyles = {
  0: 'gap-(--spacing-0)',
  0.5: 'gap-(--spacing-0-5)',
  1: 'gap-(--spacing-1)',
  1.5: 'gap-(--spacing-1-5)',
  2: 'gap-(--spacing-2)',
  3: 'gap-(--spacing-3)',
  4: 'gap-(--spacing-4)',
  5: 'gap-(--spacing-5)',
  6: 'gap-(--spacing-6)',
  8: 'gap-(--spacing-8)',
  10: 'gap-(--spacing-10)',
} as const satisfies Record<SpacingStep, string>;

const rowGapStyles = {
  0: 'gap-y-(--spacing-0)',
  0.5: 'gap-y-(--spacing-0-5)',
  1: 'gap-y-(--spacing-1)',
  1.5: 'gap-y-(--spacing-1-5)',
  2: 'gap-y-(--spacing-2)',
  3: 'gap-y-(--spacing-3)',
  4: 'gap-y-(--spacing-4)',
  5: 'gap-y-(--spacing-5)',
  6: 'gap-y-(--spacing-6)',
  8: 'gap-y-(--spacing-8)',
  10: 'gap-y-(--spacing-10)',
} as const satisfies Record<SpacingStep, string>;

const columnGapStyles = {
  0: 'gap-x-(--spacing-0)',
  0.5: 'gap-x-(--spacing-0-5)',
  1: 'gap-x-(--spacing-1)',
  1.5: 'gap-x-(--spacing-1-5)',
  2: 'gap-x-(--spacing-2)',
  3: 'gap-x-(--spacing-3)',
  4: 'gap-x-(--spacing-4)',
  5: 'gap-x-(--spacing-5)',
  6: 'gap-x-(--spacing-6)',
  8: 'gap-x-(--spacing-8)',
  10: 'gap-x-(--spacing-10)',
} as const satisfies Record<SpacingStep, string>;

/**
 * Spacing token CSS var names for gap calculation in track-max expressions.
 */
const spacingVarNames: Record<SpacingStep, string> = {
  0: '--spacing-0',
  0.5: '--spacing-0-5',
  1: '--spacing-1',
  1.5: '--spacing-1-5',
  2: '--spacing-2',
  3: '--spacing-3',
  4: '--spacing-4',
  5: '--spacing-5',
  6: '--spacing-6',
  8: '--spacing-8',
  10: '--spacing-10',
};

/**
 * Build a grid-template-columns value that caps the column *count* at `max`
 * while still letting the columns that are actually present stretch to fill
 * the row.
 *
 * The cap lives on the track's **min** size, not its max: each track is at
 * least `perColumn = (100% - (max-1) * gap) / max`, so more than `max` columns
 * can never fit. The track **max** stays `1fr`, so whenever fewer than `max`
 * columns fit (most importantly a lone column on mobile) they still grow to
 * fill the whole row — no dead space on the right.
 *
 * The track min is `max(minWidth, perColumn)` so an explicit `minWidth` is
 * still honored, wrapped in `min(100%, …)` so a single column on a viewport
 * narrower than `minWidth`/`perColumn` shrinks to the container instead of
 * overflowing it.
 */
function buildCappedTemplate(
  minWidth: number,
  maxCols: number,
  repeatMode: 'auto-fill' | 'auto-fit',
  gap: SpacingStep | undefined,
  columnGap: SpacingStep | undefined,
): string {
  const gapVar =
    columnGap != null
      ? spacingVarNames[columnGap]
      : gap != null
        ? spacingVarNames[gap]
        : null;

  // perColumn = (100% - (maxCols - 1) * gap) / maxCols — the width a track
  // would have if exactly `maxCols` columns were present. Used as a floor so
  // the grid never fits more than `maxCols` columns.
  const perColumn = gapVar
    ? `calc((100% - ${maxCols - 1} * var(${gapVar})) / ${maxCols})`
    : `calc(100% / ${maxCols})`;

  // Track min caps the count; track max stays 1fr so present columns fill.
  const trackMin = `min(100%, max(${minWidth}px, ${perColumn}))`;

  return `repeat(${repeatMode}, minmax(${trackMin}, 1fr))`;
}

/**
 * Grid component for CSS Grid-based layouts.
 *
 * Supports fixed-column and responsive layouts via the `columns` prop:
 * - `columns={3}` — fixed 3-column grid
 * - `columns={{minWidth: 280}}` — responsive auto-fill (consistent widths)
 * - `columns={{minWidth: 280, repeat: 'fit'}}` — responsive auto-fit (stretch)
 * - `columns={{minWidth: 280, max: 4}}` — responsive, capped at 4 columns
 *
 * @example
 * ```
 * <Grid columns={3} gap={4}>
 *   <Item />
 *   <Item />
 *   <Item />
 * </Grid>
 * ```
 */
export function Grid({
  columns,
  rowHeight,
  width,
  height,
  maxWidth,
  minHeight,
  gap,
  rowGap,
  columnGap,
  align,
  justify,
  className,
  style,
  children,
  ref,
  ...props
}: GridProps) {
  // Determine grid-template-columns value
  let gridTemplateColumns: string;

  if (typeof columns === 'object' && columns != null) {
    // Responsive API: columns={{minWidth, max?, repeat?}}
    const repeatMode = columns.repeat === 'fit' ? 'auto-fit' : 'auto-fill';

    if (columns.max != null && columns.max > 0) {
      // Cap column count by limiting each track's max size
      gridTemplateColumns = buildCappedTemplate(
        columns.minWidth,
        columns.max,
        repeatMode,
        gap,
        columnGap,
      );
    } else {
      gridTemplateColumns = `repeat(${repeatMode}, minmax(${columns.minWidth}px, 1fr))`;
    }
  } else if (typeof columns === 'number' && columns > 0) {
    // Fixed columns mode
    gridTemplateColumns = `repeat(${columns}, 1fr)`;
  } else {
    // Default to 1 column if nothing specified
    gridTemplateColumns = '1fr';
  }

  // Build inline style for dynamic values. Track templates go through
  // dynamicStyles (CSS-var indirection) so className/@media overrides work;
  // width/height stay inline as explicit caller-set dimensions.
  const inlineStyle = {
    '--_grid-template-columns': gridTemplateColumns,
    ...(rowHeight != null && {'--_grid-auto-rows': `${rowHeight}px`}),
    ...(width != null && {
      width: typeof width === 'number' ? `${width}px` : width,
    }),
    ...(height != null && {
      height: typeof height === 'number' ? `${height}px` : height,
    }),
    ...(maxWidth != null && {
      maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    }),
    ...(minHeight != null && {
      minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
    }),
  } as React.CSSProperties;

  // For themeProps, extract numeric columns value for variant tracking
  const columnsVariant =
    typeof columns === 'number'
      ? columns
      : typeof columns === 'object'
        ? undefined
        : undefined;

  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('grid', {columns: columnsVariant, gap, align, justify}),
        {
          className: cn(
            baseStyles.grid,
            dynamicStyles.templateColumns,
            rowHeight != null && dynamicStyles.autoRows,
            gap != null && gapStyles[gap],
            rowGap != null && rowGapStyles[rowGap],
            columnGap != null && columnGapStyles[columnGap],
            align != null && alignStyles[align],
            justify != null && justifyStyles[justify],
          ),
        },
        className,
        {...style, ...inlineStyle},
      )}
      {...props}>
      {children}
    </div>
  );
}

Grid.displayName = 'Grid';
