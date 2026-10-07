'use client';

import {Avatar} from '@solo/core/Avatar';
import {AvatarGroup, AvatarGroupOverflow} from '@solo/core/AvatarGroup';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

const USERS = [
  {
    name: 'Ami Pena',
    src: '/template-assets/DATA-Ami-Pena.png',
  },
  {
    name: 'Drew Young',
    src: '/template-assets/DATA-Drew-Young.png',
  },
  {
    name: 'Gabriela Fernandez',
    src: '/template-assets/DATA-Gabriela-Fernandez.png',
  },
  {
    name: 'Jihoo Song',
    src: '/template-assets/DATA-Jihoo-Song.png',
  },
  {
    name: 'Nam Tran',
    src: '/template-assets/DATA-Nam-Tran.png',
  },
];

export default function AvatarGroupBlock() {
  return (
    <Stack direction="vertical" gap={8}>
      <Stack direction="vertical" gap={3}>
        <Text type="supporting" color="secondary">
          Team members
        </Text>
        <AvatarGroup size="lg">
          {USERS.map(user => (
            <Avatar key={user.name} src={user.src} name={user.name} />
          ))}
          <AvatarGroupOverflow count={3} />
        </AvatarGroup>
      </Stack>
      <Stack direction="vertical" gap={3}>
        <Text type="supporting" color="secondary">
          Larger group
        </Text>
        <AvatarGroup size="lg">
          {USERS.slice(0, 3).map(user => (
            <Avatar key={user.name} src={user.src} name={user.name} />
          ))}
          <AvatarGroupOverflow count={8} />
        </AvatarGroup>
      </Stack>
    </Stack>
  );
}
