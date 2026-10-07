'use client';
/**
 * @file CodeBlock.tsx
 * @input Uses React, Tailwind classes, theme tokens, CSS Custom Highlight API, SyntaxTheme provider
 * @output Exports CodeBlock component and CodeBlockProps
 * @position Core implementation; read-only syntax-highlighted code display
 */

import {
  useInsertionEffect,
  useEffect,
  useId,
  useRef,
  useState,
  useCallback,
  useMemo,
  type CSSProperties,
} from 'react';
import * as React from 'react';
import type {BaseProps} from '../BaseProps';
import {mergeProps} from '../utils';
import {useClipboard} from '../hooks/useClipboard';
import {Icon} from '../Icon';
import {IconButton} from '../IconButton';
import {
  tokenize,
  tokenizeAsync,
  flatTokensToLines,
  SYNC_TOKENIZE_THRESHOLD,
} from './tokenizer';
import type {SyntaxToken, TokenLine} from './tokenizer';
import {ensureHighlightStyles} from './highlightStyles';
import {applyHighlightRangesChunked} from './highlightRanges';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';
import {useTranslator} from '../i18n';
import {SyntaxTheme, type SyntaxThemeDefinition} from '../theme/syntax';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const containerStyles = {
  card: 'rounded-(--radius-element) [border-width:var(--border-width)] [border-style:solid] border-(--color-border)',
  section: cn(
    'rounded-none [border-width:0] [border-style:none] border-transparent',
    // Transparent background so the block blends into the surface it's
    // embedded in (a card or panel) instead of painting its own muted layer,
    // which would compound with a muted parent into a darker grey. Override
    // the syntax-background var so both the root and the sticky header inherit
    // it. Consumers can still set an explicit background via className.
    '[--color-syntax-background:transparent]',
  ),
} as const;

/**
 * Consumer-controlled width, routed through a custom property so a
 * `className` can still override it. `fit-content` also gets a min-width
 * floor and a max-width cap.
 */
const widthStyles = {
  base: 'w-(--_codeblock-width)',
  fitContent: 'min-w-[min(100%,400px)] max-w-full',
} as const;

// Width of the line-number column, sized to the widest number. `ch` is the
// advance of "0" in the (monospace) code font, so N digits => N ch. Set on
// <code>; `--_codeblock-gutter-width` is unregistered so it inherits (with its var()
// substituted) down to the line divs that read it for their grid track.
function gutterWidthStyle(digits: number): CSSProperties {
  return {'--_codeblock-gutter-width': `${digits}ch`} as CSSProperties;
}

// Light reveal so the leading chevron eases into view instead of popping in.
// Growing the chevron's own footprint (width + inline margin) from zero slides
// the title into place instead of snapping it over, and clipping keeps the
// glyph from spilling while it's mid-reveal. Keyframes: `solo-codeblock-
// chevron-reveal` in CodeBlock.css.

