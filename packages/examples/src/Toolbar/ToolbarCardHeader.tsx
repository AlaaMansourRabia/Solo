'use client';

import {Toolbar} from '@solo/core/Toolbar';
import {Button} from '@solo/core/Button';
import {Icon} from '@solo/core/Icon';
import {Heading} from '@solo/core/Text';
import {Card} from '@solo/core/Card';
import {Section} from '@solo/core/Section';
import {FunnelIcon, PlusIcon} from '@heroicons/react/24/outline';

export default function ToolbarCardHeader() {
  return (
    <Card style={{width: 500, height: '100%', marginTop: 260}}>
      <Toolbar
        label="User list actions"
        size="sm"
        dividers={['bottom']}
        startContent={<Heading level={4}>Card title</Heading>}
        endContent={
          <>
            <Button
              label="Filter"
              variant="ghost"
              icon={<Icon icon={FunnelIcon} />}
              isIconOnly
            />
            <Button
              label="Add user"
              icon={<Icon icon={PlusIcon} />}
              isIconOnly
            />
          </>
        }
      />
      <Section />
    </Card>
  );
}
