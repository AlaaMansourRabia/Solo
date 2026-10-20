# Changelog

All notable changes to Solo. Each release is published on
[GitHub Releases](https://github.com/AlaaMansourRabia/Solo/releases) — watch the
repository with **Watch → Custom → Releases** to be notified.

Add entries under **Unreleased** as you work; `pnpm release <version>` turns
that section into the release notes.

## Unreleased

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
