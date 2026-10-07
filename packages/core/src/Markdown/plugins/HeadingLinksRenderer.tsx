'use client';

/**
 * @file HeadingLinksRenderer.tsx
 * @input A built-in semantic heading and its module-owned identity projection
 * @output Inline heading-permalink copy composition with isolated control geometry
 * @position Internal renderer owned by module:Markdown/headingLinks
 */

import {useCallback} from 'react';
import type {CSSProperties, MouseEvent, ReactElement} from 'react';
import {Button} from '../../Button/Button';
import {Icon} from '../../Icon';
import {useClipboard} from '../../hooks/useClipboard';
import {useContainerReveal} from '../../hooks/useContainerReveal';
import {useTranslator} from '../../i18n';
import {mergeProps, rtlStyles} from '../../utils';
import {cn} from '../../utils/cn';

const COPY_FEEDBACK_MS = 1500;

const ALIGN_MARGIN = {
  start: '[margin-inline:0]',
  center: 'mx-auto',
} as const;

// Consumer-controlled prose width, routed through a scoped custom property.
const proseWidthClass = 'max-w-(--_md-heading-prose-width)';

const styles = {
  row: 'flex [align-items:last_baseline] min-w-0 max-w-full overflow-visible isolate',
  heading: '[flex:0_1_auto] min-w-0 my-0',
  controlSlot: cn(
    'relative inline-block shrink-0 z-1',
    '[inline-size:var(--size-element-sm)] [@media(any-pointer:coarse)]:[inline-size:24px]',
    'ms-(--spacing-1-5) text-(--color-text-secondary)',
    '[font-family:inherit] text-[length:inherit] font-[number:inherit] leading-[inherit]',
  ),
  baselineProbe: 'invisible',
  copyButton: cn(
    'absolute [inset-block-start:50%]',
    '[inline-size:var(--size-element-sm)] [@media(any-pointer:coarse)]:[inline-size:24px]',
    '[block-size:var(--size-element-sm)] [@media(any-pointer:coarse)]:[block-size:24px]',
    'py-0 px-0 text-inherit',
    '[font-family:inherit] text-[length:inherit] font-[number:inherit] leading-[inherit]',
  ),
  glyph: 'inline-flex items-center justify-center [inline-size:1em] [block-size:1em]',
} as const;

/** @internal Applied only while this module owns the built-in heading row. */
export const headingLinksHeadingStyle = styles.heading;

interface HeadingLinksRendererProps {
  readonly children: ReactElement;
  readonly headingId: string;
  readonly headingLabel: string;
  readonly permalinkUrl: string;
  readonly contentWidth: string | null;
  readonly contentAlign: 'start' | 'center';
  readonly headingTextClassName: string;
  readonly blockSpacingClassName: string;
}

function isUnmodifiedPrimaryActivation(
  event: MouseEvent<HTMLButtonElement>,
): boolean {
  return (
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  );
}

/** @internal Portable renderer composed by Markdown for built-in headings only. */
export function HeadingLinksRenderer({
  children,
  headingId,
  headingLabel,
  permalinkUrl,
  contentWidth,
  contentAlign,
  headingTextClassName,
  blockSpacingClassName,
}: HeadingLinksRendererProps): ReactElement {
  const t = useTranslator();
  const copiedLabel = t('@solo.markdownHeadingLinks.copied');
  const copyLabel = t('@solo.markdownHeadingLinks.copy', {
    heading: headingLabel || headingId,
  });
  const {copy, isCopied} = useClipboard({
    announce: copiedLabel,
    resetAfterMs: COPY_FEEDBACK_MS,
  });
  const {getContainerProps, getContentRevealProps} = useContainerReveal();
  const centerInline = rtlStyles.centerInline('-50%');
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!isUnmodifiedPrimaryActivation(event)) {
        return;
      }
      // This is deliberately an honest copy button rather than an anchor: the
      // heading remains an incoming fragment target, while activating the #
      // never mutates location, scrolls, or implies open-in-new-tab semantics.
      void copy(new URL(permalinkUrl, window.location.href).href);
    },
    [copy, permalinkUrl],
  );

  return (
    <div
      {...mergeProps(
        getContainerProps(),
        {
          className: cn(
            styles.row,
            headingTextClassName,
            blockSpacingClassName,
            contentWidth != null && proseWidthClass,
            contentAlign !== 'start' && ALIGN_MARGIN[contentAlign],
          ),
          style:
            contentWidth != null
              ? ({
                  '--_md-heading-prose-width': contentWidth,
                } as CSSProperties)
              : undefined,
        },
      )}>
      {children}
      <span className={styles.controlSlot}>
        <span aria-hidden="true" className={styles.baselineProbe}>
          #
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          label={isCopied ? copiedLabel : copyLabel}
          icon={
            <span aria-hidden="true" className={styles.glyph}>
              {isCopied ? <Icon icon="check" size="sm" color="inherit" /> : '#'}
            </span>
          }
          isIconOnly
          onClick={handleClick}
          {...mergeProps(
            {
              className: cn(styles.copyButton, centerInline.className),
              style: centerInline.style,
            },
            getContentRevealProps({isLayoutPreserved: true}),
          )}
        />
      </span>
    </div>
  );
}
