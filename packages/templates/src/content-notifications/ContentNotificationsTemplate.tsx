'use client';

/**
 * Notifications: a chronological stream of things that happened to the
 * reader's work, grouped by day, that they triage — read it, act on it, or
 * turn it down.
 *
 * The fixture is the notification center of a fictional project tool used by
 * an architecture studio: mentions in documents, tasks assigned, approvals
 * waiting on a budget or a change order, and a few system events (a deadline,
 * an export, an archived project). What picks this template is the shape of
 * the data, not the domain: **events about the reader, newest first, each one
 * with a read state and sometimes one obvious next step.** If the rows are
 * records the reader manages — sortable, comparable, edited in place — use a
 * table template (`table-inbox` for a triage queue with a reading pane). If the
 * rows are a conversation, use `messaging-shell`. If the page is a log of what
 * *everyone* did, for auditing rather than acting, it is a table with filters.
 *
 * ## Extending this template
 *
 * ### The feed
 *
 * **Group by calendar day, computed from the timestamp.** Today, Yesterday and
 * Earlier this week are derived from each event's time against the start of
 * the reader's day, never stored on the event. The fixture is written as "day
 * offset + time of day" (and, for today, minutes ago clamped to after
 * midnight) so it groups the same way on any date. When events come from a
 * server, keep the grouping on the client: "Yesterday" depends on the
 * reader's time zone, not the server's.
 *
 * **Every time is a `Timestamp`, formatted to agree with its group.** Today
 * reads "4 minutes ago"; Yesterday shows the time of day; Earlier this week
 * shows the weekday. Relative time counts elapsed hours, not calendar days, so
 * `format="auto"` would print "1 day ago" under an "Earlier this week"
 * heading — `TIME_FORMAT` picks the format per group instead. The hover card
 * gives the exact time either way, and the component localizes the text
 * (Arabic gets its own word order and numerals); never print "2h" yourself.
 *
 * **Unread is three signals, not one.** An unread row has a `StatusDot`
 * (labelled "Unread" for screen readers), a faint accent wash and a
 * semibold sentence. The dot alone would be colour-only meaning, which the
 * StatusDot docs rule out; the weight change carries it for everyone. The
 * header count is arithmetic over the list (`items.filter(unread)`), so it can
 * never disagree with the dots.
 *
 * ### Sentences
 *
 * **A notification is a sentence with two emphasised nouns.** "**Omar Haddad**
 * mentioned you in **Q4 site plan**" — the actor and the object are what the
 * eye scans for; the verb phrase between them is quiet text. The object is a
 * `Link` because it navigates (to the document, task or approval); following
 * it marks the notification read, which is what opening it means.
 *
 * **Compose sentences from a message format in production.** Here each
 * sentence is rendered as actor + verb phrase + object so the preview can
 * translate each fragment on its own, and the fixture keeps every verb phrase
 * to one grammatical gender ("requested your approval for" is only ever used
 * by a woman) because Arabic verbs agree with their subject. A real app should
 * render the whole sentence from one ICU message —
 * `{actor} mentioned you in {target}` with a gender `select` — so translators
 * can reorder the parts and inflect the verb. Do not glue English fragments
 * with `+` and hope the word order survives.
 *
 * **System events have an icon, not an avatar.** Avatar is for people (its
 * docs say so); a deadline, an export or an archive gets a neutral circle with
 * a meaningful icon and a "Label: object" sentence that reads naturally in
 * both directions.
 *
 * ### Acting on a notification
 *
 * **The one obvious next step is on the row.** Approvals show Approve and
 * Decline; mentions and replies show Reply. These are the reasons the reader
 * opened the feed, so they stay visible rather than in the overflow menu
 * (MoreMenu's first Don't). Both are `secondary`/`ghost`: a feed can hold many
 * approvals, and a page with ten primary buttons has none.
 *
 * **Resolving replaces the actions with the outcome.** After Approve, the row
 * says "You approved this" in place of the buttons, so the decision stays
 * visible in the history. It is plain text with an icon, not a `Badge` —
 * nobody needs to act on a finished approval. The Toast offers Undo because a
 * slip on the wrong row is the likely mistake.
 *
 * **Reply opens in place.** A `TextArea` appears under the row, scoped to that
 * notification; sending marks it read and confirms with a Toast. A Dialog
 * would hide the very message being answered.
 *
 * **Everything else is in the MoreMenu**: read/unread, mute the thread, and
 * turn this kind of notification off for the project. Muting is shown on the
 * row ("Muted") so a silent thread is explainable later. Turning notifications
 * off is a settings change made from the feed; the Toast says what changed
 * and offers Undo, and the settings link in the header is where it can be
 * reviewed.
 *
 * ### Filters and empty states
 *
 * **`SegmentedControl`, not `TabList`, for All / Mentions / Assigned /
 * Approvals.** The control narrows the same feed in place — an input with
 * exactly one value — and the page does not navigate. If a category grows its
 * own page (an approvals queue with bulk actions), make it a route and switch
 * to `TabList`. "Unread only" is a `Switch` because it applies immediately.
 *
 * **Two different empty states.** "You're all caught up" is a success — the
 * reader read everything — and offers the way back to the read history.
 * "No unread approvals" is a filter that happens to be empty, and says which
 * filter to loosen. Never show a generic "No data".
 *
 * **Mark all as read is undoable, not confirmed.** It is cheap to reverse, so
 * it acts at once and the Toast restores exactly the rows it changed.
 */

