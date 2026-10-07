/**
 * @file text.styles.ts
 * @input Uses theme tokens (Tailwind classes)
 * @output Exports class-string maps for Text and Heading props (Record<key, string>)
 * @position Styles module; consumed by Text.tsx, Heading.tsx
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Text/Text.doc.mjs
 */

// =============================================================================
// Color Styles
// =============================================================================

export const colorStyles = {
  primary: 'text-(--color-text-primary)',
  secondary: 'text-(--color-text-secondary)',
  disabled: 'text-(--color-text-disabled)',
  placeholder: 'text-(--color-text-secondary)',
  accent: 'text-(--color-text-accent)',
  inherit: 'text-inherit',
} as const;

// =============================================================================
// Weight Styles
// =============================================================================

export const weightStyles = {
  normal: 'font-(number:--font-weight-normal)',
  medium: 'font-(number:--font-weight-medium)',
  semibold: 'font-(number:--font-weight-semibold)',
  bold: 'font-(number:--font-weight-bold)',
} as const;

// =============================================================================
// Default Weight by Type (matches theme type-scale tokens)
// =============================================================================

export const defaultWeightByTypeStyles = {
  body: 'font-(number:--text-body-weight)',
  large: 'font-(number:--text-large-weight)',
  label: 'font-(number:--text-label-weight)',
  code: 'font-(number:--text-code-weight)',
  supporting: 'font-(number:--text-supporting-weight)',
  'display-1': 'font-(number:--text-display-1-weight)',
  'display-2': 'font-(number:--text-display-2-weight)',
  'display-3': 'font-(number:--text-display-3-weight)',
  inherit: 'font-[number:inherit]',
} as const;

// =============================================================================
// Baseline Size/Leading by Type (from type-scale tokens)
//
// These ensure Text renders with correct sizing even without a theme.
// Theme component overrides (`.solo-text[data-type="body"]`, etc.) win when
// because they have higher specificity via @scope.
// =============================================================================

export const sizeByTypeStyles = {
  body: 'text-(length:--text-body-size) leading-(--text-body-leading)',
  large: 'text-(length:--text-large-size) leading-(--text-large-leading)',
  label: 'text-(length:--text-label-size) leading-(--text-label-leading)',
  code: 'text-(length:--text-code-size) leading-(--text-code-leading) font-(family-name:--font-family-code)',
  supporting: 'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
  'display-1': 'text-(length:--text-display-1-size) leading-(--text-display-1-leading)',
  'display-2': 'text-(length:--text-display-2-size) leading-(--text-display-2-leading)',
  'display-3': 'text-(length:--text-display-3-size) leading-(--text-display-3-leading)',
  inherit: 'text-[length:inherit] leading-[inherit]',
} as const;

/**
 * Line-height per type, re-applied after an explicit `size` override (see the
 * note on {@link sizeStyles}).
 */
export const leadingByTypeStyles = {
  body: 'leading-(--text-body-leading)',
  large: 'leading-(--text-large-leading)',
  label: 'leading-(--text-label-leading)',
  code: 'leading-(--text-code-leading)',
  supporting: 'leading-(--text-supporting-leading)',
  'display-1': 'leading-(--text-display-1-leading)',
  'display-2': 'leading-(--text-display-2-leading)',
  'display-3': 'leading-(--text-display-3-leading)',
  inherit: 'leading-[inherit]',
} as const;

// =============================================================================
// Explicit Size Override
//
// NOTE: tailwind-merge treats a font-size class as overriding any EARLIER
// `leading-*` class, so `cn(sizeByTypeStyles.body, sizeStyles.sm)` would drop
// the type's line-height. Apply an explicit size BEFORE the type size, or
// re-apply the leading after it, so each property is set independently.
// =============================================================================

export const sizeStyles = {
  '4xs': 'text-(length:--font-size-4xs)',
  '3xs': 'text-(length:--font-size-3xs)',
  '2xs': 'text-(length:--font-size-2xs)',
  xsm: 'text-(length:--font-size-xs)',
  sm: 'text-(length:--font-size-sm)',
  base: 'text-(length:--font-size-base)',
  lg: 'text-(length:--font-size-lg)',
  xl: 'text-(length:--font-size-xl)',
  '2xl': 'text-(length:--font-size-2xl)',
  '3xl': 'text-(length:--font-size-3xl)',
  '4xl': 'text-(length:--font-size-4xl)',
} as const;

// =============================================================================
// Baseline Size/Leading by Heading Level (from type-scale tokens)
//
// Same rationale as sizeByTypeStyles — ensures Heading renders
// with correct sizing even without a theme.
// =============================================================================

export const sizeByLevelStyles = {
  1: 'text-(length:--text-heading-1-size) leading-(--text-heading-1-leading) font-(number:--text-heading-1-weight)',
  2: 'text-(length:--text-heading-2-size) leading-(--text-heading-2-leading) font-(number:--text-heading-2-weight)',
  3: 'text-(length:--text-heading-3-size) leading-(--text-heading-3-leading) font-(number:--text-heading-3-weight)',
  4: 'text-(length:--text-heading-4-size) leading-(--text-heading-4-leading) font-(number:--text-heading-4-weight)',
  5: 'text-(length:--text-heading-5-size) leading-(--text-heading-5-leading) font-(number:--text-heading-5-weight)',
  6: 'text-(length:--text-heading-6-size) leading-(--text-heading-6-leading) font-(number:--text-heading-6-weight)',
} as const;

// =============================================================================
// Display Styles
// =============================================================================

export const displayStyles = {
  inline: 'inline',
  block: 'block',
} as const;

// =============================================================================
// Truncation Styles
// =============================================================================

export const truncationStyles = {
  // Single-line truncation (maxLines=1)
  singleLine: 'overflow-hidden text-ellipsis whitespace-nowrap block',
  // Multi-line truncation base (maxLines>1)
  // Note: -webkit-line-clamp value is set via inline style
  multiLine: 'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]',
} as const;

// =============================================================================
// Word Break Styles
// =============================================================================

export const wordBreakStyles = {
  'break-word': '[word-break:normal] wrap-break-word',
  'break-all': 'break-all',
} as const;

// =============================================================================
// Text Wrap Styles
// =============================================================================

export const textWrapStyles = {
  wrap: 'text-wrap',
  nowrap: 'text-nowrap',
  balance: 'text-balance',
  pretty: 'text-pretty',
} as const;

// =============================================================================
// Capsize Styles (Text Box Trim)
// =============================================================================

export const capsizeStyles = {
  enabled: '[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] block',
} as const;

// =============================================================================
// Decoration Styles
// =============================================================================

export const decorationStyles = {
  strikethrough: '[text-decoration:line-through]',
} as const;

// =============================================================================
// Tabular Numbers Style
// =============================================================================

export const tabularNumbersStyle = {
  enabled: '[font-variant-numeric:tabular-nums]',
} as const;

// =============================================================================
// Justify (Text Alignment) Styles
// =============================================================================

export const justifyStyles = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
} as const;

// =============================================================================
// Truncation Tooltip Content Style
// =============================================================================

export const truncationTooltipStyles = {
  content: 'max-w-[300px] [word-break:break-word]',
} as const;
