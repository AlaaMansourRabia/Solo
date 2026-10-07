'use client';

import {ChatComposer} from '@solo/core/Chat';
import {Stack} from '@solo/core/Layout';

export default function ChatComposerShowcase() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer onSubmit={() => {}} placeholder="Type a message…" />
    </Stack>
  );
}
