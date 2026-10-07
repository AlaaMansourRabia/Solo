/**
 * @file ComplexSelector.stories.tsx
 * @input Uses React state, Solo primitives, and ComplexSelector
 * @output Storybook examples for rich selector surfaces and trigger variants
 * @position Core component stories and visual integration coverage
 *
 * SYNC: When modified, update:
 * - /packages/core/src/ComplexSelector/ComplexSelector.tsx
 * - /packages/core/src/ComplexSelector/ComplexSelector.doc.mjs
 * - /packages/core/src/ComplexSelector/ComplexSelector.test.tsx
 */

import type {Meta, StoryObj} from '@storybook/react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {cn} from '@solo/core/utils/cn';
import {
  ComplexSelector,
  type ComplexSelectorHandle,
} from '@solo/core/ComplexSelector';
import {Button} from '@solo/core/Button';
import {Text} from '@solo/core/Text';
import {TextInput} from '@solo/core/TextInput';
import {HStack, VStack} from '@solo/core/Layout';
import {Token} from '@solo/core/Token';
import {TreeList, type TreeListItemData} from '@solo/core/TreeList';
import {useGridFocus} from '@solo/core/hooks';

const GRID_CELL_SELECTOR = '[role="gridcell"]';

const meta: Meta<typeof ComplexSelector> = {
  title: 'Core/ComplexSelector',
  component: ComplexSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A high-level selector shell for rich custom content. The component owns the field, trigger, popover, focus restore, and async changeAction flow while consumers render the content. Its sm, md, and lg triggers use the 28px, 32px, and 36px element-height tokens. Custom content should use Solo focus hooks where appropriate and be evaluated against WCAG 2.2.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComplexSelector>;

type Fruit = 'Apple' | 'Pear' | 'Peach' | 'Plum';
type Ripeness = 'Crisp' | 'Tender' | 'Juicy' | 'Peak';

type FruitValue = {
  fruit: Fruit;
  ripeness: Ripeness;
};

const fruits: Array<{
  id: Fruit;
  emoji: string;
  description: string;
}> = [
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

type DestinationValue = {
  id: string;
  label: string;
  path: string;
};

interface DestinationNode {
  id: string;
  label: string;
  path: string;
  kind: 'folder' | 'space' | 'team';
  isExpanded?: boolean;
  children?: DestinationNode[];
}

const destinationTree: DestinationNode[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    path: '/Workspace',
    kind: 'space',
    children: [
      {
        id: 'workspace-research',
        label: 'Research',
        path: '/Workspace/Research',
        kind: 'folder',
        children: [
          {
            id: 'workspace-research-field-notes',
            label: 'Field notes',
            path: '/Workspace/Research/Field notes',
            kind: 'folder',
          },
          {
            id: 'workspace-research-interviews',
            label: 'Interviews',
            path: '/Workspace/Research/Interviews',
            kind: 'folder',
          },
        ],
      },
      {
        id: 'workspace-roadmap',
        label: 'Roadmap',
        path: '/Workspace/Roadmap',
        kind: 'folder',
      },
    ],
  },
  {
    id: 'teams',
    label: 'Teams',
    path: '/Teams',
    kind: 'space',
    children: [
      {
        id: 'teams-design-systems',
        label: 'Design systems',
        path: '/Teams/Design systems',
        kind: 'team',
        children: [
          {
            id: 'teams-design-systems-components',
            label: 'Components',
            path: '/Teams/Design systems/Components',
            kind: 'folder',
          },
          {
            id: 'teams-design-systems-accessibility',
            label: 'Accessibility',
            path: '/Teams/Design systems/Accessibility',
            kind: 'folder',
          },
        ],
      },
      {
        id: 'teams-growth',
        label: 'Growth',
        path: '/Teams/Growth',
        kind: 'team',
      },
    ],
  },
  {
    id: 'archive',
    label: 'Archive',
    path: '/Archive',
    kind: 'space',
    children: [
      {
        id: 'archive-2025',
        label: '2025 projects',
        path: '/Archive/2025 projects',
        kind: 'folder',
      },
    ],
  },
];

const categoryTree: DestinationNode[] = [
  {
    id: 'produce',
    label: 'Produce',
    path: 'Produce',
    kind: 'space',
    children: [
      {
        id: 'produce-fruit',
        label: 'Fruit',
        path: 'Produce / Fruit',
        kind: 'folder',
        children: [
          {
            id: 'produce-fruit-citrus',
            label: 'Citrus',
            path: 'Produce / Fruit / Citrus',
            kind: 'folder',
          },
          {
            id: 'produce-fruit-stone',
            label: 'Stone fruit',
            path: 'Produce / Fruit / Stone fruit',
            kind: 'folder',
          },
        ],
      },
      {
        id: 'produce-vegetables',
        label: 'Vegetables',
        path: 'Produce / Vegetables',
        kind: 'folder',
      },
    ],
  },
  {
    id: 'pantry',
    label: 'Pantry',
    path: 'Pantry',
    kind: 'space',
    children: [
      {
        id: 'pantry-grains',
        label: 'Grains',
        path: 'Pantry / Grains',
        kind: 'folder',
      },
      {
        id: 'pantry-snacks',
        label: 'Snacks',
        path: 'Pantry / Snacks',
        kind: 'folder',
      },
    ],
  },
];

const styles = {
  wrapper: 'w-[340px]',
  fruitContent: 'w-[500px] p-(--spacing-2)',
  treeContent: 'w-[420px] p-(--spacing-3)',
  intro: 'mbe-(--spacing-3)',
  thinkingSurface: 'flex flex-col gap-(--spacing-1)',
  thinkingRow: cn(
    'grid [grid-template-columns:minmax(156px,1fr)_repeat(4,56px)] items-center',
    'gap-x-(--spacing-1) min-h-[48px] py-(--spacing-1) px-(--spacing-2)',
    'rounded-(--radius-container)',
    'bg-transparent can-hover:hover:bg-(--color-background-muted) focus-within:bg-(--color-background-muted)',
  ),
  fruitSummary: 'flex items-center gap-(--spacing-2) min-w-0',
  fruitEmoji: cn(
    'inline-flex items-center justify-center w-[28px] h-[28px]',
    'rounded-(--radius-full) bg-(--color-background-muted) text-[length:17px] shrink-0',
  ),
  fruitText: 'flex flex-col min-w-0',
  fruitName: cn(
    'text-(--color-text-primary) text-(length:--text-label-size) font-(number:--font-weight-semibold)',
    'overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  fruitDescription: cn(
    'text-(--color-text-secondary) text-(length:--text-supporting-size)',
    'overflow-hidden text-ellipsis whitespace-nowrap',
  ),
  levelButton: cn(
    '[border-width:var(--border-width)] [border-style:solid] border-(--color-border)',
    'rounded-(--radius-full) bg-(--color-background-card) text-(--color-text-secondary)',
    'min-h-[30px] px-(--spacing-2) [font-family:inherit]',
    'text-(length:--text-supporting-size) font-(number:--font-weight-medium)',
    'cursor-pointer opacity-[0.68]',
    '[transition-property:opacity,background-color,border-color,color,box-shadow]',
    '[transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-standard)]',
    '[outline:none] focus-visible:[outline:2px_solid_var(--color-accent)] [outline-offset:2px]',
    'can-hover:hover:opacity-100 can-hover:hover:border-(--color-border-emphasized) can-hover:hover:text-(--color-text-primary)',
  ),
  // Overriding a property does not touch its hover arms, so they are
  // restated with the selected values.
  selectedLevelButton: cn(
    'opacity-100 border-(--color-accent) bg-(--color-accent) text-(--color-on-accent)',
    '[box-shadow:var(--shadow-low)]',
    'can-hover:hover:opacity-100 can-hover:hover:border-(--color-accent) can-hover:hover:text-(--color-on-accent)',
  ),
  keyboardHint: cn(
    'mbs-(--spacing-3) pbs-(--spacing-3)',
    '[border-block-start-width:var(--border-width)] [border-block-start-style:solid] [border-block-start-color:var(--color-border)]',
  ),
  searchArea: 'mbe-(--spacing-3)',
  treePanel: cn(
    'max-h-[280px] overflow-auto',
    '[border-width:var(--border-width)] [border-style:solid] border-(--color-border)',
    'rounded-(--radius-container) p-(--spacing-1)',
  ),
  selectedSummary: cn(
    'mbs-(--spacing-3) pbs-(--spacing-3)',
    '[border-block-start-width:var(--border-width)] [border-block-start-style:solid] [border-block-start-color:var(--color-border)]',
  ),
  emptyState: 'p-(--spacing-3) text-(--color-text-secondary) text-center',
  toolbarDemo: cn(
    'flex items-center justify-end gap-(--spacing-1) w-[360px] p-(--spacing-1)',
    'rounded-(--radius-container) bg-(--color-background-muted)',
  ),
  toolbarContent: 'w-[280px] p-(--spacing-3)',
} as const;

function formatFruitValue(value: FruitValue) {
  return `${value.fruit} · ${value.ripeness}`;
}

function formatDestinationValue(value: DestinationValue) {
  return value.path;
}

function nodeMatchesQuery(node: DestinationNode, normalizedQuery: string) {
  return (
    node.label.toLowerCase().includes(normalizedQuery) ||
    node.path.toLowerCase().includes(normalizedQuery)
  );
}

function filterDestinationTree(
  nodes: DestinationNode[],
  query: string,
): DestinationNode[] {
  const normalizedQuery = query.trim().toLowerCase();
  const result: DestinationNode[] = [];

  for (const node of nodes) {
    const filteredChildren = node.children
      ? filterDestinationTree(node.children, query)
      : undefined;
    const isMatch =
      normalizedQuery.length === 0 || nodeMatchesQuery(node, normalizedQuery);

    if (!isMatch && (!filteredChildren || filteredChildren.length === 0)) {
      continue;
    }

    result.push({
      ...node,
      isExpanded: normalizedQuery.length > 0 || node.children != null,
      children: filteredChildren,
    });
  }

  return result;
}

function toTreeListItems(
  nodes: DestinationNode[],
  selectedId: string,
  onSelect: (value: DestinationValue) => void,
): TreeListItemData[] {
  return nodes.map(node => {
    const hasChildren = node.children != null && node.children.length > 0;
    return {
      id: node.id,
      label: node.label,
      description: node.path,
      isExpanded: hasChildren,
      isSelected: !hasChildren && node.id === selectedId,
      endContent:
        node.kind === 'team' ? (
          <Token label="Team" size="sm" color="blue" />
        ) : undefined,
      onClick: hasChildren
        ? undefined
        : () => onSelect({id: node.id, label: node.label, path: node.path}),
      children: hasChildren
        ? toTreeListItems(node.children ?? [], selectedId, onSelect)
        : undefined,
    };
  });
}

function FruitRipenessMatrix({
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
    const rowIndex = fruits.findIndex(fruit => fruit.id === value.fruit);
    const columnIndex = ripenessLevels.findIndex(
      level => level.id === value.ripeness,
    );
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
      className={styles.thinkingSurface}>
      {fruits.map(fruit => (
        <div key={fruit.id} role="row" className={styles.thinkingRow}>
          <div role="rowheader" className={styles.fruitSummary}>
            <span aria-hidden="true" className={styles.fruitEmoji}>
              {fruit.emoji}
            </span>
            <span className={styles.fruitText}>
              <span className={styles.fruitName}>{fruit.id}</span>
              <span className={styles.fruitDescription}>
                {fruit.description}
              </span>
            </span>
          </div>
          {ripenessLevels.map(level => {
            const nextValue = {fruit: fruit.id, ripeness: level.id};
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
                onClick={() => onChange(nextValue)}
                className={cn(styles.levelButton,
                  isSelected && styles.selectedLevelButton)}>
                {level.shortLabel}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function TreeSearchContent({
  label,
  value,
  tree,
  searchPlaceholder,
  onChange,
  close,
}: {
  label: string;
  value: DestinationValue;
  tree: DestinationNode[];
  searchPlaceholder: string;
  onChange: (value: DestinationValue) => void;
  close: () => void;
}) {
  const [query, setQuery] = useState('');
  const filteredTree = useMemo(
    () => filterDestinationTree(tree, query),
    [query, tree],
  );
  const treeItems = useMemo(
    () =>
      toTreeListItems(filteredTree, value.id, nextValue => {
        onChange(nextValue);
        close();
      }),
    [close, filteredTree, onChange, value.id],
  );

  return (
    <VStack gap={3}>
      <div className={styles.searchArea}>
        <TextInput
          label={`Search ${label}`}
          isLabelHidden
          value={query}
          onChange={setQuery}
          hasClear
          placeholder={searchPlaceholder}
        />
      </div>
      <div className={styles.treePanel}>
        {treeItems.length > 0 ? (
          <TreeList items={treeItems} density="compact" />
        ) : (
          <div role="status" className={styles.emptyState}>
            <Text type="supporting" color="secondary">
              No matching destinations.
            </Text>
          </div>
        )}
      </div>
      <div className={styles.selectedSummary}>
        <HStack gap={2} wrap="wrap">
          <Text type="supporting" color="secondary">
            Current:
          </Text>
          <Token label={value.path} size="sm" color="blue" />
        </HStack>
      </div>
    </VStack>
  );
}

export const FruitRipenessGrid: Story = {
  name: 'Fruit ripeness selector',
  render: () => {
    const [value, setValue] = useState<FruitValue>({
      fruit: 'Apple',
      ripeness: 'Juicy',
    });

    return (
      <VStack gap={4} className={styles.wrapper}>
        <ComplexSelector<FruitValue>
          label="Fruit blend"
          description="Choose a fruit and ripeness level in one selector. Arrow down preserves the ripeness column."
          value={value}
          onChange={setValue}
          triggerLabel={formatFruitValue(value)}
          contentClassName={styles.fruitContent}>
          {(selectedValue, onChange, close) => (
            <div>
              <div className={styles.intro}>
                <Text type="supporting" color="secondary">
                  Pick a blend profile. The compact pills mirror a hover-rich
                  selector while staying available to keyboard users.
                </Text>
              </div>

              <FruitRipenessMatrix
                value={selectedValue}
                onChange={nextValue => {
                  onChange(nextValue);
                  close();
                }}
              />

              <div className={styles.keyboardHint}>
                <HStack gap={2} wrap="wrap">
                  <Text type="supporting" color="secondary">
                    Try keyboard:
                  </Text>
                  <Text type="supporting">↓ from Apple J lands on Pear J.</Text>
                </HStack>
              </div>
            </div>
          )}
        </ComplexSelector>
      </VStack>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A fruit-themed stand-in for a rich two-axis selector. ComplexSelector owns the trigger, popover, focus restore, and change flow; the custom content owns its grid semantics.',
      },
    },
  },
};

export const TreeListWithSearch: Story = {
  name: 'Tree list with search',
  render: () => {
    const [value, setValue] = useState<DestinationValue>({
      id: 'teams-design-systems-accessibility',
      label: 'Accessibility',
      path: '/Teams/Design systems/Accessibility',
    });

    return (
      <VStack gap={4} className={styles.wrapper}>
        <ComplexSelector<DestinationValue>
          label="Project destination"
          description="Search and browse nested folders from one selector."
          value={value}
          onChange={setValue}
          triggerLabel={formatDestinationValue(value)}
          contentClassName={styles.treeContent}>
          {(selectedValue, onChange, close) => (
            <TreeSearchContent
              label="destinations"
              value={selectedValue}
              tree={destinationTree}
              searchPlaceholder="Search folders or teams"
              onChange={onChange}
              close={close}
            />
          )}
        </ComplexSelector>
      </VStack>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A complex selector that combines TextInput search with TreeList hierarchy. TreeList owns tree keyboard navigation while ComplexSelector owns the trigger and popover shell. Evaluate the composed content against WCAG 2.2 keyboard, focus, name/role, label, and contrast criteria.',
      },
    },
  },
};

export const CategoryTreeSelector: Story = {
  name: 'Category tree selector',
  render: () => {
    const [value, setValue] = useState<DestinationValue>({
      id: 'produce-fruit-citrus',
      label: 'Citrus',
      path: 'Produce / Fruit / Citrus',
    });

    return (
      <VStack gap={4} className={styles.wrapper}>
        <ComplexSelector<DestinationValue>
          label="Product category"
          description="Search or browse a category tree."
          value={value}
          onChange={setValue}
          triggerLabel={value.path}
          contentClassName={styles.treeContent}>
          {(selectedValue, onChange, close) => (
            <TreeSearchContent
              label="categories"
              value={selectedValue}
              tree={categoryTree}
              searchPlaceholder="Search categories"
              onChange={onChange}
              close={close}
            />
          )}
        </ComplexSelector>
        <Button label="Save category" variant="primary" />
      </VStack>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A second tree-search example showing the same ComplexSelector shell with different hierarchical data and a form action nearby. The custom content relies on TreeList focus behavior and should be checked against WCAG 2.2.',
      },
    },
  },
};

type ViewDensity = 'Comfortable' | 'Compact';

export const ControlledToolbarTrigger: Story = {
  name: 'Controlled toolbar trigger',
  render: () => {
    const [density, setDensity] = useState<ViewDensity>('Comfortable');
    const [isOpen, setIsOpen] = useState(false);
    const selectorRef = useRef<ComplexSelectorHandle>(null);

    return (
      <div className={styles.toolbarDemo}>
        <Button
          label="Open options externally"
          variant="ghost"
          size="sm"
          onClick={() => selectorRef.current?.toggle()}
        />
        <ComplexSelector<ViewDensity>
          label="View options"
          isLabelHidden
          value={density}
          onChange={setDensity}
          onOpenChange={setIsOpen}
          triggerLabel={`Density: ${density}`}
          variant="ghost"
          startIcon="viewColumns"
          alignment="end"
          handleRef={selectorRef}
          contentClassName={styles.toolbarContent}>
          {(selectedDensity, onChange, close) => (
            <VStack gap={3}>
              <Text type="supporting" color="secondary">
                The selector owns visibility. An external control drives it
                imperatively via handleRef; choosing a density commits the value
                and closes the surface. onOpenChange reports every open and
                close, including the ones the selector performs itself.
              </Text>
              <HStack gap={2}>
                {(['Comfortable', 'Compact'] as const).map(option => (
                  <Button
                    key={option}
                    label={option}
                    size="sm"
                    variant={
                      selectedDensity === option ? 'primary' : 'secondary'
                    }
                    onClick={() => {
                      onChange(option);
                      close();
                    }}
                  />
                ))}
              </HStack>
            </VStack>
          )}
        </ComplexSelector>
        <Text type="supporting" color="secondary" data-testid="open-state">
          {isOpen ? 'open' : 'closed'}
        </Text>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A compact toolbar composition using the ghost trigger, a leading icon, end-aligned content, and an external control that opens the selector imperatively through its handleRef. The selector still owns its own visibility, focus restoration, and light dismiss.',
      },
    },
  },
};
