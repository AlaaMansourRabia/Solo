'use client';

/**
 * @file Button.tsx
 * @input Uses React, ButtonHTMLAttributes, ReactNode, i18n (useTranslator)
 * @output Exports Button component, ButtonProps, ButtonVariant types
 * @position Core implementation; consumed by index.ts, tested by Button.test.tsx
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Button/Button.doc.mjs (props table, features, implementation notes)
 * - /packages/core/src/Button/Button.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/Button/index.ts (exports if types change)
 * - /apps/storybook/stories/Button.stories.tsx (storybook stories)
 *
 * Last synced props: label, variant, size, isDisabled, isLoading, isInterruptible, clickAction, icon, isIconOnly, width, children, tooltip, endContent, href, as, target, rel
 */

import {useRef, useTransition, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import type {Elevation, SizeValue} from '../utils/types';
import {useTooltip} from '../Tooltip/useTooltip';
import {Spinner} from '../Spinner';
import {VisuallyHidden} from '../VisuallyHidden';
import {IconDefaultSizeProvider} from '../Icon/IconDefaultSizeContext';
import {iconBoxSizeStyles, type IconSize} from '../Icon/IconSize.styles';

import {EDGE_COMP_ATTR} from '../Layout/edgeCompensation.styles';
import {useSize} from '../SizeContext/SizeContext';
import {useButtonGroup} from '../ButtonGroup/ButtonGroupContext';
import {mergeProps} from '../utils';
import {useMergedRefs} from '../hooks/useMergedRefs';
import {useLinkComponent} from '../Link/useLinkComponent';
import type {LinkComponentType} from '../Link/types';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn, cssLength} from '../utils/cn';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';
import {useTranslator} from '../i18n';
import type {ButtonVariantMap} from './index';

/**
 * Base button styles.
 *
 * `--button-focus-offset` is kept as a public themeable var (documented in
 * the Solo Button docs) even though it defaults to the shared token: a theme
 * can still tune the ring distance on buttons specifically.
 *
 * One line by construction, so a label wider than the space available has to
 * truncate: `min-w-0` / `max-w-full` let a row shrink the button and cap it at
 * its container.
 */
const styles = {
  base: cn(
    '[--button-focus-offset:var(--focus-outline-offset)]',
    'focus-visible:[outline-offset:var(--button-focus-offset)]',
    'relative inline-flex items-center justify-center',
    'gap-(--spacing-2) py-(--spacing-2) px-(--spacing-3)',
    '[border-width:0] [border-style:none]',
    'rounded-[var(--_button-radius,var(--radius-element))]',
    '[font-family:inherit] text-(length:--text-label-size) leading-(--text-label-leading) font-(number:--font-weight-medium)',
    'whitespace-nowrap min-w-0 max-w-full',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition-property:background-image,background-color,color,opacity,transform]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  pressable:
    '[transform:scale(1)] active:[&:where(:not(:disabled,[aria-disabled=true]))]:[transform:scale(0.98)]',
  inactive:
    'cursor-default [background-image:none] [transform:none] active:[transform:none]',
  disabled: 'opacity-50',
  // The variants' hover treatment already steps aside for `[aria-disabled]`;
  // `:active` still matches a press on an aria-disabled button, so that one is
  // suppressed here.
  ariaDisabled: '[background-image:none] active:[background-image:none]',
  // An icon-only button has no label to truncate: keep it square rather than
  // letting a crowded row squeeze it.
  iconOnly:
    '[--button-icon-only-aspect:1/1] [aspect-ratio:var(--button-icon-only-aspect)] px-0 py-0 shrink-0 max-w-none',
  endContentWrapper: 'inline-flex items-center [color:inherit]',
  iconWrapper: 'inline-flex items-center justify-center shrink-0',
  contentWrapper: 'contents',
  labelText: 'overflow-hidden text-ellipsis min-w-0',
  link: 'no-underline',
  // Consumer-controlled width, routed through a custom property so a
  // `className` can still override it.
  width: 'w-(--_button-width)',
} as const;

