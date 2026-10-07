/**
 * @file vitest.config.ts
 * @output Vitest configuration: jsdom, jest-dom setup, @solo/* source aliases.
 *
 * Tailwind classes are plain strings at test time — no CSS is compiled — so
 * style assertions check class names (`toHaveClass`) rather than computed
 * styles.
 */

import path from 'node:path';
import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

const coreSrc = path.resolve(__dirname, 'packages/core/src');
const chartsSrc = path.resolve(__dirname, 'packages/charts/src');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {find: /^@solo\/core\/locales\/(.*?)(?:\.js)?$/, replacement: path.join(coreSrc, 'i18n/generated-locales/$1')},
      {find: /^@solo\/core\/(.*)$/, replacement: path.join(coreSrc, '$1')},
      {find: /^@solo\/core$/, replacement: path.join(coreSrc, 'index.ts')},
      {find: /^@solo\/theme-neutral\/built$/, replacement: path.resolve(__dirname, 'packages/theme-neutral/built/neutral.js')},
      {find: /^@solo\/templates$/, replacement: path.resolve(__dirname, 'packages/templates/src/index.ts')},
      {find: /^@solo\/templates\/(.*)$/, replacement: path.resolve(__dirname, 'packages/templates/src/$1')},
      {find: /^@solo\/theme-neutral$/, replacement: path.resolve(__dirname, 'packages/theme-neutral/src/source.ts')},
      {find: /^@solo\/charts\/(.*)$/, replacement: path.join(chartsSrc, '$1')},
      {find: /^@solo\/charts$/, replacement: path.join(chartsSrc, 'index.ts')},
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-utils/setup.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    execArgv: ['--max-old-space-size=4096'],
    include: [
      'packages/core/src/**/*.test.{ts,tsx,mjs}',
      'packages/charts/src/**/*.test.{ts,tsx,mjs}',
      'packages/theme-neutral/src/**/*.test.{ts,tsx,mjs}',
      'packages/examples/src/**/*.test.{ts,tsx,mjs}',
      'packages/templates/src/**/*.test.{ts,tsx,mjs}',
    ],
    // The accessibility-contract lane needs Solo's internal
    // `@solo/a11y-spec` harness, which is not part of Solo.
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.a11y.*'],
  },
});
