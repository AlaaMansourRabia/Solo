'use client';

/**
 * @file DropdownMenu.tsx
 * @input Uses React, Tailwind classes, usePopover, MenuBottomSheet, Button, List,
 *   useListFocus, and the shared viewport-safe menu-width resolver
 * @output Exports DropdownMenu with caller-selected popover or bottom-sheet
 *   presentation
 * @position Core implementation; consumed by index.ts
 *
 * Supports two modes with a single keyboard/focus path:
 * - **Data-driven**: pass `items` array (converted to components internally)
 * - **Compound-component**: pass JSX children directly
 *
 * Both modes use useListFocus for DOM-based keyboard navigation.
 *
 * The trigger is the design system's Button (`button`) or any control the
 * caller renders (`renderTrigger`).
 *
 * A sub-menu drills in on a phone through the view stack useMenuDrillIn
 * keeps; the root shows the drilled view in place of its rows.
 *
 * Initial focus on open follows the input modality: a keyboard open
 * (Enter / Space / ArrowDown on the trigger) focuses the first enabled item
 * (APG menu-button); a pointer open focuses the menu container itself so no
 * item reads as pre-selected, and the first ArrowDown then moves to item 1.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/DropdownMenu/DropdownMenu.doc.mjs
 * - /packages/core/src/DropdownMenu/DropdownMenu.test.tsx
 * - /packages/core/src/DropdownMenu/index.ts
 * - /apps/storybook/stories/DropdownMenu.stories.tsx
 */

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {usePopover} from '../Popover/usePopover';
import {Button, type ButtonProps} from '../Button';
import {Heading} from '../Heading';
import {Icon} from '../Icon';

import {renderDropdownItems} from './renderDropdownItems';
import type {DropdownMenuItemProps} from './DropdownMenuItem';
import {
  MENU_ITEM_ROLES,
  MENU_ITEM_SELECTOR,
  MENU_BOUNDARY_SELECTOR,
  activateMenuItem,
} from './menuItemRoles';
import {
  DropdownMenuContext,
  type DropdownMenuContextValue,
} from './DropdownMenuContext';
import {useIsomorphicLayoutEffect} from '../hooks/useIsomorphicLayoutEffect';
import {useListFocus} from '../hooks/useListFocus';
import {useMenuPress} from '../hooks/useMenuPress';
import type {MenuPressPointerType} from '../hooks/menuPressGesture';
import {useTypeahead} from '../hooks/useTypeahead';
import {useFocusReturnVisibility} from '../hooks/useFocusReturnVisibility';
import {useMenuOverflow} from './useMenuOverflow';
import {useDevWarning} from '../hooks/useDevWarning';
import {useMenuDrillIn} from './useMenuDrillIn';
import {resolveMenuWidth} from './menuWidth';
import {
  useAdaptivePresentation,
  type AdaptivePresentation,
} from '../hooks/useAdaptivePresentation';
import {MenuBottomSheet} from './MenuBottomSheet';
import {MenuBottomSheetActionList} from './MenuBottomSheetActionList';
import {layerAnimations} from '../Layer/layerAnimations.styles';
import type {LayerAlignment, LayerPlacement} from '../Layer/useLayer';
import {spacingVars} from '../theme/tokenVars';
import {mergeProps, rtlStyles} from '../utils';
import type {BaseProps} from '../BaseProps';
import {themeProps} from '../utils/themeProps';
import {useInteractionModalityTracking} from '../utils/interactionModality';
import {useTranslator} from '../i18n';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';

const MENU_VIEWPORT_GUTTER = spacingVars['--spacing-4'];
const MENU_MAX_INLINE_SIZE_FALLBACK = `calc(100vw - ${MENU_VIEWPORT_GUTTER} - ${MENU_VIEWPORT_GUTTER})`;
const MENU_POSITION_AREA_MAX_INLINE_SIZE_FALLBACK = `calc(100% - ${MENU_VIEWPORT_GUTTER})`;

// The viewport bounds below are spelled out literally in each class (Tailwind
// needs literal class strings). With G = var(--spacing-4):
//   MENU_MAX_INLINE_SIZE = calc(100vi - max(G, env(safe-area-inset-left, 0px)) - max(G, env(safe-area-inset-right, 0px)))
//     fallback: calc(100vw - G - G)
//   MENU_MAX_BLOCK_SIZE = min(300px, calc(100dvb - max(G, env(safe-area-inset-top, 0px)) - max(G, env(safe-area-inset-bottom, 0px))))
//     fallback: min(300px, calc(100vh - G - G))
//   MENU_POSITION_AREA_MAX_INLINE_SIZE = calc(100% - max(G, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px)))
//     fallback: calc(100% - G)
//   MENU_INLINE_EDGE_GUTTER = max(G, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px))
// A fallback chain (preferred a, fallback b) is written as
// `[prop:b] supports-[prop:a]:[prop:a]`.
const MENU_TRIGGER_OPEN_BACKGROUND =
  '[background-image:linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed))]';

