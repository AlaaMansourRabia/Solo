'use client';

import {Token} from '@solo/core/Token';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function TokenClickable() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text type="supporting" color="secondary">
        Click a token to view details
      </Text>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Token label="Bug" color="red" onClick={() => {}} />
        <Token label="Feature" color="blue" onClick={() => {}} />
        <Token label="Enhancement" color="green" onClick={() => {}} />
        <Token label="Documentation" color="gray" onClick={() => {}} />
      </Stack>
    </Stack>
  );
}
