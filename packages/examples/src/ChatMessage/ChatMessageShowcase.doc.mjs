/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ChatMessage',
  name: 'ChatMessage',
  displayName: 'Chat Message',
  description: 'A user multi-bubble group with delivery status and an assistant ghost response with avatar, name, timestamp, and model info.',
  displayNameAr: 'Chat Message — نظرة عامة',
  descriptionAr: 'مجموعة فقاعات متعددة للمستخدم مع حالة التسليم، وردّ للمساعد بالنمط ghost مع صورة رمزية واسم وطابع زمني ومعلومات النموذج.',
  isReady: true,
  order: 0,
  isShowcase: true,
  aspectRatio: 4 / 3,
  componentsUsed: ['Chat', 'ChatMessage', 'ChatMessageBubble', 'ChatMessageMetadata', 'Avatar', 'Timestamp', 'Text', 'Layout'],
};
