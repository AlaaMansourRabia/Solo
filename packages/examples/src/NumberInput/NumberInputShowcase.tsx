'use client';

import {useState} from 'react';
import {NumberInput} from '@solo/core/NumberInput';

export default function NumberInputShowcase() {
  const [value, setValue] = useState<number | null>(0);
  return (
    <div style={{width: 300}}>
      <NumberInput
        label="Quantity"
        placeholder="Enter quantity"
        value={value}
        onChange={setValue}
        formatValue={number => `${number} items`}
        hasNumberSteppers
      />
    </div>
  );
}
