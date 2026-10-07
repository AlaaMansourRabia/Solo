'use client';

import {useState} from 'react';
import {InternationalizationProvider} from '@solo/core/i18n';
import {Selector} from '@solo/core/Selector';

export default function InternationalizationProviderOverrides() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <InternationalizationProvider
      locale="en"
      overrides={{
        en: {
          '@solo.selector.placeholder': 'Choose...',
        },
      }}>
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
    </InternationalizationProvider>
  );
}
