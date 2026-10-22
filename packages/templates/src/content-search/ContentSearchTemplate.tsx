'use client';

/**
 * Search results: one query box across everything a company keeps — its
 * documents, its people, its projects and its tickets — with the matches
 * ranked by relevance, refined by facets down the start side, and each match
 * shown with enough context (where it lives, the words that matched, who owns
 * it, when it changed) to decide whether to open it.
 *
 * The fixture is the intranet of Meridian Works, searched for "badge policy".
 * What picks this template over the table templates (`table-filter`,
 * `table-page`) is that **the query is the main input and the results are of
 * mixed kinds**. A table lists one kind of record with the same columns on
 * every row and lets people sort by any of them; here a person, a policy and
 * a ticket sit in one list because they all match the same words, and the
 * order is relevance, not a column. Facets do not define the list — the query
 * does — they only narrow it. If every row has the same shape and the filters
 * *are* the question ("open tickets assigned to me"), use a table template
 * instead. The same page fits a help centre, a document archive, a product
 * catalogue searched by keyword, or a site-wide search.
 *
 * ## Extending this template
 *
 * ### The query box
 *
 * **Typeahead, not PowerSearch.** The docs reserve `PowerSearch` for
 * structured `field operator value` filters and say a keyword search should
 * not use it. A keyword search with suggestions is a `Typeahead` whose search
 * source returns, first, *what was typed* ("Search everything") and then
 * the recent and suggested searches that contain it. Because the typed text is
 * the first, highlighted entry, Enter always searches exactly what the person
 * typed; arrowing down picks a suggestion instead. The box sits in a
 * `<form role="search">` with a real submit button, so clicking "Search" (or
 * pressing Enter with the menu closed) submits the draft too — `draft` follows
 * `onChangeQuery`, `query` is what was last submitted, and only `query` drives
 * the results. Never search on every keystroke against a real index; the
 * suggestions are the as-you-type part.
 *
 * **The submitted query is shown back as a token.** Typeahead holds a
 * selected value as a token; clicking it puts the text back into the input to
 * edit it, which is exactly the "refine my search" gesture. When the query
 * changes from somewhere else (a "Did you mean", a popular search), the page
 * sets `selected` too, so the box always shows the query the results are for.
 *
 * ### Ranking and matching
 *
 * **One pass from query to page.** `scoreResult` scores each record against
 * the query words (title hits weigh most, then tags, owner and snippet, then
 * the path, plus a bonus when the whole phrase appears); records scoring zero
 * are not results. Facets filter the scored list, the sort orders it, and
 * pagination slices it — in that order, every render. Any word may match
 * (OR), which suits a short fixture; a real index usually ranks records with
 * all words first, which `scoreResult` already does through the score.
 * Replace the whole function with your search API and keep the shape: the
 * server returns the ranked page, the facet counts and the total.
 *
 * **Facet counts ignore their own facet.** The Type counts are computed with
 * every *other* filter applied, so ticking "Documents" does not make
 * "People" drop to zero — the count says what you would get by ticking it
 * too. Do the same for any facet whose options can be combined.
 *
 * **"Did you mean" comes from the index's own words.** `suggestCorrection`
 * compares each query word that matches nothing against the vocabulary of the
 * fixture (edit distance 1–2) and offers the corrected query as a link. It is
 * shown above the results when some words still matched, and inside the empty
 * state when nothing did. Never auto-correct silently: the person may really
 * be searching for the rare word.
 *
 * ### Facets
 *
 * **Each facet uses the control its shape calls for.** Type is a short,
 * combinable set with counts — `CheckboxList` with the count as end content.
 * Updated is one choice from four — `RadioList`, pre-selected to "Any time".
 * Owner is a longer list of people — `MultiSelector`, which adds a popup and
 * would add search past ~15 options. Nothing selected in a facet means "all";
 * do not pre-tick every option. Active filters are repeated above the results
 * as removable `Token`s (values the person chose), so they stay visible when
 * the facet column is scrolled away or lives in a sheet.
 *
 * **Beside on wide screens, in a BottomSheet on narrow ones.** Solo defines
 * no responsive breakpoints in Tailwind, so the page asks
 * `useMediaQuery(WIDE_QUERY)`: wide, the facets are a sticky column at the
 * start; narrow, a "Filters" button opens the same `FacetFields` in a
 * `BottomSheet` (the touch surface the docs give for filters) with a button
 * that says how many results the filters leave. Both read and write the same
 * state, so nothing is lost when the window is resized.
 *
 * ### Results
 *
 * **Every result reads the same way, whatever its type.** A type icon (or the
 * person's avatar), the path it lives in, the title as a `Link` (inside an
 * `h3`, so screen-reader users can jump between results), a snippet, then
 * type · owner · updated date. The date is a `Timestamp`, so it is formatted
 * by the active locale. Tags are `Badge`s — read-only categories of the
 * record — while the active filters are `Token`s; the docs draw that line and
 * so does this page. A status badge appears only when it needs attention
 * ("At risk", "Overdue"), never "Open" on every ticket.
 *
 * **Highlights are marked phrases, not regex output.** Each snippet is
 * written with its matchable phrases in [brackets]. `parseSnippet` splits it
 * into plain text and phrases, and a phrase is wrapped in `<mark>` (coloured
 * with tokens) when it contains a query word. Keeping the split at phrase
 * boundaries keeps each piece translatable on its own, so the Arabic preview
 * highlights the same phrase in Arabic word order. Titles are not
 * highlighted: the title is already the strongest signal, and it stays one
 * string. With a real index, ask it for highlight offsets and render them the
 * same way.
 *
 * **Three different empty states.** No query yet: an invitation with popular
 * searches. A query that matches nothing: what to try, the "Did you mean" if
 * there is one, and search tips. A query whose matches are all filtered out:
 * say so and offer "Clear filters" — telling someone "no results" when the
 * filters are the cause is the most common way this page misleads.
 */

import {useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode} from 'react';

