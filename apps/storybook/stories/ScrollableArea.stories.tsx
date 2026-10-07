import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor } from "storybook/test";
import { Button } from "@solo/core/Button";
import { HStack, VStack } from "@solo/core/Layout";
import { ScrollableArea } from "@solo/core/ScrollableArea";
import { Section } from "@solo/core/Section";
import { Text } from "@solo/core/Text";
import { cn } from "@solo/core/utils/cn";

const styles = {
  canvas: "p-(--spacing-4) bg-(--color-background-body)",
  viewport: cn(
    "[inline-size:340px] [block-size:180px]",
    "[border-width:1px] [border-style:solid] border-(--color-border-emphasized)",
    "rounded-(--radius-container) bg-(--color-background-surface)",
  ),
  viewportWide: "[inline-size:460px]",
  viewportCompact: "[inline-size:260px] [block-size:140px]",
  containerViewport: "[block-size:180px]",
  contentPadding: "p-(--spacing-3)",
  copy: "m-0 font-(family-name:--font-family-body) text-(--color-text-primary)",
  supportingCopy: "text-(--color-text-secondary)",
  card: cn(
    "[inline-size:150px] [min-block-size:96px] box-border p-(--spacing-3)",
    "rounded-(--radius-element) bg-(--color-background-muted) shrink-0",
  ),
  horizontalRail: cn(
    "flex gap-(--spacing-2) [inline-size:920px] [min-block-size:150px]",
    "items-stretch p-(--spacing-2)",
  ),
  verticalRail: "grid gap-(--spacing-2) p-(--spacing-2)",
  twoAxisCanvas: cn(
    "relative grid [grid-template-columns:repeat(4,180px)]",
    "[grid-template-rows:repeat(4,120px)] gap-(--spacing-2)",
    "[inline-size:760px] [block-size:540px] p-(--spacing-2)",
  ),
  sticky: cn(
    "sticky z-1 self-start p-(--spacing-2) rounded-(--radius-element)",
    "bg-(--color-neutral) font-(family-name:--font-family-body)",
    "text-(--color-text-primary)",
    "supports-[container-type:scroll-state]:[container-type:scroll-state]",
  ),
  stickyInlineStart: "[inset-inline-start:0]",
  stickyInlineEnd: "[inset-inline-end:0]",
  stickyBlockStart: "[inset-block-start:0]",
  stickyBlockEnd: "[inset-block-end:0] self-end",
  stickyStateInlineStart:
    "bg-transparent [@container_scroll-state(stuck:inline-start)]:bg-(--color-accent-muted)",
  stickyStateInlineEnd:
    "bg-transparent [@container_scroll-state(stuck:inline-end)]:bg-(--color-accent-muted)",
  stickyStateBlockStart:
    "bg-transparent [@container_scroll-state(stuck:block-start)]:bg-(--color-accent-muted)",
  stickyStateBlockEnd:
    "bg-transparent [@container_scroll-state(stuck:block-end)]:bg-(--color-accent-muted)",
  edgeStatus: "sticky [inset-block-start:0] opacity-[0.45]",
  edgeStatusInlineEnd:
    "opacity-[0.45] [@container_scroll-state(scrollable:inline-end)]:opacity-[1]",
  nestedViewport: cn(
    "[inline-size:280px] [block-size:140px]",
    "[border-width:1px] [border-style:dashed] border-(--color-border-emphasized)",
    "rounded-(--radius-element)",
  ),
  nestedOuter: "[inline-size:320px] [block-size:300px]",
  stickyPassThroughOuter: "[inline-size:360px] [block-size:220px]",
  stickyPassThroughContent: "[min-block-size:720px] p-(--spacing-3)",
  stickyPassThroughSpacer: "[block-size:180px] flex items-center",
  stickyPassThroughInner: cn(
    "[block-size:140px]",
    "[border-width:1px] [border-style:dashed] border-(--color-border-emphasized)",
    "rounded-(--radius-element)",
  ),
  stickyPassThroughInnerContent: "[block-size:120px] p-(--spacing-2)",
  stickyPassThroughTail: "[block-size:360px]",
  verticalWriting:
    "[writing-mode:vertical-rl] [inline-size:220px] [block-size:280px]",
  rtl: "[direction:rtl]",
  scrollbarThin: "[scrollbar-width:thin]",
  scrollbarStable: "[scrollbar-gutter:stable_both-edges]",
  scrollbarNeutral: "[scrollbar-color:var(--color-neutral)_transparent]",
  transformedHost:
    "[inline-size:360px] [transform:perspective(700px)_rotateY(0deg)]",
  clippedFrame: cn(
    "overflow-clip rounded-(--radius-container)",
    "[border-width:1px] [border-style:solid] border-(--color-border-emphasized)",
  ),
} as const;

