'use client';

import {Banner} from '@solo/core/Banner';
import {Button} from '@solo/core/Button';
import {List, ListItem} from '@solo/core/List';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function BannerCollapsibleContent() {
  return (
    <Banner
      status="warning"
      title="Configuration changes detected"
      description="Review the changes before they take effect."
      endContent={<Button label="Review" variant="secondary" size="sm" />}
      isDismissable
      collapsible={{defaultIsOpen: true}}>
      <Stack direction="vertical" gap={2}>
        <Text type="supporting" color="secondary">
          Changed settings:
        </Text>
        <List density="compact">
          <ListItem label="Authentication method updated" />
          <ListItem label="Rate limits modified" />
        </List>
      </Stack>
    </Banner>
  );
}
