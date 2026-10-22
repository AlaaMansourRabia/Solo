'use client';

/**
 * Team members: who has access to a workspace, what each of them can do, and
 * how many seats that leaves on the plan.
 *
 * The fixture is a 24-person company workspace with three outstanding
 * invitations on a 30-seat plan, but the structure is not about companies. What
 * picks this template over the other settings templates is that it manages a
 * **list of people** — records with a role, a last-seen time and a lifecycle
 * (invited → active → removed) — rather than a set of preferences. If every
 * row on the page is a person or a credential that can be added, changed and
 * revoked, start here: shared drives, project collaborators, API keys with
 * scopes, guest lists. `settings-sidebar` and `settings-dialog` are the
 * templates for preferences — one value per row, edited in place, nothing to
 * add or remove.
 *
 * ## Extending this template
 *
 * ### The roster
 *
 * **Two tabs, one source of truth.** Active members and pending invitations
 * live in two arrays because they have different columns (last active vs.
 * sent, a name vs. only an email), but both count against the same seats. The
 * seat meter is derived from `members.length + invites.length` every render;
 * there is no `seatsUsed` field to forget to update when someone is removed or
 * invited. Keep it that way when the invitations come from a server — the
 * meter is arithmetic over the lists, not a number the API sends separately.
 *
 * **`SegmentedControl`, not `TabList`, for Active / Pending.** The control
 * changes which rows the table shows, in place, with the toolbar and the page
 * staying put. That is a mode of one view (an input), not navigation between
 * views. If the pending list grows its own page — bulk resend, an audit trail
 * — make it a route and switch to `TabList`.
 *
 * **Narrow once, then paginate.** Search and the role filter feed one `useMemo`
 * that returns `visible`; pagination slices that array and nothing else. The
 * page index resets whenever the filters change and is clamped after a
 * removal, so the reader can never sit on page 3 of a two-page list.
 *
 * ### Roles
 *
 * **Edit the role in the row.** A `Selector` in the Role column is the
 * primary way to change a role: it shows the current value and changes it in
 * one gesture, with each option's description saying what the role can do.
 * The same change is reachable from the row's `MoreMenu` (a "Change role"
 * submenu) and from its right-click menu, because a role is the thing people
 * most often come here to change and the menus must stay complete — a
 * `ContextMenu` is never the only route to an action.
 *
 * **The only Owner cannot be demoted or removed.** A workspace without an
 * owner has no one who can pay for it or delete it. The owner's Selector is
 * disabled with a `disabledMessage` that says *why* and what to do instead
 * (transfer ownership), the menu items are disabled with the same reason as
 * their description, and Owner is offered as a disabled option in everyone
 * else's Selector so the role is visible without being one click away.
 * Ownership transfer is a deliberate, confirmed flow of its own; do not make
 * it a side effect of picking "Owner" in a dropdown.
 *
 * **Confirm the role change only when it removes access.** Promotions and
 * lateral moves apply immediately with a Toast. If your product has a role
 * that strips access to data the person is mid-way through editing (Viewer
 * here, for example), that is the one change worth routing through an
 * `AlertDialog` as well.
 *
 * ### Status
 *
 * **Badge only the rows that need attention.** "2FA off" and "Invite
 * expired" are badged because someone should act on them; a healthy member
 * gets no "Active" badge, because twenty identical green pills say nothing.
 * Last active is a `Timestamp` (plain text with a hover card), not a badge —
 * it is metadata, not a state.
 *
 * **Badge vs. Token.** The invite dialog's emails are `Token`s inside a
 * `Tokenizer`: they are values the user typed and can remove. The row
 * statuses are `Badge`s: read-only facts the user cannot click away. Swapping
 * the two is the most common way this page goes wrong.
 *
 * ### Actions and feedback
 *
 * **One action list, three surfaces.** `rowActions` builds the menu once per
 * row; the `MoreMenu` renders it directly and the right-click menu flattens
 * it. Table cells take right-click actions through `contextMenuActions`, which
 * `Table` renders as a `ContextMenu` that fills the whole cell, padding
 * included — `useRowContextMenu` sets the same getter on every cell so the
 * entire row answers a right-click. A `ContextMenu` wrapped around a `<tr>`
 * would be invalid markup; this is the supported way to reach the row.
 *
 * **Destructive actions confirm, finished actions toast.** Removing a member
 * goes through an `AlertDialog` whose action label names the consequence
 * ("Remove member", not "OK") and whose description says what is kept. The
 * result is reported with a `Toast` that offers Undo, because removal is the
 * one action here a slip of the hand makes on the wrong row. Role changes and
 * resends are not destructive and only toast.
 *
 * ### Inviting
 *
 * **Free-form emails become tokens.** The `Tokenizer` uses `hasCreate` so any
 * typed address can be added, a small directory source so colleagues can be
 * found by name, and splits a created value on commas and spaces, so pasting
 * "a@x.com, b@x.com" and pressing Enter adds each address at once. Each one is
 * validated on its own: invalid formats and people who already
 * have access are refused with a field `status`, never with a Toast — the
 * message has to stay next to the field it is about.
 *
 * **Seats bound the invite.** `maxEntries` is the number of seats left, and
 * the description says so; the dialog cannot send more invitations than the
 * plan can hold. When billing can add seats on the fly, replace the cap with a
 * line that states the cost of going over.
 *
 * **Sending adds rows, then switches tabs.** The new invitations are added to
 * the pending list and the view switches to it, so the result of the action is
 * on screen — the Toast confirms, the table proves it.
 */

