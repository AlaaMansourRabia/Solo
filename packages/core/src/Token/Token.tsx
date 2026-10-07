'use client';

/**
 * @file Token.tsx
 * @input Uses React, ReactNode, Tailwind classes
 * @output Exports Token component, TokenProps, TokenColor, TokenColorMap types
 * @position Core implementation; consumed by index.ts, tested by Token.test.tsx
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Token/TokenLink.tsx (interactive wrapper for href+onRemove)
 * - /packages/core/src/Token/Token.doc.mjs (props table, features, implementation notes)
 * - /packages/core/src/Token/Token.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/Token/index.ts (exports if types change)
 * - /apps/storybook/stories/Token.stories.tsx (storybook stories)
 */

import type {ReactNode} from 'react';
import {Icon} from '../Icon';
import {mergeProps} from '../utils';
import {useLinkComponent} from '../Link/useLinkComponent';
import {useInteractiveRole} from '../hooks/useInteractiveRole';
import {TokenLink} from './TokenLink';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';
import {useTranslator} from '../i18n';
import type {TokenColorMap} from './index';

// =============================================================================
// Types
// =============================================================================

/**
 * Token color type derived from TokenColorMap.
 * Extensible via module augmentation of TokenColorMap.
 */
export type TokenColor = keyof TokenColorMap;

export type TokenSize = 'sm' | 'md' | 'lg';

export interface TokenProps extends BaseProps<HTMLElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLElement>;
  /**
   * The text label displayed in the token.
   */
  label: string;
  /**
   * The size of the token.
   * @default 'md'
   */
  size?: TokenSize;
  /**
   * The color variant of the token.
   * @default 'default'
   */
  color?: TokenColor;
  /**
   * Optional icon to display before the label.
   */
  icon?: ReactNode;
  /**
   * Whether the token is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Callback when the remove (X) button is clicked.
   * When provided, a remove button is rendered.
   */
  onRemove?: (e: React.MouseEvent) => void;
  /**
   * Click handler. When provided, the token renders as a `<span>` container
   * with an invisible `<button>` inside for accessibility.
   */
  onClick?: (e: React.MouseEvent) => void;
  /**
   * Link URL. When provided, the token renders as an `<a>`.
   */
  href?: string;
  /**
   * Accessible description for the token.
   */
  description?: string;
  /**
   * Content rendered after the label (before the remove button, if present).
   */
  endContent?: ReactNode;
  /**
   * Whether to visually hide the label (still accessible to screen readers).
   * @default false
   */
  isLabelHidden?: boolean;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  base: cn(
    'inline-flex items-center gap-(--spacing-1) py-0',
    '[border-width:0] [border-style:none] rounded-(--radius-inner)',
    '[font-family:inherit] text-(length:--text-supporting-size) leading-(--text-supporting-leading) font-(number:--font-weight-medium)',
    'whitespace-nowrap [text-decoration:none] max-w-full overflow-hidden',
  ),
  label: 'overflow-hidden text-ellipsis whitespace-nowrap min-w-0',
  interactive: cn(
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition-property:background-image] [transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  disabled: 'cursor-default opacity-50 pointer-events-none',
  labelHidden: cn(
    'absolute w-[1px] h-[1px] p-0 m-[-1px] overflow-hidden',
    '[clip-path:inset(50%)] whitespace-nowrap [border-width:0]',
  ),
  invisibleButton: cn(
    'cursor-[inherit] [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[color:inherit] [outline:none] overflow-hidden min-w-0',
  ),
  removeButton: cn(
    'inline-flex items-center justify-center relative p-0',
    'me-[calc(-1*var(--spacing-1))]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'rounded-(--radius-full) w-[16px] h-[16px] [color:inherit]',
    "after:content-[''] after:absolute after:inset-[-14px]",
  ),
} as const;

// `sm` shares the base font size; it is left to the base rather than restated, as a
// later font-size class would make `cn()` drop the base line-height.
const sizeStyles = {
  sm: 'h-[calc(var(--size-element-sm)_-_8px)] px-(--spacing-2)',
  md: 'h-[calc(var(--size-element-md)_-_8px)] px-(--spacing-2)',
  lg: 'h-[calc(var(--size-element-lg)_-_8px)] px-(--spacing-2)',
} as const;

