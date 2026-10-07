/**
 * @file highlightStyles.ts
 * @input Syntax token defaults from domainTokens
 * @output Injects ::highlight() CSS rules + fallback token values into the document head
 * @position Shared utility; consumed by CodeBlock and CodeEditor
 *
 * SYNC: When modified, update:
 * - /packages/core/src/theme/domainTokens/syntaxTokens.ts (syntax color token names/defaults)
 */

import {syntaxTokenDefaults} from '../theme';

/**
 * Build the fallback CSS custom properties from the syntax token defaults.
 * These provide colors when no theme explicitly sets --color-syntax-* tokens.
 * Themes override these via higher-specificity [data-solo-theme] selectors.
 */
const FALLBACK_TOKENS = `:root {\n${Object.entries(syntaxTokenDefaults)
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}\n}`;

/**
 * Scoped ::highlight() rules — attached to the `code` element so the
 * browser only checks highlight ranges within code content, not the
 * entire document tree. Using `code::highlight()` instead of bare
 * `::highlight()` avoids expensive style recalc on every element.
 */
const HIGHLIGHT_STYLES = `
${FALLBACK_TOKENS}

.solo-code-block code::highlight(solo-keyword),
.solo-codeeditor code::highlight(solo-keyword) { color: var(--color-syntax-keyword); }
.solo-code-block code::highlight(solo-string),
.solo-codeeditor code::highlight(solo-string) { color: var(--color-syntax-string); }
.solo-code-block code::highlight(solo-comment),
.solo-codeeditor code::highlight(solo-comment) { color: var(--color-syntax-comment); }
.solo-code-block code::highlight(solo-number),
.solo-codeeditor code::highlight(solo-number) { color: var(--color-syntax-number); }
.solo-code-block code::highlight(solo-function),
.solo-codeeditor code::highlight(solo-function) { color: var(--color-syntax-function); }
.solo-code-block code::highlight(solo-type),
.solo-codeeditor code::highlight(solo-type) { color: var(--color-syntax-type); }
.solo-code-block code::highlight(solo-tag),
.solo-codeeditor code::highlight(solo-tag) { color: var(--color-syntax-tag); }
.solo-code-block code::highlight(solo-attribute),
.solo-codeeditor code::highlight(solo-attribute) { color: var(--color-syntax-attribute); }
.solo-code-block code::highlight(solo-property),
.solo-codeeditor code::highlight(solo-property) { color: var(--color-syntax-property); }
.solo-code-block code::highlight(solo-operator),
.solo-codeeditor code::highlight(solo-operator) { color: var(--color-syntax-operator); }
.solo-code-block code::highlight(solo-constant),
.solo-codeeditor code::highlight(solo-constant) { color: var(--color-syntax-constant); }
.solo-code-block code::highlight(solo-punctuation),
.solo-codeeditor code::highlight(solo-punctuation) { color: var(--color-syntax-punctuation); }
.solo-code-block code::highlight(solo-variable),
.solo-codeeditor code::highlight(solo-variable) { color: var(--color-syntax-variable); }

/* Span-based fallback classes — used when highlightMode='spans' or
   when the CSS Custom Highlight API is not available. */
.solo-token-keyword         { color: var(--color-syntax-keyword); }
.solo-token-string           { color: var(--color-syntax-string); }
.solo-token-comment         { color: var(--color-syntax-comment); }
.solo-token-number           { color: var(--color-syntax-number); }
.solo-token-function       { color: var(--color-syntax-function); }
.solo-token-type               { color: var(--color-syntax-type); }
.solo-token-tag                 { color: var(--color-syntax-tag); }
.solo-token-attribute     { color: var(--color-syntax-attribute); }
.solo-token-property       { color: var(--color-syntax-property); }
.solo-token-operator       { color: var(--color-syntax-operator); }
.solo-token-constant       { color: var(--color-syntax-constant); }
.solo-token-punctuation { color: var(--color-syntax-punctuation); }
.solo-token-variable       { color: var(--color-syntax-variable); }
`;

let inserted = false;

/**
 * Injects the ::highlight() CSS rules into the document <head>.
 * Safe to call multiple times — only injects once.
 */
export function ensureHighlightStyles(): void {
  if (inserted) {
    return;
  }
  if (typeof document === 'undefined') {
    return;
  }

  const style = document.createElement('style');
  style.setAttribute('data-solo-highlight-styles', '');
  style.textContent = HIGHLIGHT_STYLES;
  document.head.appendChild(style);
  inserted = true;
}

/**
 * Token types that map to highlight names.
 * Used to create CSS.highlights entries with the `solo-` prefix.
 */
export const TOKEN_TYPES = [
  'keyword',
  'string',
  'comment',
  'number',
  'function',
  'type',
  'tag',
  'attribute',
  'property',
  'operator',
  'constant',
  'punctuation',
  'variable',
] as const;
