'use client';

import {useRef, useState} from 'react';
import {BaseTypeahead, createStaticSource} from '@solo/core/Typeahead';
import type {SearchableItem} from '@solo/core/Typeahead';
import {Icon} from '@solo/core/Icon';
import {HStack, VStack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';
import {cn} from '@solo/core/utils/cn';
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';

const frameworks: SearchableItem[] = [
  {id: 'react', label: 'React'},
  {id: 'vue', label: 'Vue'},
  {id: 'angular', label: 'Angular'},
  {id: 'svelte', label: 'Svelte'},
  {id: 'solid', label: 'SolidJS'},
  {id: 'remix', label: 'Remix'},
  {id: 'next', label: 'Next.js'},
  {id: 'nuxt', label: 'Nuxt'},
];

const source = createStaticSource(frameworks);

const styles = {
  root: 'w-full max-w-[360px]',
  field: cn(
    'bg-(--color-background-surface) border-(--color-border) rounded-(--radius-element)',
    '[border-style:solid] [border-width:var(--border-width)]',
    'py-(--spacing-1-5) px-(--spacing-2)',
    '[outline-color:transparent] has-[input:focus-visible]:[outline-color:var(--focus-outline-color)]',
    '[outline-offset:var(--focus-outline-offset)] [outline-style:solid]',
    '[outline-width:0] has-[input:focus-visible]:[outline-width:var(--focus-outline-width)]',
  ),
} as const;

export default function BaseTypeaheadCustomSearch() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <VStack gap={3} className={styles.root}>
      <HStack ref={wrapperRef} gap={2} vAlign="center" className={styles.field}>
        <Icon icon={MagnifyingGlassIcon} size="sm" color="secondary" />
        <BaseTypeahead
          aria-label="Search frameworks"
          searchSource={source}
          value={value}
          onChange={setValue}
          anchorRef={wrapperRef}
          placeholder="Search frameworks…"
          hasEntriesOnFocus
          debounceMs={0}
        />
      </HStack>
      <Text type="supporting" color="secondary">
        {value != null ? `Selected: ${value.label}` : 'No selection'}
      </Text>
    </VStack>
  );
}
