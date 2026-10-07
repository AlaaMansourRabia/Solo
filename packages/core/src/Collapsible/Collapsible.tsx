'use client';

/**
 * @file Collapsible.tsx
 * @input Uses React, Tailwind classes, useCollapsible hook, CollapsibleGroupPresentationContext, getIcon, theme tokens
 * @output Exports Collapsible component and CollapsibleProps
 * @position Collapsible content primitive — trigger toggles visibility of children
 *
 * Collapsible is a standalone primitive that makes any content collapsible.
 * It renders a trigger area (always visible) and a content area that toggles.
 * Handles state management, accessibility (aria-expanded + aria-controls linking
 * the trigger to its content region), and chevron indicator.
 *
 * Works standalone or coordinated by CollapsibleGroup via the `value` prop.
 * When the surrounding CollapsibleGroup sets `hasDividers`, each Collapsible
 * draws its own row chrome (borderBlockStart suppressed on :first-child, plus
 * density padding) from CollapsibleGroupPresentationContext — the group does
 * not style its items from outside. The presentation
 * context is reset around children so nested collapsibles stay chrome-free.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Collapsible/index.ts (exports)
 * - /packages/core/src/Collapsible/Collapsible.doc.mjs
 * - /apps/storybook/stories/Collapsible.stories.tsx
 */

import {use, useId, type ReactNode} from 'react';
import {cn} from '../utils/cn';

import {useCollapsible} from './useCollapsible';
import {CollapsibleGroupPresentationContext} from './CollapsibleGroupContext';
import type {CollapsibleChevronPosition} from './CollapsibleGroupContext';
import {Icon} from '../Icon';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';