import {Avatar} from '@solo/core/Avatar';
import {Badge} from '@solo/core/Badge';
import {BottomSheet} from '@solo/core/BottomSheet';
import {Button} from '@solo/core/Button';
import {CheckboxList, CheckboxListItem} from '@solo/core/CheckboxList';
import {Divider} from '@solo/core/Divider';
import {EmptyState} from '@solo/core/EmptyState';
import {useMediaQuery} from '@solo/core/hooks';
import {Icon} from '@solo/core/Icon';
import {Layout, LayoutContent} from '@solo/core/Layout';
import {Link} from '@solo/core/Link';
import {List, ListItem} from '@solo/core/List';
import {MultiSelector} from '@solo/core/MultiSelector';
import {Pagination} from '@solo/core/Pagination';
import {RadioList, RadioListItem} from '@solo/core/RadioList';
import {Selector} from '@solo/core/Selector';
import {HStack, Stack, StackItem, VStack} from '@solo/core/Stack';
import {Heading, Text} from '@solo/core/Text';
import {Timestamp} from '@solo/core/Timestamp';
import {Token} from '@solo/core/Token';
import {Typeahead, TypeaheadItem} from '@solo/core/Typeahead';
import type {SearchableItem, SearchSource} from '@solo/core/Typeahead';
import {
  ArrowUpDown,
  Clock,
  FileText,
  FolderKanban,
  Search,
  SlidersHorizontal,
  Sparkles,
  Ticket,
  User,
  type LucideIcon,
} from 'lucide-react';

// ============= DATA =============

const COMPANY = 'Meridian Works';
const PAGE_SIZE = 8;
const WIDE_QUERY = '(min-width: 1024px)';
const INITIAL_QUERY = 'badge policy';

/** The fixture's "today". Fixed, so the dates and the Updated facet never drift. */
const TODAY = Date.UTC(2026, 9, 20, 9, 0);
const DAY = 24 * 60 * 60 * 1000;

type ResultType = 'document' | 'person' | 'project' | 'ticket';

const TYPE_ORDER: ResultType[] = ['document', 'person', 'project', 'ticket'];

const TYPE_META: Record<
  ResultType,
  {singular: string; plural: string; icon: LucideIcon}
> = {
  document: {singular: 'Document', plural: 'Documents', icon: FileText},
  person: {singular: 'Person', plural: 'People', icon: User},
  project: {singular: 'Project', plural: 'Projects', icon: FolderKanban},
  ticket: {singular: 'Ticket', plural: 'Tickets', icon: Ticket},
};

type Updated = 'any' | 'week' | 'month' | 'year';

const UPDATED_OPTIONS: {value: Updated; label: string; maxDays: number}[] = [
  {value: 'any', label: 'Any time', maxDays: Infinity},
  {value: 'week', label: 'Past week', maxDays: 7},
  {value: 'month', label: 'Past month', maxDays: 31},
  {value: 'year', label: 'Past year', maxDays: 365},
];

type Sort = 'relevance' | 'newest' | 'oldest';

const SORT_OPTIONS = [
  {value: 'relevance', label: 'Relevance'},
  {value: 'newest', label: 'Newest first'},
  {value: 'oldest', label: 'Oldest first'},
];

/** Category tags get a stable colour; anything else stays neutral. */
const TAG_COLOR: Record<string, 'blue' | 'purple' | 'cyan' | 'orange' | 'green'> = {
  Policy: 'blue',
  Security: 'purple',
  IT: 'cyan',
  Facilities: 'orange',
  Onboarding: 'green',
};

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  /** Where the record lives, outermost first. */
  path: string[];
  /** Matchable phrases are in [brackets]; see `parseSnippet`. */
  snippet: string;
  owner: string;
  updatedDaysAgo: number;
  tags: string[];
  /** Only states someone should act on. */
  status?: {label: string; variant: 'warning' | 'error'};
}

