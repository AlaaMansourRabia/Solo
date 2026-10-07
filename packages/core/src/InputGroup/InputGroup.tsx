'use client';

/**
 * @file InputGroup.tsx
 * @input Uses React, Tailwind classes, theme tokens, InputGroupContext, Field
 * @output Exports InputGroup component with group label/description ARIA wiring
 * @position Groups input with prefix/suffix addons; consumed by index.ts
 *
 * Children (TextInput, NumberInput, TimeInput, DateInput, Typeahead,
 * Selector, MultiSelector) consume the InputGroup context
 * to remove their own border/radius so the group container provides
 * the unified border treatment.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/InputGroup/InputGroup.doc.mjs
 * - /packages/core/src/InputGroup/InputGroup.test.tsx
 * - /packages/core/src/InputGroup/index.ts
 * - /apps/storybook/stories/InputGroup.stories.tsx
 */

import {useId, useMemo, type ReactNode} from 'react';
import {Field, type InputStatus} from '../Field';
import {SizeProvider, useSize} from '../SizeContext/SizeContext';
import {cn, mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {InputGroupContext} from './InputGroupContext';
import {themeProps} from '../utils/themeProps';

export type InputGroupSize = 'sm' | 'md' | 'lg';

const styles = {
  group: 'inline-flex items-stretch bg-transparent',
  disabled: 'cursor-default opacity-50',
} as const;

const sizeStyles = {
  sm: 'h-(--size-element-sm)',
  md: 'h-(--size-element-md)',
  lg: 'h-(--size-element-lg)',
} as const;

export interface InputGroupProps extends Omit<
  BaseProps<HTMLDivElement>,
  'children'
> {
  /** Ref forwarded to the group container element */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Input and addon children.
   */
  children: ReactNode;

  /**
   * Label text for the group (required for accessibility).
   */
  label: string;

  /**
   * Whether to visually hide the label.
   * @default false
   */
  isLabelHidden?: boolean;

  /**
   * Description text displayed between the label and input group.
   */
  description?: string;

  /**
   * Whether the group is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the field is optional.
   * @default false
   */
  isOptional?: boolean;

  /**
   * Whether the field is required.
   * @default false
   */
  isRequired?: boolean;

  /**
   * Default size for inputs in the group.
   * @default 'md'
   */
  size?: InputGroupSize;

  /**
   * Status indicator applied to the group border.
   */
  status?: InputStatus;

  /**
   * Tooltip text at the end of the label.
   */
  labelTooltip?: string;

  /**
   * Test ID for testing frameworks.
   */
  'data-testid'?: string;
}

/**
 * Groups an input with prefix/suffix addons in a visually connected
 * container with shared border and focus ring.
 *
 * @example
 * ```
 * <InputGroup label="Price">
 *   <InputGroupText>$</InputGroupText>
 *   <TextInput label="Price" isLabelHidden value={price} onChange={setPrice} />
 * </InputGroup>
 * ```
 */
export function InputGroup({
  children,
  label,
  isLabelHidden = false,
  description,
  isDisabled = false,
  isOptional = false,
  isRequired = false,
  size: sizeProp,
  status,
  labelTooltip,
  className,
  style,
  ref,
  'data-testid': testId,
  ...rest
}: InputGroupProps) {
  const size = useSize(sizeProp, 'md');
  const inputId = useId();
  const labelID = useId();
  const descriptionID = useId();
  const statusMessageId = useId();

  const describedByIDs =
    [
      description ? descriptionID : null,
      status?.message ? statusMessageId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  const contextValue = useMemo(
    () => ({isInGroup: true as const, labelID, describedByIDs}),
    [labelID, describedByIDs],
  );

  return (
    <InputGroupContext value={contextValue}>
      <SizeProvider value={size}>
        <Field
          label={label}
          isLabelHidden={isLabelHidden}
          description={description}
          inputID={inputId}
          labelID={labelID}
          descriptionID={description ? descriptionID : undefined}
          isGroupLabel
          isOptional={isOptional}
          isRequired={isRequired}
          isDisabled={isDisabled}
          status={
            status
              ? {
                  type: status.type,
                  message: status.message,
                  messageID: status.message ? statusMessageId : undefined,
                }
              : undefined
          }
          statusVariant="detached"
          labelTooltip={labelTooltip}>
          <div
            ref={ref}
            data-testid={testId}
            {...rest}
            role="group"
            aria-labelledby={labelID}
            aria-describedby={describedByIDs}
            {...mergeProps(
              themeProps('input-group', {
                size,
                status: status?.type ?? null,
              }),
              {
                className: cn(
                  styles.group,
                  sizeStyles[size],
                  isDisabled && styles.disabled,
                ),
              },
              className,
              style,
            )}>
            {children}
          </div>
        </Field>
      </SizeProvider>
    </InputGroupContext>
  );
}

InputGroup.displayName = 'InputGroup';
