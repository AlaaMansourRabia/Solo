'use client';

import {OverflowList} from '@solo/core/OverflowList';
import {Badge} from '@solo/core/Badge';
import {Card} from '@solo/core/Card';

export default function OverflowListOverflowBadges() {
  return (
    <Card
      padding={2}
      style={{
        resize: 'horizontal',
        overflow: 'hidden',
        minWidth: 80,
        width: 300,
      }}>
      <OverflowList
        gap={1}
        overflowRenderer={overflowItems => (
          <Badge variant="neutral" label={`+${overflowItems.length}`} />
        )}>
        <Badge variant="info" label="React" />
        <Badge variant="success" label="TypeScript" />
        <Badge variant="warning" label="Tailwind CSS" />
        <Badge variant="neutral" label="Storybook" />
        <Badge variant="error" label="Vitest" />
      </OverflowList>
    </Card>
  );
}
