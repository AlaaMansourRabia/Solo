/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ChatMessageBubble',
  name: 'ChatMessageBubble — Custom Content',
  displayName: 'ChatMessageBubble — Custom Content',
  description: 'Custom in-message content aligned to the bubble text column. An artifact card is wrapped in a ghost bubble with width="100%", so its left edge matches the bubble text and it spans the full message column instead of the default bubble width cap; the timestamp rides the bubble metadata slot.',
  displayNameAr: 'ChatMessageBubble — محتوى مخصّص',
  descriptionAr: 'محتوى مخصّص داخل الرسالة محاذى لعمود نص الفقاعة. تُغلَّف بطاقة عنصر في فقاعة بنمط ghost مع width="100%"، بحيث تطابق حافتها البادئة نص الفقاعة وتمتد على كامل عمود الرسالة بدلًا من الحد الأقصى الافتراضي لعرض الفقاعة؛ ويُعرض الطابع الزمني في فتحة البيانات الوصفية للفقاعة.',
  isReady: true,
  order: 1,
  aspectRatio: 4 / 3,
  componentsUsed: ['Chat', 'ChatMessage', 'ChatMessageBubble', 'ChatMessageMetadata', 'ClickableCard', 'Text', 'Timestamp'],
};
