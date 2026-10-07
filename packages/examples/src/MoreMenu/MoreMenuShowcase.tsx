'use client';

import {MoreMenu} from '@solo/core/MoreMenu';

export default function MoreMenuShowcase() {
  return (
    <MoreMenu
      items={[
        {label: 'Edit', onClick: () => {}},
        {label: 'Duplicate', onClick: () => {}},
        {label: 'Delete', onClick: () => {}},
      ]}
    />
  );
}