const RESULTS: SearchResult[] = [
  {
    id: 'doc-visitor-badge-policy',
    type: 'document',
    title: 'Visitor and Badge Policy',
    path: ['Policies', 'Security'],
    snippet:
      'Every employee must wear a [company badge] where it can be seen. The [badge policy] also covers contractors, interns and [visitors].',
    owner: 'Sarah Collins',
    updatedDaysAgo: 12,
    tags: ['Policy', 'Security'],
  },
  {
    id: 'doc-badge-policy-faq',
    type: 'document',
    title: 'Badge Policy FAQ',
    path: ['Policies', 'Security'],
    snippet:
      'Answers to common questions about the [badge policy]: what to do if you forget your [badge], and how [temporary badges] work.',
    owner: 'Sarah Collins',
    updatedDaysAgo: 3,
    tags: ['Policy'],
  },
  {
    id: 'person-sarah-collins',
    type: 'person',
    title: 'Sarah Collins',
    path: ['People', 'Security'],
    snippet:
      'Head of Security. Owns the [badge policy] and approves [visitor access] for all offices.',
    owner: 'Sarah Collins',
    updatedDaysAgo: 1,
    tags: [],
  },
  {
    id: 'project-badge-system-upgrade',
    type: 'project',
    title: 'Badge System Upgrade',
    path: ['Projects', 'Security'],
    snippet:
      'Replacing the old [badge readers] with mobile access. The rollout follows the new [badge policy].',
    owner: 'Omar Haddad',
    updatedDaysAgo: 5,
    tags: ['Security'],
    status: {label: 'At risk', variant: 'warning'},
  },
  {
    id: 'ticket-sec-4711',
    type: 'ticket',
    title: 'Clarify badge policy for weekend shifts',
    path: ['Service Desk', 'SEC-4711'],
    snippet:
      'Weekend staff are unsure whether the [badge policy] applies to the [loading dock] entrance.',
    owner: 'Omar Haddad',
    updatedDaysAgo: 28,
    tags: [],
  },
  {
    id: 'doc-lost-badge-procedure',
    type: 'document',
    title: 'Lost or Stolen Badge Procedure',
    path: ['Policies', 'Security'],
    snippet:
      'Report a lost [badge] within 24 hours. Security disables the old [badge] and issues a [replacement badge] at the front desk.',
    owner: 'Omar Haddad',
    updatedDaysAgo: 40,
    tags: ['Security'],
  },
  {
    id: 'doc-office-access-policy',
    type: 'document',
    title: 'Office Access Policy 2026',
    path: ['Policies', 'Facilities'],
    snippet:
      'Sets out who may enter each floor after hours. Read it together with the [badge policy] and the [visitor policy].',
    owner: 'Youssef Mansour',
    updatedDaysAgo: 95,
    tags: ['Policy', 'Facilities'],
  },
  {
    id: 'ticket-sec-4821',
    type: 'ticket',
    title: 'Badge reader at Gate 3 rejects valid badges',
    path: ['Service Desk', 'SEC-4821'],
    snippet:
      'Since Monday the [badge reader] at Gate 3 shows a red light for valid [badges]. Until it is fixed, use Gate 2.',
    owner: 'Omar Haddad',
    updatedDaysAgo: 1,
    tags: [],
    status: {label: 'Overdue', variant: 'error'},
  },
  {
    id: 'doc-badge-photo-guidelines',
    type: 'document',
    title: 'Badge Photo Guidelines',
    path: ['Handbooks', 'Security'],
    snippet:
      'Upload a recent, front-facing photo for your [badge]. Photos with sunglasses or hats are rejected.',
    owner: 'James Whitaker',
    updatedDaysAgo: 6,
    tags: ['Security'],
  },
  {
    id: 'ticket-sec-4790',
    type: 'ticket',
    title: 'Replacement badge for a new surname',
    path: ['Service Desk', 'SEC-4790'],
    snippet:
      'Please print a [replacement badge] with my new surname. My old [badge] still works until then.',
    owner: 'Sarah Collins',
    updatedDaysAgo: 7,
    tags: [],
  },
  {
    id: 'ticket-sec-4752',
    type: 'ticket',
    title: 'Temporary badges for visiting auditors',
    path: ['Service Desk', 'SEC-4752'],
    snippet:
      'Five auditors need [temporary badges] for two weeks, in line with the [visitor policy].',
    owner: 'Sarah Collins',
    updatedDaysAgo: 16,
    tags: [],
  },
  {
    id: 'project-visitor-kiosk',
    type: 'project',
    title: 'Visitor Kiosk Pilot',
    path: ['Projects', 'Security'],
    snippet:
      'Self-service kiosks print a [visitor badge] and tell the host when their guest arrives.',
    owner: 'Sarah Collins',
    updatedDaysAgo: 75,
    tags: ['Security'],
  },
  {
    id: 'person-omar-haddad',
    type: 'person',
    title: 'Omar Haddad',
    path: ['People', 'Security'],
    snippet:
      'Security Operations Lead. Contact Omar about lost [badges] and problems with [door access].',
    owner: 'Omar Haddad',
    updatedDaysAgo: 14,
    tags: [],
  },
  {
    id: 'doc-information-security-policy',
    type: 'document',
    title: 'Information Security Policy',
    path: ['Policies', 'Security'],
    snippet:
      'The top-level [security policy]. It covers passwords, [badge access] and how to report an incident.',
    owner: 'Sarah Collins',
    updatedDaysAgo: 340,
    tags: ['Policy', 'Security'],
  },
  {
    id: 'doc-contractor-onboarding',
    type: 'document',
    title: 'Contractor Onboarding Guide',
    path: ['Handbooks', 'People Operations'],
    snippet:
      'Contractors receive a [contractor badge] on day one and sign the [security policy] before their first shift.',
    owner: 'Layla Khalil',
    updatedDaysAgo: 20,
    tags: ['Onboarding'],
  },
  {
    id: 'doc-security-training',
    type: 'document',
    title: 'Security Awareness Training',
    path: ['Training', 'Security'],
    snippet:
      'Module 3 covers [tailgating], [badge sharing] and why you should never hold the door for strangers.',
    owner: 'Omar Haddad',
    updatedDaysAgo: 150,
    tags: ['Security'],
  },
  {
    id: 'doc-parking-permit-rules',
    type: 'document',
    title: 'Parking Permit Rules',
    path: ['Handbooks', 'Facilities'],
    snippet:
      'Each [parking permit] is linked to your [badge]. Permits are renewed every January.',
    owner: 'Youssef Mansour',
    updatedDaysAgo: 480,
    tags: ['Facilities'],
  },
  {
    id: 'doc-new-starter-checklist',
    type: 'document',
    title: 'New Starter Checklist',
    path: ['Handbooks', 'People Operations'],
    snippet:
      'Before day one, send your [badge photo], set up your laptop and book the [welcome session].',
    owner: 'Layla Khalil',
    updatedDaysAgo: 2,
    tags: ['Onboarding'],
  },
  {
    id: 'project-office-move',
    type: 'project',
    title: 'Headquarters Office Move',
    path: ['Projects', 'Facilities'],
    snippet:
      'Moving three teams to the new floor in December, with new [badge access] zones on every level.',
    owner: 'Youssef Mansour',
    updatedDaysAgo: 11,
    tags: ['Facilities'],
  },
  {
    id: 'doc-meeting-room-guide',
    type: 'document',
    title: 'Meeting Room Booking Guide',
    path: ['Handbooks', 'Facilities'],
    snippet:
      'Book rooms from your calendar. Rooms on the fifth floor need [badge access].',
    owner: 'Youssef Mansour',
    updatedDaysAgo: 260,
    tags: ['Facilities'],
  },
  {
    id: 'doc-remote-work-policy',
    type: 'document',
    title: 'Remote Work Policy',
    path: ['Policies', 'People Operations'],
    snippet:
      'Explains eligibility, core hours and equipment for remote staff. Office [badges] stay active while you work remotely.',
    owner: 'Hana Saleh',
    updatedDaysAgo: 210,
    tags: ['Policy'],
  },
  {
    id: 'doc-laptop-refresh-schedule',
    type: 'document',
    title: 'Laptop Refresh Schedule',
    path: ['IT', 'Hardware'],
    snippet:
      'Laptops older than three years are replaced in the [laptop refresh]. Bring your [badge] to collect the new device.',
    owner: 'James Whitaker',
    updatedDaysAgo: 9,
    tags: ['IT'],
  },
  {
    id: 'ticket-fac-1204',
    type: 'ticket',
    title: 'Parking permit not recognised at the barrier',
    path: ['Service Desk', 'FAC-1204'],
    snippet:
      'The barrier stopped reading my [parking permit] after it was linked to my [badge] last week.',
    owner: 'Youssef Mansour',
    updatedDaysAgo: 22,
    tags: [],
  },
  {
    id: 'person-james-whitaker',
    type: 'person',
    title: 'James Whitaker',
    path: ['People', 'IT'],
    snippet:
      'IT Support Lead. Handles the [laptop refresh], accounts and the [badge printers].',
    owner: 'James Whitaker',
    updatedDaysAgo: 4,
    tags: [],
  },
  {
    id: 'doc-acceptable-use-policy',
    type: 'document',
    title: 'Acceptable Use Policy',
    path: ['Policies', 'IT'],
    snippet:
      'Rules for company laptops, accounts and networks. Breaking the [acceptable use policy] can lead to disabled access.',
    owner: 'James Whitaker',
    updatedDaysAgo: 120,
    tags: ['Policy', 'IT'],
  },
  {
    id: 'doc-travel-expense-policy',
    type: 'document',
    title: 'Travel and Expense Policy',
    path: ['Policies', 'Finance'],
    snippet:
      'Book flights through the travel portal. The [expense policy] sets daily limits for meals and hotels.',
    owner: 'Daniel Okafor',
    updatedDaysAgo: 60,
    tags: ['Policy'],
  },
  {
    id: 'doc-data-retention-policy',
    type: 'document',
    title: 'Data Retention Policy',
    path: ['Policies', 'Legal'],
    snippet:
      'How long each kind of record is kept, and who approves deleting it early under the [retention policy].',
    owner: 'Rania Aziz',
    updatedDaysAgo: 300,
    tags: ['Policy'],
  },
  {
    id: 'project-policy-library',
    type: 'project',
    title: 'Policy Library Refresh',
    path: ['Projects', 'Legal'],
    snippet:
      'Rewriting every [policy] in plain language and moving them all into one [policy library].',
    owner: 'Rania Aziz',
    updatedDaysAgo: 45,
    tags: ['Policy'],
  },
  {
    id: 'person-rania-aziz',
    type: 'person',
    title: 'Rania Aziz',
    path: ['People', 'Legal'],
    snippet: 'Legal Counsel. Reviews every [policy] before it is published.',
    owner: 'Rania Aziz',
    updatedDaysAgo: 70,
    tags: [],
  },
  {
    id: 'ticket-sec-4650',
    type: 'ticket',
    title: 'Update the training link in the security policy',
    path: ['Service Desk', 'SEC-4650'],
    snippet:
      'The link in the [security policy] still points to last year’s [training course].',
    owner: 'Omar Haddad',
    updatedDaysAgo: 190,
    tags: [],
  },
  {
    id: 'ticket-fin-0982',
    type: 'ticket',
    title: 'Expense claim rejected for a client dinner',
    path: ['Service Desk', 'FIN-0982'],
    snippet:
      'My claim was over the meal limit in the [expense policy]. Can a manager approve it?',
    owner: 'Daniel Okafor',
    updatedDaysAgo: 50,
    tags: [],
  },
  {
    id: 'doc-board-minutes-september',
    type: 'document',
    title: 'Board Meeting Minutes, September',
    path: ['Leadership', 'Board'],
    snippet:
      'The board approved the [office move] budget and asked for a review of the [security policy].',
    owner: 'Nadia Rahman',
    updatedDaysAgo: 35,
    tags: [],
  },
  {
    id: 'doc-q4-planning-notes',
    type: 'document',
    title: 'Q4 Planning Notes',
    path: ['Leadership', 'Planning'],
    snippet:
      'Priorities for the quarter are the [office move], the [badge system upgrade] and hiring for support.',
    owner: 'Nadia Rahman',
    updatedDaysAgo: 25,
    tags: [],
  },
  {
    id: 'project-laptop-refresh',
    type: 'project',
    title: 'Laptop Refresh 2026',
    path: ['Projects', 'IT'],
    snippet:
      'Replacing 140 laptops by March. Staff book a time slot for their [laptop refresh].',
    owner: 'James Whitaker',
    updatedDaysAgo: 18,
    tags: ['IT'],
  },
  {
    id: 'ticket-it-3307',
    type: 'ticket',
    title: 'Laptop will not connect to the office Wi-Fi',
    path: ['Service Desk', 'IT-3307'],
    snippet:
      'After the [laptop refresh] my new device cannot join the [office network].',
    owner: 'James Whitaker',
    updatedDaysAgo: 2,
    tags: [],
  },
  {
    id: 'person-youssef-mansour',
    type: 'person',
    title: 'Youssef Mansour',
    path: ['People', 'Facilities'],
    snippet:
      'Facilities Manager. Looks after [parking permits], meeting rooms and the [office move].',
    owner: 'Youssef Mansour',
    updatedDaysAgo: 33,
    tags: [],
  },
  {
    id: 'person-layla-khalil',
    type: 'person',
    title: 'Layla Khalil',
    path: ['People', 'People Operations'],
    snippet:
      'People Partner. Runs [onboarding] and the [welcome session] for new starters.',
    owner: 'Layla Khalil',
    updatedDaysAgo: 8,
    tags: [],
  },
  {
    id: 'project-wellbeing',
    type: 'project',
    title: 'Employee Wellbeing Programme',
    path: ['Projects', 'People Operations'],
    snippet:
      'Monthly [wellbeing sessions], a quiet room on every floor and a new [wellbeing allowance].',
    owner: 'Hana Saleh',
    updatedDaysAgo: 130,
    tags: [],
  },
  {
    id: 'doc-holiday-calendar',
    type: 'document',
    title: 'Holiday Calendar 2026',
    path: ['Handbooks', 'People Operations'],
    snippet:
      'Public holidays for every office, and how to request [annual leave].',
    owner: 'Hana Saleh',
    updatedDaysAgo: 400,
    tags: [],
  },
  {
    id: 'project-support-hiring',
    type: 'project',
    title: 'Customer Support Hiring',
    path: ['Projects', 'Support'],
    snippet:
      'Hiring six agents for the new [support desk] in Riyadh before the end of the year.',
    owner: 'Nadia Rahman',
    updatedDaysAgo: 55,
    tags: [],
  },
];

