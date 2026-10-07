'use client';

import {Stack, StackItem} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';
import {Button} from '@solo/core/Button';
import {Avatar} from '@solo/core/Avatar';

const USERS = [
  {name: 'Olivia Chen', role: 'Engineering Lead'},
  {name: 'Marcus Rivera', role: 'Product Designer'},
  {name: 'Aisha Patel', role: 'Marketing Manager'},
];

export default function StackFillItem() {
  return (
    <Stack direction="vertical" gap={3} width="100%" style={{maxWidth: 300}}>
      {USERS.map(user => (
        <Stack key={user.name} direction="horizontal" gap={3} vAlign="center">
          <StackItem size="static">
            <Avatar name={user.name} size="md" />
          </StackItem>
          <StackItem size="fill">
            <Stack direction="vertical" gap={0}>
              <Text type="body" weight="bold">
                {user.name}
              </Text>
              <Text type="supporting" color="secondary">
                {user.role}
              </Text>
            </Stack>
          </StackItem>
          <StackItem size="static">
            <Button label="View" variant="secondary" size="sm" />
          </StackItem>
        </Stack>
      ))}
    </Stack>
  );
}
