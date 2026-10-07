import {cn} from '@solo/core/utils/cn';
import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {Overlay, useOverlay} from '@solo/core/Overlay';
import {AspectRatio} from '@solo/core/AspectRatio';
import {Card} from '@solo/core/Card';
import {Button} from '@solo/core/Button';
import {Heading, Text} from '@solo/core/Text';
import {VStack, Layout, LayoutContent} from '@solo/core/Layout';
import {Spinner} from '@solo/core/Spinner';
import {Grid} from '@solo/core/Grid';

const styles = {
  pageWrapper: 'bg-(--color-background-body) p-(--spacing-6)',
  image: 'object-cover w-full h-full block',
  dropZone: cn(
    'min-h-[200px] flex items-center justify-center',
    '[border-width:2px] [border-style:dashed] border-(--color-border) rounded-[8px] p-(--spacing-4)',
  ),
  dropZoneText:
    'font-(family-name:--font-family-body) text-(--color-text-secondary)',
  durationBadge:
    'py-[2px] px-[8px] rounded-[4px] bg-(--color-overlay) text-[12px] font-[600]',
  imageSection: 'relative',
  metadata: 'p-[16px]',
} as const;

const SAMPLE_IMAGE = 'https://picsum.photos/seed/solo-overlay/800/450';
const SAMPLE_IMAGE_2 = 'https://picsum.photos/seed/solo-overlay-2/800/450';
const SAMPLE_IMAGE_3 = 'https://picsum.photos/seed/solo-overlay-3/800/450';
const SAMPLE_HERO = 'https://picsum.photos/seed/solo-hero/1200/600';

