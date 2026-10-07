import type {Meta, StoryObj} from '@storybook/react';
import {Grid, GridSpan} from '@solo/core/Grid';
import {Section} from '@solo/core/Section';
import {Text, Heading} from '@solo/core/Text';
import {VStack} from '@solo/core/Stack';
import {MediaTheme} from '@solo/core/theme';
import {cn} from '@solo/core/utils/cn';

const meta: Meta = {
  title: 'Core/GridMasonry',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = {
  card: 'relative w-full h-full min-h-0 overflow-clip rounded-(--radius-element)',
  img: 'absolute inset-0 w-full h-full object-cover block',
  overlay: cn(
    'absolute inset-0',
    '[background:linear-gradient(to_top,rgba(0,0,0,0.7)_0%,transparent_60%)]',
    'flex flex-col justify-end p-(--spacing-5)',
    'opacity-0 hover:opacity-100 [transition:opacity_0.2s_ease]',
  ),
  overlayAlwaysOn: cn(
    'absolute inset-0',
    '[background:linear-gradient(to_top,rgba(0,0,0,0.6)_0%,transparent_50%)]',
    'flex flex-col justify-end p-(--spacing-5)',
  ),
  tag: cn(
    'absolute top-(--spacing-3) left-(--spacing-3)',
    'bg-(--color-accent-muted) text-(--color-on-accent)',
    'p-[var(--spacing-0-5)_var(--spacing-2)] rounded-(--radius-element)',
    'text-[11px] [font-weight:600] uppercase tracking-[0.5px]',
  ),
} as const;

// ─── Gallery Data ───────────────────────────────────────────────────────────

interface GalleryImage {
  src: string;
  title: string;
  category: string;
}

const IMAGES: GalleryImage[] = [
  {
    src: 'https://picsum.photos/seed/solo-travel/600/800',
    title: 'Going places',
    category: 'Travel',
  },
  {
    src: 'https://picsum.photos/seed/solo-home/600/400',
    title: 'Making memories',
    category: 'Home',
  },
  {
    src: 'https://picsum.photos/seed/solo-lifestyle/600/600',
    title: 'Seeing things',
    category: 'Lifestyle',
  },
  {
    src: 'https://picsum.photos/seed/solo-ideas/600/900',
    title: 'Sharing ideas',
    category: 'Lifestyle',
  },
  {
    src: 'https://picsum.photos/seed/solo-nature/600/700',
    title: 'Being free',
    category: 'Nature',
  },
];

// ─── Gallery Card ───────────────────────────────────────────────────────────

function GalleryCard({
  image,
  showOverlay = false,
}: {
  image: GalleryImage;
  showOverlay?: boolean;
}) {
  return (
    <div className={styles.card}>
      <img src={image.src} alt={image.title} className={styles.img} />
      <span className={styles.tag}>{image.category}</span>
      <div
        className={cn(
          showOverlay ? styles.overlayAlwaysOn : styles.overlay,
        )}>
        <MediaTheme mode="dark">
          <VStack gap={1}>
            <Text type="label">{image.title}</Text>
          </VStack>
        </MediaTheme>
      </div>
    </div>
  );
}

// ─── Stories ────────────────────────────────────────────────────────────────

/**
 * A Pinterest-style masonry gallery using Grid with row spans.
 *
 * The key technique: define explicit row tracks with `gridTemplateRows`,
 * then use `GridSpan` with different `rows` values to create items of
 * varying heights. This produces the characteristic staggered masonry layout
 * without any JavaScript height calculation.
 */
export const MasonryGallery: Story = {
  render: () => (
    <Section variant="muted" padding={6}>
      <VStack gap={5}>
        <VStack gap={2}>
          <Heading level={2}>Mixed Gallery</Heading>
          <Text type="body">
            A masonry-style gallery using CSS Grid row spans. Each item spans a
            different number of rows to create a staggered, Pinterest-like
            layout.
          </Text>
        </VStack>

        <Grid columns={3} rowHeight={80} gap={3}>
          {/* Column 1: 4 + 2 = 6 rows */}
          <GridSpan rows={4}>
            <GalleryCard image={IMAGES[0]} />
          </GridSpan>
          <GridSpan rows={2}>
            <GalleryCard image={IMAGES[1]} />
          </GridSpan>

          {/* Column 2: 2 + 4 = 6 rows */}
          <GridSpan rows={2}>
            <GalleryCard image={IMAGES[2]} />
          </GridSpan>
          <GridSpan rows={4}>
            <GalleryCard image={IMAGES[3]} />
          </GridSpan>

          {/* Column 3: 3 + 3 = 6 rows */}
          <GridSpan rows={3}>
            <GalleryCard image={IMAGES[4]} />
          </GridSpan>
          <GridSpan rows={3}>
            <GalleryCard image={IMAGES[0]} />
          </GridSpan>
        </Grid>
      </VStack>
    </Section>
  ),
};

/**
 * A denser masonry layout with a 4-column grid and smaller row tracks.
 * Uses `rowHeight={60}` for unlimited content.
 */
export const DenseMasonry: Story = {
  render: () => {
    return (
      <Section variant="muted" padding={6}>
        <VStack gap={5}>
          <VStack gap={2}>
            <Heading level={2}>Dense Masonry</Heading>
            <Text type="body">
              A 4-column layout with <code>rowHeight={60}</code>. Each item gets
              a different row span for natural visual rhythm.
            </Text>
          </VStack>

          <Grid columns={4} rowHeight={60} gap={3}>
            <GridSpan rows={4}>
              <GalleryCard image={IMAGES[2]} showOverlay />
            </GridSpan>
            <GridSpan rows={3}>
              <GalleryCard image={IMAGES[0]} showOverlay />
            </GridSpan>
            <GridSpan rows={5}>
              <GalleryCard image={IMAGES[3]} showOverlay />
            </GridSpan>
            <GridSpan rows={3}>
              <GalleryCard image={IMAGES[4]} showOverlay />
            </GridSpan>
            <GridSpan rows={3}>
              <GalleryCard image={IMAGES[1]} showOverlay />
            </GridSpan>
            <GridSpan rows={4}>
              <GalleryCard image={IMAGES[4]} showOverlay />
            </GridSpan>
            <GridSpan rows={2}>
              <GalleryCard image={IMAGES[0]} showOverlay />
            </GridSpan>
            <GridSpan rows={4}>
              <GalleryCard image={IMAGES[2]} showOverlay />
            </GridSpan>
            <GridSpan rows={3}>
              <GalleryCard image={IMAGES[3]} showOverlay />
            </GridSpan>
            <GridSpan rows={5}>
              <GalleryCard image={IMAGES[1]} showOverlay />
            </GridSpan>
            <GridSpan rows={3}>
              <GalleryCard image={IMAGES[4]} showOverlay />
            </GridSpan>
            <GridSpan rows={4}>
              <GalleryCard image={IMAGES[0]} showOverlay />
            </GridSpan>
          </Grid>
        </VStack>
      </Section>
    );
  },
};

/**
 * A featured masonry layout combining column and row spans.
 * The hero image spans 2 columns and 4 rows, with smaller items
 * arranged around it.
 */
export const FeaturedMasonry: Story = {
  render: () => {
    return (
      <Section variant="muted" padding={6}>
        <VStack gap={5}>
          <VStack gap={2}>
            <Heading level={2}>Featured Masonry</Heading>
            <Text type="body">
              Combines column spans and row spans for a featured hero layout.
              The primary image spans 2 columns × 5 rows.
            </Text>
          </VStack>

          <Grid columns={3} rowHeight={70} gap={3}>
            {/* Hero — 2 cols × 5 rows */}
            <GridSpan columns={2} rows={5}>
              <GalleryCard image={IMAGES[2]} showOverlay />
            </GridSpan>

            {/* Sidebar items */}
            <GridSpan rows={3}>
              <GalleryCard image={IMAGES[0]} showOverlay />
            </GridSpan>
            <GridSpan rows={2}>
              <GalleryCard image={IMAGES[1]} showOverlay />
            </GridSpan>

            {/* Bottom row */}
            <GridSpan rows={3}>
              <GalleryCard image={IMAGES[3]} showOverlay />
            </GridSpan>
            <GridSpan rows={3}>
              <GalleryCard image={IMAGES[4]} showOverlay />
            </GridSpan>
            <GridSpan rows={3}>
              <GalleryCard image={IMAGES[1]} showOverlay />
            </GridSpan>
          </Grid>
        </VStack>
      </Section>
    );
  },
};
