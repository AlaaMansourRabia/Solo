'use client';

import {useState} from 'react';
import {BottomSheet} from '@solo/core/BottomSheet';
import {Button} from '@solo/core/Button';
import {Divider} from '@solo/core/Divider';
import {Heading} from '@solo/core/Heading';
import {Section} from '@solo/core/Section';
import {VStack} from '@solo/core/Stack';
import {Text} from '@solo/core/Text';

export default function BottomSheetNoScrim() {
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundClicks, setBackgroundClicks] = useState(0);

  return (
    <Section padding={4}>
      <VStack gap={3}>
        <Heading level={3}>Nearby places</Heading>
        <Text type="body">Background interactions: {backgroundClicks}</Text>
        <Button
          label="Interact with page"
          variant="secondary"
          onClick={() => setBackgroundClicks(count => count + 1)}
        />
        <Button label="Show place details" onClick={() => setIsOpen(true)} />
      </VStack>
      <BottomSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        label="Place details"
        height="hug"
        hasScrim={false}>
        <VStack gap={4} style={{padding: 'var(--spacing-4)'}}>
          <Heading level={3}>Central Park</Heading>
          <Divider />
          <Text type="body">
            The page remains visible and interactive behind this sheet.
          </Text>
          <Button label="Close details" onClick={() => setIsOpen(false)} />
        </VStack>
      </BottomSheet>
    </Section>
  );
}
