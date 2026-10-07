/**
 * @file overlayPaddingReset.test.tsx
 * @input Uses vitest, @testing-library/react, overlay components from core
 * @output Tests that overlay roots stop the container padding system at their
 *   boundary, and that the public theme token still crosses it
 * @position Layout tests; validates overlayPaddingReset in padding.styles.ts
 *
 * The container padding system talks to descendants through INHERITED custom
 * properties, but an overlay leaves its parent's visual box while staying a DOM
 * descendant of it. Every overlay root therefore has to stop those values (without
 * that, a Section in a 640px sheet rendered 672px wide).
 *
 * jsdom does no layout and tests run without compiled CSS, so these assert
 * that each overlay root carries the reset's classes — the declarations the
 * layout is computed from. The widths they stand in for are
 * verified in a browser; see the PR description.
 *
 * SYNC: When an overlay is added, add it to OVERLAYS below.
 */

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {render, screen} from '@testing-library/react';
import type {ReactNode} from 'react';
import {Dialog} from '../Dialog';
import {BottomSheet} from '../BottomSheet';
import {MobileNav} from '../MobileNav';
import {Lightbox} from '../Lightbox';
import {Popover} from '../Popover';
import {Section} from '../Section';
import {overlayPaddingReset} from './padding.styles';

// jsdom implements neither the <dialog> methods nor matchMedia.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.show = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/**
 * Values descendants SUBTRACT (bleed margins). The overlay root has no padding
 * of its own to escape, so these must be a literal zero.
 */
const SUBTRACTED = [
  '[--container-padding-inline-start:0px]',
  '[--container-padding-inline-end:0px]',
  '[--container-padding-block-start:0px]',
  '[--container-padding-block-end:0px]',
];

/**
 * Values descendants ADD. These must be guaranteed-invalid (`initial`) rather
 * than zero, so readers fall through to their own default instead of losing
 * their padding.
 */
const CLEARED = [
  '[--layout-padding-outer-x:initial]',
  '[--layout-padding-outer-y:initial]',
  '[--layout-padding-inner-x:initial]',
  '[--layout-padding-inner-y:initial]',
  '[--_section-padding-propagated:initial]',
];

/** Each overlay, rendered open inside a page Section that leaks 40px. */
const OVERLAYS: {
  name: string;
  render: (child: ReactNode) => ReactNode;
  root: () => HTMLElement;
}[] = [
  {
    name: 'Dialog',
    render: child => (
      <Dialog isOpen onOpenChange={() => {}}>
        {child}
      </Dialog>
    ),
    root: () => screen.getByRole('dialog'),
  },
  {
    name: 'BottomSheet',
    render: child => (
      <BottomSheet isOpen onOpenChange={() => {}} label="S">
        {child}
      </BottomSheet>
    ),
    root: () =>
      document.querySelector<HTMLElement>(
        '.solo-bottom-sheet',
      ) as HTMLElement,
  },
  {
    name: 'MobileNav',
    render: child => (
      <MobileNav isOpen onOpenChange={() => {}} label="N">
        {child}
      </MobileNav>
    ),
    root: () => screen.getByRole('dialog'),
  },
  {
    name: 'Lightbox',
    render: () => (
      <Lightbox
        isOpen
        onOpenChange={() => {}}
        media={{src: 'a.png', alt: 'a'}}
      />
    ),
    root: () => screen.getByRole('dialog'),
  },
  {
    name: 'Popover (useLayer surface)',
    render: child => (
      <Popover isOpen onOpenChange={() => {}} label="P" content={child}>
        <button type="button">t</button>
      </Popover>
    ),
    root: () => document.querySelector<HTMLElement>('[popover]') as HTMLElement,
  },
];

describe('overlayPaddingReset', () => {
  describe.each(OVERLAYS)('$name', ({render: renderOverlay, root}) => {
    it('zeroes the values descendants subtract', () => {
      render(<Section padding={10}>{renderOverlay(<div>c</div>)}</Section>);
      expect(root()).toHaveClass(...SUBTRACTED);
    });

    it('clears the values descendants add, so they fall to their default', () => {
      render(<Section padding={10}>{renderOverlay(<div>c</div>)}</Section>);
      expect(root()).toHaveClass(...CLEARED);
    });
  });

  it('does not clear the public theme token', () => {
    // The reset clears the PRIVATE propagation var only. The public
    // `--solo-section-padding` is theme surface, set once at the theme root,
    // so it has to keep reaching inside every overlay — clearing it would
    // blank a theme's section padding in every dialog. That is the whole
    // reason the two names were split, and it is the mistake a later
    // "simplification" would most plausibly make.
    //
    // jsdom does not inherit custom properties, so the cascade cannot show
    // this; assert it where it is decided instead. (Verified in a browser: a
    // theme's 20px still reaches a Section inside a Dialog nested under a
    // 40px page Section.)
    const source = readFileSync(join(__dirname, 'padding.styles.ts'), 'utf8');
    const reset = source.slice(
      source.indexOf('export const overlayPaddingReset'),
    );
    expect(reset).toContain('[--_section-padding-propagated:initial]');
    expect(reset).not.toContain('--solo-section-padding');
    expect(overlayPaddingReset.reset).not.toContain('--solo-section-padding');
  });

  it("stops an ancestor Section's propagated padding at the boundary", () => {
    // The page Section propagates 40px. Without the reset it would reach the
    // Section inside the overlay, which would pad itself 40px instead of the
    // theme default.
    render(
      <Section padding={10}>
        <Dialog isOpen onOpenChange={() => {}}>
          <div data-testid="content">c</div>
        </Dialog>
      </Section>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('[--_section-padding-propagated:initial]');
    // ...while the page Section outside the overlay still propagates it.
    const pageSection = document.querySelector<HTMLElement>('.solo-section');
    expect(pageSection).toHaveClass(
      '[--_section-padding-propagated:var(--spacing-10)]',
    );
  });
});
