'use client';

/**
 * @file Toast.tsx
 * @input Uses React timers, touch/pen gesture events, Toast options, Button/Icon,
 *   MediaTheme, tokens, and placement motion inherited from ToastViewport
 * @output Exports the rendered Toast surface and its pause/swipe/dismiss behavior
 * @position Core implementation; rendered by ToastViewport and documented by Toast.doc.mjs
 *
 * SYNC: When Toast layout, timer pause, media theme, or dismissal behavior changes,
 *   update these files to stay in sync:
 * - /packages/core/src/Toast/ToastViewport.test.tsx
 * - /packages/core/src/Toast/Toast.doc.mjs
 * - /apps/storybook/stories/Toast.stories.tsx
 */

import {useCallback, useEffect, useRef} from 'react';
import type {ReactNode} from 'react';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {INTERACTIVE_SELECTORS} from '../hooks/useClickableContainer';
import {useTheme} from '../theme';
import {MediaTheme} from '../theme/MediaTheme';
import type {
  ToastType,
  ToastDismissReason,
  ToastContentRenderFn,
} from './types';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';
import {useToastGesture, type ToastGestureDirection} from './useToastGesture';

const SWIPE_INTERACTIVE_TARGET_SELECTOR = `${INTERACTIVE_SELECTORS},[tabindex],[contenteditable]:not([contenteditable="false"])`;

