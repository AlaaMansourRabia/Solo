'use client';

import {useState} from 'react';
import {
  ArchiveBoxIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import {DropdownMenu} from '@solo/core/DropdownMenu';
import {VStack} from '@solo/core/Stack';
import {Text} from '@solo/core/Text';
import {useMediaQuery} from '@solo/core/hooks';

const COMPACT_TOUCH_QUERY =
  '(max-width: 639px) and (pointer: coarse) and (hover: none)';

const ACTIONS = [
  {label: 'Edit project', icon: PencilIcon},
  {label: 'Duplicate project', icon: DocumentDuplicateIcon},
  {label: 'Share project', icon: ShareIcon},
  {label: 'Archive project', icon: ArchiveBoxIcon},
] as const;

export default function DropdownMenuBottomSheet() {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const isCompactTouchSurface = useMediaQuery(COMPACT_TOUCH_QUERY);

  return (
    <VStack gap={3}>
      <DropdownMenu
        button={{label: 'Project actions'}}
        presentation={isCompactTouchSurface ? 'bottom-sheet' : 'popover'}
        items={ACTIONS.map(({label, icon}) => ({
          label,
          icon,
          onClick: () => setLastAction(label),
        }))}
      />
      {lastAction && (
        <Text type="supporting" color="secondary">
          Last action: {lastAction}
        </Text>
      )}
    </VStack>
  );
}
