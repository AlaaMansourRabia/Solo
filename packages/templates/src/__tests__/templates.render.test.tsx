/**
 * Every page template renders standalone inside a Solo <Theme> (docs:check
 * `template-render`): no thrown errors and no React warnings about props
 * leaking onto DOM elements.
 */

import type {ComponentType} from 'react';
import {render, cleanup} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {LayerProvider, Theme} from '@solo/core';
import {neutralTheme} from '@solo/theme-neutral';

const templates = import.meta.glob<{default: ComponentType}>('../*/*Template.tsx');

// jsdom gaps the templates' charts and layout measurement rely on.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class {
    readonly root = null;
    readonly rootMargin = '0px';
    readonly thresholds = [0];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}

const domPropWarning =
  /React does not recognize the `.*` prop on a DOM element|Invalid values? for props? .* on <\w+> tag|Unknown event handler property/;

afterEach(cleanup);

describe('page templates render standalone', () => {
  for (const [file, load] of Object.entries(templates).sort(([a], [b]) => a.localeCompare(b))) {
    const name = file.replace(/^\.\.\//, '').replace(/\.tsx$/, '');
    it(name, async () => {
      const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        const mod = await load();
        expect(typeof mod.default, `${name} has no default export`).toBe('function');
        const Template = mod.default;
        const {container} = render(
          <Theme theme={neutralTheme} mode="light">
            <LayerProvider>
              <Template />
            </LayerProvider>
          </Theme>,
        );
        expect(container.firstChild).not.toBeNull();
        const leaks = errors.mock.calls
          .map(args => args.map(String).join(' '))
          .filter(msg => domPropWarning.test(msg));
        expect(leaks, `${name} leaks non-DOM props onto DOM elements`).toEqual([]);
      } finally {
        errors.mockRestore();
      }
    });
  }
});
