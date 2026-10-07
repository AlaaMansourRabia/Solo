'use client';

/**
 * Theme Provider Component
 *
 * Applies theme tokens and sets color-scheme for light-dark() to work.
 * Themes are created with `defineTheme()` and applied via CSS:
 * - Token overrides set as CSS custom properties on [data-solo-theme]
 * - Component overrides scoped via @scope'd CSS selectors on stable Solo
 *   target classes combined with reflected `data-*` prop/state attributes
 *
 * Root detection: The first Theme in the tree (no parent Theme)
 * automatically syncs attributes to `document.documentElement`:
 * - `data-theme` — drives `color-scheme` via reset.css rules, ensuring browser
 *   chrome (scrollbars, native form controls, date pickers) reflects the mode.
 * - `data-solo-theme` — enables @scope'd theme CSS to reach elements rendered
 *   outside the Theme wrapper (portals, toast fallback viewports).
 *
 * For RSC / SSR, set `data-theme` on `<html>` in your root server layout
 * to avoid a flash of wrong theme before hydration:
 *
 *   <html lang="en" data-theme="dark">
 *
 * @example
 * ```
 * const ocean = defineTheme({
 *   name: 'ocean',
 *   tokens: { '--color-accent': ['#0077B6', '#48CAE4'] },
 *   components: { card: { base: { borderWidth: '2px' } } },
 *   icons: oceanIcons,
 * });
 * <Theme theme={ocean}><App /></Theme>
 * ```
 */

import React, {use, useId, useInsertionEffect, useMemo} from 'react';
import {useIsomorphicLayoutEffect} from '../hooks/useIsomorphicLayoutEffect';
import {cn} from '../utils/cn';
import type {ThemeMode} from './types';
import {colorVars, typographyVars} from './tokenVars';
import {generateThemeCSS, type DefinedTheme} from './defineTheme';
import {generateDataTokenDefaultsCSS} from './generateThemeRules';
import {registerTheme} from './themeRegistry';
import {dataAttr} from '../naming';
import {ThemeContext} from './useTheme';
import {warnOnce} from '../utils/devWarning';
import {setThemeAttributeSource} from './themeAttributeSource';

/**
 * Theme provider props
 */
export interface ThemeProps {
  /** Theme from defineTheme() */
  theme: DefinedTheme;
  /** Color mode - 'system' follows OS preference */
  mode?: ThemeMode;
  /** Children to render */
  children: React.ReactNode;
  /**
   * Root Theme only: sync `data-theme` / `data-solo-theme` onto `<html>`.
   *
   * Set `false` when embedding Solo in a host page that keeps its own styles:
   * the theme's @scope'd element rules (reset layer, e.g. `p { color }`)
   * then stay inside this Theme's wrapper instead of restyling the whole
   * page. Layers (Popover, Tooltip, DropdownMenu, Dialog…) render inside the
   * wrapper and stay themed; detached surfaces (the Toast fallback viewport)
   * mirror the wrapper's attributes instead of `<html>`'s.
   *
   * Ignored by nested Themes, which never sync.
   * @default true
   */
  syncRoot?: boolean;
}

/**
 * Styles for the theme wrapper
 */
const wrapperStyles = {
  base: 'contents text-(--color-text-primary) font-(family-name:--font-family-body)',
  light: '[color-scheme:light]',
  dark: '[color-scheme:dark]',
  system: '[color-scheme:light_dark]',
} as const;

// =============================================================================
// Nesting context — detect root vs nested Theme
// =============================================================================

/**
 * Context to detect whether this Theme is nested inside another.
 * The root provider (no parent context) syncs data-theme to <html>.
 * @internal
 */
export const ThemeNestingContext = React.createContext(false);
ThemeNestingContext.displayName = 'ThemeNestingContext';

// =============================================================================
// Style injection for unbuilt themes
// =============================================================================

/** Track which themes have already been injected */
const injectedThemes = new Set<string>();

/**
 * How many mounted `Theme`s are relying on the injected data-token defaults.
 *
 * The defaults are one document-wide `:root` block, shared by every theme, so
 * they are injected once and removed only when the last theme that took a
 * reference unmounts — tearing them down with whichever provider happened to
 * inject them would strip the palette from the providers still mounted.
 */
let dataTokenDefaultsRefCount = 0;

/**
 * Hook to inject theme CSS into the document.
 * Pre-built themes skip injection — their CSS
 * is in a separate file imported by the consumer.
 */