import {useCallback, useMemo, useState} from 'react';

import {
  HStack,
  Layout,
  LayoutContent,
  LayoutFooter,
  StackItem,
  VStack,
} from '@solo/core/Layout';
import {Heading, Text} from '@solo/core/Text';
import {Avatar} from '@solo/core/Avatar';
import {AlertDialog} from '@solo/core/AlertDialog';
import {Badge} from '@solo/core/Badge';
import {Button} from '@solo/core/Button';
import {Dialog, DialogHeader} from '@solo/core/Dialog';
import type {DropdownMenuOption} from '@solo/core/DropdownMenu';
import {EmptyState} from '@solo/core/EmptyState';
import {FormLayout} from '@solo/core/FormLayout';
import {Icon} from '@solo/core/Icon';
import {Link} from '@solo/core/Link';
import {MoreMenu} from '@solo/core/MoreMenu';
import {Pagination} from '@solo/core/Pagination';
import {ProgressBar} from '@solo/core/ProgressBar';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@solo/core/SegmentedControl';
import {Selector} from '@solo/core/Selector';
import {Table, pixel, proportional} from '@solo/core/Table';
import type {
  TableColumn,
  TableContextAction,
  TablePlugin,
} from '@solo/core/Table';
import {TextArea} from '@solo/core/TextArea';
import {TextInput} from '@solo/core/TextInput';
import {Timestamp} from '@solo/core/Timestamp';
import {Token} from '@solo/core/Token';
import {Tokenizer} from '@solo/core/Tokenizer';
import {createStaticSource} from '@solo/core/Typeahead';
import type {SearchableItem} from '@solo/core/Typeahead';
import {ToastViewport, useToast} from '@solo/core/Toast';
import {VisuallyHidden} from '@solo/core/VisuallyHidden';
import {
  EnvelopeIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

// ============= DATA =============

type Role = 'owner' | 'admin' | 'member' | 'viewer';

const WORKSPACE = 'Meridian Works';
const SEAT_LIMIT = 30;
const PAGE_SIZE = 10;
/** Invitations stop working after this many days. */
const INVITE_TTL_DAYS = 7;
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const ROLE_LABEL: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
};

const ROLE_DESCRIPTION: Record<Role, string> = {
  owner: 'Full control, including billing and deleting the workspace',
  admin: 'Manage members, billing and workspace settings',
  member: 'Create and edit projects they belong to',
  viewer: 'View and comment, without editing',
};

/** Roles a person can be given from a menu. Owner changes hands by transfer. */
const ASSIGNABLE_ROLES: Role[] = ['admin', 'member', 'viewer'];

const OWNER_LOCK_REASON =
  'Every workspace needs an owner. Transfer ownership to another admin before changing this role.';

/** Options for the per-row Selector. Owner is shown but never selectable. */
const ROW_ROLE_OPTIONS = [
  {
    value: 'owner',
    label: ROLE_LABEL.owner,
    description: 'One per workspace — transfer it from workspace settings',
    disabled: true,
  },
  ...ASSIGNABLE_ROLES.map(role => ({
    value: role,
    label: ROLE_LABEL[role],
    description: ROLE_DESCRIPTION[role],
  })),
];

/** The owner's own Selector lists only Owner: it is disabled anyway. */
const OWNER_ROLE_OPTIONS = [{value: 'owner', label: ROLE_LABEL.owner}];

const INVITE_ROLE_OPTIONS = ASSIGNABLE_ROLES.map(role => ({
  value: role,
  label: ROLE_LABEL[role],
  description: ROLE_DESCRIPTION[role],
}));

const ROLE_FILTER_OPTIONS = [
  {value: 'all', label: 'All roles'},
  ...(['owner', 'admin', 'member', 'viewer'] as const).map(role => ({
    value: role,
    label: ROLE_LABEL[role],
  })),
];