const OWNERS = Array.from(new Set(RESULTS.map(r => r.owner))).sort();
const OWNER_OPTIONS = OWNERS.map(name => ({value: name, label: name}));

// ============= SUGGESTIONS =============

type SuggestionKind = 'typed' | 'recent' | 'suggested';
type Suggestion = SearchableItem<{kind: SuggestionKind}>;

const RECENT_SEARCHES = ['badge policy', 'laptop refresh', 'parking permit'];
const SUGGESTED_SEARCHES = [
  'badge reader',
  'replacement badge',
  'temporary badges',
  'visitor policy',
  'security policy',
  'expense policy',
  'office move',
  'onboarding',
  'welcome session',
  'annual leave',
];
const POPULAR_SEARCHES = ['badge policy', 'laptop refresh', 'office move'];

function suggestion(label: string, kind: SuggestionKind): Suggestion {
  return {id: `${kind}:${label}`, label, auxiliaryData: {kind}};
}

/**
 * The query box's source. The typed text always comes first (so Enter
 * searches exactly what was typed), then recent and suggested searches that
 * contain it. On focus with an empty box: the recent searches.
 */
const SUGGESTION_SOURCE: SearchSource<Suggestion> = {
  search(raw) {
    const text = raw.trim();
    const lower = text.toLowerCase();
    if (lower === '') {
      return RECENT_SEARCHES.map(s => suggestion(s, 'recent'));
    }
    const seen = new Set([lower]);
    const matches: Suggestion[] = [];
    for (const [list, kind] of [
      [RECENT_SEARCHES, 'recent'],
      [SUGGESTED_SEARCHES, 'suggested'],
    ] as const) {
      for (const label of list) {
        if (label.includes(lower) && !seen.has(label)) {
          seen.add(label);
          matches.push(suggestion(label, kind));
        }
      }
    }
    return [suggestion(text, 'typed'), ...matches];
  },
  bootstrap() {
    return RECENT_SEARCHES.map(s => suggestion(s, 'recent'));
  },
};

