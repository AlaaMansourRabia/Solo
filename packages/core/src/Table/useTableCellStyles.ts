'use client';

/**
 * @file useTableCellStyles.ts
 * @input React, Tailwind classes, TableContext, theme tokens
 * @output Exports shared cell styling utilities
 * @position Utility layer; consumed by TableCell and TableHeaderCell
 *
 * Consolidates the shared pattern of building divider class arrays.
 * Eliminates structural duplication
 * between body cells and header cells.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Table/TableCell.tsx
 * - /packages/core/src/Table/TableHeaderCell.tsx
 */

import {use} from 'react';
import {TableContext, type TableContextValue} from './TableContext';

// =============================================================================
// Shared Style Builders
// =============================================================================

/**
 * Build the divider styles array for a cell based on context.
 * Shared between body cells and header cells — both apply row/column
 * dividers the same way.
 */
export function buildDividerStyles(
  ctx: TableContextValue,
  dividerRowStyle: string,
  dividerColumnStyle: string,
): string[] {
  const result: string[] = [];

  if (ctx.dividers === 'rows' || ctx.dividers === 'grid') {
    result.push(dividerRowStyle);
  }

  if (ctx.dividers === 'columns' || ctx.dividers === 'grid') {
    result.push(dividerColumnStyle);
  }

  return result;
}

/**
 * Read the TableContext. Returns null when outside Table,
 * signaling that the component should render unstyled.
 */
export function useTableContext(): TableContextValue | null {
  return use(TableContext);
}