const meta = {
  title: "Core/ScrollableArea",
  component: ScrollableArea,
  tags: ["autodocs"],
  args: {
    axis: "block",
    label: "Scrollable example",
    role: "group",
    overscroll: "allow",
    stickyContainment: "whenScrollable",
  },
  argTypes: {
    axis: { control: "select", options: ["inline", "block", "both"] },
    role: { control: "select", options: ["group", "region"] },
    overscroll: { control: "select", options: ["allow", "contain"] },
    stickyContainment: {
      control: "select",
      options: ["whenScrollable", "always"],
    },
  },
} satisfies Meta<typeof ScrollableArea>;

export default meta;
type Story = StoryObj<typeof meta>;

function Cards({ count }: { count: number }) {
  return (
    <div className={cn(styles.horizontalRail)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={cn(styles.card)}>
          <p className={cn(styles.copy)}>Project {index + 1}</p>
          <p className={cn(styles.copy, styles.supportingCopy)}>
            Native scrolling content
          </p>
        </div>
      ))}
    </div>
  );
}

function Rows({ count }: { count: number }) {
  return (
    <div className={cn(styles.verticalRail)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={cn(styles.card)}>
          <p className={cn(styles.copy)}>Activity {index + 1}</p>
        </div>
      ))}
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <div className={cn(styles.canvas)}>
      <ScrollableArea {...args} className={styles.viewport}>
        {args.axis === "block" ? <Rows count={8} /> : <Cards count={8} />}
      </ScrollableArea>
    </div>
  ),
};

function ConditionalKeyboardDemo() {
  const [hasOverflow, setHasOverflow] = useState(false);
  return (
    <VStack gap={3} className={styles.canvas}>
      <HStack gap={2} hAlign="start">
        <Button
          label={hasOverflow ? "Make content fit" : "Make content overflow"}
          onClick={() => setHasOverflow((current) => !current)}
        >
          {hasOverflow ? "Make content fit" : "Make content overflow"}
        </Button>
        <Text type="supporting" color="secondary">
          Tab after toggling. The viewport is skipped when content fits and
          joins the tab order when content overflows.
        </Text>
      </HStack>
      <ScrollableArea
        axis="block"
        label="Conditional activity list"
        role="region"
        data-evidence="conditional-tabindex"
        className={styles.viewportCompact}
      >
        <Rows count={hasOverflow ? 8 : 1} />
      </ScrollableArea>
    </VStack>
  );
}

export const ConditionalKeyboardAccess: Story = {
  render: () => <ConditionalKeyboardDemo />,
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-evidence="conditional-tabindex"]',
    );
    expect(button).not.toBeNull();
    expect(viewport).not.toBeNull();
    if (button == null || viewport == null) {
      return;
    }

    await waitFor(() => {
      expect(getComputedStyle(viewport).overflowY).toBe("clip");
      expect(viewport).not.toHaveAttribute("tabindex");
    });
    await userEvent.click(button);
    await waitFor(() => {
      expect(getComputedStyle(viewport).overflowY).toBe("auto");
      expect(viewport).toHaveAttribute("tabindex", "0");
    });
    await userEvent.click(button);
    await waitFor(() => {
      expect(getComputedStyle(viewport).overflowY).toBe("clip");
      expect(viewport).not.toHaveAttribute("tabindex");
    });
  },
  parameters: { controls: { disable: true } },
};

