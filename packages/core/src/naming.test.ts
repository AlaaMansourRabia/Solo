import {describe, it, expect} from 'vitest';
import {
  NAMESPACE,
  classPrefix,
  dataAttrNamespace,
  cssVarNamespace,
  stableClassName,
  dataAttr,
  cssVar,
} from './naming';

describe('naming constants', () => {
  it('exposes the namespace prefix', () => {
    expect(NAMESPACE).toBe('solo');
  });

  it('derives per-surface prefixes from the namespace', () => {
    expect(classPrefix).toBe('solo');
    expect(dataAttrNamespace).toBe('solo');
    expect(cssVarNamespace).toBe('solo');
  });
});

describe('stableClassName', () => {
  it('builds namespace class tokens', () => {
    expect(stableClassName('button')).toBe('solo-button');
    expect(stableClassName('card')).toBe('solo-card');
  });
});

describe('dataAttr', () => {
  it('builds namespace data attribute names', () => {
    expect(dataAttr('theme')).toBe('data-solo-theme');
    expect(dataAttr('media')).toBe('data-solo-media');
  });
});

describe('cssVar', () => {
  it('builds namespace custom property names', () => {
    expect(cssVar('card-padding')).toBe('--solo-card-padding');
  });
});
