'use client';

import {Card} from '@solo/core/Card';
import {Stack} from '@solo/core/Layout';
import {Text, Heading} from '@solo/core/Text';

export default function CardShowcase() {
  return (
    <Card width={320}>
      <Stack direction="vertical" gap={2}>
        <Heading level={4}>Card title</Heading>
        <Text type="body" color="secondary">
          Cards group related content with a border and background. Use them for
          profiles, settings panels, or data summaries.
        </Text>
      </Stack>
    </Card>
  );
}
