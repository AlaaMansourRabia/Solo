import type {Meta, StoryObj} from '@storybook/react';
import {Blockquote} from '@solo/core/Blockquote';
import {Card} from '@solo/core/Card';
import {Section} from '@solo/core/Section';
import {VStack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

const styles = {
  pullQuote:
    'text-(length:--text-large-size) leading-(--text-large-leading) my-(--spacing-4)',
  narrow: 'max-w-[280px]',
} as const;

const meta: Meta<typeof Blockquote> = {
  title: 'Core/Blockquote',
  component: Blockquote,
  tags: ['autodocs'],
  argTypes: {
    cite: {
      control: 'text',
      description: 'Optional attribution for the quote',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Blockquote>;

export const Default: Story = {
  args: {
    children:
      'Design is not just what it looks like and feels like. Design is how it works.',
  },
  render: args => (
    <Section variant="muted">
      <Card>
        <Blockquote {...args} />
      </Card>
    </Section>
  ),
};

export const WithCitation: Story = {
  render: () => (
    <Section variant="muted">
      <Card>
        <Blockquote cite="Steve Jobs">
          Design is not just what it looks like and feels like. Design is how it
          works.
        </Blockquote>
      </Card>
    </Section>
  ),
};

export const InContent: Story = {
  render: () => (
    <Section variant="muted">
      <Card>
        <VStack gap={3}>
          <Text type="body">
            In a 2003 interview, the importance of design thinking was
            emphasized:
          </Text>
          <Blockquote cite="Steve Jobs">
            Design is not just what it looks like and feels like. Design is how
            it works.
          </Blockquote>
          <Text type="body">
            This philosophy has guided product development for decades.
          </Text>
        </VStack>
      </Card>
    </Section>
  ),
};

export const NestedContent: Story = {
  render: () => (
    <Section variant="muted">
      <Card>
        <Blockquote>
          <Text type="body">
            The best way to predict the future is to invent it.
          </Text>
          <Text type="supporting">From a talk at PARC in 1971.</Text>
        </Blockquote>
      </Card>
    </Section>
  ),
};

export const MultipleParagraphs: Story = {
  render: () => (
    <Section variant="muted">
      <Card>
        <Blockquote cite="Alan Kay">
          <VStack gap={2}>
            <Text type="body">
              The best way to predict the future is to invent it.
            </Text>
            <Text type="body">
              People who are really serious about software should make their own
              hardware.
            </Text>
          </VStack>
        </Blockquote>
      </Card>
    </Section>
  ),
};

export const PullQuoteWithXstyle: Story = {
  render: () => (
    <Section variant="muted">
      <Card>
        <VStack gap={3}>
          <Text type="body">
            className carries layout and type overrides onto the blockquote itself,
            with no wrapper element.
          </Text>
          <Blockquote cite="Alan Kay" className={styles.pullQuote}>
            The best way to predict the future is to invent it.
          </Blockquote>
        </VStack>
      </Card>
    </Section>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Section variant="muted">
      <Card>
        <VStack gap={3}>
          <Blockquote cite="A source with a notably long attribution line that has to wrap">
            A long quotation that runs past a single line, so the rule on the
            inline-start edge and the wrapped text stay aligned all the way
            down. Long attributions wrap the same way underneath.
          </Blockquote>
          <Blockquote>
            An unbroken token such as
            https://www.example.com/research/2026/design-systems/the-very-long-report-slug/appendix
            wraps instead of overflowing.
          </Blockquote>
        </VStack>
      </Card>
    </Section>
  ),
};

export const NarrowContainer: Story = {
  render: () => (
    <Section variant="muted">
      <Card className={styles.narrow}>
        <Blockquote cite="Steve Jobs">
          Design is not just what it looks like and feels like. Design is how it
          works.
        </Blockquote>
      </Card>
    </Section>
  ),
};
