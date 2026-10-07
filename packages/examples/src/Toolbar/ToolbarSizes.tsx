'use client';

import {Toolbar} from '@solo/core/Toolbar';
import {Button} from '@solo/core/Button';
import {Icon} from '@solo/core/Icon';
import {Heading} from '@solo/core/Text';
import {Stack} from '@solo/core/Layout';
import {Card} from '@solo/core/Card';
import {FunnelIcon, PlusIcon} from '@heroicons/react/24/outline';

const SIZES = [
  {size: 'sm' as const, label: 'Small'},
  {size: 'md' as const, label: 'Medium'},
  {size: 'lg' as const, label: 'Large'},
];

export default function ToolbarSizes() {
  return (
    <Stack direction="vertical" gap={4} style={{width: 500}}>
      {SIZES.map(({size, label}) => (
        <Card key={size}>
          <Toolbar
            label={`${label} toolbar`}
            size={size}
            startContent={<Heading level={4}>{label}</Heading>}
            endContent={
              <>
                <Button
                  label="Filter"
                  variant="ghost"
                  icon={<Icon icon={FunnelIcon} />}
                  isIconOnly
                />
                <Button label="Add" icon={<Icon icon={PlusIcon} />} />
              </>
            }
          />
        </Card>
      ))}
    </Stack>
  );
}
