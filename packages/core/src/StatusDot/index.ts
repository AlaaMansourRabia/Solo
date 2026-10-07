'use client';

/**
 * @file index.ts
 * @input Imports from StatusDot component
 * @output Exports StatusDot component and related types
 * @position Entry point for StatusDot; re-exported by /packages/core/src/index.ts
 */

/**
 * Extensible variant map for StatusDot.
 *
 * Theme packages can add custom variants via TypeScript module augmentation:
 * @example
 * ```
 * declare module '@solo/core/StatusDot' {
 *   interface StatusDotVariantMap {
 *     'critical': true;
 *   }
 * }
 * ```
 */
export interface StatusDotVariantMap {
  success: true;
  warning: true;
  error: true;
  accent: true;
  neutral: true;
}

export {StatusDot} from './StatusDot';
export type {StatusDotProps, StatusDotVariant} from './StatusDot';
