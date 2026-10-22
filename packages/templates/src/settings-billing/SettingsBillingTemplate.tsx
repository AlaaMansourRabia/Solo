'use client';

/**
 * Billing: what a workspace pays, what it gets for that, and what it has
 * already been charged — the page only the account owner opens.
 *
 * The fixture is Meridian Works, a 24-person team on the Team plan with 30
 * seats, a card that expired last month and therefore a failed October
 * renewal, and an API quota that is nearly used up. What picks this template
 * over the other settings templates is **money and a plan**: a subscription
 * with a price, limits it is measured against, a payment method that can
 * fail, and a ledger of invoices. `settings-sidebar` and `settings-dialog` are
 * for preferences (one value per row, edited in place); `settings-members` is
 * for a list of people with roles. If the page answers "what are we paying,
 * for how much, and is it working?", start here — a hosting account, a
 * subscription box, a phone contract, a school's tuition portal.
 *
 * ## Extending this template
 *
 * ### The plan
 *
 * **One card states the deal.** Plan name, price per seat, how the price is
 * billed, the total it adds up to, when it renews and how many seats are in
 * use. The total is arithmetic (`seatLimit × price`), never a separate field,
 * so adding seats or switching plans cannot leave the card contradicting
 * itself. The two plan actions — Change plan and Add seats — sit together in
 * a `ButtonGroup` because both change the same object, the subscription.
 *
 * **Monthly / Yearly is a `SegmentedControl`, not a `ButtonGroup`.** It picks
 * a value that every price in the dialog follows; `ButtonGroup` is for
 * actions. The plans are a `RadioList` so all three, with their prices, are
 * compared at once, and the dialog's confirm button names the result
 * ("Switch to Business") and is disabled while nothing would change.
 *
 * **Cancelling changes the wording, not the layout.** A cancelled plan keeps
 * its card: "Renews on" becomes "Ends on", and the danger zone at the bottom
 * offers Resume instead of Cancel. The reader can always see what happens on
 * the next billing date.
 *
 * ### Usage
 *
 * **Every meter has a limit, and the limit is on screen.** Each `ProgressBar`
 * shows used / limit in the plan's own units (seats, storage, API calls) and
 * turns to the warning variant at 90%. When any meter crosses that line, one
 * warning `Banner` above the meters says which one and what happens next —
 * a page with two nearly-full meters still gets one banner, never a stack.
 *
 * **Units come from `Intl.NumberFormat`.** Storage uses the `unit` style,
 * API calls the `compact` notation, money the `currency` style — all with
 * the active locale, so Arabic gets its own digits, separators and unit
 * names. Never glue "GB" or "$" onto a number by hand.
 *
 * ### Money and dates
 *
 * **Format at render time with `useLocale()`.** Amounts are stored as numbers
 * in the account's currency (`CURRENCY`) and dates as ISO strings; the page
 * formats both with the provider's locale. Periods use
 * `Intl.DateTimeFormat#formatRange`, which collapses "Oct 1 – 31, 2026"
 * correctly in every language. Keep formatted values in their own text node
 * next to a translatable label ("Renews on" + date) rather than inside one
 * English sentence — the sentence cannot be translated once a date is in it.
 *
 * ### Payment method
 *
 * **Problems with payment are page-level.** A failed charge puts an error
 * `Banner` at the top of the page with the one action that fixes it, and the
 * card itself carries an "Expired" `Badge`. Updating the card in the dialog
 * retries the open invoices, clears the banner and reports with a `Toast` —
 * the banner was the problem, the toast is the outcome.
 *
 * **Validate in the dialog, next to the field.** Card number, expiry, CVC,
 * email and address are checked on submit and each error is a field
 * `status`, never a Toast. Once a field has been flagged it re-validates as
 * the user types, so the message disappears the moment it is fixed.
 *
 * ### Invoices
 *
 * **Badge only what needs attention.** "Overdue" and "Failed" are badges;
 * "Paid" is plain secondary text, because twenty green pills say nothing.
 * Each row's download is an `IconButton` whose label names the invoice
 * ("Download MW-2026-0018"), so a screen-reader user hears which file it is.
 * Twenty months of history are paginated eight at a time.
 *
 * ### Cancelling
 *
 * **Destructive actions confirm, finished actions toast.** Cancel opens an
 * `AlertDialog` whose description lists what the workspace loses and when,
 * whose action label repeats the consequence ("Cancel subscription") and
 * whose cancel label says what staying means ("Keep subscription"). The
 * result is a `Toast`, and the page changes to show the end date.
 */

import {useMemo, useState} from 'react';

