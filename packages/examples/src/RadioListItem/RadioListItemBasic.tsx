'use client';

import {useState} from 'react';
import {RadioList, RadioListItem} from '@solo/core/RadioList';

export default function RadioListItemBasic() {
  const [value, setValue] = useState('standard');

  return (
    <RadioList label="Shipping method" value={value} onChange={setValue}>
      <RadioListItem
        label="Standard"
        value="standard"
        description="5–7 business days"
      />
      <RadioListItem
        label="Express"
        value="express"
        description="2–3 business days"
      />
      <RadioListItem
        label="Overnight"
        value="overnight"
        description="Next business day"
      />
    </RadioList>
  );
}