import {useCallback, useMemo, useState, type ReactNode} from 'react';

import {HStack, Layout, LayoutContent, StackItem, VStack} from '@solo/core/Layout';
import {Heading, Text} from '@solo/core/Text';
import {Avatar} from '@solo/core/Avatar';
import {Button} from '@solo/core/Button';
import type {DropdownMenuOption} from '@solo/core/DropdownMenu';
import {EmptyState} from '@solo/core/EmptyState';
import {Icon} from '@solo/core/Icon';
import {IconButton} from '@solo/core/IconButton';
import {Link} from '@solo/core/Link';
import {MoreMenu} from '@solo/core/MoreMenu';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@solo/core/SegmentedControl';
import {StatusDot} from '@solo/core/StatusDot';
import {Switch} from '@solo/core/Switch';
import {TextArea} from '@solo/core/TextArea';
import {Timestamp} from '@solo/core/Timestamp';
import type {TimestampFormat} from '@solo/core/Timestamp';
import {ToastViewport, useToast} from '@solo/core/Toast';
import {
  ArchiveBoxIcon,
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  BellSlashIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CheckIcon,
  Cog6ToothIcon,
  InboxIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

// ============= DATA =============

type Kind = 'mention' | 'assigned' | 'approval' | 'update';
type Filter = 'all' | 'mention' | 'assigned' | 'approval';
type Decision = 'approved' | 'declined';
type Group = 'today' | 'yesterday' | 'earlier';

interface Person {
  name: string;
}

interface Notification {
  id: string;
  kind: Kind;
  /** A person, or nothing for a system event (which then has an icon). */
  actor?: Person;
  /** Icon for a system event. */
  systemIcon?: typeof CalendarDaysIcon;
  /** Verb phrase between actor and target ("mentioned you in"). */
  phrase: string;
  /** The thing the event is about: rendered as a link. */
  target: string;
  /** Optional words after the target ("for your approval"). */
  suffix?: string;
  /** Quoted comment, amount or detail shown under the sentence. */
  snippet?: string;
  project: string;
  /** Whole days before today: 0 today, 1 yesterday, 2+ earlier this week. */
  day: number;
  /** Today: minutes ago. Earlier days: minutes after midnight. */
  minutes: number;
  isUnread: boolean;
  /** Approvals only: the decision, when one has been made. */
  decision?: Decision;
}

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
/** The oldest "minutes ago" in today's fixture, used to keep it after midnight. */
const MAX_TODAY_AGO = 300;

const OMAR: Person = {name: 'Omar Haddad'};
const LEILA: Person = {name: 'Leila Nasser'};
const YOUSSEF: Person = {name: 'Youssef Mansour'};
const SARAH: Person = {name: 'Sarah Collins'};
const KARIM: Person = {name: 'Karim Aziz'};
const RANIA: Person = {name: 'Rania Saleh'};
const TARIQ: Person = {name: 'Tariq Saeed'};

const RIVERSIDE = 'Riverside fit-out';
const AL_NOOR = 'Al Noor School';
const HARBOR = 'Harbor Clinic';

// Verb phrases are kept to one grammatical gender each (see the header):
// Arabic verbs agree with the actor, and each phrase is translated once.
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    kind: 'mention',
    actor: OMAR,
    phrase: 'mentioned you in',
    target: 'Q4 site plan',
    snippet:
      '@Nadia can you confirm the setback on the north boundary before Thursday’s review?',
    project: RIVERSIDE,
    day: 0,
    minutes: 4,
    isUnread: true,
  },
  {
    id: 'n2',
    kind: 'approval',
    actor: LEILA,
    phrase: 'requested your approval for',
    target: 'Facade materials budget',
    snippet: 'Revised total SAR 412,000 — 6% over the approved line.',
    project: RIVERSIDE,
    day: 0,
    minutes: 38,
    isUnread: true,
  },
  {
    id: 'n3',
    kind: 'assigned',
    actor: YOUSSEF,
    phrase: 'assigned you',
    target: 'Structural review — Block C',
    snippet: 'High priority · due Friday',
    project: AL_NOOR,
    day: 0,
    minutes: 95,
    isUnread: true,
  },
  {
    id: 'n4',
    kind: 'mention',
    actor: SARAH,
    phrase: 'replied to your comment on',
    target: 'Lobby lighting options',
    snippet: 'Option B works if we can source the fixtures locally.',
    project: RIVERSIDE,
    day: 0,
    minutes: 180,
    isUnread: false,
  },
  {
    id: 'n5',
    kind: 'update',
    systemIcon: CalendarDaysIcon,
    phrase: 'Due tomorrow:',
    target: 'Permit drawings — set 3',
    snippet: '3 of 5 sheets are still in review.',
    project: AL_NOOR,
    day: 0,
    minutes: 260,
    isUnread: true,
  },
  {
    id: 'n6',
    kind: 'approval',
    actor: KARIM,
    phrase: 'sent',
    target: 'Change order #14',
    suffix: 'for your approval',
    snippet: 'Adds two fire-rated doors on level 2 · SAR 18,400',
    project: AL_NOOR,
    day: 1,
    minutes: 17 * 60 + 40,
    isUnread: true,
  },
  {
    id: 'n7',
    kind: 'mention',
    actor: RANIA,
    phrase: 'replied to your comment on',
    target: 'Curtain wall shop drawings',
    snippet: 'Updated the mullion spacing — see sheet A-402.',
    project: RIVERSIDE,
    day: 1,
    minutes: 15 * 60 + 5,
    isUnread: false,
  },
  {
    id: 'n8',
    kind: 'assigned',
    actor: TARIQ,
    phrase: 'assigned you',
    target: 'Landscape coordination',
    project: AL_NOOR,
    day: 1,
    minutes: 11 * 60 + 20,
    isUnread: false,
  },
  {
    id: 'n9',
    kind: 'update',
    systemIcon: ArrowDownTrayIcon,
    phrase: 'Export ready:',
    target: 'Site survey photos',
    snippet: '248 photos · ZIP, 1.2 GB',
    project: RIVERSIDE,
    day: 1,
    minutes: 9 * 60 + 45,
    isUnread: false,
  },
  {
    id: 'n10',
    kind: 'update',
    actor: RANIA,
    phrase: 'finished',
    target: 'Fire egress review',
    project: AL_NOOR,
    day: 2,
    minutes: 16 * 60 + 10,
    isUnread: false,
  },
  {
    id: 'n11',
    kind: 'mention',
    actor: OMAR,
    phrase: 'mentioned you in',
    target: 'Client kickoff notes',
    snippet: 'Adding @Nadia for the budget questions.',
    project: HARBOR,
    day: 2,
    minutes: 10 * 60 + 30,
    isUnread: false,
  },
  {
    id: 'n12',
    kind: 'assigned',
    actor: SARAH,
    phrase: 'asked you to review',
    target: 'Finishes schedule — level 1',
    project: RIVERSIDE,
    day: 3,
    minutes: 14 * 60,
    isUnread: true,
  },
  {
    id: 'n13',
    kind: 'approval',
    actor: LEILA,
    phrase: 'requested your approval for',
    target: 'Consultant fee — phase 2',
    snippet: 'SAR 96,000 · Harbor Clinic design development',
    project: HARBOR,
    day: 3,
    minutes: 9 * 60 + 15,
    isUnread: false,
    decision: 'approved',
  },
  {
    id: 'n14',
    kind: 'update',
    systemIcon: ArchiveBoxIcon,
    phrase: 'Project archived:',
    target: 'Harbor Clinic rebrand',
    project: HARBOR,
    day: 4,
    minutes: 12 * 60 + 30,
    isUnread: false,
  },
];

