'use client';

import {useState} from 'react';
import {MultiSelector} from '@solo/core/MultiSelector';

export default function MultiSelectorShowcase() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <div style={{width: 300}}>
      <MultiSelector
        label="Columns"
        options={['Name', 'Email', 'Role', 'Status', 'Created']}
        value={value}
        onChange={setValue}
        placeholder="Select columns..."
      />
    </div>
  );
}
