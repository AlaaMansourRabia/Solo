/**
 * @file NavIcon.tsx
 * @input Uses React, HTMLAttributes, ReactNode
 * @output Exports NavIcon component and NavIconProps
 * @position Shared circular icon container for navigation headers (TopNav, PageNav)
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/NavIcon/NavIcon.doc.mjs
 * - /packages/core/src/NavIcon/NavIcon.test.tsx
 * - /packages/core/src/NavIcon/index.ts
 * - /apps/storybook/stories/TopNav.stories.tsx
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

/**
 * NavIcon styles
 */
const styles = {
  base: cn(
    'flex items-center justify-center rounded-[50%]',
    'bg-(--color-accent) text-(--color-on-accent) shrink-0',
    'w-(--size-element-md) h-(--size-element-md)',
  ),
} as const;

export interface NavIconProps extends BaseProps<HTMLSpanElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLSpanElement>;
  /**
   * The icon element to render inside the circular background.
   * Should be an Icon or similar icon component.
   */
  icon: ReactNode;
}

/**
 * Circular icon container for navigation headers.
 *
 * Wraps an icon with a circular accent-colored background, suitable for
 * use as a logo in top navigation or side navigation title areas.
 *
 * @example
 * ```
 * import {HomeIcon} from '@heroicons/react/24/solid';
 * <TopNavHeading
 *   heading="Dashboard"
 *   logo={<NavIcon icon={<HomeIcon style={{width: 16, height: 16}} />} />}
 * />
 * <PageNavHeader
 *   icon={<NavIcon icon={<HomeIcon style={{width: 16, height: 16}} />} />}
 *   heading="My App"
 * />
 * ```
 */
export function NavIcon({
  icon,
  className,
  style,
  ref,
  ...props
}: NavIconProps) {
  return (
    <span
      ref={ref}
      {...mergeProps(
        themeProps('nav-icon', undefined, {
          // `navicon` ran the compound name together; keep it emitted so
          // existing themes continue to work.
          legacyNames: ['navicon'],
        }),
        {className: styles.base},
        className,
        style,
      )}
      {...props}>
      {icon}
    </span>
  );
}

NavIcon.displayName = 'NavIcon';
