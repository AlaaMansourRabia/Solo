'use client';

import {ButtonGroup} from '@solo/core/ButtonGroup';
import {Button} from '@solo/core/Button';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function ButtonGroupFloating() {
  return (
    <Stack direction="vertical" gap={3} hAlign="start">
      <Text type="supporting" color="secondary">
        The whole group shares one raised surface — a floating action bar
      </Text>
      <ButtonGroup label="Zoom controls" elevation="med">
        <Button label="Zoom out" />
        <Button label="Reset" />
        <Button label="Zoom in" />
      </ButtonGroup>
    </Stack>
  );
}
