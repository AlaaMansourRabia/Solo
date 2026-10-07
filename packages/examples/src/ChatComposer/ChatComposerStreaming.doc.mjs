/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ChatComposer',
  name: 'ChatComposer — Streaming',
  displayName: 'ChatComposer — Streaming',
  description: 'Chat composer with streaming state and a stop button. Use when the assistant is generating a response and the user can cancel.',
  displayNameAr: 'ChatComposer — البث',
  descriptionAr: 'محرّر محادثة مع حالة بث وزر إيقاف. استخدمه عندما يولّد المساعد ردّاً ويمكن للمستخدم إلغاؤه.',
  isReady: true,
  order: 6,
  aspectRatio: 16 / 9,
  componentsUsed: ['ChatComposer', 'Layout', 'Text'],
};
