'use client';

import {useState} from 'react';
import {Calendar, type ISODateString} from '@solo/core/Calendar';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

const isWeekday = (date: Date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

export default function CalendarConstraints() {
  const [value, setValue] = useState<ISODateString | undefined>(undefined);

  return (
    <Stack direction="vertical" gap={4} hAlign="center">
      <Text type="supporting" color="secondary">
        Jan 10 – Mar 20, weekdays only
      </Text>
      <Calendar
        mode="single"
        min={'2026-01-10' as ISODateString}
        max={'2026-03-20' as ISODateString}
        dateConstraints={[isWeekday]}
        value={value}
        onChange={val => setValue(val)}
        focusDate={'2026-01-01' as ISODateString}
      />
    </Stack>
  );
}
