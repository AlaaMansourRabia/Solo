'use client';

/**
 * @file Dialog.tsx
 * @input Uses React, DialogHTMLAttributes, ReactNode, container (Layout), DialogContext, layerTextReset
 * @output Exports Dialog component, DialogProps, DialogVariant, DialogPurpose types
 * @position Core implementation; consumed by index.ts, tested by Dialog.test.tsx
 *
 * The standard variant treats `width` as the preferred surface width, then
 * clamps it to the dynamic viewport with spacing-token gutters so narrow
 * viewports keep content and controls on screen without changing the public API.
 * Fullscreen dialogs add safe-area protection to the default padding fallback
 * while preserving explicit prop/theme padding overrides, and fade in without
 * the centered-dialog translate/scale motion.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Dialog/Dialog.doc.mjs (props table, features, implementation notes)
 * - /packages/core/src/Dialog/Dialog.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/Dialog/index.ts (exports if types change)
 * - /apps/storybook/stories/Dialog.stories.tsx (storybook stories)
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type {BaseProps} from '../BaseProps';
import {useScrollLock} from '../hooks/useScrollLock';
import {layerTextReset} from '../Layer/layerTextReset.styles';
import {LayerContentBoundary} from '../Layer/layerScopedContext';
import {LayerDepthProvider} from '../Layer/LayerDepthContext';
import {useLayerDismissal} from '../Layer/useLayerDismissal';
import {spacingVars} from '../theme/tokenVars';
import {cn} from '../utils/cn';
import {container} from '../Layout/container.styles';
import type {SpacingToken} from '../Layout/container.styles';
import {
  paddingStyles,
  containerPaddingInlineVarStyles,
  containerPaddingBlockStartVarStyles,
  containerPaddingBlockEndVarStyles,
  spacingStepToToken,
  overlayPaddingReset,
} from '../Layout/padding.styles';
import type {SpacingStep} from '../utils/types';
import {mergeProps} from '../utils';
import {devWarn} from '../utils/devWarning';
import {DialogContext} from './DialogContext';
import {themeProps} from '../utils/themeProps';
import type {DialogVariantMap} from './index';
import {focusOutlineStyles} from '../utils/focusOutline.styles';

import {useMergedRefs} from '../hooks/useMergedRefs';
/**
 * Calculate a directional translate offset for dialog entry animation.
 * Returns a normalized vector from the trigger element toward the viewport
 * center, scaled to the given distance.
 */
function getDialogDirection(
  triggerEl: HTMLElement,
  distance = 16,
): {x: number; y: number} {
  const rect = triggerEl.getBoundingClientRect();
  const dx = rect.left + rect.width / 2 - window.innerWidth / 2;
  const dy = rect.top + rect.height / 2 - window.innerHeight / 2;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: Math.round((dx / dist) * distance),
    y: Math.round((dy / dist) * distance),
  };
}

/**
 * Dialog variant type
 * - standard: Normal dialog with configurable width/height
 * - fullscreen: Takes up the entire viewport
 *
 * Extensible via module augmentation of DialogVariantMap.
 */
export type DialogVariant = keyof DialogVariantMap;

/**
 * Dialog purpose type - controls dismissal behavior
 * - required: Mandatory flows (security, permissions) - disables all exit methods
 * - form: User forms/flows - prevents backdrop click, allows escape
 * - info: Informational flows - allows all exit methods
 */
export type DialogPurpose = 'required' | 'form' | 'info';

/** Block-axis offsets — always allowed, independent of inline direction. */
interface DialogBlockPosition {
  top?: number | string;
  bottom?: number | string;
}

/**
 * Static position for a dialog. The inline axis is logical XOR physical — the
 * type forbids mixing the two, so a single dialog can't be positioned both ways:
 * - Logical `start`/`end` map to `inset-inline-*` and mirror under RTL (preferred).
 * Block-axis `top`/`bottom` may be combined with either.
 */
export interface DialogPosition extends DialogBlockPosition {
  /** Logical inline-start offset (`inset-inline-start`); mirrors under RTL. */
  start?: number | string;
  /** Logical inline-end offset (`inset-inline-end`); mirrors under RTL. */
  end?: number | string;
}

// Keyframes `solo-dialog-enter-directional` (opacity + translate/scale from
// `--dialog-dir-x`/`--dialog-dir-y`) and `solo-dialog-enter-fullscreen`
// (opacity only) live in Dialog.css.

