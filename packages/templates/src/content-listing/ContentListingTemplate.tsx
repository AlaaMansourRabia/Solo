'use client';

/**
 * The detail page of one bookable place: a photo gallery across the top, the
 * facts about the place in the main column, and a booking panel on the end
 * side that prices the stay as the dates and guests change. The fixture is a
 * holiday loft on Dubai Creek, priced per night in UAE dirhams.
 *
 * What picks this template over `product-detail` is that the thing on the
 * page is a **place you book for dates**, not an item you add to a cart. The
 * questions a visitor brings are different: what does it look like inside,
 * how many people does it sleep, where exactly is it, what are the rules, what
 * did people who stayed say — and is it free for *my* nights, and what will
 * those nights cost in total? So the page is built around a gallery that opens
 * full screen, key facts, location, policies and reviews, with the price
 * never shown as a single number but as nights × rate + fees for the dates
 * the visitor picked. A product page has variants and a quantity; this page
 * has availability and a stay.
 *
 * The same shape fits anything rented by the night or by the day: holiday
 * homes and hotel rooms, meeting venues and coworking studios, boats, camping
 * pitches, event halls. Swap the fixture (photos, facts, amenities, nearby
 * places, rules) and keep the structure.
 *
 * ## Extending this template
 *
 * ### The gallery
 *
 * **A Carousel of cards, each opening the Lightbox at its own index.** Every
 * photo is a `ClickableCard` so it is a real button with an accessible name
 * (the photo's description) and a focus ring; the `<img>` inside is decorative
 * (`alt=""`) because the card already names it. The Lightbox gets the same
 * `PHOTOS` array with `alt` and `caption`, and its index is controlled so the
 * card that was clicked is the photo that opens. "Show all photos" opens the
 * Lightbox at the first photo — the Carousel is for browsing, the Lightbox for
 * looking closely; do not add zoom unless the photos are high-resolution.
 *
 * **Photo sizes follow their orientation.** Landscape and portrait photos keep
 * their own width at one shared height, so the strip reads as a contact sheet
 * rather than a row of crops. When photos come from hosts, store the
 * orientation (or the pixel size) with each photo instead of guessing it.
 *
 * ### The booking panel
 *
 * **The price is derived, never stored.** Nights, the subtotal, every fee and
 * the total are computed from `range` and `NIGHTLY_RATE` on each render
 * (`quote()`), so the breakdown cannot drift from the dates on screen. In a
 * real app the quote comes from the server — taxes, discounts for long stays
 * and seasonal rates live there — but keep the shape: one function from
 * (dates, guests) to line items, and the panel only renders line items.
 *
 * **Money and dates go through `Intl` with the active locale.** `useLocale()`
 * feeds `Intl.NumberFormat` (currency) and `Intl.DateTimeFormat` (review
 * months, refund deadlines, check-in times), so Arabic gets Arabic digits,
 * its own currency layout and word order. Never glue "AED" and a number
 * together by hand.
 *
 * **Unavailable nights are disabled in the picker *and* checked after.** The
 * DateRangeInput greys out booked nights through `dateConstraints`, but a
 * range can still be drawn across them, so `bookedNightsIn()` re-checks the
 * picked range and the field shows an error status in place. Both read the
 * same `BOOKED_NIGHTS` list. Because a booked night is disabled as a day, a
 * check-out on the morning a booking starts cannot be picked here; if that
 * matters, model check-in and check-out availability separately.
 *
 * **Reserve validates, then confirms with a Toast.** A missing or blocked
 * range turns into a field error, never a toast; a valid request shows a
 * short Toast because the next step (the host accepting) happens elsewhere.
 * Replace it with navigation to a checkout page when payment happens on the
 * site.
 *
 * **Sticky beside, inline below.** At wide widths the panel sits in its own
 * column and sticks to the top of the scroll area while the facts scroll past.
 * Below the breakpoint (`useMediaQuery`) it moves into the main column, right
 * after the key facts, so it is reached before the long sections.
 *
 * ### Facts, amenities, rules and reviews
 *
 * **Key facts are a MetadataList** because each is a label and a value
 * (guests: 4). Amenities are a list of things with icons; the page shows the
 * highlights and "Show all" opens the grouped full list in a Dialog on wide
 * screens and a BottomSheet on narrow ones (BottomSheet is the touch surface),
 * from the same `AMENITY_GROUPS` data.
 *
 * **Rules and policies are Collapsibles, open by default for the house
 * rules.** People must be able to find the cancellation terms, so they are a
 * labelled section on the page, not a link to another page; the refund
 * deadlines are computed from the check-in date the visitor picked.
 *
 * **One review is pulled out as a Blockquote.** It is a real review from the
 * list, attributed with `cite`, not marketing copy. Review dates are shown as
 * month and year — people care whether a review is recent, not the exact day.
 */

