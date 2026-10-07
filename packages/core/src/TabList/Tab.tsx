'use client';

/**
 * @file Tab.tsx
 * @input Uses React, Tailwind classes, TabListContext
 * @output Exports Tab component and TabProps type
 * @position Core tab item; renders as button or anchor in navigation with a
 *   divider-overlay selected indicator. Where the TabList speaks the tabs
 *   pattern it is a button with role="tab".
 *
 * SYNC: When modified, update:
 * - /packages/core/src/TabList/TabList.doc.mjs
 * - /packages/core/src/TabList/index.ts
 * - /packages/core/src/TabList/TabList.test.tsx
 */

import React, {useCallback, type ReactNode} from 'react';
import type {BaseProps} from '../BaseProps';
import {useTabListContext} from './TabListContext';
import type {TabListSize} from './TabListContext';
import {tabScope} from './tab.markers.styles';
import {useLinkComponent} from '../Link/useLinkComponent';
import type {LinkComponentType} from '../Link/types';
import {mergeProps} from '../utils';
import {useDevWarning} from '../hooks/useDevWarning';
import {EDGE_COMP_ATTR} from '../Layout/edgeCompensation.styles';
import {themeProps} from '../utils/themeProps';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';

export interface TabProps extends BaseProps<HTMLButtonElement> {
  /**
   * Custom component to render instead of `<a>` for link tabs.
   * Overrides the provider-level default set by LinkProvider.
   * Only applies when `href` is provided. Must accept href, className, style, and children props.
   */
  as?: LinkComponentType;
  ref?: React.Ref<HTMLButtonElement>;
  /**
   * Unique value for this tab. Matched against TabListContext.value.
   */
  value: string;
  /**
   * Accessible label for this tab. Used as visible text by default, or
   * as aria-label when isLabelHidden is true.
   */
  label: string;
  /**
   * Whether the label is visually hidden. When true, only the icon and
   * endContent are displayed, and label is used as aria-label for accessibility.
   * @default false
   */
  isLabelHidden?: boolean;
  /**
   * URL to navigate to. When provided, renders as an anchor element.
   *
   * Ignored in a TabList given an explicit `role="tablist"`: activating a tab
   * there swaps a panel in place, so a tab that navigates would be a false
   * statement.
   */
  href?: string;
  /**
   * Id of the panel this tab controls, wired up as `aria-controls` where the
   * TabList speaks the tabs pattern. Put the same id on the panel element.
   *
   * Has no effect under the navigation pattern, where there is no panel to
   * associate — a development warning says so.
   */
  panelId?: string;
  /**
   * Icon element shown when tab is not selected.
   */
  icon?: ReactNode;
  /**
   * Icon element shown when tab is selected. Falls back to `icon` if not provided.
   */
  selectedIcon?: ReactNode;
  /**
   * Content rendered after the label (e.g. a badge or status dot).
   */
  endContent?: ReactNode;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  base: cn(
    'relative inline-flex items-center justify-center gap-(--spacing-1) px-(--spacing-3)',
    'bg-transparent [border-width:0] [border-style:none] rounded-(--radius-element)',
    '[font-family:inherit] text-(length:--text-label-size) leading-(--text-label-leading)',
    'font-(number:--font-weight-normal) text-(--color-text-secondary)',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    '[text-decoration:none] whitespace-nowrap',
    '[transition-property:color] [transition-duration:var(--duration-fast)]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  hoverBg: cn(
    'absolute inset-0 m-auto w-full rounded-(--radius-element) pointer-events-none',
    'bg-transparent can-hover:group-hover/tab:bg-(--color-overlay-hover)',
    // Pressed: the same layer steps up to the pressed overlay, read off the
    // tab the way the hover is, so a press paints on a finger too. Repeated
    // inside the hover-capable branch so it outranks the hover rule there
    // (see interactionOverlay.styles.ts).
    'group-active/tab:bg-(--color-overlay-pressed)',
    'can-hover:group-active/tab:bg-(--color-overlay-pressed)',
    '[transition-property:background-color] [transition-duration:var(--duration-fast)]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  selected: 'text-(--color-text-primary) font-(number:--font-weight-semibold)',
  indicator: cn(
    'absolute',
    // Sits on the tab's bottom edge by default (-1px). When the tab strip
    // reserves space for a divider rail — TabList `hasDivider` or a Toolbar
    // with a bottom divider — that ancestor sets `--_tab-indicator-bottom`
    // to drop the indicator onto the rail beneath the reserved gap.
    'bottom-(--_tab-indicator-bottom,-1px)',
    'start-(--spacing-3) end-(--spacing-3) h-[2px] rounded-(--radius-full) pointer-events-none',
    '[transition-property:opacity,background-color] [transition-duration:var(--duration-fast)]',
    '[transition-timing-function:var(--ease-standard)]',
  ),
  indicatorSelected: 'bg-(--color-accent) opacity-100',
  indicatorUnselected: 'bg-transparent opacity-0',
  icon: 'inline-flex items-center justify-center shrink-0',
  labelContainer: 'inline-grid',
  labelText: 'row-start-1 col-start-1',
  labelSizer:
    'row-start-1 col-start-1 invisible pointer-events-none font-(number:--font-weight-semibold)',
  endContentWrapper: 'inline-flex items-center shrink-0',
} as const;

const sizeStyles = {
  sm: 'h-(--size-element-sm)',
  md: 'h-(--size-element-md)',
  lg: 'h-(--size-element-lg)',
} as const;

// Hover bg uses the standard element size (one step smaller than tab)
const hoverSizeStyles = {
  sm: 'h-(--size-element-sm)',
  md: 'h-(--size-element-md)',
  lg: 'h-(--size-element-lg)',
} as const;

const layoutStyles = {
  fill: 'flex-1 justify-center',
} as const;

const iconSizeStyles = {
  sm: 'w-[14px] h-[14px]',
  md: 'w-[16px] h-[16px]',
  lg: 'w-[18px] h-[18px]',
} as const;

/**
 * Tab item component. Renders as an anchor when `href` is provided,
 * otherwise as a button.
 *
 * @example
 * ```
 * <TabList value={tab} onChange={setTab}>
 *   <Tab value="general" label="General" />
 *   <Tab value="advanced" label="Advanced" />
 * </TabList>
 * ```
 */
export function Tab({
  as,
  ref,
  value,
  label,
  isLabelHidden = false,
  href,
  panelId,
  icon,
  selectedIcon,
  endContent,
  className,
  style,
  onClick,
  ...restProps
}: TabProps) {
  const tabListCtx = useTabListContext();
  const LinkComponent = useLinkComponent(as);

  const isSelected = tabListCtx.value === value;
  const size: TabListSize = tabListCtx.size;
  const isFill = tabListCtx.layout === 'fill';
  const isTabsPattern = tabListCtx.pattern === 'tabs';
  const isLink = href != null && !isTabsPattern;
  const isTabRole = isTabsPattern && !isLink;
  const displayIcon = isSelected && selectedIcon ? selectedIcon : icon;
  const hasVisibleLabel = !isLabelHidden && label !== '';

  const isDisabled =
    restProps['aria-disabled'] === true ||
    restProps['aria-disabled'] === 'true';

  const handleSelect = useCallback(
    (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
      if (!event.defaultPrevented) {
        tabListCtx.onChange(value);
      }
    },
    [isDisabled, onClick, tabListCtx, value],
  );

  useDevWarning(
    'Tab',
    'href is ignored in a role="tablist" TabList — a tab swaps a panel in ' +
      'place rather than navigating. Drop the href, or drop the role for the ' +
      'navigation pattern.',
    isTabRole && href != null,
  );

  // A consumer who wired aria-controls by hand already said which panel this
  // is, so panelId is the sugar, not the only way in.
  const controls = panelId ?? restProps['aria-controls'];

  useDevWarning(
    'Tab',
    'a tab in a role="tablist" TabList controls nothing: pass panelId with ' +
      'the id of the panel it opens, so assistive technology can associate ' +
      'the two.',
    isTabRole && controls == null,
  );

  useDevWarning(
    'Tab',
    'panelId does nothing outside a role="tablist" TabList — the navigation ' +
      'pattern has no panel to associate. Give the TabList role="tablist", ' +
      'or drop the panelId.',
    !isTabsPattern && panelId != null,
  );

  const iconElement = displayIcon ? (
    <span className={cn(styles.icon, iconSizeStyles[size])}>
      {displayIcon}
    </span>
  ) : null;

  const sharedProps = {
    ...restProps,
    ...(isLabelHidden ? {'aria-label': label} : {}),
    [EDGE_COMP_ATTR]: '',
    'data-tab-value': value,
    ...(isTabRole
      ? {
          role: 'tab' as const,
          'aria-selected': isSelected,
          // Only when there is a panel to point at: an aria-controls whose
          // target does not exist is an invalid attribute value, which is a
          // worse state than saying nothing. The dev warning above asks for
          // the id instead.
          'aria-controls': controls,
        }
      : {
          // Generic `true` ("the current item within a set"), not `page`: the
          // strip switches views in place at least as often as it navigates,
          // and claiming "current page" when no page changed is a false
          // statement to a screen reader. Stays truthful for the `href` case
          // too, just less specific. A tab role states this with
          // aria-selected instead.
          'aria-current': isSelected ? ('true' as const) : undefined,
        }),
    // Roving tabindex: the tab strip is a single Tab stop. The selected tab is
    // the tabbable one; the rest are reachable via arrow keys (handled by
    // TabList's onKeyDown). When no tab is selected, TabList's repair effect
    // makes the first stop tabbable.
    tabIndex: isSelected ? 0 : -1,
    ...mergeProps(
      themeProps('tab', {
        selected: isSelected ? 'selected' : null,
      }),
      {
        className: cn(
          focusOutlineStyles.focusVisible,
          styles.base,
          sizeStyles[size],
          isSelected && styles.selected,
          isFill && layoutStyles.fill,
          !isDisabled && tabScope,
        ),
      },
      className,
      style,
    ),
  };

  const hoverBgElement = (
    <span
      aria-hidden="true"
      className={cn(styles.hoverBg, hoverSizeStyles[size])}
    />
  );

  const indicatorElement = (
    <span
      {...mergeProps(
        themeProps('tab-indicator', {
          selected: isSelected ? 'selected' : null,
        }),
        {
          className: cn(
            styles.indicator,
            isSelected ? styles.indicatorSelected : styles.indicatorUnselected,
          ),
        },
      )}
    />
  );

  const labelElement = hasVisibleLabel ? (
    <span className={styles.labelContainer}>
      <span className={styles.labelText}>{label}</span>
      <span aria-hidden="true" className={styles.labelSizer}>
        {label}
      </span>
    </span>
  ) : null;

  const endContentElement = endContent ? (
    <span className={styles.endContentWrapper}>{endContent}</span>
  ) : null;

  if (isLink) {
    // A disabled link tab must not reach a router component: some routers reject
    // a missing destination, while others treat it as the current route. A
    // plain anchor without href preserves the element shape but cannot navigate.
    const LinkRoot = isDisabled ? 'a' : LinkComponent;
    return (
      <LinkRoot
        ref={ref}
        href={isDisabled ? undefined : href}
        onClick={handleSelect}
        {...sharedProps}>
        {hoverBgElement}
        {iconElement}
        {labelElement}
        {endContentElement}
        {indicatorElement}
      </LinkRoot>
    );
  }

  return (
    <button ref={ref} type="button" onClick={handleSelect} {...sharedProps}>
      {hoverBgElement}
      {iconElement}
      {labelElement}
      {endContentElement}
      {indicatorElement}
    </button>
  );
}

Tab.displayName = 'Tab';
