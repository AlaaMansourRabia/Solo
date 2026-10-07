'use client';

import {MetadataList, MetadataListItem} from '@solo/core/MetadataList';
import {Badge} from '@solo/core/Badge';

export default function MetadataListItemBasic() {
  return (
    <MetadataList title="Deployment">
      <MetadataListItem label="Environment">Production</MetadataListItem>
      <MetadataListItem label="Status">
        <Badge label="Healthy" variant="green" />
      </MetadataListItem>
      <MetadataListItem label="Version">v2.14.0</MetadataListItem>
      <MetadataListItem label="Last deployed">June 12, 2026</MetadataListItem>
    </MetadataList>
  );
}
