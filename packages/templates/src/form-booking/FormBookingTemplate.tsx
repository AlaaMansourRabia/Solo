'use client';

/**
 * A room booking flow in two columns: the form column steps through When,
 * Where and Details; a sticky booking summary sits beside it. Reserve does not
 * finish the flow — it places a ten-minute hold on the room, and the person
 * confirms or releases it while a countdown runs.
 *
 * What picks this template over the other form templates is that time is the
 * main input and supply is finite. The first question is a date and a window,
 * the answer to it decides which rooms can be chosen at all, and the thing
 * being reserved can be taken by someone else between the first click and the
 * last. A plain wizard (`form-wizard`) collects answers that nobody else is
 * competing for; a checkout (`checkout-wizard`) prices a cart that is not
 * going anywhere. Here every choice is constrained by other people's bookings,
 * so the page has to show availability before it asks for a pick, explain
 * every option it disables, and make the temporary nature of the reservation
 * impossible to miss.
 *
 * The same shape fits any shared resource booked by the slot: desks, lab
 * equipment, vehicles from a pool, inspection or appointment slots, studio
 * time. Swap the fixture (rooms, floors, amenities) and keep the structure.
 *
 * ## Extending this template
 *
 * **Availability is shown before it is enforced.** The inline Calendar is
 * there because the person needs to see which days are open around the one
 * they want, which a closed DateInput hides. Every day it disables gets a
 * reason in the list beside it — a grey cell with no explanation reads as a
 * bug. Keep `dateConstraints` and the reasons list fed from the same data
 * (`BLOCKED_DAYS` here), never two copies.
 *
 * **Single day and multiple days are modes, not separate pages.** The
 * SegmentedControl switches between an inline Calendar and a DateRangeInput
 * because a range picked on a always-open grid costs two clicks the common
 * case does not need. Both modes share the same constraints and the same time
 * window, so switching never silently loses a valid answer.
 *
 * **A disabled option says why, inside the option.** A room that is too small
 * or already booked stays in the grid, disabled, with the reason printed on
 * the card. Removing it would make the person wonder whether the room exists;
 * a tooltip would hide the reason from touch users. The reasons are derived
 * from the time window and headcount, so changing either re-enables rooms
 * immediately.
 *
 * **Headcount lives with the rooms, invitees live with the details.** The
 * number that filters rooms is asked on the same step as the rooms, because
 * that is where it does work. The named invite list comes later and is only
 * checked against the chosen room's capacity.
 *
 * **A hold is its own state, not the last step.** `phase` moves draft → held
 * → confirmed (or released / expired). The hold panel is a separate component
 * so its deadline is computed once, when the hold starts:
 * `useState(() => Date.now() + HOLD_MS)`. Re-holding remounts it with a new
 * key, which is what gives a second hold a fresh ten minutes. In a real app
 * the deadline comes from the server's hold response — never trust a client
 * clock for when someone else may take the room.
 *
 * **The countdown is a Timer, not a re-render loop.** Timer's countdown mode
 * (`endTime` + `format="clock"`) updates its own text node and calls
 * `onComplete` once, so the rest of the form does not re-render every second.
 * Do not add `aria-live` to it; the expiry is announced by the Banner that
 * replaces the hold panel.
 *
 * **Release is confirmed, confirm is not.** Letting go of a held room is the
 * one irreversible action here — someone else can take it a second later — so
 * it goes through an AlertDialog. Confirming is what the person came to do;
 * it gets a Toast and a durable success state instead of a second question.
 *
 * **The summary is derived, never stored.** Every row reads the same state
 * the form writes, so it updates as the person types. Below the two-column
 * breakpoint it renders first as a collapsed card, measured from the host
 * width rather than the viewport so embedded previews behave.
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {AlertDialog} from '@solo/core/AlertDialog';
import {Badge, type BadgeVariant} from '@solo/core/Badge';
import {Banner} from '@solo/core/Banner';
import {Button} from '@solo/core/Button';
import {Calendar, type DateRange, type ISODateString} from '@solo/core/Calendar';
import {Card} from '@solo/core/Card';
import {CheckboxInput} from '@solo/core/CheckboxInput';
import {Collapsible} from '@solo/core/Collapsible';
import {DateRangeInput} from '@solo/core/DateRangeInput';
import {Divider} from '@solo/core/Divider';
import {Field} from '@solo/core/Field';
import {FieldStatus} from '@solo/core/FieldStatus';
import {FormLayout} from '@solo/core/FormLayout';
import {Grid} from '@solo/core/Grid';
import {Icon} from '@solo/core/Icon';
import {Layout, LayoutContent} from '@solo/core/Layout';
import {MetadataList, MetadataListItem} from '@solo/core/MetadataList';
import {NumberInput} from '@solo/core/NumberInput';
import {SegmentedControl, SegmentedControlItem} from '@solo/core/SegmentedControl';
import {SelectableCard} from '@solo/core/SelectableCard';
import {Selector} from '@solo/core/Selector';
import {HStack, Stack, StackItem, VStack} from '@solo/core/Stack';
import {Step, Stepper} from '@solo/core/Stepper';
import {Heading, Text} from '@solo/core/Text';
import {TextArea} from '@solo/core/TextArea';
import {TextInput} from '@solo/core/TextInput';
import {TimeInput, type ISOTimeString} from '@solo/core/TimeInput';
import {Timer} from '@solo/core/Timer';
import {useToast} from '@solo/core/Toast';
import {useLocale} from '@solo/core/i18n';
import {Tokenizer} from '@solo/core/Tokenizer';
import type {SearchableItem, SearchSource} from '@solo/core/Typeahead';
import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PencilSquareIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

// ── Data ──────────────────────────────────────────────────────────────────────

// A fixed "today" keeps the mock deterministic: the calendar, the blocked days
// and the room bookings all line up no matter when the template is opened.
const TODAY: ISODateString = '2026-11-09';
const LAST_BOOKABLE_DAY: ISODateString = '2026-12-18';
const OPENING_TIME = '08:00' as ISOTimeString;
const CLOSING_TIME = '19:00' as ISOTimeString;
const MIN_MEETING_MINUTES = 30;
const MAX_RANGE_DAYS = 5;
const HOLD_MS = 10 * 60_000;
const NARROW_HOST_WIDTH = 920;

const STEPS = [
  {label: 'When', icon: CalendarDaysIcon},
  {label: 'Where', icon: BuildingOffice2Icon},
  {label: 'Details', icon: PencilSquareIcon},
];

// One list feeds both the Calendar's constraints and the reasons shown beside
// it, so a disabled day can never lose its explanation.
const BLOCKED_DAYS: ReadonlyArray<{date: ISODateString; label: string; reason: string}> = [
  {
    date: '2026-11-13',
    label: 'Fri, Nov 13',
    reason: 'Quarterly all-hands — every room is in use',
  },
  {
    date: '2026-11-20',
    label: 'Fri, Nov 20',
    reason: 'Fire-safety inspection — floors closed',
  },
  {
    date: '2026-11-26',
    label: 'Thu, Nov 26',
    reason: 'Office closed for the holiday',
  },
  {
    date: '2026-11-27',
    label: 'Fri, Nov 27',
    reason: 'Office closed for the holiday',
  },
];

type Amenity = 'Display' | 'Video calls' | 'Whiteboard' | 'Projector' | 'Microphones' | 'Phone';

type Room = {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  amenities: Amenity[];
  bookings: ReadonlyArray<{date: ISODateString; start: string; end: string}>;
};

const ROOMS: Room[] = [
  {
    id: 'cedar',
    name: 'Cedar',
    floor: 'Floor 4',
    capacity: 8,
    amenities: ['Display', 'Video calls', 'Whiteboard'],
    bookings: [{date: '2026-11-12', start: '10:30', end: '12:00'}],
  },
  {
    id: 'juniper',
    name: 'Juniper',
    floor: 'Floor 4',
    capacity: 12,
    amenities: ['Display', 'Video calls', 'Whiteboard'],
    bookings: [{date: '2026-11-16', start: '09:00', end: '17:00'}],
  },
  {
    id: 'willow',
    name: 'Willow Training Room',
    floor: 'Floor 2',
    capacity: 24,
    amenities: ['Projector', 'Microphones', 'Video calls'],
    bookings: [{date: '2026-11-12', start: '14:00', end: '16:00'}],
  },
  {
    id: 'maple',
    name: 'Maple',
    floor: 'Floor 5',
    capacity: 10,
    amenities: ['Display', 'Video calls'],
    bookings: [{date: '2026-11-12', start: '08:30', end: '09:30'}],
  },
  {
    id: 'birch',
    name: 'Birch',
    floor: 'Floor 3',
    capacity: 4,
    amenities: ['Display', 'Whiteboard'],
    bookings: [],
  },
  {
    id: 'aspen',
    name: 'Aspen Focus Room',
    floor: 'Floor 3',
    capacity: 2,
    amenities: ['Phone'],
    bookings: [],
  },
];

type Person = SearchableItem;

const PEOPLE: Person[] = [
  {id: 'nadia', label: 'Nadia Karimi'},
  {id: 'omar', label: 'Omar Haddad'},
  {id: 'lena', label: 'Lena Fischer'},
  {id: 'daniel', label: 'Daniel Osei'},
  {id: 'priya', label: 'Priya Raman'},
  {id: 'tomas', label: 'Tomás Rivera'},
  {id: 'hana', label: 'Hana Sato'},
  {id: 'yusuf', label: 'Yusuf Demir'},
  {id: 'grace', label: 'Grace Whitfield'},
  {id: 'mateo', label: 'Mateo Silva'},
  {id: 'amira', label: 'Amira Nasser'},
  {id: 'jonas', label: 'Jonas Berg'},
];

const PEOPLE_SOURCE: SearchSource<Person> = {
  search: query =>
    PEOPLE.filter(person =>
      person.label.toLowerCase().includes(query.toLowerCase()),
    ),
  bootstrap: () => PEOPLE.slice(0, 6),
};

const FREQUENCIES = [
  {value: 'weekly', label: 'Every week'},
  {value: 'biweekly', label: 'Every 2 weeks'},
  {value: 'monthly', label: 'Every month'},
];

const OCCURRENCES = [
  {value: '4', label: '4 times'},
  {value: '8', label: '8 times'},
  {value: '12', label: '12 times'},
];

type Phase = 'draft' | 'held' | 'confirmed' | 'released' | 'expired';

const PHASE_BADGE: Record<Phase, {label: string; variant: BadgeVariant}> = {
  draft: {label: 'Not reserved', variant: 'neutral'},
  held: {label: 'On hold', variant: 'warning'},
  confirmed: {label: 'Confirmed', variant: 'success'},
  released: {label: 'Released', variant: 'neutral'},
  expired: {label: 'Hold expired', variant: 'neutral'},
};

// ── Styles ────────────────────────────────────────────────────────────────────

// The summary holds its width and pins itself as the form scrolls; the sticky
// offset is the page inset so a stuck card sits where an unstuck one would.
const summaryColumn: CSSProperties = {
  width: 340,
  flexShrink: 0,
  position: 'sticky',
  top: 'var(--spacing-6)',
  alignSelf: 'flex-start',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toISODate(date: Date): ISODateString {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` as ISODateString;
}

/**
 * "Thu, Nov 12" in English, "الخميس، ١٢ نوفمبر" in Arabic: format with the
 * provider's locale rather than gluing English words together, so word
 * order and punctuation follow the language too.
 */
