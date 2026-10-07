import type {Meta, StoryObj} from '@storybook/react';
import {Avatar, AvatarStatusDot} from '@solo/core/Avatar';
import {CheckIcon, ClockIcon, XMarkIcon} from '@heroicons/react/24/solid';

const styles = {
  grid: 'grid [grid-template-columns:repeat(3,max-content)] items-center gap-(--spacing-6)',
  narrow:
    'flex flex-wrap items-center gap-(--spacing-4) w-[320px] max-w-full',
} as const;

const meta = {
  title: 'Core/AvatarStatusDot',
  component: AvatarStatusDot,
  tags: ['autodocs'],
} satisfies Meta<typeof AvatarStatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsAndSizes: Story = {
  render: () => (
    <div className={styles.grid}>
      {(['success', 'neutral', 'error'] as const).flatMap(variant =>
        (['xsm', 'lg', 'xl'] as const).map(size => (
          <Avatar
            key={`${variant}-${size}`}
            name={`${variant} ${size}`}
            size={size}
            tooltip={false}
            status={
              <AvatarStatusDot
                variant={variant}
                label={
                  variant === 'success'
                    ? 'Online'
                    : variant === 'neutral'
                      ? 'Away'
                      : 'Do not disturb'
                }
              />
            }
          />
        )),
      )}
    </div>
  ),
};

export const DistinctCustomIcons: Story = {
  render: () => (
    <div className={styles.grid}>
      <Avatar
        name="Accepted"
        size="xl"
        tooltip={false}
        status={
          <AvatarStatusDot
            variant="success"
            label="Accepted"
            icon={<CheckIcon />}
          />
        }
      />
      <Avatar
        name="Pending"
        size="xl"
        tooltip={false}
        status={
          <AvatarStatusDot
            variant="neutral"
            label="Pending"
            icon={<ClockIcon />}
          />
        }
      />
      <Avatar
        name="Rejected"
        size="xl"
        tooltip={false}
        status={
          <AvatarStatusDot
            variant="error"
            label="Rejected"
            icon={<XMarkIcon />}
          />
        }
      />
    </div>
  ),
};

export const NarrowContainer: Story = {
  render: () => (
    <div className={styles.narrow}>
      <Avatar
        name="Online"
        size="lg"
        tooltip={false}
        status={<AvatarStatusDot variant="success" label="Online" />}
      />
      <Avatar
        name="Away"
        size="lg"
        tooltip={false}
        status={<AvatarStatusDot variant="neutral" label="Away" />}
      />
      <Avatar
        name="Do not disturb"
        size="lg"
        tooltip={false}
        status={<AvatarStatusDot variant="error" label="Do not disturb" />}
      />
    </div>
  ),
};
