'use client';

import {Kbd} from '@solo/core/Kbd';
import {VStack} from '@solo/core/Stack';
import {Text} from '@solo/core/Text';

export default function KbdInlineInstructions() {
  return (
    <VStack gap={3}>
      <Text type="body">
        Press <Kbd keys="mod+k" /> to open the command palette.
      </Text>
      <Text type="body">
        Use <Kbd keys="mod+shift+p" /> to access all commands.
      </Text>
      <Text type="body">
        Press <Kbd keys="escape" /> to close the dialog.
      </Text>
      <Text type="body">
        Navigate with <Kbd keys="up" /> and <Kbd keys="down" /> arrow keys, then
        press <Kbd keys="enter" /> to select.
      </Text>
    </VStack>
  );
}
