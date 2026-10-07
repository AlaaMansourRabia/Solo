/**
 * @file layerAnimations.styles.ts
 * @input Uses theme duration/easing tokens; keyframes live in layerAnimations.css
 * @output Exports shared entry animation styles for layer-based components
 * @position Shared animation primitives; consumed by DropdownMenu, Popover,
 *   HoverCard, Tooltip, Selector, and any component using useLayer
 *
 * Provides opt-in entry animations for popover/layer components.
 * Each entry is a class string. Components apply it via the `className`
 * option on `layer.render()`.
 *
 * @example
 * ```
 * import {layerAnimations} from '../Layer/layerAnimations.styles';
 *
 * // Direction-aware (for components that know placement):
 * layer.render(<Content />, {
 *   className: layerAnimations[placement],
 * });
 *
 * // Fixed direction:
 * layer.render(<Content />, {
 *   className: layerAnimations.below,
 * });
 * ```
 */

import {cn} from '../utils/cn';

// Keyframes `solo-layer-enter-{below,above,end,start}` and the RTL mirrors
// `solo-layer-enter-{end,start}-rtl` live in layerAnimations.css.
const animationBase = cn(
  '[animation-duration:var(--duration-fast-max)]',
  '[animation-timing-function:var(--ease-standard)]',
  '[animation-fill-mode:backwards]',
);

/**
 * Shared entry animation styles for layer-based components.
 *
 * Keyed by LayerPlacement ('above' | 'below' | 'start' | 'end')
 * for easy lookup: `layerAnimations[placement]`.
 *
 * Each entry disables its keyframe animation under
 * `prefers-reduced-motion: reduce` so the layer appears instantly instead of
 * translating/scaling in (infra-6).
 */
export const layerAnimations = {
  below: cn(
    '[animation-name:solo-layer-enter-below] motion-reduce:[animation-name:none]',
    animationBase,
  ),
  above: cn(
    '[animation-name:solo-layer-enter-above] motion-reduce:[animation-name:none]',
    animationBase,
  ),
  end: cn(
    '[animation-name:solo-layer-enter-end]',
    '[&:is([dir=rtl]_*)]:[animation-name:solo-layer-enter-end-rtl]',
    'motion-reduce:[animation-name:none]',
    // The RTL arm out-specifies the bare media rule; restate `none` under it
    // so reduced motion still wins in RTL.
    'motion-reduce:[&:is([dir=rtl]_*)]:[animation-name:none]',
    animationBase,
  ),
  start: cn(
    '[animation-name:solo-layer-enter-start]',
    '[&:is([dir=rtl]_*)]:[animation-name:solo-layer-enter-start-rtl]',
    'motion-reduce:[animation-name:none]',
    // The RTL arm out-specifies the bare media rule; restate `none` under it
    // so reduced motion still wins in RTL.
    'motion-reduce:[&:is([dir=rtl]_*)]:[animation-name:none]',
    animationBase,
  ),
} as const;
