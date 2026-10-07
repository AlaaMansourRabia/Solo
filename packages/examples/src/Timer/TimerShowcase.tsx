'use client';

import {useState} from 'react';
import {Timer} from '@solo/core/Timer';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function TimerShowcase() {
  const [startedAt] = useState(() => Date.now() - 3_753_000);

  return (
    <Stack direction="vertical" gap={4}>
      <Text type="large" color="primary" weight="semibold">
        Processing
      </Text>
      <Stack direction="horizontal" gap={6} vAlign="center">
        <Stack direction="vertical" gap={1}>
          <Text type="supporting" color="secondary">
            Elapsed
          </Text>
          <Timer
            startTime={startedAt}
            type="body"
            size="xl"
            color="primary"
            weight="semibold"
          />
        </Stack>
        <Stack direction="vertical" gap={1}>
          <Text type="supporting" color="secondary">
            Clock
          </Text>
          <Timer
            format="clock"
            startTime={startedAt}
            type="body"
            size="xl"
            color="primary"
            weight="semibold"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
