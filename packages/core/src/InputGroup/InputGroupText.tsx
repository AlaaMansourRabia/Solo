'use client';

/**
 * @file InputGroupText.tsx
 * @input Uses React, Tailwind classes, theme tokens
 * @output Exports InputGroupText component
 * @position Text/icon element rendered inside InputGroup
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/InputGroup/InputGroup.doc.mjs
 * - /packages/core/src/InputGroup/index.ts
 */

import React, {type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {cn, mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';

const styles = {
  text: cn(
    'flex items-center px-(--spacing-2) bg-(--color-background-muted)',
    'font-(family-name:--font-family-body) text-(length:--text-body-size) leading-(--text-body-leading)',
    'text-(--color-text-secondary) whitespace-nowrap shrink-0',
    '[border-width:var(--border-width)] [border-style:solid] border-(--color-border-emphasized)',
    'ms-[calc(-1_*_var(--border-width))] first:ms-0',
    'rounded-ss-none first:rounded-ss-(--radius-element)',
    'rounded-es-none first:rounded-es-(--radius-element)',
    'rounded-se-none last:rounded-se-(--radius-element)',
    'rounded-ee-none last:rounded-ee-(--radius-element)',
  ),
} as const;

export interface InputGroupTextProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Content to render in the text slot.
   * Can be text or an icon.
   */
  children: ReactNode;
}

/**
 * A prefix or suffix text element for use inside InputGroup.
 *
 * @example
 * ```
 * <InputGroup label="URL">
 *   <InputGroupText>https://</InputGroupText>
 *   <TextInput label="URL" isLabelHidden value={url} onChange={setUrl} />
 * </InputGroup>
 * ```
 */
export function InputGroupText({
  ref,
  children,
  className,
  style,
  ...rest
}: InputGroupTextProps) {
  return (
    <div
      ref={ref}
      {...rest}
      {...mergeProps(
        themeProps('input-group-text'),
        {className: styles.text},
        className,
        style,
      )}>
      {children}
    </div>
  );
}

InputGroupText.displayName = 'InputGroupText';
