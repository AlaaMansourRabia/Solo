'use client';

/**
 * @file OverlayScrim.tsx
 * @input Scrim props (mode, position, align, visibility)
 * @output Renders the scrim div with background, media theme, transitions
 * @position Internal rendering primitive; used by Overlay and useOverlay
 *
 * Not exported directly — consumers use Overlay (component) or
 * useOverlay (hook), both of which render this internally.
 */

import type {ReactNode} from 'react';
import {MediaTheme} from '../theme/MediaTheme';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';

// =============================================================================
// Types (re-exported from index.ts for consumers)
// =============================================================================

export type OverlayScrimMode = 'dark' | 'light' | false;
export type OverlayPosition = 'fill' | 'bottom' | 'top';
export type OverlayAlign = 'start' | 'center' | 'end';
export type OverlayShowOn = 'hover' | 'always' | 'focus' | 'hover-or-focus';

export interface OverlayScrimProps {
  scrim: OverlayScrimMode;
  position: OverlayPosition;
  align: OverlayAlign;
  showOn: OverlayShowOn;
  isOpen: boolean | undefined;
  children: ReactNode;
}

// =============================================================================
// Styles
// =============================================================================

// Ancestor conditions read the `overlayScope` group (`group/overlay`, see
// overlay.markers.styles.ts) that Overlay / useOverlay put on the container.
const styles = {
  base: cn(
    'absolute flex flex-col gap-(--spacing-2) p-(--spacing-3) pointer-events-none',
    '[transition-property:opacity,visibility,transform]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
  ),

  // Position variants
  fill: 'inset-0',
  bottom: 'inset-x-0 bottom-0',
  top: 'inset-x-0 top-0',

  // Alignment
  alignStart: 'items-start justify-start',
  alignCenter: 'items-center justify-center',
  alignEnd: 'items-end justify-start',

  // Scrim backgrounds
  scrimDark: 'bg-(--color-overlay)',
  // TODO: Replace with --color-overlay-light token when added
  scrimLight: 'bg-[color-mix(in_srgb,white_60%,transparent)]',

  // Hidden: strips slide out, fill fades
  hidden: 'opacity-0 invisible',
  hiddenBottom: '[transform:translateY(100%)]',
  hiddenTop: '[transform:translateY(-100%)]',

  // Visible
  visible: cn(
    'opacity-100 visible pointer-events-auto [transform:translateY(0)]',
    'starting:opacity-0',
  ),

  // @starting-style for strips: slide in on mount
  visibleFromBottom: 'starting:opacity-0 starting:[transform:translateY(100%)]',
  visibleFromTop: 'starting:opacity-0 starting:[transform:translateY(-100%)]',

  // CSS-driven: ancestor hover + focus (accessible default)
  hoverReveal: cn(
    'opacity-0 can-hover:group-hover/overlay:opacity-100 group-focus-within/overlay:opacity-100',
    'invisible can-hover:group-hover/overlay:visible group-focus-within/overlay:visible',
    'pointer-events-none can-hover:group-hover/overlay:pointer-events-auto group-focus-within/overlay:pointer-events-auto',
  ),

  // Slide transform for strip hover reveal
  hoverRevealBottom: cn(
    '[transform:translateY(100%)]',
    'can-hover:group-hover/overlay:[transform:translateY(0)]',
    'group-focus-within/overlay:[transform:translateY(0)]',
  ),
  hoverRevealTop: cn(
    '[transform:translateY(-100%)]',
    'can-hover:group-hover/overlay:[transform:translateY(0)]',
    'group-focus-within/overlay:[transform:translateY(0)]',
  ),

  // CSS-driven: focus-within only
  focusReveal: cn(
    'opacity-0 group-focus-within/overlay:opacity-100',
    'invisible group-focus-within/overlay:visible',
    'pointer-events-none group-focus-within/overlay:pointer-events-auto',
  ),

  focusRevealBottom:
    '[transform:translateY(100%)] group-focus-within/overlay:[transform:translateY(0)]',
  focusRevealTop:
    '[transform:translateY(-100%)] group-focus-within/overlay:[transform:translateY(0)]',
} as const;

const alignMap = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
} as const;

const positionMap = {
  fill: styles.fill,
  bottom: styles.bottom,
  top: styles.top,
} as const;

// =============================================================================
// Visibility style helpers — extract branching logic from render
// =============================================================================

/**
 * Returns visibility/animation styles for JS-controlled overlays (isOpen defined).
 * Uses position to determine slide direction for strips.
 */
function getControlledVisibility(isOpen: boolean, position: OverlayPosition) {
  if (isOpen) {
    return {
      base: styles.visible,
      bottom: position === 'bottom' && styles.visibleFromBottom,
      top: position === 'top' && styles.visibleFromTop,
    };
  }
  return {
    base: styles.hidden,
    bottom: position === 'bottom' && styles.hiddenBottom,
    top: position === 'top' && styles.hiddenTop,
  };
}

/**
 * Returns visibility/animation styles for CSS-driven overlays (showOn mode).
 * Each mode has a base reveal style + optional position-based slide.
 */
function getShowOnVisibility(showOn: OverlayShowOn, position: OverlayPosition) {
  switch (showOn) {
    case 'always':
      return {
        base: styles.visible,
        bottom: position === 'bottom' && styles.visibleFromBottom,
        top: position === 'top' && styles.visibleFromTop,
      };
    case 'hover':
    case 'hover-or-focus':
      return {
        base: styles.hoverReveal,
        bottom: position === 'bottom' && styles.hoverRevealBottom,
        top: position === 'top' && styles.hoverRevealTop,
      };
    case 'focus':
      return {
        base: styles.focusReveal,
        bottom: position === 'bottom' && styles.focusRevealBottom,
        top: position === 'top' && styles.focusRevealTop,
      };
  }
}

// =============================================================================
// Component (internal)
// =============================================================================

export function OverlayScrim({
  scrim,
  position,
  align,
  showOn,
  isOpen,
  children,
}: OverlayScrimProps) {
  const isControlled = isOpen !== undefined;

  const themeMode =
    scrim === 'dark' ? 'dark' : scrim === 'light' ? 'light' : null;

  const content = themeMode ? (
    <MediaTheme mode={themeMode}>{children}</MediaTheme>
  ) : (
    children
  );

  const visibility = isControlled
    ? getControlledVisibility(isOpen, position)
    : getShowOnVisibility(showOn, position);

  return (
    <div
      {...mergeProps(
        themeProps('overlay-scrim', {position}),
        cn(
          styles.base,
          positionMap[position],
          alignMap[align],
          scrim === 'dark' && styles.scrimDark,
          scrim === 'light' && styles.scrimLight,
          visibility.base,
          visibility.bottom,
          visibility.top,
        ),
      )}
      inert={isControlled && !isOpen ? true : undefined}>
      {content}
    </div>
  );
}
