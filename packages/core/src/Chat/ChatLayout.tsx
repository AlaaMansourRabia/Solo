'use client';

/**
 * @file ChatLayout.tsx
 * @input Uses React, Tailwind classes, theme tokens, useChatStreamScroll, useChatNewMessages
 * @output Exports ChatLayout component and ChatLayoutProps
 * @position Layout shell for full chat interfaces — messages in page flow, composer fixed to bottom
 *
 * Structural layout only — scroll behavior is delegated to hooks.
 * Provides the scroll container ref and content ref, renders the
 * scroll-to-bottom button, frosted glass dock, and message area.
 *
 * Layout contract: the root is a flex column. The message area flexes
 * (grow 1, shrink 0) to fill the space the dock doesn't need; the sticky
 * dock keeps its natural height in flow. Short content therefore fills
 * exactly 100% with no overflow, and long content grows past the root so
 * self-scroll mode scrolls. In external-scrollRef mode the dock
 * is position: fixed (out of flow) and the message area fills the root.
 *
 * Density (compact/balanced/spacious) is controlled via a prop with
 * 'balanced' as the default. No JS measurement or ResizeObserver needed.
 * The container-type on root enables container queries in child components.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Chat/index.ts (exports)
 * - /apps/storybook/stories/ChatLayout.stories.tsx
 */

import {type ReactNode, useMemo, useRef} from 'react';
import {cn} from '../utils/cn';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {useChatStreamScroll} from './useChatStreamScroll';
import {useChatNewMessages} from './useChatNewMessages';
import {ChatLayoutScrollButton} from './ChatLayoutScrollButton';
import {ChatLayoutContext} from './ChatContext';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';

import {useMergedRefs} from '../hooks/useMergedRefs';
// =============================================================================
// Types
// =============================================================================

type Density = 'compact' | 'balanced' | 'spacious';

export interface ChatLayoutProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element. */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Message content — flows naturally in the page, scrolls with the page.
   * Typically ChatMessageList with ChatMessage children.
   */
  children: ReactNode;

  /**
   * Composer element — fixed to the bottom with a frosted glass dock.
   * Typically ChatComposer.
   */
  composer: ReactNode;

  /**
   * Content shown when children is empty.
   */
  emptyState?: ReactNode;

  /**
   * Scroll-to-bottom button rendered above the composer in the dock.
   * Defaults to ChatLayoutScrollButton with useChatStreamScroll.
   * Pass a custom ReactNode to override, or `null` to hide.
   */
  scrollButton?: ReactNode | null;

  /**
   * External scroll container ref. When provided, auto-scroll and
   * scroll-to-bottom target this element instead of the layout root.
   *
   * @example
   * ```
   * const scrollRef = useRef(document.documentElement);
   * <ChatLayout scrollRef={scrollRef} composer={...}>...</ChatLayout>
   * ```
   *
   * When omitted, the layout root itself is the scroll container.
   */
  scrollRef?: React.RefObject<HTMLElement | null>;

  /**
   * Layout density. Controls spacing, max-width, and blur layer sizing.
   *
   * @default 'balanced'
   */
  density?: Density;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: cn(
    'relative [container-type:inline-size] min-h-0 flex-1',
    // Flex column so the sticky dock's natural height is part of the 100%:
    // messageArea flexes to fill the leftover space instead of forcing
    // minHeight: 100% on its own. Without this, the in-flow sticky dock
    // adds its full height on top of the 100% message area and the root
    // always overflows by exactly the dock height.
    'flex flex-col',
  ),
  rootScrollable: cn(
    'overflow-y-auto overflow-x-hidden',
    // Hide scrollbar during programmatic scroll animation
    // to prevent flash. Restored when animation settles.
    '[&:is([data-solo-scrolling])]:[scrollbar-width:none]',
  ),

  messageArea: cn(
    'flex flex-col mx-auto',
    // Fill the space the dock doesn't need (grow), but never shrink below
    // content height — long content must overflow the root so it scrolls.
    'grow shrink-0 basis-auto',
    'pbe-(--spacing-6) w-full max-w-full px-0',
  ),

  emptyState: 'flex items-center justify-center flex-1 min-h-[200px]',

  // --- Dock container ---
  dockContainer: cn(
    'bottom-0 start-0 end-0 z-0 isolate pointer-events-none',
    // Keep the sticky dock at its natural height as a flex item.
    // (Inert in fixed mode — position: fixed takes it out of flex layout.)
    'shrink-0',
  ),
  dockContainerFixed: 'fixed',
  dockContainerSticky: 'sticky',

  blurLayer: cn(
    'absolute bottom-0 start-0 end-0 pointer-events-none',
    '[backdrop-filter:blur(12px)] [-webkit-backdrop-filter:blur(12px)]',
    'h-[100px] [mask-image:linear-gradient(to_bottom,transparent,black_36px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_36px)]',
  ),

  dock: 'relative z-1 pointer-events-auto px-(--spacing-3) pbe-(--spacing-3)',

  dockInner: 'mx-auto w-full max-w-full',

  // --- Forced density overrides (disable container queries) ---
  messageAreaCompact: 'max-w-full px-0',
  messageAreaBalanced: 'max-w-full px-0',
  messageAreaSpacious: 'max-w-[800px] px-(--spacing-4)',

  blurLayerCompact: 'h-[80px] [mask-image:linear-gradient(to_bottom,transparent,black_24px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_24px)]',
  blurLayerBalanced: 'h-[100px] [mask-image:linear-gradient(to_bottom,transparent,black_36px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_36px)]',
  blurLayerSpacious: 'h-[120px] [mask-image:linear-gradient(to_bottom,transparent,black_48px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_48px)]',

  dockCompact: 'px-(--spacing-2) pbe-(--spacing-2)',
  dockBalanced: 'px-(--spacing-3) pbe-(--spacing-3)',
  dockSpacious: 'px-(--spacing-4) pbe-(--spacing-3)',

  dockInnerCompact: 'max-w-full',
  dockInnerBalanced: 'max-w-full',
  dockInnerSpacious: 'max-w-[800px]',
} as const;

