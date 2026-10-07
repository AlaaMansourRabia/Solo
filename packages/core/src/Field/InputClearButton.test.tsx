/**
 * @file InputClearButton.test.tsx
 * @input Uses node:fs, node:path, vitest, @testing-library/react,
 *   InputClearButton, Icon and the global icon registry, and theme
 * @output Unit tests for the shared clear-button primitive
 * @position Testing; validates InputClearButton.tsx — the single home for the
 *   clearable input family's clear (✕) affordance and its theme target. Covers
 *   the accessible name, contextual hover tooltip, click callback, decorative
 *   registry glyph, both theme targets, touch hit area, and className forwarding.
 *
 * SYNC: When InputClearButton.tsx changes, update tests to match new behavior.
 */

import {readFileSync} from 'node:fs';
import path from 'node:path';
import {describe, it, expect, vi, afterEach} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {
  InputClearButton,
  InternalInputClearButton,
  type InputClearButtonProps,
} from './InputClearButton';
import {Icon, registerIcons, resetIcons} from '../Icon';
import {defineTheme} from '../theme/defineTheme';
import {generateThemeCSS} from '../theme/generateThemeRules';

function generateThemeTestCSS(theme: Parameters<typeof generateThemeCSS>[0]) {
  const {prose, component} = generateThemeCSS(theme);
  return [prose, component].filter(Boolean).join('\n\n');
}

const getGlyph = (): HTMLElement => {
  const button = screen.getByRole('button', {name: 'Clear'});
  const icon = button.querySelector('.solo-icon');
  if (icon == null) {
    throw new Error('clear glyph not found');
  }
  return icon as HTMLElement;
};

describe('InputClearButton public props', () => {
  it('keep popup invoker handlers internal', () => {
    const hasPointerDown: 'onPointerDown' extends keyof InputClearButtonProps
      ? true
      : false = false;
    const hasClickCapture: 'onClickCapture' extends keyof InputClearButtonProps
      ? true
      : false = false;

    expect(hasPointerDown).toBe(false);
    expect(hasClickCapture).toBe(false);
  });
});

