'use client';

/**
 * @file SideNavHeading.tsx
 * @input Uses React, useRef, useCallback, ReactNode, Tailwind classes, usePopover
 * @output Exports SideNavHeading component and SideNavHeadingProps
 * @position Core implementation; used inside SideNav header slot
 *
 * Product/suite/account heading with smart interaction boundary logic.
 * Composes usePopover internally when menu prop is provided.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/SideNav/SideNav.doc.mjs
 * - /packages/core/src/SideNav/SideNav.test.tsx
 * - /packages/core/src/SideNav/index.ts
 * - /apps/storybook/stories/SideNav.stories.tsx
 */

import {useMemo, useRef, type ReactNode} from 'react';
// TODO: Lazy-load usePopover so the popover/layer bundle is not
// eagerly imported when `menu` is not provided. See Text for an example
// of lazy loading layer resources.
import {usePopover} from '../Popover/usePopover';
import {Link} from '../Link';
import {Icon} from '../Icon';
import {Tooltip} from '../Tooltip';
import {navItemStyles} from '../NavItem/navItemStyles.styles';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';
import {useSideNavCollapse} from './SideNavCollapseContext';
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
    'box-border [text-decoration:none] text-inherit cursor-default',
  ),
  rootCollapsed: 'justify-center px-0',
  interactive: cn(
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'rounded-(--radius-element) [border-width:0] [border-style:none] bg-transparent',
    '[font-family:inherit] text-[length:inherit] font-(number:--font-weight-normal) text-start',
    'can-hover:usable:hover:bg-(--color-overlay-hover)',
  ),
  // Menu trigger: like interactive but no hover background.
  // Only cursor:pointer signals interactivity; the popover provides context.
  menuTrigger: cn(
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'rounded-(--radius-element) [border-width:0] [border-style:none] bg-transparent',
    '[font-family:inherit] text-[length:inherit] font-(number:--font-weight-normal) text-start',
  ),
  interactiveCollapsed: 'bg-transparent can-hover:usable:hover:bg-transparent',
  icon: 'shrink-0 flex items-center justify-center',
  textContainer: 'flex flex-col flex-1 min-w-0',
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
  // When super/sub headings are present, keep same size but allow compact layout
  headingCompact: 'font-(number:--font-weight-semibold)',
  subheading: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary)',
    '[text-decoration:none] overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  headingRow: 'flex items-center gap-(--spacing-1)',
  headingLink: cn(
    'text-inherit',
    '[text-decoration:none] overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  chevron: cn(
    'shrink-0 flex items-center justify-center min-w-(--spacing-7) min-h-(--spacing-7)',
    'text-(--color-icon-secondary)',
    // 28px is the hit/alignment box, not the glyph. Icon sizes its own span
    // with a matching font-size (the registry chevron is a 1em SVG), so pin
    // font-size back to inherit to keep the glyph at the 14px it renders at
    // today. The 28px min box still wins over Icon's width/height.
    'text-[length:inherit]',
  ),
  headerEndContent: 'shrink-0 flex items-center ms-auto',
  popoverContent: 'p-(--spacing-1) overflow-hidden',
  // Static heading replica inside the popover — matches inline heading layout.
  // Clickable to close the popover.
  popoverHeading: cn(
    'flex items-center gap-(--spacing-2) w-full [border-width:0] [border-style:none]',
    'bg-transparent [font-family:inherit] text-[length:inherit] text-inherit text-start',
    'min-h-(--spacing-8) ps-(--spacing-2) has-[.solo-nav-icon]:ps-0 pe-(--spacing-2) py-0',
    'mbs-(--spacing-1) mbe-(--spacing-2) mx-(--spacing-1)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  ),
  // Chevron inside the popover heading — same as chevron but rotated up
  popoverChevron: cn(
    'shrink-0 flex items-center justify-center min-w-(--spacing-7) min-h-(--spacing-7)',
    'text-(--color-icon-secondary)',
    // See `chevron` — keep the glyph on the inherited font-size.
    'text-[length:inherit] [transform:rotate(180deg)]',
  ),
  // Glyph inside a chevron *trigger* (the button already carries the 28px box
  // and the color, so the Icon only has to avoid resizing itself).
  chevronGlyph: 'text-[length:inherit]',
  popover: 'min-w-[anchor-size(width)] mbs-(--spacing-1)',
  // Overlap variant: popover covers the trigger so heading appears "in place".
  // Add 4px padding inside, then widen and shift to compensate so the
  // heading text inside the popover still aligns with the inline heading.
  popoverOverlap: cn(
    'min-w-[calc(anchor-size(width)_+_16px)]',
    'mbs-[calc(-1_*_anchor-size(height)_-_8px)] ms-[-8px]',
  ),
} as const;