function useThemeStyleInjection(theme: DefinedTheme): void {
  const id = useId();

  useInsertionEffect(() => {
    // Built themes have their CSS in a separate file — skip injection
    if (theme.__built) {
      return;
    }

    // Second and later `Theme`s using this theme do no work at all —
    // generation included. Its CSS is document-wide and identical for each.
    const themeKey = `solo-theme-${theme.name}`;
    if (injectedThemes.has(themeKey)) {
      return;
    }

    // One-time perf hint per theme
    warnOnce(
      `theme-injection:${theme.name}`,
      'Theme',
      `"${theme.name}" is using runtime style injection. ` +
        `For better performance, use the pre-built theme:\n\n` +
        `  import {${theme.name}Theme} from '@solo/theme-${theme.name}/built';\n` +
        `  import '@solo/theme-${theme.name}/theme.css';\n\n` +
        `For custom themes, generate the CSS ahead of time with generateThemeCSS() ` +
        `and pass a theme object with \`__built: true\` (see @solo/theme-neutral/built).`,
    );

    const {prose, component} = generateThemeCSS(theme);
    const base = generateDataTokenDefaultsCSS();
    injectedThemes.add(themeKey);
    const cleanups: (() => void)[] = [() => injectedThemes.delete(themeKey)];

    // Data token defaults go into @layer solo-base, where the core token
    // defaults live, so a theme's own `--color-data-*` outranks them by
    // layer. Appended (never prepended) so it cannot register `solo-base`
    // ahead of `reset` and invert the layer order.
    if (base) {
      if (dataTokenDefaultsRefCount++ === 0) {
        const baseStyle = document.createElement('style');
        baseStyle.setAttribute(dataAttr('theme-base'), '');
        baseStyle.textContent = `@layer solo-base {\n${base}\n}`;
        document.head.appendChild(baseStyle);
      }
      cleanups.push(() => {
        if (--dataTokenDefaultsRefCount === 0) {
          document.querySelector(`style[${dataAttr('theme-base')}]`)?.remove();
        }
      });
    }

    // Prose defaults go into @layer reset — lowest priority, scoped to
    // the theme region. Any class-based style (component
    // classes, .solo-*) wins.
    if (prose) {
      const proseStyle = document.createElement('style');
      proseStyle.setAttribute(dataAttr('theme-prose'), theme.name);
      proseStyle.setAttribute(dataAttr('id'), id);
      proseStyle.textContent = `@layer reset {\n${prose}\n}`;
      document.head.appendChild(proseStyle);
    }

    // Component overrides go into @layer solo-theme — above the component
    // style layers so themes can intentionally restyle components.
    if (component) {
      const compStyle = document.createElement('style');
      compStyle.setAttribute(dataAttr('theme'), theme.name);
      compStyle.setAttribute(dataAttr('id'), id);
      compStyle.textContent = `@layer solo-theme {\n${component}\n}`;
      document.head.appendChild(compStyle);
    }

    if (prose || component) {
      cleanups.push(() => {
        // Matched by the solo id marker, which is always written above.
        const proseEl = document.querySelector(
          `style[${dataAttr('theme-prose')}="${theme.name}"][${dataAttr('id')}="${id}"]`,
        );
        const compEl = document.querySelector(
          `style[${dataAttr('theme')}="${theme.name}"][${dataAttr('id')}="${id}"]`,
        );
        proseEl?.remove();
        compEl?.remove();
      });
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, [theme, id]);
}

// =============================================================================
// Root color-scheme sync
// =============================================================================

/**
 * Hook to sync theme attributes to document.documentElement for the root provider.
 * Skipped for nested Theme instances.
 *
 * Syncs two attributes:
 * - `data-theme` (light/dark) — reset.css maps this to color-scheme, controlling
 *   browser chrome (scrollbars, native form controls, date pickers).
 * - `data-solo-theme` (theme name) — enables @scope'd theme CSS to reach elements
 *   outside the Theme wrapper (e.g. toast fallback viewports, portals).
 *
 * - 'light' | 'dark' → sets data-theme="light" | "dark"
 * - 'system' → removes data-theme (reset.css defaults to color-scheme: light dark)
 */
function useRootThemeSync(
  isNested: boolean,
  mode: ThemeMode,
  themeName: string,
): void {
  useIsomorphicLayoutEffect(() => {
    if (isNested) {
      return;
    }
    if (typeof document === 'undefined') {
      return;
    }

    if (mode === 'light' || mode === 'dark') {
      document.documentElement.setAttribute('data-theme', mode);
    } else {
      // system — remove attribute, let reset.css default apply
      document.documentElement.removeAttribute('data-theme');
    }

    // Sync theme name so @scope rules reach portals/fallback viewports.
    document.documentElement.setAttribute(dataAttr('theme'), themeName);

    return () => {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.removeAttribute(dataAttr('theme'));
    };
  }, [isNested, mode, themeName]);
}

// =============================================================================
// Component
// =============================================================================

/**
 * Theme provider component
 *
 * Sets data-solo-theme attribute so @scope'd CSS takes effect.
 * Component overrides are pure CSS scoped under the theme attribute —
 * components render with stable `.solo-*` classes plus `data-*` prop
 * reflections and don't need context.
 *
 * When this is the root Theme (no parent Theme in the tree),
 * it syncs `data-theme` and `data-solo-theme` to `<html>` so browser
 * chrome reflects the active mode and @scope'd CSS reaches portals.
 * Nested Theme instances skip the sync.
 */
export function Theme({
  theme,
  mode = 'system',
  syncRoot = true,
  children,
}: ThemeProps): React.ReactElement {
  const isNested = use(ThemeNestingContext);
  const isEmbeddedRoot = !isNested && !syncRoot;
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  registerTheme(theme);

  useThemeStyleInjection(theme);
  useRootThemeSync(isNested || !syncRoot, mode, theme.name);

  // An embedded root Theme is where detached surfaces read theme attributes
  // from (instead of <html>, which it leaves alone).
  useIsomorphicLayoutEffect(() => {
    if (!isEmbeddedRoot) {
      return;
    }
    setThemeAttributeSource(wrapperRef.current);
    return () => setThemeAttributeSource(null);
  }, [isEmbeddedRoot]);

  // Get color-scheme style
  const colorSchemeStyle =
    mode === 'dark'
      ? wrapperStyles.dark
      : mode === 'light'
        ? wrapperStyles.light
        : wrapperStyles.system;

  // Memoize the context value to prevent unnecessary re-renders
  const ctxValue = useMemo(() => ({theme, mode}), [theme, mode]);

  return (
    <ThemeContext value={ctxValue}>
      <ThemeNestingContext value={true}>
        <div
          ref={wrapperRef}
          className={cn(wrapperStyles.base, colorSchemeStyle)}
          data-solo-theme={theme.name}
          data-theme={mode === 'system' ? undefined : mode}>
          {children}
        </div>
      </ThemeNestingContext>
    </ThemeContext>
  );
}

Theme.displayName = 'Theme';
