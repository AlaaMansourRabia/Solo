'use client';

/**
 * @file useTableStickyColumns.tsx
 * @input React, Tailwind classes, theme tokens, Table types
 * @output Exports useTableStickyColumns hook and UseTableStickyColumnsConfig type
 * @position Sticky-columns plugin; consumed by Table via plugins prop
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Table/Table.doc.mjs (sticky-columns documentation)
 * - /packages/core/src/Table/index.ts (exports)
 */

import {useCallback, useMemo, useRef, type CSSProperties} from 'react';
import {cn} from '../../../utils/cn';
import type {
  TableColumn,
  TablePlugin,
  HeaderCellRenderProps,
  BodyCellRenderProps,
  ScrollWrapperRenderProps,
} from '../../types';
import {DEFAULT_MIN_COLUMN_WIDTH} from '../../columnUtils';

// =============================================================================
// Config
// =============================================================================

/**
 * Config for {@link useTableStickyColumns}. Provide at least one of
 * `startKeys` / `endKeys` to pin columns.
 *
 * @remarks Every field is optional by design, so `useTableStickyColumns({})`
 * compiles and is an intentional no-op that pins nothing — the hook returns a
 * plugin that passes every cell through untouched. This lets callers compute
 * the config conditionally (e.g. `endKeys: enabled ? ['notes'] : undefined`)
 * without branching on whether to install the plugin at all.
 */
export interface UseTableStickyColumnsConfig {
  /**
   * Column keys pinned to the START (inline-start / left in LTR) edge — the
   * contiguous run from the first column through the last listed key.
   */
  startKeys?: string[];
  /**
   * Column keys pinned to the END (inline-end / right in LTR) edge — the
   * contiguous run from the first listed key through the last column.
   */
  endKeys?: string[];
}

// =============================================================================
// Width helpers
// =============================================================================

/**
 * Resolve a column's pixel width for cumulative offset math. Mirrors the
 * resize plugin's fallback so offsets line up with rendered widths:
 * pixel columns use their value; proportional columns use their declared
 * minWidth (or the default); unknown widths use the default.
 */
function getColumnWidth(col: TableColumn<Record<string, unknown>>): number {
  const w = col.width;
  if (!w) {
    return DEFAULT_MIN_COLUMN_WIDTH;
  }
  if (w.type === 'pixel') {
    return w.value;
  }
  // proportional
  return w.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH;
}

/**
 * Columns pinned to the START edge → cumulative inline offset (px). The pinned
 * block is the contiguous run from column 0 through the last key in `startKeys`
 * (inclusive of any synthetic columns before it). `null` if none / no context.
 */
function computeStartOffsets(
  columns: ReadonlyArray<TableColumn<Record<string, unknown>>> | undefined,
  startKeys: string[],
): Map<string, number> | null {
  if (!columns || columns.length === 0 || startKeys.length === 0) {
    return null;
  }
  let lastStickyIndex = -1;
  for (let i = 0; i < columns.length; i++) {
    if (startKeys.includes(columns[i].key)) {
      lastStickyIndex = i;
    }
  }
  if (lastStickyIndex === -1) {
    return null;
  }
  const offsets = new Map<string, number>();
  let cumulative = 0;
  for (let i = 0; i <= lastStickyIndex; i++) {
    offsets.set(columns[i].key, cumulative);
    cumulative += getColumnWidth(columns[i]);
  }
  return offsets;
}

/**
 * Mirror of {@link computeStartOffsets} for the END edge — contiguous run from
 * the first key in `endKeys` through the last column, offsets accumulating from
 * the end (last column = 0). `null` if none.
 */
function computeEndOffsets(
  columns: ReadonlyArray<TableColumn<Record<string, unknown>>> | undefined,
  endKeys: string[],
): Map<string, number> | null {
  if (!columns || columns.length === 0 || endKeys.length === 0) {
    return null;
  }
  let firstStickyIndex = -1;
  for (let i = 0; i < columns.length; i++) {
    if (endKeys.includes(columns[i].key)) {
      firstStickyIndex = i;
      break;
    }
  }
  if (firstStickyIndex === -1) {
    return null;
  }
  const offsets = new Map<string, number>();
  let cumulative = 0;
  for (let i = columns.length - 1; i >= firstStickyIndex; i--) {
    offsets.set(columns[i].key, cumulative);
    cumulative += getColumnWidth(columns[i]);
  }
  return offsets;
}

type StickySide = {edge: 'start' | 'end'; offset: number};

/**
 * Resolve how a single column should be pinned given the start/end configs and
 * the full column list. A key (mis)configured on both edges resolves to start.
 * Returns `null` for columns that should not be pinned.
 */
function resolveStickySide(
  columns: ReadonlyArray<TableColumn<Record<string, unknown>>> | undefined,
  columnKey: string,
  startKeys: string[],
  endKeys: string[],
): StickySide | null {
  const startOffsets = computeStartOffsets(columns, startKeys);
  if (startOffsets?.has(columnKey)) {
    return {edge: 'start', offset: startOffsets.get(columnKey) ?? 0};
  }
  const endOffsets = computeEndOffsets(columns, endKeys);
  if (endOffsets?.has(columnKey)) {
    return {edge: 'end', offset: endOffsets.get(columnKey) ?? 0};
  }
  return null;
}

