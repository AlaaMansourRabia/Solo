'use client';

/**
 * @file ListItem.tsx
 * @input Uses React, ReactNode, Tailwind classes, theme tokens, List edge compensation
 * @output Exports ListItem component, ListItemProps type
 * @position Core implementation; consumed by List, index.ts, tested by List.test.tsx
 *
 * Composes Item for the shared start content + label + description + end content layout
 * and the invisible button/anchor interactive pattern.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/List/List.doc.mjs
 * - /packages/core/src/List/List.test.tsx
 * - /packages/core/src/List/index.ts
 * - /apps/storybook/stories/List.stories.tsx
 */

import {use, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {ListContext} from './ListContext';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {Item} from '../Item';
import {themeProps} from '../utils/themeProps';

// =============================================================================
// Types
// =============================================================================

export interface ListItemProps extends BaseProps<HTMLLIElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLLIElement>;
  /**
   * Primary text label for the item.
   *
   * Accepts a plain string (single-line truncation applied automatically)
   * or a ReactNode for rich content (no truncation constraints —
   * child components control their own text behavior).
   */
  label: ReactNode;

  /**
   * Secondary description below the label.
   *
   * Accepts a plain string (single-line truncation applied automatically)
   * or a ReactNode for rich/multi-line content (no wrapping constraints
   * applied — child components control their own text behavior).
   */
  description?: ReactNode;

  /**
   * Content rendered before the item (icon, avatar, checkbox).
   * Uses start/end naming for RTL support.
   */
  startContent?: ReactNode;

  /**
   * Content rendered after the item (badge, action button, chevron).
   */
  endContent?: ReactNode;

  /**
   * Click handler for interactive items.
   * Automatically enables hover/press styles when provided.
   */
  onClick?: (e: React.MouseEvent) => void;

  /**
   * Ref to a nested control inside the item (e.g. a checkbox in
   * `startContent`) that already provides the item's keyboard access and
   * action. When set, the item becomes an enlarged click/tap target that
   * delegates surface clicks to that control via the `useClickableContainer`
   * pattern: it renders no invisible button/anchor, so the row adds no second
   * tab stop (WCAG 4.1.2 — one focusable control per option). Mutually
   * exclusive with `onClick`/`href` — when set those are ignored.
   */
  interactiveRef?: React.RefObject<HTMLElement | null>;

  /**
   * URL for link items. Renders an invisible anchor element.
   * Automatically enables hover/press styles when provided.
   */
  href?: string;

  /**
   * Link target (e.g., '_blank'). Only used with href.
   */
  target?: string;

  /**
   * Link relationship. Automatically includes noopener noreferrer when
   * target is "_blank".
   */
  rel?: string;

  /**
   * Whether the item is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the item is currently selected.
   * @default false
   */
  isSelected?: boolean;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  withCounter: '[counter-increment:solo-list]',
  // List's inline edge compensation cancels as much of the row's built-in
  // inline inset as the container padding allows (e.g. under a heading).
  // The margins read --_item-inset-inline — the same variable Item derives
  // its paddingInline from — on the row element itself (custom properties
  // only cascade downward, so the <ul> could not read it). Density changes
  // and theme paddingInline overrides on `item` move both values together.
  // Each edge clamps against ITS OWN container padding var: a single
  // start-var clamp on both margins over-cancels the end edge under
  // asymmetric container padding (16px start / 4px end) and the selected
  // row paints past the outer border. Logical properties keep RTL correct,
  // and a zero-padding/full-bleed surface (min(inset, 0px) = 0px) leaves
  // the row in place instead of pulling it outside its content edge.
  inlineEdgeCompensation: cn(
    'ms-[calc(-1*min(var(--_item-inset-inline),var(--container-padding-inline-start,0px)))]',
    'me-[calc(-1*min(var(--_item-inset-inline),var(--container-padding-inline-end,0px)))]',
  ),
  // Longhands, so the last-item reset only clears the width.
  withDivider: cn(
    '[border-block-end-width:var(--border-width)]',
    '[border-block-end-style:solid]',
    '[border-block-end-color:var(--color-border)]',
    'last:[border-block-end-width:0]',
  ),
} as const;

// =============================================================================
// Marker styles — custom-rendered markers instead of native list-style-type.
// Uses CSS counters for numbers (same pattern as WWW Solo).
// Marker dot size: 6px.
// =============================================================================

const markerStyles = {
  container: cn(
    'self-baseline box-border flex items-center justify-center shrink-0',
    'w-(--spacing-4)',
    'mt-[calc((1em*var(--text-body-leading)-6px)/2)]',
  ),
  dot: 'w-[6px] h-[6px] rounded-[50%] bg-(--color-text-primary)',
  circle: cn(
    'w-[6px] h-[6px] rounded-[50%]',
    '[border-width:1px] [border-style:solid] border-(--color-text-primary)',
    'bg-transparent',
  ),
  number: cn(
    'self-baseline shrink-0 text-(--color-text-primary)',
    'text-(length:--text-body-size) leading-(--text-body-leading)',
    'w-(--spacing-4)',
    'before:[content:counter(solo-list)_"."]',
  ),
} as const;

const embeddedStyles = {
  noRadius: 'rounded-none',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * A list item component for use within List.
 *
 * Renders structured content with label, description, start/end content areas.
 * When `onClick` is provided, uses the invisible button pattern for accessibility.
 * When `href` is provided, uses an invisible anchor pattern.
 *
 * @example
 * ```
 * <ListItem label="Settings" description="Manage your preferences" />
 * <ListItem label="Profile" onClick={() => navigate('/profile')} />
 * <ListItem label="Docs" href="/docs" target="_blank" rel="noreferrer" />
 * ```
 */
export function ListItem({
  label,
  description,
  startContent,
  endContent,
  onClick,
  interactiveRef,
  href,
  target,
  rel,
  isDisabled = false,
  isSelected = false,
  className,
  style,
  ref,
  ...restProps
}: ListItemProps) {
  const ctx = use(ListContext);
  const density = ctx?.density ?? 'balanced';
  const hasDividers = ctx?.hasDividers ?? false;
  const listStyle = ctx?.listStyle ?? 'none';
  const edgeCompensation = ctx?.edgeCompensation;
  const hasMarkers = listStyle !== 'none';

  const marker =
    listStyle === 'disc' ? (
      <span className={markerStyles.container}>
        <span className={markerStyles.dot} />
      </span>
    ) : listStyle === 'circle' ? (
      <span className={markerStyles.container}>
        <span className={markerStyles.circle} />
      </span>
    ) : listStyle === 'decimal' ? (
      <span className={markerStyles.number} />
    ) : null;

  return (
    <Item
      as="li"
      ref={ref}
      marker={marker}
      startContent={startContent}
      label={label}
      description={description}
      endContent={endContent}
      onClick={onClick}
      interactiveRef={interactiveRef}
      href={href}
      target={target as '_blank' | '_self'}
      rel={rel}
      isDisabled={isDisabled}
      isSelected={isSelected}
      density={density}
      {...mergeProps(themeProps('list-item'), {
        className: cn(
          hasMarkers && styles.withCounter,
          hasDividers && styles.withDivider,
          hasDividers && embeddedStyles.noRadius,
          edgeCompensation === 'inline' && styles.inlineEdgeCompensation,
          className,
        ),
        style,
      })}
      {...restProps}
    />
  );
}

ListItem.displayName = 'ListItem';
