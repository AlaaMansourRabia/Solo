'use client';

/**
 * The page a product shows when the thing someone asked for is not there or
 * not working: a minimal product header, then one calm, centred message with
 * a clear way forward. One file covers the four cases every product needs —
 * 404 Not found, 500 Something went wrong, 403 No access and Scheduled
 * maintenance — and `ERROR_KIND` at the top of the file picks which one this
 * copy of the page is. A team copies the file once per route (`not-found`,
 * `error`, `forbidden`, `maintenance`) and changes that one constant.
 *
 * What picks this template is that the page has nothing to show and one job:
 * explain, in a sentence, why the person is here, and get them somewhere
 * useful. It is not a form (nothing is being collected, except the one-field
 * access request, which lives in a Dialog) and not data (there is no record
 * to display). If the failure belongs to one region of a working page — a
 * chart that did not load, an empty table — use an `EmptyState` or a `Banner`
 * inside that page instead; this template replaces the whole page.
 *
 * Every kind has the same anatomy, so the four pages feel like one product:
 *
 * - an icon composition in the kind's tone (three tiles, built from Icon and
 *   colour tokens, no images) and a large status code — or, for maintenance,
 *   a live countdown in the same spot, because "when" is the status;
 * - one `h1` title and one sentence of explanation;
 * - a primary action that resolves the situation (Go to home, Try again,
 *   Request access, Check status page) and a quieter secondary action;
 * - one block of help specific to the kind (search and popular pages; a
 *   reference ID to copy; who can grant access; the maintenance window).
 *
 * The preview renders `'not-found'`. To see another kind, change
 * `ERROR_KIND`; all four share `ErrorMessage`, so only the content map and
 * the help block differ. There is deliberately no in-page switcher or
 * gallery of the other states: a real error page shows exactly one message.
 *
 * ## Extending this template
 *
 * **The copy lives in one typed map.** `ERROR_CONTENT` is a
 * `Record<ErrorKind, ErrorContent>`, so adding a kind (410 Gone, 429 Too many
 * requests, an offline page) is a type error until it has a title, a
 * sentence, a tone, icons and actions. Keep the sentence to one line of
 * cause plus one of remedy; anything longer belongs in a help article the
 * page links to.
 *
 * **Say what happened, not the HTTP name.** "This page doesn't exist" beats
 * "Not Found"; the number is shown once, large, for people who recognise it
 * and for support conversations, and is never the only signal.
 *
 * **404: search is a TextInput, not a Typeahead.** A Typeahead commits to
 * one item from a known list; a 404 search is free text handed to the
 * product's search route. The `form role="search"` submits on Enter — wire
 * `onSubmit` to your router. Popular pages are ClickableCards because each
 * card is one destination; keep it to four.
 *
 * **500: the reference ID is the action for support.** It is rendered in
 * `Code` (left alone by translation and selectable) next to a labelled copy
 * Button built on `useClipboard`, which flips to "Copied" and announces it
 * politely. Take the ID from the failed response's request ID header so
 * support can find the trace. "Try again" shows a loading state and, in a
 * real app, re-runs the request or reloads the route.
 *
 * **403: name a person, then make asking cheap.** The owner card shows who
 * can grant access with an Avatar, so the page is never a dead end. Request
 * access opens a `purpose="form"` Dialog with one required reason field and
 * an access level; sending closes it, confirms with a Toast, and turns the
 * primary button into a disabled "Request sent" so it cannot be sent twice.
 * The account line exists because the commonest fix is "you're signed in as
 * the wrong person".
 *
 * **Maintenance: the countdown is a Timer.** Timer's countdown mode
 * (`endTime`) updates its own text without re-rendering the page and calls
 * `onComplete` once; the page then swaps to a success Banner with a reload
 * action. The window's start and end are formatted with the active locale
 * (`Intl.DateTimeFormat`), never glued from English words. In production the
 * end time comes from your status provider, not the client clock.
 *
 * **The header stays minimal on purpose.** Product name and a help link only
 * — no navigation, because a broken route should not invite more broken
 * routes, and because the 500 and maintenance pages may render when the app
 * shell itself is down.
 */

