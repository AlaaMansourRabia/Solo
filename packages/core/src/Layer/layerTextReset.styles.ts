/**
 * @file layerTextReset.styles.ts
 * @input Uses the active theme's body typography tokens
 * @output Shared text baseline for content-bearing layer roots
 * @position Private Core styling for the layer text-reset contract
 */

import {cn} from '../utils/cn';

/**
 * Apply before component and consumer styles on the layer's content boundary.
 * Top-layer promotion does not stop DOM inheritance. Reset text formatting, not
 * writing context, theme variables, surface colors, geometry, or interaction.
 */
export const layerTextReset = {
  reset: cn(
    'font-(family-name:--font-family-body) text-(length:--text-body-size)',
    'font-(number:--text-body-weight) leading-(--text-body-leading)',
    '[font-style:normal] [text-align:start] [text-align-last:auto] [text-indent:0]',
    '[text-transform:none] [letter-spacing:normal] [word-spacing:normal]',
    '[text-shadow:none] [white-space:normal] [word-break:normal]',
    '[overflow-wrap:normal] [hyphens:manual]',
  ),
} as const;