const styles = {
  // Replaces the Button's whole background-image, its hover/pressed overlay
  // included, so the variant chains are restated with the open value.
  triggerOpen: cn(
    MENU_TRIGGER_OPEN_BACKGROUND,
    'usable:active:[background-image:linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed))]',
    'can-hover:usable:hover:[background-image:linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed))]',
    'can-hover:usable:active:[background-image:linear-gradient(var(--color-overlay-pressed),var(--color-overlay-pressed))]',
  ),
  // The trigger's ring is suppressed outright, `:focus-visible` included.
  triggerFocusSuppressed: cn(
    focusOutlineStyles.suppressed,
    'focus-visible:[outline-width:0] focus-visible:[outline-style:none] focus-visible:[outline-offset:0]',
  ),
  // A finger held on the trigger opens the menu; the browser's own held-press
  // affordances — the link preview callout, text selection — must not compete
  // with it.
  triggerPressable: '[-webkit-touch-callout:none] select-none',
  dropdown: cn(
    'box-border flex flex-col gap-(--spacing-0-5)',
    // Pointer opens focus this container so subsequent arrow keys and Escape
    // stay owned by the menu. It is an internal focus target, not a control,
    // so suppress the browser ring; keyboard focus moves to an item instead.
    '[outline:none]',
    // Menu rows never offer the browser's held-press link preview or text
    // selection: a held finger is driving the highlight.
    '[-webkit-touch-callout:none] select-none',
    '[max-inline-size:calc(100vw_-_var(--spacing-4)_-_var(--spacing-4))]',
    'supports-[max-inline-size:calc(100vi_-_max(var(--spacing-4),env(safe-area-inset-left,0px))_-_max(var(--spacing-4),env(safe-area-inset-right,0px)))]:[max-inline-size:calc(100vi_-_max(var(--spacing-4),env(safe-area-inset-left,0px))_-_max(var(--spacing-4),env(safe-area-inset-right,0px)))]',
    '[--_dropdown-menu-radius:var(--radius-container)] [--_dropdown-menu-padding:var(--spacing-1)]',
    'p-(--spacing-1) rounded-(--_dropdown-menu-radius)',
    'opacity-100 [transition-property:opacity] [transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
  ),
  // The default block cap; `menuMaxHeight` (below) replaces it.
  dropdownMaxHeight: cn(
    '[max-height:min(300px,calc(100vh_-_var(--spacing-4)_-_var(--spacing-4)))]',
    'supports-[max-height:min(300px,calc(100dvb_-_max(var(--spacing-4),env(safe-area-inset-top,0px))_-_max(var(--spacing-4),env(safe-area-inset-bottom,0px))))]:[max-height:min(300px,calc(100dvb_-_max(var(--spacing-4),env(safe-area-inset-top,0px))_-_max(var(--spacing-4),env(safe-area-inset-bottom,0px))))]',
  ),
  scrollable: 'overflow-y-auto overflow-x-hidden overscroll-contain',
  // Scroll ownership by the browser's own signal. A menu whose rows fit keeps
  // every finger: a slide over its rows stays a slide. One that scrolls lets
  // the browser pan it vertically and cancel the press when it does.
  touchNone: '[touch-action:none]',
  touchPanY: '[touch-action:pan-y] overscroll-contain',
  popoverViewport: 'box-border',
  // The default block cap; `popoverViewportMaxBlockSize` replaces it.
  popoverViewportDefaultMaxBlockSize: cn(
    '[max-block-size:min(300px,calc(100vh_-_var(--spacing-4)_-_var(--spacing-4)))]',
    'supports-[max-block-size:min(300px,calc(100dvb_-_max(var(--spacing-4),env(safe-area-inset-top,0px))_-_max(var(--spacing-4),env(safe-area-inset-bottom,0px))))]:[max-block-size:min(300px,calc(100dvb_-_max(var(--spacing-4),env(safe-area-inset-top,0px))_-_max(var(--spacing-4),env(safe-area-inset-bottom,0px))))]',
  ),
  popoverViewportAligned: cn(
    '[max-inline-size:calc(100%_-_var(--spacing-4))]',
    'supports-[max-inline-size:calc(100%_-_max(var(--spacing-4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px)))]:[max-inline-size:calc(100%_-_max(var(--spacing-4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px)))]',
  ),
  popoverViewportStart:
    'me-[max(var(--spacing-4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))]',
  popoverViewportEnd:
    'ms-[max(var(--spacing-4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))]',
  popoverViewportBlockStart:
    'mb-[max(var(--spacing-4),env(safe-area-inset-bottom,0px))]',
  popoverViewportBlockEnd:
    'mt-[max(var(--spacing-4),env(safe-area-inset-top,0px))]',
  popoverViewportCentered: cn(
    'ms-[max(var(--spacing-4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))]',
    'me-[max(var(--spacing-4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))]',
    '[max-inline-size:calc(100vw_-_var(--spacing-4)_-_var(--spacing-4))]',
    'supports-[max-inline-size:calc(100vi_-_max(var(--spacing-4),env(safe-area-inset-left,0px))_-_max(var(--spacing-4),env(safe-area-inset-right,0px)))]:[max-inline-size:calc(100vi_-_max(var(--spacing-4),env(safe-area-inset-left,0px))_-_max(var(--spacing-4),env(safe-area-inset-right,0px)))]',
  ),
  popoverViewportBlockCentered: cn(
    'mt-[max(var(--spacing-4),env(safe-area-inset-top,0px))]',
    'mb-[max(var(--spacing-4),env(safe-area-inset-bottom,0px))]',
    '[max-inline-size:calc(100vw_-_var(--spacing-4)_-_var(--spacing-4))]',
    'supports-[max-inline-size:calc(100vi_-_max(var(--spacing-4),env(safe-area-inset-left,0px))_-_max(var(--spacing-4),env(safe-area-inset-right,0px)))]:[max-inline-size:calc(100vi_-_max(var(--spacing-4),env(safe-area-inset-left,0px))_-_max(var(--spacing-4),env(safe-area-inset-right,0px)))]',
  ),
  // Three-way fallback chain: the middle value only where the first is not
  // supported, so the preferred value never depends on rule order.
  popoverAligned: cn(
    'min-w-[anchor-size(width)]',
    'supports-[min-width:min(anchor-size(width),calc(100%_-_var(--spacing-4)))]:not-supports-[min-width:min(anchor-size(width),calc(100%_-_max(var(--spacing-4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))))]:min-w-[min(anchor-size(width),calc(100%_-_var(--spacing-4)))]',
    'supports-[min-width:min(anchor-size(width),calc(100%_-_max(var(--spacing-4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))))]:min-w-[min(anchor-size(width),calc(100%_-_max(var(--spacing-4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))))]',
  ),
  popoverCentered: cn(
    'min-w-[anchor-size(width)]',
    'supports-[min-width:min(anchor-size(width),calc(100vw_-_var(--spacing-4)_-_var(--spacing-4)))]:not-supports-[min-width:min(anchor-size(width),calc(100vi_-_max(var(--spacing-4),env(safe-area-inset-left,0px))_-_max(var(--spacing-4),env(safe-area-inset-right,0px))))]:min-w-[min(anchor-size(width),calc(100vw_-_var(--spacing-4)_-_var(--spacing-4)))]',
    'supports-[min-width:min(anchor-size(width),calc(100vi_-_max(var(--spacing-4),env(safe-area-inset-left,0px))_-_max(var(--spacing-4),env(safe-area-inset-right,0px))))]:min-w-[min(anchor-size(width),calc(100vi_-_max(var(--spacing-4),env(safe-area-inset-left,0px))_-_max(var(--spacing-4),env(safe-area-inset-right,0px))))]',
  ),
  // Dynamic widths travel through `--_dropdown-menu-width`.
  popoverCustomWidth: 'min-w-(--_dropdown-menu-width)',
  popoverCustomIntrinsicWidth: '[inline-size:var(--_dropdown-menu-width)]',
} as const;

