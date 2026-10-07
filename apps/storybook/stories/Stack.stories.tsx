import type {Meta, StoryObj} from '@storybook/react';
import {cn} from '@solo/core/utils/cn';
import {Stack, StackItem} from '@solo/core/Layout';

const styles = {
  box: cn(
    'bg-(--color-background-blue) text-(--color-text-blue)',
    '[border-width:1px] [border-style:solid] border-(--color-border-blue)',
    'py-(--spacing-4) px-(--spacing-6) rounded-(--radius-element) font-[500]',
    'h-full box-border',
  ),
  boxAlt:
    'bg-(--color-background-gray) text-(--color-text-gray) border-(--color-border-gray)',
  boxGreen:
    'bg-(--color-background-green) text-(--color-text-green) border-(--color-border-green)',
  boxPurple:
    'bg-(--color-background-purple) text-(--color-text-purple) border-(--color-border-purple)',
  boxOrange:
    'bg-(--color-background-orange) text-(--color-text-orange) border-(--color-border-orange)',
  container: 'bg-(--color-background-body)',
  containerWidth: 'w-[300px]',
  containerWidthMedium: 'w-[500px]',
  containerWidthLarge: 'w-[600px]',
  containerWidthSmall: 'w-[150px]',
  containerHeight: 'h-[120px]',
  containerHeightSmall: 'h-[80px]',
  containerHeightMedium: 'h-[150px]',
  containerHeightLarge: 'h-[200px]',
  containerPadding: 'p-(--spacing-2)',
  sidebarWidth: 'w-[150px]',
  storyWrapper: 'flex flex-col gap-(--spacing-6)',
  storyWrapperRow: 'flex gap-(--spacing-6)',
  heading:
    'm-[0_0_var(--spacing-2)_0] font-(family-name:--font-family-body)',
} as const;

// Demo box component for visibility
const Box = ({
  children,
  alt = false,
  green = false,
  purple = false,
  orange = false,
}: {
  children: React.ReactNode;
  alt?: boolean;
  green?: boolean;
  purple?: boolean;
  orange?: boolean;
}) => (
  <div
    className={cn(styles.box,
      alt && styles.boxAlt,
      green && styles.boxGreen,
      purple && styles.boxPurple,
      orange && styles.boxOrange)}>
    {children}
  </div>
);

const meta: Meta<typeof Stack> = {
  title: 'Core/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Direction of the stack layout',
    },
    gap: {
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10],
      description: 'Spacing step for gap between items',
    },
    padding: {
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10],
      description: 'Inner padding on all sides (spacing step)',
    },
    paddingInline: {
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10],
      description:
        'Inline (horizontal) padding; overrides padding on that axis',
    },
    paddingInlineStart: {
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10],
      description:
        'Inline-start (left in LTR) padding; overrides paddingInline/padding on that edge',
    },
    paddingInlineEnd: {
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10],
      description:
        'Inline-end (right in LTR) padding; overrides paddingInline/padding on that edge',
    },
    paddingBlock: {
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10],
      description: 'Block (vertical) padding; overrides padding on that axis',
    },
    paddingBlockStart: {
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10],
      description:
        'Block-start (top) padding; overrides paddingBlock/padding on that edge',
    },
    paddingBlockEnd: {
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10],
      description:
        'Block-end (bottom) padding; overrides paddingBlock/padding on that edge',
    },
    isScrollable: {
      control: 'boolean',
      description: 'Enables scrollable overflow (overflow: auto)',
    },
    hAlign: {
      control: 'select',
      options: [
        'start',
        'center',
        'end',
        'stretch',
        'between',
        'around',
        'evenly',
      ],
      description:
        'Horizontal alignment. Main-axis when horizontal, cross-axis when vertical.',
    },
    vAlign: {
      control: 'select',
      options: [
        'start',
        'center',
        'end',
        'stretch',
        'between',
        'around',
        'evenly',
      ],
      description:
        'Vertical alignment. Cross-axis when horizontal, main-axis when vertical.',
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap', 'wrap-reverse'],
      description: 'Flex wrap behavior',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

// ============================================================================
// Basic examples
// ============================================================================

export const Default: Story = {
  args: {
    gap: 2,
    children: null,
  },
  render: args => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    gap: 2,
  },
  render: args => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    gap: 4,
  },
  render: args => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

