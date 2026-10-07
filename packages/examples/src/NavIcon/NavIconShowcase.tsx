'use client';

import {NavIcon} from '@solo/core/NavIcon';
import {Icon} from '@solo/core/Icon';
import {HStack} from '@solo/core/Layout';

export default function NavIconShowcase() {
  return (
    <HStack gap={4} vAlign="center">
      <NavIcon icon={<Icon icon="search" />} />
      <NavIcon icon={<Icon icon="calendar" />} />
      <NavIcon icon={<Icon icon="wrench" />} />
    </HStack>
  );
}
