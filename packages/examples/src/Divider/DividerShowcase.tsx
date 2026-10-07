'use client';

import {Divider} from '@solo/core/Divider';
import {Stack} from '@solo/core/Layout';

export default function DividerShowcase() {
  return (
    <Stack direction="vertical" gap={4} style={{width: 500}}>
      <Divider variant="subtle" />
      <Divider variant="strong" />
      <Divider label="or" />
    </Stack>
  );
}
