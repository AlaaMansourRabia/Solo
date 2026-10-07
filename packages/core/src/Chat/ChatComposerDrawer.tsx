'use client';

/**
 * @file ChatComposerDrawer.tsx
 * @input Uses React, Tailwind classes, theme tokens
 * @output Exports ChatComposerDrawer component
 * @position Collapsible drawer panel for ChatComposer.
 *   Supports expanded (full content) and collapsed (default or caller-composed
 *   summary) states with fade animation and grid-template-rows height transition.
 *   The collapse toggle exposes aria-expanded + aria-controls linking it to
 *   the content region (disclosure pattern).
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Chat/ChatComposerDrawer.test.tsx
 * - /packages/core/src/Chat/ChatComposerDrawer.doc.mjs
 * - /apps/storybook/stories/ChatComposerDrawer.stories.tsx
 * - /packages/core/src/Chat/index.ts (exports)
 */

import {useId, useState, type ReactNode} from 'react';
import {Badge} from '../Badge';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';
import {useTranslator} from '../i18n';

export interface ChatComposerDrawerProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Content to render inside the drawer — attachments, context chips, previews, etc.
   */
  children: ReactNode;
  /**
   * Total item count — shown in the collapsed badge.
   * When omitted, the component doesn't support collapse.
   */
  count?: number;
  /**
   * Label shown next to the count in the default collapsed summary and used to
   * name the expand/collapse action.
   * @default 'Items'
   */
  label?: string;
  /**
   * Visual content for the canonical Collapsed summary anatomy part. Replaces
   * the complete default Badge and label when count enables collapse. The
   * component keeps this content presentation-only and owns disclosure
   * semantics and accessible naming.
   */
  collapsedSummary?: ReactNode;
  /**
   * Whether the drawer is collapsed.
   * Uncontrolled by default (internal toggle).
   */
  isCollapsed?: boolean;
  /**
   * Default collapsed state for uncontrolled usage.
   * @default false
   */
  defaultIsCollapsed?: boolean;
  /**
   * Callback when collapsed state changes.
   */
  onCollapsedChange?: (isCollapsed: boolean) => void;

  /**
   * Classes for layout customization (margins, positioning, sizing).
   *
   * @example
   * ```
   * <ChatComposerDrawer className="mt-[8px]">
   *   <AttachmentThumbnail />
   * </ChatComposerDrawer>
   * ```
   */
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

