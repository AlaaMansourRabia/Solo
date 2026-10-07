/**
 * @file table.styles.ts
 * @input Theme tokens (Tailwind classes)
 * @output Shared table styles used by TableCell, TableHeaderCell, TableRow
 * @position Utility styles; consumed by cell and row components
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Table/TableCell.tsx
 * - /packages/core/src/Table/TableHeaderCell.tsx
 * - /packages/core/src/Table/TableRow.tsx
 */

/**
 * Scoped group name for table row ancestor selectors.
 *
 * Applied to each `<tr>` via TableRow so that cell-level
 * `group-last/table-row:` variants only match
 * the parent row — not other ancestors like `<tbody>` or `<table>`.
 */
export const tableRowMarker = 'group/table-row';

/**
 * Overflow truncation for table cells.
 *
 * Applied at the <td>/<th> level when textOverflow is 'truncate'.
 * For data-driven tables in truncate mode, the default renderer wraps
 * content in <Text maxLines={1}> for smart tooltips that only appear
 * when text is actually overflowing.
 */
export const overflowStyles = {
  cell: 'overflow-hidden text-ellipsis whitespace-nowrap max-w-0',
} as const;

/**
 * Wrap styles for table cells.
 *
 * Applied at the <td>/<th> level when textOverflow is 'wrap'.
 * Text wraps naturally and the row grows taller to fit. No content is hidden.
 */
export const wrapStyles = {
  cell: 'overflow-hidden wrap-break-word [word-break:break-word] max-w-0',
} as const;

/**
 * Container edge compensation for table cells.
 *
 * When a table is inside a Card, Section, or Layout area, the table
 * element applies negative inline margins to bleed edge-to-edge
 * (see Table.tsx containerBleed style). These styles ensure the
 * first and last columns' outer padding aligns with the container's
 * content inset, with a minimum of --spacing-2 (8px).
 *
 * Each density variant uses its own paddingInline as the fallback,
 * so standalone tables (where --container-padding-inline-start/end are unset)
 * keep their normal density-based cell padding unchanged.
 */
export const containerEdgeStyles = {
  compact:
    'first:ps-[max(var(--container-padding-inline-start,var(--spacing-2)),var(--spacing-2))] last:pe-[max(var(--container-padding-inline-end,var(--spacing-2)),var(--spacing-2))]',
  balanced:
    'first:ps-[max(var(--container-padding-inline-start,var(--spacing-3)),var(--spacing-2))] last:pe-[max(var(--container-padding-inline-end,var(--spacing-3)),var(--spacing-2))]',
  spacious:
    'first:ps-[max(var(--container-padding-inline-start,var(--spacing-4)),var(--spacing-2))] last:pe-[max(var(--container-padding-inline-end,var(--spacing-4)),var(--spacing-2))]',
} as const;
