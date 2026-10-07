/**
 * @file CommandPaletteFooter.tsx
 * @input Uses React, Tailwind classes, Kbd
 * @output Exports CommandPaletteFooter component
 * @position Sub-component; footer with keyboard hints
 *
 * SYNC: When modified, update:
 */

'use client';

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {Kbd} from '../Kbd';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';
import {cn} from '../utils/cn';

const styles = {
  footer: cn(
    'flex items-center gap-(--spacing-4) px-(--spacing-4) py-(--spacing-2) shrink-0',
    // Inherit font so custom children match hint text treatment
    'font-(family-name:--font-family-body) text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary)',
  ),
  hint: 'flex items-center gap-(--spacing-1)',
} as const;

export interface CommandPaletteFooterProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the footer element. */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Footer content. When provided, renders custom content instead of default hints.
   * Custom children inherit the footer font treatment (supporting/12px, secondary color).
   * When omitted, renders default keyboard navigation hints using Kbd.
   */
  children?: ReactNode;
}

/**
 * Footer for the command palette showing keyboard navigation hints.
 *
 * When no children are provided, renders default hints using Kbd
 * for arrow keys, Enter to select, and Escape to close.
 *
 * @compositionHint Pass to CommandPalette's `footer` slot.
 *
 * @example
 * ```
 * <CommandPalette
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   input={<CommandPaletteInput />}
 *   footer={<CommandPaletteFooter />}>
 *   <CommandPaletteList>...</CommandPaletteList>
 * </CommandPalette>
 * ```
 */
export function CommandPaletteFooter({
  children,
  ref,
  className,
  style,
  ...props
}: CommandPaletteFooterProps) {
  const t = useTranslator();

  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('command-palette-footer'),
        {className: styles.footer},
        className,
        style,
      )}
      {...props}>
      {children ?? (
        <>
          <span className={styles.hint}>
            <Kbd keys="up" />
            <Kbd keys="down" />
            {t('@solo.commandPalette.footer.navigate')}
          </span>
          <span className={styles.hint}>
            <Kbd keys="enter" />
            {t('@solo.commandPalette.footer.select')}
          </span>
          <span className={styles.hint}>
            <Kbd keys="escape" />
            {t('@solo.commandPalette.footer.close')}
          </span>
        </>
      )}
    </div>
  );
}

CommandPaletteFooter.displayName = 'CommandPaletteFooter';
