'use client';

import {useState} from 'react';
import {TabList, Tab} from '@solo/core/TabList';

export default function TabListShowcase() {
  const [value, setValue] = useState('home');
  return (
    <TabList value={value} onChange={setValue}>
      <Tab value="home" label="Home" />
      <Tab value="projects" label="Projects" />
      <Tab value="settings" label="Settings" />
    </TabList>
  );
}
