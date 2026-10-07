'use client';

/**
 * @file TouchTimeField.tsx
 * @input Uses React, Field, BottomSheet, Wheel, DateInput touch geometry
 *   tokens, and shared time utilities
 * @output Exports TouchTimeField — the bottom-sheet surface behind TimeInput
 * @position Internal component; consumed by TimeInput.tsx for `presentation`
 *   sheet surfaces (the time half of DateTimeInput's sheet)
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/TimeInput/TimeInput.tsx
 * - /packages/core/src/TimeInput/TimeInput.doc.mjs
 * - /packages/core/src/DateTimeInput/TouchDateTimeField.tsx (wheel behavior)
 */

import {
  useCallback,
  useId,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from 'react';
import {BottomSheet} from '../BottomSheet';
import {Button} from '../Button';
import {
  Field,
  InputClearButton,
  inputWrapperStyles,
  inputStatusBorderStyles,
  inputStatusHoverShadowStyles,
  inputStatusFocusWithinStyles,
} from '../Field';
import {useInputGroup} from '../InputGroup/InputGroupContext';
import {groupStyles} from '../InputGroup/groupStyles';
import {useInputStatusIcon} from '../hooks/useInputStatusIcon';
import {useMergedRefs} from '../hooks/useMergedRefs';
import {useResolvedRequired} from '../hooks/useResolvedRequired';
import {Icon} from '../Icon';
import {useTranslator} from '../i18n';
import {useSize} from '../SizeContext/SizeContext';
import {Spinner} from '../Spinner';
import {useTooltip} from '../Tooltip';
import {Wheel, type WheelOption} from '../DateInput/Wheel';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {themeProps} from '../utils/themeProps';
import {
  clampTime,
  cn,
  formatDisplayTime12h,
  formatDisplayTime24h,
  formatISOTime,
  getInputARIA,
  isTimeInRange,
  mergeProps,
  parseISOTime,
  type ISOTimeString,
} from '../utils';
import type {TimeInputProps} from './TimeInput';

const sizeStyles = {
  sm: 'h-(--size-element-sm) min-w-[120px]',
  md: 'h-(--size-element-md) min-w-[120px]',
  lg: 'h-(--size-element-lg) min-w-[120px]',
} as const;

const styles = {
  iconButton: cn(
    'flex items-center justify-center p-0 m-0',
    '[border-width:0] [border-style:none] bg-transparent',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'shrink-0',
  ),
  input: cn(
    'block flex-1 min-w-0 [border-width:0] [border-style:none] p-0',
    'bg-transparent [outline:none]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  ),
  // Sheet chrome mirrors TouchDateTimeField: `touchSheetBody` insets (the
  // BottomSheet handle floats over the panel, so the wrapper supplies the top
  // clearance and the side/bottom insets) flattened with `touchPanel`'s column
  // layout, which is the wheels' direct parent there and spaces the footer.
  sheetBody: cn(
    'box-border flex flex-col [inline-size:100%] [min-inline-size:0] gap-(--spacing-2)',
    'px-(--spacing-4) pbs-(--spacing-6) pbe-(--spacing-4)',
  ),
  // Block size = dateInputTouchGeometry.paneBlockSize.
  wheels: cn(
    'flex [inline-size:100%] [min-inline-size:0] [block-size:calc(6*44px)]',
    'gap-(--spacing-2)',
  ),
  footer: 'flex mbs-auto pbs-(--spacing-1)',
} as const;

function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

function hour12From24(hour: number): number {
  return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
}

function hour24From12(hour: number, meridiem: number): number {
  if (meridiem === 0) {
    return hour === 12 ? 0 : hour;
  }
  return hour === 12 ? 12 : hour + 12;
}

function timeToSeconds(time: ISOTimeString | undefined): number | null {
  if (time == null) {
    return null;
  }
  const parsed = parseISOTime(time);
  return parsed == null
    ? null
    : parsed.hour * 3600 + parsed.minute * 60 + parsed.second;
}

function rangeOverlaps(
  startSecond: number,
  endSecond: number,
  min: ISOTimeString | undefined,
  max: ISOTimeString | undefined,
): boolean {
  const minSecond = timeToSeconds(min);
  const maxSecond = timeToSeconds(max);
  return (
    (minSecond == null || endSecond >= minSecond) &&
    (maxSecond == null || startSecond <= maxSecond)
  );
}

/**
 * The Solo bottom-sheet time surface: a read-only closed field that opens
 * hour/minute(/second/meridiem) wheels in a BottomSheet. Wheels commit live,
 * clamped to `min`/`max`; the footer Save button only closes the sheet.
 */
export function TouchTimeField({
  label,
  isLabelHidden = false,
  description,
  isOptional = false,
  isRequired = false,
  isDisabled = false,
  disabledMessage,
  value,
  onChange,
  changeAction,
  isLoading = false,
  min,
  max,
  hasSeconds = false,
  hasClear = false,
  hourFormat = '12h',
  placeholder: placeholderFromProps,
  size: sizeProp,
  status,
  statusVariant = 'attached',
  labelTooltip,
  width,
  className,
  style,
  ref,
}: TimeInputProps) {
  const t = useTranslator();
  const isEffectivelyRequired = useResolvedRequired({isRequired, isOptional});
  const placeholder =
    placeholderFromProps ?? t('@solo.timeInput.placeholder');
  const size = useSize(sizeProp, 'md');
  const id = useId();
  const inputLabelID = useId();
  const descriptionID = useId();
  const statusMessageID = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mergedInputRef = useMergedRefs(ref, inputRef);
  const inputGroup = useInputGroup();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isBusy = isLoading || optimisticValue !== value;
  const isEffectivelyDisabled = isDisabled || isLoading;

  const showsDisabledMessage = isDisabled && !!disabledMessage;
  const disabledMessageTooltip = useTooltip({
    placement: 'above',
    focusTrigger: 'always',
    isEnabled: showsDisabledMessage,
  });
  const {statusIcon, describedBy: statusTooltipDescribedBy} =
    useInputStatusIcon({status, statusVariant, isInGroup: !!inputGroup});
  const {ariaLabelledBy, ariaDescribedBy} = getInputARIA(
    inputLabelID,
    [
      description ? descriptionID : null,
      statusVariant !== 'tooltip' && status?.message ? statusMessageID : null,
      statusTooltipDescribedBy,
      showsDisabledMessage ? disabledMessageTooltip.describedBy : null,
    ],
    inputGroup,
  );

  const fireChange = useCallback(
    (newValue: ISOTimeString | undefined) => {
      if (isEffectivelyDisabled) {
        return;
      }
      onChange?.(newValue);
      if (changeAction) {
        startTransition(async () => {
          setOptimisticValue(newValue);
          await changeAction(newValue);
        });
      }
    },
    [changeAction, isEffectivelyDisabled, onChange, setOptimisticValue],
  );

  const formatDisplayTime =
    hourFormat === '12h' ? formatDisplayTime12h : formatDisplayTime24h;
  const displayValue = optimisticValue
    ? formatDisplayTime(optimisticValue, hasSeconds)
    : '';

  const fallbackTime = useMemo(() => {
    const now = new Date();
    return formatISOTime(
      {
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
      },
      hasSeconds,
    );
  }, [hasSeconds]);
  const parsedWheelTime = useMemo(
    () =>
      parseISOTime(optimisticValue ?? fallbackTime) ?? {
        hour: 0,
        minute: 0,
        second: 0,
      },
    [fallbackTime, optimisticValue],
  );

  const composeWheelTime = useCallback(
    (patch: {
      hour24?: number;
      hour12?: number;
      minute?: number;
      second?: number;
      meridiem?: number;
    }): ISOTimeString => {
      const meridiem = patch.meridiem ?? (parsedWheelTime.hour < 12 ? 0 : 1);
      let hour = parsedWheelTime.hour;
      if (patch.hour24 !== undefined) {
        hour = patch.hour24;
      } else if (patch.hour12 !== undefined) {
        hour = hour24From12(patch.hour12, meridiem);
      } else if (patch.meridiem !== undefined) {
        hour = hour24From12(hour12From24(hour), patch.meridiem);
      }
      return formatISOTime(
        {
          hour,
          minute: patch.minute ?? parsedWheelTime.minute,
          second: hasSeconds ? (patch.second ?? parsedWheelTime.second) : 0,
        },
        hasSeconds,
      );
    },
    [hasSeconds, parsedWheelTime],
  );

  const commitWheelTime = useCallback(
    (rawTime: ISOTimeString) => {
      const next = clampTime(rawTime, min, max, hasSeconds);
      if (next !== optimisticValue && isTimeInRange(next, min, max)) {
        fireChange(next);
      }
    },
    [fireChange, hasSeconds, max, min, optimisticValue],
  );

  const hourOptions: WheelOption[] = useMemo(() => {
    if (hourFormat === '24h') {
      return Array.from({length: 24}, (_, hour) => ({
        value: hour,
        label: twoDigits(hour),
        isDisabled: !rangeOverlaps(hour * 3600, hour * 3600 + 3599, min, max),
      }));
    }
    const meridiem = parsedWheelTime.hour < 12 ? 0 : 1;
    return Array.from({length: 12}, (_, index) => {
      const hour = index + 1;
      const hour24 = hour24From12(hour, meridiem);
      return {
        value: hour,
        label: String(hour),
        isDisabled: !rangeOverlaps(
          hour24 * 3600,
          hour24 * 3600 + 3599,
          min,
          max,
        ),
      };
    });
  }, [hourFormat, max, min, parsedWheelTime.hour]);

  const minuteOptions: WheelOption[] = useMemo(
    () =>
      Array.from({length: 60}, (_, minute) => {
        const start = parsedWheelTime.hour * 3600 + minute * 60;
        return {
          value: minute,
          label: twoDigits(minute),
          isDisabled: !rangeOverlaps(
            start,
            start + (hasSeconds ? 59 : 0),
            min,
            max,
          ),
        };
      }),
    [hasSeconds, max, min, parsedWheelTime.hour],
  );

  const secondOptions: WheelOption[] = useMemo(
    () =>
      Array.from({length: 60}, (_, second) => ({
        value: second,
        label: twoDigits(second),
        isDisabled: !isTimeInRange(
          formatISOTime(
            {
              hour: parsedWheelTime.hour,
              minute: parsedWheelTime.minute,
              second,
            },
            true,
          ),
          min,
          max,
        ),
      })),
    [max, min, parsedWheelTime.hour, parsedWheelTime.minute],
  );

  const meridiemOptions: WheelOption[] = useMemo(
    () => [
      {
        value: 0,
        label: t('@solo.dateTimeInput.meridiemAM'),
        isDisabled: !rangeOverlaps(0, 11 * 3600 + 3599, min, max),
      },
      {
        value: 1,
        label: t('@solo.dateTimeInput.meridiemPM'),
        isDisabled: !rangeOverlaps(12 * 3600, 23 * 3600 + 3599, min, max),
      },
    ],
    [max, min, t],
  );

  const openSheet = useCallback(() => {
    if (!isEffectivelyDisabled) {
      setIsSheetOpen(true);
    }
  }, [isEffectivelyDisabled]);

  const inputWrapper = (
    <div
      ref={el => {
        disabledMessageTooltip.ref(el);
      }}
      {...mergeProps(
        themeProps('time-input', {
          size,
          status: status?.type ?? null,
          disabled: isDisabled ? 'disabled' : null,
        }),
        {
          className: cn(
            inputWrapperStyles.base,
            sizeStyles[size],
            isDisabled && inputWrapperStyles.disabled,
            status && inputStatusBorderStyles[status.type],
            status && !isDisabled && inputStatusHoverShadowStyles[status.type],
            status && inputStatusFocusWithinStyles[status.type],
            inputGroup && groupStyles.inGroup,
          ),
        },
        className,
        style,
      )}>
      <button
        type="button"
        onClick={openSheet}
        disabled={isEffectivelyDisabled}
        aria-label={t('@solo.timeInput.openPicker', {label})}
        tabIndex={-1}
        className={cn(focusOutlineStyles.focusVisible, styles.iconButton)}>
        <Icon icon="clock" size="sm" color="secondary" />
      </button>
      <input
        ref={mergedInputRef}
        id={id}
        type="text"
        role="combobox"
        value={displayValue}
        readOnly
        inputMode="none"
        onChange={() => {}}
        onClick={openSheet}
        placeholder={placeholder}
        disabled={isEffectivelyDisabled && !showsDisabledMessage}
        aria-disabled={showsDisabledMessage ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        aria-required={isEffectivelyRequired ? 'true' : undefined}
        aria-invalid={status?.type === 'error' ? 'true' : undefined}
        aria-busy={isBusy || undefined}
        aria-expanded={isSheetOpen}
        aria-haspopup="dialog"
        aria-autocomplete="none"
        autoComplete="off"
        aria-labelledby={ariaLabelledBy}
        className={cn(styles.input)}
      />
      {isBusy && <Spinner size="sm" />}
      {hasClear && optimisticValue && !isEffectivelyDisabled && (
        <InputClearButton
          label={t('@solo.timeInput.clearLabel', {label})}
          onClick={() => fireChange(undefined)}
        />
      )}
      {statusIcon}
      <BottomSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        label={label}
        height="hug">
        <div className={cn(styles.sheetBody)}>
          <div className={cn(styles.wheels)}>
            <Wheel
              label={t('@solo.dateTimeInput.hourWheel')}
              options={hourOptions}
              value={
                hourFormat === '24h'
                  ? parsedWheelTime.hour
                  : hour12From24(parsedWheelTime.hour)
              }
              isActive={isSheetOpen}
              onChange={hour =>
                commitWheelTime(
                  hourFormat === '24h'
                    ? composeWheelTime({hour24: hour})
                    : composeWheelTime({hour12: hour}),
                )
              }
            />
            <Wheel
              label={t('@solo.dateTimeInput.minuteWheel')}
              options={minuteOptions}
              value={parsedWheelTime.minute}
              isActive={isSheetOpen}
              onChange={minute => commitWheelTime(composeWheelTime({minute}))}
            />
            {hasSeconds && (
              <Wheel
                label={t('@solo.dateTimeInput.secondWheel')}
                options={secondOptions}
                value={parsedWheelTime.second}
                isActive={isSheetOpen}
                onChange={second => commitWheelTime(composeWheelTime({second}))}
              />
            )}
            {hourFormat === '12h' && (
              <Wheel
                label={t('@solo.dateTimeInput.meridiemWheel')}
                options={meridiemOptions}
                value={parsedWheelTime.hour < 12 ? 0 : 1}
                isActive={isSheetOpen}
                onChange={meridiem =>
                  commitWheelTime(composeWheelTime({meridiem}))
                }
              />
            )}
          </div>
          <div className={cn(styles.footer)}>
            <Button
              variant="primary"
              size="md"
              width="100%"
              label={t('@solo.dateInput.savePicking')}
              onClick={() => setIsSheetOpen(false)}
            />
          </div>
        </div>
      </BottomSheet>
      {showsDisabledMessage &&
        disabledMessageTooltip.renderTooltip(disabledMessage)}
    </div>
  );

  if (inputGroup) {
    return inputWrapper;
  }
  return (
    <Field
      label={label}
      isLabelHidden={isLabelHidden}
      description={description}
      inputID={id}
      descriptionID={description ? descriptionID : undefined}
      isOptional={isOptional}
      isRequired={isRequired}
      isDisabled={isDisabled}
      status={
        status
          ? {
              type: status.type,
              message: status.message,
              messageID: status.message ? statusMessageID : undefined,
            }
          : undefined
      }
      statusVariant={statusVariant}
      labelTooltip={labelTooltip}
      width={width}>
      {inputWrapper}
    </Field>
  );
}

TouchTimeField.displayName = 'TouchTimeField';
