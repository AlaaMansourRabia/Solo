/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ComplexSelector',
  name: 'ComplexSelector — Deadline Picker',
  displayName: 'Complex Selector — Deadline Picker',
  description:
    'A multi-step deadline field: pick a preset like Today or Next week, or switch to a custom date and time before applying. The popup stays open until the user commits, so the content owns the Apply action.',
  displayNameAr: 'Complex Selector — منتقي الموعد النهائي',
  descriptionAr: 'حقل موعد نهائي متعدد الخطوات: اختر إعدادًا مسبقًا مثل Today أو Next week، أو انتقل إلى تاريخ ووقت مخصصين قبل التطبيق. تبقى النافذة المنبثقة مفتوحة حتى يؤكد المستخدم اختياره، لذا يملك المحتوى إجراء Apply.',
  isReady: true,
  order: 1,
  aspectRatio: 4 / 3,
  componentsUsed: [
    'ComplexSelector',
    'RadioList',
    'DateInput',
    'TimeInput',
    'Button',
  ],
};
