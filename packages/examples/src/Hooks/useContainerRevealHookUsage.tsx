'use client';

import {useContainerReveal} from '@solo/core/hooks';
import {Button} from '@solo/core/Button';
import {Card} from '@solo/core/Card';
import {Icon} from '@solo/core/Icon';
import {Item} from '@solo/core/Item';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';
import {mergeProps} from '@solo/core/utils';
import {PencilIcon, TrashIcon} from '@heroicons/react/24/outline';

const styles = {
  actions: 'flex gap-[4px]',
  intro: 'px-[12px] pb-[8px]',
} as const;

function FileRow({name}: {name: string}) {
  // Destructure the two prop getters. Spreading getContainerProps() on the row
  // gives it a scoped hover/focus-within trigger; getContentRevealProps() hides
  // the actions at rest and reveals them when the row is hovered or focused.
  const {getContainerProps, getContentRevealProps} = useContainerReveal();

  return (
    <Item
      label={name}
      description="Edited 2 hours ago"
      endContent={
        <span
          {...mergeProps(getContentRevealProps(), styles.actions)}>
          <Button
            label={`Edit ${name}`}
            variant="ghost"
            isIconOnly
            icon={<Icon icon={PencilIcon} size="sm" />}
          />
          <Button
            label={`Delete ${name}`}
            variant="ghost"
            isIconOnly
            icon={<Icon icon={TrashIcon} size="sm" />}
          />
        </span>
      }
      {...getContainerProps()}
    />
  );
}

export default function UseContainerRevealHookUsage() {
  return (
    <Card width={420} padding={2}>
      <Stack gap={0}>
        <Text type="supporting" color="secondary" className={styles.intro}>
          Hover a row — or Tab into it — to reveal its actions. On touch they
          stay visible.
        </Text>
        <FileRow name="report.pdf" />
        <FileRow name="budget.xlsx" />
        <FileRow name="notes.txt" />
      </Stack>
    </Card>
  );
}
