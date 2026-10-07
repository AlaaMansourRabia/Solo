'use client';

import {SyntaxTheme} from '@solo/core/theme';
import {githubDark} from '@solo/core/theme/syntax';
import {CodeBlock} from '@solo/core/CodeBlock';

const commands = `$ solo init --features agents
✓ AI agent docs installed → AGENTS.md
$ pnpm solo component CodeBlock --dense`;

export default function CodeBlockTerminal() {
  return (
    <SyntaxTheme theme={githubDark}>
      <CodeBlock
        code={commands}
        language="bash"
        hasCopyButton
        style={{width: '100%', maxWidth: 480}}
      />
    </SyntaxTheme>
  );
}