function formatDay(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(parseDate(iso));
}

function minutesOf(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** "10:30 AM" */
function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** "1 h 30 min" */
function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

const isBlocked = (iso: string) => BLOCKED_DAYS.some(day => day.date === iso);
const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

// Calendar constraints return true for days that may be picked.
const DATE_CONSTRAINTS: ReadonlyArray<(date: Date) => boolean> = [
  date => !isWeekend(date),
  date => !isBlocked(toISODate(date)),
];

/** Every weekday in the range, both ends included. */
function daysInRange(range: DateRange | null): ISODateString[] {
  if (!range) return [];
  const days: ISODateString[] = [];
  const cursor = parseDate(range.start);
  const end = parseDate(range.end);
  while (cursor <= end) {
    if (!isWeekend(cursor)) days.push(toISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

/** Why a room cannot be picked for this window, or null when it can. */
function unavailableReason(
  room: Room,
  days: ReadonlyArray<string>,
  start: string,
  end: string,
  headcount: number,
): {kind: 'size' | 'booked'; text: string} | null {
  if (room.capacity < headcount) {
    return {kind: 'size', text: 'Too small for this group'};
  }
  if (!start || !end || minutesOf(end) <= minutesOf(start)) {
    return null;
  }
  const clash = room.bookings.find(
    booking =>
      days.includes(booking.date) &&
      minutesOf(booking.start) < minutesOf(end) &&
      minutesOf(start) < minutesOf(booking.end),
  );
  return clash
    ? {
        kind: 'booked',
        text: `Booked ${formatTime(clash.start)} – ${formatTime(clash.end)}`,
      }
    : null;
}

const blockedMessage = (count: number) =>
  count === 1
    ? 'One problem above needs fixing first.'
    : `${count} problems above need fixing first.`;

// ── Hold panel ────────────────────────────────────────────────────────────────

/**
 * Mounted when the hold starts, so its deadline is computed at that moment.
 * The parent remounts it with a new key to start a fresh hold.
 */
function HoldPanel({
  roomName,
  floor,
  dateText,
  timeText,
  onExpire,
  onConfirm,
  onRelease,
}: {
  roomName: string;
  floor: string;
  dateText: string;
  timeText: string;
  onExpire: () => void;
  onConfirm: (options: {sendInvites: boolean; showOnDisplay: boolean}) => void;
  onRelease: () => void;
}) {
  const [endTime] = useState(() => Date.now() + HOLD_MS);
  const [sendInvites, setSendInvites] = useState(true);
  const [showOnDisplay, setShowOnDisplay] = useState(true);
  const [isReleaseOpen, setIsReleaseOpen] = useState(false);

  return (
    <VStack gap={6}>
      <Banner
        status="warning"
        collapsible={false}
        title="Room on hold — confirm to keep it"
        description="Nobody else can book this room while the timer runs. When it reaches zero the hold is released."
        endContent={
          <VStack gap={0} hAlign="end">
            <Text type="supporting" color="secondary">
              Time left
            </Text>
            <Timer
              endTime={endTime}
              format="clock"
              type="large"
              weight="bold"
              color="primary"
              onComplete={onExpire}
            />
          </VStack>
        }
      />

      <VStack gap={4}>
        <Heading level={2}>Confirm your booking</Heading>
        {/* What is being held, stated once in the column the person is acting
            in — the summary beside it carries the full record. */}
        <Card padding={4} variant="muted">
          <HStack gap={4} vAlign="center" wrap="wrap">
            <Icon icon={BuildingOffice2Icon} size="md" color="secondary" />
            <StackItem size="fill">
              <VStack gap={0.5}>
                <Text type="label">{roomName}</Text>
                <Text type="supporting" color="secondary">
                  {floor}
                </Text>
              </VStack>
            </StackItem>
            <VStack gap={0.5} hAlign="end">
              <HStack gap={1.5} vAlign="center">
                <Icon icon={CalendarDaysIcon} size="sm" color="secondary" />
                <Text type="body">{dateText}</Text>
              </HStack>
              <HStack gap={1.5} vAlign="center">
                <Icon icon={ClockIcon} size="sm" color="secondary" />
                <Text type="body">{timeText}</Text>
              </HStack>
            </VStack>
          </HStack>
        </Card>
      </VStack>

      <VStack gap={4}>
        <CheckboxInput
          label="Send calendar invites to attendees"
          description="Each invite carries the room, the time and your notes."
          value={sendInvites}
          onChange={setSendInvites}
        />
        <CheckboxInput
          label="Show the meeting title on the room display"
          description="Turn off for interviews or other private meetings."
          value={showOnDisplay}
          onChange={setShowOnDisplay}
        />
      </VStack>

      <HStack gap={3} vAlign="center" width="100%">
        <Button
          label="Release"
          variant="secondary"
          onClick={() => setIsReleaseOpen(true)}
        />
        <StackItem size="fill">
          <Button
            label="Confirm booking"
            variant="primary"
            width="100%"
            onClick={() => onConfirm({sendInvites, showOnDisplay})}
          />
        </StackItem>
      </HStack>

      <AlertDialog
        isOpen={isReleaseOpen}
        onOpenChange={setIsReleaseOpen}
        title="Release this room?"
        description="The room goes back to everyone straight away and someone else may book it. Your details stay on this page."
        actionLabel="Release room"
        cancelLabel="Keep hold"
        onAction={() => {
          setIsReleaseOpen(false);
          onRelease();
        }}
      />
    </VStack>
  );
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function FormBookingTemplate() {
  const locale = useLocale();
  // The responsive variant changes rendered order, so measure the host rather
  // than the viewport around an embedded preview.
  const hostRef = useRef<HTMLElement | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const attachHost = useCallback((element: HTMLElement | null) => {
    hostRef.current = element;
    if (element && element.clientWidth > 0) {
      setIsNarrow(element.clientWidth <= NARROW_HOST_WIDTH);
    }
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width ?? host.clientWidth;
      if (width > 0) {
        setIsNarrow(width <= NARROW_HOST_WIDTH);
      }
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const calendarID = useId();
  const roomsID = useId();
  const showToast = useToast();

  const [step, setStep] = useState(0);
  const [attempted, setAttempted] = useState<ReadonlySet<number>>(new Set());
  const [phase, setPhase] = useState<Phase>('draft');
  const [holdKey, setHoldKey] = useState(0);

  // Step 1 — When
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [date, setDate] = useState<ISODateString>('2026-11-12');
  const [range, setRange] = useState<DateRange | null>({
    start: '2026-11-16',
    end: '2026-11-18',
  });
  const [startTime, setStartTime] = useState<ISOTimeString | undefined>(
    '10:00' as ISOTimeString,
  );
  const [endTime, setEndTime] = useState<ISOTimeString | undefined>(
    '11:30' as ISOTimeString,
  );

  // Step 2 — Where
  const [headcount, setHeadcount] = useState(6);
  const [roomID, setRoomID] = useState<string | null>(null);

  // Step 3 — Details
  const [title, setTitle] = useState('Q4 roadmap review');
  const [invitees, setInvitees] = useState<Person[]>([PEOPLE[0], PEOPLE[1], PEOPLE[2]]);
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const [occurrences, setOccurrences] = useState('4');

  // ── Derived ────────────────────────────────────────────────────────────────

  const days = mode === 'single' ? [date] : daysInRange(range);
  const hasValidWindow =
    !!startTime && !!endTime && minutesOf(endTime) - minutesOf(startTime) >= MIN_MEETING_MINUTES;
  const durationMinutes = hasValidWindow
    ? minutesOf(endTime!) - minutesOf(startTime!)
    : 0;

  // Open rooms first, so the choices that work are the first ones read; the
  // ruled-out ones stay listed underneath with their reason.
  const roomStates = ROOMS.map(room => ({
    room,
    reason: unavailableReason(room, days, startTime ?? '', endTime ?? '', headcount),
  })).sort((a, b) => Number(!!a.reason) - Number(!!b.reason));
  const selected = roomStates.find(state => state.room.id === roomID);
  // A pick that the window or headcount has since ruled out no longer counts.
  const room = selected && !selected.reason ? selected.room : undefined;
  const availableCount = roomStates.filter(state => !state.reason).length;

  const errorsByStep = useMemo<Array<Record<string, string>>>(() => {
    const when: Record<string, string> = {};
    if (mode === 'multi' && !range) {
      when.range = 'Choose the first and last day.';
    }
    if (!startTime) {
      when.start = 'Choose a start time.';
    }
    if (!endTime) {
      when.end = 'Choose an end time.';
    } else if (startTime && minutesOf(endTime) <= minutesOf(startTime)) {
      when.end = 'End time must be after the start time.';
    } else if (startTime && minutesOf(endTime) - minutesOf(startTime) < MIN_MEETING_MINUTES) {
      when.end = 'Bookings are at least 30 minutes.';
    }

    const where: Record<string, string> = {};
    if (!roomID) {
      where.room = 'Choose a room to continue.';
    } else if (!room) {
      where.room = 'That room is no longer available for this time. Choose another.';
    }

    const details: Record<string, string> = {};
    if (!title.trim()) {
      details.title = 'Give the booking a title.';
    }
    if (room && invitees.length + 1 > room.capacity) {
      details.invitees = 'More people are invited than the room seats.';
    }
    return [when, where, details];
  }, [mode, range, startTime, endTime, roomID, room, title, invitees.length]);

  const shownErrors = (index: number) =>
    attempted.has(index) ? errorsByStep[index] : {};
  const currentErrors = shownErrors(step);
  const isLastStep = step === STEPS.length - 1;

  const markAttempted = (indices: ReadonlyArray<number>) => {
    setAttempted(previous => {
      const next = new Set(previous);
      indices.forEach(index => next.add(index));
      return next;
    });
  };

  const goNext = () => {
    markAttempted([step]);
    if (Object.keys(errorsByStep[step]).length > 0) {
      return;
    }
    if (isLastStep) {
      setHoldKey(key => key + 1);
      setPhase('held');
      return;
    }
    setStep(current => current + 1);
  };

  const goTo = (index: number) => {
    if (index <= step) {
      setStep(index);
      return;
    }
    const checked: number[] = [];
    for (let candidate = step; candidate < index; candidate += 1) {
      checked.push(candidate);
      if (Object.keys(errorsByStep[candidate]).length > 0) {
        markAttempted(checked);
        setStep(candidate);
        return;
      }
    }
    markAttempted(checked);
    setStep(index);
  };

  const startOver = () => {
    setPhase('draft');
    setStep(0);
    setAttempted(new Set());
    setRoomID(null);
    setTitle('');
    setInvitees([]);
    setNotes('');
    setIsRecurring(false);
  };

  const status = (message: string | undefined) =>
    message ? {type: 'error' as const, message} : undefined;

  // ── Summary ────────────────────────────────────────────────────────────────

  const notChosen = (
    <Text type="body" color="secondary">
      Not chosen yet
    </Text>
  );

  const dateText =
    mode === 'single'
      ? formatDay(date, locale)
      : range
        ? range.start === range.end
          ? formatDay(range.start, locale)
          : `${formatDay(range.start, locale)} – ${formatDay(range.end, locale)}`
        : null;

  const summaryBody = (
    <VStack gap={4}>
      <MetadataList columns="single">
        <MetadataListItem label="Date">
          {dateText ?? notChosen}
        </MetadataListItem>
        {mode === 'multi' && range && (
          <MetadataListItem label="Days">
            {days.length === 1 ? '1 day' : `${days.length} days`}
          </MetadataListItem>
        )}
        <MetadataListItem label="Time">
          {hasValidWindow
            ? `${formatTime(startTime!)} – ${formatTime(endTime!)}`
            : notChosen}
        </MetadataListItem>
        <MetadataListItem label="Duration">
          {hasValidWindow ? formatDuration(durationMinutes) : notChosen}
        </MetadataListItem>
        <MetadataListItem label="Room">
          {room ? room.name : notChosen}
        </MetadataListItem>
        {room && (
          <MetadataListItem label="Floor">{room.floor}</MetadataListItem>
        )}
        <MetadataListItem label="People">
          {`${Math.max(headcount, invitees.length + 1)} people`}
        </MetadataListItem>
        {isRecurring && mode === 'single' && (
          <MetadataListItem label="Repeats">
            {FREQUENCIES.find(f => f.value === frequency)?.label}
          </MetadataListItem>
        )}
      </MetadataList>
      {room && (
        <HStack gap={1.5} wrap="wrap">
          {room.amenities.map(amenity => (
            <Badge key={amenity} variant="neutral" label={amenity} />
          ))}
        </HStack>
      )}
      <Divider />
      <HStack gap={2} vAlign="start">
        <Icon icon={MapPinIcon} size="sm" color="secondary" />
        <StackItem size="fill">
          <Text type="supporting" color="secondary">
            Harbor Point office, 200 Pier Street. Check in at the front desk on
            the ground floor.
          </Text>
        </StackItem>
      </HStack>
    </VStack>
  );

  const phaseBadge = PHASE_BADGE[phase];
  const summaryCard = (
    <Card padding={5}>
      {isNarrow ? (
        <Collapsible trigger="Booking summary" defaultIsOpen={false}>
          <VStack gap={4} paddingBlockStart={3}>
            <Badge variant={phaseBadge.variant} label={phaseBadge.label} />
            {summaryBody}
          </VStack>
        </Collapsible>
      ) : (
        <VStack gap={4}>
          <HStack gap={2} vAlign="center" hAlign="between">
            <Heading level={4} accessibilityLevel={2}>
              Booking summary
            </Heading>
            <Badge variant={phaseBadge.variant} label={phaseBadge.label} />
          </HStack>
          {summaryBody}
        </VStack>
      )}
    </Card>
  );

  // ── Steps ──────────────────────────────────────────────────────────────────

  const progress = (
    <Stepper
      activeStep={step}
      orientation="horizontal"
      onStepClick={goTo}
      label="Booking progress"
      density="balanced">
      {STEPS.map(({label, icon}, i) => {
        const hasError = Object.keys(shownErrors(i)).length > 0;
        return (
          <Step
            key={label}
            step={i}
            label={label}
            indicator={<Icon icon={hasError ? 'error' : icon} size="sm" />}
            status={hasError ? 'error' : undefined}
          />
        );
      })}
    </Stepper>
  );

  const timeFields = (
    <HStack gap={4} wrap="wrap" vAlign="start">
      <TimeInput
        label="Start time"
        width={200}
        value={startTime}
        onChange={setStartTime}
        min={OPENING_TIME}
        max={CLOSING_TIME}
        increment={15}
        status={status(currentErrors.start)}
      />
      <TimeInput
        label="End time"
        width={200}
        value={endTime}
        onChange={setEndTime}
        min={OPENING_TIME}
        max={CLOSING_TIME}
        increment={15}
        status={status(currentErrors.end)}
      />
    </HStack>
  );

  const whenStep = (
    <VStack gap={5}>
      <VStack gap={1}>
        <Heading level={2}>When do you need a room?</Heading>
        <Text type="supporting" color="secondary">
          Rooms can be booked on weekdays up to six weeks ahead, between 8:00
          AM and 7:00 PM.
        </Text>
      </VStack>

      <SegmentedControl
        label="Booking length"
        value={mode}
        onChange={value => setMode(value as 'single' | 'multi')}>
        <SegmentedControlItem value="single" label="Single day" />
        <SegmentedControlItem value="multi" label="Multiple days" />
      </SegmentedControl>

      <Stack direction={isNarrow ? 'vertical' : 'horizontal'} gap={6} vAlign="start">
        {mode === 'single' ? (
          <Field label="Date" inputID={calendarID} isGroupLabel>
            <Card padding={3} width="fit-content">
              <Calendar
                id={calendarID}
                mode="single"
                value={date}
                onChange={value => setDate(value)}
                min={TODAY}
                max={LAST_BOOKABLE_DAY}
                dateConstraints={DATE_CONSTRAINTS}
              />
            </Card>
          </Field>
        ) : (
          <DateRangeInput
            label="Dates"
            description="Up to five weekdays in a row."
            value={range}
            onChange={setRange}
            min={TODAY}
            max={LAST_BOOKABLE_DAY}
            dateConstraints={DATE_CONSTRAINTS}
            maxRangeSpan={MAX_RANGE_DAYS + 2}
            width={320}
            status={status(currentErrors.range)}
          />
        )}
        {/* The reasons sit beside whichever date control is showing: both
            disable the same days, so both owe the same explanation. */}
        <StackItem size="fill">
          <VStack gap={3}>
            <Text type="label">Unavailable days</Text>
            <Text type="supporting" color="secondary">
              Weekends are closed. These weekdays can't be booked either:
            </Text>
            <VStack gap={3}>
              {BLOCKED_DAYS.map(day => (
                <HStack key={day.date} gap={3} vAlign="center">
                  <Badge variant="neutral" label={day.label} />
                  <StackItem size="fill">
                    <Text type="supporting">{day.reason}</Text>
                  </StackItem>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </StackItem>
      </Stack>

      <Divider />
      <VStack gap={1}>
        <Heading level={3}>Time</Heading>
        <Text type="supporting" color="secondary">
          {mode === 'single'
            ? 'In 15-minute steps.'
            : 'The same window is held on every day of the range.'}
        </Text>
      </VStack>
      {timeFields}
    </VStack>
  );

  const whereStep = (
    <VStack gap={5}>
      <VStack gap={1}>
        <Heading level={2}>Where will you meet?</Heading>
        <Text type="supporting" color="secondary">
          Rooms that are too small or already booked for your time stay listed
          with the reason.
        </Text>
      </VStack>

      <NumberInput
          label="People attending"
          description="Including you"
          value={headcount}
          onChange={setHeadcount}
          min={1}
          max={40}
          isIntegerOnly
          hasNumberSteppers
          width={160}
        />

      <Field
        label="Room"
        inputID={roomsID}
        isGroupLabel
        description={`${availableCount} of ${ROOMS.length} rooms fit your time and group`}
        status={currentErrors.room ? {type: 'error', message: currentErrors.room} : undefined}
        statusVariant="detached">
        <Grid id={roomsID} columns={{minWidth: 240}} gap={3}>
          {roomStates.map(({room: r, reason}) => (
            <SelectableCard
              key={r.id}
              label={r.name}
              isSelected={roomID === r.id && !reason}
              isDisabled={!!reason}
              onChange={() => setRoomID(r.id)}
              padding={4}>
              <VStack gap={3}>
                <VStack gap={1}>
                  <Text type="label">{r.name}</Text>
                  <HStack gap={3} vAlign="center" wrap="wrap">
                    <HStack gap={1} vAlign="center">
                      <Icon icon={UsersIcon} size="sm" color="secondary" />
                      <Text type="supporting" color="secondary">
                        {`${r.capacity} seats`}
                      </Text>
                    </HStack>
                    <HStack gap={1} vAlign="center">
                      <Icon icon={BuildingOffice2Icon} size="sm" color="secondary" />
                      <Text type="supporting" color="secondary">
                        {r.floor}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
                <HStack gap={1.5} wrap="wrap">
                  {r.amenities.map(amenity => (
                    <Badge key={amenity} variant="neutral" label={amenity} />
                  ))}
                </HStack>
                {reason && (
                  <HStack gap={1.5} vAlign="center">
                    <Icon
                      icon={reason.kind === 'size' ? UsersIcon : ClockIcon}
                      size="sm"
                      color="secondary"
                    />
                    <Text type="supporting" color="secondary">
                      {reason.text}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </SelectableCard>
          ))}
        </Grid>
      </Field>
    </VStack>
  );

  const detailsStep = (
    <VStack gap={5}>
      <VStack gap={1}>
        <Heading level={2}>Tell people what it's for</Heading>
        <Text type="supporting" color="secondary">
          The title shows on the room display and in calendar invites.
        </Text>
      </VStack>
      <FormLayout defaultOptionality="required">
        <TextInput
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="Weekly design sync"
          status={status(currentErrors.title)}
        />
        <Tokenizer
          label="Invite people"
          isOptional
          description="They get an invite once the booking is confirmed."
          placeholder="Search people..."
          searchSource={PEOPLE_SOURCE}
          value={invitees}
          onChange={setInvitees}
          hasEntriesOnFocus
          status={status(currentErrors.invitees)}
        />
        <TextArea
          label="Notes"
          isOptional
          rows={3}
          maxLength={300}
          value={notes}
          onChange={setNotes}
          placeholder="Set up the room in a U shape and order coffee for 10:00."
          description="Shared with facilities and the people you invite."
        />
        <Divider />
        <CheckboxInput
          label="Repeat this booking"
          description="Each repeat is held only if the room is free that day."
          value={isRecurring && mode === 'single'}
          onChange={setIsRecurring}
          isDisabled={mode === 'multi'}
          disabledMessage="Multi-day bookings can't repeat."
        />
        {isRecurring && mode === 'single' && (
          <FormLayout direction={isNarrow ? 'vertical' : 'horizontal'}>
            <Selector
              label="Frequency"
              options={FREQUENCIES}
              value={frequency}
              onChange={setFrequency}
            />
            <Selector
              label="Ends after"
              options={OCCURRENCES}
              value={occurrences}
              onChange={setOccurrences}
            />
          </FormLayout>
        )}
      </FormLayout>
    </VStack>
  );

  const actions = (
    <VStack gap={3} hAlign="start">
      {Object.keys(currentErrors).length > 0 && (
        <FieldStatus
          type="error"
          variant="detached"
          message={blockedMessage(Object.keys(currentErrors).length)}
        />
      )}
      <HStack gap={3} vAlign="center" width="100%">
        {step > 0 && (
          <Button
            label="Back"
            variant="secondary"
            onClick={() => setStep(s => Math.max(0, s - 1))}
          />
        )}
        <StackItem size="fill">
          <Button
            label={isLastStep ? 'Reserve room' : 'Continue'}
            variant="primary"
            width="100%"
            onClick={goNext}
          />
        </StackItem>
      </HStack>
      {isLastStep && (
        <Text type="supporting" color="secondary">
          Reserving holds the room for 10 minutes while you confirm.
        </Text>
      )}
    </VStack>
  );

  // ── Outcome states ─────────────────────────────────────────────────────────

  let formColumn: ReactNode;
  if (phase === 'held' && room) {
    formColumn = (
      <HoldPanel
        key={holdKey}
        roomName={room.name}
        floor={room.floor}
        dateText={dateText ?? ''}
        timeText={`${formatTime(startTime!)} – ${formatTime(endTime!)}`}
        onExpire={() => setPhase('expired')}
        onRelease={() => setPhase('released')}
        onConfirm={() => {
          setPhase('confirmed');
          showToast({body: 'Booking confirmed', uniqueID: 'booking-confirmed'});
        }}
      />
    );
  } else if (phase === 'confirmed') {
    formColumn = (
      <VStack gap={5}>
        <Banner
          status="success"
          title="Booking confirmed"
          description="Calendar invites are on their way. You can change or cancel this booking from My bookings."
        />
        <VStack gap={1}>
          <Heading level={2}>You're all set</Heading>
          <Text type="body" color="secondary">
            The room display will show your booking 15 minutes before it
            starts. Rooms that stay empty for 10 minutes are released
            automatically.
          </Text>
        </VStack>
        <HStack gap={3}>
          <Button label="Book another room" variant="secondary" onClick={startOver} />
        </HStack>
      </VStack>
    );
  } else if (phase === 'released' || phase === 'expired') {
    formColumn = (
      <VStack gap={5}>
        <Banner
          status={phase === 'expired' ? 'warning' : 'info'}
          title={phase === 'expired' ? 'Hold expired' : 'Hold released'}
          description={
            phase === 'expired'
              ? "The booking wasn't confirmed within 10 minutes, so the room went back to everyone. Your details are kept."
              : 'The room is free for others again. Your details are kept if you want to try again.'
          }
        />
        <HStack gap={3} wrap="wrap">
          <Button
            label="Edit booking"
            variant="secondary"
            onClick={() => {
              setPhase('draft');
              setStep(0);
            }}
          />
          <Button
            label="Reserve again"
            variant="primary"
            isDisabled={!room}
            onClick={() => {
              setHoldKey(key => key + 1);
              setPhase('held');
            }}
          />
        </HStack>
      </VStack>
    );
  } else {
    formColumn = (
      <VStack gap={6}>
        {progress}
        {step === 0 && whenStep}
        {step === 1 && whereStep}
        {step === 2 && detailsStep}
        {actions}
      </VStack>
    );
  }

  return (
    <Layout
      height="fill"
      padding={6}
      contentWidth={1120}
      content={
        <LayoutContent>
          <VStack ref={attachHost} gap={6}>
            <HStack gap={3} vAlign="center" wrap="wrap">
              <StackItem size="fill">
                <VStack gap={1}>
                  <Heading level={1}>Book a room</Heading>
                  <Text type="supporting" color="secondary">
                    Meeting and training rooms at Harbor Point
                  </Text>
                </VStack>
              </StackItem>
              <HStack gap={1.5} vAlign="center">
                <Icon icon={ClockIcon} size="sm" color="secondary" />
                <Text type="supporting" color="secondary">
                  Rooms are held for 10 minutes
                </Text>
              </HStack>
            </HStack>

            <Stack
              direction={isNarrow ? 'vertical' : 'horizontal'}
              gap={8}
              vAlign="start">
              {isNarrow && <StackItem>{summaryCard}</StackItem>}
              <StackItem size="fill">{formColumn}</StackItem>
              {!isNarrow && (
                <StackItem style={summaryColumn}>{summaryCard}</StackItem>
              )}
            </Stack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