// `menuMaxHeight` lifts the 300px cap for a menu that must fit its rows; the
// viewport still bounds it. The height travels through
// `--_dropdown-menu-max-height`.
const dynamicStyles = {
  menuMaxHeight:
    '[max-height:min(var(--_dropdown-menu-max-height),calc(100dvb_-_max(var(--spacing-4),env(safe-area-inset-top,0px))_-_max(var(--spacing-4),env(safe-area-inset-bottom,0px))))]',
  popoverViewportMaxBlockSize:
    '[max-block-size:min(var(--_dropdown-menu-max-height),calc(100dvb_-_max(var(--spacing-4),env(safe-area-inset-top,0px))_-_max(var(--spacing-4),env(safe-area-inset-bottom,0px))))]',
} as const;

const bottomSheetStyles = {
  content: 'w-full',
  header: 'flex flex-row items-center gap-(--spacing-1) mb-(--spacing-2)',
  // Match the content edge of a spacious ListItem. Icon-bearing rows place
  // their icon here; rows without an icon place their label here.
  rootHeading: 'ms-(--spacing-3)',
  viewHeading: '[outline:none]',
} as const;

// =============================================================================
// Types
// =============================================================================

/**
 * Data-mode shape for one menu row.
 *
 * The item fields are sourced from `DropdownMenuItemProps` — data mode renders
 * through `DropdownMenuItem`, so the two APIs describe the same thing and must
 * not drift. Only the fields listed here are part of the data API; add a key to
 * the `Pick` to expose more of the item's props to `items`.
 */
export interface DropdownMenuItemData extends Pick<
  DropdownMenuItemProps,
  | 'icon'
  | 'onClick'
  | 'isDisabled'
  | 'variant'
  | 'description'
  | 'endContent'
  | 'hasCloseOnSelect'
  | 'href'
  | 'target'
  | 'rel'
> {
  /**
   * Stable identity for the row, used as its React key (as on
   * `TreeListItemData`). Omit it and the row is keyed by position, which is
   * correct for a fixed menu; set it when `items` can reorder, filter, or grow,
   * so a row keeps its DOM node — and therefore keyboard focus — as the array
   * changes around it.
   */
  id?: string;
  /** Primary label content. */
  label: ReactNode;
  /**
   * Nested submenu entries. When present, this row becomes a submenu (a
   * flyout revealing `items`) instead of a leaf action — no separate item
   * "type" is needed. Data-mode parity for the compound DropdownMenuSubMenu API.
   */
  items?: DropdownMenuOption[];
}

/**
 * Data-mode shape for a divider row. The compound-mode peer is the
 * `DropdownMenuDivider` component, which both modes render.
 */
export interface DropdownMenuDividerData {
  type: 'divider';
}

export interface DropdownMenuSection {
  type: 'section';
  /** Stable identity for the group; see {@link DropdownMenuItemData.id}. */
  id?: string;
  title?: string;
  items: DropdownMenuItemData[];
}

export type DropdownMenuOption =
  DropdownMenuItemData | DropdownMenuDividerData | DropdownMenuSection;

// =============================================================================
// Props
// =============================================================================

export type DropdownMenuButtonProps = Omit<ButtonProps, 'onClick'>;

export type DropdownMenuPresentation = AdaptivePresentation;

/**
 * The props a custom `trigger` spreads onto the control that opens the menu.
 * They carry the press model — a mouse opens on press-down, a held finger
 * opens with the finger down — the keyboard opens (Enter, Space, ArrowDown,
 * ArrowUp), the toggle click, and the ARIA wiring that names the menu after
 * the control. Spread them all; add your own handlers beside them.
 */
export interface DropdownMenuTriggerProps {
  /** Attaches the control as the menu's anchor and focus-return target. */
  ref: (element: HTMLElement | null) => void;
  /** The menu points at this id with `aria-labelledby`. */
  id: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  onClickCapture: (event: React.MouseEvent<HTMLElement>) => void;
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  onContextMenu: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLElement>) => void;
  'aria-haspopup': 'menu' | 'dialog';
  'aria-expanded': boolean;
  'aria-controls': string;
}

interface DropdownMenuBaseProps extends BaseProps {
  /**
   * The design system's own button as the trigger. Mutually exclusive with
   * `renderTrigger`.
   */
  button?: DropdownMenuButtonProps;
  /**
   * Render the control the menu hangs off — an icon button, a chip, an
   * avatar, a list row. Spread the given props onto it; the menu is then
   * named by that control. Mutually exclusive with `button`.
   *
   * Hover and pressed paint stay yours. The open state reaches your control
   * as `aria-expanded` on the given props, so style it from the rendered
   * attribute. A pressed look keyed to `:active` is not a substitute:
   * `:active` does not behave the same under a coarse pointer, which is why
   * menu rows drop coarse-pointer `:active` paint entirely.
   *
   * @example
   * ```
   * <DropdownMenu renderTrigger={props => <IconButton icon="more" label="More" {...props} />}>
   * ```
   *
   * @example
   * ```
   * // Styling the open state from the rendered attribute:
   * // .my-trigger[aria-expanded='true'] { background: var(--color-overlay-pressed); }
   * ```
   */
  renderTrigger?: (props: DropdownMenuTriggerProps) => ReactNode;
  isMenuOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Minimum popover width. The menu may grow for its content but is capped to
   * the available viewport space. Ignored by bottom-sheet presentation.
   * Defaults to the trigger width.
   */
  menuWidth?: number | string;
  /**
   * Maximum menu height in pixels, for a menu that must fit its rows. Lifts
   * the default 300px cap; the viewport still bounds it. Ignored by
   * bottom-sheet presentation.
   */
  menuMaxHeight?: number;
  onClick?: () => void;
  hasChevron?: boolean;
  /**
   * Popover position relative to the trigger. Ignored by bottom-sheet
   * presentation.
   * Uses the same placement values as other Solo layer-based components.
   * @default 'below'
   */
  placement?: LayerPlacement;

  /**
   * Popover alignment along the placement axis. Ignored by bottom-sheet
   * presentation.
   * Uses the same alignment values as other Solo layer-based components.
   * @default 'start'
   */
  alignment?: LayerAlignment;

  'data-testid'?: string;
}

interface DropdownMenuDataProps extends DropdownMenuBaseProps {
  /**
   * Surface used to present the actions. Pass a value selected by product
   * policy (for example, a compact-touch media query) when the presentation
   * should adapt. Bottom-sheet presentation is intended for short action sets.
   * @default 'popover'
   */
  presentation?: DropdownMenuPresentation;
  items: DropdownMenuOption[];
  children?: undefined;
}

