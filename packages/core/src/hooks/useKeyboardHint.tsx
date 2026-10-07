'use client';

/**
 * @file useKeyboardHint.tsx
 * @input Uses React, Tailwind classes, Kbd, useLayer, i18n (useTranslator)
 * @output Exports useKeyboardHint hook — ephemeral arrow-key navigation hint
 * @position Core hook; shows sighted keyboard users how to navigate composite
 *   widgets that use roving tabindex (single Tab stop, arrows inside)
 *
 * SYNC: When modified, update:
 * - /packages/core/src/hooks/index.ts
 * - /packages/core/src/hooks/useKeyboardHint.doc.mjs
 * - /apps/storybook/stories/useKeyboardHint.stories.tsx
 */

import React, {useCallback, useEffect, useRef, type ReactNode} from 'react';
import {spacingVars} from '../theme/tokenVars';
import {cn} from '../utils/cn';
import {Kbd} from '../Kbd';
import {useLayer} from '../Layer/useLayer';
import {useTranslator} from '../i18n';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type KeyboardHintOrientation = 'horizontal' | 'vertical' | 'both';

export interface UseKeyboardHintOptions {
  /**
   * Orientation of the arrow-key navigation. Controls which arrow icons are
   * shown in the hint badge.
   * - `'horizontal'` → ← →
   * - `'vertical'` → ↑ ↓
   * - `'both'` → ← → ↑ ↓
   * @default 'horizontal'
   */
  orientation?: KeyboardHintOrientation;

  /**
   * Milliseconds before the hint auto-dismisses after appearing.
   * @default 3000
   */
  dismissAfterMs?: number;

  /**
   * Whether the hint is enabled. Set to false to disable for a specific
   * instance (e.g. when the widget is read-only or the user has dismissed
   * globally).
   * @default true
   */
  isEnabled?: boolean;
}

export interface UseKeyboardHintReturn {
  /**
   * The popover hint element to render inside your component tree (portals to
   * top layer via `popover="manual"`). Render unconditionally — it manages its
   * own visibility.
   */
  hintElement: ReactNode;

  /**
   * Attach to the composite container's `onFocus`. Shows the hint on the first
   * keyboard-focus (`:focus-visible`) entry from outside.
   */
  onFocus: (e: React.FocusEvent) => void;

  /**
   * Attach to the composite container's `onBlur`. Hides the hint when focus
   * leaves the composite entirely.
   */
  onBlur: (e: React.FocusEvent) => void;

  /**
   * Attach to the composite container's `onKeyDown`. Dismisses the hint on the
   * first arrow press (the user discovered the interaction).
   */
  onKeyDown: (e: React.KeyboardEvent) => void;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const ARROW_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

const ARROW_HINT_KEYS: Record<
  KeyboardHintOrientation,
  ReadonlyArray<string>
> = {
  horizontal: ['left', 'right'],
  vertical: ['up', 'down'],
  both: ['left', 'right', 'up', 'down'],
};

const styles = {
  hint: cn(
    // Top layer + anchor positioned
    'fixed inset-auto m-0 [border-width:0] [border-style:none]',
    // Surface
    'bg-(--color-background-popover) rounded-(--radius-element) [box-shadow:var(--shadow-low)]',
    'pbs-(--spacing-1) pbe-(--spacing-1) ps-(--spacing-2) pe-(--spacing-2)',
    // Typography
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-secondary) whitespace-nowrap',
    // Animation
    'opacity-0 [&:popover-open]:opacity-100',
    '[transition-property:opacity,display,overlay] [transition-duration:150ms] [transition-behavior:allow-discrete]',
    // Don't capture pointer events (hint floats above content)
    'pointer-events-none',
  ),
  keys: 'inline-flex items-center gap-(--spacing-1)',
  label: 'ms-(--spacing-1)',
} as const;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Shows an ephemeral visual hint ("← → to navigate") anchored to the focused
 * item when a composite widget first receives keyboard focus. Teaches sighted
 * keyboard users that arrows navigate within the group.
 *
 * The hint renders in the top layer (popover="manual") and is CSS-anchor-
 * positioned to the currently focused element, so it is never clipped by
 * overflow containers. It auto-dismisses on first arrow press, timeout, or
 * blur, and does not re-show for that instance.
 *
 * @example
 * ```
 * const hint = useKeyboardHint({orientation: 'horizontal'});
 * <div role="toolbar" onFocus={hint.onFocus} onBlur={hint.onBlur} onKeyDown={hint.onKeyDown}>
 *   {children}
 *   {hint.hintElement}
 * </div>
 * ```
 */
