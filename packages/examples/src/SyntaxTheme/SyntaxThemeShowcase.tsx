'use client';

import {SyntaxTheme} from '@solo/core/theme';
import {oneDarkPro} from '@solo/core/theme/syntax';
import {CodeBlock} from '@solo/core/CodeBlock';
import {Stack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

const sampleCode = `async function save() {
  await api.update(values);
  toast.show('Saved');
}`;

export default function SyntaxThemeShowcase() {
  return (
    <SyntaxTheme theme={oneDarkPro}>
      <Stack
        direction="vertical"
        gap={2}
        style={{width: 360, maxWidth: '100%'}}>
        <Text type="supporting" weight="bold" color="secondary">
          One Dark Pro preset
        </Text>
        <CodeBlock code={sampleCode} language="tsx" />
      </Stack>
    </SyntaxTheme>
  );
}
