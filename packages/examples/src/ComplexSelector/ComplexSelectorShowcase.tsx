'use client';

import {useEffect, useState} from 'react';
import {ComplexSelector} from '@solo/core/ComplexSelector';
import {Text} from '@solo/core/Text';
import {useGridFocus} from '@solo/core/hooks';
import {cn} from '@solo/core/utils/cn';

type Fruit = 'Apple' | 'Pear' | 'Peach' | 'Plum';
type Ripeness = 'Crisp' | 'Tender' | 'Juicy' | 'Peak';

interface FruitValue {
  fruit: Fruit;
  ripeness: Ripeness;
}

const fruits: Array<{id: Fruit; emoji: string; description: string}> = [
  {id: 'Apple', emoji: '🍎', description: 'Bright and balanced'},
  {id: 'Pear', emoji: '🍐', description: 'Soft floral sweetness'},
  {id: 'Peach', emoji: '🍑', description: 'Round summer flavor'},
  {id: 'Plum', emoji: '🟣', description: 'Jammy and tart'},
];

const ripenessLevels: Array<{
  id: Ripeness;
  shortLabel: string;
  description: string;
}> = [
  {id: 'Crisp', shortLabel: 'C', description: 'Snappy bite'},
  {id: 'Tender', shortLabel: 'T', description: 'Easy bite'},
  {id: 'Juicy', shortLabel: 'J', description: 'Full juice'},
  {id: 'Peak', shortLabel: 'P', description: 'Most intense'},
];

const GRID_CELL_SELECTOR = '[role="gridcell"]';

const styles = {
  grid: 'flex flex-col gap-(--spacing-1) min-w-[280px]',
  row: 'grid [grid-template-columns:minmax(150px,1fr)_repeat(4,44px)] items-center gap-x-(--spacing-1)',
  rowHeader: 'flex items-center gap-(--spacing-2) text-start min-w-0',
  emoji: 'text-[18px] shrink-0',
  fruitText: 'flex flex-col min-w-0',
  cell: cn(
    'flex items-center justify-center h-[36px]',
    '[border-width:var(--border-width)] [border-style:solid] border-(--color-border)',
    'rounded-(--radius-container) bg-(--color-background-card) text-(--color-text-secondary)',
    '[font-family:inherit] cursor-pointer',
    'can-hover:hover:border-(--color-border-emphasized) can-hover:hover:text-(--color-text-primary)',
  ),
  // Overrides the hover colors too, so hover keeps the selected look.
  cellSelected: cn(
    'border-(--color-accent) bg-(--color-accent) text-(--color-on-accent)',
    'can-hover:hover:border-(--color-accent) can-hover:hover:text-(--color-on-accent)',
  ),
} as const;

function FruitRipenessGrid({
  value,
  onChange,
}: {
  value: FruitValue;
  onChange: (value: FruitValue) => void;
}) {
  const {gridRef, handleKeyDown, handleFocus, focusCell} =
    useGridFocus<HTMLDivElement>({
      columns: ripenessLevels.length,
      cellSelector: GRID_CELL_SELECTOR,
      hasRovingTabIndex: true,
    });

  useEffect(() => {
    const rowIndex = fruits.findIndex(f => f.id === value.fruit);
    const columnIndex = ripenessLevels.findIndex(l => l.id === value.ripeness);
    requestAnimationFrame(() => {
      focusCell(
        rowIndex >= 0 && columnIndex >= 0
          ? rowIndex * ripenessLevels.length + columnIndex
          : 0,
      );
    });
  }, [focusCell, value]);

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label="Fruit ripeness choices"
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      className={styles.grid}>
      {fruits.map(fruit => (
        <div key={fruit.id} role="row" className={styles.row}>
          <div role="rowheader" className={styles.rowHeader}>
            <span aria-hidden="true" className={styles.emoji}>
              {fruit.emoji}
            </span>
            <span className={styles.fruitText}>
              <Text type="body">{fruit.id}</Text>
              <Text type="supporting" color="secondary">
                {fruit.description}
              </Text>
            </span>
          </div>
          {ripenessLevels.map(level => {
            const isSelected =
              value.fruit === fruit.id && value.ripeness === level.id;
            return (
              <button
                key={`${fruit.id}-${level.id}`}
                type="button"
                role="gridcell"
                aria-label={`${fruit.id}, ${level.id}: ${level.description}`}
                aria-selected={isSelected || undefined}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onChange({fruit: fruit.id, ripeness: level.id})}
                className={cn(styles.cell, isSelected && styles.cellSelected)}>
                {level.shortLabel}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function ComplexSelectorShowcase() {
  const [value, setValue] = useState<FruitValue>({
    fruit: 'Apple',
    ripeness: 'Juicy',
  });

  return (
    <ComplexSelector<FruitValue>
      label="Fruit blend"
      description="Choose a fruit and ripeness in one control. Arrow keys move across the grid."
      value={value}
      onChange={setValue}
      triggerLabel={`${value.fruit} · ${value.ripeness}`}
      style={{width: 280}}>
      {(selectedValue, onChange, close) => (
        <FruitRipenessGrid
          value={selectedValue}
          onChange={nextValue => {
            onChange(nextValue);
            close();
          }}
        />
      )}
    </ComplexSelector>
  );
}
