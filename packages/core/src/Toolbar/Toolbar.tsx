'use client';

/**
 * @file Toolbar.tsx
 * @input Uses Section, SizeContext, useListFocus, useKeyboardHint, Tailwind classes, spacingVars
 * @output Exports Toolbar component and ToolbarProps
 * @position Core implementation; consumed by index.ts
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Toolbar/Toolbar.doc.mjs
 * - /packages/core/src/Toolbar/Toolbar.test.tsx
 * - /packages/core/src/Toolbar/index.ts
 * - /apps/storybook/stories/Toolbar.stories.tsx
 */

import {useCallback, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import type {SectionVariant} from '../Section/Section';
import type {SpacingStep} from '../utils/types';
import type {ElementSize} from '../SizeContext/SizeContext';
import {spacingVars} from '../theme/tokenVars';
import {cn} from '../utils/cn';
import {mergeProps} from '../utils';
import {Section} from '../Section/Section';
import {useListFocus} from '../hooks/useListFocus';
import {useKeyboardHint} from '../hooks/useKeyboardHint';
import {SizeProvider} from '../SizeContext/SizeContext';
import {edgeCompSlot} from '../Layout/edgeCompensation.styles';
import {themeProps} from '../utils/themeProps';

/**
 * Gap per SpacingStep (literal classes so Tailwind can see them).
 */
const gapStyles: Record<SpacingStep, string> = {
  0: 'gap-(--spacing-0)',
  0.5: 'gap-(--spacing-0-5)',
  1: 'gap-(--spacing-1)',
  1.5: 'gap-(--spacing-1-5)',
  2: 'gap-(--spacing-2)',
  3: 'gap-(--spacing-3)',
  4: 'gap-(--spacing-4)',
  5: 'gap-(--spacing-5)',
  6: 'gap-(--spacing-6)',
  8: 'gap-(--spacing-8)',
  10: 'gap-(--spacing-10)',
};

const styles = {
  // Two-slot layout (no centerContent): flex row, space-between
  baseFlex: 'flex items-center justify-between',
  // Three-slot layout (with centerContent): CSS grid 1fr auto 1fr
  baseGrid: 'grid [grid-template-columns:1fr_auto_1fr] items-center',
  // Vertical orientation
  vertical: 'flex-col items-stretch',
  // Slot containers
  startSlot: 'flex items-center',
  // `minWidth: 0` lets the `auto` track shrink below the content's width, so a
  // wide center never widens the toolbar. The slot deliberately does not clip
  // (`overflow`): clipping would cut off the box-shadow and focus ring of its
  // outermost children, which paint outside their own box.
  centerSlot: 'flex items-center justify-center min-w-0',
  endSlot: 'flex items-center justify-end',
  // When only startContent is present, let it fill
  startOnly: '[flex:1_1_0%]',
  // When only endContent, push to end
  endOnly: 'ms-auto',
} as const;

const sizeStyles = {
  base: 'min-h-(--size-element-sm)',
} as const;

/**
 * Default block padding per toolbar size. Inline padding comes from the
 * parent container (Card, Section, LayoutHeader) via the Section's
 * theme default — the toolbar only controls its vertical tightness.
 */
const defaultBlockPaddingForSize: Record<ElementSize, SpacingStep> = {
  sm: 2,
  md: 2,
  lg: 2,
};

const blockPaddingVarForSize: Record<ElementSize, string> = {
  sm: spacingVars['--spacing-2'],
  md: spacingVars['--spacing-2'],
  lg: spacingVars['--spacing-2'],
};

/**
 * Edge compensation inset amount per toolbar size.
 * Equals container-inline-padding minus the toolbar's block padding,
 * creating even spacing around edge-compensated items (ghost buttons, tabs).
 */
const edgeCompInsetForSize: Record<ElementSize, string> = {
  sm: `calc(var(--container-padding-inline-start, ${spacingVars['--spacing-4']}) - ${spacingVars['--spacing-2']})`,
  md: `calc(var(--container-padding-inline-start, ${spacingVars['--spacing-4']}) - ${spacingVars['--spacing-2']})`,
  lg: `calc(var(--container-padding-inline-start, ${spacingVars['--spacing-4']}) - ${spacingVars['--spacing-2']})`,
};

export type ToolbarSize = ElementSize;

export interface ToolbarProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root Section element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Content aligned to the start (left in LTR).
   */
  startContent?: ReactNode;
  /**
   * Content centered between start and end.
   * When provided, switches layout to CSS grid (1fr auto 1fr).
   */
  centerContent?: ReactNode;
  /**
   * Content aligned to the end (right in LTR).
   */
  endContent?: ReactNode;
  /**
   * Accessible label for the toolbar.
   * Applied as aria-label on the inner toolbar element.
   */
  label: string;
  /**
   * Size of the toolbar. Coordinates with Button, TextInput, TabList, and Selector —
   * children inherit this size as their default via SizeContext.
   *
   * - `'sm'`: Compact — fits sm buttons/inputs (28px elements)
   * - `'md'`: Standard — fits md buttons/inputs (32px elements)
   * - `'lg'`: Spacious — fits lg buttons/inputs (36px elements)
   * @default 'md'
   */
  size?: ToolbarSize;
  /**
   * Gap between items within each slot, using the spacing scale.
   * @default 1
   */
  gap?: SpacingStep;
  /**
   * Orientation of the toolbar for keyboard navigation.
   * Controls which arrow keys navigate between items.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Visual variant passed through to Section.
   * @default 'transparent'
   */
  variant?: SectionVariant;

  /**
   * Which sides should have divider borders.
   * Passed through to Section.
   * @example
   * ```
   * dividers={['bottom']}
   * ```
   */
  dividers?: ('top' | 'bottom' | 'start' | 'end')[];
}

