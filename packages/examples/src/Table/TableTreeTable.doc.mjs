/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'useTableTreeData',
  alsoExampleFor: ['useTableTreeState'],
  alsoShowcaseFor: ['useTableTreeState'],
  name: 'useTableTreeData: Tree Table',
  displayName: 'useTableTreeData: Tree Table',
  description:
    'A file-tree table built from nested data. useTableTreeState flattens the tree into the visible rows and owns the expanded set; useTableTreeData draws the per-level indent and the expand/collapse chevron in the tree column. The two hooks are designed to work together, so this one example covers both. hasExpandAllControl adds the expand-all/collapse-all toggle to the tree column header. Collapsed branches are unmounted, not hidden.',
  displayNameAr: 'useTableTreeData: جدول شجري',
  descriptionAr: 'جدول شجرة ملفات مبني من بيانات متداخلة. يحوّل useTableTreeState الشجرة إلى صفوف مرئية مسطّحة ويملك مجموعة العناصر الموسّعة؛ بينما يرسم useTableTreeData الإزاحة لكل مستوى والسهم المعقوف للتوسيع/الطي في عمود الشجرة. صُمّم الخطّافان للعمل معًا، لذا يغطي هذا المثال كليهما. يضيف hasExpandAllControl مفتاح توسيع الكل/طي الكل إلى ترويسة عمود الشجرة. تُزال الفروع المطوية من DOM بدلًا من إخفائها.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: ['Table'],
};