const GROUPS: {id: Group; title: string}[] = [
  {id: 'today', title: 'Today'},
  {id: 'yesterday', title: 'Yesterday'},
  {id: 'earlier', title: 'Earlier this week'},
];

/**
 * How each group prints its times. Relative time counts elapsed hours, not
 * calendar days, so "1 day ago" under "Earlier this week" would contradict
 * the heading; past today the heading says the day and the row says when.
 */
const TIME_FORMAT: Record<Group, TimestampFormat> = {
  today: 'relative',
  yesterday: 'time',
  earlier: 'date_weekday',
};

const FILTERS: {value: Filter; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'mention', label: 'Mentions'},
  {value: 'assigned', label: 'Assigned'},
  {value: 'approval', label: 'Approvals'},
];

const UNREAD_EMPTY: Record<Filter, {title: string; description: string}> = {
  all: {
    title: 'You’re all caught up',
    description:
      'New mentions, assignments and approvals on your projects will show up here.',
  },
  mention: {
    title: 'No unread mentions',
    description: 'Nobody is waiting on a reply from you. Read mentions are still in the history.',
  },
  assigned: {
    title: 'No unread assignments',
    description: 'You have seen every task assigned to you. Read assignments are still in the history.',
  },
  approval: {
    title: 'No unread approvals',
    description: 'No requests are waiting on your decision right now.',
  },
};

