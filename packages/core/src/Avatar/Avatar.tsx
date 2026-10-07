'use client';

/**
 * @file Avatar.tsx
 * @input Uses React, HTMLAttributes, ReactNode, useState, useRef; useTooltip
 *   (Tooltip hook) for the optional name-on-hover tooltip; useTranslator (i18n)
 * @output Exports Avatar component, AvatarProps, AvatarSize types
 * @position Core implementation; consumed by index.ts
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Avatar/Avatar.doc.mjs (props table, features, implementation notes)
 * - /packages/core/src/Avatar/index.ts (exports if types change)
 * - /packages/core/src/Avatar/AvatarStatusLabelContext.ts (the status label ref)
 * - /apps/storybook/stories/Avatar.stories.tsx (storybook stories)
 *
 * Last synced props: alt, fallbackSrc, name, size, src, status, href, as, target, rel, onClick
 */

import {
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {BaseProps} from '../BaseProps';
import {AvatarSizeContext} from './AvatarSizeContext';
import {
  AvatarStatusLabelContext,
  type AvatarStatusLabelTarget,
} from './AvatarStatusLabelContext';
import {useAvatarGroup} from '../AvatarGroup/AvatarGroupContext';
import {mergeProps} from '../utils';
import {useMergedRefs} from '../hooks/useMergedRefs';
import {themeProps} from '../utils/themeProps';
import {firstCharacter} from '../utils/characters';
import {focusOutlineStyles} from '../utils/focusOutline.styles';
import {cn} from '../utils/cn';
import {useTooltip} from '../Tooltip/useTooltip';
import {useDevWarning} from '../hooks/useDevWarning';
import {useLinkComponent} from '../Link/useLinkComponent';
import type {LinkComponentType} from '../Link/types';
import {useTranslator, type TranslatorFn} from '../i18n';

/**
 * The offset ratio for positioning elements on a circle's edge at 45°.
 *
 * For a square with side length S containing an inscribed circle of diameter S,
 * a diagonal line from corner to corner intersects the circle at:
 *   x = S/2 × (1 ± 1/√2)
 *
 * The distance from the corner to this intersection point (along each axis) is:
 *   S/2 × (1 - 1/√2) ≈ 0.146S
 *
 * This constant represents that ratio: (1 - 1/√2) / 2 ≈ 0.146
 */
const CIRCLE_EDGE_OFFSET_RATIO = (1 - 1 / Math.SQRT2) / 2;

/**
 * The ratio of font size to avatar size for initials.
 *
 * At 40%, two-letter initials fit comfortably within the circle with adequate
 * padding. This ratio provides good legibility across all avatar sizes:
 *   - 24px avatar → 9.6px font
 *   - 48px avatar → 19.2px font
 *   - 128px avatar → 51.2px font
 */
const INITIALS_FONT_SIZE_RATIO = 0.4;

/**
 * Named size options.
 *
 * Avatar uses the same abbreviated scale as Icon (`xsm`/`sm`/`md`/`lg`/`xl`),
 * but the values are larger because avatars align with media rather than
 * glyphs. The tiers follow the standard avatar size scale.
 */
type AvatarNamedSize = 'xsm' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Numeric size options (in pixels)
 */
type AvatarNumericSize =
  16 | 20 | 24 | 32 | 36 | 40 | 48 | 60 | 64 | 72 | 96 | 128 | 144 | 180;

/**
 * Avatar size - can be a named size or a specific pixel value
 */
export type AvatarSize = AvatarNamedSize | AvatarNumericSize;

/**
 * Avatar shape options
 */
export type AvatarShape = 'circle' | 'rounded' | 'square';

/**
 * Resolves named sizes to their numeric pixel values
 */
export function resolveSize(size: AvatarSize): number {
  if (typeof size === 'number') {
    return size;
  }
  switch (size) {
    case 'xsm':
      return 20;
    case 'sm':
      return 24;
    case 'md':
      return 36;
    case 'lg':
      return 48;
    case 'xl':
      return 128;
  }
}

// Sets one local custom property rather than `borderRadius` directly, so
// every clipping/ring surface that needs the shape's radius (the wrapper,
// the interactive focus ring, the content div that actually clips via
// `overflow: hidden`, and AvatarGroupOverflow's "+N" indicator) reads the
// same value instead of each hardcoding its own borderRadius independently.
// A theme override only has to reach this one property, not fight the
// per-surface class order to change the shape everywhere at once.
export const shapeStyles = {
  circle: '[--_avatar-radius:var(--radius-full)]',
  rounded: '[--_avatar-radius:var(--radius-element)]',
  square: '[--_avatar-radius:var(--radius-none)]',
} as const satisfies Record<AvatarShape, string>;

/**
 * Base styles for the avatar
 * Uses a wrapper/content structure so status isn't clipped by overflow:hidden
 */
const styles = {
  wrapper: cn(
    'relative inline-flex shrink-0',
    // Reads the shape variant's `--_avatar-radius` (set by `shapeStyles`
    // above) rather than a hardcoded value, so `shape` actually changes the
    // wrapper's own radius instead of only the content div's clip.
    'rounded-(--_avatar-radius)',
  ),
  content: cn(
    'flex items-center justify-center w-full h-full overflow-hidden [user-select:none]',
    // The content div is the one that actually clips (via overflow: hidden
    // above), so it needs its own border-radius matching the wrapper's.
    // It inherits `--_avatar-radius` from the wrapper, since custom
    // properties cascade to descendants even though border-radius itself
    // does not.
    'rounded-(--_avatar-radius)',
  ),
  image: 'w-full h-full object-cover',
  fallback: cn(
    'flex items-center justify-center w-full h-full',
    // Fallback surface (initials + default icon). Background, text color,
    // weight, and per-size font size are all themed directly via the stable
    // `.solo-avatar-fallback` class target (font size through its size
    // variant, `.solo-avatar-fallback.<size>`), so the defaults here are
    // plain values with no internal-var seam. See Avatar.doc.mjs theming.
    'bg-(--color-neutral) text-(--color-text-secondary)',
    'font-(family-name:--font-family-body) font-(number:--font-weight-medium) uppercase',
  ),
  status: 'absolute',
  // Reset the intrinsic styling of the interactive element (<a>/<button>) so it
  // is a transparent, correctly-sized wrapper around the avatar visuals. The
  // element carries the focus-visible accent ring for keyboard users.
  interactive: cn(
    'appearance-none p-0 m-0 [border-width:0] [border-style:none] bg-transparent text-inherit [font:inherit] [text-decoration:none]',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-default',
    // Match the avatar's shape (via `--_avatar-radius`) so the focus ring
    // hugs it, whichever shape variant is in effect.
    'rounded-(--_avatar-radius)',
  ),
} as const;

/**
 * Size-dependent styles. The values travel through scoped custom properties
 * set inline (see `sizeVars` in the component), so the classes stay static
 * and a consumer className can still override them.
 */
const dynamicStyles = {
  size: 'w-(--_avatar-size) h-(--_avatar-size)',
  // Initials font size defaults to the proportional `size × ratio` scale. The
  // value lands via a class (not an inline font-size) — a theme's
  // `.solo-avatar-fallback.<size>` rule in the theme layer overrides it per
  // size tier.
  fontSize: 'text-(length:--_avatar-initials-size)',
  statusPositionCircle: cn(
    'bottom-(--_avatar-status-offset) end-(--_avatar-status-offset)',
    // `insetInlineEnd` anchors to the right edge in LTR / left in RTL, so the
    // outward push must mirror too: +X in LTR, −X in RTL (Y is unaffected).
    '[transform:translate(50%,50%)] [&:is([dir=rtl]_*)]:[transform:translate(-50%,50%)]',
  ),
  statusPositionCorner: cn(
    'bottom-0 end-0',
    // Same RTL mirroring as statusPositionCircle above: insetInlineEnd
    // anchors to the right edge in LTR / left in RTL, so the outward push
    // must flip sign too.
    '[transform:translate(25%,25%)] [&:is([dir=rtl]_*)]:[transform:translate(-25%,25%)]',
  ),
} as const;

// BORDER_WIDTH = 2 (spelled out in `groupStyles.ring`).

const groupStyles = {
  ring: '[border-width:2px] [border-style:solid] border-(--color-background-surface) bg-(--color-background-surface) box-content',
  // Every avatar takes the overlap, not just `:not(:first-child)`: a
  // HoverCard or Tooltip wraps its trigger in its own element, which makes
  // every wrapped avatar a first child. AvatarGroup pads its start edge by the
  // same amount so the first avatar still sits inside the group's box.
  overlap: 'ms-(--_avatar-group-overlap)',
  // The overlap amount, routed through a scoped var set inline.
  overlapVar: '[--_avatar-group-overlap:var(--_avatar-group-overlap-value)]',
} as const;

export interface AvatarProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * The alt text shown on hover and made accessible to screen readers.
   * Falls back to `name` if not provided.
   */
  alt?: string;
  /**
   * testid for tests.
   */
  'data-testid'?: string;
  /**
   * Fallback image source when primary `src` fails to load.
   * If this also fails, shows initials derived from `name`.
   */
  fallbackSrc?: string;
  /**
   * The user's name. Used for:
   * - Generating initials when no image is available
   * - Default alt text if `alt` is not provided
   */
  name?: string;
  /**
   * The size of the avatar. A named size (`xsm` 20px, `sm` 24px, `md` 36px,
   * `lg` 48px, `xl` 128px) or a specific pixel value.
   *
   * Inside an `AvatarGroup` the group's `size` wins: a group sizes its members
   * uniformly, so this prop is ignored there.
   * @default 'md'
   */
  size?: AvatarSize;
  /**
   * Shape variant of the avatar.
   * - 'circle': Full circle (default)
   * - 'rounded': Rounded square
   * - 'square': Sharp square
   * @default 'circle'
   */
  shape?: AvatarShape;
  /**
   * The primary image source for the avatar.
   */
  src?: string;
  /**
   * Content displayed in the corner of the avatar.
   * Typically used for status indicators or badges.
   *
   * `AvatarStatusDot` reports its own `label` to the avatar, which composes
   * it into the avatar's accessible name (e.g. "Jane Doe, Online") so
   * assistive tech can reach the status: the `role="img"` root prunes
   * descendant semantics (WCAG 4.1.2). Reporting goes through context, so it
   * still works when the dot sits inside a wrapper component of your own. A
   * custom status element that is not an `AvatarStatusDot` names itself the
   * same way, by rendering an `AvatarStatusDot` or by carrying a string
   * `label` prop.
   */
  status?: ReactNode;
  /**
   * Tooltip shown on hover (and keyboard focus).
   * - omitted / `true`: show the avatar's `name`
   * - a string: show that text instead
   * - `false`: no tooltip
   *
   * The avatar owns this tooltip. It is NOT auto-disabled when wrapped in your
   * own Tooltip/HoverCard — set `tooltip={false}` if you provide your own
   * overlay. No tooltip is shown if `tooltip` is `true`/omitted and there is
   * no (non-whitespace) `name`.
   * @default true
   */
  tooltip?: string | boolean;
  /**
   * When provided, the avatar becomes an interactive link (`<a>` or custom
   * link component) pointing at `href`. Follows the same element-swap rules as
   * Button: `href` renders a link, otherwise `onClick` renders a
   * `<button type="button">`, otherwise the avatar stays a static (non-focusable)
   * element. An interactive avatar requires a meaningful accessible name via
   * `alt` or `name`.
   */
  href?: string;
  /**
   * Custom link component to use when `href` is provided. Overrides the
   * provider-level default set by LinkProvider. Useful for Next.js `<Link>` or
   * other router-aware components. Only applies when `href` is provided.
   */
  as?: LinkComponentType;
  /**
   * HTML target attribute for the link. Only applies when `href` is provided.
   */
  target?: string;
  /**
   * HTML rel attribute for the link. Only applies when `href` is provided.
   */
  rel?: string;
  /**
   * Click handler. When provided without `href`, renders the avatar as a
   * focusable `<button type="button">`. An interactive avatar requires a
   * meaningful accessible name via `alt` or `name`.
   */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

/**
 * A character that can stand for a word in initials: a letter, a digit, or an
 * emoji. Punctuation and other symbols, such as `(`, `"` or `-`, cannot.
 */
const INITIAL_CHARACTER =
  /[\p{L}\p{N}\p{Extended_Pictographic}\p{Regional_Indicator}]/u;

/**
 * The first character of a word that can stand for it in initials, skipping
 * leading punctuation, or '' when the word has none (a lone `-` or `()`).
 */
function initialCharacter(word: string): string {
  const index = word.search(INITIAL_CHARACTER);
  return index === -1 ? '' : firstCharacter(word.slice(index));
}

/**
 * Generates initials from a name string: the first letter, digit or emoji of
 * the first and last words. Words with none of those, such as a lone `-`, are
 * skipped, and leading punctuation within a word is ignored. Returns '' when
 * no word yields an initial.
 * @example
 * ```
 * getInitials('John Doe') // 'JD'
 * getInitials('Alice') // 'A'
 * getInitials('Northwind Workbench (automation)') // 'NA'
 * ```
 */
function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .map(initialCharacter)
    .filter(initial => initial !== '');
  if (initials.length === 0) {
    return '';
  }
  if (initials.length === 1) {
    return initials[0].toUpperCase();
  }
  return (initials[0] + initials[initials.length - 1]).toUpperCase();
}

