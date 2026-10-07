'use client';

import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
  LayoutPanel,
  HStack,
  VStack,
} from '@solo/core/Layout';
import {Section} from '@solo/core/Section';
import {Text, Heading} from '@solo/core/Text';
import {Button} from '@solo/core/Button';
import {Badge} from '@solo/core/Badge';
import {List, ListItem} from '@solo/core/List';

export default function LayoutShowcase() {
  return (
    <Section padding={4}>
      <Layout
        height="fill"
        header={
          <LayoutHeader hasDivider>
            <HStack gap={2} vAlign="center">
              <Heading level={4}>Projects</Heading>
              <Badge variant="info" label="3 active" />
            </HStack>
          </LayoutHeader>
        }
        start={
          <LayoutPanel hasDivider width={140}>
            <List>
              <ListItem label="Dashboard" isSelected />
              <ListItem label="Analytics" />
              <ListItem label="Settings" />
            </List>
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <VStack gap={2}>
              <Heading level={5}>Welcome back</Heading>
              <Text type="body" color="secondary">
                You have 3 active projects and 2 pending reviews.
              </Text>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2} hAlign="end">
              <Button label="New Project" variant="primary">
                New Project
              </Button>
            </HStack>
          </LayoutFooter>
        }
      />
    </Section>
  );
}
