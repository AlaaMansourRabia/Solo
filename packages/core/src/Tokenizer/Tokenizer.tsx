'use client';

/**
 * @file Tokenizer.tsx
 * @input Uses React, BaseTypeahead, Field, Token, useAnnounce
 * @output Exports Tokenizer multi-select typeahead component
 * @position Composed component; forwards DOM ref and exposes focus control via
 *   handleRef
 *
 * SYNC: When modified, update:
 * - /packages/core/src/Tokenizer/index.ts
 * - /apps/storybook/stories/Tokenizer.stories.tsx
 */

import React, {
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  BusyIndicatorLaneProvider,
  createBusyIndicatorLane,
  useIsBusy,
  type BusyIndicatorLane,
} from '../Typeahead/busyIndicatorLane';
import type {BaseProps} from '../BaseProps';
import type {SizeValue} from '../utils/types';
import {BaseTypeahead} from '../Typeahead/BaseTypeahead';
import {useSize} from '../SizeContext/SizeContext';
import {
  Field,
  InputClearButton,
  type InputStatus,
  inputWrapperStyles,
  inputStatusBorderStyles,
  inputStatusHoverShadowStyles,
  inputStatusFocusWithinStyles,
  type FieldStatusVariant,
} from '../Field';
import {Token} from '../Token';
import {Spinner} from '../Spinner';
import {useEndLaneReserve} from './useEndLaneReserve';
import {renderIconSlot, type IconType} from '../Icon';
import {OverflowList} from '../OverflowList';
import {useLayer} from '../Layer/useLayer';
import {useTooltip} from '../Tooltip';
import {useAnnounce} from '../hooks/useAnnounce';
import {spacingVars} from '../theme/tokenVars';
import type {SearchableItem, SearchSource} from '../Typeahead/types';
import {mergeProps} from '../utils';
import {cn} from '../utils/cn';
import {themeProps} from '../utils/themeProps';
import {useTranslator} from '../i18n';
import {useRenamedProp} from '../hooks/useRenamedProp';

// Re-export status types for convenience
export type {
  InputStatus as TokenizerStatus,
  InputStatusType as TokenizerStatusType,
} from '../Field';

// =============================================================================
// Types
// =============================================================================

/**
 * Change metadata for onChange callback.
 */
export type TokenizerChange<T extends SearchableItem> =
  | {item: T; type: 'add'}
  | {item: T; type: 'create'}
  | {item: T; type: 'remove'}
  | {type: 'reorder'};

export type TokenizerSize = 'sm' | 'md' | 'lg';

/**
 * Controls overflow behavior when tokens exceed the available width.
 * - `'none'`: All tokens wrap normally (default).
 * - `'unfocusedInline'`: Shows a single line with "+ N more" when unfocused, expands inline on focus.
 * - `'unfocusedLayer'`: Shows a single line with "+ N more" when unfocused, expands as an overlay on focus.
 */
export type TokenizerOverflowBehavior =
  'none' | 'unfocusedInline' | 'unfocusedLayer';

/**
 * Imperative handle for Tokenizer handleRef.
 */
export interface TokenizerHandle {
  /** Focus the typeahead input. */
  focus(): void;
  /** Blur the typeahead input. */
  blur(): void;
}

export interface TokenizerProps<T extends SearchableItem> extends Omit<
  BaseProps<HTMLDivElement>,
  'onChange'