const FILTER_EMPTY: Record<Filter, {title: string; description: string}> = {
  all: {
    title: 'No notifications yet',
    description: 'Activity on your projects will show up here as it happens.',
  },
  mention: {
    title: 'No mentions this week',
    description: 'When someone @mentions you or replies to your comment, it shows up here.',
  },
  assigned: {
    title: 'Nothing assigned this week',
    description: 'Tasks and reviews assigned to you show up here.',
  },
  approval: {
    title: 'No approval requests this week',
    description: 'Budgets, change orders and fees that need your sign-off show up here.',
  },
};

function matchesFilter(item: Notification, filter: Filter): boolean {
  return filter === 'all' || item.kind === filter;
}

function unreadLabel(count: number): string {
  return count === 0 ? 'No unread notifications' : `${count} unread`;
}

function markedReadMessage(count: number): string {
  return count === 1
    ? 'Marked 1 notification as read'
    : `Marked ${count} notifications as read`;
}

/** Midnight at the start of the day `now` falls in, in the reader's zone. */
function startOfDay(now: number): number {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function groupOf(item: Notification): Group {
  return item.day === 0 ? 'today' : item.day === 1 ? 'yesterday' : 'earlier';
}

/**
 * When the event happened. Today's events are "minutes ago", squeezed into the
 * time since midnight so a page opened at 00:10 still files them under Today.
 */
function timeOf(item: Notification, now: number): number {
  const midnight = startOfDay(now);
  if (item.day === 0) {
    const elapsed = now - midnight;
    const ago = Math.min(
      item.minutes * MINUTE,
      elapsed * (item.minutes / MAX_TODAY_AGO),
    );
    return now - ago;
  }
  return midnight - item.day * DAY + item.minutes * MINUTE;
}

// ============= ROW =============

interface RowProps {
  item: Notification;
  /** A rule above every row but the first in its group. */
  hasDivider: boolean;
  now: number;
  isMuted: boolean;
  isTurnedOff: boolean;
  isReplying: boolean;
  onOpen: (item: Notification) => void;
  onToggleRead: (item: Notification) => void;
  onToggleMute: (item: Notification) => void;
  onToggleTurnOff: (item: Notification) => void;
  onDecide: (item: Notification, decision: Decision) => void;
  onReplyOpenChange: (item: Notification, isOpen: boolean) => void;
  onSendReply: (item: Notification) => void;
}

function Leading({item}: {item: Notification}) {
  if (item.actor != null) {
    return <Avatar name={item.actor.name} size="md" />;
  }
  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-(--radius-full) bg-(--color-background-muted) text-(--color-icon-secondary)">
      <Icon icon={item.systemIcon ?? InboxIcon} size="sm" />
    </span>
  );
}

