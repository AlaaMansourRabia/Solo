'use client';

/**
 * Site Operations Dashboard — a construction site manager's live view of one
 * active job site, kept open on a tablet or the site-office screen all shift.
 *
 * What picks this template over the other dashboards: it is operational, not
 * analytical. Every number answers "what is happening on site right now, this
 * shift?" — who is on site against plan, which zones are full, which alerts
 * still need someone to walk over. The charts only look back as far as a site
 * manager actually plans: today by the hour, this week by the day, the last
 * two weeks of safety events. `dashboard` is the version for broad analytics
 * over long ranges, `dashboard-alert-rail` for software services with a
 * permanent triage rail, `dashboard-scorecard` for targets over a period.
 *
 * Content-only (root `Layout`); the host supplies the app shell. Frame:
 *   header  site name + live "updated" stamp | shift + date controls
 *   content KPI tiles
 *           headcount today (2/3) | live alerts (1/3)
 *           hours by trade (1/2)  | safety events (1/2)
 *           zone occupancy table + pagination
 *
 * All charts are `@solo/charts` (`Chart` + `line`/`area`/`bar`/`referenceLine`
 * marks, `ChartAxis` at `start` and `bottom`). They mirror on their own under
 * `dir="rtl"`: the x range flips, the value axis moves to the right edge, and
 * the tooltip and legend follow — nothing here branches on direction.
 *
 * Data is deterministic fixtures. The only clock reads are inside
 * `useState(() => Date.now())`, so the "updated" stamp and the alert times are
 * relative to when the page mounted.
 *
 * ## Extending this template
 *
 * ### Wiring it to live data
 *
 * **Swap fixtures for one shift-scoped query.** Everything that moves with the
 * shift selector — the KPI tiles, the headcount chart, the zone table — reads
 * from `SHIFTS[shift]` and `ZONES`. Replace those with one query keyed by
 * `{siteId, date, shift}` and the page stays coherent: the tiles are derived
 * from the zone rows (`workersOnSite`, `zonesAtCapacity`), not stored beside
 * them, so the headline can never disagree with the table it summarises. Keep
 * it that way — a separately fetched "workers on site" figure will drift from
 * the per-zone counts within a refresh or two.
 *
 * **The date control is wired but inert.** `DateInput` holds the date in state
 * and nothing reads it yet; it is the second key of that query. When the date
 * is not today, the page stops being live: hide the "Live" dot, show the
 * absolute shift window instead of a relative stamp, and fill the headcount
 * chart's actual series to the end of the shift.
 *
 * **Refresh, don't re-mount.** Poll (or subscribe) and replace the data in
 * place; bump `updatedAt` when a payload lands. `Timestamp isLive` keeps the
 * "Updated 2 minutes ago" text honest between payloads. Re-mounting the charts
 * on every tick restarts their transitions and the page will visibly flash.
 *
 * ### Charts
 *
 * **Build a fresh series array per render.** Mark definitions (`line()`,
 * `bar()`…) carry per-chart layout state and are single-use; each chart
 * component creates its own array inside render, never a module constant
 * shared between charts.
 *
 * **Gaps are `null`, not zero.** The headcount "Actual" series is `null` after
 * the current hour so the line stops at now; a `0` would draw a cliff to the
 * baseline that reads as everyone walking off site.
 *
 * **Colors.** Series take Solo's categorical palette in its fixed order (pass no
 * `color` and `Chart` assigns it). "Planned" is the one exception — it is a
 * reference, not an entity, so it wears `--color-data-neutral`. Do not paint a
 * series with status colors; those are reserved for the alert badges.
 *
 * **Targets are `referenceLine`, not a series.** The safety chart's daily
 * target is a mark with a label; it stays out of the tooltip and legend and
 * does not compete with the bars for a palette slot.
 *
 * ### Alerts
 *
 * Acknowledging is local state here plus a `Toast`. In production send the
 * acknowledgement first and toast on success — the toast is the receipt, so it
 * must not fire for an acknowledgement the server rejected. Acknowledged alerts
 * stay in the list (dimmed, no badge) until they resolve, because the crew on
 * the ground still needs to see them; "Open safety alerts" counts only the
 * unacknowledged ones.
 *
 * ### Badges
 *
 * Badges appear only where the reader must act: a zone at or over capacity, an
 * unacknowledged critical or warning alert. Zones with room show no badge — a
 * green "OK" on ten of twelve rows would bury the two that matter.
 */

