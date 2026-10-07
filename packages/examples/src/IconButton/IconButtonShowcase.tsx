'use client';

import {IconButton} from '@solo/core/IconButton';
import {Icon} from '@solo/core/Icon';

export default function IconButtonShowcase() {
  return (
    <IconButton
      label="Settings"
      icon={<Icon icon="wrench" color="inherit" />}
    />
  );
}
