'use client';

import {ProgressBar} from '@solo/core/ProgressBar';

export default function ProgressBarIndeterminate() {
  return (
    <ProgressBar isIndeterminate label="Loading..." style={{width: 300}} />
  );
}
