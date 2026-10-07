/**
 * @file groupStyles.ts
 * @input Uses Tailwind classes, theme tokens, and layer-aware group end-cap selectors
 * @output Exports shared group-aware class sets for input components
 * @position Shared styles consumed by InputGroup-compatible controls
 */

import {cn} from '../utils/cn';

// A grouped control may be followed by context-layer infrastructure rather
// than another control. Popovers, inert markers, and native dialog surfaces
// are not visual group members; skip them when finding the trailing edge.
// IS_LAST_ITEM = ':not(:has(~ *:not([popover]):not(template):not(dialog)))',
// spelled out in each class below (Tailwind needs literal class strings).

export const groupStyles = {
  inGroup: cn(
    'flex-1 min-w-0 h-full',
    'ms-[calc(-1_*_var(--border-width))] first:ms-0',
    'rounded-ss-none first:rounded-ss-(--radius-element)',
    'rounded-es-none first:rounded-es-(--radius-element)',
    'rounded-se-none [&:not(:has(~*:not([popover]):not(template):not(dialog)))]:rounded-se-(--radius-element)',
    'rounded-ee-none [&:not(:has(~*:not([popover]):not(template):not(dialog)))]:rounded-ee-(--radius-element)',
    'focus-within:z-1',
  ),
} as const;
