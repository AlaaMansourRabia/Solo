'use client';

import {
  ChatTokenizedText,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
} from '@solo/core/Chat';

const mixedTokens = [
  {value: '@sara', label: '@Sara', variant: 'blue' as const},
  {value: '#bug', label: '#bug', variant: 'red' as const},
  {value: '#feat', label: '#feature', variant: 'green' as const},
];

export default function ChatTokenizedTextShowcase() {
  return (
    <ChatMessageList>
      <ChatMessage sender="system">
        <ChatMessageBubble>
          <ChatTokenizedText tokens={mixedTokens}>
            @sara filed #bug and #feat for the sprint
          </ChatTokenizedText>
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  );
}
