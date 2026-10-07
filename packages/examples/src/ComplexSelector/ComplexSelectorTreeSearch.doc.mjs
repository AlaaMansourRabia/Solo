/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ComplexSelector',
  name: 'ComplexSelector — Tree Search',
  displayName: 'Complex Selector — Tree Search',
  description:
    'A destination picker that combines a search field with a TreeList hierarchy. TreeList owns tree keyboard navigation; ComplexSelector owns the trigger, popover, and focus restore. Selecting a folder closes the popup.',
  displayNameAr: 'Complex Selector — البحث في الشجرة',
  descriptionAr: 'منتقي وجهة يجمع بين حقل بحث وتسلسل هرمي من TreeList. يملك TreeList التنقّل بلوحة المفاتيح في الشجرة؛ ويملك ComplexSelector المُشغِّل والنافذة المنبثقة واستعادة التركيز. يؤدي اختيار مجلد إلى إغلاق النافذة المنبثقة.',
  isReady: true,
  order: 2,
  aspectRatio: 4 / 3,
  componentsUsed: ['ComplexSelector', 'TextInput', 'TreeList'],
};
