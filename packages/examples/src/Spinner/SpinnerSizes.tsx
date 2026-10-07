'use client';

import {Spinner} from '@solo/core/Spinner';
import {HStack} from '@solo/core/Layout';

export default function SpinnerSizes() {
  return (
    <HStack gap={4} vAlign="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </HStack>
  );
}
