import {Linter} from 'eslint';
import {describe, expect, it} from 'vitest';
import plugin from './index.mjs';
import {checkClass, checkStyleProperty} from './physical.mjs';

function lint(code) {
  const linter = new Linter({configType: 'flat'});
  return linter.verify(code, [
    {
      files: ['**/*.jsx'],
      languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}},
      ...plugin.configs.recommended,
    },
  ], 'App.jsx');
}

describe('checkClass', () => {
  it.each([
    ['ml-4', 'ms-4'],
    ['mr-auto', 'me-auto'],
    ['-ml-2', '-ms-2'],
    ['pl-[13px]', 'ps-[13px]'],
    ['left-0', 'start-0'],
    ['right-1/2', 'end-1/2'],
    ['border-l', 'border-s'],
    ['border-r-2', 'border-e-2'],
    ['rounded-l-lg', 'rounded-s-lg'],
    ['rounded-tr-md', 'rounded-se-md'],
    ['text-left', 'text-start'],
    ['float-right', 'float-end'],
    ['md:hover:ml-4', 'md:hover:ms-4'],
    ['!pr-2', '!pe-2'],
    ['[margin-left:4px]', '[margin-inline-start:4px]'],
    ['[text-align:right]', '[text-align:end]'],
  ])('flags %s and suggests %s', (cls, replacement) => {
    expect(checkClass(cls)).toEqual({className: cls, replacement});
  });

  it.each(['ms-4', 'pe-2', 'start-0', 'text-start', 'border-s', 'border-red-500', 'prose', 'mx-4', 'px-2', 'inset-x-0', 'rounded-lg', 'text-lg', '[margin-inline:4px]'])(
    'accepts %s',
    cls => expect(checkClass(cls)).toBeNull(),
  );
});

describe('checkStyleProperty', () => {
  it('flags physical properties and suggests the logical one', () => {
    expect(checkStyleProperty('marginLeft', 16)).toMatchObject({replacement: 'marginInlineStart'});
    expect(checkStyleProperty('right', 0)).toMatchObject({replacement: 'insetInlineEnd'});
    expect(checkStyleProperty('border-top-left-radius', '4px')).toMatchObject({replacement: 'borderStartStartRadius'});
    expect(checkStyleProperty('textAlign', 'left')).toMatchObject({replacement: "textAlign: 'start'"});
  });

  it('accepts logical and direction-neutral properties', () => {
    expect(checkStyleProperty('marginInlineStart', 16)).toBeNull();
    expect(checkStyleProperty('textAlign', 'center')).toBeNull();
    expect(checkStyleProperty('top', 0)).toBeNull();
  });
});

describe('solo/logical-direction', () => {
  it('reports physical classes in className, cn() and template literals', () => {
    const messages = lint(`
      const a = <div className="flex ml-4 gap-2" />;
      const b = <div className={cn('p-2', isOpen && 'text-left')} />;
      const c = <div className={\`pr-3 \${x}\`} />;
      const styles = cn('rounded-l-md');
    `);
    expect(messages.map(m => m.message)).toEqual([
      expect.stringContaining('"ml-4"'),
      expect.stringContaining('"text-left"'),
      expect.stringContaining('"pr-3"'),
      expect.stringContaining('"rounded-l-md"'),
    ]);
    expect(messages[0].message).toContain('Use "ms-4"');
  });

  it('reports physical inline styles — the case a class-only check misses', () => {
    const messages = lint(`
      const a = <div style={{marginLeft: 16, top: 0, textAlign: 'right'}} />;
      const b = <div style={{left: 0, position: 'absolute'}} />;
    `);
    expect(messages.map(m => m.message)).toEqual([
      expect.stringContaining('`marginLeft`'),
      expect.stringContaining('`textAlign`'),
      expect.stringContaining('`left`'),
    ]);
    expect(messages[0].message).toContain('marginInlineStart');
  });

  it('accepts logical styling', () => {
    expect(lint(`
      const a = <div className="ms-4 pe-2 text-start" style={{marginInlineStart: 16, insetInlineEnd: 0}} />;
    `)).toEqual([]);
  });
});
