'use client';

import {useState} from 'react';
import {DropdownMenu} from '@solo/core/DropdownMenu';
import {VStack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function DropdownMenuWithDisabledItems() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <VStack gap={3}>
      <DropdownMenu
        button={{label: 'Manage team'}}
        items={[
          {label: 'Invite member', onClick: () => setLastAction('Invite')},
          {label: 'Edit roles', onClick: () => setLastAction('Edit roles')},
          {type: 'divider'},
          {label: 'Transfer ownership', isDisabled: true},
          {label: 'Delete team', isDisabled: true},
        ]}
      />
      {lastAction && (
        <Text type="supporting" color="secondary">
          Last action: {lastAction}
        </Text>
      )}
      <Text type="supporting" color="secondary">
        Destructive actions are disabled for non-admin users
      </Text>
    </VStack>
  );
}
