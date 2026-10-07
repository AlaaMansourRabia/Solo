'use client';

/**
 * @file Text component exports
 * @position Entry point for Text components
 */

/**
 * Extensible map of text color variants for Text/Heading.
 *
 * Themes add custom colors via component overrides in defineTheme; a custom
 * color renders with the `primary` baseline color class and receives its
 * actual color from theme CSS (`.solo-text.<color>` / `.solo-heading.<color>`),
 * exactly like custom text `type`s.
 *
 * To add type-safe custom colors, use module augmentation — the same technique
 * as `ButtonVariantMap` etc.:
 * ```ts
 * declare module '@solo/core/Text' {
 *   interface TextColorMap {
 *     brand: true;
 *     danger: true;
 *   }
 * }
 * ```
 *
 * A pre-built theme ships these augmentations for any new `color:*` values
 * in its Text/Heading component overrides.
 */
export interface TextColorMap {
  primary: true;
  secondary: true;
  disabled: true;
  placeholder: true;
  accent: true;
  inherit: true;
}

export {Text, type TextProps, type TextType, type TextSize} from './Text';
export {
  Heading,
  type HeadingProps,
  type HeadingLevel,
  type HeadingType,
  type HeadingTypeMap,
} from '../Heading';

// Re-export shared types from theme for convenience
export type {
  TextColor,
  TextWeight,
  TextDisplay,
  TextJustify,
  WordBreak,
  TextWrap,
  TextXStyleAllowed,
  ProseElement,
} from '../theme/types';

// Re-export useTruncation for advanced use cases
export {
  useTruncation,
  type UseTruncationOptions,
  type UseTruncationReturn,
} from './useTruncation';
