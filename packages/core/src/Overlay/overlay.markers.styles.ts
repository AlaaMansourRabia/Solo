/**
 * Scoped group name for Overlay ancestor hover selectors. When applied to a container, enables OverlayScrim's CSS-driven
 * showOn="hover" / "focus" / "hover-or-focus" behavior via
 * `group-hover/overlay:` / `group-has-[:focus-visible]/overlay:` variants.
 */
export const overlayScope = 'group/overlay';

/**
 * Container styles that pair with overlayScope.
 * Sets position: relative + overflow: clip so the scrim
 * can use position: absolute + inset: 0 correctly.
 *
 * Override individual properties by applying your own classes after:
 * cn(overlayContainerStyles.root, 'sticky')
 */
export const overlayContainerStyles = {
  root: 'relative overflow-clip',
} as const;
