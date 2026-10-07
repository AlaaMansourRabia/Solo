'use client';

import {useState} from 'react';
import {DateInput} from '@solo/core/DateInput';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

type DateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export default function DateInputWithDescription() {
  const [value, setValue] = useState<DateString | undefined>(undefined);

  return (
    <Stack
      direction="vertical"
      gap={4}
      width="100%"
      style={{minWidth: 240, maxWidth: 400}}>
      <Text type="supporting" color="secondary">
        Helper text explains what the field expects
      </Text>
      <DateInput
        label="Start date"
        description="Your subscription begins on this date"
        placeholder="Select a start date"
        value={value}
        onChange={setValue}
      />
    </Stack>
  );
}
