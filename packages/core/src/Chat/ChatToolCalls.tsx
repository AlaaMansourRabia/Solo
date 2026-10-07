'use client';

/**
 * @file ChatToolCalls.tsx
 * @input Uses React, Tailwind classes, semantic icon registry, theme tokens
 * @output Exports ChatToolCalls component
 * @position Chat component — displays tool/function call invocations
 *
 * Single component that handles both individual and grouped tool calls.
 * Accepts an array of call data matching the shape LLM APIs already return.
 * Single call renders inline; multiple calls get a collapsible summary.
 *
 * Design rationale: every LLM API (Vercel AI SDK, Anthropic, OpenAI)
 * returns tool calls as an array on the message. One component with a
 * data prop matches that shape directly — no nested compound components
 * for builders to wire up.
 */

import React, {useState, useCallback, useId, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {cn} from '../utils/cn';
import {getKey, mergeProps} from '../utils';
import {Badge} from '../Badge';
import {Icon, type IconName} from '../Icon';
import {Spinner} from '../Spinner';
import {VisuallyHidden} from '../VisuallyHidden';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {useTranslator} from '../i18n';

// =============================================================================
// Types
// =============================================================================

export type ChatToolCallStatus = 'pending' | 'running' | 'complete' | 'error';

export interface ChatToolCallItem {
  /** Tool/function name. */
  name: string;
  /** Current execution status. @default 'complete' */
  status?: ChatToolCallStatus;
  /** The target of the action (e.g. "Button.tsx", "yarn test", "CSS anchor positioning"). */
  target?: string;
  /** Duration string (e.g. "1.2s", "340ms"). Shown when complete. */
  duration?: string;
  /** Sandbox/node name (e.g. "navi", "web"). Shown as a pill badge. */
  node?: string;
  /** Lines/characters added. Rendered in green (e.g. "+12"). */
  additions?: number;
  /** Lines/characters removed. Rendered in red (e.g. "-3"). */
  deletions?: number;
  /** Additional info rendered after the label. Free-form ReactNode. */
  stats?: ReactNode;
  /**
   * Error message when status is 'error'. Exposed as visually hidden text in
   * the row for assistive technology and echoed in a hover tooltip on the
   * status icon.
   */
  errorMessage?: string;
  /** Unique key for React list rendering. Derived from stable metadata if omitted. */
  key?: string;
  /** Arbitrary caller data retained with the call item. */
  data?: unknown;
  /** Inline detail content shown when the row is expanded (e.g. code diff, command output). */
  resultDetail?: ReactNode;
}

export interface ChatToolCallsProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /** Array of tool call data. */
  calls: ChatToolCallItem[];
  /** Custom summary label shown for an expanded group. */
  label?: string;
  /** Whether the group is expanded. Uncontrolled by default. */
  isExpanded?: boolean;
  /** Default expanded state when uncontrolled. @default false */
  defaultIsExpanded?: boolean;
  /** Callback when expanded state changes. */
  onExpandedChange?: (isExpanded: boolean) => void;
}

