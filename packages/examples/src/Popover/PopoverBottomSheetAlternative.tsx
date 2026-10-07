'use client';

import {useState} from 'react';
import {CalendarIcon, TagIcon, UserIcon} from '@heroicons/react/24/outline';
import {BottomSheet} from '@solo/core/BottomSheet';
import {Button} from '@solo/core/Button';
import {Icon} from '@solo/core/Icon';
import {List, ListItem} from '@solo/core/List';
import {VStack} from '@solo/core/Layout';
import {Section} from '@solo/core/Section';
import {Heading, Text} from '@solo/core/Text';

const styles = {
  // Match the unchanged spacious ListItem inset so the title and description
  // align with the action icons.
  header: 'ms-(--spacing-3)',
} as const;

const PROJECT_ACTIONS = [
  [UserIcon, 'Assign owner', 'Route follow-up to a teammate.'],
  [TagIcon, 'Add label', 'Group this item with related work.'],
  [CalendarIcon, 'Set due date', 'Pick a reminder for review.'],
] as const;

export default function PopoverBottomSheetAlternative() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button label="Open project actions" onClick={() => setIsOpen(true)}>
        Open project actions
      </Button>
      <BottomSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        label="Project actions"
        height="hug">
        <Section paddingBlock={4} paddingInline={1}>
          <VStack gap={3}>
            <VStack gap={1} className={styles.header}>
              <Heading level={3}>Project actions</Heading>
              <Text type="supporting" color="secondary">
                Use this modal touch surface when the task should move away from
                its trigger and stay close to the bottom edge.
              </Text>
            </VStack>
            <List density="spacious">
              {PROJECT_ACTIONS.map(([icon, label, description]) => (
                <ListItem
                  key={label}
                  label={label}
                  description={description}
                  startContent={
                    <Icon icon={icon} size="md" color="secondary" />
                  }
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </List>
          </VStack>
        </Section>
      </BottomSheet>
    </>
  );
}
