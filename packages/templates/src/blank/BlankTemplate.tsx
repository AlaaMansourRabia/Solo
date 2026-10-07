'use client';

import {Layout, LayoutContent} from '@solo/core';
import {Text} from '@solo/core';

export default function BlankTemplate() {
  return (
    <Layout
      content={
        <LayoutContent>
          <Text type="large">New Page</Text>
        </LayoutContent>
      }
    />
  );
}