function NestedChainingExample({ policy }: { policy: "allow" | "contain" }) {
  return (
    <VStack gap={2}>
      <Text weight="semibold">{policy}</Text>
      <ScrollableArea
        axis="block"
        label={`${policy} outer activity`}
        overscroll="allow"
        className={cn(styles.viewport, styles.nestedOuter)}
      >
        <VStack gap={3} className={styles.contentPadding}>
          <Text>Scroll the nested areas, then continue at each edge.</Text>
          <ScrollableArea
            axis="block"
            label={`${policy} fitting nested area`}
            overscroll={policy}
            data-evidence={`${policy}-fitting-nested`}
            className={styles.nestedViewport}
          >
            <Rows count={1} />
          </ScrollableArea>
          <ScrollableArea
            axis="block"
            label={`${policy} overflowing nested area`}
            overscroll={policy}
            data-evidence={`${policy}-overflowing-nested`}
            className={styles.nestedViewport}
          >
            <Rows count={6} />
          </ScrollableArea>
          <Rows count={4} />
        </VStack>
      </ScrollableArea>
    </VStack>
  );
}

export const Overscroll: Story = {
  render: () => (
    <HStack gap={4} className={styles.canvas}>
      <NestedChainingExample policy="allow" />
      <NestedChainingExample policy="contain" />
    </HStack>
  ),
  parameters: { controls: { disable: true } },
};

function StickyLabel({
  edge,
}: {
  edge: "inline-start" | "inline-end" | "block-start" | "block-end";
}) {
  const stateStyle =
    edge === "inline-start"
      ? styles.stickyStateInlineStart
      : edge === "inline-end"
        ? styles.stickyStateInlineEnd
        : edge === "block-start"
          ? styles.stickyStateBlockStart
          : styles.stickyStateBlockEnd;
  return <span className={cn(stateStyle)}>{edge}</span>;
}

export const StickyLogicalEdges: Story = {
  render: () => (
    <VStack gap={4} className={styles.canvas}>
      <Text weight="semibold">Inline start and end</Text>
      <ScrollableArea
        axis="inline"
        label="Inline sticky examples"
        data-evidence="sticky-inline"
        className={cn(styles.viewport, styles.viewportWide)}
      >
        <div className={cn(styles.horizontalRail)}>
          <div className={cn(styles.sticky, styles.stickyInlineStart)}>
            <StickyLabel edge="inline-start" />
          </div>
          <Cards count={4} />
          <div className={cn(styles.sticky, styles.stickyInlineEnd)}>
            <StickyLabel edge="inline-end" />
          </div>
        </div>
      </ScrollableArea>

      <Text weight="semibold">Block start and end</Text>
      <ScrollableArea
        axis="block"
        label="Block sticky examples"
        data-evidence="sticky-block"
        className={cn(styles.viewport, styles.viewportWide)}
      >
        <div className={cn(styles.verticalRail)}>
          <div className={cn(styles.sticky, styles.stickyBlockStart)}>
            <StickyLabel edge="block-start" />
          </div>
          <Rows count={5} />
          <div className={cn(styles.sticky, styles.stickyBlockEnd)}>
            <StickyLabel edge="block-end" />
          </div>
        </div>
      </ScrollableArea>

      <Text weight="semibold">Both axes</Text>
      <ScrollableArea
        axis="both"
        label="Two-axis sticky examples"
        data-evidence="sticky-both"
        className={cn(styles.viewport, styles.viewportWide)}
      >
        <div className={cn(styles.twoAxisCanvas)}>
          <div
            className={cn(
              styles.sticky,
              styles.stickyInlineStart,
              styles.stickyBlockStart,
            )}
          >
            <StickyLabel edge="inline-start" /> ·{" "}
            <StickyLabel edge="block-start" />
          </div>
          {Array.from({ length: 14 }, (_, index) => (
            <div key={index} className={cn(styles.card)}>
              Cell {index + 1}
            </div>
          ))}
          <div
            className={cn(
              styles.sticky,
              styles.stickyInlineEnd,
              styles.stickyBlockEnd,
            )}
          >
            <StickyLabel edge="inline-end" /> · <StickyLabel edge="block-end" />
          </div>
        </div>
      </ScrollableArea>
    </VStack>
  ),
  parameters: { controls: { disable: true } },
};

