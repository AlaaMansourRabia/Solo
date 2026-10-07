'use client';

import {Center} from '@solo/core/Center';
import {Card} from '@solo/core/Card';
import {Stack} from '@solo/core/Layout';
import {Icon} from '@solo/core/Icon';
import {Text} from '@solo/core/Text';
import {InboxIcon} from '@heroicons/react/24/outline';

export default function CenterInsideACard() {
  return (
    <Card width={400}>
      <Center height={200}>
        <Stack direction="vertical" gap={2} hAlign="center">
          <Icon icon={InboxIcon} size="lg" color="secondary" />
          <Text type="body" weight="bold">
            No messages yet
          </Text>
          <Text type="supporting" color="secondary">
            Messages from your team will appear here.
          </Text>
        </Stack>
      </Center>
    </Card>
  );
}
