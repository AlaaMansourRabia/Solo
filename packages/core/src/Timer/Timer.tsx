'use client';

/**
 * @file Timer.tsx
 * @input Uses an optional start time, standardized format, Timestamp typography, BaseProps, and React ref
 * @output Exports Timer, TimerProps, and TimerFormat with non-rendering elapsed and countdown updates
 * @position Core content primitive for elapsed or remaining duration in active operations
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Timer/Timer.doc.mjs
 * - /packages/core/src/Timer/Timer.test.tsx
 * - /packages/core/src/Timer/index.ts
 * - /apps/storybook/stories/Timer.stories.tsx
 */

import {useEffect, useRef, useState} from 'react';
import type {BaseProps} from '../BaseProps';
import {useMergedRefs} from '../hooks/useMergedRefs';
import {Text} from '../Text';
import type {TextColor, TextSize, TextType, TextWeight} from '../theme/types';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = 60 * ONE_SECOND_MS;
const ONE_HOUR_SECONDS = 60 * 60;
const MAX_TIMEOUT_MS = 2_147_483_647;

const styles = {
  time: cn(
    'text-inherit inline [font-family:inherit] text-[length:inherit] not-italic',
    '[font-variant-numeric:tabular-nums] font-[number:inherit] leading-[inherit]',
  ),
} as const;

export type TimerFormat = 'elapsed' | 'clock';

