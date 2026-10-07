'use client';

import {ChatMessageList, ChatSystemMessage} from '@solo/core/Chat';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function ChatSystemMessageVariants() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Default
        </Text>
        <ChatMessageList>
          <ChatSystemMessage>Alex joined the conversation</ChatSystemMessage>
          <ChatSystemMessage>Conversation marked as resolved</ChatSystemMessage>
        </ChatMessageList>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Divider
        </Text>
        <ChatMessageList>
          <ChatSystemMessage variant="divider">
            March 15, 2026
          </ChatSystemMessage>
          <ChatSystemMessage variant="divider">Today</ChatSystemMessage>
        </ChatMessageList>
      </Stack>
    </Stack>
  );
}
