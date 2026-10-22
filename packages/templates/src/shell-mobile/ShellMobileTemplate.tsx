'use client';

/**
 * Mobile App Shell — the frame of a phone-first field app ("Sitewalk") that a
 * site supervisor carries around a construction site all shift: today's
 * tasks, open inspections, and a profile, one thumb away.
 *
 * What picks this template over the other shells: it is designed for a
 * ~390px-wide phone screen first, not a desktop shell squeezed down.
 * `shell-side-nav`, `shell-top-nav` and `shell-nav` are desktop frames that
 * collapse into a hamburger on a phone; here the phone layout IS the layout.
 * Primary navigation is a bottom tab bar within reach of the thumb, every
 * transient surface is a `BottomSheet` (never a popover or a centred dialog),
 * touch targets use the large sizes (`size="lg"` buttons and fields, full-row
 * list items, 56px tab buttons), and secondary destinations live
 * in a `MobileNav` drawer. On a wide screen the same phone column is shown
 * centred on a neutral canvas — a preview of the phone, not a stretched app.
 *
 * Frame (top to bottom, inside the phone column):
 *   app bar     menu (or back on a sub-screen) | screen title | notifications
 *   content     the selected tab's screen, or a pushed sub-screen
 *   FAB         "New inspection" on Today and Inspections
 *   bottom nav  Today · Tasks · Inspections · Profile, safe-area padded
 *
 * ## The bottom tab bar is composed, on purpose
 *
 * Solo has no bottom-tab component, and none of the near misses fit:
 * - `TabList` lays icon and label side by side on an underline rail and is
 *   built for a strip at the top of a view; a phone tab bar stacks the icon
 *   over a short label and sits at the bottom edge.
 * - `SegmentedControl` is an input (a radio group), not navigation — its docs
 *   say so explicitly.
 * - `MobileNav` is a drawer; `NavIcon` is display-only.
 *
 * So `BottomTabBar` below is a `<nav aria-label="Primary">` holding four plain
 * `<button>`s, the current one marked `aria-current="page"`. That is the
 * navigation-landmark pattern, not `role="tablist"`: switching tabs replaces
 * the whole screen (title, content and actions), which is navigation between
 * views, not panels switching in place. The buttons are painted only with
 * tokens — accent ink and a muted accent pill for the current tab, an outline
 * icon becoming solid when selected — and inherit the standard focus ring
 * through the `--focus-outline-*` tokens. Each is at least 56px tall and a
 * quarter of the width, well over the 44–48px touch-target minimum. Solo's
 * largest IconButton is 36px, so the app-bar buttons rely on the bar's
 * padding for spacing; if your platform guidelines demand 44px, give them a
 * larger hit area rather than a larger icon.
 *
 * ## Extending this template
 *
 * ### Routing
 *
 * **One state for the tab, one for the sub-screen.** `tab` picks a root
 * screen; `subScreen` pushes one level on top of it (notifications, an
 * inspection, help) and swaps the app bar's menu button for a back button.
 * Changing tabs clears the sub-screen, the way a native tab bar returns each
 * tab to its root. With a router, make each tab a route segment
 * (`/today`, `/tasks`…) and each sub-screen a child route; keep the bar's
 * `aria-current` derived from the route rather than stored beside it.
 *
 * **The back button is the only way up.** There are no breadcrumbs on a
 * phone. The arrow mirrors in right-to-left (`rtlStyles.mirror`), because
 * "back" points toward the reading start.
 *
 * ### Sheets, not dialogs
 *
 * **Task details are an info sheet** (`height="hug"`, swipe and scrim
 * dismiss): nothing typed can be lost. **New inspection is a two-step
 * `BottomSheetSwitcher`**: the type picked on step 1 decides what step 2 asks
 * for, which is the case the switcher's docs describe. Step 2 is
 * `purpose="form"` and `height="tall"` — the form purpose stops a stray swipe
 * from discarding the notes, and only a fully expanded tall sheet lifts a
 * focused field above the phone keyboard. Because a form sheet ignores the
 * scrim, it carries its own close button.
 *
 * **Selectors inside sheets use `presentation="adaptive"`** so on a touch
 * device the options rise as a sheet too instead of a popover anchored to a
 * field the keyboard may be covering.
 *
 * ### The drawer
 *
 * `MobileNav` holds what is used rarely — site documents, settings, help,
 * sign out. Do not move a primary destination into it: anything a supervisor
 * opens several times a shift belongs in the bottom bar, and the bar should
 * stay at three to five items. `MobileNav` is used standalone here (controlled
 * `isOpen`) because there is no `AppShell`; inside an `AppShell`, use
 * `MobileNavToggle` instead of the `IconButton`. On a wide screen the drawer
 * and sheets still anchor to the browser window rather than the centred phone
 * column — a real phone build never shows that difference.
 *
 * ### Safe areas and the floating action
 *
 * The bar pads its block-end edge by `env(safe-area-inset-bottom)` so the
 * labels clear the home indicator; add `viewport-fit=cover` to the page's
 * viewport meta or the inset reads as zero. The FAB floats above the bar at
 * the inline-end edge (it mirrors in RTL) and the scrolling content reserves
 * the FAB's height at its end, so the last task is never trapped under it.
 *
 * ### Data
 *
 * Fixtures are deterministic and dated 22 October 2026; dates and times are
 * formatted with the active locale via `Intl.DateTimeFormat`, never by gluing
 * English words. Marking a task done or starting an inspection is local state
 * plus a `Toast`; in production send the change first and toast on success.
 * The summary card's numbers are derived from the task list, never stored
 * beside it, so the headline cannot disagree with the rows below it.
 */