// ============================================================================
// Alignment
// ============================================================================

/**
 * Main-axis alignment for horizontal stacks (hAlign → justify-content).
 * Uses a wide container so the spacing differences are clearly visible.
 */
export const HorizontalAlignments: Story = {
  render: () => (
    <div className={styles.storyWrapper}>
      <div>
        <h4 className={styles.heading}>hAlign: start (default)</h4>
        <Stack
          direction="horizontal"
          gap={2}
          hAlign="start"
          className={cn(
            styles.container,
            styles.containerWidthLarge,
            styles.containerPadding,
          )}>
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </Stack>
      </div>
      <div>
        <h4 className={styles.heading}>hAlign: center</h4>
        <Stack
          direction="horizontal"
          gap={2}
          hAlign="center"
          className={cn(
            styles.container,
            styles.containerWidthLarge,
            styles.containerPadding,
          )}>
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </Stack>
      </div>
      <div>
        <h4 className={styles.heading}>hAlign: end</h4>
        <Stack
          direction="horizontal"
          gap={2}
          hAlign="end"
          className={cn(
            styles.container,
            styles.containerWidthLarge,
            styles.containerPadding,
          )}>
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </Stack>
      </div>
      <div>
        <h4 className={styles.heading}>hAlign: between</h4>
        <Stack
          direction="horizontal"
          gap={2}
          hAlign="between"
          className={cn(
            styles.container,
            styles.containerWidthLarge,
            styles.containerPadding,
          )}>
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </Stack>
      </div>
      <div>
        <h4 className={styles.heading}>hAlign: evenly</h4>
        <Stack
          direction="horizontal"
          gap={2}
          hAlign="evenly"
          className={cn(
            styles.container,
            styles.containerWidthLarge,
            styles.containerPadding,
          )}>
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </Stack>
      </div>
    </div>
  ),
};

/**
 * Cross-axis alignment for horizontal stacks (vAlign → align-items).
 * Uses items with different heights so alignment differences are visible.
 */
export const HorizontalCrossAxisAlignment: Story = {
  render: () => (
    <div className={styles.storyWrapper}>
      <div>
        <h4 className={styles.heading}>vAlign: start</h4>
        <Stack
          direction="horizontal"
          gap={2}
          vAlign="start"
          className={cn(styles.container, styles.containerHeightSmall)}>
          <Box>A</Box>
          <Box>
            B<br />B
          </Box>
          <Box>C</Box>
        </Stack>
      </div>
      <div>
        <h4 className={styles.heading}>vAlign: center</h4>
        <Stack
          direction="horizontal"
          gap={2}
          vAlign="center"
          className={cn(styles.container, styles.containerHeightSmall)}>
          <Box>A</Box>
          <Box>
            B<br />B
          </Box>
          <Box>C</Box>
        </Stack>
      </div>
      <div>
        <h4 className={styles.heading}>vAlign: end</h4>
        <Stack
          direction="horizontal"
          gap={2}
          vAlign="end"
          className={cn(styles.container, styles.containerHeightSmall)}>
          <Box>A</Box>
          <Box>
            B<br />B
          </Box>
          <Box>C</Box>
        </Stack>
      </div>
      <div>
        <h4 className={styles.heading}>vAlign: stretch (default)</h4>
        <Stack
          direction="horizontal"
          gap={2}
          vAlign="stretch"
          className={cn(styles.container, styles.containerHeightSmall)}>
          <Box>A</Box>
          <Box>
            B<br />B
          </Box>
          <Box>C</Box>
        </Stack>
      </div>
    </div>
  ),
};

