import {useId, useRef, useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, waitFor, within} from 'storybook/test';
import {cn} from '@solo/core/utils/cn';
import {
  BaseTypeahead,
  createStaticSource,
  type BaseTypeaheadProps,
  type SearchableItem,
  type SearchSource,
} from '@solo/core/Typeahead';

const items: SearchableItem[] = [
  {id: 'react', label: 'React', auxiliaryData: {group: 'Libraries'}},
  {id: 'vue', label: 'Vue', auxiliaryData: {group: 'Libraries'}},
  {id: 'angular', label: 'Angular', auxiliaryData: {group: 'Frameworks'}},
  {id: 'svelte', label: 'Svelte', auxiliaryData: {group: 'Frameworks'}},
  {
    id: 'long',
    label:
      'A deliberately long framework result that must stay inside the menu',
    auxiliaryData: {group: 'Frameworks'},
  },
];

const source = createStaticSource(items);
const emptySource = createStaticSource([]);
const pendingSource: SearchSource = {
  search: () => new Promise(() => {}),
  bootstrap: () => new Promise(() => {}),
};

const styles = {
  stage: 'flex flex-col gap-(--spacing-5) max-w-[32rem]',
  fieldGroup: 'flex flex-col gap-(--spacing-1)',
  label: cn(
    'text-(--color-text-primary) font-(family-name:--font-family-body)',
    'text-(length:--text-label-size) font-(number:--font-weight-medium)',
  ),
  field: cn(
    'items-center bg-(--color-background-surface) border-(--color-border-emphasized)',
    'rounded-(--radius-element) [border-style:solid] [border-width:var(--border-width)]',
    'flex min-h-(--size-element-md) px-(--spacing-2)',
    '[outline-color:transparent] has-[input:focus-visible]:[outline-color:var(--focus-outline-color)]',
    '[outline-offset:var(--focus-outline-offset)] [outline-style:solid]',
    '[outline-width:0] has-[input:focus-visible]:[outline-width:var(--focus-outline-width)]',
    'w-[20rem]',
  ),
  narrowField: 'max-w-full w-[16rem]',
  customItem: 'flex flex-col min-w-0',
  customItemLabel: 'text-(--color-text-primary) font-[500]',
  customItemGroup:
    'text-(--color-text-secondary) text-(length:--text-supporting-size)',
} as const;

type DemoProps = Omit<
  BaseTypeaheadProps<SearchableItem>,
  'searchSource' | 'value' | 'onChange'
> & {
  label?: string;
  source?: SearchSource<SearchableItem>;
  isNarrow?: boolean;
};

function Demo({
  label = 'Framework',
  source: searchSource = source,
  isNarrow = false,
  inputId: inputIdProp,
  ariaLabelledBy: ariaLabelledByProp,
  ...props
}: DemoProps) {
  const [value, setValue] = useState<SearchableItem | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const generatedId = useId().replaceAll(':', '');
  const generatedInputId = `base-typeahead-${generatedId}`;
  const inputId = inputIdProp ?? generatedInputId;
  const labelId = `${inputId}-label`;

  return (
    <div className={styles.fieldGroup}>
      <label id={labelId} htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div
        ref={anchorRef}
        data-base-typeahead-anchor="true"
        className={cn(styles.field, isNarrow && styles.narrowField)}>
        <BaseTypeahead
          {...props}
          inputId={inputId}
          ariaLabelledBy={ariaLabelledByProp ?? labelId}
          anchorRef={anchorRef}
          searchSource={searchSource}
          value={value}
          onChange={setValue}
        />
      </div>
    </div>
  );
}

const meta: Meta<DemoProps> = {
  title: 'Core/BaseTypeahead',
  component: Demo,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<DemoProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Demo placeholder="Search frameworks…" />,
};

export const LogicalDropdownPlacement: Story = {
  render: () => (
    <Demo
      hasEntriesOnFocus
      isNarrow
      menuWidth={320}
      placeholder="Focus to open results…"
    />
  ),
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('combobox');
    await userEvent.click(input);
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
  },
};

export const Loading: Story = {
  render: () => (
    <Demo
      source={pendingSource}
      debounceMs={0}
      placeholder="Type to start a pending search…"
    />
  ),
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('combobox');
    await userEvent.type(input, 're');
    await waitFor(() => expect(input).toHaveAttribute('aria-busy', 'true'));
  },
};

export const EmptyResults: Story = {
  render: () => (
    <Demo
      source={emptySource}
      debounceMs={0}
      emptySearchText="No matching frameworks"
    />
  ),
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('combobox');
    await userEvent.type(input, 'none');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
  },
};

export const CustomRenderer: Story = {
  render: () => (
    <Demo
      hasEntriesOnFocus
      renderItem={item => (
        <span className={styles.customItem}>
          <span className={styles.customItemLabel}>{item.label}</span>
          <span className={styles.customItemGroup}>
            {(item.auxiliaryData as {group?: string} | undefined)?.group}
          </span>
        </span>
      )}
    />
  ),
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('combobox');
    await userEvent.click(input);
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
  },
};

export const DisabledStates: Story = {
  render: () => (
    <div className={styles.stage}>
      <Demo label="Native disabled" isDisabled />
      <Demo label="Focusable disabled" isDisabled isFocusableDisabled />
    </div>
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <div className={styles.stage}>
      <Demo label="Small" size="sm" hasEntriesOnFocus />
      <Demo label="Medium" size="md" hasEntriesOnFocus />
      <Demo label="Large" size="lg" hasEntriesOnFocus />
    </div>
  ),
};

export const NarrowLongResult: Story = {
  render: () => (
    <Demo isNarrow hasEntriesOnFocus label="Framework in a narrow container" />
  ),
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('combobox');
    await userEvent.click(input);
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await waitFor(() => {
      const listbox = document.querySelector<HTMLElement>('[role="listbox"]');
      if (listbox == null) {
        throw new Error('Expected the BaseTypeahead listbox to be open');
      }
      const box = listbox.getBoundingClientRect();
      expect(
        box.left >= 16 &&
          box.right <= window.innerWidth - 16 &&
          listbox.scrollWidth <= listbox.clientWidth,
      ).toBe(true);
      expect(
        Array.from(
          listbox.querySelectorAll<HTMLElement>('[role="option"]'),
        ).every(option => option.scrollWidth <= option.clientWidth),
      ).toBe(true);
    });
  },
};