> {
  /** Accessible label (required). */
  label: string;
  /** Visually hide the label. @default false */
  isLabelHidden?: boolean;
  /** Helper text. */
  description?: string;
  /** Required field. @default false */
  isRequired?: boolean;
  /** Optional field. @default false */
  isOptional?: boolean;
  /** Validation status. */
  status?: InputStatus;
  /**
   * How the status message is placed relative to the input.
   * - 'attached': message overlaps directly below the input (bordered treatment)
   * - 'detached': message floats below as a separate element with spacing
   * @default 'attached'
   */
  statusVariant?: FieldStatusVariant;
  /**
   * Icon to display at the start of the input.
   * Accepts a ReactNode (e.g. `<Icon icon={SearchIcon} />`) or an SVG icon component directly.
   */
  startIcon?: ReactNode | IconType;
  /**
   * Width of the field. Numbers are treated as pixels, strings are used as-is
   * (e.g. `'100%'`). Sizes the whole field (label, control, and status) so they
   * stay aligned, unlike setting width via `className`/`style`.
   */
  width?: SizeValue;
  /** Label tooltip. */
  labelTooltip?: string;
  /** Search source providing items. */
  searchSource: SearchSource<T>;
  /** Currently selected items. */
  value: T[];

  /**
   * The HTML name attribute for form submissions. When set, hidden inputs
   * carry one entry per selected item's id under this name.
   */
  htmlName?: string;
  /** Callback when selection changes. Includes change metadata. */
  onChange: (items: T[], change: TokenizerChange<T>) => void;
  /** Render function for dropdown items. Default: TypeaheadItem. */
  renderItem?: (item: T) => ReactNode;
  /** Render function for selected tokens. Default: Token with label + onRemove. */
  renderToken?: (item: T, onRemove: () => void) => ReactNode;
  /** Max number of selections. */
  maxEntries?: number;
  /** Placeholder text (shown when no tokens selected). */
  placeholder?: string;
  /** Show results on focus before typing. @default false */
  hasEntriesOnFocus?: boolean;
  /** Max dropdown items. @default 10 */
  maxMenuItems?: number;
  /** Fixed dropdown width in pixels. Never shrinks below the input width. */
  menuWidth?: number;
  /**
   * Minimum query length before the search source is queried. Below it no
   * search runs and the menu stays closed — useful for remote sources where
   * one or two characters match too much to be worth fetching.
   *
   * With `hasCreate`, the "Create" entry rides on the search results, so it
   * also waits for the threshold.
   *
   * @default 1
   */
  minQueryLength?: number;
  /**
   * Content shown when the query matched nothing.
   * Takes a `ReactNode`, so a dead end can carry a link or a create row.
   *
   * The message is announced in a polite live region as the text it renders,
   * read from the DOM, so an element is announced as written and anything
   * marked `aria-hidden` is left out of both. Content that renders no text
   * announces nothing, matching the screen.
   *
   * `null` means "not given", exactly as `undefined` does, so it falls
   * through to the default. Pass an empty string to render nothing.
   *
   * @default 'No results found'
   */
  emptySearchText?: ReactNode;

  /**
   * Text shown when no results found.
   * @default 'No results found'
   * @deprecated Renamed to `emptySearchText`, which takes a
   * `ReactNode` rather than a `string` — every existing value stays valid.
   * Still works exactly as released; `emptySearchText` wins when both
   * are set. Removal comes in a later minor.
   */
  emptySearchResultsText?: string;
  /** Whether the input is disabled. @default false */
  isDisabled?: boolean;
  /**
   * Explains why the tokenizer is disabled. When set together with
   * `isDisabled`, the tokenizer shows a tooltip with this text on hover and
   * keyboard focus, and the input stays focusable (via `aria-disabled`) so the
   * reason is discoverable by keyboard and assistive technology. Input stays
   * blocked.
   *
   * Use this instead of wrapping a disabled tokenizer in `Tooltip` — disabled
   * controls don't emit the pointer events an external tooltip needs.
   */
  disabledMessage?: string;
  /** Show clear button (clears all tokens). @default false */
  hasClear?: boolean;
  /**
   * Content to display at the end of the input row.
   * Useful for buttons, result counts, or other controls.
   */
  endContent?: ReactNode;
  /** Auto-focus on mount. @default false */
  hasAutoFocus?: boolean;
  /** Input size. @default 'md' */
  size?: TokenizerSize;
  /**
   * Controls how tokens overflow when the container is too narrow.
   * - `'none'`: Tokens wrap to multiple lines (default).
   * - `'unfocusedInline'`: Single line with "+ N more" when unfocused; expands inline on focus.
   * - `'unfocusedLayer'`: Single line with "+ N more" when unfocused; expands as overlay on focus.
   * @default 'none'
   */
  tokenOverflowBehavior?: TokenizerOverflowBehavior;
  /**
   * Debounce delay in ms before triggering search after typing.
   * Set to 0 for synchronous/local search sources that don't need debouncing.
   * @default 150
   */
  debounceMs?: number;
  /**
   * Allow users to create new tokens from free-text input.
   * When true, pressing Enter with text in the input commits the typed value
   * as a new token — even if the search source returned no results.
   * @default false
   */
  hasCreate?: boolean;
  /** Query change callback. */
  onChangeQuery?: (query: string) => void;
  /** Fires when focus enters the tokenizer from outside. */
  onFocus?: (e: React.FocusEvent) => void;
  /** Fires when focus leaves the tokenizer entirely. */
  onBlur?: (e: React.FocusEvent) => void;
  /** Ref forwarded to the root field element. */
  ref?: React.Ref<HTMLDivElement>;
  /** Imperative handle ref for focus/blur control. */
  handleRef?: React.Ref<TokenizerHandle>;
}

