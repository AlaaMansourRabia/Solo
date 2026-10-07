'use client';

import {TopNavMegaMenuFeaturedCard} from '@solo/core/TopNav';

export default function TopNavMegaMenuFeaturedCardBasic() {
  return (
    <TopNavMegaMenuFeaturedCard
      title="What's New"
      description="Check out the latest features and improvements in the Q2 release."
      linkLabel="Read the changelog"
      linkHref="#changelog"
    />
  );
}