export const FittingStickyPassthrough: Story = {
  render: () => (
    <div className={cn(styles.canvas)}>
      <ScrollableArea
        axis="block"
        label="Outer Sticky owner"
        data-sticky-outer="true"
        className={cn(styles.viewport, styles.stickyPassThroughOuter)}
      >
        <div className={cn(styles.stickyPassThroughContent)}>
          <div className={cn(styles.stickyPassThroughSpacer)}>
            <Text>
              Scroll until the fitting inner area reaches the outer viewport.
            </Text>
          </div>
          <ScrollableArea
            axis="block"
            label="Fitting inner area"
            data-sticky-fitting-area="true"
            className={styles.stickyPassThroughInner}
          >
            <div className={cn(styles.stickyPassThroughInnerContent)}>
              <div
                data-sticky-passthrough="true"
                className={cn(styles.sticky, styles.stickyBlockStart)}
              >
                Sticky passes through the fitting area
              </div>
              <Text type="supporting">
                This content fits, so the inner viewport uses clip and does not
                capture Sticky.
              </Text>
            </div>
          </ScrollableArea>
          <Text type="supporting">
            Explicit containment keeps the fitting viewport as a Sticky
            boundary.
          </Text>
          <ScrollableArea
            axis="block"
            label="Explicit fitting Sticky boundary"
            stickyContainment="always"
            data-sticky-contained-area="true"
            className={styles.stickyPassThroughInner}
          >
            <div className={cn(styles.stickyPassThroughInnerContent)}>
              <div className={cn(styles.sticky, styles.stickyBlockStart)}>
                Sticky stays with this fitting area
              </div>
            </div>
          </ScrollableArea>
          <div className={cn(styles.stickyPassThroughTail)} />
        </div>
      </ScrollableArea>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

    const outer = canvasElement.querySelector<HTMLElement>(
      '[data-sticky-outer="true"]',
    );
    const fittingArea = canvasElement.querySelector<HTMLElement>(
      '[data-sticky-fitting-area="true"]',
    );
    const containedArea = canvasElement.querySelector<HTMLElement>(
      '[data-sticky-contained-area="true"]',
    );
    const sticky = canvasElement.querySelector<HTMLElement>(
      '[data-sticky-passthrough="true"]',
    );
    expect(outer).not.toBeNull();
    expect(fittingArea).not.toBeNull();
    expect(containedArea).not.toBeNull();
    expect(sticky).not.toBeNull();
    if (
      outer == null ||
      fittingArea == null ||
      containedArea == null ||
      sticky == null
    ) {
      return;
    }

    expect(getComputedStyle(fittingArea).overflowX).toBe("clip");
    expect(getComputedStyle(fittingArea).overflowY).toBe("clip");
    expect(fittingArea).not.toHaveAttribute("tabindex");
    expect(getComputedStyle(containedArea).overflowX).toBe("hidden");
    expect(getComputedStyle(containedArea).overflowY).toBe("auto");
    expect(containedArea).not.toHaveAttribute("tabindex");

    outer.scrollTop = 200;
    outer.dispatchEvent(new Event("scroll"));
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
    expect(
      Math.abs(
        sticky.getBoundingClientRect().top - outer.getBoundingClientRect().top,
      ),
    ).toBeLessThanOrEqual(2);
    outer.dataset.stickyPassthroughVerified = "true";
  },
  parameters: { controls: { disable: true } },
};

export const LogicalDirections: Story = {
  render: () => (
    <VStack gap={4} className={styles.canvas}>
      <Text weight="semibold">LTR inline axis</Text>
      <ScrollableArea
        axis="inline"
        label="LTR projects"
        data-evidence="writing-ltr"
        className={styles.viewport}
      >
        <Cards count={6} />
      </ScrollableArea>
      <Text weight="semibold">RTL inline axis</Text>
      <ScrollableArea
        axis="inline"
        label="RTL projects"
        dir="rtl"
        data-evidence="writing-rtl"
        className={cn(styles.viewport, styles.rtl)}
      >
        <Cards count={6} />
      </ScrollableArea>
      <Text weight="semibold">vertical-rl inline axis</Text>
      <ScrollableArea
        axis="inline"
        label="Vertical projects"
        data-evidence="writing-vertical-rl"
        className={styles.verticalWriting}
      >
        <Cards count={6} />
      </ScrollableArea>
    </VStack>
  ),
  parameters: { controls: { disable: true } },
};

