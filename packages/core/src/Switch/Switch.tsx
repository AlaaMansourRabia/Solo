'use client';

/**
 * @file Switch.tsx
 * @input Uses React, useId, ChangeEvent, FieldLabel, FieldStatus, IconType, InputStatus, useTooltip, i18n (useTranslator)
 * @output Exports Switch component, SwitchProps, SwitchLabelPosition, SwitchLabelSpacing
 * @position Core implementation; consumed by index.ts, tested by Switch.test.tsx
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Switch/Switch.doc.mjs (props table, features, implementation notes)
 * - /packages/core/src/Switch/Switch.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/Switch/index.ts (exports if types change)
 * - /apps/storybook/stories/Switch.stories.tsx (storybook stories)
 */

import {
  useId,
  useOptimistic,
  useTransition,
  useEffect,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
} from 'react';
import {FieldLabel} from '../Field/FieldLabel';
import {FieldStatus} from '../FieldStatus/FieldStatus';
import type {IconType} from '../Icon';
import type {InputStatus} from '../Field/types';
import {Spinner} from '../Spinner';
import {useTooltip} from '../Tooltip';
import {cn, cssLength, mergeProps, mergeRefs, rtlStyles} from '../utils';
import {switchScope} from './switch.markers.styles';
import type {BaseProps} from '../BaseProps';
import type {SizeValue} from '../utils/types';
import {themeProps} from '../utils/themeProps';
import {useAnnounce} from '../hooks/useAnnounce';
import {useResolvedRequired} from '../hooks/useResolvedRequired';
import {useTranslator} from '../i18n';

import {useMergedRefs} from '../hooks/useMergedRefs';
const wrapperSizeStyles = {
  sm: 'w-[32px] h-[20px]',
  md: 'w-[40px] h-[24px]',
} as const;

const inputSizeStyles = {
  sm: 'w-[32px] h-[20px]',
  md: 'w-[40px] h-[24px]',
} as const;

const trackSizeStyles = {
  sm: 'w-[32px] h-[20px] p-[2px]',
  md: 'w-[40px] h-[24px] p-[4px]',
} as const;

const thumbOffSizeStyles = {
  sm: 'w-[14px] h-[14px] [transform:translateX(0)]',
  md: 'w-[16px] h-[16px] [transform:translateX(0)]',
} as const;

const thumbOnSizeStyles = {
  // The thumb rests at the inline-start edge (flex-start, which flexbox
  // already mirrors under RTL). The on-state travel toward the inline-end
  // edge is a physical translateX, so it must flip sign under RTL — right
  // in LTR, left in RTL — so the switch mirrors per convention (Material,
  // iOS): off-thumb on the reading-start side, on-thumb on the reading-end.
  sm: 'w-[16px] h-[16px] [transform:translateX(12px)] [&:is([dir=rtl]_*)]:[transform:translateX(-12px)]',
  md: 'w-[20px] h-[20px] [transform:translateX(14px)] [&:is([dir=rtl]_*)]:[transform:translateX(-14px)]',
} as const;

// The pressed overlay, painted as a gradient layer OVER the track's and
// thumb's own fills so it composes with the on/off colors and the hover tint
// instead of replacing them. Same token Button's overlay paints with. The
// switch is a two-part control whose focusable input sits beside the track,
// so the press is read off the shared scope group (the row), the way the
// hover tint already is: pressing the input, the track or the label all
// activate the row. (`group-active/switch:`, gated on `forced-colors: none`.)

const labelWrapperSizeStyles = {
  sm: 'min-h-[20px]',
  md: 'min-h-[24px]',
} as const;

