'use client';

import {AspectRatio} from '@solo/core/AspectRatio';
import {Center} from '@solo/core/Center';

export default function AspectRatioWidescreen() {
  return (
    <Center width={600}>
      <AspectRatio ratio={16 / 9} fit="cover">
        <img
          src="/template-assets/light-scene-horizontal-1.png"
          alt="16:9 widescreen"
        />
      </AspectRatio>
    </Center>
  );
}
