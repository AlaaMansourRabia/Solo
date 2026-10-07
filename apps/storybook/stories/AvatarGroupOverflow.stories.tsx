import type {Meta, StoryObj} from '@storybook/react';
import {fn} from 'storybook/test';
import {AvatarGroup, AvatarGroupOverflow} from '@solo/core/AvatarGroup';
import {Avatar} from '@solo/core/Avatar';
const storyStyles = {
  column: 'flex flex-col gap-(--spacing-6)',
  row: 'flex items-center gap-(--spacing-4) flex-wrap',
  item: 'flex flex-col gap-(--spacing-2)',
  label: 'font-(family-name:--font-family-body) m-0',
  narrow: 'w-[120px]',
} as const;

const meta: Meta<typeof AvatarGroupOverflow> = {
  title: 'Core/AvatarGroupOverflow',
  component: AvatarGroupOverflow,
  tags: ['autodocs'],
  args: {
    count: 2,
    onClick: undefined,
  },
  argTypes: {
    count: {control: 'number'},
    children: {control: 'text'},
    onClick: {
      control: false,
      description: 'Callback for intentionally clickable overflow indicators.',
    },
    ref: {control: false},
    className: {
      control: false,
      description: 'Tailwind class string merged onto the root.',
    },
  },
  render: args => (
    <AvatarGroup size="lg">
      <Avatar name="Alice" />
      <Avatar name="Bob" />
      <AvatarGroupOverflow {...args} />
    </AvatarGroup>
  ),
};

export default meta;
type Story = StoryObj<typeof AvatarGroupOverflow>;

export const Default: Story = {};

export const Clickable: Story = {
  args: {
    onClick: fn(),
  },
};

export const CustomContent: Story = {
  args: {
    count: 12,
    children: '12+',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className={storyStyles.column}>
      {(['xsm', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <div key={size} className={storyStyles.item}>
          <p className={storyStyles.label}>{size}</p>
          <AvatarGroup size={size}>
            <Avatar name="Alice" />
            <AvatarGroupOverflow count={2} />
          </AvatarGroup>
        </div>
      ))}
    </div>
  ),
};

export const AllShapes: Story = {
  render: () => (
    <div className={storyStyles.row}>
      {(['circle', 'rounded', 'square'] as const).map(shape => (
        <div key={shape} className={storyStyles.item}>
          <p className={storyStyles.label}>{shape}</p>
          <AvatarGroup size="lg" shape={shape}>
            <Avatar name="Alice" />
            <AvatarGroupOverflow count={2} />
          </AvatarGroup>
        </div>
      ))}
    </div>
  ),
};

export const LargeCount: Story = {
  args: {
    count: 4912,
  },
};

export const ZeroCount: Story = {
  args: {
    count: 0,
  },
};

export const Standalone: Story = {
  render: args => <AvatarGroupOverflow {...args} />,
};

export const RightToLeft: Story = {
  globals: {direction: 'rtl'},
};

export const NarrowContainer: Story = {
  render: args => (
    <div className={storyStyles.narrow}>
      <AvatarGroup size="lg">
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <AvatarGroupOverflow {...args} />
      </AvatarGroup>
    </div>
  ),
};
