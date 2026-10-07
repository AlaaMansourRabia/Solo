/**
 * Arabic typography in a real browser (jsdom computes no fonts): a Button, a
 * TextInput and a Table under the built neutral theme compute
 * `font-family: "IBM Plex Sans Arabic", …` for Arabic-script content and keep
 * the theme's Latin face (Figtree) otherwise.
 *
 * Server-renders the components, loads the compiled @solo/core stylesheet and
 * the built neutral theme.css into Chromium (Playwright), and reads
 * getComputedStyle. Covers: lang="ar" island in an English page, the reverse,
 * <html lang="ar"> (hosts with <Theme syncRoot={false}>), RTL with no lang,
 * and Hebrew (must stay Latin).
 */

import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {renderToStaticMarkup} from 'react-dom/server';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {chromium, type Browser} from 'playwright';
import {Theme} from '../theme';
import {Button} from '../Button';
import {TextInput} from '../TextInput';
import {Table} from '../Table';
import {neutralTheme} from '../../../theme-neutral/built/neutral.js';

const root = path.resolve(__dirname, '../../../..');
let css = '';
let browser: Browser;

beforeAll(async () => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'solo-font-')), 'core.css');
  execFileSync(path.join(root, 'node_modules/.bin/tailwindcss'), [
    '-i', path.join(root, 'packages/core/src/styles.css'), '-o', out,
  ], {stdio: 'pipe'});
  css =
    fs.readFileSync(out, 'utf8') +
    fs.readFileSync(path.join(root, 'packages/theme-neutral/built/theme.css'), 'utf8');
  browser = await chromium.launch();
}, 120_000);

afterAll(async () => {
  await browser?.close();
});

function components(): string {
  return renderToStaticMarkup(
    <>
      <Button label="حفظ التغييرات" variant="primary" data-testid="button" />
      <TextInput label="الاسم" value="سارة" onChange={() => {}} data-testid="input" />
      <Table
        data={[{name: 'علي', role: 'مهندس'}]}
        idKey="name"
        data-testid="table"
      />
    </>,
  );
}

/** font-family of the button, the native <input>, and a table cell. */
async function fontsIn(html: string): Promise<{button: string; input: string; cell: string}> {
  const page = await browser.newPage();
  await page.setContent(html);
  const fonts = await page.evaluate(() => {
    const f = (el: Element | null) => (el ? getComputedStyle(el).fontFamily : 'missing');
    return {
      button: f(document.querySelector('[data-testid="button"]')),
      input: f(document.querySelector('input')),
      cell: f(document.querySelector('td')),
    };
  });
  await page.close();
  return fonts;
}

const page = (htmlAttrs: string, body: string) =>
  `<!doctype html><html ${htmlAttrs}><head><style>${css}</style></head><body>${body}</body></html>`;
const themed = (inner: string, wrapperAttrs = '') =>
  renderToStaticMarkup(
    <Theme theme={neutralTheme} mode="light" syncRoot={false}>
      <div data-slot="" />
    </Theme>,
  ).replace('<div data-slot=""></div>', `<div ${wrapperAttrs}>${inner}</div>`);

const ARABIC = /^"IBM Plex Sans Arabic"/;
const LATIN = /^Figtree/;

describe('Arabic typography (browser)', () => {
  it('uses IBM Plex Sans Arabic inside lang="ar" dir="rtl", in an English page', async () => {
    const fonts = await fontsIn(page('lang="en"', themed(components(), 'lang="ar" dir="rtl"')));
    expect(fonts.button).toMatch(ARABIC);
    expect(fonts.input).toMatch(ARABIC);
    expect(fonts.cell).toMatch(ARABIC);
  }, 60_000);

  it('keeps the Latin face inside lang="en"', async () => {
    const fonts = await fontsIn(page('lang="en"', themed(components(), 'lang="en" dir="ltr"')));
    expect(fonts.button).toMatch(LATIN);
    expect(fonts.input).toMatch(LATIN);
    expect(fonts.cell).toMatch(LATIN);
  }, 60_000);

  it('follows the page <html lang="ar" dir="rtl"> (syncRoot={false})', async () => {
    const fonts = await fontsIn(page('lang="ar" dir="rtl"', themed(components())));
    expect(fonts.button).toMatch(ARABIC);
    expect(fonts.input).toMatch(ARABIC);
    expect(fonts.cell).toMatch(ARABIC);
  }, 60_000);

  it('treats RTL content with no lang as Arabic', async () => {
    const fonts = await fontsIn(page('dir="rtl"', themed(components())));
    expect(fonts.button).toMatch(ARABIC);
    expect(fonts.cell).toMatch(ARABIC);
  }, 60_000);

  it('does not apply to Hebrew', async () => {
    const fonts = await fontsIn(page('lang="he" dir="rtl"', themed(components())));
    expect(fonts.button).toMatch(LATIN);
    expect(fonts.cell).toMatch(LATIN);
  }, 60_000);
});
