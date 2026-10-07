/**
 * @file BottomSheetPanel.test.tsx
 * @input Uses vitest, Testing Library, BottomSheetPanel
 * @output Tests the shared sheet surface motion and keyboard scroll contracts
 * @position Internal presentation tests shared by standalone and switcher modes
 */

import {act, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {
  BottomSheetPanel,
  type BottomSheetPanelMotion,
  type BottomSheetPanelState,
} from './BottomSheetPanel';

const panelTransitionStyle = {
  transitionProperty: 'transform, opacity',
  transitionDuration: '410ms',
  transitionDelay: '0ms',
};

beforeEach(() => {
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

function renderPanel(
  state: BottomSheetPanelState,
  callbacks: {
    onMotionStart?: (motion: BottomSheetPanelMotion) => void;
    onMotionComplete?: (motion: BottomSheetPanelMotion) => void;
  } = {},
) {
  return render(
    <BottomSheetPanel
      label="Sheet details"
      state={state}
      height="hug"
      style={panelTransitionStyle}
      onDismiss={() => {}}
      onScrimOpacity={() => {}}
      onMotionStart={callbacks.onMotionStart}
      onMotionComplete={callbacks.onMotionComplete}>
      Panel content
    </BottomSheetPanel>,
  );
}

function getPanel(): HTMLElement {
  const panel = screen
    .getByText('Panel content')
    .closest<HTMLElement>('.solo-bottom-sheet');
  if (panel == null) {
    throw new Error('BottomSheetPanel surface not found');
  }
  return panel;
}

describe('BottomSheetPanel', () => {
  it('reports entrance completion only for the surface transform', () => {
    const onMotionStart = vi.fn();
    const onMotionComplete = vi.fn();
    renderPanel(
      {kind: 'open', entering: true},
      {onMotionStart, onMotionComplete},
    );

    expect(onMotionStart).toHaveBeenCalledWith('entering');
    fireEvent.transitionEnd(getPanel(), {propertyName: 'opacity'});
    expect(onMotionComplete).not.toHaveBeenCalled();
    fireEvent.transitionEnd(getPanel(), {propertyName: 'transform'});
    expect(onMotionComplete).toHaveBeenCalledWith('entering');
  });

  it('completes a retained-sheet reactivation without waiting for a new entrance', () => {
    const onMotionComplete = vi.fn();
    const {rerender} = render(
      <BottomSheetPanel
        label="Sheet details"
        state={{kind: 'retained', motion: 'covered', alignmentOffset: 0}}
        height="hug"
        style={panelTransitionStyle}
        onDismiss={() => {}}
        onScrimOpacity={() => {}}
        onMotionComplete={onMotionComplete}>
        Panel content
      </BottomSheetPanel>,
    );

    rerender(
      <BottomSheetPanel
        label="Sheet details"
        state={{kind: 'open', entering: true}}
        height="hug"
        style={panelTransitionStyle}
        onDismiss={() => {}}
        onScrimOpacity={() => {}}
        onMotionComplete={onMotionComplete}>
        Panel content
      </BottomSheetPanel>,
    );

    expect(onMotionComplete).toHaveBeenCalledWith('entering');
  });

  it('applies the switcher alignment offset to a retained surface', () => {
    renderPanel({
      kind: 'retained',
      motion: 'aligning',
      alignmentOffset: 120,
    });

    expect(getPanel()).toHaveStyle({transform: 'translateY(120px)'});
  });

  it('maps exit and fade completion to their respective CSS properties', () => {
    const onMotionComplete = vi.fn();
    const {rerender} = renderPanel(
      {kind: 'retained', motion: 'fading', alignmentOffset: 0},
      {onMotionComplete},
    );

    fireEvent.transitionEnd(getPanel(), {propertyName: 'opacity'});
    expect(onMotionComplete).toHaveBeenLastCalledWith('fading');

    rerender(
      <BottomSheetPanel
        label="Sheet details"
        state={{kind: 'exiting'}}
        height="hug"
        style={panelTransitionStyle}
        onDismiss={() => {}}
        onScrimOpacity={() => {}}
        onMotionComplete={onMotionComplete}>
        Panel content
      </BottomSheetPanel>,
    );
    fireEvent.transitionEnd(getPanel(), {propertyName: 'transform'});
    expect(onMotionComplete).toHaveBeenLastCalledWith('exiting');
  });

  it('completes immediately when the rendered transition is disabled', () => {
    vi.mocked(matchMedia).mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    const onMotionComplete = vi.fn();
    render(
      <BottomSheetPanel
        label="Sheet details"
        state={{kind: 'open', entering: true}}
        height="hug"
        onDismiss={() => {}}
        onScrimOpacity={() => {}}
        onMotionComplete={onMotionComplete}>
        Panel content
      </BottomSheetPanel>,
    );

    expect(onMotionComplete).toHaveBeenCalledWith('entering');
  });

  it('derives its transition backstop from the rendered timing', () => {
    vi.useFakeTimers();
    try {
      const onMotionComplete = vi.fn();
      render(
        <BottomSheetPanel
          label="Sheet details"
          state={{kind: 'open', entering: true}}
          height="hug"
          style={{
            transitionProperty: 'transform, opacity',
            transitionDuration: '0.5s, 200ms',
            transitionDelay: '100ms, 0ms',
          }}
          onDismiss={() => {}}
          onScrimOpacity={() => {}}
          onMotionComplete={onMotionComplete}>
          Panel content
        </BottomSheetPanel>,
      );

      void act(() => vi.advanceTimersByTime(649));
      expect(onMotionComplete).not.toHaveBeenCalled();
      void act(() => vi.advanceTimersByTime(1));
      expect(onMotionComplete).toHaveBeenCalledWith('entering');
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not detach a stable public ref during an ordinary rerender', () => {
    const panelRef = vi.fn();
    const {rerender, unmount} = render(
      <BottomSheetPanel
        label="Sheet details"
        ref={panelRef}
        state={{kind: 'open', entering: false}}
        height="hug"
        onDismiss={() => {}}
        onScrimOpacity={() => {}}>
        First render
      </BottomSheetPanel>,
    );

    expect(panelRef).toHaveBeenCalledTimes(1);
    rerender(
      <BottomSheetPanel
        label="Sheet details"
        ref={panelRef}
        state={{kind: 'open', entering: false}}
        height="hug"
        onDismiss={() => {}}
        onScrimOpacity={() => {}}>
        Second render
      </BottomSheetPanel>,
    );
    expect(panelRef).toHaveBeenCalledTimes(1);

    unmount();
    expect(panelRef).toHaveBeenLastCalledWith(null);
    expect(panelRef).toHaveBeenCalledTimes(2);
  });

  it('floats the handle bar over content that starts at the sheet top edge', () => {
    renderPanel({kind: 'open', entering: false});

    const bar = getPanel().querySelector<HTMLElement>(
      'div[aria-hidden="true"]',
    );
    if (bar == null) {
      throw new Error('handle bar not found');
    }
    const body = bar.nextElementSibling as HTMLElement;

    // Out of flow: the bar costs the content no layout space. That is the
    // point of it -- the content sits closer to the sheet's top edge, and
    // scrolled content passes beneath the pill rather than stopping at a
    // hard edge.
    expect(bar).toHaveClass('absolute');

    // So the body must not reserve room for it. A top padding here would
    // push the content back down and undo the change.
    expect(getComputedStyle(body).paddingTop).toBe('');
  });

  // The pill is only legible over the content riding up beneath it because
  // the bar carries a backdrop; without it, text runs straight through the
  // pill. jsdom compiles no CSS, so assert on the classes.
  it('backs the floating handle bar with a surface gradient', () => {
    renderPanel({kind: 'open', entering: false});
    const bar = getPanel().querySelector<HTMLElement>(
      'div[aria-hidden="true"]',
    );
    expect(bar).toHaveClass(
      'absolute',
      '[background-image:linear-gradient(to_bottom,var(--color-background-surface)_60%,transparent)]',
    );
  });

  // In dark mode the surface fill and the scrim sit a few RGB steps apart and
  // the drop shadow is black on near-black, so the fill alone leaves the
  // sheet's left and right edges invisible against the scrim. A hairline on
  // the scrim-facing edges is what draws them. Asserted on the classes for the
  // same reason as the test above.
  it('draws a hairline on the three edges that face the scrim', () => {
    renderPanel({kind: 'open', entering: false});
    const sheet = getPanel();
    for (const edge of ['block-start', 'inline-start', 'inline-end']) {
      expect(sheet).toHaveClass(
        `[border-${edge}-width:var(--border-width)]`,
        `[border-${edge}-style:solid]`,
        `[border-${edge}-color:var(--color-border)]`,
      );
    }
    // The block-end edge sits below the viewport, under the overscroll
    // padding, so it carries no hairline to draw.
    expect(sheet.className).not.toContain('border-block-end');
  });

  // A theme that packs an inset ring into --shadow-high (the bundled themes all
  // add one in dark mode) draws it just inside the sheet, where an opaque
  // content wrapper such as Section paints over it -- so it showed only in the
  // gap below the content and the side edges appeared to change width partway
  // down. The scrolling body paints the surface across the whole inner box to
  // hide the ring evenly.
  it('paints the surface across the scrolling body so the edge stays uniform', () => {
    renderPanel({kind: 'open', entering: false});
    const bar = getPanel().querySelector<HTMLElement>(
      'div[aria-hidden="true"]',
    );
    const body = bar?.nextElementSibling;
    expect(body).toHaveClass('bg-(--color-background-surface)');
  });

  /**
   * The exit is not the entrance played backwards.
   *
   * `--ease-standard` is a decelerate curve: on it the sheet was half gone in
   * 59ms of a 410ms transition and 90% gone in 163ms, so the close was over
   * before it could be seen. The closing state therefore carries its own
   * accelerating curve, and only the closing state does.
   */
  it('closes on an accelerating curve of its own, not the entrance timing', () => {
    const {container: closing} = render(
      <BottomSheetPanel
        label="Sheet details"
        state={{kind: 'exiting'}}
        height="hug"
        onDismiss={() => {}}
        onScrimOpacity={() => {}}>
        Panel content
      </BottomSheetPanel>,
    );
    const closingSheet = closing.querySelector('.solo-bottom-sheet');
    // An accelerating curve: no vertical rise at the start (y1 = 0), so the
    // travel lands inside the duration instead of ahead of it.
    expect(closingSheet).toHaveClass(
      '[transition-timing-function:cubic-bezier(0.3,0,0.6,0.6)]',
    );
    expect(closingSheet).not.toHaveClass(
      '[transition-timing-function:var(--ease-standard)]',
    );

    const {container: resting} = render(
      <BottomSheetPanel
        label="Sheet details"
        state={{kind: 'open', entering: false}}
        height="hug"
        onDismiss={() => {}}
        onScrimOpacity={() => {}}>
        Panel content
      </BottomSheetPanel>,
    );
    const restingSheet = resting.querySelector('.solo-bottom-sheet');
    expect(restingSheet).toHaveClass(
      '[transition-timing-function:var(--ease-standard)]',
    );
    expect(restingSheet?.className).not.toContain('cubic-bezier(0.3,0,0.6,0.6)');
  });

});
