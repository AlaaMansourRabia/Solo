'use client';

import {CheckIndicator} from '@solo/core/Indicator';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

const OPTIONS = [
  {label: 'Daily digest', isChosen: true},
  {label: 'Weekly summary', isChosen: false},
  {label: 'Mentions only', isChosen: true},
];

export default function CheckIndicatorOptions() {
  return (
    <Stack direction="vertical" gap={2}>
      {OPTIONS.map(option => (
        <Stack
          key={option.label}
          direction="horizontal"
          gap={2}
          vAlign="center">
          <span className="inline-flex w-[24px] justify-center">
            <CheckIndicator state={option.isChosen ? 'checked' : 'unchecked'} />
          </span>
          <Text>{option.label}</Text>
        </Stack>
      ))}
    </Stack>
  );
}
