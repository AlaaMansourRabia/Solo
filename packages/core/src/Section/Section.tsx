/**
 * @file Section.tsx
 * @input Uses container utility, Tailwind classes
 * @output Exports Section component and SectionProps
 * @position Core section container component
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Section/Section.doc.mjs (props table, features)
 * - /packages/core/src/Section/index.ts (exports if types change)
 * - /apps/storybook/stories/Section.stories.tsx (storybook stories)
 */

import type {ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {container} from '../Layout/container.styles';
import type {SpacingToken} from '../Layout/container.styles';
import {
  paddingStyles,
  paddingInlineStyles,
  paddingInlineStartStyles,
  paddingInlineEndStyles,
  paddingBlockStyles,
  paddingBlockStartStyles,
  paddingBlockEndStyles,
  containerPaddingInlineVarStyles,
  containerPaddingInlineStartVarStyles,
  containerPaddingInlineEndVarStyles,
  containerPaddingBlockStartVarStyles,
  containerPaddingBlockEndVarStyles,
  sectionPaddingPropagationStyles,
  spacingStepToToken,
} from '../Layout/padding.styles';
import type {SizeValue, SpacingStep} from '../utils/types';
import {mergeProps} from '../utils';
import {cn, cssLength} from '../utils/cn';
import {themeProps} from '../utils/themeProps';
import type {SectionVariantMap} from './index';

/**
 * Visual variant for the section.
 * Extensible via module augmentation of SectionVariantMap.
 */
export type SectionVariant = keyof SectionVariantMap;

const variantStyles: Record<string, string> = {
  section: 'bg-(--color-background-surface)',
  transparent: 'bg-transparent',
  muted: 'bg-(--color-background-muted)',
};

// Styles for escaping parent container padding when nested
const nestedStyles = {
  // Outer wrapper escapes parent's container padding
  outer: cn(
    // Escape horizontal padding using directional vars with shorthand fallback
    'ms-[calc(-1*var(--container-padding-inline-start,0px))]',
    'me-[calc(-1*var(--container-padding-inline-end,0px))]',
    // Escape top padding only if first child
    'first:mt-[calc(-1*var(--container-padding-block-start,0px))]',
    // Escape bottom padding only if last child
    'last:mb-[calc(-1*var(--container-padding-block-end,0px))]',
  ),
  // Inner wrapper resets container padding for descendants
  inner: cn(
    '[--container-padding-inline-start:0px]',
    '[--container-padding-inline-end:0px]',
    '[--container-padding-block-start:0px]',
    '[--container-padding-block-end:0px]',
    'h-full',
  ),
} as const;

// Divider styles for each side
const dividerStyles = {
  top: '[border-top-width:1px] [border-top-style:solid] [border-top-color:var(--color-border)]',
  bottom:
    '[border-bottom-width:1px] [border-bottom-style:solid] [border-bottom-color:var(--color-border)]',
  start:
    '[border-inline-start-width:1px] [border-inline-start-style:solid] [border-inline-start-color:var(--color-border)]',
  end: '[border-inline-end-width:1px] [border-inline-end-style:solid] [border-inline-end-color:var(--color-border)]',
} as const;

// Dynamic sizing props travel through scoped custom properties so a
// `className` can still override them.
const sizingStyles = {
  width: 'w-(--_section-width)',
  height: 'h-(--_section-height)',
  maxWidth: 'max-w-(--_section-max-width)',
  minHeight: 'min-h-(--_section-min-height)',
} as const;

export interface SectionProps extends BaseProps<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
  /**
   * Visual variant of the section.
   * - 'section': Surface background color
   * - 'transparent': Fully transparent background
   * - 'muted': Muted background color
   * @default 'section'
   */
  variant?: SectionVariant;

  /**
   * Width of the section.
   * Numbers are treated as pixels, strings are used as-is.
   */
  width?: SizeValue;

  /**
   * Height of the section.
   * Numbers are treated as pixels, strings are used as-is.
   */
  height?: SizeValue;

  /**
   * Maximum width of the section.
   * Numbers are treated as pixels, strings are used as-is.
   */
  maxWidth?: SizeValue;

  /**
   * Minimum height of the section.
   * Numbers are treated as pixels, strings are used as-is.
   */
  minHeight?: SizeValue;

  /**
   * Content to render inside the section.
   * Should typically be Layout child components.
   */
  children?: ReactNode;

  /**
   * Which sides should have divider borders.
   * Use 'start'/'end' for horizontal (respects RTL).
   * @example
   * ```
   * dividers={['top', 'bottom']}
   * ```
   */
  dividers?: ('top' | 'bottom' | 'start' | 'end')[];

  /**
   * Internal padding of the section using the spacing scale.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   * @default 4 (16px)
   */
  padding?: SpacingStep;
  /**
   * Inline (horizontal) padding override. When set, overrides only the inline
   * axis padding while preserving block padding from `padding` or the
   * container theme default.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   */
  paddingInline?: SpacingStep;
  /**
   * Inline-start padding override. Logical: the left edge in LTR, the right
   * edge in RTL. Takes precedence over `paddingInline` and `padding` on that
   * edge only; every other edge is left alone.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   */
  paddingInlineStart?: SpacingStep;
  /**
   * Inline-end padding override. Logical: the right edge in LTR, the left
   * edge in RTL. Takes precedence over `paddingInline` and `padding` on that
   * edge only; every other edge is left alone.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   */
  paddingInlineEnd?: SpacingStep;
  /**
   * Block (vertical) padding override. When set, overrides only the block
   * axis padding while preserving inline padding from `padding` or the
   * container theme default.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   */
  paddingBlock?: SpacingStep;
  /**
   * Block-start (top) padding override. Takes precedence over `paddingBlock`
   * and `padding` on that edge only; the block-end edge and both inline edges
   * are left alone.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   */
  paddingBlockStart?: SpacingStep;
  /**
   * Block-end (bottom) padding override. Takes precedence over `paddingBlock`
   * and `padding` on that edge only; the block-start edge and both inline
   * edges are left alone.
   * Accepts numeric spacing steps: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
   */
  paddingBlockEnd?: SpacingStep;
}

