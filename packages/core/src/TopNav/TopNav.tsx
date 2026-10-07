'use client';

/**
 * @file TopNav.tsx
 * @input Uses React, ReactNode
 * @output Exports TopNav component and TopNavProps
 * @position Core implementation; consumed by index.ts
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/TopNav/TopNav.doc.mjs
 * - /packages/core/src/TopNav/TopNav.test.tsx
 * - /packages/core/src/TopNav/index.ts
 * - /apps/storybook/stories/TopNav.stories.tsx
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {cn} from '../utils/cn';
import {mergeProps} from '../utils';
import {useTranslator} from '../i18n';
import {TopNavSlotContext} from './TopNavContext';
import {useTopNavRenderMode} from './TopNavRenderContext';
import {useTopNavMobileContent} from './TopNavMobileContentContext';
import {Divider} from '../Divider/Divider';
import {MobileNav} from '../MobileNav/MobileNav';
import {MobileNavToggle} from '../MobileNav/MobileNavToggle';
import {useAppShellMobile} from '../AppShell/AppShellMobileContext';
import {themeProps} from '../utils/themeProps';

/**
 * Base TopNav styles
 */
const styles = {
  base: 'items-center w-full p-(--spacing-2) box-border',
  // Flex layout (default, used when no centerContent)
  baseFlex: 'flex',
  // Grid layout (used when centerContent is present)
  baseGrid: 'grid [grid-template-columns:1fr_auto_1fr]',
  leftSection: 'flex items-center gap-(--spacing-4) [flex:1_1_0%] min-w-0',
  heading: 'flex items-center shrink-0',
  startContent: 'flex items-center gap-(--spacing-1)',
  centerContent: 'flex items-center justify-center gap-(--spacing-1)',
  rightSection: 'flex items-center justify-end gap-(--spacing-1)',
  endContent: 'flex items-center gap-(--spacing-1) shrink-0 ms-auto',
  // Mobile bar mode — simplified top bar with heading + toggle + endContent
  mobileBar: 'flex items-center w-full p-(--spacing-2) box-border',
  mobileBarEnd: 'flex items-center gap-(--spacing-1) ms-auto',
  // Drawer mode — vertical list of nav items
  drawerItems: 'flex flex-col gap-(--spacing-0-5)',
  drawerDivider: 'my-(--spacing-2)',
  drawerExtraContent: undefined,
} as const;

export interface TopNavProps extends BaseProps<HTMLElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLElement>;
  /**
   * Heading slot content — typically TopNavHeading with logo and text.
   * Positioned at the left edge of the nav bar.
   */
  heading?: ReactNode;
  /**
   * Start content slot - typically navigation items or breadcrumbs.
   * Positioned after the title, left-aligned.
   */
  startContent?: ReactNode;
  /**
   * Alias for startContent. Prefer startContent when composing with other slots.
   *
   * This keeps the common React children pattern from silently dropping
   * navigation items. If both children and startContent are provided,
   * startContent takes precedence and children are ignored.
   */
  children?: ReactNode;
  /**
   * Center content slot - typically tabs, search bar, or primary navigation.
   * Positioned at the horizontal center of the nav bar.
   * When provided, the layout switches to a three-column CSS grid to ensure
   * true centering regardless of start/end content widths.
   */
  centerContent?: ReactNode;
  /**
   * End content slot - typically search, icons, user profile, utility menus.
   * Positioned at the right edge of the nav bar.
   */
  endContent?: ReactNode;
  /**
   * Accessible label for the navigation landmark.
   * Helps screen readers identify the navigation area.
   * @default 'Top navigation'
   */
  label?: string;
}

