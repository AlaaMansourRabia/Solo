/**
 * @file arabicTypography.ts
 * @output Arabic-script typography rules: font token switch, line heights,
 *   tracking reset — for the base token sheet and for every theme scope
 * @position Theme infrastructure (Solo addition); read by
 *   scripts/generate-tokens-css.mjs (core tokens.css) and generateThemeRules
 *   (runtime + built themes)
 *
 * Arabic-script content is set in `--font-family-body-arabic` /
 * `--font-family-heading-arabic` (default IBM Plex Sans Arabic) instead of the
 * theme's Latin face, with slightly taller line heights and no tracking.
 *
 * "Arabic-script content" is:
 *   - anything under `lang="ar" | "fa" | "ur"` (`:lang()` also reads the
 *     page's own `<html lang>`, so it works with `<Theme syncRoot={false}>`);
 *   - right-to-left content with no `lang` at all, inside a Theme (either the
 *     page's `<html dir="rtl">` or a `dir="rtl"` element in the Theme) —
 *     never Hebrew/Yiddish (`:lang(he)`, `:lang(yi)`).
 *
 * Three pieces, because `font-family` inherits as a *computed* value:
 *   1. every Arabic-script element re-points the body/heading font tokens and
 *      the leading tokens, so anything styled from a token resolves Arabic;
 *   2. a Theme's own scope root does the same inside the theme layer, so a
 *      wrapper that is itself Arabic (html lang="ar") recomputes its font;
 *   3. the outermost Arabic-script element (the language boundary)
 *      re-declares `font-family`, so an Arabic island inside an English page
 *      does not keep the inherited Latin face.
 * `--font-family-code` is never switched: code stays monospace and Latin.
 */

/** Arabic-script languages. */
export const ARABIC_LANG = ':lang(ar), :lang(fa), :lang(ur)';
/** Right-to-left languages that are NOT Arabic script. */
const NON_ARABIC_RTL = ':lang(he), :lang(yi)';

/** Token overrides for Arabic-script text roles. */
export const ARABIC_TOKEN_DECLARATIONS: ReadonlyArray<readonly [string, string]> = [
  ['--font-family-body', 'var(--font-family-body-arabic)'],
  ['--font-family-heading', 'var(--font-family-heading-arabic)'],
  // Arabic needs taller lines than Latin (ascenders/descenders, dots,
  // diacritics). Sizes and weights are unchanged.
  ['--text-body-leading', '1.6'],
  ['--text-large-leading', '1.6'],
  ['--text-label-leading', '1.6'],
  ['--text-supporting-leading', '1.6'],
  ['--text-heading-1-leading', '1.4'],
  ['--text-heading-2-leading', '1.4'],
  ['--text-heading-3-leading', '1.4'],
  ['--text-heading-4-leading', '1.4'],
  ['--text-heading-5-leading', '1.4'],
  ['--text-heading-6-leading', '1.4'],
  ['--text-display-1-leading', '1.4'],
  ['--text-display-2-leading', '1.4'],
  ['--text-display-3-leading', '1.4'],
];

/** Every Arabic-script element (piece 1). */
export const ARABIC_CONTENT_SELECTOR =
  // `:root:where()` outranks the token defaults' own `:root` block on <html>.
  `:root:where(${ARABIC_LANG}),\n` +
  `:where(${ARABIC_LANG}),\n` +
  `:where([data-solo-theme] [dir="rtl"]:not([lang]), [data-solo-theme] [dir="rtl"]:not([lang]) *, [dir="rtl"]:not([lang]) [data-solo-theme] *):where(:not(${NON_ARABIC_RTL}))`;

/** The outermost Arabic-script element (piece 3). */
export const ARABIC_BOUNDARY_SELECTOR =
  `:where(:is(${ARABIC_LANG}):not(:is(${ARABIC_LANG}) *)),\n` +
  `:where([data-solo-theme] [dir="rtl"]:not([lang])):where(:not(${NON_ARABIC_RTL}))`;

/** A Theme's scope root when it is Arabic-script (piece 2). */
export const ARABIC_SCOPE_SELECTOR =
  `:scope:where(${ARABIC_LANG}),\n` +
  `  :scope:where([dir="rtl"]:not([lang]), [dir="rtl"]:not([lang]) *):where(:not(${NON_ARABIC_RTL}))`;

const declarations = (indent: string, extra: string[] = []) =>
  [...ARABIC_TOKEN_DECLARATIONS.map(([k, v]) => `${k}: ${v};`), ...extra]
    .map(d => `${indent}${d}`)
    .join('\n');

/** CSS for the base token sheet (wrap in `@layer solo-base`). */
export function arabicBaseCss(indent = '  '): string {
  const inner = indent + '  ';
  return [
    `${indent}/* Arabic-script content: Arabic font tokens, taller lines, no tracking. */`,
    `${indent}${ARABIC_CONTENT_SELECTOR.replace(/\n/g, `\n${indent}`)} {`,
    declarations(inner, ['letter-spacing: normal;']),
    `${indent}}`,
    '',
    `${indent}/* The language boundary re-declares font-family (it inherits computed). */`,
    `${indent}${ARABIC_BOUNDARY_SELECTOR.replace(/\n/g, `\n${indent}`)} {`,
    `${inner}font-family: var(--font-family-body);`,
    `${indent}}`,
  ].join('\n');
}

/** Rule for inside a theme's `@scope` block, after its token block. */
export function arabicScopeRule(): string {
  return `  ${ARABIC_SCOPE_SELECTOR} {\n${declarations('    ')}\n  }`;
}
