/**
 * @file inputFontFloor.test.ts
 * @input Uses node:fs and node:path to read the text-control sources
 * @output Invariants for the 16px input floor shared by every text control
 * @position Family-wide source test, in the source-reading style of
 *   reset.test.ts. It reads the Tailwind class spelling of the floor
 *   (`pointer-coarse:supports-[-webkit-touch-callout:none]:text-[length:…]`) — the
 *   runtime half (no bare coarse-pointer floor) lives in TextInput.test.tsx.
 */

import {existsSync, readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';

import {describe, expect, it} from 'vitest';

/**
 * Every control that floors its text to 16px. iOS Safari zooms the page when
 * a focused control renders under 16px; no other coarse-pointer browser does.
 * `-webkit-touch-callout` is implemented by iOS WebKit alone, so each floor
 * nests `@supports (-webkit-touch-callout: none)` inside the coarse-pointer
 * query: iPhones and iPads keep the zoom guard, while Android and touch
 * laptops keep the theme's own type scale instead of an inflated 16px.
 */
const FLOORED_CONTROLS = [
  'Chat/ChatComposerInput.tsx',
  'CommandPalette/CommandPaletteInput.tsx',
  'ComplexSelector/ComplexSelector.tsx',
  'DateInput/DateInput.tsx',
  'DateInput/NativeDateField.tsx',
  'DateInput/TouchDateField.tsx',
  'DateRangeInput/DateRangeInput.tsx',
  'DateTimeInput/DateTimeInput.tsx',
  'DateTimeInput/TouchDateTimeField.tsx',
  'DateTimeInput/nativePickerSegmentStyles.ts',
  'Field/PanelSearchInput.tsx',
  'FileInput/FileInput.tsx',
  'NumberInput/NumberInput.tsx',
  'Selector/Selector.tsx',
  'TextArea/TextArea.tsx',
  'TextInput/TextInput.tsx',
  'TimeInput/TimeInput.tsx',
  'Typeahead/BaseTypeahead.tsx',
];

/** The rich-text package (when present) carries the same floor. */
const RICHTEXT_SRC = path.resolve(__dirname, '../../richtext/src');

/**
 * A font floor applied to every coarse pointer, iOS or not: a coarse-pointer
 * variant directly followed by the `max(1rem, …)` font-size class, with no
 * `supports-[-webkit-touch-callout:none]:` gate between them.
 */
const BARE_COARSE_FLOOR =
  /(?:pointer-coarse|\[@media\(pointer:coarse\)\]):text-\[length:max\(1rem/;

/** The same floor, gated to iOS WebKit inside the coarse-pointer query. */
const IOS_GATED_FLOOR =
  /(?:pointer-coarse|\[@media\(pointer:coarse\)\]):supports-\[-webkit-touch-callout:none\]:text-\[length:max\(1rem,var\(--text-(?:body|label)-size\)\)\]/;

/** Collect every non-test component source under `dir`, recursively. */
function componentSources(dir: string): string[] {
  const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
  const out: string[] = [];
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...componentSources(full));
    } else if (
      SOURCE_EXTENSIONS.some(ext => entry.name.endsWith(ext)) &&
      !entry.name.endsWith('.test.ts') &&
      !entry.name.endsWith('.test.tsx') &&
      !entry.name.endsWith('.doc.mjs')
    ) {
      out.push(full);
    }
  }
  return out;
}

describe('the 16px input floor', () => {
  it('gates every floored text control to iOS alone', () => {
    // Guards the loop below against the list silently emptying out.
    expect(FLOORED_CONTROLS.length).toBeGreaterThanOrEqual(18);
    for (const file of FLOORED_CONTROLS) {
      const source = readFileSync(path.resolve(__dirname, file), 'utf8');
      expect(source, file).toMatch(IOS_GATED_FLOOR);
      expect(source, file).not.toMatch(BARE_COARSE_FLOOR);
    }
  });

  it('leaves no bare coarse-pointer font floor anywhere in core or richtext', () => {
    // Catches a new (or renamed) control reintroducing the ungated floor,
    // wherever it lands — the list above only knows the current family. The
    // rich-text package carries the same floor, so it is scanned too.
    const scanRoots = [__dirname, RICHTEXT_SRC].filter(root =>
      existsSync(root),
    );
    const offenders = scanRoots
      .flatMap(root => componentSources(root))
      .map(file => ({
        file,
        source: readFileSync(file, 'utf8'),
      }))
      .filter(({source}) => BARE_COARSE_FLOOR.test(source))
      .map(({file}) => path.relative(__dirname, file));
    expect(offenders).toEqual([]);
  });
});
