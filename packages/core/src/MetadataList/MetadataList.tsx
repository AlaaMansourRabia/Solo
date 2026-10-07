'use client';

/**
 * @file MetadataList.tsx
 * @input Uses React, ReactNode, Tailwind classes, theme tokens, MetadataListContext, i18n (useTranslator)
 * @output Exports MetadataList component, MetadataListProps, MetadataListColumns types
 * @position Core implementation; consumed by index.ts, tested by MetadataList.test.tsx
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/MetadataList/MetadataList.doc.mjs
 * - /packages/core/src/MetadataList/MetadataList.test.tsx
 * - /packages/core/src/MetadataList/index.ts
 * - /apps/storybook/stories/MetadataList.stories.tsx
 */

import {Children, useId, useMemo, useState, type ReactNode} from 'react';
import {
  MetadataListContext,
  type MetadataListLabelConfig,
} from './MetadataListContext';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';

// =============================================================================
// Types
// =============================================================================

export type MetadataListColumns = 'multi' | 'single' | number;

export interface MetadataListProps extends Omit<
  BaseProps<HTMLDivElement>,
  'title'
> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Metadata list items. Should be MetadataListItem components.
   */
  children: ReactNode;
  /**
   * Column layout mode.
   * - 'single': Items in a single column
   * - 'multi': Auto-fill columns based on available width
   * - number: Fixed number of columns
   * @default 'single'
   */
  columns?: MetadataListColumns;
  /**
   * Label display configuration.
   * - position: 'start' places labels to the left, 'top' stacks labels above content
   * - width: Custom label width (number in px or CSS string)
   *
   * Defaults to `{ position: 'top' }` for multi-column layouts and
   * `{ position: 'start' }` for single-column layouts.
   */
  label?: MetadataListLabelConfig;
  /**
   * Maximum number of items to show before collapsing.
   * When set and items exceed this count, a "Show more" / "Show less"
   * toggle appears.
   */
  maxNumOfItems?: number;
  /**
   * Layout orientation for metadata items.
   * - 'vertical': Items stack vertically (default)
   * - 'horizontal': Items flow horizontally with flex-wrap
   *
   * In horizontal mode, items display with labels stacked above content
   * and wrap to new lines as needed. The following props are ignored:
   * `columns`, `label`, `maxNumOfItems`.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Optional title or heading rendered above the list.
   */
  title?: ReactNode;
  /**
   * Test ID for testing frameworks.
   */
  'data-testid'?: string;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: 'flex flex-col',
  title: 'mb-(--spacing-3)',
  // dl reset
  dl: 'm-0 p-0',
  // Vertical orientation — grid layout for label-value pairs
  gridSingle:
    'grid [grid-template-columns:auto_minmax(0,1fr)] gap-[var(--spacing-2)_var(--spacing-4)] items-baseline',
  gridMulti:
    'grid [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] gap-(--spacing-4)',
  // Stacked labels (position: 'top') within a single-column layout
  gridStackedSingle: 'grid [grid-template-columns:1fr] gap-(--spacing-3)',
  gridStackedMulti:
    'grid [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] gap-(--spacing-4)',
  // Horizontal orientation — flex row with wrapping
  horizontal: 'flex flex-row flex-wrap gap-(--spacing-4)',
  // Show more/less button
  toggleButton: cn(
    'appearance-none bg-transparent [border-width:0] [border-style:none]',
    'p-[var(--spacing-2)_0]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'text-(--color-accent) text-(length:--text-body-size) leading-(--text-body-leading)',
    'font-(number:--font-weight-medium) [font-family:inherit] text-start self-start',
  ),
} as const;

