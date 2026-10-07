'use client';

import {useState} from 'react';
import {TabList, Tab, TabMenu} from '@solo/core/TabList';

export default function TabListTabsWithMenu() {
  const [value, setValue] = useState('home');
  return (
    <TabList value={value} onChange={setValue}>
      <Tab value="home" label="Home" />
      <Tab value="projects" label="Projects" />
      <TabMenu
        label="More"
        options={[
          {value: 'analytics', label: 'Analytics'},
          {value: 'reports', label: 'Reports'},
          {value: 'billing', label: 'Billing'},
        ]}
      />
    </TabList>
  );
}