const styles = {
  root: 'relative isolate flex flex-col m-0 bg-(--color-syntax-background) overflow-hidden',
  headerRow:
    'flex items-center justify-between px-(--spacing-4) bg-(--color-syntax-background) sticky top-0 z-1',
  header: cn(
    'flex items-center flex-1 min-w-0',
    // Reset default <button> appearance for the collapsible title control.
    'p-0 [border-width:0] [border-style:none] bg-transparent text-inherit [font:inherit] text-start',
  ),
  headerWithDivider:
    'py-(--spacing-2) [border-bottom-width:var(--border-width)] [border-bottom-style:solid] [border-bottom-color:var(--color-border)]',
  headerCompact: 'py-(--spacing-2)',
  headerTitle: cn(
    'flex items-center text-(length:--text-supporting-size) font-(family-name:--font-family-code)',
    'font-(number:--font-weight-medium) text-(--color-syntax-comment) m-0 leading-(--text-supporting-leading)',
  ),
  scrollContainer: 'overflow-x-auto overflow-y-auto',
  codeWrapper: 'flex min-w-fit',
  codeWrapperCompact: 'mbs-[calc(-1*var(--spacing-2))]',
  collapseGrid: cn(
    'grid [grid-template-rows:1fr] [transition-property:grid-template-rows]',
    '[transition-duration:var(--duration-medium)] [transition-timing-function:var(--ease-standard)]',
  ),
  collapseGridCollapsed: '[grid-template-rows:0fr]',
  collapseInner: 'overflow-hidden min-h-0',
  collapseChevron: cn(
    'inline-flex items-center justify-center shrink-0 w-[14px] h-[14px] me-(--spacing-1) overflow-hidden',
    'text-(--color-syntax-comment)',
    '[animation-name:solo-codeblock-chevron-reveal] motion-reduce:[animation-name:none]',
    '[animation-duration:var(--duration-medium)] [animation-timing-function:var(--ease-standard)]',
  ),
  // Applied to the chevron <Icon> (via `className`): the glyph is the element that
  // rotates and the element a theme targets, so one selector reaches both.
  collapseChevronIcon:
    '[transition-property:transform] [transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  // Leading disclosure convention (matches TreeList/Table): the resting
  // chevronRight points right (>) when collapsed; rotate it down (v) when
  // expanded.
  collapseChevronExpanded: '[transform:rotate(90deg)]',
  // Restore a keyboard-only focus ring with the standard token/offset so this
  // disclosure control matches the rest of the system (Collapsible, TabMenu);
  // otherwise it falls back to the inconsistent UA default outline.
  headerCollapsible:
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default select-none',
  code: cn(
    'block flex-1 py-(--spacing-3) px-(--spacing-4) m-0 font-(family-name:--font-family-code)',
    'text-(--color-syntax-variable) [tab-size:2] whitespace-pre [word-break:normal] [overflow-wrap:normal]',
  ),
  codeWrapped: 'whitespace-pre-wrap [word-break:break-all] [overflow-wrap:break-word]',
  // With line numbers on, the <code> element hosts the full-height divider
  // between the number gutter and the code. It spans the code's block padding
  // too (inset-block: 0), so the rule reaches the top and bottom edges the way
  // the old separate gutter column did. The numbers themselves are drawn per
  // line (see `lineNumbered`) — a separate column can't track wrap height.
  codeNumbered: cn(
    'relative',
    "after:content-[''] after:absolute after:inset-y-0",
    'after:start-[calc(var(--spacing-4)_+_var(--_codeblock-gutter-width)_+_var(--spacing-3))] after:w-0',
    'after:[border-inline-start-width:var(--border-width)] after:[border-inline-start-style:solid] after:[border-inline-start-color:var(--color-border)]',
    'after:pointer-events-none',
  ),
  line: 'leading-(--text-code-leading)',
  // Per-line number gutter: a two-column grid ([number] [code]). The number is
  // a ::before generated from the data-line attribute. Because the number and
  // its code occupy one grid row, the row grows to fit wrapped code while the
  // number stays pinned to the row's first visual line (alignSelf: start) —
  // this is what keeps numbers aligned when isWrapped wraps a line.
  lineNumbered: cn(
    'grid [grid-template-columns:var(--_codeblock-gutter-width)_1fr]',
    'gap-x-[calc(var(--spacing-3)_+_var(--border-width)_+_var(--spacing-4))]',
    'before:content-[attr(data-line)] before:[grid-column:1] before:[align-self:start] before:text-end',
    'before:text-(--color-syntax-punctuation) before:select-none before:font-(family-name:--font-family-code)',
  ),
  // In span mode the tokens are wrapped in this element so they form a single
  // grid item in column 2 (otherwise each token span would flow into its own
  // grid cell). minWidth:0 lets it shrink so long lines wrap within the track.
  lineContent: 'min-w-0',
  lineChunk: '[content-visibility:auto]',
  lineHighlighted:
    'bg-(--color-accent-muted) mx-[calc(-1*var(--spacing-4))] px-(--spacing-4)',
  sizeSm: 'text-(length:--text-supporting-size)',
  sizeMd: 'text-(length:--text-code-size)',
  // The copy control is a ghost IconButton (Button owns its own padding,
  // radius, and hover surface); this only tints the resting glyph to the
  // muted syntax-comment colour so it blends into the header/corner. A theme
  // reaches it via the `codeblock-copy-button` target on the Button.
  copyButton: 'text-(--color-syntax-comment)',
  copyButtonAbsolute: 'absolute top-(--spacing-2) end-(--spacing-2)',
} as const;

