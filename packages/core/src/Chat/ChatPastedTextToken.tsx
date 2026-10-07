'use client';

/**
 * @file ChatPastedTextToken.tsx
 * @input Uses React, Tailwind classes, Badge, HoverCard, Button, CodeBlock
 * @output Exports ChatPastedTextToken component
 * @position Inline token for pasted text with hover card preview + expand
 *
 * Hover: card with truncated text preview and "Expand" button.
 * Expand replaces the token with the full text in the contentEditable.
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Chat/index.ts (exports)
 */

import {Badge} from '../Badge';
import {Button} from '../Button';
import {HoverCard} from '../HoverCard';
import {useTranslator} from '../i18n';
import {cn} from '../utils/cn';

// =============================================================================
// Types
// =============================================================================

export interface ChatPastedTextTokenProps {
  /** The full pasted text. */
  text: string;
  /** Called when the user clicks Expand — dissolves the token into editable text. */
  onExpand?: () => void;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  preview: 'flex flex-col gap-(--spacing-2) max-w-[480px]',
  previewText: cn(
    'font-(family-name:--font-family-code) text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
    'text-(--color-text-primary) whitespace-pre-wrap [word-break:break-word] max-h-[240px] overflow-y-auto',
  ),
  footer: 'flex items-center justify-between gap-(--spacing-2)',
  meta: 'text-(length:--text-supporting-size) text-(--color-text-secondary)',
} as const;

// =============================================================================
// Helpers
// =============================================================================

function formatLabel(text: string): string {
  const lines = text.split('\n').length;
  const chars = text.length;
  return lines > 1 ? `${lines} lines, ${chars} chars` : `${chars} chars`;
}

// =============================================================================
// Component
// =============================================================================

export function ChatPastedTextToken({
  text,
  onExpand,
}: ChatPastedTextTokenProps) {
  const t = useTranslator();
  const label = formatLabel(text);

  const cardContent = (
    <div className={styles.preview}>
      <div className={styles.previewText}>{text}</div>
      <div className={styles.footer}>
        <span className={styles.meta}>{label}</span>
        {onExpand && (
          <Button
            label={t('@solo.chat.pastedText.expand')}
            variant="ghost"
            size="sm"
            onClick={onExpand}
          />
        )}
      </div>
    </div>
  );

  return (
    <HoverCard
      content={cardContent}
      placement="above"
      alignment="start"
      hasHoverIndication={false}>
      <Badge label={label} variant="neutral" />
    </HoverCard>
  );
}

ChatPastedTextToken.displayName = 'ChatPastedTextToken';