interface DropdownMenuCompoundProps extends DropdownMenuBaseProps {
  presentation?: 'popover';
  items?: undefined;
  children: ReactNode;
}

export type DropdownMenuProps =
  DropdownMenuDataProps | DropdownMenuCompoundProps;

// =============================================================================
// DropdownMenu
// =============================================================================

/**
 * A dropdown menu component that displays a list of actionable items.
 *
 * Supports two modes:
 * - **Data-driven**: pass `items` and choose either the default anchored
 *   popover or the modal bottom-sheet presentation.
 * - **Compound-component**: pass JSX children for dynamic, stateful, or
 *   lazy-loaded anchored popover menus.
 *
 * @example
 * ```
 * <DropdownMenu
 *   button={{ label: 'Actions' }}
 *   presentation={useBottomSheet ? 'bottom-sheet' : 'popover'}
 *   items={[
 *     { label: 'Edit', onClick: () => handleEdit() },
 *     { label: 'Delete', onClick: () => handleDelete() },
 *   ]}
 * />
 * ```
 */
// When the consumer doesn't pass `button`, the default label is looked up
// at render time so it respects the active InternationalizationProvider
// locale.
const DEFAULT_BUTTON_I18N_KEY = '@solo.dropdownMenu.label' as const;

/**
 * Keep `control` the invoker of popover `popoverId` for the rest of the press
 * in flight, so the native light dismiss of a `popover="auto"` does not read
 * the release over the trigger as a dismissal. The attribute is dropped a
 * task after the release, once light dismiss has run.
 */
function holdInvokerThroughPress(
  control: HTMLElement | null,
  popoverId: string,
): void {
  if (control == null) {
    return;
  }
  const doc = control.ownerDocument;
  control.setAttribute('popovertarget', popoverId);
  const onPressEnd = () => {
    doc.removeEventListener('pointerup', onPressEnd, true);
    doc.removeEventListener('pointercancel', onPressEnd, true);
    // Light dismiss runs as the pointerup default action after listeners.
    doc.defaultView?.setTimeout(() => {
      control.removeAttribute('popovertarget');
    }, 0);
  };
  doc.addEventListener('pointerup', onPressEnd, true);
  doc.addEventListener('pointercancel', onPressEnd, true);
}

function DropdownMenuBottomSheet({
  button: buttonFromProps,
  renderTrigger,
  isMenuOpen: controlledIsOpen,
  onOpenChange,
  onClick,
  hasChevron = true,
  items,
  presentation: _presentation,
  menuWidth: _menuWidth,
  menuMaxHeight: _menuMaxHeight,
  placement: _placement,
  alignment: _alignment,
  className,
  style,
  'data-testid': testId,
  ...rest
}: DropdownMenuDataProps & {presentation: 'bottom-sheet'}) {
  const t = useTranslator();
  const button = buttonFromProps ?? {label: t(DEFAULT_BUTTON_I18N_KEY)};
  const backLabel = t('@solo.dropdownMenu.back');
  const buttonRef = useRef<HTMLElement>(null);
  const triggerId = useId();
  const sheetId = useId();
  const actionListRef = useRef<HTMLDivElement>(null);
  const openModalityRef = useRef<'keyboard' | 'pointer'>('pointer');
  const {
    isFocusRingSuppressed,
    onFocusReturnTargetFocus,
    prepareFocusReturn,
    resetFocusReturn,
  } = useFocusReturnVisibility();
  const viewHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousSubmenuDepthRef = useRef(0);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [submenuPath, setSubmenuPath] = useState<DropdownMenuItemData[]>([]);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const [previousIsOpen, setPreviousIsOpen] = useState(isOpen);
  if (previousIsOpen !== isOpen) {
    setPreviousIsOpen(isOpen);
    if (!isOpen && submenuPath.length > 0) {
      setSubmenuPath([]);
    }
  }
  const currentSubmenu = submenuPath.at(-1);
  const currentItems = currentSubmenu?.items ?? items;
  const currentTitle = currentSubmenu?.label ?? button.label;
  const sheetLabel =
    typeof currentTitle === 'string' ? currentTitle : button.label;

  const setOpen = useCallback(
    (nextIsOpen: boolean) => {
      if (!nextIsOpen) {
        setSubmenuPath([]);
        prepareFocusReturn();
      } else {
        resetFocusReturn();
      }
      onOpenChange?.(nextIsOpen);
      if (!isControlled) {
        setInternalIsOpen(nextIsOpen);
      }
    },
    [isControlled, onOpenChange, prepareFocusReturn, resetFocusReturn],
  );

  const handleSelect = useCallback(
    (item: DropdownMenuItemData, event: React.MouseEvent) => {
      if (item.isDisabled) {
        return;
      }
      item.onClick?.(event);
      if (item.hasCloseOnSelect !== false) {
        setOpen(false);
      }
    },
    [setOpen],
  );

  const isIconOnly = button.isIconOnly === true;
  const resolvedEndContent =
    button.endContent ??
    (hasChevron && !isIconOnly ? (
      <Icon icon="chevronDown" size="sm" color="inherit" />
    ) : undefined);

  useEffect(() => {
    if (!isOpen || openModalityRef.current !== 'keyboard') {
      return;
    }
    const frame = requestAnimationFrame(() => {
      actionListRef.current
        ?.querySelector<HTMLElement>('button:not(:disabled), a[href]')
        ?.focus({preventScroll: true});
    });
    return () => cancelAnimationFrame(frame);
  }, [currentItems, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      previousSubmenuDepthRef.current = 0;
      return;
    }
    if (submenuPath.length === previousSubmenuDepthRef.current) {
      return;
    }
    previousSubmenuDepthRef.current = submenuPath.length;
    const frame = requestAnimationFrame(() => {
      viewHeadingRef.current?.focus({preventScroll: true});
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, submenuPath.length]);

  const handleSheetTriggerPointerDown = () => {
    openModalityRef.current = 'pointer';
  };
  const handleSheetTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      openModalityRef.current = 'keyboard';
    }
  };
  const handleSheetTriggerClick = () => {
    onClick?.();
    setOpen(!isOpen);
  };

  return (
    <>
      {renderTrigger != null ? (
        renderTrigger({
          ref: el => {
            buttonRef.current = el;
          },
          id: triggerId,
          onClick: handleSheetTriggerClick,
          onClickCapture: () => {},
          onPointerDown: handleSheetTriggerPointerDown,
          onContextMenu: () => {},
          onKeyDown: handleSheetTriggerKeyDown,
          onFocus: onFocusReturnTargetFocus,
          'aria-haspopup': 'dialog',
          'aria-expanded': isOpen,
          'aria-controls': sheetId,
        })
      ) : (
        <Button
          {...button}
          ref={buttonRef as React.Ref<HTMLButtonElement>}
          className={cn(
            isOpen && styles.triggerOpen,
            button.className,
            isFocusRingSuppressed && styles.triggerFocusSuppressed,
          )}
          tooltip={isOpen ? undefined : button.tooltip}
          endContent={resolvedEndContent}
          onPointerDown={event => {
            button.onPointerDown?.(event);
            handleSheetTriggerPointerDown();
          }}
          onKeyDown={event => {
            button.onKeyDown?.(event);
            handleSheetTriggerKeyDown(event);
          }}
          onFocus={event => {
            button.onFocus?.(event);
            onFocusReturnTargetFocus();
          }}
          onClick={handleSheetTriggerClick}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          data-testid={testId}
        />
      )}

      <MenuBottomSheet
        isOpen={isOpen}
        onOpenChange={setOpen}
        finalFocusRef={buttonRef}
        label={sheetLabel}>
        <div
          ref={actionListRef}
          id={sheetId}
          {...rest}
          {...mergeProps(
            themeProps('dropdown-menu', {presentation: 'bottom-sheet'}),
            {className: bottomSheetStyles.content},
            className,
            style,
          )}>
          <div className={bottomSheetStyles.header}>
            {submenuPath.length > 0 && (
              <Button
                label={backLabel}
                variant="ghost"
                size="sm"
                icon={
                  <Icon
                    icon="chevronLeft"
                    size="sm"
                    className={rtlStyles.mirror}
                  />
                }
                isIconOnly
                onClick={() => setSubmenuPath(path => path.slice(0, -1))}
              />
            )}
            <Heading
              ref={viewHeadingRef}
              level={3}
              tabIndex={-1}
              className={cn(
                bottomSheetStyles.viewHeading,
                submenuPath.length === 0 && bottomSheetStyles.rootHeading,
              )}>
              {currentTitle}
            </Heading>
          </div>
          <MenuBottomSheetActionList
            items={currentItems}
            onSelect={handleSelect}
            onOpenSubmenu={item => setSubmenuPath(path => [...path, item])}
          />
        </div>
      </MenuBottomSheet>
    </>
  );
}

