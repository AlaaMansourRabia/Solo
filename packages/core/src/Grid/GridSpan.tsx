/**
 * @file GridSpan.tsx
 * @input Uses React, Tailwind classes
 * @output Exports GridSpan component and GridSpanProps
 * @position Grid span component; controls grid item span
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Grid/Grid.doc.mjs
 * - /packages/core/src/Grid/Grid.test.tsx
 * - /apps/storybook/stories/Grid.stories.tsx
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';

export interface GridSpanProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Number of columns to span, or 'full' to span all columns.
   * - Number: `grid-column: span N`
   * - 'full': `grid-column: 1 / -1` (spans entire row)
   */
  columns?: number | 'full';

  /**
   * Number of rows to span.
   * Sets `grid-row: span N`.
   */
  rows?: number;

  /**
   * Content to render inside the grid span.
   */
  children?: ReactNode;
}

const baseStyles = {
  // Base styles for grid item: `min-w-0` prevents overflow in grid; `grid` +
  // `h-full` make the span fill its grid cell and stretch children.
  span: 'min-w-0 grid h-full',
} as const;

/**
 * Grid span component for controlling how many columns/rows a grid item spans.
 *
 * Use as a direct child of Grid to make an item span multiple columns
 * or rows.
 *
 * @example
 * ```
 * <Grid columns={3} gap={4}>
 *   <GridSpan columns={2}>Wide item</GridSpan>
 *   <div>Normal</div>
 * </Grid>
 * ```
 */
export function GridSpan({
  columns,
  rows,
  className,
  style,
  children,
  ref,
  ...props
}: GridSpanProps) {
  // Build inline style for grid spanning
  const inlineStyle: React.CSSProperties = {
    ...(columns != null && {
      gridColumn: columns === 'full' ? '1 / -1' : `span ${columns}`,
    }),
    ...(rows != null && {
      gridRow: `span ${rows}`,
    }),
  };

  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('grid-span'),
        {className: baseStyles.span},
        className,
        {...style, ...inlineStyle},
      )}
      {...props}>
      {children}
    </div>
  );
}

GridSpan.displayName = 'GridSpan';