import {useState, type CSSProperties, type ReactNode} from 'react';
import {Avatar} from '@solo/core/Avatar';
import {Badge} from '@solo/core/Badge';
import {Blockquote} from '@solo/core/Blockquote';
import {BottomSheet} from '@solo/core/BottomSheet';
import {BreadcrumbItem, Breadcrumbs} from '@solo/core/Breadcrumbs';
import {Button} from '@solo/core/Button';
import type {DateRange, ISODateString} from '@solo/core/Calendar';
import {Card} from '@solo/core/Card';
import {Carousel} from '@solo/core/Carousel';
import {ClickableCard} from '@solo/core/ClickableCard';
import {Collapsible, CollapsibleGroup} from '@solo/core/Collapsible';
import {DateRangeInput} from '@solo/core/DateRangeInput';
import {Dialog, DialogHeader} from '@solo/core/Dialog';
import {Divider} from '@solo/core/Divider';
import {Grid} from '@solo/core/Grid';
import {useMediaQuery} from '@solo/core/hooks';
import {useLocale} from '@solo/core/i18n';
import {Icon} from '@solo/core/Icon';
import {Layout, LayoutContent} from '@solo/core/Layout';
import {Lightbox, type LightboxMedia} from '@solo/core/Lightbox';
import {List, ListItem} from '@solo/core/List';
import {MetadataList, MetadataListItem} from '@solo/core/MetadataList';
import {NumberInput} from '@solo/core/NumberInput';
import {HStack, Stack, StackItem, VStack} from '@solo/core/Stack';
import {Heading, Text} from '@solo/core/Text';
import {useToast} from '@solo/core/Toast';
import {VisuallyHidden} from '@solo/core/VisuallyHidden';
import {
  AirVent,
  AlarmSmoke,
  Baby,
  Bath,
  BedDouble,
  Blinds,
  Building2,
  Cctv,
  Coffee,
  CookingPot,
  Dumbbell,
  Fan,
  FireExtinguisher,
  Heart,
  Images,
  KeyRound,
  Landmark,
  Laptop,
  MapPin,
  Microwave,
  Plane,
  Refrigerator,
  Share2,
  Shirt,
  Ship,
  ShoppingBag,
  SquareParking,
  Star,
  Sun,
  TrainFront,
  Tv,
  Utensils,
  WashingMachine,
  WavesLadder,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

import {templateAsset} from '../assets';

// ── Data ──────────────────────────────────────────────────────────────────────

// A fixed "today" keeps the mock deterministic: booked nights, the default
// stay and review dates line up no matter when the template is opened.
const TODAY: ISODateString = '2026-11-09';
const LAST_BOOKABLE_DAY: ISODateString = '2027-05-31';
const CURRENCY = 'AED';
const NIGHTLY_RATE = 1250;
const CLEANING_FEE = 180;
const SERVICE_FEE_RATE = 0.08;
// Dubai's per-night tourism fee for a holiday home of this size.
const TOURISM_FEE_PER_NIGHT = 15;
const MIN_NIGHTS = 2;
const MAX_NIGHTS = 28;
const MAX_GUESTS = 4;
const WIDE_QUERY = '(min-width: 1080px)';

const LISTING = {
  name: 'Al Seef Loft — Dubai Creek',
  kind: 'Entire loft in Bur Dubai, United Arab Emirates',
  location: 'Al Seef, Bur Dubai, Dubai',
  rating: 4.92,
  reviewCount: 128,
  description: [
    'A bright two-bedroom loft on the third floor of a restored wind-tower building, right on the Al Seef promenade. The living room windows look straight onto Dubai Creek, where the wooden abras cross to the souks from early morning until midnight.',
    'Inside: a full kitchen, a dining table for six, a long oak desk for working days and a private balcony over the water. Old Dubai — the textile souk, Al Fahidi and the museums — is a short walk away.',
  ],
};

const HOST = {
  name: 'Mariam Al Falasi',
  since: 'Superhost · Hosting since 2019',
  response: 'Usually replies within an hour',
};

type Photo = LightboxMedia & {orientation: 'landscape' | 'portrait'};

const PHOTOS: Photo[] = [
  {
    src: templateAsset('colorful-home-horizontal-1.png'),
    alt: 'Living room with a modular sofa under tall windows',
    caption: 'Living room with a modular sofa under tall windows',
    orientation: 'landscape',
  },
  {
    src: templateAsset('light-home-horizontal-1.png'),
    alt: 'Dining table for six beside the creek-facing window',
    caption: 'Dining table for six beside the creek-facing window',
    orientation: 'landscape',
  },
  {
    src: templateAsset('colorful-home-vertical-1.png'),
    alt: 'Reading corner with a green lounge chair',
    caption: 'Reading corner with a green lounge chair',
    orientation: 'portrait',
  },
  {
    src: templateAsset('colorful-home-horizontal-2.png'),
    alt: 'Snug with a gallery wall and a velvet sofa',
    caption: 'Snug with a gallery wall and a velvet sofa',
    orientation: 'landscape',
  },
  {
    src: templateAsset('moody-home-horizontal-1.png'),
    alt: 'Workspace with a long oak desk',
    caption: 'Workspace with a long oak desk',
    orientation: 'landscape',
  },
  {
    src: templateAsset('moody-home-vertical-1.png'),
    alt: 'Evening lounge with a pendant lamp',
    caption: 'Evening lounge with a pendant lamp',
    orientation: 'portrait',
  },
  {
    src: templateAsset('light-lifestyle-horizontal-1.png'),
    alt: 'Record player and the host’s vinyl collection',
    caption: 'Record player and the host’s vinyl collection',
    orientation: 'landscape',
  },
];

type Amenity = {icon: LucideIcon; label: string};

// One list feeds the highlights on the page and the grouped list in the
// "Show all" surface, so the two can never disagree.
const AMENITY_GROUPS: ReadonlyArray<{title: string; items: Amenity[]}> = [
  {
    title: 'Location features',
    items: [
      {icon: Ship, label: 'Creek view'},
      {icon: Sun, label: 'Private balcony'},
    ],
  },
  {
    title: 'Internet and office',
    items: [
      {icon: Wifi, label: 'Fast wifi — 500 Mbps'},
      {icon: Laptop, label: 'Dedicated workspace'},
    ],
  },
  {
    title: 'Kitchen and dining',
    items: [
      {icon: CookingPot, label: 'Full kitchen'},
      {icon: Refrigerator, label: 'Refrigerator'},
      {icon: Microwave, label: 'Microwave'},
      {icon: Coffee, label: 'Espresso machine'},
      {icon: Utensils, label: 'Dining table for six'},
    ],
  },
  {
    title: 'Heating and cooling',
    items: [
      {icon: AirVent, label: 'Central air conditioning'},
      {icon: Fan, label: 'Ceiling fans'},
    ],
  },
  {
    title: 'Bedroom and laundry',
    items: [
      {icon: BedDouble, label: 'King bed and two singles'},
      {icon: Blinds, label: 'Blackout blinds'},
      {icon: WashingMachine, label: 'Washer and dryer'},
      {icon: Shirt, label: 'Iron and ironing board'},
      {icon: Bath, label: 'Bathtub'},
    ],
  },
  {
    title: 'Entertainment and family',
    items: [
      {icon: Tv, label: '55-inch TV with streaming apps'},
      {icon: Baby, label: 'Travel cot on request'},
    ],
  },
  {
    title: 'Building',
    items: [
      {icon: KeyRound, label: 'Self check-in with a smart lock'},
      {icon: SquareParking, label: 'Free parking on premises'},
      {icon: WavesLadder, label: 'Shared rooftop pool'},
      {icon: Dumbbell, label: 'Building gym'},
      {icon: Building2, label: 'Elevator'},
    ],
  },
  {
    title: 'Safety',
    items: [
      {icon: AlarmSmoke, label: 'Smoke alarm'},
      {icon: FireExtinguisher, label: 'Fire extinguisher'},
      {icon: Cctv, label: 'Security cameras at the building entrance'},
    ],
  },
];

const ALL_AMENITIES = AMENITY_GROUPS.flatMap(group => group.items);
const HIGHLIGHTED = [
  'Creek view',
  'Fast wifi — 500 Mbps',
  'Dedicated workspace',
  'Full kitchen',
  'Shared rooftop pool',
  'Free parking on premises',
  'Central air conditioning',
  'Self check-in with a smart lock',
].map(label => ALL_AMENITIES.find(amenity => amenity.label === label)!);

const NEARBY: ReadonlyArray<{icon: LucideIcon; label: string; distance: string}> = [
  {icon: Ship, label: 'Al Seef abra station', distance: '3 min walk'},
  {icon: Landmark, label: 'Al Fahidi Historical Neighbourhood', distance: '8 min walk'},
  {icon: TrainFront, label: 'Sharaf DG metro station', distance: '10 min walk'},
  {icon: ShoppingBag, label: 'Gold Souk, across the creek by abra', distance: '12 min'},
  {icon: Plane, label: 'Dubai International Airport (DXB)', distance: '15 min drive'},
];

const HOUSE_RULES = [
  'Up to 4 guests; infants under 2 stay free',
  'No parties or events',
  'No smoking, including on the balcony',
  'Pets are not allowed',
  'Quiet hours from 11:00 PM to 7:00 AM',
];

const SAFETY_NOTES = [
  'Smoke alarm and fire extinguisher in the hallway',
  'The balcony railing is 1.1 m high — keep an eye on young children',
  'Security cameras cover the building entrance and lobby only',
];

const SCORES: ReadonlyArray<{label: string; value: number}> = [
  {label: 'Cleanliness', value: 4.9},
  {label: 'Accuracy', value: 4.9},
  {label: 'Check-in', value: 5},
  {label: 'Communication', value: 5},
  {label: 'Location', value: 4.9},
  {label: 'Value', value: 4.7},
];

type Review = {
  id: string;
  name: string;
  from: string;
  date: ISODateString;
  rating: number;
  text: string;
};

const REVIEWS: Review[] = [
  {
    id: 'layla',
    name: 'Layla Haddad',
    from: 'Amman, Jordan',
    date: '2026-10-24',
    rating: 5,
    text: 'Waking up to the abras crossing the creek was the highlight of our trip. The loft is even brighter than the photos, and Mariam left a handwritten list of places to eat in Al Fahidi that we used every day.',
  },
  {
    id: 'james',
    name: 'James Whitaker',
    from: 'London, United Kingdom',
    date: '2026-10-11',
    rating: 5,
    text: 'Quiet, spotless and a three-minute walk from the abra station. The desk by the window made a working week in Dubai genuinely pleasant.',
  },
  {
    id: 'noura',
    name: 'Noura Al Mansoori',
    from: 'Abu Dhabi, United Arab Emirates',
    date: '2026-09-28',
    rating: 4,
    text: 'Great location and a beautiful space. Music from the promenade carries until about 11 PM on weekends, so light sleepers should take the back bedroom.',
  },
  {
    id: 'kenji',
    name: 'Kenji Morita',
    from: 'Osaka, Japan',
    date: '2026-09-03',
    rating: 5,
    text: 'Check-in was effortless and the kitchen had everything we needed for a family of four. We would come back in a heartbeat.',
  },
];

// Nights that are already booked, identified by the date the night starts.
const BOOKED_NIGHTS: ReadonlySet<string> = new Set([
  '2026-11-12',
  '2026-11-13',
  '2026-11-14',
  '2026-11-26',
  '2026-11-27',
  '2026-11-28',
  '2026-12-04',
  '2026-12-05',
  '2026-12-19',
  '2026-12-20',
  '2026-12-21',
  '2026-12-22',
  '2026-12-23',
  '2026-12-24',
  '2026-12-25',
]);

// ── Styles ────────────────────────────────────────────────────────────────────

// The booking panel holds its width and pins itself while the facts scroll;
// the offset matches the page padding so a stuck panel sits where it started.
const bookingColumn: CSSProperties = {
  width: 380,
  flexShrink: 0,
  position: 'sticky',
  top: 'var(--spacing-6)',
  alignSelf: 'flex-start',
};

// Fills the gallery card. No image primitive: the card supplies the radius,
// the focus ring and the button semantics; the image only covers.
const photoImage: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const DAY_MS = 86_400_000;

function toUTC(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function toISO(ms: number): ISODateString {
  return new Date(ms).toISOString().slice(0, 10) as ISODateString;
}

function nightsIn(range: DateRange | null): number {
  if (!range) return 0;
  return Math.round((toUTC(range.end) - toUTC(range.start)) / DAY_MS);
}

/** Booked nights between check-in (included) and check-out (excluded). */
function bookedNightsIn(range: DateRange | null): string[] {
  if (!range) return [];
  const found: string[] = [];
  for (let t = toUTC(range.start); t < toUTC(range.end); t += DAY_MS) {
    const iso = toISO(t);
    if (BOOKED_NIGHTS.has(iso)) found.push(iso);
  }
  return found;
}

// DateRangeInput constraints return true for days that may be picked.
const DATE_CONSTRAINTS: ReadonlyArray<(date: Date) => boolean> = [
  date => !BOOKED_NIGHTS.has(toISO(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))),
];

/** Line items for a stay — the only place the price is worked out. */
function quote(nights: number) {
  const subtotal = nights * NIGHTLY_RATE;
  const service = Math.round(subtotal * SERVICE_FEE_RATE);
  const tourism = nights * TOURISM_FEE_PER_NIGHT;
  return {
    subtotal,
    fees: [
      {label: 'Cleaning fee', amount: CLEANING_FEE},
      {label: 'Service fee', amount: service},
      {label: 'Tourism Dirham fee', amount: tourism},
    ],
    total: subtotal + CLEANING_FEE + service + tourism,
  };
}

const nightsLabel = (n: number) => (n === 1 ? '1 night' : `${n} nights`);

// ── Small pieces ──────────────────────────────────────────────────────────────

function StarRow({rating}: {rating: number}) {
  return (
    <HStack gap={0.5} vAlign="center" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({length: 5}, (_, i) => (
        <Icon
          key={i}
          icon={Star}
          size="sm"
          color={i < rating ? 'primary' : 'disabled'}
          className={i < rating ? 'fill-current' : undefined}
        />
      ))}
    </HStack>
  );
}