// ---------------------------------------------------------------------------
// Line rendering
// ---------------------------------------------------------------------------

const LINE_CHUNK_SIZE = 20;
const LINE_CHUNK_THRESHOLD = 100;

/**
 * Memoized chunk component — cheaper than memoizing every individual line.
 */
const CodeChunk = React.memo(function CodeChunk({
  lines,
  startIndex,
  highlightSet,
  renderLineContent,
  lineNumbers,
}: {
  lines: string[];
  startIndex: number;
  highlightSet: Set<number> | null;
  renderLineContent: (line: string, lineIndex: number) => React.ReactNode;
  lineNumbers: boolean;
}) {
  return (
    <>
      {lines.map((line, j) => {
        const i = startIndex + j;
        return (
          <div
            key={i}
            data-line={i + 1}
            className={cn(
              styles.line,
              lineNumbers && styles.lineNumbered,
              (highlightSet?.has(i + 1) ?? false) && styles.lineHighlighted,
            )}>
            {renderLineContent(line, i)}
          </div>
        );
      })}
    </>
  );
});

function renderLines(
  lines: string[],
  highlightSet: Set<number> | null,
  renderLineContent: (line: string, lineIndex: number) => React.ReactNode,
  lineNumbers: boolean,
  chunkSize: number = LINE_CHUNK_SIZE,
): React.ReactNode {
  chunkSize = Math.max(1, Math.floor(chunkSize));

  if (lines.length < LINE_CHUNK_THRESHOLD) {
    return (
      <CodeChunk
        lines={lines}
        startIndex={0}
        highlightSet={highlightSet}
        renderLineContent={renderLineContent}
        lineNumbers={lineNumbers}
      />
    );
  }

  const chunks: React.ReactNode[] = [];
  for (let start = 0; start < lines.length; start += chunkSize) {
    const end = Math.min(start + chunkSize, lines.length);
    const chunkLines = lines.slice(start, end);
    const estimatedHeight = `${chunkLines.length}lh`;

    chunks.push(
      <div
        key={start}
        {...mergeProps({className: styles.lineChunk}, {
          style: {containIntrinsicBlockSize: `auto ${estimatedHeight}`},
        })}>
        <CodeChunk
          lines={chunkLines}
          startIndex={start}
          highlightSet={highlightSet}
          renderLineContent={renderLineContent}
          lineNumbers={lineNumbers}
        />
      </div>,
    );
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CodeBlockProps extends BaseProps<HTMLPreElement> {
  ref?: React.Ref<HTMLPreElement>;
  code: string;
  language?: string;
  title?: string;
  hasLanguageLabel?: boolean;
  hasLineNumbers?: boolean;
  highlightLines?: number[];
  hasCopyButton?: boolean;
  onCopy?: () => void;
  isWrapped?: boolean;
  maxHeight?: number | string;
  isCollapsible?: boolean;
  collapsibleThreshold?: number;
  size?: 'sm' | 'md';
  /**
   * Width of the code block. Accepts any CSS width value.
   * - `'fit-content'` (default): shrinks to the width of the longest line (with a min-width floor).
   * - `'100%'`: stretches to fill the parent container width.
   * - Any valid CSS width string (e.g. `'600px'`, `'50vw'`).
   * @default 'fit-content'
   */
  width?: string;
  /**
   * Container presentation style.
   * - `'card'` (default): border-radius and border with the muted syntax
   *   background — standalone card look.
   * - `'section'`: no border-radius, no border, and a transparent background
   *   so the block blends into the card or panel it's embedded in. Set an
   *   explicit background via `className` if you need one.
   * @default 'card'
   */
  container?: 'card' | 'section';
  tokenizer?: (
    code: string,
    language: string,
  ) => {type: string; start: number; end: number}[];
  highlightMode?: 'auto' | 'ranges' | 'spans';
  /**
   * Per-instance syntax theme override. Shorthand for wrapping this block in
   * `<SyntaxTheme theme={...}>` — accepts a preset from
   * `@solo/core/theme/syntax` or a theme created with
   * `defineSyntaxTheme()`. Without it, the block uses the theme-level syntax
   * colors from the nearest SyntaxTheme ancestor or `defineTheme({ syntax })`.
   */
  syntaxTheme?: SyntaxThemeDefinition;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hasHighlightAPI(): boolean {
  return (
    typeof CSS !== 'undefined' &&
    'highlights' in CSS &&
    typeof Highlight !== 'undefined'
  );
}

/**
 * Safari supports the Highlight API JS objects but has rendering issues
 * with ::highlight() in code blocks. Detect Safari (WebKit without Chrome)
 * so we can fall back to spans.
 */
function isSafari(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const ua = navigator.userAgent;
  return ua.includes('AppleWebKit') && !ua.includes('Chrome');
}

/**
 * Hook: per-line tokens with sync/async + custom tokenizer compat.
 */
function useTokenLines(
  code: string,
  language: string,
  customTokenizer?: CodeBlockProps['tokenizer'],
): TokenLine[] {
  const [asyncTokenResult, setAsyncTokenResult] = useState<{
    code: string;
    language: string;
    tokens: TokenLine[];
  } | null>(null);

  const syncTokens = useMemo(() => {
    if (customTokenizer) {
      return flatTokensToLines(customTokenizer(code, language), code);
    }
    if (code.length >= SYNC_TOKENIZE_THRESHOLD) {
      return null;
    }
    return tokenize(code, language);
  }, [code, language, customTokenizer]);

  useEffect(() => {
    if (code.length < SYNC_TOKENIZE_THRESHOLD || customTokenizer) {
      return;
    }

    const abortController = new AbortController();

    async function tokenizeLargeCode() {
      try {
        const tokens = await tokenizeAsync(
          code,
          language,
          abortController.signal,
        );
        if (!abortController.signal.aborted) {
          setAsyncTokenResult({code, language, tokens});
        }
      } catch {
        if (!abortController.signal.aborted) {
          setAsyncTokenResult({code, language, tokens: []});
        }
      }
    }

    void tokenizeLargeCode();

    return () => {
      abortController.abort();
    };
  }, [code, language, customTokenizer]);

  if (syncTokens != null) {
    return syncTokens;
  }

  if (
    asyncTokenResult?.code === code &&
    asyncTokenResult.language === language
  ) {
    return asyncTokenResult.tokens;
  }

  return [];
}

// ---------------------------------------------------------------------------
// Span-mode code element
// ---------------------------------------------------------------------------

function buildSpanLine(
  lineText: string,
  tokens: SyntaxToken[],
): React.ReactNode {
  if (tokens.length === 0) {
    return lineText || '\u200b';
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const token of tokens) {
    if (token.start > cursor) {
      parts.push(lineText.slice(cursor, token.start));
    }
    const end = Math.min(token.end, lineText.length);
    parts.push(
      <span
        key={`${token.start}-${token.type}`}
        className={`solo-token-${token.type}`}>
        {lineText.slice(token.start, end)}
      </span>,
    );
    cursor = end;
  }

  if (cursor < lineText.length) {
    parts.push(lineText.slice(cursor));
  }
  return parts.length > 0 ? parts : '\u200b';
}

function SpanCodeContent({
  lines,
  tokenLines,
  highlightSet,
  isWrapped,
  sizeStyle,
  hasLineNumbers,
  maxDigits,
}: {
  lines: string[];
  tokenLines: TokenLine[];
  highlightSet: Set<number> | null;
  isWrapped: boolean;
  sizeStyle: string;
  hasLineNumbers: boolean;
  maxDigits: number;
}) {
  useInsertionEffect(() => {
    ensureHighlightStyles();
  }, []);

  const renderLineContent = useCallback(
    (line: string, lineIndex: number): React.ReactNode => {
      const tokens = tokenLines[lineIndex] ?? [];
      // Wrap tokens in a single element so they occupy one grid cell when line
      // numbers are on (see `lineNumbered`); an inline span is a no-op when off.
      return (
        <span className={styles.lineContent}>
          {buildSpanLine(line, tokens)}
        </span>
      );
    },
    [tokenLines],
  );

  return (
    <code
      className={cn(
        styles.code,
        sizeStyle,
        isWrapped && styles.codeWrapped,
        hasLineNumbers && styles.codeNumbered,
      )}
      style={hasLineNumbers ? gutterWidthStyle(maxDigits) : undefined}>
      {renderLines(lines, highlightSet, renderLineContent, hasLineNumbers)}
    </code>
  );
}

// ---------------------------------------------------------------------------
// Range-mode code element
// ---------------------------------------------------------------------------

function RangeCodeContent({
  lines,
  tokenLines,
  highlightSet,
  isWrapped,
  sizeStyle,
  hasLineNumbers,
  maxDigits,
}: {
  lines: string[];
  tokenLines: TokenLine[];
  highlightSet: Set<number> | null;
  isWrapped: boolean;
  sizeStyle: string;
  hasLineNumbers: boolean;
  maxDigits: number;
}) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!hasHighlightAPI()) {
      return;
    }
    ensureHighlightStyles();

    const codeEl = codeRef.current;
    if (!codeEl || tokenLines.length === 0) {
      return;
    }

    return applyHighlightRangesChunked(codeEl, tokenLines);
  }, [tokenLines]);

  // Range mode keeps the line's text as a bare text node (its firstChild) so
  // applyHighlightRangesChunked can map token offsets onto it \u2014 no wrapper. The
  // number ::before is a pseudo-element, so it never becomes a child node here.
  const renderLineContent = useCallback(
    (line: string): React.ReactNode => line || '\u200b',
    [],
  );

  return (
    <code
      ref={codeRef}
      className={cn(
        styles.code,
        sizeStyle,
        isWrapped && styles.codeWrapped,
        hasLineNumbers && styles.codeNumbered,
      )}
      style={hasLineNumbers ? gutterWidthStyle(maxDigits) : undefined}>
      {renderLines(lines, highlightSet, renderLineContent, hasLineNumbers)}
    </code>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Read-only code display with syntax highlighting, line numbers,
 * and optional copy button.
 *
 * @example
 * ```
 * <CodeBlock code="const x = 42;" language="javascript" />
 * ```
 */
export function CodeBlock({
  code,
  language = 'plaintext',
  title,
  hasLanguageLabel = true,
  hasLineNumbers = false,
  highlightLines,
  hasCopyButton = true,
  onCopy,
  isWrapped = false,
  maxHeight,
  isCollapsible = false,
  collapsibleThreshold = 10,
  size = 'md',
  width: widthProp = 'fit-content',
  container = 'card',
  tokenizer: customTokenizer,
  highlightMode = 'auto',
  syntaxTheme,
  className,
  style,
  ref,
  ...props
}: CodeBlockProps) {
  const t = useTranslator();
  // Owns the clipboard write, the transient copied flag, its reset timer, and
  // the polite copy announcement (a swapped aria-label alone is not reliably
  // announced) — shared with Timestamp via the same hook.
  const {copy, isCopied: copied} = useClipboard({
    announce: t('@solo.codeBlock.copied'),
  });

  const useSpans =
    highlightMode === 'spans' ||
    (highlightMode === 'auto' && !hasHighlightAPI()) ||
    (highlightMode === 'auto' && isSafari());

  const lines = useMemo(() => {
    const l = code.split('\n');
    if (l.length > 1 && l[l.length - 1] === '') {
      l.pop();
    }
    return l;
  }, [code]);

  const tokenLines = useTokenLines(code, language, customTokenizer);

  const highlightSet = useMemo(
    () => (highlightLines ? new Set(highlightLines) : null),
    [highlightLines],
  );

  const handleCopy = useCallback(async () => {
    const didCopy = await copy(code);
    if (didCopy) {
      onCopy?.();
    }
  }, [code, copy, onCopy]);

  const sizeStyle = size === 'sm' ? styles.sizeSm : styles.sizeMd;
  // Digits in the largest line number — sizes the gutter column width.
  const maxLineDigits = String(lines.length).length;
  const languageLabel =
    hasLanguageLabel && language !== 'plaintext' ? language : null;
  const showHeader = title != null || languageLabel != null;

  // A collapsed body must never outlive the visible header that controls it.
  const canCollapse =
    showHeader && isCollapsible && lines.length >= collapsibleThreshold;
  const collapseControl = useMemo(
    () => (canCollapse ? {} : null),
    [canCollapse],
  );
  const [collapsedControl, setCollapsedControl] = useState<object | null>(null);
  const isCollapsed =
    collapseControl != null && collapsedControl === collapseControl;
  const toggleCollapsed = useCallback(() => {
    setCollapsedControl(current =>
      current === collapseControl ? null : collapseControl,
    );
  }, [collapseControl]);
  // Links the collapsible header to the code region it shows/hides so assistive
  // tech can move from the button to its controlled content (disclosure
  // pattern). The region stays mounted when collapsed (CSS grid animation), so
  // this is always a resolvable reference — aria-controls can be unconditional.
  const regionId = useId();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollStyle: CSSProperties | undefined =
    maxHeight != null
      ? {
          maxHeight:
            typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        }
      : undefined;

  const copyButtonEl = hasCopyButton ? (
    <IconButton
      variant="ghost"
      size="sm"
      icon={<Icon icon={copied ? 'check' : 'copy'} size="sm" color="inherit" />}
      // A visible "Copy" hover/focus hint via Button's built-in tooltip. It
      // stays "Copy" after copying — the copy → check icon flip is the
      // confirmation, not a tooltip change. The aria-label still swaps to the
      // localized "Copied" for assistive tech, backed by the announcement.
      tooltip={t('@solo.codeBlock.copyCode')}
      label={
        copied ? t('@solo.codeBlock.copied') : t('@solo.codeBlock.copyCode')
      }
      onClick={e => {
        // Stop propagation so copying does not toggle the collapsible header.
        e.stopPropagation();
        void handleCopy();
      }}
      {...mergeProps(
        themeProps('code-block-copy-button', undefined, {
          legacyNames: ['codeblock-copy-button'],
        }),
        {
          className: cn(
            styles.copyButton,
            !showHeader && styles.copyButtonAbsolute,
          ),
        },
      )}
    />
  ) : null;

  const headerEl = showHeader ? (
    <div
      {...mergeProps(
        themeProps(
          'code-block-header',
          {size, language, container},
          {legacyNames: ['codeblock-header']},
        ),
        {
          className: cn(
            styles.headerRow,
            hasLineNumbers ? styles.headerWithDivider : styles.headerCompact,
          ),
        },
      )}>
      <div
        role={canCollapse ? 'button' : undefined}
        tabIndex={canCollapse ? 0 : undefined}
        aria-expanded={canCollapse ? !isCollapsed : undefined}
        aria-controls={canCollapse ? regionId : undefined}
        aria-label={
          canCollapse && !title?.trim() && !languageLabel
            ? t('@solo.codeBlock.code')
            : undefined
        }
        onClick={canCollapse ? toggleCollapsed : undefined}
        onKeyDown={
          canCollapse
            ? (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleCollapsed();
                }
              }
            : undefined
        }
        className={cn(
          focusOutlineStyles.focusVisible,
          styles.header,
          canCollapse && styles.headerCollapsible,
        )}>
        <span
          {...mergeProps(
            themeProps(
              'code-block-title',
              {size, language},
              {legacyNames: ['codeblock-title']},
            ),
            {className: styles.headerTitle},
          )}>
          {canCollapse && (
            <span className={styles.collapseChevron}>
              <Icon
                icon="chevronRight"
                size="xsm"
                color="inherit"
                className={cn(
                  styles.collapseChevronIcon,
                  !isCollapsed && styles.collapseChevronExpanded,
                )}
              />
            </span>
          )}
          {title}
          {title && languageLabel ? ' — ' : ''}
          {languageLabel}
        </span>
      </div>
      {copyButtonEl}
    </div>
  ) : null;

  const codeBody = (
    <div
      ref={scrollContainerRef}
      // The scroll container is keyboard-focusable so keyboard users can
      // scroll long or wide code that overflows the viewport. Uses
      // role="group" (not "region") so multiple code blocks on a page don't
      // create duplicate same-named landmarks (axe: landmark-unique).
      tabIndex={0}
      role="group"
      aria-label={languageLabel ?? t('@solo.codeBlock.code')}
      {...mergeProps({className: styles.scrollContainer}, {
        style: scrollStyle,
      })}>
      <div
        className={cn(
          styles.codeWrapper,
          showHeader && !hasLineNumbers && styles.codeWrapperCompact,
        )}>
        {useSpans ? (
          <SpanCodeContent
            lines={lines}
            tokenLines={tokenLines}
            highlightSet={highlightSet}
            isWrapped={isWrapped}
            sizeStyle={sizeStyle}
            hasLineNumbers={hasLineNumbers}
            maxDigits={maxLineDigits}
          />
        ) : (
          <RangeCodeContent
            lines={lines}
            tokenLines={tokenLines}
            highlightSet={highlightSet}
            isWrapped={isWrapped}
            sizeStyle={sizeStyle}
            hasLineNumbers={hasLineNumbers}
            maxDigits={maxLineDigits}
          />
        )}
      </div>
    </div>
  );

  const block = (
    <pre
      ref={ref}
      {...mergeProps(
        themeProps(
          'code-block',
          {size, language, container},
          // `codeblock` ran the compound name together; keep it emitted so
          // existing themes continue to work.
          {legacyNames: ['codeblock']},
        ),
        {
          className: cn(
            styles.root,
            widthStyles.base,
            widthProp === 'fit-content' && widthStyles.fitContent,
            containerStyles[container],
          ),
          style: {'--_codeblock-width': widthProp} as CSSProperties,
        },
        className,
        style,
      )}
      {...props}>
      {headerEl}
      {canCollapse ? (
        <div
          id={regionId}
          // While collapsed, the region is only hidden visually (0fr grid
          // row); inert also removes it from the tab order and accessibility
          // tree so keyboard users cannot Tab into the invisible scroll
          // container (tabIndex=0). aria-controls pointing at an inert
          // element remains a valid, resolvable reference.
          inert={isCollapsed ? true : undefined}
          className={cn(
            styles.collapseGrid,
            isCollapsed && styles.collapseGridCollapsed,
          )}>
          <div className={styles.collapseInner}>{codeBody}</div>
        </div>
      ) : (
        codeBody
      )}
      {!showHeader && copyButtonEl}
    </pre>
  );

  return syntaxTheme ? (
    <SyntaxTheme theme={syntaxTheme}>{block}</SyntaxTheme>
  ) : (
    block
  );
}

CodeBlock.displayName = 'CodeBlock';
