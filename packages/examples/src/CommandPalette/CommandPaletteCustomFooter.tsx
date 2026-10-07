'use client';

import {useMemo} from 'react';
import {
  CommandPalette,
  CommandPaletteFooter,
} from '@solo/core/CommandPalette';
import {Text} from '@solo/core/Text';
import {createStaticSource} from '@solo/core/Typeahead';

export default function CommandPaletteCustomFooter() {
  const source = useMemo(
    () =>
      createStaticSource([
        {id: 'home', label: 'Home'},
        {id: 'settings', label: 'Settings'},
      ]),
    [],
  );

  return (
    <CommandPalette
      isOpen
      isInline
      onOpenChange={() => {}}
      searchSource={source}
      footer={
        <CommandPaletteFooter>
          <Text type="supporting">Pro tip: use ⌘K to open anywhere</Text>
        </CommandPaletteFooter>
      }
    />
  );
}
