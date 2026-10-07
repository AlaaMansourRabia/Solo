'use client';
/**
 * @file useEntryAnimation.ts
 * @input Uses React, theme tokens; keyframes live in useEntryAnimation.css
 * @output Exports useEntryAnimation hook for mount-only entry animations
 * @position Hook utility; consumed by FieldStatus and available to consumers
 *
 * Provides entry animations for conditionally rendered elements.
 * Only animates when the element is dynamically mounted after the initial
 * page paint — statically rendered elements on page load are not animated.
 */

import {useState} from 'react';

// Track whether the initial page paint has completed.
// Elements rendered on page load should not animate;
// only dynamically inserted ones should.
//
// NOTE: This module is marked 'use client' so it never runs on the server.
// If the directive is removed, this flag will always be false during SSR,
// and useState(() => initialPaintComplete) will capture false — meaning
// animations won't run after hydration. Keep 'use client' or add an
// effect-based fallback if SSR support is needed.
let initialPaintComplete = false;
if (typeof window !== 'undefined') {
  requestAnimationFrame(() => {
    initialPaintComplete = true;
  });
}

// Keyframes `solo-entry-{slide-down,slide-up,fade-in,scale-in}` live in
// useEntryAnimation.css.
const styles = {
  slideDown:
    '[animation-name:solo-entry-slide-down] motion-reduce:[animation-name:none] [animation-duration:var(--duration-fast-max)] [animation-timing-function:var(--ease-standard)] [animation-fill-mode:backwards]',
  slideUp:
    '[animation-name:solo-entry-slide-up] motion-reduce:[animation-name:none] [animation-duration:var(--duration-fast-max)] [animation-timing-function:var(--ease-standard)] [animation-fill-mode:backwards]',
  fadeIn:
    '[animation-name:solo-entry-fade-in] motion-reduce:[animation-name:none] [animation-duration:var(--duration-fast-max)] [animation-timing-function:var(--ease-standard)] [animation-fill-mode:backwards]',
  scaleIn:
    '[animation-name:solo-entry-scale-in] motion-reduce:[animation-name:none] [animation-duration:var(--duration-fast-max)] [animation-timing-function:var(--ease-standard)] [animation-fill-mode:backwards]',
} as const;

export type EntryAnimationPreset =
  | 'slideDown'
  | 'slideUp'
  | 'fadeIn'
  | 'scaleIn';

/**
 * Returns a class string (or `null`) for animating an element on mount.
 * Compose it with `cn(...)`; `null` is ignored.
 *
 * Only animates when the element is dynamically inserted after the initial
 * page paint. Elements rendered on page load are not animated.
 *
 * @example
 * ```
 * const entryClassName = useEntryAnimation('slideDown');
 * <div className={cn(styles.root, entryClassName)}>Animated content</div>
 * ```
 */
export function useEntryAnimation(
  preset: EntryAnimationPreset = 'slideDown',
): string | null {
  const [animate] = useState(() => initialPaintComplete);
  return animate ? styles[preset] : null;
}
