'use client';

import {AppShell} from '@solo/core/AppShell';
import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMegaMenu,
  TopNavMegaMenuItem,
  TopNavMegaMenuFeaturedCard,
} from '@solo/core/TopNav';
import {NavIcon} from '@solo/core/NavIcon';
import {Icon} from '@solo/core/Icon';
import type {IconType} from '@solo/core/Icon';
import {IconButton} from '@solo/core/IconButton';
import {Button} from '@solo/core/Button';
import {Badge} from '@solo/core/Badge';
import {Card} from '@solo/core/Card';
import {Grid} from '@solo/core/Grid';
import {Stack, VStack} from '@solo/core/Stack';
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  SwatchIcon,
  TagIcon,
  HomeModernIcon,
  FaceSmileIcon,
  ReceiptPercentIcon,
  GiftIcon,
  CloudIcon,
  BoltIcon,
  SunIcon,
  StarIcon,
  FireIcon,
  GlobeAltIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

import {templateAsset} from '../assets';
const styles = {
  // Cap + center the page body so wide screens show whitespace gutters.
  contentMax: 'max-w-[1100px] mx-auto',
  // Lock both mega-menu panels to an identical size. Without this, Shop and
  // Brands size to their own content (different widths); since both anchor to
  // the centered nav, switching between them resizes the panel — which reads
  // as flashing/jumping. Fixed item + featured widths make the panels
  // pixel-identical so the transition is seamless.
  megaItems: 'col-[1/-1] w-[520px]',
  megaFeatured: 'w-[240px]',
} as const;

type MegaItem = {name: string; tagline: string; icon: IconType};

// Shop and Brands each render 8 items — the mega menu's built-in 2-column grid
// lays them out as 2 columns × 4 rows, alongside a featured card.
const SHOP_ITEMS: MegaItem[] = [
  {name: 'New Arrivals', tagline: 'The latest drops', icon: SparklesIcon},
  {name: 'Womenswear', tagline: 'Dresses, knitwear & more', icon: SwatchIcon},
  {name: 'Menswear', tagline: 'Shirts, tailoring & more', icon: TagIcon},
  {name: 'Home', tagline: 'Bedding, lighting & décor', icon: HomeModernIcon},
  {
    name: 'Beauty',
    tagline: 'Skincare, fragrance & makeup',
    icon: FaceSmileIcon,
  },
  {
    name: 'Accessories',
    tagline: 'Bags, hats & sunglasses',
    icon: ShoppingBagIcon,
  },
  {name: 'Sale', tagline: 'Up to 50% off', icon: ReceiptPercentIcon},
  {name: 'Gift Cards', tagline: 'The perfect present', icon: GiftIcon},
];

const BRAND_ITEMS: MegaItem[] = [
  {name: 'Aether', tagline: 'Performance essentials', icon: SparklesIcon},
  {name: 'Northwind', tagline: 'Outdoor & technical', icon: CloudIcon},
  {name: 'Loomwell', tagline: 'Everyday knitwear', icon: BoltIcon},
  {name: 'Verdant', tagline: 'Sustainable basics', icon: SunIcon},
  {name: 'Studio Mara', tagline: 'Modern tailoring', icon: StarIcon},
  {name: 'Atelier Kos', tagline: 'Limited ateliers', icon: FireIcon},
  {name: 'Rue & Co', tagline: 'City streetwear', icon: GlobeAltIcon},
  {name: 'Halden', tagline: 'Minimal staples', icon: MoonIcon},
];

const CATEGORY_TILES = [
  'New Arrivals',
  'Womenswear',
  'Menswear',
  'Home & Living',
  'Beauty',
  'Accessories',
];

// Wraps the 8 items in a fixed-width 2-column grid so every mega menu's item
// area is exactly the same width regardless of its content.
function MegaItems({items}: {items: MegaItem[]}) {
  return (
    <Stack className={styles.megaItems}>
      <Grid columns={2} gap={2}>
        {items.map(item => (
          <TopNavMegaMenuItem
            key={item.name}
            title={item.name}
            description={item.tagline}
            icon={<Icon icon={item.icon} size="md" color="secondary" />}
            href="#"
          />
        ))}
      </Grid>
    </Stack>
  );
}

// Pins the featured card to a fixed width so both panels match exactly.
function MegaFeatured(props: {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  linkLabel: string;
  linkHref: string;
}) {
  return (
    <Stack className={styles.megaFeatured}>
      <TopNavMegaMenuFeaturedCard {...props} />
    </Stack>
  );
}

export default function ShellTopNavTemplate() {
  return (
    <AppShell
      variant="surface"
      contentPadding={6}
      topNav={
        <TopNav
          label="Lumen storefront navigation"
          heading={
            <TopNavHeading
              heading="Lumen"
              logo={
                <NavIcon icon={<Icon icon={ShoppingBagIcon} size="sm" />} />
              }
              headingHref="#"
            />
          }
          centerContent={
            <>
              <TopNavMegaMenu
                label="Shop"
                items={<MegaItems items={SHOP_ITEMS} />}
                featured={
                  <MegaFeatured
                    title="The Autumn Edit"
                    description="Layering staples in warm, earthy tones."
                    image={templateAsset('texture-beige-horizontal-1.png')}
                    imageAlt="Autumn collection lookbook"
                    linkLabel="Shop the edit"
                    linkHref="#autumn-edit"
                  />
                }
              />
              <TopNavMegaMenu
                label="Brands"
                items={<MegaItems items={BRAND_ITEMS} />}
                featured={
                  <MegaFeatured
                    title="Meet Studio Mara"
                    description="Modern tailoring, made to last."
                    image={templateAsset('texture-beige-horizontal-2.png')}
                    imageAlt="Studio Mara lookbook"
                    linkLabel="Discover the label"
                    linkHref="#studio-mara"
                  />
                }
              />
              <TopNavItem label="Sale" href="#" />
              <TopNavItem label="Service" href="#" />
            </>
          }
          endContent={
            <>
              <IconButton
                label="Search products"
                tooltip="Search"
                variant="ghost"
                icon={<Icon icon={MagnifyingGlassIcon} size="sm" />}
              />
              <Button label="Sign in" variant="ghost" />
              <Button
                label="Checkout"
                variant="primary"
                icon={<Icon icon={ShoppingCartIcon} size="sm" />}
                endContent={<Badge label={3} />}
              />
            </>
          }
        />
      }>
      <VStack gap={10} className={styles.contentMax}>
        <Card variant="muted" padding={0} width="100%" height={360} />

        {[0, 1, 2].map(section => (
          <VStack key={section} gap={4}>
            <Card variant="muted" padding={0} width={200} height={24} />
            <Grid columns={{minWidth: 160, repeat: 'fit'}} gap={4}>
              {CATEGORY_TILES.map(tile => (
                <VStack key={tile} gap={2}>
                  <Card variant="muted" padding={0} width="100%" height={120} />
                  <Card variant="muted" padding={0} width="60%" height={14} />
                </VStack>
              ))}
            </Grid>
          </VStack>
        ))}
      </VStack>
    </AppShell>
  );
}
