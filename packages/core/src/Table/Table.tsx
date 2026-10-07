'use client';

/**
 * @file Table.tsx
 * @input React, Tailwind classes, BaseTable, theme tokens, types, components
 * @output Exports Table component, TableProps, TableDensity, TableDividers types
 * @position Styled wrapper; the primary table API for consumers
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Table/Table.doc.mjs (props table, features, usage examples)
 * - /packages/core/src/Table/Table.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/Table/__tests__/TableScroll.a11y.chromium.spec.ts (browser scroll behavior)
 * - /packages/core/src/Table/index.ts (exports if types change)
 * - /apps/storybook/stories/Table.stories.tsx (storybook stories)
 */

import {useMemo, type ReactElement, type Ref} from 'react';
import {BaseTable} from './BaseTable';
import {TableContext} from './TableContext';
import {useBaseTablePlugins} from './useBaseTablePlugins';
import {useScrollableArea} from '../hooks/useScrollableArea';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';
import type {
  BaseTableProps,
  TableVerticalAlign,
  TablePlugin,
  TableRenderProps,
} from './types';
import {useTranslator} from '../i18n';

// =============================================================================
// Table Types
// =============================================================================

/** Row density controlling padding and font size */

export type TableDensity = 'compact' | 'balanced' | 'spacious';

/** Divider style between cells */

export type TableDividers = 'rows' | 'columns' | 'grid' | 'none';

/** How body cell text behaves when it exceeds column width */

export type TableTextOverflow = 'wrap' | 'truncate';

/**
 * Props for the styled Table component.
 * Supports both data-driven mode and children mode with TableRow/Cell.
 *
 * @template T - The row data type
 */

export interface TableProps<T extends Record<string, unknown>> extends Omit<
  BaseTableProps<T>,
  'plugins' | 'components'
> {
  /** Row density. @default 'balanced' */
  density?: TableDensity;
  /** Divider style. @default 'rows' */
  dividers?: TableDividers;
  /** Striped even rows. @default false */
  isStriped?: boolean;
  /** Hover highlight on rows. @default false */
  hasHover?: boolean;
  /**
   * Vertical alignment for body row cells.
   * Controls `vertical-align` on `<td>` elements.
   *
   * @default 'middle'
   *
   * @example
   * ```
   * <Table data={items} columns={columns} verticalAlign="top" />
   * ```
   */
  verticalAlign?: TableVerticalAlign;
  /**
   * How body cell text behaves when it exceeds the column width.
   *
   * - `'wrap'` — text wraps and the row grows taller. No content is hidden.
   * - `'truncate'` — text is clipped with an ellipsis. Default-rendered cells
   *   show a tooltip on hover when truncated.
   *
   * Header cells always truncate regardless of this setting.
   *
   * @default 'wrap'
   *
   * @example
   * ```
   * <Table data={logs} columns={columns} textOverflow="wrap" />
   * ```
   */
  textOverflow?: 'wrap' | 'truncate';
  /** Named plugins to extend table behavior */
  plugins?: Record<string, TablePlugin<T>>;
}

// =============================================================================
// Styles (table-level only; cell/row/header styles owned by components)
// =============================================================================

const tableStyles = {
  base: '[font-family:inherit] text-(--color-text-primary)',
} as const;

const scrollWrapperStyles = {
  base: 'overflow-x-auto [-webkit-overflow-scrolling:touch]',
  containerBleed: cn(
    'ms-[calc(-1*var(--container-padding-inline-start,0px))]',
    'me-[calc(-1*var(--container-padding-inline-end,0px))]',
    'w-[calc(100%+var(--container-padding-inline-start,0px)+var(--container-padding-inline-end,0px))]',
    'first:mt-[calc(-1*var(--container-padding-block-start,0px))]',
    'last:mb-[calc(-1*var(--container-padding-block-end,0px))]',
  ),
} as const;

