/**
 * @file edgeCompensation.styles.ts
 * @input Uses Tailwind classes
 * @output Class utilities for container-driven edge compensation
 * @position Layout utility; used by containers (Toolbar, Banner, etc.)
 *
 * ## Container-Driven Edge Compensation
 *
 * Interactive components with transparent padding (ghost buttons, tabs)
 * create excess visual space at container edges. The container's padding + the
 * component's own transparent padding doubles up.
 *
 * The solution is fully container-driven:
 *
 * 1. **Components** mark themselves with `data-solo-edge-comp` (a passive
 *    data attribute — no styles attached).
 * 2. **Containers** use `:has(> [data-solo-edge-comp]:first-child)` and
 *    `:has(> [data-solo-edge-comp]:last-child)` to detect edge-adjacent
 *    compensatable items and apply negative margin to their slot wrappers.
 *
 * The container owns both the detection and the adjustment. Components
 * just declare eligibility.
 *
 * SYNC: When modified, update /packages/core/src/Layout/Layout.doc.mjs
 */


/**
 * The data attribute that edge-compensatable components apply.
 * Ghost buttons, tabs, and other transparent-padding components
 * render this attribute so containers can detect them via `:has()`.
 */
export const EDGE_COMP_ATTR = 'data-solo-edge-comp';

/**
 * Container-side edge compensation styles.
 *
 * Apply to slot wrapper divs. The slot detects whether its first/last
 * child is an edge-compensatable component and pulls its own margin
 * inward by the specified inset amount.
 *
 * @example
 * ```tsx
 * const inset = edgeCompSlot.inset('var(--spacing-2)');
 * <div className={cn(styles.startSlot, inset.className)} style={inset.style}>
 *   {startContent}
 * </div>
 * ```
 */
export const edgeCompSlot = {
  /**
   * Dynamic style: returns `{className, style}`. The amount travels through a
   * scoped custom property so the conditional selectors stay static classes.
   */
  inset: (amount: string) => ({
    className:
      'has-[>[data-solo-edge-comp]:first-child]:ms-[calc(-1_*_var(--_edge-comp))] has-[>[data-solo-edge-comp]:last-child]:me-[calc(-1_*_var(--_edge-comp))]',
    style: {'--_edge-comp': amount} as React.CSSProperties,
  }),
};
