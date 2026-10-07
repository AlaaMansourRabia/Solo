'use client';
import type React from 'react';
import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';

export interface TableHeaderProps extends BaseProps<HTMLTableSectionElement> {
  ref?: React.Ref<HTMLTableSectionElement>;
  children: ReactNode;
}

export function TableHeader({
  ref,
  children,
  className,
  style,
  ...rest
}: TableHeaderProps) {
  return (
    <thead
      ref={ref}
      {...mergeProps(
        themeProps('table-header'),
        className,
        style,
      )}
      {...rest}>
      {children}
    </thead>
  );
}
TableHeader.displayName = 'TableHeader';