// =============================================================================
// Styles
// =============================================================================

// How far the end lane sits from the field's inline-end border, named once
// because the input's reserve is derived from the same value.
const END_LANE_INSET = spacingVars['--spacing-2'];
// Spelled out literally in the classes below (Tailwind needs literal class
// strings):
//   TOKEN_ROW_INSET = calc(var(--spacing-1) - 1px)
//   INPUT_CLEAR_COARSE_POINTER_OUTSET = 2px — InputClearButton grows 2px past
//     its visible box under `(pointer: coarse)`. Keep this maximum reserve in
//     sync with Field/InputClearButton.tsx.
//   END_LANE_RESERVE_VAR = --_tokenizer-end-lane-reserve — kept in sync with
//     useEndLaneReserve: inputCompact reads the custom property directly so its
//     empty-query pseudo-class can suppress the inner reserve.

const styles = {
  wrapper: cn(
    'relative flex-wrap gap-(--spacing-1)',
    'cursor-text [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    'h-auto',
  ),
  // Override padding for border concentricity: token border-radius
  // (radius-1: 4px) sits concentric with wrapper border-radius
  // (radius-2: 8px) when inset = radius-2 - radius-1 - border
  // = 8 - 4 - 1 = 3px.
  // Row gap must match paddingBlock so wrapped rows look evenly spaced.
  wrapperWithTokens: cn(
    'py-[calc(var(--spacing-1)_-_1px)] px-[calc(var(--spacing-1)_-_1px)]',
    'gap-y-[calc(var(--spacing-1)_-_1px)]',
  ),
  // Restore the default 8px inline-start inset when tokens are present,
  // since wrapperWithTokens reduces padding to 3px for border concentricity.
  startIconWithTokens:
    'ms-[calc(var(--spacing-2)_-_var(--spacing-1)_+_1px)] relative z-1',
  token: 'flex shrink-0 relative z-1',
  // Match the field's inline padding (inputWrapperStyles.base uses
  // spacing-2) so end content (clear button, resultCount) lines up with
  // the text/start-icon inset instead of hugging the border at ~3px.
  endSection:
    'absolute end-(--spacing-2) flex items-center gap-(--spacing-2) shrink-0 z-1',
  inputAtMax: 'w-0 min-w-0 flex-[0_0_0] p-0 opacity-0 absolute',
  // The empty input is a first-row background hit surface. Taking it out of
  // flex layout means it can neither become a blank final row nor compete
  // with the pills for width. Logical insets stop it before the measured end
  // lane plus InputClearButton's maximum invisible pointer outset; tokens and
  // controls sit above it, leaving only genuine whitespace clickable as
  // search. Typing restores the ordinary in-flow input.
  inputCompact: cn(
    'relative placeholder-shown:absolute box-border',
    'start-auto placeholder-shown:start-[calc(var(--spacing-1)_-_1px)]',
    'z-0',
    'min-w-[40px] placeholder-shown:min-w-[1px]',
    'flex-[1_1_40px] placeholder-shown:flex-[0_0_auto]',
    'w-0 placeholder-shown:w-[calc(100%_-_calc(var(--spacing-1)_-_1px)_-_var(--_tokenizer-end-lane-reserve,calc(var(--spacing-1)_-_1px))_-_2px_-_1px)]',
    'ps-[calc(var(--spacing-2)_-_var(--spacing-1)_+_1px)] placeholder-shown:ps-0',
    'pe-[var(--_tokenizer-end-lane-reserve,0px)] placeholder-shown:pe-(--spacing-1)',
    'text-start placeholder-shown:text-end',
  ),
  truncatedWrapper: 'flex-nowrap overflow-hidden',
  // Top-layer popover: match the anchor width exactly so the expanded
  // tokenizer looks like an in-place expansion, overlapping the
  // placeholder from its top edge.
  layerPopover: 'w-[anchor-size(width)]',
  overflowText: cn(
    'shrink-0 whitespace-nowrap text-(length:--text-supporting-size)',
    'text-(--color-text-secondary) px-(--spacing-1)',
  ),
} as const;

const sizeStyles = {
  sm: 'min-h-(--size-element-sm)',
  md: 'min-h-(--size-element-md)',
  lg: 'min-h-(--size-element-lg)',
} as const;

