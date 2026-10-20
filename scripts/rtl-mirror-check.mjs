/**
 * Right-to-left mirror check, in a real browser.
 *
 * Renders asymmetric components from the built Storybook in LTR and in RTL and
 * measures where each part sits inside its container. A part at 5% of the
 * width in LTR must sit at ~95% in RTL; fills must grow from the start edge;
 * directional icons must change between the two. Catches what a class lint
 * cannot: a component that only *looks* right in English.
 *
 * Usage: pnpm storybook:build && node scripts/rtl-mirror-check.mjs
 *        node scripts/rtl-mirror-check.mjs --url http://localhost:6007   (a running Storybook)
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');

// [story, container, part, kind, what it proves]
//   mirror         part centre at f of the container in LTR → 1 - f in RTL
//   mirror-all     same, for every matching part (up to 6)
//   start-anchored part touches the container's start edge in both directions
//   changes        computed animation / icon transform differs between LTR and RTL
const CHECKS = [
  ['core-progressbar--with-value-label', '.solo-progress-bar', 'LABEL', 'mirror', 'ProgressBar label sits at the start'],
  ['core-progressbar--with-value-label', '.solo-progress-bar', 'VALUE', 'mirror', 'ProgressBar value ("75%") sits at the end'],
  ['core-progressbar--with-target-mark', '.solo-progress-bar-track', '.solo-progress-bar-fill', 'start-anchored', 'ProgressBar fill grows from the start'],
  ['core-progressbar--with-target-mark', '.solo-progress-bar', '.solo-progress-bar-mark', 'mirror', 'ProgressBar goal mark mirrors'],
  ['core-progressbar--indeterminate', '.solo-progress-bar-track', '.solo-progress-bar-fill', 'changes-animation', 'ProgressBar indeterminate sweep reverses'],
  ['core-slider--range', '.solo-slider-control', '.solo-slider-thumb', 'mirror-all', 'Range Slider thumbs mirror'],
  ['core-switch--on', '.solo-switch', '.solo-switch-thumb', 'mirror', 'Switch "on" thumb sits at the end'],
  ['core-stepper--numbered-horizontal', '.solo-stepper', '.solo-step-indicator', 'mirror', 'Stepper starts at the start'],
  ['core-pagination--default', '.solo-pagination', '.solo-button', 'mirror', 'Pagination "previous" sits at the start'],
  ['core-pagination--default', '.solo-pagination', '.solo-button .solo-icon', 'changes-icon', 'Pagination chevrons flip'],
  ['core-textinput--clearable', '.solo-text-input', '.solo-input-clear-button', 'mirror', 'TextInput clear button sits at the end'],
  ['core-selector--default', '.solo-selector', '.solo-selector-indicator-icon', 'mirror', 'Selector chevron sits at the end'],
  ['core-treelist--basic', '.solo-tree-list-item', '.solo-tree-list-chevron', 'mirror', 'TreeList chevron sits at the start'],
  ['core-treelist--basic', '.solo-tree-list-item', '.solo-tree-list-chevron', 'changes-icon', 'TreeList collapsed chevron points inward'],
  ['core-banner--dismissable', '.solo-banner', '.solo-banner-icon', 'mirror', 'Banner icon sits at the start'],
  ['core-banner--dismissable', '.solo-banner', '.solo-button', 'mirror', 'Banner dismiss button sits at the end'],
  ['core-avatar--with-status', '.solo-avatar', '.solo-avatar-status-dot', 'mirror', 'Avatar status dot sits on the end corner'],
  ['core-calendar--default', '.solo-calendar', '.solo-calendar-nav', 'mirror', 'Calendar "previous month" sits at the start'],
  ['core-calendar--default', '.solo-calendar', '.solo-calendar-nav .solo-icon', 'changes-icon', 'Calendar arrows flip'],
  ['core-breadcrumbs--default', '.solo-breadcrumbs', '.solo-breadcrumb-item', 'mirror', 'Breadcrumbs start at the start'],
  ['core-breadcrumbs--mirrored-icon-separator', '.solo-breadcrumbs', '.solo-breadcrumbs .solo-icon', 'changes-icon', 'Breadcrumb chevron separator flips'],
  ['core-chatmessagelist--conversation', '.solo-chat-message-list', '.solo-chat-message-bubble', 'mirror-all', 'Chat bubbles swap sides'],
  ['core-tablist--overflow', '.solo-tab-list', '.solo-tab', 'mirror', 'Tabs start at the start'],
  ['core-sidenav--nested-items', '.solo-side-nav-item', '.solo-icon', 'mirror', 'SideNav item icon sits at the start'],
  ['charts-bar--simple', 'svg[role=img]', '[data-position="start"] text', 'mirror', 'Chart value axis sits at the start'],
  ['charts-bar--simple', 'svg[role=img]', '[data-position="bottom"] text', 'mirror-all', 'Chart categories run from the start'],
];

const TOLERANCE = 0.06;

// --- Storybook source: a running URL, or the static build served locally ----

let base = process.argv.includes('--url') ? process.argv[process.argv.indexOf('--url') + 1] : null;
let server;
if (!base) {
  const dist = path.join(root, 'apps/storybook/dist');
  if (!fs.existsSync(path.join(dist, 'iframe.html'))) {
    console.error('apps/storybook/dist is missing — run pnpm storybook:build first (or pass --url).');
    process.exit(1);
  }
  const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webp': 'image/webp'};
  server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(dist, url === '/' ? 'index.html' : url);
    if (!file.startsWith(dist) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
}

// --- Measure ---------------------------------------------------------------

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 900, height: 700}});

async function measure(id, dir, container, part) {
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story&globals=direction:${dir}`, {timeout: 120_000});
  await page.waitForSelector('#storybook-root > *', {timeout: 60_000});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  return page.evaluate(({container, part}) => {
    const c = container === '#storybook-root' ? document.querySelector(container) : document.querySelector(`#storybook-root ${container}`);
    if (!c) return {error: `container ${container} not found`};
    const cr = c.getBoundingClientRect();
    const visible = e => {
      const r = e.getBoundingClientRect();
      return r.width > 0 || r.height > 0;
    };
    let els;
    if (part === 'LABEL' || part === 'VALUE') {
      const leaves = [...c.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim() && visible(e));
      const hit = part === 'VALUE' ? leaves.find(e => /%/.test(e.textContent)) : leaves.find(e => !/%/.test(e.textContent));
      els = hit ? [hit] : [];
    } else {
      els = [...c.querySelectorAll(part)].filter(visible);
    }
    if (!els.length) return {error: `part ${part} not found`};
    const frac = e => {
      const r = e.getBoundingClientRect();
      return (r.left + r.width / 2 - cr.left) / cr.width;
    };
    const first = els[0].getBoundingClientRect();
    const svg = els[0].querySelector('svg') ?? els[0].closest('svg') ?? els[0];
    const transforms = [];
    for (let n = svg; n && n !== c.parentElement; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.transform !== 'none') transforms.push(s.transform);
      if (s.scale !== 'none') transforms.push(`scale(${s.scale})`);
      if (s.rotate !== 'none') transforms.push(`rotate(${s.rotate})`);
    }
    return {
      fracs: els.slice(0, 6).map(frac),
      startGap: first.left - cr.left,
      endGap: cr.right - first.right,
      animation: getComputedStyle(els[0]).animationName,
      icon: transforms.join(' ') + '|' + (svg.innerHTML ?? '').length,
    };
  }, {container, part});
}

const pct = f => `${Math.round(f * 100)}%`;
let failures = 0;
for (const [id, container, part, kind, label] of CHECKS) {
  const ltr = await measure(id, 'ltr', container, part);
  const rtl = await measure(id, 'rtl', container, part);
  let ok;
  let detail;
  if (ltr.error || rtl.error) {
    ok = false;
    detail = ltr.error ?? rtl.error;
  } else if (kind === 'mirror') {
    const [l] = ltr.fracs;
    const [r] = rtl.fracs;
    ok = Math.abs(l + r - 1) < TOLERANCE && Math.abs(l - 0.5) > TOLERANCE;
    detail = `LTR ${pct(l)} → RTL ${pct(r)}`;
  } else if (kind === 'mirror-all') {
    const n = Math.min(ltr.fracs.length, rtl.fracs.length);
    ok = n > 1 && ltr.fracs.slice(0, n).every((l, i) => Math.abs(l + rtl.fracs[i] - 1) < TOLERANCE * 1.5);
    detail = `LTR ${ltr.fracs.slice(0, n).map(pct).join(' ')} → RTL ${rtl.fracs.slice(0, n).map(pct).join(' ')}`;
  } else if (kind === 'start-anchored') {
    ok = ltr.startGap < 1.5 && rtl.endGap < 1.5;
    detail = `gap at start edge: LTR ${ltr.startGap.toFixed(1)}px, RTL ${rtl.endGap.toFixed(1)}px`;
  } else if (kind === 'changes-animation') {
    ok = ltr.animation !== rtl.animation && ltr.animation !== 'none';
    detail = `${ltr.animation} → ${rtl.animation}`;
  } else if (kind === 'changes-icon') {
    ok = ltr.icon !== rtl.icon;
    detail = ok ? 'icon transform differs' : 'icon identical in LTR and RTL';
  }
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} — ${detail}`);
}

await browser.close();
server?.close();
console.log(`\n${CHECKS.length - failures}/${CHECKS.length} RTL mirror checks passed`);
process.exit(failures ? 1 : 0);
