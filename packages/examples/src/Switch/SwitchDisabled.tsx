'use client';

import {useState} from 'react';
import {Switch} from '@solo/core/Switch';

export default function SwitchDisabled() {
  const [value, setValue] = useState(false);
  return (
    <Switch
      label="Premium feature"
      description="Upgrade to enable this option"
      value={value}
      onChange={setValue}
      isDisabled
    />
  );
}
