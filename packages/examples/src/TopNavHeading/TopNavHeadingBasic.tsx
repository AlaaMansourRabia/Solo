'use client';

import {TopNav, TopNavHeading} from '@solo/core/TopNav';
import {NavIcon} from '@solo/core/NavIcon';
import {Icon} from '@solo/core/Icon';

export default function TopNavHeadingBasic() {
  return (
    <TopNav
      label="Product navigation"
      heading={
        <TopNavHeading
          heading="Acme Platform"
          logo={<NavIcon icon={<Icon icon="viewColumns" />} />}
          headingHref="/"
        />
      }
    />
  );
}
