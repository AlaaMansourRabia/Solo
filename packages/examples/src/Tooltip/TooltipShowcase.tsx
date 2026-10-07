'use client';

import {Tooltip} from '@solo/core/Tooltip';
import {Button} from '@solo/core/Button';

export default function TooltipShowcase() {
  return (
    <Tooltip content="This is a helpful tooltip" placement="above">
      <Button label="Hover me" />
    </Tooltip>
  );
}
