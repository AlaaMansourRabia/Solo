'use client';

import {useState} from 'react';
import {Button} from '@solo/core/Button';
import {HStack} from '@solo/core/Layout';
import {Selector} from '@solo/core/Selector';

export default function SelectorGhostToolbar() {
  const [view, setView] = useState<string | undefined>('week');
  const [density, setDensity] = useState<string | undefined>('comfortable');

  return (
    <HStack align="center" gap={2}>
      <Button label="Today" variant="ghost" />
      <Selector
        label="Calendar view"
        isLabelHidden
        variant="ghost"
        options={[
          {value: 'day', label: 'Day'},
          {value: 'week', label: 'Week'},
          {value: 'month', label: 'Month'},
        ]}
        value={view}
        onChange={setView}
      />
      <Selector
        label="Density"
        isLabelHidden
        variant="ghost"
        options={[
          {value: 'compact', label: 'Compact'},
          {value: 'comfortable', label: 'Comfortable'},
          {value: 'spacious', label: 'Spacious'},
        ]}
        value={density}
        onChange={setDensity}
        status={{type: 'warning', message: 'This setting affects all users'}}
        statusVariant="tooltip"
      />
      <Button label="Export" variant="ghost" />
    </HStack>
  );
}
