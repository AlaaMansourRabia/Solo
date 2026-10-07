'use client';

/**
 * @file Outline.tsx
 * @input Uses React, Tailwind classes, Solo link provider integration, Outline hooks/types, useListFocus
 * @output Exports Outline component and OutlineProps type
 * @position Core implementation; consumed by index.ts
 *
 * A table-of-contents navigation component with:
 * - Sliding indicator track (vertical divider + animated active bar)
 * - Density variant (default/compact)
 * - Scroll-spy active state when uncontrolled
 * - Roving-tabindex keyboard navigation (Arrow/Home/End, Enter/Space activate)
 * - onNavigateStart / onNavigateEnd callbacks around the smooth scroll
 * - Scroll scoping (offset, scrollContainerRef, hasScrollOnClick)
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Outline/Outline.doc.mjs
 * - /packages/core/src/Outline/index.ts
 * - /apps/storybook/stories/Outline.stories.tsx
 */

import {useRef} from 'react';
import {cn} from '../utils/cn';
import {useLinkComponent} from '../Link/useLinkComponent';
import {useListFocus} from '../hooks/useListFocus';
import {useIsomorphicLayoutEffect} from '../hooks/useIsomorphicLayoutEffect';
import {mergeProps} from '../utils';
import type {BaseProps} from '../BaseProps';
import {useScrollSpy} from './useScrollSpy';
import type {OutlineItem} from './types';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {interactionOverlayStyles} from '../utils/interactionOverlay.styles';
import {useTranslator} from '../i18n';

import {useMergedRefs} from '../hooks/useMergedRefs';
export type {OutlineItem} from './types';

export interface OutlineProps extends BaseProps<HTMLElement> {
  /** Ref forwarded to the root nav element. */
  ref?: React.Ref<HTMLElement>;

  /** Ordered list of heading items to render. */
  items: OutlineItem[];

  /** ID of the currently active item. When provided, disables built-in scroll-spy. */
  activeId?: string;

  /** Called when the active item changes from scroll-spy or click. */
  onActiveIdChange?: (id: string) => void;

  /** Accessible label for the nav landmark. @default 'Table of contents' */
  label?: string;

  /**
   * Density variant controlling item padding.
   * - 'default': Standard spacing (default)
   * - 'compact': Reduced spacing for dense UIs
   * @default 'default'
   */
  density?: 'default' | 'compact';

  /**
   * Called when navigation to an item begins, before the scroll starts.
   * Receives the item `id`. Pair with `onNavigateEnd` to drive an arrival
   * effect (flash, ring, pulse) on the target heading.
   */
  onNavigateStart?: (id: string) => void;

  /**
   * Called once when navigation to an item resolves — when the smooth scroll
   * settles, or immediately-ish when reduced motion turns it into a jump.
   *
   * Fires exactly once for every `onNavigateStart`, including when the user
   * interrupts the scroll by scrolling manually, so a "navigating" state can
   * never leak. It does not fire if the Outline unmounts mid-scroll.
   */
  onNavigateEnd?: (id: string) => void;

  /**
   * Height in px of a fixed header overlaying the top of the scroll root.
   *
   * Shifts both the activation line *and* the scroll landing by the same
   * amount, so a heading activates exactly where navigating to it puts it —
   * below the header rather than hidden underneath it.
   *
   * It composes with each heading's own `scroll-margin-top` (the header, then
   * the breathing room below it) rather than replacing it. When nothing
   * overlays the content, leave this at 0 and let `scroll-margin-top` do the
   * work — the browser already honors it.
   *
   * @default 0
   */
  offset?: number;

  /**
   * Scroll container to track, instead of auto-detecting the nearest scrollable
   * ancestor. Use this when the content scrolls inside a split pane, modal, or
   * dashboard panel rather than the viewport.
   */
  scrollContainerRef?: React.RefObject<HTMLElement | null>;

  /**
   * Whether activating an item smooth-scrolls to it. Set to false to own the
   * scrolling yourself (virtualized content, a router) — the Outline still
   * updates the active item, the hash, and the navigate callbacks, but performs
   * no scroll and suppresses the anchor's default jump.
   * @default true
   */
  hasScrollOnClick?: boolean;