function AmenityRow({amenity}: {amenity: Amenity}) {
  return (
    <HStack gap={3} vAlign="center">
      <Icon icon={amenity.icon} size="md" color="secondary" />
      <Text type="body">{amenity.label}</Text>
    </HStack>
  );
}

function AmenityGroups() {
  return (
    <VStack gap={6}>
      {AMENITY_GROUPS.map(group => (
        <List
          key={group.title}
          hasDividers
          header={<Heading level={3}>{group.title}</Heading>}>
          {group.items.map(item => (
            <ListItem
              key={item.label}
              label={item.label}
              startContent={<Icon icon={item.icon} size="md" color="secondary" />}
            />
          ))}
        </List>
      ))}
    </VStack>
  );
}

function SectionHeading({title, description}: {title: string; description?: ReactNode}) {
  return (
    <VStack gap={1}>
      <Heading level={2}>{title}</Heading>
      {description && (
        <Text type="supporting" color="secondary">
          {description}
        </Text>
      )}
    </VStack>
  );
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function ContentListingTemplate() {
  const locale = useLocale();
  const isWide = useMediaQuery(WIDE_QUERY);
  const showToast = useToast();

  const [photoIndex, setPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [range, setRange] = useState<DateRange | null>({
    start: '2026-11-18',
    end: '2026-11-22',
  });
  const [guests, setGuests] = useState(2);
  const [attempted, setAttempted] = useState(false);

  // ── Formatting (locale-aware) ──────────────────────────────────────────────

  const money = (amount: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: CURRENCY,
      maximumFractionDigits: 0,
    }).format(amount);
  const decimal = (value: number, digits: number) =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  const time = (hour: number) =>
    new Intl.DateTimeFormat(locale, {hour: 'numeric', minute: '2-digit'}).format(
      new Date(2026, 0, 1, hour),
    );
  const monthYear = (iso: string) =>
    new Intl.DateTimeFormat(locale, {month: 'long', year: 'numeric', timeZone: 'UTC'}).format(
      toUTC(iso),
    );
  const longDay = (ms: number) =>
    new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(ms);

  // ── Derived booking state ──────────────────────────────────────────────────

  const nights = nightsIn(range);
  const clashes = bookedNightsIn(range);
  const rangeError = !range
    ? attempted
      ? 'Choose your check-in and check-out dates.'
      : undefined
    : clashes.length > 0
      ? 'Some of these nights are already booked. Choose other dates.'
      : nights < MIN_NIGHTS
        ? 'The minimum stay is 2 nights.'
        : undefined;
  const isValid = !!range && !rangeError;
  const price = isValid ? quote(nights) : null;

  const reserve = () => {
    setAttempted(true);
    if (!isValid) return;
    showToast({body: 'Reservation request sent to Mariam', uniqueID: 'listing-reserve'});
  };

  const openPhoto = (index: number) => {
    setPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  // ── Header ─────────────────────────────────────────────────────────────────

  const header = (
    <VStack gap={4}>
      <Breadcrumbs>
        <BreadcrumbItem href="#">Stays</BreadcrumbItem>
        <BreadcrumbItem href="#">Dubai</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Al Seef Loft</BreadcrumbItem>
      </Breadcrumbs>
      <HStack gap={4} vAlign="end" hAlign="between" wrap="wrap">
        <VStack gap={2}>
          <Heading level={1}>{LISTING.name}</Heading>
          <HStack gap={3} vAlign="center" wrap="wrap">
            <HStack gap={1} vAlign="center">
              <Icon icon={Star} size="sm" color="primary" className="fill-current" />
              <Text type="label">{decimal(LISTING.rating, 2)}</Text>
              <Text type="body" color="secondary">
                ·
              </Text>
              <Text type="body" color="secondary">
                {`${LISTING.reviewCount} reviews`}
              </Text>
            </HStack>
            <Badge variant="neutral" label="Guest favourite" />
            <HStack gap={1} vAlign="center">
              <Icon icon={MapPin} size="sm" color="secondary" />
              <Text type="body" color="secondary">
                {LISTING.location}
              </Text>
            </HStack>
          </HStack>
        </VStack>
        <HStack gap={2}>
          <Button
            label="Share"
            variant="ghost"
            icon={<Icon icon={Share2} size="sm" />}
            onClick={() => showToast({body: 'Link copied', uniqueID: 'listing-share'})}
          />
          <Button
            label={isSaved ? 'Saved' : 'Save'}
            variant="ghost"
            aria-pressed={isSaved}
            icon={
              <Icon icon={Heart} size="sm" className={isSaved ? 'fill-current' : undefined} />
            }
            onClick={() => {
              setIsSaved(saved => !saved);
              showToast({
                body: isSaved ? 'Removed from your wishlist' : 'Saved to your wishlist',
                uniqueID: 'listing-save',
              });
            }}
          />
        </HStack>
      </HStack>
    </VStack>
  );

  // ── Gallery ────────────────────────────────────────────────────────────────

  const photoHeight = isWide ? 380 : 260;
  const gallery = (
    <VStack gap={3}>
      <Carousel aria-label="Photos of Al Seef Loft" gap={3} hasSnap hasLoop>
        {PHOTOS.map((photo, index) => (
          <ClickableCard
            key={photo.src}
            label={photo.alt}
            padding={0}
            width={
              photo.orientation === 'landscape'
                ? `min(${Math.round(photoHeight * 1.5)}px, 85vw)`
                : Math.round(photoHeight * 0.75)
            }
            height={photoHeight}
            className="overflow-hidden"
            onClick={() => openPhoto(index)}>
            <img src={photo.src} alt="" style={photoImage} />
          </ClickableCard>
        ))}
      </Carousel>
      <HStack gap={2} vAlign="center" hAlign="between" wrap="wrap">
        <Text type="supporting" color="secondary">
          Select a photo to see it full screen.
        </Text>
        <Button
          label={`Show all ${PHOTOS.length} photos`}
          size="sm"
          variant="secondary"
          icon={<Icon icon={Images} size="sm" />}
          onClick={() => openPhoto(0)}
        />
      </HStack>
      <Lightbox
        isOpen={isLightboxOpen}
        onOpenChange={setIsLightboxOpen}
        media={PHOTOS.map(({src, alt, caption}) => ({src, alt, caption}))}
        index={photoIndex}
        onIndexChange={setPhotoIndex}
      />
    </VStack>
  );

  // ── Booking panel ──────────────────────────────────────────────────────────

  const breakdown = price ? (
    <VStack gap={3}>
      <HStack gap={3} hAlign="between" vAlign="center">
        <HStack gap={1} vAlign="center" wrap="wrap">
          <Text type="body">{nightsLabel(nights)}</Text>
          <Text type="body" color="secondary">
            ×
          </Text>
          <Text type="body">{money(NIGHTLY_RATE)}</Text>
        </HStack>
        <Text type="body" hasTabularNumbers>
          {money(price.subtotal)}
        </Text>
      </HStack>
      {price.fees.map(fee => (
        <HStack key={fee.label} gap={3} hAlign="between" vAlign="center">
          <Text type="body" color="secondary">
            {fee.label}
          </Text>
          <Text type="body" hasTabularNumbers>
            {money(fee.amount)}
          </Text>
        </HStack>
      ))}
      <Divider />
      <HStack gap={3} hAlign="between" vAlign="center">
        <Text type="label">Total</Text>
        <Text type="label" hasTabularNumbers>
          {money(price.total)}
        </Text>
      </HStack>
    </VStack>
  ) : (
    <Text type="supporting" color="secondary">
      Choose available dates to see the total price.
    </Text>
  );

  const bookingPanel = (
    <Card padding={6} elevation={isWide ? 'low' : 'none'}>
      <VStack as="section" gap={5} aria-labelledby="listing-booking-heading">
        <VisuallyHidden>
          <Heading level={2} id="listing-booking-heading">
            Book this place
          </Heading>
        </VisuallyHidden>
        <HStack gap={3} hAlign="between" vAlign="end" wrap="wrap">
          <HStack gap={1} vAlign="end">
            <Text type="large" weight="bold">
              {money(NIGHTLY_RATE)}
            </Text>
            <Text type="body" color="secondary">
              per night
            </Text>
          </HStack>
          <HStack gap={1} vAlign="center">
            <Icon icon={Star} size="xsm" color="primary" className="fill-current" />
            <Text type="supporting">{decimal(LISTING.rating, 2)}</Text>
          </HStack>
        </HStack>
        <VStack gap={4}>
          <DateRangeInput
            label="Check-in and check-out"
            description="2-night minimum. Greyed-out dates are booked."
            placeholder="Add dates"
            value={range}
            onChange={setRange}
            min={TODAY}
            max={LAST_BOOKABLE_DAY}
            dateConstraints={DATE_CONSTRAINTS}
            maxRangeSpan={MAX_NIGHTS + 1}
            width="100%"
            status={rangeError ? {type: 'error', message: rangeError} : undefined}
          />
          <NumberInput
            label="Guests"
            description="Up to 4 guests. Infants under 2 stay free."
            value={guests}
            onChange={setGuests}
            min={1}
            max={MAX_GUESTS}
            isIntegerOnly
            hasNumberSteppers
            width="100%"
          />
        </VStack>
        <VStack gap={2}>
          <Button label="Reserve" variant="primary" size="lg" width="100%" onClick={reserve} />
          <Text type="supporting" color="secondary" justify="center">
            You won’t be charged yet
          </Text>
        </VStack>
        {breakdown}
      </VStack>
    </Card>
  );

  // ── Main column sections ───────────────────────────────────────────────────

  const intro = (
    <VStack gap={6}>
      <HStack gap={4} vAlign="center">
        <Avatar name={HOST.name} size="lg" />
        <StackItem size="fill">
          <VStack gap={0.5}>
            <Heading level={2}>Hosted by Mariam Al Falasi</Heading>
            <Text type="supporting" color="secondary">
              {HOST.since}
            </Text>
          </VStack>
        </StackItem>
      </HStack>
      <Divider />
      <VStack gap={3}>
        <Text type="large">{LISTING.kind}</Text>
        {LISTING.description.map(paragraph => (
          <Text key={paragraph.slice(0, 24)} as="p" type="body" color="secondary">
            {paragraph}
          </Text>
        ))}
      </VStack>
      <MetadataList columns={isWide ? 4 : 2} label={{position: 'top'}}>
        <MetadataListItem label="Guests">Up to 4</MetadataListItem>
        <MetadataListItem label="Bedrooms">{decimal(2, 0)}</MetadataListItem>
        <MetadataListItem label="Beds">{decimal(3, 0)}</MetadataListItem>
        <MetadataListItem label="Bathrooms">{decimal(2, 0)}</MetadataListItem>
        <MetadataListItem label="Size">120 m²</MetadataListItem>
        <MetadataListItem label="Check-in from">{time(15)}</MetadataListItem>
        <MetadataListItem label="Check-out by">{time(11)}</MetadataListItem>
        <MetadataListItem label="Floor">3rd, with elevator</MetadataListItem>
      </MetadataList>
    </VStack>
  );

  const amenities = (
    <VStack gap={5}>
      <SectionHeading title="What this place offers" />
      <Grid columns={{minWidth: 240, max: 2}} rowGap={4} columnGap={6}>
        {HIGHLIGHTED.map(amenity => (
          <AmenityRow key={amenity.label} amenity={amenity} />
        ))}
      </Grid>
      <HStack>
        <Button
          label={`Show all ${ALL_AMENITIES.length} amenities`}
          variant="secondary"
          onClick={() => setIsAmenitiesOpen(true)}
        />
      </HStack>
      {isWide ? (
        <Dialog isOpen={isAmenitiesOpen} onOpenChange={setIsAmenitiesOpen} width={560}>
          <Layout
            height="auto"
            padding={4}
            defaultHasDividers={false}
            header={
              <DialogHeader
                title="What this place offers"
                subtitle={`${ALL_AMENITIES.length} amenities`}
                onOpenChange={setIsAmenitiesOpen}
              />
            }
            content={
              <LayoutContent>
                <AmenityGroups />
              </LayoutContent>
            }
          />
        </Dialog>
      ) : (
        <BottomSheet
          isOpen={isAmenitiesOpen}
          onOpenChange={setIsAmenitiesOpen}
          label="What this place offers"
          height="tall">
          <VStack gap={4} padding={4}>
            <Heading level={2}>What this place offers</Heading>
            <AmenityGroups />
          </VStack>
        </BottomSheet>
      )}
    </VStack>
  );

  const location = (
    <VStack gap={5}>
      <SectionHeading
        title="Where you’ll be"
        description="Al Seef Street, Bur Dubai, Dubai, United Arab Emirates"
      />
      <Text as="p" type="body" color="secondary">
        The loft sits on the quiet end of the Al Seef promenade, between the
        heritage quarter and the abra docks. Cafés and the textile souk are on
        the doorstep; the beaches are a 25-minute taxi ride away.
      </Text>
      <List hasDividers header={<Heading level={3}>Getting around</Heading>}>
        {NEARBY.map(place => (
          <ListItem
            key={place.label}
            label={place.label}
            startContent={<Icon icon={place.icon} size="md" color="secondary" />}
            endContent={
              <Text type="supporting" color="secondary">
                {place.distance}
              </Text>
            }
          />
        ))}
      </List>
    </VStack>
  );

  const checkIn = range ? toUTC(range.start) : null;
  const thingsToKnow = (
    <VStack gap={4}>
      <SectionHeading title="Things to know" />
      <CollapsibleGroup type="multiple" hasDividers defaultValue={['rules']}>
        <Collapsible value="rules" trigger="House rules">
          <List listStyle="disc" density="compact">
            {HOUSE_RULES.map(rule => (
              <ListItem key={rule} label={rule} />
            ))}
          </List>
        </Collapsible>
        <Collapsible value="cancellation" trigger="Cancellation policy">
          <VStack gap={4}>
            <Text type="body" color="secondary">
              Cancel up to 7 days before check-in for a full refund, or up to 2
              days before for half of the nightly price back. Cleaning and
              service fees are refunded with any refund.
            </Text>
            {checkIn != null && (
              <MetadataList columns="single" label={{position: 'start', width: 200}}>
                <MetadataListItem label="Full refund until">
                  {longDay(checkIn - 7 * DAY_MS)}
                </MetadataListItem>
                <MetadataListItem label="50% refund until">
                  {longDay(checkIn - 2 * DAY_MS)}
                </MetadataListItem>
                <MetadataListItem label="No refund from">
                  {longDay(checkIn - 1 * DAY_MS)}
                </MetadataListItem>
              </MetadataList>
            )}
          </VStack>
        </Collapsible>
        <Collapsible value="safety" trigger="Safety and property">
          <List listStyle="disc" density="compact">
            {SAFETY_NOTES.map(note => (
              <ListItem key={note} label={note} />
            ))}
          </List>
        </Collapsible>
      </CollapsibleGroup>
    </VStack>
  );

  const highlight = REVIEWS[0];
  const reviews = (
    <VStack gap={6}>
      <HStack gap={2} vAlign="center">
        <Icon icon={Star} size="md" color="primary" className="fill-current" />
        <Heading level={2}>{decimal(LISTING.rating, 2)}</Heading>
        <Heading level={2} color="secondary">
          ·
        </Heading>
        <Heading level={2}>{`${LISTING.reviewCount} reviews`}</Heading>
      </HStack>
      <MetadataList columns={3} label={{position: 'top'}}>
        {SCORES.map(score => (
          <MetadataListItem key={score.label} label={score.label}>
            {decimal(score.value, 1)}
          </MetadataListItem>
        ))}
      </MetadataList>
      <Blockquote
        cite={
          <HStack as="span" gap={1} wrap="wrap">
            <span>{highlight.name}</span>
            <span>·</span>
            <span>{monthYear(highlight.date)}</span>
          </HStack>
        }>
        <Text type="large" weight="normal">
          The loft is even brighter than the photos, and Mariam left a
          handwritten list of places to eat in Al Fahidi that we used every day.
        </Text>
      </Blockquote>
      <Grid columns={{minWidth: 300, max: 2}} rowGap={8} columnGap={8}>
        {REVIEWS.map(review => (
          <VStack key={review.id} as="article" gap={3}>
            <HStack gap={3} vAlign="center">
              <Avatar name={review.name} size="md" />
              <VStack gap={0}>
                <Heading level={3}>{review.name}</Heading>
                <Text type="supporting" color="secondary">
                  {review.from}
                </Text>
              </VStack>
            </HStack>
            <HStack gap={2} vAlign="center">
              <StarRow rating={review.rating} />
              <Text type="supporting" color="secondary">
                ·
              </Text>
              <Text type="supporting" color="secondary">
                {monthYear(review.date)}
              </Text>
            </HStack>
            <Text as="p" type="body">
              {review.text}
            </Text>
          </VStack>
        ))}
      </Grid>
    </VStack>
  );

  // On narrow screens the booking panel follows the key facts, so it is
  // reached before the long sections; on wide screens it has its own column.
  const mainColumn = (
    <VStack gap={8}>
      {intro}
      {!isWide && bookingPanel}
      <Divider />
      {amenities}
      <Divider />
      {location}
      <Divider />
      {thingsToKnow}
      <Divider />
      {reviews}
    </VStack>
  );

  return (
    <Layout
      height="fill"
      padding={isWide ? 6 : 4}
      contentWidth={1240}
      content={
        <LayoutContent>
          <VStack gap={6} paddingBlockEnd={10}>
            {header}
            {gallery}
            <Stack direction={isWide ? 'horizontal' : 'vertical'} gap={10} vAlign="start">
              <StackItem size="fill">{mainColumn}</StackItem>
              {isWide && <StackItem style={bookingColumn}>{bookingPanel}</StackItem>}
            </Stack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
