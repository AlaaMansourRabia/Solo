'use client';

/**
 * @file Divider.tsx
 * @input Uses React, Tailwind classes, spacing and color tokens
 * @output Exports Divider component and DividerProps
 * @position Divider component; provides visual separation with optional label
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Divider/Divider.doc.mjs
 * - /packages/core/src/Divider/Divider.test.tsx
 * - /apps/storybook/stories/Divider.stories.tsx
 */

import {useId, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';
import type {DividerVariantMap} from './index';

/**
 * Divider variant type. Extensible via module augmentation of DividerVariantMap.
 */
export type DividerVariant = keyof DividerVariantMap;

export interface DividerProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Orientation of the divider.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Optional label to display centered on the divider.
   * Rendered with small, secondary text styling.
   */
  label?: ReactNode;

  /**
   * Visual weight of the divider line.
   * - 'subtle': Uses --color-border (default)
   * - 'strong': Uses --color-border-emphasized
   * @default 'subtle'
   */
  variant?: DividerVariant;

  /**
   * Makes the divider escape its parent's container padding.
   * Uses negative margins to extend to the container edges.
   * @default false
   */
  isFullBleed?: boolean;
}

const baseStyles = {
  horizontal: 'flex items-center w-full',
  vertical: 'inline-flex flex-col items-center h-full',
} as const;

const lineStyles: Record<string, string> = {
  horizontalLine: 'h-(--border-width) grow shrink',
  verticalLine: 'w-(--border-width) grow shrink',
  subtle: 'bg-(--color-border)',
  strong: 'bg-(--color-border-emphasized)',
};

const labelStyles = {
  label: cn(
    'shrink-0 px-(--spacing-3)',
    // Small secondary text styling
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading) text-(--color-text-secondary)',
  ),
  verticalLabel: 'px-0 py-(--spacing-3)',
} as const;

const fullBleedStyles = {
  horizontal: cn(
    'ms-[calc(-1*var(--container-padding-inline-start,0px))]',
    'me-[calc(-1*var(--container-padding-inline-end,0px))]',
    'w-[calc(100%+var(--container-padding-inline-start,0px)+var(--container-padding-inline-end,0px))]',
  ),
  vertical: cn(
    '[margin-block-start:calc(-1*var(--container-padding-block-start,0px))]',
    '[margin-block-end:calc(-1*var(--container-padding-block-end,0px))]',
    'h-[calc(100%+var(--container-padding-block-start,0px)+var(--container-padding-block-end,0px))]',
  ),
} as const;

/**
 * Divider component for visual separation of content.
 *
 * Provides horizontal and vertical dividers with optional labels.
 * Uses Solo design tokens for colors and spacing.
 *
 * @example
 * ```
 * <Divider label="or" />
 * ```
 */
export function Divider({
  orientation = 'horizontal',
  label,
  variant = 'subtle',
  isFullBleed = false,
  className,
  style,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';
  const labelId = useId();

  // A separator does not derive its accessible name from its content, so the
  // rendered label must be referenced explicitly via aria-labelledby to be
  // exposed as the separator's name (WCAG 1.3.1). An explicit aria-label or
  // aria-labelledby from the consumer takes precedence.
  const resolvedLabelledBy =
    ariaLabelledBy ?? (label && ariaLabel == null ? labelId : undefined);

  return (
    <div
      ref={ref}
      {...props}
      role="separator"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      aria-labelledby={resolvedLabelledBy}
      {...mergeProps(
        themeProps('divider', {variant, orientation}),
        {
          className: cn(
            isHorizontal ? baseStyles.horizontal : baseStyles.vertical,
            isFullBleed &&
              (isHorizontal
                ? fullBleedStyles.horizontal
                : fullBleedStyles.vertical),
          ),
        },
        className,
        style,
      )}>
      <div
        className={cn(
          isHorizontal ? lineStyles.horizontalLine : lineStyles.verticalLine,
          lineStyles[variant],
        )}
      />
      {label && (
        <div
          id={labelId}
          className={cn(
            labelStyles.label,
            !isHorizontal && labelStyles.verticalLabel,
          )}>
          {label}
        </div>
      )}
      {label && (
        <div
          className={cn(
            isHorizontal ? lineStyles.horizontalLine : lineStyles.verticalLine,
            lineStyles[variant],
          )}
        />
      )}
    </div>
  );
}

Divider.displayName = 'Divider';
