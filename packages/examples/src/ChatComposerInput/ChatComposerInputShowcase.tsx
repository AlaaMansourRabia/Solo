'use client';

import {ChatComposer, ChatComposerInput} from '@solo/core/Chat';
import {Stack} from '@solo/core/Layout';

export default function ChatComposerInputShowcase() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        input={
          <ChatComposerInput placeholder="Ask me anything about Solo..." />
        }
      />
    </Stack>
  );
}
