'use client';

import {useState} from 'react';
import {MultiSelector} from '@solo/core/MultiSelector';

const OPTIONS = ['Design', 'Engineering', 'Marketing', 'Operations'];

export default function MultiSelectorBottomSheet() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <div style={{width: 320, maxWidth: '100%'}}>
      <MultiSelector
        label="Teams"
        options={OPTIONS}
        value={value}
        onChange={setValue}
        placeholder="Choose teams"
        hasSelectAll
        presentation="bottom-sheet"
      />
    </div>
  );
}