const meta: Meta<typeof Overlay> = {
  title: 'Core/Overlay',
  component: Overlay,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className={styles.pageWrapper}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Overlay>;

/** Basic hover overlay on an image. */
export const HoverOnImage: Story = {
  render: () => (
    <div style={{width: 400}}>
      <Overlay
        showOn="hover"
        align="center"
        content={<Button label="Quick view" variant="ghost" />}>
        <AspectRatio ratio={16 / 9}>
          <img
            src={SAMPLE_IMAGE}
            alt="Product"
            className={styles.image}
          />
        </AspectRatio>
      </Overlay>
    </div>
  ),
};

/** Always-visible bottom strip with title over a hero image. */
export const BottomStrip: Story = {
  render: () => (
    <div style={{width: 600}}>
      <Overlay
        position="bottom"
        align="start"
        content={
          <VStack gap={1}>
            <Heading level={3}>Gallery Collection</Heading>
            <Text type="supporting" color="secondary">
              24 items · Updated today
            </Text>
          </VStack>
        }>
        <AspectRatio ratio={2}>
          <img src={SAMPLE_HERO} alt="Hero" className={styles.image} />
        </AspectRatio>
      </Overlay>
    </div>
  ),
};

/** Full overlay wrapping a Card. */
export const CardOverlay: Story = {
  render: () => (
    <Overlay
      showOn="hover"
      align="center"
      content={<Button label="View Details" variant="ghost" />}>
      <Card width={360}>
        <Layout
          content={
            <LayoutContent>
              <VStack gap={2}>
                <Heading level={3}>Project Alpha</Heading>
                <Text>
                  A comprehensive design system for building internal tools with
                  consistent, accessible interfaces.
                </Text>
                <Text type="supporting" color="secondary">
                  Updated 2 hours ago · 12 contributors
                </Text>
              </VStack>
            </LayoutContent>
          }
        />
      </Card>
    </Overlay>
  ),
};

/** Hover + focus — also appears on keyboard focus. */
export const HoverOrFocus: Story = {
  render: () => (
    <div style={{width: 400}}>
      <Overlay
        showOn="hover-or-focus"
        align="center"
        content={<Button label="Edit" variant="ghost" />}>
        <AspectRatio ratio={16 / 9}>
          <img
            src={SAMPLE_IMAGE_2}
            alt="Photo"
            className={styles.image}
          />
        </AspectRatio>
      </Overlay>
    </div>
  ),
};

/** Light scrim for loading/upload states. */
export const LoadingOverlay: Story = {
  render: function LoadingOverlayStory() {
    const [isUploading, setIsUploading] = useState(false);
    return (
      <VStack gap={4} style={{width: 300}}>
        <Button
          label={isUploading ? 'Cancel upload' : 'Simulate upload'}
          onClick={() => setIsUploading(v => !v)}
        />
        <Overlay
          isOpen={isUploading}
          scrim="light"
          align="center"
          content={
            <VStack gap={2} hAlign="center">
              <Spinner size="md" />
              <Text weight="bold">Uploading...</Text>
            </VStack>
          }>
          <AspectRatio ratio={1}>
            <img
              src={SAMPLE_IMAGE_3}
              alt="Upload"
              className={styles.image}
            />
          </AspectRatio>
        </Overlay>
      </VStack>
    );
  },
};

/** Gallery grid — each image has its own hover overlay. */
export const GalleryGrid: Story = {
  render: () => {
    const images = [
      {src: 'https://picsum.photos/seed/g1/400/400', title: 'Mountain Lake'},
      {src: 'https://picsum.photos/seed/g2/400/400', title: 'Forest Path'},
      {src: 'https://picsum.photos/seed/g3/400/400', title: 'Ocean Sunset'},
      {src: 'https://picsum.photos/seed/g4/400/400', title: 'City Skyline'},
      {src: 'https://picsum.photos/seed/g5/400/400', title: 'Desert Dunes'},
      {src: 'https://picsum.photos/seed/g6/400/400', title: 'Snowy Peaks'},
    ];
    return (
      <Grid columns={3} gap={4}>
        {images.map(img => (
          <Overlay
            key={img.title}
            showOn="hover"
            position="bottom"
            align="start"
            content={<Text weight="bold">{img.title}</Text>}>
            <AspectRatio ratio={1}>
              <img
                src={img.src}
                alt={img.title}
                className={styles.image}
              />
            </AspectRatio>
          </Overlay>
        ))}
      </Grid>
    );
  },
};

/** Video thumbnail with duration badge (always visible) + hover play overlay. */
export const VideoThumbnail: Story = {
  render: () => (
    <div style={{width: 400}}>
      <Overlay
        showOn="hover"
        align="center"
        content={
          <VStack gap={2} hAlign="center">
            <Text weight="bold" size="lg">
              ▶
            </Text>
            <Text weight="bold">Introduction to Solo</Text>
          </VStack>
        }>
        <AspectRatio ratio={16 / 9}>
          <img src={SAMPLE_IMAGE} alt="Video" className={styles.image} />
        </AspectRatio>
      </Overlay>
    </div>
  ),
};

/** Disconnected hover — useOverlay hook on Card. Hover Card reveals overlay on image. */
export const DisconnectedHover: Story = {
  render: function DisconnectedHoverStory() {
    const overlay = useOverlay({
      showOn: 'hover',
      position: 'bottom',
      align: 'start',
      content: <Heading level={4}>Featured Article</Heading>,
    });

    return (
      <Card
        width={360}
        ref={overlay.containerRef as React.RefObject<HTMLDivElement>}
        {...overlay.containerProps}>
        <div className={styles.imageSection}>
          <AspectRatio ratio={16 / 9}>
            <img
              src={SAMPLE_IMAGE_2}
              alt="Article"
              className={styles.image}
            />
          </AspectRatio>
          {overlay.element}
        </div>
        <VStack gap={1} className={styles.metadata}>
          <Text type="supporting" color="secondary">
            Jan 15, 2026 · 5 min read
          </Text>
          <Text type="supporting" color="secondary">
            By Jane Author
          </Text>
        </VStack>
      </Card>
    );
  },
};

/** Drag-and-drop overlay — simulated with a toggle button. */
export const DragAndDrop: Story = {
  render: function DragAndDropStory() {
    const [isDragOver, setIsDragOver] = useState(false);
    return (
      <VStack gap={4} style={{width: 400}}>
        <Button
          label={isDragOver ? 'Simulate drag leave' : 'Simulate drag enter'}
          variant="secondary"
          onClick={() => setIsDragOver(v => !v)}
        />
        <Overlay
          isOpen={isDragOver}
          align="center"
          content={
            <VStack gap={2} hAlign="center">
              <Text size="lg">📁</Text>
              <Text weight="bold">Drop files here</Text>
            </VStack>
          }>
          <div className={styles.dropZone}>
            <p className={styles.dropZoneText}>
              Drop files here or click to browse
            </p>
          </div>
        </Overlay>
      </VStack>
    );
  },
};

/** No scrim — content-only overlay without a background. */
export const NoScrim: Story = {
  render: () => (
    <div style={{width: 300}}>
      <Overlay
        showOn="hover"
        scrim={false}
        align="center"
        content={<Button label="♡" variant="ghost" />}>
        <AspectRatio ratio={1}>
          <img
            src={SAMPLE_IMAGE_3}
            alt="Selected"
            className={styles.image}
          />
        </AspectRatio>
      </Overlay>
    </div>
  ),
};
