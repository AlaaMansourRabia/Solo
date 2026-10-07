'use client';

/**
 * @file TableRow.tsx
 * @input React, Tailwind classes, TableContext, theme tokens
 * @output Exports TableRow component, TableRowProps
 * @position Sub-component; used inside a Table section (TableHeader /
 *   TableBody / TableFooter) in children mode
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Table/Table.doc.mjs
 * - /packages/core/src/Table/index.ts
 */

import {use, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {tableRowMarker} from './table.styles';
import {TableContext} from './TableContext';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';

/** Props for TableRow — thin `<tr>` wrapper */
export interface TableRowProps extends BaseProps<HTMLTableRowElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLTableRowElement>;
  children: ReactNode;
  /**
   * Whether this row is the header row. Header rows skip the striped/hover
   * row styling (which is only meant for body rows).
   */
  isHeaderRow?: boolean;
}

const stripedRowStyles = {
  row: cn(
    'even:bg-(--color-background-muted)',
    // Publish the row's current overlay color as an inheritable variable so
    // pinned/sticky cells (which paint an opaque background over the otherwise
    // transparent row) can replay the exact same striping. Unset on odd rows.
    'even:[--table-row-overlay:var(--color-background-muted)]',
  ),
} as const;

const rowTransition = cn(
  '[transition-property:background-color]',
  '[transition-duration:var(--duration-fast)]',
  '[transition-timing-function:var(--ease-standard)]',
);

const hoverRowStyles = {
  row: cn(
    'can-hover:hover:usable:bg-(--color-overlay-hover)',
    'can-hover:hover:usable:[--table-row-overlay:var(--color-overlay-hover)]',
    rowTransition,
  ),
} as const;

const stripedHoverRowStyles = {
  row: cn(
    'even:bg-(--color-background-muted)',
    'can-hover:hover:usable:bg-(--color-overlay-hover)',
    'even:[--table-row-overlay:var(--color-background-muted)]',
    'can-hover:hover:usable:[--table-row-overlay:var(--color-overlay-hover)]',
    rowTransition,
  ),
} as const;

/**
 * TableRow — a `<tr>` wrapper for children/streaming mode.
 *
 * When used inside `<Table>`, inherits styling from the table context
 * (striped, hover, divider overrides). When used standalone, renders a plain `<tr>`.
 *
 * Rows go inside a section — `<TableBody>`, `<TableHeader>`, or
 * `<TableFooter>`. `<table>` cannot contain a `<tr>` directly: the HTML parser
 * inserts an implied `<tbody>` when it parses server-rendered markup and React
 * does not when it renders on the client, so the two trees mismatch on
 * hydration. Children mode passes children straight through, so the section is
 * the caller's to supply — the data-driven `data={...}` mode renders it for
 * you.
 *
 * @example
 * ```
 * <Table>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Alice</TableCell>
 *       <TableCell>30</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */
export function TableRow({
  children,
  ref,
  isHeaderRow = false,
  className: incomingClassName,
  style: incomingStyle,
  ...props
}: TableRowProps) {
  const ctx = use(TableContext);

  if (!ctx) {
    return (
      <tr
        ref={ref}
        {...props}
        {...mergeProps(
          themeProps('table-row'),
          {className: tableRowMarker},
          incomingClassName,
          incomingStyle,
        )}>
        {children}
      </tr>
    );
  }

  const rowStyles: string[] = [];

  // Striped + hover styling is for body rows only — the header row must not
  // pick up the hover highlight (or striping) even when hasHover/isStriped.
  if (!isHeaderRow) {
    // Handle striped + hover combination to avoid backgroundColor conflicts
    if (ctx.isStriped && ctx.hasHover) {
      rowStyles.push(stripedHoverRowStyles.row);
    } else if (ctx.isStriped) {
      rowStyles.push(stripedRowStyles.row);
    } else if (ctx.hasHover) {
      rowStyles.push(hoverRowStyles.row);
    }
  }

  if (ctx.dividers === 'rows' || ctx.dividers === 'grid') {
    // Note: last-body-row border removal is handled by TableCell
    // to avoid affecting the header row in <thead>.
  }

  return (
    <tr
      ref={ref}
      {...props}
      {...mergeProps(
        themeProps('table-row'),
        {className: cn(tableRowMarker, ...rowStyles)},
        incomingClassName,
        incomingStyle,
      )}>
      {children}
    </tr>
  );
}

TableRow.displayName = 'TableRow';
