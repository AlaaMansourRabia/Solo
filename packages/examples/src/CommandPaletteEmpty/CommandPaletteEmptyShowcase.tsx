'use client';

import {useMemo} from 'react';
import {CommandPalette} from '@solo/core/CommandPalette';
import {Text} from '@solo/core/Text';
import {createStaticSource} from '@solo/core/Typeahead';

export default function CommandPaletteEmptyShowcase() {
  const emptySource = useMemo(() => createStaticSource([]), []);

  return (
    <CommandPalette
      isOpen
      isInline
      onOpenChange={() => {}}
      searchSource={emptySource}
      emptyBootstrapText={
        <Text type="supporting" color="secondary">
          No commands available yet
        </Text>
      }
    />
  );
}
