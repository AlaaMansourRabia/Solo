/**
 * @file ProbeTheme.stories.tsx
 * @input The active Storybook theme selected in the toolbar
 * @output A visual reference for every top-level defineTheme axis
 * @position Core/Themes — theme-system verification, not a component demo
 *
 * Do not wrap these stories in <Theme>. The toolbar and visual gate must own
 * the active theme, otherwise the probe theme cannot be selected or tested.
 */

import * as React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {cn} from '@solo/core/utils/cn';
import {Badge} from '@solo/core/Badge';
import {Button} from '@solo/core/Button';
import {Popover} from '@solo/core/Popover';
import {Card} from '@solo/core/Card';
import {CheckboxInput} from '@solo/core/CheckboxInput';
import {CodeBlock} from '@solo/core/CodeBlock';
import {Icon} from '@solo/core/Icon';
import {RadioList, RadioListItem} from '@solo/core/RadioList';
import {Stack} from '@solo/core/Stack';
import {Switch} from '@solo/core/Switch';
import {Heading, Text} from '@solo/core/Text';
import {useTheme} from '@solo/core/theme';

const meta = {
  title: 'Core/Themes/Probe Theme',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const iconNames = [
  'close',
  'check',
  'success',
  'warning',
  'info',
  'calendar',
  'search',
  'copy',
] as const;

const code = `type ThemeAxis =
  | 'components'
  | 'tokens'
  | 'icons'
  | 'indicators'
  | 'fonts'
  | 'syntax';

export const covered = true;`;

function AxisCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className={styles.axisCard}>
        <Heading level={3} accessibilityLevel={2}>
          {title}
        </Heading>
        {children}
      </div>
    </Card>
  );
}

function TokenSwatches() {
  const {token} = useTheme();
  const tokens = [
    ['accent', '--color-accent', styles.accent],
    ['body', '--color-background-body', styles.body],
    ['text', '--color-text-primary', styles.text],
    ['border', '--color-border', styles.border],
  ] as const;

  return (
    <div className={styles.swatchGrid}>
      {tokens.map(([label, name, swatch]) => (
        <div key={name} className={styles.swatchItem}>
          <div className={cn(styles.swatch, swatch)} />
          <Text type="label">{label}</Text>
          <Text type="supporting">{token(name)}</Text>
        </div>
      ))}
    </div>
  );
}

function RegistrySpecimen() {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(true);
  const [radio, setRadio] = React.useState('one');
  const [enabled, setEnabled] = React.useState(true);

  return (
    <Stack direction="vertical" gap={5}>
      <div className={styles.iconRow}>
        {iconNames.map(name => (
          <div key={name} className={styles.iconCell}>
            <Icon icon={name} size="lg" label={name} />
            <Text type="supporting">{name}</Text>
          </div>
        ))}
      </div>

      <div className={styles.controlGrid}>
        <CheckboxInput
          label="Checkbox indicator"
          value={checked}
          onChange={setChecked}
        />
        <Switch label="Switch control" value={enabled} onChange={setEnabled} />
        <RadioList label="Radio indicator" value={radio} onChange={setRadio}>
          <RadioListItem label="First" value="one" />
          <RadioListItem label="Second" value="two" />
        </RadioList>
      </div>
    </Stack>
  );
}

function ComponentSpecimen() {
  return (
    <Stack direction="vertical" gap={5}>
      <div className={styles.row}>
        <Button label="Primary" variant="primary" />
        <Button label="Secondary" variant="secondary" />
        <Button label="Ghost" variant="ghost" />
        <Button label="Destructive" variant="destructive" />
      </div>
      <div className={styles.row}>
        <Badge label="Neutral" variant="neutral" />
        <Badge label="Info" variant="info" />
        <Badge label="Success" variant="success" />
        <Badge label="Warning" variant="warning" />
        <Badge label="Error" variant="error" />
      </div>
      <Popover
        isOpen
        hasAutoFocus={false}
        hasCloseButton={false}
        hasLightDismiss={false}
        label="Popover radius probe"
        width={240}
        content={<Text type="body">Painted Popover surface</Text>}>
        <Button label="Popover radius probe" />
      </Popover>
    </Stack>
  );
}

function AllAxesSheet() {
  const {name, mode} = useTheme();

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <Heading level={1}>Probe theme — all axes</Heading>
          <Text type="body">
            Select <strong>Probe (test fixture)</strong> in the Theme toolbar.
            Every axis should become unmistakably synthetic.
          </Text>
        </div>
        <Badge
          label={`${name} · ${mode}`}
          variant={name === 'probe' ? 'success' : 'neutral'}
        />
      </div>

      <div className={styles.grid}>
        <AxisCard title="1 · Component targets">
          <ComponentSpecimen />
        </AxisCard>

        <AxisCard title="2 · Tokens">
          <TokenSwatches />
        </AxisCard>

        <AxisCard title="3 + 4 · Icon and indicator registries">
          <RegistrySpecimen />
        </AxisCard>

        <AxisCard title="5 · Typography">
          <Stack direction="vertical" gap={2}>
            <Heading level={2} accessibilityLevel={3}>
              SoloProbeFace heading
            </Heading>
            <Text type="body">Body text inherits the probe font token.</Text>
            <Text type="code">const fontAxis = 'covered';</Text>
          </Stack>
        </AxisCard>

        <div className={styles.wide}>
          <AxisCard title="6 · Syntax">
            <CodeBlock
              code={code}
              language="typescript"
              title="theme-axes.ts"
              hasLineNumbers
            />
          </AxisCard>
        </div>
      </div>
    </main>
  );
}

/**
 * All six top-level defineTheme axes on one surface. Switch the Theme toolbar
 * between Neutral and Probe; this story never pins its own theme.
 */
export const AllAxes: Story = {
  name: 'All Axes',
  render: () => <AllAxesSheet />,
};

/** Component targets only, for a compact pixel-diff surface. */
export const ComponentTargets: Story = {
  name: 'Component Targets',
  render: () => (
    <main className={styles.compactPage}>
      <ComponentSpecimen />
    </main>
  ),
};

/** Icon and indicator swaps, separated from CSS component overrides. */
export const Registries: Story = {
  render: () => (
    <main className={styles.compactPage}>
      <RegistrySpecimen />
    </main>
  ),
};

const styles = {
  page: 'bg-(--color-background-body) min-h-[100vh] p-[32px]',
  compactPage: 'bg-(--color-background-surface) min-h-[100vh] p-[32px]',
  header: 'items-start flex gap-[24px] justify-between mb-[24px]',
  grid: 'grid gap-[16px] [grid-template-columns:repeat(2,minmax(0,1fr))]',
  wide: '[grid-column:1/-1]',
  axisCard: 'flex flex-col gap-[16px] p-[20px]',
  row: 'items-center flex flex-wrap gap-[12px]',
  iconRow: 'grid gap-[12px] [grid-template-columns:repeat(4,minmax(0,1fr))]',
  iconCell: 'items-center flex flex-col gap-[4px]',
  controlGrid:
    'grid gap-[16px] [grid-template-columns:repeat(3,minmax(0,1fr))]',
  swatchGrid:
    'grid gap-[12px] [grid-template-columns:repeat(4,minmax(0,1fr))]',
  swatchItem: 'flex flex-col gap-[4px] min-w-0',
  swatch: cn(
    'border-(--color-border) rounded-(--radius-element)',
    '[border-style:solid] [border-width:2px] h-[48px]',
  ),
  accent: 'bg-(--color-accent)',
  body: 'bg-(--color-background-body)',
  text: 'bg-(--color-text-primary)',
  border: 'bg-(--color-border)',
} as const;
