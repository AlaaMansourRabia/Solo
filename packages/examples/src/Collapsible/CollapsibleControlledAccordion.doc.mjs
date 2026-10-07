/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Collapsible',
  name: 'Collapsible — Controlled',
  displayName: 'Collapsible — Controlled',
  description:
    'Manage the open section from parent state, so something other than a click can move it: a URL parameter, a form jumping to the step that failed validation, or the Previous/Next controls shown here. onChange hands back the whole open value.',
  displayNameAr: 'Collapsible — متحكَّم به',
  descriptionAr: 'أدِر القسم المفتوح من حالة العنصر الأب، ليتمكّن شيء غير النقر من تحريكه: معامل في URL، أو نموذج ينتقل إلى الخطوة التي فشل التحقق منها، أو عناصر التحكم Previous/Next المعروضة هنا. يعيد onChange قيمة الفتح كاملة.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'Collapsible',
    'CollapsibleGroup',
    'Card',
    'Text',
    'Button',
    'Stack',
  ],
};
