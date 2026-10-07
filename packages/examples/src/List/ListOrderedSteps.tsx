'use client';

import {List, ListItem} from '@solo/core/List';

export default function ListOrderedSteps() {
  return (
    <List listStyle="decimal">
      <ListItem
        label="Install the package"
        description="npm install @solo/core"
      />
      <ListItem
        label="Import components"
        description="import { List } from '@solo/core'"
      />
      <ListItem
        label="Start building"
        description="Use components in your app"
      />
    </List>
  );
}
