'use client';

/**
 * @file ProgressBar component barrel export
 */

/**
 * Extensible variant map for ProgressBar.
 *
 * Theme packages can add custom variants via TypeScript module augmentation:
 * @example
 * ```
 * declare module '@solo/core/ProgressBar' {
 *   interface ProgressBarVariantMap {
 *     'brand': true;
 *   }
 * }
 * ```
 */
export interface ProgressBarVariantMap {
  accent: true;
  success: true;
  warning: true;
  neutral: true;
  error: true;
}

export {ProgressBar} from './ProgressBar';
export type {
  ProgressBarProps,
  ProgressBarMark,
  ProgressBarVariant,
} from './ProgressBar';
