/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Timestamp',
  name: 'Timestamp — Tooltip time zones',
  displayName: 'Timestamp — Tooltip time zones',
  description:
    'Hover tooltips that show one instant across several time zones or formats. Use tooltipEntries when readers must compare zones, like an incident log carrying both the reader\'s time and the event\'s origin zone.',
  displayNameAr: 'Timestamp — المناطق الزمنية في التلميح',
  descriptionAr: 'تلميحات عند التمرير بالمؤشر تعرض لحظة واحدة عبر عدة مناطق زمنية أو تنسيقات. استخدم tooltipEntries عندما يحتاج القرّاء إلى المقارنة بين المناطق، مثل سجل حوادث يحمل وقت القارئ والمنطقة الزمنية لمصدر الحدث معًا.',
  isReady: true,
  order: 6,
  aspectRatio: 16 / 9,
  componentsUsed: ['Timestamp', 'Layout', 'Text'],
};
