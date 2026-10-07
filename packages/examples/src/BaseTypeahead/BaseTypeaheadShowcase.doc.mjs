/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'BaseTypeahead',
  name: 'BaseTypeahead',
  displayName: 'Base Typeahead',
  description:
    'A custom result renderer that adds supporting metadata while BaseTypeahead retains option semantics and keyboard behavior.',
  displayNameAr: 'Base Typeahead — نظرة عامة',
  descriptionAr: 'معالج عرض مخصّص للنتائج يضيف بيانات وصفية داعمة، بينما يحتفظ BaseTypeahead بدلالات الخيارات وسلوك لوحة المفاتيح.',
  registry: {slug: 'custom-search-bar'},
  isReady: true,
  order: 0,
  aspectRatio: 16 / 9,
  componentsUsed: ['BaseTypeahead', 'Layout', 'Text'],
};