import {useMemo, useState, type ComponentType, type SVGProps} from 'react';
import {Avatar} from '@solo/core/Avatar';
import {Badge} from '@solo/core/Badge';
import {Banner} from '@solo/core/Banner';
import {Button} from '@solo/core/Button';
import {Card} from '@solo/core/Card';
import {ClickableCard} from '@solo/core/ClickableCard';
import {Code} from '@solo/core/Code';
import {Dialog, DialogHeader} from '@solo/core/Dialog';
import {Divider} from '@solo/core/Divider';
import {FormLayout} from '@solo/core/FormLayout';
import {Grid} from '@solo/core/Grid';
import {useClipboard, useMediaQuery} from '@solo/core/hooks';
import {useLocale} from '@solo/core/i18n';
import {Icon} from '@solo/core/Icon';
import {Layout, LayoutContent, LayoutFooter} from '@solo/core/Layout';
import {Link} from '@solo/core/Link';
import {NavIcon} from '@solo/core/NavIcon';
import {Selector} from '@solo/core/Selector';
import {HStack, StackItem, VStack} from '@solo/core/Stack';
import {Heading, Text} from '@solo/core/Text';
import {TextArea} from '@solo/core/TextArea';
import {TextInput} from '@solo/core/TextInput';
import {Timer} from '@solo/core/Timer';
import {ToastViewport, useToast} from '@solo/core/Toast';
import {TopNav, TopNavHeading} from '@solo/core/TopNav';
import {
  ArrowPathIcon,
  BellIcon,
  ChartBarIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  Cog6ToothIcon,
  CubeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  KeyIcon,
  LifebuoyIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  ServerStackIcon,
  SignalIcon,
  SignalSlashIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

// ── Which page this file is ──────────────────────────────────────────────────

type ErrorKind = 'not-found' | 'server-error' | 'forbidden' | 'maintenance';

/** Set this once per copy of the file: which error page it renders. */
const ERROR_KIND: ErrorKind = 'not-found';

// ── Content ──────────────────────────────────────────────────────────────────

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;
type Tone = 'blue' | 'red' | 'orange' | 'purple';

type ErrorContent = {
  /** Shown large above the title; null when the hero shows a countdown. */
  code: string | null;
  title: string;
  description: string;
  tone: Tone;
  /** Center tile carries the meaning; the two side tiles set the scene. */
  icons: {start: HeroIcon; main: HeroIcon; end: HeroIcon};
  primary: {label: string; icon: HeroIcon};
  secondary: {label: string; icon?: HeroIcon};
};

const ERROR_CONTENT: Record<ErrorKind, ErrorContent> = {
  'not-found': {
    code: '404',
    title: "We can't find that page",
    description:
      'The link may be out of date, or the page was moved or deleted. Check the address, or search for what you need.',
    tone: 'blue',
    icons: {start: DocumentTextIcon, main: MagnifyingGlassIcon, end: MapIcon},
    primary: {label: 'Go to home', icon: HomeIcon},
    secondary: {label: 'Contact support', icon: LifebuoyIcon},
  },
  'server-error': {
    code: '500',
    title: 'Something went wrong on our end',
    description:
      "It's not something you did. We've been alerted and are looking into it. Try again in a moment.",
    tone: 'red',
    icons: {
      start: ServerStackIcon,
      main: ExclamationTriangleIcon,
      end: SignalSlashIcon,
    },
    primary: {label: 'Try again', icon: ArrowPathIcon},
    secondary: {label: 'Go to home', icon: HomeIcon},
  },
  forbidden: {
    code: '403',
    title: "You don't have access to this page",
    description:
      'Q4 Revenue Forecast is shared with the Finance team only. Ask the owner to give you access.',
    tone: 'orange',
    icons: {start: UserCircleIcon, main: LockClosedIcon, end: KeyIcon},
    primary: {label: 'Request access', icon: KeyIcon},
    secondary: {label: 'Switch account'},
  },
  maintenance: {
    code: null,
    title: "We're down for scheduled maintenance",
    description:
      'Meridian is being upgraded and will be back shortly. Your data is safe and nothing you saved is affected.',
    tone: 'purple',
    icons: {
      start: Cog6ToothIcon,
      main: WrenchScrewdriverIcon,
      end: ClockIcon,
    },
    primary: {label: 'Check status page', icon: SignalIcon},
    secondary: {label: 'Email me when it’s back', icon: BellIcon},
  },
};

// Static class strings per tone so Tailwind sees every one of them.
const TONE_CLASSES: Record<
  Tone,
  {tile: string; mainTile: string; icon: string}
> = {
  blue: {
    tile: 'bg-(--color-background-card) border border-(--color-border-blue)',
    mainTile:
      'bg-(--color-background-blue) border border-(--color-border-blue)',
    icon: 'text-(--color-icon-blue)',
  },
  red: {
    tile: 'bg-(--color-background-card) border border-(--color-border-red)',
    mainTile: 'bg-(--color-background-red) border border-(--color-border-red)',
    icon: 'text-(--color-icon-red)',
  },
  orange: {
    tile: 'bg-(--color-background-card) border border-(--color-border-orange)',
    mainTile:
      'bg-(--color-background-orange) border border-(--color-border-orange)',
    icon: 'text-(--color-icon-orange)',
  },
  purple: {
    tile: 'bg-(--color-background-card) border border-(--color-border-purple)',
    mainTile:
      'bg-(--color-background-purple) border border-(--color-border-purple)',
    icon: 'text-(--color-icon-purple)',
  },
};

// ── Fixture ──────────────────────────────────────────────────────────────────

const PRODUCT = 'Meridian';

const POPULAR_PAGES: ReadonlyArray<{
  label: string;
  description: string;
  icon: HeroIcon;
  href: string;
}> = [
  {
    label: 'Dashboard',
    description: 'Your projects and recent activity',
    icon: HomeIcon,
    href: '#dashboard',
  },
  {
    label: 'Reports',
    description: 'Revenue, usage and team insights',
    icon: ChartBarIcon,
    href: '#reports',
  },
  {
    label: 'Documentation',
    description: 'Guides and API reference',
    icon: DocumentTextIcon,
    href: '#docs',
  },
  {
    label: 'Help center',
    description: 'Answers and contact options',
    icon: LifebuoyIcon,
    href: '#help',
  },
];

const REFERENCE_ID = 'REQ-7F3A-29C4-B81E';

const OWNER = {
  name: 'Nadia Karimi',
  role: 'Owner · Finance team',
};
const SIGNED_IN_AS = 'daniel.osei@meridian.co';

const ACCESS_LEVEL_OPTIONS = [
  {value: 'view', label: 'Can view'},
  {value: 'comment', label: 'Can comment'},
  {value: 'edit', label: 'Can edit'},
];

const AFFECTED_AREAS = ['Dashboards', 'Reports', 'Public API'];

const QUARTER_HOUR = 15 * 60_000;

// ── Page ─────────────────────────────────────────────────────────────────────

/**
 * The page owns its toast viewport so toasts inherit its direction and theme;
 * an app shell that already provides one can drop this wrapper.
 */
export default function ContentErrorTemplate() {
  return (
    <ToastViewport>
      <ErrorPage kind={ERROR_KIND} />
    </ToastViewport>
  );
}

function ErrorPage({kind}: {kind: ErrorKind}) {
  const isWide = useMediaQuery('(min-width: 720px)');
  return (
    <VStack
      minHeight="100%"
      className="bg-(--color-background-body)"
      style={{minHeight: '100%'}}>
      <ProductHeader />
      <VStack
        as="main"
        hAlign="center"
        vAlign="center"
        paddingInline={isWide ? 8 : 4}
        paddingBlockStart={10}
        paddingBlockEnd={isWide ? 10 : 6}
        className="flex-1">
        <ErrorMessage kind={kind} isWide={isWide} />
      </VStack>
    </VStack>
  );
}

function ProductHeader() {
  return (
    <VStack
      paddingInline={4}
      className="border-b border-(--color-border) bg-(--color-background-surface)">
      <TopNav
        label={`${PRODUCT} navigation`}
        heading={
          <TopNavHeading
            heading={PRODUCT}
            headingHref="#"
            logo={<NavIcon icon={<Icon icon={CubeIcon} size="sm" />} />}
          />
        }
        endContent={
          <HStack gap={1}>
            <Button label="System status" variant="ghost" href="#status" />
            <Button
              label="Help center"
              variant="ghost"
              href="#help"
              icon={<Icon icon={QuestionMarkCircleIcon} size="sm" />}
            />
          </HStack>
        }
      />
    </VStack>
  );
}

// ── The message ──────────────────────────────────────────────────────────────

function ErrorMessage({kind, isWide}: {kind: ErrorKind; isWide: boolean}) {
  const content = ERROR_CONTENT[kind];
  const showToast = useToast();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [isMaintenanceOver, setIsMaintenanceOver] = useState(false);
  // The maintenance window, fixed when the page mounts: it ends on the next
  // quarter hour at least 40 minutes away and started two hours before that.
  const [windowEnd] = useState(
    () => Math.ceil((Date.now() + 40 * 60_000) / QUARTER_HOUR) * QUARTER_HOUR,
  );

  const primary = (() => {
    switch (kind) {
      case 'not-found':
        return (
          <Button
            label={content.primary.label}
            variant="primary"
            size="lg"
            href="#"
            icon={<Icon icon={content.primary.icon} size="sm" />}
          />
        );
      case 'server-error':
        return (
          <Button
            label={content.primary.label}
            variant="primary"
            size="lg"
            isLoading={isRetrying}
            icon={<Icon icon={content.primary.icon} size="sm" />}
            onClick={() => {
              // Re-run the failed request or reload the route here.
              setIsRetrying(true);
              window.setTimeout(() => setIsRetrying(false), 1600);
            }}
          />
        );
      case 'forbidden':
        return isRequestSent ? (
          <Button
            label="Request sent"
            variant="primary"
            size="lg"
            isDisabled
            icon={<Icon icon={CheckIcon} size="sm" />}
          />
        ) : (
          <Button
            label={content.primary.label}
            variant="primary"
            size="lg"
            icon={<Icon icon={content.primary.icon} size="sm" />}
            onClick={() => setIsRequestOpen(true)}
          />
        );
      case 'maintenance':
        return (
          <Button
            label={content.primary.label}
            variant="primary"
            size="lg"
            href="#status"
            icon={<Icon icon={content.primary.icon} size="sm" />}
          />
        );
    }
  })();

  const secondary = (() => {
    const icon = content.secondary.icon ? (
      <Icon icon={content.secondary.icon} size="sm" />
    ) : undefined;
    if (kind === 'maintenance') {
      return (
        <Button
          label={isNotifying ? 'We’ll email you' : content.secondary.label}
          variant="secondary"
          size="lg"
          isDisabled={isNotifying || isMaintenanceOver}
          icon={isNotifying ? <Icon icon={CheckIcon} size="sm" /> : icon}
          onClick={() => {
            setIsNotifying(true);
            showToast({
              body: `We’ll email ${SIGNED_IN_AS} when ${PRODUCT} is back`,
            });
          }}
        />
      );
    }
    return (
      <Button
        label={content.secondary.label}
        variant="secondary"
        size="lg"
        href={kind === 'not-found' ? '#help' : '#'}
        icon={icon}
      />
    );
  })();

  return (
    <VStack gap={8} hAlign="center" width="100%" maxWidth={600}>
      <VStack gap={6} hAlign="center" width="100%">
        <HeroIcons content={content} />
        <VStack gap={3} hAlign="center" width="100%">
          {content.code != null ? (
            <Text
              type="display-1"
              color="secondary"
              hasTabularNumbers
              justify="center">
              {content.code}
            </Text>
          ) : isMaintenanceOver ? null : (
            <VStack gap={1} hAlign="center">
              <Text type="label" color="secondary">
                Back in about
              </Text>
              <Timer
                endTime={windowEnd}
                format="clock"
                type="display-1"
                color="primary"
                onComplete={() => setIsMaintenanceOver(true)}
              />
            </VStack>
          )}
          <Heading level={1} justify="center" textWrap="balance">
            {content.title}
          </Heading>
          <Text
            type="large"
            color="secondary"
            justify="center"
            textWrap="pretty">
            {content.description}
          </Text>
        </VStack>
        <HStack gap={3} hAlign="center" wrap="wrap">
          {primary}
          {secondary}
        </HStack>
      </VStack>

      {kind === 'not-found' && <NotFoundHelp isWide={isWide} />}
      {kind === 'server-error' && <ServerErrorHelp />}
      {kind === 'forbidden' && <ForbiddenHelp />}
      {kind === 'maintenance' && (
        <MaintenanceHelp windowEnd={windowEnd} isOver={isMaintenanceOver} />
      )}

      {kind === 'forbidden' && (
        <RequestAccessDialog
          isOpen={isRequestOpen}
          onOpenChange={setIsRequestOpen}
          onSend={() => {
            setIsRequestOpen(false);
            setIsRequestSent(true);
            showToast({body: `Access request sent to ${OWNER.name}`});
          }}
        />
      )}
    </VStack>
  );
}

/** Three tiles: two scene-setting icons flanking the one that names the problem. */
function HeroIcons({content}: {content: ErrorContent}) {
  const tone = TONE_CLASSES[content.tone];
  const side = 'size-12';
  const main = 'size-18';
  return (
    <HStack gap={3} vAlign="center" aria-hidden>
      <span
        className={`${side} ${tone.tile} ${tone.icon} grid place-items-center rounded-(--radius-container) translate-y-(--spacing-2) opacity-80`}>
        <Icon icon={content.icons.start} size="md" color="inherit" />
      </span>
      <span
        className={`${main} ${tone.mainTile} ${tone.icon} grid place-items-center rounded-(--radius-container) [box-shadow:var(--shadow-low)]`}>
        <Icon icon={content.icons.main} size="lg" color="inherit" />
      </span>
      <span
        className={`${side} ${tone.tile} ${tone.icon} grid place-items-center rounded-(--radius-container) translate-y-(--spacing-2) opacity-80`}>
        <Icon icon={content.icons.end} size="md" color="inherit" />
      </span>
    </HStack>
  );
}

// ── Help blocks, one per kind ────────────────────────────────────────────────

function NotFoundHelp({isWide}: {isWide: boolean}) {
  const [query, setQuery] = useState('');
  return (
    <VStack gap={6} width="100%">
      <form
        role="search"
        className="w-full"
        onSubmit={event => {
          // Hand the query to your search route here.
          event.preventDefault();
        }}>
        <HStack gap={2} vAlign="end">
          <StackItem size="fill">
            <TextInput
              label={`Search ${PRODUCT}`}
              isLabelHidden
              placeholder="Search pages, reports and docs"
              startIcon={<Icon icon={MagnifyingGlassIcon} size="sm" />}
              size="lg"
              hasClear
              value={query}
              onChange={setQuery}
            />
          </StackItem>
          <Button label="Search" variant="secondary" size="lg" type="submit" />
        </HStack>
      </form>
      <VStack gap={3} width="100%">
        <Divider label="Popular pages" />
        <Grid columns={isWide ? 2 : 1} gap={3}>
          {POPULAR_PAGES.map(page => (
            <ClickableCard
              key={page.href}
              label={page.label}
              href={page.href}
              padding={4}>
              <HStack gap={3} vAlign="center">
                <span className="grid size-9 shrink-0 place-items-center rounded-(--radius-element) bg-(--color-background-muted) text-(--color-icon-secondary)">
                  <Icon icon={page.icon} size="sm" color="inherit" />
                </span>
                <VStack gap={0.5}>
                  <Text type="label">{page.label}</Text>
                  <Text type="supporting" color="secondary">
                    {page.description}
                  </Text>
                </VStack>
              </HStack>
            </ClickableCard>
          ))}
        </Grid>
      </VStack>
    </VStack>
  );
}

function ServerErrorHelp() {
  const locale = useLocale();
  const {copy, isCopied} = useClipboard({announce: 'Reference ID copied'});
  const [occurredAt] = useState(() => Date.now());
  const occurred = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(occurredAt);
  return (
    <Card padding={5} width="100%">
      <VStack gap={4}>
        <HStack gap={4} vAlign="center" justify="between" wrap="wrap">
          <HStack gap={8} wrap="wrap">
            <VStack gap={1}>
              <Text type="supporting" color="secondary">
                Reference ID
              </Text>
              <Code>{REFERENCE_ID}</Code>
            </VStack>
            <VStack gap={1}>
              <Text type="supporting" color="secondary">
                Occurred
              </Text>
              <Text type="label">{occurred}</Text>
            </VStack>
          </HStack>
          <Button
            label={isCopied ? 'Copied' : 'Copy ID'}
            variant="secondary"
            icon={
              <Icon
                icon={isCopied ? CheckIcon : ClipboardDocumentIcon}
                size="sm"
              />
            }
            onClick={() => void copy(REFERENCE_ID)}
          />
        </HStack>
        <Divider />
        <HStack gap={4} vAlign="center" wrap="wrap">
          <Text type="supporting" color="secondary">
            If it keeps happening,{' '}
            <Link href="#support" type="supporting">
              contact support
            </Link>{' '}
            with this ID.
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
}

function ForbiddenHelp() {
  return (
    <Card padding={5} width="100%">
      <VStack gap={4}>
        <Text type="label" color="secondary">
          Who can give you access
        </Text>
        <HStack gap={3} vAlign="center">
          <Avatar name={OWNER.name} size="lg" />
          <VStack gap={0.5}>
            <Text type="label">{OWNER.name}</Text>
            <Text type="supporting" color="secondary">
              {OWNER.role}
            </Text>
          </VStack>
        </HStack>
        <Divider />
        <Text type="supporting" color="secondary">
          {`Signed in as ${SIGNED_IN_AS}.`} Wrong account?{' '}
          <Link href="#switch-account" type="supporting">
            Switch account
          </Link>
        </Text>
      </VStack>
    </Card>
  );
}

function MaintenanceHelp({
  windowEnd,
  isOver,
}: {
  windowEnd: number;
  isOver: boolean;
}) {
  const locale = useLocale();
  const windowStart = windowEnd - 2 * 60 * 60_000;
  const time = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      }),
    [locale],
  );
  if (isOver) {
    return (
      <Banner
        status="success"
        title="Maintenance is complete"
        description={`${PRODUCT} is back. Reload to pick up where you left off.`}
        endContent={
          <Button
            label="Reload"
            variant="secondary"
            size="sm"
            icon={<Icon icon={ArrowPathIcon} size="sm" />}
          />
        }
      />
    );
  }
  return (
    <Card padding={5} width="100%">
      <VStack gap={4}>
        <HStack gap={6} wrap="wrap" justify="between">
          <VStack gap={1}>
            <Text type="supporting" color="secondary">
              Started
            </Text>
            <Text type="label">{time.format(windowStart)}</Text>
          </VStack>
          <VStack gap={1}>
            <Text type="supporting" color="secondary">
              Expected back
            </Text>
            <Text type="label">{time.format(windowEnd)}</Text>
          </VStack>
          <VStack gap={1}>
            <Text type="supporting" color="secondary">
              Affected
            </Text>
            <HStack gap={1} wrap="wrap">
              {AFFECTED_AREAS.map(area => (
                <Badge key={area} label={area} />
              ))}
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );
}