const styles = {
  root: cn(
    'relative z-1 flex flex-col overflow-hidden px-(--spacing-4) pbs-(--spacing-3)',
    // The drawer tucks behind the composer (negative marginBlockEnd) and its
    // top corners align with the composer's outer radius. Tracks the chat
    // radius to stay matched to the composer, decoupled from --radius-page.
    'pbe-[calc(var(--spacing-3)_+_var(--radius-chat))] mbe-[calc(-1*var(--radius-chat))]',
    // Surface base with a muted tint layered on top, both in the element's
    // own background layer. The muted backgroundImage composites over the
    // surface backgroundColor and — by CSS rule — paints behind all in-flow
    // content (tokens, labels, collapse handle) automatically. This restores
    // the original "surface bg + muted tint" intent without a
    // positioned ::before, so it needs no z-index and works whether muted is
    // opaque or translucent.
    'bg-(--color-background-surface)',
    '[background-image:linear-gradient(var(--color-background-muted),var(--color-background-muted))]',
    'rounded-ss-(--radius-chat) rounded-se-(--radius-chat)',
  ),

  // Toggle row — both the collapsed summary and bar handle live in the same
  // grid cell so they crossfade without layout shift.
  toggleRow: cn(
    'grid [grid-template-columns:1fr] items-center h-(--spacing-5)',
    'px-(--spacing-4) mx-[calc(-1*var(--spacing-4))]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default select-none',
  ),
  toggleCollapsed: '',
  toggleContent: cn(
    '[grid-row:1] [grid-column:1] [justify-self:start] inline-flex items-center pointer-events-none',
    'h-(--spacing-5) gap-(--spacing-2) rounded-(--radius-full) opacity-100',
    '[transition-property:opacity] [transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  toggleContentHidden: 'opacity-0 pointer-events-none',
  collapseLabel: cn(
    'text-(--color-text-secondary) can-hover:group-hover:text-(--color-text-primary)',
    'text-(length:--text-body-size) leading-(--spacing-5)',
    '[transition-property:color] [transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  collapseBarHandle: cn(
    '[grid-row:1] [grid-column:1] [justify-self:center] [align-self:start]',
    'w-(--spacing-5) h-(--spacing-0-5) rounded-(--radius-full)',
    'bg-(--color-icon-secondary) can-hover:group-hover:bg-(--color-icon-primary) opacity-100',
    '[transition-property:background-color,opacity] [transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  collapseBarHandleHidden: 'opacity-0 pointer-events-none',

  // Animated content area — height collapses via grid-template-rows,
  // items stay in place and fade in/out (no translateY slide).
  contentGrid: cn(
    'grid [grid-template-rows:1fr] [transition-property:grid-template-rows]',
    '[transition-duration:var(--duration-medium)] [transition-timing-function:var(--ease-standard)]',
  ),
  contentGridCollapsed: '[grid-template-rows:0fr]',
  content: cn(
    'min-h-0 flex flex-wrap gap-(--spacing-1) items-start opacity-100',
    '[transition-property:opacity] [transition-duration:var(--duration-medium)]',
    '[transition-delay:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  contentCollapsed:
    'opacity-0 [transition-delay:0ms] [transition-duration:var(--duration-fast)]',
} as const;

/**
 * Collapsible drawer panel for a chat composer.
 * Use for attachments, context chips, or any supplementary content above the input.
 *
 * @example
 * ```
 * <ChatComposerDrawer count={3}>
 *   <AttachmentThumbnail />
 *   <AttachmentThumbnail />
 * </ChatComposerDrawer>
 * ```
 */
export function ChatComposerDrawer({
  ref,
  children,
  count,
  label: labelFromProps,
  collapsedSummary,
  isCollapsed: controlledCollapsed,
  defaultIsCollapsed = false,
  onCollapsedChange,
  className,
  style,
  'data-testid': testId,
  ...htmlProps
}: ChatComposerDrawerProps): React.ReactElement {
  const t = useTranslator();
  const label = labelFromProps ?? t('@solo.chat.composerDrawer.label');
  const [internalCollapsed, setInternalCollapsed] =
    useState(defaultIsCollapsed);
  const isControlled = controlledCollapsed !== undefined;
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const canCollapse = count != null;

  // Links the toggle to the region it shows/hides so assistive tech can move
  // from the button to its controlled content (disclosure pattern). The
  // content stays mounted while collapsed (hidden via the grid-row collapse),
  // so the reference always resolves.
  const contentId = useId();

  const toggle = () => {
    const next = !isCollapsed;
    if (!isControlled) {
      setInternalCollapsed(next);
    }
    onCollapsedChange?.(next);
  };

  return (
    <div
      ref={ref}
      data-testid={testId}
      {...mergeProps(
        themeProps('chat-composer-drawer', {
          collapsed: isCollapsed ? 'collapsed' : null,
        }),
        {className: styles.root},
        className,
        style,
      )}
      {...htmlProps}>
      {canCollapse && (
        <div
          className={cn(
            focusOutlineStyles.focusVisible,
            styles.toggleRow,
            isCollapsed && styles.toggleCollapsed,
            'group',
          )}
          role="button"
          tabIndex={0}
          aria-expanded={!isCollapsed}
          aria-controls={contentId}
          aria-label={
            isCollapsed
              ? t('@solo.chatComposerDrawer.expand', {label})
              : t('@solo.chatComposerDrawer.collapse', {label})
          }
          onClick={toggle}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle();
            }
          }}>
          <div
            aria-hidden="true"
            inert
            className={cn(
              styles.toggleContent,
              !isCollapsed && styles.toggleContentHidden,
            )}>
            {collapsedSummary === undefined ? (
              <>
                <Badge variant="neutral" label={count} />
                <span className={styles.collapseLabel}>{label}</span>
              </>
            ) : (
              collapsedSummary
            )}
          </div>
          <div
            className={cn(
              styles.collapseBarHandle,
              isCollapsed && styles.collapseBarHandleHidden,
            )}
          />
        </div>
      )}

      <div
        id={contentId}
        // The 0fr row keeps the collapse animation in place. `inert` also
        // removes visually hidden descendants from keyboard and assistive-
        // technology navigation until the drawer expands again.
        inert={canCollapse && isCollapsed ? true : undefined}
        className={cn(
          styles.contentGrid,
          canCollapse && isCollapsed && styles.contentGridCollapsed,
        )}>
        <div
          className={cn(
            styles.content,
            canCollapse && isCollapsed && styles.contentCollapsed,
          )}>
          {children}
        </div>
      </div>
    </div>
  );
}

ChatComposerDrawer.displayName = 'ChatComposerDrawer';