type TimerPresentation = {
  dateTime: string;
  text: string;
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function resolveFormat(format: TimerFormat): TimerFormat {
  return format === 'clock' ? 'clock' : 'elapsed';
}

function getElapsedMilliseconds(now: number, startTime: number): number {
  return Math.max(0, now - startTime);
}

function getPresentation(
  elapsedMilliseconds: number,
  format: TimerFormat,
): TimerPresentation {
  const elapsedSeconds = Math.floor(elapsedMilliseconds / ONE_SECOND_MS);

  if (format === 'clock') {
    const hours = Math.floor(elapsedSeconds / ONE_HOUR_SECONDS);
    const minutes = Math.floor((elapsedSeconds % ONE_HOUR_SECONDS) / 60);
    const seconds = elapsedSeconds % 60;
    return {
      dateTime: `PT${elapsedSeconds}S`,
      text:
        hours > 0
          ? `${String(hours)}:${pad(minutes)}:${pad(seconds)}`
          : `${String(minutes)}:${pad(seconds)}`,
    };
  }

  if (elapsedSeconds < 60) {
    return {
      dateTime: `PT${elapsedSeconds}S`,
      text: `${String(elapsedSeconds)}s`,
    };
  }

  const totalMinutes = Math.floor(elapsedSeconds / 60);
  if (totalMinutes < 60) {
    return {
      dateTime: `PT${elapsedSeconds}S`,
      text: `${String(totalMinutes)}m ${pad(elapsedSeconds % 60)}s`,
    };
  }

  const representedSeconds = totalMinutes * 60;
  return {
    dateTime: `PT${representedSeconds}S`,
    text: `${String(Math.floor(totalMinutes / 60))}h ${pad(totalMinutes % 60)}m`,
  };
}

/**
 * Countdown display: remaining time rounded UP to the shown precision, so
 * "1s" stays on screen until the deadline is reached and "0s" means done.
 */
function getRemainingDisplayMilliseconds(remaining: number): number {
  return Math.ceil(remaining / ONE_SECOND_MS) * ONE_SECOND_MS;
}

function getMillisecondsUntilNextCountdownChange(
  remaining: number,
  format: TimerFormat,
): number {
  const precision =
    format === 'elapsed' && remaining > ONE_HOUR_SECONDS * ONE_SECOND_MS
      ? ONE_MINUTE_MS
      : ONE_SECOND_MS;
  return Math.min(remaining % precision || precision, MAX_TIMEOUT_MS);
}

function getMillisecondsUntilNextChange(
  now: number,
  startTime: number,
  elapsedMilliseconds: number,
  format: TimerFormat,
): number {
  if (now < startTime) {
    return Math.min(startTime - now + ONE_SECOND_MS, MAX_TIMEOUT_MS);
  }

  const precision =
    format === 'elapsed' &&
    elapsedMilliseconds >= ONE_HOUR_SECONDS * ONE_SECOND_MS
      ? ONE_MINUTE_MS
      : ONE_SECOND_MS;
  return precision - (elapsedMilliseconds % precision);
}

export interface TimerProps extends Omit<
  BaseProps<HTMLTimeElement>,
  'dateTime'
> {
  /** Ref forwarded to the rendered `<time>` element. */
  ref?: React.Ref<HTMLTimeElement>;
  /**
   * Unix time in milliseconds when the measured operation began. Omit it to
   * start counting from this Timer's mount.
   */
  startTime?: number;
  /**
   * Unix time in milliseconds to count DOWN to. When set, Timer shows the
   * time remaining until `endTime` (never below zero) instead of the time
   * elapsed since `startTime`, stops ticking at zero and calls `onComplete`.
   */
  endTime?: number;
  /** Called once when a countdown (`endTime`) reaches zero. */
  onComplete?: () => void;
  /**
   * Standard duration representation.
   * @default 'elapsed'
   */
  format?: TimerFormat;
  /**
   * Semantic text type. Matches Timestamp typography behavior.
   * @default 'supporting'
   */
  type?: TextType;
  /** Explicit font size override. Overrides the size from `type`. */
  size?: TextSize;
  /**
   * Text color.
   * @default 'secondary'
   */
  color?: TextColor;
  /** Font weight override. */
  weight?: TextWeight;
}

/**
 * Displays a live duration — time elapsed since `startTime`, or time
 * remaining until `endTime` (a countdown) — without scheduling React tick
 * renders.
 *
 * Timer writes changing text and its ISO 8601 duration directly to the owned
 * `<time>` node. Use `elapsed` for compact duration text or `clock` for a
 * stopwatch-like reading.
 *
 * @agentGuidance
 * Displays a live duration for active work without scheduling a React render on
 * every tick: the time elapsed since startTime, or — with endTime — the time
 * remaining until a deadline (a countdown). Elapsed format updates by second
 * below one hour and by minute after one hour; clock format remains
 * second-precise.
 *
 * Don't:
 * - Do not use Timer for dates, time zones, or relative calendar language; use
 *   Timestamp instead.
 * - Do not add aria-live unless hearing an announcement every tick is
 *   appropriate for the specific task.
 *
 * @example
 * ```
 * <Timer />
 * <Timer format="clock" />
 * <Timer endTime={auction.endsAt} format="clock" onComplete={closeBidding} />
 * ```
 */
export function Timer({
  startTime,
  endTime,
  onComplete,
  format = 'elapsed',
  type = 'supporting',
  size,
  color = 'secondary',
  weight,
  ref,
  className,
  style,
  ...rest
}: TimerProps) {
  const [mountTime] = useState(() => Date.now());
  const timerRef = useRef<HTMLTimeElement>(null);
  const mergedRef = useMergedRefs(ref, timerRef);
  const resolvedFormat = resolveFormat(format);
  const isCountdown = endTime !== undefined && Number.isFinite(endTime);
  const initialPresentation = getPresentation(
    isCountdown
      ? getRemainingDisplayMilliseconds(Math.max(0, endTime - mountTime))
      : 0,
    resolvedFormat,
  );
  // Latest callback without restarting the tick loop when it changes identity.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const resolvedStartTime =
      startTime !== undefined && Number.isFinite(startTime)
        ? startTime
        : mountTime;
    let timeoutID: ReturnType<typeof setTimeout> | undefined;
    let previousDateTime: string | undefined;
    let previousText: string | undefined;

    let hasCompleted = false;

    const write = (presentation: TimerPresentation) => {
      const node = timerRef.current;
      if (node != null) {
        if (presentation.text !== previousText) {
          node.textContent = presentation.text;
          previousText = presentation.text;
        }
        if (presentation.dateTime !== previousDateTime) {
          node.dateTime = presentation.dateTime;
          previousDateTime = presentation.dateTime;
        }
      }
    };

    const countdownTick = (deadline: number) => {
      const remaining = Math.max(0, deadline - Date.now());
      write(
        getPresentation(
          getRemainingDisplayMilliseconds(remaining),
          resolvedFormat,
        ),
      );
      if (remaining === 0) {
        if (!hasCompleted) {
          hasCompleted = true;
          onCompleteRef.current?.();
        }
        return;
      }
      timeoutID = setTimeout(
        () => countdownTick(deadline),
        getMillisecondsUntilNextCountdownChange(remaining, resolvedFormat),
      );
    };

    const tick = () => {
      const now = Date.now();
      const elapsedMilliseconds = getElapsedMilliseconds(
        now,
        resolvedStartTime,
      );
      write(getPresentation(elapsedMilliseconds, resolvedFormat));

      timeoutID = setTimeout(
        tick,
        getMillisecondsUntilNextChange(
          now,
          resolvedStartTime,
          elapsedMilliseconds,
          resolvedFormat,
        ),
      );
    };

    if (endTime !== undefined && Number.isFinite(endTime)) {
      countdownTick(endTime);
    } else {
      tick();
    }
    return () => {
      if (timeoutID !== undefined) {
        clearTimeout(timeoutID);
      }
    };
  }, [mountTime, resolvedFormat, startTime, endTime]);

  const timerProps = mergeProps(themeProps('timer'), {className, style});

  return (
    <Text
      type={type}
      size={size}
      color={color}
      weight={weight}
      {...timerProps}>
      <time
        {...rest}
        ref={mergedRef}
        dateTime={initialPresentation.dateTime}
        className={styles.time}>
        {initialPresentation.text}
      </time>
    </Text>
  );
}

Timer.displayName = 'Timer';
