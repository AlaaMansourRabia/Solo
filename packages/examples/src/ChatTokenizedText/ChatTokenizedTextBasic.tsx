'use client';

import {
  ChatTokenizedText,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
} from '@solo/core/Chat';

const tokens = [
  {value: '@sara', label: '@Sara', variant: 'blue' as const},
  {value: '@alex', label: '@Alex', variant: 'blue' as const},
];

export default function ChatTokenizedTextBasic() {
  return (
    <ChatMessageList>
      <ChatMessage sender="system">
        <ChatMessageBubble>
          <ChatTokenizedText tokens={tokens}>
            Assign @sara and @alex as reviewers.
          </ChatTokenizedText>
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  );
}
