'use client';

/**
 * @file ChatMessage.tsx
 * @input Uses React, Tailwind classes, ChatContext, theme tokens
 * @output Exports ChatMessage component and ChatMessageProps
 * @position Sender context wrapper — handles avatar, name, alignment by sender role
 *
 * Layout (with avatar):
 *   [Avatar] [Name              ]
 *            [Content/Bubbles   ]
 *            [Metadata          ]
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Chat/index.ts (exports)
 * - /apps/storybook/stories/Chat.stories.tsx
 */

import {type ReactNode, useMemo, useId} from 'react';
import {
  ChatMessageContext,
  useChatListContext,
  type ChatMessageSender,
  type ChatDensity,
} from './ChatContext';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';
import {useTranslator} from '../i18n';

export interface ChatMessageProps extends BaseProps<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
  sender: ChatMessageSender;
  /**
   * Message body — bubbles, tool calls, images, or any free-form content.
   * Custom (non-bubble) children render flush with the message edge; wrap
   * them in a ghost bubble (`<ChatMessageBubble variant="ghost">`) to align
   * them with the bubble's text column, and add `width="100%"` when they
   * should span the full message column.
   */
  children: ReactNode;
  avatar?: ReactNode;
  /**
   * Sender name rendered above the message body.
   * Use when the first child is raw content (not a bubble).
   * If the first child is a ChatMessageBubble, put the name on the
   * bubble's `name` prop instead — it aligns with the bubble's padding.
   */
  name?: ReactNode;
  /**
   * Metadata rendered below the message body.
   * Use when the last child is raw content (not a bubble).
   * If the last child is a ChatMessageBubble, put metadata on the
   * bubble's `metadata` prop instead — it aligns with the bubble's padding.
   */
  metadata?: ReactNode;
  density?: ChatDensity;
}

const styles = {
  root: 'flex items-start max-w-full',
  rootGapCompact: 'gap-(--spacing-1-5)',
  rootGapBalanced: 'gap-(--spacing-2)',
  rootGapSpacious: 'gap-(--spacing-3)',
  rootAssistant: 'flex-row justify-start',
  rootUser: 'flex-row-reverse justify-start',
  rootSystem: 'flex-row justify-center',
  avatarWrap:
    'shrink-0 [&:has(~_*_[data-chat-name])]:mbs-(--spacing-5)',
  contentColumn: 'flex flex-col flex-1 min-w-0',
  contentColumnSystem: 'max-w-[90%] items-center',
  contentColumnAssistant: 'items-start',
  contentColumnUser: 'items-end',
  name: cn(
    'text-(length:--text-supporting-size) font-(number:--font-weight-semibold) text-(--color-text-secondary)',
    'leading-(--text-supporting-leading) mbe-(--spacing-1)',
  ),
  childrenWrap: 'flex flex-col min-w-0 w-full',
  childrenAssistant: 'items-start',
  childrenUser: 'items-end',
  childrenSystem: 'items-center',
  childrenGapCompact: 'gap-(--spacing-0-5)',
  childrenGapBalanced: 'gap-(--spacing-1)',
  childrenGapSpacious: 'gap-(--spacing-1-5)',
} as const;

/**
 * Sender context wrapper for chat messages.
 *
 * Provides sender and density context to child components.
 * Use ChatMessageMetadata as a child for timestamp, status, and footer.
 *
 * @example
 * ```
 * <ChatMessage sender="assistant" name="Navi" avatar={<Avatar name="Navi" size="md" />}>
 *   <ChatMessageBubble>Hello!</ChatMessageBubble>
 *   <ChatMessageMetadata timestamp="2:30 PM" />
 * </ChatMessage>
 * ```
 */
export function ChatMessage({
  sender,
  children,
  avatar,
  name,
  metadata,
  density: densityProp,
  className,
  style: styleProp,
  'data-testid': testId,
  ref,
  ...rest
}: ChatMessageProps) {
  const t = useTranslator();
  const listContext = useChatListContext();
  const density = densityProp ?? listContext?.density ?? 'balanced';

  const contextValue = useMemo(() => ({sender, density}), [sender, density]);

  const rootGap =
    density === 'compact'
      ? styles.rootGapCompact
      : density === 'spacious'
        ? styles.rootGapSpacious
        : styles.rootGapBalanced;

  const childrenGap =
    density === 'compact'
      ? styles.childrenGapCompact
      : density === 'spacious'
        ? styles.childrenGapSpacious
        : styles.childrenGapBalanced;

  const rootAlignment =
    sender === 'system'
      ? styles.rootSystem
      : sender === 'user'
        ? styles.rootUser
        : styles.rootAssistant;

  const columnAlignment =
    sender === 'system'
      ? styles.contentColumnSystem
      : sender === 'user'
        ? styles.contentColumnUser
        : styles.contentColumnAssistant;

  const childrenAlignment =
    sender === 'system'
      ? styles.childrenSystem
      : sender === 'user'
        ? styles.childrenUser
        : styles.childrenAssistant;

  const isSystem = sender === 'system';
  const hasAvatar = avatar != null && !isSystem;
  const hasName = name != null && !isSystem;
  const nameId = useId();

  return (
    <ChatMessageContext value={contextValue}>
      <article
        {...rest}
        ref={ref}
        data-testid={testId}
        aria-label={
          !hasName ? t('@solo.chatMessage.messageFrom', {sender}) : undefined
        }
        aria-labelledby={hasName ? nameId : undefined}
        {...mergeProps(
          themeProps('chat-message', {sender, density}),
          {
            className: cn(styles.root, rootAlignment, hasAvatar && rootGap),
          },
          className,
          styleProp,
        )}>
        {hasAvatar && <div className={styles.avatarWrap}>{avatar}</div>}

        <div className={cn(styles.contentColumn, columnAlignment)}>
          {hasName && (
            <div id={nameId} className={styles.name}>
              {name}
            </div>
          )}

          <div
            className={cn(
              styles.childrenWrap,
              childrenAlignment,
              childrenGap,
            )}>
            {children}
          </div>

          {metadata != null && !isSystem && <div>{metadata}</div>}
        </div>
      </article>
    </ChatMessageContext>
  );
}

ChatMessage.displayName = 'ChatMessage';
