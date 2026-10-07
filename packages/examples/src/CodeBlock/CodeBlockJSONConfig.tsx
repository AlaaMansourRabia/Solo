'use client';

import {CodeBlock} from '@solo/core/CodeBlock';

const code = `{
  "name": "@solo/core",
  "version": "0.0.5",
  "dependencies": {
    "@solo/theme-neutral": "^0.1.0",
    "react": "^19.0.0"
  },
  "scripts": {
    "build": "tsup",
    "test": "vitest"
  }
}`;

export default function CodeBlockJSONConfig() {
  return (
    <CodeBlock
      code={code}
      language="json"
      title="package.json"
      hasLineNumbers
    />
  );
}
