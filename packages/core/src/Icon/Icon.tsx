'use client';

/**
 * @file Icon.tsx
 * @input Uses ReactSVGProps, icon components or semantic icon names
 * @output Exports Icon component, IconProps, IconColor, IconSize, IconType types
 * @position Core implementation; consumed by index.ts, tested by Icon.test.tsx
 *
 * Supports two modes:
 * - Component mode: Pass an SVG icon component (e.g. from @heroicons/react) — rendered
 *   directly with and spread SVG props.
 * - String mode: Pass a semantic name (e.g. 'close', 'chevronDown') — resolved from the
 *   theme's icon registry (or built-in fallback SVGs) and wrapped in a styled span.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Icon/Icon.doc.mjs (props table, features, implementation notes)
 * - /packages/core/src/Icon/Icon.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/Icon/index.ts (exports if types change)
 * - /apps/storybook/stories/Icon.stories.tsx (storybook stories)
 */

import React, {type ComponentType, type SVGProps} from 'react';
import {useThemeName} from '../theme/useTheme';
import {getIcon} from './globalIconRegistry';
import type {IconName, NamespacedIconName} from './globalIconRegistry';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';
import {useIconSize} from './IconDefaultSizeContext';
import {
  iconBoxSizeStyles,
  iconSizeStyles,
  type IconSize,
} from './IconSize.styles';

export type {IconSize} from './IconSize.styles';

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: 'shrink-0',
  /** Wrapper for string-based (registry) icons */
  span: 'inline-flex items-center justify-center shrink-0',
} as const;

const colorStyles = {
  primary: 'text-(--color-icon-primary)',
  secondary: 'text-(--color-icon-secondary)',
  tertiary: 'text-(--color-icon-secondary)',
  disabled: 'text-(--color-icon-disabled)',
  accent: 'text-(--color-accent)',
  success: 'text-(--color-success)',
  error: 'text-(--color-error)',
  warning: 'text-(--color-warning)',
  inherit: 'text-inherit',
  // Non-semantic colors
  blue: 'text-(--color-icon-blue)',
  red: 'text-(--color-icon-red)',
  green: 'text-(--color-icon-green)',
  gray: 'text-(--color-icon-gray)',
  cyan: 'text-(--color-icon-cyan)',
  teal: 'text-(--color-icon-teal)',
  yellow: 'text-(--color-icon-yellow)',
  orange: 'text-(--color-icon-orange)',
  pink: 'text-(--color-icon-pink)',
  purple: 'text-(--color-icon-purple)',
} as const;

// =============================================================================
// Types
// =============================================================================

export type IconColor = keyof typeof colorStyles;

/**
 * Type for icon components that can be passed to Icon.
 * Use this type when accepting an icon prop in other components.
 */
export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Props for Icon component.
 * Extends SVGProps to allow passing additional SVG attributes (used when icon is a component).
 */
export interface IconProps extends Omit<
  SVGProps<SVGSVGElement>,
  'ref' | 'color'
> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<SVGSVGElement>;
  /**
   * Icon to render. Can be:
   * - A semantic name string (e.g. 'close', 'chevronDown') — resolved from theme or built-in fallback
   * - A namespaced extension key (e.g. 'richtext:bold') for a glyph owned by
   *   one component or library — resolved the same way, themeable by key
   * - An SVG icon component (e.g. from @heroicons/react) — rendered directly
   */
  icon: IconType | IconName | NamespacedIconName;
  /**
   * The color variant of the icon.
   * @default 'inherit'
   */
  color?: IconColor;
  /**
   * The size of the icon.
   * - 'xsm': 0.75rem (12px at a 16px root)
   * - 'sm': 1rem (16px at a 16px root)
   * - 'md': 1.25rem (20px at a 16px root)
   * - 'lg': 1.5rem (24px at a 16px root)
   *
   * An explicit value wins. When omitted, Icon uses the nearest default supplied
   * by an owning Solo component for its icon slot, then falls back to 'md'.
   */
  size?: IconSize;
  /**
   * Accessible name for the icon. Set this only when the icon is MEANINGFUL on
   * its own — a standalone status glyph or an icon-only indicator with no
   * adjacent text conveying the same information. Providing it exposes the icon
   * to assistive tech as `role="img"` with this string as the accessible name
   * (via `aria-label`) and drops the default `aria-hidden="true"`.
   *
   * Omit it (the default) for decorative icons — the common case, e.g. an icon
   * beside a text label — and the icon stays hidden from assistive tech
   * (`aria-hidden="true"`). An empty string (`''`) is treated the same as
   * omitting it (decorative), since an empty accessible name is meaningless.
   *
   * Don't set `label` when an interactive parent (Button, IconButton, link)
   * already names the control — that produces a duplicate announcement.
   *
   * Meaningful, standalone icon: give it a label.
   *
   * @example
   * ```
   * <Icon icon="success" label="Completed" />
   * ```
   *
   * Decorative icon (the default): omit label.
   *
   * @example
   * ```
   * <Icon icon="search" />
   * ```
   */
  label?: string;
}

