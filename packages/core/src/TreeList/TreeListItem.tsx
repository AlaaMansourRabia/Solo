'use client';

/**
 * @file TreeListItem.tsx
 * @input Uses React, Tailwind classes, theme tokens, TreeListBranches
 * @output Exports TreeListItem component (internal, not publicly exported)
 * @position Internal implementation; consumed by TreeList.tsx
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/TreeList/TreeList.doc.mjs
 * - /packages/core/src/TreeList/TreeList.tsx
 */

import {useId, useMemo, type ReactNode} from 'react';
import {spacingVars} from '../theme/tokenVars';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';
import {Icon} from '../Icon';
import {mergeProps} from '../utils';
import {useLinkComponent} from '../Link/useLinkComponent';
import {TreeListBranches} from './TreeListBranches';
import type {TreeListDensity, TreeListVariant} from './TreeListTypes';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';

// =============================================================================
// Styles
// =============================================================================

const styles = {
  wrapper: cn(
    'list-none m-0 p-0 relative w-full',
    // The treeitem row is the roving-tabindex focus owner; suppress the
    // native focus ring in favor of the row's :focus-visible outline below.
    '[outline:none]',
    // Publish this row's own focus state as an inheritable CSS variable
    // instead of matching it via an ancestor selector. Every nested <li>
    // redeclares these vars (default: 'none' / '0'), so a descendant row's
    // default shadows an ancestor's active value — the ring can never leak
    // past the nearest containing treeitem, however deep the tree nests.
  ),
  childGroup: 'm-0 p-0 list-none',
  treeBranches: 'ps-(--spacing-2)',
  // Inter-row gap. Half the public `--tree-list-row-gap` lever sits above and
  // half below the row box; because this is PADDING (not margin) it cannot
  // collapse, so adjacent rows end up a full gap apart — and it rides the
  // `rowWrapper`, which carries no theme target, so the paintable
  // `tree-list-item` stays a pure paint seam (layout lives off it). The <li>s
  // stay contiguous — the gap is padding INSIDE each <li>, not space between
  // them — so the per-<li> connector guide can still span it and read as a
  // continuous line (see TreeListBranches). The lever's default is a subtle
  // `--spacing-0-5` (2px, set on the tree-list root); a theme widens or closes
  // it via the `tree-list` target.
  rowWrapper: 'relative py-[calc(var(--tree-list-row-gap,0px)/2)]',
  contentWrapper: cn(
    'rounded-(--radius-element) flex items-center gap-(--spacing-2) px-(--spacing-2)',
    // No `[outline:none]` here: this element receives the shared focus ring,
    // which already defaults to none, and the shorthand would erase it.
    'overflow-hidden relative box-border text-start',
    // Per-level indent. Declared here (not inline) so it lives in a class and
    // the theme layer can override it in normal cascade order — an inline
    // longhand would outrank every layer. The row publishes only the computed
    // distance as `--_tree-indent`; the per-level step is the public
    // `--tree-list-indent` lever (see TreeList `root`).
    'ms-[var(--_tree-indent,0px)]',
  ),
  interactive: cn(
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[transition-property:background-image]',
    '[transition-duration:var(--duration-fast)]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  disabled: 'cursor-default opacity-50 pointer-events-none',
  selected: 'bg-(--color-accent-muted)',
  invisibleButton: cn(
    '[cursor:inherit] [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[font:inherit] [color:inherit] flex flex-col flex-1 min-w-0 text-start',
    // Suppress inner focus ring — the parent <li> handles it via :has(:focus-visible)
    '[outline:none]',
  ),
  invisibleAnchor: cn(
    '[cursor:inherit] [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[font:inherit] [color:inherit] flex flex-col flex-1 min-w-0 text-start',
    'no-underline',
    // Suppress inner focus ring — the parent <li> handles it via :has(:focus-visible)
    '[outline:none]',
  ),
  content: 'flex flex-col flex-1 min-w-0 text-start',
  label: 'text-(--color-text-primary)',
  description: 'text-(--color-text-secondary)',
  startContent: 'shrink-0 flex items-center',
  endContent: 'shrink-0 flex items-center ms-auto',
  chevronContainer: cn(
    'shrink-0 flex items-center justify-center',
    'w-(--spacing-4) h-(--spacing-4) text-(length:--spacing-4)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[border-width:0] [border-style:none] bg-transparent p-0',
    'text-(--color-icon-secondary) rounded-(--radius-inner)',
    'ms-(--spacing-1) me-[calc(var(--spacing-1)*-1)]',
  ),
  chevronButton: cn(
    'flex items-center justify-center',
    'w-(--spacing-4) h-(--spacing-4) text-(length:--spacing-4)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'text-(--color-icon-secondary) rounded-(--radius-inner)',
    'ms-(--spacing-1) me-[calc(var(--spacing-1)*-1)]',
  ),
  chevronSvg: cn(
    'flex',
    // The chevron column is sized in spacing tokens by the button/container
    // around it (--spacing-4 = 16px), not on Icon's rem scale, so the glyph's
    // box is pinned to that same token. Icon's `sm` (1rem) only coincides with
    // 16px at a 16px root font-size; drifting off the token would knock the
    // glyph out of its 16px column.
    'w-(--spacing-4) h-(--spacing-4) text-(length:--spacing-4)',
    '[transition-property:transform]',
    '[transition-duration:var(--duration-fast)]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  // The RTL mirror is folded into each state's transform rather than living on
  // a parent span. Both are `transform`, so on one element the later value
  // would win — spelling out `scaleX(-1) rotate(...)` per state composes them
  // exactly as the nested elements did, while leaving a single element to
  // carry the glyph's theme target.
  chevronExpanded:
    '[transform:rotate(90deg)] [&:is([dir=rtl]_*)]:[transform:scaleX(-1)_rotate(90deg)]',
  chevronCollapsed:
    '[transform:rotate(0deg)] [&:is([dir=rtl]_*)]:[transform:scaleX(-1)_rotate(0deg)]',
} as const;

const densityStyles = {
  compact:
    'py-(--spacing-1) text-(length:--text-body-size) leading-(--text-body-leading)',
  balanced:
    'py-(--spacing-2) text-(length:--text-body-size) leading-(--text-body-leading)',
  spacious:
    'py-(--spacing-3) text-(length:--text-body-size) leading-(--text-body-leading)',
} as const;

const descriptionSizeStyles = {
  compact:
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
  balanced:
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
  spacious:
    'text-(length:--text-supporting-size) leading-(--text-supporting-leading)',
} as const;

// `CSSProperties` has no index signature for custom properties, so the row's
// inline style — which publishes the computed indent distance as the private
// `--_tree-indent` — needs this augmentation to typecheck.
type IndentStyle = React.CSSProperties & Record<'--_tree-indent', string>;

// =============================================================================
// Types
// =============================================================================

export interface TreeListItemInternalProps {
  id: string;
  label: React.ReactNode;
  description?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  target?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  /** Consumer class for the row element. See `TreeListItemData`. */
  className?: string;
  style?: React.CSSProperties;
  hasChildren: boolean;
  /**
   * Whether the tree contains at least one expandable item anywhere (i.e. a
   * caret exists somewhere to align labels under). A leaf reserves the chevron
   * column — the extra offset that lines its label up past an expandable
   * ancestor/sibling's caret — whenever this is true, so it stays indented
   * beyond its parent's label. Only a fully flat tree (no expandable items at
   * all) has no caret to align under, so its rows sit flush (no chevron-column
   * offset). Computed once for the whole tree by TreeList.
   */
  hasExpandableItems: boolean;
  nestedLevel: number;
  isLast: boolean;
  ancestorsIsLast: ReadonlyArray<boolean>;
  isExpanded: boolean;
  onToggle?: (id: string) => void;
  density: TreeListDensity;
  /**
   * Guide-line visual treatment. `noGuides` suppresses the connector lines;
   * indentation is unaffected (it lives on the row's `marginLeft`, not the
   * guide element).
   */
  variant: TreeListVariant;
  /** Pre-rendered children subtree (rendered by the parent recursion) */
  renderedChildren?: ReactNode;
  /** 1-based position of this item among its siblings (aria-posinset). */
  posInSet: number;
  /** Number of siblings at this level (aria-setsize). */
  setSize: number;
  /**
   * Whether this treeitem is the initial roving-tabindex seed. Exactly one
   * treeitem is seeded tabbable at mount; useTreeFocus (hasRovingTabIndex)
   * then owns the tab stop dynamically.
   */
  isTabbable: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function TreeListItem({
  id,
  label,
  description,
  startContent,
  endContent,
  className,
  style,
  onClick,
  href,
  target,
  isDisabled = false,
  isSelected = false,
  hasChildren,
  hasExpandableItems,
  nestedLevel,
  isLast,
  ancestorsIsLast,
  isExpanded,
  onToggle,
  density,
  variant,
  renderedChildren,
  posInSet,
  setSize,
  isTabbable,
}: TreeListItemInternalProps) {
  const t = useTranslator();
  const labelId = useId();
  const descriptionId = useId();
  const LinkComponent = useLinkComponent();
  const isInteractive = onClick != null || href != null;

  const handleToggle = useMemo(
    () =>
      hasChildren && onToggle != null
        ? (e: React.MouseEvent) => {
            e.stopPropagation();
            onToggle(id);
          }
        : undefined,
    [hasChildren, onToggle, id],
  );

  const handleClick = useMemo(() => {
    if (onClick != null || (hasChildren && onToggle != null)) {
      return (e: React.MouseEvent) => {
        if (isDisabled) {
          return;
        }
        const el = e.target as HTMLElement;
        if (el.closest('button, a, input, select, textarea')) {
          return;
        }
        if (onClick != null) {
          onClick(e);
        } else if (hasChildren && onToggle != null) {
          onToggle(id);
        }
      };
    }
    return undefined;
  }, [onClick, hasChildren, onToggle, id, isDisabled]);

  // Per-level indent distance. The per-level step is the public, themeable
  // `--tree-list-indent` lever (default `--spacing-4`, set on the tree-list
  // root). A leaf adds a fixed chevron-column offset (chevron width + gap) so
  // its label lines up past an expandable ancestor/sibling's caret — but ONLY
  // when the tree actually contains an expandable item somewhere. In a fully
  // flat tree there is no caret to align under, so the offset is pointless and
  // every row sits flush, like a parent at that level. That offset is tied to
  // the chevron's own dimensions, not the indent step, so it does not scale
  // with the lever. Published as the private `--_tree-indent` and consumed by
  // `contentWrapper`'s stylesheet `margin-inline-start` (kept out of the inline
  // style so the theme layer can override it).
  const reservesChevronColumn = !hasChildren && hasExpandableItems;
  const indentDistance = reservesChevronColumn
    ? `calc(${nestedLevel} * var(--tree-list-indent) + ${spacingVars['--spacing-4']} + ${spacingVars['--spacing-2']})`
    : `calc(${nestedLevel} * var(--tree-list-indent))`;
  const indentStyle: IndentStyle = {'--_tree-indent': indentDistance};

  const labelAndDescription = (
    <>
      <span
        id={labelId}
        {...mergeProps(
          // Stable theme target for the item's label text. The label carries no
          // themeable handle today, so a theme can only reach it through a
          // fragile structural selector (a content button's first span). This
          // adds an `solo-tree-list-item-label` class and reflects the row's
          // `selected` state so a theme can, e.g., bold just the selected
          // item's label via `defineTheme`.
          themeProps('tree-list-item-label', {
            selected: isSelected ? 'selected' : null,
          }),
          {className: styles.label},
        )}>
        {label}
      </span>
      {description != null && (
        <span
          id={descriptionId}
          className={cn(styles.description, descriptionSizeStyles[density])}>
          {description}
        </span>
      )}
    </>
  );

  // <Icon> renders the glyph's span itself — carrying the pre-existing
  // solo-icon target — so the rotation rides on that same element instead of
  // an extra wrapper: a theme can still restyle the mark and its open/closed
  // transform through one selector.
  const chevronIcon = (
    <Icon
      icon="chevronRight"
      // Nearest size to the 16px chevron column; `chevronSvg` re-pins the exact
      // box because the column is spacing-token-sized, not rem-sized.
      size="sm"
      // The button/container owns the chevron color (--color-icon-secondary);
      // inheriting keeps that as the single source.
      color="inherit"
      className={cn(
        styles.chevronSvg,
        isExpanded ? styles.chevronExpanded : styles.chevronCollapsed,
      )}
    />
  );

  const chevron = hasChildren ? (
    handleToggle != null ? (
      // Real toggle button whenever expand/collapse is supported, so the row
      // can be expanded from the keyboard even when the item has no onClick/href
      // (row-level onClick is the only click path in that case, but there is no
      // focusable element to receive Enter/Space). The row's handleClick ignores
      // clicks originating inside a <button>, so this never double-toggles.
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-label={t('@solo.treeList.toggleChildren')}
        // Stable identity for TreeList's activateItem selector — do not
        // remove without also updating TreeList.tsx.
        data-tree-toggle=""
        disabled={isDisabled}
        // Roving tabindex lives on the treeitem row; the chevron toggle is not
        // a separate tab stop. Row-level Enter/Space forwards to this button.
        tabIndex={-1}
        onClick={handleToggle}
        {...mergeProps(
          // Stable theme target for the expand/collapse control. `data-tree-toggle`
          // stays as the functional activation hook; this adds a themeable
          // `solo-tree-list-chevron` class and reflects the open/closed state so
          // a theme can restyle the toggle (and each state) without a fragile
          // `[data-tree-toggle]` selector.
          themeProps('tree-list-chevron', {
            state: isExpanded ? 'expanded' : 'collapsed',
          }),
          {className: styles.chevronButton},
        )}>
        {chevronIcon}
      </button>
    ) : (
      // Non-interactive chevron only when toggling is not wired up at all
      <span
        {...mergeProps(
          themeProps('tree-list-chevron', {
            state: isExpanded ? 'expanded' : 'collapsed',
          }),
          {className: styles.chevronContainer},
        )}>
        {chevronIcon}
      </span>
    )
  ) : null;

  const innerContent = (
    <>
      {chevron}
      {startContent != null && (
        <span className={styles.startContent}>{startContent}</span>
      )}
      {href != null ? (
        <LinkComponent
          href={href}
          target={target}
          aria-disabled={isDisabled || undefined}
          aria-labelledby={labelId}
          aria-describedby={description != null ? descriptionId : undefined}
          // Roving tabindex lives on the treeitem row; inner action is not a
          // separate tab stop. Activation is forwarded from the row.
          tabIndex={-1}
          className={styles.invisibleAnchor}>
          {labelAndDescription}
        </LinkComponent>
      ) : onClick != null ? (
        <button
          type="button"
          onClick={onClick}
          disabled={isDisabled}
          aria-labelledby={labelId}
          aria-describedby={description != null ? descriptionId : undefined}
          // Roving tabindex lives on the treeitem row; inner action is not a
          // separate tab stop. Activation is forwarded from the row.
          tabIndex={-1}
          className={styles.invisibleButton}>
          {labelAndDescription}
        </button>
      ) : (
        <span className={styles.content}>{labelAndDescription}</span>
      )}
      {endContent != null && (
        <span className={styles.endContent}>{endContent}</span>
      )}
    </>
  );

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected || undefined}
      aria-disabled={isDisabled || undefined}
      aria-level={nestedLevel + 1}
      aria-posinset={posInSet}
      aria-setsize={setSize}
      // Roving tabindex: exactly one visible treeitem is tabbable at a time.
      // Disabled items are skipped by the tree keyboard handler but remain
      // in the accessibility tree.
      tabIndex={isDisabled ? -1 : isTabbable ? 0 : -1}
      data-tree-id={id}
      data-tree-level={nestedLevel + 1}
      data-tree-disabled={isDisabled || undefined}
      className={cn(
        focusOutlineStyles.publishFocusVisibleVars,
        styles.wrapper,
      )}>
      {variant !== 'noGuides' && (
        <div className={styles.treeBranches}>
          <TreeListBranches
            ancestorsIsLast={ancestorsIsLast}
            isLast={isLast}
            nestedLevel={nestedLevel}
          />
        </div>
      )}
      <div className={styles.rowWrapper}>
        <div
          {...mergeProps(
            themeProps('tree-list-item', {
              density,
              selected: isSelected ? 'selected' : null,
              disabled: isDisabled ? 'disabled' : null,
            }),
            isInteractive || (hasChildren && onClick == null)
              ? {
                  className: cn(
                    focusOutlineStyles.focusWithinOrPublished,
                    styles.contentWrapper,
                    densityStyles[density],
                    styles.interactive,
                    interactionOverlayStyles.backgroundImage,
                    isDisabled && styles.disabled,
                    isSelected && styles.selected,
                  ),
                }
              : {
                  className: cn(
                    styles.contentWrapper,
                    densityStyles[density],
                    isDisabled && styles.disabled,
                    isSelected && styles.selected,
                  ),
                },
            // Consumer row props are merged last so useContainerReveal can
            // publish both its classes and inline custom properties. Seed the
            // private indent first, then preserve the standard inline-style
            // precedence promised by the TreeList contract.
            className,
            {...indentStyle, ...style},
          )}
          onClick={handleClick}>
          {innerContent}
        </div>
      </div>
      {isExpanded && renderedChildren != null && (
        <ul role="group" className={styles.childGroup}>
          {renderedChildren}
        </ul>
      )}
    </li>
  );
}

TreeListItem.displayName = 'TreeListItem';
