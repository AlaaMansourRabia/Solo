'use client';

/**
 * @file TopNavHeading.tsx
 * @input Uses React, useRef, useCallback, ReactNode, Tailwind classes, usePopover
 * @output Exports TopNavHeading component and TopNavHeadingProps
 * @position Companion component for TopNav heading slot
 *
 * Product/suite/account heading with smart interaction boundary logic.
 * Mirrors SideNavHeading features: superheading, subheading, menu popover,
 * chevron indicator, and independent link boundaries.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/TopNav/TopNav.doc.mjs
 * - /packages/core/src/TopNav/TopNav.test.tsx
 * - /packages/core/src/TopNav/index.ts
 * - /apps/storybook/stories/TopNav.stories.tsx
 */

import {useMemo, useRef, type ReactNode} from 'react';
import {cn} from '../utils/cn';
import {usePopover} from '../Popover/usePopover';
import {Link} from '../Link';
import {Icon} from '../Icon';
import {useLinkComponent} from '../Link/useLinkComponent';
import type {LinkComponentType} from '../Link/types';
import {mergeProps} from '../utils';
import {useMergedRefs} from '../hooks/useMergedRefs';
import type {BaseProps} from '../BaseProps';
import {useMenuHover} from '../hooks/useMenuHover';
import {NavHeadingCloseContext} from '../NavMenu/NavMenuContext';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: cn(
    'flex items-center gap-(--spacing-2) min-h-(--spacing-8)',
    'ps-(--spacing-2) has-[.solo-nav-icon]:ps-0 pe-(--spacing-2) py-0',
    'box-border [text-decoration:none] text-(--color-text-primary) cursor-default',
  ),
  interactive: cn(
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'rounded-(--radius-element) [border-width:0] [border-style:none] bg-transparent',
    '[font-family:inherit] text-[length:inherit] font-(number:--font-weight-normal) text-start',
    'can-hover:usable:hover:bg-(--color-overlay-hover)',
  ),
  menuTrigger: cn(
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'rounded-(--radius-element) [border-width:0] [border-style:none] bg-transparent',
    '[font-family:inherit] text-[length:inherit] font-(number:--font-weight-normal) text-start',
  ),
  logo: 'shrink-0 flex items-center justify-center',
  textContainer: 'flex flex-col min-w-0',
  superheading: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary)',
    '[text-decoration:none] overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  heading: cn(
    'text-(length:--text-large-size) font-(number:--font-weight-semibold)',
    'leading-(--text-large-leading) text-(--color-text-primary)',
    '[text-decoration:none] overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  subheading: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary)',
    '[text-decoration:none] overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  headingRow: 'flex items-center gap-(--spacing-1)',
  headingLink: cn('text-inherit', '[text-decoration:none] overflow-hidden text-ellipsis whitespace-nowrap'),
  chevron: cn(
    'shrink-0 flex items-center justify-center min-w-(--spacing-7) min-h-(--spacing-7)',
    'text-(--color-icon-secondary)',
  ),
  // The registry chevron is a 1em SVG, so it has always rendered at the
  // heading's inherited font size. Icon's size box would repin it to a fixed
  // rem (the nearest, sm, is 1rem = 16px vs the 14px base here), so hold the
  // glyph on the inherited em — the 28px chevron box above is unchanged, and
  // the glyph keeps tracking the surrounding text.
  chevronGlyph: 'w-[1em] h-[1em] text-[length:inherit]',
  headerEndContent: 'shrink-0 flex items-center ms-auto',
  popoverContent: 'p-(--spacing-1) overflow-hidden',
  popoverHeading: cn(
    'flex items-center gap-(--spacing-2) w-full [border-width:0] [border-style:none]',
    'bg-transparent [font-family:inherit] text-[length:inherit] text-inherit text-start',
    'min-h-(--spacing-8) ps-(--spacing-2) has-[.solo-nav-icon]:ps-0 pe-(--spacing-2) py-0',
    'mbs-(--spacing-1) mbe-(--spacing-2) mx-(--spacing-1)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  ),
  // Composes over `chevron` — the flipped popover copy differs only by the
  // rotation, so it carries just that.
  popoverChevron: '[transform:rotate(180deg)]',
  popover: 'min-w-[anchor-size(width)] mbs-(--spacing-1)',
  popoverOverlap: cn(
    'min-w-[calc(anchor-size(width)_+_16px)]',
    'mbs-[calc(-1_*_anchor-size(height)_-_8px)] ms-[-8px]',
  ),
} as const;

