/**
 * @file FieldStatus.stories.tsx
 * @input FieldStatus from @solo/core
 * @output Stable visual coverage for status tones and variants
 * @position Core component stories and visual regression coverage
 */

import type {Meta, StoryObj} from '@storybook/react';
import {FieldStatus} from '@solo/core/FieldStatus';
import {Stack} from '@solo/core/Stack';

const meta: Meta<typeof FieldStatus> = {
  title: 'Core/FieldStatus',
  component: FieldStatus,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FieldStatus>;

export const Variants: Story = {
  tags: ['visual-baseline'],
  render: () => (
    <Stack gap={3}>
      <FieldStatus type="error" message="This field is required" />
      <FieldStatus
        type="warning"
        message="This value may be visible to others"
        variant="detached"
      />
      <FieldStatus
        type="success"
        message="Your changes were saved"
        variant="detached"
      />
    </Stack>
  ),
};
