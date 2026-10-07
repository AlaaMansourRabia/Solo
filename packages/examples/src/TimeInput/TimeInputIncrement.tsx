'use client';

import {useState} from 'react';
import {TimeInput} from '@solo/core/TimeInput';
import {Stack} from '@solo/core/Layout';

export default function TimeInputIncrement() {
  const [slot, setSlot] = useState('09:00');

  return (
    <Stack direction="vertical" gap={3}>
      <TimeInput
        label="Appointment slot"
        increment={15}
        description="Use arrow keys to change by 15 minutes"
        value={slot as never}
        onChange={setSlot as never}
        hasClear
      />
    </Stack>
  );
}
