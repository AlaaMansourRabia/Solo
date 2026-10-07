'use client';

import {Avatar} from '@solo/core/Avatar';
import {Badge} from '@solo/core/Badge';
import {Icon} from '@solo/core/Icon';
import {List, ListItem} from '@solo/core/List';

export default function ListItemWithMedia() {
  return (
    <List header="Team" hasDividers>
      <ListItem
        label="Ada Lovelace"
        description="Design systems engineer"
        startContent={<Avatar name="Ada Lovelace" size="sm" />}
        endContent={<Badge label="Owner" variant="purple" />}
        onClick={() => {}}
      />
      <ListItem
        label="Grace Hopper"
        description="Platform infrastructure"
        startContent={<Avatar name="Grace Hopper" size="sm" />}
        endContent={<Badge label="On call" variant="blue" />}
        onClick={() => {}}
      />
      <ListItem
        label="Invite teammate"
        description="Send an invitation to collaborate"
        startContent={<Icon icon="info" size="sm" color="secondary" />}
        onClick={() => {}}
      />
    </List>
  );
}
