'use client';

/**
 * @file ChatMessageList.tsx
 * @input Uses React, Tailwind classes, ChatListContext, theme tokens, spacing step utilities,
 *   and isRenderable to preserve accepted empty-state content
 * @output Exports ChatMessageList component and ChatMessageListProps
 * @position Presentational message container — holds ChatMessage children
 *
 * Renders a container with role="log" for chat message histories.
 * Handles density context, configurable gap, empty state,
 * a configurable spacer (align) that pushes messages to the bottom,
 * and an infinite scroll sentinel.
 *
 * Auto-scroll and the scroll-to-bottom button are owned by
 * ChatLayout. When used standalone (without a layout), the list
 * is purely presentational — compose useChatStreamScroll yourself if needed.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Chat/index.ts (exports)
 * - /apps/storybook/stories/Chat.stories.tsx
 */

import {type ReactNode, useEffect, useMemo, useRef, useTransition} from 'react';
import {cn} from '../utils/cn';
import {
  ChatListContext,
  type ChatDensity,
  useChatLayoutContext,
} from './ChatContext';
import {isRenderable, mergeProps} from '../utils';
import {Spinner} from '../Spinner';
import type {BaseProps} from '../BaseProps';
import type {SpacingStep} from '../utils/types';
import {themeProps} from '../utils/themeProps';

export interface ChatMessageListProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Message elements — typically ChatMessage components.
   * Also accepts Divider (date separators) or any ReactNode.
   */
  children: ReactNode;

  /**
   * Custom content when the list has no messages.
   */
  emptyState?: ReactNode;

  /**
   * Async action when the user scrolls to the top.
   * Use for loading older messages. Wrapped in useTransition —
   * shows a spinner at the top while pending.
   */
  scrollToTopAction?: () => Promise<void>;

  /**
   * Visual density — flows to child messages via context.
   * Individual messages can override.
   * @default 'balanced'
   */
  density?: ChatDensity;

  /**
   * Gap between top-level message rows, using the spacing scale.
   * Defaults to the selected density's gap. Override this when each
   * row is independent (for example, LLM event streams where messages cannot
   * be grouped) and row spacing should be tuned separately from density.
   */
  gap?: SpacingStep;

  /**
   * Vertical alignment of messages when the list is shorter than its
   * container.
   *
   * - `'bottom'` (default): a spacer fills the free space and pushes
   *   messages to the bottom, so a short conversation sits just above the
   *   composer — the familiar messaging-app layout.
   * - `'top'`: the spacer is omitted, so messages start at the top and grow
   *   downward — better for document-style or log-style lists.
   *
   * This only changes the resting position of a non-full list. Once messages
   * overflow the container the spacer collapses to zero in both modes, so
   * ChatLayout auto-scroll-to-bottom behavior is identical either way.
   *
   * @default 'bottom'
   */
  align?: 'top' | 'bottom';

  /**
   * Whether an assistant message is actively streaming into the list.
   *
   * The list is a `role="log"` / `aria-live="polite"` region, so while a
   * message streams in token-by-token, screen readers would otherwise
   * re-announce the accumulating partial text on every mutation. Set
   * `isStreaming` to `true` for the duration of a stream: it marks the log
   * `aria-busy="true"` so assistive tech waits and announces the completed
   * message once, when `isStreaming` returns to `false`.
   *
   * @default false
   */
  isStreaming?: boolean;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: 'flex flex-col flex-1 min-h-0',
  inner: 'flex flex-col flex-1 min-h-0',
  gapCompact: 'gap-(--spacing-2) py-(--spacing-2) px-(--spacing-3)',
  gapBalanced: 'gap-(--spacing-4) py-(--spacing-4) px-(--spacing-4)',
  gapSpacious: 'gap-(--spacing-6) py-(--spacing-6) px-(--spacing-6)',
  spacer: 'flex-1 min-h-0',
  loadingTop: 'flex justify-center py-(--spacing-3)',
  emptyState: 'flex items-center justify-center flex-1 min-h-0',
} as const;

