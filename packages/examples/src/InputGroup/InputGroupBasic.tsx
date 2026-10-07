'use client';

import {useState} from 'react';
import {InputGroup, InputGroupText} from '@solo/core/InputGroup';
import {TextInput} from '@solo/core/TextInput';

export default function InputGroupBasic() {
  const [price, setPrice] = useState('');

  return (
    <div style={{width: 320}}>
      <InputGroup label="Price">
        <InputGroupText>$</InputGroupText>
        <TextInput
          label="Amount"
          isLabelHidden
          value={price}
          onChange={setPrice}
          placeholder="0.00"
        />
        <InputGroupText>USD</InputGroupText>
      </InputGroup>
    </div>
  );
}