interface Member extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Minutes before page load. Turned into a timestamp against `now`. */
  lastActiveAgo: number;
  hasTwoFactor: boolean;
  isYou?: boolean;
}

interface Invite extends Record<string, unknown> {
  id: string;
  email: string;
  role: Role;
  invitedBy: string;
  /** Minutes before page load. */
  sentAgo: number;
}

const DOMAIN = 'meridianworks.com';

/** Fixture builder: the email follows the name, so the data stays consistent. */
function member(
  name: string,
  role: Role,
  lastActiveAgo: number,
  options: {hasTwoFactor?: boolean; isYou?: boolean} = {},
): Member {
  const [first, last] = name.toLowerCase().split(' ');
  return {
    id: `${first}-${last}`,
    name,
    email: `${first}.${last}@${DOMAIN}`,
    role,
    lastActiveAgo,
    hasTwoFactor: options.hasTwoFactor ?? true,
    isYou: options.isYou,
  };
}

const INITIAL_MEMBERS: Member[] = [
  member('Nadia Rahman', 'owner', 0, {isYou: true}),
  member('Omar Haddad', 'admin', 12),
  member('Sarah Collins', 'admin', 95),
  member('Youssef Mansour', 'admin', 60 * 26),
  member('Layla Khalil', 'member', 4),
  member('James Whitaker', 'member', 38),
  member('Rania Aziz', 'member', 60 * 3, {hasTwoFactor: false}),
  member('Daniel Okafor', 'member', 60 * 5),
  member('Hana Saleh', 'member', 60 * 20),
  member('Michael Turner', 'member', 60 * 30),
  member('Karim Nasser', 'member', 60 * 49, {hasTwoFactor: false}),
  member('Emily Carter', 'member', 60 * 52),
  member('Tariq Hamdan', 'member', 60 * 74),
  member('Sophie Laurent', 'member', 60 * 98),
  member('Mariam Yousef', 'member', 60 * 120),
  member('Lucas Bennett', 'member', 60 * 140, {hasTwoFactor: false}),
  member('Salma Darwish', 'member', 60 * 150),
  member('Ethan Brooks', 'viewer', 60 * 170),
  member('Ahmed Farouk', 'member', 60 * 200),
  member('Olivia Grant', 'viewer', 60 * 24 * 12),
  member('Zaid Qasim', 'viewer', 60 * 24 * 16, {hasTwoFactor: false}),
  member('Chloe Martin', 'member', 60 * 24 * 21),
  member('Faisal Amin', 'viewer', 60 * 24 * 33),
  member('Noor Ibrahim', 'member', 60 * 24 * 41),
];

const INITIAL_INVITES: Invite[] = [
  {
    id: 'inv-1',
    email: `liam.foster@${DOMAIN}`,
    role: 'viewer',
    invitedBy: 'Sarah Collins',
    sentAgo: 60 * 5,
  },
  {
    id: 'inv-2',
    email: `r.saad@${DOMAIN}`,
    role: 'member',
    invitedBy: 'Omar Haddad',
    sentAgo: 60 * 24 * 2,
  },
  {
    id: 'inv-3',
    email: `dana.kassem@${DOMAIN}`,
    role: 'member',
    invitedBy: 'Nadia Rahman',
    sentAgo: 60 * 24 * 9,
  },
];

/** Colleagues in the company directory who are not in the workspace yet. */
const DIRECTORY: SearchableItem[] = [
  'amal.haddad',
  'ben.porter',
  'farah.nabil',
  'grace.liu',
  'khaled.zaki',
  'ruby.hughes',
  'samir.awad',
].map(handle => ({id: `${handle}@${DOMAIN}`, label: `${handle}@${DOMAIN}`}));

const DIRECTORY_SOURCE = createStaticSource(DIRECTORY);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isExpired(invite: Invite): boolean {
  return invite.sentAgo >= INVITE_TTL_DAYS * 24 * 60;
}

function roleChangedMessage(name: string, role: Role): string {
  return `${name} is now ${role === 'admin' ? 'an' : 'a'} ${ROLE_LABEL[role]}`;
}

function rangeLabel(first: number, last: number, total: number): string {
  return `Showing ${first}–${last} of ${total}`;
}

function invitationsSentMessage(count: number): string {
  return count === 1 ? 'Sent 1 invitation' : `Sent ${count} invitations`;
}

// ============= ROW CONTEXT MENU =============

/**
 * Right-click on any cell of a row opens that row's actions.
 *
 * `Table` renders a cell's `contextMenuActions` as a `ContextMenu` whose
 * trigger fills the cell, padding included. Setting the same getter on every
 * cell turns that into a row menu. The getter form defers building the list
 * until the menu opens, so 10 rows × 5 cells do not each allocate closures on
 * every render.
 */
