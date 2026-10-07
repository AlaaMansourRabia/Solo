'use client';

import {AvatarGroup, AvatarGroupOverflow} from '@solo/core/AvatarGroup';
import {Avatar} from '@solo/core/Avatar';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

const MEMBERS = [
  {name: 'Alex Daniels', key: 'alex', href: '/team/alex'},
  {name: 'Ann Smith', key: 'ann', href: '/team/ann'},
  {name: 'Carol Davis', key: 'carol', href: '/team/carol'},
];

const TOTAL_MEMBERS = 18;

export default function AvatarGroupInteractive() {
  return (
    <Stack direction="vertical" gap={8}>
      <Stack direction="vertical" gap={3}>
        <Text type="supporting" color="secondary">
          Reviewers
        </Text>
        <AvatarGroup size="lg" aria-label="Reviewers">
          {MEMBERS.map(m => (
            <Avatar key={m.key} name={m.name} href={m.href} />
          ))}
          <AvatarGroupOverflow
            count={TOTAL_MEMBERS - MEMBERS.length}
            onClick={() => {}}
          />
        </AvatarGroup>
      </Stack>
      <Stack direction="vertical" gap={3}>
        <Text type="supporting" color="secondary">
          Compact, static
        </Text>
        <AvatarGroup size="sm" aria-label="Attendees">
          {MEMBERS.map(m => (
            <Avatar key={m.key} name={m.name} />
          ))}
          <AvatarGroupOverflow count={TOTAL_MEMBERS - MEMBERS.length} />
        </AvatarGroup>
      </Stack>
    </Stack>
  );
}
