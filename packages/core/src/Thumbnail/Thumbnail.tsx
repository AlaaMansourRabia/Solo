'use client';

/**
 * @file Thumbnail.tsx
 * @input Uses React, Tailwind classes, Button, Skeleton, Spinner
 * @output Exports Thumbnail component, ThumbnailProps
 * @position Core implementation; consumed by index.ts
 *
 * Square preview card for image attachments. Shows a skeleton shimmer while
 * the image loads, the image on success, or a placeholder on failure.
 * The overlaid remove button sits on a fixed --color-overlay scrim with an
 * --color-on-dark icon so it always has sufficient contrast against the image.
 *
 * Images without `alt` are explicitly decorative (alt="" +
 * role="presentation" + aria-hidden, matching Avatar). A dev-time warning
 * fires once when `src` is set with no `alt` and no other name source.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Thumbnail/Thumbnail.doc.mjs
 * - /packages/core/src/Thumbnail/Thumbnail.test.tsx
 * - /packages/core/src/Thumbnail/index.ts
 * - /apps/storybook/stories/Thumbnail.stories.tsx
 */

import {useState} from 'react';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {Skeleton} from '../Skeleton';
import {Spinner} from '../Spinner';
import {Tooltip} from '../Tooltip/Tooltip';
import {useDevWarning} from '../hooks/useDevWarning';
import {useContainerReveal} from '../hooks/useContainerReveal';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';
import {useTranslator} from '../i18n';

export interface ThumbnailProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Image source for the thumbnail preview.
   * Shows a skeleton while loading, the image on success, or a placeholder on error.
   */
  src?: string;
  /**
   * Alt text for the image.
   *
   * When omitted, the image is explicitly decorative (`alt=""` +
   * `role="presentation"` + `aria-hidden`, matching Avatar) and hidden from
   * assistive technology. Provide `alt` whenever the image conveys content;
   * without it, screen reader users only hear the `label` (file name), or a
   * generic "thumbnail" if `label` is also missing — which triggers a
   * dev-time warning.
   */
  alt?: string;
  /**
   * Accessible label for the thumbnail (e.g. file name).
   * Not rendered visually — shown in a tooltip on hover, exposed as the
   * accessible name of the thumbnail group, and used as the accessible
   * name for the remove button.
   */
  label?: string;
  /**
   * Callback when the remove button is clicked.
   * When provided, an overlaid close button appears in the top-right corner.
   */
  onRemove?: (e: React.MouseEvent) => void;
  /**
   * Click handler for opening a lightbox or detail view.
   * When provided, the thumbnail renders as interactive.
   */
  onClick?: (e: React.MouseEvent) => void;
  /**
   * Content rendered below the thumbnail image area.
   * Use for metadata like file size, duration, or status.
   */
  /**
   * Whether the thumbnail is in a loading state.
   * Shows a skeleton shimmer regardless of `src`. Use while uploading
   * or processing before an image URL is available.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Whether the thumbnail is in a disabled state.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * When the remove button is visible.
   * - `'hover'` — the button is revealed on hover, and on keyboard focus so
   *   it stays reachable. On any touch-capable device it stays visible.
   *   This is the default.
   * - `'always'` — the button is always shown.
   *
   * Only has an effect when `onRemove` is set.
   * @default 'hover'
   */
  showRemoveOn?: 'always' | 'hover';
  /**
   * Test ID for testing frameworks.
   */
  'data-testid'?: string;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: 'relative inline-flex flex-col w-[64px] shrink-0 isolate',
  imageContainer:
    'relative w-full [aspect-ratio:1] rounded-(--radius-element) overflow-hidden bg-(--color-neutral)',
  image: 'w-full h-full object-cover block',
  insetBorder:
    'absolute inset-0 rounded-[inherit] [box-shadow:inset_0_0_0_1px_var(--color-border)] pointer-events-none',
  placeholder:
    'flex items-center justify-center w-full h-full text-(--color-icon-secondary)',
  interactive:
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  // Hover/pressed overlay — the exact same treatment as ClickableCard and
  // SelectableCard. A transparent `::after` tints on hover/press instead of
  // shifting shadow or opacity. Guarded by @media (hover: hover) so touch
  // devices don't show a stuck hover state; active/pressed works everywhere.
  overlay: cn(
    "after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none",
    'after:[transition-property:background-color] after:[transition-duration:var(--duration-fast)] after:[transition-timing-function:var(--ease-standard)]',
    'after:bg-transparent active:after:bg-(--color-overlay-pressed)',
  ),
  hoverOnPointer: 'can-hover:hover:usable:after:bg-(--color-overlay-hover)',
  interactiveButton: cn(
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'block w-full h-full rounded-(--radius-element) overflow-hidden',
  ),

  removeSlot: 'absolute top-(--spacing-1) end-(--spacing-1) z-1 [line-height:0]',
  removeButtonOverrides: cn(
    '[--_button-radius:calc(var(--radius-element)_-_var(--spacing-1))]',
    'relative h-[20px] min-w-[20px]',
    // Fixed colors instead of luminance-adapting theme: a translucent scrim
    // (--color-overlay) plus an --color-on-dark icon reads on any image
    // without sampling pixel brightness.
    'bg-(--color-overlay) text-(--color-on-dark)',
    '[--_thumbnail-hit-inset:0px] [@media(pointer:coarse)]:[--_thumbnail-hit-inset:-2px]',
    "after:content-[''] after:absolute after:inset-[var(--_thumbnail-hit-inset)]",
  ),
  disabled: 'opacity-50 pointer-events-none',
  uploadOverlay:
    'absolute inset-0 flex items-center justify-center bg-(--color-overlay) rounded-[inherit] z-1 [line-height:0]',
} as const;

