'use client';

import {Banner} from '@solo/core/Banner';
import {Stack} from '@solo/core/Layout';

export default function BannerShowcase() {
  return (
    <Stack direction="vertical" gap={3} style={{maxWidth: 800}}>
      <Banner status="info" title="A new software update is available." />
      <Banner status="success" title="Your changes have been saved." />
      <Banner
        status="warning"
        title="Your trial expires in 3 days."
        description="Upgrade to keep access to all features."
      />
      <Banner
        status="error"
        title="Payment failed."
        description="Update your billing information to continue."
      />
    </Stack>
  );
}