function useRowContextMenu<T extends Record<string, unknown>>(
  getActions: (item: T) => TableContextAction[],
): TablePlugin<T> {
  return useMemo(
    () => ({
      transformBodyCell: (props, _column, item) => ({
        ...props,
        contextMenuActions: () => getActions(item),
      }),
    }),
    [getActions],
  );
}

/**
 * Flatten a MoreMenu item list into context-menu actions. Submenus become a
 * group of their own, with the current value checked, so both menus offer the
 * same actions in the same order.
 */
function toContextActions(
  options: DropdownMenuOption[],
  checkedLabel?: string,
): TableContextAction[] {
  const actions: TableContextAction[] = [];
  let group = 0;
  for (const option of options) {
    if ('type' in option && option.type === 'divider') {
      group += 1;
      continue;
    }
    if ('type' in option && option.type === 'section') {
      continue;
    }
    const item = option as Exclude<
      DropdownMenuOption,
      {type: 'divider'} | {type: 'section'}
    >;
    if (item.items != null) {
      group += 1;
      for (const sub of item.items) {
        if ('type' in sub) {
          continue;
        }
        // Out of its submenu the role needs a verb: "Make Admin", not "Admin".
        actions.push({
          id: `${String(item.label)}-${String(sub.label)}`,
          label: `Make ${String(sub.label)}`,
          onSelect: () => sub.onClick?.(undefined as never),
          disabled: sub.isDisabled,
          checked: sub.label === checkedLabel,
          group: `g${group}`,
        });
      }
      group += 1;
      continue;
    }
    actions.push({
      id: String(item.label),
      label: item.label,
      onSelect: () => item.onClick?.(undefined as never),
      disabled: item.isDisabled,
      variant: item.variant === 'destructive' ? 'destructive' : 'default',
      group: `g${group}`,
    });
  }
  return actions;
}

// ============= CELLS =============

function MemberCell({row}: {row: Member}) {
  return (
    <HStack gap={3} vAlign="center">
      <Avatar name={row.name} size="md" tooltip={false} />
      <VStack gap={0}>
        <HStack gap={2} vAlign="center">
          <Text weight="medium" maxLines={1}>
            {row.name}
          </Text>
          {row.isYou && (
            <Text type="supporting" color="secondary">
              You
            </Text>
          )}
        </HStack>
        <Text type="supporting" color="secondary" maxLines={1}>
          {row.email}
        </Text>
      </VStack>
    </HStack>
  );
}

function InviteeCell({row}: {row: Invite}) {
  return (
    <HStack gap={3} vAlign="center">
      <Avatar size="md" tooltip={false} alt={row.email} />
      <VStack gap={0}>
        <Text weight="medium" maxLines={1}>
          {row.email}
        </Text>
        <Text type="supporting" color="secondary" maxLines={1}>
          {`Invited by ${row.invitedBy}`}
        </Text>
      </VStack>
    </HStack>
  );
}

function RoleCell({
  role,
  label,
  onChange,
}: {
  role: Role;
  label: string;
  onChange: (role: Role) => void;
}) {
  const isOwner = role === 'owner';
  return (
    <Selector
      label={label}
      isLabelHidden
      size="sm"
      variant="ghost"
      width={136}
      options={isOwner ? OWNER_ROLE_OPTIONS : ROW_ROLE_OPTIONS}
      value={role}
      onChange={value => onChange(value as Role)}
      isDisabled={isOwner}
      disabledMessage={isOwner ? OWNER_LOCK_REASON : undefined}
    />
  );
}

// ============= INVITE DIALOG =============