// `switchScope` ('group/switch') marks the row; descendants read its state
// through `group-hover/switch:`, `group-active/switch:` and
// `group-has-[:focus-visible]/switch:`.
const styles = {
  container: 'flex items-center gap-(--spacing-2)',
  // A hidden label is sr-only, so its wrapper is a zero-width flex item — the
  // row gap would still be painted beside the track, making the field box
  // wider than the control it contains. Matches CheckboxInput.
  containerLabelHidden: 'gap-0',
  containerSpread: 'justify-between w-full',
  statusGap: 'mt-(--spacing-2)',
  switchWrapper: 'relative flex items-center shrink-0 isolate',
  input: cn(
    'absolute top-[50%] m-0 p-0 opacity-0',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'z-1',
  ),
  inputCoarse:
    'pointer-coarse:[min-inline-size:24px] pointer-coarse:[min-block-size:24px]',
  inputDisabled: 'cursor-default',
  inputBusy: 'pointer-events-none',
  track: cn(
    'flex items-center rounded-(--radius-full)',
    '[transition-property:background-color]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
    'box-border',
    // Forced colors (Windows High Contrast) strips painted backgrounds, which
    // would leave the track invisible. A system-color border keeps the
    // control's bounds perceivable (WCAG 1.4.11).
    '[border-width:0] forced-colors:[border-width:1px]',
    '[border-style:none] forced-colors:[border-style:solid]',
    'forced-colors:[border-color:CanvasText]',
    // Pressed: the overlay rides on top of the on/off fill. Gated like the
    // hover tint so forced colors keeps its system-color track.
    '[@media_(forced-colors:_none)]:group-active/switch:[background-image:linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed))]',
  ),
  // The one ring in the system not drawn by focusOutlineStyles. The focusable
  // input is a sibling of the track, so the condition has to reach the shared
  // scope group — and a group cannot be shared across components without
  // leaking focus state from an outer one, so it cannot live in the utility.
  // The values are read from the tokens the utility reads.
  trackFocus: cn(
    '[outline:none]',
    'group-has-[:focus-visible]/switch:[outline:var(--focus-outline-width)_var(--focus-outline-style)_var(--focus-outline-color)]',
    'group-has-[:focus-visible]/switch:[outline-offset:var(--focus-outline-offset)]',
  ),
  // State-dependent colors with ancestor hover behavior
  trackOff: cn(
    '[background-color:var(--color-background-gray)]',
    // Off = empty (Canvas) track; on = Highlight track, so the two states
    // stay distinguishable under forced colors.
    'forced-colors:[background-color:Canvas]',
    // The ancestor-hover tint is a non-system color-mix, and its rule
    // outranks the plain forced-colors rule above. Left ungated it would
    // reassert on hover under forced colors, where the UA flattens the
    // color-mix back to Canvas — so the HighlightText thumb would sit on a
    // white track (white-on-white). Gating on `forced-colors: none` keeps
    // the tint out of forced colors and lets the system-color track stand.
    '[@media_(hover:_hover)_and_(forced-colors:_none)]:group-hover/switch:[background-color:color-mix(in_srgb,var(--color-background-gray),var(--color-tint-hover)_5%)]',
  ),
  trackOn: cn(
    '[background-color:var(--color-accent)]',
    'forced-colors:[background-color:Highlight]',
    // See trackOff: gate the hover tint out of forced colors so it cannot
    // flatten the Highlight track to white under the HighlightText thumb.
    '[@media_(hover:_hover)_and_(forced-colors:_none)]:group-hover/switch:[background-color:color-mix(in_srgb,var(--color-accent),var(--color-tint-hover)_15%)]',
  ),
  trackDisabled: cn(
    'opacity-50',
    // Opacity dimming does not survive forced colors; GrayText is the
    // platform's disabled affordance there.
    'forced-colors:[border-color:GrayText]',
  ),
  // Replaces the on/off fill in every condition, so the
  // forced-colors and hover arms are restated with the same value.
  trackDisabledOff: cn(
    '[background-color:var(--color-background-gray)]',
    'forced-colors:[background-color:var(--color-background-gray)]',
    '[@media_(hover:_hover)_and_(forced-colors:_none)]:group-hover/switch:[background-color:var(--color-background-gray)]',
  ),
  thumb: cn(
    'flex items-center justify-center rounded-(--radius-full)',
    '[transition-property:transform,width,height]',
    '[transition-duration:var(--duration-fast)] motion-reduce:[transition-duration:0s]',
    '[transition-timing-function:var(--ease-standard)]',
    // Pressed: the same overlay as the track, so the whole control darkens
    // under the finger rather than the thumb standing out against a darker
    // track.
    '[@media_(forced-colors:_none)]:group-active/switch:[background-image:linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed))]',
  ),
  // The thumb fill lives on the on/off styles (not the shared thumb style)
  // because forced colors needs a per-state system color: CanvasText on the
  // empty off track, HighlightText on the Highlight on track. Sizing stays in
  // thumbOffSizeStyles/thumbOnSizeStyles; only the fill is state-dependent.
  thumbOff:
    '[background-color:var(--color-background-surface)] forced-colors:[background-color:CanvasText]',
  thumbOn:
    '[background-color:var(--color-background-surface)] forced-colors:[background-color:HighlightText]',
  labelWrapper: 'flex flex-col justify-center',
  description:
    'font-(family-name:--font-family-body) text-(length:--text-supporting-size) text-(--color-text-secondary)',
  // Dynamic field width (number -> px, string used as-is), routed through a
  // custom property so `className` can still override it.
  width: 'w-(--_switch-width)',
} as const;

export type SwitchLabelPosition = 'start' | 'end';

export type SwitchLabelSpacing = 'hug' | 'spread';

