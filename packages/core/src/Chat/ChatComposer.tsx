'use client';

/**
 * @file ChatComposer.tsx
 * @input Uses React, Tailwind classes, BaseProps
 * @output Exports ChatComposer layout shell component
 * @position Core implementation; consumed by index.ts
 *
 * Layout shell for a chat composer. Arranges slots (drawer, header,
 * input, footer actions, send button, status) in a vertical stack with
 * page-radius container, hover/focus shadows, and concentric inner radius.
 *
 * Component CSS vars (themeable via defineTheme):
 * - `--_chat-composer-radius` (default: --radius-chat) — outer border radius
 * - `--_chat-composer-padding` (default: --spacing-3) — body padding
 * - Inner element radius = calc(--_chat-composer-radius - --_chat-composer-padding)
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Chat/Chat.doc.mjs
 * - /apps/storybook/stories/ChatComposer.stories.tsx
 */

import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
  type MouseEvent,
  type FocusEvent,
} from 'react';
import type {BaseProps} from '../BaseProps';
import {cn} from '../utils/cn';
import {mergeProps} from '../utils';
import {Icon} from '../Icon';
import {ChatComposerInput} from './ChatComposerInput';
import {ChatComposerContext} from './ChatContext';
import type {ChatComposerInputControl} from './ChatContext';
import {ChatSendButton} from './ChatSendButton';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {
  getInteractionModality,
  useInteractionModalityTracking,
} from '../utils/interactionModality';

// =============================================================================
// Types
// =============================================================================

export type ChatComposerStatus = {
  type: 'error' | 'warning';
  message?: string;
};

export type ChatComposerDensity = 'compact' | 'balanced' | 'spacious';

export interface ChatComposerProps extends Omit<
  BaseProps<HTMLDivElement>,
  'onChange' | 'onSubmit'
> {
  ref?: React.Ref<HTMLDivElement>;
  /** Called when the user submits the message */
  onSubmit: (value: string) => void;
  /** Called when the user clicks the stop button */
  onStop?: () => void;
  /** Whether the stop button is shown instead of the send button. @default false */
  isStopShown?: boolean;
  /** Controlled value of the input */
  value?: string;
  /** Called when the input value changes */
  onChange?: (value: string) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the composer is disabled */
  isDisabled?: boolean;
  /** Density variant */
  density?: ChatComposerDensity;
  /**
   * Resting elevation of the composer body. `low` (the default) keeps today's
   * raised look — low at rest, bumping to med on hover / focus. `none` flattens
   * it and draws a border. Keyboard focus in the editor adds the shared focus
   * ring in either presentation; pointer focus does not add that ring.
   * @default 'low'
   */
  elevation?: 'none' | 'low';

  // --- Slot props ---

  /** Collapsible drawer rendered above the input — attachments, context chips, etc. Use ChatComposerDrawer. */
  drawer?: ReactNode;
  /** Actions rendered on the left side of the header (e.g. attach, mention buttons). Use icon-only `size="sm"` buttons. */
  headerActions?: ReactNode;
  /** Contextual info rendered on the right side of the header (e.g. context window usage, ProgressBar). */
  headerContext?: ReactNode;
  /** Custom input element — replaces the default textarea */
  input?: ReactNode;
  /** Actions rendered on the left side of the footer. Use `size="md"` buttons to match the send button height. */
  footerActions?: ReactNode;
  /** Actions rendered to the left of the send button. Use `size="md"` buttons to match the send button height. */
  sendActions?: ReactNode;
  /** Custom send button — replaces the default */
  sendButton?: ReactNode;
  /** Status message rendered below (or above) the composer body */
  status?: ChatComposerStatus;
  /** Where to render the status. @default 'bottom' */
  statusPosition?: 'top' | 'bottom';
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: cn(
    'relative z-0 isolate flex flex-col',
    // Component CSS vars — themeable via defineTheme({ components: { 'chat-composer': { base: {...} } } })
    // Uses the dedicated chat radius (28px) rather than --radius-page, so chat
    // rounding is decoupled from page-level containers but unchanged today.
    '[--_chat-composer-radius:var(--radius-chat)] [--_chat-composer-padding:var(--spacing-3)]',
    // Concentric radius: buttons follow the outer shell's curvature.
    // Sets --_button-radius (not --radius-element) so only buttons are
    // affected — other components in slots keep their own radius.
    // Default: 28px - 12px = 16px (fully rounds a 32px button).
    '[--_button-radius:max(var(--radius-element),calc(var(--_chat-composer-radius)_-_var(--_chat-composer-padding)))]',
  ),

  rootDisabled: 'opacity-60 pointer-events-none',
  body: cn(
    'relative z-2 flex flex-col p-(--_chat-composer-padding) gap-(--spacing-2)',
    'rounded-(--_chat-composer-radius) bg-(--color-background-popover)',
    'cursor-text [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition:box-shadow_var(--duration-fast)_var(--ease-standard),border-color_var(--duration-fast)_var(--ease-standard)]',
  ),
  header: 'flex items-center justify-between gap-(--spacing-2) min-h-[28px]',
  headerLeft: 'flex items-center gap-(--spacing-1)',
  headerRight: cn(
    'flex items-center gap-(--spacing-2) ms-auto',
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading) text-(--color-text-secondary)',
  ),
  inputArea: 'flex flex-col',
  textarea: cn(
    'w-full resize-none text-(length:--text-body-size) leading-(--text-body-leading)',
    'font-(family-name:--font-family-body) text-(--color-text-primary) bg-transparent',
    'caret-(--color-accent) overflow-y-auto max-h-[176px]',
    'placeholder:text-(--color-text-disabled)',
  ),
  footer: cn(
    'flex items-center justify-between gap-(--spacing-2)',
    // Footer buttons should use size="md" to match 32px send button height
    'min-h-[32px]',
  ),
  footerLeft: 'flex items-center gap-(--spacing-1)',
  footerRight: 'flex items-center gap-(--spacing-1)',
  // The composer may disable editing while a response is streaming. Restore
  // pointer hit-testing for the footer so its Stop action stays reachable.
  interruptibleFooter: 'pointer-events-auto',
  statusBar: cn(
    'relative z-0 flex items-center gap-(--spacing-2) px-(--spacing-4)',
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading) font-(family-name:--font-family-body)',
  ),
  statusTop: cn(
    'pbs-(--_chat-composer-padding)',
    'pbe-[calc(var(--_chat-composer-padding)_+_var(--_chat-composer-radius))]',
    '-mbe-(--_chat-composer-radius)',
    'rounded-ss-(--_chat-composer-radius) rounded-se-(--_chat-composer-radius)',
  ),
  statusBottom: cn(
    'pbs-[calc(var(--_chat-composer-padding)_+_var(--_chat-composer-radius))]',
    'pbe-(--_chat-composer-padding)',
    '-mbs-(--_chat-composer-radius)',
    'rounded-es-(--_chat-composer-radius) rounded-ee-(--_chat-composer-radius)',
  ),
  statusError: 'bg-(--color-error-muted) text-(--color-text-red)',
  statusWarning: 'bg-(--color-warning-muted) text-(--color-text-yellow)',
  // Override the padding var (not the `padding` property) so both the base
  // body padding and the border-inset calc in elevationStyles.none pick up
  // the compact value. Scoped to the body element, so the status bar (which
  // reads the var from root) keeps its own padding.
  compact: '[--_chat-composer-padding:var(--spacing-2)] gap-(--spacing-1)',
} as const;