function InviteDialog({
  isOpen,
  onOpenChange,
  seatsLeft,
  existingEmails,
  onSend,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  seatsLeft: number;
  existingEmails: ReadonlySet<string>;
  onSend: (emails: string[], role: Role, message: string) => void;
}) {
  const [emails, setEmails] = useState<SearchableItem[]>([]);
  const [role, setRole] = useState<Role>('member');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setEmails([]);
    setRole('member');
    setMessage('');
    setError(null);
  };

  const close = () => {
    onOpenChange(false);
    reset();
  };

  /** Why `email` cannot be added, or null when it can. */
  const rejection = useCallback(
    (email: string, current: SearchableItem[]): string | null => {
      if (!EMAIL_PATTERN.test(email)) {
        return 'Enter a full email address, like name@company.com.';
      }
      if (existingEmails.has(email)) {
        return 'That person already has access or a pending invite.';
      }
      if (current.some(item => item.id === email)) {
        return null;
      }
      if (current.length >= seatsLeft) {
        return 'No seats left for another invite. Add seats to your plan first.';
      }
      return null;
    },
    [existingEmails, seatsLeft],
  );

  /** Commit several addresses at once (paste, or a typed separator). */
  const addMany = (raw: string[], current: SearchableItem[]) => {
    let next = current;
    let firstError: string | null = null;
    for (const value of raw) {
      const email = value.trim().toLowerCase();
      if (email === '' || next.some(item => item.id === email)) {
        continue;
      }
      const reason = rejection(email, next);
      if (reason != null) {
        firstError ??= reason;
        continue;
      }
      next = [...next, {id: email, label: email}];
    }
    setEmails(next);
    setError(firstError);
  };

  const canSend = emails.length > 0;

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={open => (open ? onOpenChange(true) : close())}
      width={560}
      purpose="form">
      <Layout
        height="auto"
        padding={4}
        defaultHasDividers={false}
        header={
          <DialogHeader
            title="Invite members"
            subtitle={`Invite people to ${WORKSPACE} by email.`}
            onOpenChange={() => close()}
            hasDivider={false}
          />
        }
        content={
          <LayoutContent>
            <FormLayout defaultOptionality="required">
              <Tokenizer
                label="Email addresses"
                description={seatsLeftDescription(seatsLeft)}
                placeholder="name@company.com"
                searchSource={DIRECTORY_SOURCE}
                value={emails}
                hasCreate
                maxEntries={Math.max(seatsLeft, 0)}
                isDisabled={seatsLeft <= 0}
                disabledMessage="Every seat on your plan is in use."
                startIcon={<Icon icon={EnvelopeIcon} size="sm" />}
                status={error == null ? undefined : {type: 'error', message: error}}
                onChange={(items, change) => {
                  if (change.type === 'create' || change.type === 'add') {
                    // A created token is whatever was typed, so a pasted list
                    // ("a@x.com, b@x.com") arrives as one value: split it and
                    // validate each address on its own.
                    const previous = items.filter(i => i !== change.item);
                    addMany(change.item.id.split(/[,;\s]+/), previous);
                    return;
                  }
                  setError(null);
                  setEmails(items);
                }}
                renderToken={(item, onRemove) => (
                  <Token label={item.label} onRemove={onRemove} />
                )}
              />
              <Selector
                label="Role"
                description="Applies to everyone in this invitation. You can change it later."
                options={INVITE_ROLE_OPTIONS}
                value={role}
                onChange={value => setRole(value as Role)}
              />
              <TextArea
                label="Message"
                isOptional
                rows={3}
                maxLength={300}
                value={message}
                onChange={setMessage}
                placeholder="Add a note to the invitation email"
              />
            </FormLayout>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Cancel" variant="secondary" onClick={close} />
              <Button
                label="Send invites"
                variant="primary"
                isDisabled={!canSend}
                onClick={() => {
                  onSend(
                    emails.map(item => item.id),
                    role,
                    message,
                  );
                  close();
                }}
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}

function seatsLeftDescription(seatsLeft: number): string {
  if (seatsLeft <= 0) {
    return 'Every seat on your plan is in use.';
  }
  return seatsLeft === 1
    ? '1 seat left on your plan. Each invite holds a seat until it is accepted or revoked.'
    : `${seatsLeft} seats left on your plan. Each invite holds a seat until it is accepted or revoked.`;
}

// ============= PAGE =============

type View = 'active' | 'pending';

type PendingRemoval =
  | {kind: 'member'; row: Member}
  | {kind: 'invite'; row: Invite}
  | null;

