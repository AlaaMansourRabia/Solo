'use client';

import {useState} from 'react';
import {CheckboxInput} from '@solo/core/CheckboxInput';
import {Stack} from '@solo/core/Layout';

export default function CheckboxInputShowcase() {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <Stack direction="vertical" gap={2}>
      <CheckboxInput
        label="Checked"
        value={notifications}
        onChange={setNotifications}
      />
      <CheckboxInput
        label="Unchecked"
        value={marketing}
        onChange={setMarketing}
      />
    </Stack>
  );
}