import {useMemo, useState, type ReactNode} from 'react';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  VStack,
  HStack,
  StackItem,
} from '@solo/core/Layout';
import {Card} from '@solo/core/Card';
import {Grid} from '@solo/core/Grid';
import {Section} from '@solo/core/Section';
import {Text, Heading} from '@solo/core/Text';
import {Button} from '@solo/core/Button';
import {IconButton} from '@solo/core/IconButton';
import {Icon} from '@solo/core/Icon';
import type {IconType} from '@solo/core/Icon';
import {Badge} from '@solo/core/Badge';
import {Avatar} from '@solo/core/Avatar';
import {Divider} from '@solo/core/Divider';
import {List, ListItem} from '@solo/core/List';
import {MetadataList, MetadataListItem} from '@solo/core/MetadataList';
import {ProgressBar} from '@solo/core/ProgressBar';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@solo/core/SegmentedControl';
import {RadioList, RadioListItem} from '@solo/core/RadioList';
import {Selector} from '@solo/core/Selector';
import {TextArea} from '@solo/core/TextArea';
import {Switch} from '@solo/core/Switch';
import {Timestamp} from '@solo/core/Timestamp';
import {BottomSheet, BottomSheetSwitcher} from '@solo/core/BottomSheet';
import {MobileNav} from '@solo/core/MobileNav';
import {SideNavItem, SideNavSection} from '@solo/core/SideNav';
import {useToast} from '@solo/core/Toast';
import {useMediaQuery} from '@solo/core/hooks';
import {useLocale} from '@solo/core/i18n';
import {cn} from '@solo/core/utils/cn';
import {rtlStyles} from '@solo/core/utils/rtlStyles';
import {
  ArrowLeftIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckOutline,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon as HomeOutline,
  ListBulletIcon as ListBulletOutline,
  PhoneIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon as UserCircleOutline,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckSolid,
  HomeIcon as HomeSolid,
  ListBulletIcon as ListBulletSolid,
  UserCircleIcon as UserCircleSolid,
} from '@heroicons/react/24/solid';

// ============= TYPES =============

type TabId = 'today' | 'tasks' | 'inspections' | 'profile';
type TaskStatus = 'done' | 'inProgress' | 'upcoming' | 'blocked' | 'overdue';
type InspectionStatus = 'draft' | 'scheduled' | 'submitted' | 'failed';

interface Task {
  id: string;
  title: string;
  location: string;
  /** 0 = today, 1 = tomorrow. */
  day: 0 | 1;
  hour: number;
  minute: number;
  status: TaskStatus;
  assignedBy: string;
  checksDone: number;
  checksTotal: number;
  notes: string;
}

interface Inspection {
  id: string;
  type: string;
  location: string;
  inspector: string;
  status: InspectionStatus;
  day: number;
  hour: number;
  minute: number;
  checksDone: number;
  checksTotal: number;
}

type SubScreen =
  | {kind: 'notifications'}
  | {kind: 'help'}
  | {kind: 'inspection'; id: string};

// ============= DATA =============

/** The fixture's "today": every date below is relative to it. */
const TODAY = {year: 2026, month: 9, day: 22};

const USER = {
  name: 'Layla Haddad',
  firstName: 'Layla',
  role: 'Site supervisor',
  site: 'Harbor View Residences',
  block: 'Block C',
};

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Gate and hoarding walk',
    location: 'Site perimeter',
    day: 0,
    hour: 6,
    minute: 45,
    status: 'done',
    assignedBy: 'Daily routine',
    checksDone: 4,
    checksTotal: 4,
    notes: 'Check gates lock, hoarding panels are secure and signage is visible from the road.',
  },
  {
    id: 't2',
    title: 'Scaffold check',
    location: 'Level 4 · East elevation',
    day: 0,
    hour: 7,
    minute: 30,
    status: 'done',
    assignedBy: 'Omar Nasser',
    checksDone: 6,
    checksTotal: 6,
    notes: 'Confirm the scaffold tag is current before the façade crew starts.',
  },
  {
    id: 't3',
    title: 'Concrete pour sign-off',
    location: 'Slab 5B',
    day: 0,
    hour: 9,
    minute: 0,
    status: 'inProgress',
    assignedBy: 'Omar Nasser',
    checksDone: 3,
    checksTotal: 5,
    notes: 'Rebar cover and cast-in sleeves still to verify before the pump arrives.',
  },
  {
    id: 't4',
    title: 'Fire-stopping inspection',
    location: 'Stair core B · Levels 2–3',
    day: 0,
    hour: 10,
    minute: 30,
    status: 'overdue',
    assignedBy: 'Ahmed Saleh',
    checksDone: 0,
    checksTotal: 8,
    notes: 'Photograph every penetration before the drywall crew closes the shaft.',
  },
  {
    id: 't5',
    title: 'Toolbox talk: working at height',
    location: 'Site office',
    day: 0,
    hour: 13,
    minute: 0,
    status: 'upcoming',
    assignedBy: 'Daily routine',
    checksDone: 0,
    checksTotal: 1,
    notes: 'Fifteen minutes with the façade and roofing crews. Record attendance.',
  },
  {
    id: 't6',
    title: 'Electrical rough-in walkthrough',
    location: 'Unit 4.12',
    day: 0,
    hour: 14,
    minute: 30,
    status: 'blocked',
    assignedBy: 'Ahmed Saleh',
    checksDone: 0,
    checksTotal: 6,
    notes: 'Waiting on the electrical contractor to finish the kitchen circuits.',
  },
  {
    id: 't7',
    title: 'Daily site diary',
    location: 'Block C',
    day: 0,
    hour: 17,
    minute: 0,
    status: 'upcoming',
    assignedBy: 'Daily routine',
    checksDone: 0,
    checksTotal: 1,
    notes: 'Weather, headcount, deliveries and any incidents for the day.',
  },
  {
    id: 't8',
    title: 'Window installation check',
    location: 'Level 3 · North elevation',
    day: 1,
    hour: 8,
    minute: 0,
    status: 'upcoming',
    assignedBy: 'Omar Nasser',
    checksDone: 0,
    checksTotal: 5,
    notes: 'Check sealant, drainage holes and the protective film on every frame.',
  },
  {
    id: 't9',
    title: 'Crane lift plan review',
    location: 'Tower crane 2',
    day: 1,
    hour: 10,
    minute: 0,
    status: 'upcoming',
    assignedBy: 'Ahmed Saleh',
    checksDone: 0,
    checksTotal: 3,
    notes: 'Review the lift plan for the rooftop plant with the crane supervisor.',
  },
];

