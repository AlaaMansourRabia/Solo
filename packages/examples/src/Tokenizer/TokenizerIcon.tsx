'use client';

import {useState} from 'react';
import {Tokenizer} from '@solo/core/Tokenizer';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import type {SearchableItem, SearchSource} from '@solo/core/Typeahead';

const users: SearchableItem[] = [
  {id: '1', label: 'Alice Johnson'},
  {id: '2', label: 'Bob Smith'},
  {id: '3', label: 'Charlie Brown'},
  {id: '4', label: 'Diana Prince'},
  {id: '5', label: 'Eve Williams'},
];

const userSource: SearchSource = {
  search: (query: string) =>
    users.filter(u => u.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => users,
};

export default function TokenizerIcon() {
  const [value, setValue] = useState<SearchableItem[]>([users[0], users[2]]);

  return (
    <Stack direction="vertical" gap={2}>
      <Text type="supporting" color="secondary">
        Leading icon reinforces the search affordance
      </Text>
      <Tokenizer
        label="Team Members"
        placeholder="Search people..."
        searchSource={userSource}
        value={value}
        onChange={items => setValue(items)}
        startIcon={MagnifyingGlassIcon}
        style={{width: 400}}
      />
    </Stack>
  );
}
