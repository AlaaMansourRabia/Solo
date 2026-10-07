'use client';

import {OverflowList} from '@solo/core/OverflowList';
import {Button} from '@solo/core/Button';
import {Card} from '@solo/core/Card';
import {Center} from '@solo/core/Center';

export default function OverflowListCollapseFromStartList() {
  return (
    <Center width={300}>
      <Card padding={2}>
        <OverflowList
          gap={2}
          collapseFrom="start"
          overflowRenderer={overflowItems => (
            <Button
              label={`+${overflowItems.length} more`}
              variant="ghost"
              size="sm"
            />
          )}>
          <Button label="Step 1" size="sm" />
          <Button label="Step 2" size="sm" />
          <Button label="Step 3" size="sm" />
          <Button label="Step 4" size="sm" />
          <Button label="Step 5" size="sm" />
        </OverflowList>
      </Card>
    </Center>
  );
}