import {useMemo, useState, type CSSProperties} from 'react';
import {
  VStack,
  HStack,
  StackItem,
  Layout,
  LayoutContent,
  LayoutHeader,
} from '@solo/core/Layout';
import {Grid, GridSpan} from '@solo/core/Grid';
import {useMediaQuery} from '@solo/core/hooks';
import {Text, Heading} from '@solo/core/Text';
import {Card} from '@solo/core/Card';
import {Button} from '@solo/core/Button';
import {Badge} from '@solo/core/Badge';
import {StatusDot} from '@solo/core/StatusDot';
import {ProgressBar} from '@solo/core/ProgressBar';
import {Divider} from '@solo/core/Divider';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@solo/core/SegmentedControl';
import {DateInput} from '@solo/core/DateInput';
import type {ISODateString} from '@solo/core/Calendar';
import {Timestamp} from '@solo/core/Timestamp';
import {List, ListItem} from '@solo/core/List';
import {Table, proportional, pixel} from '@solo/core/Table';
import type {TableColumn} from '@solo/core/Table';
import {Pagination} from '@solo/core/Pagination';
import {useToast} from '@solo/core/Toast';
import {Icon} from '@solo/core/Icon';
import {
  Chart,
  ChartAxis,
  ChartGrid,
  area,
  bar,
  line,
  referenceLine,
} from '@solo/charts';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// ============= TYPES =============

type Shift = 'day' | 'night';
type Severity = 'critical' | 'warning' | 'advisory';

interface HeadcountPoint {
  [key: string]: unknown;
  hour: string;
  planned: number;
  actual: number | null;
}

interface ShiftData {
  /** Planned headcount at this point in the shift. */
  plannedNow: number;
  hoursWorked: number;
  hoursPlanned: number;
  window: string;
  headcount: HeadcountPoint[];
}

interface Zone {
  [key: string]: unknown;
  id: string;
  name: string;
  area: string;
  supervisor: string;
  capacity: number;
  day: number;
  night: number;
}

interface SiteAlert {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  /** Minutes before the page mounted. */
  minutesAgo: number;
}

// ============= DATA =============

const SITE_NAME = 'Marina Tower — Site B';
const TODAY: ISODateString = '2026-10-22';

// Hourly headcount through the shift. "Actual" stops at the current hour.
const SHIFTS: Record<Shift, ShiftData> = {
  day: {
    plannedNow: 450,
    hoursWorked: 2986,
    hoursPlanned: 3150,
    window: '06:00–18:00',
    headcount: [
      {hour: '06:00', planned: 120, actual: 104},
      {hour: '07:00', planned: 310, actual: 288},
      {hour: '08:00', planned: 430, actual: 401},
      {hour: '09:00', planned: 450, actual: 428},
      {hour: '10:00', planned: 450, actual: 437},
      {hour: '11:00', planned: 450, actual: 431},
      {hour: '12:00', planned: 380, actual: 352},
      {hour: '13:00', planned: 450, actual: 409},
      {hour: '14:00', planned: 450, actual: 412},
      {hour: '15:00', planned: 440, actual: null},
      {hour: '16:00', planned: 400, actual: null},
      {hour: '17:00', planned: 260, actual: null},
      {hour: '18:00', planned: 90, actual: null},
    ],
  },
  night: {
    plannedNow: 110,
    hoursWorked: 534,
    hoursPlanned: 560,
    window: '18:00–06:00',
    headcount: [
      {hour: '18:00', planned: 40, actual: 36},
      {hour: '19:00', planned: 95, actual: 88},
      {hour: '20:00', planned: 110, actual: 104},
      {hour: '21:00', planned: 110, actual: 107},
      {hour: '22:00', planned: 110, actual: 109},
      {hour: '23:00', planned: 105, actual: 101},
      {hour: '00:00', planned: 80, actual: 77},
      {hour: '01:00', planned: 110, actual: 100},
      {hour: '02:00', planned: 110, actual: null},
      {hour: '03:00', planned: 108, actual: null},
      {hour: '04:00', planned: 100, actual: null},
      {hour: '05:00', planned: 70, actual: null},
      {hour: '06:00', planned: 30, actual: null},
    ],
  },
};

