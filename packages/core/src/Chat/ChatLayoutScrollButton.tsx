'use client';

/**
 * @file ChatLayoutScrollButton.tsx
 * @input Uses React, Tailwind classes, Button, Icon, theme tokens
 * @output Exports ChatLayoutScrollButton component
 * @position Composable scroll-to-bottom button for use inside ChatLayout
 *
 * Renders inside the layout's dock container. Fades in when visible,
 * expands to show a label when provided (e.g. "New messages").
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Chat/index.ts (exports)
 */

import React from 'react';
import {cn} from '../utils/cn';
import {Icon} from '../Icon';
import {Button} from '../Button';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';

// =============================================================================
// Types
// =============================================================================

export interface ChatLayoutScrollButtonProps extends Omit<
  BaseProps<HTMLDivElement>,
  'onClick'
> {
  ref?: React.Ref<HTMLDivElement>;
  /** Whether the button is visible. */
  isVisible: boolean;
  /** Optional label — expands the button (e.g. "New messages"). */
  label?: string;
  /** Click handler. */
  onClick: () => void;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  wrapper: 'flex justify-center pbe-(--spacing-3)',
  container: cn(
    'pointer-events-auto [contain:layout_style] overflow-hidden rounded-(--radius-full)',
    'bg-(--color-background-popover) [box-shadow:var(--shadow-med)]',
    // The pill clips its own content, so it must track the height of the
    // md Button it wraps. A literal would clip that Button under any theme
    // that retunes the element scale.
    'h-(--size-element-md)',
    // `visibility` rides the same transition so the fade-out still plays:
    // it flips to `visible` immediately on the way in and only at the end
    // of the duration on the way out.
    '[transition-property:opacity,transform,max-width,visibility] [transition-timing-function:var(--ease-standard)]',
    '[transition-duration:var(--duration-fast-max)] motion-reduce:[transition-duration:0s]',
  ),
  // The hidden pill paints nothing, so focus landing on it would have no
  // visible indicator (WCAG 2.2 SC 2.4.7). `opacity` and `pointer-events`
  // leave the button in sequential focus navigation; `visibility` removes it.
  hidden: 'opacity-0 pointer-events-none invisible max-w-(--size-element-md)',
  visible: 'opacity-100 pointer-events-auto visible',
  collapsed: 'max-w-(--size-element-md)',
  expanded: 'max-w-[200px]',
  button:
    '[--radius-element:var(--radius-full)] whitespace-nowrap px-(--spacing-2)',
  // When a label is shown, the icon sits on the leading edge and the text on
  // the trailing edge. Symmetric padding leaves the text cramped against the
  // pill's rounded edge, so give the trailing side extra breathing room.
  buttonWithLabel: 'pe-(--spacing-3)',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * Floating scroll-to-bottom button for use inside ChatLayout.
 *
 * @example
 * ```
 * <ChatLayoutScrollButton isVisible={!isAtBottom} onClick={scrollToBottom} />
 * ```
 */
export function ChatLayoutScrollButton({
  ref,
  isVisible,
  label,
  onClick,
  className,
  style,
  ...rest
}: ChatLayoutScrollButtonProps) {
  const t = useTranslator();
  return (
    // Two elements, two responsibilities. The outer one centres the pill and
    // holds the gap above the composer — spacing outside the pill's border
    // box, which the pill cannot own itself. The inner one is the pill: it is
    // what a reader sees, so it carries the painted surface AND the public
    // theming target. Keeping the target on the outer element would satisfy
    // every automated check while leaving a theme styling an invisible
    // full-width row.
    <div
      ref={ref}
      {...mergeProps({className: styles.wrapper}, className, style)}
      {...rest}>
      <div
        {...mergeProps(
          themeProps('chat-layout-scroll-button'),
          {
            className: cn(
              styles.container,
              isVisible ? styles.visible : styles.hidden,
              label ? styles.expanded : styles.collapsed,
            ),
          },
        )}>
        <Button
          label={label ?? t('@solo.chatLayoutScrollButton.scrollToBottom')}
          aria-label={
            label ?? t('@solo.chatLayoutScrollButton.scrollToBottom')
          }
          icon={<Icon icon="chevronDown" size="md" />}
          variant="ghost"
          size="md"
          isIconOnly={!label}
          onClick={onClick}
          className={cn(styles.button, label && styles.buttonWithLabel)}>
          {label ?? undefined}
        </Button>
      </div>
    </div>
  );
}

ChatLayoutScrollButton.displayName = 'ChatLayoutScrollButton';
