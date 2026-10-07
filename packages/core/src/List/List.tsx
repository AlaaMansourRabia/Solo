'use client';

/**
 * @file List.tsx
 * @input Uses React, ReactNode, Tailwind classes, theme tokens, ListContext
 *   with optional inline edge compensation
 * @output Exports List component, ListProps, ListDensity, ListStyle types
 * @position Core implementation; consumed by index.ts, tested by List.test.tsx
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/List/List.doc.mjs
 * - /packages/core/src/List/List.test.tsx
 * - /packages/core/src/List/index.ts
 * - /apps/storybook/stories/List.stories.tsx
 */

import {useId, useMemo, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {
  ListContext,
  type ListDensity,
  type ListMarkerStyle,
} from './ListContext';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';

export {
  type ListDensity,
  type ListMarkerStyle as ListStyle,
} from './ListContext';

export interface ListProps extends BaseProps<
  HTMLUListElement | HTMLOListElement
> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLUListElement | HTMLOListElement>;
  /**
   * List items. Should be ListItem components.
   */
  children: ReactNode;

  /**
   * Spacing density for list items.
   * - 'compact': Tighter spacing for dense UIs
   * - 'balanced': Standard spacing
   * - 'spacious': Extra spacing for readability
   * @default 'balanced'
   */
  density?: ListDensity;

  /**
   * Whether to show dividers between list items.
   * @default false
   */
  hasDividers?: boolean;

  /**
   * Compensates for each item's built-in inline inset, up to the container
   * padding available on each edge. Use "inline" to bring row content toward
   * sibling content such as a section heading. Content aligns when the
   * container padding is at least the item inset; smaller padding leaves
   * some inset uncompensated.
   * The cancelling margin reads the same variable the items derive their
   * inline padding from, so it tracks density and theme padding overrides
   * automatically. Hover and selection backgrounds still extend past the
   * text by the inset.
   * Omit to leave item positions unchanged.
   */
  edgeCompensation?: 'inline';

  /**
   * Header content rendered above the list.
   * Semantically associated via aria-labelledby.
   */
  header?: ReactNode;

  /**
   * List marker style.
   * When 'decimal', renders an `<ol>`. Otherwise renders a `<ul>`.
   * @default 'none'
   */
  listStyle?: ListMarkerStyle;

  /**
   * Starting number for ordered lists (listStyle='decimal').
   * Sets the CSS counter to begin at this value.
   * @default 1
   */
  start?: number;

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
  list: 'm-0 ps-0 list-none flex flex-col gap-(--spacing-0-5)',
  withDividers: 'gap-0',
  withCounter: '[counter-reset:solo-list]',
  header: 'mb-(--spacing-2)',
} as const;

// The counter start is dynamic: it travels through a scoped custom property
// read by a static class.
const dynamicStyles = {
  counterStart: '[counter-reset:var(--_list-counter-reset)]',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * A vertical list component for rendering collections of items.
 *
 * Renders semantic `<ul>` or `<ol>` elements with configurable density,
 * dividers, marker styles, and an optional header.
 *
 * Set `edgeCompensation="inline"` to compensate for the items' inline inset
 * up to the container padding available on each edge, for alignment with
 * sibling content such as a section heading.
 *
 * @example
 * ```
 * <List>
 *   <ListItem label="Notifications" description="Manage your alerts" />
 *   <ListItem label="Privacy" description="Control your data" />
 * </List>
 * <List listStyle="decimal" density="compact">
 *   <ListItem label="First step" />
 *   <ListItem label="Second step" />
 * </List>
 * ```
 */
export function List({
  children,
  density = 'balanced',
  hasDividers = false,
  edgeCompensation,
  header,
  listStyle = 'none',
  start,
  className,
  style,
  'data-testid': testId,
  ref,
  ...props
}: ListProps) {
  const headerId = useId();
  const isOrdered = listStyle === 'decimal';
  const Tag = isOrdered ? 'ol' : 'ul';
  const hasCustomStart = start != null && start !== 1;

  const contextValue = useMemo(
    () => ({density, hasDividers, listStyle, edgeCompensation}),
    [density, hasDividers, listStyle, edgeCompensation],
  );

  const listElement = (
    <Tag
      ref={ref as React.Ref<HTMLUListElement & HTMLOListElement>}
      // Consumer props first: everything the component sets for itself below
      // is part of its contract and wins on conflict.
      {...props}
      data-testid={testId}
      // Only when this component renders the header — writing `undefined`
      // unconditionally would erase a label a consumer pointed at their own
      // heading.
      {...(header != null ? {'aria-labelledby': headerId} : null)}
      {...(isOrdered && start != null && start !== 1 ? {start} : {})}
      // The base list style always sets list-style-type: none (markers are
      // custom-rendered by ListItem), and Safari/VoiceOver drops implicit
      // list semantics for lists styled with list-style: none. The explicit
      // role restores "list, N items" announcements for every listStyle
      // variant.
      role="list"
      {...mergeProps(
        themeProps('list', {density, listStyle}),
        {
          className: cn(
            styles.list,
            hasDividers && styles.withDividers,
            listStyle !== 'none' &&
              (hasCustomStart
                ? dynamicStyles.counterStart
                : styles.withCounter),
          ),
          style:
            listStyle !== 'none' && hasCustomStart
              ? ({
                  '--_list-counter-reset': `solo-list ${start - 1}`,
                } as React.CSSProperties)
              : undefined,
        },
        className,
        style,
      )}>
      {children}
    </Tag>
  );

  if (header == null) {
    return <ListContext value={contextValue}>{listElement}</ListContext>;
  }

  return (
    <ListContext value={contextValue}>
      <div className={styles.root}>
        <div id={headerId} className={styles.header}>
          {header}
        </div>
        {listElement}
      </div>
    </ListContext>
  );
}

List.displayName = 'List';
