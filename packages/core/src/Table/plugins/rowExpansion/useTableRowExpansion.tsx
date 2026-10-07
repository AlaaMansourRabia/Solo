'use client';

/**
 * @file useTableRowExpansion.tsx
 * @input React, Tailwind classes, Icon, Table types, i18n (useTranslator)
 * @output Exports useTableRowExpansion hook + config type
 * @position Row-expansion plugin (detail panel); consumed by Table via plugins prop
 *
 * Expands a full-width detail panel below a row, rendered by the consumer's
 * `renderExpanded(item)`. For hierarchical/tree tables (child rows that reuse
 * the parent columns) use `useTableTreeData` + `useTableTreeState` instead.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Table/index.ts (exports)
 * - /packages/core/src/Table/useTableRowExpansion.doc.mjs
 */

import {useMemo, useRef, type ReactNode} from 'react';
import {cn} from '../../../utils/cn';
import {Icon} from '../../../Icon';
import {VisuallyHidden} from '../../../VisuallyHidden';
import {resolveContextActions} from '../../tableContextMenu';
import {useTranslator} from '../../../i18n';
import {rtlStyles} from '../../../utils';
import type {
  TablePlugin,
  TableColumn,
  BodyRowRenderProps,
  BodyCellRenderProps,
} from '../../types';

// =============================================================================
// Config
// =============================================================================

/**
 * Configuration for useTableRowExpansion (detail-panel mode).
 *
 * The consumer owns expansion state; the plugin provides the chevron UI, the
 * full-width detail panel rendered below an expanded row, and a right-click
 * "Expand/Collapse row" action.
 */
export interface UseTableRowExpansionConfig<T extends Record<string, unknown>> {
  /** Set of currently-expanded row keys. */
  expandedKeys: Set<string>;
  /** Called with a row key when its expansion is toggled. */
  onToggle: (key: string) => void;
  /** Derive a stable unique key from a row item. */
  getRowKey: (item: T) => string;
  /**
   * Render the detail content shown in a full-width panel below the row when
   * it is expanded. Receives the row's item.
   */
  renderExpanded: (item: T) => ReactNode;
  /**
   * Control which rows are expandable. Non-expandable rows show no chevron, no
   * context-menu action, and never render a panel. @default all rows expandable
   */
  getIsItemExpandable?: (item: T) => boolean;
}

// =============================================================================
// Styles
// =============================================================================

const EXPANSION_COLUMN_WIDTH = {type: 'pixel' as const, value: 40};

const expansionStyles = {
  chevronButton: cn(
    'inline-flex items-center justify-center w-(--spacing-6) h-(--spacing-6)',
    'bg-transparent [border-width:0] [border-style:none] rounded-(--radius-inner)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'text-(--color-icon-secondary)',
    '[transition-property:transform,color] [transition-duration:150ms]',
    'p-0',
    // Match IconButton ghost hover: subtle overlay background.
    'can-hover:hover:usable:[background-image:linear-gradient(var(--color-overlay-hover),var(--color-overlay-hover))]',
    'hover:usable:text-(--color-icon-primary)',
  ),
  // The RTL mirror is folded into each state's transform rather than living
  // on a parent span, matching TreeListItem's chevron (both are `transform`,
  // so on one element the later value would win).
  chevronExpanded:
    '[transform:rotate(90deg)] [&:is([dir=rtl]_*)]:[transform:scaleX(-1)_rotate(90deg)]',
  chevronCollapsed:
    '[transform:rotate(0deg)] [&:is([dir=rtl]_*)]:[transform:scaleX(-1)_rotate(0deg)]',
  expandedRow: 'bg-(--color-background-muted)',
  expandedCell: 'py-(--spacing-4) px-(--spacing-5)',
} as const;

// =============================================================================
// Chevron Cell
// =============================================================================

