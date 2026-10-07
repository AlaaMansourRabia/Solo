/**
 * @file nativePickerSegmentStyles.ts
 * @input Uses Solo typography, color, and radius tokens (Tailwind classes)
 * @output Exports styles shared by DateTimeInput's native date and time controls
 * @position Internal styling shared by NativeDateSegment and NativeTimeSegment
 */

import {cn} from '../utils/cn';

export const nativePickerSegmentStyles = {
  iconButton: cn(
    'flex items-center justify-center p-0 m-0',
    '[border-width:0] [border-style:none] bg-transparent',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'rounded-(--radius-element)',
  ),
  iconButtonDisabled:
    'cursor-default [&:is(:disabled,[aria-disabled=true])]:cursor-default',
  input: cn(
    'block flex-1 min-w-0 [border-width:0] [border-style:none] p-0',
    'font-(family-name:--font-family-body)',
    // Below 16px iOS zooms the page when the field takes focus. Only iOS
    // WebKit implements -webkit-touch-callout, so the coarse-pointer floor is
    // keyed to iOS alone.
    'text-(length:--text-body-size)',
    'pointer-coarse:supports-[-webkit-touch-callout:none]:text-[length:max(1rem,var(--text-body-size))]',
    'leading-(--text-body-leading)',
    'text-(--color-text-primary) bg-transparent [outline:none]',
    // Native date/time controls size from their internal edit fields. Pin the
    // box to one text line so both segments stay aligned. The calc fallback
    // mirrors the iOS-only floor above; browsers with `1lh` track it for free.
    '[height:calc(var(--text-body-size)*var(--text-body-leading))] supports-[height:1lh]:[height:1lh]',
    'pointer-coarse:supports-[-webkit-touch-callout:none]:[height:calc(max(1rem,var(--text-body-size))*var(--text-body-leading))]',
    'pointer-coarse:supports-[-webkit-touch-callout:none]:supports-[height:1lh]:[height:1lh]',
    '[-webkit-appearance:none] appearance-none',
    // DateTimeInput renders its own calendar/clock affordances.
    '[&::-webkit-calendar-picker-indicator]:hidden',
    '[&::-webkit-date-and-time-value]:text-start',
    '[&::-webkit-date-and-time-value]:my-0 [&::-webkit-date-and-time-value]:mx-0',
    '[&::-webkit-date-and-time-value]:py-0 [&::-webkit-date-and-time-value]:px-0',
    '[&::-webkit-date-and-time-value]:[line-height:inherit] [&::-webkit-date-and-time-value]:min-h-0',
    '[&::-webkit-datetime-edit]:py-0 [&::-webkit-datetime-edit]:px-0',
    '[&::-webkit-datetime-edit]:[line-height:inherit]',
  ),
  inputDisabled: 'cursor-default',
  inputInvalid: 'text-(--color-text-secondary)',
  inputTextHidden: 'text-transparent [-webkit-text-fill-color:transparent]',
  slot: 'relative flex items-center flex-1 [min-inline-size:0]',
  overlay: cn(
    'absolute start-[0] end-[0] inset-y-0 block',
    // The same iOS-only floor as the input it covers, shared baselines.
    'text-(length:--text-body-size)',
    'pointer-coarse:supports-[-webkit-touch-callout:none]:text-[length:max(1rem,var(--text-body-size))]',
    'leading-(--text-body-leading)',
    'pointer-events-none overflow-hidden whitespace-nowrap text-ellipsis',
  ),
  overlayValue: 'text-(--color-text-primary)',
  overlayPlaceholder: 'text-(--color-text-secondary)',
} as const;
