/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'useTableSelection',
  name: 'Table: Floating Bulk Actions',
  displayName: 'Table: Floating Bulk Actions',
  description:
    'The reusable TableSelectionToolbar inside a capped, self-contained scroll region for a long non-sticky table below metric cards. The caller-owned sticky placement keeps actions 16px from the example scrollport without moving the table when selection changes.',
  displayNameAr: 'Table: الإجراءات الجماعية العائمة',
  descriptionAr: 'TableSelectionToolbar القابل لإعادة الاستخدام داخل منطقة تمرير مستقلة ومحدودة الارتفاع لجدول طويل غير مثبّت أسفل بطاقات المقاييس. يُبقي الموضع المثبّت الذي يملكه المستدعي الإجراءات على بعد 16px من منفذ تمرير المثال دون تحريك الجدول عند تغيّر التحديد.',
  isReady: true,
  order: 2,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'Table',
    'TableSelectionToolbar',
    'Button',
    'ScrollableArea',
  ],
};