const colorStyles = {
  default: 'bg-(--color-neutral) text-(--color-text-primary)',
  red: 'bg-(--color-background-red) text-(--color-text-red)',
  orange: 'bg-(--color-background-orange) text-(--color-text-orange)',
  yellow: 'bg-(--color-background-yellow) text-(--color-text-yellow)',
  green: 'bg-(--color-background-green) text-(--color-text-green)',
  teal: 'bg-(--color-background-teal) text-(--color-text-teal)',
  cyan: 'bg-(--color-background-cyan) text-(--color-text-cyan)',
  blue: 'bg-(--color-background-blue) text-(--color-text-blue)',
  purple: 'bg-(--color-background-purple) text-(--color-text-purple)',
  pink: 'bg-(--color-background-pink) text-(--color-text-pink)',
  gray: 'bg-(--color-background-gray) text-(--color-text-gray)',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * A chip/tag component for displaying entities inline.
 *
 * Renders as a `<span>` by default, `<a>` when `href` is provided, or a
 * `<span>` container with an invisible `<button>` when `onClick` is provided.
 * The invisible button pattern provides real button semantics for accessibility
 * while the container uses `:focus-within` to show focus outlines around the
 * entire token. When both `href` and `onRemove` are provided, the same
 * container pattern is used with an invisible `<a>` so the remove `<button>`
 * renders as a sibling of the link rather than nested inside it.
 *
 * @example
 * ```
 * <Token label="Tag" />
 * <Token label="Status" color="green" />
 * <Token label="Removable" onRemove={() => {}} />
 * <Token label="Clickable" onClick={() => {}} />
 * <Token label="Link" href="/path" />
 * ```
 */
export function Token({
  label,
  size = 'md',
  color = 'default',
  icon,
  isDisabled = false,
  onRemove,
  onClick,
  href,
  description,
  endContent,
  isLabelHidden = false,
  className,
  style,
  'data-testid': testId,
  ref,
  ...rest
}: TokenProps) {
  const t = useTranslator();
  const LinkComponent = useLinkComponent();
  const role = useInteractiveRole({href, onClick, isDisabled});

  // When role is 'button' via context (no explicit onClick), treat as
  // if onClick was provided — the popover attaches its own handler.
  const effectiveOnClick = onClick ?? (role === 'button' ? () => {} : null);

  const removeButton = onRemove != null && (
    <button
      type="button"
      aria-label={t('@solo.token.remove', {label})}
      onClick={e => {
        e.stopPropagation();
        onRemove(e);
      }}
      disabled={isDisabled}
      className={cn(focusOutlineStyles.focusVisible, styles.removeButton)}>
      <Icon icon="close" size="xsm" color="inherit" />
    </button>
  );

  const content = (
    <>
      {icon}
      <span
        className={cn(styles.label, isLabelHidden && styles.labelHidden)}>
        {label}
      </span>
      {endContent}
      {removeButton}
    </>
  );

  const sharedProps = {
    'data-testid': testId,
    ...(isLabelHidden ? {'aria-label': label} : {}),
    ...(description != null ? {'aria-description': description} : {}),
  };

  if (role === 'link') {
    if (onRemove == null) {
      return (
        <LinkComponent
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href as string}
          {...mergeProps(
            themeProps('token', {color, size}),
            {
              className: cn(
                focusOutlineStyles.focusVisible,
                styles.base,
                sizeStyles[size],
                colorStyles[color],
                styles.interactive,
                interactionOverlayStyles.backgroundImage,
                isDisabled && styles.disabled,
              ),
            },
            className,
            style,
          )}
          {...rest}
          {...(isDisabled ? {'aria-disabled': true} : {})}
          {...sharedProps}>
          {content}
        </LinkComponent>
      );
    }

    // With a remove button, the link cannot be the root — nesting a <button>
    // inside an <a> is invalid HTML (WCAG 4.1.2). Delegate to TokenLink, a
    // non-presentational wrapper that renders a <span> container with the link
    // and the remove button as siblings and wires up useClickableContainer so
    // the whole token surface activates the link (including middle-click and
    // cmd/ctrl-click to open in a new tab). Token itself stays presentational
    // (no refs/effects) per the @solo/presentational-component rule.
    return (
      <TokenLink
        ref={ref}
        href={href as string}
        isDisabled={isDisabled}
        LinkComponent={LinkComponent}
        icon={icon}
        endContent={endContent}
        removeButton={removeButton}
        linkStyleProps={{className: styles.invisibleButton}}
        labelContent={
          <span
            className={cn(styles.label, isLabelHidden && styles.labelHidden)}>
            {label}
          </span>
        }
        {...mergeProps(
          themeProps('token', {color, size}),
          {
            className: cn(
              focusOutlineStyles.focusWithin,
              styles.base,
              sizeStyles[size],
              colorStyles[color],
              styles.interactive,
              interactionOverlayStyles.backgroundImage,
              isDisabled && styles.disabled,
            ),
          },
          className,
          style,
        )}
        {...rest}
        {...sharedProps}
      />
    );
  }

  if (effectiveOnClick != null) {
    const handleContainerClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a')) {
        return;
      }
      effectiveOnClick(e);
    };

    return (
      <span
        ref={ref}
        onClick={isDisabled ? undefined : handleContainerClick}
        {...mergeProps(
          themeProps('token', {color, size}),
          {
            className: cn(
              focusOutlineStyles.focusWithin,
              styles.base,
              sizeStyles[size],
              colorStyles[color],
              styles.interactive,
              interactionOverlayStyles.backgroundImage,
              isDisabled && styles.disabled,
            ),
          },
          className,
          style,
        )}
        {...rest}
        {...sharedProps}>
        {icon}
        <button
          type="button"
          onClick={effectiveOnClick}
          disabled={isDisabled}
          className={styles.invisibleButton}>
          <span
            className={cn(styles.label, isLabelHidden && styles.labelHidden)}>
            {label}
          </span>
        </button>
        {endContent}
        {removeButton}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      {...mergeProps(
        themeProps('token', {color, size}),
        {
          className: cn(
            styles.base,
            sizeStyles[size],
            colorStyles[color],
            isDisabled && styles.disabled,
          ),
        },
        className,
        style,
      )}
      {...rest}
      {...sharedProps}>
      {content}
    </span>
  );
}

Token.displayName = 'Token';
