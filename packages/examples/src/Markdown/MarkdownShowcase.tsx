'use client';

import {Markdown} from '@solo/core/Markdown';
import {Center} from '@solo/core/Center';

const content = [
  '# Markdown Demo',
  '',
  'Renders **markdown** with *design-system-consistent* styling.',
  '',
  '## Features',
  '',
  '- Headings mapped to the Solo type scale',
  '- **Bold**, *italic*, and ~~strikethrough~~ text',
  '- [Links](https://example.com) with external detection',
  '',
  '> Block quote indented text',
].join('\n');

export default function MarkdownShowcase() {
  return (
    <Center width={400}>
      <Markdown>{content}</Markdown>
    </Center>
  );
}
