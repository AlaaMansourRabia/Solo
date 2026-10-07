'use client';

/**
 * @file MetadataListItem.tsx
 * @input Uses React, ReactNode, Tailwind classes, theme tokens, MetadataListContext
 * @output Exports MetadataListItem component, MetadataListItemProps type
 * @position Core implementation; consumed by MetadataList, index.ts
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/MetadataList/MetadataList.doc.mjs
 * - /packages/core/src/MetadataList/MetadataList.test.tsx
 * - /packages/core/src/MetadataList/index.ts
 * - /apps/storybook/stories/MetadataList.stories.tsx
 */

import {use, type ReactNode} from 'react';
import {MetadataListContext} from './MetadataListContext';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';

// =============================================================================
// Types
// =============================================================================

export interface MetadataListItemProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Content value for this metadata item.
   */
  children: ReactNode;
  /**
   * Icon rendered before the label text.
   */
  icon?: ReactNode;
  /**
   * Label text for this metadata item.
   */
  label: string;
  /**
   * Test ID for testing frameworks.
   */
  'data-testid'?: string;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  // Label (dt) — inline (side-by-side with value)
  label: cn(
    'text-(--color-text-secondary) text-(length:--text-body-size) leading-(--text-body-leading)',
    'font-(number:--font-weight-medium) flex items-center gap-(--spacing-2)',
    'm-0 p-0 min-h-[24px] [word-break:break-word]',
  ),
  // Value (dd) — inline
  value: cn(
    'text-(--color-text-primary) text-(length:--text-body-size) leading-(--text-body-leading)',
    'm-0 p-0 min-h-[24px] [word-break:break-word]',
  ),
  // Stacked layout wrapper (label on top)
  stackedWrapper: 'flex flex-col gap-(--spacing-0-5)',
  // Stacked label
  stackedLabel: cn(
    'text-(--color-text-secondary) text-(length:--text-body-size) leading-(--text-body-leading)',
    'font-(number:--font-weight-medium) flex items-center gap-(--spacing-2)',
    'm-0 p-0',
  ),
  stackedValue: cn(
    'text-(--color-text-primary) text-(length:--text-body-size) leading-(--text-body-leading)',
    'm-0 p-0 [word-break:break-word]',
  ),
  iconWrapper: 'inline-flex items-center shrink-0 text-(--color-text-secondary)',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * A single labeled metadata value within an MetadataList.
 *
 * Renders a `<dt>` / `<dd>` pair. Layout (side-by-side or stacked) is
 * determined by the parent MetadataList's label configuration.
 *
 * @example
 * ```
 * <MetadataListItem label="Status">Active</MetadataListItem>
 * <MetadataListItem label="Created" icon={<CalendarIcon />}>
 *   January 1, 2023
 * </MetadataListItem>
 * ```
 */
export function MetadataListItem({
  children,
  icon,
  label,
  className,
  style,
  'data-testid': testId,
  ref,
  ...rest
}: MetadataListItemProps) {
  const ctx = use(MetadataListContext);
  const labelPosition = ctx?.labelConfig.position ?? 'start';
  const isStacked =
    labelPosition === 'top' || ctx?.orientation === 'horizontal';

  const labelContent = (
    <>
      {icon != null && (
        <span className={styles.iconWrapper}>{icon}</span>
      )}
      {label}
    </>
  );

  // Stacked layout: label above content, wrapped in a div
  if (isStacked) {
    return (
      <div
        ref={ref}
        data-testid={testId}
        {...mergeProps(
          themeProps('metadata-list-item'),
          {className: styles.stackedWrapper},
          className,
          style,
        )}
        {...rest}>
        <dt className={styles.stackedLabel}>{labelContent}</dt>
        <dd className={styles.stackedValue}>{children}</dd>
      </div>
    );
  }

  // Inline layout: dt and dd are direct grid children
  return (
    <>
      <dt
        ref={ref}
        data-testid={testId ? `${testId}-label` : undefined}
        {...mergeProps(
          themeProps('metadata-list-item'),
          {className: styles.label},
          className,
          style,
        )}
        {...rest}>
        {labelContent}
      </dt>
      <dd
        data-testid={testId ? `${testId}-value` : undefined}
        className={styles.value}>
        {children}
      </dd>
    </>
  );
}

MetadataListItem.displayName = 'MetadataListItem';
