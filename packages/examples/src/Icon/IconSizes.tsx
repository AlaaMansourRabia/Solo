'use client';

import {Icon} from '@solo/core/Icon';
import {HStack, VStack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function IconSizes() {
  return (
    <HStack gap={4}>
      <VStack gap={1} hAlign="center">
        <Icon icon="search" size="xsm" />
        <Text type="supporting">xsm</Text>
      </VStack>
      <VStack gap={1} hAlign="center">
        <Icon icon="search" size="sm" />
        <Text type="supporting">sm</Text>
      </VStack>
      <VStack gap={1} hAlign="center">
        <Icon icon="search" size="md" />
        <Text type="supporting">md</Text>
      </VStack>
      <VStack gap={1} hAlign="center">
        <Icon icon="search" size="lg" />
        <Text type="supporting">lg</Text>
      </VStack>
    </HStack>
  );
}