import {HStack, Layout, LayoutContent, LayoutFooter, StackItem, VStack} from '@solo/core/Layout';
import {Heading, Text} from '@solo/core/Text';
import {AlertDialog} from '@solo/core/AlertDialog';
import {Badge} from '@solo/core/Badge';
import {Banner} from '@solo/core/Banner';
import {Button} from '@solo/core/Button';
import {ButtonGroup} from '@solo/core/ButtonGroup';
import {Card} from '@solo/core/Card';
import {Dialog, DialogHeader} from '@solo/core/Dialog';
import {Divider} from '@solo/core/Divider';
import {FormLayout} from '@solo/core/FormLayout';
import {Grid, GridSpan} from '@solo/core/Grid';
import {Icon} from '@solo/core/Icon';
import {IconButton} from '@solo/core/IconButton';
import {MetadataList, MetadataListItem} from '@solo/core/MetadataList';
import {NumberInput} from '@solo/core/NumberInput';
import {Pagination} from '@solo/core/Pagination';
import {ProgressBar} from '@solo/core/ProgressBar';
import {RadioList, RadioListItem} from '@solo/core/RadioList';
import {SegmentedControl, SegmentedControlItem} from '@solo/core/SegmentedControl';
import {Selector} from '@solo/core/Selector';
import {Table, pixel, proportional} from '@solo/core/Table';
import type {TableColumn} from '@solo/core/Table';
import {TextInput} from '@solo/core/TextInput';
import {ToastViewport, useToast} from '@solo/core/Toast';
import {VisuallyHidden} from '@solo/core/VisuallyHidden';
import {useMediaQuery} from '@solo/core/hooks';
import {useLocale} from '@solo/core/i18n';
import {ArrowDownTrayIcon, CreditCardIcon} from '@heroicons/react/24/outline';

// ============= DATA =============

const WORKSPACE = 'Meridian Works';
const CURRENCY = 'USD';
/** The fixture's "today". Fixed, so expiry and overdue states never drift. */
const TODAY = '2026-10-22';
const PERIOD_START = '2026-10-01';
const PERIOD_END = '2026-10-31';
const RENEWAL_DATE = '2026-11-01';
/** Days left in the period, for the prorated charge when adding seats. */
const DAYS_LEFT_IN_PERIOD = 10;
const DAYS_IN_PERIOD = 31;
const SEATS_IN_USE = 24;
const PAGE_SIZE = 8;
/** A meter at or above this share of its limit is a warning. */
const WARNING_RATIO = 0.9;

type PlanId = 'starter' | 'team' | 'business';
type Interval = 'monthly' | 'yearly';

interface Plan {
  id: PlanId;
  name: string;
  /** Price per seat per month, for each billing interval. */
  price: Record<Interval, number>;
  summary: string;
  storageTB: number;
  apiCalls: number;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: {monthly: 8, yearly: 6},
    summary: '250 GB storage, 100K API calls a month, email support',
    storageTB: 0.25,
    apiCalls: 100_000,
  },
  {
    id: 'team',
    name: 'Team',
    price: {monthly: 18, yearly: 15},
    summary: '1 TB storage, 500K API calls a month, SSO and audit log',
    storageTB: 1,
    apiCalls: 500_000,
  },
  {
    id: 'business',
    name: 'Business',
    price: {monthly: 32, yearly: 27},
    summary: '5 TB storage, 2M API calls a month, priority support',
    storageTB: 5,
    apiCalls: 2_000_000,
  },
];

const PLAN_BY_ID = Object.fromEntries(PLANS.map(p => [p.id, p])) as Record<PlanId, Plan>;

const INTERVAL_LABEL: Record<Interval, string> = {
  monthly: 'Billed monthly',
  yearly: 'Billed yearly',
};

const STORAGE_USED_GB = 742;
const API_CALLS_USED = 468_200;

type InvoiceStatus = 'paid' | 'overdue' | 'failed';

interface Invoice extends Record<string, unknown> {
  id: string;
  number: string;
  kind: 'Monthly subscription' | 'Seat add-on';
  /** Issue date, ISO. */
  date: string;
  periodStart: string;
  periodEnd: string;
  amount: number;
  status: InvoiceStatus;
}

