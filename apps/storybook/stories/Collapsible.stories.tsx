import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {Collapsible, CollapsibleGroup} from '@solo/core/Collapsible';
import {Card} from '@solo/core/Card';
import {VStack} from '@solo/core/Layout';

const styles = {
  pageWrapper: 'bg-(--color-background-body) p-(--spacing-6)',
  text: 'font-(family-name:--font-family-body) text-(--color-text-primary) m-0',
  textSecondary:
    'text-(--color-text-secondary) text-[14px] font-(family-name:--font-family-body) m-0',
  dividedContainer: 'max-w-[480px]',
} as const;

const meta: Meta<typeof CollapsibleGroup> = {
  title: 'Core/Collapsible',
  component: CollapsibleGroup,
  tags: ['autodocs'],
  argTypes: {
    hasDividers: {
      control: 'boolean',
      description: "Draw hairline dividers between the group's items",
    },
    density: {
      control: 'select',
      options: ['compact', 'balanced', 'spacious'],
      description: 'Row density for trigger and content padding',
    },
  },
  decorators: [
    Story => (
      <div className={styles.pageWrapper}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CollapsibleGroup>;

export const SingleMode: Story = {
  name: 'Single Mode — Leading Chevron',
  render: () => (
    <CollapsibleGroup
      type="single"
      defaultValue="general"
      chevronPosition="start">
      <VStack gap={2}>
        <Card>
          <Collapsible trigger="General Settings" value="general">
            <p className={styles.text}>
              Configure your general preferences including language, timezone,
              and display options.
            </p>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="Privacy Settings" value="privacy">
            <p className={styles.text}>
              Manage who can see your profile, activity, and personal
              information.
            </p>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="Notification Settings" value="notifications">
            <p className={styles.text}>
              Choose which notifications you receive and how they are delivered.
            </p>
          </Collapsible>
        </Card>
      </VStack>
    </CollapsibleGroup>
  ),
};

export const MultipleMode: Story = {
  name: 'Multiple Mode',
  render: () => (
    <CollapsibleGroup type="multiple" defaultValue={['faq1', 'faq3']}>
      <VStack gap={2}>
        <Card>
          <Collapsible trigger="What is Solo?" value="faq1">
            <p className={styles.text}>
              Solo is a design system for building internal tools and
              products.
            </p>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="How do I install it?" value="faq2">
            <p className={styles.text}>
              Run <code>npm install @solo/core</code> to get started.
            </p>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="Is it open source?" value="faq3">
            <p className={styles.text}>
              Yes! Solo is open source and available on GitHub.
            </p>
          </Collapsible>
        </Card>
      </VStack>
    </CollapsibleGroup>
  ),
};

export const Controlled: Story = {
  name: 'Controlled',
  render: function ControlledStory() {
    const [open, setOpen] = useState<string | string[]>('section1');
    return (
      <div>
        <p className={styles.textSecondary}>
          Currently open: <strong>{String(open) || '(none)'}</strong>
        </p>
        <CollapsibleGroup type="single" value={open} onChange={setOpen}>
          <VStack gap={2}>
            <Card>
              <Collapsible trigger="Section 1" value="section1">
                <p className={styles.text}>Content for section 1.</p>
              </Collapsible>
            </Card>
            <Card>
              <Collapsible trigger="Section 2" value="section2">
                <p className={styles.text}>Content for section 2.</p>
              </Collapsible>
            </Card>
            <Card>
              <Collapsible trigger="Section 3" value="section3">
                <p className={styles.text}>Content for section 3.</p>
              </Collapsible>
            </Card>
          </VStack>
        </CollapsibleGroup>
      </div>
    );
  },
};

export const StandaloneCollapsible: Story = {
  name: 'Standalone Collapsible',
  render: () => (
    <VStack gap={2}>
      <Card>
        <Collapsible trigger="Starts open (default)">
          <p className={styles.text}>
            This collapsible manages its own state. Click the trigger to toggle.
          </p>
        </Collapsible>
      </Card>
      <Card>
        <Collapsible trigger="Starts collapsed" defaultIsOpen={false}>
          <p className={styles.text}>
            This collapsible starts collapsed. Click to reveal.
          </p>
        </Collapsible>
      </Card>
    </VStack>
  ),
};

export const Disabled: Story = {
  name: 'Disabled item',
  render: () => (
    <VStack gap={2}>
      <Card>
        <Collapsible trigger="Enabled — click to toggle">
          <p className={styles.text}>This section can be toggled.</p>
        </Collapsible>
      </Card>
      <Card>
        <Collapsible trigger="Disabled — can't be toggled" isDisabled>
          <p className={styles.text}>
            The trigger is non-interactive and dimmed.
          </p>
        </Collapsible>
      </Card>
      <Card>
        <Collapsible trigger="Disabled but open" isDisabled defaultIsOpen>
          <p className={styles.text}>
            Disabling doesn't collapse an already-open item; the content stays
            visible.
          </p>
        </Collapsible>
      </Card>
    </VStack>
  ),
};

export const WithoutCard: Story = {
  name: 'Without Card (standalone)',
  render: () => (
    <VStack gap={2}>
      <Collapsible trigger="Show more details">
        <p className={styles.text}>
          Collapsible works anywhere; it doesn't require a card wrapper.
        </p>
      </Collapsible>
      <Collapsible trigger="Another section" defaultIsOpen={false}>
        <p className={styles.text}>This section starts collapsed.</p>
      </Collapsible>
    </VStack>
  ),
};

export const Dividers: Story = {
  name: 'Dividers',
  args: {type: 'single', hasDividers: true, defaultValue: 'q1'},
  render: args => (
    <div className={styles.dividedContainer}>
      <CollapsibleGroup {...args}>
        <Collapsible trigger="How do I reset my password?" value="q1">
          <p className={styles.text}>
            Go to Settings → Security → Change Password. You'll receive a
            confirmation email.
          </p>
        </Collapsible>
        <Collapsible trigger="Can I change my username?" value="q2">
          <p className={styles.text}>
            Usernames can be changed once every 30 days from your profile
            settings.
          </p>
        </Collapsible>
        <Collapsible trigger="How do I delete my account?" value="q3">
          <p className={styles.text}>
            Account deletion is permanent. Your data will be removed within 30
            days.
          </p>
        </Collapsible>
      </CollapsibleGroup>
    </div>
  ),
};

export const DividersMultiple: Story = {
  name: 'Dividers — Multiple',
  args: {type: 'multiple', hasDividers: true, defaultValue: ['a']},
  render: args => (
    <div className={styles.dividedContainer}>
      <CollapsibleGroup {...args}>
        <Collapsible trigger="Deployment Details" value="a">
          <p className={styles.text}>
            Deployed 2 hours ago from the main branch.
          </p>
        </Collapsible>
        <Collapsible trigger="Environment Variables" value="b">
          <p className={styles.text}>
            12 variables configured for this environment.
          </p>
        </Collapsible>
        <Collapsible trigger="Build Logs" value="c">
          <p className={styles.text}>Build completed in 43 seconds.</p>
        </Collapsible>
      </CollapsibleGroup>
    </div>
  ),
};

export const DividersDensity: Story = {
  name: 'Dividers — Density',
  render: () => (
    <VStack gap={6} className={styles.dividedContainer}>
      {(['compact', 'balanced', 'spacious'] as const).map(density => (
        <CollapsibleGroup
          key={density}
          type="multiple"
          hasDividers
          density={density}
          defaultValue={['one']}>
          <Collapsible trigger={`First section (${density})`} value="one">
            <p className={styles.text}>
              Row padding scales with density.
            </p>
          </Collapsible>
          <Collapsible trigger="Second section" value="two">
            <p className={styles.text}>Collapsed by default.</p>
          </Collapsible>
        </CollapsibleGroup>
      ))}
    </VStack>
  ),
};

export const FAQ: Story = {
  name: 'FAQ Page',
  render: () => (
    <CollapsibleGroup type="single">
      <VStack gap={2}>
        <Card>
          <Collapsible trigger="How do I reset my password?" value="q1">
            <p className={styles.text}>
              Go to Settings → Security → Change Password. You'll receive a
              confirmation email.
            </p>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="Can I change my username?" value="q2">
            <p className={styles.text}>
              Usernames can be changed once every 30 days from your profile
              settings.
            </p>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="How do I delete my account?" value="q3">
            <p className={styles.text}>
              Account deletion is permanent. Go to Settings → Account → Delete
              Account. Your data will be removed within 30 days.
            </p>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="What payment methods are accepted?" value="q4">
            <p className={styles.text}>
              We accept Visa, Mastercard, American Express, and PayPal.
            </p>
          </Collapsible>
        </Card>
      </VStack>
    </CollapsibleGroup>
  ),
};

export const PressedState: Story = {
  name: 'Pressed state',
  parameters: {
    docs: {
      description: {
        story:
          "Press and hold the enabled trigger to paint the system's `--color-overlay-pressed` layer across its row. The disabled trigger remains visually unchanged and cannot expand or collapse.",
      },
    },
  },
  render: () => (
    <VStack gap={2}>
      <Card>
        <Collapsible trigger="Details — press and hold">
          <p className={styles.text}>
            The pressed overlay covers the trigger row.
          </p>
        </Collapsible>
      </Card>
      <Card>
        <Collapsible trigger="Unavailable — no pressed state" isDisabled>
          <p className={styles.text}>Never opens.</p>
        </Collapsible>
      </Card>
    </VStack>
  ),
};
