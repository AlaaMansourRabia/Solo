/**
 * @file BaseProps.ts
 * @input None (pure type definitions)
 * @output Exports BaseProps — the shared base interface for all Solo components
 * @position Type foundation; extended by all component prop interfaces
 *
 * Keeps: event handlers, aria-*, role, tabIndex, hidden, draggable, inert,
 * dir, className, style, id, data-*.
 * Omits: title, contentEditable, and obscure/non-standard HTML attributes.
 */

import type React from 'react';

/**
 * Base props shared by all Solo components.
 *
 * Omits props that are footguns, deprecated, or irrelevant to component APIs.
 * Components that genuinely need an omitted prop can declare it explicitly.
 */
export interface BaseProps<T extends HTMLElement = HTMLElement> extends Omit<
  React.HTMLAttributes<T>,
  | 'children'
  | 'title'
  | 'contentEditable'
  | 'dangerouslySetInnerHTML'
  | 'suppressContentEditableWarning'
  | 'suppressHydrationWarning'
  // Obscure
  | 'accessKey'
  | 'autoCapitalize'
  | 'autoFocus'
  | 'contextMenu'
  | 'enterKeyHint'
  | 'lang'
  | 'nonce'
  | 'slot'
  | 'spellCheck'
  | 'translate'
  | 'radioGroup'
  | 'inputMode'
  | 'is'
  // RDFa
  | 'about'
  | 'content'
  | 'datatype'
  | 'inlist'
  | 'prefix'
  | 'property'
  | 'rel'
  | 'resource'
  | 'rev'
  | 'typeof'
  | 'vocab'
  // Non-standard
  | 'autoCorrect'
  | 'autoSave'
  | 'color'
  | 'results'
  | 'security'
  | 'unselectable'
  // Microdata
  | 'itemProp'
  | 'itemScope'
  | 'itemType'
  | 'itemID'
  | 'itemRef'
  // Popover API (use Popover)
  | 'popover'
  | 'popoverTargetAction'
  | 'popoverTarget'
  // Shadow DOM
  | 'exportparts'
  // Form defaults
  | 'defaultChecked'
  | 'defaultValue'
> {
  /**
   * Tailwind classes merged with the component's own classes through
   * `cn()` (tailwind-merge), so a conflicting utility here overrides the
   * component's default.
   *
   * @example
   * ```
   * <Component className="mb-2" />
   * ```
   */
  className?: string;

  /** Allow data-* attributes for telemetry, testing, integration hooks, and
   * Solo component prop/state reflection (for example data-variant/data-size). */
  [key: `data-${string}`]: string | undefined;
}
