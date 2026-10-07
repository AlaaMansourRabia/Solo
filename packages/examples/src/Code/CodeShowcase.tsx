'use client';

import {Code} from '@solo/core/CodeBlock';
import {Text} from '@solo/core/Text';
import {Stack} from '@solo/core/Layout';

export default function CodeShowcase() {
  return (
    <Stack direction="vertical" gap={3}>
      <Text type="body">
        Run <Code>npm install @solo/core</Code> to add the package.
      </Text>
      <Text type="body">
        Use the <Code>variant</Code> prop to switch between <Code>primary</Code>
        , <Code>secondary</Code>, and <Code>ghost</Code> styles.
      </Text>
    </Stack>
  );
}
