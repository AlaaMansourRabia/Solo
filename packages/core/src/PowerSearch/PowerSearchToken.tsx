'use client';

/**
 * @file PowerSearchToken.tsx
 * @input PowerSearchTokenProps
 * @output Default token pill for PowerSearch filters
 * @position Public component; used internally by PowerSearch and available for consumer composition
 */

import React from 'react';
import {Token} from '../Token';
import {useTranslator} from '../i18n';
import {useLocale} from '../i18n/useLocale';
import {formatFilterValue} from './formatFilterValue';
import {resolveOperatorLabel} from './resolveOperatorLabel';
import {useInternalConfig} from './useInternalConfig';
import type {PowerSearchTokenProps} from './types';

const tokenValueStyles = {
  value: 'font-(number:--font-weight-bold)',
} as const;

/**
 * Default token pill for PowerSearch filters.
 *
 * Renders a field label, operator label, and formatted value inside an Token.
 * This is the built-in implementation used by PowerSearch — exported so consumers
 * can use it as a base when providing custom `components.Token` overrides.
 */
export function PowerSearchToken({
  config: configProp,
  filter,
  field,
  operator,
  maxLength,
  onClick,
  onRemove,
  isDisabled,
}: PowerSearchTokenProps) {
  const config = useInternalConfig(configProp);
  const t = useTranslator();
  const locale = useLocale();

  const fieldLabel = field.label;
  const resolvedOperatorLabel = resolveOperatorLabel(operator, t);
  const operatorLabel = resolvedOperatorLabel
    ? `: ${resolvedOperatorLabel}`
    : '';
  const tokenLabel = `${fieldLabel}${operatorLabel}`;

  const adjustedMaxLength = Math.max(
    maxLength - fieldLabel.length - resolvedOperatorLabel.length,
    10,
  );

  const valueStr = formatFilterValue(
    config,
    operator.value,
    filter.value,
    adjustedMaxLength,
    t,
    locale,
  );

  const valueContent = valueStr ? (
    <span className={tokenValueStyles.value}>{valueStr}</span>
  ) : undefined;

  return (
    <Token
      label={tokenLabel}
      endContent={valueContent}
      onClick={
        onClick
          ? (e: React.MouseEvent) => {
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
      onRemove={onRemove}
      isDisabled={isDisabled}
    />
  );
}

PowerSearchToken.displayName = 'PowerSearchToken';
