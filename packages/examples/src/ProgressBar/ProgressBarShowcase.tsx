'use client';

import {ProgressBar} from '@solo/core/ProgressBar';

export default function ProgressBarShowcase() {
  return <ProgressBar value={60} label="Progress" style={{width: 300}} />;
}
