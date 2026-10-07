'use client';

import {Outline} from '@solo/core/Outline';
import type {OutlineItem} from '@solo/core/Outline';

const items: OutlineItem[] = [
  {id: 'showcase-overview', label: 'Overview', level: 2},
  {id: 'showcase-installation', label: 'Installation', level: 2},
  {id: 'showcase-theming', label: 'Theming', level: 2},
  {id: 'showcase-tokens', label: 'Tokens', level: 3},
  {id: 'showcase-accessibility', label: 'Accessibility', level: 2},
];

export default function OutlineShowcase() {
  return (
    <div style={{width: 240}}>
      <Outline items={items} activeId="showcase-theming" />
    </div>
  );
}
