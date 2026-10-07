'use client';

/**
 * @file ToggleButtonGroup.tsx
 * @input Layer-scoped React context, ToggleButton children
 * @output Exports ToggleButtonGroup component and types
 * @position Groups toggle buttons for single or multi-select behavior
 *
 * Uses a discriminated union on `type` to enforce type-safe value/onChange:
 * - type='single' → value: string | null, onChange: (v: string | null) => void
 * - type='multiple' → value: string[], onChange: (v: string[]) => void
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/ToggleButton/index.ts
 * - /apps/storybook/stories/ToggleButton.stories.tsx
 */

import {useCallback, use, useMemo, type ReactNode} from 'react';
import {createLayerScopedContext as createContext} from '../Layer/layerScopedContext';
import type {ButtonSize} from '../Button';
import {cn, mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';

// =============================================================================
// Context
// =============================================================================

interface ToggleButtonGroupContextValue {
  /** Currently selected value(s). */
  selectedValues: Set<string>;
  /** Toggle a value on/off. */
  toggle: (value: string) => void;
  /** Group size default — individual buttons can override. */
  size?: ButtonSize;
  /** Group disabled state. */
  isDisabled?: boolean;
}

const ToggleButtonGroupContext =
  createContext<ToggleButtonGroupContextValue | null>(null);
ToggleButtonGroupContext.displayName = 'ToggleButtonGroupContext';

/**
 * Hook for ToggleButton to read group context.
 * Returns null when used outside a group.
 */
export function useToggleButtonGroup(): ToggleButtonGroupContextValue | null {
  return use(ToggleButtonGroupContext);
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  group: 'inline-flex items-center gap-(--spacing-1)',
  vertical: 'flex-col items-stretch',
} as const;

// =============================================================================
// Props — Discriminated Union
// =============================================================================

interface ToggleButtonGroupBaseProps {
  /** Toggle button children. */
  children: ReactNode;

  /**
   * Accessible label for the group (used as aria-label).
   */
  label: string;

  /**
   * Orientation of the button group.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Default size for buttons in the group.
   * Individual buttons can override this with their own `size` prop.
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Whether all buttons in the group are disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Extra classes for layout customization (margins, positioning, sizing),
   * merged after the group's own (later wins).
   *
   * @example
   * ```
   * <ToggleButtonGroup className="mt-(--spacing-2)" />
   * ```
   */
  className?: string;

  /** Test ID for testing frameworks. */
  'data-testid'?: string;
}

/**
 * Single-select group props.
 * Only one button can be active at a time. Clicking the active
 * button deselects it (value becomes null).
 */
export interface ToggleButtonGroupSingleProps extends ToggleButtonGroupBaseProps {
  /**
   * Single selection mode (default).
   * @default 'single'
   */
  type?: 'single';

  /** Currently selected value, or null if none selected. */
  value: string | null;

  /** Called when selection changes. */
  onChange: (value: string | null) => void;
}

/**
 * Multi-select group props.
 * Multiple buttons can be active simultaneously.
 */
export interface ToggleButtonGroupMultipleProps extends ToggleButtonGroupBaseProps {
  /** Multiple selection mode. */
  type: 'multiple';

  /** Currently selected values. */
  value: string[];

  /** Called when selection changes. */
  onChange: (value: string[]) => void;
}

/** Discriminated union of single and multiple group props. */
export type ToggleButtonGroupProps =
  ToggleButtonGroupSingleProps | ToggleButtonGroupMultipleProps;

// =============================================================================
// Component
// =============================================================================

/**
 * Groups toggle buttons for exclusive (single) or multi-select behavior.
 *
 * Uses a discriminated union on `type` for type-safe value/onChange:
 * - `'single'` (default): `value: string | null`, click active deselects
 * - `'multiple'`: `value: string[]`, toggles individual items
 *
 * @example
 * ```
 * const [view, setView] = useState<string | null>('grid');
 * <ToggleButtonGroup value={view} onChange={setView} label="View mode">
 *   <ToggleButton value="list" label="List" icon={<ListIcon />} />
 *   <ToggleButton value="grid" label="Grid" icon={<GridIcon />} />
 * </ToggleButtonGroup>
 * ```
 */
export function ToggleButtonGroup(props: ToggleButtonGroupProps): ReactNode {
  const {
    children,
    label,
    orientation = 'horizontal',
    size,
    isDisabled = false,
    className,
    'data-testid': testId,
  } = props;

  const isMultiple = props.type === 'multiple';

  const selectedValues = useMemo(() => {
    if (isMultiple) {
      return new Set(props.value);
    }
    const singleValue = props.value;
    return singleValue != null ? new Set([singleValue]) : new Set<string>();
  }, [isMultiple, props.value]);

  const toggle = useCallback(
    (itemValue: string) => {
      if (isMultiple) {
        const current = props.value;
        const onChange = props.onChange;
        if (current.includes(itemValue)) {
          onChange(current.filter(v => v !== itemValue));
        } else {
          onChange([...current, itemValue]);
        }
      } else {
        const current = props.value;
        const onChange = props.onChange;
        // Allow deselection: clicking active → null
        onChange(current === itemValue ? null : itemValue);
      }
    },
    [isMultiple, props.value, props.onChange],
  );

  const contextValue = useMemo(
    () => ({selectedValues, toggle, size, isDisabled}),
    [selectedValues, toggle, size, isDisabled],
  );

  return (
    <ToggleButtonGroupContext value={contextValue}>
      <div
        role="group"
        aria-label={label}
        data-testid={testId}
        {...mergeProps(
          themeProps('toggle-button-group'),
          {
            className: cn(
              styles.group,
              orientation === 'vertical' && styles.vertical,
            ),
          },
          className,
        )}>
        {children}
      </div>
    </ToggleButtonGroupContext>
  );
}

ToggleButtonGroup.displayName = 'ToggleButtonGroup';
