'use client';

/**
 * @file SideNavSection.tsx
 * @input Uses React, Tailwind classes
 * @output Exports SideNavSection component and SideNavSectionProps
 * @position Core implementation; used inside SideNav children
 *
 * Section grouping for navigation items with optional title and end content.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/SideNav/SideNav.doc.mjs
 * - /packages/core/src/SideNav/SideNav.test.tsx
 * - /packages/core/src/SideNav/index.ts
 * - /apps/storybook/stories/SideNav.stories.tsx
 */

import React, {useId, type ReactNode} from 'react';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {useSideNavCollapse} from './SideNavCollapseContext';
import {VisuallyHidden} from '../VisuallyHidden';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';
// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: 'flex flex-col py-(--spacing-1)',
  header: cn(
    'flex items-center gap-(--spacing-2) px-(--spacing-2) py-(--spacing-1)',
    'cursor-default select-none',
  ),

  titleContainer: 'flex flex-col flex-1 min-w-0',
  title: cn(
    'text-(length:--text-supporting-size) font-(number:--font-weight-semibold)',
    'leading-(--text-supporting-leading) text-(--color-text-secondary)',
    'overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  subtitle: cn(
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary) overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  endContent: 'shrink-0 flex items-center',

  items: 'flex flex-col gap-(--spacing-0-5)',
} as const;

// =============================================================================
// Types
// =============================================================================

export interface SideNavSectionProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Section title.
   */
  title: string;
  /**
   * Section subtitle.
   */
  subtitle?: string;
  /**
   * Section items.
   */
  children: ReactNode;
  /**
   * Right-side content in the section header.
   */
  endContent?: ReactNode;
  /**
   * Whether the section header is visually hidden.
   * The section title is still accessible to screen readers.
   * @default false
   */
  isHeaderHidden?: boolean;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Section grouping for SideNav items.
 *
 * Renders a labeled group of navigation items.
 * Uses `role="group"` with `aria-labelledby` for accessibility.
 *
 * @example
 * ```
 * <SideNavSection title="Main">
 *   <SideNavItem label="Dashboard" icon={HomeIcon} isSelected />
 *   <SideNavItem label="Projects" icon={FolderIcon} />
 * </SideNavSection>
 * ```
 */
export function SideNavSection({
  ref,
  title,
  subtitle,
  children,
  endContent,
  isHeaderHidden = false,
  className,
  style,
  'data-testid': testId,
  ...rest
}: SideNavSectionProps) {
  const {isCollapsed} = useSideNavCollapse();
  const id = useId();
  const titleId = `${id}-title`;

  const headerContent = (
    <>
      <span className={styles.titleContainer}>
        <span id={titleId} className={styles.title}>
          {title}
        </span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </span>
      {endContent && (
        <span className={styles.endContent}>{endContent}</span>
      )}
    </>
  );

  const shouldHideHeader = isHeaderHidden || isCollapsed;

  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('side-nav-section'),
        {className: styles.root},
        className,
        style,
      )}
      {...rest}
      role="group"
      aria-labelledby={titleId}
      data-testid={testId}>
      {shouldHideHeader ? (
        <VisuallyHidden as="div">{headerContent}</VisuallyHidden>
      ) : (
        <div className={styles.header}>{headerContent}</div>
      )}
      <div className={styles.items}>{children}</div>
    </div>
  );
}

SideNavSection.displayName = 'SideNavSection';
