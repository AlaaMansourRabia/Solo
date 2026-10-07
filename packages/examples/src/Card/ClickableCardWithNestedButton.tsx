'use client';

import {ClickableCard} from '@solo/core/ClickableCard';
import {Stack} from '@solo/core/Layout';
import {Text, Heading} from '@solo/core/Text';
import {Button} from '@solo/core/Button';

export default function ClickableCardWithNestedButton() {
  return (
    <ClickableCard label="Product" href="#" width={320}>
      <Stack direction="vertical" gap={3}>
        <Stack direction="vertical" gap={1}>
          <Heading level={4}>Wireless Headphones</Heading>
          <Text type="body" color="secondary">
            $79.99
          </Text>
        </Stack>
        <Button label="Add to cart" onClick={() => {}} variant="primary" />
      </Stack>
    </ClickableCard>
  );
}
