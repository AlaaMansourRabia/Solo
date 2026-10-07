# Solo

Solo is a React design system — **core components, design tokens and charts** — styled with [Tailwind CSS v4](https://tailwindcss.com). Components are accessible, themeable and right-to-left ready.

| Package | Description |
|---|---|
| `@solo/core` | Components, theme system (`Theme`, `defineTheme`), tokens, hooks, i18n |
| `@solo/charts` | Chart, axes, grid, legend, tooltip and marks (d3-based) |
| `@solo/theme-neutral` | The Solo Neutral theme (default in Storybook), plus a pre-built variant (`/built` + `theme.css`) |
| `@solo/examples` | Example blocks for the docs (one standalone component per example card) |
| `@solo/templates` | 55 page templates for the Templates gallery |
| `@solo/docs-types` | Authoring types for `.doc.mjs` files (`ComponentDoc`, `TemplateDoc`, …) |
| `@solo/docs-registry` | `families.json` (which components share a page) and `sidebar.json` |
| `@solo/storybook` | Storybook for every component, chart and template |

## Getting started

Requires Node 22+ and pnpm.

```bash
pnpm install
pnpm storybook        # http://localhost:6006
pnpm typecheck
pnpm test
```

## Using the components

```css
/* app.css */
@import "@solo/core/styles.css";
@import "@solo/charts/styles.css"; /* if you use charts */

/* optional: your own Tailwind, plus token-backed utilities (bg-surface, text-primary, …) */
@import "tailwindcss";
@import "@solo/core/tailwind-theme.css";
```

```tsx
import {Theme} from '@solo/core';
import {Button} from '@solo/core/Button';
import {neutralTheme} from '@solo/theme-neutral';

export function App() {
  return (
    <Theme theme={neutralTheme} mode="light">
      <Button label="Save" variant="primary" />
    </Theme>
  );
}
```

### Embedding in a host page

For a site that keeps its own styles (e.g. a docs website), use the
reset-free stylesheet and keep the theme off `<html>`:

```css
/* Declare the layer order first, before any other stylesheet */
@layer theme, base, reset, solo-base, solo-theme, components, utilities;

@import "@solo/core/components.css";      /* styles.css minus reset.css */
@import "@solo/charts/components.css";
@import "@solo/theme-neutral/theme.css";  /* pre-built theme, no runtime injection */
@import "@solo/examples/styles.css";      /* only if you render the example blocks */
```

```tsx
import {Theme} from '@solo/core';
import {neutralTheme} from '@solo/theme-neutral/built';

<Theme theme={neutralTheme} mode="light" syncRoot={false}>…</Theme>
```

`syncRoot={false}` stops the root Theme from writing `data-solo-theme` /
`data-theme` onto `<html>`, so the theme's `@scope`'d element rules (e.g.
`p { color }`) stay inside the Theme instead of restyling the host page.
Popovers, tooltips, menus and dialogs render inside the Theme wrapper and stay
themed; the Toast fallback viewport mirrors the wrapper's attributes.
`ThemeNestingContext` is exported for hosts that need to detect a parent
Theme. Note that `components.css` relies on the host's reset: a few component
rules (e.g. `[aria-disabled]` cursors, media in `AspectRatio`) live in
`reset.css`.

### Overriding styles

Pass `className`. Classes are merged with
[tailwind-merge](https://github.com/dcastil/tailwind-merge), so a conflicting
utility overrides the component's default:

```tsx
<Button label="Wide" className="w-full" />
```

### CSS layers

The layer order:

```
reset → theme → base → solo-base → solo-theme → components → utilities
```

Component styles compile into `solo-base`, `<Theme>` overrides are injected
into `solo-theme`, and your app's Tailwind utilities win over both.

## Styling notes

- **No bare value classes.** Components emit only `solo-*` classes plus
  `data-*` attributes for their props, so they never collide with Tailwind
  utilities (`ring`, `block`, `static`…). Style a variant with
  `[data-variant="primary"]`.
- **Logical sizes.** Components use `inline-size`/`block-size` rather than
  `width`/`height`, so they follow the writing mode.

## Templates

`@solo/templates` holds 55 page templates, one folder per template:
`src/<slug>/<Name>Template.tsx` (default export, renders standalone inside a
`<Theme>`) and `<Name>Template.doc.mjs` (`doc`: `type: 'page'`, `name`,
`displayName`, `description`, `keywords`, `isReady`, `category`, plus Solo's
`slug`, `order`, `filter`, `previewAspectRatio`).

- **Gallery.** `order` and `filter` reproduce the Solo Templates gallery:
  filter chips Dashboard, Table, Form, Settings, Login, Tools, Content, AI Chat,
  Gallery, Shell (the category group); sorted by group, then name. The gallery
  shows templates with `isReady && !isHiddenFromOverview` (50 of 55); previews
  are 16/10 (1440×900).
- **Assets.** Images/video ship in `@solo/templates/public/template-assets/`
  (only the 62 files the templates reference). Serve that folder at
  `/template-assets/`, or set `globalThis.__SOLO_TEMPLATE_ASSET_BASE__` before
  the templates load; `templateAssetBase` / `templateAsset(file)` are exported.
- **Styles.** Import `@solo/templates/styles.css` after the component
  stylesheets for the utilities the templates use directly.
- **Dependencies.** The dashboard templates draw charts with `recharts`; it
  is the one third-party library templates may import.
- **Hidden.** The gallery hides 5 templates (Simple Table, Basic Login,
  Incident Console, Messaging Shell, Theme Showcase) via `order`.

Storybook has a **Templates** section with one full-screen story per template
(`node scripts/generate-template-stories.mjs` regenerates them).

## Arabic and RTL

- **Arabic docs.** Every component/hook doc has a `docsAr` export (a
  `ComponentTranslationDoc` / `HookTranslationDoc` overlay of the English
  `docs`: description, usage, best practices, anatomy, prop/param/return
  descriptions). Blocks and templates carry `displayNameAr`/`descriptionAr`;
  `families.json` has `displayNameAr`/`descriptionAr`, `sidebar.json` has
  `categoryAr`/`displayNameAr`, and `categories.json` maps the overview
  categories to Arabic. Template filter names: `TEMPLATE_FILTER_NAMES_AR` in
  `@solo/docs-types`. Terminology: `docs/i18n/ar-glossary.md`.
- **RTL.** Components use logical properties (start/end, inline/block), so
  they mirror under `dir="rtl"`; `pnpm docs:check` fails on new physical-
  direction classes (`rtl-physical-classes`; exceptions in
  `scripts/rtl-allowlist.json`).
- **Arabic typography.** Arabic-script content — `lang="ar" | "fa" | "ur"`
  (read from the page's own `<html lang>` too, so it works with
  `<Theme syncRoot={false}>`), or right-to-left content with no `lang`
  inside a Theme, never Hebrew — is set in `--font-family-body-arabic` /
  `--font-family-heading-arabic` (default IBM Plex Sans Arabic, then Noto
  Sans Arabic), with taller line heights (body 1.6, headings 1.4) and no
  letter-spacing. Sizes and weights are unchanged and `--font-family-code`
  is never switched. Themes override the two tokens like any font token
  (`defineTheme({tokens: {'--font-family-body-arabic': …}})`); the neutral
  theme sets them explicitly. Rules: `packages/core/src/theme/arabicTypography.ts`.
- **Loading the Arabic font.** Solo references no font URLs. Either import
  the optional `@solo/core/fonts/ibm-plex-sans-arabic.css` (woff2, 400–700,
  Arabic + Latin subsets, `font-display: swap`, files shipped from
  `@fontsource/ibm-plex-sans-arabic`, OFL), or load IBM Plex Sans Arabic
  yourself (e.g. Google Fonts) — the tokens only name the family.
- **Arabic mock text.** Templates and stories keep their English mock data
  in source; Arabic is a dictionary overlay. Each template has
  `src/<slug>/<Name>Template.ar.json` (English → Arabic), exported as
  `templateMockTextAr` / `templateMockTextArBySlug` from `@solo/templates`;
  Storybook's story strings live in `apps/storybook/i18n/stories.ar.json`.
  Wrap a preview in `<MockTextTranslator dictionary={…} isEnabled={isArabic}>`
  and its exact-match text, `placeholder`, `aria-label`, `title` and `alt`
  are shown in Arabic (code, `translate="no"` and input values are left
  alone; React updates are re-translated). Brand/company names, dates, IDs,
  file names and code stay as written by design.
- **Charts.** In RTL the plot mirrors: the x scale runs right → left, a
  `left` axis (and the wider margin) moves to the right edge, reference-line
  `start`/`end` labels flip. Axis text inherits the Arabic font, and month /
  weekday / quarter tick labels come from the shared vocabulary in
  `packages/templates/src/i18n/common.ar.json` (composite labels such as
  "Mar 12" or "9:00 AM" are translated word by word).
- **Storybook.** There is no language switcher: the **Direction** toolbar
  drives everything. LTR is English content in Figtree; RTL is Arabic
  (`ar-SA` catalog, Arabic mock text, `docsAr` on Docs pages) in IBM Plex
  Sans Arabic.

## Docs sources

Solo is the source for the docs website. Everything a component page is built
from lives in this repo:

| What | Where |
|---|---|
| Component docs (`docs`, `docsZh`, `docsDense`) | `packages/core/src/<Component>/<Component>.doc.mjs`, `packages/charts/src/<Chart…>.doc.mjs`; hooks in `packages/core/src/hooks/*.doc.mjs` |
| Doc types (`@type` in every `.doc.mjs`) | `packages/docs-types/src/index.ts` (`@solo/docs-types`) |
| Example blocks (example cards) | `packages/examples/src/<Component>/<Block>.tsx` + `<Block>.doc.mjs` (`type`, `exampleFor`, `name`, `displayName`, `description`, `isReady`, `order`) — `order: 0` is the `<Component>Showcase` overview |
| Families (components sharing one page) | `packages/docs-registry/families.json` — `{page, displayName, group, package, description, members}` |
| Sidebar categories and order | `packages/docs-registry/sidebar.json` — Components (with Utilities), then Canary components → Charts |
| Locales | `packages/core/src/i18n/generated-locales` (committed) |

Components not listed in a family get a page of their own. Every family
member has its own `<Member>.doc.mjs` (with `subComponentOf` pointing at the
family doc, which keeps the shared usage/anatomy/theming). Blocks render
standalone with no props; their mock data lives inside the block, and titles
are unique per `exampleFor` (a showcase that would repeat another block's
title is "<Component> — Overview").

`pnpm docs:check` (run in CI) validates all of it: every component folder has
a doc, documented props match the props interfaces (names, types, defaults,
required), every block's `exampleFor` is a documented component, every block
renders (vitest + jsdom) without leaking non-DOM props onto elements and
imports only what Solo exports, block titles are unique per `exampleFor`,
family members exist and each has its own doc file, every family page has at
least one block, `slotElements` name exported components, templates are
valid and render, every Arabic field exists (`translation-ar`), and no
physical-direction classes slip in (`rtl-physical-classes`).

## Styling conventions

Components are styled with Tailwind classes that read the design tokens:
token shorthands like `bg-(--color-accent)`, the custom variants `usable:` and
`can-hover:`, named groups for ancestor state, dynamic values through custom
properties, and keyframes in colocated `.css` files. Helper scripts:

- `scripts/generate-tokens-css.mjs` — writes `theme/tokens.css` from `theme/tokenVars.ts`
- `scripts/sync-css-imports.mjs` — keeps component `.css` imports in `styles.css` in sync
- `scripts/tw-explain.mjs "classes…"` — prints the CSS a class list compiles to

## License

MIT — see [LICENSE](./LICENSE). Notices for included third-party software are
in [THIRD_PARTY_NOTICES](./THIRD_PARTY_NOTICES).
