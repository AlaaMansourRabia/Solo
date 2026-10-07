'use client';

import {Fragment} from 'react';
import {Divider} from '@solo/core/Divider';
import {useContainerReveal} from '@solo/core/hooks';
import {Icon} from '@solo/core/Icon';
import {IconButton} from '@solo/core/IconButton';
import {Item} from '@solo/core/Item';
import {HStack} from '@solo/core/Layout';
import {mergeProps} from '@solo/core/utils';
import {cn} from '@solo/core/utils/cn';
import {DocumentIcon, PlusIcon, XMarkIcon} from '@heroicons/react/24/outline';

const TABS = [
  {name: 'Project brief', isActive: true},
  {name: 'Research notes', isActive: false},
  {name: 'Interaction prototype', isActive: false},
];

const styles = {
  strip: 'min-w-0 shrink [scrollbar-width:none]',
  rule: 'h-[16px]',
  hidden: 'invisible',
  tab: 'shrink w-[164px] min-w-[96px]',
  action: '[margin:calc(-1*var(--spacing-1))] [transition-property:none]',
} as const;
function DocumentTab({name, isActive}: (typeof TABS)[number]) {
  const {getContainerProps, getContentRevealProps} = useContainerReveal();
  const containerProps = getContainerProps();
  const revealProps = getContentRevealProps({
    forceVisibility: isActive ? 'shown' : undefined,
    isLayoutPreserved: true,
  });
  return (
    <Item
      label={name}
      density="compact"
      isSelected={isActive}
      onClick={() => {}}
      aria-current={isActive ? 'true' : undefined}
      {...containerProps}
      startContent={
        <Icon
          icon={DocumentIcon}
          size="sm"
          color={isActive ? 'primary' : 'secondary'}
        />
      }
      endContent={
        <IconButton
          label={`Close ${name}`}
          variant="ghost"
          size="sm"
          icon={<Icon icon={XMarkIcon} size="sm" />}
          {...mergeProps(revealProps, styles.action)}
        />
      }
      className={cn(containerProps.className, styles.tab)}
    />
  );
}

export default function ItemDocumentTabs() {
  return (
    <HStack width="100%" maxWidth={600} gap={0.5} vAlign="center">
      <HStack
        role="group"
        aria-label="Open documents"
        vAlign="center"
        paddingInline={2}
        paddingBlock={1}
        isScrollable
        className={styles.strip}>
        {TABS.map((tab, index) => (
          <Fragment key={tab.name}>
            {index > 0 ? (
              <Divider
                orientation="vertical"
                className={cn(
                  styles.rule,
                  (TABS[index - 1]?.isActive || tab.isActive) && styles.hidden,
                )}
              />
            ) : null}
            <DocumentTab {...tab} />
          </Fragment>
        ))}
      </HStack>
      <IconButton
        label="New document"
        tooltip="New document"
        variant="ghost"
        size="sm"
        icon={<Icon icon={PlusIcon} size="sm" color="secondary" />}
      />
    </HStack>
  );
}
