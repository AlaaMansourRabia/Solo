/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'DateInput',
  name: 'DateInput — Formats',
  displayName: 'DateInput — Formats',
  description:
    "The format prop reuses Timestamp's format vocabulary to control how the committed value is displayed: date, date_long (default), date_weekday, and system_date, or a function for a fully custom string. Formatting applies only to the committed value, never to text the user is actively typing.",
  displayNameAr: 'DateInput — التنسيقات',
  descriptionAr: 'تعيد الخاصية format استخدام مفردات التنسيق في Timestamp للتحكم في طريقة عرض القيمة المعتمدة: date وdate_long (افتراضي) وdate_weekday وsystem_date، أو دالة لنص مخصّص بالكامل. يُطبَّق التنسيق على القيمة المعتمدة فقط، ولا يُطبَّق أبدًا على النص الذي يكتبه المستخدم حاليًا.',
  isReady: true,
  order: 3,
  aspectRatio: 16 / 9,
  componentsUsed: ['DateInput', 'Layout', 'Text'],
};
