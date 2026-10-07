'use client';

import {Card} from '@solo/core/Card';
import {VStack} from '@solo/core/Layout';
import {Heading, Text} from '@solo/core/Text';

export default function HeadingCardGrid() {
  return (
    <Card width={300}>
      <VStack gap={2}>
        <Heading level={3}>Card Title</Heading>
        <Text type="body" maxLines={2} display="block">
          This is a card description that might be quite long and needs to be
          truncated after two lines to keep the card compact and uniform.
        </Text>
        <Text type="supporting" display="block">
          Updated 1 hour ago
        </Text>
      </VStack>
    </Card>
  );
}
