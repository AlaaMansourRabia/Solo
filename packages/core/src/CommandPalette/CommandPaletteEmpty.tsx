/**
 * @file CommandPaletteEmpty.tsx
 * @input Uses React, Tailwind classes
 * @output Exports CommandPaletteEmpty component
 * @position Sub-component; empty state shown when there are no items to display
 *
 * SYNC: When modified, update:
 */

'use client';

import React, {type ReactNode} from 'react';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

const styles = {
  empty: cn(
    'flex items-center justify-center py-(--spacing-8) px-(--spacing-4)',
    'font-(family-name:--font-family-body) text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary) text-center',
  ),
} as const;

export interface CommandPaletteEmptyProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /** The message or content to display. */
  children: ReactNode;
}

/**
 * Empty state for the command palette list area.
 *
 * Rendered automatically by CommandPalette in two situations:
 * - `emptyBootstrapText`: no search term and bootstrap() returns nothing
 * - `emptySearchText`: a search query returned no results
 *
 * Can also be composed manually inside a custom render function.
 *
 * @example
 * ```
 * <CommandPalette
 *   emptyBootstrapText={<CommandPaletteEmpty>Start typing to search</CommandPaletteEmpty>}
 *   emptySearchText={<CommandPaletteEmpty>No results found</CommandPaletteEmpty>}
 *   searchSource={source}
 * />
 * ```
 */
export function CommandPaletteEmpty({
  ref,
  children,
  className,
  style,
  ...props
}: CommandPaletteEmptyProps) {
  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('command-palette-empty'),
        {className: styles.empty},
        className,
        style,
      )}
      {...props}>
      {children}
    </div>
  );
}

CommandPaletteEmpty.displayName = 'CommandPaletteEmpty';
