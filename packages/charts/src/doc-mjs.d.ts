/**
 * @file Ambient module declaration for `*.doc.mjs` imports.
 *
 * Component contract tests (packages/core/src/__tests__/*Contract.test.tsx)
 * import `{Name}.doc.mjs` files directly to assert their documented props
 * stay in sync with the component's real API. Without this declaration,
 * TypeScript has no way to type a `.mjs` import and fails with
 * TS7016 ("Could not find a declaration file for module").
 */

declare module '*.doc.mjs' {
  import type {
    ComponentDoc,
    ComponentTranslationDoc,
  } from '@solo/docs-types';

  export const docs: ComponentDoc;
  export const docsZh: ComponentDoc;
  export const docsDense: ComponentTranslationDoc;
  export const docsAr: ComponentTranslationDoc;
}