function MembersPage() {
  // One clock for the whole page: every "last active" and "sent" is relative
  // to the moment it loaded, so the fixture reads the same on any day.
  const [now] = useState(() => Date.now());
  const showToast = useToast();

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [invites, setInvites] = useState<Invite[]>(INITIAL_INVITES);
  const [view, setView] = useState<View>('active');
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [page, setPage] = useState(1);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval>(null);

  // Seats are arithmetic over the two lists — never a separate counter.
  const seatsUsed = members.length + invites.length;
  const seatsLeft = SEAT_LIMIT - seatsUsed;
  const existingEmails = useMemo(
    () =>
      new Set([...members.map(m => m.email), ...invites.map(i => i.email)]),
    [members, invites],
  );

  // ----- Narrowing: one pass, one array per tab -----
  const term = query.trim().toLowerCase();
  const visibleMembers = useMemo(
    () =>
      members.filter(
        m =>
          (roleFilter === 'all' || m.role === roleFilter) &&
          (term === '' ||
            m.name.toLowerCase().includes(term) ||
            m.email.includes(term)),
      ),
    [members, roleFilter, term],
  );
  const visibleInvites = useMemo(
    () =>
      invites.filter(
        i =>
          (roleFilter === 'all' || i.role === roleFilter) &&
          (term === '' || i.email.includes(term)),
      ),
    [invites, roleFilter, term],
  );
  const visibleCount =
    view === 'active' ? visibleMembers.length : visibleInvites.length;
  const pageCount = Math.max(1, Math.ceil(visibleCount / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const sliceStart = (currentPage - 1) * PAGE_SIZE;
  const hasFilters = term !== '' || roleFilter !== 'all';

  const clearFilters = () => {
    setQuery('');
    setRoleFilter('all');
    setPage(1);
  };

  // ----- Mutations -----
  const changeMemberRole = useCallback(
    (row: Member, role: Role) => {
      if (row.role === role || row.role === 'owner') {
        return;
      }
      setMembers(list =>
        list.map(m => (m.id === row.id ? {...m, role} : m)),
      );
      showToast({
        body: roleChangedMessage(row.name, role),
        uniqueID: `role-${row.id}`,
      });
    },
    [showToast],
  );

  const changeInviteRole = useCallback(
    (row: Invite, role: Role) => {
      if (row.role === role) {
        return;
      }
      setInvites(list =>
        list.map(i => (i.id === row.id ? {...i, role} : i)),
      );
      showToast({body: 'Invite role updated', uniqueID: `role-${row.id}`});
    },
    [showToast],
  );

  const resendInvite = useCallback(
    (row: Invite) => {
      setInvites(list =>
        list.map(i => (i.id === row.id ? {...i, sentAgo: 0} : i)),
      );
      showToast({body: 'Invite resent', uniqueID: `resend-${row.id}`});
    },
    [showToast],
  );

  const confirmRemoval = () => {
    if (pendingRemoval == null) {
      return;
    }
    if (pendingRemoval.kind === 'member') {
      const removed = pendingRemoval.row;
      const index = members.findIndex(m => m.id === removed.id);
      setMembers(list => list.filter(m => m.id !== removed.id));
      showToast({
        body: `Removed ${removed.name} from the workspace`,
        uniqueID: `remove-${removed.id}`,
        endContent: (
          <Button
            label="Undo"
            variant="ghost"
            size="sm"
            onClick={() =>
              setMembers(list =>
                list.some(m => m.id === removed.id)
                  ? list
                  : [...list.slice(0, index), removed, ...list.slice(index)],
              )
            }
          />
        ),
      });
    } else {
      const removed = pendingRemoval.row;
      setInvites(list => list.filter(i => i.id !== removed.id));
      showToast({body: 'Invite revoked', uniqueID: `revoke-${removed.id}`});
    }
    setPendingRemoval(null);
  };

  const sendInvites = (emails: string[], role: Role) => {
    setInvites(list => [
      ...emails.map((email, index) => ({
        id: `inv-new-${list.length + index}-${email}`,
        email,
        role,
        invitedBy: 'Nadia Rahman',
        sentAgo: 0,
      })),
      ...list,
    ]);
    clearFilters();
    setView('pending');
    showToast({
      body: invitationsSentMessage(emails.length),
      uniqueID: 'invites-sent',
    });
  };

  // ----- Row actions: built once, rendered by MoreMenu and ContextMenu -----
  const memberActions = useCallback(
    (row: Member): DropdownMenuOption[] => {
      const isOwner = row.role === 'owner';
      return [
        {
          label: 'Change role',
          isDisabled: isOwner,
          description: isOwner ? 'Transfer ownership first' : undefined,
          items: ASSIGNABLE_ROLES.map(role => ({
            label: ROLE_LABEL[role],
            isDisabled: isOwner || row.role === role,
            onClick: () => changeMemberRole(row, role),
          })),
        },
        {type: 'divider'},
        {
          label: 'Remove from workspace',
          variant: 'destructive',
          isDisabled: isOwner,
          description: isOwner ? 'The owner cannot be removed' : undefined,
          onClick: () => setPendingRemoval({kind: 'member', row}),
        },
      ];
    },
    [changeMemberRole],
  );

  const inviteActions = useCallback(
    (row: Invite): DropdownMenuOption[] => [
      {
        label: 'Change role',
        items: ASSIGNABLE_ROLES.map(role => ({
          label: ROLE_LABEL[role],
          isDisabled: row.role === role,
          onClick: () => changeInviteRole(row, role),
        })),
      },
      {label: 'Resend invite', onClick: () => resendInvite(row)},
      {type: 'divider'},
      {
        label: 'Revoke invite',
        variant: 'destructive',
        onClick: () => setPendingRemoval({kind: 'invite', row}),
      },
    ],
    [changeInviteRole, resendInvite],
  );

  const memberContext = useRowContextMenu<Member>(
    useCallback(
      row => toContextActions(memberActions(row), ROLE_LABEL[row.role]),
      [memberActions],
    ),
  );
  const inviteContext = useRowContextMenu<Invite>(
    useCallback(
      row => toContextActions(inviteActions(row), ROLE_LABEL[row.role]),
      [inviteActions],
    ),
  );

  // ----- Columns -----
  const memberColumns = useMemo<TableColumn<Member>[]>(
    () => [
      {
        key: 'name',
        header: 'Name',
        width: proportional(3),
        renderCell: row => <MemberCell row={row} />,
      },
      {
        key: 'role',
        header: 'Role',
        width: pixel(168),
        renderCell: row => (
          <RoleCell
            role={row.role}
            label={`Role for ${row.name}`}
            onChange={role => changeMemberRole(row, role)}
          />
        ),
      },
      {
        key: 'lastActive',
        header: 'Last active',
        width: pixel(152),
        renderCell: row => (
          <Timestamp
            value={now - row.lastActiveAgo * MINUTE}
            format="auto"
            type="body"
          />
        ),
      },
      {
        key: 'status',
        header: 'Status',
        width: pixel(160),
        // Only states someone should act on. A healthy member shows nothing.
        renderCell: row =>
          row.hasTwoFactor ? null : <Badge variant="warning" label="2FA off" />,
      },
      {
        key: 'actions',
        header: <VisuallyHidden>Actions</VisuallyHidden>,
        width: pixel(56),
        align: 'end',
        renderCell: row => (
          <MoreMenu
            label={`Actions for ${row.name}`}
            size="sm"
            alignment="end"
            items={memberActions(row)}
          />
        ),
      },
    ],
    [changeMemberRole, memberActions, now],
  );

  const inviteColumns = useMemo<TableColumn<Invite>[]>(
    () => [
      {
        key: 'email',
        header: 'Invitee',
        width: proportional(3),
        renderCell: row => <InviteeCell row={row} />,
      },
      {
        key: 'role',
        header: 'Role',
        width: pixel(168),
        renderCell: row => (
          <RoleCell
            role={row.role}
            label={`Role for ${row.email}`}
            onChange={role => changeInviteRole(row, role)}
          />
        ),
      },
      {
        key: 'sent',
        header: 'Sent',
        width: pixel(152),
        renderCell: row => (
          <Timestamp
            value={now - row.sentAgo * MINUTE}
            format="relative"
            type="body"
          />
        ),
      },
      {
        key: 'status',
        header: 'Status',
        width: pixel(160),
        renderCell: row =>
          isExpired(row) ? (
            <Badge variant="error" label="Invite expired" />
          ) : null,
      },
      {
        key: 'actions',
        header: <VisuallyHidden>Actions</VisuallyHidden>,
        width: pixel(56),
        align: 'end',
        renderCell: row => (
          <MoreMenu
            label={`Actions for ${row.email}`}
            size="sm"
            alignment="end"
            items={inviteActions(row)}
          />
        ),
      },
    ],
    [changeInviteRole, inviteActions, now],
  );

  const seatRatio = seatsUsed / SEAT_LIMIT;

  const inviteButton = (
    <Button
      label="Invite members"
      variant="primary"
      icon={<Icon icon={UserPlusIcon} size="sm" />}
      onClick={() => setIsInviteOpen(true)}
    />
  );

  const noMatches = (
    <EmptyState
      title={view === 'active' ? 'No members match' : 'No invites match'}
      description="Try a different name or email, or clear the role filter."
      icon={<Icon icon={MagnifyingGlassIcon} size="lg" />}
      actions={
        <Button
          label="Clear filters"
          variant="secondary"
          onClick={clearFilters}
        />
      }
    />
  );

  return (
    <Layout
      height="fill"
      contentWidth={1120}
      padding={6}
      content={
        <LayoutContent>
          <VStack gap={6}>
            {/* Masthead: what this is, how much room is left, the one primary
                action. The seat meter sits beside the button it limits. */}
            <HStack gap={6} vAlign="end" wrap="wrap">
              <StackItem size="fill">
                <VStack gap={1}>
                  <Heading level={1}>Members</Heading>
                  <Text color="secondary">
                    Manage who can access Meridian Works and what each person can
                    do.
                  </Text>
                </VStack>
              </StackItem>
              <HStack gap={5} vAlign="center" wrap="wrap">
                <VStack gap={1.5} width={220}>
                  <HStack gap={2} hAlign="between" vAlign="center">
                    <Text type="supporting" weight="medium">
                      {`${seatsUsed} of ${SEAT_LIMIT} seats used`}
                    </Text>
                    <Link href="#" type="supporting">
                      Add seats
                    </Link>
                  </HStack>
                  <ProgressBar
                    label="Seats used"
                    isLabelHidden
                    value={seatsUsed}
                    max={SEAT_LIMIT}
                    variant={seatRatio >= 0.9 ? 'warning' : 'accent'}
                  />
                </VStack>
                {inviteButton}
              </HStack>
            </HStack>

            <VStack gap={3}>
              {/* Mode first (which list), then the narrowing controls that
                  apply to it. */}
              <HStack gap={3} vAlign="center" wrap="wrap">
                <StackItem size="fill">
                  <SegmentedControl
                    label="Show members or pending invites"
                    value={view}
                    onChange={value => {
                      setView(value as View);
                      setPage(1);
                    }}>
                    <SegmentedControlItem value="active" label="Active" />
                    <SegmentedControlItem
                      value="pending"
                      label="Pending invites"
                    />
                  </SegmentedControl>
                </StackItem>
                <VStack width={260}>
                  <TextInput
                    label="Search members"
                    isLabelHidden
                    value={query}
                    onChange={value => {
                      setQuery(value);
                      setPage(1);
                    }}
                    placeholder="Search by name or email"
                    startIcon={<Icon icon={MagnifyingGlassIcon} size="sm" />}
                  />
                </VStack>
                <Selector
                  label="Filter by role"
                  isLabelHidden
                  width={160}
                  options={ROLE_FILTER_OPTIONS}
                  value={roleFilter}
                  onChange={value => {
                    setRoleFilter(value as Role | 'all');
                    setPage(1);
                  }}
                />
              </HStack>

              {view === 'pending' && invites.length === 0 ? (
                <EmptyState
                  title="No pending invites"
                  description="Everyone you invited has joined. New invitations wait here until they are accepted, and expire after 7 days."
                  icon={<Icon icon={EnvelopeIcon} size="lg" />}
                  actions={inviteButton}
                />
              ) : visibleCount === 0 ? (
                noMatches
              ) : view === 'active' ? (
                <Table<Member>
                  data={visibleMembers.slice(sliceStart, sliceStart + PAGE_SIZE)}
                  columns={memberColumns}
                  idKey="id"
                  density="balanced"
                  hasHover
                  textOverflow="truncate"
                  plugins={{context: memberContext}}
                  rowIndexStart={sliceStart + 1}
                  rowCount={visibleMembers.length}
                />
              ) : (
                <Table<Invite>
                  data={visibleInvites.slice(sliceStart, sliceStart + PAGE_SIZE)}
                  columns={inviteColumns}
                  idKey="id"
                  density="balanced"
                  hasHover
                  textOverflow="truncate"
                  plugins={{context: inviteContext}}
                  rowIndexStart={sliceStart + 1}
                  rowCount={visibleInvites.length}
                />
              )}

              {visibleCount > 0 && (
                // The range sits at the start, the pager at the end; the
                // pager is left out entirely when one page holds everything.
                <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap">
                  <Text type="supporting" color="secondary">
                    {rangeLabel(
                      sliceStart + 1,
                      Math.min(sliceStart + PAGE_SIZE, visibleCount),
                      visibleCount,
                    )}
                  </Text>
                  {pageCount > 1 && (
                    <Pagination
                      page={currentPage}
                      onChange={setPage}
                      totalItems={visibleCount}
                      pageSize={PAGE_SIZE}
                      label={view === 'active' ? 'Member pages' : 'Invite pages'}
                    />
                  )}
                </HStack>
              )}
            </VStack>
          </VStack>

          <InviteDialog
            isOpen={isInviteOpen}
            onOpenChange={setIsInviteOpen}
            seatsLeft={seatsLeft}
            existingEmails={existingEmails}
            onSend={sendInvites}
          />

          <AlertDialog
            isOpen={pendingRemoval != null}
            onOpenChange={open => {
              if (!open) {
                setPendingRemoval(null);
              }
            }}
            title={
              pendingRemoval?.kind === 'member'
                ? `Remove ${pendingRemoval.row.name}?`
                : 'Revoke this invite?'
            }
            description={
              pendingRemoval?.kind === 'member'
                ? 'They lose access to every project in Meridian Works right away and their seat is freed. Their projects and comments stay in the workspace.'
                : 'The invitation link stops working and the seat it was holding is freed. You can invite the same address again later.'
            }
            actionLabel={
              pendingRemoval?.kind === 'member'
                ? 'Remove member'
                : 'Revoke invite'
            }
            onAction={confirmRemoval}
          />
        </LayoutContent>
      }
    />
  );
}

/**
 * The page owns its toast viewport rather than relying on the self-mounted
 * fallback. Mounted inside the page, toasts inherit its direction (they rise
 * at the logical end in Arabic too) and its theme, and an app shell that
 * already provides one can drop this wrapper without touching the page.
 */
export default function SettingsMembersTemplate() {
  return (
    <ToastViewport>
      <MembersPage />
    </ToastViewport>
  );
}
