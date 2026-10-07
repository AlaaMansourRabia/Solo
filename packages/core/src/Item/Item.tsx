'use client';

/**
 * @file Item.tsx
 * @input Uses React, ReactNode, Tailwind classes, theme tokens, useClickableContainer
 * @output Exports Item component, ItemProps type; publishes the shared inline inset
 * @position Core layout primitive; consumed by index.ts, tested by Item.test.tsx
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Item/Item.doc.mjs
 * - /packages/core/src/Item/Item.test.tsx
 * - /packages/core/src/Item/index.ts
 * - /apps/storybook/stories/Item.stories.tsx
 */

import {useId, useRef, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {cn, isRenderable, mergeProps} from '../utils';
import {ItemDescriptionContext} from './ItemDescriptionContext';
import {useMergedRefs} from '../hooks/useMergedRefs';
import {computeTargetAndRel} from '../Link/computeTargetAndRel';
import {useLinkComponent} from '../Link/useLinkComponent';
import {useClickableContainer} from '../hooks/useClickableContainer';
import {useDevWarning} from '../hooks/useDevWarning';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';

// =============================================================================
// Types
// =============================================================================

export type ItemAlign = 'center' | 'start';
export type ItemDensity = 'compact' | 'balanced' | 'spacious';

export interface ItemProps extends BaseProps<HTMLElement> {
  /** Ref forwarded to the root element. */
  ref?: React.Ref<HTMLElement>;

  /**
   * What the root renders as: an HTML element, or a component for a caller
   * that needs the root to be something else. A menu row that navigates
   * passes the application's link component here, so the row's root IS the
   * anchor and a modified or middle click keeps the browser's meaning.
   *
   * Give a component only when the row carries a `role`, so the parent owns
   * keyboard access and the row adds no second tab stop; and only when no
   * interactive node sits in `startContent` or `endContent`, since a control
   * nested inside an anchor is invalid.
   * @default 'div'
   */
  as?: 'div' | 'li' | 'span' | React.ElementType;

  /**
   * Marker rendered before startContent as a direct flex child.
   * Use for list bullets/counters that need custom baseline alignment.
   */
  marker?: ReactNode;

  /**
   * Content rendered before the label/description area.
   * Use for leading icons, avatars, or checkboxes.
   */
  startContent?: ReactNode;

  /**
   * Primary text identifying this item. Required.
   * Accepts string (auto-styled) or ReactNode (for rich content).
   */
  label: ReactNode;

  /**
   * Secondary text — subtitle, description, or supporting info.
   */
  description?: ReactNode;

  /**
   * Content rendered after the label/description area.
   * Use for badges, metadata, timestamps, or action buttons.
   */
  endContent?: ReactNode;

  /**
   * Vertical alignment of the start/end content slots.
   * @default 'center'
   */
  align?: ItemAlign;

  /**
   * Density: "compact" (4px block padding), "balanced" (8px block padding),
   * or "spacious" (12px block and inline padding).
   * @default 'balanced'
   */
  density?: ItemDensity;

  /**
   * Max lines before label truncates. When set, overflow is hidden
   * and text-overflow: ellipsis is applied.
   */
  labelLines?: number;

  /**
   * Max lines before description truncates. When set, overflow is hidden
   * and text-overflow: ellipsis is applied.
   */
  descriptionLines?: number;

  /**
   * How the label and description sit together. `stacked` puts the description
   * on its own line below the label; `inline` keeps both on one line, with the
   * description ellipsizing first, so the row fits a fixed-height host.
   *
   * @default 'stacked'
   */
  layout?: 'stacked' | 'inline';

  /**
   * Click handler. Makes the item clickable with button semantics.
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Ref to a nested control inside the item (e.g. a checkbox in
   * `startContent`) that already provides the item's keyboard access and
   * action. When set, the item becomes an enlarged click/tap target that
   * delegates surface clicks to that control via the `useClickableContainer`
   * pattern: it renders no invisible button/anchor, so the row adds no second
   * tab stop (WCAG 4.1.2 — one focusable control per option). Clicks on the
   * control itself, and on any other nested interactive element, are left to
   * that element. Mutually exclusive with `onClick`/`href` — when
   * `interactiveRef` is set those are ignored (the nested control is the sole
   * action).
   */
  interactiveRef?: React.RefObject<HTMLElement | null>;

  /**
   * Link URL. Makes the item a link via an invisible anchor element. A row
   * whose root is already a link component (see `as`) carries the address on
   * that root instead, and no invisible anchor is rendered.
   */
  href?: string;

  /**
   * Link target (e.g., '_blank'). Only used with href.
   */
  target?: '_blank' | '_self';

  /**
   * Link relationship. Automatically includes noopener noreferrer when
   * target is "_blank".
   */
  rel?: string;

  /**
   * Highlighted state (hover/keyboard focus appearance).
   * @default false
   */
  isHighlighted?: boolean;

  /**
   * Selected state. Always applies the selected visual styling. When `role`
   * permits it (option, tab, row, gridcell, columnheader, rowheader, treeitem)
   * the state is exposed as `aria-selected`; otherwise (e.g. a listitem or a
   * bare div, where `aria-selected` is invalid ARIA) it falls back to
   * `aria-current="true"` so assistive tech is still told which item is
   * selected. A consumer-provided `aria-current` always wins.
   * @default false
   */
  isSelected?: boolean;

  /**
   * Disabled state.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Test ID for testing frameworks.
   */
  'data-testid'?: string;
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Roles on which WAI-ARIA permits the aria-selected attribute.
 * https://www.w3.org/TR/wai-aria-1.2/#aria-selected
 */
const ARIA_SELECTED_ROLES = new Set([
  'option',
  'tab',
  'row',
  'gridcell',
  'columnheader',
  'rowheader',
  'treeitem',
]);

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: cn(
    'flex items-center gap-(--spacing-2)',
    // The inline inset is published as --_item-inset-inline and the padding
    // derives from it, so consumers that need to compensate for the inset
    // (List's edgeCompensation) read the var instead of mirroring the values.
    // Themes that set paddingInline on `item` also feed this var via the
    // derived var registry, keeping padding and compensation in sync.
    '[--_item-inset-inline:var(--spacing-2)] px-(--_item-inset-inline)',
    'relative box-border text-start rounded-(--radius-element)',
  ),
  alignStart: 'items-start',
  interactive: cn(
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition-property:background-color]',
    '[transition-duration:var(--duration-fast-min)]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  // Highlighted/selected replace the interaction overlay's background in every
  // state, so its hover/press arms are restated with the same variant chains
  // for `cn()` to drop.
  highlighted: cn(
    'bg-(--color-overlay-hover) usable:active:bg-(--color-overlay-hover)',
    'can-hover:usable:hover:bg-(--color-overlay-hover) can-hover:usable:active:bg-(--color-overlay-hover)',
  ),
  selected: cn(
    'bg-(--color-accent-muted) usable:active:bg-(--color-accent-muted)',
    'can-hover:usable:hover:bg-(--color-accent-muted) can-hover:usable:active:bg-(--color-accent-muted)',
  ),
  disabled:
    'cursor-default [&:is(:disabled,[aria-disabled=true])]:cursor-default pointer-events-none',
  // A row whose root is the link: the browser's anchor paint stays out of it.
  linkRoot: 'text-inherit no-underline',
  disabledContent: 'opacity-50',
  invisibleButton: cn(
    'cursor-[inherit] [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'text-inherit flex flex-col flex-1 min-w-0 text-start [outline:none]',
  ),
  invisibleAnchor: cn(
    'cursor-[inherit] [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'text-inherit flex flex-col flex-1 min-w-0 text-start no-underline [outline:none]',
  ),
  content: 'flex flex-col flex-1 min-w-0 text-start',
  // `layout="inline"`: label and description share one line, so the row fits a
  // fixed-height host such as a Selector trigger inside an InputGroup.
  // Centered, not baseline-aligned: two different font sizes on a shared
  // baseline make a line box taller than either line, which would push a
  // fixed-height host (a Selector trigger) a pixel off its size token.
  inlineContent: 'flex-row items-center gap-x-(--spacing-1)',
  inlineLabel: 'shrink-0',
  // The description yields width first, so the label — the part that identifies
  // the item — is the last thing to ellipsize.
  inlineDescription: 'shrink min-w-0',
  // Falls back to the primary text token; a parent (e.g. a destructive menu
  // item) can recolor the label by setting --_item-label-color.
  label: cn(
    '[color:var(--_item-label-color,var(--color-text-primary))]',
    'text-(length:--text-body-size) leading-(--text-body-leading)',
  ),
  labelSingleTruncate: 'overflow-hidden text-ellipsis whitespace-nowrap',
  labelMultiTruncate:
    'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]',
  // Companion to --_item-label-color for the secondary line.
  description: cn(
    '[color:var(--_item-description-color,var(--color-text-secondary))]',
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
  ),
  descriptionSingleTruncate: 'overflow-hidden text-ellipsis whitespace-nowrap',
  descriptionMultiTruncate:
    'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]',
  startContent: 'flex-[0_0_auto] flex',
  endContent: 'flex-[0_0_auto] flex ms-auto',
} as const;

/** Multi-line clamps set `-webkit-line-clamp` inline (a per-row number). */
function lineClampStyle(lines: number): React.CSSProperties {
  return {WebkitLineClamp: lines};
}

const densityStyles = {
  compact: 'py-(--spacing-1)',
  balanced: 'py-(--spacing-2)',
  spacious: 'py-(--spacing-3) [--_item-inset-inline:var(--spacing-3)]',
} as const;

// =============================================================================
// Component
// =============================================================================

/**
 * A universal item primitive that unifies the "start content + label +
 * description + end content" layout pattern. Use as a building block for list items,
 * menu items, contact rows, notification items, and more.
 *
 * @example
 * ```
 * <Item
 *   startContent={<Avatar src={user.avatar} size="sm" />}
 *   label={user.name}
 *   description={user.role}
 *   endContent={<Badge>Admin</Badge>}
 *   onClick={() => navigate(`/users/${user.id}`)}
 * />
 * ```
 */
export function Item({
  as: Component = 'div',
  marker,
  startContent,
  label,
  description,
  endContent,
  align = 'center',
  density = 'balanced',
  labelLines,
  descriptionLines,
  layout = 'stacked',
  onClick,
  interactiveRef,
  href,
  target: targetFromProps,
  rel: relFromProps,
  isHighlighted = false,
  isSelected = false,
  isDisabled = false,
  className,
  style,
  ref,
  role,
  ...restProps
}: ItemProps) {
  const LinkComponent = useLinkComponent();

  // Delegation mode: the row is an enlarged click/tap target for a nested
  // control (e.g. a checkbox) that owns the keyboard access and action. The
  // control is the row's only tab stop; the row proxies surface clicks to it.
  const isDelegate = interactiveRef != null;
  const containerRef = useRef<HTMLElement | null>(null);
  // Only onClick is needed: onMouseUp handles middle-click href navigation,
  // which delegation mode never has (href is ignored here).
  const {onClick: delegatedOnClick} = useClickableContainer({
    containerRef,
    interactiveRef: interactiveRef ?? undefined,
    disabled: isDisabled,
  });

  useDevWarning(
    'Item',
    '`interactiveRef` is mutually exclusive with `onClick`/`href`. In ' +
      'delegation mode the row only forwards clicks to the referenced control, ' +
      'so `onClick`/`href` are ignored. Drop one of them.',
    isDelegate && (onClick != null || href != null),
  );

  const isInteractive = onClick != null || href != null || isDelegate;
  const {target, rel} = computeTargetAndRel(targetFromProps, relFromProps);
  // When a semantic role is provided (e.g. "menuitem"), a parent component
  // handles keyboard access. Skip the invisible button/anchor and put
  // onClick directly on the root element instead.
  const hasParentRole = role != null;
  // The root is whatever `as` says it is. A caller that passed a link
  // component means the root itself is the anchor, so the address rides it
  // and the invisible anchor below is not rendered.
  const isLinkRoot = typeof Component !== 'string' && href != null;
  const linkRootProps = isLinkRoot
    ? {
        // A disabled row keeps its place in the tree but goes nowhere.
        href: isDisabled ? undefined : href,
        target: isDisabled ? undefined : target,
        rel: isDisabled ? undefined : rel,
      }
    : null;
  // aria-selected is only valid on selectable roles (option, tab, treeitem,
  // grid cells). On the default div/li root the attribute is invalid ARIA
  // (axe: aria-allowed-attr), so selection stays visual-only there — callers
  // that need selection semantics pass a permitted role.
  const allowsAriaSelected = role != null && ARIA_SELECTED_ROLES.has(role);

  // The description element's id, published through ItemDescriptionContext so a
  // control Item renders in a slot can point at it with `aria-describedby`.
  // `isRenderable` rather than `!= null` so the common empty values — `null`,
  // `undefined`, `false`, `''` — publish no id and leave a consumer with no
  // dangling reference. It is a shallow check: content that renders nothing
  // only once React runs it, such as an empty fragment, still publishes an id.
  const descriptionID = useId();
  const hasRenderableDescription = isRenderable(description);

  const isStringLabel = typeof label === 'string';
  const isStringDescription = typeof description === 'string';

  const labelTruncateStyle =
    labelLines != null
      ? labelLines === 1
        ? styles.labelSingleTruncate
        : styles.labelMultiTruncate
      : isStringLabel
        ? styles.labelSingleTruncate
        : null;

  // Inline rows are one line by definition, so the description always
  // ellipsizes there — a ReactNode description cannot wrap the row open.
  const isInline = layout === 'inline' && description != null;

  const descriptionTruncateStyle =
    descriptionLines != null
      ? descriptionLines === 1
        ? styles.descriptionSingleTruncate
        : styles.descriptionMultiTruncate
      : isStringDescription || isInline
        ? styles.descriptionSingleTruncate
        : null;

  const labelAndDescription = (
    <>
      <span
        className={cn(
          styles.label,
          isInline && styles.inlineLabel,
          labelTruncateStyle,
        )}
        style={
          labelLines != null && labelLines > 1
            ? lineClampStyle(labelLines)
            : undefined
        }>
        {label}
      </span>
      {description != null && (
        <span
          id={hasRenderableDescription ? descriptionID : undefined}
          className={cn(
            styles.description,
            isInline && styles.inlineDescription,
            descriptionTruncateStyle,
          )}
          style={
            descriptionLines != null && descriptionLines > 1
              ? lineClampStyle(descriptionLines)
              : undefined
          }>
          {description}
        </span>
      )}
    </>
  );

  const handleContainerClick = (e: React.MouseEvent) => {
    if (isDisabled) {
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea')) {
      return;
    }
    onClick?.(e);
  };

  const innerContent = (
    <>
      {marker}
      {startContent != null && (
        <span className={styles.startContent}>{startContent}</span>
      )}

      {hasParentRole || isDelegate ? (
        // Delegation mode (and parent-role mode) put the label in a plain span:
        // keyboard access lives on the nested control, so no invisible
        // button/anchor is rendered and the row adds no second tab stop.
        <span
          className={cn(
            styles.content,
            isInline && styles.inlineContent,
            isDisabled && styles.disabledContent,
          )}>
          {labelAndDescription}
        </span>
      ) : href != null && !isLinkRoot ? (
        <LinkComponent
          href={href}
          target={target}
          rel={rel}
          aria-disabled={isDisabled || undefined}
          tabIndex={isDisabled ? -1 : undefined}
          className={cn(
            styles.invisibleAnchor,
            isInline && styles.inlineContent,
            isDisabled && styles.disabledContent,
          )}>
          {labelAndDescription}
        </LinkComponent>
      ) : onClick != null ? (
        <button
          type="button"
          onClick={onClick}
          disabled={isDisabled}
          className={cn(
            styles.invisibleButton,
            isInline && styles.inlineContent,
            isDisabled && styles.disabledContent,
          )}>
          {labelAndDescription}
        </button>
      ) : (
        <span
          className={cn(
            styles.content,
            isInline && styles.inlineContent,
            isDisabled && styles.disabledContent,
          )}>
          {labelAndDescription}
        </span>
      )}

      {endContent != null && (
        <span
          className={cn(
            styles.endContent,
            isDisabled && styles.disabledContent,
          )}>
          {endContent}
        </span>
      )}
    </>
  );

  const mergedRef = useMergedRefs(ref, containerRef);

  return (
    <Component
      ref={(isDelegate ? mergedRef : ref) as React.Ref<never>}
      {...restProps}
      {...linkRootProps}
      aria-selected={(allowsAriaSelected && isSelected) || undefined}
      // aria-selected is invalid on roles that don't permit it (listitem, a
      // bare div, etc.). For those, convey selection via aria-current — valid
      // on any element — so the state still reaches AT. Written after
      // {...restProps} so it must defer to a consumer-provided aria-current.
      aria-current={
        restProps['aria-current'] ??
        (isSelected && !allowsAriaSelected ? true : undefined)
      }
      aria-disabled={isDisabled || undefined}
      {...mergeProps(
        themeProps('item', {density, align}),
        {
          className: cn(
            focusOutlineStyles.focusWithin,
            styles.root,
            densityStyles[density],
            align === 'start' && styles.alignStart,
            isInteractive && styles.interactive,
            isInteractive && interactionOverlayStyles.backgroundColor,
            isLinkRoot && styles.linkRoot,
            isHighlighted && styles.highlighted,
            isSelected && styles.selected,
            isDisabled && !hasParentRole && styles.disabled,
          ),
        },
        className,
        style,
      )}
      role={role}
      onClick={
        isDelegate
          ? delegatedOnClick
          : hasParentRole
            ? onClick
            : isInteractive
              ? handleContainerClick
              : undefined
      }>
      <ItemDescriptionContext
        value={hasRenderableDescription ? descriptionID : null}>
        {innerContent}
      </ItemDescriptionContext>
    </Component>
  );
}

Item.displayName = 'Item';
