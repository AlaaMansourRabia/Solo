'use client';

import {useState} from 'react';
import {InternationalizationProvider} from '@solo/core/i18n';
import frFR from '@solo/core/locales/fr-FR.generated.js';
import {Stack} from '@solo/core/Layout';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@solo/core/SegmentedControl';
import {Selector} from '@solo/core/Selector';

type Locale = 'en' | 'fr-FR';

export default function InternationalizationProviderShippedLocale() {
  const [locale, setLocale] = useState<Locale>('en');
  const [value, setValue] = useState<string | null>(null);
  return (
    <InternationalizationProvider locale={locale} messages={{'fr-FR': frFR}}>
      <Stack direction="vertical" gap={4} hAlign="center">
        <SegmentedControl
          label="Language"
          value={locale}
          onChange={nextLocale => setLocale(nextLocale as Locale)}
          size="sm">
          <SegmentedControlItem value="en" label="EN" />
          <SegmentedControlItem value="fr-FR" label="FR" />
        </SegmentedControl>
        <Selector
          style={{width: 300}}
          label="Billing region"
          options={[
            {value: 'americas', label: 'Americas'},
            {value: 'emea', label: 'EMEA'},
            {value: 'apac', label: 'APAC'},
          ]}
          value={value}
          onChange={setValue}
          hasClear
        />
      </Stack>
    </InternationalizationProvider>
  );
}