const sizeStyles = {
  sm: 'h-(--size-element-sm)',
  md: 'h-(--size-element-md)',
  lg: 'h-(--size-element-lg)',
} as const;

/**
 * Resting elevation for floating buttons (e.g. a FAB). `none` is the default
 * flat button; `low`/`med`/`high` map to the shadow token scale. 'none' stays
 * a literal so it never conflicts with a variant's background layering.
 */
const elevationStyles = {
  none: '[box-shadow:none]',
  low: '[box-shadow:var(--shadow-low)]',
  med: '[box-shadow:var(--shadow-med)]',
  high: '[box-shadow:var(--shadow-high)]',
} as const;

/**
 * Variant styles. The hover/pressed overlay is stacked on top of the base
 * color as a background-image (see interactionOverlayStyles).
 * Focus outline is shared across variants for consistent keyboard affordance.
 */
const variants = {
  primary: 'bg-(--color-accent) text-(--color-on-accent)',
  secondary: 'bg-(--color-neutral) text-(--color-text-primary)',
  ghost: 'bg-transparent text-(--color-text-primary)',
  // The ring matches the variant it rings: an accent-colored outline on a red
  // button reads as another control's focus. Only the color differs — width,
  // style and offset come from the shared outline.
  destructive:
    'bg-(--color-error) text-(--color-on-error) focus-visible:[outline-color:var(--color-error)]',
} as const;

/**
 * Button variant type derived from ButtonVariantMap.
 * Extensible via module augmentation of ButtonVariantMap.
 */
export type ButtonVariant = keyof ButtonVariantMap;

/**
 * Button size type derived from the sizeStyles map
 */
export type ButtonSize = keyof typeof sizeStyles;

const iconSizeByButtonSize = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} satisfies Record<ButtonSize, IconSize>;

export interface ButtonProps extends BaseProps<HTMLButtonElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLButtonElement>;
  /** HTML button type attribute. @default 'button' */
  type?: 'button' | 'submit' | 'reset';
  /** HTML name attribute for form submission. */
  name?: string;
  /** HTML value attribute for form submission. */
  value?: string | number | ReadonlyArray<string>;
  /** Associates the button with a form element by ID. */
  form?: string;
  /**
   * Accessible label for the button (required for accessibility).
   * Rendered as visible text by default. When `isIconOnly` is true,
   * used as aria-label instead.
   */
  label: string;
  /**
   * The visual style variant of the button.
   * @default 'secondary'
   */
  variant?: ButtonVariant;
  /**
   * The size of the button.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Resting elevation — the shadow depth the button sits at. Use for floating
   * buttons (FABs) that hover above content. `none` is the default flat button.
   * @default 'none'
   */
  elevation?: Elevation;
  /**
   * Whether the button is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the button is in a loading state. Loading prevents interaction
   * without dimming the spinner; explicit disabled states remain dimmed.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Keep the button interactive while a `clickAction` is pending. The loading
   * state still renders the spinner and `aria-busy`, but the button is not
   * disabled and the in-flight action is not deduped — so a re-click lands and
   * interrupts the previous action with a fresh one. Use for interruptible
   * actions (e.g. a toggle whose action can be re-triggered before the previous
   * one settles), not fire-once actions (submit/save/pay).
   * @default false
   */
  isInterruptible?: boolean;
  /**
   * Click handler. For async actions that should show a loading state,
   * use `clickAction` instead.
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Async click action. Shows loading state while pending.
   */
  clickAction?: (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void | Promise<void>;
  /**
   * Icon element rendered before the label text.
   */
  icon?: ReactNode;
  /**
   * When true, renders as a square icon-only button with `label` as aria-label.
   * Requires `icon` to be provided.
   * @default false
   */
  isIconOnly?: boolean;
  /**
   * Width of the button. Numbers are treated as pixels, strings are used as-is
   * (e.g. `'100%'` for a full-width button). By default the button sizes to
   * its content.
   */
  width?: SizeValue;
  /**
   * Optional visible content. When provided, rendered instead of `label` as the
   * visible text (label still serves as the accessible name via aria-label).
   */
  children?: ReactNode;
  /**
   * Content rendered after the label text (badge, icon, chevron, etc.).
   * Ignored when `isIconOnly` is true to preserve square aspect ratio.
   *
   * Wrapped in a container that inherits the button's text color,
   * so child elements match the button variant's color automatically.
   */
  endContent?: ReactNode;
  /**
   * Tooltip text shown on hover.
   */
  tooltip?: string;
  /**
   * When provided, renders the button as a link (`<a>` or custom component).
   * When the button is disabled, still renders as `<button>` regardless of href
   * (disabled links are an accessibility anti-pattern).
   */
  href?: string;
  /**
   * Custom link component to use when `href` is provided.
   * Overrides the provider-level default set by LinkProvider.
   * Useful for Next.js `<Link>` or other router-aware components.
   */
  as?: LinkComponentType;
  /**
   * HTML target attribute for the link. Only applies when `href` is provided.
   */
  target?: string;
  /**
   * HTML rel attribute for the link. Only applies when `href` is provided.
   */
  rel?: string;
}