// =============================================================================
// Styles
// =============================================================================

// Scroll-state CSS variables set on the scroll container by the layout ref;
// the cell ::after shadows read them so each edge's shadow only shows when
// content is hidden behind it. (A variable, not an ancestor selector, because
// scroll state is not expressible as a pseudo-class.)
const SHADOW_VAR_START = '--table-sticky-shadow-start';
const SHADOW_VAR_END = '--table-sticky-shadow-end';

const stickyStyles = {
  cell: cn(
    'sticky',
    // Opaque base (overridable; defaults to the card token, the common
    // container) so scrolled content doesn't show through the pinned column.
    'bg-[var(--table-sticky-background,var(--color-background-card))]',
    // Replay the row's overlay on a ::before layer (above the base, below text)
    // so the pinned column mirrors the row's striping/hover exactly via
    // --table-row-overlay. Transitions background-COLOR (not background-image)
    // so hover stays smooth at rest, not just when GPU-promoted while scrolled.
    "before:content-[''] before:absolute before:inset-0 before:z-[-1] before:pointer-events-none",
    'before:bg-[var(--table-row-overlay,transparent)]',
    'before:[transition-property:background-color]',
    'before:[transition-duration:var(--duration-fast)]',
    'before:[transition-timing-function:var(--ease-standard)]',
    // padding-box keeps the base off the cell's collapsed divider border.
    '[background-clip:padding-box]',
    // Sticky cells need visible overflow so the shadow ::after can bleed out.
    'overflow-visible',
  ),
  // Header cells stack above body cells; both stack above non-sticky cells.
  headerCell: 'z-3',
  bodyCell: 'z-1',
} as const;

// Soft drop shadow over the scrolling region (a standard sticky-column shadow treatment).
// border-collapse tables don't paint box-shadow on cells in Chromium, so it's a
// ::after gradient strip (6px wide, tinted with --color-shadow) just past the
// pinned edge (visible thanks to the cell's overflow: visible). Opacity is gated
// by the scroll-state variable above.
const shadowStyles = {
  // start-pinned: shadow falls toward inline-end (over scrolled content).
  // insetInlineEnd anchors the strip to the column's inline-end edge; the strip
  // must then be nudged one full width OUTWARD (past that edge) into the
  // scrolled region. Outward is +X under LTR (inline-end = right) but −X under
  // RTL (inline-end = left), and the fade must run from the pinned edge toward
  // content in each direction — hence both transform and gradient flip on dir.
  start: cn(
    "after:content-[''] after:absolute after:top-0 after:bottom-0 after:end-0",
    'after:w-[6px]',
    'after:[transform:translateX(100%)]',
    '[&:is([dir=rtl]_*)]:after:[transform:translateX(-100%)]',
    'after:pointer-events-none after:[transition:opacity_150ms_ease]',
    'after:opacity-[var(--table-sticky-shadow-start,0)]',
    'after:[background-image:linear-gradient(to_right,var(--color-shadow),transparent)]',
    '[&:is([dir=rtl]_*)]:after:[background-image:linear-gradient(to_left,var(--color-shadow),transparent)]',
  ),
  // end-pinned: shadow falls toward inline-start (over scrolled content).
  // insetInlineStart anchors the strip to the column's inline-start edge; the
  // strip is nudged one full width OUTWARD into content — −X under LTR
  // (inline-start = left) but +X under RTL (inline-start = right) — with the
  // gradient fading from the pinned edge toward content in each direction.
  end: cn(
    "after:content-[''] after:absolute after:top-0 after:bottom-0 after:start-0",
    'after:w-[6px]',
    'after:[transform:translateX(-100%)]',
    '[&:is([dir=rtl]_*)]:after:[transform:translateX(100%)]',
    'after:pointer-events-none after:[transition:opacity_150ms_ease]',
    'after:opacity-[var(--table-sticky-shadow-end,0)]',
    'after:[background-image:linear-gradient(to_left,var(--color-shadow),transparent)]',
    '[&:is([dir=rtl]_*)]:after:[background-image:linear-gradient(to_right,var(--color-shadow),transparent)]',
  ),
} as const;

// Stable empty default so an unset start/end doesn't allocate a fresh array
// (and bust the memo) on every render.
const EMPTY: string[] = [];

// =============================================================================
// Hook
// =============================================================================

