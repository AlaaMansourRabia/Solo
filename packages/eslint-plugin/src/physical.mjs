/**
 * @file physical.mjs
 * @output Detectors for physical-direction styling (left/right) and the
 *   logical replacement for each — shared by the ESLint rule and Solo's own
 *   docs:check.
 *
 * Physical styling looks right in English and silently breaks Arabic, Hebrew
 * and every other right-to-left layout: `ml-4` stays on the left when the
 * whole page has mirrored. The logical forms (`ms-4`, `marginInlineStart`)
 * follow the reading direction.
 */

/** Physical Tailwind utility prefix → logical replacement. */
export const PHYSICAL_UTILITIES = {
  ml: 'ms',
  mr: 'me',
  pl: 'ps',
  pr: 'pe',
  left: 'start',
  right: 'end',
  'border-l': 'border-s',
  'border-r': 'border-e',
  'rounded-l': 'rounded-s',
  'rounded-r': 'rounded-e',
  'rounded-tl': 'rounded-ss',
  'rounded-tr': 'rounded-se',
  'rounded-bl': 'rounded-es',
  'rounded-br': 'rounded-ee',
  'scroll-ml': 'scroll-ms',
  'scroll-mr': 'scroll-me',
  'scroll-pl': 'scroll-ps',
  'scroll-pr': 'scroll-pe',
};

/** Whole physical utilities (no value suffix) → logical replacement. */
export const PHYSICAL_KEYWORDS = {
  'text-left': 'text-start',
  'text-right': 'text-end',
  'float-left': 'float-start',
  'float-right': 'float-end',
  'clear-left': 'clear-start',
  'clear-right': 'clear-end',
};

/** Physical CSS property (camelCase or kebab-case) → logical replacement. */
export const PHYSICAL_PROPERTIES = {
  marginLeft: 'marginInlineStart',
  marginRight: 'marginInlineEnd',
  paddingLeft: 'paddingInlineStart',
  paddingRight: 'paddingInlineEnd',
  left: 'insetInlineStart',
  right: 'insetInlineEnd',
  borderLeft: 'borderInlineStart',
  borderRight: 'borderInlineEnd',
  borderLeftWidth: 'borderInlineStartWidth',
  borderRightWidth: 'borderInlineEndWidth',
  borderLeftColor: 'borderInlineStartColor',
  borderRightColor: 'borderInlineEndColor',
  borderLeftStyle: 'borderInlineStartStyle',
  borderRightStyle: 'borderInlineEndStyle',
  borderTopLeftRadius: 'borderStartStartRadius',
  borderTopRightRadius: 'borderStartEndRadius',
  borderBottomLeftRadius: 'borderEndStartRadius',
  borderBottomRightRadius: 'borderEndEndRadius',
  scrollMarginLeft: 'scrollMarginInlineStart',
  scrollMarginRight: 'scrollMarginInlineEnd',
  scrollPaddingLeft: 'scrollPaddingInlineStart',
  scrollPaddingRight: 'scrollPaddingInlineEnd',
};

/** Properties that are only physical for certain values. */
const PHYSICAL_VALUES = {textAlign: true, float: true, clear: true};

const kebab = name => name.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
const camel = name => name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

const PREFIXES = Object.keys(PHYSICAL_UTILITIES).sort((a, b) => b.length - a.length);
const UTILITY_RE = new RegExp(`^(-?)(${PREFIXES.map(p => p.replace(/-/g, '\\-')).join('|')})(-.+)?$`);

/**
 * Checks one Tailwind class (with any variants, e.g. `md:hover:!ml-4`).
 * Returns {className, replacement} for a physical class, otherwise null.
 */
export function checkClass(token) {
  const variantEnd = lastVariantColon(token);
  const variants = token.slice(0, variantEnd + 1);
  let utility = token.slice(variantEnd + 1);
  const important = utility.startsWith('!') ? '!' : '';
  utility = utility.slice(important.length);

  if (utility in PHYSICAL_KEYWORDS) {
    return {className: token, replacement: variants + important + PHYSICAL_KEYWORDS[utility]};
  }
  // Arbitrary property: [margin-left:4px]
  const arbitrary = /^\[([a-z-]+):(.+)\]$/.exec(utility);
  if (arbitrary) {
    const hit = checkStyleProperty(camel(arbitrary[1]), arbitrary[2].replace(/_/g, ' '));
    if (!hit) return null;
    const logical = hit.value
      ? `[${arbitrary[1]}:${hit.value === 'left' ? 'start' : 'end'}]`
      : `[${kebab(hit.replacement)}:${arbitrary[2]}]`;
    return {className: token, replacement: variants + important + logical};
  }
  const m = UTILITY_RE.exec(utility);
  if (!m) return null;
  const [, negative, prefix, rest = ''] = m;
  // `left`/`right` without a value suffix are not utilities (e.g. a word).
  if ((prefix === 'left' || prefix === 'right') && !rest) return null;
  // border-l / rounded-l have bare forms; the rest need a value.
  if (!rest && !/^(border|rounded)-/.test(prefix)) return null;
  return {className: token, replacement: `${variants}${important}${negative}${PHYSICAL_UTILITIES[prefix]}${rest}`};
}

/** Index of the colon that ends the variant list, ignoring colons inside [...]. */
function lastVariantColon(token) {
  let depth = 0, last = -1;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === '[') depth++;
    else if (c === ']') depth--;
    else if (c === ':' && depth === 0) last = i;
  }
  return last;
}

/** Every physical class in a class string. */
export function checkClassString(value) {
  return value.split(/\s+/).filter(Boolean).map(checkClass).filter(Boolean);
}

/**
 * Checks one style property. `value` is the literal value when known (a
 * string or number), or undefined. Returns {property, replacement} or null.
 */
export function checkStyleProperty(property, value) {
  const name = property.includes('-') ? camel(property) : property;
  if (name in PHYSICAL_PROPERTIES) return {property, replacement: PHYSICAL_PROPERTIES[name]};
  if (name in PHYSICAL_VALUES && typeof value === 'string') {
    const v = value.trim();
    if (v === 'left') return {property, value: v, replacement: `${name}: 'start'`};
    if (v === 'right') return {property, value: v, replacement: `${name}: 'end'`};
  }
  return null;
}
