/**
 * @file Badge.tsx
 * @input Uses React, HTMLAttributes
 * @output Exports Badge component, BadgeProps, BadgeVariant types
 * @position Core implementation; consumed by index.ts
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Badge/Badge.doc.mjs (props table, features, implementation notes)
 * - /packages/core/src/Badge/Badge.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/Badge/index.ts (exports if types change)
 * - /apps/storybook/stories/Badge.stories.tsx (storybook stories)
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';
import type {BadgeVariantMap} from './index';

/**
 * Base badge styles
 */
const styles = {
  base: cn(
    'inline-flex items-center justify-center gap-(--spacing-1)',
    'h-(--spacing-5) py-0 px-(--spacing-2) rounded-(--radius-full)',
    '[font-family:inherit] text-(length:--text-supporting-size) leading-(--text-supporting-leading) font-(number:--font-weight-medium)',
    'whitespace-nowrap',
    // A badge is one line by construction — fixed height, `nowrap` — so a
    // label wider than the space available has to go somewhere. Without these
    // it went *outside* its container: `nowrap` with nothing to clip it
    // neither wraps nor truncates, it just escapes, and lands on whatever sits
    // beside it. `min-w-0` matters as much as the max: as a flex item the
    // automatic minimum size would otherwise hold the badge at its full text
    // width and push the clamp back out again.
    'max-w-full min-w-0',
  ),
  // The ellipsis goes on the label rather than the badge itself, because
  // `text-overflow` needs a block container and taking the root off
  // `inline-flex` to get one would cost the icon its centring. The label is a
  // flex item, so it needs its own `min-w-0` for the same reason as above.
  label: 'overflow-hidden text-ellipsis min-w-0',
} as const;

/**
 * Variant styles for different badge appearances.
 * Semantic variants use solid backgrounds; non-semantic use tinted backgrounds.
 */
const variants = {
  // Semantic variants
  neutral: 'bg-(--color-neutral) text-(--color-text-primary)',
  info: 'bg-(--color-accent) text-(--color-on-accent)',
  success: 'bg-(--color-success) text-(--color-on-success)',
  warning: 'bg-(--color-warning) text-(--color-on-warning)',
  error: 'bg-(--color-error) text-(--color-on-error)',
  // Non-semantic color variants — tinted backgrounds with colored text
  blue: 'bg-(--color-background-blue) text-(--color-text-blue)',
  cyan: 'bg-(--color-background-cyan) text-(--color-text-cyan)',
  green: 'bg-(--color-background-green) text-(--color-text-green)',
  orange: 'bg-(--color-background-orange) text-(--color-text-orange)',
  pink: 'bg-(--color-background-pink) text-(--color-text-pink)',
  purple: 'bg-(--color-background-purple) text-(--color-text-purple)',
  red: 'bg-(--color-background-red) text-(--color-text-red)',
  teal: 'bg-(--color-background-teal) text-(--color-text-teal)',
  yellow: 'bg-(--color-background-yellow) text-(--color-text-yellow)',
} as const;

/**
 * Badge variant type derived from BadgeVariantMap.
 * Extensible via module augmentation of BadgeVariantMap.
 */
export type BadgeVariant = keyof BadgeVariantMap;

export interface BadgeProps extends BaseProps<HTMLSpanElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLSpanElement>;
  /**
   * The visual style variant of the badge.
   * @default 'neutral'
   */
  variant?: BadgeVariant;
  /**
   * The badge label text.
   */
  label: ReactNode;

  /**
   * Optional icon to display before the label.
   */
  icon?: ReactNode;
}

/**
 * A badge component for displaying status indicators, counts, or labels.
 *
 * Styles use Solo theme tokens via Tailwind classes.
 * Wrap your app in <Theme> to apply a theme.
 *
 * @example
 * ```
 * <Badge label="Active" />
 * <Badge variant="success" label="Active" />
 * <Badge variant="error" label="3" />
 * <Badge variant="purple" label="Engineering" />
 * ```
 */
export function Badge({
  variant = 'neutral',
  label,
  icon,
  className,
  style,
  ref,
  ...props
}: BadgeProps) {
  // Clipping a label makes its tail unrecoverable, so the full text has to
  // stay reachable somewhere. `title` is the half of that answer which costs
  // nothing: no measurement, no hook, so `Badge` renders the same on the
  // server and stays usable in a server component. It follows the shape
  // `BaseTable` already uses for a truncated header cell (BaseTable.tsx) —
  // string content only, and only when there is something to show.
  //
  // A rich label is left alone: it is a subtree whose text would have to be
  // flattened to a string, and flattening renders a guess — an icon, a
  // `<strong>`, a nested element all read differently.
  //
  // It is set whether or not the label actually fits, because knowing that
  // requires measuring. The refinement — a tooltip only when the text is
  // really cut, reachable by hover and by focus — needs that measurement and
  // a client component, so it is left as a follow-up.
  const labelTitle =
    typeof label === 'number'
      ? String(label)
      : typeof label === 'string' && label.length > 0
        ? label
        : undefined;

  return (
    <span
      ref={ref}
      {...mergeProps(
        themeProps('badge', {variant}),
        {
          className: cn(
            styles.base,
            // Themes may add variants (BadgeVariantMap augmentation, e.g.
            // neutral's `gray`); those have no built-in classes and are
            // styled by the theme through `data-variant`.
            (variants as Partial<Record<string, string>>)[variant],
            className,
          ),
          style,
        },
      )}
      title={labelTitle}
      {...props}>
      {icon}
      <span className={styles.label}>{label}</span>
    </span>
  );
}

Badge.displayName = 'Badge';