const gapStyles = {
  0: 'gap-(--spacing-0)',
  0.5: 'gap-(--spacing-0-5)',
  1: 'gap-(--spacing-1)',
  1.5: 'gap-(--spacing-1-5)',
  2: 'gap-(--spacing-2)',
  3: 'gap-(--spacing-3)',
  4: 'gap-(--spacing-4)',
  5: 'gap-(--spacing-5)',
  6: 'gap-(--spacing-6)',
  8: 'gap-(--spacing-8)',
  10: 'gap-(--spacing-10)',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * Presentational container for chat messages.
 *
 * Renders messages in a flex column with density-based spacing.
 * Override gap to tune row spacing separately from density.
 * By default a spacer pushes content to the bottom when the list isn't full;
 * set `align='top'` to start messages at the top instead.
 * Supports loading older messages via `scrollToTopAction`.
 *
 * Auto-scroll and the scroll-to-bottom button are owned by
 * ChatLayout. Use useChatStreamScroll for standalone scroll control.
 *
 * @example
 * ```
 * <ChatMessageList>
 *   <ChatMessage sender="assistant" name="Navi" avatar={<Avatar name="Navi" size="md" />}>
 *     <ChatMessageBubble>Hello!</ChatMessageBubble>
 *   </ChatMessage>
 * </ChatMessageList>
 * ```
 */
export function ChatMessageList({
  children,
  emptyState,
  scrollToTopAction,
  density = 'balanced',
  gap,
  align = 'bottom',
  isStreaming = false,
  className,
  style,
  'data-testid': testId,
  ref,
  ...rest
}: ChatMessageListProps) {
  const layoutContext = useChatLayoutContext();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isLoadingTop, startTransition] = useTransition();

  // Register inner content element with the layout for height observation
  useEffect(() => {
    if (layoutContext?.contentRef && innerRef.current) {
      layoutContext.contentRef(innerRef.current);
      return () => layoutContext.contentRef(null);
    }
  }, [layoutContext]);

  const hasChildren =
    children != null &&
    children !== false &&
    !(Array.isArray(children) && children.length === 0);

  // IntersectionObserver for scroll-to-top infinite scroll
  useEffect(() => {
    const scrollContainer = layoutContext?.scrollContainerRef?.current;
    if (!scrollToTopAction || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          startTransition(async () => {
            await scrollToTopAction();
          });
        }
      },
      {root: scrollContainer ?? null, threshold: 0},
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [scrollToTopAction, layoutContext]);

  const contextValue = useMemo(() => ({density}), [density]);

  const densityGapStyle =
    density === 'compact'
      ? styles.gapCompact
      : density === 'spacious'
        ? styles.gapSpacious
        : styles.gapBalanced;
  const gapOverrideStyle = gap == null ? null : gapStyles[gap];

  return (
    <ChatListContext value={contextValue}>
      <div
        {...rest}
        ref={ref}
        role="log"
        aria-live="polite"
        aria-busy={isStreaming || undefined}
        tabIndex={0}
        data-testid={testId}
        {...mergeProps(
          themeProps('chat-message-list', {density}),
          {className: styles.root},
          className,
          style,
        )}>
        <div
          ref={innerRef}
          className={cn(styles.inner, densityGapStyle, gapOverrideStyle)}>
          {/* Sentinel for infinite scroll */}
          {scrollToTopAction && <div ref={sentinelRef} aria-hidden />}

          {/* Loading spinner at top */}
          {isLoadingTop && (
            <div className={styles.loadingTop}>
              <Spinner size="md" />
            </div>
          )}

          {/* Spacer pushes messages to bottom when the list isn't full.
              Omitted for top alignment so messages start at the top. */}
          {align === 'bottom' && (
            <div className={styles.spacer} aria-hidden />
          )}

          {/* Messages or empty state */}
          {hasChildren ? (
            children
          ) : isRenderable(emptyState) ? (
            <div className={styles.emptyState}>{emptyState}</div>
          ) : null}
        </div>
      </div>
    </ChatListContext>
  );
}

ChatMessageList.displayName = 'ChatMessageList';
