'use client';

/**
 * @file CheckboxInput.tsx
 * @input Uses React, useId, ChangeEvent, FieldLabel, FieldStatus, IconType, InputStatus, useTooltip
 * @output Exports CheckboxInput component, CheckboxInputProps
 * @position Core implementation; consumed by index.ts, tested by CheckboxInput.test.tsx
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/CheckboxInput/CheckboxInput.doc.mjs (props table, features, implementation notes)
 * - /packages/core/src/CheckboxInput/CheckboxInput.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/CheckboxInput/index.ts (exports if types change)
 * - /apps/storybook/stories/CheckboxInput.stories.tsx (storybook stories)
 */

import {
  useId,
  useCallback,
  use,
  useOptimistic,
  useRef,
  useTransition,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
} from 'react';
import type {BaseProps} from '../BaseProps';
import type {SizeValue} from '../utils/types';
import {FieldLabel} from '../Field/FieldLabel';
import {FieldStatus} from '../FieldStatus/FieldStatus';
import type {IconType} from '../Icon';
import type {InputStatus} from '../Field/types';
import {Spinner} from '../Spinner';
import {useTooltip} from '../Tooltip';
import {cn, cssLength, mergeProps, rtlStyles} from '../utils';
import {indicatorScope} from '../Indicator/indicator.markers.styles';
import {useIndicatorFocusRing} from '../hooks/useIndicatorFocusRing';
import {useResolvedRequired} from '../hooks/useResolvedRequired';
import {useIndicator} from '../Indicator';
import {themeProps} from '../utils/themeProps';
import {CheckboxListContext} from '../CheckboxList/CheckboxListContext';

import {useMergedRefs} from '../hooks/useMergedRefs';
const styles = {
  container: 'flex items-center gap-(--spacing-2)',
  containerLabelHidden: 'gap-0',
  checkboxWrapper: 'relative flex items-center justify-center shrink-0 isolate',
  // The owner paints this layer over the resolved indicator, so a theme
  // replacement cannot accidentally drop the component's pressed contract.
  // The press reads the row's `indicatorScope` group (`group-active/indicator:`).
  indicatorPressOverlay: cn(
    "after:content-[''] after:absolute after:inset-0",
    'after:rounded-(--radius-inner) after:pointer-events-none',
    'after:bg-transparent group-active/indicator:after:bg-(--color-overlay-pressed)',
  ),
  // Holds only the indicator, so the focus ring has one unambiguous target.
  // `display: contents` adds no box of its own — the indicator keeps whatever
  // layout relationship it already had with the wrapper.
  indicatorSlot: 'contents',
  input: cn(
    'absolute top-[50%] m-0 p-0 opacity-0',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'z-1',
  ),
  inputCoarse:
    'pointer-coarse:[min-inline-size:24px] pointer-coarse:[min-block-size:24px]',
  inputDisabled: 'cursor-default',
  labelWrapper: 'flex flex-col',
  description: cn(
    'font-(family-name:--font-family-body) text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'font-(number:--font-weight-normal) text-(--color-text-secondary)',
  ),
  // Dynamic field width (number -> px, string used as-is), routed through a
  // custom property so `className` can still override it.
  width: 'w-(--_checkbox-input-width)',
} as const;

const wrapperSizeStyles = {
  sm: 'w-[20px] h-[20px]',
  md: 'w-[24px] h-[24px]',
} as const;

export type CheckboxInputSize = keyof typeof wrapperSizeStyles;

export interface CheckboxInputProps extends Omit<BaseProps, 'onChange'> {
  /** Ref forwarded to the underlying `<input>` element */
  ref?: React.Ref<HTMLInputElement>;
  /**
   * Label text for the checkbox (always rendered for accessibility).
   */
  label: string;
  /**
   * Whether to visually hide the label (still accessible to screen readers).
   * @default false
   */
  isLabelHidden?: boolean;
  /**
   * Description text displayed below the label.
   */
  description?: string;
  /**
   * Callback fired when the checkbox state changes.
   */
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Async action on change. Fires after onChange if not prevented.
   */
  changeAction?: (
    checked: boolean,
    e: ChangeEvent<HTMLInputElement>,
  ) => void | Promise<void>;
  /**
   * Whether the checkbox is in a loading state.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Whether the checkbox is checked, unchecked, or indeterminate.
   */
  value: boolean | 'indeterminate';
  /**
   * Whether the checkbox is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * The HTML name attribute for the underlying checkbox input.
   * Useful for form submissions.
   */
  htmlName?: string;
  /**
   * Explains why the checkbox is disabled. When set together with
   * `isDisabled`, the checkbox shows a tooltip with this text on hover and
   * keyboard focus, and the control stays focusable (via `aria-disabled`) so
   * the reason is discoverable by keyboard and assistive technology.
   * Activation stays blocked.
   *
   * Use this instead of wrapping a disabled checkbox in `Tooltip` — disabled
   * controls don't emit the pointer events an external tooltip needs.
   *
   * @example
   * ```
   * <CheckboxInput
   *   label="Accept terms"
   *   value={accepted}
   *   isDisabled
   *   disabledMessage="Terms are managed by your administrator"
   * />
   * ```
   */
  disabledMessage?: string;
  /**
   * Whether the checkbox is read-only.
   * Displays the current state at full opacity but prevents interaction.
   * Unlike `isDisabled`, read-only checkboxes are not visually dimmed.
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * Whether the field is optional. Mutually exclusive with isRequired.
   * @default false
   */
  isOptional?: boolean;
  /**
   * Whether the checkbox is required. Mutually exclusive with isOptional.
   * @default false
   */
  isRequired?: boolean;
  /**
   * Width of the field. Numbers are treated as pixels, strings are used as-is
   * (e.g. `'100%'`). Sizes the whole field (label, control, and status) so they
   * stay aligned, unlike setting width via `className`/`style`.
   */
  width?: SizeValue;
  /**
   * The size of the checkbox.
   * - 'sm': Compact size (28px row height)
   * - 'md': Default size (36px row height)
   * @default 'md'
   */
  size?: CheckboxInputSize;
  /**
   * Callback fired when the checkbox receives focus.
   */
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback fired when the checkbox loses focus.
   */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  /**
   * Icon to display before the label text.
   */
  labelIcon?: ReactNode | IconType;
  /**
   * Status indicator for the checkbox.
   * When set with a message, displays a colored message box below the checkbox.
   */
  status?: InputStatus;
}

