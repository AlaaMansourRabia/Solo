'use client';

import {useState} from 'react';
import {Tokenizer} from '@solo/core/Tokenizer';
import type {SearchableItem, SearchSource} from '@solo/core/Typeahead';

const source: SearchSource = {
  search: () => [],
  bootstrap: () => [],
};

export default function TokenizerShowcase() {
  const [value, setValue] = useState<SearchableItem[]>([
    {id: '1', label: 'Design'},
    {id: '2', label: 'Engineering'},
  ]);
  return (
    <Tokenizer
      label="Tags"
      placeholder="Search..."
      searchSource={source}
      value={value}
      onChange={setValue}
      style={{width: 400}}
    />
  );
}