const SUGGESTION_META: Record<SuggestionKind, {icon: LucideIcon; description: string}> = {
  typed: {icon: Search, description: 'Search everything'},
  recent: {icon: Clock, description: 'Recent search'},
  suggested: {icon: Sparkles, description: 'Suggested search'},
};

function renderSuggestion(item: Suggestion) {
  const meta = SUGGESTION_META[item.auxiliaryData?.kind ?? 'suggested'];
  return (
    <TypeaheadItem
      item={item}
      icon={<Icon icon={meta.icon} size="sm" color="secondary" />}
      description={meta.description}
    />
  );
}

// ============= MATCHING =============

const STOP_WORDS = new Set(['a', 'an', 'and', 'the', 'of', 'for', 'to', 'in', 'on', 'my']);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(word => word !== '');
}

function queryWords(query: string): string[] {
  return Array.from(new Set(words(query).filter(w => !STOP_WORDS.has(w))));
}

/** A word matches a query word when it starts with it ("badge" → "badges"). */
function hasWord(haystack: string[], term: string): boolean {
  return haystack.some(word => word.startsWith(term));
}

interface SnippetPart {
  text: string;
  isPhrase: boolean;
}

/** "Wear a [company badge] on site." → plain, phrase, plain. */
function parseSnippet(snippet: string): SnippetPart[] {
  return snippet
    .split(/(\[[^\]]+\])/)
    .filter(part => part !== '')
    .map(part =>
      part.startsWith('[')
        ? {text: part.slice(1, -1), isPhrase: true}
        : {text: part, isPhrase: false},
    );
}

function snippetText(snippet: string): string {
  return snippet.replace(/[[\]]/g, '');
}

const INDEX = new Map(
  RESULTS.map(r => [
    r.id,
    {
      title: words(r.title),
      tags: words(r.tags.join(' ')),
      owner: words(r.owner),
      snippet: words(snippetText(r.snippet)),
      path: words(r.path.join(' ')),
      phrase: `${r.title} ${snippetText(r.snippet)}`.toLowerCase(),
    },
  ]),
);

/** Relevance of one record for the query words; 0 means "not a result". */
function scoreResult(result: SearchResult, terms: string[], phrase: string): number {
  const fields = INDEX.get(result.id)!;
  let score = 0;
  let matched = 0;
  for (const term of terms) {
    const hit =
      (hasWord(fields.title, term) ? 6 : 0) +
      (hasWord(fields.tags, term) ? 3 : 0) +
      (hasWord(fields.owner, term) ? 3 : 0) +
      (hasWord(fields.snippet, term) ? 2 : 0) +
      (hasWord(fields.path, term) ? 1 : 0);
    if (hit > 0) {
      matched += 1;
      score += hit;
    }
  }
  if (matched === 0) {
    return 0;
  }
  // Records with every word rank above those with some of them.
  if (matched === terms.length && terms.length > 1) {
    score += 8;
  }
  if (terms.length > 1 && fields.phrase.includes(phrase)) {
    score += 6;
  }
  return score;
}

