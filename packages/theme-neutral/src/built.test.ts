/**
 * Guards @solo/theme-neutral/built against drifting from the source theme.
 * The built artifacts (built/neutral.js + built/theme.css) are pre-built
 * from the source theme; this checks they still describe the same theme as
 * src/neutralTheme.ts.
 */

import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {generateThemeCSS} from '@solo/core/theme';
import {neutralTheme as builtTheme} from '../built/neutral.js';
import {neutralTheme} from './neutralTheme';

const builtCss = readFileSync(join(__dirname, '../built/theme.css'), 'utf8');
const squash = (css: string) => css.replace(/\s+/g, '');

describe('@solo/theme-neutral/built', () => {
  it('is marked built so <Theme> skips runtime injection', () => {
    expect(builtTheme.__built).toBe(true);
    expect(builtTheme.name).toBe(neutralTheme.name);
  });

  it('carries the same tokens as the source theme', () => {
    expect(builtTheme.tokens).toEqual(neutralTheme.tokens);
  });

  it('ships every rule the runtime generator emits', () => {
    const {prose, component} = generateThemeCSS(neutralTheme);
    const built = squash(builtCss);
    for (const rule of [...prose.split(/\n\s*\n/), ...component.split(/\n\s*\n/)]) {
      // Compare rule bodies; wrapping (@layer / @scope) differs by build.
      const body = squash(rule).replace(/^@scope\([^)]*\)to\([^)]*\)\{/, '');
      for (const decl of body.split(/[{}]/).filter(part => part.includes(':'))) {
        expect(built, decl.slice(0, 80)).toContain(decl);
      }
    }
  });
});
