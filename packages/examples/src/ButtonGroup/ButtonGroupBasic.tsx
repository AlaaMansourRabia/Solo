'use client';

import {ButtonGroup} from '@solo/core/ButtonGroup';
import {Button} from '@solo/core/Button';

export default function ButtonGroupBasic() {
  return (
    <ButtonGroup label="Text editing actions">
      <Button label="Copy" />
      <Button label="Cut" />
      <Button label="Paste" />
    </ButtonGroup>
  );
}
