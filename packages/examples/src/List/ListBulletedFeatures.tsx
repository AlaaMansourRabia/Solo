'use client';

import {List, ListItem} from '@solo/core/List';

export default function ListBulletedFeatures() {
  return (
    <List listStyle="disc">
      <ListItem label="Accessible by default" />
      <ListItem label="Themeable with Tailwind CSS" />
      <ListItem label="Composable and extensible" />
    </List>
  );
}