/**
 * A section container with background variants.
 *
 * Applies section-specific appearance based on the variant prop
 * and sets CSS variables for child layout components.
 *
 * @compositionHint Use inside Card to create visually distinct regions.
 * Sections automatically escape parent container padding for edge-to-edge fills.
 *
 * @example
 * ```
 * <Section variant="muted" width={300} height={250}>
 *   <Layout
 *     content={<LayoutContent>Content in muted section</LayoutContent>}
 *   />
 * </Section>
 * ```
 */
export function Section({
  variant = 'section',
  width,
  height,
  maxWidth,
  minHeight,
  children,
  dividers,
  padding,
  paddingInline,
  paddingInlineStart,
  paddingInlineEnd,
  paddingBlock,
  paddingBlockStart,
  paddingBlockEnd,
  className,
  style,
  ref,
  ...props
}: SectionProps) {
  // When no explicit padding prop, use theme default (set via container tokens)
  const useThemeDefault = padding == null;
  const effectivePadding = padding ?? 4;
  const paddingToken = spacingStepToToken[effectivePadding] as SpacingToken;
  const containerProps = container(
    useThemeDefault
      ? {useThemeDefault: 'section'}
      : {
          paddingInnerX: paddingToken,
          paddingInnerY: paddingToken,
          paddingOuterX: paddingToken,
          paddingOuterY: paddingToken,
        },
  );
  const sizingStyle =
    width != null || height != null || maxWidth != null || minHeight != null
      ? ({
          '--_section-width': cssLength(width),
          '--_section-height': cssLength(height),
          '--_section-max-width': cssLength(maxWidth),
          '--_section-min-height': cssLength(minHeight),
        } as React.CSSProperties)
      : undefined;

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={
        cn(
          nestedStyles.outer,
          width != null && sizingStyles.width,
          height != null && sizingStyles.height,
          maxWidth != null && sizingStyles.maxWidth,
          minHeight != null && sizingStyles.minHeight,
          className,
        ) || undefined
      }
      style={
        style && sizingStyle ? {...sizingStyle, ...style} : style || sizingStyle
      }
      {...props}>
      <div
        {...mergeProps(
          themeProps('section', {variant}),
          {
            className: cn(
            nestedStyles.inner,
            containerProps.className,
            !useThemeDefault &&
              effectivePadding !== 4 &&
              paddingStyles[effectivePadding],
            !useThemeDefault &&
              effectivePadding !== 4 &&
              containerPaddingInlineVarStyles[effectivePadding],
            !useThemeDefault &&
              effectivePadding !== 4 &&
              containerPaddingBlockStartVarStyles[effectivePadding],
            !useThemeDefault &&
              effectivePadding !== 4 &&
              containerPaddingBlockEndVarStyles[effectivePadding],
            !useThemeDefault &&
              sectionPaddingPropagationStyles[effectivePadding],
            paddingInline != null && paddingInlineStyles[paddingInline],
            paddingInline != null &&
              containerPaddingInlineVarStyles[paddingInline],
            paddingBlock != null && paddingBlockStyles[paddingBlock],
            paddingBlock != null &&
              containerPaddingBlockStartVarStyles[paddingBlock],
            paddingBlock != null &&
              containerPaddingBlockEndVarStyles[paddingBlock],
            // Per-edge overrides come last so they win over `paddingBlock`
            // and `padding` on their own edge. The matching container var is
            // updated alongside so bleed children (Table, Divider, nested
            // Section) compensate against the padding actually applied.
            paddingBlockStart != null &&
              paddingBlockStartStyles[paddingBlockStart],
            paddingBlockStart != null &&
              containerPaddingBlockStartVarStyles[paddingBlockStart],
            paddingBlockEnd != null && paddingBlockEndStyles[paddingBlockEnd],
            paddingBlockEnd != null &&
              containerPaddingBlockEndVarStyles[paddingBlockEnd],
            paddingInlineStart != null &&
              paddingInlineStartStyles[paddingInlineStart],
            paddingInlineStart != null &&
              containerPaddingInlineStartVarStyles[paddingInlineStart],
            paddingInlineEnd != null &&
              paddingInlineEndStyles[paddingInlineEnd],
            paddingInlineEnd != null &&
              containerPaddingInlineEndVarStyles[paddingInlineEnd],
            variantStyles[variant],
            dividers?.includes('top') && dividerStyles.top,
            dividers?.includes('bottom') && dividerStyles.bottom,
            dividers?.includes('start') && dividerStyles.start,
            dividers?.includes('end') && dividerStyles.end,
            ),
            style: containerProps.style,
          },
        )}>
        {children}
      </div>
    </div>
  );
}

Section.displayName = 'Section';
