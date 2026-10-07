'use client';
import type React from 'react';
import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';

export interface TableFooterProps extends BaseProps<HTMLTableSectionElement> {
  ref?: React.Ref<HTMLTableSectionElement>;
  children: ReactNode;
}

export function TableFooter({
  ref,
  children,
  className,
  style,
  ...rest
}: TableFooterProps) {
  return (
    <tfoot
      ref={ref}
      {...mergeProps(
        themeProps('table-footer'),
        className,
        style,
      )}
      {...rest}>
      {children}
    </tfoot>
  );
}
TableFooter.displayName = 'TableFooter';