// Hours by trade, both shifts, Saturday to today. Friday is the site's day off.
const TRADES = [
  {key: 'concrete', label: 'Concrete'},
  {key: 'steel', label: 'Steel'},
  {key: 'electrical', label: 'Electrical'},
  {key: 'mechanical', label: 'Mechanical'},
  {key: 'finishing', label: 'Finishing'},
] as const;

const TRADE_HOURS = [
  {day: 'Sat', concrete: 880, steel: 720, electrical: 590, mechanical: 680, finishing: 550},
  {day: 'Sun', concrete: 930, steel: 760, electrical: 620, mechanical: 710, finishing: 590},
  {day: 'Mon', concrete: 910, steel: 745, electrical: 605, mechanical: 700, finishing: 580},
  {day: 'Tue', concrete: 950, steel: 780, electrical: 630, mechanical: 720, finishing: 610},
  {day: 'Wed', concrete: 905, steel: 770, electrical: 615, mechanical: 705, finishing: 585},
  {day: 'Thu', concrete: 780, steel: 655, electrical: 512, mechanical: 584, finishing: 455},
];

// Safety events per day over the last two weeks. Fridays are rest days.
const SAFETY_TARGET = 4;
const SAFETY_EVENTS = [
  {date: 'Oct 9', incidents: 0, nearMisses: 0},
  {date: 'Oct 10', incidents: 1, nearMisses: 3},
  {date: 'Oct 11', incidents: 0, nearMisses: 2},
  {date: 'Oct 12', incidents: 0, nearMisses: 4},
  {date: 'Oct 13', incidents: 1, nearMisses: 2},
  {date: 'Oct 14', incidents: 0, nearMisses: 3},
  {date: 'Oct 15', incidents: 0, nearMisses: 1},
  {date: 'Oct 16', incidents: 0, nearMisses: 0},
  {date: 'Oct 17', incidents: 0, nearMisses: 2},
  {date: 'Oct 18', incidents: 2, nearMisses: 3},
  {date: 'Oct 19', incidents: 0, nearMisses: 2},
  {date: 'Oct 20', incidents: 1, nearMisses: 1},
  {date: 'Oct 21', incidents: 0, nearMisses: 3},
  {date: 'Oct 22', incidents: 1, nearMisses: 2},
];

const ZONES: Zone[] = [
  {id: 'L12', name: 'Level 12', area: 'Core walls', supervisor: 'Omar Haddad', capacity: 40, day: 40, night: 12},
  {id: 'L11', name: 'Level 11', area: 'Slab pour', supervisor: 'Layla Nasser', capacity: 45, day: 46, night: 18},
  {id: 'L10', name: 'Level 10', area: 'Rebar fixing', supervisor: 'Karim Mansour', capacity: 40, day: 31, night: 8},
  {id: 'L7-9', name: 'Levels 7–9', area: 'MEP rough-in', supervisor: 'Sara Al-Amin', capacity: 60, day: 54, night: 14},
  {id: 'L3-6', name: 'Levels 3–6', area: 'Interior finishing', supervisor: 'Yousef Khalil', capacity: 90, day: 78, night: 10},
  {id: 'POD', name: 'Podium', area: 'Façade panels', supervisor: 'Hana Saleh', capacity: 30, day: 24, night: 0},
  {id: 'B2', name: 'Basement B2', area: 'Waterproofing', supervisor: 'Tariq Aziz', capacity: 20, day: 15, night: 6},
  {id: 'TC1', name: 'Crane TC-1 base', area: 'Lifting zone', supervisor: 'Nadia Farouk', capacity: 8, day: 8, night: 4},
  {id: 'YRD', name: 'Laydown yard', area: 'Material storage', supervisor: 'Rami Fares', capacity: 50, day: 42, night: 9},
  {id: 'HST', name: 'Hoist & logistics', area: 'Vertical transport', supervisor: 'Mona Jaber', capacity: 24, day: 19, night: 7},
  {id: 'OFF', name: 'Site office', area: 'Welfare & admin', supervisor: 'Ziad Qasim', capacity: 40, day: 46, night: 8},
  {id: 'GTE', name: 'Main gate', area: 'Security & access', supervisor: 'Rana Habib', capacity: 12, day: 9, night: 4},
];

