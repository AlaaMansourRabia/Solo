'use client';

/**
 * @file TreeListBranches.tsx
 * @input Uses React, Tailwind classes, theme tokens
 * @output Exports TreeListBranches component (internal)
 * @position Presentational component for tree connector lines; consumed by TreeListItem.tsx
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/TreeList/TreeListItem.tsx
 */

import {spacingVars} from '../theme/tokenVars';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';

/**
 * Branch margin from the left edge. No exact spacing token for 10px,
 * so we use calc(--spacing-2 + --spacing-0-5) = 8 + 2 = 10.
 */
const BRANCH_MARGIN = `calc(${spacingVars['--spacing-2']} + ${spacingVars['--spacing-0-5']})`;

/** Per-level indent width. Reads the public, themeable `--tree-list-indent`
 * lever set on the tree-list root (default `--spacing-4`, 16px), so the guide
 * lines stay aligned with the row indent when a theme retunes the step. */
const LEVEL_INDENT = 'var(--tree-list-indent)';

const styles = {
  container: 'h-full absolute w-(--spacing-5)',
  verticalLine: cn(
    'rounded-[1px] start-0 m-auto absolute end-0 w-[1px]',
    'bg-(--color-border-emphasized)',
  ),
  // Guide segment spanning the full <li>. The row box's inter-row gap now lives
  // INSIDE the <li> (as `padding-block` on the row wrapper), so `height: 100%`
  // already covers it — the segment only needs the original `1px` to bridge the
  // hairline into the next contiguous sibling so the connector reads as one
  // continuous line. Independent of `--tree-list-row-gap`: the gap is absorbed
  // by the <li> height, not added on top here.
  verticalFull: 'h-[calc(100%+1px)]',
  // Last-in-group connector: nothing sits below, so the segment must not run
  // through the row wrapper's bottom `padding-block` (`--tree-list-row-gap` / 2)
  // into empty space. Clamp it back by that half-gap so it ends exactly at the
  // row box's bottom edge. At the default `--spacing-0-5` gap this trims the
  // 1px of bottom padding; at `0px` it is exactly `100%` — no overhang at any
  // gap.
  verticalLast: 'h-[calc(100%-var(--tree-list-row-gap,0px)/2)]',
} as const;

// =============================================================================
// Types
// =============================================================================

interface TreeListBranchesProps {
  ancestorsIsLast: ReadonlyArray<boolean>;
  isLast: boolean;
  nestedLevel: number;
}

// =============================================================================
// Components
// =============================================================================

/**
 * Renders vertical lines showing parent-child relationships in the tree.
 * Positioned in a full-height container to span the entire item including children.
 *
 * The line element carries the stable `solo-tree-list-guide` theme target so a
 * theme can recolor or hide the connectors via `defineTheme` (e.g.
 * `backgroundColor` or `display: 'none'`) instead of hiding the built-in guides
 * and reimplementing them.
 */
export function TreeListBranches({
  ancestorsIsLast,
  isLast,
  nestedLevel,
}: TreeListBranchesProps) {
  return (
    <>
      {ancestorsIsLast.map((ancestorIsLast, level) => {
        const branchOffset = `calc(${BRANCH_MARGIN} + ${level} * ${LEVEL_INDENT})`;
        return (
          // Skip the level that the current-item connector occupies
          // (nestedLevel - 1), since that position is rendered below
          // with the correct terminus/continuation style.
          !ancestorIsLast &&
          level !== nestedLevel - 1 && (
            <div
              // eslint-disable-next-line @eslint-react/no-array-index-key -- tree branch levels are fixed positional connectors
              key={level}
              className={styles.container}
              style={{insetInlineStart: branchOffset}}>
              <div
                {...mergeProps(
                  themeProps('tree-list-guide'),
                  {className: cn(styles.verticalLine, styles.verticalFull)},
                )}
              />
            </div>
          )
        );
      })}
      {nestedLevel > 0 && (
        <div
          className={styles.container}
          style={{
            insetInlineStart: `calc(${BRANCH_MARGIN} + ${nestedLevel - 1} * ${LEVEL_INDENT})`,
          }}>
          <div
            {...mergeProps(
              themeProps('tree-list-guide'),
              // The last item in a group has no sibling below, so its connector
              // is clamped to the row box's bottom edge (verticalLast) instead
              // of bridging into the inter-row gap — no overhang into empty
              // space. Every other row bridges the gap (verticalFull) so the
              // line stays continuous down to the next sibling.
              {
                className: cn(
                  styles.verticalLine,
                  isLast ? styles.verticalLast : styles.verticalFull,
                ),
              },
            )}
          />
        </div>
      )}
    </>
  );
}

TreeListBranches.displayName = 'TreeListBranches';
