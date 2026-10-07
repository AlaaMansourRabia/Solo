/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ChatMessageMetadata',
  name: 'ChatMessageMetadata — Status',
  displayName: 'ChatMessageMetadata — Status',
  description: 'All 5 delivery statuses (sending, sent, delivered, read, and error), each with a timestamp. Use to show message delivery progress or surface failures.',
  displayNameAr: 'ChatMessageMetadata — الحالة',
  descriptionAr: 'جميع حالات التسليم الخمس (sending وsent وdelivered وread وerror)، ولكل منها طابع زمني. استخدمها لعرض تقدّم تسليم الرسالة أو إظهار حالات الفشل.',
  isReady: true,
  order: 2,
  aspectRatio: 1,
  componentsUsed: ['Chat', 'ChatMessageMetadata', 'Timestamp'],
};