const dialogFullscreenSafeAreaBlockStartPadding = `var(--solo-dialog-padding-block-start, var(--solo-dialog-padding, max(${spacingVars['--spacing-4']}, env(safe-area-inset-top, 0px))))`;
const dialogFullscreenSafeAreaBlockEndPadding = `var(--solo-dialog-padding-block-end, var(--solo-dialog-padding, max(${spacingVars['--spacing-4']}, env(safe-area-inset-bottom, 0px))))`;
const dialogFullscreenSafeAreaInlineStartPaddingLtr = `var(--solo-dialog-padding-inline-start, var(--solo-dialog-padding-inline, var(--solo-dialog-padding, max(${spacingVars['--spacing-4']}, env(safe-area-inset-left, 0px)))))`;
const dialogFullscreenSafeAreaInlineStartPaddingRtl = `var(--solo-dialog-padding-inline-start, var(--solo-dialog-padding-inline, var(--solo-dialog-padding, max(${spacingVars['--spacing-4']}, env(safe-area-inset-right, 0px)))))`;
const dialogFullscreenSafeAreaInlineEndPaddingLtr = `var(--solo-dialog-padding-inline-end, var(--solo-dialog-padding-inline, var(--solo-dialog-padding, max(${spacingVars['--spacing-4']}, env(safe-area-inset-right, 0px)))))`;
const dialogFullscreenSafeAreaInlineEndPaddingRtl = `var(--solo-dialog-padding-inline-end, var(--solo-dialog-padding-inline, var(--solo-dialog-padding, max(${spacingVars['--spacing-4']}, env(safe-area-inset-left, 0px)))))`;

/** @internal Verified by Dialog.test.tsx; not re-exported from the package entry point. */
export const dialogFullscreenSafeAreaPaddingContract = {
  blockStart: dialogFullscreenSafeAreaBlockStartPadding,
  blockEnd: dialogFullscreenSafeAreaBlockEndPadding,
  inlineStart: {
    ltr: dialogFullscreenSafeAreaInlineStartPaddingLtr,
    rtl: dialogFullscreenSafeAreaInlineStartPaddingRtl,
  },
  inlineEnd: {
    ltr: dialogFullscreenSafeAreaInlineEndPaddingLtr,
    rtl: dialogFullscreenSafeAreaInlineEndPaddingRtl,
  },
} as const;

/**
 * Dialog styles using native <dialog> element
 * Uses ::backdrop pseudo-element for overlay
 */
const styles = {
  dialog: cn(
    'fixed m-auto p-0 [border-width:0] [border-style:none]',
    'bg-(--color-background-surface)',
    '[--_dialog-radius:var(--radius-container)] rounded-(--_dialog-radius)',
    '[box-shadow:var(--shadow-high)]',
    'hidden flex-col h-fit overscroll-contain opacity-0',
    '[animation-duration:var(--duration-medium-max)]',
    '[animation-timing-function:var(--ease-standard)]',
    '[animation-fill-mode:backwards]',
  ),
  // Applied via isOpen prop — avoids :where([open]) attribute selectors
  // which have zero specificity and can lose to default styles depending
  // on CSS source order in the build output.
  // Disable the entry keyframe animation under
  // `prefers-reduced-motion: reduce` so the dialog appears instantly
  // instead of translating/scaling in (same pattern as layerAnimations).
  open: cn(
    'flex opacity-100',
    '[animation-name:solo-dialog-enter-directional] motion-reduce:[animation-name:none]',
  ),
  // Backdrop using ::backdrop pseudo-element
  backdrop:
    'backdrop:bg-(--color-overlay) backdrop:[backdrop-filter:blur(2px)]',
  fullscreen:
    'w-[100dvw] h-[100dvh] max-w-[100dvw] max-h-[100dvh] rounded-none m-0 inset-0',
  fullscreenOpen:
    '[animation-name:solo-dialog-enter-fullscreen] motion-reduce:[animation-name:none]',
  // The values are dialogFullscreenSafeAreaPaddingContract, spelled out
  // (Tailwind needs literal class strings).
  fullscreenSafeArea: cn(
    'pbs-[var(--solo-dialog-padding-block-start,var(--solo-dialog-padding,max(var(--spacing-4),env(safe-area-inset-top,0px))))]',
    'pbe-[var(--solo-dialog-padding-block-end,var(--solo-dialog-padding,max(var(--spacing-4),env(safe-area-inset-bottom,0px))))]',
    'ps-[var(--solo-dialog-padding-inline-start,var(--solo-dialog-padding-inline,var(--solo-dialog-padding,max(var(--spacing-4),env(safe-area-inset-left,0px)))))]',
    '[&:is([dir=rtl]_*)]:ps-[var(--solo-dialog-padding-inline-start,var(--solo-dialog-padding-inline,var(--solo-dialog-padding,max(var(--spacing-4),env(safe-area-inset-right,0px)))))]',
    'pe-[var(--solo-dialog-padding-inline-end,var(--solo-dialog-padding-inline,var(--solo-dialog-padding,max(var(--spacing-4),env(safe-area-inset-right,0px)))))]',
    '[&:is([dir=rtl]_*)]:pe-[var(--solo-dialog-padding-inline-end,var(--solo-dialog-padding-inline,var(--solo-dialog-padding,max(var(--spacing-4),env(safe-area-inset-left,0px)))))]',
  ),
  inner:
    'flex flex-col [flex:1_1_auto] min-h-0 overflow-hidden rounded-[inherit]',
  // Inline wrapper mirrors the dialog's visual styles without <dialog> behavior
  inlineWrapper: cn(
    'p-0 [border-width:0] [border-style:none]',
    'bg-(--color-background-surface)',
    '[--_dialog-radius:var(--radius-container)] rounded-(--_dialog-radius)',
    '[box-shadow:var(--shadow-high)]',
    'flex flex-col h-fit overscroll-contain',
  ),
} as const;

