/**
 * @file stackItem.styles.ts
 * @input None (Tailwind classes)
 * @output Class-list utility for stack item styling
 * @position Layout utility; used by StackItem and directly by components
 *
 * SYNC: When modified, update /packages/core/src/Stack/Stack.doc.mjs
 */

/**
 * "Resets" the min-width and min-height of the flex item to behave predictably.
 *
 * Flex items have an implicit min size of auto, meaning they will never shrink
 * smaller than their contents. This reset allows items to be constrained by
 * their flex parent and become scrollable if necessary.
 */
const minSizeResetStyles = {
  reset: 'min-h-0 min-w-0',
} as const;

const crossAlignSelfStyles = {
  center: 'self-center',
  end: 'self-end',
  start: 'self-start',
  stretch: 'self-stretch',
} as const;

/**
 * Cross-alignment options for stack items.
 * Overrides the default cross-alignment set on the parent stack.
 */
export type StackItemCrossAlignSelf = keyof typeof crossAlignSelfStyles;

const sizeStyles = {
  /**
   * Fill the remaining space inside of the stack.
   * Will split the space evenly among other items with "fill".
   */
  fill: 'grow',
  /**
   * Do not grow or shrink within the stack.
   * Use the intrinsic size of the item.
   */
  static: 'grow-0 shrink-0',
} as const;

/**
 * Size options for stack items.
 * - `static`: Item uses its intrinsic size, won't grow or shrink
 * - `fill`: Item grows to fill remaining space (flexGrow: 1)
 */
export type StackItemSize = keyof typeof sizeStyles;

export interface StackItemOptions {
  /**
   * Overrides the default cross-alignment for this item.
   * (hAlign for VStack, vAlign for HStack)
   *
   * Set cross-alignment on the stack itself and override individual
   * children as needed with this option.
   */
  crossAlignSelf?: StackItemCrossAlignSelf;

  /**
   * Size behavior of the item within the stack.
   * - `static`: Uses intrinsic size, won't grow or shrink (default)
   * - `fill`: Grows to fill remaining space
   *
   * @default "static"
   */
  size?: StackItemSize;
}

/**
 * Utility to add stack item classes to any component. Returns a readonly
 * list of class strings (and `false` for unset options) for `cn(...)`.
 *
 * Use this to avoid wrapping components in StackItem when you need
 * direct control over flex behavior.
 *
 * @example
 * ```
 * import { stackItem } from '@solo/core/Layout';
 *
 * <div className={cn(...stackItem({ size: 'fill' }))}>
 *   Content that fills remaining space
 * </div>
 * ```
 */
export function stackItem({crossAlignSelf, size}: StackItemOptions = {}) {
  return [
    minSizeResetStyles.reset,
    sizeStyles[size ?? 'static'],
    crossAlignSelf != null && crossAlignSelfStyles[crossAlignSelf],
  ] as const;
}
