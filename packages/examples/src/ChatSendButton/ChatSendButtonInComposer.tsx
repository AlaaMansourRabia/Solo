'use client';

import {ChatComposer} from '@solo/core/Chat';
import {Stack} from '@solo/core/Layout';

export default function ChatSendButtonInComposer() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        value="Hello, how can you help?"
        onChange={() => {}}
      />
    </Stack>
  );
}
