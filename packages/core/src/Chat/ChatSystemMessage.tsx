'use client';

/**
 * @file ChatSystemMessage.tsx
 * @input Uses React, Tailwind classes, theme tokens
 * @output Exports ChatSystemMessage component and ChatSystemMessageProps
 * @position Centered, wrapping system/notice message in a chat thread
 *
 * Renders centered, muted system messages like "conversation started",
 * date separators, or status updates. Not a sender message — no avatar,
 * no bubble, no alignment. Think of it as the chat equivalent of a banner
 * or status line.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Chat/index.ts (exports)
 * - /apps/storybook/stories/Chat.stories.tsx
 */

import type {ReactNode} from 'react';
import {mergeProps} from '../utils';
import {Divider} from '../Divider';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

export type ChatSystemMessageVariant = 'default' | 'divider';

export interface ChatSystemMessageProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * System message content — text or any ReactNode.
   */
  children: ReactNode;

  /**
   * Visual variant.
   * - 'default': plain centered text
   * - 'divider': text with horizontal lines on each side (date separator style)
   * @default 'default'
   */
  variant?: ChatSystemMessageVariant;

  /**
   * Optional caller-provided icon content associated with the message.
   * Accepts any ReactNode, typically an Icon.
   */
  icon?: ReactNode;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: cn(
    'flex items-center justify-center gap-(--spacing-2) py-(--spacing-1)',
    'font-(family-name:--font-family-body) text-(length:--text-supporting-size) font-(number:--font-weight-normal)',
    'text-(--color-text-secondary) text-center',
  ),
  dividerWrap: 'w-full',
  // Icon
  icon: 'inline-flex items-center shrink-0',
  // Content wrapper
  content: 'inline-flex items-center gap-(--spacing-1-5)',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * Centered system message for chat threads.
 *
 * Use for non-sender content: date separators, "conversation started",
 * "user joined", status changes. Supports a divider variant with horizontal
 * lines on each side of the text.
 *
 * @example
 * ```
 * <ChatSystemMessage>Conversation started</ChatSystemMessage>
 * <ChatSystemMessage variant="divider">Today</ChatSystemMessage>
 * <ChatSystemMessage variant="divider">March 15, 2026</ChatSystemMessage>
 * ```
 */
export function ChatSystemMessage({
  children,
  variant = 'default',
  icon,
  className,
  style: styleProp,
  ref,
  ...rest
}: ChatSystemMessageProps) {
  if (variant === 'divider') {
    return (
      <div
        ref={ref}
        {...mergeProps(
          themeProps('chat-system-message', {variant}),
          {className: styles.dividerWrap},
          className,
          styleProp,
        )}
        {...rest}
        role="status">
        <Divider label={children} />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('chat-system-message', {variant}),
        {className: styles.root},
        className,
        styleProp,
      )}
      {...rest}
      role="status">
      <span className={styles.content}>
        {icon != null && <span className={styles.icon}>{icon}</span>}
        {children}
      </span>
    </div>
  );
}

ChatSystemMessage.displayName = 'ChatSystemMessage';
