'use client';

import {useRef, useState} from 'react';
import {BaseTypeahead, createStaticSource} from '@solo/core/Typeahead';
import type {SearchableItem} from '@solo/core/Typeahead';
import {VStack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';
import {cn} from '@solo/core/utils/cn';

const frameworks: SearchableItem[] = [
  {id: 'react', label: 'React', auxiliaryData: {category: 'UI library'}},
  {id: 'remix', label: 'Remix', auxiliaryData: {category: 'Web framework'}},
  {id: 'next', label: 'Next.js', auxiliaryData: {category: 'Web framework'}},
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
  result: 'min-w-0',
} as const;

export default function BaseTypeaheadCustomResults() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <VStack gap={3} className={styles.root}>
      <div ref={wrapperRef} className={styles.field}>
        <BaseTypeahead
          aria-label="Search frameworks"
          searchSource={source}
          value={value}
          onChange={setValue}
          anchorRef={wrapperRef}
          placeholder="Search frameworks…"
          hasEntriesOnFocus
          debounceMs={0}
          renderItem={item => (
            <VStack gap={0} className={styles.result}>
              <Text type="label">{item.label}</Text>
              <Text type="supporting" color="secondary">
                {
                  (item.auxiliaryData as {category?: string} | undefined)
                    ?.category
                }
              </Text>
            </VStack>
          )}
        />
      </div>
    </VStack>
  );
}