/**
 * Reads the accessible status label off the `status` element, when it
 * exposes one.
 *
 * Only sees a literal `label` prop on the element the consumer passes, so a
 * consumer's own wrapper around the dot hides it — that case comes in through
 * `AvatarStatusLabelContext` instead. Kept because it answers the first
 * render, before any report has landed, and because it tracks a label that
 * changes on an element that does not report at all.
 */
function getStatusLabel(status: ReactNode): string | undefined {
  if (!isValidElement(status)) {
    return undefined;
  }
  const {label} = status.props as {label?: unknown};
  return typeof label === 'string' && label !== '' ? label : undefined;
}

/**
 * The string when it carries something, `undefined` when it is absent or
 * blank. An empty accessible name is meaningless, so a blank reads as
 * absent, the way Icon treats `label=""`.
 */
function meaningful(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

/**
 * Derives the root's ARIA attributes from the resolved accessible name,
 * following Icon's `getIconA11yProps`.
 *
 * - A name → meaningful image: `role="img"` + `aria-label`.
 * - No name → decorative: `role="presentation"` + `aria-hidden="true"`, rather
 *   than announcing a meaningless generic "Avatar" (obs-9).
 *
 * The result is spread BEFORE `{...props}` on every root so an explicit
 * `aria-label` / `role` / `aria-hidden` from the consumer always wins.
 */
function getAvatarA11yProps(
  accessibleName: string | undefined,
):
  | {role: 'img'; 'aria-label': string}
  | {role: 'presentation'; 'aria-hidden': 'true'} {
  return accessibleName != null && accessibleName !== ''
    ? {role: 'img', 'aria-label': accessibleName}
    : {role: 'presentation', 'aria-hidden': 'true'};
}

/**
 * The avatar's accessible name: its own name, the status label, or the two
 * composed ("Jane Doe, Online"). Used both by render and by the commit-phase
 * update, so the two can never compose differently.
 */
function composeAccessibleName(
  t: TranslatorFn,
  nameLabel: string | undefined,
  statusLabel: string | undefined,
): string | undefined {
  if (nameLabel && statusLabel) {
    return t('@solo.avatar.nameWithStatus', {
      name: nameLabel,
      status: statusLabel,
    });
  }
  return nameLabel || statusLabel;
}

/** Sets an attribute, or removes it when the value is absent. */
function setAttributeOrRemove(
  element: HTMLElement,
  name: string,
  value: string | undefined,
): void {
  if (value == null) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, value);
  }
}