// Keyframes `solo-button-spinner-reveal` / `solo-button-content-hide`
// live in Button.css. The delay is --duration-medium-min.
const loadingStyles = {
  hiddenContent: 'text-transparent',
  hiddenContentDelayed:
    '[animation:solo-button-content-hide_1ms_forwards] [animation-delay:var(--duration-medium-min)] motion-reduce:[animation-delay:0s]',
  spinnerOverlay: 'absolute top-0 bottom-0 start-0 end-0 grid place-items-center',
  spinnerDelayed:
    '[animation:solo-button-spinner-reveal_var(--duration-fast)_backwards] [animation-delay:var(--duration-medium-min)] motion-reduce:[animation-delay:0s]',
} as const;

/**
 * "I am the last member of the group" — the trailing end cap.
 *
 * NOT `:last-child`: several members render an invisible layer element AFTER
 * their button (a tooltip'd Button returns button + layer; DropdownMenu returns
 * trigger + popover). `useLayer` renders those inline rather than portaling
 * them, so the layer — not the button — took the `:last-child` slot and the real
 * trailing button silently kept square corners.
 *
 * Layers always carry the native `popover` attribute (useLayer.tsx), and a
 * popover is never an in-flow member — it is `display: none` until shown, then
 * promoted to the top layer. Context layers also retain an inert `<template>`
 * marker so they can re-resolve their JSX position. Neither element is a group
 * member, so "last member" is: no following element sibling besides those two
 * pieces of layer infrastructure.
 *
 * Reading it the other way round — marking the *buttons* and testing for a
 * marked sibling — is the trap: it silently reclassifies anything it doesn't
 * recognise as "not a member", so a member wrapped in a `display: contents`
 * wrapper (Tooltip, HoverCard) or a raw child would make the button BEFORE it
 * round mid-group. Ignoring known layers keeps the predicate conservative: an
 * unrecognised sibling still counts, exactly as `:last-child` did, so the worst
 * case degrades to the old behaviour instead of a wrong corner.
 *
 * The leading edge still uses `:first-child` — a member's button always precedes
 * its own layer, so the first button is genuinely `:first-child`.
 */
