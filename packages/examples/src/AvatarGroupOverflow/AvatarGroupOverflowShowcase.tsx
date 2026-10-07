'use client';

import {Avatar} from '@solo/core/Avatar';
import {AvatarGroup, AvatarGroupOverflow} from '@solo/core/AvatarGroup';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

const USERS = [
  {
    name: 'Alex Daniels',
  },
  {
    name: 'Ann Smith',
  },
  {
    name: 'Carol Davis',
  },
];

export default function AvatarGroupOverflowShowcase() {
  return (
    <Stack direction="vertical" gap={8}>
      <Stack direction="vertical" gap={3}>
        <Text type="supporting" color="secondary">
          Default overflow
        </Text>
        <AvatarGroup size="lg">
          {USERS.map(user => (
            <Avatar key={user.name} name={user.name} />
          ))}
          <AvatarGroupOverflow count={5} />
        </AvatarGroup>
      </Stack>
      <Stack direction="vertical" gap={3}>
        <Text type="supporting" color="secondary">
          Custom count text
        </Text>
        <AvatarGroup size="lg">
          {USERS.slice(0, 2).map(user => (
            <Avatar key={user.name} name={user.name} />
          ))}
          <AvatarGroupOverflow count={12}>12+</AvatarGroupOverflow>
        </AvatarGroup>
      </Stack>
    </Stack>
  );
}
