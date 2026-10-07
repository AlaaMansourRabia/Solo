'use client';

import {Token} from '@solo/core/Token';
import {Badge} from '@solo/core/Badge';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function TokenEndContent() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text type="supporting" color="secondary">
        Trailing badges for counts or status
      </Text>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Token
          label="Inbox"
          color="blue"
          endContent={<Badge variant="info" label={12} />}
        />
        <Token
          label="Reviews"
          color="purple"
          endContent={<Badge variant="purple" label={3} />}
        />
        <Token
          label="Resolved"
          color="green"
          endContent={<Badge variant="success" label="Done" />}
        />
      </Stack>
    </Stack>
  );
}
