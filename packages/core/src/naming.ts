/**
 * @file naming.ts
 * @input None (pure constants/helpers)
 * @output Centralized namespace-prefix constants and helpers for all
 *   externally-observable name surfaces: CSS classes, data attributes,
 *   CSS custom properties, and CSS layer names.
 * @position Single source of truth consumed by the runtime (components,
 *   theme generation) AND by build/CLI tooling (build-theme.mjs, discovery)
 *   via the `@solo/core/naming` subpath export.
 *
 * ## Why this module exists
 *
 * The namespace prefix `solo` is part of several externally-observable
 * contracts (`.solo-button` classes, `data-solo-theme` attributes,
 * `--solo-card-padding` custom properties). Historically each of these was
 * hardcoded independently across the runtime, the theme build pipeline, and
 * discovery tooling, kept in sync only by `<!-- SYNC: ... -->` comments.
 * Centralizing the prefix here means it lives in ONE place instead of
 * hundreds of literals.
 *
 * ## Surfaces
 *
 * - CSS classes: `.solo-button` via {@link classPrefix} / {@link stableClassName}.
 * - data attributes: `data-solo-*` via {@link dataAttrNamespace} / {@link dataAttr}.
 * - CSS custom properties: `--solo-*` via {@link cssVarNamespace} / {@link cssVar}.
 * - CSS layers: `solo-base` / `solo-theme`.
 *
 * SYNC: packages/core/src/utils/themeProps.ts (consumes classPrefix)
 * SYNC: packages/core/src/utils/parseStyleKey.ts
 */

/**
 * The DOM/CSS namespace prefix for all externally-observable surfaces
 * (classes, theme/media data attributes, CSS custom properties).
 */
export const NAMESPACE = 'solo';

/**
 * Class-name prefix for stable component classes, WITHOUT the trailing dash.
 *
 * Use {@link stableClassName} to build a full class token rather than
 * concatenating this directly.
 */
export const classPrefix = NAMESPACE;

/**
 * data-attribute namespace segment (the part between `data-` and the rest).
 * e.g. `dataAttrNamespace` = 'solo' -> `data-solo-theme`.
 */
export const dataAttrNamespace = NAMESPACE;

/**
 * CSS custom-property namespace segment.
 * e.g. `--solo-card-padding`.
 */
export const cssVarNamespace = NAMESPACE;

/**
 * Build a stable component class token, e.g. `stableClassName('button')`
 * -> `'solo-button'`.
 */
export function stableClassName(component: string): string {
  return `${classPrefix}-${component}`;
}

/**
 * Build a `data-*` attribute name in the current namespace, e.g.
 * `dataAttr('theme')` -> `'data-solo-theme'`.
 */
export function dataAttr(name: string): `data-${string}` {
  return `data-${dataAttrNamespace}-${name}`;
}

/**
 * Build a CSS custom-property name in the current namespace, e.g.
 * `cssVar('card-padding')` -> `'--solo-card-padding'`.
 */
export function cssVar(name: string): string {
  return `--${cssVarNamespace}-${name}`;
}

