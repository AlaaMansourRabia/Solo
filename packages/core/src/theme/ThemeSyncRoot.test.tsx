/**
 * <Theme syncRoot={false}> — embedding Solo in a host page without touching
 * <html>, while detached surfaces (the Toast fallback viewport) stay themed.
 */

import {render, cleanup} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import {Theme} from './Theme';
import {defineTheme} from './defineTheme';
import {getThemeAttributeSource} from './themeAttributeSource';

const theme = defineTheme({name: 'embedded'});

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-solo-theme');
});

describe('Theme syncRoot', () => {
  it('syncs theme attributes to <html> by default', () => {
    render(
      <Theme theme={theme} mode="dark">
        <p>content</p>
      </Theme>,
    );
    expect(document.documentElement).toHaveAttribute('data-solo-theme', 'embedded');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(getThemeAttributeSource()).toBe(document.documentElement);
  });

  it('leaves <html> alone with syncRoot={false}', () => {
    const {container} = render(
      <Theme theme={theme} mode="dark" syncRoot={false}>
        <p>content</p>
      </Theme>,
    );
    expect(document.documentElement).not.toHaveAttribute('data-solo-theme');
    expect(document.documentElement).not.toHaveAttribute('data-theme');
    // The wrapper still scopes the theme…
    const wrapper = container.querySelector('[data-solo-theme="embedded"]');
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveAttribute('data-theme', 'dark');
    // …and is where detached surfaces read the theme from.
    expect(getThemeAttributeSource()).toBe(wrapper);
  });

  it('restores <html> as the source when the embedded Theme unmounts', () => {
    const {unmount} = render(
      <Theme theme={theme} syncRoot={false}>
        <p>content</p>
      </Theme>,
    );
    unmount();
    expect(getThemeAttributeSource()).toBe(document.documentElement);
  });

  it('ignores syncRoot on nested Themes', () => {
    render(
      <Theme theme={theme} mode="light">
        <Theme theme={defineTheme({name: 'inner'})} syncRoot={false}>
          <p>content</p>
        </Theme>
      </Theme>,
    );
    expect(document.documentElement).toHaveAttribute('data-solo-theme', 'embedded');
    expect(getThemeAttributeSource()).toBe(document.documentElement);
  });
});
