'use client';

import {Link} from '@solo/core/Link';
import {Text} from '@solo/core/Text';

export default function LinkInlineLink() {
  return (
    <Text type="body">
      Read the <Link href="#">documentation</Link> for more information about
      using Solo components.
    </Text>
  );
}
