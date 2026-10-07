/**
 * @file BottomSheetEdgeTint.test.tsx
 * @input Uses vitest, @testing-library/react, BottomSheet, BottomSheetSwitcher
 * @output Tests which sheets carry the iOS Safari bottom edge tint, and pins
 *   the declarations WebKit's edge sampler reads
 * @position Core testing; validates BottomSheetEdgeTint.tsx and its two hosts
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/BottomSheet/BottomSheetEdgeTint.tsx
 */

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render} from '@testing-library/react';
import {BottomSheet} from './BottomSheet';
import {BottomSheetSwitcher} from './BottomSheetSwitcher';

// jsdom doesn't implement <dialog> open/close or pointer capture; stub them.
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
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = vi.fn();
    Element.prototype.releasePointerCapture = vi.fn();
  }
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
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }),
  );
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function tints(): ReadonlyArray<Element> {
  return Array.from(document.querySelectorAll('[data-sheet-edge-tint]'));
}

/** The rendered tint of an open non-modal sheet. */
function renderTint(): Element {
  render(
    <BottomSheet
      isOpen
      onOpenChange={() => {}}
      hasScrim={false}
      label="Place details">
      Content
    </BottomSheet>,
  );
  const [tint] = tints();
  expect(tint).toBeDefined();
  return tint!;
}

describe('BottomSheetEdgeTint', () => {
  it('gives a non-modal sheet an edge tint to colour the iOS toolbar strip', () => {
    render(
      <BottomSheet
        isOpen
        onOpenChange={() => {}}
        hasScrim={false}
        label="Place details">
        Content
      </BottomSheet>,
    );
    expect(tints()).toHaveLength(1);
  });

  it('gives a modal sheet the same surface-coloured edge tint', () => {
    render(
      <BottomSheet isOpen onOpenChange={() => {}} label="Place details">
        Content
      </BottomSheet>,
    );
    expect(tints()).toHaveLength(1);
  });

  it('renders the tint inside the dialog, so it unmounts with the sheet', () => {
    const {rerender} = render(
      <BottomSheet
        isOpen
        onOpenChange={() => {}}
        hasScrim={false}
        label="Place details">
        Content
      </BottomSheet>,
    );
    const [tint] = tints();
    expect(tint?.closest('dialog')).not.toBeNull();

    rerender(<div />);
    expect(tints()).toHaveLength(0);
  });

  // The switcher owns one shared dialog for the whole flow, so the tint
  // belongs to that dialog and must not be minted per child sheet.
  it('gives a non-modal switcher flow exactly one tint', () => {
    render(
      <BottomSheetSwitcher
        activeSheet="comment"
        hasScrim={false}
        onActiveSheetChange={() => {}}>
        <BottomSheet sheetId="comment" label="Add a comment">
          Comment
        </BottomSheet>
        <BottomSheet sheetId="confirmation" label="Confirmation">
          Confirmation
        </BottomSheet>
      </BottomSheetSwitcher>,
    );
    expect(tints()).toHaveLength(1);
  });

  it('gives a modal switcher flow exactly one tint', () => {
    render(
      <BottomSheetSwitcher activeSheet="comment" onActiveSheetChange={() => {}}>
        <BottomSheet sheetId="comment" label="Add a comment">
          Comment
        </BottomSheet>
      </BottomSheetSwitcher>,
    );
    expect(tints()).toHaveLength(1);
  });

  it('keeps the tint out of the accessibility tree and out of hit testing', async () => {
    render(
      <BottomSheet
        isOpen
        onOpenChange={() => {}}
        hasScrim={false}
        label="Place details">
        Content
      </BottomSheet>,
    );
    const [tint] = tints();
    expect(tint?.getAttribute('aria-hidden')).toBe('true');
    expect(tint?.textContent).toBe('');
    expect(tint).toHaveClass('pointer-events-none');
  });

  // Every declaration below is load-bearing for a heuristic that lives in
  // WebKit, not in this repo, and none of it is observable in jsdom or in any
  // engine without retractable browser chrome — so it is asserted on the
  // classes, the way BottomSheetPanel pins its handle gradient.
  describe('the declarations WebKit samples', () => {
    it('is fixed and flush with the bottom edge of the viewport', () => {
      const tint = renderTint();
      // Only a fixed or sticky box is a candidate, and only a box flush with
      // the edge is the one Safari hit tests.
      expect(tint).toHaveClass('fixed', '[inset-block-end:0]', 'inset-x-0');
    });

    it('clears the 10px floor below which WebKit ignores the declared colour', () => {
      const height = Array.from(renderTint().classList)
        .map(c => /^h-\[(\d+)px\]$/.exec(c))
        .find(match => match != null);
      expect(height).toBeDefined();
      expect(Number(height![1])).toBeGreaterThan(10);
    });

    it('declares the sheet surface colour, so the strip matches the sheet', () => {
      expect(renderTint()).toHaveClass('bg-(--color-background-surface)');
    });

    // visibility: hidden, display: none and a low opacity all disqualify the
    // element from sampling. A mask does not, which is the only reason the
    // strip can be both readable by Safari and invisible to the user.
    it('hides itself with a mask rather than with visibility or opacity', () => {
      const tint = renderTint();
      expect(tint).toHaveClass(
        '[mask-image:linear-gradient(transparent,transparent)]',
        '[-webkit-mask-image:linear-gradient(transparent,transparent)]',
      );
      const classes = tint.className;
      expect(classes).not.toMatch(/invisible|visibility/);
      expect(classes).not.toContain('opacity');
      expect(classes).not.toMatch(/(^|\s)hidden(\s|$)/);
    });
  });
});
