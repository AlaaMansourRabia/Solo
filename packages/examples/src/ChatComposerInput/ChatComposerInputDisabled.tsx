'use client';

import {ChatComposer, ChatComposerInput} from '@solo/core/Chat';
import {Stack} from '@solo/core/Layout';

export default function ChatComposerInputDisabled() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        isDisabled
        input={<ChatComposerInput isDisabled placeholder="Input is disabled" />}
      />
    </Stack>
  );
}