// =============================================================================
// Placeholder icon — a simple image silhouette
// =============================================================================

function ImagePlaceholder() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true">
      <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-5.5z" />
    </svg>
  );
}

// =============================================================================
// Component
// =============================================================================

/**
 * A square thumbnail preview for image attachments.
 *
 * Shows a skeleton shimmer while the image loads, the image on success, or
 * a placeholder icon on failure / when no src is provided. An overlaid
 * remove button appears when `onRemove` is set — revealed on hover or
 * keyboard focus by default (`showRemoveOn`), or always shown.
 *
 * The remove button uses a fixed `--color-overlay` scrim with an
 * `--color-on-dark` icon so it stays legible on any image without sampling
 * the image's luminance.
 *
 * @example
 * ```
 * <Thumbnail src="/photo.jpg" alt="Vacation photo" onRemove={() => {}} />
 * <Thumbnail src="/preview.png" alt="Preview" onClick={() => {}} label="preview.png" />
 * <Thumbnail src="/logo.png" alt="Logo" onRemove={() => {}} showRemoveOn="always" />
 * ```
 */
export function Thumbnail({
  src,
  alt,
  label,
  onRemove,
  onClick,
  isLoading = false,
  isDisabled = false,
  showRemoveOn = 'hover',
  className,
  style,
  'data-testid': testId,
  ref,
  ...props
}: ThumbnailProps) {
  const t = useTranslator();

  // Track the exact src that failed (rather than a boolean) so a changed src
  // gets a fresh load attempt instead of the stale error.
  const [erroredSrc, setErroredSrc] = useState<string | undefined>(undefined);

  const hasSrc = src != null;
  const hasError = hasSrc && erroredSrc === src;
  const showSkeleton = isLoading && !hasSrc;
  const showImage = hasSrc && !showSkeleton && !hasError;
  const showUploadOverlay = isLoading && hasSrc;
  const showPlaceholder = (!isLoading && !hasSrc) || hasError;
  const isInteractive = onClick != null && !isDisabled && !isLoading;
  const hasRemove = onRemove != null && !isDisabled;
  const isHoverReveal = hasRemove && showRemoveOn === 'hover';
  const {getContainerProps, getContentRevealProps} = useContainerReveal({
    isEnabled: isHoverReveal,
  });
  const accessibleName =
    label && alt
      ? `${label} — ${alt}`
      : (label ?? alt ?? t('@solo.thumbnail.fallbackName'));

  // Without `alt`, the image is explicitly decorative rather than silently
  // empty-alt, matching Avatar's handling of unnamed images.
  const isImageDecorative = !alt;

  // Dev-time guardrail: `src` with no `alt` hides the image from assistive
  // technology. That is fine when the thumbnail is otherwise named — `label`
  // (or a consumer-provided aria name) becomes the group's accessible name —
  // but with no name source at all the group falls back to a generic
  // "thumbnail".
  const hasNameSource =
    alt != null ||
    label != null ||
    props['aria-label'] != null ||
    props['aria-labelledby'] != null;
  useDevWarning(
    'Thumbnail',
    '`src` is set without `alt` or `label`. The image is ' +
      'treated as decorative and hidden from assistive technology, and ' +
      'the thumbnail falls back to a generic "thumbnail" name. Pass ' +
      '`alt` to describe the image content, or `label` (file name) to ' +
      'name the thumbnail.',
    hasSrc && !hasNameSource,
  );

  const imageContent = (
    <>
      {showImage && (
        <img
          src={src}
          alt={alt ?? ''}
          role={isImageDecorative ? 'presentation' : undefined}
          aria-hidden={isImageDecorative || undefined}
          onError={() => setErroredSrc(src)}
          className={styles.image}
        />
      )}
      {showSkeleton && <Skeleton radius={2} />}
      {showPlaceholder && (
        <div className={styles.placeholder}>
          <ImagePlaceholder />
        </div>
      )}
    </>
  );

  const removeButtonEl = hasRemove ? (
    <div
      {...mergeProps(
        {className: styles.removeSlot},
        // The remove button is absolutely positioned in the corner, so it is
        // already out of flow — an opacity-only reveal (layout preserved)
        // matches its overlay placement instead of the clip recipe.
        isHoverReveal ? getContentRevealProps({isLayoutPreserved: true}) : {},
      )}>
      <Button
        icon={<Icon icon="close" size="xsm" />}
        label={t('@solo.thumbnail.remove', {accessibleName})}
        variant="secondary"
        size="sm"
        isIconOnly
        onClick={e => {
          e.stopPropagation();
          onRemove(e);
        }}
        className={styles.removeButtonOverrides}
      />
    </div>
  ) : null;

  const thumbnail = (
    <div
      ref={ref}
      data-testid={testId}
      role="group"
      aria-label={accessibleName}
      {...mergeProps(
        themeProps('thumbnail'),
        {
          className: cn(styles.root, isDisabled && styles.disabled, className),
          style,
        },
      )}
      {...props}>
      <div
        {...mergeProps(
          {
            className: cn(
              focusOutlineStyles.focusWithin,
              styles.imageContainer,
              isInteractive && styles.interactive,
              isInteractive && styles.overlay,
              isInteractive && styles.hoverOnPointer,
            ),
          },
          isHoverReveal ? getContainerProps() : {},
        )}>
        {isInteractive ? (
          <button
            type="button"
            onClick={onClick}
            aria-label={t('@solo.thumbnail.open', {accessibleName})}
            className={styles.interactiveButton}>
            {imageContent}
          </button>
        ) : (
          imageContent
        )}
        {showImage && <div className={styles.insetBorder} />}
        {showUploadOverlay && (
          <div className={styles.uploadOverlay}>
            <Spinner size="sm" shade="onMedia" />
          </div>
        )}
        {removeButtonEl}
      </div>
    </div>
  );

  if (label != null) {
    return <Tooltip content={label}>{thumbnail}</Tooltip>;
  }

  return thumbnail;
}

Thumbnail.displayName = 'Thumbnail';
