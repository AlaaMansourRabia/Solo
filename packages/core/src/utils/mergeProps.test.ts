import {describe, expect, it} from 'vitest';
import {mergeProps} from './mergeProps';

describe('mergeProps', () => {
  describe('string-first form (baseClass, styleProps, className?, style?)', () => {
    it('returns the base class alone when the style props has no class', () => {
      expect(mergeProps('solo-button', {className: ''})).toEqual({
        className: 'solo-button',
        style: undefined,
      });
    });

    it('prefixes the base class before the internal class name', () => {
      expect(mergeProps('solo-button', {className: 'x1 x2'})).toEqual({
        className: 'solo-button x1 x2',
        style: undefined,
      });
    });

    it('appends a consumer className after the internal classes', () => {
      expect(
        mergeProps('solo-button', {className: 'x1'}, 'consumer'),
      ).toEqual({
        className: 'solo-button x1 consumer',
        style: undefined,
      });
    });

    it('omits the consumer className when it is falsy', () => {
      expect(mergeProps('solo-button', {className: 'x1'}, undefined)).toEqual(
        {
          className: 'solo-button x1',
          style: undefined,
        },
      );
      expect(mergeProps('solo-button', {className: 'x1'}, '')).toEqual({
        className: 'solo-button x1',
        style: undefined,
      });
    });

    it('defaults the style props to an empty class when omitted', () => {
      expect(mergeProps('solo-button')).toEqual({
        className: 'solo-button',
        style: undefined,
      });
    });

    it('lets the consumer style override the internal style key-by-key', () => {
      const result = mergeProps(
        'solo-button',
        {className: 'x1', style: {color: 'red', margin: 0}},
        undefined,
        {color: 'blue'},
      );
      expect(result.style).toEqual({color: 'blue', margin: 0});
    });

    it('uses only the internal style when no consumer style is given', () => {
      const result = mergeProps('solo-button', {
        className: 'x1',
        style: {color: 'red'},
      });
      expect(result.style).toEqual({color: 'red'});
    });

    it('uses only the consumer style when the style props has none', () => {
      const result = mergeProps('solo-button', {className: 'x1'}, undefined, {
        color: 'blue',
      });
      expect(result.style).toEqual({color: 'blue'});
    });

    it('preserves extra keys from the style props via spread', () => {
      const result = mergeProps('solo-button', {
        className: 'x1',
        'data-style-src': 'internal',
      });
      expect(result['data-style-src']).toBe('internal');
    });
  });

  describe('object-first form (arbitrary prop merge)', () => {
    it('space-joins class names from both objects', () => {
      expect(mergeProps({className: 'a'}, {className: 'b'})).toEqual({
        className: 'a b',
      });
    });

    it('keeps the single class name when only one side has one', () => {
      expect(mergeProps({className: 'a'}, {})).toEqual({className: 'a'});
      expect(mergeProps({}, {className: 'b'})).toEqual({className: 'b'});
    });

    it('drops className entirely when neither side has one', () => {
      const result = mergeProps({id: 'x'}, {role: 'button'});
      expect('className' in result).toBe(false);
      expect(result).toEqual({id: 'x', role: 'button'});
    });

    it('lets override props win over base props', () => {
      expect(mergeProps({role: 'button', id: 'a'}, {id: 'b'})).toEqual({
        role: 'button',
        id: 'b',
      });
    });

    it('merges styles with the override winning per key', () => {
      const result = mergeProps(
        {style: {color: 'red', margin: 0}},
        {style: {color: 'green'}},
      );
      expect(result.style).toEqual({color: 'green', margin: 0});
    });

    it('drops style entirely when neither side has one', () => {
      const result = mergeProps({id: 'x'}, {id: 'y'});
      expect('style' in result).toBe(false);
    });

    it('treats a string third argument as an appended className', () => {
      expect(mergeProps({className: 'a'}, {className: 'b'}, 'c')).toEqual({
        className: 'a b c',
      });
    });

    it('treats an object third argument as a style', () => {
      const result = mergeProps({className: 'a'}, {}, {color: 'red'});
      expect(result).toEqual({className: 'a', style: {color: 'red'}});
    });

    it('applies the fourth argument as an overriding style', () => {
      const result = mergeProps({style: {color: 'red'}}, {}, undefined, {
        color: 'blue',
      });
      expect(result.style).toEqual({color: 'blue'});
    });

    it('accepts a string second argument as a className', () => {
      expect(mergeProps({className: 'a'}, 'b')).toEqual({className: 'a b'});
    });

    it('merges arbitrary data attributes, override winning', () => {
      const result = mergeProps(
        {'data-variant': 'primary', 'data-size': 'md'},
        {'data-size': 'lg'},
      );
      expect(result).toEqual({'data-variant': 'primary', 'data-size': 'lg'});
    });

    it('does not mutate the input objects', () => {
      const base = {className: 'a', style: {color: 'red'}};
      const overrides = {className: 'b', style: {color: 'blue'}};
      mergeProps(base, overrides);
      expect(base).toEqual({className: 'a', style: {color: 'red'}});
      expect(overrides).toEqual({className: 'b', style: {color: 'blue'}});
    });

    it('ignores a null third argument (no style, no class added)', () => {
      const result = mergeProps({className: 'a'}, {className: 'b'}, undefined);
      expect(result).toEqual({className: 'a b'});
    });
  });
});
