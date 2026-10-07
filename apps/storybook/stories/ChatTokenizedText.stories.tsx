import type {Meta, StoryObj} from '@storybook/react';
import {ChatTokenizedText} from '@solo/core/Chat';
import {ChatMessage, ChatMessageBubble} from '@solo/core/Chat';
import {Icon} from '@solo/core/Icon';
import {UserCircleIcon} from '@heroicons/react/24/solid';

const meta: Meta<typeof ChatTokenizedText> = {
  title: 'Core/ChatTokenizedText',
  component: ChatTokenizedText,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
  decorators: [
    Story => (
      <div
        style={{
          boxSizing: 'border-box',
          width: 'min(500px, calc(100vw - 32px))',
          padding: 16,
        }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ChatTokenizedText>;

const mentionTokens = [
  {value: '@sara', label: '@Sara Haddad', variant: 'blue' as const},
  {value: '@navi', label: '@Navi', variant: 'blue' as const},
  {value: '@alex', label: '@Alex Rivera', variant: 'blue' as const},
];

/** Single mention token */
export const SingleToken: Story = {
  render: () => (
    <ChatMessage sender="user">
      <ChatMessageBubble>
        <ChatTokenizedText tokens={mentionTokens}>
          Hey @sara can you review this?
        </ChatTokenizedText>
      </ChatMessageBubble>
    </ChatMessage>
  ),
};

/** Multiple mentions in one message */
export const MultipleTokens: Story = {
  render: () => (
    <ChatMessage sender="user">
      <ChatMessageBubble>
        <ChatTokenizedText tokens={mentionTokens}>
          @sara and @alex can @navi help with the review?
        </ChatTokenizedText>
      </ChatMessageBubble>
    </ChatMessage>
  ),
};

/** No tokens — renders as plain text */
export const PlainText: Story = {
  render: () => (
    <ChatMessage sender="user">
      <ChatMessageBubble>
        <ChatTokenizedText>
          Just a regular message with no mentions.
        </ChatTokenizedText>
      </ChatMessageBubble>
    </ChatMessage>
  ),
};

/** Tokens with different variants */
export const MixedVariants: Story = {
  render: () => (
    <ChatMessage sender="user">
      <ChatMessageBubble>
        <ChatTokenizedText
          tokens={[
            {value: '@sara', label: '@Sara', variant: 'blue'},
            {value: '#bug', label: '#bug', variant: 'red'},
            {value: '#feat', label: '#feature', variant: 'green'},
          ]}>
          @sara filed #bug and #feat for the sprint
        </ChatTokenizedText>
      </ChatMessageBubble>
    </ChatMessage>
  ),
};

/** Token at start and end of message */
export const TokensAtEdges: Story = {
  render: () => (
    <ChatMessage sender="user">
      <ChatMessageBubble>
        <ChatTokenizedText tokens={mentionTokens}>
          @sara this is for @navi
        </ChatTokenizedText>
      </ChatMessageBubble>
    </ChatMessage>
  ),
};

/** Tokens carrying an icon, and a fully custom token — both sit on the line */
export const IconAndCustomTokens: Story = {
  render: () => (
    <ChatMessage sender="user">
      <ChatMessageBubble>
        <ChatTokenizedText
          tokens={[
            {
              value: '@sara',
              label: '@Sara Haddad',
              variant: 'blue',
              icon: <Icon icon={UserCircleIcon} size="sm" />,
            },
            {
              value: '@navi',
              render: () => (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    height: 20,
                    padding: '0 8px',
                    borderRadius: 999,
                    background: '#e8def8',
                    fontSize: 12,
                  }}>
                  <span aria-hidden>★</span>
                  @Navi
                </span>
              ),
            },
          ]}>
          Hey @sara and @navi can you take a look?
        </ChatTokenizedText>
      </ChatMessageBubble>
    </ChatMessage>
  ),
};

/** Empty token values are ignored in a narrow message. */
export const EmptyValueNarrow: Story = {
  render: () => (
    <div style={{maxWidth: 288}}>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          <ChatTokenizedText
            tokens={[
              {value: '', label: 'Ignored'},
              {value: '@alice', label: '@Alice Rivera', variant: 'blue'},
            ]}>
            A longer localized message for @alice remains readable in a narrow
            conversation when an empty token definition is present.
          </ChatTokenizedText>
        </ChatMessageBubble>
      </ChatMessage>
    </div>
  ),
};