// A fixed numeric column count (and a custom label width) is only known at
// runtime, so it travels through a scoped custom property read by a static
// class.
const dynamicStyles = {
  gridTemplate: '[grid-template-columns:var(--_metadata-list-columns)]',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * A read-only labeled list for displaying key-value metadata.
 *
 * Renders semantic `<dl>` / `<dt>` / `<dd>` elements. Supports multiple
 * column layouts, horizontal orientation, and show more/less collapsing.
 *
 * @example
 * ```
 * <MetadataList columns="multi">
 *   <MetadataListItem label="Name">MetadataList</MetadataListItem>
 *   <MetadataListItem label="Status">Active</MetadataListItem>
 * </MetadataList>
 * ```
 */
const LABEL_START: MetadataListLabelConfig = {position: 'start'};
const LABEL_TOP: MetadataListLabelConfig = {position: 'top'};

export function MetadataList({
  children,
  columns = 'single',
  label,
  maxNumOfItems,
  orientation = 'vertical',
  title,
  className,
  style,
  'data-testid': testId,
  ref,
}: MetadataListProps) {
  const isMultiColumn =
    columns === 'multi' || (typeof columns === 'number' && columns > 1);
  // Default to 'top' for multi-column and horizontal layouts since side labels
  // don't work well when items are in separate grid cells.
  const labelConfig = label ?? (isMultiColumn ? LABEL_TOP : LABEL_START);
  const [isShowAll, setIsShowAll] = useState(false);
  const contentId = useId();
  const t = useTranslator();

  const contextValue = useMemo(
    () => ({
      labelConfig: orientation === 'horizontal' ? LABEL_TOP : labelConfig,
      orientation,
    }),
    [labelConfig, orientation],
  );

  const childrenArray = Children.toArray(children);
  const isHorizontal = orientation === 'horizontal';

  // In horizontal mode, ignore maxNumOfItems
  const effectiveMax = isHorizontal ? undefined : maxNumOfItems;
  const isExceedMax =
    effectiveMax != null && childrenArray.length > effectiveMax;
  const visibleChildren =
    isExceedMax && !isShowAll
      ? childrenArray.slice(0, effectiveMax)
      : childrenArray;

  const titleContent =
    title != null ? <div className={styles.title}>{title}</div> : null;

  // Determine grid style based on columns and label position
  const getGridStyle = () => {
    if (isHorizontal) {
      return styles.horizontal;
    }
    const isStacked = labelConfig.position === 'top';
    if (isStacked) {
      return columns === 'single' || columns === 1
        ? styles.gridStackedSingle
        : styles.gridStackedMulti;
    }
    // Labels on the left
    if (columns === 'single' || columns === 1) {
      return styles.gridSingle;
    }
    return styles.gridMulti;
  };

  // The grid template for a fixed numeric column count, or for a custom label
  // width. Both are runtime values, so they resolve to a dynamic style below.
  // The track shape depends on the label position: stacked labels put a whole
  // item in one cell, while side labels split each item into a label track and
  // a value track.
  const getGridTemplateColumns = () => {
    if (isHorizontal) {
      return null;
    }
    const isStacked = labelConfig.position === 'top';
    if (typeof columns === 'number' && columns > 1) {
      return isStacked
        ? `repeat(${columns}, 1fr)`
        : `repeat(${columns}, auto minmax(0, 1fr))`;
    }
    // A custom label width only applies to the label track of side labels.
    if (!isStacked && labelConfig.width != null) {
      const width =
        typeof labelConfig.width === 'number'
          ? `${labelConfig.width}px`
          : labelConfig.width;
      return `${width} minmax(0, 1fr)`;
    }
    return null;
  };
  const gridTemplateColumns = getGridTemplateColumns();

  return (
    <MetadataListContext value={contextValue}>
      <div
        ref={ref}
        data-testid={testId}
        {...mergeProps(
          themeProps('metadata-list', {
            columns: String(columns),
            orientation,
          }),
          {className: styles.root},
          className,
          style,
        )}>
        {titleContent}
        <dl
          id={contentId}
          className={cn(
            styles.dl,
            getGridStyle(),
            gridTemplateColumns != null && dynamicStyles.gridTemplate,
          )}
          style={
            gridTemplateColumns != null
              ? ({
                  '--_metadata-list-columns': gridTemplateColumns,
                } as React.CSSProperties)
              : undefined
          }>
          {visibleChildren}
        </dl>
        {isExceedMax && (
          <button
            type="button"
            aria-controls={contentId}
            aria-expanded={isShowAll}
            onClick={() => setIsShowAll(prev => !prev)}
            className={styles.toggleButton}>
            {isShowAll
              ? t('@solo.metadataList.showLess')
              : t('@solo.metadataList.showMore')}
          </button>
        )}
      </div>
    </MetadataListContext>
  );
}

MetadataList.displayName = 'MetadataList';