// Resting elevation for the composer body, narrowed to two steps.
// - `low` (default) preserves today's look: low at rest, bumping to med on
//   hover / focus-within. The WCAG focus indicator is a separate shared ring,
//   gated to keyboard focus in the editor; the shadow change remains depth.
// - `none` is flat; depth comes from a border + inset rings instead. The
//   border is drawn *inside* the padding — its width is subtracted from every
//   side (like Card) so total inset (border + padding) equals the elevated
//   case and content geometry is unchanged. Border color, hover, and focus
//   states mirror TextInput (shared `inputWrapperStyles.base` treatment):
//   emphasized border at rest → accent on focus-within, with the same inset
//   shadow rings on hover and focus.
const elevationStyles = {
  low: cn(
    '[box-shadow:var(--shadow-low)]',
    'can-hover:hover:usable:[box-shadow:var(--shadow-med)]',
    'focus-within:[box-shadow:var(--shadow-med)]',
  ),
  none: cn(
    '[border-width:var(--border-width)] [border-style:solid]',
    'border-(--color-border-emphasized) focus-within:border-(--color-accent)',
    // Draw the border *inside* the padding — subtract its width from the body
    // padding (like Card's withBorder) so total inset (border + padding) equals
    // the elevated case and content geometry is unchanged.
    'p-[calc(var(--_chat-composer-padding)_-_var(--border-width))]',
    '[box-shadow:none]',
    'can-hover:hover:[&:not(:focus-within)]:usable:[box-shadow:inset_0px_0px_0px_2px_color-mix(in_srgb,var(--color-border-emphasized)_30%,transparent)]',
    'focus-within:[box-shadow:inset_0px_0px_0px_2px_var(--color-accent-muted)]',
  ),
} as const;

function isComposerEditor(target: EventTarget | null): target is HTMLElement {
  return (
    target instanceof HTMLElement &&
    target.matches(
      'textarea, [contenteditable="true"], [role="textbox"], input:not([type]), input[type="text"], input[type="search"], input[type="email"], input[type="url"], input[type="tel"], input[type="password"]',
    )
  );
}

// =============================================================================
// Component
// =============================================================================

/**
 * Layout shell for a chat composer with slots for drawer, input,
 * actions, and a send button.
 *
 * @example
 * ```
 * <ChatComposer
 *   onSubmit={(value) => console.log(value)}
 *   placeholder="Type a message..."
 * />
 * ```
 */