function Sentence({
  item,
  onOpen,
}: {
  item: Notification;
  onOpen: (item: Notification) => void;
}) {
  const weight = item.isUnread ? 'semibold' : 'medium';
  const target = (
    <Link
      href="#"
      color="primary"
      weight={weight}
      onClick={event => {
        event.preventDefault();
        onOpen(item);
      }}>
      {item.target}
    </Link>
  );
  // Each fragment is its own text node (see "Sentences" in the header).
  return (
    <Text as="p" display="block" color={item.isUnread ? 'primary' : 'secondary'}>
      {item.actor != null ? (
        <>
          <Text weight={weight} color="primary">
            {item.actor.name}
          </Text>{' '}
          <span>{item.phrase}</span> {target}
        </>
      ) : (
        <>
          <span>{item.phrase}</span> {target}
        </>
      )}
      {item.suffix != null && (
        <>
          {' '}
          <span>{item.suffix}</span>
        </>
      )}
    </Text>
  );
}

function NotificationRow({
  item,
  hasDivider,
  now,
  isMuted,
  isTurnedOff,
  isReplying,
  onOpen,
  onToggleRead,
  onToggleMute,
  onToggleTurnOff,
  onDecide,
  onReplyOpenChange,
  onSendReply,
}: RowProps) {
  const [draft, setDraft] = useState('');
  const canReply = item.kind === 'mention' && item.actor != null;
  const isPendingApproval = item.kind === 'approval' && item.decision == null;

  const menuItems: DropdownMenuOption[] = [
    {
      label: item.isUnread ? 'Mark as read' : 'Mark as unread',
      onClick: () => onToggleRead(item),
    },
    {
      label: isMuted ? 'Unmute this thread' : 'Mute this thread',
      description: isMuted ? undefined : 'Stop notifications from this thread',
      onClick: () => onToggleMute(item),
    },
    {type: 'divider'},
    {
      label: isTurnedOff
        ? 'Turn these notifications back on'
        : 'Turn off these notifications',
      description: isTurnedOff ? undefined : notificationScope(item),
      onClick: () => onToggleTurnOff(item),
    },
  ];

  let actions: ReactNode = null;
  if (isPendingApproval) {
    actions = (
      <HStack gap={2} vAlign="center">
        <Button
          label="Approve"
          size="sm"
          variant="secondary"
          icon={<Icon icon={CheckIcon} size="sm" />}
          onClick={() => onDecide(item, 'approved')}
        />
        <Button
          label="Decline"
          size="sm"
          variant="ghost"
          onClick={() => onDecide(item, 'declined')}
        />
      </HStack>
    );
  } else if (item.decision != null) {
    const isApproved = item.decision === 'approved';
    actions = (
      <HStack gap={1.5} vAlign="center">
        <span
          className={
            isApproved
              ? 'flex text-(--color-success)'
              : 'flex text-(--color-icon-secondary)'
          }>
          <Icon icon={isApproved ? CheckCircleIcon : XCircleIcon} size="sm" />
        </span>
        <Text type="supporting" color="secondary">
          {isApproved ? 'You approved this' : 'You declined this'}
        </Text>
      </HStack>
    );
  } else if (canReply && !isReplying) {
    actions = (
      <HStack gap={2} vAlign="center">
        <Button
          label="Reply"
          size="sm"
          variant="secondary"
          icon={<Icon icon={ArrowUturnLeftIcon} size="sm" />}
          onClick={() => onReplyOpenChange(item, true)}
        />
      </HStack>
    );
  }

  return (
    <li
      className={[
        'flex items-start gap-(--spacing-3) px-(--spacing-4) py-(--spacing-4)',
        hasDivider ? 'border-t border-(--color-border)' : '',
        item.isUnread
          ? 'bg-[color-mix(in_srgb,var(--color-accent-muted)_50%,transparent)]'
          : '',
      ].join(' ')}>
      {/* Fixed-width slot so read and unread rows align. */}
      <span className="flex h-9 w-2 shrink-0 items-center justify-center">
        {item.isUnread && <StatusDot variant="accent" label="Unread" />}
      </span>
      <Leading item={item} />
      <StackItem size="fill" className="min-w-0">
        <VStack gap={2}>
          <VStack gap={1}>
            <Sentence item={item} onOpen={onOpen} />
            {item.snippet != null && (
              <Text type="supporting" color="secondary" maxLines={2}>
                {item.snippet}
              </Text>
            )}
            <HStack gap={2} vAlign="center" wrap="wrap">
              <Timestamp
                value={timeOf(item, now)}
                format={TIME_FORMAT[groupOf(item)]}
              />
              <Text type="supporting" color="secondary" aria-hidden>
                ·
              </Text>
              <Text type="supporting" color="secondary">
                {item.project}
              </Text>
              {isMuted && (
                <HStack gap={1} vAlign="center">
                  <span className="flex text-(--color-icon-secondary)">
                    <Icon icon={BellSlashIcon} size="sm" />
                  </span>
                  <Text type="supporting" color="secondary">
                    Muted
                  </Text>
                </HStack>
              )}
            </HStack>
          </VStack>
          {actions}
          {isReplying && (
            <VStack gap={2}>
              <TextArea
                label={`Reply to ${item.actor?.name ?? ''}`}
                isLabelHidden
                rows={2}
                value={draft}
                onChange={setDraft}
                placeholder="Write a reply…"
              />
              <HStack gap={2} hAlign="end">
                <Button
                  label="Cancel"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setDraft('');
                    onReplyOpenChange(item, false);
                  }}
                />
                <Button
                  label="Send reply"
                  size="sm"
                  variant="secondary"
                  isDisabled={draft.trim() === ''}
                  onClick={() => {
                    setDraft('');
                    onSendReply(item);
                  }}
                />
              </HStack>
            </VStack>
          )}
        </VStack>
      </StackItem>
      <MoreMenu
        label={`Options for ${item.target}`}
        size="sm"
        alignment="end"
        items={menuItems}
      />
    </li>
  );
}

