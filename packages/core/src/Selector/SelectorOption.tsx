/**
 * @file SelectorOption.tsx
 * @output Exports SelectorOption component for custom option rendering
 * @position Sub-component; used by Selector and consumers for custom options
 *
 * Composes Item for the shared start content + label + description + end content layout.
 */

import type {ReactNode} from 'react';
import {renderIconSlot, type IconType} from '../Icon';
import {Item} from '../Item';
import {useSelectorRowLayout} from './SelectorRowLayoutContext';
import {mergeProps} from '../utils';
import {themeProps} from '../utils/themeProps';
import {cn} from '../utils/cn';

const embeddedStyles = {
  root: 'py-0 px-0 rounded-none',
} as const;

export interface SelectorOptionProps {
  /**
   * Icon to display before the label.
   */
  icon?: ReactNode | IconType;

  /**
   * Primary label text.
   */
  label: ReactNode;

  /**
   * Secondary description text displayed below the label.
   */
  description?: ReactNode;

  /**
   * How the label and description sit together. `stacked` puts the
   * description on its own line below the label; `inline` keeps both on one
   * line, with the description ellipsizing first.
   *
   * In a Selector trigger this is the caller's choice and the trigger sizes
   * itself to it — one line at the size token, two lines exactly one text line
   * taller. Inside an `InputGroup` the row height is pinned by the group, so
   * `inline` is forced.
   *
   * @default 'stacked'
   */
  layout?: 'stacked' | 'inline';

  /**
   * Additional content to render after the label/description.
   */
  endContent?: ReactNode;

  /**
   * CSS class name(s) merged after the component's own classes, so they win
   * per property.
   */
  className?: string;
  /**
   * Inline styles to apply to the root element. Spread after the component's
   * inline styles, so these values take priority.
   */
  style?: React.CSSProperties;
}

/**
 * A helper component for rendering custom selector options with consistent styling.
 *
 * Use this inside the `renderOption` prop of Selector to create
 * custom option layouts while maintaining design system consistency.
 *
 * @example
 * ```
 * <Selector
 *   label="User"
 *   options={users}
 *   value={value}
 *   onChange={setValue}
 *   renderOption={option => (
 *     <SelectorOption
 *       icon={UserIcon}
 *       label={option.label}
 *       description={option.email}
 *     />
 *   )}
 * />
 * ```
 */
export function SelectorOption({
  icon,
  label,
  description,
  layout,
  endContent,
  className,
  style,
}: SelectorOptionProps) {
  // A height-pinned host (the trigger inside an InputGroup) overrides the
  // caller's choice: the row physically cannot be two lines there.
  const enforcedLayout = useSelectorRowLayout();

  return (
    <Item
      startContent={
        icon
          ? renderIconSlot(icon, {size: 'sm', color: 'secondary'})
          : undefined
      }
      label={label}
      description={description}
      layout={enforcedLayout === 'inline' ? 'inline' : layout}
      endContent={endContent}
      {...mergeProps(themeProps('selector-option'), {
        className: cn(embeddedStyles.root, className),
        style,
      })}
    />
  );
}

SelectorOption.displayName = 'SelectorOption';
