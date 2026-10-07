'use client';

import {Timer} from '@solo/core/Timer';
import {Text} from '@solo/core/Text';

export default function TimerInline() {
  return (
    <Text type="body" color="primary">
      Processing for <Timer type="inherit" color="inherit" />
    </Text>
  );
}
