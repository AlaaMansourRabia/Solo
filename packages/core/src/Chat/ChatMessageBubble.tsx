'use client';

/**
 * @file ChatMessageBubble.tsx
 * @input Uses React, Tailwind classes, ChatMessageContext, theme tokens
 * @output Exports ChatMessageBubble component and ChatMessageBubbleProps
 * @position Styled content container — the actual "chat bubble" with sender-aware styling
 *
 * Reads sender from parent ChatMessage context to auto-style background.
 * Optional — not all message content needs bubble treatment.
 *
 * Usage guidance:
 * - If you use bubbles on one side (e.g. assistant), use them consistently
 *   for all messages on that side. Use `ghost` variant for content that
 *   needs alignment without a visual boundary.
 * - For custom content (cards, attachments, citations) that should span
 *   the full message column instead of the default width cap, combine
 *   `ghost` with `width="100%"`.
 * - Put `name` on the first bubble in a message, `metadata` on the last.
 * - For unbubbled messages, use ChatMessage's `name` and `metadata`
 *   props instead.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Chat/index.ts (exports)
 * - /apps/storybook/stories/Chat.stories.tsx
 */

import type {CSSProperties, ReactNode} from 'react';
import {useChatMessageContext} from './ChatContext';
import {isRenderable, mergeProps} from '../utils';
import type {SizeValue} from '../utils/types';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {cn, cssLength} from '../utils/cn';

export type ChatMessageBubbleVariant = 'filled' | 'ghost';

export interface ChatMessageBubbleProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Bubble content — text, Markdown, or any ReactNode.
   */
  children: ReactNode;

  /**
   * Visual variant.
   * - 'filled': background color based on sender (default)
   * - 'ghost': no background, but keeps padding for consistent alignment
   * @default 'filled'
   */
  variant?: ChatMessageBubbleVariant;

  /**
   * Sender name rendered above the bubble, aligned with bubble text padding.
   * Non-rendering scalar values omit the aligned wrapper; numeric zero remains.
   * Use when the first content in a message is a bubble.
   * If the first content is raw (no bubble), use ChatMessage's `name`
   * prop instead.
   */
  name?: ReactNode;

  /**
   * Metadata content rendered below the bubble, aligned with bubble text padding.
   * Non-rendering scalar values omit the aligned wrapper; numeric zero remains.
   * Use when the last content in a message is a bubble.
   * If the last content is raw (no bubble), use ChatMessage's `metadata`
   * prop instead.
   */
  metadata?: ReactNode;

  /**
   * Position within a multi-bubble group.
   * Controls corner radius reduction on the sender side.
   * - 'first': bottom sender-side corner tightened
   * - 'middle': both sender-side corners tightened
   * - 'last': top sender-side corner tightened
   * Leave unset for standalone bubbles (full radius).
   */
  group?: 'first' | 'middle' | 'last';

  /**
   * Width of the bubble.
   * Numbers are treated as pixels, strings are used as-is (e.g. "100%").
   * When set, replaces the default `max(80%, 280px)` width cap; leave unset
   * to keep the cap. Combine with `variant="ghost"` to let custom content
   * (an artifact card, attachments) span the full message column.
   */
  width?: SizeValue;
}

// =============================================================================
// Styles
// =============================================================================


const styles = {
  content: cn(
    'flex flex-col max-w-[max(80%,280px)]',
    // Bubbles are intentionally rounder than cards in the same view, so they
    // use the dedicated chat radius rather than coupling to --radius-page.
    'rounded-(--radius-chat)',
    'font-(family-name:--font-family-body) text-(length:--text-body-size) leading-(--text-body-leading)',
    'wrap-break-word [word-break:break-word]',
  ),
  radiusCompact: 'rounded-(--radius-container)',
  paddingCompact: 'py-(--spacing-3) px-(--spacing-4)',
  paddingBalanced: 'py-(--spacing-3) px-(--spacing-4)',
  paddingSpacious: 'py-(--spacing-4) px-(--spacing-5)',
  paddingBlockNone: 'py-0',
  // Slot padding — matches bubble's paddingInline per density
  metadataPaddingCompact: 'px-(--spacing-4)',
  metadataPaddingBalanced: 'px-(--spacing-4)',
  metadataPaddingSpacious: 'px-(--spacing-5)',
  metadataReducedGap: 'mbs-[calc(-1*var(--spacing-1-5))]',
  headerReducedGap: 'mbe-[calc(-1*var(--spacing-1-5))]',
  nameRow: 'h-(--spacing-5) flex items-center',
  alignEnd: 'text-end',
  // Sender backgrounds — same default, but separate styles for theme overrides.
  // Themes can target sender via legacy classes (.user/.assistant) or the
  // reflected data-sender attribute under @scope.
  assistant: 'bg-(--color-neutral) text-(--color-text-primary)',
  user: 'bg-(--color-neutral) text-(--color-text-primary)',
  ghost: 'bg-transparent text-(--color-text-primary)',
  // Grouped bubble corners — assistant (inline-start side tight).
  // Logical radii so the tail follows reading direction: inline-start is the
  // left edge under LTR and the right edge under RTL (assistant tucks toward
  // the start of the line in both directions).
  groupFirstAssistant: 'rounded-es-(--radius-inner)',
  groupMiddleAssistant: 'rounded-ss-(--radius-inner) rounded-es-(--radius-inner)',
  groupLastAssistant: 'rounded-ss-(--radius-inner)',
  // Grouped bubble corners — user (inline-end side tight).
  // Logical radii: inline-end is the right edge under LTR and the left edge
  // under RTL (user tucks toward the end of the line in both directions).
  groupFirstUser: 'rounded-ee-(--radius-inner)',
  groupMiddleUser: 'rounded-se-(--radius-inner) rounded-ee-(--radius-inner)',
  groupLastUser: 'rounded-se-(--radius-inner)',
} as const;