const styles = {
  root: 'w-full',
  // Trigger button — full width, flex row, no browser button styling.
  // Anchors heading-adjacent typography (body family, large size, semibold)
  // so the label reads as a section header regardless of where the
  // Collapsible is placed. External themes retarget it independently from the
  // content via the `solo-collapsible-trigger` target — e.g. a heading font
  // on the trigger while the content stays on the body font.
  // Restore a keyboard-only focus ring using the standard token/offset
  // (WCAG 2.4.7) — composed at the call site.
  trigger: cn(
    'box-border flex items-center justify-between w-full',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'font-(family-name:--font-family-body) text-(length:--text-large-size)',
    'font-(number:--font-weight-semibold) text-(--color-text-primary)',
    'text-start py-0',
  ),
  // Capsize: trim leading from text triggers
  triggerLabel: cn(
    '[text-box-edge:cap_alphabetic] [text-box-trim:trim-both]',
    // Fill the row rather than hug the label. For a text trigger this changes
    // nothing — `space-between` already had it against the start edge and the
    // chevron against the end — but it is what lets a composed trigger put
    // something out at the far edge, next to the chevron, rather than trailing
    // the label with the free space stranded after it.
    //
    // Growing only. The flex floor stays at `auto`, so a label still cannot be
    // squeezed narrower than its own content and nothing that used to fit
    // starts overlapping the chevron.
    'grow',
  ),
  // Disabled trigger — non-interactive, dimmed. Native `disabled` on the
  // button blocks click + keyboard activation.
  triggerDisabled: 'cursor-default opacity-50',
  // Chevron indicator
  chevron: cn(
    'inline-flex items-center justify-center shrink-0',
    // The chevron is sized off the trigger's own type size (--text-large-size,
    // 17px), which sits between Icon's `sm` (16px) and `md` (20px) boxes.
    // Pinning the box to the token keeps the glyph exactly the size it was
    // when it was a bare 1em SVG inheriting the trigger's font-size, and keeps
    // it tracking the trigger if a theme retunes that step.
    'w-(--text-large-size) h-(--text-large-size) text-(length:--text-large-size)',
    '[transition-property:transform] [transition-duration:var(--duration-fast)]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  chevronOpen: '[transform:rotate(180deg)]',
  chevronClosed: '[transform:rotate(0deg)]',
  // Leading chevron. `space-between` puts nothing between the arrow and the
  // label — they are adjacent flex children — so the gap is the chevron's own.
  chevronStart: 'me-(--spacing-2)',
  // A leading arrow rotates a quarter turn rather than a half: it points into
  // the row when closed and turns down when open, which is the disclosure
  // convention TreeList already uses. RTL mirrors it so "into the row" still
  // means towards the content, and the mirror is spelled out per state because
  // a bare `transform` would otherwise overwrite the rotation.
  chevronStartOpen:
    '[transform:rotate(90deg)] [&:is([dir=rtl]_*)]:[transform:scaleX(-1)_rotate(90deg)]',
  chevronStartClosed:
    '[transform:rotate(0deg)] [&:is([dir=rtl]_*)]:[transform:scaleX(-1)_rotate(0deg)]',
  // Content area
  contentHidden: 'hidden',
  // Anchors body typography so revealed text renders at the system's body
  // scale (family/size/weight/leading) instead of inheriting from wherever
  // the Collapsible is placed. External themes override via the
  // `solo-collapsible-content` target, independently from the trigger.
  content: cn(
    'pbs-(--spacing-1) font-(family-name:--font-family-body)',
    'text-(length:--text-body-size) font-(number:--text-body-weight)',
    'leading-(--text-body-leading) text-(--color-text-primary)',
  ),
  // Group divider chrome — a hairline above every item except the first.
  // The group's wrapper (or 'all' mode) owns the outer edges.
  divided: cn(
    '[border-block-start-width:var(--border-width)] first:[border-block-start-width:0]',
    '[border-block-start-style:solid] [border-block-start-color:var(--color-border)]',
  ),
} as const;

// Density padding for divided/padded accordion rows. paddingBlock mapping
// follows Table's density scale (spacing-1/2/3); content only pads its end
// so text doesn't sit on the divider below (block-start stays spacing-1).
const densityStyles = {
  triggerCompact: 'py-(--spacing-1)',
  triggerBalanced: 'py-(--spacing-2)',
  triggerSpacious: 'py-(--spacing-3)',
  contentCompact: 'pbe-(--spacing-1)',
  contentBalanced: 'pbe-(--spacing-2)',
  contentSpacious: 'pbe-(--spacing-3)',
} as const;

const triggerDensity = {
  compact: densityStyles.triggerCompact,
  balanced: densityStyles.triggerBalanced,
  spacious: densityStyles.triggerSpacious,
} as const;

const contentDensity = {
  compact: densityStyles.contentCompact,
  balanced: densityStyles.contentBalanced,
  spacious: densityStyles.contentSpacious,
} as const;

export interface CollapsibleProps extends BaseProps {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Content shown in the trigger area (always visible).
   * Rendered inside a button with aria-expanded and a chevron indicator.
   */
  trigger: ReactNode;

  /**
   * Content that collapses/expands when the trigger is clicked.
   */
  children?: ReactNode;

  /**
   * Default open state for standalone uncontrolled usage. Ignored when `value`
   * binds this item to a surrounding CollapsibleGroup.
   * @default true
   */
  defaultIsOpen?: boolean;

  /**
   * Controlled open state for standalone usage. Ignored when `value` binds this
   * item to a surrounding CollapsibleGroup.
   */
  isOpen?: boolean;

  /**
   * Whether the collapsible is disabled. A disabled item can't be toggled —
   * its trigger is non-interactive and dimmed. Following the system-wide
   * disabled convention, the trigger uses `aria-disabled` (not the native
   * `disabled` attribute) and drops out of the tab order, staying perceivable
   * to assistive tech. The content stays in whatever open state it was;
   * disabling doesn't collapse an already-open item.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Callback when standalone open state changes. A surrounding
   * CollapsibleGroup owns grouped state and calls its `onChange` instead.
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Logical position of the disclosure chevron.
   *
   * - `end` (default): a trailing indicator that points down when collapsed and
   *   up when expanded.
   * - `start`: a leading disclosure arrow ahead of the label. It points inward
   *   toward the content when collapsed, mirrors under RTL, and points down when
   *   expanded.
   *
   * Inside a CollapsibleGroup this defaults to the group's `chevronPosition`.
   *
   * @default 'end'
   */
  chevronPosition?: CollapsibleChevronPosition;

  /**
   * Unique identifier for this collapsible within a CollapsibleGroup. When set
   * inside a group, the group owns open state and its `onChange` is the
   * notification callback.
   */
  value?: string;

  /**
   * Test ID for the collapsible element.
   */
  'data-testid'?: string;
}

/**
 * A primitive that makes any content collapsible.
 *
 * Renders a trigger area (always visible) with a chevron indicator,
 * and a content area that toggles visibility on click.
 * Handles its own state by default, or defers to CollapsibleGroup
 * when a `value` prop is provided and a group is present.
 *
 * Use inside Card for elevated collapsible sections.
 * Wrap multiple instances in CollapsibleGroup for accordion behavior.
 *
 * @example
 * ```
 * <Collapsible trigger="Details">
 *   <Text type="body">Collapsible content</Text>
 * </Collapsible>
 * <Card>
 *   <Collapsible trigger="Settings">
 *     <SettingsForm />
 *   </Collapsible>
 * </Card>
 * <CollapsibleGroup type="single" defaultValue="general">
 *   <VStack gap={2}>
 *     <Card>
 *       <Collapsible trigger="General" value="general">
 *         <GeneralSettings />
 *       </Collapsible>
 *     </Card>
 *     <Card>
 *       <Collapsible trigger="Advanced" value="advanced">
 *         <AdvancedSettings />
 *       </Collapsible>
 *     </Card>
 *   </VStack>
 * </CollapsibleGroup>
 * ```
 */
export function Collapsible({
  trigger,
  children,
  defaultIsOpen,
  isOpen: controlledIsOpen,
  isDisabled = false,
  onOpenChange,
  chevronPosition,
  value,
  ref,
  className,
  style,
  ...props
}: CollapsibleProps) {
  // Build the config for the hook
  const collapsibleConfig =
    controlledIsOpen !== undefined
      ? {isOpen: controlledIsOpen, onOpenChange}
      : {defaultIsOpen: defaultIsOpen ?? true, onOpenChange};

  const {isOpen, toggle} = useCollapsible({
    isCollapsible: collapsibleConfig,
    value,
  });

  // Activation is blocked by this guard rather than the native `disabled`
  // attribute, so the trigger keeps `aria-disabled` semantics and stays
  // discoverable. A native `disabled` button would silently swallow events
  // (e.g. a wrapping tooltip's hover) — the system-wide disabled convention.
  const handleToggle = () => {
    if (isDisabled) {
      return;
    }
    toggle();
  };

  const presentation = use(CollapsibleGroupPresentationContext);
  const isDivided = presentation?.hasDividers ?? false;
  const density = presentation?.density ?? null;
  // The item wins over the group so a single row can differ, but the group is
  // the level this is normally set at — mixed sides in one list read as a bug.
  const position = chevronPosition ?? presentation?.chevronPosition ?? 'end';
  const isChevronAtStart = position === 'start';

  // Links the trigger to the region it shows/hides so assistive tech can move
  // from the button to its controlled content (disclosure pattern).
  const contentId = useId();

  const chevron = (
    <Icon
      // The glyph is part of the placement, not a separate choice: a trailing
      // indicator points down and flips up, a leading one points into the row
      // and turns down. Rotating `chevronDown` by a quarter turn would leave
      // the closed state pointing the wrong way.
      icon={isChevronAtStart ? 'chevronRight' : 'chevronDown'}
      // Nearest size to the trigger's 17px type step; `chevron` re-pins the
      // exact box (see the style) so the glyph does not resize.
      size="sm"
      // Was `--color-icon-secondary` on the old wrapper span; `secondary`
      // is the same token, expressed as an Icon color.
      color="secondary"
      className={cn(
        styles.chevron,
        isChevronAtStart && styles.chevronStart,
        isChevronAtStart
          ? isOpen
            ? styles.chevronStartOpen
            : styles.chevronStartClosed
          : isOpen
            ? styles.chevronOpen
            : styles.chevronClosed,
      )}
    />
  );

  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('collapsible', {
          density: density ?? undefined,
          divided: isDivided ? 'divided' : null,
        }),
        cn(styles.root, isDivided && styles.divided),
        className,
        style,
      )}
      {...props}>
      <button
        type="button"
        onClick={handleToggle}
        aria-disabled={isDisabled || undefined}
        aria-expanded={isOpen}
        aria-controls={contentId}
        // A disabled trigger drops out of the tab order so it isn't a silently
        // dead tab stop; activation stays blocked by the handleToggle guard,
        // and aria-disabled keeps the state perceivable to assistive tech —
        // the system-wide disabled convention (never native `disabled`, which
        // would swallow events like a wrapping tooltip's hover).
        tabIndex={isDisabled ? -1 : undefined}
        {...mergeProps(
          themeProps('collapsible-trigger', {
            density: density ?? undefined,
            chevronPosition: position,
            open: isOpen ? 'open' : null,
            disabled: isDisabled ? 'disabled' : null,
          }),
          cn(
            focusOutlineStyles.focusVisible,
            styles.trigger,
            density != null && triggerDensity[density],
            // The system's pressed overlay on the disclosure row. The trigger
            // has no hover surface of its own, so this is the one background
            // it paints, and only while it is pressed.
            !isDisabled && interactionOverlayStyles.pressedBackgroundColor,
            isDisabled && styles.triggerDisabled,
          ),
        )}>
        {isChevronAtStart && chevron}
        <span className={styles.triggerLabel}>{trigger}</span>
        {!isChevronAtStart && chevron}
      </button>
      <div
        id={contentId}
        {...mergeProps(
          themeProps('collapsible-content', {
            density: density ?? undefined,
            open: isOpen ? 'open' : null,
          }),
          cn(
            styles.content,
            density != null && contentDensity[density],
            !isOpen && styles.contentHidden,
          ),
        )}>
        {presentation != null ? (
          <CollapsibleGroupPresentationContext value={null}>
            {children}
          </CollapsibleGroupPresentationContext>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

Collapsible.displayName = 'Collapsible';