  /** Test ID for testing frameworks. */
  'data-testid'?: string;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  root: 'flex flex-row relative gap-(--spacing-0-5) w-full',
  track: 'relative w-[2px] shrink-0 order-[-1]',
  dividerLine: cn(
    'absolute [inset-block-start:0] [inset-block-end:0] start-0 w-[2px]',
    'bg-(--color-border) rounded-(--radius-full) pointer-events-none',
  ),
  indicator: cn(
    'absolute start-0 w-[2px] bg-(--color-icon-primary) rounded-(--radius-full)',
    'pointer-events-none z-1',
    '[position-anchor:--outline-active]',
    '[top:anchor(--outline-active_top,0px)]',
    '[height:anchor-size(--outline-active_height,0px)]',
    '[transition-property:top,height] [transition-duration:var(--duration-fast-min)]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  activeAnchor: '[anchor-name:--outline-active]',
  list: cn(
    'flex flex-col gap-(--spacing-0-5) m-0 p-0 [list-style:none] flex-1 min-w-0',
  ),
  item: 'list-none m-0 p-0',
  link: cn(
    'items-center rounded-(--radius-element) box-border text-(--color-text-secondary)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'flex font-(number:--font-weight-normal) relative text-start [text-decoration:none]',
    '[transition-duration:var(--duration-fast)] [transition-property:background-color,color]',
    '[transition-timing-function:var(--ease-standard)] w-full',
    'text-(length:--text-body-size) leading-(--text-body-leading)',
    'can-hover:hover:usable:text-(--color-text-primary)',
  ),
  activeLink: 'text-(--color-text-primary) font-(number:--font-weight-semibold)',
  label: 'overflow-hidden text-ellipsis whitespace-nowrap',
} as const;

const densityStyles = {
  compact: 'py-(--spacing-1) pe-(--spacing-2)',
  default: 'py-(--spacing-2) pe-(--spacing-2)',
} as const;

const indentStyles = {
  level1: 'ps-(--spacing-3)',
  level2: 'ps-(--spacing-7)',
  level3: 'ps-(--spacing-11)',
  level4: 'ps-(--spacing-12)',
} as const;

function getIndentStyle(level: number) {
  // Map heading levels 1-6 to visual indent levels 1-4
  // Level 1 (h1) = indent 1, Level 2 (h2) = indent 1, Level 3 (h3) = indent 2, etc.
  const indentLevel = Math.max(1, Math.min(4, level - 1 || 1));
  switch (indentLevel) {
    case 1:
      return indentStyles.level1;
    case 2:
      return indentStyles.level2;
    case 3:
      return indentStyles.level3;
    default:
      return indentStyles.level4;
  }
}

// =============================================================================
// Component
// =============================================================================

/**
 * A table-of-contents navigation component for document headings.
 *
 * Outline accepts a flat `items` array and renders anchor links with
 * indentation based on each heading level. Features a sliding indicator
 * track that animates to the active item.
 *
 * When `activeId` is omitted, it tracks scroll position and marks the last
 * heading whose top has passed its activation line — which is exactly where
 * navigating to that heading lands it: `offset` (a fixed header overlaying the
 * scroll root) plus the heading's own `scroll-margin-top`. It defaults to the
 * first item at the top and the last at the bottom.
 *
 * Keyboard: the list is a single tab stop (roving tabindex), seated on the
 * active heading. Arrow keys move between headings, Home/End jump to the ends,
 * and Enter/Space activate — so a long table of contents costs one Tab press,
 * not one per heading.
 *
 * @example
 * ```
 * <Outline
 *   items={[
 *     {id: 'intro', label: 'Introduction', level: 1},
 *     {id: 'features', label: 'Features', level: 2},
 *     {id: 'api', label: 'API Reference', level: 1},
 *   ]}
 * />
 * ```
 *
 * Scoped to a custom scroll container, under a fixed header:
 *
 * @example
 * ```
 * const scrollContainerRef = useRef<HTMLDivElement>(null);
 * <div ref={scrollContainerRef} style={{overflowY: 'auto'}}>...</div>
 * <Outline
 *   items={items}
 *   scrollContainerRef={scrollContainerRef}
 *   offset={64}
 *   onNavigateEnd={id => flashHeading(id)}
 * />
 * ```
 */
export function Outline({
  items,
  activeId,
  onActiveIdChange,
  label: labelFromProps,
  density = 'default',
  onNavigateStart,
  onNavigateEnd,
  offset = 0,
  scrollContainerRef,
  hasScrollOnClick = true,
  className,
  style,
  ref,
  'data-testid': testId,
  ...props
}: OutlineProps) {
  const t = useTranslator();
  const label = labelFromProps ?? t('@solo.outline.label');
  const rootRef = useRef<HTMLElement | null>(null);
  const LinkComponent = useLinkComponent();
  const {activeId: resolvedActiveId, scrollTo} = useScrollSpy({
    activeId,
    items,
    onActiveIdChange,
    rootRef,
    offset,
    scrollContainerRef,
    hasScrollOnClick,
    onNavigateStart,
    onNavigateEnd,
  });

  // Roving tabindex over the links: the whole outline is one tab stop, and
  // arrows move between headings. The hook owns `tabindex` on the items.
  const {
    listRef,
    handleKeyDown: handleListKeyDown,
    handleFocus,
  } = useListFocus<HTMLUListElement>({
    itemSelector: 'a[href]',
    orientation: 'vertical',
    hasRovingTabIndex: true,
  });

  // Seat the tab stop on the *active* heading. WAI-ARIA puts the single tab
  // stop on the current item, so tabbing into a table of contents while
  // reading section 7 lands on section 7 — not back at section 1, which is
  // where useListFocus would otherwise leave it (it promotes the first item on
  // mount and then keeps whichever item already holds the stop).
  //
  // Only while focus is outside the list: once the reader has arrowed to an
  // item, the stop is theirs and scroll-spy must not yank it away. Sets
  // `tabindex` only — it never steals focus. Registered after useListFocus so
  // it runs after the hook's own layout effect and wins; on later commits the
  // hook then finds this item already holding the stop and keeps it.
  useIsomorphicLayoutEffect(() => {
    const list = listRef.current;
    if (list == null || list.contains(document.activeElement)) {
      return;
    }
    const links = Array.from(list.querySelectorAll<HTMLElement>('a[href]'));
    const active = links.find(
      link => link.getAttribute('aria-current') === 'location',
    );
    if (active == null) {
      return;
    }
    for (const link of links) {
      const tabIndex = link === active ? '0' : '-1';
      if (link.getAttribute('tabindex') !== tabIndex) {
        link.setAttribute('tabindex', tabIndex);
      }
    }
  });

  /**
   * The single navigation path, shared by click and keyboard activation:
   * push the hash, then hand off to the scroll-spy's `scrollTo`, which fires
   * the navigate callbacks and moves the indicator when the scroll settles.
   */
  const navigate = (id: string) => {
    if (scrollTo(id)) {
      window.history.pushState(null, '', `#${id}`);
    }
  };

  /** Whether an event carries a modifier chord we must leave to the browser. */
  const hasModifier = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

  const handleClick =
    (id: string) => (event: React.MouseEvent<HTMLElement>) => {
      // Let the browser handle modified clicks (open in new tab, etc.) without
      // touching the active state.
      if (event.defaultPrevented || hasModifier(event)) {
        return;
      }

      // With no target in the DOM — lazily-rendered or virtualized content —
      // there is nothing to scroll to and nothing to make active. Leave the
      // anchor to the browser's native fragment navigation (which still
      // updates the URL) rather than swallowing the click into a dead link.
      if (document.getElementById(id) == null) {
        return;
      }

      // Suppress the anchor's default jump: we own the scroll (or, with
      // `hasScrollOnClick={false}`, deliberately leave it to the consumer).
      event.preventDefault();
      navigate(id);
    };

  const handleKeyDown =
    (id: string) => (event: React.KeyboardEvent<HTMLElement>) => {
      // Enter is a link's native activation and already produces a click.
      // Space is not, so wire it up here to match the button-like affordance.
      if (event.key !== ' ' && event.key !== 'Spacebar') {
        return;
      }
      if (event.defaultPrevented || hasModifier(event)) {
        return;
      }

      // preventDefault does double duty: it stops the page from scrolling, and
      // it tells useScrollSpy this Space is an activation, not a manual scroll.
      event.preventDefault();
      navigate(id);
    };

  return (
    <nav
      {...props}
      ref={useMergedRefs(rootRef, ref)}
      aria-label={label}
      data-testid={testId}
      {...mergeProps(
        themeProps('outline', {density}),
        styles.root,
        className,
        style,
      )}>
      <ul
        className={styles.list}
        ref={listRef}
        role="list"
        onKeyDown={handleListKeyDown}
        onFocus={handleFocus}>
        {items.map(item => {
          const isActive = item.id === resolvedActiveId;

          return (
            <li key={item.id} className={styles.item} role="listitem">
              <LinkComponent
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={handleClick(item.id)}
                onKeyDown={handleKeyDown(item.id)}
                {...mergeProps(
                  themeProps('outline-item', {
                    active: isActive ? 'active' : null,
                    level: item.level,
                  }),
                  cn(
                    focusOutlineStyles.focusVisible,
                    styles.link,
                    interactionOverlayStyles.backgroundColor,
                    densityStyles[density],
                    getIndentStyle(item.level),
                    isActive && styles.activeLink,
                    isActive && styles.activeAnchor,
                  ),
                )}>
                <span className={styles.label}>{item.label}</span>
              </LinkComponent>
            </li>
          );
        })}
      </ul>

      {/* Track divider. Rendered after the list so the active anchor appears
          earlier in DOM order; `order: -1` keeps the track visually before it. */}
      <div className={styles.track} aria-hidden="true">
        <span className={styles.dividerLine} />
      </div>
      <span
        {...mergeProps(
          themeProps('outline-indicator'),
          styles.indicator,
        )}
        aria-hidden="true"
      />
    </nav>
  );
}

Outline.displayName = 'Outline';