// =============================================================================
// Types
// =============================================================================

export interface TopNavHeadingProps extends BaseProps<HTMLElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLElement>;
  /**
   * Logo element to display before the heading.
   * Can be an image, NavIcon, or any ReactNode.
   */
  logo?: ReactNode;
  /**
   * Accessible name for the logo when it links somewhere (`headingHref`) and
   * has no adjacent text to name it (for example a logo-only heading). Defaults
   * to `heading` when available. Ignored when the logo is not a link.
   */
  logoLabel?: string;
  /**
   * Product/app name.
   */
  heading?: string;
  /**
   * Link for the heading (e.g., product home).
   */
  headingHref?: string;
  /**
   * Text above the heading (e.g., suite name).
   */
  superheading?: string;
  /**
   * Link for the superheading (e.g., suite home).
   */
  superheadingHref?: string;
  /**
   * Text below the heading (e.g., account context).
   */
  subheading?: string;
  /**
   * Link for the subheading.
   */
  subheadingHref?: string;
  /**
   * Content rendered at the trailing edge of the heading row.
   */
  headerEndContent?: ReactNode;
  /**
   * Menu content shown in a popover. When provided, the header composes
   * usePopover internally and shows a dropdown chevron. The trigger
   * boundary is determined automatically:
   * - No hrefs → whole header is the trigger
   * - With hrefs → links are independent, chevron/remaining area is the trigger
   */
  menu?: ReactNode;
  /**
   * Custom component to render instead of `<a>`.
   * Overrides the provider-level default set by LinkProvider.
   * Must accept href, className, style, and children props.
   */
  as?: LinkComponentType;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Product/suite/account heading for TopNav.
 *
 * Supports smart interaction boundary logic:
 * - No hrefs + menu → whole heading is the popover trigger
 * - headingHref only, no menu → whole heading is one link
 * - headingHref + superheadingHref, no menu → each is an independent link
 * - menu + hrefs → links are independent, chevron/remaining area is the trigger
 *
 * The chevron indicator is automatically shown when `menu` is provided.
 *
 * @example
 * ```
 * <TopNavHeading logo={<NavIcon icon={<HomeIcon />} />} heading="My App" headingHref="/" />
 * <TopNavHeading
 *   logo={<NavIcon icon={<SuiteIcon />} />}
 *   superheading="Suite Name"
 *   superheadingHref="/suite"
 *   heading="Product Name"
 *   headingHref="/product"
 *   menu={<ProductSwitcher />}
 * />
 * ```
 */
