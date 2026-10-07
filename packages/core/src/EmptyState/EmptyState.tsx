/**
 * @file EmptyState.tsx
 * @input Uses React, HTMLAttributes
 * @output Exports EmptyState component, EmptyStateProps type
 * @position Core implementation; consumed by index.ts
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/EmptyState/EmptyState.doc.mjs (props table, features, implementation notes)
 * - /packages/core/src/EmptyState/EmptyState.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/EmptyState/index.ts (exports if types change)
 * - /apps/storybook/stories/EmptyState.stories.tsx (storybook stories)
 */

import {type ReactNode, createElement} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

// The compact font sizes re-apply the line-height after them: `cn()` drops an
// earlier `leading-*` when a later font-size class follows it.
const styles = {
  container:
    'flex flex-col items-center justify-center text-center gap-(--spacing-4) py-(--spacing-8) px-(--spacing-6)',
  containerCompact: 'gap-(--spacing-2) py-(--spacing-4) px-(--spacing-4)',
  title:
    'm-0 [font-family:inherit] text-(length:--text-large-size) font-(number:--font-weight-semibold) leading-(--text-large-leading) text-(--color-text-primary)',
  titleCompact:
    'text-(length:--text-label-size) leading-(--text-large-leading)',
  description:
    'm-0 [font-family:inherit] text-(length:--text-body-size) font-(number:--font-weight-normal) leading-(--text-body-leading) text-(--color-text-secondary)',
  descriptionCompact:
    'text-(length:--text-supporting-size) leading-(--text-body-leading)',
  textGroup: 'flex flex-col items-center max-w-[360px]',
  actions: 'flex flex-row items-center gap-(--spacing-2) mt-(--spacing-1)',
  actionsCompact: 'flex-col',
} as const;

export interface EmptyStateProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * The primary message displayed in the empty state.
   */
  title: string;
  /**
   * Optional secondary text providing additional context.
   */
  description?: string;
  /**
   * Optional icon or illustration displayed above the title.
   * Rendered as decorative (aria-hidden="true").
   */
  icon?: ReactNode;
  /**
   * Optional action buttons displayed below the description.
   * Laid out horizontally by default, stacked vertically when `isCompact`.
   */
  actions?: ReactNode;
  /**
   * Semantic heading level for the title element.
   * Controls only the rendered HTML tag (h1–h6) so the title fits the
   * document outline. This is a semantic change for accessibility and does
   * not change the visual size of the title, which stays fixed regardless
   * of level.
   * @default 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Use compact variant for constrained spaces with reduced spacing.
   * @default false
   */
  isCompact?: boolean;
}

/**
 * An empty state placeholder for content areas with no data.
 * Displays an icon or illustration, title, optional description, and action buttons.
 *
 * Uses `role="status"` to announce content to screen readers.
 * Styles use Solo theme tokens via Tailwind classes. Wrap your app in <Theme> to apply a theme.
 *
 * @example
 * ```
 * <EmptyState
 *   title="No results found"
 *   description="Try adjusting your search or filters."
 * />
 * <EmptyState
 *   icon={<Icon icon={InboxIcon} size="lg" />}
 *   title="No messages"
 *   description="You're all caught up!"
 *   actions={<Button label="Compose" variant="primary" />}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon,
  actions,
  headingLevel = 3,
  isCompact = false,
  className,
  style,
  ref,
  ...props
}: EmptyStateProps) {
  const HeadingTag = `h${headingLevel}` as const;
  return (
    <div
      ref={ref}
      {...props}
      role="status"
      {...mergeProps(
        themeProps('empty-state', {variant: isCompact ? 'compact' : null}),
        {
          className: cn(
            styles.container,
            isCompact && styles.containerCompact,
            className,
          ),
          style,
        },
      )}>
      {icon != null && <div aria-hidden="true">{icon}</div>}
      <div className={styles.textGroup}>
        {createElement(
          HeadingTag,
          mergeProps(
            themeProps('empty-state-title', {
              variant: isCompact ? 'compact' : null,
            }),
            cn(styles.title, isCompact && styles.titleCompact),
          ),
          title,
        )}
        {description != null && (
          // Rendered as <div> (not <p>): description accepts ReactNode and a
          // <p> cannot legally contain block children, which causes hydration
          // mismatches. The `m-0` class sets margin: 0, so appearance is
          // unchanged.
          <div
            {...mergeProps(
              themeProps('empty-state-description', {
                variant: isCompact ? 'compact' : null,
              }),
              cn(styles.description, isCompact && styles.descriptionCompact),
            )}>
            {description}
          </div>
        )}
      </div>
      {actions != null && (
        <div
          className={cn(styles.actions, isCompact && styles.actionsCompact)}>
          {actions}
        </div>
      )}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';
