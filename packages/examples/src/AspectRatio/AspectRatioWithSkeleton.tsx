'use client';

import {AspectRatio} from '@solo/core/AspectRatio';
import {Skeleton} from '@solo/core/Skeleton';
import {Center} from '@solo/core/Center';

export default function AspectRatioWithSkeleton() {
  return (
    <Center width={600}>
      <AspectRatio ratio={16 / 9}>
        <Skeleton width="100%" height="100%" />
      </AspectRatio>
    </Center>
  );
}