export function TopNavHeading({
  as,
  logo,
  logoLabel,
  heading,
  headingHref,
  superheading,
  superheadingHref,
  subheading,
  subheadingHref,
  headerEndContent,
  menu,
  className,
  style,
  'data-testid': testId,
  ref,
  ...props
}: TopNavHeadingProps) {
  const t = useTranslator();
  const LinkComponent = useLinkComponent(as);
  // When the logo is wrapped in a link it needs its own accessible name (the
  // logo image itself is decorative). Prefer an explicit logoLabel, fall back
  // to the heading text. axe: link-name.
  const logoLinkLabel = logoLabel ?? heading;

  const rootRef = useRef<HTMLElement>(null);

  const popover = usePopover({
    dialogLabel: t('@solo.topNav.heading.dialogLabel'),
    // The popup exposes its own role="menu" semantics; a role="dialog"
    // aria-modal wrapper would announce "dialog, Navigation menu" around a
    // menu (the anti-pattern removed in a478a3dcf).
    role: 'none',
    hasCloseButton: false,
  });

  const {
    triggerProps,
    contentProps,
    menuRef,
    setTriggerEl,
    close: closeMenu,
  } = useMenuHover<HTMLDivElement>({
    show: popover.show,
    hide: popover.hide,
    isOpen: popover.isOpen,
    isEnabled: !!menu,
    showDelay: 0,
  });

  const closeMenuCtx = useMemo(() => ({closeMenu}), [closeMenu]);

  // setTriggerEl belongs on the chevron button, not this root: it is the
  // focus-restore target and a <div> cannot take focus. triggerRef stays here
  // because the panel anchors to the whole heading.
  const setRef = useMergedRefs<HTMLElement>(
    rootRef,
    ref,
    menu ? popover.triggerRef : undefined,
  );

  const showChevron = !!menu;
  const hasAnyHref = !!(headingHref || superheadingHref || subheadingHref);

  // Determine interaction mode
  const isWholeHeadingTrigger = !!menu && !hasAnyHref;
  const isWholeHeadingLink =
    !!headingHref && !menu && !superheadingHref && !subheadingHref;

  // Render text content with optional inline chevron
  const renderTextContent = (inlineChevron?: ReactNode) => (
    <span className={styles.textContainer}>
      {superheading &&
        (hasAnyHref && superheadingHref && menu ? (
          <Link
            href={superheadingHref}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            color="secondary"
            size="xsm">
            {superheading}
          </Link>
        ) : (
          <span className={styles.superheading}>{superheading}</span>
        ))}
      <span className={styles.headingRow}>
        {hasAnyHref && headingHref && menu ? (
          <LinkComponent
            href={headingHref}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className={cn(styles.heading, styles.headingLink)}>
            {heading}
          </LinkComponent>
        ) : (
          <span className={styles.heading}>{heading}</span>
        )}
        {inlineChevron}
      </span>
      {subheading &&
        (hasAnyHref && subheadingHref && menu ? (
          <Link
            href={subheadingHref}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            color="secondary"
            size="xsm">
            {subheading}
          </Link>
        ) : (
          <span className={styles.subheading}>{subheading}</span>
        ))}
    </span>
  );

  const chevronElement = showChevron && (
    <Icon
      icon="chevronDown"
      size="sm"
      color="secondary"
      className={cn(styles.chevron, styles.chevronGlyph)}
    />
  );

  const headerEndContentElement = headerEndContent && (
    <span className={styles.headerEndContent}>{headerEndContent}</span>
  );

  // Shared popover heading content — uses renderTextContent for consistent
  // sizing, with flipped chevron inline after the title. Always static (no links).
  const popoverHeadingContent = (
    <button
      type="button"
      className={styles.popoverHeading}
      // A close affordance, not the trigger: dismiss only.
      onClick={closeMenu}>
      {logo && <span className={styles.logo}>{logo}</span>}
      {renderTextContent(
        <Icon
          icon="chevronDown"
          size="sm"
          color="secondary"
          className={cn(styles.chevron, styles.chevronGlyph, styles.popoverChevron)}
        />,
      )}
    </button>
  );

  // Simple: no heading text, just logo (backward compat for logo-only usage)
  if (!heading && !menu) {
    const Element = headingHref ? LinkComponent : 'div';
    return (
      <Element
        ref={ref as React.Ref<HTMLAnchorElement & HTMLDivElement>}
        href={headingHref}
        aria-label={headingHref ? logoLabel : undefined}
        data-testid={testId}
        {...mergeProps(
          themeProps('top-nav-heading'),
          {className: cn(styles.root, !!headingHref && styles.menuTrigger)},
          className,
          style,
        )}
        {...props}>
        {logo && <span className={styles.logo}>{logo}</span>}
      </Element>
    );
  }

  // Whole heading is a link (no menu, single headingHref)
  if (isWholeHeadingLink && headingHref) {
    return (
      <LinkComponent
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={headingHref}
        data-testid={testId}
        {...mergeProps(
          themeProps('top-nav-heading'),
          {className: cn(styles.root, styles.menuTrigger)},
          className,
          style,
        )}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {logo && <span className={styles.logo}>{logo}</span>}
        {renderTextContent()}
        {headerEndContentElement}
        {chevronElement}
      </LinkComponent>
    );
  }

  // Whole header is the popover trigger (menu, no hrefs)
  if (isWholeHeadingTrigger) {
    return (
      <>
        <div
          ref={setRef}
          data-testid={testId}
          {...triggerProps}
          {...mergeProps(
            themeProps('top-nav-heading'),
            {className: cn(styles.root, styles.menuTrigger)},
            className,
            style,
          )}>
          {logo && <span className={styles.logo}>{logo}</span>}
          {renderTextContent(
            // Stays a <button>: this box is the popover trigger, so it carries
            // the accessible name and handlers — only the glyph moves to Icon.
            <button
              ref={setTriggerEl}
              type="button"
              aria-label={t('@solo.topNav.heading.openMenu')}
              onClick={e => {
                e.stopPropagation();
                triggerProps.onClick();
              }}
              {...popover.triggerProps}
              className={cn(styles.chevron, styles.interactive)}>
              <Icon
                icon="chevronDown"
                size="sm"
                color="inherit"
                className={styles.chevronGlyph}
              />
            </button>,
          )}
          {headerEndContentElement}
        </div>
        {popover.render(
          <div
            ref={menuRef}
            className={styles.popoverContent}
            {...contentProps}>
            {popoverHeadingContent}
            {/* The menu role is scoped to the actual menu items so the
                heading button above stays a valid sibling, not an invalid
                child of a role="menu" element. */}
            <div
              role="menu"
              aria-label={heading ?? t('@solo.topNav.heading.dialogLabel')}>
              <NavHeadingCloseContext value={closeMenuCtx}>
                {menu}
              </NavHeadingCloseContext>
            </div>
          </div>,
          {
            placement: 'below',
            alignment: 'start',
            className: styles.popoverOverlap,
          },
        )}
      </>
    );
  }

  // Mixed mode: independent links + chevron trigger for menu
  if (menu && hasAnyHref) {
    return (
      <>
        <div
          ref={setRef}
          data-testid={testId}
          {...triggerProps}
          {...mergeProps(
            themeProps('top-nav-heading'),
            {className: styles.root},
            className,
            style,
          )}>
          {logo &&
            (headingHref ? (
              <LinkComponent
                href={headingHref}
                aria-label={logoLinkLabel}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className={styles.logo}>
                {logo}
              </LinkComponent>
            ) : (
              <span className={styles.logo}>{logo}</span>
            ))}
          {renderTextContent(
            showChevron ? (
              // Stays a <button>: this box is the popover trigger, so it
              // carries the accessible name and handlers — only the glyph
              // moves to Icon.
              <button
                ref={setTriggerEl}
                type="button"
                aria-label={t('@solo.topNav.heading.openMenu')}
                onClick={e => {
                  e.stopPropagation();
                  triggerProps.onClick();
                }}
                {...popover.triggerProps}
                className={cn(styles.chevron, styles.interactive)}>
                <Icon
                  icon="chevronDown"
                  size="sm"
                  color="inherit"
                  className={styles.chevronGlyph}
                />
              </button>
            ) : undefined,
          )}
          {headerEndContentElement}
        </div>
        {popover.render(
          <div
            ref={menuRef}
            className={styles.popoverContent}
            {...contentProps}>
            {popoverHeadingContent}
            {/* The menu role is scoped to the actual menu items so the
                heading button above stays a valid sibling, not an invalid
                child of a role="menu" element. */}
            <div
              role="menu"
              aria-label={heading ?? t('@solo.topNav.heading.dialogLabel')}>
              <NavHeadingCloseContext value={closeMenuCtx}>
                {menu}
              </NavHeadingCloseContext>
            </div>
          </div>,
          {
            placement: 'below',
            alignment: 'start',
            className: styles.popoverOverlap,
          },
        )}
      </>
    );
  }

  // Static heading with independent links (no menu)
  if (hasAnyHref && !isWholeHeadingLink) {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-testid={testId}
        {...mergeProps(
          themeProps('top-nav-heading'),
          {className: styles.root},
          className,
          style,
        )}
        {...props}>
        {logo &&
          (headingHref ? (
            <LinkComponent
              href={headingHref}
              aria-label={logoLinkLabel}
              className={styles.logo}>
              {logo}
            </LinkComponent>
          ) : (
            <span className={styles.logo}>{logo}</span>
          ))}
        <span className={styles.textContainer}>
          {superheading &&
            (superheadingHref ? (
              <Link href={superheadingHref} color="secondary" size="xsm">
                {superheading}
              </Link>
            ) : (
              <span className={styles.superheading}>{superheading}</span>
            ))}
          {headingHref ? (
            <Link href={headingHref} color="primary" weight="semibold">
              {heading}
            </Link>
          ) : (
            <span className={styles.heading}>{heading}</span>
          )}
          {subheading &&
            (subheadingHref ? (
              <Link href={subheadingHref} color="secondary" size="xsm">
                {subheading}
              </Link>
            ) : (
              <span className={styles.subheading}>{subheading}</span>
            ))}
        </span>
        {headerEndContentElement}
        {chevronElement}
      </div>
    );
  }

  // Default: static heading, no links, no menu
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-testid={testId}
      {...mergeProps(
        themeProps('top-nav-heading'),
        {className: styles.root},
        className,
        style,
      )}
      {...props}>
      {logo && <span className={styles.logo}>{logo}</span>}
      {renderTextContent()}
      {headerEndContentElement}
      {chevronElement}
    </div>
  );
}

TopNavHeading.displayName = 'TopNavHeading';
