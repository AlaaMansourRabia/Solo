/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ScrollableArea',
  name: 'ScrollableArea — Overscroll',
  displayName: 'Scrollable Area — Overscroll',
  description:
    'The same section, two edge policies: the default overscroll="allow" hands a gesture that reaches the end to the panel behind it, while overscroll="contain" stops it at the section edge.',
  displayNameAr: 'Scrollable Area — التمرير الزائد',
  descriptionAr: 'القسم نفسه بسياستين للحافة: overscroll="allow" الافتراضية تُسلّم الإيماءة التي تبلغ النهاية إلى اللوحة خلفها، بينما توقفها overscroll="contain" عند حافة القسم.',
  isReady: true,
  order: 2,
  aspectRatio: 1,
  componentsUsed: ['ScrollableArea', 'Card', 'Grid'],
};