function isInteractiveTarget(
  target: EventTarget | null,
  root: HTMLElement,
): boolean {
  if (!(target instanceof Element)) {
    return false;
  }
  let current: Element | null = target;
  while (current != null && current !== root && current !== document.body) {
    if (current.matches(SWIPE_INTERACTIVE_TARGET_SELECTOR)) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

// The edge drift is --spacing-2. Body type reads the body type-scale tokens
// (the values the `typeScaleDefaults` references resolve to).
const styles = {
  root: cn(
    'py-(--spacing-4) px-(--spacing-4) rounded-(--radius-container)',
    'box-border w-[400px] max-w-full [box-shadow:var(--shadow-med)]',
    'opacity-[var(--_toast-swipe-opacity,1)]',
    'font-(family-name:--font-family-body)',
    'text-(length:--text-body-size) leading-(--text-body-leading)',
    '[transform:translateY(var(--_toast-swipe-y,0px))_scale(var(--_toast-swipe-scale,1))]',
    '[transition-property:opacity,transform]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0.01ms]',
    '[transition-timing-function:var(--ease-standard)]',
    'starting:opacity-0',
    'starting:[transform:translateY(var(--_toast-slide-y,var(--spacing-2)))]',
  ),
  variantDefault: 'bg-(--color-background-inverted)',

  inner: 'flex items-start flex-nowrap gap-(--spacing-3) w-full',
  variantError: 'bg-(--color-background-error-inverted)',
  content: 'flex-1 min-w-0 [overflow-wrap:anywhere]',
  exiting: cn(
    'opacity-0',
    '[transform:translateY(var(--_toast-swipe-exit-y,var(--_toast-swipe-y,var(--_toast-slide-y,var(--spacing-2)))))_scale(var(--_toast-swipe-scale,1))]',
  ),
  endContent: cn(
    'shrink-0 flex items-center gap-(--spacing-2)',
    // Keep every trailing control centered on the first 20px body line, even
    // when the body wraps or a consumer supplies a control taller than the
    // built-in 28px dismiss button. The action label should still stay short;
    // the wrappers above let it break rather than widen the Toast.
    '[block-size:calc(var(--text-body-size)*var(--text-body-leading))]',
    'me-[calc(var(--spacing-1)*-1)]',
  ),
} as const;

export interface ToastProps {
  type: ToastType;
  body: ReactNode;
  endContent?: ReactNode;
  isAutoHide: boolean;
  autoHideDuration: number;
  isExiting?: boolean;
  onDismiss: (reason: ToastDismissReason) => void;
  /**
   * Replaces the content of this toast's card with your own layout. Direct
   * `Toast` renders use the same contract as `ToastOptions.renderContent`;
   * apps normally set it per toast in the options passed to `useToast()`.
   */
  renderContent?: ToastContentRenderFn;
}

interface ToastSurfaceProps extends ToastProps {
  gestureDirection: ToastGestureDirection;
}

/**
 * Individual toast notification.
 *
 * Renders with inverted surface colors for the default variant,
 * and error-inverted for the error variant. Applies MediaTheme for that
 * surface, unless the painted colors make the chosen side unreadable —
 * a theme is free to define an "inverted" background that is not.
 * Pauses auto-dismiss on hover and focus.
 *
 * @example
 * ```
 * <Toast
 *   type="info"
 *   body="Saved successfully"
 *   isAutoHide={true}
 *   autoHideDuration={5000}
 *   onDismiss={(reason) => removeToast(id, reason)}
 * />
 * ```
 */
export function Toast(props: ToastProps) {
  return <ToastSurface {...props} gestureDirection={1} />;
}

export function ToastSurface({
  type,
  body,
  endContent,
  isAutoHide,
  autoHideDuration,
  isExiting = false,
  onDismiss,
  renderContent,
  gestureDirection,
}: ToastSurfaceProps) {
  const t = useTranslator();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);
  const remainingRef = useRef(autoHideDuration);
  // Will be initialized by startTimer when actually used
  const startTimeRef = useRef<number | null>(null);

  // Read onDismiss through a ref: the viewport re-creates it on every render
  // (another toast arriving/exiting), and a startTimer that depends on it
  // would restart — and un-pause — this toast's timer on unrelated renders.
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const startTimer = useCallback(() => {
    if (!isAutoHide || isPausedRef.current) {
      return;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismissRef.current('auto');
    }, remainingRef.current);
  }, [isAutoHide]);

  const pauseTimer = useCallback(() => {
    if (!isAutoHide || isPausedRef.current) {
      return;
    }
    isPausedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (startTimeRef.current != null) {
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 1000);
    }
  }, [isAutoHide]);

  const resumeTimer = useCallback(() => {
    if (!isAutoHide || !isPausedRef.current) {
      return;
    }
    isPausedRef.current = false;
    startTimer();
  }, [isAutoHide, startTimer]);

  useEffect(() => {
    remainingRef.current = autoHideDuration;
    startTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // startTimer's identity is stable per isAutoHide, so this runs on mount
    // and on a genuine duration change — not on unrelated viewport renders.
  }, [autoHideDuration, startTimer]);

  // Pause the auto-hide timer while the window is not focused, so a toast
  // doesn't silently expire while the user is in another window or tab.
  useEffect(() => {
    if (!isAutoHide) {
      return;
    }
    window.addEventListener('blur', pauseTimer);
    window.addEventListener('focus', resumeTimer);
    return () => {
      window.removeEventListener('blur', pauseTimer);
      window.removeEventListener('focus', resumeTimer);
    };
  }, [isAutoHide, pauseTimer, resumeTimer]);

  const isTimerPaused = useCallback(() => isPausedRef.current, []);
  const dismissFromGesture = useCallback(() => {
    onDismissRef.current('manual');
  }, []);
  const {rootRef, bindings: gestureBindings} = useToastGesture({
    direction: gestureDirection,
    enabled: !isExiting,
    canPauseTimer: isAutoHide,
    isTimerPaused,
    pauseTimer,
    resumeTimer,
    dismiss: dismissFromGesture,
    shouldIgnoreTarget: isInteractiveTarget,
  });

  const handleDismiss = useCallback(() => {
    onDismiss('manual');
  }, [onDismiss]);

  const isError = type === 'error';
  // The surface is *usually* dark in light mode and light in dark mode, but a
  // theme can define --color-background-inverted as anything — so the mode is
  // measured, not assumed. This is only the pre-measurement fallback.
  const {mode} = useTheme();
  const fallbackMediaMode = isError || mode === 'light' ? 'dark' : 'light';

  return (
    <div
      ref={rootRef}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      aria-atomic="true"
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onFocusCapture={pauseTimer}
      onBlurCapture={resumeTimer}
      {...gestureBindings}
      {...mergeProps(
        themeProps('toast', {type}),
        cn(
          styles.root,
          isError ? styles.variantError : styles.variantDefault,
          isExiting && styles.exiting,
        ),
      )}>
      <MediaTheme mode="auto" fallback={fallbackMediaMode}>
        {renderContent ? (
          renderContent({
            body,
            endContent,
            type,
            isAutoHide,
            autoHideDuration,
            dismiss: handleDismiss,
          })
        ) : (
          <div className={styles.inner}>
            <div className={styles.content}>{body}</div>

            <div className={styles.endContent}>
              {endContent}
              <Button
                variant="ghost"
                size="sm"
                icon={<Icon icon="close" size="sm" color="inherit" />}
                label={t('@solo.toast.dismiss')}
                onClick={handleDismiss}
                isIconOnly
              />
            </div>
          </div>
        )}
      </MediaTheme>
    </div>
  );
}

Toast.displayName = 'Toast';
ToastSurface.displayName = 'ToastSurface';
