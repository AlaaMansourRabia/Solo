'use client';

/**
 * A help-center article read top to bottom: breadcrumbs back to the help
 * center, a title and one-paragraph summary, the author and the last-updated
 * date, then eight sections of prose with the furniture a real knowledge-base
 * article needs — a figure, a reference table, numbered steps, a warning, a
 * quoted policy, an API example and numbered source notes. A sticky table of
 * contents follows the reader down the end side, and the article closes with
 * "Was this helpful?", related articles and a way to reach support.
 *
 * What picks this template over the Documentation templates is that the page
 * is one article, not a docs site. `documentation` and `documentation-design`
 * are catalogs a reader browses (a side navigation of many pages, component
 * previews, prop tables); `documentation-technical` is a linear setup
 * walkthrough whose every section is a code step. Here most readers are not
 * developers and arrive from a search box with one question ("how do I get a
 * badge for a new hire?"), so the page is optimized for reading: a narrow
 * measure, generous line height, a table of contents that says where the
 * answer is, and trust signals (who wrote it, when it was last checked, where
 * the policy comes from) that tell the reader whether to believe it.
 *
 * The same shape fits any long-form article that ends in "did this answer
 * your question?": product help, HR and IT policy pages, internal runbooks
 * written for non-specialists, release explainers, a changelog post. Swap the
 * fixture (`ARTICLE`, `SECTIONS`, `BADGE_TYPES`, `REFERENCES`, `RELATED`) and
 * keep the structure.
 *
 * ## Extending this template
 *
 * **One list feeds the headings and the table of contents.** `SECTIONS` holds
 * every section's id and title; the headings render from it and the Outline
 * items are derived from it. Renaming a section in one place and forgetting
 * the other is the classic help-center bug — a TOC entry that scrolls nowhere.
 * When the body comes from a CMS as Markdown, replace `SECTIONS` with
 * `useOutlineFromMarkdown` (or `useOutlineFromDOM`) instead of hand-writing
 * the list.
 *
 * **The Outline tracks the scroll container it is given.** The article
 * scrolls inside `LayoutContent`, not the window, so the Outline receives
 * `scrollContainerRef` and highlights the section currently under the top of
 * that container. If you move the page into an AppShell that scrolls the
 * window instead, drop the ref and let Outline auto-detect; if a fixed header
 * overlays the content, pass its height as `offset`.
 *
 * **The reading measure is a hard limit, not a suggestion.** The article
 * column is capped at `ARTICLE_MEASURE` (about 70 characters per line). Wide
 * screens get more margin, never longer lines. Below `WIDE_QUERY` the table
 * of contents moves from the sticky end column to a Selector above the body,
 * because a sidebar squeezed to 160px truncates every entry.
 *
 * **Callouts have one meaning each.** The warning about sharing badges is a
 * Banner (status `warning`, not dismissable — a reader must not be able to
 * hide a security rule). The access policy is a Blockquote with its source
 * in `cite`, because it is a quotation from another document, not advice
 * from this one. Do not use Blockquote for tips or Banner for quotes.
 *
 * **Trust signals are data, not decoration.** The author, the updated date
 * and the numbered source notes come from the fixture. The date is formatted
 * with the active locale (`Intl.DateTimeFormat`), so Arabic gets its own
 * month names and word order. Inline Citations use the `number` variant, one
 * style per paragraph, and each number matches an entry in the References
 * list at the end of the article.
 *
 * **Feedback is a single choice that can be changed.** Yes / No is a
 * single-select ToggleButtonGroup, so the current answer stays visible and
 * a second click changes it instead of submitting twice. Each change sends
 * one Toast; in a real app post `{articleId, helpful}` and, on "No", offer a
 * short optional comment field rather than a required form.
 *
 * **Code stays code.** Inline identifiers (`badge.status`) use Code and the
 * API example uses CodeBlock; both are skipped by translation, so the
 * Arabic article keeps the exact field names and request body.
 */

