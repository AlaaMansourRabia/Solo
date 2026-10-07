/**
 * Every example block renders standalone, with no props (docs:check
 * `block-render`). Blocks are rendered the way a docs page hosts them:
 * inside a Theme and a LayerProvider.
 */

import type {ComponentType} from 'react';
import {render, cleanup} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {LayerProvider, Theme} from '@solo/core';
import {neutralTheme} from '@solo/theme-neutral';

const blocks = import.meta.glob<{default: ComponentType}>('../*/*.tsx');
const docs = import.meta.glob<{doc: {exampleFor?: string}}>('../*/*.doc.mjs');

// jsdom has no ResizeObserver; charts measure their container with one.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

afterEach(cleanup);

describe('example blocks render standalone', () => {
  const entries = Object.entries(blocks).sort(([a], [b]) => a.localeCompare(b));

  it('has a doc for every block', () => {
    const missing = entries
      .map(([file]) => file.replace(/\.tsx$/, '.doc.mjs'))
      .filter(doc => !(doc in docs));
    expect(missing).toEqual([]);
  });

  for (const [file, load] of entries) {
    const name = file.replace(/^\.\.\//, '').replace(/\.tsx$/, '');
    it(name, async () => {
      // React's warnings for props that leak onto DOM elements.
      const domPropWarning =
        /React does not recognize the `.*` prop on a DOM element|Invalid values? for props? .* on <\w+> tag|Unknown event handler property/;
      const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mod = await load();
      expect(typeof mod.default, `${name} has no default export`).toBe('function');
      const Block = mod.default;
      const {container} = render(
        <Theme theme={neutralTheme} mode="light">
          <LayerProvider>
            <Block />
          </LayerProvider>
        </Theme>,
      );
      expect(container.firstChild).not.toBeNull();
      const leaks = errors.mock.calls
        .map(args => args.map(String).join(' '))
        .filter(msg => domPropWarning.test(msg));
      errors.mockRestore();
      expect(leaks, `${name} leaks non-DOM props onto DOM elements`).toEqual([]);
    });
  }
});
