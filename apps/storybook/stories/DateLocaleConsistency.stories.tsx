/**
 * @file DateLocaleConsistency.stories.tsx
 * @input InternationalizationProvider locale plus a fixed Gregorian date
 * @output Side-by-side French and Thai date-formatting evidence
 * @position Storybook verification story for shared date semantics
 */

import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {Calendar, type ISODateString} from '@solo/core/Calendar';
import {DateInput} from '@solo/core/DateInput';
import {
  InternationalizationProvider,
  type Locale,
} from '@solo/core/i18n';
import {Heading, Text} from '@solo/core/Text';
import {Timestamp} from '@solo/core/Timestamp';

const meta = {
  title: 'Foundations/Internationalization/Date consistency',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DATE = '2026-08-22' as ISODateString;

function LocaleDateExamples({locale}: {locale: Locale}) {
  const [value, setValue] = useState<ISODateString | undefined>(DATE);

  return (
    <InternationalizationProvider locale={locale}>
      <section
        aria-label={`${locale} date examples`}
        className={styles.panel}>
        <Heading level={2}>{locale}</Heading>
        <DateInput
          label="Selected date"
          value={value}
          onChange={setValue}
          format="date_long"
          nativePicker="never"
        />
        <Text>
          Timestamp:{' '}
          <Timestamp value="2026-08-22T12:00:00Z" format="date_long" />
        </Text>
        <Calendar
          mode="single"
          value={value}
          onChange={setValue}
          focusDate="2026-08-01"
        />
      </section>
    </InternationalizationProvider>
  );
}

export const FrenchAndThaiGregorian: Story = {
  render: () => (
    <div className={styles.comparison}>
      <LocaleDateExamples locale="fr-FR" />
      <LocaleDateExamples locale="th-TH" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Calendar, DateInput, and Timestamp all follow the provider locale while preserving Gregorian year 2026. Thai must not render Buddhist year 2569.',
      },
    },
  },
};

const styles = {
  comparison:
    'grid [grid-template-columns:repeat(2,minmax(0,1fr))] gap-(--spacing-8)',
  panel: 'flex flex-col gap-(--spacing-4) min-w-0',
} as const;
