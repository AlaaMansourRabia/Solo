'use client';

import {useState} from 'react';
import {FileInput} from '@solo/core/FileInput';

export default function FileInputShowcase() {
  const [value, setValue] = useState<File | File[] | null>(null);
  return (
    <div style={{width: 350}}>
      <FileInput
        label="Upload file"
        value={value}
        onChange={setValue}
        placeholder="Drag files here or click to browse"
      />
    </div>
  );
}
