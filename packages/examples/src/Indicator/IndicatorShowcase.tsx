'use client';

import {
  CheckboxIndicator,
  CheckIndicator,
  RadioIndicator,
} from '@solo/core/Indicator';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function IndicatorShowcase() {
  return (
    <Stack direction="horizontal" gap={8} hAlign="center">
      <Stack direction="vertical" gap={2} hAlign="center">
        <Stack direction="horizontal" gap={3}>
          <CheckboxIndicator state="unchecked" />
          <CheckboxIndicator state="checked" />
          <CheckboxIndicator state="indeterminate" />
        </Stack>
        <Text type="supporting" color="secondary">
          Checkbox
        </Text>
      </Stack>
      <Stack direction="vertical" gap={2} hAlign="center">
        <Stack direction="horizontal" gap={3}>
          <RadioIndicator state="unchecked" />
          <RadioIndicator state="checked" />
        </Stack>
        <Text type="supporting" color="secondary">
          Radio
        </Text>
      </Stack>
      <Stack direction="vertical" gap={2} hAlign="center">
        <CheckIndicator state="checked" />
        <Text type="supporting" color="secondary">
          Check
        </Text>
      </Stack>
    </Stack>
  );
}