/**
 * Default person icon SVG for when no image or name is provided
 */
function DefaultIcon({size}: {size: number}) {
  return (
    <svg
      width={size * 0.6}
      height={size * 0.6}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

/**
 * Avatar component for displaying user profile pictures.
 *
 * Displays an image when available, falling back to initials derived from
 * the name prop, or a generic person icon if neither is provided.
 *
 * @example
 * ```
 * <Avatar src="/user.jpg" name="John Doe" />
 * <Avatar name="Jane Smith" size="xl" />
 * <Avatar src="/user.jpg" status={<AvatarStatusDot variant="success" label="Online" />} />
 * <Avatar name="jsmith" tooltip="Jane Smith, Staff Engineer" />
 * <Avatar name="Jane" tooltip={false} />
 * <Avatar src="/user.jpg" name="John Doe" href="/users/john" />
 * <Avatar src="/user.jpg" name="John Doe" onClick={() => openProfile()} />
 * ```
 */
export function Avatar({
  alt,
  'data-testid': testId,
  fallbackSrc,
  name,
  size = 'md',
  shape = 'circle',
  src,
  status,
  tooltip = true,
  href,
  as,
  target,
  rel,
  onClick,
  className,
  style,
  ref,
  ...props
}: AvatarProps) {
  // Track the exact src that failed (rather than a boolean) so a changed
  // src/fallbackSrc gets a fresh load attempt instead of the stale error.
  const [erroredSrc, setErroredSrc] = useState<string | undefined>(undefined);
  const [erroredFallbackSrc, setErroredFallbackSrc] = useState<
    string | undefined
  >(undefined);

  const showImage = src && erroredSrc !== src;
  const showFallbackImage =
    !showImage && fallbackSrc && erroredFallbackSrc !== fallbackSrc;
  // A whitespace-only string carries no identity. Without this it produces no
  // initials (getInitials trims to nothing) and no default icon (a space is
  // truthy), leaving an empty plate behind a blank accessible name.
  const meaningfulName = meaningful(name);
  const meaningfulAlt = meaningful(alt);
  // A name made only of punctuation ("—", "()") still names the avatar, but
  // yields no initials; it falls back to the default icon, not an empty plate.
  const initials = meaningfulName ? getInitials(meaningfulName) : '';
  const showInitials = !showImage && !showFallbackImage && initials !== '';
  const showIcon = !showImage && !showFallbackImage && initials === '';

  // A meaningful accessible name comes from `alt`/`name`, composed with the
  // status element's `label` when one is present ("Jane Doe, Online") — the
  // `role="img"` root prunes descendant semantics, so surfacing the label in
  // the avatar's own name is the only way assistive tech can reach the
  // status (WCAG 4.1.2). A labelled status alone is also meaningful. With
  // neither a name nor a labelled status, the avatar is decorative — expose
  // it as `presentation`/`aria-hidden` rather than announcing a meaningless
  // generic "Avatar" (obs-9).
  const t = useTranslator();
  const nameLabel = meaningfulAlt || meaningfulName;
  // This render can only see a label introspected off a directly-passed
  // element. A status inside a consumer's own wrapper reports through the ref
  // below, in the commit phase, and lands on the root element from there.
  const accessibleName = composeAccessibleName(
    t,
    nameLabel,
    getStatusLabel(status),
  );
  const a11yProps = getAvatarA11yProps(accessibleName);
  // An `<a>`/`<button>` root carries its own role and must not be hidden, so
  // only the name transfers. Spread before `{...props}` for the same
  // consumer-wins precedence as the static root.
  const a11yLabelProps = accessibleName
    ? {'aria-label': accessibleName}
    : undefined;
  const avatarGroup = useAvatarGroup();
  const resolvedSize = avatarGroup?.size ?? size;
  const resolvedShape = avatarGroup?.shape ?? shape;
  const numericSize = useMemo(() => resolveSize(resolvedSize), [resolvedSize]);

  // Resolve the tooltip content:
  // - `false`            → no tooltip
  // - a string           → that string
  // - `true` / omitted   → the `name` (a whitespace-only name yields nothing)
  // Note: the *visible* tooltip prefers `name` (not `alt`); the *accessible
  // name* on the root still uses `alt || name` above, independent of this.
  const tooltipContent =
    tooltip === false
      ? undefined
      : typeof tooltip === 'string'
        ? tooltip
        : meaningfulName;
  const trimmedTooltip = tooltipContent?.trim();
  const showTooltip = trimmedTooltip != null && trimmedTooltip !== '';
  // Whether the tooltip text is a consumer-authored override (a custom string)
  // rather than the default name. A custom description is worth wiring to
  // `aria-describedby` (it adds information, matching Button); the default name
  // tooltip is visual-only — its text duplicates the root `aria-label`, so
  // describing it too would double-announce the same name (OQ-4).
  const isCustomTooltip = typeof tooltip === 'string';

  // Own the name tooltip via the Tooltip hook (the Button pattern), which
  // returns `describedBy` as a value we choose whether to apply — the only way
  // to satisfy the per-case aria-describedby rule (default name: none; custom
  // string: describe) without editing Tooltip. `focusTrigger: 'auto'` shows the
  // tooltip on keyboard focus once the root is focusable (natively for the
  // interactive <a>/<button>, or via an explicit tab stop on the static div).
  const tooltipHook = useTooltip({
    placement: 'above',
    isEnabled: showTooltip,
  });
  // The tooltip ref attaches to whichever root element renders (static or
  // interactive), so the tooltip works for link/button avatars too. The root
  // ref itself is assembled below, once the element swap is resolved.
  const describedByProp =
    showTooltip && isCustomTooltip
      ? {
          'aria-describedby':
            [props['aria-describedby'], tooltipHook.describedBy]
              .filter(Boolean)
              .join(' ') || undefined,
        }
      : null;

  // Element-swap trichotomy, copied from Button: `href` renders a link,
  // otherwise `onClick` renders a `<button>`, otherwise today's static element
  // is unchanged (the non-breaking default).
  const renderAsLink = href != null;
  const renderAsButton = !renderAsLink && onClick != null;
  const isInteractive = renderAsLink || renderAsButton;
  const LinkComponent = useLinkComponent(as);

  // An interactive control needs an identity of its own. A status label is not
  // one: it composes into the accessible name, so `<Avatar href status={<dot
  // label="Online" />} />` resolves a name that reads as legitimate and says
  // nothing about who the link points at. Only `alt`/`name` count, or a
  // consumer's own `aria-label`/`aria-labelledby` escape hatch, which wins
  // over the derived props below.
  const consumerName =
    meaningful(props['aria-label']) ?? meaningful(props['aria-labelledby']);
  useDevWarning(
    'Avatar',
    'an interactive avatar (with `href` or `onClick`) needs a meaningful ' +
      'accessible name. Pass `alt` or `name`.',
    isInteractive && !nameLabel && consumerName == null,
  );

  // A status inside a consumer's own wrapper is invisible to render: the dot
  // writes its label into this ref from its own callback ref, in the commit
  // phase. A ref write cannot re-render, so the composed name is written
  // straight onto the root element instead — still before paint, and with no
  // second render.
  const statusLabelRef = useRef<AvatarStatusLabelTarget>({
    label: undefined,
    update: null,
  });
  const {
    'aria-hidden': consumerAriaHidden,
    'aria-label': consumerAriaLabel,
    role: consumerRole,
  } = props;
  // Recompose the name after React has written any relevant prop changes.
  // `update` covers the other direction: a label that changes while the avatar
  // itself does not re-render.
  const nameRef = useCallback(
    (element: HTMLElement | null) => {
      if (element == null) {
        return;
      }
      const target = statusLabelRef.current;
      target.update = () => {
        const composed = composeAccessibleName(
          t,
          nameLabel,
          meaningful(target.label) ?? getStatusLabel(status),
        );
        // A consumer's own ARIA wins here exactly as it does in render, where
        // the derived props spread before `{...props}`.
        if (consumerAriaLabel == null) {
          setAttributeOrRemove(element, 'aria-label', composed);
        }
        // An `<a>`/`<button>` root carries its own role and must not be hidden,
        // so only the name transfers there.
        if (!isInteractive) {
          if (consumerRole == null) {
            element.setAttribute('role', composed ? 'img' : 'presentation');
          }
          if (consumerAriaHidden == null) {
            setAttributeOrRemove(
              element,
              'aria-hidden',
              composed ? undefined : 'true',
            );
          }
        }
      };
      target.update();
      return () => {
        target.update = null;
      };
    },
    [
      consumerAriaHidden,
      consumerAriaLabel,
      consumerRole,
      isInteractive,
      nameLabel,
      status,
      t,
    ],
  );
  const rootRef = useMergedRefs(
    ref,
    showTooltip ? tooltipHook.ref : undefined,
    nameRef,
  );

  // The inner visuals are identical across the static and interactive variants.
  const visualContent = (
    <>
      <div className={styles.content}>
        {showImage && (
          <img
            src={src}
            alt=""
            onError={() => setErroredSrc(src)}
            className={styles.image}
          />
        )}
        {showFallbackImage && (
          <img
            src={fallbackSrc}
            alt=""
            onError={() => setErroredFallbackSrc(fallbackSrc)}
            className={styles.image}
          />
        )}
        {showInitials && (
          <div
            {...mergeProps(
              themeProps('avatar-fallback', {size: resolvedSize}),
              {
                className: cn(styles.fallback, dynamicStyles.fontSize),
                style: {
                  '--_avatar-initials-size': `${numericSize * INITIALS_FONT_SIZE_RATIO}px`,
                } as React.CSSProperties,
              },
            )}>
            {initials}
          </div>
        )}
        {showIcon && (
          <div
            {...mergeProps(
              themeProps('avatar-fallback', {size: resolvedSize}),
              styles.fallback,
            )}>
            <DefaultIcon size={numericSize} />
          </div>
        )}
      </div>
      {status && (
        <div
          className={cn(
            styles.status,
            resolvedShape === 'circle'
              ? dynamicStyles.statusPositionCircle
              : dynamicStyles.statusPositionCorner,
          )}
          style={
            resolvedShape === 'circle'
              ? ({
                  '--_avatar-status-offset': `${numericSize * CIRCLE_EDGE_OFFSET_RATIO}px`,
                } as React.CSSProperties)
              : undefined
          }>
          {status}
        </div>
      )}
    </>
  );

  // Shared class + theme props for the root element in every variant. The
  // group ring/overlap, the interactive focus-visible ring, and the
  // tooltip tab-stop focus ring all live here so the interactive
  // `<a>`/`<button>` and the static `<div>` carry the exact same box.
  const rootMergedProps = mergeProps(
    themeProps('avatar', {size: resolvedSize, shape: resolvedShape}),
    {
      className: cn(
        focusOutlineStyles.focusVisible,
        styles.wrapper,
        dynamicStyles.size,
        isInteractive && styles.interactive,
        avatarGroup && groupStyles.ring,
        avatarGroup && groupStyles.overlap,
        avatarGroup && groupStyles.overlapVar,
        shapeStyles[resolvedShape],
        className,
      ),
      style: {
        '--_avatar-size': `${numericSize}px`,
        ...(avatarGroup
          ? {'--_avatar-group-overlap-value': `${-avatarGroup.overlap}px`}
          : null),
        ...style,
      } as React.CSSProperties,
    },
  );

  let rootElement: ReactNode;

  // `props` is typed for the default `<div>` root (its event handlers are
  // HTMLDivElement-typed). The interactive branches render an `<a>`/`<button>`,
  // so the passthrough props are re-typed to the generic element here — the
  // avatar's own handlers (onClick) are declared on HTMLElement and stay typed.
  const interactivePassthrough = props as React.HTMLAttributes<HTMLElement>;

  if (renderAsLink) {
    // The rendered link carries the `data-avatar-item` marker so AvatarGroup's
    // roving focus (which selects on `[data-avatar-item]`, not a tag/role) picks
    // it up while ignoring nested buttons in a custom status/badge slot.
    rootElement = (
      <LinkComponent
        {...a11yLabelProps}
        {...interactivePassthrough}
        {...describedByProp}
        ref={rootRef as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        data-avatar-item=""
        data-testid={testId}
        onClick={onClick}
        {...rootMergedProps}>
        {visualContent}
      </LinkComponent>
    );
  } else if (renderAsButton) {
    rootElement = (
      <button
        {...a11yLabelProps}
        {...interactivePassthrough}
        {...describedByProp}
        ref={rootRef}
        type="button"
        data-avatar-item=""
        data-testid={testId}
        onClick={onClick}
        {...rootMergedProps}>
        {visualContent}
      </button>
    );
  } else {
    rootElement = (
      <div
        {...a11yProps}
        {...props}
        ref={rootRef}
        // The root is a div[role="img"], not natively focusable. When a name
        // tooltip is active, add a tab stop so keyboard users can reveal it
        // (WCAG 1.4.13 / 2.1.1) — matching Timestamp/Button. Suppressed inside
        // an AvatarGroup, which owns a single roving tab stop for its members.
        tabIndex={showTooltip && !avatarGroup ? 0 : undefined}
        data-testid={testId}
        {...describedByProp}
        {...rootMergedProps}>
        {visualContent}
      </div>
    );
  }

  const avatarElement = (
    <AvatarSizeContext value={numericSize}>
      <AvatarStatusLabelContext value={statusLabelRef}>
        {rootElement}
      </AvatarStatusLabelContext>
    </AvatarSizeContext>
  );

  // Always return the same structure so the avatar keeps its position in the
  // React tree regardless of the tooltip flag — toggling it must not remount
  // the avatar subtree (and lose image-load state). The tooltip is a sibling
  // (no wrapper DOM); the hook's ref is already on the root via `rootRef`.
  return (
    <>
      {avatarElement}
      {showTooltip ? tooltipHook.renderTooltip(trimmedTooltip) : null}
    </>
  );
}

Avatar.displayName = 'Avatar';
