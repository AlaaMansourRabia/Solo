/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Table',
  alsoExampleFor: ['useTableColumnSettings'],
  alsoShowcaseFor: ['useTableColumnSettings'],
  name: 'Table — Column Settings',
  displayName: 'Table — Column Settings',
  description:
    'Table with a column visibility picker in the toolbar. Toggle columns on and off.',
  displayNameAr: 'Table — إعدادات الأعمدة',
  descriptionAr: 'جدول مع منتقي إظهار الأعمدة في شريط الأدوات. بدّل إظهار الأعمدة وإخفاءها.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: ['Table', 'MultiSelector', 'Toolbar', 'Text', 'Layout'],
};
