'use client';

import {useState} from 'react';
import {RadioList, RadioListItem} from '@solo/core/RadioList';

export default function RadioListShowcase() {
  const [value, setValue] = useState('');
  return (
    <RadioList
      label="Notification preference"
      value={value}
      onChange={setValue}>
      <RadioListItem label="Email" value="email" />
      <RadioListItem label="SMS" value="sms" />
      <RadioListItem label="Push notification" value="push" />
    </RadioList>
  );
}
