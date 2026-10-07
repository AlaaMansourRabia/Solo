/**
 * @file CommandPaletteList.tsx
 * @input Uses React, Tailwind classes, CommandPaletteContext
 * @output Exports CommandPaletteList component
 * @position Sub-component; scrollable results container
 *
 * SYNC: When modified, update:
 * - /packages/core/src/CommandPalette/index.ts
 */

'use client';

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {useCommandPaletteContext} from './CommandPaletteContext';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';

const styles = {
  list: 'overflow-y-auto max-h-full p-(--spacing-1) flex-1 flex flex-col gap-(--spacing-0-5)',
} as const;

export interface CommandPaletteListProps extends BaseProps<HTMLDivElement> {
  /**
   * Ref forwarded to the root element.
   */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Command palette items, groups, empty states, etc.
   */
  children: ReactNode;

  /**
   * Accessible label for the listbox.
   * @default 'Commands'
   */
  label?: string;
}

/**
 * Scrollable results container for the command palette.
 * Renders as a listbox for ARIA compliance.
 *
 * When used inside CommandPalette, automatically gets the correct
 * ID for aria-controls linking with the input.
 *
 * @compositionHint Place inside CommandPalette, after CommandPaletteInput.
 *   Contains CommandPaletteItem and CommandPaletteGroup children.
 *
 * @example
 * ```
 * <CommandPaletteList>
 *   <CommandPaletteItem value="home" onSelect={goHome}>
 *     Go Home
 *   </CommandPaletteItem>
 * </CommandPaletteList>
 * ```
 */
export function CommandPaletteList({
  children,
  label: labelFromProps,
  ref,
  className,
  style,
  ...props
}: CommandPaletteListProps) {
  const t = useTranslator();
  const label = labelFromProps ?? t('@solo.commandPalette.list.label');
  const ctx = useCommandPaletteContext();

  return (
    <div
      ref={ref}
      {...props}
      id={ctx?.listId}
      role="listbox"
      aria-label={label}
      {...mergeProps(
        themeProps('command-palette-list'),
        {className: styles.list},
        className,
        style,
      )}>
      {children}
    </div>
  );
}

CommandPaletteList.displayName = 'CommandPaletteList';
