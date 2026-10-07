/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'TreeList',
  name: 'Tree List — Variants',
  displayName: 'Tree List — Variants',
  description:
    'The `variant` prop controls whether hierarchy guide lines are shown: `lineGuides` (default) draws connector lines between parent and child rows, while `noGuides` relies on indentation alone. It is orthogonal to `density`, which controls spacing.',
  displayNameAr: 'Tree List — الأنماط',
  descriptionAr: 'تتحكّم الخاصية `variant` في إظهار خطوط إرشاد التسلسل الهرمي: ترسم `lineGuides` (الافتراضي) خطوط توصيل بين الصفوف الأب والفرعية، بينما تعتمد `noGuides` على الإزاحة وحدها. وهي مستقلة عن `density` التي تتحكّم في التباعد.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: ['TreeList', 'Stack', 'Text'],
};