// =============================================================================
// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: 'flex flex-col mbs-(--spacing-2)',
  groupHeader: cn(
    'flex items-center gap-(--spacing-1-5)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default select-none',
    'min-h-[24px] py-(--spacing-0-5)',
  ),
  groupIcon:
    'inline-flex items-center justify-center shrink-0 w-[16px] h-[16px] text-(--color-text-secondary)',
  groupLabel: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'font-(family-name:--font-family-body) font-(number:--font-weight-medium) text-(--color-text-secondary)',
  ),
  chevron:
    'inline-flex items-center justify-center shrink-0 w-[14px] h-[14px] text-(--color-text-secondary)',
  // Rides on the chevron <Icon> (via `className`), next to the rotation it
  // animates, so one element carries both the transform and the theme target.
  chevronTransition:
    '[transition:transform_var(--duration-fast)_var(--ease-standard)] motion-reduce:[transition:none]',
  chevronExpanded: '[transform:rotate(180deg)]',
  groupContent: cn(
    'grid [grid-template-rows:0fr]',
    '[transition:grid-template-rows_var(--duration-medium)_var(--ease-standard)] motion-reduce:[transition:none]',
  ),
  groupContentExpanded: '[grid-template-rows:1fr]',
  groupContentInner: cn(
    'overflow-hidden min-h-0',
    // `list` (and, within it, each `callRowClickable` row) overhangs its own
    // content box by `--spacing-1` on each inline edge via a negative margin,
    // so its hover background can extend past the text column without
    // widening the layout — `list`'s own matching paddingInline absorbs the
    // row-level overhang, but `list`'s negative margin then overhangs *this*
    // element's box by the same amount, and this is the clip boundary the
    // grid height animation needs `overflow: hidden` for. Mirror the same
    // padding/negative-margin pair here so that overhang is absorbed too,
    // instead of clipped — matching the ungrouped single-call row, which has
    // no such wrapper to clip it.
    'px-(--spacing-1) mx-[calc(-1*var(--spacing-1))]',
  ),
  list: 'flex flex-col px-(--spacing-1) mx-[calc(-1*var(--spacing-1))]',
  listIndented: 'ps-0',

  // Individual call row
  callRow: 'flex items-center gap-(--spacing-1-5) min-h-[24px] py-(--spacing-0-5)',
  callRowFocusInset:
    'focus-visible:[outline-offset:calc(-1*var(--focus-outline-width))]',
  callRowClickable: cn(
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'rounded-(--radius-element) px-(--spacing-1) mx-[calc(-1*var(--spacing-1))]',
    'can-hover:hover:usable:bg-(--color-overlay-hover)',
  ),
  callRowToggle:
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  statusIcon:
    'relative inline-flex items-center justify-center shrink-0 w-[16px] h-[16px] rounded-(--radius-full)',
  callName: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'font-(family-name:--font-family-code) font-(number:--font-weight-medium) text-(--color-text-secondary)',
    'whitespace-nowrap overflow-hidden text-ellipsis shrink min-w-[4ch]',
  ),
  callLabel: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'font-(family-name:--font-family-body) text-(--color-text-secondary)',
    'whitespace-nowrap overflow-hidden text-ellipsis shrink-10 min-w-0',
  ),
  callDuration: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'font-(family-name:--font-family-body) text-(--color-text-secondary) whitespace-nowrap shrink-0',
  ),
  nodePill: 'shrink-0',
  stats: cn(
    'flex items-center gap-(--spacing-1)',
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'font-(family-name:--font-family-body) text-(--color-text-secondary) shrink-0',
  ),
  statsAdditions: 'text-(--color-success)',
  statsDeletions: 'text-(--color-error)',
  errorText: 'text-(--color-error)',

  // Inline result detail
  callDetailChevron:
    'inline-flex items-center justify-center shrink-0 w-[14px] h-[14px] text-(--color-text-secondary) ms-auto',
  callDetailContent:
    'ps-[calc(16px_+_var(--spacing-1-5))] pbe-(--spacing-2)',
  callCount: cn(
    'inline-flex items-center gap-(--spacing-0-5)',
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'font-(family-name:--font-family-body) text-(--color-text-secondary) shrink-0',
  ),

  // Pile effect for grouped tool calls
  pileWrapper: 'relative',
  pileCard:
    'absolute inset-x-0 top-0 h-full rounded-(--radius-element) bg-(--color-background-muted) opacity-50',
  pileCard1: '[transform:translateY(-3px)_scale(0.985)] opacity-30',
  pileCard2: '[transform:translateY(-6px)_scale(0.97)] opacity-15',

  // Status colors
  colorPending: 'text-(--color-text-disabled)',
  colorRunning: 'text-(--color-accent)',
  colorComplete: 'text-(--color-success)',
  colorError: 'text-(--color-error)',
} as const;

// =============================================================================
// Status Icons
// =============================================================================

const STATUS_ICON_NAMES: Record<ChatToolCallStatus, IconName | null> = {
  pending: 'clock',
  running: null,
  complete: 'success',
  error: 'error',
};

const STATUS_STYLES: Record<ChatToolCallStatus, string> = {
  pending: styles.colorPending,
  running: styles.colorRunning,
  complete: styles.colorComplete,
  error: styles.colorError,
};

