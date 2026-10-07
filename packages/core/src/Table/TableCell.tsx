'use client';

/**
 * @file TableCell.tsx
 * @input React, Tailwind classes, TableContext, theme tokens, useTableCellStyles
 * @output Exports TableCell component, TableCellProps
 * @position Sub-component; used inside Table children mode
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Table/Table.doc.mjs
 * - /packages/core/src/Table/index.ts
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import type {TableContextActions} from './types';
import {wrapInTableContextMenu} from './tableContextMenu';
import {
  overflowStyles,
  wrapStyles,
  containerEdgeStyles,
} from './table.styles';
import {useTableContext, buildDividerStyles} from './useTableCellStyles';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';

/** Props for TableCell — thin `<td>` wrapper */
export interface TableCellProps extends BaseProps<HTMLTableCellElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLTableCellElement>;
  /** Specifies which cells this cell relates to (used on `<td>` acting as a row header). */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
  /** Space-separated list of header cell IDs this cell is described by. */
  headers?: string;
  /** Number of columns this cell spans. Standard HTML `<td>` attribute. */
  colSpan?: number;
  /** Number of rows this cell spans. Standard HTML `<td>` attribute. */
  rowSpan?: number;
  children?: ReactNode;
  /**
   * Right-click actions rendered as a context menu around the cell content.
   * The cell owns the wrapper so it controls how the menu interacts with its
   * padding / content. Empty or undefined renders no menu.
   */
  contextMenuActions?: TableContextActions;
}

const densityStyles = {
  compact:
    'py-(--spacing-1) px-(--spacing-2) text-(length:--text-body-size) box-border',
  balanced:
    'py-(--spacing-2) px-(--spacing-3) text-(length:--text-body-size) box-border',
  spacious:
    'py-(--spacing-3) px-(--spacing-4) text-(length:--text-body-size) box-border',
} as const;

// When a cell owns a context menu, its padding moves from the `<td>` onto the
// right-click trigger wrapper so the *entire* cell (padding included) opens the
// menu. Without this, right-clicking the padding ring near a cell edge falls
// through to the browser's native menu. Paired with `contextMenuCellStyles` on
// the `<td>` (font/box-sizing only — no padding).
const densityTextStyles = {
  compact: 'text-(length:--text-body-size) box-border',
  balanced: 'text-(length:--text-body-size) box-border',
  spacious: 'text-(length:--text-body-size) box-border',
} as const;

const densityPaddingStyles = {
  compact: 'py-(--spacing-1) px-(--spacing-2)',
  balanced: 'py-(--spacing-2) px-(--spacing-3)',
  spacious: 'py-(--spacing-3) px-(--spacing-4)',
} as const;

// The trigger wrapper fills the whole cell (a `<td>` child with height:100%
// stretches to the row height) so a right-click anywhere in the cell opens the
// menu. It carries the density padding relocated off the `<td>`.
const triggerFillStyles = {
  fill: 'block box-border [block-size:100%] [inline-size:100%]',
} as const;

// `height:100%` on the `<td>` is the CSS trick that lets a block child resolve
// its own `height:100%` against the row height — so the trigger fills the cell
// vertically (top/bottom padding included) and is fully right-clickable.
const contextMenuCellStyles = {
  cell: '[block-size:100%]',
} as const;

const dividerRowStyles = {
  cell: cn(
    '[border-bottom-width:var(--border-width)]',
    // Skip border on cells in the last body row to avoid a
    // redundant line at the bottom of the table.
    // Scoped to tableRowMarker so only the parent <tr> is checked —
    // without the scope, <tbody> (also a :last-child) would match
    // and suppress borders on every row.
    'group-last/table-row:[border-bottom-width:0]',
    '[border-bottom-style:solid] [border-bottom-color:var(--color-border)]',
  ),
} as const;

const dividerColumnStyles = {
  cell: cn(
    '[border-inline-end-width:var(--border-width)] last:[border-inline-end-width:0]',
    '[border-inline-end-style:solid] [border-inline-end-color:var(--color-border)]',
  ),
} as const;

const verticalAlignStyles = {
  middle: 'align-middle',
  top: 'align-top',
  bottom: 'align-bottom',
} as const;

/**
 * TableCell — a `<td>` wrapper for children/streaming mode.
 *
 * When used inside `<Table>`, inherits styling from the table context
 * (density padding, divider borders). When used standalone, renders a plain `<td>`.
 *
 * @example
 * ```
 * <TableRow>
 *   <TableCell>Alice</TableCell>
 *   <TableCell>30</TableCell>
 * </TableRow>
 * ```
 */
export function TableCell({
  children,
  ref,
  className: incomingClassName,
  style: incomingStyle,
  contextMenuActions,
  ...props
}: TableCellProps) {
  const ctx = useTableContext();

  const hasContextMenu =
    typeof contextMenuActions === 'function' ||
    (Array.isArray(contextMenuActions) && contextMenuActions.length > 0);

  // When the cell owns a context menu, its density padding is relocated onto
  // the right-click trigger wrapper (see `content` below) so the entire cell —
  // padding included — opens the menu. Otherwise padding lives on the `<td>`.
  const cellStyles: string[] = ctx
    ? [
        hasContextMenu
          ? densityTextStyles[ctx.density]
          : densityStyles[ctx.density],
        ctx.textOverflow === 'truncate' ? overflowStyles.cell : wrapStyles.cell,
        containerEdgeStyles[ctx.density],
        verticalAlignStyles[ctx.verticalAlign],
        ...buildDividerStyles(
          ctx,
          dividerRowStyles.cell,
          dividerColumnStyles.cell,
        ),
        ...(hasContextMenu ? [contextMenuCellStyles.cell] : []),
      ]
    : [];

  // The cell owns the context-menu wrapper so it controls how the menu
  // interacts with its padding / content. No-op when no actions. When actions
  // exist we make the trigger fill the cell and carry the density padding so a
  // right-click anywhere in the cell (including the padding ring) opens it.
  const triggerClassName =
    hasContextMenu && ctx
      ? cn(triggerFillStyles.fill, densityPaddingStyles[ctx.density])
      : hasContextMenu
        ? triggerFillStyles.fill
        : undefined;
  const content = wrapInTableContextMenu(
    children,
    contextMenuActions,
    triggerClassName,
  );

  return (
    <td
      ref={ref}
      {...props}
      {...mergeProps(
        themeProps('table-cell', {density: ctx?.density}),
        {className: cn(...cellStyles)},
        incomingClassName,
        incomingStyle,
      )}>
      {content}
    </td>
  );
}

TableCell.displayName = 'TableCell';
