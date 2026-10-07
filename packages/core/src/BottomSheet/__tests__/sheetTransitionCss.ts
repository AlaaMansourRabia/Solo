/**
 * @file sheetTransitionCss.ts
 * @output Installs the sheet panel's transition declarations into jsdom
 * @position Test helper for BottomSheet / BottomSheetSwitcher motion tests
 *
 * The panel waits for its own `transform` / `opacity` transitions by reading
 * the computed `transition-*` values (see `waitForTransition` in
 * BottomSheetPanel.tsx). Tests compile no CSS, so without these declarations
 * the panel would see no transition at all and finish every motion at once.
 * This mirrors `styles.sheet`: the duration stays an unresolved token, so the
 * native `transitionend` event the tests fire remains authoritative.
 */

import {afterEach, beforeEach} from 'vitest';

const SHEET_TRANSITION_CSS = `
.solo-bottom-sheet {
  transition-property: transform, opacity;
  transition-duration: var(--duration-medium);
  transition-timing-function: var(--ease-standard);
}
`;

export function installSheetTransitionCss(): void {
  let style: HTMLStyleElement | null = null;
  beforeEach(() => {
    style = document.createElement('style');
    style.setAttribute('data-test-sheet-transition', '');
    style.textContent = SHEET_TRANSITION_CSS;
    document.head.appendChild(style);
  });
  afterEach(() => {
    style?.remove();
    style = null;
  });
}
