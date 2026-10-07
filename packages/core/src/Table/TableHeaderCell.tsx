'use client';

/**
 * @file TableHeaderCell.tsx
 * @input React, Tailwind classes, TableContext, theme tokens, useTableCellStyles
 * @output Exports TableHeaderCell component, TableHeaderCellProps
 * @position Sub-component; used inside Table for header cells
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Table/Table.doc.mjs
 * - /packages/core/src/Table/index.ts
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import type {TableContextActions} from './types';
import {overflowStyles, containerEdgeStyles} from './table.styles';
import {useTableContext} from './useTableCellStyles';
import {wrapInTableContextMenu} from './tableContextMenu';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';

/** Props for TableHeaderCell — `<th>` wrapper with context-aware styling */
export interface TableHeaderCellProps extends BaseProps<HTMLTableCellElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLTableCellElement>;
  /** Specifies which cells this header relates to. */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
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
    'py-(--spacing-1) px-(--spacing-2) text-(length:--text-label-size) box-border',
  balanced:
    'py-(--spacing-2) px-(--spacing-3) text-(length:--text-label-size) box-border',
  spacious:
    'py-(--spacing-3) px-(--spacing-4) text-(length:--text-label-size) box-border',
} as const;

const headerStyles = {
  cell: 'font-(number:--font-weight-semibold) text-(--color-text-secondary) text-start',
} as const;

const headerDividerStyles = {
  cell: '[border-bottom-width:var(--border-width)] [border-bottom-style:solid] [border-bottom-color:var(--color-border)]',
} as const;

const dividerColumnStyles = {
  cell: cn(
    '[border-inline-end-width:var(--border-width)] last:[border-inline-end-width:0]',
    '[border-inline-end-style:solid] [border-inline-end-color:var(--color-border)]',
  ),
} as const;

/**
 * TableHeaderCell — a `<th>` wrapper for header cells.
 *
 * When used inside `<Table>`, inherits styling from the table context
 * (density padding, header font weight/color, divider borders).
 * When used standalone, renders a plain `<th>`.
 *
 * Accepts `className` for plugin-provided classes that merge on top.
 *
 * @example
 * ```
 * <thead>
 *   <tr>
 *     <TableHeaderCell>Name</TableHeaderCell>
 *     <TableHeaderCell>Age</TableHeaderCell>
 *   </tr>
 * </thead>
 * ```
 */
export function TableHeaderCell({
  children,
  ref,
  className: incomingClassName,
  style: incomingStyle,
  contextMenuActions,
  ...props
}: TableHeaderCellProps) {
  const ctx = useTableContext();

  // Header cells always get the bottom divider (separates header from body).
  // When used standalone (no table context) the cell renders plain, with no
  // density/divider styles.
  const cellStyles: string[] = [];
  if (ctx) {
    cellStyles.push(
      headerStyles.cell,
      densityStyles[ctx.density],
      headerDividerStyles.cell,
      overflowStyles.cell,
      containerEdgeStyles[ctx.density],
    );
    // Column dividers come from the shared builder (column axis only).
    if (ctx.dividers === 'columns' || ctx.dividers === 'grid') {
      cellStyles.push(dividerColumnStyles.cell);
    }
  }

  // The cell owns the context-menu wrapper so it controls how the menu
  // interacts with its padding / content. No-op when no actions.
  const content = wrapInTableContextMenu(children, contextMenuActions);

  return (
    <th
      ref={ref}
      {...props}
      {...mergeProps(
        themeProps('table-header-cell', {density: ctx?.density}),
        {className: cn(...cellStyles)},
        incomingClassName,
        incomingStyle,
      )}>
      {content}
    </th>
  );
}

TableHeaderCell.displayName = 'TableHeaderCell';