export const VerticalAlignments: Story = {
  render: () => (
    <div className={styles.storyWrapperRow}>
      <div>
        <h4 className={styles.heading}>
          direction=&quot;vertical&quot;, hAlign: start
        </h4>
        <Stack
          direction="vertical"
          gap={2}
          hAlign="start"
          className={cn(
            styles.container,
            styles.containerWidthSmall,
            styles.containerPadding,
          )}>
          <Box>A</Box>
          <Box>BB</Box>
          <Box>CCC</Box>
        </Stack>
      </div>
      <div>
        <h4 className={styles.heading}>
          direction=&quot;vertical&quot;, hAlign: center
        </h4>
        <Stack
          direction="vertical"
          gap={2}
          hAlign="center"
          className={cn(
            styles.container,
            styles.containerWidthSmall,
            styles.containerPadding,
          )}>
          <Box>A</Box>
          <Box>BB</Box>
          <Box>CCC</Box>
        </Stack>
      </div>
      <div>
        <h4 className={styles.heading}>
          direction=&quot;vertical&quot;, hAlign: end
        </h4>
        <Stack
          direction="vertical"
          gap={2}
          hAlign="end"
          className={cn(
            styles.container,
            styles.containerWidthSmall,
            styles.containerPadding,
          )}>
          <Box>A</Box>
          <Box>BB</Box>
          <Box>CCC</Box>
        </Stack>
      </div>
      <div>
        <h4 className={styles.heading}>
          direction=&quot;vertical&quot;, hAlign: stretch
        </h4>
        <Stack
          direction="vertical"
          gap={2}
          hAlign="stretch"
          className={cn(
            styles.container,
            styles.containerWidthSmall,
            styles.containerPadding,
          )}>
          <Box>A</Box>
          <Box>BB</Box>
          <Box>CCC</Box>
        </Stack>
      </div>
    </div>
  ),
};

// ============================================================================
// Wrapping
// ============================================================================

export const Wrapping: Story = {
  args: {
    direction: 'horizontal',
    gap: 2,
    wrap: 'wrap',
  },
  render: args => (
    <Stack
      {...args}
      className={cn(
        styles.container,
        styles.containerWidth,
        styles.containerPadding,
      )}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
      <Box>Item 4</Box>
      <Box>Item 5</Box>
    </Stack>
  ),
};

// ============================================================================
// StackItem examples (merged from StackItem stories)
// ============================================================================

export const StackItemFillSize: Story = {
  render: () => (
    <Stack
      direction="horizontal"
      gap={2}
      className={cn(
        styles.container,
        styles.containerWidthMedium,
        styles.containerPadding,
      )}>
      <StackItem size="static">
        <Box alt>Static</Box>
      </StackItem>
      <StackItem size="fill">
        <Box>Fill (grows to fill remaining space)</Box>
      </StackItem>
      <StackItem size="static">
        <Box alt>Static</Box>
      </StackItem>
    </Stack>
  ),
};

export const StackItemEqualFill: Story = {
  render: () => (
    <div>
      <h4 className={styles.heading}>Equal Fill (1:1:1)</h4>
      <Stack
        direction="horizontal"
        gap={2}
        className={cn(
          styles.container,
          styles.containerWidthMedium,
          styles.containerPadding,
        )}>
        <StackItem size="fill">
          <Box>fill</Box>
        </StackItem>
        <StackItem size="fill">
          <Box green>fill</Box>
        </StackItem>
        <StackItem size="fill">
          <Box purple>fill</Box>
        </StackItem>
      </Stack>
    </div>
  ),
};