const STANDARD_DIALOG_VIEWPORT_GUTTER = spacingVars['--spacing-4'];
const STANDARD_DIALOG_VIEWPORT_MAX_WIDTH = `calc(100dvw - ${STANDARD_DIALOG_VIEWPORT_GUTTER} - ${STANDARD_DIALOG_VIEWPORT_GUTTER})`;
const STANDARD_DIALOG_MAX_WIDTH = `min(100%, ${STANDARD_DIALOG_VIEWPORT_MAX_WIDTH})`;

function formatSizeValue(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

function resolveDialogSizing(
  width: number | string,
  maxHeight: number | string,
) {
  return {
    width: formatSizeValue(width),
    maxWidth: STANDARD_DIALOG_MAX_WIDTH,
    maxHeight: formatSizeValue(maxHeight),
  };
}

// Dynamic sizing and position values travel through scoped custom properties
// set inline (see sizingStyle / positionStyle), so `className` can still
// override them.
const dynamicStyles = {
  sizing:
    'w-(--_dialog-width) max-w-(--_dialog-max-width) max-h-(--_dialog-max-height)',
  // Assigns pre-resolved offsets from resolveDialogPositionOffsets() (logical
  // start/end → inset-inline-*, `auto` fallbacks).
  position:
    'm-0 top-(--_dialog-top) start-(--_dialog-inset-inline-start) end-(--_dialog-inset-inline-end) bottom-(--_dialog-bottom)',
} as const;

function sizingStyle(sizing: {
  width: string;
  maxWidth: string;
  maxHeight: string;
}): React.CSSProperties {
  return {
    '--_dialog-width': sizing.width,
    '--_dialog-max-width': sizing.maxWidth,
    '--_dialog-max-height': sizing.maxHeight,
  } as React.CSSProperties;
}

function positionStyle(position: DialogPosition): React.CSSProperties {
  const o = resolveDialogPositionOffsets(position);
  return {
    '--_dialog-top': o.top,
    '--_dialog-inset-inline-start': o.insetInlineStart,
    '--_dialog-inset-inline-end': o.insetInlineEnd,
    '--_dialog-bottom': o.bottom,
  } as React.CSSProperties;
}

/**
 * Format position value - numbers become pixels, strings pass through, undefined becomes null
 */
function formatPosition(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Map a {@link DialogPosition} to resolved CSS offsets. Logical `start`/`end`
 * become `inset-inline-*` (mirror under RTL); each unset offset falls back to
 * `auto`.
 *
 * Not re-exported from the package; internal to Dialog. Directly unit-tested
 * so the mapping is verified without a browser.
 *
 * @see DialogPosition
 */
export function resolveDialogPositionOffsets(position: DialogPosition) {
  const {top, bottom, start, end} = position;

  return {
    top: top !== undefined ? formatPosition(top) : 'auto',
    bottom: bottom !== undefined ? formatPosition(bottom) : 'auto',
    // Logical offsets mirror under RTL (preferred replacements).
    insetInlineStart: start !== undefined ? formatPosition(start) : 'auto',
    insetInlineEnd: end !== undefined ? formatPosition(end) : 'auto',
  };
}

export interface DialogProps extends BaseProps<HTMLDialogElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDialogElement>;
  /**
   * Whether the dialog is open.
   */
  isOpen: boolean;

  /**
   * Renders dialog content inline without the <dialog> element, backdrop,
   * modal behavior, or dialog-managed autofocus. Intended for documentation
   * previews and showcases only — not for production UIs. The dialog will not
   * trap focus or respond to Escape.
   * @default false
   */
  isInline?: boolean;

  /**
   * Callback fired when the dialog visibility changes.
   * Called with `false` when the dialog requests to be hidden.
   * Behavior depends on the `purpose` prop:
   * - required: Never called automatically
   * - form: Called on Escape key only
   * - info: Called on Escape key and backdrop click
   */
  onOpenChange: (isOpen: boolean) => unknown;

  /**
   * The width of the dialog.
   * Numbers are treated as pixels, strings are used as-is.
   * Ignored when variant is 'fullscreen'.
   * @default 400
   */
  width?: number | string;

  /**
   * The maximum height of the dialog.
   * The actual height will be the height of its content.
   * Numbers are treated as pixels, strings are used as-is.
   * Ignored when variant is 'fullscreen'.
   * @default '75dvh'
   */
  maxHeight?: number | string;

  /**
   * Static position for the dialog on screen.
   * By default, the dialog will be centered.
   * Ignored when variant is 'fullscreen'.
   */
  position?: Readonly<DialogPosition>;

  /**
   * The variant of the dialog.
   * - standard: Normal dialog with configurable dimensions
   * - fullscreen: Takes up the entire viewport
   * @default 'standard'
   */
  variant?: DialogVariant;

  /**
   * Configures how the dialog enables dismissals.
   * - required: Disables all exit methods (for mandatory flows)
   * - form: Prevents backdrop click, allows Escape key
   * - info: Allows all exit methods (Escape and backdrop click)
   * @default 'info'
   */
  purpose?: DialogPurpose;

  /**
   * Internal padding of the dialog using the spacing scale.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   * When omitted, uses the theme default for dialogs.
   */
  padding?: SpacingStep;

  /**
   * The content of the dialog.
   * Typically an Layout with header, content, and footer slots.
   */
  children: ReactNode;
}

/**
 * A dialog component using the native <dialog> element.
 *
 * Designed to be used with Layout as its child for structured content.
 * Uses the browser's built-in modal behavior for optimal accessibility.
 * When a DialogHeader is rendered inside, its title automatically names the
 * dialog via aria-labelledby; pass `aria-label` or `aria-labelledby` to
 * override.
 *
 * @example
 * ```
 * const [isOpen, setIsOpen] = useState(false);
 * <Dialog isOpen={isOpen} onOpenChange={open => setIsOpen(open)}>
 *   <Layout
 *     header={<DialogHeader title="Title" onOpenChange={open => setIsOpen(open)} />}
 *     content={<LayoutContent>Content</LayoutContent>}
 *     footer={<LayoutFooter hasDivider>Actions</LayoutFooter>}
 *   />
 * </Dialog>
 * ```
 */
export function Dialog({
  isOpen,
  isInline = false,
  onOpenChange,
  width = 400,
  maxHeight = '75dvh',
  position,
  variant = 'standard',
  purpose = 'info',
  padding,
  children,
  className,
  style,
  ref,
  ...props
}: DialogProps) {
  // When no explicit padding prop, use theme default (--solo-dialog-padding)
  const useThemeDefault = padding == null;
  const effectivePadding = padding ?? 4;
  const paddingToken = spacingStepToToken[effectivePadding] as SpacingToken;

  const isFullscreen = variant === 'fullscreen';
  const standardSizing = isFullscreen
    ? null
    : resolveDialogSizing(width, maxHeight);

  // Default accessible name: publish a title id through DialogContext so a
  // DialogHeader applies it to its heading (mirrors AlertDialog's explicit
  // useId wiring). Whether to emit the default aria-labelledby is decided
  // imperatively in the callback ref below by checking whether the title
  // element actually rendered — so a dialog with no header never points at a
  // missing id, and we avoid the extra render a registration-via-state effect
  // would cost at the dialog level.
  const titleId = useId();

  const dialogContextValue = useMemo(
    () => ({isInline, titleId}),
    [isInline, titleId],
  );

  // Consumer-provided labels always win over the DialogHeader default.
  const hasConsumerName =
    props['aria-label'] != null || props['aria-labelledby'] != null;

  const dialogRef = useRef<HTMLDialogElement>(null);

  // Callback ref on the <dialog>: sync the default aria-labelledby from the
  // DialogHeader title (if one rendered) in the same commit, with no second
  // render. Consumer aria-label/aria-labelledby win — when present we leave
  // the attribute to the {...safeProps} spread and never touch it here.
  const attachDialog = useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node;
      if (!node || hasConsumerName) {
        return;
      }
      const hasTitle = node.querySelector(`#${CSS.escape(titleId)}`) != null;
      if (hasTitle) {
        node.setAttribute('aria-labelledby', titleId);
      } else {
        node.removeAttribute('aria-labelledby');
      }
    },
    [titleId, hasConsumerName],
  );

  const mergedDialogRef = useMergedRefs(ref, attachDialog);

  // Capture the element that was focused when the dialog opened,
  // for directional animation origin and focus restoration on close.
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Derive dismissal behavior from purpose
  const allowEscape = purpose !== 'required';
  const allowBackdropClick = purpose === 'info';

  // Handle open/close state — skip for inline rendering
  useEffect(() => {
    if (isInline) {
      return;
    }
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen) {
      // Capture the currently focused element as the trigger — used for
      // directional animation origin and focus restoration on close.
      triggerElementRef.current = document.activeElement as HTMLElement | null;

      // Set directional CSS custom properties before opening
      const trigger = triggerElementRef.current;
      if (trigger && trigger !== document.body) {
        const dir = getDialogDirection(trigger);
        dialog.style.setProperty('--dialog-dir-x', `${dir.x}px`);
        dialog.style.setProperty('--dialog-dir-y', `${dir.y}px`);
      } else {
        dialog.style.setProperty('--dialog-dir-x', '0px');
        dialog.style.setProperty('--dialog-dir-y', '16px');
      }

      if (!dialog.open) {
        dialog.showModal();
        // React's autoFocus calls .focus() during commit, before showModal()
        // makes the dialog visible, so the focus silently fails.
        // Focus the first element with data-autofocus inside the dialog.
        const autofocusTarget =
          dialog.querySelector<HTMLElement>('[data-autofocus]');
        if (autofocusTarget) {
          autofocusTarget.focus();
        }
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
      // Return focus to the element that opened the dialog
      triggerElementRef.current?.focus();
      triggerElementRef.current = null;
    }
  }, [isOpen, isInline]);

  // Lock body scroll when dialog is open (iOS Safari workaround)
  // Skip for inline rendering — no modal overlay to compensate for.
  useScrollLock(isOpen && !isInline);

  // Join the shared layer dismissal stack. The stack owns the Escape listener
  // and routes each press to the top-most layer, so this dialog does not listen
  // itself — that is what stops a modal opened from inside another modal (or a
  // popover opened inside this one) from closing two layers on one press.
  //
  // A `required` dialog registers as `block`: it must not be dismissed, and the
  // press must not fall through and dismiss a layer behind it either.
  //
  // Inline mode opts out — it renders dialog content in normal flow, with
  // nothing layered over anything.
  const {shouldDismissOnCloseRequest} = useLayerDismissal({
    isActive: isOpen,
    isEnabled: !isInline,
    escapeBehavior: allowEscape ? 'close' : 'block',
    onDismiss: () => {
      onOpenChange(false);
    },
  });

  // Dev-time guardrail: an open modal should always have an accessible name.
  // The header-title check reads the DOM, so this stays in an effect; the ref
  // keeps it to one warning per component instance.
  const warnedUnnamedDialogRef = useRef(false);
  useEffect(() => {
    const hasHeaderTitle =
      dialogRef.current?.querySelector(`#${CSS.escape(titleId)}`) != null;
    if (
      isOpen &&
      !isInline &&
      !hasConsumerName &&
      !hasHeaderTitle &&
      !warnedUnnamedDialogRef.current
    ) {
      warnedUnnamedDialogRef.current = true;
      devWarn(
        'Dialog',
        'open dialog has no accessible name. Add a DialogHeader ' +
          'with a `title`, or pass `aria-label`/`aria-labelledby`.',
      );
    }
  }, [isOpen, isInline, hasConsumerName, titleId]);

  // Handle backdrop click — when the user clicks the ::backdrop pseudo-element,
  // the event target is the <dialog> element itself; clicks on child content
  // always target the child. This avoids false positives from native browser
  // popups (date pickers, selects, color pickers) that render outside the
  // dialog's bounding rect.
  const handleClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget && allowBackdropClick) {
      onOpenChange(false);
    }
  };

  // The native `cancel` event is the browser's own close-watcher firing: an
  // Android back gesture, or a close request the stack never saw a press for.
  // Escape presses the stack owns never arrive here — it preventDefault()s
  // those, which suppresses the close watcher.
  //
  // Always preventDefault so the browser cannot close a controlled <dialog>
  // behind React's back, then answer the request with the stack's own rules:
  // only the top-most layer dismisses, a `required` dialog swallows it, and
  // nothing dismisses while an IME composition is in progress.
  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    if (!shouldDismissOnCloseRequest()) {
      return;
    }
    if (allowEscape) {
      onOpenChange(false);
    }
  };

  const innerContainer = container(
    useThemeDefault
      ? {
          useThemeDefault: 'dialog',
          maxHeight: standardSizing?.maxHeight,
        }
      : {
          paddingInnerX: paddingToken,
          paddingInnerY: paddingToken,
          paddingOuterX: paddingToken,
          paddingOuterY: paddingToken,
          maxHeight: standardSizing?.maxHeight,
        },
  );
  const innerContent = (
    <div
      className={cn(
        styles.inner,
        innerContainer.className,
        !useThemeDefault &&
          effectivePadding !== 4 &&
          paddingStyles[effectivePadding],
        !useThemeDefault &&
          effectivePadding !== 4 &&
          containerPaddingInlineVarStyles[effectivePadding],
        !useThemeDefault &&
          effectivePadding !== 4 &&
          containerPaddingBlockStartVarStyles[effectivePadding],
        !useThemeDefault &&
          effectivePadding !== 4 &&
          containerPaddingBlockEndVarStyles[effectivePadding],
        isFullscreen && useThemeDefault && styles.fullscreenSafeArea,
      )}
      style={innerContainer.style}>
      <DialogContext value={dialogContextValue}>{children}</DialogContext>
    </div>
  );

  // Filter out native open to prevent InvalidStateError when accidentally passed
  const hasPosition = position != null && !isFullscreen;
  const {open: _open, ...safeProps} = props as Record<string, unknown>;

  // --- Inline rendering path (for documentation previews) ---
  if (isInline) {
    if (!isOpen) {
      return null;
    }

    return (
      <div
        {...safeProps}
        {...mergeProps(
          themeProps('dialog', {variant}),
          {
            className: cn(
              layerTextReset.reset,
              styles.inlineWrapper,
              overlayPaddingReset.reset,
              standardSizing && dynamicStyles.sizing,
              isFullscreen && styles.fullscreen,
            ),
            style: standardSizing ? sizingStyle(standardSizing) : undefined,
          },
          className,
          style,
        )}
        data-testid={
          (props as Record<string, unknown>)['data-testid'] as
            string | undefined
        }>
        <LayerDepthProvider>
          <LayerContentBoundary>{innerContent}</LayerContentBoundary>
        </LayerDepthProvider>
      </div>
    );
  }

  // --- Standard modal rendering path ---

  return (
    <dialog
      ref={mergedDialogRef}
      {...safeProps}
      {...mergeProps(
        themeProps('dialog', {variant}),
        {
          className: cn(
            focusOutlineStyles.focusVisible,
            layerTextReset.reset,
            styles.dialog,
            overlayPaddingReset.reset,
            isOpen && styles.open,
            styles.backdrop,
            standardSizing && dynamicStyles.sizing,
            hasPosition && dynamicStyles.position,
            isFullscreen && styles.fullscreen,
            isFullscreen && isOpen && styles.fullscreenOpen,
          ),
          style:
            standardSizing || hasPosition
              ? {
                  ...(standardSizing ? sizingStyle(standardSizing) : null),
                  ...(hasPosition ? positionStyle(position) : null),
                }
              : undefined,
        },
        className,
        style,
      )}
      onClick={handleClick}
      onCancel={handleCancel}
      aria-modal="true"
      // The default aria-labelledby (from a DialogHeader title) is set
      // imperatively in `attachDialog`; a consumer-provided aria-labelledby
      // flows through {...safeProps} above and wins.
      {...(purpose === 'required' ? {role: 'alertdialog'} : undefined)}>
      <LayerDepthProvider>
        <LayerContentBoundary>{innerContent}</LayerContentBoundary>
      </LayerDepthProvider>
    </dialog>
  );
}

Dialog.displayName = 'Dialog';