describe('InputClearButton', () => {
  it('uses the contextual label for the tooltip and accessible name', async () => {
    const showPopover = vi.spyOn(HTMLElement.prototype, 'showPopover');
    render(<InputClearButton label="Clear Search" onClick={() => {}} />);

    const button = screen.getByRole('button', {name: 'Clear Search'});
    const tooltip = screen.getByRole('tooltip', {hidden: true});
    expect(tooltip).toHaveTextContent(/^Clear Search$/);
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);

    fireEvent.mouseEnter(button);
    await waitFor(() => expect(showPopover).toHaveBeenCalled());
    showPopover.mockRestore();
  });

  it('renders a real button with the given accessible label', () => {
    render(<InputClearButton label="Clear" onClick={() => {}} />);
    const button = screen.getByRole('button', {name: 'Clear'});
    expect(button.tagName).toBe('BUTTON');
  });

  it('renders no visible text so the button stays icon-only', () => {
    // `label` is the accessible name only: Button's isIconOnly drops the
    // visible label span, so the affordance keeps its square glyph footprint.
    render(<InputClearButton label="Clear" onClick={() => {}} />);
    expect(screen.getByRole('button', {name: 'Clear'}).textContent).toBe('');
  });

  it('fires onClick with the native event when pressed', () => {
    const onClick = vi.fn();
    render(<InputClearButton label="Clear" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', {name: 'Clear'}));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toMatchObject({type: 'click'});
  });

  it('renders the solo-input-clear-icon target on the glyph', () => {
    // One canonical target on the icon element itself — so a theme restyles
    // the clear glyph across the whole input family from a single place.
    render(<InputClearButton label="Clear" onClick={() => {}} />);
    const glyph = getGlyph();
    expect(glyph).toHaveClass('solo-input-clear-icon');
    expect(glyph).toHaveClass('solo-icon');
  });

  it('matches a standalone inherit/sm close icon aside from the target class', () => {
    // The glyph is a secondary/sm close icon (matching the other field
    // affordances — chevrons, calendar toggles, status icons); aside from the
    // target class it is exactly that standalone Icon, so the default look is
    // defined once here rather than per input.
    render(<InputClearButton label="Clear" onClick={() => {}} />);
    const glyph = getGlyph();

    const {container} = render(
      <Icon icon="close" size="sm" color="secondary" />,
    );
    const refIcon = container.querySelector('.solo-icon') as HTMLElement;

    const styleClasses = (el: HTMLElement) =>
      el.className
        .split(' ')
        .filter(c => c !== 'solo-input-clear-icon')
        .sort();

    expect(styleClasses(glyph)).toEqual(styleClasses(refIcon));
  });

  it('hides the glyph from assistive tech so the label is the whole name', () => {
    // The Icon carries no label of its own, so it stays decorative and never
    // duplicates or dilutes the button's announcement.
    render(<InputClearButton label="Clear" onClick={() => {}} />);
    expect(getGlyph()).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button')).toHaveAccessibleName('Clear');
  });

  it('merges an extra iconClassName beside the canonical target', () => {
    // Consumers that shipped a component-specific target before the family
    // converged pass it through here to keep emitting it for a deprecation
    // window.
    render(
      <InputClearButton
        label="Clear"
        onClick={() => {}}
        iconClassName="solo-date-input-clear-icon"
      />,
    );
    const glyph = getGlyph();
    expect(glyph).toHaveClass('solo-input-clear-icon');
    expect(glyph).toHaveClass('solo-date-input-clear-icon');
  });

  it('exposes input-clear-icon so a theme reaches the glyph color, size, and hover', () => {
    const theme = defineTheme({
      name: 'input-clear-icon-test',
      components: {
        'input-clear-icon': {
          base: {
            width: '12px',
            height: '12px',
            fontSize: '12px',
            color: 'var(--color-icon-secondary)',
            ':hover': {color: 'var(--color-icon-primary)'},
          },
        },
      },
    });
    const css = generateThemeTestCSS(theme);
    expect(css).toContain('.solo-input-clear-icon {');
    expect(css).toContain('width: 12px');
    expect(css).toContain('.solo-input-clear-icon:hover');
    expect(css).toContain('color: var(--color-icon-primary)');
  });

  it('renders the solo-input-clear-button target on the button wrapper', () => {
    render(<InputClearButton label="Clear" onClick={() => {}} />);
    const button = screen.getByRole('button', {name: 'Clear'});
    expect(button).toHaveClass('solo-input-clear-button');
  });

  it('keeps its own 20px height when no className is given', () => {
    // The button pins a 20px box of its own (tighter than Button's sm
    // default); the coarse-pointer overlay below grows the hit area from it.
    render(<InputClearButton label="Clear" onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-[20px]');
    expect(button).not.toHaveClass('h-(--size-element-sm)');
  });

  it('applies the caller className to the button', () => {
    render(
      <InputClearButton
        label="Clear"
        onClick={() => {}}
        className="w-[999px]"
      />,
    );
    expect(screen.getByRole('button')).toHaveClass('w-[999px]');
  });

  it('grows the hit area to 24px on a coarse pointer only (WCAG 2.5.8 AA)', () => {
    // The visual glyph stays 20px; an ::after overlay expands only the
    // tappable region, and only under a coarse pointer. Asserted against the
    // classes, because jsdom resolves neither media queries nor
    // pseudo-element boxes.
    render(<InputClearButton label="Clear" onClick={() => {}} />);
    const button = screen.getByRole('button', {name: 'Clear'});
    const classes = [...button.classList];

    // Fine pointer: hit area == the 20px visual glyph, no expansion.
    expect(button).toHaveClass('[--_input-clear-hit-inset:0px]');
    // Coarse pointer: 20px + 2px on each side = 24x24, the AA floor.
    expect(button).toHaveClass(
      'pointer-coarse:[--_input-clear-hit-inset:-2px]',
    );
    // ...and nothing wider than that, which would reach into the adornment
    // gap and the input's caret area.
    expect(
      classes.some(c => /--_input-clear-hit-inset:-(?:[3-9]|\d{2,})px/.test(c)),
    ).toBe(false);
    // The overlay exists only on touch. On a fine pointer a generated
    // ::after would cover the button and take hover away from the glyph
    // target, so `content` is gated the same way the inset is.
    expect(button).toHaveClass('[--_input-clear-hit-content:none]');
    expect(button).toHaveClass(
      "pointer-coarse:[--_input-clear-hit-content:'']",
    );
    // The overlay itself is what carries the expansion, and what is gated.
    expect(button).toHaveClass('after:[inset:var(--_input-clear-hit-inset)]');
    expect(button).toHaveClass('after:content-(--_input-clear-hit-content)');
  });

  it('declares its own containing block for the hit overlay', () => {
    // The ::after overlay must resolve against this button. Button happens to
    // set `position: relative` on itself, so at runtime the overlay is
    // correctly placed either way — and the merged class list cannot tell the
    // two apart. Assert on the source instead, so a future edit can't quietly
    // leave the overlay depending on another component's internal.
    const source = readFileSync(
      path.resolve(__dirname, './InputClearButton.tsx'),
      'utf-8',
    );
    const buttonStyle = source.match(/button:\s*cn\([\s\S]*?\n {2}\),/)?.[0];
    expect(buttonStyle).toBeDefined();
    expect(buttonStyle).toMatch(/['"]relative['"]/);
  });

  it('exposes input-clear-button so a theme controls the button size and hover', () => {
    const theme = defineTheme({
      name: 'input-clear-button-test',
      components: {
        'input-clear-button': {
          base: {
            height: '28px',
            ':hover': {backgroundImage: 'none'},
          },
        },
      },
    });
    const css = generateThemeTestCSS(theme);
    expect(css).toContain('.solo-input-clear-button {');
    expect(css).toContain('height: 28px');
    expect(css).toContain('.solo-input-clear-button:hover');
    expect(css).toContain('background-image: none');
  });
});

describe('InputClearButton glyph source', () => {
  afterEach(() => {
    resetIcons();
  });

  it('renders the close glyph from the global icon registry', () => {
    // The glyph is resolved by name, so a consumer that swaps the icon set via
    // registerIcons() gets its own close glyph in every clearable input.
    registerIcons({
      close: (
        <svg data-testid="custom-close">
          <path d="M0 0" />
        </svg>
      ),
    });
    render(<InputClearButton label="Clear" onClick={() => {}} />);
    expect(getGlyph()).toContainElement(screen.getByTestId('custom-close'));
  });
});

describe('InputClearButton pointer and focus interactions', () => {
  it('prevents default on pointerdown and mousedown to keep focus on input', () => {
    render(<InputClearButton label="Clear" onClick={() => {}} />);
    const button = screen.getByRole('button', {name: 'Clear'});

    const pointerDownEvent = fireEvent.pointerDown(button);
    expect(pointerDownEvent).toBe(false);

    const mouseDownEvent = fireEvent.mouseDown(button);
    expect(mouseDownEvent).toBe(false);
  });

  it('composes custom onPointerDown while preventing default in InternalInputClearButton', () => {
    const handlePointerDown = vi.fn();
    render(
      <InternalInputClearButton
        label="Clear"
        onClick={() => {}}
        onPointerDown={handlePointerDown}
        onClickCapture={() => {}}
      />,
    );
    const button = screen.getByRole('button', {name: 'Clear'});
    const pointerDownEvent = fireEvent.pointerDown(button);

    expect(handlePointerDown).toHaveBeenCalledTimes(1);
    expect(pointerDownEvent).toBe(false);
  });
});