const ALERTS: SiteAlert[] = [
  {
    id: 'AL-3107',
    severity: 'critical',
    title: 'Worker in restricted zone — Level 12',
    detail: 'Badge W-2291 · east edge, no harness tag',
    minutesAgo: 4,
  },
  {
    id: 'AL-3106',
    severity: 'critical',
    title: 'Crane wind speed above limit',
    detail: 'TC-2 · gusts 48 km/h, limit 45 km/h',
    minutesAgo: 9,
  },
  {
    id: 'AL-3105',
    severity: 'warning',
    title: 'Zone over capacity — Level 11',
    detail: '46 workers on a 45-person deck',
    minutesAgo: 17,
  },
  {
    id: 'AL-3104',
    severity: 'warning',
    title: 'Hot-work permit expiring — Level 9',
    detail: 'Permit HW-118 ends at 15:00',
    minutesAgo: 34,
  },
  {
    id: 'AL-3103',
    severity: 'advisory',
    title: 'Gas detector calibration due',
    detail: 'Basement B2 · unit GD-04',
    minutesAgo: 72,
  },
];

const SEVERITY_BADGE: Record<
  Severity,
  {label: string; variant: 'error' | 'warning'} | null
> = {
  critical: {label: 'Critical', variant: 'error'},
  warning: {label: 'Warning', variant: 'warning'},
  advisory: null,
};

const SEVERITY_DOT: Record<Severity, 'error' | 'warning' | 'neutral'> = {
  critical: 'error',
  warning: 'warning',
  advisory: 'neutral',
};

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: 'Critical',
  warning: 'Warning',
  advisory: 'Advisory',
};

const ZONE_PAGE_SIZE = 6;

const NUMBER = new Intl.NumberFormat('en-US');

// Layout height="fill" is height:100%, which needs a definite height the
// host's <html>/<body> don't set.
const pageStyle: CSSProperties = {height: '100dvh'};

// ============= CHARTS =============

