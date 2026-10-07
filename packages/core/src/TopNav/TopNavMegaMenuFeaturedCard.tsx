'use client';

/**
 * @file TopNavMegaMenuFeaturedCard.tsx
 * @input Uses React, Tailwind classes, theme tokens
 * @output Exports TopNavMegaMenuFeaturedCard component
 * @position Standard featured card for the TopNavMegaMenu featured slot.
 *
 * Provides a consistent appearance for promotional/featured content in mega menus.
 * The `featured` slot on TopNavMegaMenu is still open ReactNode — this component
 * is the standard card, but consumers can pass anything.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/TopNav/TopNav.doc.mjs
 * - /packages/core/src/TopNav/index.ts
 */

import React, {type ReactNode} from 'react';
import {cn} from '../utils/cn';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {useLinkComponent} from '../Link/useLinkComponent';
import {themeProps} from '../utils/themeProps';

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: 'flex flex-col',
  image: 'w-full h-[140px] object-cover block',
  body: 'flex flex-col gap-(--spacing-2) p-(--spacing-4)',
  title: cn(
    'text-(length:--text-label-size) font-(number:--font-weight-semibold)',
    'leading-(--text-label-leading) text-(--color-text-primary)',
  ),
  description: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary)',
  ),
  link: cn(
    'text-(length:--text-supporting-size) font-(number:--font-weight-semibold)',
    'leading-(--text-supporting-leading) text-(--color-text-accent) [text-decoration:none]',
  ),
} as const;

// =============================================================================
// Types
// =============================================================================

export interface TopNavMegaMenuFeaturedCardProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /** Card title. */
  title: string;
  /** Description text below the title. */
  description?: string;
  /** Optional image URL displayed above the body. */
  image?: string;
  /**
   * Alt text for the image.
   *
   * When omitted, the image is explicitly decorative (`alt=""` +
   * `role="presentation"` + `aria-hidden`, matching Avatar) and hidden from
   * assistive technology. Since the card already has a visible `title`, a
   * decorative image is usually correct; pass `imageAlt` only when the image
   * conveys information beyond the title and description.
   */
  imageAlt?: string;
  /** CTA link text. */
  linkLabel?: string;
  /** CTA link URL. */
  linkHref?: string;
  /** Custom content rendered below the standard body. */
  children?: ReactNode;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Standard featured card for the TopNavMegaMenu `featured` slot.
 *
 * Provides a consistent card with optional image, title, description,
 * and CTA link. For fully custom content, pass any ReactNode directly
 * to the `featured` slot instead.
 *
 * @example
 * ```
 * <TopNavMegaMenu
 *   label="Products"
 *   items={...}
 *   featured={
 *     <TopNavMegaMenuFeaturedCard
 *       title="What's new in v4.0"
 *       description="AI-powered analytics and real-time collaboration."
 *       image="https://example.com/promo.jpg"
 *       imageAlt="Team collaboration"
 *       linkLabel="Read the announcement"
 *       linkHref="/blog/v4"
 *     />
 *   }
 * />
 * ```
 */
export function TopNavMegaMenuFeaturedCard({
  ref,
  title,
  description,
  image,
  imageAlt,
  linkLabel,
  linkHref,
  children,
  className,
  style,
  ...rest
}: TopNavMegaMenuFeaturedCardProps) {
  const LinkComponent = useLinkComponent();
  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('top-nav-mega-menu-featured-card'),
        {className: styles.root},
        className,
        style,
      )}
      {...rest}>
      {image && (
        // Without `imageAlt`, the image is explicitly decorative rather than
        // silently empty-alt, matching Avatar's handling of unnamed images.
        // Usually correct here: the card already has a visible title.
        <img
          src={image}
          alt={imageAlt ?? ''}
          role={imageAlt ? undefined : 'presentation'}
          aria-hidden={imageAlt ? undefined : true}
          className={styles.image}
        />
      )}
      <div className={styles.body}>
        <span className={styles.title}>{title}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
        {linkLabel && linkHref && (
          <LinkComponent href={linkHref} className={styles.link}>
            {linkLabel} →
          </LinkComponent>
        )}
        {children}
      </div>
    </div>
  );
}

TopNavMegaMenuFeaturedCard.displayName = 'TopNavMegaMenuFeaturedCard';