// IS_LAST_ITEM = ':not(:has(~ *:not([popover]):not(template):not(dialog)))',
// spelled out in each class below (Tailwind needs literal class strings).
const groupStyles = {
  horizontal: cn(
    'rounded-ss-none rounded-es-none rounded-se-none rounded-ee-none',
    'first:rounded-ss-(--radius-element) first:rounded-es-(--radius-element)',
    '[&:not(:has(~*:not([popover]):not(template):not(dialog)))]:rounded-se-(--radius-element)',
    '[&:not(:has(~*:not([popover]):not(template):not(dialog)))]:rounded-ee-(--radius-element)',
    '[border-inline-start-width:var(--border-width)] first:[border-inline-start-width:0]',
    '[border-inline-start-style:solid] first:[border-inline-start-style:none]',
    '[border-inline-start-color:var(--color-border)]',
  ),
  vertical: cn(
    'rounded-ss-none rounded-se-none rounded-es-none rounded-ee-none',
    'first:rounded-ss-(--radius-element) first:rounded-se-(--radius-element)',
    '[&:not(:has(~*:not([popover]):not(template):not(dialog)))]:rounded-es-(--radius-element)',
    '[&:not(:has(~*:not([popover]):not(template):not(dialog)))]:rounded-ee-(--radius-element)',
    '[border-block-start-width:var(--border-width)] first:[border-block-start-width:0]',
    '[border-block-start-style:solid] first:[border-block-start-style:none]',
    '[border-block-start-color:var(--color-border)]',
  ),
  onSolidHorizontal: '[border-inline-start-color:var(--color-on-accent)]',
  onSolidVertical: '[border-block-start-color:var(--color-on-accent)]',
} as const;

/**
 * A versatile button component with multiple variants.
 *
 * Styles use Solo theme tokens via Tailwind classes.
 * Wrap your app in <Theme> to apply a theme.
 * Themes can provide component-level variant overrides via theme.components.button.variants
 *
 * When `href` is provided (and the button is not disabled), renders as an `<a>`
 * element (or custom link component) with full button styling, enabling native
 * browser behaviors like right-click → open in new tab and Cmd+Click.
 *
 * @example
 * ```
 * <Button label="Click me" />
 * <Button label="Primary action" variant="primary" />
 * <Button label="Delete" variant="destructive" />
 * <Button label="Settings" icon={<GearIcon />} variant="ghost" isIconOnly />
 * <Button label="Pick emoji" icon={<span>🚀</span>} variant="ghost" size="sm" isIconOnly />
 * <Button label="Edit" icon={<PencilIcon />} />
 * <Button label="Messages" endContent={<Badge label={3} />} />
 * <Button label="Edit" icon={<PencilIcon />} endContent={<Badge label="New" />} />
 * <Button label="Sign in" variant="primary" width="100%" />
 * <Button label="Visit site" href="https://example.com" variant="primary" />
 * <Button label="Open in new tab" href="https://example.com" target="_blank" rel="noopener noreferrer" />
 * ```
 */