const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: 'INS-2044',
    type: 'Fire stopping',
    location: 'Stair core B',
    inspector: 'Layla Haddad',
    status: 'scheduled',
    day: 0,
    hour: 10,
    minute: 30,
    checksDone: 0,
    checksTotal: 8,
  },
  {
    id: 'INS-2043',
    type: 'Pre-pour concrete',
    location: 'Slab 5B',
    inspector: 'Layla Haddad',
    status: 'draft',
    day: 0,
    hour: 9,
    minute: 0,
    checksDone: 3,
    checksTotal: 5,
  },
  {
    id: 'INS-2045',
    type: 'Electrical rough-in',
    location: 'Unit 4.12',
    inspector: 'Karim Mansour',
    status: 'scheduled',
    day: 1,
    hour: 14,
    minute: 30,
    checksDone: 0,
    checksTotal: 6,
  },
  {
    id: 'INS-2041',
    type: 'Scaffold',
    location: 'Level 4 · East elevation',
    inspector: 'Layla Haddad',
    status: 'submitted',
    day: 0,
    hour: 7,
    minute: 30,
    checksDone: 6,
    checksTotal: 6,
  },
  {
    id: 'INS-2038',
    type: 'Waterproofing',
    location: 'Basement car park',
    inspector: 'Karim Mansour',
    status: 'failed',
    day: -1,
    hour: 15,
    minute: 0,
    checksDone: 7,
    checksTotal: 9,
  },
];

const INSPECTION_TYPES = [
  {
    value: 'Pre-pour concrete',
    description: 'Rebar, cover, sleeves and formwork before a pour.',
  },
  {
    value: 'Scaffold',
    description: 'Tags, ties, guardrails and access ladders.',
  },
  {
    value: 'Fire stopping',
    description: 'Penetrations through fire-rated walls and floors.',
  },
  {
    value: 'Electrical rough-in',
    description: 'Boxes, conduit and circuits before walls close.',
  },
];

const LOCATIONS = [
  'Level 3 · North elevation',
  'Level 4 · East elevation',
  'Slab 5B',
  'Stair core B',
  'Unit 4.12',
  'Basement car park',
];

const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Ahmed Saleh assigned you a fire-stopping inspection',
    minutesAgo: 12,
  },
  {
    id: 'n2',
    title: 'The electrical contractor flagged Unit 4.12 as not ready',
    minutesAgo: 48,
  },
  {
    id: 'n3',
    title: 'Concrete pump for Slab 5B confirmed for 11:00',
    minutesAgo: 95,
  },
];

const HELP_TOPICS = [
  {
    title: 'Working offline',
    description: 'Inspections save on the phone and sync when you have signal.',
  },
  {
    title: 'Adding photos to a check',
    description: 'Open a check and tap the camera to attach up to ten photos.',
  },
  {
    title: 'Reassigning a task',
    description: 'Ask the person who assigned it; supervisors cannot reassign.',
  },
];

const TABS: {
  id: TabId;
  label: string;
  icon: IconType;
  selectedIcon: IconType;
}[] = [
  {id: 'today', label: 'Today', icon: HomeOutline, selectedIcon: HomeSolid},
  {
    id: 'tasks',
    label: 'Tasks',
    icon: ListBulletOutline,
    selectedIcon: ListBulletSolid,
  },
  {
    id: 'inspections',
    label: 'Inspections',
    icon: ClipboardDocumentCheckOutline,
    selectedIcon: ClipboardDocumentCheckSolid,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: UserCircleOutline,
    selectedIcon: UserCircleSolid,
  },
];

const INSPECTION_STATUS_LABEL: Record<InspectionStatus, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  submitted: 'Submitted',
  failed: 'Failed',
};

/** The phone the layout is designed for, used for the wide-screen preview. */
const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;

// ============= HELPERS =============

function fixtureDate(day: number, hour = 0, minute = 0): Date {
  return new Date(TODAY.year, TODAY.month, TODAY.day + day, hour, minute);
}

function useFormatters() {
  const locale = useLocale();
  return useMemo(() => {
    const time = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
    });
    const longDate = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    const shortDate = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return {
      time: (day: number, hour: number, minute: number) =>
        time.format(fixtureDate(day, hour, minute)),
      longDate: (day: number) => longDate.format(fixtureDate(day)),
      shortDate: (day: number) => shortDate.format(fixtureDate(day)),
      /** A same-day time range, punctuated and ordered by the locale. */
      timeRange: (from: number, to: number) =>
        time.formatRange(fixtureDate(0, from), fixtureDate(0, to)),
    };
  }, [locale]);
}

// ============= SHARED PIECES =============

const tabBarStyles = {
  nav: cn(
    'flex items-stretch bg-(--color-background-surface)',
    'px-(--spacing-1) pt-(--spacing-1)',
  ),
  tab: cn(
    'flex-1 min-w-0 min-h-14 flex flex-col items-center justify-center',
    'gap-(--spacing-1) py-(--spacing-1) px-(--spacing-1)',
    'bg-transparent [border-width:0] [border-style:none] cursor-pointer',
    'rounded-(--radius-element) text-(--color-text-secondary)',
    '[font-family:inherit] [-webkit-tap-highlight-color:transparent]',
    'focus-visible:[outline-width:var(--focus-outline-width)]',
    'focus-visible:[outline-style:var(--focus-outline-style)]',
    'focus-visible:[outline-color:var(--focus-outline-color)]',
    'focus-visible:[outline-offset:calc(-1*var(--focus-outline-width))]',
  ),
  tabSelected: 'text-(--color-text-accent)',
  pill: cn(
    'flex items-center justify-center h-8 w-14 rounded-(--radius-full)',
    '[transition-property:background-color] [transition-duration:var(--duration-medium)]',
    'can-hover:hover:bg-(--color-overlay-hover)',
  ),
  pillSelected: 'bg-(--color-accent-muted) can-hover:hover:bg-(--color-accent-muted)',
  label: 'text-(length:--text-supporting-size) leading-(--text-supporting-leading) max-w-full truncate',
  labelSelected: 'font-(number:--font-weight-semibold)',
} as const;