import {useCallback, useRef, useState, type CSSProperties} from 'react';
import {Avatar} from '@solo/core/Avatar';
import {Badge} from '@solo/core/Badge';
import {Banner} from '@solo/core/Banner';
import {Blockquote} from '@solo/core/Blockquote';
import {Breadcrumbs, BreadcrumbItem} from '@solo/core/Breadcrumbs';
import {Card} from '@solo/core/Card';
import {Citation, type CitationSource} from '@solo/core/Citation';
import {Code} from '@solo/core/Code';
import {CodeBlock} from '@solo/core/CodeBlock';
import {Divider} from '@solo/core/Divider';
import {Heading} from '@solo/core/Heading';
import {Icon} from '@solo/core/Icon';
import {Layout, LayoutContent} from '@solo/core/Layout';
import {Link} from '@solo/core/Link';
import {List, ListItem} from '@solo/core/List';
import {Outline, type OutlineItem} from '@solo/core/Outline';
import {Selector} from '@solo/core/Selector';
import {HStack, StackItem, VStack} from '@solo/core/Stack';
import {Table, proportional, type TableColumn} from '@solo/core/Table';
import {Text} from '@solo/core/Text';
import {ToggleButton, ToggleButtonGroup} from '@solo/core/ToggleButton';
import {useToast} from '@solo/core/Toast';
import {useMediaQuery} from '@solo/core/hooks';
import {useLocale} from '@solo/core/i18n';
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  DocumentTextIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import {templateAsset} from '../assets';

// ── Data ──────────────────────────────────────────────────────────────────────

const ARTICLE = {
  title: 'How site access badges work',
  summary:
    'Every person who enters a Northwind office carries a badge that opens the doors they need, during the hours they need them, and nothing else. This article explains the badge types, how to request one for a new hire, and what to do when a badge is lost.',
  author: 'Lina Haddad',
  authorRole: 'Workplace Security',
  // A fixed date keeps the mock deterministic.
  updated: new Date(Date.UTC(2026, 8, 14, 9, 0)),
  readingTime: '7 min read',
  category: 'Site access',
};

interface ArticleSection {
  id: string;
  title: string;
}

const SECTIONS: ArticleSection[] = [
  {id: 'what-a-badge-does', title: 'What a badge does'},
  {id: 'badge-types', title: 'Badge types'},
  {id: 'request-a-badge', title: 'Request a badge for a new hire'},
  {id: 'activate-and-collect', title: 'Activate and collect the badge'},
  {id: 'visitors-and-contractors', title: 'Visitors and contractors'},
  {id: 'lost-or-stolen', title: 'Lost or stolen badges'},
  {id: 'access-api', title: 'Use the Access API'},
  {id: 'troubleshooting', title: 'Troubleshooting'},
];

const OUTLINE_ITEMS: OutlineItem[] = SECTIONS.map(section => ({
  id: section.id,
  label: section.title,
  level: 2,
}));

const OUTLINE_OPTIONS = SECTIONS.map(section => ({
  value: section.id,
  label: section.title,
}));

const SECTION_TITLE = Object.fromEntries(
  SECTIONS.map(section => [section.id, section.title]),
) as Record<string, string>;

type BadgeType = {
  id: string;
  type: string;
  holder: string;
  hours: string;
  expires: string;
};

const BADGE_TYPES: BadgeType[] = [
  {
    id: 'employee',
    type: 'Employee',
    holder: 'Full-time and part-time staff',
    hours: 'Around the clock',
    expires: 'Every 2 years',
  },
  {
    id: 'contractor',
    type: 'Contractor',
    holder: 'Contractors with a signed agreement',
    hours: '7:00 to 20:00, weekdays',
    expires: 'End of contract',
  },
  {
    id: 'visitor',
    type: 'Visitor',
    holder: 'Guests signed in at reception',
    hours: 'Office hours only',
    expires: 'Same day',
  },
  {
    id: 'restricted',
    type: 'Restricted area',
    holder: 'Staff approved for labs and server rooms',
    hours: 'As approved',
    expires: 'Every 6 months',
  },
];

const BADGE_COLUMNS: TableColumn<BadgeType>[] = [
  {key: 'type', header: 'Badge', width: proportional(1, {minWidth: 120})},
  {key: 'holder', header: 'Who gets it', width: proportional(2, {minWidth: 180})},
  {key: 'hours', header: 'Door access', width: proportional(1.5, {minWidth: 140})},
  {key: 'expires', header: 'Renewal', width: proportional(1, {minWidth: 120})},
];

