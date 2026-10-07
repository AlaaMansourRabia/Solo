'use client';

/**
 * @file ChatMessageMetadata.tsx
 * @input Uses React, Tailwind classes, ChatContext, Icon, theme tokens, and isRenderable
 * @output Exports ChatMessageMetadata component
 * @position Shared metadata row used by composing inside ChatMessage
 *
 * Renders timestamp, footer, and status values with separators determined by
 * scalar presence. Direction reverses for user sender.
 */

import React, {type ReactNode} from 'react';
import {useChatMessageContext} from './ChatContext';
import {Icon} from '../Icon';
import type {IconName} from '../Icon/globalIconRegistry';
import {isRenderable, mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';
import {useTranslator} from '../i18n';

export type ChatMessageStatus =
  'sending' | 'sent' | 'delivered' | 'read' | 'error';

const STATUS_CONFIG: Record<
  ChatMessageStatus,
  {icon: IconName; i18nKey: string}
> = {
  sending: {icon: 'clock', i18nKey: '@solo.chat.status.sending'},
  sent: {icon: 'check', i18nKey: '@solo.chat.status.sent'},
  delivered: {icon: 'checkDouble', i18nKey: '@solo.chat.status.delivered'},
  read: {icon: 'checkDouble', i18nKey: '@solo.chat.status.read'},
  error: {icon: 'error', i18nKey: '@solo.chat.status.failed'},
};

// Keyframes: `solo-chat-metadata-pulse` in Chat.css.
const styles = {
  meta: cn(
    'flex items-center gap-(--spacing-1) mbs-(--spacing-1)',
    'text-(length:--text-supporting-size) font-(number:--font-weight-normal) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary)',
  ),
  metaUser: 'flex-row-reverse',
  metaAssistant: 'flex-row',
  statusRow: 'inline-flex items-center gap-(--spacing-1)',
  statusError: 'text-(--color-error)',
  statusPulse: cn(
    '[animation-name:solo-chat-metadata-pulse] [animation-duration:1.5s]',
    '[animation-timing-function:ease-in-out] [animation-iteration-count:infinite]',
    'motion-reduce:[animation-name:none]',
  ),
} as const;

export interface ChatMessageMetadataProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /** Timestamp content — ReactNode (e.g. Timestamp) or string. */
  timestamp?: ReactNode;
  /** Footer content — model info, ratings, reactions. */
  footer?: ReactNode;
  /** Message delivery status. */
  status?: ChatMessageStatus;
}

/**
 * Composable metadata row for chat messages.
 *
 * Renders: timestamp · footer · status
 * Renders nothing when neither slot passes the scalar-presence check and no
 * status is set. Composite React nodes remain caller-owned.
 *
 * @example
 * ```
 * <ChatMessage sender="user">
 *   <ChatMessageBubble>Hello!</ChatMessageBubble>
 *   <ChatMessageMetadata timestamp={<Timestamp value="..." format="time" />} status="read" />
 * </ChatMessage>
 * ```
 */
export function ChatMessageMetadata({
  ref,
  timestamp,
  footer,
  status,
  className,
  style,
  ...rest
}: ChatMessageMetadataProps) {
  const t = useTranslator();
  const msgContext = useChatMessageContext();
  const sender = msgContext?.sender ?? 'assistant';

  const statusConfig = status != null ? STATUS_CONFIG[status] : null;
  const statusLabel = statusConfig != null ? t(statusConfig.i18nKey) : '';

  const hasTimestamp = isRenderable(timestamp);
  const hasFooter = isRenderable(footer);
  const hasContent = hasTimestamp || hasFooter || statusConfig != null;
  if (!hasContent) {
    return null;
  }

  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('chat-message-metadata'),
        {
          className: cn(
            styles.meta,
            sender === 'user' ? styles.metaUser : styles.metaAssistant,
          ),
        },
        className,
        style,
      )}
      {...rest}>
      {hasTimestamp && <span>{timestamp}</span>}
      {hasTimestamp && (hasFooter || statusConfig != null) && <span>·</span>}
      {hasFooter && footer}
      {hasFooter && statusConfig != null && <span>·</span>}
      {statusConfig != null && (
        <span
          title={statusLabel}
          aria-label={t('@solo.chat.messageAriaLabel', {
            status: statusLabel.toLowerCase(),
          })}
          className={cn(
            styles.statusRow,
            status === 'error' && styles.statusError,
            status === 'sending' && styles.statusPulse,
          )}>
          <Icon icon={statusConfig.icon} size="xsm" color="inherit" />
          <span>{statusLabel}</span>
        </span>
      )}
    </div>
  );
}

ChatMessageMetadata.displayName = 'ChatMessageMetadata';
