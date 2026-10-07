'use client';

import {SyntaxTheme} from '@solo/core/theme';
import {dracula} from '@solo/core/theme/syntax';
import {CodeBlock} from '@solo/core/CodeBlock';

const code = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

export default function SyntaxThemeDarkPreset() {
  return (
    <SyntaxTheme theme={dracula}>
      <CodeBlock code={code} language="tsx" title="Dracula preset" />
    </SyntaxTheme>
  );
}