const REQUEST_STEPS = [
  {
    label: 'Open the new hire’s profile',
    description:
      'In the admin console, go to People and select the person. Their start date must be set before a badge can be requested.',
  },
  {
    label: 'Choose a badge type and home site',
    description:
      'Pick the badge type from the table above and the office they will work from. Access to other sites is added later, per request.',
  },
  {
    label: 'Add door groups',
    description:
      'Start with the default group for their team. Add restricted areas only when their manager has approved them in writing.',
  },
  {
    label: 'Upload a photo',
    description:
      'A recent, front-facing photo on a plain background. Reception compares it with a photo ID on the first day.',
  },
  {
    label: 'Submit for approval',
    description:
      'The request goes to the site’s security lead. Most requests are approved within one working day.',
  },
];

const TROUBLESHOOTING = [
  {
    label: 'The reader flashes red',
    description:
      'The badge is active but this door is not in its door groups. Ask your manager to request the group.',
  },
  {
    label: 'Nothing happens at the reader',
    description:
      'Hold the badge flat against the reader for two seconds. Phone cases with metal plates block the signal.',
  },
  {
    label: 'The badge worked yesterday',
    description:
      'Check the renewal date on the back. Expired badges stop working at midnight on that day.',
  },
];

const REFERENCES: (CitationSource & {number: number; publisher: string})[] = [
  {
    number: 1,
    title: 'Physical access control standard, v4.2',
    publisher: 'Northwind Security Office',
    url: 'https://help.example.com/policies/physical-access',
  },
  {
    number: 2,
    title: 'Visitor management procedure',
    publisher: 'Northwind Workplace Operations',
    url: 'https://help.example.com/policies/visitors',
  },
  {
    number: 3,
    title: 'Incident reporting guide',
    publisher: 'Northwind Security Office',
    url: 'https://help.example.com/security/incidents',
  },
];

const RELATED = [
  {
    title: 'Book a desk or meeting room',
    description: 'Reserve space at any Northwind office before you arrive.',
  },
  {
    title: 'Invite a visitor to the office',
    description: 'Pre-register guests so their badge is printed when they arrive.',
  },
  {
    title: 'Request access to a restricted area',
    description: 'Labs, server rooms and storage: who approves and how long it takes.',
  },
];

const API_EXAMPLE = `curl -X POST https://api.northwind.example/v2/badges \\
  -H "Authorization: Bearer $ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "person_id": "per_48213",
    "badge_type": "employee",
    "site_id": "site_dxb_01",
    "door_groups": ["dg_floor_4", "dg_lobby"],
    "valid_from": "2026-10-01"
  }'`;

const ARTICLE_MEASURE = 720;
const TOC_WIDTH = 240;
const WIDE_QUERY = '(min-width: 1080px)';

// ── Styles ────────────────────────────────────────────────────────────────────

const page: CSSProperties = {
  maxWidth: ARTICLE_MEASURE + TOC_WIDTH + 96,
  marginInline: 'auto',
  paddingInline: 'var(--spacing-8)',
  paddingBlock: 'var(--spacing-8) var(--spacing-10)',
};

const articleColumn: CSSProperties = {
  maxWidth: ARTICLE_MEASURE,
  minWidth: 0,
};

const tocColumn: CSSProperties = {
  position: 'sticky',
  insetBlockStart: 'var(--spacing-6)',
  alignSelf: 'flex-start',
  width: TOC_WIDTH,
  flexShrink: 0,
};

const figureImage: CSSProperties = {
  display: 'block',
  width: '100%',
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  borderRadius: 'var(--radius-container)',
};

const headingAnchor: CSSProperties = {
  scrollMarginBlockStart: 'var(--spacing-6)',
};

// ── Pieces ────────────────────────────────────────────────────────────────────

function Paragraph({children}: {children: React.ReactNode}) {
  return (
    <Text as="p" type="body" className="leading-[1.7]">
      {children}
    </Text>
  );
}

