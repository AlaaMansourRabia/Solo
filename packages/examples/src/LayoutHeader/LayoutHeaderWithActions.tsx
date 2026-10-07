'use client';

import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Card,
  HStack,
} from '@solo/core/Layout';
import {Center} from '@solo/core/Center';
import {Heading} from '@solo/core/Text';
import {Button} from '@solo/core/Button';

export default function LayoutHeaderWithActions() {
  return (
    <Center width={400}>
      <Layout
        style={{width: '100%'}}
        height="fill"
        header={
          <LayoutHeader hasDivider>
            <HStack gap={2} vAlign="center" hAlign="between">
              <Heading level={4}>Dashboard</Heading>
              <Button label="New Item" variant="primary">
                New Item
              </Button>
            </HStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <Card variant="muted" />
          </LayoutContent>
        }
      />
    </Center>
  );
}
