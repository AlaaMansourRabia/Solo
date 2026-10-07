/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ChatMessage',
  name: 'ChatMessage — Ghost',
  displayName: 'ChatMessage — Ghost',
  description: 'Ghost variant for messages without visible bubble boundaries. Keeps padding for alignment but renders a transparent background, useful for AI-style responses.',
  displayNameAr: 'ChatMessage — النمط ghost',
  descriptionAr: 'النمط ghost للرسائل دون حدود فقاعة مرئية. يحتفظ بالحشو للمحاذاة لكنه يعرض خلفية شفافة، وهو مفيد للردود على طريقة الذكاء الاصطناعي.',
  isReady: true,
  order: 2,
  aspectRatio: 4 / 3,
  componentsUsed: ['Chat', 'ChatMessage', 'ChatMessageBubble', 'ChatMessageMetadata', 'Timestamp', 'Text', 'Layout'],
};
