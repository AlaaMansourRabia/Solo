'use client';

import {useState} from 'react';
import {
  ChatComposer,
  ChatComposerInput,
  type ChatComposerTrigger,
} from '@solo/core/Chat';
import {createStaticSource} from '@solo/core/Typeahead';
import type {SearchableItem} from '@solo/core/Typeahead';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

const USERS: SearchableItem[] = [
  {id: 'sara', label: 'Sara Haddad'},
  {id: 'alex', label: 'Alex Johnson'},
  {id: 'sam', label: 'Sam Rivera'},
  {id: 'jordan', label: 'Jordan Lee'},
];

const COMMANDS: SearchableItem[] = [
  {id: 'summarize', label: 'summarize'},
  {id: 'translate', label: 'translate'},
  {id: 'search', label: 'search'},
  {id: 'code', label: 'code'},
];

const userSource = createStaticSource(USERS);
const commandSource = createStaticSource(COMMANDS);

export default function ChatComposerInputMultipleTriggers() {
  const [value, setValue] = useState('');

  const mentionTrigger: ChatComposerTrigger = {
    character: '@',
    searchSource: userSource,
    onSelect: item => ({
      value: `@${item.id}`,
      label: item.label,
      variant: 'blue' as const,
    }),
  };

  const commandTrigger: ChatComposerTrigger = {
    character: '/',
    searchSource: commandSource,
    onSelect: item => ({
      value: `/${item.label}`,
      label: `/${item.label}`,
      variant: 'yellow' as const,
    }),
  };

  return (
    <Stack direction="vertical" gap={3} width={450} maxWidth="100%">
      <Text type="supporting" color="secondary">
        Type @ for mentions (blue) or / for commands (yellow)
      </Text>
      <ChatComposer
        onSubmit={() => setValue('')}
        input={
          <ChatComposerInput
            value={value}
            onChange={setValue}
            triggers={[mentionTrigger, commandTrigger]}
            placeholder="Type @ or / ..."
          />
        }
      />
      <Text type="supporting" color="secondary">
        Value: {JSON.stringify(value)}
      </Text>
    </Stack>
  );
}
