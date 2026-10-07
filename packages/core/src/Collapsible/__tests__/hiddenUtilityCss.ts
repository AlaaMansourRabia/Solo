/**
 * @file hiddenUtilityCss.ts
 * @output Installs the `hidden` utility (`display: none`) into jsdom
 * @position Test helper for Collapsible visibility assertions
 *
 * A closed Collapsible hides its content with the `hidden` class. Tests compile
 * no CSS, so `toBeVisible()` cannot see that unless the utility exists in the
 * document; this installs exactly the declaration Tailwind emits for it.
 */

import {afterEach, beforeEach} from 'vitest';

export function installHiddenUtilityCss(): void {
  let style: HTMLStyleElement | null = null;
  beforeEach(() => {
    style = document.createElement('style');
    style.textContent = '.hidden { display: none; }';
    document.head.appendChild(style);
  });
  afterEach(() => {
    style?.remove();
    style = null;
  });
}