export function useKeyboardHint(
  options: UseKeyboardHintOptions = {},
): UseKeyboardHintReturn {
  const {
    orientation = 'horizontal',
    dismissAfterMs = 3000,
    isEnabled = true,
  } = options;

  const t = useTranslator();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissedRef = useRef(false);
  const isVisibleRef = useRef(false);
  const layerAnchorRef = useRef<(el: HTMLElement | null) => void>(() => {});

  const clearDismissTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleLayerShow = useCallback(() => {
    isVisibleRef.current = true;
  }, []);

  const handleLayerHide = useCallback(() => {
    isVisibleRef.current = false;
    clearDismissTimeout();
    layerAnchorRef.current(null);
  }, [clearDismissTimeout]);

  const layer = useLayer({
    mode: 'context',
    onShow: handleLayerShow,
    onHide: handleLayerHide,
  });
  layerAnchorRef.current = layer.ref;

  // Hide + mark dismissed (won't re-show for this instance)
  const dismiss = useCallback(() => {
    dismissedRef.current = true;
    clearDismissTimeout();
    layer.hide();
    isVisibleRef.current = false;
    layerAnchorRef.current(null);
  }, [clearDismissTimeout, layer]);

  // Show the layer anchored to the focused element
  const show = useCallback(
    (anchor: HTMLElement) => {
      if (dismissedRef.current || !isEnabled) {
        return;
      }

      layerAnchorRef.current(anchor);
      layer.show();

      clearDismissTimeout();
      timeoutRef.current = setTimeout(() => {
        dismiss();
      }, dismissAfterMs);
    },
    [clearDismissTimeout, dismiss, dismissAfterMs, isEnabled, layer],
  );

  // Cleanup on unmount
  useEffect(
    () => () => {
      clearDismissTimeout();
      layerAnchorRef.current(null);
    },
    [clearDismissTimeout],
  );

  // --- Handlers ---

  const onFocus = useCallback(
    (e: React.FocusEvent) => {
      if (dismissedRef.current || !isEnabled) {
        return;
      }
      // Only show on keyboard focus (focus-visible)
      const target = e.target as HTMLElement;
      if (!target.matches(':focus-visible')) {
        return;
      }
      // Only show when focus enters from outside the container
      const container = e.currentTarget as HTMLElement;
      if (
        e.relatedTarget instanceof Node &&
        container.contains(e.relatedTarget)
      ) {
        return;
      }
      show(target);
    },
    [show, isEnabled],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!isVisibleRef.current) {
        return;
      }
      const container = e.currentTarget as HTMLElement;
      // Only dismiss when focus leaves the container entirely
      if (
        e.relatedTarget instanceof Node &&
        container.contains(e.relatedTarget)
      ) {
        // Focus moved within — re-anchor to the new target
        if (!dismissedRef.current && e.relatedTarget instanceof HTMLElement) {
          layerAnchorRef.current(e.relatedTarget);
        }
        return;
      }
      dismiss();
    },
    [dismiss],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isVisibleRef.current) {
        return;
      }
      if (ARROW_KEYS.has(e.key)) {
        dismiss();
      }
    },
    [dismiss],
  );

  // --- Render the hint element ---

  const arrowContent = (
    <span className={styles.keys}>
      {ARROW_HINT_KEYS[orientation].map(key => (
        <Kbd key={key} keys={key} />
      ))}
    </span>
  );

  const hintElement = layer.render(
    <span aria-hidden="true">
      {arrowContent}
      <span className={styles.label}>
        {t('@solo.keyboardHint.toNavigate')}
      </span>
    </span>,
    {
      placement: 'below',
      alignment: 'start',
      className: styles.hint,
      style: {
        marginBlockStart: spacingVars['--spacing-2'],
      },
    },
  );

  return {hintElement, onFocus, onBlur, onKeyDown};
}