// =============================================================================
// Helpers
// =============================================================================

function hasVisibleContent(children: ReactNode): boolean {
  if (children == null || children === false) {
    return false;
  }
  if (Array.isArray(children) && children.length === 0) {
    return false;
  }
  return true;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Layout shell for a full chat interface: messages in page flow, composer
 * docked to the bottom behind a frosted glass layer, with auto-scroll and a
 * scroll-to-bottom button wired in.
 *
 * @example
 * ```
 * <ChatLayout
 *   density="spacious"
 *   composer={<ChatComposer onSubmit={send} />}
 *   emptyState={<EmptyState title="No messages yet" />}>
 *   <ChatMessageList>
 *     <ChatMessage sender="assistant">
 *       <ChatMessageBubble>How can I help?</ChatMessageBubble>
 *     </ChatMessage>
 *   </ChatMessageList>
 * </ChatLayout>
 * ```
 */
export function ChatLayout({
  children,
  composer,
  density = 'balanced',
  emptyState,
  scrollButton,
  scrollRef: externalScrollRef,
  className,
  style,
  'data-testid': testId,
  ref,
  ...rest
}: ChatLayoutProps) {
  const t = useTranslator();
  const rootRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = externalScrollRef ?? rootRef;
  const isSelfScrolling = !externalScrollRef;

  // --- Default scroll behavior ---
  const scroll = useChatStreamScroll({scrollRef: scrollContainerRef});
  const newMsgs = useChatNewMessages({
    isLocked: scroll.isLocked,
    onResize: scroll.scrollIfLocked,
  });

  const defaultScrollButton = (
    <ChatLayoutScrollButton
      isVisible={scroll.isScrolledUp || newMsgs.hasNewMessages}
      label={
        newMsgs.hasNewMessages ? t('@solo.chatLayout.newMessages') : undefined
      }
      onClick={() => {
        newMsgs.dismiss();
        scroll.scrollToBottom();
      }}
    />
  );

  // --- Layout context ---
  const layoutContext = useMemo(
    () => ({scrollContainerRef, contentRef: newMsgs.contentRef}),
    [scrollContainerRef, newMsgs.contentRef],
  );

  // --- Derived styles ---
  const showEmpty = !hasVisibleContent(children);

  const densityStyles = {
    compact: {
      messageArea: styles.messageAreaCompact,
      blurLayer: styles.blurLayerCompact,
      dock: styles.dockCompact,
      dockInner: styles.dockInnerCompact,
    },
    balanced: {
      messageArea: styles.messageAreaBalanced,
      blurLayer: styles.blurLayerBalanced,
      dock: styles.dockBalanced,
      dockInner: styles.dockInnerBalanced,
    },
    spacious: {
      messageArea: styles.messageAreaSpacious,
      blurLayer: styles.blurLayerSpacious,
      dock: styles.dockSpacious,
      dockInner: styles.dockInnerSpacious,
    },
  } as const;

  const currentDensity = densityStyles[density];

  return (
    <ChatLayoutContext value={layoutContext}>
      <div
        {...rest}
        ref={useMergedRefs(ref, rootRef)}
        data-testid={testId}
        {...mergeProps(
          themeProps('chat-layout', {density}),
          {
            className: cn(
              styles.root,
              isSelfScrolling && styles.rootScrollable,
            ),
          },
          className,
          style,
        )}>
        {/* Message area */}
        <div className={cn(styles.messageArea, currentDensity.messageArea)}>
          {showEmpty && emptyState ? (
            <div className={styles.emptyState}>{emptyState}</div>
          ) : (
            children
          )}
        </div>

        {/* Dock container — sticky/fixed, holds blur + scroll button + composer */}
        <div
          className={cn(
            styles.dockContainer,
            isSelfScrolling
              ? styles.dockContainerSticky
              : styles.dockContainerFixed,
          )}>
          {/* Scroll-to-bottom button */}
          {scrollButton === undefined ? defaultScrollButton : scrollButton}

          {/* Frosted glass layer */}
          <div className={cn(styles.blurLayer, currentDensity.blurLayer)} />

          {/* Composer */}
          <div className={cn(styles.dock, currentDensity.dock)}>
            <div className={cn(styles.dockInner, currentDensity.dockInner)}>
              {composer}
            </div>
          </div>
        </div>
      </div>
    </ChatLayoutContext>
  );
}

ChatLayout.displayName = 'ChatLayout';
