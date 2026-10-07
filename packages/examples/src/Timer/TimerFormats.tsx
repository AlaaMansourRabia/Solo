'use client';

import {useState} from 'react';
import {Timer} from '@solo/core/Timer';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function TimerFormats() {
  const [startedAt] = useState(() => Date.now() - 3_753_000);

  return (
    <Stack direction="vertical" gap={3}>
      <Stack direction="horizontal" gap={3} vAlign="center">
        <Text type="supporting" color="secondary">
          Elapsed
        </Text>
        <Timer startTime={startedAt} type="body" color="primary" />
      </Stack>
      <Stack direction="horizontal" gap={3} vAlign="center">
        <Text type="supporting" color="secondary">
          Clock
        </Text>
        <Timer
          format="clock"
          startTime={startedAt}
          type="body"
          color="primary"
        />
      </Stack>
    </Stack>
  );
}