export function useTableStickyColumns<T extends Record<string, unknown>>(
  config: UseTableStickyColumnsConfig,
): TablePlugin<T> {
  const {startKeys, endKeys} = config;
  const start = startKeys ?? EMPTY;
  const end = endKeys ?? EMPTY;

  const hasStart = start.length > 0;
  const hasEnd = end.length > 0;

  // Live snapshot of the resolved config, read inside the (memoized) transforms
  // and the scroll-shadow callback. Keeping these in a ref lets the plugin memo
  // be computed once (deps: only the stable scroll-shadow callback) while never
  // reading stale config — consumers typically pass fresh array literals each
  // render, so we never want array identity in the deps.
  const stateRef = useRef({start, end, hasStart, hasEnd});
  stateRef.current = {start, end, hasStart, hasEnd};

  // Scroll-aware shadows: toggle CSS variables on the scroll container so each
  // edge's shadow only paints when there is hidden, horizontally-scrolled
  // content behind that edge. Implemented with a callback ref + scroll/resize
  // listeners (synchronizing with the DOM) rather than React state, so
  // scrolling never triggers re-renders.
  const detachRef = useRef<(() => void) | null>(null);
  const attachScrollShadow = useCallback((el: HTMLDivElement | null) => {
    detachRef.current?.();
    detachRef.current = null;
    if (!el) {
      return;
    }
    const update = () => {
      const {hasStart: hs, hasEnd: he} = stateRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const hasOverflow = maxScroll > 1;
      // RTL-safe scroll position. Spec-compliant browsers report a NEGATIVE
      // scrollLeft under RTL (0 at the inline-start edge, decreasing toward the
      // inline-end edge), so a raw `scrollLeft > 1` start test would never fire
      // and the end test would be wrong-signed. Math.abs collapses both
      // conventions to a distance-from-inline-start, matching the repo's own
      // useScrollOverflow (overflowStart/overflowEnd use Math.abs, tolerance 1).
      // No-op under LTR where scrollLeft is already >= 0.
      const pos = Math.abs(el.scrollLeft);
      if (hs) {
        el.style.setProperty(
          SHADOW_VAR_START,
          hasOverflow && pos > 1 ? '1' : '0',
        );
      }
      if (he) {
        el.style.setProperty(
          SHADOW_VAR_END,
          hasOverflow && pos < maxScroll - 1 ? '1' : '0',
        );
      }
    };
    el.addEventListener('scroll', update, {passive: true});
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    resizeObserver?.observe(el);
    update();
    detachRef.current = () => {
      el.removeEventListener('scroll', update);
      resizeObserver?.disconnect();
    };
  }, []);

  return useMemo(
    (): TablePlugin<T> => ({
      transformHeaderCell(
        props: HeaderCellRenderProps,
        column: TableColumn<T>,
      ): HeaderCellRenderProps {
        const {start: s, end: e} = stateRef.current;
        const side = resolveStickySide(props.columns, column.key, s, e);
        if (!side) {
          return props;
        }
        // position/inline-offset are runtime values → set via inline style so
        // they are authoritative regardless of plugin composition order (the
        // resize plugin also writes inline style on header cells).
        const offsetStyle: CSSProperties =
          side.edge === 'start'
            ? {insetInlineStart: `${side.offset}px`}
            : {insetInlineEnd: `${side.offset}px`};
        return {
          ...props,
          htmlProps: {
            ...props.htmlProps,
            style: {...props.htmlProps.style, ...offsetStyle},
          },
          className: [
            ...props.className,
            stickyStyles.cell,
            stickyStyles.headerCell,
            side.edge === 'start' ? shadowStyles.start : shadowStyles.end,
          ],
        };
      },

      transformBodyCell(
        props: BodyCellRenderProps,
        column: TableColumn<T>,
      ): BodyCellRenderProps {
        const {start: s, end: e} = stateRef.current;
        const side = resolveStickySide(props.columns, column.key, s, e);
        if (!side) {
          return props;
        }
        const offsetStyle: CSSProperties =
          side.edge === 'start'
            ? {insetInlineStart: `${side.offset}px`}
            : {insetInlineEnd: `${side.offset}px`};
        return {
          ...props,
          htmlProps: {
            ...props.htmlProps,
            style: {...props.htmlProps.style, ...offsetStyle},
          },
          className: [
            ...props.className,
            stickyStyles.cell,
            stickyStyles.bodyCell,
            side.edge === 'start' ? shadowStyles.start : shadowStyles.end,
          ],
        };
      },

      transformScrollWrapper(
        props: ScrollWrapperRenderProps,
      ): ScrollWrapperRenderProps {
        // No pinned edges → nothing to gate; leave the wrapper untouched.
        if (!stateRef.current.hasStart && !stateRef.current.hasEnd) {
          return props;
        }
        // Compose with any ref a prior plugin (e.g. virtualization) set on the
        // scroll container.
        const existingRef = props.htmlProps.ref;
        const mergedRef = (node: HTMLDivElement | null) => {
          attachScrollShadow(node);
          if (typeof existingRef === 'function') {
            existingRef(node);
          } else if (existingRef != null) {
            // RefObject — assign through its writable `.current`.
            existingRef.current = node;
          }
        };
        return {
          ...props,
          htmlProps: {...props.htmlProps, ref: mergedRef},
        };
      },
    }),
    // The returned plugin's transforms read live config from `stateRef` and
    // `attachScrollShadow` is stable (empty deps), so the plugin object can be
    // computed once and reused across renders.
    [attachScrollShadow],
  );
}