/**
 * The phone's bottom navigation. See the header comment for why this is a
 * composed `<nav>` with `aria-current` rather than a Solo component.
 */
function BottomTabBar({
  value,
  onChange,
}: {
  value: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <nav
      aria-label="Primary"
      className={tabBarStyles.nav}
      style={{
        paddingBlockEnd:
          'max(var(--spacing-2), env(safe-area-inset-bottom, 0px))',
      }}>
      {TABS.map(tab => {
        const isSelected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            aria-current={isSelected ? 'page' : undefined}
            onClick={() => onChange(tab.id)}
            className={cn(
              tabBarStyles.tab,
              isSelected && tabBarStyles.tabSelected,
            )}>
            <span
              className={cn(
                tabBarStyles.pill,
                isSelected && tabBarStyles.pillSelected,
              )}>
              <Icon
                icon={isSelected ? tab.selectedIcon : tab.icon}
                size="md"
              />
            </span>
            <span
              className={cn(
                tabBarStyles.label,
                isSelected && tabBarStyles.labelSelected,
              )}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/** Section title inside a screen: visually small, semantically an h2. */
function ScreenSectionTitle({
  children,
  endContent,
}: {
  children: string;
  endContent?: ReactNode;
}) {
  return (
    <HStack gap={2} vAlign="center" paddingInline={1}>
      <StackItem size="fill">
        <Heading level={4} accessibilityLevel={2}>
          {children}
        </Heading>
      </StackItem>
      {endContent}
    </HStack>
  );
}

function TaskStatusEnd({status}: {status: TaskStatus}) {
  switch (status) {
    case 'done':
      return <Icon icon={CheckCircleIcon} color="success" label="Done" />;
    case 'inProgress':
      return (
        <Text type="supporting" color="accent" weight="medium">
          In progress
        </Text>
      );
    case 'blocked':
      return <Badge variant="error" label="Blocked" />;
    case 'overdue':
      return <Badge variant="warning" label="Overdue" />;
    default:
      return null;
  }
}

function TaskRow({
  task,
  onOpen,
}: {
  task: Task;
  onOpen: (id: string) => void;
}) {
  const fmt = useFormatters();
  const isDone = task.status === 'done';
  return (
    <ListItem
      onClick={() => onOpen(task.id)}
      startContent={
        <VStack width={72}>
          <Text
            type="label"
            hasTabularNumbers
            color={isDone ? 'secondary' : 'primary'}>
            {fmt.time(task.day, task.hour, task.minute)}
          </Text>
        </VStack>
      }
      label={
        <Text
          type="label"
          maxLines={1}
          color={isDone ? 'secondary' : 'primary'}>
          {task.title}
        </Text>
      }
      description={task.location}
      endContent={<TaskStatusEnd status={task.status} />}
    />
  );
}

function InspectionStatusBadge({status}: {status: InspectionStatus}) {
  // Badge only what needs attention: a failed inspection or an unfinished
  // draft. Scheduled and submitted are the normal states — plain text.
  if (status === 'failed') {
    return <Badge variant="error" label="Failed" />;
  }
  if (status === 'draft') {
    return <Badge variant="warning" label="Draft" />;
  }
  return (
    <Text type="supporting" color="secondary">
      {INSPECTION_STATUS_LABEL[status]}
    </Text>
  );
}

function InspectionRow({
  inspection,
  onOpen,
}: {
  inspection: Inspection;
  onOpen: (id: string) => void;
}) {
  const fmt = useFormatters();
  const when =
    inspection.day === 0
      ? fmt.time(inspection.day, inspection.hour, inspection.minute)
      : fmt.shortDate(inspection.day);
  return (
    <ListItem
      onClick={() => onOpen(inspection.id)}
      startContent={
        <IconTile>
          <Icon icon={ClipboardDocumentCheckOutline} color="secondary" />
        </IconTile>
      }
      label={
        <Text type="label" maxLines={1}>
          {inspection.type}
        </Text>
      }
      description={
        <Text type="supporting" color="secondary" maxLines={1}>
          {inspection.location}
          {' · '}
          {when}
        </Text>
      }
      endContent={<InspectionStatusBadge status={inspection.status} />}
    />
  );
}

/** A 40px rounded tile that seats a row's leading icon. */
function IconTile({children}: {children: ReactNode}) {
  return (
    <span className="flex items-center justify-center size-10 shrink-0 rounded-(--radius-element) bg-(--color-background-muted)">
      {children}
    </span>
  );
}

// ============= SCREENS =============

function TodayScreen({
  tasks,
  onOpenTask,
}: {
  tasks: Task[];
  onOpenTask: (id: string) => void;
}) {
  const fmt = useFormatters();
  const today = tasks.filter(t => t.day === 0);
  const doneCount = today.filter(t => t.status === 'done').length;
  const attention = today.filter(
    t => t.status === 'blocked' || t.status === 'overdue',
  ).length;

  return (
    <VStack gap={6}>
      <VStack gap={1} paddingInline={1}>
        <Text type="supporting" color="secondary">
          {fmt.longDate(0)}
        </Text>
        <Heading level={2}>{`Good morning, ${USER.firstName}`}</Heading>
      </VStack>

      <Card padding={4}>
        <VStack gap={4}>
          <VStack gap={1}>
            <Text type="label">{`${USER.site} · ${USER.block}`}</Text>
            <Text type="supporting" color="secondary">
              {`${doneCount} of ${today.length} tasks done`}
            </Text>
          </VStack>
          <ProgressBar
            label="Tasks done today"
            isLabelHidden
            value={doneCount}
            max={today.length}
            variant="success"
          />
          <Divider />
          <HStack gap={3}>
            <SummaryStat value="38" label="Crew on site" />
            <SummaryStat value="3" label="Inspections due" />
            <SummaryStat
              value={String(attention)}
              label="Need attention"
              isWarning={attention > 0}
            />
          </HStack>
        </VStack>
      </Card>

      <VStack gap={2}>
        <ScreenSectionTitle>Today’s tasks</ScreenSectionTitle>
        <Card padding={0}>
          <List hasDividers density="spacious">
            {today.map(task => (
              <TaskRow key={task.id} task={task} onOpen={onOpenTask} />
            ))}
          </List>
        </Card>
      </VStack>
    </VStack>
  );
}

function SummaryStat({
  value,
  label,
  isWarning = false,
}: {
  value: string;
  label: string;
  isWarning?: boolean;
}) {
  return (
    <StackItem size="fill">
      <VStack gap={0.5}>
        <Text type="large" weight="semibold" hasTabularNumbers>
          <span
            className={
              isWarning ? 'text-(--color-text-orange)' : undefined
            }>
            {value}
          </span>
        </Text>
        <Text type="supporting" color="secondary">
          {label}
        </Text>
      </VStack>
    </StackItem>
  );
}

function TasksScreen({
  tasks,
  onOpenTask,
}: {
  tasks: Task[];
  onOpenTask: (id: string) => void;
}) {
  const fmt = useFormatters();
  const [filter, setFilter] = useState<'open' | 'done'>('open');
  const visible = tasks.filter(t =>
    filter === 'done' ? t.status === 'done' : t.status !== 'done',
  );
  const groups = [0, 1]
    .map(day => ({day, items: visible.filter(t => t.day === day)}))
    .filter(g => g.items.length > 0);

  return (
    <VStack gap={6}>
      <SegmentedControl
        label="Show tasks"
        value={filter}
        onChange={v => setFilter(v as 'open' | 'done')}
        layout="fill"
        size="lg">
        <SegmentedControlItem value="open" label="Open" />
        <SegmentedControlItem value="done" label="Done" />
      </SegmentedControl>
      {groups.map(group => (
        <VStack key={group.day} gap={2}>
          <ScreenSectionTitle
            endContent={
              <Text type="supporting" color="secondary">
                {fmt.shortDate(group.day)}
              </Text>
            }>
            {group.day === 0 ? 'Today' : 'Tomorrow'}
          </ScreenSectionTitle>
          <Card padding={0}>
            <List hasDividers density="spacious">
              {group.items.map(task => (
                <TaskRow key={task.id} task={task} onOpen={onOpenTask} />
              ))}
            </List>
          </Card>
        </VStack>
      ))}
    </VStack>
  );
}

function InspectionsScreen({
  inspections,
  onOpen,
}: {
  inspections: Inspection[];
  onOpen: (id: string) => void;
}) {
  const open = inspections.filter(
    i => i.status === 'draft' || i.status === 'scheduled',
  );
  const closed = inspections.filter(
    i => i.status === 'submitted' || i.status === 'failed',
  );
  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <ScreenSectionTitle>Open</ScreenSectionTitle>
        <Card padding={0}>
          <List hasDividers density="spacious">
            {open.map(i => (
              <InspectionRow key={i.id} inspection={i} onOpen={onOpen} />
            ))}
          </List>
        </Card>
      </VStack>
      <VStack gap={2}>
        <ScreenSectionTitle>Recently closed</ScreenSectionTitle>
        <Card padding={0}>
          <List hasDividers density="spacious">
            {closed.map(i => (
              <InspectionRow key={i.id} inspection={i} onOpen={onOpen} />
            ))}
          </List>
        </Card>
      </VStack>
    </VStack>
  );
}

function ProfileScreen() {
  const fmt = useFormatters();
  const [isOffline, setIsOffline] = useState(true);
  const [isPushOn, setIsPushOn] = useState(true);
  return (
    <VStack gap={6}>
      <HStack gap={4} vAlign="center" paddingInline={1}>
        <Avatar name={USER.name} size={64} tooltip={false} />
        <VStack gap={1}>
          <Heading level={2}>{USER.name}</Heading>
          <Text type="supporting" color="secondary">
            {`${USER.role} · ${USER.site}`}
          </Text>
        </VStack>
      </HStack>
      <Card padding={4}>
        <MetadataList title={<Heading level={4} accessibilityLevel={2}>Details</Heading>}>
          <MetadataListItem label="Employee ID">SV-3318</MetadataListItem>
          <MetadataListItem label="Phone">
            {/* A phone number reads left to right in every locale. */}
            <span dir="ltr">+971 50 214 7781</span>
          </MetadataListItem>
          <MetadataListItem label="Shift">{fmt.timeRange(6, 16)}</MetadataListItem>
          <MetadataListItem label="Certifications">
            First aid, working at height
          </MetadataListItem>
        </MetadataList>
      </Card>
      <VStack gap={2}>
        <ScreenSectionTitle>On this phone</ScreenSectionTitle>
        <Card padding={4}>
          <VStack gap={4}>
            <Switch
              label="Keep drawings offline"
              description="Plans for Block C, about 240 MB."
              value={isOffline}
              onChange={setIsOffline}
            />
            <Divider />
            <Switch
              label="Push notifications"
              description="New assignments and flagged areas."
              value={isPushOn}
              onChange={setIsPushOn}
            />
          </VStack>
        </Card>
      </VStack>
    </VStack>
  );
}

function NotificationsScreen({mountedAt}: {mountedAt: number}) {
  return (
    <Card padding={0}>
      <List hasDividers density="spacious">
        {NOTIFICATIONS.map(n => (
          <ListItem
            key={n.id}
            startContent={
              <IconTile>
                <Icon icon={BellIcon} color="secondary" />
              </IconTile>
            }
            label={<Text type="label">{n.title}</Text>}
            description={
              <Timestamp
                value={mountedAt - n.minutesAgo * 60_000}
                format="relative"
              />
            }
          />
        ))}
      </List>
    </Card>
  );
}

function HelpScreen({onCall}: {onCall: () => void}) {
  return (
    <VStack gap={6}>
      <Card padding={0}>
        <List hasDividers density="spacious">
          {HELP_TOPICS.map(t => (
            <ListItem key={t.title} label={t.title} description={t.description} />
          ))}
        </List>
      </Card>
      <Card padding={4} variant="muted">
        <VStack gap={3}>
          <VStack gap={1}>
            <Text type="label">Still stuck?</Text>
            <Text type="supporting" color="secondary">
              The site office answers from 06:00 to 18:00.
            </Text>
          </VStack>
          <Button
            label="Call site office"
            variant="secondary"
            size="lg"
            width="100%"
            icon={<Icon icon={PhoneIcon} />}
            onClick={onCall}
          />
        </VStack>
      </Card>
    </VStack>
  );
}

function InspectionDetailScreen({
  inspection,
  onContinue,
}: {
  inspection: Inspection;
  onContinue: () => void;
}) {
  const fmt = useFormatters();
  const isOpen =
    inspection.status === 'draft' || inspection.status === 'scheduled';
  return (
    <VStack gap={6}>
      <VStack gap={2} paddingInline={1}>
        <HStack gap={2} vAlign="center">
          <Text type="supporting" color="secondary">
            {inspection.id}
          </Text>
          <InspectionStatusBadge status={inspection.status} />
        </HStack>
        <Heading level={2}>{inspection.type}</Heading>
      </VStack>
      <Card padding={4}>
        <VStack gap={4}>
          <MetadataList>
            <MetadataListItem label="Location">
              {inspection.location}
            </MetadataListItem>
            <MetadataListItem label="Inspector">
              {inspection.inspector}
            </MetadataListItem>
            <MetadataListItem label="Scheduled for">
              {`${fmt.shortDate(inspection.day)} · ${fmt.time(inspection.day, inspection.hour, inspection.minute)}`}
            </MetadataListItem>
          </MetadataList>
          <Divider />
          <ProgressBar
            label="Checks completed"
            value={inspection.checksDone}
            max={inspection.checksTotal}
            hasValueLabel
            formatValueLabel={(v, max) => `${v} of ${max} checks`}
            variant={inspection.status === 'failed' ? 'error' : 'accent'}
          />
        </VStack>
      </Card>
      {isOpen && (
        <Button
          label={
            inspection.status === 'draft'
              ? 'Continue inspection'
              : 'Start inspection'
          }
          variant="primary"
          size="lg"
          width="100%"
          onClick={onContinue}
        />
      )}
    </VStack>
  );
}

// ============= SHEETS =============

/**
 * Top padding for sheet content: the grab pill floats over the first 24px of
 * the sheet, so content starts below that band instead of at the usual 16px.
 */
const SHEET_TOP_INSET = 6;

function SheetHeader({
  title,
  subtitle,
  closeLabel,
  onClose,
}: {
  title: string;
  subtitle?: ReactNode;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <HStack gap={2} vAlign="start">
      <StackItem size="fill">
        <VStack gap={1}>
          <Heading level={3} accessibilityLevel={2}>
            {title}
          </Heading>
          {subtitle != null && (
            <Text type="supporting" color="secondary">
              {subtitle}
            </Text>
          )}
        </VStack>
      </StackItem>
      <IconButton
        label={closeLabel}
        variant="ghost"
        size="lg"
        icon={<Icon icon={XMarkIcon} />}
        onClick={onClose}
      />
    </HStack>
  );
}

function TaskSheet({
  task,
  onClose,
  onToggleDone,
}: {
  task: Task | null;
  onClose: () => void;
  onToggleDone: (id: string) => void;
}) {
  const fmt = useFormatters();
  // Keep the last task while the sheet animates closed.
  const [shown, setShown] = useState<Task | null>(task);
  if (task && task !== shown) {
    setShown(task);
  }
  const t = task ?? shown;
  return (
    <BottomSheet
      isOpen={task != null}
      onOpenChange={open => !open && onClose()}
      label={t?.title ?? 'Task'}
      height="hug">
      {t && (
        <Section
          variant="transparent"
          padding={4}
          paddingBlockStart={SHEET_TOP_INSET}>
          <VStack gap={5}>
            <SheetHeader
              title={t.title}
              subtitle={t.location}
              closeLabel="Close task details"
              onClose={onClose}
            />
            <MetadataList>
              <MetadataListItem label="Status">
                {t.status === 'upcoming' ? (
                  <Text>Not started</Text>
                ) : (
                  <TaskStatusEnd status={t.status} />
                )}
              </MetadataListItem>
              <MetadataListItem label="Due">
                {`${fmt.shortDate(t.day)} · ${fmt.time(t.day, t.hour, t.minute)}`}
              </MetadataListItem>
              <MetadataListItem label="Assigned by">
                {t.assignedBy}
              </MetadataListItem>
              <MetadataListItem label="Checklist">
                {`${t.checksDone} of ${t.checksTotal} checks`}
              </MetadataListItem>
            </MetadataList>
            <Card variant="muted" padding={3}>
              <Text type="supporting">{t.notes}</Text>
            </Card>
            <VStack gap={2}>
              <Button
                label={t.status === 'done' ? 'Reopen task' : 'Mark as done'}
                variant={t.status === 'done' ? 'secondary' : 'primary'}
                size="lg"
                width="100%"
                icon={
                  t.status === 'done' ? undefined : (
                    <Icon icon={CheckCircleIcon} />
                  )
                }
                isDisabled={t.status === 'blocked'}
                onClick={() => onToggleDone(t.id)}
              />
              {t.status === 'blocked' && (
                <Text type="supporting" color="secondary" justify="center">
                  Blocked tasks can be closed once the blocker is cleared.
                </Text>
              )}
            </VStack>
          </VStack>
        </Section>
      )}
    </BottomSheet>
  );
}

function NewInspectionFlow({
  activeSheet,
  onActiveSheetChange,
  onSubmit,
}: {
  activeSheet: string | null;
  onActiveSheetChange: (sheet: string | null) => void;
  onSubmit: (type: string, location: string, notes: string) => void;
}) {
  const [type, setType] = useState(INSPECTION_TYPES[0].value);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const close = () => {
    onActiveSheetChange(null);
  };

  const reset = () => {
    setType(INSPECTION_TYPES[0].value);
    setLocation(undefined);
    setNotes('');
    setHasTriedSubmit(false);
  };

  const submit = () => {
    if (!location) {
      setHasTriedSubmit(true);
      return;
    }
    onSubmit(type, location, notes);
    reset();
  };

  return (
    <BottomSheetSwitcher
      activeSheet={activeSheet}
      onActiveSheetChange={onActiveSheetChange}>
      <BottomSheet sheetId="type" label="New inspection" height="capped">
        <Section
          variant="transparent"
          padding={4}
          paddingBlockStart={SHEET_TOP_INSET}>
          <VStack gap={5}>
            <SheetHeader
              title="New inspection"
              subtitle="Step 1 of 2"
              closeLabel="Cancel new inspection"
              onClose={close}
            />
            <RadioList
              label="Inspection type"
              value={type}
              onChange={setType}>
              {INSPECTION_TYPES.map(option => (
                <RadioListItem
                  key={option.value}
                  value={option.value}
                  label={option.value}
                  description={option.description}
                />
              ))}
            </RadioList>
            <Button
              label="Continue"
              variant="primary"
              size="lg"
              width="100%"
              onClick={() => onActiveSheetChange('details')}
            />
          </VStack>
        </Section>
      </BottomSheet>
      <BottomSheet
        sheetId="details"
        label="Inspection details"
        purpose="form"
        height="tall">
        <Section
          variant="transparent"
          padding={4}
          paddingBlockStart={SHEET_TOP_INSET}>
          <form
            noValidate
            onSubmit={e => {
              e.preventDefault();
              submit();
            }}>
            <VStack gap={5}>
              <SheetHeader
                title={type}
                subtitle="Step 2 of 2"
                closeLabel="Cancel new inspection"
                onClose={close}
              />
              <Selector
                label="Location"
                placeholder="Choose a location"
                presentation="adaptive"
                size="lg"
                isRequired
                options={LOCATIONS}
                value={location}
                onChange={setLocation}
                status={
                  hasTriedSubmit && !location
                    ? {type: 'error', message: 'Choose where the inspection is.'}
                    : undefined
                }
              />
              <TextArea
                label="Notes"
                isOptional
                placeholder="Anything the next inspector should know"
                rows={4}
                value={notes}
                onChange={setNotes}
              />
              <Grid columns={2} gap={2}>
                <Button
                  label="Back"
                  variant="secondary"
                  size="lg"
                  width="100%"
                  onClick={() => onActiveSheetChange('type')}
                />
                <Button
                  label="Start inspection"
                  variant="primary"
                  type="submit"
                  size="lg"
                  width="100%"
                />
              </Grid>
            </VStack>
          </form>
        </Section>
      </BottomSheet>
    </BottomSheetSwitcher>
  );
}

// ============= PAGE =============

export default function ShellMobileTemplate() {
  const isWide = useMediaQuery(`(min-width: ${PHONE_WIDTH + 200}px)`);
  const showToast = useToast();
  const [mountedAt] = useState(() => Date.now());

  const [tab, setTab] = useState<TabId>('today');
  const [subScreen, setSubScreen] = useState<SubScreen | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [inspections, setInspections] = useState(INITIAL_INSPECTIONS);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [inspectionSheet, setInspectionSheet] = useState<string | null>(null);
  const [unread, setUnread] = useState(NOTIFICATIONS.length);

  const openTask = tasks.find(t => t.id === openTaskId) ?? null;

  const goToTab = (next: TabId) => {
    setTab(next);
    setSubScreen(null);
  };

  const toggleDone = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const isDone = task.status === 'done';
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              status: isDone ? 'upcoming' : 'done',
              checksDone: isDone ? 0 : t.checksTotal,
            }
          : t,
      ),
    );
    setOpenTaskId(null);
    showToast({body: isDone ? 'Task reopened' : 'Task marked as done'});
  };

  const startInspection = (type: string, location: string) => {
    // Fixture numbering continues from the highest seeded id (INS-2045).
    const id = `INS-${2046 + inspections.length - INITIAL_INSPECTIONS.length}`;
    setInspections(prev => [
      {
        id,
        type,
        location,
        inspector: USER.name,
        status: 'draft',
        day: 0,
        hour: 11,
        minute: 0,
        checksDone: 0,
        checksTotal: 6,
      },
      ...prev,
    ]);
    setInspectionSheet(null);
    showToast({body: 'Inspection started'});
  };

  const openInspection = (id: string) =>
    setSubScreen({kind: 'inspection', id});

  const detailInspection =
    subScreen?.kind === 'inspection'
      ? inspections.find(i => i.id === subScreen.id)
      : undefined;

  const title = subScreen
    ? subScreen.kind === 'notifications'
      ? 'Notifications'
      : subScreen.kind === 'help'
        ? 'Help & support'
        : 'Inspection'
    : TABS.find(t => t.id === tab)!.label;

  const hasFab = !subScreen && (tab === 'today' || tab === 'inspections');

  let screen: ReactNode;
  if (subScreen?.kind === 'notifications') {
    screen = <NotificationsScreen mountedAt={mountedAt} />;
  } else if (subScreen?.kind === 'help') {
    screen = (
      <HelpScreen
        onCall={() => showToast({body: 'Calling the site office…'})}
      />
    );
  } else if (detailInspection) {
    screen = (
      <InspectionDetailScreen
        inspection={detailInspection}
        onContinue={() =>
          showToast({body: 'Inspection checklist opened'})
        }
      />
    );
  } else if (tab === 'today') {
    screen = <TodayScreen tasks={tasks} onOpenTask={setOpenTaskId} />;
  } else if (tab === 'tasks') {
    screen = <TasksScreen tasks={tasks} onOpenTask={setOpenTaskId} />;
  } else if (tab === 'inspections') {
    screen = (
      <InspectionsScreen inspections={inspections} onOpen={openInspection} />
    );
  } else {
    screen = <ProfileScreen />;
  }

  const appBar = (
    <LayoutHeader hasDivider padding={2}>
      <HStack gap={1} vAlign="center">
        {subScreen ? (
          <IconButton
            label="Back"
            variant="ghost"
            size="lg"
            icon={
              <Icon icon={ArrowLeftIcon} className={rtlStyles.mirror} />
            }
            onClick={() => setSubScreen(null)}
          />
        ) : (
          <IconButton
            label="Open menu"
            variant="ghost"
            size="lg"
            icon={<Icon icon={Bars3Icon} />}
            onClick={() => setIsMenuOpen(true)}
          />
        )}
        <StackItem size="fill">
          <Heading level={4} accessibilityLevel={1} maxLines={1}>
            {title}
          </Heading>
        </StackItem>
        <span className="relative inline-flex">
          <IconButton
            label={
              unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'
            }
            variant="ghost"
            size="lg"
            icon={<Icon icon={BellIcon} />}
            onClick={() => {
              setSubScreen({kind: 'notifications'});
              setUnread(0);
            }}
          />
          {unread > 0 && (
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute top-(--spacing-0) end-(--spacing-0)',
                'min-w-4 h-4 px-(--spacing-1) rounded-(--radius-full)',
                'flex items-center justify-center',
                'bg-(--color-text-red) text-(--color-background-surface)',
                'text-(length:--text-supporting-size) leading-none',
                'font-(number:--font-weight-semibold)',
                'ring-2 ring-(--color-background-surface)',
              )}>
              {unread}
            </span>
          )}
        </span>
      </HStack>
    </LayoutHeader>
  );

  const phone = (
    <Layout
      height="fill"
      header={appBar}
      content={
        <LayoutContent
          key={subScreen ? `${subScreen.kind}` : tab}
          padding={4}
          label={title}>
          {screen}
          {hasFab && (
            // Reserve the FAB's footprint so the last row can scroll clear.
            <div aria-hidden className="h-(--spacing-12)" />
          )}
        </LayoutContent>
      }
      footer={
        <LayoutFooter hasDivider padding={0}>
          <div className="relative">
            {hasFab && (
              <div className="absolute z-1 bottom-full end-(--spacing-4) mb-(--spacing-4)">
                <Button
                  label="New inspection"
                  variant="primary"
                  size="lg"
                  elevation="high"
                  icon={<Icon icon={PlusIcon} />}
                  onClick={() => setInspectionSheet('type')}
                />
              </div>
            )}
            <BottomTabBar value={tab} onChange={goToTab} />
          </div>
        </LayoutFooter>
      }
    />
  );

  return (
    <>
      <div
        className={cn(
          'h-full w-full flex justify-center',
          isWide
            ? 'items-center bg-(--color-background-body) p-(--spacing-6)'
            : 'bg-(--color-background-surface)',
        )}>
        <div
          className={cn(
            'flex flex-col overflow-clip bg-(--color-background-body)',
            isWide
              ? 'rounded-(--radius-xl) [box-shadow:var(--shadow-high)] border border-(--color-border)'
              : 'h-full w-full',
          )}
          style={
            isWide
              ? {
                  inlineSize: PHONE_WIDTH,
                  blockSize: `min(${PHONE_HEIGHT}px, 100%)`,
                }
              : undefined
          }>
          {phone}
        </div>
      </div>

      <MobileNav
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        side="start"
        width={300}
        label="Menu"
        header={
          <HStack gap={3} vAlign="center">
            <Avatar name={USER.name} size="md" tooltip={false} />
            <VStack gap={0.5}>
              <Text type="label">{USER.name}</Text>
              <Text type="supporting" color="secondary">
                {USER.role}
              </Text>
            </VStack>
          </HStack>
        }>
        <SideNavSection title="Site">
          <SideNavItem
            label="Site documents"
            icon={FolderIcon}
            size="lg"
            onClick={() => {
              setIsMenuOpen(false);
              showToast({body: 'Site documents are syncing'});
            }}
          />
        </SideNavSection>
        <SideNavSection title="Account">
          <SideNavItem
            label="Settings"
            icon={Cog6ToothIcon}
            size="lg"
            onClick={() => {
              setIsMenuOpen(false);
              goToTab('profile');
            }}
          />
          <SideNavItem
            label="Help & support"
            icon={QuestionMarkCircleIcon}
            size="lg"
            isSelected={subScreen?.kind === 'help'}
            onClick={() => {
              setIsMenuOpen(false);
              setSubScreen({kind: 'help'});
            }}
          />
          <SideNavItem
            label="Sign out"
            icon={ArrowRightStartOnRectangleIcon}
            size="lg"
            onClick={() => {
              setIsMenuOpen(false);
              showToast({body: 'You’re signed out'});
            }}
          />
        </SideNavSection>
      </MobileNav>

      <TaskSheet
        task={openTask}
        onClose={() => setOpenTaskId(null)}
        onToggleDone={toggleDone}
      />

      <NewInspectionFlow
        activeSheet={inspectionSheet}
        onActiveSheetChange={setInspectionSheet}
        onSubmit={startInspection}
      />
    </>
  );
}
