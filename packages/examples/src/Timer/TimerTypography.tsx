'use client';

import {useState} from 'react';
import {Timer} from '@solo/core/Timer';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function TimerTypography() {
  const [startedAt] = useState(() => Date.now() - 128_000);

  return (
    <Stack direction="vertical" gap={3}>
      <Text type="supporting" color="secondary">
        Default
      </Text>
      <Timer startTime={startedAt} />
      <Text type="supporting" color="secondary">
        Emphasized
      </Text>
      <Timer
        startTime={startedAt}
        type="body"
        size="xl"
        color="primary"
        weight="semibold"
      />
    </Stack>
  );
}