// ── Request access dialog ────────────────────────────────────────────────────

function RequestAccessDialog({
  isOpen,
  onOpenChange,
  onSend,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSend: () => void;
}) {
  const [level, setLevel] = useState('view');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    onOpenChange(false);
    setReason('');
    setLevel('view');
    setError(null);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={open => (open ? onOpenChange(true) : close())}
      width={480}
      purpose="form">
      <Layout
        height="auto"
        padding={4}
        defaultHasDividers={false}
        header={
          <DialogHeader
            title="Request access"
            subtitle={`${OWNER.name} will get your request by email.`}
            onOpenChange={() => close()}
            hasDivider={false}
          />
        }
        content={
          <LayoutContent>
            <FormLayout defaultOptionality="required">
              <Selector
                label="Access level"
                options={ACCESS_LEVEL_OPTIONS}
                value={level}
                onChange={value => setLevel(value as string)}
              />
              <TextArea
                label="Why do you need access?"
                rows={3}
                maxLength={300}
                value={reason}
                onChange={value => {
                  setReason(value);
                  setError(null);
                }}
                placeholder="For example: I'm preparing the Q4 board deck"
                status={
                  error == null ? undefined : {type: 'error', message: error}
                }
              />
            </FormLayout>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Cancel" variant="secondary" onClick={close} />
              <Button
                label="Send request"
                variant="primary"
                onClick={() => {
                  if (reason.trim() === '') {
                    setError(
                      `Add a short reason so ${OWNER.name} knows what you need.`,
                    );
                    return;
                  }
                  onSend();
                  setReason('');
                  setLevel('view');
                }}
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