export function ChatComposer(props: ChatComposerProps) {
  const t = useTranslator();
  const {
    ref,
    onSubmit,
    onStop,
    isStopShown = false,
    value: controlledValue,
    onChange,
    placeholder: placeholderFromProps,
    isDisabled = false,
    density = 'balanced',
    elevation = 'low',
    drawer,
    headerActions,
    headerContext,
    input,
    footerActions,
    sendActions,
    sendButton,
    status,
    statusPosition = 'bottom',
    className,
    style,
    ...rest
  } = props;
  const placeholder =
    placeholderFromProps ?? t('@solo.chat.composer.placeholder');

  const [internalValue, setInternalValue] = useState('');
  const [hasKeyboardEditorFocus, setHasKeyboardEditorFocus] = useState(false);

  useInteractionModalityTracking();

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const updateValue = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  const handleSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || isDisabled) {
        return;
      }
      onSubmit(trimmed);
      updateValue('');
    },
    [isDisabled, onSubmit, updateValue],
  );

  const canSend = currentValue.trim().length > 0 && !isDisabled;

  const bodyRef = useRef<HTMLDivElement>(null);

  // Input slot registers its focus (and future) control here so the shell can
  // drive it without knowing its DOM shape. Stable ref — safe in the memoized
  // context value.
  const inputControlRef = useRef<ChatComposerInputControl | null>(null);

  const handleBodyClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    // Focus the input when clicking empty space in the body.
    // Skip if the click target is a button, link, or interactive element.
    const target = e.target as HTMLElement;
    if (
      target.closest(
        'button, a, [role="button"], [contenteditable="true"], [data-solo-token]',
      )
    ) {
      return;
    }
    // Prefer the input's registered control (works for any input shape,
    // including editors whose focusable node isn't a bare
    // contenteditable/textarea). Fall back to a DOM query so uninstrumented
    // custom inputs still get click-to-focus.
    if (inputControlRef.current) {
      inputControlRef.current.focus();
      return;
    }
    const editable = bodyRef.current?.querySelector<HTMLElement>(
      '[contenteditable="true"], textarea',
    );
    editable?.focus();
  }, []);

  const handleBodyFocusCapture = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      setHasKeyboardEditorFocus(
        isComposerEditor(event.target) &&
          getInteractionModality() === 'keyboard',
      );
    },
    [],
  );

  const handleBodyBlurCapture = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setHasKeyboardEditorFocus(false);
      }
    },
    [],
  );

  const statusEl = status ? (
    <div
      role={status.type === 'error' ? 'alert' : 'status'}
      className={cn(
        styles.statusBar,
        statusPosition === 'top' ? styles.statusTop : styles.statusBottom,
        status.type === 'error' && styles.statusError,
        status.type === 'warning' && styles.statusWarning,
      )}>
      <Icon
        icon={status.type === 'error' ? 'error' : 'warning'}
        size="md"
        color={status.type === 'error' ? 'error' : 'warning'}
      />
      {status.message}
    </div>
  ) : null;

  const composerContext = useMemo(
    () => ({
      value: currentValue,
      onChange: updateValue,
      onSubmit: handleSubmit,
      placeholder,
      isDisabled,
      isStopShown,
      canSend,
      onStop,
      inputControlRef,
    }),
    [
      currentValue,
      updateValue,
      handleSubmit,
      placeholder,
      isDisabled,
      isStopShown,
      canSend,
      onStop,
    ],
  );

  return (
    <ChatComposerContext value={composerContext}>
      <div
        ref={ref}
        {...mergeProps(
          themeProps('chat-composer', {density}),
          {className: cn(styles.root, isDisabled && styles.rootDisabled)},
          className,
          style,
        )}
        {...rest}>
        {statusPosition === 'top' && statusEl}
        {drawer}

        <div
          ref={bodyRef}
          onClick={handleBodyClick}
          onPointerDownCapture={() => setHasKeyboardEditorFocus(false)}
          onFocusCapture={handleBodyFocusCapture}
          onBlurCapture={handleBodyBlurCapture}
          className={cn(
            styles.body,
            elevationStyles[elevation],
            hasKeyboardEditorFocus && focusOutlineStyles.focusWithin,
            density === 'compact' && styles.compact,
          )}>
          {(headerActions || headerContext) && (
            <div className={styles.header}>
              <div className={styles.headerLeft}>{headerActions}</div>
              <div className={styles.headerRight}>{headerContext}</div>
            </div>
          )}

          <div className={styles.inputArea}>
            {input ?? <ChatComposerInput />}
          </div>

          <div className={styles.footer}>
            <div className={styles.footerLeft}>{footerActions}</div>
            <div
              className={cn(
                styles.footerRight,
                isDisabled && isStopShown && styles.interruptibleFooter,
              )}>
              {sendActions}
              {sendButton ?? <ChatSendButton />}
            </div>
          </div>
        </div>

        {statusPosition === 'bottom' && statusEl}
      </div>
    </ChatComposerContext>
  );
}

ChatComposer.displayName = 'ChatComposer';
