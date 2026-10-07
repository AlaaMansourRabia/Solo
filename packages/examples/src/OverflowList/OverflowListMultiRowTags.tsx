'use client';

import {OverflowList} from '@solo/core/OverflowList';
import {Badge} from '@solo/core/Badge';
import {Card} from '@solo/core/Card';

const tags = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Storybook',
  'Vitest',
  'Playwright',
  'ESLint',
  'Prettier',
  'Vite',
  'pnpm',
];

export default function OverflowListMultiRowTags() {
  return (
    <Card
      padding={2}
      style={{
        resize: 'horizontal',
        overflow: 'hidden',
        minWidth: 120,
        width: 260,
      }}>
      <OverflowList
        gap={1}
        maxRows={2}
        overflowRenderer={overflowItems => (
          <Badge variant="neutral" label={`+${overflowItems.length}`} />
        )}>
        {tags.map(tag => (
          <Badge key={tag} variant="info" label={tag} />
        ))}
      </OverflowList>
    </Card>
  );
}
