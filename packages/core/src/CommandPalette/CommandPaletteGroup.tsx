/**
 * @file CommandPaletteGroup.tsx
 * @input Uses React, Tailwind classes
 * @output Exports CommandPaletteGroup component
 * @position Sub-component; visual grouping with heading
 *
 * SYNC: When modified, update:
 */

'use client';

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

const styles = {
  group: 'flex flex-col gap-(--spacing-0-5) py-(--spacing-1)',
  heading: cn(
    'px-(--spacing-3) py-(--spacing-1)',
    'font-(family-name:--font-family-body) text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary) select-none',
  ),
} as const;

export interface CommandPaletteGroupProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element. */
  ref?: React.Ref<HTMLDivElement>;
  /** Group heading text. */
  heading: string;
  /** Items within this group. */
  children: ReactNode;
}

/**
 * Visual grouping for command palette items with a heading label.
 *
 * Heading style matches DropdownMenu section headings:
 * supporting-size (12px), secondary color, no uppercase/letterSpacing.
 *
 * @compositionHint Place inside CommandPaletteList.
 *   Contains CommandPaletteItem children.
 *
 * @example
 * ```
 * <CommandPaletteGroup heading="Navigation">
 *   <CommandPaletteItem value="home" onSelect={goHome}>
 *     Home
 *   </CommandPaletteItem>
 * </CommandPaletteGroup>
 * ```
 */
export function CommandPaletteGroup({
  heading,
  children,
  ref,
  className,
  style,
  ...props
}: CommandPaletteGroupProps) {
  return (
    <div
      ref={ref}
      role="group"
      aria-label={heading}
      {...mergeProps(
        themeProps('command-palette-group'),
        {className: styles.group},
        className,
        style,
      )}
      {...props}>
      <div
        aria-hidden="true"
        {...mergeProps(
          // Stable theme target for the group heading text. The root carries
          // `solo-command-palette-group`, but the heading itself had no
          // handle, so a theme could only reach it through a fragile structural
          // selector. This adds an `solo-command-palette-group-heading` class
          // so `defineTheme` can scope overrides (e.g. heading typography) to
          // the heading alone.
          themeProps('command-palette-group-heading'),
          {className: styles.heading},
        )}>
        {heading}
      </div>
      {children}
    </div>
  );
}

CommandPaletteGroup.displayName = 'CommandPaletteGroup';