/** What "these notifications" means for a row, shown under the menu item. */
function notificationScope(item: Notification): string {
  switch (item.kind) {
    case 'mention':
      return `Mentions and replies in ${item.project}`;
    case 'assigned':
      return `Assignments in ${item.project}`;
    case 'approval':
      return `Approval requests in ${item.project}`;
    case 'update':
      return `Project updates in ${item.project}`;
  }
}

// ============= PAGE =============

function NotificationsPage() {
  // One clock for the whole page: every time and group is relative to load.
  const [now] = useState(() => Date.now());
  const showToast = useToast();

  const [items, setItems] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<Filter>('all');
  const [isUnreadOnly, setIsUnreadOnly] = useState(false);
  const [mutedIds, setMutedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  /** "kind|project" pairs the reader has turned off. */
  const [offRules, setOffRules] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const unreadCount = items.filter(item => item.isUnread).length;

  const visible = useMemo(
    () =>
      items.filter(
        item =>
          matchesFilter(item, filter) && (!isUnreadOnly || item.isUnread),
      ),
    [items, filter, isUnreadOnly],
  );

  // ----- Mutations -----
  const setRead = useCallback((ids: ReadonlySet<string>, isUnread: boolean) => {
    setItems(list =>
      list.map(item => (ids.has(item.id) ? {...item, isUnread} : item)),
    );
  }, []);

  const openItem = useCallback(
    (item: Notification) => setRead(new Set([item.id]), false),
    [setRead],
  );

  const toggleRead = useCallback(
    (item: Notification) => setRead(new Set([item.id]), !item.isUnread),
    [setRead],
  );

  const markAllRead = () => {
    const changed = new Set(
      items.filter(item => item.isUnread).map(item => item.id),
    );
    if (changed.size === 0) {
      return;
    }
    setRead(changed, false);
    showToast({
      body: markedReadMessage(changed.size),
      uniqueID: 'mark-all-read',
      endContent: (
        <Button
          label="Undo"
          variant="ghost"
          size="sm"
          onClick={() => setRead(changed, true)}
        />
      ),
    });
  };

  const toggleMute = useCallback(
    (item: Notification) => {
      const wasMuted = mutedIds.has(item.id);
      const flip = (set: ReadonlySet<string>, add: boolean) => {
        const next = new Set(set);
        if (add) {
          next.add(item.id);
        } else {
          next.delete(item.id);
        }
        return next;
      };
      setMutedIds(set => flip(set, !wasMuted));
      showToast({
        body: wasMuted ? 'Thread unmuted' : 'Thread muted',
        uniqueID: `mute-${item.id}`,
        endContent: wasMuted ? undefined : (
          <Button
            label="Undo"
            variant="ghost"
            size="sm"
            onClick={() => setMutedIds(set => flip(set, false))}
          />
        ),
      });
    },
    [mutedIds, showToast],
  );

  const toggleTurnOff = useCallback(
    (item: Notification) => {
      const rule = `${item.kind}|${item.project}`;
      const wasOff = offRules.has(rule);
      const flip = (set: ReadonlySet<string>, add: boolean) => {
        const next = new Set(set);
        if (add) {
          next.add(rule);
        } else {
          next.delete(rule);
        }
        return next;
      };
      setOffRules(set => flip(set, !wasOff));
      showToast({
        body: wasOff
          ? 'Notifications turned back on'
          : `Turned off: ${notificationScope(item)}`,
        uniqueID: `rule-${rule}`,
        endContent: wasOff ? undefined : (
          <Button
            label="Undo"
            variant="ghost"
            size="sm"
            onClick={() => setOffRules(set => flip(set, false))}
          />
        ),
      });
    },
    [offRules, showToast],
  );

  const decide = useCallback(
    (item: Notification, decision: Decision) => {
      setItems(list =>
        list.map(n =>
          n.id === item.id ? {...n, decision, isUnread: false} : n,
        ),
      );
      showToast({
        body: decision === 'approved' ? 'Request approved' : 'Request declined',
        uniqueID: `decide-${item.id}`,
        endContent: (
          <Button
            label="Undo"
            variant="ghost"
            size="sm"
            onClick={() =>
              setItems(list =>
                list.map(n =>
                  n.id === item.id
                    ? {...n, decision: undefined, isUnread: item.isUnread}
                    : n,
                ),
              )
            }
          />
        ),
      });
    },
    [showToast],
  );

  const replyOpenChange = useCallback(
    (item: Notification, isOpen: boolean) =>
      setReplyingId(isOpen ? item.id : null),
    [],
  );

  const sendReply = useCallback(
    (item: Notification) => {
      setReplyingId(null);
      setRead(new Set([item.id]), false);
      showToast({body: 'Reply sent', uniqueID: `reply-${item.id}`});
    },
    [setRead, showToast],
  );

  // ----- Render -----
  const empty = isUnreadOnly ? UNREAD_EMPTY[filter] : FILTER_EMPTY[filter];
  const isCaughtUp = isUnreadOnly && filter === 'all';

  return (
    <Layout
      height="fill"
      contentWidth={800}
      padding={6}
      content={
        <LayoutContent>
          <VStack gap={6}>
            {/* Masthead: what this is, how much is waiting, and the bulk
                action. Settings is a link: it navigates. */}
            <HStack gap={4} vAlign="center" wrap="wrap">
              <StackItem size="fill">
                <VStack gap={1}>
                  <Heading level={1}>Notifications</Heading>
                  <Text color="secondary">{unreadLabel(unreadCount)}</Text>
                </VStack>
              </StackItem>
              <HStack gap={2} vAlign="center">
                <Button
                  label="Mark all as read"
                  variant="secondary"
                  icon={<Icon icon={CheckIcon} size="sm" />}
                  isDisabled={unreadCount === 0}
                  onClick={markAllRead}
                />
                <IconButton
                  label="Notification settings"
                  tooltip="Notification settings"
                  variant="ghost"
                  href="#"
                  icon={<Icon icon={Cog6ToothIcon} size="sm" />}
                />
              </HStack>
            </HStack>

            <VStack gap={5}>
              <HStack gap={3} vAlign="center" hAlign="between" wrap="wrap">
                <SegmentedControl
                  label="Filter notifications"
                  value={filter}
                  onChange={value => setFilter(value as Filter)}>
                  {FILTERS.map(option => (
                    <SegmentedControlItem
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </SegmentedControl>
                <Switch
                  label="Unread only"
                  value={isUnreadOnly}
                  onChange={setIsUnreadOnly}
                  labelPosition="start"
                />
              </HStack>

              {visible.length === 0 ? (
                <div className="rounded-(--radius-container) border border-(--color-border) py-(--spacing-10)">
                  <EmptyState
                    title={empty.title}
                    description={empty.description}
                    headingLevel={2}
                    icon={
                      <Icon
                        icon={isCaughtUp ? CheckCircleIcon : InboxIcon}
                        size="lg"
                      />
                    }
                    actions={
                      isUnreadOnly ? (
                        <Button
                          label={
                            isCaughtUp
                              ? 'Show all notifications'
                              : 'Include read notifications'
                          }
                          variant="secondary"
                          onClick={() => setIsUnreadOnly(false)}
                        />
                      ) : filter !== 'all' ? (
                        <Button
                          label="Show all notifications"
                          variant="secondary"
                          onClick={() => setFilter('all')}
                        />
                      ) : undefined
                    }
                  />
                </div>
              ) : (
                GROUPS.map(group => {
                  const rows = visible.filter(item => groupOf(item) === group.id);
                  if (rows.length === 0) {
                    return null;
                  }
                  const headingId = `notifications-${group.id}`;
                  return (
                    <section key={group.id} aria-labelledby={headingId}>
                      <VStack gap={2}>
                        <Heading level={5} accessibilityLevel={2} id={headingId} color="secondary">
                          {group.title}
                        </Heading>
                        <ul className="overflow-hidden rounded-(--radius-container) border border-(--color-border) bg-(--color-background-card)">
                          {rows.map((item, index) => (
                              <NotificationRow
                                key={item.id}
                                hasDivider={index > 0}
                                item={item}
                                now={now}
                                isMuted={mutedIds.has(item.id)}
                                isTurnedOff={offRules.has(
                                  `${item.kind}|${item.project}`,
                                )}
                                isReplying={replyingId === item.id}
                                onOpen={openItem}
                                onToggleRead={toggleRead}
                                onToggleMute={toggleMute}
                                onToggleTurnOff={toggleTurnOff}
                                onDecide={decide}
                                onReplyOpenChange={replyOpenChange}
                                onSendReply={sendReply}
                              />
                          ))}
                        </ul>
                      </VStack>
                    </section>
                  );
                })
              )}
            </VStack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}

/**
 * The page owns its toast viewport, so toasts inherit its direction and
 * theme; an app shell that already provides one can drop this wrapper.
 */
export default function ContentNotificationsTemplate() {
  return (
    <ToastViewport>
      <NotificationsPage />
    </ToastViewport>
  );
}
