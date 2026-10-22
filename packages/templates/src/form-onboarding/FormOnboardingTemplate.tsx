'use client';

/**
 * The first-run experience right after someone signs up for a workspace
 * product — here Fieldline, a construction-site operations app. Four short
 * steps (about you, workspace, team, first modules) on the start side; on the
 * end side a live miniature of the app that redraws itself from the answers:
 * the workspace name and colour in its top bar, the people invited in its
 * avatar row, the chosen modules as cards on its dashboard. A finish screen
 * closes the flow with a checklist of what is done and what is next.
 *
 * What picks this template over the wizard templates (`form-wizard`,
 * `form-wizard-vertical`, `checkout-wizard`) is that nothing here is owed.
 * A wizard collects a form the business needs — every required field has to
 * be answered before the record exists. Onboarding collects a handful of
 * preferences the product could guess, so every step that is not strictly
 * needed can be skipped, nothing asks for more than one or two decisions, and
 * the payoff is shown before the person commits: the preview answers "what
 * do I get?" while they are still choosing. The only hard requirement is the
 * one the product cannot invent — a workspace name — and even that arrives
 * prefilled from the sign-up form.
 *
 * The same shape fits any "set up your account" moment: a new project in a
 * tracker, a store in a commerce tool, a team in a chat app. Swap the fixture
 * (roles, modules, the preview tiles) and keep the structure.
 *
 * ## Extending this template
 *
 * **Skippable is a per-step decision, written down.** Each entry in `STEPS`
 * carries its own `skipLabel` — or none, for the workspace step. Skipping is
 * recorded in `skipped`, not by clearing answers, so going back to a skipped
 * step finds what was typed and moving forward with Continue un-skips it.
 * What a skipped step contributes is decided in one place (`effective`), so
 * the preview, the finish checklist and the toast never disagree about
 * whether the team was invited.
 *
 * **Validate on Continue, not on keystroke.** A step's errors are computed
 * all the time (`errorsByStep`) but only shown once the person has tried to
 * leave it (`attempted`). After that they update live, so fixing the field
 * clears the message. Clicking a later step in the Stepper runs the same
 * checks for every step in between and stops at the first one that fails —
 * a skipped step counts as passed.
 *
 * **The preview is derived, never stored.** `WorkspacePreview` takes plain
 * props and owns no state; every value in it is read from the same state the
 * form writes. It is a picture of the product, not the product: no headings
 * (so the page outline stays the form's), no interactive controls, and it is
 * dropped below the two-pane breakpoint rather than squeezed — the form is
 * what the person came to do. If your preview gets busy, replace it with a
 * calmer illustration built from the same tokens rather than shrinking it.
 *
 * **Accent colours come from tokens.** `ACCENTS` maps each choice to the
 * `--color-background-<hue>` / `--color-text-<hue>` / `--color-icon-<hue>`
 * variables, so the preview follows light and dark themes without a single
 * raw colour. A real product would also write the choice into its theme.
 *
 * **Right-to-left is a language property.** `LANGUAGES` marks which
 * languages read right to left; picking one shows a hint that the app
 * mirrors. Language names are written in their own script (endonyms) on
 * purpose — a person looking for their language scans for its own name.
 *
 * **The finish screen is a checklist, not a confetti page.** It reports what
 * setup achieved and lists what is left with time estimates, so the person
 * knows the first success is one click away. Steps they skipped come back
 * here as to-dos instead of being lost.
 */

