import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollableArea } from "./ScrollableArea";
import { containerPaddingInlineEndVarStyles } from "../Layout/padding.styles";

function setGeometry(
  element: HTMLElement,
  values: Partial<
    Pick<
      HTMLElement,
      "clientWidth" | "clientHeight" | "scrollWidth" | "scrollHeight"
    >
  >,
) {
  for (const [key, value] of Object.entries(values)) {
    Object.defineProperty(element, key, {
      configurable: true,
      value,
      writable: true,
    });
  }
}

describe("ScrollableArea", () => {
  let frames: FrameRequestCallback[];

  beforeEach(() => {
    frames = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback);
        return frames.length;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal(
      "ResizeObserver",
      vi.fn(function () {
        return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
      }),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  function flushFrame() {
    void act(() => {
      const pending = frames.splice(0);
      pending.forEach((callback) => callback(performance.now()));
    });
  }

  it("renders one native viewport and one real content box", () => {
    render(
      <ScrollableArea label="Messages" data-testid="viewport">
        <p>Message history</p>
      </ScrollableArea>,
    );

    const viewport = screen.getByTestId("viewport");
    expect(viewport).toHaveAccessibleName("Messages");
    expect(viewport).toHaveAttribute("role", "group");
    expect(viewport).toHaveAttribute("data-scroll-axis", "block");
    expect(viewport).not.toHaveAttribute("tabindex");
    expect(viewport.children).toHaveLength(1);
    expect(viewport.firstElementChild).toHaveAttribute("data-scroll-content");
    expect(viewport).toHaveTextContent("Message history");
  });

  it("becomes keyboard reachable only when the requested axis is effective", () => {
    render(
      <ScrollableArea
        axis="block"
        label="Messages"
        data-testid="viewport"
        style={{ height: 100 }}
      >
        <p>Message history</p>
      </ScrollableArea>,
    );
    const viewport = screen.getByTestId("viewport");
    // jsdom compiles no CSS, so the overflow classes do nothing. Mirror their
    // values inline so this integration test can exercise measurement.
    viewport.style.overflowX = "hidden";
    viewport.style.overflowY = "auto";
    setGeometry(viewport, {
      clientWidth: 100,
      clientHeight: 100,
      scrollWidth: 100,
      scrollHeight: 180,
    });

    void act(() => viewport.dispatchEvent(new Event("scroll")));
    flushFrame();
    expect(viewport).toHaveAttribute("tabindex", "0");
    expect(viewport).toHaveAttribute("data-scrollable-block", "true");

    setGeometry(viewport, { scrollHeight: 100 });
    viewport.focus();
    void act(() => viewport.dispatchEvent(new Event("scroll")));
    flushFrame();
    expect(viewport).toHaveAttribute("tabindex", "-1");
    expect(document.activeElement).toBe(viewport);
  });

  it("keeps viewport props, styles, class names, events, and refs", () => {
    const onClick = vi.fn();
    const ref = vi.fn();
    render(
      <ScrollableArea
        label="Results"
        role="region"
        ref={ref}
        onClick={onClick}
        className="consumer-class"
        style={{ maxHeight: 200 }}
        data-testid="viewport"
      >
        Results
      </ScrollableArea>,
    );

    const viewport = screen.getByTestId("viewport");
    viewport.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref).toHaveBeenCalledWith(viewport);
    expect(viewport).toHaveClass("solo-scrollable-area", "consumer-class");
    expect(viewport.style.maxHeight).toBe("200px");
    expect(viewport).toHaveAttribute("role", "region");
  });

  it("reflects logical axis and chaining intent without containing a fitting area", () => {
    render(
      <ScrollableArea
        axis="both"
        label="Canvas"
        overscroll="contain"
        data-testid="viewport"
      >
        Canvas
      </ScrollableArea>,
    );
    const viewport = screen.getByTestId("viewport");
    expect(viewport).toHaveAttribute("data-axis", "both");
    expect(viewport).toHaveAttribute("data-scroll-axis", "both");
    expect(viewport.style.overscrollBehaviorX).toBe("auto");
    expect(viewport.style.overscrollBehaviorY).toBe("auto");
  });

  it("keeps logical overflow and content sizing for writing-mode changes", () => {
    const { rerender } = render(
      <ScrollableArea axis="inline" label="Timeline" data-testid="viewport">
        Timeline
      </ScrollableArea>,
    );
    const viewport = screen.getByTestId("viewport");
    const content = viewport.firstElementChild as HTMLElement;
    expect(viewport).toHaveAttribute('data-axis', 'inline');
    expect(viewport.style.overflowInline).toBe("");
    expect(viewport.style.overflowBlock).toBe("");
    const inlineContentClass = content.className;
    expect(content.style.inlineSize).toBe("");
    expect(content.style.minInlineSize).toBe("");

    rerender(
      <ScrollableArea axis="block" label="Timeline" data-testid="viewport">
        Timeline
      </ScrollableArea>,
    );
    // The axis is reflected on the theming attribute (the bare `inline` /
    // `block` value classes are not emitted — they are Tailwind utilities).
    expect(viewport).toHaveAttribute('data-axis', 'block');
    expect(viewport.style.overflowInline).toBe("");
    expect(viewport.style.overflowBlock).toBe("");
    expect(content.className).not.toBe(inlineContentClass);
    expect(content.style.inlineSize).toBe("");
    expect(content).toHaveClass("[min-inline-size:100%]");
    expect(content).not.toHaveClass("[inline-size:max-content]");
    expect(inlineContentClass).toContain("[inline-size:max-content]");
  });

  it("uses clip while fitting and makes fitting Sticky containment explicit", () => {
    const { rerender } = render(
      <ScrollableArea label="Messages" data-testid="viewport">
        Messages
      </ScrollableArea>,
    );
    const viewport = screen.getByTestId("viewport");
    expect(viewport).toHaveClass("overflow-x-clip", "overflow-y-clip");
    expect(viewport).not.toHaveAttribute("tabindex");

    rerender(
      <ScrollableArea
        label="Messages"
        stickyContainment="always"
        data-testid="viewport"
      >
        Messages
      </ScrollableArea>,
    );
    expect(viewport).toHaveClass("overflow-x-hidden", "overflow-y-auto");
    expect(viewport).not.toHaveAttribute("tabindex");
  });

  it("accepts standard container sizing props on the viewport", () => {
    render(
      <ScrollableArea
        label="Messages"
        width={320}
        height="50vh"
        maxWidth="100%"
        minHeight={120}
        data-testid="viewport"
      >
        Messages
      </ScrollableArea>,
    );

    const viewport = screen.getByTestId("viewport");
    expect(viewport).toHaveClass(
      "w-(--_scroll-area-width)",
      "h-(--_scroll-area-height)",
      "max-w-(--_scroll-area-max-width)",
      "min-h-(--_scroll-area-min-height)",
    );
    expect(viewport.style.getPropertyValue("--_scroll-area-width")).toBe(
      "320px",
    );
    expect(viewport.style.getPropertyValue("--_scroll-area-height")).toBe(
      "50vh",
    );
  });

  it("publishes content padding without changing the viewport default", () => {
    const { rerender } = render(
      <ScrollableArea label="Messages" data-testid="viewport">
        Messages
      </ScrollableArea>,
    );
    const viewport = screen.getByTestId("viewport");
    const content = viewport.firstElementChild as HTMLElement;
    const defaultViewportClass = viewport.className;
    const defaultContentClass = content.className;

    rerender(
      <ScrollableArea
        label="Messages"
        padding={4}
        paddingInlineEnd={2}
        data-testid="viewport"
      >
        Messages
      </ScrollableArea>,
    );

    expect(viewport.className).toBe(defaultViewportClass);
    expect(content.className).not.toBe(defaultContentClass);
    expect(content).toHaveClass(
      "[--container-padding-inline-start:var(--spacing-4)]",
      containerPaddingInlineEndVarStyles[2],
    );
    expect(content).not.toHaveClass(
      "[--container-padding-inline-end:var(--spacing-4)]",
    );
  });

  it("keeps inherited container bleed opt-in on the viewport", () => {
    const { rerender } = render(
      <ScrollableArea label="Messages" data-testid="viewport">
        Messages
      </ScrollableArea>,
    );
    const viewport = screen.getByTestId("viewport");
    const containedClass = viewport.className;

    rerender(
      <ScrollableArea label="Messages" isFullBleed data-testid="viewport">
        Messages
      </ScrollableArea>,
    );

    expect(viewport.className).not.toBe(containedClass);
    expect(viewport).toHaveClass(
      "ms-[calc(-1*var(--container-padding-inline-start,0px))]",
    );
    expect(containedClass).not.toContain("--container-padding-inline-start");
  });

  it("uses the neutral token for native scrollbar color with a transparent track", () => {
    render(<ScrollableArea label="Messages" data-testid="viewport" />);
    expect(screen.getByTestId("viewport")).toHaveClass(
      "[scrollbar-color:var(--color-neutral)_transparent]",
      "forced-colors:[scrollbar-color:auto]",
    );
  });

  it("guards scroll-state query containment as a progressive enhancement", () => {
    render(<ScrollableArea label="Messages" data-testid="viewport" />);
    expect(screen.getByTestId("viewport")).toHaveClass(
      "supports-[container-type:scroll-state]:[container-type:scroll-state]",
    );
  });
});
