# @solo/eslint-plugin

Lint rules for apps built with Solo.

## `solo/logical-direction`

Left/right styling looks right in an English screenshot and breaks every
right-to-left language: `ml-4` stays on the left when an Arabic page has
mirrored. This rule reports physical-direction styling and names the logical
replacement that follows the reading direction.

| Reported | Use instead |
|---|---|
| `ml-4`, `mr-auto`, `pl-2`, `pr-3` | `ms-4`, `me-auto`, `ps-2`, `pe-3` |
| `left-0`, `right-1/2` | `start-0`, `end-1/2` |
| `text-left`, `text-right` | `text-start`, `text-end` |
| `border-l`, `rounded-r-lg`, `rounded-tl-md` | `border-s`, `rounded-e-lg`, `rounded-ss-md` |
| `float-left`, `[margin-left:4px]` | `float-start`, `[margin-inline-start:4px]` |
| `style={{marginLeft: 8}}`, `style={{left: 0}}` | `marginInlineStart`, `insetInlineStart` |
| `style={{textAlign: 'right'}}` | `textAlign: 'end'` |

It checks `className` / `class` attributes (string literals, template
literals, conditionals), the arguments of `cn`, `clsx`, `classnames`, `cx`,
`twMerge`, `twJoin`, `cva` and `tv` anywhere in the file, and object literals
in `style={{…}}`. Variants and modifiers are kept in the suggestion
(`md:hover:!ml-4` → `md:hover:!ms-4`).

```js
// eslint.config.js
import solo from '@solo/eslint-plugin';

export default [solo.configs.recommended];
```

When something must stay physical (a scroll offset, a deliberately
direction-independent overlay), disable the rule on that line with a reason:

```tsx
// eslint-disable-next-line solo/logical-direction -- canvas ruler is always left-to-right
<div style={{left: x}} />
```

The same detector (`@solo/eslint-plugin/physical`) backs the
`rtl-physical-classes` rule in Solo's own `pnpm docs:check`.
