/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Stepper',
  name: 'Stepper — Validation Status',
  displayName: 'Stepper — Validation Status',
  description:
    'Semantic status per step in a verification flow: success shows a green check, error a red glyph, accent the in-progress step. Status sets the indicator color and glyph only, never the connector, and is announced to assistive tech as text.',
  displayNameAr: 'Stepper — حالة التحقق',
  descriptionAr: 'حالة دلالية لكل خطوة في مسار تحقق: يعرض success علامة صح خضراء، وerror رمزًا أحمر، وaccent الخطوة قيد التنفيذ. تحدّد الحالة لون المؤشر ورمزه فقط، ولا تؤثر أبدًا في الموصل، ويُعلَن عنها للتقنيات المساعدة كنص.',
  isReady: true,
  order: 6,
  aspectRatio: 4 / 3,
  componentsUsed: ['Stepper'],
};
