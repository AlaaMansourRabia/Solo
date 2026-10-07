/**
 * @file Code.tsx
 * @input Uses React, Tailwind classes, theme tokens
 * @output Exports Code component for inline code styling
 * @position Core implementation; lives in own Code/ dir, re-exported by CodeBlock/
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Code/Code.doc.mjs (consumer API and theming metadata)
 * - /packages/core/src/CodeBlock/index.ts (compatibility re-exports if types change)
 */

import type {ReactNode} from 'react';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

const styles = {
  base: cn(
    'font-(family-name:--font-family-code) text-(length:--text-code-size) leading-[inherit]',
    'bg-(--color-background-muted) px-(--spacing-1) py-(--spacing-0) rounded-(--radius-inner)',
    // Prevent code from breaking parent layout
    'wrap-break-word [word-break:break-word]',
  ),
} as const;

const colorStyles = {
  primary: 'text-(--color-text-primary)',
  secondary: 'text-(--color-text-secondary)',
  inherit: 'text-inherit',
} as const;

const sizeStyles = {
  // Adopt the surrounding text's font-size and line-height, for inline code
  // that should match differently-sized text around it.
  inherit: 'text-[length:inherit] leading-[inherit]',
} as const;

/** Text color for {@link Code}, mirroring the primary/secondary/inherit subset of Text. */
export type CodeColor = 'primary' | 'secondary' | 'inherit';

/** Font size for {@link Code}. `'inherit'` adopts the surrounding text size. */
export type CodeSize = 'inherit';

export interface CodeProps extends BaseProps<HTMLElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLElement>;
  /**
   * Text color. Mirrors the Text color subset.
   * @default 'primary'
   */
  color?: CodeColor;
  /**
   * Font size. Set to `'inherit'` to adopt the surrounding text's font-size
   * and line-height (useful for inline code inside larger/smaller text).
   */
  size?: CodeSize;
  /** Code content */
  children: ReactNode;
}

/**
 * Inline code element. Renders a styled `<code>` with monospace font,
 * muted background, and design-system-consistent sizing.
 *
 * For fenced code blocks with syntax highlighting, use `CodeBlock`.
 *
 * @example
 * ```
 * <Text type="body">
 *   Use <Code>const x = 1</Code> to declare a variable.
 * </Text>
 * ```
 */
export function Code({
  children,
  color = 'primary',
  size,
  className,
  style,
  ref,
  ...props
}: CodeProps) {
  return (
    <code
      ref={ref}
      {...props}
      {...mergeProps(
        themeProps('code', {color}),
        {
          className: cn(
            styles.base,
            colorStyles[color],
            size && sizeStyles[size],
          ),
        },
        className,
        style,
      )}>
      {children}
    </code>
  );
}

Code.displayName = 'Code';
