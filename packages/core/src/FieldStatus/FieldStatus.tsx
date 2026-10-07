/**
 * @file FieldStatus.tsx
 * @input Uses React, Tailwind classes, theme tokens, useAnnounce, Icon
 * @output Exports FieldStatus component, FieldStatusProps
 * @position Core implementation; consumed by Field, Switch, CheckboxInput, and the FieldStatus entrypoint
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/FieldStatus/FieldStatus.doc.mjs (props table, features, implementation notes)
 * - /packages/core/src/Field/Field.doc.mjs (compat docs when public API changes)
 * - /packages/core/src/FieldStatus/index.ts (exports if types change)
 * - /packages/core/src/Field/index.ts (compat re-export if public API changes)
 */

'use client';

import React, {useEffect} from 'react';
import type {BaseProps} from '../BaseProps';
import {useAnnounce} from '../hooks/useAnnounce';
import {cn, mergeProps} from '../utils';
import type {InputStatusType} from '../Field/types';
import {useEntryAnimation} from '../hooks/useEntryAnimation';
import {themeProps} from '../utils/themeProps';
import {Icon} from '../Icon';
import type {IconName} from '../Icon';
import type {FieldStatusVariantMap} from './index';

/**
 * Maps each status type to its status glyph. Mirrors the mapping the input
 * controls already use for the on-field status affordance, so the detached
 * message shows the same icon a consumer sees elsewhere for that status.
 */
const statusIconMap: Record<InputStatusType, IconName> = {
  warning: 'warning',
  error: 'error',
  success: 'success',
};

// The attached overlap: `var(--_field-status-overlap, var(--spacing-1-5))`,
// spelled out in each class below (Tailwind needs literal class strings).
const styles = {
  base: 'font-(family-name:--font-family-body) text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
  attached: cn(
    'mt-[calc(-1_*_var(--_field-status-overlap,var(--spacing-1-5)))]',
    '[padding-block-start:calc(var(--_field-status-overlap,var(--spacing-1-5))_+_var(--spacing-2))]',
    '[padding-block-end:var(--spacing-2)] px-(--spacing-2)',
    'rounded-es-(--radius-element) rounded-ee-(--radius-element)',
    // The overlap is visual only. Let pointer input reach the control beneath
    // it instead of allowing the later-painted status box to steal the click.
    'pointer-events-none',
  ),
  detached:
    'mt-(--spacing-1) py-(--spacing-2) px-(--spacing-2) rounded-(--radius-element)',
  detachedContent: 'flex items-start gap-(--spacing-1)',
  // Center the glyph within the first text-line box so it aligns to the
  // first line of the message (rather than the top of the flex row) when the
  // message wraps to multiple lines.
  detachedIcon:
    'inline-flex items-center h-[calc(var(--text-supporting-size)_*_var(--text-supporting-leading))] shrink-0',
} as const;

const colorStyles = {
  warning: 'bg-(--color-warning-muted) text-(--color-text-yellow)',
  error: 'bg-(--color-error-muted) text-(--color-text-red)',
  success: 'bg-(--color-success-muted) text-(--color-text-green)',
} as const;

/**
 * FieldStatus variant type. Extensible via module augmentation of FieldStatusVariantMap.
 */
export type FieldStatusVariant = keyof FieldStatusVariantMap;

export interface FieldStatusProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /**
   * The type of status to display.
   */
  type: InputStatusType;
  /**
   * The status message to display.
   */
  message: string;
  /**
   * Visual variant of the status message.
   * - 'attached': Overlaps with input above (used in Field)
   * - 'detached': Floats below with spacing (used in Switch, CheckboxInput)
   * @default 'attached'
   */
  variant?: FieldStatusVariant;
}

/**
 * A status message component for form fields.
 *
 * The `detached` variant renders a leading status icon before the message so
 * status is not conveyed by color or position alone (WCAG 1.4.1). The icon is
 * decorative for assistive tech (`aria-hidden`): the message text already names
 * the status in words and is announced through the live region. The `attached`
 * variant keeps its status affordance on the bordered input, so it renders no
 * icon here to avoid a duplicate. The `tooltip` variant renders no message box
 * at all — the input surfaces the status through a tooltip on its on-field
 * icon — so callers skip rendering FieldStatus for it.
 *
 * Screen-reader announcements go through the persistent `useAnnounce` live
 * regions (assertive for errors, polite otherwise) rather than `role`/
 * `aria-live` on the rendered element. Live regions that mount together with
 * their content are not reliably announced by assistive technology, and
 * FieldStatus is almost always conditionally rendered by its callers. The
 * message is announced whenever it appears — including on first mount — and
 * whenever it changes.
 *
 * @example
 * ```
 * <FieldStatus
 *   type="error"
 *   message="This field is required"
 * />
 * <FieldStatus
 *   type="warning"
 *   message="This will be visible to others"
 *   variant="detached"
 * />
 * ```
 */
export function FieldStatus({
  ref,
  type,
  message,
  id,
  variant = 'attached',
  className,
  style,
  ...rest
}: FieldStatusProps) {
  const entryClassName = useEntryAnimation('slideDown');
  const announce = useAnnounce();

  // Announce the message through the persistently-mounted live regions.
  // Announce-on-mount is intentional: callers conditionally mount FieldStatus
  // when a status appears (and whole forms can mount with a server-side
  // validation error already present), and both cases must be heard.
  useEffect(() => {
    if (message) {
      announce(message, type === 'error' ? 'assertive' : 'polite');
    }
  }, [announce, message, type]);

  return (
    <div
      ref={ref}
      id={id}
      {...rest}
      {...mergeProps(
        themeProps('field-status', {type, variant}),
        {
          className: cn(
            styles.base,
            entryClassName,
            variant === 'attached' ? styles.attached : styles.detached,
            colorStyles[type],
          ),
        },
        className,
        style,
      )}>
      {variant === 'detached' ? (
        <span className={styles.detachedContent}>
          <span className={styles.detachedIcon}>
            <Icon
              icon={statusIconMap[type]}
              size="sm"
              color="inherit"
              // Stable theme target on the detached message box's leading glyph
              // itself, so a theme can restyle just this icon (color, size) —
              // and each status — via `defineTheme`. Same-element rules in
              // @layer solo-theme win over the icon's own base
              // width/height/fontSize, which a field-level target could not
              // reach.
              {...themeProps('field-status-icon', {type})}
            />
          </span>
          <span>{message}</span>
        </span>
      ) : (
        message
      )}
    </div>
  );
}

FieldStatus.displayName = 'FieldStatus';