/**
 * A checkbox input component for toggling boolean values.
 *
 * @example
 * ```
 * <CheckboxInput
 *   label="Accept terms"
 *   value={accepted}
 *   onChange={setAccepted}
 * />
 * <CheckboxInput
 *   label="Subscribe"
 *   description="Receive weekly updates"
 *   value={subscribed}
 *   onChange={setSubscribed}
 * />
 * ```
 */
export function CheckboxInput({
  label,
  isLabelHidden = false,
  description,
  onChange,
  changeAction,
  isLoading = false,
  value,
  isDisabled = false,
  htmlName,
  disabledMessage,
  isReadOnly = false,
  isOptional = false,
  isRequired = false,
  size = 'md',
  onFocus,
  onBlur,
  labelIcon,
  status,
  width,
  className,
  style,
  ref,
  'aria-describedby': ariaDescribedByProp,
  ...rest
}: CheckboxInputProps) {
  const id = useId();
  const descriptionID = useId();
  const statusMessageID = useId();
  // Announce the effective required state (form default included) while the
  // native `required` stays bound to the explicit `isRequired` so a layout
  // default never switches on browser validation.
  const isEffectivelyRequired = useResolvedRequired({isRequired, isOptional});

  const [, startTransition] = useTransition();
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isBusy = isLoading || optimisticValue !== value;

  // Disabled-reason tooltip. Disabled controls swallow pointer events, so the
  // tooltip listeners attach to the checkbox row (which already exists) and the
  // native checkbox stays perceivable via aria-disabled instead of the disabled
  // attribute. Value mutation is blocked by the isDisabled guard in onChange.
  const showsDisabledMessage = isDisabled && !!disabledMessage;
  // Keep the native checkbox focusable via aria-disabled either when it renders
  // its own reason tooltip, or when it sits in a CheckboxList whose whole-group
  // `disabledMessage` (shown on the group container) needs each checkbox to
  // stay keyboard-perceivable. The group signals this through context rather
  // than a public prop.
  const checkboxListContext = use(CheckboxListContext);
  const isFocusableDisabled =
    isDisabled &&
    (showsDisabledMessage ||
      (checkboxListContext?.hasDisabledMessage ?? false));
  const disabledMessageTooltip = useTooltip({
    placement: 'above',
    // The container row is not naturally focusable; focusin bubbles up from the
    // native checkbox, so always attach focus listeners.
    focusTrigger: 'always',
    isEnabled: showsDisabledMessage,
  });

  // The checkbox visual is an indicator: a theme can restyle it through the
  // canonical `checkbox-indicator` target or replace the component outright.
  const CheckboxControl = useIndicator('checkbox');
  // The ring is drawn on the indicator itself: the native input is
  // `opacity: 0`, and only the indicator's own element can shape the outline
  // to match it. See useIndicatorFocusRing.
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const {focusProps} = useIndicatorFocusRing(indicatorRef, isDisabled);

  const isIndeterminate = optimisticValue === 'indeterminate';
  const isChecked = optimisticValue === true;

  // Sync the native indeterminate DOM property (can't be set via JSX
  // attribute). On a native checkbox this is the authoritative way to expose
  // the mixed state — a separate aria-checked="mixed" would be redundant and
  // can desync from / override the native state (forms-16), so it is omitted.
  const indeterminateRef = useCallback(
    (el: HTMLInputElement | null) => {
      if (el) {
        el.indeterminate = isIndeterminate;
      }
    },
    [isIndeterminate],
  );

  // Build aria-describedby from description and status message
  // Only include descriptionID when the element actually renders.
  // FieldLabel renders the description (with descriptionID) even when the
  // label is visually hidden — it's sr-only, so keep it linked.
  // A consumer's own `aria-describedby` (CheckboxListItem points the control
  // at its visible row description) comes first, then the input's own ids —
  // the explicit attribute below would otherwise replace it via `...rest`.
  const describedByParts: string[] = [];
  if (ariaDescribedByProp) {
    describedByParts.push(ariaDescribedByProp);
  }
  if (description) {
    describedByParts.push(descriptionID);
  }
  if (status?.message) {
    describedByParts.push(statusMessageID);
  }
  if (showsDisabledMessage) {
    describedByParts.push(disabledMessageTooltip.describedBy);
  }
  const ariaDescribedBy =
    describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

  const centerInline = rtlStyles.centerInline('-50%');

  return (
    <div
      {...mergeProps(
        themeProps('checkbox-input', {size}),
        {
          className: cn(width != null && styles.width),
          style:
            width != null
              ? ({
                  '--_checkbox-input-width': cssLength(width),
                } as React.CSSProperties)
              : undefined,
        },
        className,
        style,
      )}>
      <div
        ref={el => {
          // Interaction (hover/focus) listeners for the disabled-message
          // tooltip attach to the whole row for a larger trigger target;
          // positioning anchors on the checkbox itself (below) so the tooltip
          // appears next to the control, not the far edge of the row.
          // Handlers are gated internally by isEnabled, so attaching
          // unconditionally is safe.
          disabledMessageTooltip.interactionRef(el);
        }}
        className={cn(
          // Hover and focus reach the checkbox visual through this ancestor
          // group rather than props, so the whole row drives it.
          !isDisabled && indicatorScope,
          styles.container,
          isLabelHidden && styles.containerLabelHidden,
        )}>
        <div
          className={cn(
            styles.checkboxWrapper,
            wrapperSizeStyles[size],
            !isDisabled && styles.indicatorPressOverlay,
          )}
          {...focusProps}>
          <input
            {...rest}
            ref={useMergedRefs(
              ref,
              indeterminateRef,
              disabledMessageTooltip.positionRef,
            )}
            id={id}
            type="checkbox"
            // Withhold the name while disabled: with a disabledMessage the
            // input stays focusable (not natively disabled), and a disabled
            // control must not submit.
            name={isDisabled ? undefined : htmlName}
            checked={isChecked}
            // With a disabledMessage the checkbox keeps focusability via
            // aria-disabled so the reason is focus-discoverable; toggling is
            // still blocked by the isDisabled guard in onChange below.
            disabled={isDisabled && !isFocusableDisabled}
            aria-disabled={isFocusableDisabled ? 'true' : undefined}
            form={isFocusableDisabled ? '' : undefined}
            readOnly={isReadOnly}
            required={isRequired}
            aria-required={isEffectivelyRequired ? 'true' : undefined}
            onChange={e => {
              if (isDisabled || isBusy || isReadOnly) {
                return;
              }
              const checked = e.target.checked;
              onChange?.(checked, e);
              if (changeAction && !e.defaultPrevented) {
                startTransition(async () => {
                  setOptimisticValue(checked);
                  await changeAction(checked, e);
                });
              }
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-readonly={isReadOnly || undefined}
            aria-describedby={ariaDescribedBy}
            aria-invalid={status?.type === 'error' ? true : undefined}
            aria-busy={isBusy || undefined}
            className={cn(
              styles.input,
              centerInline.className,
              styles.inputCoarse,
              wrapperSizeStyles[size],
              isDisabled && styles.inputDisabled,
            )}
            style={centerInline.style}
          />
          {/*
           * A container holding ONLY the indicator, so the focus ring has an
           * unambiguous target whatever a theme renders. `display: contents`
           * keeps it out of layout entirely.
           */}
          <span ref={indicatorRef} className={styles.indicatorSlot}>
            <CheckboxControl
              state={
                isIndeterminate
                  ? 'indeterminate'
                  : isChecked
                    ? 'checked'
                    : 'unchecked'
              }
              size={size}
              isDisabled={isDisabled}>
              {isBusy ? <Spinner size="sm" shade="inherit" /> : null}
            </CheckboxControl>
          </span>
        </div>
        <div className={styles.labelWrapper}>
          <FieldLabel
            // A checkbox's label shares a row with its control, unlike a form
            // field's label above its input. Naming the label rather than the
            // arrangement means a theme asks for the thing it wants, and the
            // component that actually knows what this is says so.
            {...themeProps('checkbox-label')}
            label={label}
            inputID={id}
            isLabelHidden={isLabelHidden}
            isDisabled={isDisabled}
            isOptional={isOptional}
            isRequired={isRequired}
            labelIcon={labelIcon}
            description={description}
            descriptionID={descriptionID}
          />
        </div>
      </div>
      {status?.message && (
        <FieldStatus
          type={status.type}
          message={status.message}
          id={statusMessageID}
          variant="detached"
        />
      )}
      {showsDisabledMessage &&
        disabledMessageTooltip.renderTooltip(disabledMessage)}
    </div>
  );
}

CheckboxInput.displayName = 'CheckboxInput';