const endSectionSizeStyles = {
  sm: 'top-[calc(var(--size-element-sm)/2_-_1px)] [transform:translateY(-50%)]',
  md: 'top-[calc(var(--size-element-md)/2_-_1px)] [transform:translateY(-50%)]',
  lg: 'top-[calc(var(--size-element-lg)/2_-_1px)] [transform:translateY(-50%)]',
} as const;

const compactInputSizeStyles = {
  sm: cn(
    '[inset-block-start:auto] placeholder-shown:[inset-block-start:calc(var(--size-element-sm)/2_-_1px)]',
    '[transform:none] placeholder-shown:[transform:translateY(-50%)]',
  ),
  md: cn(
    '[inset-block-start:auto] placeholder-shown:[inset-block-start:calc(var(--size-element-md)/2_-_1px)]',
    '[transform:none] placeholder-shown:[transform:translateY(-50%)]',
  ),
  lg: cn(
    '[inset-block-start:auto] placeholder-shown:[inset-block-start:calc(var(--size-element-lg)/2_-_1px)]',
    '[transform:none] placeholder-shown:[transform:translateY(-50%)]',
  ),
} as const;

const truncatedSizeStyles = {
  sm: 'h-(--size-element-sm)',
  md: 'h-(--size-element-md)',
  lg: 'h-(--size-element-lg)',
} as const;

const layerPlaceholderSizeStyles = {
  sm: 'h-(--size-element-sm)',
  md: 'h-(--size-element-md)',
  lg: 'h-(--size-element-lg)',
} as const;

// =============================================================================
// Component
// =============================================================================

// Sentinel prefix for creatable items — used to distinguish
// "Create: X" suggestions from real search results.
const CREATABLE_ID_PREFIX = '__solo_create__';

/**
 * Multi-select input with token chips and typeahead search.
 *
 * Composes BaseTypeahead for search and Token for selected items.
 * Tokens render inline before the text input. Selecting an item adds a token
 * and clears the query. Backspace on empty input removes the last token.
 *
 * @example
 * ```
 * const [members, setMembers] = useState<UserItem[]>([]);
 * <Tokenizer
 *   label="Team members"
 *   searchSource={userSource}
 *   value={members}
 *   onChange={(items, change) => {
 *     setMembers(items);
 *     if (change.type === 'add') {
 *       console.log('Added:', change.item.label);
 *     }
 *   }}
 *   placeholder="Search people..."
 * />
 * <Tokenizer
 *   label="Tags"
 *   searchSource={tagSource}
 *   value={tags}
 *   onChange={(items) => setTags(items)}
 *   renderToken={(item, onRemove) => (
 *     <Token
 *       label={item.label}
 *       color={item.auxiliaryData.color}
 *       onRemove={onRemove}
 *     />
 *   )}
 *   maxEntries={5}
 * />
 * ```
 */
/**
 * The field's inline-end lane: the busy Spinner, then `endContent`, then the
 * clear button — pinned to the field's first row while tokens wrap below it.
 *
 * A separate component so that subscribing to the busy state re-renders THIS
 * and nothing else. Subscribed from `Tokenizer`, a search transition
 * re-rendered every selected token twice — twenty tokens meant forty renders
 * per search for one glyph none of them contain.
 *
 * Renders nothing when the lane would be empty, so `useEndLaneReserve` sees no
 * element, publishes no width, and the input keeps its full content box.
 */
function EndLane({
  lane,
  laneRef,
  laneClassName,
  loadingLabel,
  hasStaticContent,
  children,
}: {
  lane: BusyIndicatorLane;
  laneRef: (node: HTMLElement | null) => void;
  laneClassName: string;
  loadingLabel: string;
  hasStaticContent: boolean;
  children: ReactNode;
}) {
  const isBusy = useIsBusy(lane);
  if (!isBusy && !hasStaticContent) {
    return null;
  }
  return (
    <div ref={laneRef} className={laneClassName}>
      {isBusy && <Spinner size="sm" aria-label={loadingLabel} />}
      {children}
    </div>
  );
}

