'use client';

import {useState} from 'react';
import {TextInput} from '@solo/core/TextInput';

export default function TextInputShowcase() {
  const [value, setValue] = useState('');
  return (
    <div style={{width: 300}}>
      <TextInput
        label="Name"
        value={value}
        onChange={setValue}
        placeholder="Enter your name"
      />
    </div>
  );
}
