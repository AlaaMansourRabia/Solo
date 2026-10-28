# Changelog

All notable changes to Solo. Each release is published on
[GitHub Releases](https://github.com/AlaaMansourRabia/Solo/releases) — watch the
repository with **Watch → Custom → Releases** to be notified.

Add entries under **Unreleased** as you work; `pnpm release <version>` turns
that section into the release notes.

## Unreleased

## 0.2.0 — 2026-10-28

Eleven new page templates, a way to keep full-screen overlays inside a frame,
and right-to-left fixes found while building them.

### New templates (66 in total)

- **Site Operations Dashboard** — a construction site's live view (headcount
  by hour, hours by trade, safety events, zone occupancy, live alerts), built
  only with `@solo/charts`, so every chart mirrors in right-to-left.
- **Booking Flow** — reserve a room: availability calendar or date range, time
  slots, room cards that explain why they're unavailable, and a live countdown
  (Timer `endTime`) while the room is held.
- **Onboarding** — first-run setup in four skippable steps with a live preview.
- **Team Members** — inline roles, right-click and "…" actions, invites as
  tokens, seat usage and confirmations.
- **Billing & Invoices** — plan, usage meters, payment method, invoices, change
  plan, add seats, cancel.
- **Listing Detail** — photo carousel with a full-screen viewer, amenities,
  reviews and a date-range booking panel.
- **Notifications & Activity** — a day-grouped feed with filters, inline
  approve / reply / mute, and "mark all as read" with Undo.
- **Help Article** — long-form reading with a table of contents, code,
  quotes and citations.
- **Search Results** — facets with counts, relevance sorting, highlighted
  matches and "did you mean".
- **Error Page** — 404, 500, 403 and maintenance (with a countdown) from one
  constant.
- **Mobile App Shell** — a phone-first app with bottom tabs, sheets and a side
  menu (portrait preview).

### Components

- **`OverlayBoundary`** (new, `@solo/core`): full-screen overlays opened inside
  it — MobileNav, BottomSheet, BottomSheetSwitcher and Selector's touch sheet —
  size themselves and their scrim to its rectangle instead of the whole window.
  Use it for device frames, embedded previews and design canvases.
- **Code and CodeBlock** always render left-to-right, so code stays readable on
  right-to-left pages.
- **Tokenizer:** the "Create …" suggestion is translatable (new message key
  `@solo.tokenizer.createOption`, Arabic included); its handle is documented
  correctly (`focus()`, `blur()`).
- **MockTextTranslator:** `scope="document"` also translates content rendered
  outside the wrapped subtree (toasts, portals).

### Storybook and tooling

- Templates are listed in gallery order (00–65).
- `dir` and `lang` are set on `<html>` like a real app, so toasts and portals
  follow the direction; each template is translated with its own Arabic
  dictionary.
- The timing tests (`*.perf.test.*`) run on their own in CI
  (`pnpm test:perf`), so a busy test run can no longer fail them.

## 0.1.0 — 2026-10-20

The first public release of Solo: a React design system styled with Tailwind
CSS v4, built for English and Arabic in one codebase.

### Components and foundations

- **109 components and 56 hooks** in `@solo/core` — actions, forms, overlays,
  navigation, tables, chat, layout — accessible and themeable.
- **Design tokens** as CSS variables, with a theme system (`Theme`,
  `defineTheme`) and the **Neutral** theme (`@solo/theme-neutral`), including
  a pre-built variant with no runtime injection.
- **Charts** (`@solo/charts`): bar, line, area, dot, band, candlestick, error
  bars, reference lines, WebGL heatmap and scatter, with axes, grid, legend
  and tooltip.
- **55 page templates** (`@solo/templates`) — dashboards, tables, forms,
  settings, login, AI chat, galleries, app shells.
- **Timer countdowns**: `endTime` and `onComplete` turn Timer into a
  countdown that stops at zero.

### Arabic and right-to-left

- Every component mirrors under `dir="rtl"`; the CI renders 26 asymmetric
  parts (progress bars, sliders, switches, steppers, pagination, inputs,
  chat bubbles, charts…) in a real browser and fails unless each mirrors.
- Logical APIs: `ChartAxis position`, `ChartTooltip placement` and `Chart
  margin` take `start`/`end` (`left`/`right` remain as deprecated aliases).
- Arabic text uses **IBM Plex Sans Arabic** through tokens; Arabic docs
  (`docsAr`) for every component; Arabic mock content for every template and
  story; Storybook's **Direction** toolbar switches language and font.

### For AI coding agents

- `llms.txt`, `llms-full.txt` and `AGENTS.md`, generated from the component
  docs: what each component is for and which sibling to use instead.
- The same guidance in each component's JSDoc (`@agentGuidance`).
- **`@solo/eslint-plugin`** — the `logical-direction` rule flags left/right
  classes and inline styles (`ml-4`, `style={{marginLeft}}`) in apps built
  with Solo and names the logical replacement.

### Docs

- Component docs, example blocks, families and sidebar registry for the docs
  website, validated by `pnpm docs:check`.
