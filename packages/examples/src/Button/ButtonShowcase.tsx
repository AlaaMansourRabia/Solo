'use client';

import {Button} from '@solo/core/Button';
import {Stack} from '@solo/core/Layout';

export default function ButtonShowcase() {
  return (
    <Stack direction="horizontal" gap={3} vAlign="center">
      <Button label="Primary" variant="primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Ghost" variant="ghost" />
      <Button label="Destructive" variant="destructive" />
    </Stack>
  );
}
