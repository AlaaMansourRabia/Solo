/**
 * @file stack.styles.ts
 * @input Uses spacing tokens from theme (Tailwind classes)
 * @output Class-list utility for stack (flex container) styling
 * @position Layout utility; used by HStack, VStack components
 *
 * SYNC: When modified, update /packages/core/src/Stack/Stack.doc.mjs
 */

import type {SpacingStep} from '../utils/types';

const alignItemsStyles = {
  center: 'items-center',
  end: 'items-end',
  start: 'items-start',
  stretch: 'items-stretch',
} as const;

/**
 * Cross-axis alignment options for stack items.
 * - For HStack: vertical alignment
 * - For VStack: horizontal alignment
 */
export type StackCrossAlignment = keyof typeof alignItemsStyles;

const justifyContentStyles = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const;

/**
 * Main-axis alignment options for stack items.
 * - For HStack: horizontal alignment
 * - For VStack: vertical alignment
 */
export type StackMainAlignment = keyof typeof justifyContentStyles;

const directionStyles = {
  horizontal: 'flex-row',
  vertical: 'flex-col',
} as const;

/**
 * Stack direction.
 * - `horizontal`: Items flow left-to-right (HStack)
 * - `vertical`: Items flow top-to-bottom (VStack)
 */
export type StackDirection = keyof typeof directionStyles;

const wrapStyles = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
} as const;

/**
 * Flex wrap behavior.
 * - `nowrap`: Items stay on one line (default)
 * - `wrap`: Items wrap to next line
 * - `wrap-reverse`: Items wrap to previous line
 */
export type StackWrap = keyof typeof wrapStyles;

const baseStyles = {
  stack: 'flex',
} as const;

/**
 * Gap styles using spacing tokens from the theme.
 * Keys are numeric SpacingStep values.
 */
const gapStyles = {
  0: 'gap-x-(--spacing-0) gap-y-(--spacing-0)',
  0.5: 'gap-x-(--spacing-0-5) gap-y-(--spacing-0-5)',
  1: 'gap-x-(--spacing-1) gap-y-(--spacing-1)',
  1.5: 'gap-x-(--spacing-1-5) gap-y-(--spacing-1-5)',
  2: 'gap-x-(--spacing-2) gap-y-(--spacing-2)',
  3: 'gap-x-(--spacing-3) gap-y-(--spacing-3)',
  4: 'gap-x-(--spacing-4) gap-y-(--spacing-4)',
  5: 'gap-x-(--spacing-5) gap-y-(--spacing-5)',
  6: 'gap-x-(--spacing-6) gap-y-(--spacing-6)',
  8: 'gap-x-(--spacing-8) gap-y-(--spacing-8)',
  10: 'gap-x-(--spacing-10) gap-y-(--spacing-10)',
} as const;

export {type SpacingStep};

export interface StackOptions {
  /**
   * Position of items along the cross-axis.
   * - For HStack: vertical alignment
   * - For VStack: horizontal alignment
   */
  crossAlign?: StackCrossAlignment;

  /**
   * Direction of the stack.
   */
  direction: StackDirection;

  /**
   * Spacing between items.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   */
  gap?: SpacingStep;

  /**
   * Position of items along the main-axis.
   * - For HStack: horizontal alignment
   * - For VStack: vertical alignment
   */
  mainAlign?: StackMainAlignment;

  /**
   * Whether items should wrap to the next line.
   * - `nowrap`: Items stay on one line (default)
   * - `wrap`: Items wrap to next line
   * - `wrap-reverse`: Items wrap to previous line
   * @default 'nowrap'
   */
  wrap?: StackWrap;
}

/**
 * Utility to add stack (flex container) classes to any element.
 *
 * Returns a readonly list of class strings (and `false` for unset options),
 * so it composes through `cn(...)`.
 *
 * @example
 * ```
 * import { stack } from '@solo/core/Layout';
 * import { cn } from '@solo/core/utils';
 *
 * // Horizontal stack with numeric gap
 * <div className={cn(...stack({ direction: 'horizontal', gap: 2 }))}>
 *   <Child />
 *   <Child />
 * </div>
 *
 * // Vertical stack with centered items
 * <div className={cn(...stack({ direction: 'vertical', crossAlign: 'center' }))}>
 *   <Child />
 *   <Child />
 * </div>
 *
 * // Wrapping horizontal stack with larger gap
 * <div className={cn(...stack({ direction: 'horizontal', gap: 4, wrap: 'wrap' }))}>
 *   <Child />
 *   <Child />
 *   <Child />
 * </div>
 * ```
 */
export function stack({
  crossAlign,
  direction,
  gap,
  mainAlign,
  wrap,
}: StackOptions) {
  return [
    baseStyles.stack,
    directionStyles[direction],
    gap != null && gapStyles[gap],
    crossAlign != null && alignItemsStyles[crossAlign],
    mainAlign != null && justifyContentStyles[mainAlign],
    wrap != null && wrapStyles[wrap],
  ] as const;
}
