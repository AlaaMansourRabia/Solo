'use client';

import {ProgressBar} from '@solo/core/ProgressBar';

export default function ProgressBarWithValueLabel() {
  return (
    <ProgressBar
      value={75}
      label="Storage used"
      hasValueLabel
      style={{width: 300}}
    />
  );
}