export interface SwitchProps extends Omit<BaseProps, 'onChange'> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLInputElement>;
  /**
   * Label text for the switch (always rendered for accessibility).
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
   * Callback fired when the switch state changes.
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
   * Whether the switch is in a loading state.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Whether the switch is on or off.
   */
  value: boolean;
  /**
   * Whether the switch is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * The HTML name attribute for the underlying checkbox input.
   * Useful for form submissions.
   */
  htmlName?: string;

  /**
   * Explains why the switch is disabled. When set together with `isDisabled`,
   * the switch shows a tooltip with this text on hover and keyboard focus, and
   * the control stays focusable (via `aria-disabled`) so the reason is
   * discoverable by keyboard and assistive technology. Activation stays
   * blocked.
   *
   * Use this instead of wrapping a disabled switch in `Tooltip` — disabled
   * controls don't emit the pointer events an external tooltip needs.
   *
   * @example
   * ```
   * <Switch
   *   label="Enable notifications"
   *   value={enabled}
   *   isDisabled
   *   disabledMessage="Notifications are turned off org-wide"
   * />
   * ```
   */
  disabledMessage?: string;
  /**
   * Whether the field is optional. Mutually exclusive with isRequired.
   * @default false
   */
  isOptional?: boolean;
  /**
   * Whether the switch is required. Mutually exclusive with isOptional.
   * @default false
   */
  isRequired?: boolean;
  /**
   * Callback fired when the switch receives focus.
   */
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback fired when the switch loses focus.
   */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  /**
   * Icon to display before the label text.
   */
  labelIcon?: ReactNode | IconType;
  /**
   * Width of the field. Numbers are treated as pixels, strings are used as-is
   * (e.g. `'100%'`). Sizes the whole field (label, control, and status) so they
   * stay aligned, unlike setting width via `className`/`style`.
   */
  width?: SizeValue;
  /**
   * Tooltip text to display in an info icon at the end of the label.
   */
  labelTooltip?: string;
  /**
   * Which side of the switch the label appears on.
   * - 'start': Label appears before the switch
   * - 'end': Label appears after the switch
   * @default 'end'
   */
  labelPosition?: SwitchLabelPosition;
  /**
   * Spacing behavior between label and switch.
   * - 'hug': Label and switch are positioned next to each other
   * - 'spread': Label and switch are pushed to opposite ends
   * @default 'hug'
   */
  labelSpacing?: SwitchLabelSpacing;
  /**
   * Status indicator for the switch.
   * When set with a message, displays a colored message box below the switch.
   */
  status?: InputStatus;
  /**
   * Size variant controlling track and thumb dimensions.
   * - 'sm': 34x20px (matches sm checkbox/radio vertical rhythm)
   * - 'md': 40x24px (default, matches md checkbox/radio vertical rhythm)
   * @default 'md'
   */
  size?: 'sm' | 'md';
}

/**
 * A toggle switch component for boolean values.
 *
 * @example
 * ```
 * <Switch
 *   label="Enable notifications"
 *   value={enabled}
 *   onChange={setEnabled}
 * />
 * <Switch
 *   label="Dark mode"
 *   description="Switch to a darker color scheme"
 *   value={darkMode}
 *   onChange={setDarkMode}
 * />
 * ```
 */
