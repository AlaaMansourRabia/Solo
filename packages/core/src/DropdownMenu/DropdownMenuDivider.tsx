'use client';

/**
 * @file DropdownMenuDivider.tsx
 * @input Uses Divider, spacing tokens, themeProps
 * @output Exports DropdownMenuDivider component and DropdownMenuDividerProps
 * @position Sub-component; used inside DropdownMenu
 *
 * The compound-mode peer of the data API's `{type: 'divider'}` option. The
 * data path renders this same component, so neither mode can drift from the
 * other in DOM, spacing, or theme target.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/DropdownMenu/DropdownMenu.doc.mjs
 * - /packages/core/src/DropdownMenu/DropdownMenuDivider.doc.mjs
 * - /packages/core/src/DropdownMenu/DropdownMenu.test.tsx
 * - /packages/core/src/DropdownMenu/index.ts
 * - /packages/core/src/ContextMenu/index.ts
 * - /packages/core/src/Breadcrumbs/index.ts
 * - /apps/storybook/stories/DropdownMenu.stories.tsx
 */

import {Divider} from '../Divider';
import {cn} from '../utils/cn';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';

const styles = {
  divider: 'my-(--spacing-1)',
} as const;

const THEME_CLASS_NAME = themeProps('dropdown-menu-divider').className;

export interface DropdownMenuDividerProps extends Pick<
  BaseProps,
  'className' | 'style'
> {
  /** Ref forwarded to the separator element. */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * A horizontal rule separating groups of menu rows.
 *
 * Renders `role="separator"`, so it is never a stop in the menu's arrow-key
 * order. Equivalent to `{type: 'divider'}` in the `items` data API.
 *
 * @example
 * ```
 * <DropdownMenu button={{ label: 'Actions' }}>
 *   <DropdownMenuItem label="Edit" onClick={handleEdit} />
 *   <DropdownMenuDivider />
 *   <DropdownMenuItem label="Delete" variant="destructive" onClick={handleDelete} />
 * </DropdownMenu>
 * ```
 */
export function DropdownMenuDivider({
  className,
  style,
  ref,
}: DropdownMenuDividerProps) {
  return (
    <Divider
      ref={ref}
      className={cn(THEME_CLASS_NAME, styles.divider, className)}
      style={style}
    />
  );
}

DropdownMenuDivider.displayName = 'DropdownMenuDivider';