export function Tokenizer<T extends SearchableItem>({
  label,
  isLabelHidden = false,
  description,
  isRequired = false,
  isOptional = false,
  status,
  statusVariant = 'attached',
  startIcon,
  labelTooltip,
  searchSource,
  value,
  onChange,
  renderItem,
  renderToken,
  maxEntries,
  placeholder,
  hasEntriesOnFocus,
  maxMenuItems,
  menuWidth,
  minQueryLength,
  emptySearchResultsText,
  emptySearchText: emptySearchTextFromProps,
  isDisabled = false,
  htmlName,
  disabledMessage,
  hasClear = false,
  endContent,
  hasAutoFocus,
  size: sizeProp,
  tokenOverflowBehavior = 'none',
  debounceMs,
  hasCreate = false,
  onChangeQuery,
  onFocus,
  onBlur,
  width,
  className,
  style,
  'data-testid': testId,
  ref,
  handleRef,
}: TokenizerProps<T>) {
  const t = useTranslator();
  const size = useSize(sizeProp, 'md');
  const inputId = useId();
  const descriptionId = useId();
  const statusMessageId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Disabled-reason tooltip. Disabled controls swallow pointer events, so the
  // tooltip listeners attach to the input wrapper and the typeahead input stays
  // perceivable via aria-disabled instead of the disabled attribute. Input is
  // blocked by the isDisabled guards in BaseTypeahead and handleWrapperClick.
  const showsDisabledMessage = isDisabled && !!disabledMessage;
  const disabledMessageTooltip = useTooltip({
    placement: 'above',
    // The wrapper is not naturally focusable; focusin bubbles up from the
    // input, so always attach focus listeners.
    focusTrigger: 'always',
    isEnabled: showsDisabledMessage,
  });

  // The replacement wins, the released name keeps working, and development
  // says which one was read.
  const emptySearchText = useRenamedProp<ReactNode>({
    component: 'Tokenizer',
    deprecated: 'emptySearchResultsText',
    deprecatedValue: emptySearchResultsText,
    replacement: 'emptySearchText',
    value: emptySearchTextFromProps,
  });

  useImperativeHandle(handleRef, () => ({
    focus() {
      inputRef.current?.focus();
    },
    blur() {
      inputRef.current?.blur();
    },
  }));

  // Focus-within state for overflow truncation
  // Reported by BaseTypeahead so the indicator can live in this field's own
  // end lane, beside endContent and the clear button.
  // The base owns the busy state; this field only paints it. Held in a store
  // rather than this component's state — held here, a search transition
  // re-rendered every selected token twice, for a glyph no token contains.
  // See busyIndicatorLane.tsx.
  const busyLane = useMemo(() => createBusyIndicatorLane(), []);
  // What sits in the end lane varies most here — a spinner, arbitrary
  // `endContent`, a clear button, or all three — so its width is measured
  // rather than assumed, and the input reserves it.
  const [laneRef, laneReserve] = useEndLaneReserve(END_LANE_INSET);
  // The half of the lane's contents this component knows about. The busy half
  // is the leaf's own business — folding it in here would mean reading the
  // busy state during this render, which is exactly the re-render the store
  // exists to avoid.
  const hasClearButton = hasClear && value.length > 0 && !isDisabled;
  const hasStaticEndLane = Boolean(endContent || hasClearButton);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const isTruncated =
    !isFocusedWithin && tokenOverflowBehavior !== 'none' && value.length > 0;

  // Layer for unfocusedLayer mode — promotes expanded content to the top layer
  // so it isn't clipped by ancestor overflow.
  const isLayerMode = tokenOverflowBehavior === 'unfocusedLayer';
  const layer = useLayer({mode: 'context'});
  const layerContentRef = useRef<HTMLDivElement>(null);

  // Anchor the layer to the placeholder element
  const placeholderRef = useCallback(
    (el: HTMLElement | null) => {
      if (isLayerMode) {
        layer.ref(el);
      }
    },
    [isLayerMode, layer],
  );

  // For the layer variant, focus can be in either the placeholder or the
  // popover content. We track both to decide when focus has truly left.
  const isFocusInTokenizer = useCallback(
    (target: Node | null): boolean => {
      if (!target) {
        return false;
      }
      if (wrapperRef.current?.contains(target)) {
        return true;
      }
      if (layerContentRef.current?.contains(target)) {
        return true;
      }
      // Also check the popover element itself (the layer wrapper)
      const popoverEl = document.getElementById(layer.id);
      if (popoverEl?.contains(target)) {
        return true;
      }
      return false;
    },
    [layer.id],
  );

  const handleFocusCapture = useCallback(
    (e: React.FocusEvent) => {
      const comingFromOutside = !isFocusInTokenizer(e.relatedTarget);
      setIsFocusedWithin(true);
      if (isLayerMode) {
        layer.show();
      }
      if (comingFromOutside) {
        onFocus?.(e);
        // Redirect to the input so the user doesn't have to tab through
        // every token remove button.
        if (e.target !== inputRef.current) {
          inputRef.current?.focus();
        }
      }
    },
    [isLayerMode, layer, isFocusInTokenizer, onFocus],
  );

  const handleBlurCapture = useCallback(
    (e: React.FocusEvent) => {
      if (!isFocusInTokenizer(e.relatedTarget)) {
        setIsFocusedWithin(false);
        onBlur?.(e);
        if (isLayerMode) {
          layer.hide();
        }
      }
    },
    [isLayerMode, layer, isFocusInTokenizer, onBlur],
  );

  const isAtMax = maxEntries != null && value.length >= maxEntries;

  // Filter out already-selected items from search results
  const selectedIds = useMemo(
    () => new Set(value.map(item => item.id)),
    [value],
  );

  const filteredSource: SearchSource<T> = useMemo(
    () => ({
      search: async (query: string) => {
        const results = await searchSource.search(query);
        return results.filter(item => !selectedIds.has(item.id));
      },
      bootstrap: async () => {
        const results = await searchSource.bootstrap();
        return results.filter(item => !selectedIds.has(item.id));
      },
    }),
    [searchSource, selectedIds],
  );

  /**
   * The "Create X" entry. It is derived from the typed text, not fetched for
   * it, so it is offered through `__queryEntries` rather than appended to the
   * search results — which is what keeps it available when the query is too
   * short to search. `minQueryLength` is there to avoid a fetch too broad to
   * be worth making; creating `QA` costs no fetch, and a field that can
   * create it should not stop being able to.
   */
  const createEntries = useCallback(
    (query: string, results: T[]): T[] => {
      const trimmed = query.trim();
      if (!hasCreate || trimmed === '') {
        return [];
      }
      const alreadyExists =
        selectedIds.has(trimmed) ||
        results.some(
          item => item.label.toLowerCase() === trimmed.toLowerCase(),
        );
      if (alreadyExists) {
        return [];
      }
      return [
        {
          id: `${CREATABLE_ID_PREFIX}${trimmed}`,
          label: `Create "${trimmed}"`,
          auxiliaryData: {__createdValue: trimmed},
        } as unknown as T,
      ];
    },
    [hasCreate, selectedIds],
  );

  const emptySource: SearchSource<T> = useMemo(
    () => ({
      search: async () => [],
      bootstrap: async () => [],
    }),
    [],
  );

  // Announce token add/remove politely via the persistent live region.
  // Tokens previously appeared and disappeared silently — Backspace on an
  // empty input removes the trailing token, and the per-token remove buttons
  // gave no audible feedback either.
  const announce = useAnnounce();

  // Handle adding an item — detect creatable synthetic items
  const handleAdd = useCallback(
    (item: T | null) => {
      if (!item) {
        return;
      }
      if (isAtMax) {
        return;
      }

      // Detect "Create: X" synthetic items from the creatable source
      if (
        hasCreate &&
        typeof item.id === 'string' &&
        item.id.startsWith(CREATABLE_ID_PREFIX)
      ) {
        const createdValue = item.id.slice(CREATABLE_ID_PREFIX.length);
        if (selectedIds.has(createdValue)) {
          return;
        }
        const base = {id: createdValue, label: createdValue};
        const realItem = base as T;
        const newItems = [...value, realItem];
        onChange(newItems, {item: realItem, type: 'create'});
        announce(t('@solo.tokenizer.tokenAdded', {label: createdValue}));
        return;
      }

      if (selectedIds.has(item.id)) {
        return;
      }
      const newItems = [...value, item];
      onChange(newItems, {item, type: 'add'});
      announce(t('@solo.tokenizer.tokenAdded', {label: item.label}));
    },
    [value, onChange, isAtMax, selectedIds, hasCreate, announce, t],
  );

  // Handle removing an item. Single removal path: both Backspace on an empty
  // input and the per-token remove buttons route through here, so the
  // announcement covers both.
  const handleRemove = useCallback(
    (item: T) => {
      const newItems = value.filter(v => v.id !== item.id);
      onChange(newItems, {item, type: 'remove'});
      announce(t('@solo.tokenizer.tokenRemoved', {label: item.label}));
      inputRef.current?.focus();
    },
    [value, onChange, announce, t],
  );

  // Handle clearing all items
  const handleClearAll = useCallback(() => {
    if (value.length === 0) {
      return;
    }
    // Report the last item as removed (convention)
    const lastItem = value[value.length - 1];
    onChange([], {item: lastItem, type: 'remove'});
    inputRef.current?.focus();
  }, [value, onChange]);

  // Handle backspace on empty input — remove last token
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === 'Backspace' &&
        e.currentTarget.value === '' &&
        value.length > 0
      ) {
        e.preventDefault();
        const lastItem = value[value.length - 1];
        handleRemove(lastItem);
      }
    },
    [value, handleRemove],
  );

  // Click wrapper to focus input
  const handleWrapperClick = useCallback(() => {
    if (!isDisabled) {
      if (isLayerMode) {
        // The input always lives in the popover. Show it and focus.
        layer.show();
        setIsFocusedWithin(true);
        // The input is already mounted in the popover (not conditional),
        // so we can focus it directly.
        inputRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  }, [isDisabled, isLayerMode, layer]);

  const ariaDescribedBy =
    [
      description ? descriptionId : null,
      status?.message ? statusMessageId : null,
      showsDisabledMessage ? disabledMessageTooltip.describedBy : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  const sizeStyle = sizeStyles[size];

  // Render tokens
  const tokens = value.map(item => {
    const onRemoveItem = () => handleRemove(item);

    if (renderToken) {
      return (
        <span key={item.id} className={styles.token}>
          {renderToken(item, onRemoveItem)}
        </span>
      );
    }

    return (
      <Token
        key={item.id}
        label={item.label}
        size={size}
        onRemove={isDisabled ? undefined : onRemoveItem}
        isDisabled={isDisabled}
        className={styles.token}
      />
    );
  });

  // Self-authored position styles (positioning: 'custom' below): explicit
  // anchor() insets pin the expanded layer over the field itself.
  // `left` is physical, so this popover does not yet mirror in RTL —
  // known follow-up.
  const popoverOverrideStyle: React.CSSProperties = {
    top: 'anchor(top)',
    left: 'anchor(start)',
  };

  const wrapperContent = (
    <div
      ref={el => {
        wrapperRef.current = el;
        // Anchor + hover/focus listeners for the disabled-message tooltip.
        // Handlers are gated internally by isEnabled, so attaching
        // unconditionally is safe.
        disabledMessageTooltip.ref(el);
      }}
      role="group"
      aria-label={label}
      onClick={handleWrapperClick}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      data-testid={testId}
      {...mergeProps(
        themeProps('tokenizer', {
          size,
          status: status?.type,
          disabled: isDisabled ? 'disabled' : null,
        }),
        {
          className: cn(
            inputWrapperStyles.base,
            styles.wrapper,
            value.length > 0 && styles.wrapperWithTokens,
            isTruncated ? truncatedSizeStyles[size] : sizeStyle,
            isTruncated && styles.truncatedWrapper,
            isDisabled && inputWrapperStyles.disabled,
            status && inputStatusBorderStyles[status.type],
            status && !isDisabled && inputStatusHoverShadowStyles[status.type],
            status && inputStatusFocusWithinStyles[status.type],
          ),
        },
      )}>
      {startIcon && (
        <span
          className={
            value.length > 0 ? styles.startIconWithTokens : undefined
          }>
          {renderIconSlot(startIcon, {size: 'sm', color: 'secondary'})}
        </span>
      )}
      {isTruncated ? (
        <OverflowList
          gap={1}
          behavior="observeParent"
          overflowRenderer={items => (
            <span className={styles.overflowText}>
              +{items.length} more
            </span>
          )}>
          {tokens}
        </OverflowList>
      ) : (
        tokens
      )}
      {/* The base reports its busy state through this lane, so the
          indicator lands in the end controls below beside the clear
          button rather than as a second one inside the base. */}
      <BusyIndicatorLaneProvider value={busyLane}>
        <BaseTypeahead
          ref={inputRef}
          searchSource={isAtMax ? emptySource : filteredSource}
          value={null}
          onChange={handleAdd}
          renderItem={renderItem}
          // A space keeps :placeholder-shown available as the CSS-only empty
          // query signal without painting placeholder text beside tokens.
          placeholder={value.length === 0 ? placeholder : ' '}
          hasEntriesOnFocus={isAtMax ? false : hasEntriesOnFocus}
          maxMenuItems={maxMenuItems}
          menuWidth={menuWidth}
          minQueryLength={minQueryLength}
          emptySearchText={emptySearchText}
          isDisabled={isDisabled}
          isFocusableDisabled={showsDisabledMessage}
          hasAutoFocus={hasAutoFocus}
          inputId={inputId}
          ariaDescribedBy={ariaDescribedBy}
          onChangeQuery={onChangeQuery}
          __queryEntries={createEntries}
          debounceMs={debounceMs}
          onKeyDown={handleKeyDown}
          anchorRef={wrapperRef}
          size={size}
          inputClassName={cn(
            isAtMax || isTruncated
              ? styles.inputAtMax
              : value.length > 0
                ? [styles.inputCompact, compactInputSizeStyles[size]]
                : undefined,
            // The compact-token style owns the same reserve with an empty-query
            // exception. This standalone rule is only for an empty Tokenizer;
            // it still resolves to zero until the lane publishes a width.
            !(isAtMax || isTruncated || value.length > 0) && laneReserve,
          )}
        />
      </BusyIndicatorLaneProvider>
      {htmlName != null &&
        value.map(item => (
          <input
            key={item.id}
            type="hidden"
            name={htmlName}
            value={item.id}
            // Disabled native controls are excluded from form submission;
            // mirror that for the hidden carriers.
            disabled={isDisabled}
          />
        ))}
      <EndLane
        lane={busyLane}
        laneRef={laneRef}
        laneClassName={cn(styles.endSection, endSectionSizeStyles[size])}
        loadingLabel={t('@solo.typeahead.loading')}
        hasStaticContent={hasStaticEndLane}>
        {endContent}
        {hasClearButton && (
          <InputClearButton
            label={t('@solo.tokenizer.clearAll')}
            onClick={e => {
              e.stopPropagation();
              handleClearAll();
            }}
          />
        )}
      </EndLane>
    </div>
  );

  let tokenizerContent: ReactNode;
  if (isLayerMode) {
    const placeholderSizeStyle = layerPlaceholderSizeStyles[size];
    tokenizerContent = (
      <>
        <div
          ref={placeholderRef}
          onClick={handleWrapperClick}
          {...mergeProps(
            themeProps('tokenizer', {
              size,
              status: status?.type,
              disabled: isDisabled ? 'disabled' : null,
            }),
            {
              className: cn(
                inputWrapperStyles.base,
                styles.wrapper,
                value.length > 0 && styles.wrapperWithTokens,
                placeholderSizeStyle,
                isTruncated && styles.truncatedWrapper,
                isDisabled && inputWrapperStyles.disabled,
                status && inputStatusBorderStyles[status.type],
                status &&
                  !isDisabled &&
                  inputStatusHoverShadowStyles[status.type],
                status && inputStatusFocusWithinStyles[status.type],
              ),
            },
          )}>
          {isTruncated && (
            <>
              {startIcon &&
                renderIconSlot(startIcon, {
                  size: 'sm',
                  color: 'secondary',
                })}
              <OverflowList
                gap={1}
                behavior="observeParent"
                overflowRenderer={items => (
                  <span className={styles.overflowText}>
                    +{items.length} more
                  </span>
                )}>
                {tokens}
              </OverflowList>
            </>
          )}
        </div>
        {layer.render(
          <div
            ref={layerContentRef}
            onFocusCapture={handleFocusCapture}
            onBlurCapture={handleBlurCapture}>
            {wrapperContent}
          </div>,
          {
            positioning: 'custom',
            className: styles.layerPopover,
            style: popoverOverrideStyle,
          },
        )}
      </>
    );
  } else {
    tokenizerContent = wrapperContent;
  }

  return (
    <Field
      ref={ref}
      label={label}
      isLabelHidden={isLabelHidden}
      description={description}
      inputID={inputId}
      descriptionID={description ? descriptionId : undefined}
      isOptional={isOptional}
      isRequired={isRequired}
      isDisabled={isDisabled}
      status={
        status
          ? {
              type: status.type,
              message: status.message,
              messageID: status.message ? statusMessageId : undefined,
            }
          : undefined
      }
      statusVariant={statusVariant}
      labelTooltip={labelTooltip}
      width={width}
      className={className}
      style={style}>
      {tokenizerContent}
      {showsDisabledMessage &&
        disabledMessageTooltip.renderTooltip(disabledMessage)}
    </Field>
  );
}

Tokenizer.displayName = 'Tokenizer';
