'use client';

import {useState, type CSSProperties} from 'react';
import {Toolbar} from '@solo/core/Toolbar';
import {Button} from '@solo/core/Button';
import {Icon} from '@solo/core/Icon';
import {TabList, Tab} from '@solo/core/TabList';
import {Card} from '@solo/core/Card';
import {Section} from '@solo/core/Section';
import {PlusIcon} from '@heroicons/react/24/outline';

const card: CSSProperties = {
  width: '100%',
  maxWidth: 500,
  height: '100%',
  marginTop: 200,
};

export default function ToolbarWithTabs() {
  const [tab, setTab] = useState('overview');
  return (
    <Card style={card}>
      <Toolbar
        label="Section navigation"
        dividers={['bottom']}
        startContent={
          <TabList value={tab} onChange={setTab}>
            <Tab value="overview" label="Overview" />
            <Tab value="analytics" label="Analytics" />
            <Tab value="settings" label="Settings" />
          </TabList>
        }
        endContent={
          <Button label="New item" icon={<Icon icon={PlusIcon} />} isIconOnly />
        }
      />
      <Section />
    </Card>
  );
}
