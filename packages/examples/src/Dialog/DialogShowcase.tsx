'use client';

import {Dialog, DialogHeader} from '@solo/core/Dialog';
import {Layout, LayoutContent} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

// Remove isInline for production — dialogs should be modal.
export default function DialogShowcase() {
  return (
    <Dialog isOpen isInline onOpenChange={() => {}}>
      <Layout
        header={<DialogHeader title="Modal Title" onOpenChange={() => {}} />}
        content={
          <LayoutContent>
            <Text type="body">Dialog content goes here.</Text>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}
