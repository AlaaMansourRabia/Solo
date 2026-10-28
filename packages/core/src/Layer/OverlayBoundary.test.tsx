/**
 * @file OverlayBoundary.test.tsx
 * @input Uses vitest, @testing-library/react, OverlayBoundary, MobileNav
 * @output Verifies the boundary rectangle reaches full-screen overlays, and
 *   that overlays outside a boundary keep covering the window
 */

import {afterEach, beforeAll, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {OverlayBoundary, useOverlayBoundary} from './OverlayBoundary';
import {MobileNav} from '../MobileNav';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal =
    HTMLDialogElement.prototype.showModal ||
    function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
  HTMLDialogElement.prototype.close =
    HTMLDialogElement.prototype.close ||
    function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    };
});

afterEach(() => {
  vi.restoreAllMocks();
});

/** Every element reports the phone-frame rectangle. */
function mockFrameRect() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 28,
    left: 525,
    width: 390,
    height: 844,
    right: 915,
    bottom: 872,
    x: 525,
    y: 28,
    toJSON: () => ({}),
  } as DOMRect);
}

function Probe({isActive = true}: {isActive?: boolean}) {
  const {isBounded, style} = useOverlayBoundary(isActive);
  return (
    <output data-testid="probe">{JSON.stringify({isBounded, style})}</output>
  );
}

const read = () => JSON.parse(screen.getByTestId('probe').textContent ?? '{}');

describe('useOverlayBoundary', () => {
  it('is unbounded outside an OverlayBoundary', () => {
    render(<Probe />);
    expect(read()).toEqual({isBounded: false});
  });

  it('returns the boundary rectangle as a fixed placement inside one', () => {
    mockFrameRect();
    render(
      <OverlayBoundary>
        <Probe />
      </OverlayBoundary>,
    );
    expect(read()).toMatchObject({
      isBounded: true,
      style: {top: 28, left: 525, width: 390, height: 844, overflow: 'clip'},
    });
  });

  it('does not measure while inactive', () => {
    mockFrameRect();
    render(
      <OverlayBoundary>
        <Probe isActive={false} />
      </OverlayBoundary>,
    );
    expect(read()).toEqual({isBounded: true});
  });
});

describe('MobileNav inside an OverlayBoundary', () => {
  it('sizes its dialog to the boundary and paints the scrim inside it', () => {
    mockFrameRect();
    render(
      <OverlayBoundary>
        <MobileNav isOpen onOpenChange={() => {}} header="Menu">
          <a href="/settings">Settings</a>
        </MobileNav>
      </OverlayBoundary>,
    );
    const dialog = screen.getByRole('dialog', {hidden: true});
    expect(dialog.style.top).toBe('28px');
    expect(dialog.style.left).toBe('525px');
    expect(dialog.style.width).toBe('390px');
    expect(dialog.style.height).toBe('844px');
    expect(dialog.className).toContain('backdrop:bg-transparent');
    expect(dialog.className).toContain('bg-(--color-overlay)');
  });

  it('still covers the window without a boundary', () => {
    render(
      <MobileNav isOpen onOpenChange={() => {}} header="Menu">
        <a href="/settings">Settings</a>
      </MobileNav>,
    );
    const dialog = screen.getByRole('dialog', {hidden: true});
    expect(dialog.style.top).toBe('');
    expect(dialog.className).not.toContain('backdrop:bg-transparent');
  });
});