const VOCABULARY = Array.from(
  new Set([
    ...RESULTS.flatMap(r => [
      ...words(r.title),
      ...words(snippetText(r.snippet)),
      ...words(r.tags.join(' ')),
      ...words(r.owner),
    ]),
    ...SUGGESTED_SEARCHES.flatMap(words),
  ]),
).filter(word => word.length >= 3);

function editDistance(a: string, b: string): number {
  const row = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        previous + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      previous = current;
    }
  }
  return row[b.length];
}

/**
 * The query with each unmatched word replaced by its closest word in the
 * index, or null when every word already matches (or nothing is close).
 */
function suggestCorrection(query: string): string | null {
  let changed = false;
  const corrected = words(query).map(word => {
    if (STOP_WORDS.has(word) || VOCABULARY.some(v => v.startsWith(word))) {
      return word;
    }
    const limit = word.length <= 4 ? 1 : 2;
    let best: string | null = null;
    let bestDistance = limit + 1;
    for (const candidate of VOCABULARY) {
      if (Math.abs(candidate.length - word.length) > limit) {
        continue;
      }
      const distance = editDistance(word, candidate);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
    if (best == null) {
      return word;
    }
    changed = true;
    return best;
  });
  return changed ? corrected.join(' ') : null;
}

// ============= STRINGS =============

function resultCountLabel(count: number): string {
  return count === 1 ? '1 result for' : `${count} results for`;
}

function rangeLabel(first: number, last: number, total: number): string {
  return `Showing ${first}–${last} of ${total}`;
}

function showResultsLabel(count: number): string {
  return count === 1 ? 'Show 1 result' : `Show ${count} results`;
}

// ============= STYLES =============

const facetColumn: CSSProperties = {
  width: 264,
  flexShrink: 0,
  position: 'sticky',
  insetBlockStart: 0,
  alignSelf: 'flex-start',
};

const markClass =
  'rounded-(--radius-inner) bg-(--color-background-yellow) px-(--spacing-0-5) text-(--color-text-primary) [box-decoration-break:clone]';

/** A muted panel inside the results column (Section would bleed to the page edge). */
const tipsClass =
  'rounded-(--radius-container) bg-(--color-background-muted) p-(--spacing-5)';

const typeTileClass =
  'flex size-10 shrink-0 items-center justify-center rounded-(--radius-element) bg-(--color-background-muted)';

// ============= PIECES =============

interface FacetState {
  types: string[];
  updated: Updated;
  owners: string[];
}

function FacetFields({
  facets,
  typeCounts,
  onChange,
}: {
  facets: FacetState;
  typeCounts: Record<ResultType, number>;
  onChange: (next: Partial<FacetState>) => void;
}) {
  return (
    <VStack gap={6}>
      <CheckboxList
        label="Type"
        density="compact"
        value={facets.types}
        onChange={types => onChange({types})}>
        {TYPE_ORDER.map(type => (
          <CheckboxListItem
            key={type}
            value={type}
            label={TYPE_META[type].plural}
            endContent={
              <Text type="supporting" color="secondary" hasTabularNumbers>
                {String(typeCounts[type])}
              </Text>
            }
          />
        ))}
      </CheckboxList>
      <RadioList
        label="Updated"
        size="sm"
        value={facets.updated}
        onChange={value => onChange({updated: value as Updated})}>
        {UPDATED_OPTIONS.map(option => (
          <RadioListItem key={option.value} value={option.value} label={option.label} />
        ))}
      </RadioList>
      <MultiSelector
        label="Owner"
        placeholder="Anyone"
        options={OWNER_OPTIONS}
        value={facets.owners}
        onChange={owners => onChange({owners})}
        hasClear
      />
    </VStack>
  );
}

function SnippetText({snippet, terms}: {snippet: string; terms: string[]}) {
  return (
    <Text as="p" color="secondary" maxLines={2}>
      {parseSnippet(snippet).map((part, index) => {
        const isMatch =
          part.isPhrase && terms.some(term => hasWord(words(part.text), term));
        return isMatch ? (
          <mark key={index} className={markClass}>
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        );
      })}
    </Text>
  );
}

function Dot() {
  return (
    <Text type="supporting" color="secondary" aria-hidden>
      ·
    </Text>
  );
}

function ResultRow({result, terms}: {result: SearchResult; terms: string[]}) {
  const meta = TYPE_META[result.type];
  return (
    <HStack as="li" gap={4} vAlign="start" paddingBlock={5}>
      {result.type === 'person' ? (
        <Avatar name={result.title} size={40} tooltip={false} />
      ) : (
        <span className={typeTileClass} aria-hidden>
          <Icon icon={meta.icon} size="md" color="secondary" />
        </span>
      )}
      <StackItem size="fill">
        <VStack gap={1.5}>
          <HStack gap={1.5} vAlign="center" wrap="wrap">
            {result.path.map((segment, index) => (
              <HStack key={segment} gap={1.5} vAlign="center">
                {index > 0 && (
                  <Text type="supporting" color="secondary" aria-hidden>
                    /
                  </Text>
                )}
                <Text type="supporting" color="secondary">
                  {segment}
                </Text>
              </HStack>
            ))}
          </HStack>
          <Heading level={3}>
            <Link href="#" weight="semibold" color="accent">
              {result.title}
            </Link>
          </Heading>
          <SnippetText snippet={result.snippet} terms={terms} />
          <HStack gap={2} vAlign="center" wrap="wrap" paddingBlockStart={0.5}>
            <Text type="supporting" color="secondary">
              {meta.singular}
            </Text>
            {result.type !== 'person' && (
              <>
                <Dot />
                <HStack gap={1.5} vAlign="center">
                  <Avatar name={result.owner} size={16} tooltip={false} />
                  <Text type="supporting" color="secondary">
                    {result.owner}
                  </Text>
                </HStack>
              </>
            )}
            <Dot />
            <HStack gap={1} vAlign="center">
              <Text type="supporting" color="secondary">
                Updated
              </Text>
              <Timestamp value={TODAY - result.updatedDaysAgo * DAY} format="date" />
            </HStack>
            {(result.status != null || result.tags.length > 0) && (
              <HStack gap={1.5} vAlign="center" wrap="wrap">
                {result.status != null && (
                  <Badge variant={result.status.variant} label={result.status.label} />
                )}
                {result.tags.map(tag => (
                  <Badge key={tag} variant={TAG_COLOR[tag] ?? 'neutral'} label={tag} />
                ))}
              </HStack>
            )}
          </HStack>
        </VStack>
      </StackItem>
    </HStack>
  );
}

const SEARCH_TIPS = [
  'Check the spelling of each word.',
  'Use fewer or more general words.',
  'Search for a document title, a person or a ticket number.',
  'Remove filters to search everything.',
];

function SearchTips() {
  return (
    <div className={tipsClass}>
      <List
        listStyle="disc"
        density="compact"
        header={<Heading level={3}>Search tips</Heading>}>
        {SEARCH_TIPS.map(tip => (
          <ListItem key={tip} label={tip} />
        ))}
      </List>
    </div>
  );
}

// ============= PAGE =============

const NO_FACETS: FacetState = {types: [], updated: 'any', owners: []};

export default function ContentSearchTemplate() {
  const isWide = useMediaQuery(WIDE_QUERY);

  // `selected` is what the box shows as a token, `draft` what is typed in it,
  // `query` what was last submitted. Only `query` drives the results.
  const [selected, setSelected] = useState<Suggestion | null>(() =>
    suggestion(INITIAL_QUERY, 'recent'),
  );
  const [draft, setDraft] = useState(INITIAL_QUERY);
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [facets, setFacets] = useState<FacetState>(NO_FACETS);
  const [sort, setSort] = useState<Sort>('relevance');
  const [page, setPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const resultsTopRef = useRef<HTMLElement>(null);

  // A new page starts at the top of the results, not where the pager was.
  const goToPage = (next: number) => {
    setPage(next);
    requestAnimationFrame(() => resultsTopRef.current?.scrollIntoView({block: 'start'}));
  };

  const runSearch = (text: string) => {
    const next = text.trim();
    setQuery(next);
    setDraft(next);
    setSelected(next === '' ? null : suggestion(next, 'typed'));
    setPage(1);
  };

  const updateFacets = (next: Partial<FacetState>) => {
    setFacets(current => ({...current, ...next}));
    setPage(1);
  };

  const clearFacets = () => updateFacets(NO_FACETS);

  // ----- Query → scored matches → facets → sort → page -----
  const terms = useMemo(() => queryWords(query), [query]);

  const matches = useMemo(() => {
    if (terms.length === 0) {
      return [];
    }
    const phrase = query.trim().toLowerCase();
    return RESULTS.map(result => ({result, score: scoreResult(result, terms, phrase)})).filter(
      m => m.score > 0,
    );
  }, [query, terms]);

  const maxDays = UPDATED_OPTIONS.find(o => o.value === facets.updated)!.maxDays;
  const passesUpdated = (r: SearchResult) => r.updatedDaysAgo <= maxDays;
  const passesOwner = (r: SearchResult) =>
    facets.owners.length === 0 || facets.owners.includes(r.owner);
  const passesType = (r: SearchResult) =>
    facets.types.length === 0 || facets.types.includes(r.type);

  // Each Type count applies every filter except Type itself.
  const typeCounts = {document: 0, person: 0, project: 0, ticket: 0};
  for (const {result} of matches) {
    if (passesUpdated(result) && passesOwner(result)) {
      typeCounts[result.type] += 1;
    }
  }

  const visible = matches
    .filter(({result}) => passesType(result) && passesUpdated(result) && passesOwner(result))
    .sort((a, b) => {
      if (sort === 'newest') {
        return a.result.updatedDaysAgo - b.result.updatedDaysAgo;
      }
      if (sort === 'oldest') {
        return b.result.updatedDaysAgo - a.result.updatedDaysAgo;
      }
      return b.score - a.score || a.result.updatedDaysAgo - b.result.updatedDaysAgo;
    })
    .map(m => m.result);

  const total = visible.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const sliceStart = (currentPage - 1) * PAGE_SIZE;
  const pageResults = visible.slice(sliceStart, sliceStart + PAGE_SIZE);
  const correction = query === '' ? null : suggestCorrection(query);

  const hasFacets =
    facets.types.length > 0 || facets.updated !== 'any' || facets.owners.length > 0;

  // ----- Active filters, repeated as removable tokens -----
  const activeTokens: {key: string; label: string; onRemove: () => void}[] = [
    ...facets.types.map(type => ({
      key: `type-${type}`,
      label: TYPE_META[type as ResultType].plural,
      onRemove: () => updateFacets({types: facets.types.filter(t => t !== type)}),
    })),
    ...(facets.updated === 'any'
      ? []
      : [
          {
            key: 'updated',
            label: UPDATED_OPTIONS.find(o => o.value === facets.updated)!.label,
            onRemove: () => updateFacets({updated: 'any'}),
          },
        ]),
    ...facets.owners.map(owner => ({
      key: `owner-${owner}`,
      label: owner,
      onRemove: () => updateFacets({owners: facets.owners.filter(o => o !== owner)}),
    })),
  ];

  // ----- Regions -----
  const searchForm = (
    <form
      role="search"
      aria-label={`Search ${COMPANY}`}
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        runSearch(draft);
      }}>
      <HStack gap={2} vAlign="center">
        <StackItem size="fill">
          <Typeahead<Suggestion>
            label={`Search ${COMPANY}`}
            isLabelHidden
            size="lg"
            placeholder="Search documents, people, projects and tickets"
            startIcon={<Icon icon={Search} size="sm" />}
            searchSource={SUGGESTION_SOURCE}
            value={selected}
            hasEntriesOnFocus
            debounceMs={0}
            maxMenuItems={8}
            renderItem={renderSuggestion}
            onChangeQuery={setDraft}
            onChange={item => {
              if (item == null) {
                setSelected(null);
                setDraft('');
                setQuery('');
                setPage(1);
                return;
              }
              runSearch(item.label);
            }}
          />
        </StackItem>
        <Button label="Search" variant="primary" size="lg" type="submit" />
      </HStack>
    </form>
  );

  const didYouMean = (text: string) => (
    <Text as="p" color="secondary">
      <span>Did you mean</span>{' '}
      <Link
        href={`?q=${encodeURIComponent(text)}`}
        onClick={event => {
          event.preventDefault();
          runSearch(text);
        }}
        weight="semibold"
        color="accent">
        {text}
      </Link>
      <span>?</span>
    </Text>
  );

  const sortSelector = (
    <Selector
      label="Sort results"
      isLabelHidden
      variant="ghost"
      width={168}
      startIcon={<Icon icon={ArrowUpDown} size="sm" />}
      options={SORT_OPTIONS}
      value={sort}
      onChange={value => {
        setSort(value as Sort);
        setPage(1);
      }}
    />
  );

  const filtersButton = (
    <Button
      label="Filters"
      variant="secondary"
      icon={<Icon icon={SlidersHorizontal} size="sm" />}
      onClick={() => setIsSheetOpen(true)}
    />
  );

  const facetPanel = (
    <VStack gap={5}>
      <HStack gap={2} hAlign="between" vAlign="center">
        <Heading level={2}>Filters</Heading>
        <Button
          label="Clear filters"
          variant="ghost"
          size="sm"
          isDisabled={!hasFacets}
          onClick={clearFacets}
        />
      </HStack>
      <FacetFields facets={facets} typeCounts={typeCounts} onChange={updateFacets} />
    </VStack>
  );

  let body: ReactNode;
  if (query === '') {
    body = (
      <EmptyState
        title={`Search ${COMPANY}`}
        description="Find documents, people, projects and tickets. Start with a popular search:"
        icon={<Icon icon={Search} size="lg" />}
        actions={POPULAR_SEARCHES.map(text => (
          <Button key={text} label={text} variant="secondary" onClick={() => runSearch(text)} />
        ))}
      />
    );
  } else if (matches.length === 0) {
    body = (
      <VStack gap={4}>
        <EmptyState
          title="No results found"
          description={`Nothing in ${COMPANY} matches this search. Check the spelling, or try the tips below.`}
          icon={<Icon icon={Search} size="lg" />}
          actions={
            <>
              {correction != null && (
                <Button
                  label="Try the suggested spelling"
                  variant="primary"
                  onClick={() => runSearch(correction)}
                />
              )}
              <Button label="Clear search" variant="secondary" onClick={() => runSearch('')} />
            </>
          }
        />
        <SearchTips />
      </VStack>
    );
  } else if (total === 0) {
    body = (
      <EmptyState
        title="No results match these filters"
        description="This search has results, but none of them match the filters you picked. Remove a filter to see them."
        icon={<Icon icon={SlidersHorizontal} size="lg" />}
        actions={<Button label="Clear filters" variant="secondary" onClick={clearFacets} />}
      />
    );
  } else {
    body = (
      <VStack gap={4}>
        <VStack as="ol" gap={0} aria-label="Search results">
          {pageResults.map((result, index) => (
            <VStack key={result.id} gap={0}>
              {index > 0 && <Divider />}
              <ResultRow result={result} terms={terms} />
            </VStack>
          ))}
        </VStack>
        <Divider />
        <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap">
          <Text type="supporting" color="secondary">
            {rangeLabel(sliceStart + 1, Math.min(sliceStart + PAGE_SIZE, total), total)}
          </Text>
          {pageCount > 1 && (
            <Pagination
              page={currentPage}
              onChange={goToPage}
              totalItems={total}
              pageSize={PAGE_SIZE}
              label="Result pages"
            />
          )}
        </HStack>
      </VStack>
    );
  }

  const resultsColumn = (
    <VStack gap={4} ref={resultsTopRef}>
      {query !== '' && (
        <VStack gap={2}>
          <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap">
            <Heading level={2} aria-live="polite">
              <span>{resultCountLabel(total)}</span> <q>{query}</q>
            </Heading>
            <HStack gap={2} vAlign="center">
              {!isWide && filtersButton}
              {total > 1 && sortSelector}
            </HStack>
          </HStack>
          {correction != null && didYouMean(correction)}
        </VStack>
      )}
      {query === '' && !isWide && <HStack hAlign="end">{filtersButton}</HStack>}
      {activeTokens.length > 0 && (
        <HStack gap={2} vAlign="center" wrap="wrap">
          {activeTokens.map(token => (
            <Token key={token.key} label={token.label} onRemove={token.onRemove} />
          ))}
          <Button label="Clear filters" variant="ghost" size="sm" onClick={clearFacets} />
        </HStack>
      )}
      {body}
    </VStack>
  );

  return (
    <Layout
      height="fill"
      padding={isWide ? 6 : 4}
      contentWidth={1200}
      content={
        <LayoutContent>
          <VStack gap={isWide ? 8 : 6} paddingBlockEnd={10}>
            <VStack gap={4}>
              <VStack gap={1}>
                <Heading level={1}>Search</Heading>
                <Text color="secondary">
                  Documents, people, projects and tickets across Meridian Works.
                </Text>
              </VStack>
              {searchForm}
            </VStack>
            <Stack direction="horizontal" gap={10} vAlign="start">
              {isWide && (
                <StackItem style={facetColumn} as="aside" aria-label="Filters">
                  {facetPanel}
                </StackItem>
              )}
              <StackItem size="fill">{resultsColumn}</StackItem>
            </Stack>
          </VStack>

          {!isWide && (
            <BottomSheet
              isOpen={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              label="Filters"
              height="hug">
              <VStack gap={5} padding={4}>
                {facetPanel}
                <Button
                  label={showResultsLabel(total)}
                  variant="primary"
                  onClick={() => setIsSheetOpen(false)}
                />
              </VStack>
            </BottomSheet>
          )}
        </LayoutContent>
      }
    />
  );
}
