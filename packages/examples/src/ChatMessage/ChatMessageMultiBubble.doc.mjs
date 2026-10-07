/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ChatMessage',
  name: 'ChatMessage — Multi-Bubble',
  displayName: 'ChatMessage — Multi-Bubble',
  description: 'Grouped bubbles using the group prop for corner radius reduction. Use first, middle, and last to visually connect related bubbles from the same sender.',
  displayNameAr: 'ChatMessage — فقاعات متعددة',
  descriptionAr: 'فقاعات مجمّعة تستخدم الخاصية group لتقليل نصف قطر الزوايا. استخدم first وmiddle وlast لربط الفقاعات ذات الصلة من المرسل نفسه بصرياً.',
  isReady: true,
  order: 3,
  aspectRatio: 1,
  componentsUsed: ['Chat', 'ChatMessage', 'ChatMessageBubble', 'ChatMessageMetadata', 'Avatar', 'Timestamp', 'Text', 'Layout'],
};
