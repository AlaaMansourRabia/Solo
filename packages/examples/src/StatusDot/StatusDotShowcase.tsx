'use client';

import {StatusDot} from '@solo/core/StatusDot';
import {HStack} from '@solo/core/Layout';

export default function StatusDotShowcase() {
  return (
    <HStack gap={2} vAlign="center">
      <StatusDot variant="success" label="Positive" />
      <StatusDot variant="warning" label="Warning" />
      <StatusDot variant="error" label="Negative" />
      <StatusDot variant="accent" label="Info" />
      <StatusDot variant="neutral" label="Neutral" />
    </HStack>
  );
}