/** A list item description that wraps instead of ellipsizing. */
function Description({children}: {children: string}) {
  return (
    <Text type="supporting" color="secondary">
      {children}
    </Text>
  );
}

function SectionHeading({id}: {id: string}) {
  return (
    <Heading id={id} level={2} style={headingAnchor}>
      {SECTION_TITLE[id]}
    </Heading>
  );
}

function Note({n}: {n: number}) {
  const source = REFERENCES.find(ref => ref.number === n)!;
  // Baseline-aligned so the pill does not open up the paragraph's line box.
  return (
    <Citation
      variant="number"
      number={n}
      source={source}
      className="align-baseline"
    />
  );
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function ContentArticleTemplate() {
  const locale = useLocale();
  const showToast = useToast();
  const isWide = useMediaQuery(WIDE_QUERY);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>(SECTIONS[0]!.id);
  const [helpful, setHelpful] = useState<string | null>(null);

  const updated = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(ARTICLE.updated);

  const jumpTo = useCallback((id: string) => {
    setActiveId(id);
    document
      .getElementById(id)
      ?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }, []);

  const onFeedback = useCallback(
    (value: string | null) => {
      setHelpful(value);
      if (value === 'yes') {
        showToast({body: 'Thanks — glad it helped.', uniqueID: 'feedback'});
      } else if (value === 'no') {
        showToast({
          body: 'Thanks for telling us. We’ll improve this article.',
          uniqueID: 'feedback',
        });
      }
    },
    [showToast],
  );

  const header = (
    <VStack gap={4}>
      <Breadcrumbs variant="supporting" label="Breadcrumb">
        <BreadcrumbItem href="#">Help center</BreadcrumbItem>
        <BreadcrumbItem href="#">Site access</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Badges</BreadcrumbItem>
      </Breadcrumbs>
      <VStack gap={3}>
        <HStack gap={2} vAlign="center">
          <Badge variant="blue" label={ARTICLE.category} />
          <Badge variant="neutral" label="For admins and managers" />
        </HStack>
        <Heading id="article-title" level={1} type="display-2">
          {ARTICLE.title}
        </Heading>
        <Text as="p" type="large" color="secondary" className="leading-[1.6]">
          {ARTICLE.summary}
        </Text>
      </VStack>
      <HStack gap={3} vAlign="center" wrap="wrap">
        <Avatar name={ARTICLE.author} size="md" />
        <StackItem size="fill">
          <VStack gap={0.5}>
            <Text type="label" weight="semibold">
              {ARTICLE.author}
            </Text>
            <Text type="supporting" color="secondary">
              {ARTICLE.authorRole}
            </Text>
          </VStack>
        </StackItem>
        <HStack gap={4} vAlign="center" wrap="wrap">
          <HStack gap={1.5} vAlign="center">
            <Icon icon={DocumentTextIcon} size="sm" color="secondary" />
            <Text type="supporting" color="secondary">
              Updated
            </Text>
            <Text type="supporting" color="secondary">
              <time dateTime="2026-09-14">{updated}</time>
            </Text>
          </HStack>
          <HStack gap={1.5} vAlign="center">
            <Icon icon={ClockIcon} size="sm" color="secondary" />
            <Text type="supporting" color="secondary">
              {ARTICLE.readingTime}
            </Text>
          </HStack>
        </HStack>
      </HStack>
    </VStack>
  );

  const body = (
    <VStack gap={10}>
      {/* 1 — What a badge does */}
      <VStack gap={4}>
        <SectionHeading id="what-a-badge-does" />
        <Paragraph>
          A site access badge is a contactless card linked to one person. When
          it is held against a reader, the door checks three things: that the
          badge is active, that the door belongs to one of the badge’s door
          groups, and that the current time falls inside the badge’s access
          hours. If all three pass, the door unlocks and the entry is logged.
        </Paragraph>
        <Paragraph>
          Badges are issued per person, never per team, so that every entry
          can be traced to someone. The security office keeps entry logs for
          90 days. <Note n={1} />
        </Paragraph>
        <figure className="m-0 flex flex-col gap-(--spacing-2)">
          <img
            src={templateAsset('light-working-horizontal-3.png')}
            alt="A team meeting around a table in a Northwind office"
            style={figureImage}
          />
          <figcaption>
            <Text type="supporting" color="secondary">
              Team spaces on every floor open with the default door group for
              that team.
            </Text>
          </figcaption>
        </figure>
      </VStack>

      {/* 2 — Badge types */}
      <VStack gap={4}>
        <SectionHeading id="badge-types" />
        <Paragraph>
          There are four badge types. The type decides the default access
          hours and how often the badge must be renewed; the door groups
          decide which doors it opens.
        </Paragraph>
        <Card padding={0}>
          <Table
            data={BADGE_TYPES}
            columns={BADGE_COLUMNS}
            idKey="id"
            density="balanced"
            aria-label="Badge types"
          />
        </Card>
      </VStack>

      {/* 3 — Request a badge */}
      <VStack gap={4}>
        <SectionHeading id="request-a-badge" />
        <Paragraph>
          Managers and workplace admins can request a badge up to 30 days
          before a new hire’s start date. Requesting early means the badge is
          printed and waiting at reception on their first morning.
        </Paragraph>
        <List listStyle="decimal" density="spacious">
          {REQUEST_STEPS.map(step => (
            <ListItem
              key={step.label}
              label={
                <Text type="body" weight="semibold">
                  {step.label}
                </Text>
              }
              description={<Description>{step.description}</Description>}
            />
          ))}
        </List>
      </VStack>

      {/* 4 — Activate and collect */}
      <VStack gap={4}>
        <SectionHeading id="activate-and-collect" />
        <Paragraph>
          An approved badge is printed overnight and stays inactive until its
          holder collects it. At reception, they show a photo ID, sign the
          access agreement and tap the badge on the desk reader. Only then does
          it start opening doors.
        </Paragraph>
        <Banner
          status="warning"
          title="Warning: never lend your badge"
          description="Each entry is recorded against the badge holder. Lending a badge, or holding a door open for someone without one, breaks the access agreement and can lead to the badge being withdrawn."
          collapsible={false}
        />
      </VStack>

      {/* 5 — Visitors and contractors */}
      <VStack gap={4}>
        <SectionHeading id="visitors-and-contractors" />
        <Paragraph>
          Visitors do not need a request from you. Invite them ahead of time
          and reception prints a same-day badge when they sign in. Contractors
          are different: they work on site for weeks or months, so they get a
          contractor badge through the same request flow as staff, limited to
          weekday hours. <Note n={2} />
        </Paragraph>
        <Blockquote cite="Physical access control standard, section 3.1">
          Every person on site must wear a valid badge where it can be seen.
          A visitor stays with their host at all times outside reception and
          meeting rooms.
        </Blockquote>
      </VStack>

      {/* 6 — Lost or stolen */}
      <VStack gap={4}>
        <SectionHeading id="lost-or-stolen" />
        <Paragraph>
          Report a lost or stolen badge as soon as you notice, even outside
          working hours. The security desk deactivates it within minutes, so a
          found badge cannot open anything. <Note n={3} />
        </Paragraph>
        <Paragraph>
          A replacement keeps the same door groups and renewal date. You can
          collect it from reception the next working day; until then,
          reception issues a temporary badge for the day.
        </Paragraph>
      </VStack>

      {/* 7 — Access API */}
      <VStack gap={4}>
        <SectionHeading id="access-api" />
        <Paragraph>
          Teams that onboard many people at once can create requests from
          their HR system with the Access API. Each request returns a badge
          record, and its <Code size="inherit">status</Code> field moves
          through three values in order: <Code size="inherit">pending</Code>
          {', '}
          <Code size="inherit">approved</Code>
          {', '}
          <Code size="inherit">active</Code>
          {'.'}
        </Paragraph>
        <CodeBlock
          code={API_EXAMPLE}
          language="bash"
          title="Create a badge request"
          width="100%"
          hasLineNumbers
        />
        <Paragraph>
          Requests created through the API go through the same approval as
          requests made in the admin console. The token must include the{' '}
          <Code size="inherit">badges:write</Code> scope.
        </Paragraph>
      </VStack>

      {/* 8 — Troubleshooting */}
      <VStack gap={4}>
        <SectionHeading id="troubleshooting" />
        <Paragraph>
          Most badge problems have one of three causes. Check these before
          contacting support.
        </Paragraph>
        <List listStyle="disc" density="balanced">
          {TROUBLESHOOTING.map(item => (
            <ListItem
              key={item.label}
              label={
                <Text type="body" weight="semibold">
                  {item.label}
                </Text>
              }
              description={<Description>{item.description}</Description>}
            />
          ))}
        </List>
      </VStack>

      {/* References */}
      <VStack gap={3}>
        <Divider />
        <Heading level={2}>
          References
        </Heading>
        <VStack as="ol" gap={2}>
          {REFERENCES.map(ref => (
            <HStack as="li" key={ref.number} gap={2} vAlign="start">
              <Citation variant="number" number={ref.number} source={ref} />
              <VStack gap={0.5}>
                <Text type="supporting">{ref.title}</Text>
                <Text type="supporting" color="secondary">
                  {ref.publisher}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </VStack>
  );

  const footer = (
    <VStack gap={8}>
      <Card variant="muted" padding={5}>
        <HStack gap={4} vAlign="center" wrap="wrap">
          <StackItem size="fill">
            <VStack gap={1}>
              <Text type="body" weight="semibold">
                Was this article helpful?
              </Text>
              <Text type="supporting" color="secondary">
                {helpful == null
                  ? 'Your answer helps us decide what to rewrite next.'
                  : 'Thanks for your feedback. You can change your answer.'}
              </Text>
            </VStack>
          </StackItem>
          <ToggleButtonGroup
            label="Was this article helpful?"
            value={helpful}
            onChange={onFeedback}>
            <ToggleButton
              value="yes"
              label="Yes"
              icon={<Icon icon={HandThumbUpIcon} size="sm" />}
            />
            <ToggleButton
              value="no"
              label="No"
              icon={<Icon icon={HandThumbDownIcon} size="sm" />}
            />
          </ToggleButtonGroup>
        </HStack>
      </Card>

      <VStack gap={3}>
        <Heading level={2}>
          Related articles
        </Heading>
        <List hasDividers edgeCompensation="inline">
          {RELATED.map(article => (
            <ListItem
              key={article.title}
              href="#"
              label={article.title}
              description={<Description>{article.description}</Description>}
            />
          ))}
        </List>
      </VStack>

      <HStack gap={3} vAlign="center">
        <Icon icon={ChatBubbleLeftRightIcon} size="md" color="secondary" />
        <Text type="body" color="secondary">
          Still stuck?
        </Text>
        <Link href="#" isStandalone weight="semibold">
          Contact support
        </Link>
      </HStack>
    </VStack>
  );

  const toc = (
    <VStack gap={3} style={tocColumn}>
      <Text type="label" weight="semibold" color="secondary">
        On this page
      </Text>
      <Outline
        items={OUTLINE_ITEMS}
        label="On this page"
        scrollContainerRef={scrollRef}
        onActiveIdChange={setActiveId}
      />
      <Divider />
      <VStack gap={1}>
        <Text type="supporting" color="secondary">
          Can’t find your answer?
        </Text>
        <Link href="#" type="supporting" weight="semibold">
          Contact support
        </Link>
      </VStack>
    </VStack>
  );

  return (
    <Layout
      height="fill"
      content={
        <LayoutContent ref={scrollRef} padding={0}>
          <article style={page} aria-labelledby="article-title">
            <HStack gap={10} vAlign="start">
              <StackItem size="fill" style={articleColumn}>
                <VStack gap={10}>
                  {header}
                  {!isWide && (
                    <Selector
                      label="On this page"
                      options={OUTLINE_OPTIONS}
                      value={activeId}
                      onChange={jumpTo}
                      width="100%"
                    />
                  )}
                  <Divider />
                  {body}
                  <Divider />
                  {footer}
                </VStack>
              </StackItem>
              {isWide && toc}
            </HStack>
          </article>
        </LayoutContent>
      }
    />
  );
}
