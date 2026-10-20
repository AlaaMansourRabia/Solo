'use client';

/**
 * @file Breadcrumbs.tsx
 * @input Uses React, layer-scoped context, Tailwind classes, theme tokens
 * @output Exports Breadcrumbs component, BreadcrumbsProps, BreadcrumbContext
 * @position Core container component; consumed by index.ts
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Breadcrumbs/Breadcrumbs.doc.mjs
 * - /packages/core/src/Breadcrumbs/Breadcrumbs.test.tsx
 * - /packages/core/src/Breadcrumbs/index.ts
 * - /apps/storybook/stories/Breadcrumbs.stories.tsx
 */

import {useMemo, type ReactNode} from 'react';
import {createLayerScopedContext as createContext} from '../Layer/layerScopedContext';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';
import type {BreadcrumbsVariantMap} from './index';

// =============================================================================
// Variant type
// =============================================================================

/**
 * Visual variant for the breadcrumb trail.
 * - `'default'`: Standard text styling
 * - `'supporting'`: Smaller, secondary text for supporting context
 *
 * Extensible via module augmentation of BreadcrumbsVariantMap.
 */
export type BreadcrumbsVariant = keyof BreadcrumbsVariantMap;

// =============================================================================
// Context shared with BreadcrumbItem
// =============================================================================

/** @internal Context for passing variant and separator from Breadcrumbs to BreadcrumbItem. */
export interface BreadcrumbContextValue {
  variant: BreadcrumbsVariant;
  separator: ReactNode;
}

export const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  variant: 'default',
  separator: '/',
});
BreadcrumbContext.displayName = 'BreadcrumbContext';

// =============================================================================
// Props
// =============================================================================

export interface BreadcrumbsProps extends BaseProps<HTMLElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLElement>;
  /**
   * BreadcrumbItem elements to render as breadcrumb trail.
   */
  children: ReactNode;
  /**
   * Separator rendered between items. Decorative only (aria-hidden).
   * @default '/'
   */
  separator?: ReactNode;
  /**
   * Visual variant for the breadcrumb trail.
   * - `'default'`: Standard text styling
   * - `'supporting'`: Smaller, secondary text for supporting context
   * @default 'default'
   */
  variant?: BreadcrumbsVariant;
  /**
   * Accessible label for the nav landmark.
   * @default 'Breadcrumb'
   */
  label?: string;
}

// =============================================================================
// Styles
// =============================================================================

const navStyles = {
  root: 'block',
} as const;

const listStyles = {
  root: 'flex items-center flex-wrap [list-style:none] m-0 p-0 gap-(--spacing-1)',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * A navigation breadcrumb trail. Wraps BreadcrumbItem children in
 * semantic `<nav>` + `<ol>` markup with separators between items.
 *
 * Auto-detects the last child as the current page if no item has
 * `isCurrent` explicitly set — handled by each item via DOM inspection,
 * no React child introspection needed.
 *
 * @agentGuidance
 * Breadcrumbs show a trail of links from the root to the current page. Use them
 * at the top of detail pages, settings panels, or anywhere the user needs to
 * see where they are and navigate back up.
 *
 * Don't:
 * - Use breadcrumbs as the primary navigation. They supplement a sidebar or top
 *   nav, not replace it.
 * - Show breadcrumbs on top-level pages that have no parent; they add clutter
 *   without helping the user.
 * - Let the trail grow beyond 5 levels. If you need more, consider simplifying
 *   the page hierarchy instead.
 * - Mirror a separator the bidi algorithm already mirrors. An angle-quote glyph
 *   such as › is Bidi_Mirrored, so it flips under RTL on its own and
 *   rtlStyles.mirror would flip it back. An arrow glyph such as → and any Icon
 *   separator are not, so those do need rtlStyles.mirror through className.
 *
 * @example
 * ```
 * <Breadcrumbs>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
 *   <BreadcrumbItem isCurrent>My Project</BreadcrumbItem>
 * </Breadcrumbs>
 * ```
 */
export function Breadcrumbs({
  children,
  separator = '/',
  variant = 'default',
  className,
  style,
  label: labelFromProps,
  ref,
  ...rest
}: BreadcrumbsProps) {
  const t = useTranslator();
  const label = labelFromProps ?? t('@solo.breadcrumbs.label');
  const ctxValue = useMemo<BreadcrumbContextValue>(
    () => ({variant, separator}),
    [variant, separator],
  );

  return (
    <BreadcrumbContext value={ctxValue}>
      <nav
        ref={ref}
        aria-label={label}
        {...mergeProps(
          themeProps('breadcrumbs', {variant}),
          {className: navStyles.root},
          className,
          style,
        )}
        {...rest}>
        <ol className={listStyles.root}>{children}</ol>
      </nav>
    </BreadcrumbContext>
  );
}

Breadcrumbs.displayName = 'Breadcrumbs';
