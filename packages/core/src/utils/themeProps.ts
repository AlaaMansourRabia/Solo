import {stableClassName} from '../naming';

export type ClassValue = string | number | undefined | null;
export type ClassProps = Record<string, ClassValue>;
export type ThemeDataAttributes = Record<`data-${string}`, string | undefined>;
export type ThemeProps = {className: string} & ThemeDataAttributes;

export function themeDataAttributeName(prop: string): `data-${string}` {
  return `data-${prop.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
}


/**
 * Build the stable solo-* class name string for a component.
 *
 * Every component renders one stable target class (`solo-button`,
 * `solo-card`, etc.). Visual props and runtime states use explicit data
 * attributes (`data-variant`, `data-size`, `data-selected`, etc.) as their
 * canonical selector surface.
 *
 * Prop values are never emitted as bare classes (`solo-button primary md`):
 * with Tailwind, a bare value such as `ring`, `block`, `inline`, `static`,
 * `relative` or `select-all` IS a utility class, and would silently restyle
 * the element. Target `[data-variant="primary"]` etc. instead (what Solo
 * themes use).
 *
 * The `solo-` prefix comes from the centralized naming module
 * (`packages/core/src/naming.ts`) so the namespace lives in one place.
 *
 * <!-- SYNC: packages/core/src/naming.ts (namespace prefix source of truth) -->
 * <!-- SYNC: packages/core/src/utils/parseStyleKey.ts -->
 *
 * @param component - Component name in lowercase (e.g. 'button', 'card')
 * @returns The stable target class
 */
function buildClassName(component: string): string {
  return stableClassName(component);
}

/**
 * Reflect Solo visual props as `data-*` attributes.
 *
 * Keys are kebab-cased (`listStyle` → `data-list-style`) and values are the
 * literal prop values, including numeric values (`level: 1` → `data-level="1"`).
 * Nullish values are omitted.
 */
export function themeDataAttributes(props?: ClassProps): ThemeDataAttributes {
  const attrs: ThemeDataAttributes = {};

  if (props) {
    for (const [prop, value] of Object.entries(props)) {
      if (value == null) {
        continue;
      }
      attrs[themeDataAttributeName(prop)] = String(value);
    }
  }

  return attrs;
}

/**
 * Build the props object components should spread onto the same element that
 * receives the stable Solo class name.
 *
 * This emits one stable Solo target, deprecated bare compatibility classes,
 * and canonical data-attribute reflection for visual props and runtime states.
 * For example:
 *
 * ```ts
 * themeProps('button', { variant: 'primary', size: 'sm' })
 * // → { className: 'solo-button primary sm', data-variant: 'primary', data-size: 'sm' }
 * ```
 */
/**
 * Options for {@link themeProps}.
 */
export type ThemePropsOptions = {
  /**
   * Stable target names to emit alongside the canonical target for backwards
   * compatibility.
   *
   * A theme target is public API: renaming one silently breaks every theme
   * that styles it. Keep aliases emitted unless a separate compatibility
   * decision explicitly retires them.
   *
   * Pass plain string literals — the theming guards scan for them statically.
   * Document each old name with `deprecatedFor` in the component's
   * `theming.targets` so discovery and diagnostics name the replacement.
   */
  legacyNames?: ReadonlyArray<string>;
};

export function themeProps(
  component: string,
  props?: ClassProps,
  options?: ThemePropsOptions,
): ThemeProps {
  const className = buildClassName(component);
  const legacy = options?.legacyNames?.map(name => stableClassName(name)) ?? [];

  return {
    className: legacy.length > 0 ? [className, ...legacy].join(' ') : className,
    ...themeDataAttributes(props),
  };
}
