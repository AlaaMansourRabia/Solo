'use client';
import type React from 'react';
import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';

export interface TableBodyProps extends BaseProps<HTMLTableSectionElement> {
  ref?: React.Ref<HTMLTableSectionElement>;
  children: ReactNode;
}

export function TableBody({
  ref,
  children,
  className,
  style,
  ...rest
}: TableBodyProps) {
  return (
    <tbody
      ref={ref}
      {...mergeProps(
        themeProps('table-body'),
        className,
        style,
      )}
      {...rest}>
      {children}
    </tbody>
  );
}
TableBody.displayName = 'TableBody';
