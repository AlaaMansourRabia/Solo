'use client';

import {HStack} from '@solo/core/Layout';
import {Badge} from '@solo/core/Badge';

export default function HStackBasic() {
  return (
    <HStack gap={2} vAlign="center">
      <Badge label="React" />
      <Badge label="TypeScript" />
      <Badge label="Node.js" />
    </HStack>
  );
}