function DropdownMenuPopover({
  button: buttonFromProps,
  renderTrigger,
  isMenuOpen: controlledIsOpen,
  onOpenChange,
  menuWidth,
  menuMaxHeight,
  onClick,
  hasChevron = true,
  placement = 'below',
  alignment = 'start',
  presentation: _presentation,
  className,
  style,
  'data-testid': testId,
  ...props
}: DropdownMenuProps) {
  const t = useTranslator();
  const button = buttonFromProps ?? {label: t(DEFAULT_BUTTON_I18N_KEY)};

  const items = ('items' in props ? props.items : undefined) ?? [];
  const children = props.children;

  // Extract BaseProps pass-throughs (aria-*, id, event handlers) from the
  // discriminated-union rest bag so they can be forwarded to the menu element.
  const {
    items: _items,
    children: _children,
    ...rest
  } = props as Record<string, unknown>;

  const menuId = useId();
  const triggerId = useId();
  const menuSize = button.size ?? 'md';
  const buttonRef = useRef<HTMLElement>(null);

  // Open state
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const acceptedOpenRef = useRef(false);
  const notifyClickOnShowRef = useRef(false);
  const pendingControlledOpenRef = useRef(false);
  const suppressControlledRollbackHideRef = useRef(false);

  useInteractionModalityTracking();
  const {
    isFocusRingSuppressed,
    onFocusReturnTargetFocus,
    prepareFocusReturn,
    resetFocusReturn,
  } = useFocusReturnVisibility();
  const contentRef = useRef<HTMLDivElement | null>(null);
  // The press model is mounted below (it needs the popover); the hide path
  // above it ends the gesture in flight through this ref.
  const cancelMenuPressRef = useRef<() => void>(() => {});

  // Focus lands somewhere stated when the menu closes. A press outside that
  // landed on a focusable control has already moved focus there; leave it.
  // Otherwise — a row acted, Escape, a press on nothing — focus returns to
  // the trigger, with a visible ring only when the menu was driven by
  // keyboard (the modality tracker decides; the suppressed style hides the
  // pointer case, which Safari would otherwise paint after a touch pick).
  const handleLayerHide = useCallback(() => {
    if (suppressControlledRollbackHideRef.current) {
      suppressControlledRollbackHideRef.current = false;
      return;
    }
    cancelMenuPressRef.current();
    pendingControlledOpenRef.current = false;
    onOpenChange?.(false);
    if (!isControlled) {
      setInternalIsOpen(false);
    }
    const trigger = buttonRef.current;
    if (!trigger) {
      return;
    }
    const active = document.activeElement;
    const focusLandedElsewhere =
      active instanceof HTMLElement &&
      active !== document.body &&
      active !== trigger &&
      !contentRef.current?.contains(active);
    if (focusLandedElsewhere) {
      return;
    }
    prepareFocusReturn();
    trigger.focus({preventScroll: true});
  }, [isControlled, onOpenChange, prepareFocusReturn]);

  // Defer item focus until the layer has committed open, so focus restore
  // captures the trigger instead of the first menu item.
  const shouldFocusOnOpenRef = useRef(false);

  // How the next open was initiated. Keyboard (and programmatic) opens focus
  // the first enabled item per the APG menu-button pattern; pointer opens
  // focus the menu container instead, so no item is visually highlighted as
  // if pre-selected. Reset to 'keyboard' after every open so
  // programmatic controlled opens keep the item-focus behavior.
  const openModalityRef = useRef<'keyboard' | 'pointer'>('keyboard');
  // ArrowUp opens with the LAST enabled row highlighted.
  const focusLastOnOpenRef = useRef(false);

  const handleLayerShow = useCallback(() => {
    acceptedOpenRef.current = true;
    resetFocusReturn();
    if (notifyClickOnShowRef.current) {
      notifyClickOnShowRef.current = false;
      onClick?.();
    }
    onOpenChange?.(true);
    if (!isControlled) {
      setInternalIsOpen(true);
    }
  }, [isControlled, onClick, onOpenChange, resetFocusReturn]);

  const popover = usePopover({
    onHide: handleLayerHide,
    onShow: handleLayerShow,
    hasLightDismiss: true,
    hasCloseButton: false,
    hasAutoFocus: false,
    // The popup's own role="menu" is the exposed semantics; wrapping it in a
    // modal dialog would announce an unnamed dialog around the menu.
    role: 'none',
  });

  const closeMenu = useCallback(() => {
    popover.hide();
  }, [popover]);

  // Single keyboard navigation path for both modes.
  // The selector matches plain items plus selectable items
  // (menuitemradio/menuitemcheckbox) so lab checkbox/radio rows are reachable
  // and roved to alongside plain items — not just role="menuitem".
  const {
    listRef,
    handleKeyDown: listNavKeyDown,
    focusFirst,
    focusLast,
    focusItem,
    ownsEvent,
    getItems: getMenuItems,
  } = useListFocus<HTMLDivElement>({
    itemSelector: MENU_ITEM_SELECTOR,
    boundarySelector: MENU_BOUNDARY_SELECTOR,
    // Menus wrap from the last row to the first and back, as macOS menus do;
    // a picker's list clamps instead.
    wrap: true,
    hasPaging: true,
    onEscape: closeMenu,
  });

  // Typeahead over the (enabled) menu items — jump to the next item whose
  // LABEL starts with the typed text, never its description, shortcut or
  // badge. Reuses the hook's scoped item collection so an inline submenu
  // flyout's items aren't swept in.
  const typeahead = useTypeahead({
    getItemLabels: () => getMenuItems().map(el => el.textContent),
    onMatch: focusItem,
    getCurrentIndex: () =>
      getMenuItems().findIndex(
        el =>
          el === document.activeElement || el.contains(document.activeElement),
      ),
  });

  // Mounting already open (`isMenuOpen` true on the first render) is not an
  // open anyone asked for, so it must not move focus into the menu — that
  // drops keyboard users mid-page. The flag is decided once at mount
  // rather than per effect run, because the layer may defer the first show
  // until its popover element mounts; it clears once the consumer closes the
  // menu, so every later open follows the modality rules above.
  const isMountedOpenRef = useRef(isControlled && controlledIsOpen === true);

  // Sync controlled open state → popover. A trigger open is committed first so
  // Popover can reject the dismissing gesture before notifying the controller.
  // If the controller has not accepted by the next layout pass, roll the DOM
  // state back before paint without emitting a second change request.
  useIsomorphicLayoutEffect(() => {
    if (!isControlled) {
      return;
    }
    if (controlledIsOpen) {
      pendingControlledOpenRef.current = false;
      if (!popover.isOpen) {
        shouldFocusOnOpenRef.current = !isMountedOpenRef.current;
        popover.show();
      }
    } else {
      isMountedOpenRef.current = false;
      if (popover.isOpen) {
        suppressControlledRollbackHideRef.current =
          pendingControlledOpenRef.current;
        pendingControlledOpenRef.current = false;
        popover.hide();
      }
    }
  }, [controlledIsOpen, isControlled, popover]);

  // Move focus into the menu only after the layer has committed open,
  // honoring the input modality: keyboard (and programmatic) opens land on
  // the first enabled item per the APG menu-button pattern; pointer opens
  // focus the menu container itself (tabIndex={-1}) so no item is
  // highlighted as if pre-selected. Container focus keeps arrows,
  // typeahead, Escape and Tab in the menu's onKeyDown, and is also the
  // fallback when no item is focusable (e.g. all disabled), mirroring the
  // submenu flyout fallback.
  // Solo: the pending open-time focus frame, cancelled if the menu closes
  // first (a pick within the same frame) so it cannot pull focus back into a
  // closed menu after focus returned to the trigger.
  const openFocusFrameRef = useRef<number | null>(null);
  useEffect(() => {
    if (popover.isOpen || openFocusFrameRef.current == null) {
      return;
    }
    cancelAnimationFrame(openFocusFrameRef.current);
    openFocusFrameRef.current = null;
  }, [popover.isOpen]);

  useEffect(() => {
    if (!popover.isOpen || !shouldFocusOnOpenRef.current) {
      return;
    }
    shouldFocusOnOpenRef.current = false;
    openFocusFrameRef.current = requestAnimationFrame(() => {
      openFocusFrameRef.current = null;
      const focusEnd = focusLastOnOpenRef.current ? focusLast : focusFirst;
      const modality = openModalityRef.current;
      focusLastOnOpenRef.current = false;
      openModalityRef.current = 'keyboard';
      // Solo: if focus already moved onto an item inside the menu before this
      // frame ran (a fast pick, or a programmatic focus), leave it there —
      // otherwise the stale open-time focus pulls it back to the container.
      const list = listRef.current;
      const active = list?.ownerDocument.activeElement;
      if (list && active && active !== list && list.contains(active)) {
        return;
      }
      if (modality === 'pointer' || !focusEnd()) {
        list?.focus();
      }
    });
  }, [popover.isOpen, focusFirst, focusLast, listRef]);

  // Extend useListFocus with Enter/Space activation + typeahead
  const listKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // A submenu flyout renders inline inside this menu; its key events bubble
      // up here. Let that level own them — only handle events from this level.
      if (!ownsEvent(e)) {
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // The key that opened the menu, held down, auto-repeats into the menu
        // once focus has moved there; a repeat is never an activation.
        if (e.repeat) {
          return;
        }
        const focused = document.activeElement as HTMLElement | null;
        if (
          focused &&
          MENU_ITEM_ROLES.has(focused.getAttribute('role') ?? '')
        ) {
          // The synthesized click keeps the key's modifiers, so a modified
          // Enter on a link row opens the way a modified click would.
          activateMenuItem(focused, e);
        }
        return;
      }
      // APG menu-button pattern: Tab closes the menu. Menu items are
      // tabIndex={-1} so the focus trap has nothing trappable and Tab would
      // otherwise leak into the page while the menu stayed open (menus-5).
      // Do NOT preventDefault — closing restores focus to the trigger, and the
      // browser's default Tab then continues from there to the next element.
      if (e.key === 'Tab') {
        closeMenu();
        return;
      }
      // Type-to-focus next; if it consumed a printable key, stop here.
      if (typeahead.onKeyDown(e)) {
        e.preventDefault();
        return;
      }
      listNavKeyDown(e);
    },
    [listNavKeyDown, closeMenu, typeahead, ownsEvent],
  );

  const openAndFocus = useCallback(
    (
      modality: 'keyboard' | 'pointer' = 'keyboard',
      notifyClick = false,
    ): boolean => {
      acceptedOpenRef.current = false;
      notifyClickOnShowRef.current = notifyClick;
      pendingControlledOpenRef.current = isControlled;
      openModalityRef.current = modality;
      shouldFocusOnOpenRef.current = true;
      popover.show();
      if (!acceptedOpenRef.current) {
        notifyClickOnShowRef.current = false;
        pendingControlledOpenRef.current = false;
        openModalityRef.current = 'keyboard';
        shouldFocusOnOpenRef.current = false;
        return false;
      }
      return true;
    },
    [isControlled, popover],
  );

  const isMenuOpenNow = isControlled
    ? controlledIsOpen === true
    : popover.isOpen;

  // A mouse opens on press-down; a finger held on the trigger opens after
  // the long-press delay. Pressing the trigger of an open menu closes it, and
  // the click of that same gesture — reported by `isTriggerClickFromPress` —
  // neither toggles nor reopens.
  const handleTriggerPress = useCallback(
    (pointerType: MenuPressPointerType): boolean => {
      if (isMenuOpenNow) {
        if (pointerType !== 'mouse') {
          // A finger's tap toggles through its click, as it always did.
          return false;
        }
        onClick?.();
        if (isControlled) {
          onOpenChange?.(false);
        } else {
          popover.hide();
        }
        return false;
      }
      const didOpen = openAndFocus('pointer', true);
      if (didOpen && pointerType === 'mouse') {
        // The menu is `popover="auto"`: the browser's light dismiss would
        // read the release of this very press, on the trigger outside the
        // popover, as a dismissal. Holding the invoker relationship through
        // the press exempts the trigger, the way useKeepLayerOpenProps does
        // for controls beside an open layer.
        holdInvokerThroughPress(buttonRef.current, popover.id);
      }
      return didOpen;
    },
    [isMenuOpenNow, isControlled, onClick, onOpenChange, openAndFocus, popover],
  );

  // The press model: the row under a release acts, the highlight follows a
  // held pointer. A mouse released outside the menu dismisses it; a finger
  // released outside leaves it open, so the hook never calls onDismiss then.
  const menuPress = useMenuPress({
    menuRef: listRef,
    triggerRef: buttonRef,
    itemSelector: MENU_ITEM_SELECTOR,
    onTriggerPress: handleTriggerPress,
    onDismiss: closeMenu,
  });
  cancelMenuPressRef.current = menuPress.cancel;

  const handleButtonClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // The press already opened or closed the menu; its click is spent.
      if (menuPress.isTriggerClickFromPress()) {
        return;
      }
      // detail === 0 marks a synthesized click (screen reader / AT
      // activation): treat it as keyboard so those users still land on the
      // first item. Real pointer clicks report detail >= 1.
      const modality = e.detail === 0 ? 'keyboard' : 'pointer';
      if (isControlled) {
        if (controlledIsOpen) {
          onClick?.();
          onOpenChange?.(false);
        } else {
          openAndFocus(modality, true);
        }
      } else if (popover.isOpen) {
        onClick?.();
        popover.hide();
      } else {
        openAndFocus(modality, true);
      }
    },
    [
      menuPress,
      onClick,
      isControlled,
      onOpenChange,
      controlledIsOpen,
      popover,
      openAndFocus,
    ],
  );

  const handleTriggerClickCapture = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const control = e.currentTarget;
      if (control.hasAttribute('popovertarget')) {
        // Still the invoker from a press-open: the browser would toggle the
        // menu shut on this click.
        e.preventDefault();
        control.removeAttribute('popovertarget');
      }
    },
    [],
  );

  const handleButtonKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!popover.isOpen) {
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'Enter' ||
          e.key === ' '
        ) {
          e.preventDefault();
          if (e.repeat) {
            return;
          }
          focusLastOnOpenRef.current = e.key === 'ArrowUp';
          openAndFocus();
        }
        return;
      }
      // Open with focus still on the trigger — a menu that mounted open, or
      // a pointer open followed by Shift+Tab — has nothing in the tab order
      // to reach its items, so ArrowDown walks in the way a keyboard open
      // would land. Enter/Space keep toggling the menu closed, and
      // once focus is inside, key events go to the menu container instead.
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!focusFirst()) {
          listRef.current?.focus();
        }
      }
    },
    [popover.isOpen, openAndFocus, focusFirst, listRef],
  );

  // Icon-only
  const isIconOnly = button.isIconOnly === true;
  const resolvedEndContent =
    button.endContent ??
    (hasChevron && !isIconOnly ? (
      <Icon icon="chevronDown" size="sm" color="inherit" />
    ) : undefined);

  const requestedWidthLimit =
    alignment === 'center'
      ? MENU_MAX_INLINE_SIZE_FALLBACK
      : MENU_POSITION_AREA_MAX_INLINE_SIZE_FALLBACK;
  const resolvedMenuWidth = menuWidth
    ? resolveMenuWidth(menuWidth, requestedWidthLimit)
    : null;
  const popoverWidthClassName = resolvedMenuWidth
    ? resolvedMenuWidth.property === 'inlineSize'
      ? styles.popoverCustomIntrinsicWidth
      : styles.popoverCustomWidth
    : alignment === 'center'
      ? styles.popoverCentered
      : styles.popoverAligned;
  const isSidePlacement = placement === 'start' || placement === 'end';

  // The drill-in view stack for sub-menus on a phone.
  const {drillIn, wrapContent} = useMenuDrillIn(isOpen);
  // The name a drilled-in view's Back row returns to.
  const menuLabel = typeof button.label === 'string' ? button.label : undefined;

  const resolvedMaxHeight = menuMaxHeight == null ? null : `${menuMaxHeight}px`;
  const maxHeightStyle =
    resolvedMaxHeight != null
      ? ({
          '--_dropdown-menu-max-height': resolvedMaxHeight,
        } as React.CSSProperties)
      : undefined;
  // Context for compound items
  const contextValue = useMemo<DropdownMenuContextValue>(
    () => ({closeMenu, menuSize, drillIn, menuLabel}),
    [closeMenu, menuSize, drillIn, menuLabel],
  );

  // Resolve menu content: data-driven items become components
  const menuContent = wrapContent(
    props.items !== undefined ? renderDropdownItems(items) : children,
  );
  const hasOverflow = useMenuOverflow(listRef, menuContent, popover.isOpen);

  const triggerProps: DropdownMenuTriggerProps = {
    ref: el => {
      buttonRef.current = el;
      popover.triggerRef(el);
    },
    id: triggerId,
    onClick: handleButtonClick,
    onClickCapture: handleTriggerClickCapture,
    onPointerDown: menuPress.triggerProps.onPointerDown,
    onContextMenu: menuPress.triggerProps.onContextMenu,
    onKeyDown: handleButtonKeyDown,
    // The popover's focus-return hook is a separate change; until it lands
    // the control's focus needs no bookkeeping here.
    onFocus: () => {},
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    'aria-controls': menuId,
  };

  return (
    <>
      {renderTrigger != null ? (
        renderTrigger(triggerProps)
      ) : (
        <Button
          {...button}
          ref={el => {
            buttonRef.current = el;
            popover.triggerRef(el);
            const consumerRef = button.ref;
            if (typeof consumerRef === 'function') {
              consumerRef(el);
            } else if (consumerRef) {
              /* eslint-disable react-compiler/react-compiler -- ref callback: forwarding consumer ref object */
              consumerRef.current = el;
              /* eslint-enable react-compiler/react-compiler */
            }
          }}
          className={cn(
            styles.triggerPressable,
            isOpen && styles.triggerOpen,
            button.className,
            isFocusRingSuppressed && styles.triggerFocusSuppressed,
          )}
          tooltip={isOpen ? undefined : button.tooltip}
          endContent={resolvedEndContent}
          onClick={handleButtonClick}
          onClickCapture={event => {
            button.onClickCapture?.(event);
            handleTriggerClickCapture(event);
          }}
          onKeyDown={handleButtonKeyDown}
          onPointerDown={event => {
            button.onPointerDown?.(event);
            menuPress.triggerProps.onPointerDown(event);
          }}
          onContextMenu={event => {
            button.onContextMenu?.(event);
            menuPress.triggerProps.onContextMenu(event);
          }}
          onFocus={event => {
            button.onFocus?.(event);
            onFocusReturnTargetFocus();
          }}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={menuId}
          data-testid={testId}
        />
      )}
      {popover.render(
        <div
          {...rest}
          ref={el => {
            listRef.current = el;
            contentRef.current =
              el?.closest<HTMLDivElement>('[popover]') ?? null;
          }}
          id={menuId}
          role="menu"
          // Pointer opens focus the container so arrows, typeahead, Escape and
          // Tab remain owned by the menu without pre-highlighting an item.
          // An overflowing menu joins the Tab order so its scrollable region is
          // keyboard-accessible; Tab still dismisses through listKeyDown.
          tabIndex={hasOverflow ? 0 : -1}
          // Give the menu an accessible name from its trigger's label, so
          // screen readers announce e.g. "Actions menu" rather than an unnamed
          // menu (menus-13). A custom trigger names it by reference.
          aria-label={
            renderTrigger != null
              ? (rest['aria-label'] as string | undefined)
              : button.label
          }
          aria-labelledby={
            renderTrigger != null && rest['aria-label'] == null
              ? triggerId
              : (rest['aria-labelledby'] as string | undefined)
          }
          onKeyDown={listKeyDown}
          {...menuPress.menuProps}
          {...mergeProps(
            themeProps('dropdown-menu'),
            {
              className: cn(
                styles.dropdown,
                resolvedMaxHeight != null
                  ? dynamicStyles.menuMaxHeight
                  : styles.dropdownMaxHeight,
                hasOverflow ? styles.touchPanY : styles.touchNone,
                hasOverflow && styles.scrollable,
              ),
              style: maxHeightStyle,
            },
            className,
            style,
          )}>
          <DropdownMenuContext value={contextValue}>
            {menuContent}
          </DropdownMenuContext>
        </div>,
        {
          placement,
          alignment,
          offset: spacingVars['--spacing-1'],
          className: cn(
            styles.popoverViewport,
            resolvedMaxHeight != null
              ? dynamicStyles.popoverViewportMaxBlockSize
              : styles.popoverViewportDefaultMaxBlockSize,
            alignment === 'center'
              ? isSidePlacement
                ? styles.popoverViewportBlockCentered
                : styles.popoverViewportCentered
              : [
                  styles.popoverViewportAligned,
                  isSidePlacement
                    ? alignment === 'start'
                      ? styles.popoverViewportBlockStart
                      : styles.popoverViewportBlockEnd
                    : alignment === 'start'
                      ? styles.popoverViewportStart
                      : styles.popoverViewportEnd,
                ],
            popoverWidthClassName,
            layerAnimations[placement],
          ),
          style:
            maxHeightStyle != null || resolvedMenuWidth != null
              ? ({
                  ...maxHeightStyle,
                  ...(resolvedMenuWidth != null
                    ? {'--_dropdown-menu-width': resolvedMenuWidth.value}
                    : null),
                } as React.CSSProperties)
              : undefined,
        },
      )}
    </>
  );
}