import {useMemo, useState, type CSSProperties, type ReactNode} from 'react';
import {Avatar} from '@solo/core/Avatar';
import {AvatarGroup, AvatarGroupOverflow} from '@solo/core/AvatarGroup';
import {Badge} from '@solo/core/Badge';
import {Banner} from '@solo/core/Banner';
import {Button} from '@solo/core/Button';
import {Card} from '@solo/core/Card';
import {CheckboxList, CheckboxListItem} from '@solo/core/CheckboxList';
import {Field} from '@solo/core/Field';
import {FormLayout} from '@solo/core/FormLayout';
import {Grid} from '@solo/core/Grid';
import {Icon} from '@solo/core/Icon';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPanel,
} from '@solo/core/Layout';
import {List, ListItem} from '@solo/core/List';
import {ProgressBar} from '@solo/core/ProgressBar';
import {SegmentedControl, SegmentedControlItem} from '@solo/core/SegmentedControl';
import {SelectableCard} from '@solo/core/SelectableCard';
import {Selector} from '@solo/core/Selector';
import {HStack, StackItem, VStack} from '@solo/core/Stack';
import {Step, Stepper} from '@solo/core/Stepper';
import {Heading, Text} from '@solo/core/Text';
import {TextInput} from '@solo/core/TextInput';
import {useToast} from '@solo/core/Toast';
import {Tokenizer} from '@solo/core/Tokenizer';
import type {SearchableItem, SearchSource} from '@solo/core/Typeahead';
import {useMediaQuery} from '@solo/core/hooks';
import {
  BellAlertIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  EnvelopeIcon,
  EyeIcon,
  GlobeAltIcon,
  HomeIcon,
  MapIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import {HardHat} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────

const PRODUCT = 'Fieldline';
const DOMAIN = 'harborview.build';
// What the sign-up form already told us. The workspace name starts from the
// company name so the one required field is usually already answered.
const USER = {firstName: 'Layla', name: 'Layla Mansour'};
const SIGNUP_COMPANY = 'Harbor View Residences';
const NAME_MIN = 3;
const NAME_MAX = 40;
const WIDE_QUERY = '(min-width: 1080px)';

type RoleID = 'site-manager' | 'safety-officer' | 'project-director' | 'other';
type ModuleID = 'headcount' | 'safety' | 'zones' | 'reports';

const ROLES: ReadonlyArray<{
  id: RoleID;
  label: string;
  description: string;
  icon: typeof UserIcon;
  greeting: string;
  recommends: ReadonlyArray<ModuleID>;
}> = [
  {
    id: 'site-manager',
    label: 'Site manager',
    description: 'Runs the day on site',
    icon: ClipboardDocumentCheckIcon,
    greeting: 'Here is your site at a glance.',
    recommends: ['headcount', 'zones'],
  },
  {
    id: 'safety-officer',
    label: 'Safety officer',
    description: 'Keeps people out of harm',
    icon: ShieldCheckIcon,
    greeting: "Here is today's safety picture.",
    recommends: ['safety'],
  },
  {
    id: 'project-director',
    label: 'Project director',
    description: 'Oversees one or more sites',
    icon: BriefcaseIcon,
    greeting: 'Here is progress across your project.',
    recommends: ['reports'],
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something else on the team',
    icon: UserIcon,
    greeting: 'Here is what is happening on site.',
    recommends: [],
  },
];

const TEAM_SIZES = [
  {value: 'solo', label: 'Just me'},
  {value: 'small', label: '2–10'},
  {value: 'medium', label: '11–50'},
  {value: 'large', label: '51+'},
];

// Endonyms: each language is named in its own script. `isRTL` drives the hint.
const LANGUAGES: ReadonlyArray<{value: string; label: string; description: string; isRTL: boolean}> = [
  {value: 'en', label: 'English', description: 'Left to right', isRTL: false},
  {value: 'ar', label: 'العربية', description: 'Right to left', isRTL: true},
  {value: 'ur', label: 'اردو', description: 'Right to left', isRTL: true},
  {value: 'hi', label: 'हिन्दी', description: 'Left to right', isRTL: false},
];

const TIME_ZONES = [
  {value: 'Asia/Riyadh', label: 'Riyadh (GMT+3)'},
  {value: 'Asia/Dubai', label: 'Dubai (GMT+4)'},
  {value: 'Asia/Qatar', label: 'Doha (GMT+3)'},
  {value: 'Africa/Cairo', label: 'Cairo (GMT+2)'},
  {value: 'Asia/Karachi', label: 'Karachi (GMT+5)'},
  {value: 'Asia/Kolkata', label: 'Mumbai (GMT+5:30)'},
  {value: 'Europe/London', label: 'London (GMT+0)'},
  {value: 'Europe/Berlin', label: 'Berlin (GMT+1)'},
];

type AccentID = 'orange' | 'blue' | 'green' | 'purple';

// Every accent is a set of runtime theme tokens (background = tint,
// text and icon = ink), so the preview follows light and dark.
const ACCENTS: ReadonlyArray<{
  value: AccentID;
  label: string;
  subtle: string;
  text: string;
  icon: string;
}> = [
  {
    value: 'orange',
    label: 'Orange',
    subtle: 'var(--color-background-orange)',
    text: 'var(--color-text-orange)',
    icon: 'var(--color-icon-orange)',
  },
  {
    value: 'blue',
    label: 'Blue',
    subtle: 'var(--color-background-blue)',
    text: 'var(--color-text-blue)',
    icon: 'var(--color-icon-blue)',
  },
  {
    value: 'green',
    label: 'Green',
    subtle: 'var(--color-background-green)',
    text: 'var(--color-text-green)',
    icon: 'var(--color-icon-green)',
  },
  {
    value: 'purple',
    label: 'Purple',
    subtle: 'var(--color-background-purple)',
    text: 'var(--color-text-purple)',
    icon: 'var(--color-icon-purple)',
  },
];

const MODULES: ReadonlyArray<{
  id: ModuleID;
  label: string;
  /** Short name for the preview's side navigation. */
  navLabel: string;
  description: string;
  icon: typeof UserIcon;
}> = [
  {
    id: 'headcount',
    navLabel: 'Headcount',
    label: 'Headcount tracking',
    description: "See who's on site right now from turnstile and badge scans.",
    icon: UsersIcon,
  },
  {
    id: 'safety',
    navLabel: 'Safety',
    label: 'Safety alerts',
    description: 'Get told about incidents, expiring permits and missed PPE checks.',
    icon: BellAlertIcon,
  },
  {
    id: 'zones',
    navLabel: 'Zones',
    label: 'Zone occupancy',
    description: 'Set a limit per floor or crane area and get warned when it fills up.',
    icon: MapIcon,
  },
  {
    id: 'reports',
    navLabel: 'Reports',
    label: 'Reports',
    description: 'Daily site diaries and weekly summaries, ready to send to the client.',
    icon: DocumentChartBarIcon,
  },
];

const INVITE_ROLES = [
  {value: 'supervisor', label: 'Supervisor', description: 'Logs headcounts and raises alerts'},
  {value: 'safety-officer', label: 'Safety officer', description: 'Manages alerts, permits and inspections'},
  {value: 'admin', label: 'Admin', description: 'Everything, including billing and members'},
  {value: 'viewer', label: 'Viewer', description: 'Reads dashboards and reports'},
];

type Person = SearchableItem & {name: string};

// Colleagues who already signed up with the same email domain are suggested;
// anything else can be typed in full (Tokenizer `hasCreate`).
const SUGGESTED_PEOPLE: Person[] = [
  {id: `omar.haddad@${DOMAIN}`, label: `omar.haddad@${DOMAIN}`, name: 'Omar Haddad'},
  {id: `nadia.karimi@${DOMAIN}`, label: `nadia.karimi@${DOMAIN}`, name: 'Nadia Karimi'},
  {id: `yusuf.demir@${DOMAIN}`, label: `yusuf.demir@${DOMAIN}`, name: 'Yusuf Demir'},
  {id: `grace.whitfield@${DOMAIN}`, label: `grace.whitfield@${DOMAIN}`, name: 'Grace Whitfield'},
  {id: `mateo.silva@${DOMAIN}`, label: `mateo.silva@${DOMAIN}`, name: 'Mateo Silva'},
];

const PEOPLE_SOURCE: SearchSource<Person> = {
  search: query =>
    SUGGESTED_PEOPLE.filter(person =>
      person.label.toLowerCase().includes(query.toLowerCase()),
    ),
  bootstrap: () => SUGGESTED_PEOPLE,
};

const STEPS: ReadonlyArray<{label: string; icon: typeof UserIcon; skipLabel?: string}> = [
  {label: 'About you', icon: UserIcon, skipLabel: 'Skip for now'},
  {label: 'Workspace', icon: BuildingOffice2Icon},
  {label: 'Team', icon: UserGroupIcon, skipLabel: "I'll do this later"},
  {label: 'First modules', icon: Squares2X2Icon, skipLabel: 'Skip for now'},
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

const nameOf = (person: SearchableItem) =>
  (person as Partial<Person>).name ?? person.label.split('@')[0];

// ── Styles ────────────────────────────────────────────────────────────────────

const swatch = (color: string): CSSProperties => ({
  display: 'inline-block',
  inlineSize: 'var(--spacing-3)',
  blockSize: 'var(--spacing-3)',
  borderRadius: 'var(--radius-full)',
  background: color,
});

// A tinted square with the accent's ink on top: readable in light and dark.
const mark = (background: string, ink: string, size: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  inlineSize: size,
  blockSize: size,
  borderRadius: 'var(--radius-element)',
  background,
  color: ink,
});

// The finish checklist draws an empty ring for steps that are not done yet.
const todoRing: CSSProperties = {
  display: 'inline-block',
  flexShrink: 0,
  inlineSize: 'var(--spacing-5)',
  blockSize: 'var(--spacing-5)',
  borderRadius: 'var(--radius-full)',
  border: '2px solid var(--color-border-emphasized)',
};

const placeholderTile: CSSProperties = {
  border: '1px dashed var(--color-border-emphasized)',
  borderRadius: 'var(--radius-container)',
  padding: 'var(--spacing-3)',
  minBlockSize: 96,
};

// ── Preview ───────────────────────────────────────────────────────────────────

/**
 * A miniature of the product, drawn only from props. No headings and no
 * controls: it illustrates the answers, it is not a second place to edit them.
 */
function WorkspacePreview({
  name,
  accentID,
  roleID,
  languageValue,
  timeZoneValue,
  team,
  modules,
}: {
  name: string;
  accentID: AccentID;
  roleID: RoleID | null;
  languageValue: string;
  timeZoneValue: string;
  team: ReadonlyArray<SearchableItem>;
  modules: ReadonlyArray<ModuleID>;
}) {
  const accent = ACCENTS.find(a => a.value === accentID) ?? ACCENTS[0];
  const role = ROLES.find(r => r.id === roleID);
  const language = LANGUAGES.find(l => l.value === languageValue);
  const timeZone = TIME_ZONES.find(t => t.value === timeZoneValue);
  const displayName = name.trim() || 'Your workspace';
  const enabled = MODULES.filter(m => modules.includes(m.id));
  const visibleTeam = team.slice(0, 3);

  const tileBody = (id: ModuleID): ReactNode => {
    switch (id) {
      case 'headcount':
        return (
          <VStack gap={0.5}>
            <Text type="display-3" hasTabularNumbers>
              142
            </Text>
            <Text type="supporting" color="secondary">
              On site now
            </Text>
          </VStack>
        );
      case 'safety':
        return (
          <VStack gap={0.5}>
            <Text type="display-3" hasTabularNumbers>
              2
            </Text>
            <Text type="supporting" color="secondary">
              Open alerts
            </Text>
          </VStack>
        );
      case 'zones':
        return (
          <VStack gap={1.5}>
            <Text type="supporting">Level 3 deck</Text>
            <ProgressBar
              label="Level 3 deck occupancy"
              isLabelHidden
              value={78}
              variant="warning"
            />
            <Text type="supporting" color="secondary">
              78% of limit
            </Text>
          </VStack>
        );
      case 'reports':
        return (
          <VStack gap={0.5}>
            <Text type="supporting">Daily site diary</Text>
            <Text type="supporting" color="secondary">
              Ready at 6:00 PM
            </Text>
          </VStack>
        );
    }
  };

  return (
    <Card padding={0} elevation="high" width="100%" maxWidth={560}>
      {/* App bar: the workspace's identity, as the team will see it. */}
      <HStack
        gap={3}
        vAlign="center"
        paddingInline={4}
        paddingBlock={3}
        className="border-b border-(--color-border)">
        <span style={mark(accent.subtle, accent.text, 'var(--spacing-8)')} aria-hidden>
          <Text type="label" color="inherit">
            {initialsOf(displayName) || 'W'}
          </Text>
        </span>
        <StackItem size="fill">
          <VStack gap={0}>
            <Text type="label" maxLines={1}>
              {displayName}
            </Text>
            <HStack gap={1} vAlign="center">
              <Icon icon={GlobeAltIcon} size="xsm" color="secondary" />
              {/* Two text nodes, not one joined string, so each translates. */}
              <Text type="supporting" color="secondary" maxLines={1}>
                {language?.label}
              </Text>
              <Text type="supporting" color="secondary" aria-hidden>
                ·
              </Text>
              <Text type="supporting" color="secondary" maxLines={1}>
                {timeZone?.label}
              </Text>
            </HStack>
          </VStack>
        </StackItem>
        <AvatarGroup size="sm">
          <Avatar name={USER.name} />
          {visibleTeam.map(person => (
            <Avatar key={person.id} name={nameOf(person)} />
          ))}
          {team.length > visibleTeam.length && (
            <AvatarGroupOverflow count={team.length - visibleTeam.length} />
          )}
        </AvatarGroup>
      </HStack>

      <HStack gap={0} vAlign="stretch">
        {/* Side navigation: Overview plus one entry per enabled module. */}
        <VStack
          gap={0.5}
          padding={3}
          width={168}
          className="border-e border-(--color-border)">
          <HStack
            gap={2}
            vAlign="center"
            paddingInline={2}
            paddingBlock={1.5}
            className="rounded-(--radius-element)"
            style={{background: accent.subtle, color: accent.text}}>
            <Icon icon={HomeIcon} size="sm" color="inherit" />
            <Text type="supporting" weight="medium" color="inherit">
              Overview
            </Text>
          </HStack>
          {enabled.map(module => (
            <HStack key={module.id} gap={2} vAlign="center" paddingInline={2} paddingBlock={1.5}>
              <Icon icon={module.icon} size="sm" color="secondary" />
              <Text type="supporting" color="secondary" maxLines={1}>
                {module.navLabel}
              </Text>
            </HStack>
          ))}
        </VStack>

        {/* Dashboard: a tile per module; modules not chosen stay as outlines
            so the person sees there is room for them later. */}
        <StackItem size="fill">
          <VStack gap={4} padding={4}>
            <VStack gap={0.5}>
              <Text type="large" weight="semibold">
                {`Good morning, ${USER.firstName}`}
              </Text>
              <Text type="supporting" color="secondary">
                {role?.greeting ?? 'Here is what is happening on site.'}
              </Text>
            </VStack>
            <Grid columns={2} gap={3}>
              {MODULES.map(module =>
                modules.includes(module.id) ? (
                  <Card key={module.id} padding={3} minHeight={96}>
                    <VStack gap={2}>
                      <HStack gap={1.5} vAlign="center">
                        <span style={{color: accent.icon, display: 'inline-flex'}}>
                          <Icon icon={module.icon} size="sm" color="inherit" />
                        </span>
                        <Text type="supporting" weight="medium" maxLines={1}>
                          {module.label}
                        </Text>
                      </HStack>
                      {tileBody(module.id)}
                    </VStack>
                  </Card>
                ) : (
                  <VStack key={module.id} gap={1.5} style={placeholderTile}>
                    <HStack gap={1.5} vAlign="center">
                      <Icon icon={module.icon} size="sm" color="disabled" />
                      <Text type="supporting" color="disabled" maxLines={1}>
                        {module.label}
                      </Text>
                    </HStack>
                    <Text type="supporting" color="disabled">
                      Not set up yet
                    </Text>
                  </VStack>
                ),
              )}
            </Grid>
          </VStack>
        </StackItem>
      </HStack>
    </Card>
  );
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function FormOnboardingTemplate() {
  const isWide = useMediaQuery(WIDE_QUERY);
  const showToast = useToast();

  const [phase, setPhase] = useState<'setup' | 'done'>('setup');
  const [step, setStep] = useState(0);
  const [attempted, setAttempted] = useState<ReadonlySet<number>>(new Set());
  const [skipped, setSkipped] = useState<ReadonlySet<number>>(new Set());

  // Step 1 — About you
  const [roleID, setRoleID] = useState<RoleID | null>(null);
  const [teamSize, setTeamSize] = useState('medium');
  // Step 2 — Workspace
  const [workspaceName, setWorkspaceName] = useState(SIGNUP_COMPANY);
  const [accentID, setAccentID] = useState<AccentID>('orange');
  const [language, setLanguage] = useState('en');
  const [timeZone, setTimeZone] = useState('Asia/Dubai');
  // Step 3 — Team
  const [invites, setInvites] = useState<SearchableItem[]>([]);
  const [inviteRole, setInviteRole] = useState('supervisor');
  // Step 4 — First modules
  const [modules, setModules] = useState<string[]>(['headcount', 'safety']);

  // ── Derived ────────────────────────────────────────────────────────────────

  // What each step contributes once skipping is taken into account. The
  // preview, the finish checklist and the toast all read from here.
  const effective = {
    roleID: skipped.has(0) ? null : roleID,
    invites: skipped.has(2) ? [] : invites,
    modules: (skipped.has(3) ? [] : modules) as ModuleID[],
  };

  const role = ROLES.find(r => r.id === effective.roleID);
  const isRTLLanguage = LANGUAGES.find(l => l.value === language)?.isRTL ?? false;
  const slug = slugify(workspaceName);

  const errorsByStep = useMemo<Array<Record<string, string>>>(() => {
    const about: Record<string, string> = {};
    if (!roleID) {
      about.role = 'Choose the role closest to yours, or skip for now.';
    }

    const workspace: Record<string, string> = {};
    const trimmed = workspaceName.trim();
    if (!trimmed) {
      workspace.name = 'Give your workspace a name.';
    } else if (trimmed.length < NAME_MIN) {
      workspace.name = 'Use at least 3 characters.';
    } else if (trimmed.length > NAME_MAX) {
      workspace.name = 'Keep it to 40 characters or fewer.';
    }

    const team: Record<string, string> = {};
    if (invites.some(person => !EMAIL_PATTERN.test(person.label))) {
      team.invites = "One or more addresses aren't valid emails. Fix or remove them.";
    }

    const first: Record<string, string> = {};
    if (modules.length === 0) {
      first.modules = 'Pick at least one module, or skip for now.';
    }
    return [about, workspace, team, first];
  }, [roleID, workspaceName, invites, modules]);

  const shownErrors = (index: number) =>
    attempted.has(index) ? errorsByStep[index] : {};
  const currentErrors = shownErrors(step);
  const isLastStep = step === STEPS.length - 1;
  const hasErrors = (index: number) =>
    Object.keys(errorsByStep[index]).length > 0 && !skipped.has(index);

  const status = (message: string | undefined) =>
    message ? {type: 'error' as const, message} : undefined;

  // ── Navigation ─────────────────────────────────────────────────────────────

  const finish = () => {
    setPhase('done');
    showToast({body: 'Workspace created', uniqueID: 'onboarding-finished'});
  };

  const advance = () => {
    if (isLastStep) {
      finish();
    } else {
      setStep(current => current + 1);
    }
  };

  const goNext = () => {
    setAttempted(previous => new Set(previous).add(step));
    if (Object.keys(errorsByStep[step]).length > 0) {
      return;
    }
    // Answering a step that was skipped earlier un-skips it.
    setSkipped(previous => {
      const next = new Set(previous);
      next.delete(step);
      return next;
    });
    advance();
  };

  const skip = () => {
    setSkipped(previous => new Set(previous).add(step));
    setAttempted(previous => {
      const next = new Set(previous);
      next.delete(step);
      return next;
    });
    advance();
  };

  const goTo = (index: number) => {
    if (index <= step) {
      setStep(index);
      return;
    }
    // Moving forward through the Stepper checks every step on the way and
    // stops at the first one that still needs an answer.
    for (let candidate = step; candidate < index; candidate += 1) {
      if (hasErrors(candidate)) {
        setAttempted(previous => new Set(previous).add(candidate));
        setStep(candidate);
        return;
      }
    }
    setStep(index);
  };

  const reviewSetup = () => {
    setPhase('setup');
    setStep(0);
  };

  // ── Steps ──────────────────────────────────────────────────────────────────

  const stepper = (
    <Stepper
      activeStep={step}
      orientation="horizontal"
      onStepClick={goTo}
      label="Setup progress"
      horizontalOptions={{minimumStepWidth: 112, collapsedVariant: 'withLabel'}}>
      {STEPS.map(({label, icon}, index) => {
        const hasError = Object.keys(shownErrors(index)).length > 0;
        return (
          <Step
            key={label}
            step={index}
            label={label}
            description={skipped.has(index) && index !== step ? 'Skipped' : undefined}
            indicator={<Icon icon={hasError ? 'error' : icon} size="sm" />}
            status={hasError ? 'error' : undefined}
          />
        );
      })}
    </Stepper>
  );

  const aboutStep = (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>{`Welcome to ${PRODUCT}, ${USER.firstName}`}</Heading>
        <Text color="secondary">
          Two quick questions so your workspace starts out useful. You can
          change any of this later in Settings.
        </Text>
      </VStack>

      <Field
        label="What's your role?"
        inputID="onboarding-role"
        isGroupLabel
        status={status(currentErrors.role)}
        statusVariant="detached">
        <Grid id="onboarding-role" columns={2} gap={3}>
          {ROLES.map(option => (
            <SelectableCard
              key={option.id}
              label={option.label}
              isSelected={roleID === option.id}
              onChange={() => setRoleID(option.id)}
              padding={4}>
              <HStack gap={3} vAlign="center">
                <Icon icon={option.icon} size="md" color="secondary" />
                <VStack gap={0.5}>
                  <Text type="label">{option.label}</Text>
                  <Text type="supporting" color="secondary">
                    {option.description}
                  </Text>
                </VStack>
              </HStack>
            </SelectableCard>
          ))}
        </Grid>
      </Field>

      <VStack gap={2}>
        <Text type="label">How big is your site team?</Text>
        <SegmentedControl
          label="How big is your site team?"
          value={teamSize}
          onChange={setTeamSize}
          layout="fill">
          {TEAM_SIZES.map(size => (
            <SegmentedControlItem key={size.value} value={size.value} label={size.label} />
          ))}
        </SegmentedControl>
        <Text type="supporting" color="secondary">
          Counting everyone who badges in on a normal day, including
          subcontractors.
        </Text>
      </VStack>
    </VStack>
  );

  const workspaceStep = (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>Create your workspace</Heading>
        <Text color="secondary">
          This is where your sites, people and reports live. Most teams name
          it after the project.
        </Text>
      </VStack>

      <FormLayout defaultOptionality="required">
        <TextInput
          label="Workspace name"
          value={workspaceName}
          onChange={setWorkspaceName}
          description="Everyone you invite sees this name. You can rename it later."
          placeholder="e.g. Marina Gate Tower"
          status={status(currentErrors.name)}
        />
        <TextInput
          label="Web address"
          value={`${slug || 'your-workspace'}.fieldline.app`}
          isReadOnly
          description="Made from the name, so your team can find you."
        />
        <VStack gap={2}>
          <Text type="label">Workspace color</Text>
          <SegmentedControl
            label="Workspace color"
            value={accentID}
            onChange={value => setAccentID(value as AccentID)}
            layout="fill">
            {ACCENTS.map(accent => (
              <SegmentedControlItem
                key={accent.value}
                value={accent.value}
                label={accent.label}
                icon={<span style={swatch(accent.icon)} aria-hidden />}
              />
            ))}
          </SegmentedControl>
        </VStack>
        <FormLayout direction={isWide ? 'horizontal' : 'vertical'}>
          <Selector
            label="Language"
            options={LANGUAGES.map(({value, label, description}) => ({value, label, description}))}
            value={language}
            onChange={setLanguage}
          />
          <Selector
            label="Time zone"
            options={TIME_ZONES}
            value={timeZone}
            onChange={setTimeZone}
          />
        </FormLayout>
        {isRTLLanguage && (
          <Banner
            status="info"
            collapsible={false}
            title="Right-to-left is fully supported"
            description="Menus, tables, charts and printed reports mirror automatically for everyone in this workspace."
          />
        )}
      </FormLayout>
      <Text type="supporting" color="secondary">
        Shift times, alerts and daily reports use the workspace time zone.
      </Text>
    </VStack>
  );

  const teamStep = (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>Invite your team</Heading>
        <Text color="secondary">
          Bring in the people who log headcounts, raise alerts and read the
          reports. They'll get an email from Layla Mansour.
        </Text>
      </VStack>

      <FormLayout>
        <Tokenizer
          label="Email addresses"
          description={`Press Enter after each address. People at ${DOMAIN} are suggested.`}
          placeholder="name@company.com"
          searchSource={PEOPLE_SOURCE}
          value={invites}
          onChange={setInvites}
          hasCreate
          hasEntriesOnFocus
          hasClear
          startIcon={EnvelopeIcon}
          status={status(currentErrors.invites)}
        />
        <Selector
          label="Invite as"
          options={INVITE_ROLES}
          value={inviteRole}
          onChange={setInviteRole}
          description="You can give each person a different role later."
        />
      </FormLayout>

      <Text type="supporting" color="secondary">
        Invitations expire after 14 days. You can resend them from Settings.
      </Text>
    </VStack>
  );

  const modulesStep = (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>What should we set up first?</Heading>
        <Text color="secondary">
          Start with one or two. Each module adds a card to your dashboard,
          and you can turn on the rest at any time.
        </Text>
      </VStack>

      <CheckboxList
        label="Starter modules"
        value={modules}
        onChange={setModules}
        hasDividers
        status={status(currentErrors.modules)}>
        {MODULES.map(module => (
          <CheckboxListItem
            key={module.id}
            value={module.id}
            label={module.label}
            description={module.description}
            endContent={
              role?.recommends.includes(module.id) ? (
                <Badge variant="blue" label="Recommended" />
              ) : undefined
            }
          />
        ))}
      </CheckboxList>
    </VStack>
  );

  const footer = (
    <HStack gap={3} vAlign="center" width="100%">
      {step > 0 ? (
        <Button
          label="Back"
          variant="secondary"
          onClick={() => setStep(current => Math.max(0, current - 1))}
        />
      ) : null}
      <StackItem size="fill">
        <Text type="supporting" color="secondary">
          {`Step ${step + 1} of ${STEPS.length}`}
        </Text>
      </StackItem>
      {STEPS[step].skipLabel && (
        <Button label={STEPS[step].skipLabel!} variant="ghost" onClick={skip} />
      )}
      <Button
        label={isLastStep ? 'Finish setup' : 'Continue'}
        variant="primary"
        onClick={goNext}
      />
    </HStack>
  );

  // ── Finish ─────────────────────────────────────────────────────────────────

  const nextSteps: ReadonlyArray<{
    label: string;
    description: string;
    isDone: boolean;
    estimate?: string;
  }> = [
    {
      label: 'Create your workspace',
      description: 'Name, language and time zone are set.',
      isDone: true,
    },
    {
      label: 'Tell us your role',
      description: role
        ? 'Your home screen is tuned to it.'
        : 'Get a home screen tuned to the work you do.',
      isDone: !!role,
      estimate: '1 min',
    },
    {
      label: 'Invite your team',
      description:
        effective.invites.length > 0
          ? 'Invitations are on their way.'
          : 'Add the supervisors and officers who run the site with you.',
      isDone: effective.invites.length > 0,
      estimate: '2 min',
    },
    {
      label: 'Turn on your first modules',
      description:
        effective.modules.length > 0
          ? "They're on your dashboard now."
          : 'Pick from headcount, safety alerts, zones and reports.',
      isDone: effective.modules.length > 0,
      estimate: '1 min',
    },
    {
      label: 'Map your site zones',
      description: 'Draw floors, crane areas and no-go zones so occupancy limits work.',
      isDone: false,
      estimate: '10 min',
    },
    {
      label: 'Connect turnstiles or badge readers',
      description: 'Headcount fills itself in once scans start arriving.',
      isDone: false,
      estimate: '15 min',
    },
  ];
  const doneCount = nextSteps.filter(item => item.isDone).length;

  const finishScreen = (
    <VStack gap={8}>
      <VStack gap={4}>
        <span
          style={{
            ...mark('var(--color-success-muted)', 'var(--color-success)', 'var(--spacing-12)'),
            borderRadius: 'var(--radius-full)',
          }}>
          <Icon icon="success" size="lg" color="success" />
        </span>
        <VStack gap={2}>
          <Heading level={1}>{`You're all set, ${USER.firstName}`}</Heading>
          <Text color="secondary">
            Your workspace is ready. A few more steps get your site fully
            running this week — pick up any of them from the dashboard.
          </Text>
        </VStack>
      </VStack>

      <VStack gap={3}>
        <HStack gap={3} vAlign="center" hAlign="between">
          <Heading level={2}>Getting started</Heading>
          <Text type="supporting" color="secondary">
            {`${doneCount} of ${nextSteps.length} done`}
          </Text>
        </HStack>
        <ProgressBar
          label="Getting started progress"
          isLabelHidden
          value={doneCount}
          max={nextSteps.length}
          variant="success"
        />
        <List hasDividers density="balanced" aria-label="Getting started">
          {nextSteps.map(item => (
            <ListItem
              key={item.label}
              label={item.label}
              description={item.description}
              startContent={
                item.isDone ? (
                  <Icon icon="success" size="md" color="success" label="Done" />
                ) : (
                  <span role="img" aria-label="Not done yet" style={todoRing} />
                )
              }
              endContent={
                item.isDone ? undefined : (
                  <Text type="supporting" color="secondary">
                    {item.estimate}
                  </Text>
                )
              }
            />
          ))}
        </List>
      </VStack>

      <HStack gap={3} vAlign="center" wrap="wrap">
        <Button
          label="Go to dashboard"
          variant="primary"
          onClick={() =>
            showToast({body: 'Opening your dashboard', uniqueID: 'onboarding-dashboard'})
          }
        />
        <Button label="Review setup" variant="ghost" onClick={reviewSetup} />
      </HStack>
    </VStack>
  );

  // ── Page ───────────────────────────────────────────────────────────────────

  const currentAccent = ACCENTS.find(a => a.value === accentID) ?? ACCENTS[0];
  const brand = (
    <HStack gap={3} vAlign="center" width="100%">
      <span
        style={mark(currentAccent.subtle, currentAccent.text, 'var(--spacing-8)')}
        aria-hidden>
        <Icon icon={HardHat} size="sm" color="inherit" />
      </span>
      <StackItem size="fill">
        <Text type="label">{PRODUCT}</Text>
      </StackItem>
      {phase === 'setup' && (
        <Button label="Skip setup" variant="ghost" size="sm" onClick={finish} />
      )}
    </HStack>
  );

  const formPane = (
    <Layout
      height="fill"
      contentWidth={600}
      header={
        <LayoutHeader padding={6} paddingBlockEnd={4}>
          {brand}
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={6}>
          {phase === 'done' ? (
            finishScreen
          ) : (
            <VStack gap={8}>
              {stepper}
              {step === 0 && aboutStep}
              {step === 1 && workspaceStep}
              {step === 2 && teamStep}
              {step === 3 && modulesStep}
            </VStack>
          )}
        </LayoutContent>
      }
      footer={
        phase === 'setup' ? (
          <LayoutFooter hasDivider padding={4} label="Setup navigation">
            {/* 4 + 2 lines the footer up with the content column's 6. */}
            <HStack paddingInline={2} width="100%">
              {footer}
            </HStack>
          </LayoutFooter>
        ) : undefined
      }
    />
  );

  return (
    <Layout
      height="fill"
      content={formPane}
      end={
        isWide ? (
          <LayoutPanel
            width="44%"
            padding={10}
            hasDivider
            role="complementary"
            label="Workspace preview"
            className="bg-(--color-background-muted)">
            <VStack gap={4} hAlign="center" vAlign="center" height="100%">
              <HStack gap={2} vAlign="center">
                <Icon icon={EyeIcon} size="sm" color="secondary" />
                <Text type="supporting" color="secondary">
                  Live preview
                </Text>
              </HStack>
              <WorkspacePreview
                name={workspaceName}
                accentID={accentID}
                roleID={effective.roleID}
                languageValue={language}
                timeZoneValue={timeZone}
                // Only addresses that would actually receive an invite.
                team={effective.invites.filter(person => EMAIL_PATTERN.test(person.label))}
                modules={effective.modules}
              />
              <Text type="supporting" color="secondary" justify="center">
                Your choices show up here as you make them.
              </Text>
            </VStack>
          </LayoutPanel>
        ) : undefined
      }
    />
  );
}