/**
 * Derives the ARIA attributes for an icon from its `label` prop.
 *
 * - Non-empty `label` → meaningful image: `role="img"` + `aria-label`, and no
 *   `aria-hidden` (an `aria-hidden` element is removed from the accessibility
 *   tree, so its accessible name would be ignored).
 * - Omitted or empty `label` → decorative default: `aria-hidden="true"`.
 *
 * The result is spread BEFORE `{...props}` in both render modes so an explicit
 * `aria-hidden` / `role` / `aria-label` from the consumer always wins.
 */
function getIconA11yProps(
  label: string | undefined,
): {role: 'img'; 'aria-label': string} | {'aria-hidden': 'true'} {
  return label != null && label !== ''
    ? {role: 'img', 'aria-label': label}
    : {'aria-hidden': 'true'};
}

// =============================================================================
// Component
// =============================================================================

/**
 * Renders an icon from the icon registry or a custom SVG component.
 *
 * @example
 * ```
 * <Icon icon="close" size="md" color="primary" />
 * ```
 */
export function Icon({
  icon,
  color = 'inherit',
  size: sizeProp,
  label,
  ref,
  className,
  style,
  ...props
}: IconProps) {
  const size = useIconSize(sizeProp);
  // Derive ARIA from `label`: decorative (aria-hidden) by default, or a
  // meaningful image (role="img" + aria-label) when `label` is non-empty.
  const a11yProps = getIconA11yProps(label);

  // String mode: resolve from icon registry, wrap in styled span
  if (typeof icon === 'string') {
    return (
      <IconFromRegistry
        name={icon}
        color={color}
        size={size}
        a11yProps={a11yProps}
        className={className}
        style={style}
        spanProps={props}
      />
    );
  }

  // Component mode: render SVG component directly with ref forwarding
  const IconComponent = icon;
  return (
    <IconComponent
      ref={ref}
      // Derived a11y (decorative default or meaningful `label`) is spread
      // BEFORE {...props} so an explicit aria-hidden/role/aria-label from the
      // consumer still wins as an escape hatch.
      {...a11yProps}
      // The styling props (className, style) are handled here so they
      // COMPOSE with the internal classes/styles instead of clobbering them:
      // className folds into cn() last, and style merges via mergeProps. The remaining rest props keep their prior last-spread
      // precedence as escape hatches.
      {...mergeProps(
        themeProps('icon', {size, color}),
        {
          className: cn(
            styles.root,
            colorStyles[color],
            iconSizeStyles[size],
            className,
          ),
          style,
        },
      )}
      {...props}
    />
  );
}

Icon.displayName = 'Icon';

// =============================================================================
// Internal: Registry Icon Renderer
// =============================================================================

/**
 * Internal component that resolves a semantic icon name from the registry
 * and renders it in a styled span with proper sizing.
 *
 * Extracted as a separate component so getIcon is only called
 * when the icon prop is a string.
 */
function IconFromRegistry({
  name,
  color,
  size,
  a11yProps,
  className,
  style,
  spanProps,
}: {
  name: IconName | NamespacedIconName;
  color: IconColor;
  size: IconSize;
  a11yProps: {role: 'img'; 'aria-label': string} | {'aria-hidden': 'true'};
  className?: string;
  style?: React.CSSProperties;
  spanProps?: Omit<SVGProps<SVGSVGElement>, 'ref' | 'color'>;
}) {
  const themeName = useThemeName();
  const resolvedIcon = getIcon(name, themeName);

  if (resolvedIcon == null) {
    return null;
  }

  // The styling props (className, style) are handled here so they
  // COMPOSE with the internal solo-icon classes/styles instead of being
  // shadowed by the later spread: className folds into cn() last, and style
  // merges via mergeProps. Other span props keep their prior
  // precedence (spread before the internal merge).
  const restSpanProps =
    (spanProps as React.HTMLAttributes<HTMLSpanElement>) ?? {};

  return (
    <span
      // Derived a11y — decorative (aria-hidden) by default, or a meaningful
      // image (role="img" + aria-label) when `label` is set. Placed BEFORE the
      // prop spread so consumers can still override it with explicit
      // aria-hidden/role/aria-label. This mirrors component-mode Icon.
      {...a11yProps}
      {...restSpanProps}
      {...mergeProps(
        themeProps('icon', {size, color}),
        {
          className: cn(
            styles.span,
            colorStyles[color],
            iconBoxSizeStyles[size],
            className,
          ),
          style,
        },
      )}>
      {resolvedIcon}
    </span>
  );
}

/**
 * Renders an icon slot value. Handles semantic names, ReactNode values, and
 * component types:
 * - If the value is a semantic icon name string, wraps it in Icon.
 * - If the value is a component (function or forwardRef object), wraps it in Icon.
 * - Otherwise, renders the ReactNode directly.
 */
export function renderIconSlot(
  icon: React.ReactNode | IconType,
  props?: {size?: IconSize; color?: IconColor},
): React.ReactNode {
  if (typeof icon === 'string') {
    return <Icon icon={icon as IconName} {...props} />;
  }

  if (
    typeof icon === 'function' ||
    (typeof icon === 'object' && icon !== null && 'render' in icon)
  ) {
    return <Icon icon={icon as unknown as IconType} {...props} />;
  }
  return icon;
}