function getStatusAnnouncement(
  t: ReturnType<typeof useTranslator>,
  status: ChatToolCallStatus,
  errorMessage?: string,
): string {
  if (status === 'error' && errorMessage != null) {
    return t('@solo.chatToolCalls.error', {message: errorMessage});
  }
  switch (status) {
    case 'pending':
      return t('@solo.chatToolCalls.status.pending');
    case 'running':
      return t('@solo.chatToolCalls.status.running');
    case 'complete':
      return t('@solo.chatToolCalls.status.complete');
    case 'error':
      return t('@solo.chatToolCalls.status.error');
  }
}

function getToolCallKey(call: ChatToolCallItem): string {
  return getKey(call.key, () =>
    [
      call.name,
      call.status ?? 'complete',
      call.target ?? '',
      call.node ?? '',
      call.duration ?? '',
      call.additions?.toString() ?? '',
      call.deletions?.toString() ?? '',
      call.errorMessage ?? '',
    ].join('\u001F'),
  );
}

// =============================================================================
// Internal: single call row
// =============================================================================

function CallRow({
  call,
  hasClippedFocusRing = false,
}: {
  call: ChatToolCallItem;
  hasClippedFocusRing?: boolean;
}) {
  const t = useTranslator();
  const status = call.status ?? 'complete';
  const hasDetail = call.resultDetail != null;
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const detailId = useId();
  const statusAnnouncement = getStatusAnnouncement(
    t,
    status,
    call.errorMessage,
  );

  const toggleDetail = hasDetail
    ? () => setIsDetailOpen(prev => !prev)
    : undefined;

  const row = (
    <div
      role={hasDetail ? 'button' : undefined}
      tabIndex={hasDetail ? 0 : undefined}
      aria-expanded={hasDetail ? isDetailOpen : undefined}
      aria-controls={hasDetail && isDetailOpen ? detailId : undefined}
      onClick={toggleDetail}
      onKeyDown={
        hasDetail
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDetail?.();
              }
            }
          : undefined
      }
      className={cn(
        focusOutlineStyles.focusVisible,
        styles.callRow,
        hasDetail && styles.callRowClickable,
        hasDetail && hasClippedFocusRing && styles.callRowFocusInset,
      )}>
      <span
        title={status === 'error' ? call.errorMessage : undefined}
        className={cn(styles.statusIcon, STATUS_STYLES[status])}>
        {status === 'running' ? (
          <Spinner size="sm" shade="subtle" aria-hidden="true" />
        ) : status === 'pending' ? (
          <Spinner size="sm" shade="subtle" aria-hidden="true" />
        ) : (
          <Icon
            icon={STATUS_ICON_NAMES[status] ?? 'success'}
            size="xsm"
            color="inherit"
          />
        )}
        <VisuallyHidden>{statusAnnouncement}</VisuallyHidden>
      </span>
      <span className={styles.callName}>{call.name}</span>
      {call.node != null && (
        <Badge label={call.node} variant="neutral" className={styles.nodePill} />
      )}
      {call.target != null && (
        <span className={styles.callLabel}>{call.target}</span>
      )}
      {(call.additions != null ||
        call.deletions != null ||
        call.stats != null) && (
        <span className={styles.stats}>
          {call.additions != null && (
            <span className={styles.statsAdditions}>
              +{call.additions}
            </span>
          )}
          {call.deletions != null && (
            <span className={styles.statsDeletions}>
              -{call.deletions}
            </span>
          )}
          {call.stats}
        </span>
      )}
      {call.duration != null && status === 'complete' && (
        <span className={styles.callDuration}>{call.duration}</span>
      )}
      {hasDetail && (
        <span className={styles.callDetailChevron}>
          <Icon
            icon="chevronDown"
            size="xsm"
            color="inherit"
            className={cn(
              styles.chevronTransition,
              isDetailOpen && styles.chevronExpanded,
            )}
          />
        </span>
      )}
    </div>
  );

  if (!hasDetail) {
    return row;
  }

  return (
    <div>
      {row}
      {isDetailOpen && (
        <div id={detailId} className={styles.callDetailContent}>
          {call.resultDetail}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

/**
 * Displays tool/function call invocations from an LLM response.
 *
 * Accepts a `calls` array matching the shape LLM APIs return. Single call
 * renders inline without group chrome. Multiple calls get a collapsible
 * summary header.
 *
 * @example
 * ```
 * <ChatToolCalls
 *   calls={message.toolCalls.map(tc => ({
 *     name: tc.toolName,
 *     status: tc.state,
 *     duration: tc.duration,
 *     resultDetail: <CodeBlock code={tc.args} language="json" />,
 *   }))}
 * />
 * ```
 */
export function ChatToolCalls(props: ChatToolCallsProps) {
  const t = useTranslator();
  const {
    calls,
    label: customLabel,
    isExpanded: controlledExpanded,
    defaultIsExpanded,
    onExpandedChange,
    className,
    style,
    ref,
    ...rest
  } = props;

  const autoDefault = defaultIsExpanded ?? false;
  const [internalExpanded, setInternalExpanded] = useState(autoDefault);
  const contentId = useId();
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const toggle = useCallback(() => {
    const next = !isExpanded;
    if (!isControlled) {
      setInternalExpanded(next);
    }
    onExpandedChange?.(next);
  }, [isExpanded, isControlled, onExpandedChange]);

  if (calls.length === 0) {
    return null;
  }

  // Single call: render inline, no group chrome
  if (calls.length === 1) {
    return (
      <div
        ref={ref}
        {...mergeProps(
          themeProps('chat-tool-calls'),
          {className: styles.root},
          className,
          style,
        )}
        {...rest}>
        <CallRow call={calls[0]} />
      </div>
    );
  }

  // Multiple calls: latest call at surface with chevron to expand all
  const latestCall = calls[calls.length - 1];
  const latestStatus = latestCall.status ?? 'complete';
  const latestStatusAnnouncement = getStatusAnnouncement(
    t,
    latestStatus,
    latestCall.errorMessage,
  );

  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('chat-tool-calls'),
        {className: styles.root},
        className,
        style,
      )}
      {...rest}>
      {/* Header: collapsed shows latest call + count, expanded shows summary label */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={toggle}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        className={cn(
          focusOutlineStyles.focusVisible,
          styles.callRow,
          styles.callRowToggle,
        )}>
        {isExpanded ? (
          <>
            <span className={styles.groupIcon}>
              <Icon icon="wrench" size="sm" color="inherit" />
            </span>
            <span className={styles.groupLabel}>
              {customLabel ??
                t('@solo.chatToolCalls.groupLabel', {count: calls.length})}
            </span>
          </>
        ) : (
          <>
            <span
              className={cn(styles.statusIcon, STATUS_STYLES[latestStatus])}>
              {latestStatus === 'running' ? (
                <Spinner size="sm" shade="subtle" aria-hidden="true" />
              ) : latestStatus === 'pending' ? (
                <Spinner size="sm" shade="subtle" aria-hidden="true" />
              ) : (
                <Icon
                  icon={STATUS_ICON_NAMES[latestStatus] ?? 'success'}
                  size="xsm"
                  color="inherit"
                />
              )}
              <VisuallyHidden>{latestStatusAnnouncement}</VisuallyHidden>
            </span>
            <span className={styles.callName}>{latestCall.name}</span>
            {latestCall.target != null && (
              <span className={styles.callLabel}>
                {latestCall.target}
              </span>
            )}
          </>
        )}
        <span className={styles.callCount}>
          {!isExpanded && (
            <>
              <Icon icon="wrench" size="xsm" color="inherit" />
              {calls.length}
            </>
          )}
        </span>
        <span className={styles.chevron}>
          <Icon
            icon="chevronDown"
            size="xsm"
            color="inherit"
            className={cn(
              styles.chevronTransition,
              isExpanded && styles.chevronExpanded,
            )}
          />
        </span>
      </div>

      {/* Expanded: all calls with full metadata */}
      <div
        id={contentId}
        inert={isExpanded ? undefined : true}
        className={cn(
          styles.groupContent,
          isExpanded && styles.groupContentExpanded,
        )}>
        <div className={styles.groupContentInner}>
          <div className={styles.list}>
            {calls.map(call => (
              <CallRow
                key={getToolCallKey(call)}
                call={call}
                hasClippedFocusRing
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

ChatToolCalls.displayName = 'ChatToolCalls';
