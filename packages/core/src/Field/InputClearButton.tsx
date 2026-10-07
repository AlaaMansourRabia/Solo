'use client';

/**
 * @file InputClearButton.tsx
 * @input Uses React, Button, and Icon
 * @output Exports the public InputClearButton and an internal popup-aware variant,
 *   both with a contextual tooltip matching their required label.
 * @position Shared primitive. Every input that renders a clear affordance —
 *   TextInput, NumberInput, TimeInput, DateInput, DateTimeInput,
 *   DateRangeInput, Selector, MultiSelector, Typeahead, Tokenizer, FileInput —
 *   routes it through here, so the glyph is themed in one place via the
 *   `solo-input-clear-icon` target and the button wrapper is themed via the
 *   `solo-input-clear-button` target.
 */

import type {ReactNode} from 'react';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

const styles = {
  button: cn(
    'h-[20px] shrink-0',
    // Containing block for the ::after hit overlay below. Button sets its own
    // `position: relative`, so the overlay would resolve correctly without
    // this — but that is another component's internal, and if it ever changes
    // the overlay silently reattaches to some ancestor and the hit area lands
    // in the wrong place. Declaring it here keeps the containing block
    // colocated with the thing that depends on it. No-op at runtime.
    'relative',
    // Expand the tap target to 24px ONLY on touch (WCAG 2.5.8 AA is a touch
    // requirement, and its floor is 24x24). On a fine pointer the 20px glyph
    // is precise enough, and an unconditional overlay could overlap
    // neighboring controls in dense layouts. The inset is 0 by default (hit
    // area == visual glyph) and grows to -2px (=> 24x24) under a coarse
    // pointer — no further, because at -4px the overlay reaches into the 8px
    // adornment gap and, on the inline-start side, over the input's own caret
    // area. Driven through a custom property so the conditional lives on this
    // top-level property instead of the pseudo-element. Private (--_) because
    // it is an internal implementation detail, not a themeable target.
    '[--_input-clear-hit-inset:0px] pointer-coarse:[--_input-clear-hit-inset:-2px]',
    // The overlay itself is gated too, not just its size. An ::after that is
    // generated on a fine pointer sits exactly over the button at inset 0,
    // where it adds no hit area but is the topmost hit-test box — so hover
    // stops reaching the descendants and `.solo-input-clear-icon:hover`, a
    // public theme target, no longer matches. `content: none` means the
    // pseudo-element is not generated at all, so on a fine pointer the
    // overlay does not exist.
    "[--_input-clear-hit-content:none] pointer-coarse:[--_input-clear-hit-content:'']",
    'after:content-(--_input-clear-hit-content) after:absolute after:[inset:var(--_input-clear-hit-inset)]',
  ),
} as const;

export interface InputClearButtonProps {
  /** Contextual accessible name for the button, such as "Clear Search". */
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Extra classes for the button, merged after its own (later wins). */
  className?: string;
  /**
   * Extra class(es) for the clear glyph itself, merged onto the shared
   * `solo-input-clear-icon` target. Used by inputs that shipped a
   * component-specific clear-icon target before the family converged here
   * (e.g. `solo-date-input-clear-icon`) to keep emitting it for backwards
   * compatibility; new callers don't need it.
   */
  iconClassName?: string;
}

interface InternalInputClearButtonProps extends InputClearButtonProps {
  onPointerDown: React.PointerEventHandler<HTMLElement>;
  onClickCapture: React.MouseEventHandler<HTMLElement>;
}

type InputClearButtonRenderProps = InputClearButtonProps &
  Partial<
    Pick<InternalInputClearButtonProps, 'onPointerDown' | 'onClickCapture'>
  >;

function renderInputClearButton({
  label,
  onClick,
  onPointerDown,
  onClickCapture,
  className,
  iconClassName,
}: InputClearButtonRenderProps): ReactNode {
  const {className: iconTargetClassName} = themeProps('input-clear-icon');
  const {className: buttonTargetClassName} = themeProps('input-clear-button');
  return (
    <Button
      variant="ghost"
      size="sm"
      label={label}
      tooltip={label}
      className={cn(buttonTargetClassName, styles.button, className)}
      icon={
        <Icon
          icon="close"
          size="sm"
          color="secondary"
          className={
            iconClassName != null
              ? `${iconTargetClassName} ${iconClassName}`
              : iconTargetClassName
          }
        />
      }
      onPointerDown={e => {
        e.preventDefault();
        onPointerDown?.(e);
      }}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      onClickCapture={onClickCapture}
      isIconOnly
    />
  );
}

export function InputClearButton(props: InputClearButtonProps): ReactNode {
  return renderInputClearButton(props);
}

/** Internal variant used while popup-aware clear behavior is rolled out. */
export function InternalInputClearButton(
  props: InternalInputClearButtonProps,
): ReactNode {
  return renderInputClearButton(props);
}

InputClearButton.displayName = 'InputClearButton';