export function Button({
  label,
  variant = 'secondary',
  size: sizeProp,
  type = 'button',
  isDisabled = false,
  isLoading = false,
  isInterruptible = false,
  clickAction,
  icon,
  isIconOnly = false,
  width,
  elevation = 'none',
  children,
  endContent,
  tooltip,
  href,
  as,
  target,
  rel,
  className,
  style,
  ref,
  ...props
}: ButtonProps): ReactNode {
  const t = useTranslator();
  const size = useSize(sizeProp, 'md');
  const buttonGroup = useButtonGroup();

  const [isPending, startTransition] = useTransition();
  // clickAction is normally fire-once (submit/save/pay), so a same-tick
  // double-click must dedupe — which neither isPending nor useOptimistic do.
  // Hence the ref guard. Interruptible callers (e.g. ToggleButton) opt out so a
  // re-click can land and interrupt the in-flight action with a fresh one.
  const actionInFlightRef = useRef(false);
  const isLoadingState = isLoading || isPending;
  // Delay the spinner reveal for action-driven loading (clickAction's own
  // transition) so a fast action that settles within the delay does not flash
  // a spinner. Interruptible loading is delayed too, so rapid re-clicks settle
  // before any spinner shows. Explicit isLoading-only stays immediate, since
  // the consumer is deliberately showing it.
  const delaySpinner = isPending || isInterruptible;
  const groupDisabled = buttonGroup?.isDisabled ?? false;
  // When interruptible, the loading state drives the spinner and aria-busy but
  // not disabled, so clicks keep landing and can interrupt the in-flight action.
  const buttonDisabled =
    isDisabled || groupDisabled || (isLoadingState && !isInterruptible);
  // A loading button remains non-interactive, but its spinner communicates an
  // active state and must retain contrast. Only explicitly disabled controls
  // receive the visually dimmed treatment.
  const visuallyDisabled = isDisabled || groupDisabled;
  // isIconOnly prop is the source of truth for icon-only rendering.
  // When false (default), label is always rendered as visible text.

  const LinkComponent = useLinkComponent(as);

  // Render as link when href is provided and button is not disabled.
  // Disabled links are an accessibility anti-pattern — fall back to <button>.
  const renderAsLink = href != null && !buttonDisabled;

  // Use aria-disabled when tooltip is present so the button remains focusable
  // for keyboard users to reach the tooltip. Otherwise use native disabled.
  const useAriaDisabled = tooltip != null && buttonDisabled;

  // Attach tooltip behavior via the hook rather than wrapping the button in a
  // <Tooltip> element. The hook adds hover/focus triggers to the button itself,
  // so no extra DOM node is inserted — the button stays a direct child of its
  // container (no layout shift, and edge-compensation markers remain
  // discoverable through the container's direct-child `:has()` selector).
  const tooltipHook = useTooltip({
    placement: 'above',
    isEnabled: tooltip != null,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // The ref guard dedupes fire-once actions. Interruptible callers skip it so
    // a re-click while pending starts a fresh action that interrupts the prior.
    if (buttonDisabled || (actionInFlightRef.current && !isInterruptible)) {
      e.preventDefault();
      return;
    }
    props.onClick?.(e);
    if (clickAction && !e.defaultPrevented) {
      actionInFlightRef.current = true;
      startTransition(async () => {
        try {
          await clickAction(e);
        } finally {
          actionInFlightRef.current = false;
        }
      });
    }
  };

  // When aria-disabled, suppress activation keys (Enter/Space) but allow
  // other keys (Escape, arrows) to reach consumer handlers.
  const handleKeyDown = useAriaDisabled
    ? (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
        } else {
          props.onKeyDown?.(e);
        }
      }
    : undefined;

  // Ghost buttons are edge-compensatable — containers detect this attribute
  // via :has() and pull their own slot margins to align flush at edges.
  const isFlat = variant === 'ghost';
  const edgeCompAttr = isFlat ? {[EDGE_COMP_ATTR]: ''} : null;

  // Shared class names for both button and link rendering
  const sharedClassName = cn(
    focusOutlineStyles.focusVisible,
    styles.base,
    sizeStyles[size],
    isIconOnly && styles.iconOnly,
    interactionOverlayStyles.backgroundImage,
    buttonDisabled && styles.inactive,
    visuallyDisabled && styles.disabled,
    useAriaDisabled && styles.ariaDisabled,
    renderAsLink && styles.link,
    !buttonGroup && styles.pressable,
    buttonGroup &&
      (buttonGroup.orientation === 'horizontal'
        ? groupStyles.horizontal
        : groupStyles.vertical),
    buttonGroup &&
      (variant === 'primary' || variant === 'destructive') &&
      (buttonGroup.orientation === 'horizontal'
        ? groupStyles.onSolidHorizontal
        : groupStyles.onSolidVertical),
    // Standalone floating buttons only — a grouped button's elevation is
    // owned by the group.
    !buttonGroup && elevationStyles[elevation],
    width != null && styles.width,
    variants[variant],
  );
  const sharedStyle =
    width != null
      ? ({'--_button-width': cssLength(width)} as React.CSSProperties)
      : undefined;

  const sharedMergedProps = mergeProps(
    // Inside a group the group owns the surface's elevation, so the button
    // reflects the tier it actually paints rather than the prop it was handed.
    themeProps('button', {
      variant,
      size,
      elevation: buttonGroup ? 'none' : elevation,
    }),
    {className: sharedClassName, style: sharedStyle},
    className,
    style,
  );

  const iconSize = iconSizeByButtonSize[size];

  const buttonContent = (
    <>
      {isLoadingState && (
        <span
          className={cn(
            loadingStyles.spinnerOverlay,
            delaySpinner && loadingStyles.spinnerDelayed,
          )}
          aria-hidden="true">
          <Spinner size="sm" shade="inherit" />
        </span>
      )}
      <span
        className={cn(
          styles.contentWrapper,
          isLoadingState &&
            (delaySpinner
              ? loadingStyles.hiddenContentDelayed
              : loadingStyles.hiddenContent),
        )}
        aria-hidden={isLoadingState || undefined}>
        {icon && (
          <span
            className={cn(styles.iconWrapper, iconBoxSizeStyles[iconSize])}>
            <IconDefaultSizeProvider value={iconSize}>
              {icon}
            </IconDefaultSizeProvider>
          </span>
        )}
        {isIconOnly ? null : (
          <span className={styles.labelText}>{children ?? label}</span>
        )}
        {!isIconOnly && endContent && (
          <span className={styles.endContentWrapper}>{endContent}</span>
        )}
      </span>
      {/* Live region for loading state announcements */}
      <VisuallyHidden role="status" aria-live="polite">
        {isLoadingState ? t('@solo.button.loading') : ''}
      </VisuallyHidden>
    </>
  );

  // aria-label is set when:
  // 1. Icon-only mode (label is the only accessible name)
  // 2. Loading state on non-icon-only (announce the button's purpose)
  // 3. Children differ from label (children are visible, label is accessible name)
  const needsAriaLabel =
    (isIconOnly && label !== '') ||
    (isLoadingState && !isIconOnly) ||
    (children != null && children !== label);
  const ariaLabelProp = needsAriaLabel ? {'aria-label': label} : null;

  // When a tooltip is attached via the hook, point aria-describedby at the
  // tooltip content (composing with any consumer-provided value).
  const describedByProp =
    tooltip != null
      ? {
          'aria-describedby':
            [props['aria-describedby'], tooltipHook.describedBy]
              .filter(Boolean)
              .join(' ') || undefined,
        }
      : null;

  // Merge the consumer ref with the tooltip hook's trigger ref so both point at
  // the same element. useMergedRefs tolerates undefined, so this is a no-op for
  // the tooltip side when no tooltip is set.
  const mergedButtonRef = useMergedRefs(
    ref,
    tooltip != null ? tooltipHook.ref : undefined,
  );

  let element: ReactNode;

  if (renderAsLink) {
    element = (
      <LinkComponent
        ref={mergedButtonRef as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        {...sharedMergedProps}
        {...props}
        {...ariaLabelProp}
        {...describedByProp}
        {...edgeCompAttr}
        aria-busy={isLoadingState || undefined}
        onClick={handleClick}>
        {buttonContent}
      </LinkComponent>
    );
  } else {
    element = (
      <button
        ref={mergedButtonRef}
        type={type}
        disabled={useAriaDisabled ? undefined : buttonDisabled}
        {...sharedMergedProps}
        {...props}
        {...ariaLabelProp}
        {...describedByProp}
        {...edgeCompAttr}
        aria-busy={isLoadingState || undefined}
        aria-disabled={useAriaDisabled || undefined}
        onClick={handleClick}
        {...(handleKeyDown ? {onKeyDown: handleKeyDown} : null)}>
        {buttonContent}
      </button>
    );
  }

  if (tooltip) {
    return (
      <>
        {element}
        {tooltipHook.renderTooltip(tooltip)}
      </>
    );
  }

  return element;
}

Button.displayName = 'Button';