export const StackItemCrossAlignSelf: Story = {
  render: () => (
    <Stack
      direction="horizontal"
      gap={2}
      className={cn(
        styles.container,
        styles.containerHeightMedium,
        styles.containerPadding,
      )}>
      <StackItem crossAlignSelf="start">
        <Box>start</Box>
      </StackItem>
      <StackItem crossAlignSelf="center">
        <Box green>center</Box>
      </StackItem>
      <StackItem crossAlignSelf="end">
        <Box purple>end</Box>
      </StackItem>
      <StackItem crossAlignSelf="stretch">
        <Box orange>stretch</Box>
      </StackItem>
    </Stack>
  ),
};

// ============================================================================
// Common layout patterns
// ============================================================================

export const HeaderLayout: Story = {
  render: () => (
    <Stack
      direction="horizontal"
      gap={2}
      className={cn(
        styles.container,
        styles.containerWidthLarge,
        styles.containerPadding,
      )}>
      <StackItem size="static">
        <Box alt>Logo</Box>
      </StackItem>
      <StackItem size="fill">
        <Box>Navigation</Box>
      </StackItem>
      <StackItem size="static">
        <Box alt>Actions</Box>
      </StackItem>
    </Stack>
  ),
};

export const SidebarLayout: Story = {
  render: () => (
    <Stack
      direction="horizontal"
      gap={2}
      className={cn(
        styles.container,
        styles.containerWidthLarge,
        styles.containerHeightLarge,
        styles.containerPadding,
      )}>
      <StackItem size="static" className={styles.sidebarWidth}>
        <Box alt>Sidebar</Box>
      </StackItem>
      <StackItem size="fill">
        <Box>Main Content</Box>
      </StackItem>
    </Stack>
  ),
};

export const PageLayout: Story = {
  render: () => (
    <Stack direction="vertical" gap={2} className={styles.containerWidthLarge}>
      <Stack
        direction="horizontal"
        gap={2}
        className={cn(styles.container, styles.containerPadding)}>
        <StackItem size="static">
          <Box alt>Logo</Box>
        </StackItem>
        <StackItem size="fill">
          <Box>Navigation</Box>
        </StackItem>
        <StackItem size="static">
          <Box alt>Actions</Box>
        </StackItem>
      </Stack>
      <Stack
        direction="horizontal"
        gap={2}
        className={cn(
          styles.container,
          styles.containerHeightLarge,
          styles.containerPadding,
        )}>
        <StackItem size="static" className={styles.sidebarWidth}>
          <Box alt>Sidebar</Box>
        </StackItem>
        <StackItem size="fill">
          <Box>Main Content</Box>
        </StackItem>
      </Stack>
    </Stack>
  ),
};

// ============================================================================
// Padding — inner padding via the spacing scale (no inline styles needed)
// ============================================================================

export const Padding: Story = {
  args: {
    gap: 2,
    padding: 4,
  },
  render: args => (
    <Stack {...args} className={styles.container}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const PaddingPerAxis: Story = {
  args: {
    gap: 2,
    paddingInline: 6,
    paddingBlock: 2,
  },
  render: args => (
    <Stack {...args} className={styles.container}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const PaddingPerEdge: Story = {
  args: {
    gap: 2,
    padding: 6,
    paddingBlockStart: 1,
    paddingInlineEnd: 2,
  },
  render: args => (
    <Stack {...args} className={styles.container}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

// ============================================================================
// Scrollable — overflow: auto via the isScrollable prop
// ============================================================================

export const Scrollable: Story = {
  args: {
    gap: 2,
    padding: 2,
    isScrollable: true,
    height: 160,
    // A scrollable stack of non-interactive content needs a tab stop and an
    // accessible name so keyboard users can scroll it (axe:
    // scrollable-region-focusable). Stack forwards these through BaseProps.
    tabIndex: 0,
    role: 'region',
    'aria-label': 'Scrollable stack',
  },
  render: args => (
    <Stack {...args} className={styles.container}>
      {Array.from({length: 12}, (_, i) => (
        <Box key={i}>Item {i + 1}</Box>
      ))}
    </Stack>
  ),
};
