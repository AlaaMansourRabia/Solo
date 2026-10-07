/**
 * @file Blockquote.tsx
 * @input Uses React, Tailwind classes, spacing and color tokens
 * @output Exports Blockquote component and BlockquoteProps
 * @position Blockquote component; renders styled quotations with optional attribution
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Blockquote/Blockquote.doc.mjs
 * - /packages/core/src/Blockquote/Blockquote.test.tsx
 * - /apps/storybook/stories/Blockquote.stories.tsx
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {isRenderable, mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

export interface BlockquoteProps extends BaseProps<HTMLQuoteElement> {
  /** Ref forwarded to the root <blockquote> element */
  ref?: React.Ref<HTMLQuoteElement>;
  /** Content of the blockquote */
  children: ReactNode;
  /**
   * Optional attribution for the quote. Rendered in a `<cite>` element after
   * the quoted content.
   */
  cite?: ReactNode;
}

const styles = {
  root: cn(
    '[border-inline-start-width:var(--spacing-0-5)] [border-inline-start-style:solid] [border-inline-start-color:var(--color-border-emphasized)]',
    'ps-(--spacing-4) text-(--color-text-secondary) wrap-break-word',
    'ms-0 me-0 mbs-0 mbe-0',
  ),
  cite: 'block mbs-(--spacing-2) text-(length:--text-supporting-size) leading-(--text-supporting-leading) not-italic',
} as const;

/**
 * Blockquote component for displaying quoted content.
 *
 * Renders a semantic `<blockquote>` with an inline-start rule and secondary
 * text color, matching the Solo visual language.
 *
 * @example
 * ```
 * <Blockquote>Design is not just what it looks like.</Blockquote>
 * ```
 */
export function Blockquote({
  children,
  cite,
  className,
  style,
  ref,
  ...props
}: BlockquoteProps) {
  return (
    <blockquote
      ref={ref}
      {...mergeProps(
        themeProps('blockquote'),
        {className: styles.root},
        className,
        style,
      )}
      {...props}>
      {children}
      {/*
        A bare <cite>, never wrapped in <footer>: <blockquote> is a sectioning
        root, so a <footer> inside it maps to a contentinfo document landmark.
      */}
      {isRenderable(cite) && <cite className={styles.cite}>{cite}</cite>}
    </blockquote>
  );
}

Blockquote.displayName = 'Blockquote';
