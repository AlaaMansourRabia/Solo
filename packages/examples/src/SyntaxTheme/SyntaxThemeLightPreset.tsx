'use client';

import {SyntaxTheme} from '@solo/core/theme';
import {githubLight} from '@solo/core/theme/syntax';
import {CodeBlock} from '@solo/core/CodeBlock';

const code = `const status = response.ok ? 'success' : 'error';
console.log({status});`;

export default function SyntaxThemeLightPreset() {
  return (
    <SyntaxTheme theme={githubLight}>
      <CodeBlock code={code} language="tsx" title="GitHub Light preset" />
    </SyntaxTheme>
  );
}