function RTLBehaviorProbeStory() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollToInlineEnd = () => {
    const viewport = viewportRef.current;
    if (viewport == null) {
      return;
    }
    viewport.scrollLeft +=
      getComputedStyle(viewport).direction === "rtl" ? -160 : 160;
  };

  return (
    <VStack gap={3} className={styles.canvas}>
      <Button
        label="Scroll inline end"
        data-rtl-scroll-button="true"
        onClick={scrollToInlineEnd}
      >
        Scroll inline end
      </Button>
      <ScrollableArea
        ref={viewportRef}
        axis="inline"
        label="Logical direction probe"
        data-rtl-scroll-probe="true"
        className={styles.viewport}
      >
        <Cards count={6} />
      </ScrollableArea>
    </VStack>
  );
}

export const RTLBehaviorProbe: Story = {
  render: () => <RTLBehaviorProbeStory />,
  parameters: { controls: { disable: true } },
};

function TransformedClipDemo() {
  const [activations, setActivations] = useState(0);
  return (
    <VStack gap={2} className={styles.canvas}>
      <Text type="supporting" color="secondary">
        The native viewport remains clickable inside a perspective ancestor and
        a clipped rounded frame.
      </Text>
      <div className={cn(styles.transformedHost)}>
        <div className={cn(styles.clippedFrame)}>
          <ScrollableArea
            axis="block"
            label="Transformed clipped activity"
            data-evidence="transformed-clipped"
            className={styles.viewportCompact}
          >
            <VStack gap={2} className={styles.contentPadding}>
              <Button
                label="Activate clipped target"
                data-transform-hit-target="true"
                onClick={() => setActivations((value) => value + 1)}
              >
                Activate clipped target
              </Button>
              <Text data-transform-hit-count="true">
                Activations: {activations}
              </Text>
              <Rows count={5} />
            </VStack>
          </ScrollableArea>
        </div>
      </div>
    </VStack>
  );
}

export const TransformedClippedAncestor: Story = {
  render: () => <TransformedClipDemo />,
  parameters: { controls: { disable: true } },
};

export const ContainerIntegration: Story = {
  render: () => (
    <div className={cn(styles.canvas)}>
      <Section padding={4} width={340}>
        <ScrollableArea
          axis="block"
          label="Full-bleed activity"
          isFullBleed
          padding={3}
          data-evidence="container-integration"
          className={styles.containerViewport}
        >
          <Rows count={6} />
        </ScrollableArea>
      </Section>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const NativeScrollbarPresentation: Story = {
  render: () => (
    <VStack gap={4} className={styles.canvas}>
      <Text weight="semibold">Platform default with neutral thumb</Text>
      <ScrollableArea
        axis="inline"
        label="Default native scrollbar"
        data-evidence="scrollbar-default"
        className={styles.viewport}
      >
        <Cards count={6} />
      </ScrollableArea>
      <Text weight="semibold">Thin width and stable gutter</Text>
      <ScrollableArea
        axis="inline"
        label="Thin stable native scrollbar"
        data-evidence="scrollbar-thin-stable"
        className={cn(
          styles.viewport,
          styles.scrollbarThin,
          styles.scrollbarStable,
        )}
      >
        <Cards count={6} />
      </ScrollableArea>
      <Text weight="semibold">
        Consumer neutral override, transparent track
      </Text>
      <ScrollableArea
        axis="inline"
        label="Neutral native scrollbar"
        data-evidence="scrollbar-neutral"
        className={cn(styles.viewport, styles.scrollbarNeutral)}
      >
        <Cards count={6} />
      </ScrollableArea>
    </VStack>
  ),
  parameters: { controls: { disable: true } },
};
