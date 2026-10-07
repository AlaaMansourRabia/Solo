'use client';

import {MetadataList, MetadataListItem} from '@solo/core/MetadataList';

export default function MetadataListBasicMetadata() {
  return (
    <MetadataList>
      <MetadataListItem label="Name">MetadataList</MetadataListItem>
      <MetadataListItem label="Status">Active</MetadataListItem>
      <MetadataListItem label="Owner">Joey</MetadataListItem>
    </MetadataList>
  );
}
