'use client';

import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
  LayoutPanel,
  Card,
  HStack,
} from '@solo/core/Layout';
import {Center} from '@solo/core/Center';
import {Heading} from '@solo/core/Text';
import {Button} from '@solo/core/Button';

export default function LayoutHeaderShowcase() {
  return (
    <Center width={400}>
      <Layout
        style={{width: '100%'}}
        height="fill"
        header={
          <LayoutHeader hasDivider>
            <HStack gap={2} vAlign="center" hAlign="between">
              <Heading level={4}>Dashboard</Heading>
              <HStack gap={2}>
                <Button label="Export" variant="secondary">
                  Export
                </Button>
                <Button label="New Item" variant="primary">
                  New Item
                </Button>
              </HStack>
            </HStack>
          </LayoutHeader>
        }
        start={
          <LayoutPanel hasDivider width={140}>
            <Card variant="muted" />
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <Card variant="muted" />
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <Card variant="muted" />
          </LayoutFooter>
        }
      />
    </Center>
  );
}