/**
 * Top navigation bar for application headers.
 *
 * Slot-based layout with `heading`, `startContent`, `centerContent`, and
 * `endContent`. `children` are accepted as an alias for `startContent`
 * so navigation items do not silently disappear when using the common
 * React children pattern. When `centerContent` is provided, the layout switches
 * to a three-column CSS grid to keep center content horizontally centered.
 *
 * @example
 * ```
 * <TopNav
 *   label="Main navigation"
 *   heading={<TopNavHeading heading="My App" />}
 *   startContent={<TopNavItem label="Home" href="/" isSelected />}
 *   endContent={<Button label="Search" variant="ghost" />}
 * />
 * ```
 */
export function TopNav({
  heading,
  startContent,
  children,
  centerContent,
  endContent,
  label: labelFromProps,
  className,
  style,
  ref,
  ...props
}: TopNavProps) {
  const t = useTranslator();
  const label = labelFromProps ?? t('@solo.topNav.landmarkLabel');
  const renderMode = useTopNavRenderMode();
  const mobileContent = useTopNavMobileContent();
  const {hasAutoToggle} = useAppShellMobile();
  const resolvedStartContent = startContent ?? children;
  const hasCenterContent = centerContent != null;
  const hasCollapsibleContent =
    resolvedStartContent != null || centerContent != null;
  // Show mobile toggle when there's ANY drawer content — own items OR SideNav via context
  const hasMobileDrawerContent = hasCollapsibleContent || mobileContent != null;

  // =========================================================================
  // Mobile bar mode — heading + endContent + toggle, hide nav items.
  // Falls through to default when there's no drawer content — no reason
  // to strip down the TopNav if there's nothing to put in the drawer.
  // =========================================================================
  if (renderMode === 'mobile-bar') {
    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label={label}
        {...mergeProps(
          themeProps('top-nav', {mode: 'mobile-bar'}),
          {className: styles.mobileBar},
          className,
          style,
        )}
        {...props}>
        {heading && <div className={styles.heading}>{heading}</div>}
        <div className={styles.mobileBarEnd}>
          {endContent}
          {hasMobileDrawerContent && hasAutoToggle && <MobileNavToggle />}
        </div>
      </nav>
    );
  }

  // =========================================================================
  // Drawer mode — render nav items vertically inside a MobileNav,
  // plus any additional content passed via context (e.g. SideNav items)
  // =========================================================================
  if (renderMode === 'drawer') {
    // Only render if there are collapsible items or extra content
    if (!hasCollapsibleContent && !mobileContent) {
      return null;
    }

    return (
      <MobileNav header={heading}>
        {hasCollapsibleContent && (
          <div className={styles.drawerItems}>
            {resolvedStartContent}
            {centerContent}
          </div>
        )}
        {hasCollapsibleContent && mobileContent && (
          <Divider className={styles.drawerDivider} />
        )}
        {mobileContent && (
          <div className={styles.drawerExtraContent}>
            {mobileContent}
          </div>
        )}
      </MobileNav>
    );
  }

  // =========================================================================
  // Default mode — full top bar
  // =========================================================================

  return (
    <nav
      ref={ref}
      role="navigation"
      aria-label={label}
      {...mergeProps(
        themeProps('top-nav'),
        {className: cn(styles.base, hasCenterContent ? styles.baseGrid : styles.baseFlex)},
        className,
        style,
      )}
      {...props}>
      <div className={styles.leftSection}>
        {heading && <div className={styles.heading}>{heading}</div>}
        {resolvedStartContent && (
          <TopNavSlotContext value="start">
            <div className={styles.startContent}>
              {resolvedStartContent}
            </div>
          </TopNavSlotContext>
        )}
      </div>
      {hasCenterContent && (
        <TopNavSlotContext value="center">
          <div className={styles.centerContent}>{centerContent}</div>
        </TopNavSlotContext>
      )}
      {hasCenterContent ? (
        <div className={styles.rightSection}>
          <TopNavSlotContext value="end">{endContent}</TopNavSlotContext>
        </div>
      ) : (
        endContent && (
          <div className={styles.endContent}>
            <TopNavSlotContext value="end">{endContent}</TopNavSlotContext>
          </div>
        )
      )}
    </nav>
  );
}

TopNav.displayName = 'TopNav';