function iso(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function lastDayOf(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Twenty invoices, newest first: eighteen monthly renewals from May 2025 as the
 * team grew from 18 to 30 seats, plus two prorated seat add-ons. October's
 * renewal failed on the expired card; September's add-on is overdue.
 */
function buildInvoices(): Invoice[] {
  const seatsFor = (year: number, month: number) =>
    year === 2025 ? (month < 9 ? 18 : 22) : month < 4 ? 22 : month < 10 ? 26 : 30;
  const rows: Invoice[] = [];
  let year = 2025;
  let month = 5;
  while (year < 2026 || (year === 2026 && month <= 10)) {
    rows.push({
      id: `sub-${year}-${month}`,
      number: '',
      kind: 'Monthly subscription',
      date: iso(year, month, 1),
      periodStart: iso(year, month, 1),
      periodEnd: iso(year, month, lastDayOf(year, month)),
      amount: seatsFor(year, month) * PLAN_BY_ID.team.price.monthly,
      status: year === 2026 && month === 10 ? 'failed' : 'paid',
    });
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  // 4 seats on Mar 12, prorated for 20 of 31 days; 4 seats on Sep 14, 17 of 30.
  rows.push({
    id: 'addon-2026-3',
    number: '',
    kind: 'Seat add-on',
    date: '2026-03-12',
    periodStart: '2026-03-12',
    periodEnd: '2026-03-31',
    amount: Math.round(((4 * 18 * 20) / 31) * 100) / 100,
    status: 'paid',
  });
  rows.push({
    id: 'addon-2026-9',
    number: '',
    kind: 'Seat add-on',
    date: '2026-09-14',
    periodStart: '2026-09-14',
    periodEnd: '2026-09-30',
    amount: Math.round(((4 * 18 * 17) / 30) * 100) / 100,
    status: 'overdue',
  });
  rows.sort((a, b) => a.date.localeCompare(b.date));
  // Numbers are sequential by issue date, so a later invoice always has a
  // higher number.
  rows.forEach((row, index) => {
    row.number = `MW-${row.date.slice(0, 4)}-${String(index + 1).padStart(4, '0')}`;
  });
  return rows.reverse();
}

const INITIAL_INVOICES = buildInvoices();

interface PaymentMethod {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
  email: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

const INITIAL_PAYMENT: PaymentMethod = {
  brand: 'Visa',
  last4: '4417',
  expMonth: 9,
  expYear: 2026,
  holder: 'Nadia Rahman',
  email: 'billing@meridianworks.com',
  line1: '220 Harbor Street, Suite 400',
  city: 'Portland, OR',
  postalCode: '97209',
  country: 'United States',
};

const COUNTRY_OPTIONS = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'United Arab Emirates',
  'Saudi Arabia',
  'Jordan',
].map(name => ({value: name, label: name}));

function isCardExpired(card: {expMonth: number; expYear: number}): boolean {
  const [year, month] = TODAY.split('-').map(Number);
  return card.expYear < year || (card.expYear === year && card.expMonth < month);
}

function brandOf(digits: string): string {
  if (digits.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'American Express';
  return 'Card';
}

function parseDate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// ============= FORMATTING =============

/**
 * Every number, amount and date on the page goes through the active locale.
 * Built once per locale; the formatters are not cheap to construct.
 */
function useFormatters() {
  const locale = useLocale();
  return useMemo(() => {
    const currency = new Intl.NumberFormat(locale, {style: 'currency', currency: CURRENCY});
    const wholeCurrency = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: CURRENCY,
      maximumFractionDigits: 0,
    });
    const integer = new Intl.NumberFormat(locale);
    const percent = new Intl.NumberFormat(locale, {style: 'percent'});
    const compact = new Intl.NumberFormat(locale, {notation: 'compact'});
    const gigabytes = new Intl.NumberFormat(locale, {style: 'unit', unit: 'gigabyte'});
    const terabytes = new Intl.NumberFormat(locale, {style: 'unit', unit: 'terabyte'});
    const day = new Intl.DateTimeFormat(locale, {month: 'short', day: 'numeric', year: 'numeric'});
    const expiry = new Intl.DateTimeFormat(locale, {month: '2-digit', year: 'numeric'});
    return {
      money: (value: number) =>
        Number.isInteger(value) ? wholeCurrency.format(value) : currency.format(value),
      exactMoney: (value: number) => currency.format(value),
      integer: (value: number) => integer.format(value),
      percent: (value: number) => percent.format(value),
      compact: (value: number) => compact.format(value),
      storage: (gb: number) =>
        gb >= 1000 ? terabytes.format(gb / 1000) : gigabytes.format(gb),
      date: (value: string) => day.format(parseDate(value)),
      range: (start: string, end: string) => day.formatRange(parseDate(start), parseDate(end)),
      expiry: (month: number, year: number) => expiry.format(new Date(year, month - 1, 1)),
    };
  }, [locale]);
}

type Formatters = ReturnType<typeof useFormatters>;

// ============= SMALL PIECES =============

/** A label over a value: the facts row of the plan card. */
function Fact({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <VStack gap={1}>
      <Text type="supporting" color="secondary">
        {label}
      </Text>
      <Text type="large" weight="semibold" hasTabularNumbers>
        {children}
      </Text>
    </VStack>
  );
}

interface Meter {
  id: string;
  label: string;
  used: number;
  limit: number;
  format: (value: number) => string;
}

function UsageMeter({meter, fmt}: {meter: Meter; fmt: Formatters}) {
  const ratio = meter.used / meter.limit;
  const isNearLimit = ratio >= WARNING_RATIO;
  return (
    <VStack gap={2}>
      <HStack gap={2} hAlign="between" vAlign="center">
        <Text weight="medium">{meter.label}</Text>
        <Text hasTabularNumbers>
          {meter.format(meter.used)}
          <Text color="secondary">
            {' / '}
            {meter.format(meter.limit)}
          </Text>
        </Text>
      </HStack>
      <ProgressBar
        label={meter.label}
        isLabelHidden
        value={meter.used}
        max={meter.limit}
        variant={isNearLimit ? 'warning' : 'accent'}
      />
      <Text type="supporting" color="secondary">
        {fmt.percent(ratio)} <span>of plan limit</span>
      </Text>
    </VStack>
  );
}

// ============= CHANGE PLAN DIALOG =============

function ChangePlanDialog({
  isOpen,
  onOpenChange,
  currentPlan,
  currentInterval,
  seats,
  fmt,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentPlan: PlanId;
  currentInterval: Interval;
  seats: number;
  fmt: Formatters;
  onConfirm: (plan: PlanId, interval: Interval) => void;
}) {
  const [plan, setPlan] = useState<PlanId>(currentPlan);
  const [interval, setInterval] = useState<Interval>(currentInterval);

  const close = () => {
    onOpenChange(false);
    setPlan(currentPlan);
    setInterval(currentInterval);
  };

  const isUnchanged = plan === currentPlan && interval === currentInterval;
  const selected = PLAN_BY_ID[plan];
  const total = selected.price[interval] * seats * (interval === 'yearly' ? 12 : 1);

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
            title="Change plan"
            subtitle="Prices are per seat. Every seat on the workspace moves to the new plan."
            onOpenChange={() => close()}
            hasDivider={false}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={4}>
              <SegmentedControl
                label="Billing interval"
                value={interval}
                layout="fill"
                onChange={value => setInterval(value as Interval)}>
                <SegmentedControlItem value="monthly" label="Monthly" />
                <SegmentedControlItem value="yearly" label="Yearly · save up to 25%" />
              </SegmentedControl>
              <RadioList
                label="Plan"
                isLabelHidden
                value={plan}
                onChange={value => setPlan(value as PlanId)}>
                {PLANS.map(option => (
                  <RadioListItem
                    key={option.id}
                    value={option.id}
                    label={
                      <HStack gap={2} vAlign="center">
                        <Text weight="medium">{option.name}</Text>
                        {option.id === currentPlan && (
                          <Text type="supporting" color="secondary">
                            Current plan
                          </Text>
                        )}
                      </HStack>
                    }
                    aria-label={option.name}
                    description={option.summary}
                    endContent={
                      <VStack gap={0} hAlign="end">
                        <Text weight="semibold" hasTabularNumbers>
                          {fmt.money(option.price[interval])}
                        </Text>
                        <Text type="supporting" color="secondary">
                          per seat / month
                        </Text>
                      </VStack>
                    }
                  />
                ))}
              </RadioList>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={3} vAlign="center" wrap="wrap">
              <StackItem size="fill">
                <VStack gap={0}>
                  <Text type="supporting" color="secondary">
                    {interval === 'yearly' ? 'New yearly total' : 'New monthly total'}
                  </Text>
                  <Text weight="semibold" hasTabularNumbers>
                    {fmt.money(total)}
                  </Text>
                </VStack>
              </StackItem>
              <HStack gap={2}>
                <Button label="Cancel" variant="secondary" onClick={close} />
                <Button
                  label={
                    plan === currentPlan ? 'Update billing' : `Switch to ${selected.name}`
                  }
                  variant="primary"
                  isDisabled={isUnchanged}
                  onClick={() => {
                    onConfirm(plan, interval);
                    onOpenChange(false);
                  }}
                />
              </HStack>
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}

// ============= ADD SEATS DIALOG =============

function AddSeatsDialog({
  isOpen,
  onOpenChange,
  seatLimit,
  pricePerSeat,
  fmt,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  seatLimit: number;
  pricePerSeat: number;
  fmt: Formatters;
  onConfirm: (count: number) => void;
}) {
  const [count, setCount] = useState<number | null>(5);
  const isValid = count != null && count >= 1 && count <= 100;
  const added = isValid ? count : 0;
  const proratedToday =
    Math.round(((added * pricePerSeat * DAYS_LEFT_IN_PERIOD) / DAYS_IN_PERIOD) * 100) / 100;

  const close = () => {
    onOpenChange(false);
    setCount(5);
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
            title="Add seats"
            subtitle="New seats are available right away and billed at your plan's per-seat price."
            onOpenChange={() => close()}
            hasDivider={false}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={5}>
              <NumberInput
                label="Seats to add"
                value={count}
                onChange={setCount}
                min={1}
                max={100}
                isIntegerOnly
                hasNumberSteppers
                width={200}
                status={
                  isValid
                    ? undefined
                    : {type: 'error', message: 'Enter a number from 1 to 100.'}
                }
              />
              <MetadataList label={{position: 'start', width: 200}}>
                <MetadataListItem label="Seats after this change">
                  <Text hasTabularNumbers>{fmt.integer(seatLimit + added)}</Text>
                </MetadataListItem>
                <MetadataListItem label="New monthly total">
                  <Text hasTabularNumbers>
                    {fmt.money((seatLimit + added) * pricePerSeat)}
                  </Text>
                </MetadataListItem>
                <MetadataListItem label="Due today, prorated">
                  <Text weight="semibold" hasTabularNumbers>
                    {fmt.exactMoney(proratedToday)}
                  </Text>
                </MetadataListItem>
              </MetadataList>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Cancel" variant="secondary" onClick={close} />
              <Button
                label="Add seats"
                variant="primary"
                isDisabled={!isValid}
                onClick={() => {
                  onConfirm(added);
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

// ============= PAYMENT DIALOG =============

interface PaymentDraft {
  holder: string;
  number: string;
  expiry: string;
  cvc: string;
  email: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

type PaymentErrors = Partial<Record<keyof PaymentDraft, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validatePayment(draft: PaymentDraft): PaymentErrors {
  const errors: PaymentErrors = {};
  const digits = draft.number.replace(/\s/g, '');
  if (draft.holder.trim() === '') {
    errors.holder = 'Enter the name shown on the card.';
  }
  if (!/^\d{15,16}$/.test(digits)) {
    errors.number = 'Enter the 15 or 16 digits on the front of the card.';
  }
  const expiry = /^(\d{2})\s*\/\s*(\d{2})$/.exec(draft.expiry.trim());
  if (expiry == null || Number(expiry[1]) < 1 || Number(expiry[1]) > 12) {
    errors.expiry = 'Use the format MM/YY.';
  } else if (isCardExpired({expMonth: Number(expiry[1]), expYear: 2000 + Number(expiry[2])})) {
    errors.expiry = 'This card has expired.';
  }
  if (!/^\d{3,4}$/.test(draft.cvc.trim())) {
    errors.cvc = 'Enter the 3 or 4 digit code.';
  }
  if (!EMAIL_PATTERN.test(draft.email.trim())) {
    errors.email = 'Enter an email address, like name@company.com.';
  }
  if (draft.line1.trim() === '') {
    errors.line1 = 'Enter a street address.';
  }
  if (draft.city.trim() === '') {
    errors.city = 'Enter a city.';
  }
  if (draft.postalCode.trim() === '') {
    errors.postalCode = 'Enter a postal code.';
  }
  return errors;
}

function draftFrom(payment: PaymentMethod): PaymentDraft {
  return {
    holder: payment.holder,
    number: '',
    expiry: '',
    cvc: '',
    email: payment.email,
    line1: payment.line1,
    city: payment.city,
    postalCode: payment.postalCode,
    country: payment.country,
  };
}

function PaymentDialog({
  isOpen,
  onOpenChange,
  payment,
  onSave,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  payment: PaymentMethod;
  onSave: (payment: PaymentMethod) => void;
}) {
  const [draft, setDraft] = useState<PaymentDraft>(() => draftFrom(payment));
  const [errors, setErrors] = useState<PaymentErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const close = () => {
    onOpenChange(false);
    setDraft(draftFrom(payment));
    setErrors({});
    setHasSubmitted(false);
  };

  // After the first submit, every keystroke re-validates so a fixed field
  // loses its error immediately.
  const set = (key: keyof PaymentDraft) => (value: string) => {
    const next = {...draft, [key]: value};
    setDraft(next);
    if (hasSubmitted) {
      setErrors(validatePayment(next));
    }
  };

  const status = (key: keyof PaymentDraft) =>
    errors[key] == null ? undefined : {type: 'error' as const, message: errors[key]};

  const submit = () => {
    const found = validatePayment(draft);
    setHasSubmitted(true);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }
    const digits = draft.number.replace(/\s/g, '');
    const [mm, yy] = draft.expiry.split('/').map(part => Number(part.trim()));
    onSave({
      brand: brandOf(digits),
      last4: digits.slice(-4),
      expMonth: mm,
      expYear: 2000 + yy,
      holder: draft.holder.trim(),
      email: draft.email.trim(),
      line1: draft.line1.trim(),
      city: draft.city.trim(),
      postalCode: draft.postalCode.trim(),
      country: draft.country,
    });
    close();
  };

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
            title="Update payment method"
            subtitle="Open invoices are charged to the new card as soon as you save."
            onOpenChange={() => close()}
            hasDivider={false}
          />
        }
        content={
          <LayoutContent>
            <form
              noValidate
              onSubmit={event => {
                event.preventDefault();
                submit();
              }}>
              <VStack gap={5}>
                <FormLayout>
                  <TextInput
                    label="Name on card"
                    value={draft.holder}
                    onChange={set('holder')}
                    autoComplete="cc-name"
                    status={status('holder')}
                  />
                  <TextInput
                    label="Card number"
                    value={draft.number}
                    onChange={set('number')}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    startIcon={<Icon icon={CreditCardIcon} size="sm" />}
                    status={status('number')}
                  />
                  <FormLayout direction="horizontal">
                    <TextInput
                      label="Expiry"
                      value={draft.expiry}
                      onChange={set('expiry')}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      status={status('expiry')}
                    />
                    <TextInput
                      label="Security code"
                      value={draft.cvc}
                      onChange={set('cvc')}
                      placeholder="CVC"
                      autoComplete="cc-csc"
                      status={status('cvc')}
                    />
                  </FormLayout>
                </FormLayout>
                <Divider />
                <FormLayout>
                  <TextInput
                    type="email"
                    label="Billing email"
                    description="Receipts and payment problems are sent here."
                    value={draft.email}
                    onChange={set('email')}
                    autoComplete="email"
                    status={status('email')}
                  />
                  <TextInput
                    label="Street address"
                    value={draft.line1}
                    onChange={set('line1')}
                    autoComplete="address-line1"
                    status={status('line1')}
                  />
                  <FormLayout direction="horizontal">
                    <TextInput
                      label="City"
                      value={draft.city}
                      onChange={set('city')}
                      autoComplete="address-level2"
                      status={status('city')}
                    />
                    <TextInput
                      label="Postal code"
                      value={draft.postalCode}
                      onChange={set('postalCode')}
                      autoComplete="postal-code"
                      status={status('postalCode')}
                    />
                  </FormLayout>
                  <Selector
                    label="Country"
                    options={COUNTRY_OPTIONS}
                    value={draft.country}
                    onChange={value => setDraft(d => ({...d, country: String(value)}))}
                  />
                </FormLayout>
              </VStack>
            </form>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Cancel" variant="secondary" onClick={close} />
              <Button label="Save payment method" variant="primary" onClick={submit} />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}

// ============= PAGE =============

function BillingPage() {
  const fmt = useFormatters();
  const showToast = useToast();
  const isWide = useMediaQuery('(min-width: 1080px)');

  const [planId, setPlanId] = useState<PlanId>('team');
  const [interval, setIntervalValue] = useState<Interval>('monthly');
  const [seatLimit, setSeatLimit] = useState(30);
  const [payment, setPayment] = useState<PaymentMethod>(INITIAL_PAYMENT);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [isCancelled, setIsCancelled] = useState(false);
  const [page, setPage] = useState(1);

  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isSeatsOpen, setIsSeatsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const plan = PLAN_BY_ID[planId];
  const pricePerSeat = plan.price[interval];
  // The total is arithmetic over the plan, never a stored number.
  const periodTotal = pricePerSeat * seatLimit * (interval === 'yearly' ? 12 : 1);
  const isExpired = isCardExpired(payment);
  const hasFailedPayment = invoices.some(i => i.status === 'failed');

  const meters: Meter[] = [
    {id: 'seats', label: 'Seats', used: SEATS_IN_USE, limit: seatLimit, format: fmt.integer},
    {
      id: 'storage',
      label: 'Storage',
      used: STORAGE_USED_GB,
      limit: plan.storageTB * 1000,
      format: fmt.storage,
    },
    {
      id: 'api',
      label: 'API calls',
      used: API_CALLS_USED,
      limit: plan.apiCalls,
      format: fmt.compact,
    },
  ];
  const nearLimit = meters.filter(m => m.used / m.limit >= WARNING_RATIO);

  const pageCount = Math.max(1, Math.ceil(invoices.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const sliceStart = (currentPage - 1) * PAGE_SIZE;
  const sliceEnd = Math.min(sliceStart + PAGE_SIZE, invoices.length);

  const columns = useMemo<TableColumn<Invoice>[]>(
    () => [
      {
        key: 'number',
        header: 'Invoice',
        width: proportional(2),
        renderCell: row => (
          <VStack gap={0}>
            <Text weight="medium" maxLines={1}>
              {row.number}
            </Text>
            <Text type="supporting" color="secondary" maxLines={1}>
              {row.kind}
            </Text>
          </VStack>
        ),
      },
      {
        key: 'date',
        header: 'Date',
        width: pixel(150),
        renderCell: row => <Text hasTabularNumbers>{fmt.date(row.date)}</Text>,
      },
      {
        key: 'period',
        header: 'Period',
        width: proportional(2),
        renderCell: row => (
          <Text color="secondary" hasTabularNumbers maxLines={1}>
            {fmt.range(row.periodStart, row.periodEnd)}
          </Text>
        ),
      },
      {
        key: 'amount',
        header: 'Amount',
        width: pixel(130),
        align: 'end',
        renderCell: row => (
          <Text weight="medium" hasTabularNumbers>
            {fmt.exactMoney(row.amount)}
          </Text>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        width: pixel(130),
        // Only the states someone must act on are badges; Paid is plain text.
        renderCell: row =>
          row.status === 'failed' ? (
            <Badge variant="error" label="Failed" />
          ) : row.status === 'overdue' ? (
            <Badge variant="warning" label="Overdue" />
          ) : (
            <Text color="secondary">Paid</Text>
          ),
      },
      {
        key: 'download',
        header: <VisuallyHidden>Download</VisuallyHidden>,
        width: pixel(64),
        align: 'end',
        renderCell: row => (
          <IconButton
            label={`Download ${row.number}`}
            tooltip={`Download ${row.number}`}
            icon={<Icon icon={ArrowDownTrayIcon} size="sm" />}
            variant="ghost"
            size="sm"
            onClick={() =>
              showToast({body: 'Download started', uniqueID: `download-${row.id}`})
            }
          />
        ),
      },
    ],
    [fmt, showToast],
  );

  // ----- Mutations -----
  const changePlan = (next: PlanId, nextInterval: Interval) => {
    const planChanged = next !== planId;
    setPlanId(next);
    setIntervalValue(nextInterval);
    showToast({
      body: planChanged
        ? `You're now on the ${PLAN_BY_ID[next].name} plan`
        : nextInterval === 'yearly'
          ? 'Switched to yearly billing'
          : 'Switched to monthly billing',
      uniqueID: 'plan-changed',
    });
  };

  const addSeats = (count: number) => {
    setSeatLimit(limit => limit + count);
    showToast({
      body: 'Seats added. The prorated charge is on its way to your billing email.',
      uniqueID: 'seats-added',
    });
  };

  const savePayment = (next: PaymentMethod) => {
    const hadOpen = invoices.some(i => i.status !== 'paid');
    setPayment(next);
    // A new card retries every open invoice.
    setInvoices(list => list.map(i => (i.status === 'paid' ? i : {...i, status: 'paid'})));
    showToast({
      body: hadOpen
        ? 'Payment method updated. Open invoices have been paid.'
        : 'Payment method updated',
      uniqueID: 'payment-updated',
    });
  };

  const cancelSubscription = () => {
    setIsCancelled(true);
    setIsCancelOpen(false);
    showToast({
      body: 'Subscription cancelled. Your team keeps access until the end of this period.',
      uniqueID: 'subscription-cancelled',
    });
  };

  const resumeSubscription = () => {
    setIsCancelled(false);
    showToast({body: 'Subscription resumed', uniqueID: 'subscription-resumed'});
  };

  // ----- Regions -----
  const planCard = (
    <Card padding={6} height="100%">
      <VStack gap={6} height="100%">
        <HStack gap={4} vAlign="start" wrap="wrap">
          <StackItem size="fill">
            <VStack gap={1.5}>
              <Heading level={2}>Current plan</Heading>
              <HStack gap={3} vAlign="center" wrap="wrap">
                <Text type="display-3" weight="semibold">
                  {plan.name}
                </Text>
                {isCancelled && <Badge variant="warning" label="Cancelling" />}
              </HStack>
              <Text color="secondary">
                <Text weight="medium" color="primary" hasTabularNumbers>
                  {fmt.money(pricePerSeat)}
                </Text>{' '}
                <span>per seat / month</span>
                {' · '}
                <span>{INTERVAL_LABEL[interval]}</span>
              </Text>
              <Text type="supporting" color="secondary">
                {plan.summary}
              </Text>
            </VStack>
          </StackItem>
          <ButtonGroup label="Plan actions">
            <Button
              label="Change plan"
              variant="secondary"
              onClick={() => setIsPlanOpen(true)}
            />
            <Button
              label="Add seats"
              variant="secondary"
              onClick={() => setIsSeatsOpen(true)}
            />
          </ButtonGroup>
        </HStack>
        {/* The facts sit on the card's bottom edge, level with the end of the
            payment method card beside it. */}
        <StackItem size="fill">{null}</StackItem>
        <Divider />
        <Grid columns={{minWidth: 160, repeat: 'fit'}} gap={6}>
          <Fact label={interval === 'yearly' ? 'Yearly total' : 'Monthly total'}>
            {fmt.money(periodTotal)}
          </Fact>
          <Fact label={isCancelled ? 'Ends on' : 'Renews on'}>{fmt.date(RENEWAL_DATE)}</Fact>
          <Fact label="Seats in use">
            {fmt.integer(SEATS_IN_USE)}
            <Text type="large" color="secondary">
              {' / '}
              {fmt.integer(seatLimit)}
            </Text>
          </Fact>
        </Grid>
      </VStack>
    </Card>
  );

  const paymentCard = (
    <Card padding={6} height="100%">
      <VStack gap={5}>
        <HStack gap={3} hAlign="between" vAlign="center">
          <Heading level={2}>Payment method</Heading>
          <Button
            label="Update"
            variant="secondary"
            size="sm"
            onClick={() => setIsPaymentOpen(true)}
          />
        </HStack>
        <HStack gap={3} vAlign="center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-element) bg-(--color-background-muted) text-(--color-text-secondary)">
            <Icon icon={CreditCardIcon} size="md" />
          </div>
          <VStack gap={0.5}>
            <HStack gap={2} vAlign="center">
              <Text weight="medium">{payment.brand}</Text>
              <Text weight="medium" hasTabularNumbers>
                {`•••• ${payment.last4}`}
              </Text>
            </HStack>
            <HStack gap={2} vAlign="center">
              <Text type="supporting" color="secondary">
                <span>Expires</span>{' '}
                <span>{fmt.expiry(payment.expMonth, payment.expYear)}</span>
              </Text>
              {isExpired && <Badge variant="error" label="Expired" />}
            </HStack>
          </VStack>
        </HStack>
        <Divider />
        <MetadataList label={{position: 'top'}}>
          <MetadataListItem label="Billing email">
            <Text>{payment.email}</Text>
          </MetadataListItem>
          <MetadataListItem label="Billing address">
            <VStack gap={0}>
              <Text>{payment.line1}</Text>
              <Text>
                <span>{payment.city}</span> <span>{payment.postalCode}</span>
              </Text>
              <Text>{payment.country}</Text>
            </VStack>
          </MetadataListItem>
        </MetadataList>
      </VStack>
    </Card>
  );

  const usage = (
    <Card padding={6}>
      <VStack gap={5}>
        <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap">
          <Heading level={2}>Usage this period</Heading>
          <Text color="secondary" hasTabularNumbers>
            {fmt.range(PERIOD_START, PERIOD_END)}
          </Text>
        </HStack>
        {nearLimit.length > 0 && (
          <Banner
            status="warning"
            title={
              nearLimit.length === 1
                ? `Warning: ${nearLimit[0].label} almost at the plan limit`
                : 'Warning: several limits almost reached'
            }
            description={
              planId === 'business'
                ? 'Usage above a limit is throttled until the next billing period. Contact sales for a higher quota.'
                : 'Usage above a limit is throttled until the next billing period. Upgrade your plan to raise the limit now.'
            }
            endContent={
              planId === 'business' ? undefined : (
                <Button
                  label="Compare plans"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsPlanOpen(true)}
                />
              )
            }
            collapsible={false}
          />
        )}
        <Grid columns={isWide ? 3 : 1} gap={8}>
          {meters.map(meter => (
            <UsageMeter key={meter.id} meter={meter} fmt={fmt} />
          ))}
        </Grid>
      </VStack>
    </Card>
  );

  const invoiceList = (
    <VStack gap={3}>
      <VStack gap={1}>
        <Heading level={2}>Invoices</Heading>
        <Text color="secondary">
          Invoices are emailed to the billing address when they are issued.
        </Text>
      </VStack>
      <Table<Invoice>
        data={invoices.slice(sliceStart, sliceEnd)}
        columns={columns}
        idKey="id"
        density="balanced"
        hasHover
        textOverflow="truncate"
        rowIndexStart={sliceStart + 1}
        rowCount={invoices.length}
      />
      <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap">
        <Text type="supporting" color="secondary" hasTabularNumbers>
          {fmt.integer(sliceStart + 1)}–{fmt.integer(sliceEnd)} <span>of</span>{' '}
          {fmt.integer(invoices.length)}
        </Text>
        {pageCount > 1 && (
          <Pagination
            page={currentPage}
            onChange={setPage}
            totalItems={invoices.length}
            pageSize={PAGE_SIZE}
            label="Invoice pages"
          />
        )}
      </HStack>
    </VStack>
  );

  const dangerZone = (
    <VStack gap={4}>
      <Divider />
      <HStack gap={6} vAlign="center" wrap="wrap">
        <StackItem size="fill">
          <VStack gap={1}>
            <Heading level={2}>
              {isCancelled ? 'Subscription cancelled' : 'Cancel subscription'}
            </Heading>
            <Text color="secondary">
              {isCancelled
                ? 'Your team keeps every feature until the end of this billing period, then the workspace moves to the Free plan.'
                : 'Stop the subscription at the end of this billing period. Your data is kept for 90 days in case you come back.'}
            </Text>
          </VStack>
        </StackItem>
        {isCancelled ? (
          <Button label="Resume subscription" variant="primary" onClick={resumeSubscription} />
        ) : (
          <Button
            label="Cancel subscription"
            variant="destructive"
            onClick={() => setIsCancelOpen(true)}
          />
        )}
      </HStack>
    </VStack>
  );

  return (
    <Layout
      height="fill"
      contentWidth={1160}
      padding={6}
      content={
        <LayoutContent>
          <VStack gap={6}>
            <VStack gap={1}>
              <Heading level={1}>Billing</Heading>
              <Text color="secondary">
                Plan, usage, payment method and invoices for Meridian Works.
              </Text>
            </VStack>

            {hasFailedPayment && (
              <Banner
                status="error"
                title="Payment failed"
                description={`We couldn't charge your October renewal because the card on file has expired. Update the payment method to keep ${WORKSPACE} active.`}
                endContent={
                  <Button
                    label="Update payment method"
                    variant="primary"
                    size="sm"
                    onClick={() => setIsPaymentOpen(true)}
                  />
                }
                collapsible={false}
              />
            )}

            <Grid columns={isWide ? 3 : 1} gap={4}>
              <GridSpan columns={isWide ? 2 : 1}>{planCard}</GridSpan>
              {paymentCard}
            </Grid>

            {usage}
            {invoiceList}
            {dangerZone}
          </VStack>

          <ChangePlanDialog
            key={`${planId}-${interval}`}
            isOpen={isPlanOpen}
            onOpenChange={setIsPlanOpen}
            currentPlan={planId}
            currentInterval={interval}
            seats={seatLimit}
            fmt={fmt}
            onConfirm={changePlan}
          />
          <AddSeatsDialog
            isOpen={isSeatsOpen}
            onOpenChange={setIsSeatsOpen}
            seatLimit={seatLimit}
            pricePerSeat={pricePerSeat}
            fmt={fmt}
            onConfirm={addSeats}
          />
          <PaymentDialog
            key={payment.last4}
            isOpen={isPaymentOpen}
            onOpenChange={setIsPaymentOpen}
            payment={payment}
            onSave={savePayment}
          />
          <AlertDialog
            isOpen={isCancelOpen}
            onOpenChange={setIsCancelOpen}
            title={`Cancel the ${plan.name} plan?`}
            description={`${WORKSPACE} keeps every feature until the end of this billing period. After that it moves to the Free plan: only 3 members keep access, storage above 5 GB becomes read-only, and API keys stop working. You can resubscribe at any time.`}
            actionLabel="Cancel subscription"
            cancelLabel="Keep subscription"
            width={460}
            onAction={cancelSubscription}
          />
        </LayoutContent>
      }
    />
  );
}

/**
 * The page owns its toast viewport, so toasts inherit its direction and theme;
 * an app shell that already provides one can drop this wrapper.
 */
export default function SettingsBillingTemplate() {
  return (
    <ToastViewport>
      <BillingPage />
    </ToastViewport>
  );
}