function ExpansionChevron({
  isExpanded,
  onToggle,
}: {
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslator();
  return (
    <button
      type="button"
      className={cn(
        expansionStyles.chevronButton,
        isExpanded
          ? expansionStyles.chevronExpanded
          : expansionStyles.chevronCollapsed,
      )}
      onClick={e => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={
        isExpanded
          ? t('@solo.tableRowExpansion.collapseRow')
          : t('@solo.tableRowExpansion.expandRow')
      }
      aria-expanded={isExpanded}>
      <Icon icon="chevronRight" size="xsm" />
    </button>
  );
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Returns a TablePlugin that expands a full-width detail panel below a row.
 *
 * The consumer owns the `expandedKeys` set (via `useState`); the plugin adds
 * a leading chevron column, a right-click expand/collapse action, and renders
 * `renderExpanded(item)` in a full-width panel below each expanded row.
 *
 * For hierarchical data (child rows sharing the parent columns) use
 * `useTableTreeData` + `useTableTreeState` instead.
 *
 * @example
 * ```
 * const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
 * const expansion = useTableRowExpansion({
 *   expandedKeys,
 *   onToggle: key =>
 *     setExpandedKeys(prev => {
 *       const next = new Set(prev);
 *       next.has(key) ? next.delete(key) : next.add(key);
 *       return next;
 *     }),
 *   getRowKey: item => item.id,
 *   renderExpanded: item => <OrderDetails order={item} />,
 * });
 * <Table data={data} columns={columns} idKey="id" plugins={{expansion}} />;
 * ```
 */
export function useTableRowExpansion<T extends Record<string, unknown>>(
  config: UseTableRowExpansionConfig<T>,
): TablePlugin<T> {
  const {
    expandedKeys,
    onToggle,
    getRowKey,
    renderExpanded,
    getIsItemExpandable,
  } = config;

  const t = useTranslator();

  // Final rendered column count, captured in transformColumns (pipeline step
  // 1) and read in transformBodyRow for the detail panel's colSpan.
  const columnCountRef = useRef(1);

  const expansionColumn = useMemo(
    (): TableColumn<T> => ({
      key: '__expansion',
      // A `<th>` with no discernible text is announced as an unlabelled
      // column; the label is hidden because the column shows only chevrons.
      header: (
        <VisuallyHidden>
          {t('@solo.tableRowExpansion.columnHeader')}
        </VisuallyHidden>
      ),
      width: EXPANSION_COLUMN_WIDTH,
      resizable: false,
      renderCell: (item: T) => {
        const expandable = getIsItemExpandable
          ? getIsItemExpandable(item)
          : true;
        if (!expandable) {
          return null;
        }
        const key = getRowKey(item);
        return (
          <ExpansionChevron
            isExpanded={expandedKeys.has(key)}
            onToggle={() => onToggle(key)}
          />
        );
      },
    }),
    [expandedKeys, onToggle, getRowKey, getIsItemExpandable, t],
  );

  return useMemo(
    (): TablePlugin<T> => ({
      transformColumns(columns: TableColumn<T>[]) {
        const withExpansion = [expansionColumn, ...columns];
        columnCountRef.current = withExpansion.length;
        return withExpansion;
      },

      transformBodyCell(
        props: BodyCellRenderProps,
        _column: TableColumn<T>,
        item: T,
      ): BodyCellRenderProps {
        // Contribute the expand/collapse action on every cell; BaseTable
        // aggregates them into one menu per row. Skip non-expandable rows.
        const expandable = getIsItemExpandable
          ? getIsItemExpandable(item)
          : true;
        if (!expandable) {
          return props;
        }
        const key = getRowKey(item);
        const isExpanded = expandedKeys.has(key);
        return {
          ...props,
          contextMenuActions: () => [
            ...resolveContextActions(props.contextMenuActions),
            {
              id: 'row-expansion-toggle',
              group: 'row-expansion',
              label: isExpanded
                ? t('@solo.tableRowExpansion.collapseRow')
                : t('@solo.tableRowExpansion.expandRow'),
              icon: (
                <Icon
                  icon={isExpanded ? 'chevronDown' : 'chevronRight'}
                  size="xsm"
                  aria-hidden
                  // chevronDown needs no mirroring; chevronRight (collapsed,
                  // pointing toward the reveal direction) does.
                  className={!isExpanded ? rtlStyles.mirror : undefined}
                />
              ),
              onSelect: () => onToggle(key),
            },
          ],
        };
      },

      transformBodyRow(props: BodyRowRenderProps, item: T): BodyRowRenderProps {
        const expandable = getIsItemExpandable
          ? getIsItemExpandable(item)
          : true;
        if (!expandable) {
          return props;
        }
        const key = getRowKey(item);
        if (!expandedKeys.has(key)) {
          return props;
        }

        const panel = (
          <tr
            key={`${key}-expanded`}
            className={expansionStyles.expandedRow}>
            <td
              colSpan={columnCountRef.current}
              className={expansionStyles.expandedCell}>
              {renderExpanded(item)}
            </td>
          </tr>
        );

        return {
          ...props,
          afterRow: props.afterRow ? (
            <>
              {props.afterRow}
              {panel}
            </>
          ) : (
            panel
          ),
        };
      },
    }),
    [
      expandedKeys,
      getRowKey,
      renderExpanded,
      getIsItemExpandable,
      onToggle,
      t,
      expansionColumn,
    ],
  );
}
