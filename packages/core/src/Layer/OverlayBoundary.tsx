'use client';

/**
 * @file OverlayBoundary.tsx
 * @input React context, ResizeObserver, window resize/scroll
 * @output Exports OverlayBoundary, OverlayBoundaryProps and useOverlayBoundary
 * @position Layer primitive; read by full-screen overlays (MobileNav,
 *   BottomSheet, BottomSheetSwitcher)
 *
 * Full-screen overlays open as native modal `<dialog>`s in the browser's top
 * layer, so they always cover the whole window. That is right for an app, and
 * wrong when the app is shown *inside* something: a phone frame on a desktop
 * preview, an embedded demo, a design canvas. Wrap that region in
 * `<OverlayBoundary>` and those overlays size their dialog — and their dimmed
 * scrim — to the region's on-screen rectangle instead of the window. They keep
 * everything the top layer gives them (focus trap, Escape, inertness behind).
 *
 * Only overlays that fill the screen read the boundary. Anchored layers
 * (Popover, Tooltip, menus) already position against their trigger.
 */

import {
  createContext,
  use,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import type {BaseProps} from '../BaseProps';
import {useMergedRefs} from '../hooks/useMergedRefs';

const OverlayBoundaryContext = createContext<HTMLElement | null>(null);

export interface OverlayBoundaryProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the boundary element. */
  ref?: Ref<HTMLDivElement>;
  /** The region full-screen overlays are confined to. */
  children: ReactNode;
}

/**
 * Confines full-screen overlays (MobileNav, BottomSheet, BottomSheetSwitcher)
 * opened inside it to its own on-screen rectangle.
 *
 * @example
 * ```
 * <OverlayBoundary className="w-[390px] h-[844px] rounded-(--radius-xl)">
 *   <MobileApp />
 * </OverlayBoundary>
 * ```
 */
export function OverlayBoundary({
  ref,
  children,
  className,
  style,
  ...rest
}: OverlayBoundaryProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const mergedRef = useMergedRefs(ref, setElement);
  return (
    <OverlayBoundaryContext value={element}>
      <div ref={mergedRef} className={className} style={style} {...rest}>
        {children}
      </div>
    </OverlayBoundaryContext>
  );
}

OverlayBoundary.displayName = 'OverlayBoundary';

export interface OverlayBoundaryState {
  /** True when an OverlayBoundary encloses the overlay. */
  isBounded: boolean;
  /**
   * Inline style that places a fixed, full-screen dialog over the boundary's
   * rectangle (undefined when unbounded). Merge it before the caller's style.
   */
  style: CSSProperties | undefined;
}

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
  radius: string;
};

const sameRect = (a: Rect | null, b: Rect) =>
  a != null &&
  a.top === b.top &&
  a.left === b.left &&
  a.width === b.width &&
  a.height === b.height &&
  a.radius === b.radius;

/**
 * For full-screen overlays: the enclosing OverlayBoundary's rectangle as an
 * inline style, tracked while `isActive` (resize, scroll, layout changes).
 */
export function useOverlayBoundary(isActive: boolean): OverlayBoundaryState {
  const boundary = use(OverlayBoundaryContext);
  const [rect, setRect] = useState<Rect | null>(null);

  useLayoutEffect(() => {
    if (!boundary || !isActive) return;
    const measure = () => {
      const r = boundary.getBoundingClientRect();
      const next = {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        radius: getComputedStyle(boundary).borderRadius,
      };
      setRect(prev => (sameRect(prev, next) ? prev : next));
    };
    measure();
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(measure);
    observer?.observe(boundary);
    window.addEventListener('resize', measure);
    // Capture: any scrolling ancestor moves the boundary on screen.
    window.addEventListener('scroll', measure, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [boundary, isActive]);

  if (!boundary) return {isBounded: false, style: undefined};
  return {
    isBounded: true,
    style: rect
      ? {
          // Viewport coordinates from getBoundingClientRect are physical, so
          // the dialog is placed with physical top/left in both directions.
          top: rect.top,
          left: rect.left,
          right: 'auto',
          bottom: 'auto',
          width: rect.width,
          height: rect.height,
          borderRadius: rect.radius,
          overflow: 'clip',
        }
      : undefined,
  };
}