/**
 * General-purpose toolbar with start, center, and end content slots.
 *
 * Built on Section, provides flex/grid layout with roving tabindex
 * keyboard navigation via useListFocus. Cascades `size` to child components
 * (Button, TextInput, TabList, Selector) via SizeContext, and applies
 * edge compensation so ghost buttons align flush at container edges.
 *
 * @example
 * ```
 * <Toolbar label="Actions" size="sm"
 *   startContent={<Button label="Cut" variant="ghost" />}
 *   endContent={<Button label="Settings" variant="ghost" />}
 * />
 * ```
 */
export function Toolbar({
  startContent,
  centerContent,
  endContent,
  label,
  size = 'md',
  gap = 1,
  orientation = 'horizontal',
  variant = 'transparent',
  dividers,
  className,
  style,
  ref,
  onKeyDown: onKeyDownProp,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  role: _role,
  'aria-label': _ariaLabel,
  'aria-orientation': _ariaOrientation,
  ...props
}: ToolbarProps) {
  const hasCenterContent = centerContent != null;
  const hasStartContent = startContent != null;
  const hasEndContent = endContent != null;
  const hasBottomDivider = dividers?.includes('bottom') ?? false;

  const gapClass = gapStyles[gap];
  const edgeComp = edgeCompSlot.inset(edgeCompInsetForSize[size]);

  const {listRef, handleKeyDown, handleFocus} = useListFocus<HTMLDivElement>({
    itemSelector: 'button, input, [tabindex]',
    orientation,
    hasRovingTabIndex: true,
    hasCaretGuard: true,
  });

  const {
    hintElement,
    onKeyDown: onHintKeyDown,
    onFocus: onHintFocus,
    onBlur: onHintBlur,
  } = useKeyboardHint({orientation});

  const handleToolbarKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDownProp?.(e);
      if (e.defaultPrevented) {
        return;
      }
      onHintKeyDown(e);
      handleKeyDown(e);
    },
    [onKeyDownProp, onHintKeyDown, handleKeyDown],
  );

  const handleToolbarFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      onFocusProp?.(e);
      if (e.defaultPrevented) {
        return;
      }
      onHintFocus(e);
      handleFocus(e);
    },
    [onFocusProp, onHintFocus, handleFocus],
  );

  const handleToolbarBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      onBlurProp?.(e);
      if (e.defaultPrevented) {
        return;
      }
      onHintBlur(e);
    },
    [onBlurProp, onHintBlur],
  );

  return (
    <SizeProvider value={size}>
      <Section
        ref={ref}
        variant={variant}
        paddingBlock={defaultBlockPaddingForSize[size]}
        dividers={dividers}
        className={className}
        style={style}>
        <div
          ref={listRef}
          role="toolbar"
          aria-label={label}
          aria-orientation={orientation}
          onKeyDown={handleToolbarKeyDown}
          onFocus={handleToolbarFocus}
          onBlur={handleToolbarBlur}
          {...mergeProps(
            themeProps('toolbar', {size}),
            {
              className: cn(
                hasCenterContent ? styles.baseGrid : styles.baseFlex,
                orientation === 'vertical' && styles.vertical,
                sizeStyles.base,
                gapClass,
              ),
              // Only drop the tab indicator through the toolbar's block padding
              // onto the rail when a bottom divider is actually present.
              // Without a divider, leave `--_tab-indicator-bottom` unset so a
              // nested TabList's indicator keeps its own default (hugging the
              // tab) instead of floating down into the toolbar's padding.
              style: hasBottomDivider
                ? ({
                    '--_tab-indicator-bottom': `calc(-1 * (${blockPaddingVarForSize[size]} + 1px))`,
                  } as React.CSSProperties)
                : undefined,
            },
          )}
          {...props}>
          {hasCenterContent ? (
            // Three-slot grid layout
            <>
              <div
                className={cn(styles.startSlot, edgeComp.className, gapClass)}
                style={edgeComp.style}>
                {startContent}
              </div>
              <div
                className={cn(styles.centerSlot, gapClass)}>
                {centerContent}
              </div>
              <div
                className={cn(styles.endSlot, edgeComp.className, gapClass)}
                style={edgeComp.style}>
                {endContent}
              </div>
            </>
          ) : (
            // Two-slot flex layout
            <>
              {hasStartContent && (
                <div
                  className={cn(
                    styles.startSlot,
                    !hasEndContent && styles.startOnly,
                    edgeComp.className,
                    gapClass,
                  )}
                  style={edgeComp.style}>
                  {startContent}
                </div>
              )}
              {hasEndContent && (
                <div
                  className={cn(
                    styles.endSlot,
                    !hasStartContent && styles.endOnly,
                    edgeComp.className,
                    gapClass,
                  )}
                  style={edgeComp.style}>
                  {endContent}
                </div>
              )}
            </>
          )}
          {hintElement}
        </div>
      </Section>
    </SizeProvider>
  );
}

Toolbar.displayName = 'Toolbar';