export function DropdownMenu(props: DropdownMenuProps) {
  const {onOpenChange} = props;
  // Both presentations hang the menu off ONE control.
  useDevWarning(
    'DropdownMenu',
    '`button` and `trigger` are mutually exclusive: the menu hangs off one ' +
      'control. `trigger` wins; drop `button`.',
    props.button != null && props.renderTrigger != null,
  );
  const requestedPresentation =
    'items' in props ? (props.presentation ?? 'popover') : 'popover';
  const resolvedPresentation = useAdaptivePresentation(requestedPresentation);
  const isControlled = props.isMenuOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isControlled ? props.isMenuOpen : internalIsOpen;
  const handleOpenChange = useCallback(
    (nextIsOpen: boolean) => {
      onOpenChange?.(nextIsOpen);
      if (!isControlled) {
        setInternalIsOpen(nextIsOpen);
      }
    },
    [isControlled, onOpenChange],
  );
  const sharedProps = {
    ...props,
    isMenuOpen: isOpen,
    onOpenChange: handleOpenChange,
  };

  if (
    resolvedPresentation === 'bottom-sheet' &&
    'items' in props &&
    props.items !== undefined
  ) {
    return (
      <DropdownMenuBottomSheet
        {...(sharedProps as DropdownMenuDataProps)}
        presentation="bottom-sheet"
      />
    );
  }

  return <DropdownMenuPopover {...sharedProps} presentation="popover" />;
}

DropdownMenu.displayName = 'DropdownMenu';
