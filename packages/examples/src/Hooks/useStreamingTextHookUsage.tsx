'use client';

import {useStreamingText} from '@solo/core/hooks';
import {Card} from '@solo/core/Card';
import {VStack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

const response =
  'Solo hooks keep behavior reusable while components keep visuals consistent.';

export default function UseStreamingTextHookUsage() {
  const displayedText = useStreamingText(response, false, {
    speed: 'fast',
  });

  return (
    <Card width={420} padding={4}>
      <VStack gap={2}>
        <Text type="body" weight="bold">
          Assistant response
        </Text>
        <Text type="body">{displayedText}</Text>
        <Text type="supporting" color="secondary">
          Complete
        </Text>
      </VStack>
    </Card>
  );
}