// Dynamic sizing: the width travels through a scoped custom property so a
// `className` can still override it. An explicit width replaces the default
// cap — a full-column or fixed-width bubble shouldn't also be clamped by
// max(80%, 280px).
const dynamicStyles = {
  sizing: 'w-(--_chat-bubble-width) max-w-none',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * Styled content container — the chat "bubble."
 *
 * Reads sender from parent ChatMessage context to auto-style background.
 * Use `group` prop for multi-bubble corner grouping.
 *
 * @example
 * ```
 * <ChatMessage sender="user">
 *   <ChatMessageBubble
 *     name="Sara"
 *     metadata={<ChatMessageMetadata timestamp="2:30 PM" status="read" />}>
 *     Hey, how's it going?
 *   </ChatMessageBubble>
 * </ChatMessage>
 * ```
 */
export function ChatMessageBubble({
  children,
  variant = 'filled',
  name,
  metadata,
  group,
  width,
  className,
  style: styleProp,
  'data-testid': testId,
  ref,
  ...rest
}: ChatMessageBubbleProps) {
  const msgContext = useChatMessageContext();
  const sender = msgContext?.sender ?? 'assistant';
  const density = msgContext?.density ?? 'balanced';

  const paddingStyle =
    density === 'compact'
      ? styles.paddingCompact
      : density === 'spacious'
        ? styles.paddingSpacious
        : styles.paddingBalanced;

  const isUser = sender === 'user';

  const senderStyle =
    variant === 'ghost'
      ? styles.ghost
      : isUser
        ? styles.user
        : styles.assistant;

  const groupStyle =
    group === 'first'
      ? isUser
        ? styles.groupFirstUser
        : styles.groupFirstAssistant
      : group === 'middle'
        ? isUser
          ? styles.groupMiddleUser
          : styles.groupMiddleAssistant
        : group === 'last'
          ? isUser
            ? styles.groupLastUser
            : styles.groupLastAssistant
          : null;

  const metadataPaddingStyle =
    density === 'compact'
      ? styles.metadataPaddingCompact
      : density === 'spacious'
        ? styles.metadataPaddingSpacious
        : styles.metadataPaddingBalanced;

  const hasName = isRenderable(name);
  const hasMetadata = isRenderable(metadata);

  return (
    <>
      {hasName && (
        <div
          data-chat-name
          className={cn(
            metadataPaddingStyle,
            styles.nameRow,
            styles.headerReducedGap,
            isUser && styles.alignEnd,
          )}>
          {name}
        </div>
      )}
      <div
        {...rest}
        ref={ref}
        data-testid={testId}
        {...mergeProps(
          themeProps('chat-message-bubble', {sender, variant, density}),
          {
            className: cn(
              styles.content,
              density === 'compact' && styles.radiusCompact,
              senderStyle,
              paddingStyle,
              variant === 'ghost' && styles.paddingBlockNone,
              groupStyle,
              width != null && dynamicStyles.sizing,
            ),
            style:
              width != null
                ? ({
                    '--_chat-bubble-width': cssLength(width),
                  } as CSSProperties)
                : undefined,
          },
          className,
          styleProp,
        )}>
        {children}
      </div>
      {hasMetadata && (
        <div
          className={cn(
            metadataPaddingStyle,
            styles.metadataReducedGap,
            isUser && styles.alignEnd,
          )}>
          {metadata}
        </div>
      )}
    </>
  );
}

ChatMessageBubble.displayName = 'ChatMessageBubble';
