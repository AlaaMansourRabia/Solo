/**
 * @file IconSize.styles.ts
 * @input Defines the Icon size scale
 * @output Exports shared Icon size types and class maps
 * @position Internal Icon sizing source; consumed by Icon and icon-slot owners
 */


/**
 * Icon sizes are expressed in `rem` so they scale with the root font-size.
 * Values are the px-equivalents at a 16px root: 12, 16, 20, and 24px.
 */
const iconSizeValues = {
  xsm: '0.75rem',
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
} as const;

export type IconSize = keyof typeof iconSizeValues;

/** Size styles for direct SVG icon components. */
export const iconSizeStyles = {
  xsm: 'w-[0.75rem] h-[0.75rem]',
  sm: 'w-[1rem] h-[1rem]',
  md: 'w-[1.25rem] h-[1.25rem]',
  lg: 'w-[1.5rem] h-[1.5rem]',
} as const satisfies Record<IconSize, string>;

export const iconBoxSizeStyles = {
  xsm: 'w-[0.75rem] h-[0.75rem] text-[length:0.75rem]',
  sm: 'w-[1rem] h-[1rem] text-[length:1rem]',
  md: 'w-[1.25rem] h-[1.25rem] text-[length:1.25rem]',
  lg: 'w-[1.5rem] h-[1.5rem] text-[length:1.5rem]',
} as const satisfies Record<IconSize, string>;
