'use client';

import {ChatSendButton} from '@solo/core/Chat';
import {Icon} from '@solo/core/Icon';
import {Stack} from '@solo/core/Layout';
import {SparklesIcon} from '@heroicons/react/24/solid';

export default function ChatSendButtonShowcase() {
  return (
    <Stack direction="horizontal" gap={3} vAlign="center">
      <ChatSendButton isDisabled={false} onSend={() => {}} />
      <ChatSendButton
        isDisabled={false}
        onSend={() => {}}
        sendIcon={<Icon icon={SparklesIcon} size="sm" />}
      />
      <ChatSendButton isStopShown onStop={() => {}} />
    </Stack>
  );
}
