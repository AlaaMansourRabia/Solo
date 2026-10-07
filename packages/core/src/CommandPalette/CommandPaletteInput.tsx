'use client';
/**
 * @file CommandPaletteInput.tsx
 * @input Uses React, Tailwind classes, Icon, CommandPaletteContext, DialogContext
 * @output Exports CommandPaletteInput component and props
 * @position Search input for the command palette
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /apps/storybook/stories/CommandPalette.stories.tsx
 */

import {useCallback, useEffect, useRef, type ReactNode} from 'react';
import {Icon} from '../Icon';
import {Spinner} from '../Spinner';
import {mergeProps} from '../utils';
import {useCommandPaletteContext} from './CommandPaletteContext';
import {useDialogContext} from '../Dialog/DialogContext';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';

import {useMergedRefs} from '../hooks/useMergedRefs';
import {cn} from '../utils/cn';
const styles = {
  wrapper:
    'flex items-center gap-(--spacing-2) px-(--spacing-4) py-(--spacing-3) shrink-0',
  // The icon span needs explicit flex centering to avoid line-height offset
  icon: 'flex items-center shrink-0 text-(--color-text-secondary)',
  // Groups spinner + endContent on the right with a consistent gap
  end: 'flex items-center gap-(--spacing-1) shrink-0',
  // Delay spinner appearance to avoid flickering on near-instant searches.
  // Uses @starting-style + transition-delay so the spinner only appears
  // if the search is still pending after 150ms.
  spinner:
    'opacity-100 [transition-property:opacity] [transition-duration:1ms] [transition-delay:150ms] starting:opacity-0',
  input: cn(
    'flex-1 min-w-0 [border-width:0] [border-style:none] [outline:none] bg-transparent',
    'text-(--color-text-primary) font-(family-name:--font-family-body)',
    // The 16px floor is iOS-only: iOS Safari zooms the page when a focused
    // control sits under 16px, and only iOS WebKit implements
    // -webkit-touch-callout to key the coarse-pointer floor to it.
    'text-(length:--text-body-size)',
    'pointer-coarse:supports-[-webkit-touch-callout:none]:text-[length:max(1rem,var(--text-body-size))]',
    'leading-(--text-body-leading) p-0',
    'placeholder:text-(--color-text-secondary)',
  ),
} as const;

export interface CommandPaletteInputProps extends Omit<
  BaseProps<HTMLInputElement>,
  'onChange'
> {
  /** Ref forwarded to the input element (for focus management). */
  ref?: React.Ref<HTMLInputElement>;

  /**
   * The current search value.
   * When omitted inside CommandPalette, reads from context.
   */
  value?: string;

  /**
   * Called when the search value changes.
   * When omitted inside CommandPalette, writes to context.
   */
  onValueChange?: (value: string) => void;

  /**
   * Placeholder text for the input.
   * @default 'Search...'
   */
  placeholder?: string;

  /**
   * Accessible label for the combobox input, announced by screen readers.
   * Falls back to the placeholder text (`'Search…'` by default), since a
   * placeholder alone is not a reliable accessible name.
   */
  label?: string;

  /**
   * Whether to auto-focus the input when mounted.
   * @default true
   */
  hasAutoFocus?: boolean;

  /**
   * Content rendered at the trailing end of the input, after the spinner.
   * Use for clear buttons, keyboard shortcuts, or other trailing actions.
   * The spinner (when busy) appears immediately before this content with a 4px gap.
   */
  endContent?: ReactNode;

  /** Native onChange handler for the input element. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * Search input for the command palette.
 *
 * Renders a search icon and a text input. Auto-focuses when mounted
 * so users can start typing immediately.
 *
 * When used inside CommandPalette, automatically wires to the
 * context for search state and keyboard navigation (via useCombobox).
 * Can also be used standalone with explicit value/onValueChange props.
 *
 * @compositionHint Place as the first child of CommandPalette.
 *
 * @example
 * ```
 * <CommandPalette isOpen={isOpen} onOpenChange={setIsOpen}>
 *   <CommandPaletteInput placeholder="Search commands..." />
 * </CommandPalette>
 * ```
 */
export function CommandPaletteInput({
  value: controlledValue,
  onValueChange,
  placeholder: placeholderFromProps,
  label,
  hasAutoFocus = true,
  endContent,
  onChange,
  onKeyDown,
  ref,
  className,
  style,
  ...props
}: CommandPaletteInputProps) {
  const t = useTranslator();
  const placeholder =
    placeholderFromProps ?? t('@solo.commandPalette.input.placeholder');
  const ctx = useCommandPaletteContext();
  const dialogContext = useDialogContext();
  const inputRef = useRef<HTMLInputElement>(null);

  // Use context values as fallback
  const value = controlledValue ?? ctx?.search;
  const handleValueChange = onValueChange ?? ctx?.setSearch;

  // When rendered inside an inline dialog, disable auto-focus by default
  // to avoid stealing focus from the surrounding page.
  const effectiveAutoFocus = hasAutoFocus && dialogContext?.isInline !== true;

  // Auto-focus on mount
  useEffect(() => {
    if (effectiveAutoFocus && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [effectiveAutoFocus]);

  // Keyboard navigation — delegates to useCombobox via context
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) {
        return;
      }
      // Delegate to useCombobox's keyboard handler from context
      ctx?.onKeyDown(e);
    },
    [ctx, onKeyDown],
  );

  return (
    <div
      {...mergeProps(
        themeProps('command-palette-input'),
        {className: styles.wrapper},
        className,
        style,
      )}>
      <span className={styles.icon}>
        <Icon icon="search" size="sm" color="inherit" />
      </span>
      <input
        ref={useMergedRefs(ref, inputRef)}
        type="text"
        role="combobox"
        aria-expanded={ctx?.isOpen ?? true}
        aria-autocomplete="list"
        aria-controls={ctx?.listId}
        aria-activedescendant={
          ctx && ctx.highlightedIndex >= 0
            ? ctx.getItemId(ctx.highlightedIndex)
            : undefined
        }
        // A placeholder alone is not a reliable accessible name; give the
        // combobox an explicit one (consumer aria-label via rest props wins).
        aria-label={label ?? placeholder}
        placeholder={placeholder}
        value={value}
        data-autofocus={effectiveAutoFocus || undefined}
        onChange={e => {
          handleValueChange?.(e.target.value);
          onChange?.(e);
        }}
        onKeyDown={handleKeyDown}
        className={styles.input}
        {...props}
      />
      {(ctx?.isBusy || endContent) && (
        <span className={styles.end}>
          {ctx?.isBusy && (
            <span className={cn(styles.icon, styles.spinner)}>
              <Spinner size="sm" />
            </span>
          )}
          {endContent}
        </span>
      )}{' '}
    </div>
  );
}

CommandPaletteInput.displayName = 'CommandPaletteInput';
