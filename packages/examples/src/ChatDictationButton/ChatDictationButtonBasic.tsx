'use client';

import {useRef} from 'react';
import {
  ChatDictationButton,
  ChatComposer,
  ChatComposerInput,
  useChatDictation,
} from '@solo/core/Chat';
import type {ChatComposerInputHandle} from '@solo/core/Chat';
import {Stack} from '@solo/core/Layout';

export default function ChatDictationButtonBasic() {
  const inputRef = useRef<ChatComposerInputHandle>(null);

  const dictation = useChatDictation({
    inputRef,
    onResult: text => {
      console.log('Dictation result:', text);
    },
  });

  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={value => console.log('Submit:', value)}
        input={<ChatComposerInput handleRef={inputRef} />}
        sendActions={<ChatDictationButton dictation={dictation} />}
      />
    </Stack>
  );
}
