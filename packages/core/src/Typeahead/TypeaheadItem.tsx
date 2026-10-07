/**
 * @file TypeaheadItem.tsx
 * @input Uses React, Tailwind classes, SearchableItem
 * @output Exports TypeaheadItem component for rendering dropdown items
 * @position Presentational component; used as default renderItem in BaseTypeahead
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Typeahead/index.ts
 */

import React, {type ReactNode} from 'react';
import type {SearchableItem} from './types';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

// =============================================================================
// Types
// =============================================================================

export interface TypeaheadItemProps<
  T extends SearchableItem = SearchableItem,
> extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /**
   * The search result item.
   */
  item: T;

  /**
   * Icon or avatar to display before the label.
   */
  icon?: ReactNode;

  /**
   * Description text displayed below the label.
   */
  description?: string;

  /**
   * Whether this item is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Group label for grouping items visually.
   */
  group?: string;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  container: 'flex items-center gap-(--spacing-2) min-h-0',
  content: 'flex flex-col flex-1 min-w-0',
  label: cn(
    'text-(length:--text-label-size) leading-(--text-label-leading) font-(number:--font-weight-normal)',
    'text-(--color-text-primary) overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  description: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary) overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  disabled: 'opacity-50',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * Default item component for typeahead dropdown results.
 *
 * Renders a label with optional icon and description.
 * Exported for use in custom `renderItem` implementations.
 *
 * @example
 * ```
 * <Typeahead searchSource={source} value={v} onChange={setV} label="Search" />
 * <Typeahead
 *   searchSource={source}
 *   value={v}
 *   onChange={setV}
 *   label="Search"
 *   renderItem={(item) => (
 *     <TypeaheadItem
 *       item={item}
 *       icon={<Avatar src={item.auxiliaryData.avatar} size="sm" />}
 *       description={item.auxiliaryData.role}
 *     />
 *   )}
 * />
 * ```
 */
export function TypeaheadItem<T extends SearchableItem>({
  ref,
  item,
  icon,
  description,
  isDisabled = false,
  group: _group,
  className,
  style,
  ...rest
}: TypeaheadItemProps<T>) {
  // If item has a pre-rendered element, use it
  if (item.element) {
    return <>{item.element}</>;
  }

  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('typeahead-item'),
        {className: cn(styles.container, isDisabled && styles.disabled)},
        className,
        style,
      )}
      {...rest}>
      {icon}
      <div className={styles.content}>
        <span className={styles.label}>{item.label}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </div>
    </div>
  );
}

TypeaheadItem.displayName = 'TypeaheadItem';