function compactHours(value: unknown): string {
  const n = Number(value);
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

function HeadcountChart({shift}: {shift: Shift}) {
  const data = SHIFTS[shift];
  // Fresh mark definitions per render — they are single-use per Chart.
  const series = [
    area('planned', {
      label: 'Planned',
      color: 'var(--color-data-neutral)',
      opacity: 0.18,
      curve: 'linear',
      stroke: true,
    }),
    line('actual', {label: 'Actual', curve: 'linear', dots: true}),
  ];
  return (
    <Chart
      data={data.headcount}
      xKey="hour"
      series={series}
      title="Headcount on site by hour"
      subtitle={`Planned vs. actual · ${data.window}`}
      height={400}
      grid={<ChartGrid horizontal />}
      axes={
        <>
          <ChartAxis position="bottom" maxTicks={7} />
          <ChartAxis position="start" />
        </>
      }
      legend={{position: 'top', alignment: 'end'}}
      tooltip
    />
  );
}

function TradeHoursChart() {
  const series = TRADES.map(trade =>
    bar(trade.key, {label: trade.label, stack: 'hours'}),
  );
  return (
    <Chart
      data={TRADE_HOURS}
      xKey="day"
      series={series}
      title="Hours worked by trade"
      subtitle="This week · both shifts"
      height={280}
      grid={<ChartGrid horizontal />}
      axes={
        <>
          <ChartAxis position="bottom" />
          <ChartAxis position="start" tickFormat={compactHours} />
        </>
      }
      legend={{position: 'bottom', alignment: 'start'}}
      tooltip
    />
  );
}

function SafetyEventsChart() {
  const series = [
    bar('incidents', {label: 'Incidents', stack: 'events'}),
    bar('nearMisses', {label: 'Near misses', stack: 'events'}),
    referenceLine({
      y: SAFETY_TARGET,
      label: 'Daily target',
      labelPosition: 'end',
      color: 'var(--color-text-secondary)',
    }),
  ];
  return (
    <Chart
      data={SAFETY_EVENTS}
      xKey="date"
      series={series}
      title="Safety events per day"
      subtitle="Last 14 days · incidents and near misses, target 4 or fewer"
      height={280}
      yDomain={[0, 6]}
      grid={<ChartGrid horizontal tickCount={6} />}
      axes={
        <>
          <ChartAxis position="bottom" maxTicks={7} />
          <ChartAxis position="start" tickCount={6} />
        </>
      }
      legend={{position: 'bottom', alignment: 'start'}}
      tooltip
    />
  );
}

// ============= KPI TILES =============

function KpiTile({
  icon,
  label,
  value,
  detail,
  badge,
  progress,
}: {
  icon: typeof UserGroupIcon;
  label: string;
  value: string;
  detail: string;
  badge?: {label: string; variant: 'error' | 'warning'};
  progress?: {value: number; max: number; label: string};
}) {
  return (
    <Card padding={5}>
      <VStack gap={3}>
        <HStack gap={2} vAlign="center">
          <Icon icon={icon} size="sm" color="secondary" />
          <StackItem size="fill">
            <Text type="label" color="secondary">
              {label}
            </Text>
          </StackItem>
          {badge && <Badge label={badge.label} variant={badge.variant} />}
        </HStack>
        <Text type="display-3" display="block" hasTabularNumbers>
          {value}
        </Text>
        {progress && (
          <ProgressBar
            label={progress.label}
            isLabelHidden
            value={progress.value}
            max={progress.max}
            variant="neutral"
          />
        )}
        <Text type="supporting" color="secondary">
          {detail}
        </Text>
      </VStack>
    </Card>
  );
}

// ============= ALERTS =============

function LiveAlerts({
  mountedAt,
  acknowledged,
  onAcknowledge,
}: {
  mountedAt: number;
  acknowledged: ReadonlySet<string>;
  onAcknowledge: (alert: SiteAlert) => void;
}) {
  const open = ALERTS.filter(a => !acknowledged.has(a.id)).length;
  return (
    <Card padding={0} height="100%">
      <VStack gap={0}>
        <HStack gap={2} vAlign="center" padding={5}>
          <StackItem size="fill">
            <VStack gap={0.5}>
              <Heading level={2}>Live alerts</Heading>
              <Text type="supporting" color="secondary">
                {open === 0 ? 'All alerts acknowledged' : `${open} awaiting acknowledgement`}
              </Text>
            </VStack>
          </StackItem>
          <HStack gap={1.5} vAlign="center">
            <StatusDot
              variant="success"
              label="Live"
              isPulsing
              tooltip="Streaming from site sensors"
            />
            <Text type="supporting" color="secondary">
              Live
            </Text>
          </HStack>
        </HStack>
        <Divider />
        <List density="compact" hasDividers>
          {ALERTS.map(alert => {
            const isAcked = acknowledged.has(alert.id);
            const badge = SEVERITY_BADGE[alert.severity];
            return (
              <ListItem
                key={alert.id}
                className={isAcked ? 'opacity-60' : undefined}
                startContent={
                  <StatusDot
                    variant={isAcked ? 'neutral' : SEVERITY_DOT[alert.severity]}
                    label={SEVERITY_LABEL[alert.severity]}
                    isPulsing={!isAcked && alert.severity === 'critical'}
                  />
                }
                label={alert.title}
                description={
                  <VStack gap={1}>
                    <Text type="supporting" color="secondary">
                      {alert.detail}
                    </Text>
                    <HStack gap={2} vAlign="center" wrap="wrap">
                      {!isAcked && badge && (
                        <Badge label={badge.label} variant={badge.variant} />
                      )}
                      {!isAcked && !badge && (
                        <Text type="supporting" color="secondary">
                          {SEVERITY_LABEL[alert.severity]}
                        </Text>
                      )}
                      {isAcked && (
                        <HStack gap={1} vAlign="center">
                          <Icon icon={CheckCircleIcon} size="xsm" color="secondary" />
                          <Text type="supporting" color="secondary">
                            Acknowledged
                          </Text>
                        </HStack>
                      )}
                      <Timestamp
                        value={mountedAt - alert.minutesAgo * 60_000}
                        format="relative"
                        isLive
                      />
                      {!isAcked && (
                        <StackItem size="fill">
                          <HStack hAlign="end">
                            <Button
                              label="Acknowledge"
                              size="sm"
                              onClick={() => onAcknowledge(alert)}
                            />
                          </HStack>
                        </StackItem>
                      )}
                    </HStack>
                  </VStack>
                }
              />
            );
          })}
        </List>
      </VStack>
    </Card>
  );
}

// ============= ZONE TABLE =============

function zoneStatus(
  workers: number,
  capacity: number,
): {label: string; variant: 'error' | 'warning'} | null {
  if (workers > capacity) {
    return {label: 'Over capacity', variant: 'error'};
  }
  if (workers === capacity) {
    return {label: 'At capacity', variant: 'warning'};
  }
  return null;
}

function zoneColumns(shift: Shift): TableColumn<Zone>[] {
  return [
    {
      key: 'name',
      header: 'Zone',
      width: proportional(2),
      renderCell: zone => (
        <VStack gap={0}>
          <Text type="body" weight="medium">
            {zone.name}
          </Text>
          <Text type="supporting" color="secondary">
            {zone.area}
          </Text>
        </VStack>
      ),
    },
    {
      key: 'supervisor',
      header: 'Supervisor',
      width: proportional(1.5),
    },
    {
      key: 'occupancy',
      header: 'Workers / capacity',
      width: proportional(2),
      renderCell: zone => {
        const workers = zone[shift];
        const status = zoneStatus(workers, zone.capacity);
        return (
          <HStack gap={3} vAlign="center">
            <StackItem size="fill">
              <ProgressBar
                label={`${zone.name} occupancy`}
                isLabelHidden
                value={Math.min(workers, zone.capacity)}
                max={zone.capacity}
                variant={status ? status.variant : 'accent'}
              />
            </StackItem>
            <Text type="body" hasTabularNumbers>
              {`${workers} / ${zone.capacity}`}
            </Text>
          </HStack>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: pixel(150),
      renderCell: zone => {
        const status = zoneStatus(zone[shift], zone.capacity);
        return status ? (
          <Badge label={status.label} variant={status.variant} />
        ) : null;
      },
    },
  ];
}

function ZoneOccupancy({shift}: {shift: Shift}) {
  const [page, setPage] = useState(1);
  const columns = useMemo(() => zoneColumns(shift), [shift]);
  const rows = ZONES.slice(
    (page - 1) * ZONE_PAGE_SIZE,
    page * ZONE_PAGE_SIZE,
  );
  return (
    <Card padding={0}>
      <VStack gap={0}>
        <VStack gap={0.5} padding={5}>
          <Heading level={2}>Zone occupancy</Heading>
          <Text type="supporting" color="secondary">
            Live badge-in counts against each zone’s safe capacity
          </Text>
        </VStack>
        <Table<Zone>
          data={rows}
          columns={columns}
          idKey="id"
          rowCount={ZONES.length}
          rowIndexStart={(page - 1) * ZONE_PAGE_SIZE + 1}
        />
        <Divider />
        <HStack padding={3} hAlign="end">
          <Pagination
            page={page}
            onChange={setPage}
            totalItems={ZONES.length}
            pageSize={ZONE_PAGE_SIZE}
            hasFirstLast={false}
            size="sm"
            label="Zone pages"
          />
        </HStack>
      </VStack>
    </Card>
  );
}

// ============= MAIN =============

export default function DashboardOperationsTemplate() {
  const [shift, setShift] = useState<Shift>('day');
  const [date, setDate] = useState<ISODateString | undefined>(TODAY);
  // Live clock reads stay inside lazy state initialisers.
  const [mountedAt] = useState(() => Date.now());
  const [updatedAt] = useState(() => Date.now() - 45_000);
  const [acknowledged, setAcknowledged] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const showToast = useToast();
  const isWide = useMediaQuery('(min-width: 1180px)');

  const shiftData = SHIFTS[shift];
  const workersOnSite = ZONES.reduce((sum, z) => sum + z[shift], 0);
  const zonesAtCapacity = ZONES.filter(z => z[shift] >= z.capacity).length;
  const openAlerts = ALERTS.filter(a => !acknowledged.has(a.id));
  const openCritical = openAlerts.filter(a => a.severity === 'critical').length;
  const planPct = Math.round((workersOnSite / shiftData.plannedNow) * 100);

  const acknowledge = (alert: SiteAlert) => {
    setAcknowledged(prev => new Set(prev).add(alert.id));
    showToast({body: 'Alert acknowledged', uniqueID: `ack-${alert.id}`});
  };

  return (
    <Layout
      height="fill"
      style={pageStyle}
      header={
        <LayoutHeader padding={6} hasDivider>
          <HStack gap={4} vAlign="center" hAlign="between" wrap="wrap">
            <VStack gap={1}>
              <Heading level={1}>{SITE_NAME}</Heading>
              <HStack gap={2} vAlign="center">
                <StatusDot
                  variant="success"
                  label="Live"
                  isPulsing
                  tooltip="Refreshing every 30 seconds"
                />
                <Text type="supporting" color="secondary">
                  Last updated
                </Text>
                <Timestamp value={updatedAt} format="relative" isLive />
              </HStack>
            </VStack>
            <HStack gap={3} vAlign="center" wrap="wrap">
              <SegmentedControl
                label="Shift"
                value={shift}
                onChange={value => setShift(value as Shift)}>
                <SegmentedControlItem label="Day" value="day" />
                <SegmentedControlItem label="Night" value="night" />
              </SegmentedControl>
              <DateInput
                label="Shift date"
                isLabelHidden
                value={date}
                onChange={setDate}
                format="date_weekday"
                width={220}
              />
            </HStack>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={6}>
          <VStack gap={6}>
            <Grid columns={{minWidth: 240, repeat: 'fit'}} gap={4}>
              <KpiTile
                icon={UserGroupIcon}
                label="Workers on site now"
                value={NUMBER.format(workersOnSite)}
                detail={`${planPct}% of ${shiftData.plannedNow} planned`}
                progress={{
                  value: workersOnSite,
                  max: shiftData.plannedNow,
                  label: 'Workers on site against plan',
                }}
              />
              <KpiTile
                icon={ClockIcon}
                label="Hours worked today"
                value={NUMBER.format(shiftData.hoursWorked)}
                detail={`${NUMBER.format(shiftData.hoursPlanned)} planned by end of shift`}
                progress={{
                  value: shiftData.hoursWorked,
                  max: shiftData.hoursPlanned,
                  label: 'Hours worked against plan',
                }}
              />
              <KpiTile
                icon={ExclamationTriangleIcon}
                label="Open safety alerts"
                value={`${openAlerts.length}`}
                detail={
                  openAlerts.length === 0
                    ? 'Nothing waiting on you'
                    : `${openCritical} critical`
                }
                badge={
                  openCritical > 0
                    ? {label: 'Action needed', variant: 'error'}
                    : undefined
                }
              />
              <KpiTile
                icon={MapIcon}
                label="Zones at capacity"
                value={`${zonesAtCapacity} / ${ZONES.length}`}
                detail={
                  zonesAtCapacity === 0
                    ? 'Every zone has room'
                    : 'Hold new badge-ins to full zones'
                }
              />
            </Grid>

            {/* Headcount takes two thirds beside the alerts; they stack when
                narrow. Solo's Tailwind preset has no breakpoints, so the
                switch is a media query, not an `xl:` class. */}
            <Grid columns={isWide ? 3 : 1} gap={4}>
              <GridSpan columns={isWide ? 2 : 1}>
                <Card padding={5} height="100%">
                  <HeadcountChart key={shift} shift={shift} />
                </Card>
              </GridSpan>
              <LiveAlerts
                mountedAt={mountedAt}
                acknowledged={acknowledged}
                onAcknowledge={acknowledge}
              />
            </Grid>

            <Grid columns={{minWidth: 420, repeat: 'fit'}} gap={4}>
              <Card padding={5}>
                <TradeHoursChart />
              </Card>
              <Card padding={5}>
                <SafetyEventsChart />
              </Card>
            </Grid>

            <ZoneOccupancy key={shift} shift={shift} />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