export function Switch({
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
  isOptional = false,
  isRequired = false,
  onFocus,
  onBlur,
  labelIcon,
  labelTooltip,
  labelPosition = 'end',
  labelSpacing = 'hug',
  status,
  size = 'md',
  width,
  className,
  style,
  ref,
  ...rest
}: SwitchProps) {
  const t = useTranslator();
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

  const announce = useAnnounce();
  useEffect(() => {
    if (isBusy) {
      announce(t('@solo.switch.loading'));
    }
  }, [announce, isBusy, t]);

  const isOn = optimisticValue === true;

  // Disabled-reason tooltip. Disabled controls swallow pointer events, so the
  // tooltip listeners attach to the switch row (which already exists) and the
  // native checkbox stays perceivable via aria-disabled instead of the disabled
  // attribute. Toggling is blocked by the isDisabled guard in onChange.
  const showsDisabledMessage = isDisabled && !!disabledMessage;
  const disabledMessageTooltip = useTooltip({
    placement: 'above',
    // The container row is not naturally focusable; focusin bubbles up from the
    // native input, so always attach focus listeners.
    focusTrigger: 'always',
    isEnabled: showsDisabledMessage,
  });

  // Build aria-describedby from description and status message
  // Only include descriptionID when the element actually renders.
  // FieldLabel renders the description (with descriptionID) even when the
  // label is visually hidden — it's sr-only, so keep it linked.
  const describedByParts: string[] = [];
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

  const switchElement = (
    <div className={cn(styles.switchWrapper, wrapperSizeStyles[size])}>
      <input
        ref={useMergedRefs(ref, disabledMessageTooltip.positionRef)}
        id={id}
        type="checkbox"
        role="switch"
        // Withhold the name while disabled: with a disabledMessage the
        // input stays focusable (not natively disabled), and a disabled
        // control must not submit.
        name={isDisabled ? undefined : htmlName}
        checked={isOn}
        // With a disabledMessage the switch keeps focusability via aria-disabled
        // so the reason is focus-discoverable; toggling is still blocked by the
        // isDisabled guard in onChange below.
        disabled={isDisabled && !showsDisabledMessage}
        aria-disabled={showsDisabledMessage ? 'true' : undefined}
        form={showsDisabledMessage ? '' : undefined}
        required={isRequired}
        aria-required={isEffectivelyRequired ? 'true' : undefined}
        onChange={e => {
          if (isDisabled || isBusy) {
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
        aria-describedby={ariaDescribedBy}
        aria-invalid={status?.type === 'error' ? true : undefined}
        aria-busy={isBusy || undefined}
        className={cn(
          styles.input,
          centerInline.className,
          styles.inputCoarse,
          inputSizeStyles[size],
          isDisabled && styles.inputDisabled,
          isBusy && styles.inputBusy,
        )}
        style={centerInline.style}
      />
      <div
        aria-hidden="true"
        {...mergeProps(
          themeProps('switch', {
            checked: isOn ? 'checked' : null,
            disabled: isDisabled ? 'disabled' : null,
            size,
          }),
          {
            className: cn(
              styles.track,
              trackSizeStyles[size],
              isOn ? styles.trackOn : styles.trackOff,
              !isDisabled && styles.trackFocus,
              isDisabled && styles.trackDisabled,
              isDisabled && !isOn && styles.trackDisabledOff,
            ),
          },
        )}>
        <div
          {...mergeProps(
            themeProps('switch-thumb', {
              checked: isOn ? 'checked' : null,
              size,
            }),
            {
              className: cn(
                styles.thumb,
                isOn ? thumbOnSizeStyles[size] : thumbOffSizeStyles[size],
                isOn ? styles.thumbOn : styles.thumbOff,
              ),
            },
          )}>
          {isBusy && <Spinner size="sm" />}
        </div>
      </div>
    </div>
  );

  const labelElement = (
    <div className={cn(styles.labelWrapper, labelWrapperSizeStyles[size])}>
      <FieldLabel
        // See CheckboxInput: the control names its own label target rather
        // than the label guessing at its placement.
        {...themeProps('switch-label')}
        label={label}
        inputID={id}
        isLabelHidden={isLabelHidden}
        isDisabled={isDisabled}
        isOptional={isOptional}
        isRequired={isRequired}
        labelIcon={labelIcon}
        labelTooltip={labelTooltip}
        description={description}
        descriptionID={descriptionID}
      />
    </div>
  );

  return (
    <div
      {...mergeProps(
        themeProps('switch-field', {
          labelPosition: labelPosition !== 'end' ? labelPosition : undefined,
          labelSpacing: labelSpacing !== 'hug' ? labelSpacing : undefined,
        }),
        {
          className: cn(width != null && styles.width),
          style:
            width != null
              ? ({'--_switch-width': cssLength(width)} as React.CSSProperties)
              : undefined,
        },
        className,
        style,
      )}
      {...rest}>
      <div
        ref={el => {
          // Interaction (hover/focus) listeners for the disabled-message
          // tooltip attach to the whole row for a larger trigger target;
          // positioning anchors on the switch itself (above) so the tooltip
          // appears next to the control, not the far edge of the row.
          // Handlers are gated internally by isEnabled, so attaching
          // unconditionally is safe.
          disabledMessageTooltip.interactionRef(el);
        }}
        className={cn(
          !isDisabled && switchScope,
          styles.container,
          isLabelHidden && styles.containerLabelHidden,
          labelSpacing === 'spread' && styles.containerSpread,
        )}>
        {' '}
        {labelPosition === 'start' ? (
          <>
            {labelElement}
            {switchElement}
          </>
        ) : (
          <>
            {switchElement}
            {labelElement}
          </>
        )}
      </div>
      {status?.message && (
        <FieldStatus
          type={status.type}
          message={status.message}
          id={statusMessageID}
          variant="detached"
          className={styles.statusGap}
        />
      )}
      {showsDisabledMessage &&
        disabledMessageTooltip.renderTooltip(disabledMessage)}
    </div>
  );
}

Switch.displayName = 'Switch';
