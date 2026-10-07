'use client';

/**
 * @file Citation.tsx
 * @input Uses React, Tailwind classes, theme tokens, and the shared navigation policy
 * @output Exports Citation with safe navigation and named inert-reference states
 * @position Core implementation; consumed by index.ts
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Citation/index.ts (exports if types change)
 * - /packages/core/src/Citation/Citation.doc.mjs (props table, features)
 * - /packages/core/src/Citation/Citation.test.tsx (tests for new/changed behavior)
 * - /apps/storybook/stories/Citation.stories.tsx (storybook stories)
 */

import type React from 'react';
import type {ReactNode} from 'react';
import {mergeProps} from '../utils';
import {isSafeUrl} from '../utils/safeUrl';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';
import {useTranslator} from '../i18n';
import {renderIconSlot} from '../Icon';

export interface CitationSource {
  title?: string;
  url?: string;
  /**
   * Image URL for a favicon or source logo, rendered as `<img src>` inside the
   * icon circle. This is the idiomatic field for image sources (mirrors
   * `Avatar`/`Thumbnail` `src`). When both `src` and a non-string `icon` are
   * provided, `icon` wins.
   */
  src?: string;
  /**
   * Source icon shown before the label text (label variant only). Accepts:
   * - a React node / Solo `<Icon>` / SVG element — rendered as-is, or
   * - a string image URL — rendered as `<img src>` for backward compatibility
   *   with callers that passed a favicon URL here.
   *
   * Note: unlike icon slots elsewhere in the system, a bare string is treated
   * as an image URL (not a semantic icon name) to preserve the original
   * favicon behavior. Pass an Solo `<Icon>` (or other node) for a real icon.
   */
  icon?: ReactNode;
}

export interface CitationProps extends BaseProps<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
  source: CitationSource;
  number: number;
  variant?: 'label' | 'number';
}

const styles = {
  label: cn(
    'inline-flex items-center gap-(--spacing-1) align-baseline h-(--spacing-5)',
    'text-(length:--text-supporting-size) font-(number:--text-supporting-weight) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary) rounded-(--radius-element)',
    '[border-width:var(--border-width)] [border-style:solid] border-(--color-border)',
    'px-(--spacing-2) ms-(--spacing-0-5) [text-decoration:none]',
    '[transition-property:background-color,border-color,color] [transition-duration:var(--duration-fast-max)] [transition-timing-function:var(--ease-standard)]',
    'max-w-[15em] overflow-hidden',
  ),
  labelWithIcon: 'ps-(--spacing-0-5)',
  labelText: 'overflow-hidden text-ellipsis whitespace-nowrap min-w-0',
  labelInteractive:
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  labelHover: cn(
    'can-hover:hover:usable:bg-(--color-overlay-hover)',
    // Explicit default: without it, this hover-only conditional replaces
    // the base secondary color from `label` (last-wins property merge),
    // leaving linked citations to inherit the surrounding text color.
    'text-(--color-text-secondary) can-hover:hover:usable:text-(--color-text-primary)',
  ),
  number: cn(
    'inline-flex items-center justify-center align-super',
    'text-(length:--text-supporting-size) font-(number:--font-weight-semibold) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary) bg-(--color-accent-muted) rounded-(--radius-full)',
    'min-w-(--spacing-5) h-(--spacing-5) px-(--spacing-1) [text-decoration:none]',
    '[transition-property:background-color] [transition-duration:var(--duration-fast-max)] [transition-timing-function:var(--ease-standard)]',
  ),
  numberInteractive:
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  // Explicit default for the same reason as labelHover's color: a
  // hover-only conditional replaces the base accent-muted pill from
  // `number` on merge, leaving linked badges transparent.
  numberHover:
    'bg-(--color-accent-muted) can-hover:hover:usable:bg-(--color-overlay-hover)',
  iconWrap: cn(
    'inline-flex items-center justify-center w-(--spacing-4) h-(--spacing-4) rounded-(--radius-full)',
    'bg-(--color-background-surface) [border-width:var(--border-width)] [border-style:solid] border-(--color-border)',
    'overflow-hidden shrink-0',
  ),
  icon: 'w-(--spacing-3) h-(--spacing-3)',
} as const;

export function Citation({
  ref,
  source,
  number,
  variant = 'label',
  className,
  style,
  'data-testid': testId,
  ...rest
}: CitationProps): React.ReactElement {
  const t = useTranslator();
  const title = source.title ?? String(number);
  const href =
    source.url != null && isSafeUrl(source.url) ? source.url : undefined;

  // Resolve the source icon. A non-string `icon` node renders as-is (an Solo
  // <Icon>, SVG, avatar, etc.). Otherwise fall back to an image URL: `src`, or
  // a legacy string passed to `icon` (back-compat — favicon URLs still render
  // as <img>). The icon is decorative; the accessible name comes solely from
  // the element's aria-label, so nothing is double-announced.
  const iconNode =
    source.icon != null && typeof source.icon !== 'string' ? source.icon : null;
  const imageSrc =
    source.src ?? (typeof source.icon === 'string' ? source.icon : undefined);
  const hasIcon = iconNode != null || imageSrc != null;

  const Tag = href ? 'a' : 'span';
  // `doc-noteref` is a link role and is not permitted on the inert span. Give
  // that span a supported naming role so the component-authored aria-label
  // still identifies number-only citations to assistive technology.
  const noteRole = href ? ('doc-noteref' as const) : ('group' as const);
  const linkProps = href
    ? {
        href,
        target: '_blank' as const,
        rel: 'noopener noreferrer' as const,
        title,
      }
    : {title};

  // Both <a> and <span> extend HTMLElement — narrow via intersection
  const elementRef = ref as React.Ref<HTMLAnchorElement> &
    React.Ref<HTMLSpanElement>;

  if (variant === 'number') {
    return (
      <Tag
        {...rest}
        ref={elementRef}
        role={noteRole}
        aria-label={t('@solo.citation.label', {number, title})}
        data-testid={testId}
        {...linkProps}
        {...mergeProps(
          themeProps('citation', {variant}),
          {
            className: cn(
              styles.number,
              href != null && styles.numberHover,
              href != null && styles.numberInteractive,
            ),
          },
          className,
          style,
        )}>
        {number}
      </Tag>
    );
  }

  return (
    <Tag
      {...rest}
      ref={elementRef}
      role={noteRole}
      aria-label={t('@solo.citation.label', {number, title})}
      data-testid={testId}
      {...linkProps}
      {...mergeProps(
        themeProps('citation', {variant}),
        {
          className: cn(
            styles.label,
            hasIcon && styles.labelWithIcon,
            href != null && styles.labelHover,
            href != null && styles.labelInteractive,
          ),
        },
        className,
        style,
      )}>
      {hasIcon && (
        <span aria-hidden="true" className={styles.iconWrap}>
          {iconNode != null ? (
            renderIconSlot(iconNode, {size: 'sm'})
          ) : (
            <img src={imageSrc} alt="" className={styles.icon} />
          )}
        </span>
      )}
      <span className={styles.labelText}>{title}</span>
    </Tag>
  );
}

Citation.displayName = 'Citation';
