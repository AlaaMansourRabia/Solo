/**
 * @input Workspace source entries, Storybook's Vite config, Tailwind CSS v4.
 * @output Storybook config that renders @solo/core and @solo/charts from source.
 * @position Storybook configuration; keeps workspace packages usable unbuilt.
 */

import type {StorybookConfig} from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');

const viteBuildTargets = ['chrome123', 'firefox120', 'safari17.5'];

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {defaultName: 'Docs'},
  // Page templates load their images from /template-assets/.
  staticDirs: [{from: '../../../packages/templates/public', to: '/'}],
  viteFinal: async config => ({
    ...config,
    build: {...config.build, target: viteBuildTargets},
    plugins: [
      {
        name: 'solo-color-scheme',
        transformIndexHtml() {
          return [
            {
              tag: 'style',
              children: ':root { color-scheme: light; }',
              injectTo: 'head-prepend',
            },
          ];
        },
      },
      ...(config.plugins ?? []),
      tailwindcss(),
    ],
    resolve: {
      ...config.resolve,
      alias: [
        {find: /^@solo\/core$/, replacement: path.join(rootDir, 'packages/core/src/index.ts')},
        {find: /^@solo\/core\/locales\/(.*?)(?:\.js)?$/, replacement: path.join(rootDir, 'packages/core/src/i18n/generated-locales/$1')},
        {find: /^@solo\/core\/(.*)$/, replacement: path.join(rootDir, 'packages/core/src/$1')},
        {find: /^@solo\/theme-neutral\/built$/, replacement: path.join(rootDir, 'packages/theme-neutral/built/neutral.js')},
        {find: /^@solo\/templates$/, replacement: path.join(rootDir, 'packages/templates/src/index.ts')},
        {find: /^@solo\/templates\/(.*)$/, replacement: path.join(rootDir, 'packages/templates/src/$1')},
        {find: /^@solo\/theme-neutral$/, replacement: path.join(rootDir, 'packages/theme-neutral/src/source.ts')},
        {find: /^@solo\/charts$/, replacement: path.join(rootDir, 'packages/charts/src/index.ts')},
        {find: /^@solo\/charts\/(.*)$/, replacement: path.join(rootDir, 'packages/charts/src/$1')},
      ],
    },
  }),
};

export default config;
