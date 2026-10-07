'use client';

import {useState} from 'react';
import {TabList, Tab, TabMenu} from '@solo/core/TabList';

export default function TabMenuBasic() {
  const [value, setValue] = useState('overview');
  return (
    <TabList value={value} onChange={setValue}>
      <Tab value="overview" label="Overview" />
      <Tab value="activity" label="Activity" />
      <TabMenu
        label="More"
        options={[
          {value: 'settings', label: 'Settings'},
          {value: 'billing', label: 'Billing'},
        ]}
      />
    </TabList>
  );
}
