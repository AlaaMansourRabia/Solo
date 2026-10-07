'use client';

import {DropdownMenu} from '@solo/core/DropdownMenu';

export default function DropdownMenuShowcase() {
  return (
    <DropdownMenu
      button={{label: 'Actions'}}
      items={[
        {label: 'Edit', onClick: () => {}},
        {label: 'Duplicate', onClick: () => {}},
        {label: 'Delete', onClick: () => {}},
      ]}
    />
  );
}
