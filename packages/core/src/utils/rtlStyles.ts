/**
 * @file rtlStyles.ts
 * @input None
 * @output Shared Tailwind classes that horizontally mirror an element under RTL
 * @position Core utility; applied to directional icons in Calendar, Lightbox,
 *   Pagination, Carousel and the Table expand/disclosure plugins
 *
 * `mirror` flips its element on the horizontal axis only when an ancestor
 * carries `dir="rtl"`. Using `scaleX(-1)` (not `scale(-1, -1)`) keeps the
 * vertical axis intact, and applying it OUTSIDE any state-driven rotation lets
 * it compose correctly — e.g. a Table disclosure chevron still rotates to point
 * down when expanded under RTL. The `:is([dir="rtl"] *)` selector matches the
 * MobileNav drawer convention; a bare `direction: rtl` alone won't trigger it.
 *
 * `centerInline(blockOffset?)` horizontally centers an absolutely-positioned,
 * auto-width element on the inline axis, correctly in BOTH LTR and RTL, with an
 * optional block-axis (Y) offset composed into the same transform. It
 * intentionally uses PHYSICAL `left: 50%` + `translateX(-50%)`: both reference
 * the same physical edge, so the pair is direction-symmetric and centers
 * identically regardless of `dir`. A logical `insetInlineStart: 50%` would flip
 * the anchor edge in RTL while the physical translate does not, leaving the
 * element off-center by its own width (centered in LTR, broken in RTL). This is
 * the one case where physical `left` is the correct choice, so the
 * `no-physical-properties` suppression lives here ONCE rather than at each call
 * site. The `@solo/no-physical-properties` lint recognises this exact pattern
 * and points offenders here.
 *
 * `blockOffset` is any CSS length/percentage for translateY (pass `'0px'` for
 * none): e.g. `centerInline('100%')` sits the element one full height below its
 * anchor, `centerInline('-50%')` centers it on both axes.
 *
 * API:
 * - `rtlStyles.mirror` — a class string; compose with `cn(…, rtlStyles.mirror)`
 *   or pass as `className`.
 * - `rtlStyles.centerInline(blockOffset)` — returns `{className, style}`; the
 *   offset travels through the scoped `--_center-inline-block` custom property.
 *   Spread both: `className={cn(a, c.className)} style={{...c.style, ...style}}`.
 *
 * SYNC: When modified, update:
 * - /packages/core/src/utils/index.ts
 */

export const rtlStyles = {
  mirror: '[&:is([dir=rtl]_*)]:[transform:scaleX(-1)]',
  centerInline: (blockOffset: string) => ({
    // intentional: physical left+translateX(-50%) is direction-symmetric and the correct way to center; a logical anchor would break RTL centering (see file header).
    className:
      'left-[50%] [transform:translate(-50%,var(--_center-inline-block))]',
    style: {'--_center-inline-block': blockOffset} as React.CSSProperties,
  }),
};