function TableScrollWrapper({
  children,
  htmlProps,
  className: pluginClassName,
  beforeTable,
  afterTable,
}: {
  children: React.ReactNode;
  htmlProps?: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
  };
  className?: string;
  beforeTable?: React.ReactNode;
  afterTable?: React.ReactNode;
}) {
  const t = useTranslator();
  const label = t('@solo.table.label');
  const {getViewportProps, getContentProps, state} = useScrollableArea({
    axis: 'inline',
    keyboardAccess: {owner: 'content'},
    overscroll: 'contain',
  });
  const {ref, ...restHtmlProps} = htmlProps ?? {};
  const viewportProps = getViewportProps<HTMLDivElement>({
    role: 'group',
    'aria-label': label,
    ...(state.inline.isScrollable ? {tabIndex: 0} : {}),
    ...restHtmlProps,
    ref,
    ...mergeProps(
      themeProps('table-scroll-wrapper'),
      {
        className: cn(
          scrollWrapperStyles.base,
          scrollWrapperStyles.containerBleed,
          pluginClassName,
        ),
      },
    ),
  });

  return (
    <div {...viewportProps}>
      <div {...getContentProps<HTMLDivElement>()}>
        {beforeTable}
        {children}
        {afterTable}
      </div>
    </div>
  );
}

// =============================================================================
// Table-level styling plugin (only transforms the <table> element)
// =============================================================================

function buildTableStylePlugin<
  T extends Record<string, unknown>,
>(): TablePlugin<T> {
  return {
    transformTable(props: TableRenderProps): TableRenderProps {
      // The `solo-table` class itself comes from BaseTable, which renders
      // the <table> element and now names it `table` (with `base-table` as its
      // legacy name). Adding it here too would put the token on twice.
      return {
        ...props,
        className: [...props.className, tableStyles.base],
      };
    },
  };
}

// =============================================================================
// Table Component
// =============================================================================

function TableInner<T extends Record<string, unknown>>({
  density = 'balanced',
  dividers = 'rows',
  isStriped = false,
  hasHover = false,
  verticalAlign = 'middle',
  textOverflow = 'wrap',
  plugins: userPlugins,
  columns,
  data,
  ref,
  ...rest
}: TableProps<T> & {ref?: Ref<HTMLTableElement>}): ReactElement {
  // Table-level styling plugin (just adds font/color to <table>)
  const tablePlugin = useMemo(() => buildTableStylePlugin<T>(), []);
  const basePlugins = useMemo(() => [tablePlugin], [tablePlugin]);

  // Convert named plugin record to stable memoized array
  const mergedPlugins = useBaseTablePlugins<T>(basePlugins, userPlugins);

  const contextValue = useMemo(
    () => ({
      density,
      dividers,
      isStriped,
      hasHover,
      verticalAlign,
      textOverflow,
    }),
    [density, dividers, isStriped, hasHover, verticalAlign, textOverflow],
  );

  return (
    <TableContext value={contextValue}>
      <BaseTable<T>
        ref={ref}
        data={data}
        columns={columns}
        plugins={mergedPlugins}
        textOverflow={textOverflow}
        scrollWrapper={TableScrollWrapper}
        {...rest}
      />
    </TableContext>
  );
}

/**
 * Table — a styled, data-driven table component.
 *
 * Wraps BaseTable with styled components (TableRow, TableCell,
 * TableHeaderCell) that read appearance configuration from TableContext.
 * Density, dividers, striped rows, and hover effects are applied via
 * design tokens in the component styles.
 *
 * @compositionHint Use renderCell on columns to compose rich cell content.
 * Combine with Badge (status labels), StatusDot (colored indicators),
 * Text (formatted values), Avatar (user cells), and HStack/VStack
 * (multi-element cell layouts). Without renderCell, cells render as plain text.
 * Always set explicit width on columns using proportional() or pixel() — omitting
 * width skips the minimum width floor, which can cause columns to collapse on mobile.
 *
 * @example
 * ```
 * <Table
 *   data={users}
 *   columns={[
 *     { key: 'name', header: 'Name', width: proportional(1), renderCell: (u) => (
 *       <HStack gap={2} align="center">
 *         <Avatar name={u.name} size="md" />
 *         <Text weight="semibold">{u.name}</Text>
 *       </HStack>
 *     )},
 *     { key: 'status', header: 'Status', width: proportional(1), renderCell: (u) => (
 *       <Badge variant={u.active ? 'success' : 'error'} label={u.active ? 'Active' : 'Inactive'} />
 *     )},
 *   ]}
 *   density="compact"
 *   dividers="grid"
 *   hasHover
 * />
 * ```
 */
export const Table = TableInner as <T extends Record<string, unknown>>(
  props: TableProps<T> & {ref?: Ref<HTMLTableElement>},
) => ReactElement;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Table as any).displayName = 'Table';