// =============================================================================
// Types
// =============================================================================

export interface SideNavHeadingProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Product/app icon.
   */
  icon?: ReactNode;
  /**
   * Custom component to render instead of `<a>`.
   * Overrides the provider-level default set by LinkProvider.
   * Must accept href, className, style, and children props.
   */
  as?: LinkComponentType;
  /**
   * Product/app name.
   */
  heading: string;
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
   * Hidden in collapsed mode.
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
}

// =============================================================================

// =============================================================================
// Component
// =============================================================================

/**
 * Product/suite/account heading for SideNav.
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
 * <SideNavHeading icon={<AppIcon />} heading="My App" headingHref="/" />
 * <SideNavHeading
 *   icon={<SuiteIcon />}
 *   superheading="Suite Name"
 *   superheadingHref="/suite"
 *   heading="Product Name"
 *   headingHref="/product"
 *   menu={<ProductSwitcher />}
 * />
 * <SideNavHeading
 *   icon={<AppIcon />}
 *   heading="Product Name"
 *   subheading="Business Account"
 *   menu={<AccountSwitcher />}
 * />
 * ```
 */
export function SideNavHeading({
  as,
  icon,
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
}: SideNavHeadingProps) {
  const t = useTranslator();
  const LinkComponent = useLinkComponent(as);
  const {isCollapsed} = useSideNavCollapse();
  const rootRef = useRef<HTMLDivElement>(null);
  const collapsedItemRef = useRef<HTMLElement>(null);

  const popover = usePopover({
    dialogLabel: t('@solo.sideNav.heading.dialogLabel'),
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
  const setRef = useMergedRefs<HTMLDivElement>(
    rootRef,
    ref,
    menu ? popover.triggerRef : undefined,
  );
  const collapsedSetRef = useMergedRefs<HTMLElement>(
    collapsedItemRef,
    ref,
    // Collapsed, this button is the trigger, so it takes both roles.
    menu ? popover.triggerRef : undefined,
    menu ? setTriggerEl : undefined,
  );

  // In collapsed mode: hide if no icon, show icon-only if has icon
  if (isCollapsed && !icon) {
    return null;
  }
  if (isCollapsed && icon) {
    const collapsedIcon = <span className={styles.icon}>{icon}</span>;

    let collapsedElement: ReactNode;

    if (headingHref) {
      collapsedElement = (
        <LinkComponent
          ref={collapsedSetRef as React.Ref<HTMLAnchorElement>}
          href={headingHref}
          aria-label={heading}
          data-testid={testId}
          {...mergeProps(
            themeProps('side-nav-heading'),
            {
              className: cn(
                focusOutlineStyles.focusVisible,
                navItemStyles.item,
                interactionOverlayStyles.backgroundColor,
                styles.rootCollapsed,
              ),
            },
            className,
            style,
          )}>
          {collapsedIcon}
        </LinkComponent>
      );
    } else if (menu) {
      collapsedElement = (
        <>
          <button
            ref={collapsedSetRef}
            type="button"
            aria-label={heading}
            data-testid={testId}
            {...popover.triggerProps}
            {...triggerProps}
            {...mergeProps(
              themeProps('side-nav-heading'),
              {
                // No `interactionOverlayStyles.backgroundColor`:
                // `menuTrigger`'s `backgroundColor: 'transparent'` replaces
                // the overlay wholesale (hover/press arms included).
                // `menuTrigger`'s `font-size: inherit` must not drop the row's
                // line-height (tailwind-merge pairs font-size with leading),
                // so restate it last.
                className: cn(
                  focusOutlineStyles.focusVisible,
                  navItemStyles.item,
                  styles.rootCollapsed,
                  styles.menuTrigger,
                  'leading-(--text-label-leading)',
                ),
              },
              className,
              style,
            )}>
            {collapsedIcon}
          </button>
          {popover.render(
            <div
              ref={menuRef}
              className={styles.popoverContent}
              {...contentProps}>
              <button
                type="button"
                className={cn(
                  focusOutlineStyles.focusVisible,
                  styles.popoverHeading,
                )}
                // A close affordance, not the trigger: dismiss only.
                onClick={closeMenu}>
                {icon && <span className={styles.icon}>{icon}</span>}
                <span className={styles.textContainer}>
                  {superheading && (
                    <span className={styles.superheading}>
                      {superheading}
                    </span>
                  )}
                  <span className={styles.headingRow}>
                    <span
                      className={cn(
                        styles.heading,
                        !!(superheading || subheading) && styles.headingCompact,
                      )}>
                      {heading}
                    </span>
                    <Icon
                      icon="chevronDown"
                      size="sm"
                      color="secondary"
                      className={styles.popoverChevron}
                    />
                  </span>
                  {subheading && (
                    <span className={styles.subheading}>{subheading}</span>
                  )}
                </span>
              </button>
              {/* The menu role is scoped to the actual menu items so the
                  heading button above stays a valid sibling, not an invalid
                  child of a role="menu" element. */}
              <div role="menu" aria-label={heading}>
                <NavHeadingCloseContext value={closeMenuCtx}>
                  {menu}
                </NavHeadingCloseContext>
              </div>
            </div>,
            {placement: 'below', alignment: 'start', className: styles.popover},
          )}
        </>
      );
    } else {
      collapsedElement = (
        <div
          ref={collapsedSetRef}
          data-testid={testId}
          {...mergeProps(
            themeProps('side-nav-heading'),
            {className: cn(styles.root, styles.rootCollapsed)},
            className,
            style,
          )}
          {...props}>
          {collapsedIcon}
        </div>
      );
    }

    return (
      <>
        {collapsedElement}
        <Tooltip
          content={heading}
          placement="end"
          anchorRef={collapsedItemRef}
        />
      </>
    );
  }

  const showChevron = !!menu;
  const hasAnyHref = !!(headingHref || superheadingHref || subheadingHref);
  const hasCompactHeading = !!(superheading || subheading);

  // Determine interaction mode
  const isWholeHeadingTrigger = !!menu && !hasAnyHref;
  const isWholeHeadingLink =
    !!headingHref && !menu && !superheadingHref && !subheadingHref;

  // Render text content with optional inline chevron
  const renderTextContent = (inlineChevron?: ReactNode) => (
    <span className={styles.textContainer}>
      {superheading &&
        (hasAnyHref && superheadingHref && menu ? (
          <Link href={superheadingHref} color="secondary" size="xsm">
            {superheading}
          </Link>
        ) : (
          <span className={styles.superheading}>{superheading}</span>
        ))}
      <span className={styles.headingRow}>
        {hasAnyHref && headingHref && menu ? (
          <LinkComponent
            href={headingHref}
            className={cn(
              focusOutlineStyles.focusVisible,
              styles.heading,
              styles.headingLink,
            )}>
            {heading}
          </LinkComponent>
        ) : (
          <span className={styles.heading}>{heading}</span>
        )}
        {inlineChevron}
      </span>
      {subheading &&
        (hasAnyHref && subheadingHref && menu ? (
          <Link href={subheadingHref} color="secondary" size="xsm">
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
      className={styles.chevron}
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
      className={cn(focusOutlineStyles.focusVisible, styles.popoverHeading)}
      // A close affordance, not the trigger: dismiss only.
      onClick={closeMenu}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {renderTextContent(
        <Icon
          icon="chevronDown"
          size="sm"
          color="secondary"
          className={styles.popoverChevron}
        />,
      )}
    </button>
  );

  // Whole heading is a link (no menu, single headingHref)
  if (isWholeHeadingLink && headingHref) {
    return (
      <LinkComponent
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={headingHref}
        data-testid={testId}
        {...mergeProps(
          themeProps('side-nav-heading'),
          {
            className: cn(
              focusOutlineStyles.focusVisible,
              styles.root,
              styles.menuTrigger,
            ),
          },
          className,
          style,
        )}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {icon && <span className={styles.icon}>{icon}</span>}
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
            themeProps('side-nav-heading'),
            {className: cn(styles.root, styles.menuTrigger)},
            className,
            style,
          )}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {renderTextContent(
            <button
              ref={setTriggerEl}
              type="button"
              aria-label={t('@solo.sideNav.heading.openMenu')}
              onClick={e => {
                e.stopPropagation();
                triggerProps.onClick();
              }}
              {...popover.triggerProps}
              className={cn(
                focusOutlineStyles.focusVisible,
                styles.chevron,
                styles.interactive,
              )}>
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
            <div role="menu" aria-label={heading}>
              {menu}
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
  // Popover anchors to the full heading div, not the chevron, so it
  // appears in the same position as the no-links case.
  if (menu && hasAnyHref) {
    return (
      <>
        <div
          ref={setRef}
          data-testid={testId}
          {...triggerProps}
          {...mergeProps(
            themeProps('side-nav-heading'),
            {className: styles.root},
            className,
            style,
          )}>
          {icon &&
            (headingHref ? (
              <LinkComponent
                href={headingHref}
                aria-label={heading}
                className={cn(focusOutlineStyles.focusVisible, styles.icon)}>
                {icon}
              </LinkComponent>
            ) : (
              <span className={styles.icon}>{icon}</span>
            ))}
          {renderTextContent(
            showChevron ? (
              <button
                ref={setTriggerEl}
                type="button"
                aria-label={t('@solo.sideNav.heading.openMenu')}
                onClick={e => {
                  e.stopPropagation();
                  triggerProps.onClick();
                }}
                {...popover.triggerProps}
                className={cn(
                  focusOutlineStyles.focusVisible,
                  styles.chevron,
                  styles.interactive,
                )}>
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
            <div role="menu" aria-label={heading}>
              {menu}
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
        ref={ref}
        data-testid={testId}
        {...mergeProps(
          themeProps('side-nav-heading'),
          {className: styles.root},
          className,
          style,
        )}
        {...props}>
        {icon &&
          (headingHref ? (
            <LinkComponent
              href={headingHref}
              aria-label={heading}
              className={cn(focusOutlineStyles.focusVisible, styles.icon)}>
              {icon}
            </LinkComponent>
          ) : (
            <span className={styles.icon}>{icon}</span>
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
            <span
              className={cn(
                styles.heading,
                hasCompactHeading && styles.headingCompact,
              )}>
              {heading}
            </span>
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
      ref={ref}
      data-testid={testId}
      {...mergeProps(
        themeProps('side-nav-heading'),
        {className: styles.root},
        className,
        style,
      )}
      {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {renderTextContent()}
      {headerEndContentElement}
      {chevronElement}
    </div>
  );
}

SideNavHeading.displayName = 'SideNavHeading';
