/**
 * Merge Solo theme props (`themeProps()`), internal `{className, style}`,
 * and optional consumer className/style.
 *
 * Merges the Solo stable class name plus any data-attribute reflection from
 * `themeProps()` with the component's Tailwind classes, so both the internal
 * styles and the theme-targeting surface are applied. Class names are merged
 * through `cn()` (tailwind-merge): later classes win per property.
 *
 * Consumer className is appended after the internal classes.
 * Consumer style is spread after internal inline styles, so these values take priority.
 *
 * @example
 * ```tsx
 * // Root element with themeProps
 * <div {...mergeProps(
 *   themeProps('button', { variant }),
 *   {className: cn(styles.base, variants[variant])},
 *   className,
 *   style,
 * )} />
 *
 * // Internal element — classes + dynamic style only
 * <div {...mergeProps(
 *   {className: styles.track},
 *   { style: { width: dynamicWidth } },
 * )} />
 * ```
 */

import {cn} from './cn';

type StyleObject = React.CSSProperties;
type PropsObject = {
  className?: string;
  style?: StyleObject;
  [key: string]: unknown;
};

function mergeTwoProps(base: PropsObject, overrides: PropsObject): PropsObject {
  const merged: PropsObject = {...base, ...overrides};

  const cls = cn(base.className, overrides.className);
  if (cls) {
    merged.className = cls;
  } else {
    delete merged.className;
  }

  const mergedStyle =
    overrides.style && base.style
      ? {...base.style, ...overrides.style}
      : overrides.style || base.style;
  if (mergedStyle) {
    merged.style = mergedStyle;
  } else {
    delete merged.style;
  }

  return merged;
}

export function mergeProps(
  baseClassOrProps: string | PropsObject,
  propsOrClassName?: PropsObject | string,
  classNameOrStyle?: string | React.CSSProperties,
  style?: React.CSSProperties,
): PropsObject {
  // Disambiguate: first arg is string → (baseClass, {className, style}, className?, style?)
  // first arg is object → merge arbitrary props (supports themeProps + data attrs).
  if (typeof baseClassOrProps === 'string') {
    const baseClass = baseClassOrProps;
    const styleProps = (propsOrClassName as PropsObject) ?? {
      className: '',
    };
    const className = classNameOrStyle as string | undefined;

    const cls = cn(baseClass, styleProps.className, className);

    const mergedStyle =
      style && styleProps.style
        ? {...styleProps.style, ...style}
        : style || styleProps.style;

    return {...styleProps, className: cls, style: mergedStyle};
  }

  const first = baseClassOrProps;
  const second =
    typeof propsOrClassName === 'string'
      ? {className: propsOrClassName}
      : (propsOrClassName ?? {});
  let merged = mergeTwoProps(first, second);

  if (typeof classNameOrStyle === 'string') {
    merged = mergeTwoProps(merged, {className: classNameOrStyle});
  } else if (classNameOrStyle != null) {
    merged = mergeTwoProps(merged, {style: classNameOrStyle});
  }

  if (style != null) {
    merged = mergeTwoProps(merged, {style});
  }

  return merged;
}
