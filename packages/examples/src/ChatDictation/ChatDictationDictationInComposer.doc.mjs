/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ChatDictationButton',
  name: 'ChatDictationButton — In Composer',
  displayName: 'ChatDictationButton — In Composer',
  description: 'Dictation button placed in the sendActions slot of a chat composer. Shows the recommended integration point for voice input alongside the send button.',
  displayNameAr: 'ChatDictationButton — داخل المحرّر',
  descriptionAr: 'زر إملاء موضوع في الفتحة sendActions لمحرّر المحادثة. يوضّح نقطة الدمج الموصى بها للإدخال الصوتي بجوار زر الإرسال.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: ['ChatDictation', 'ChatComposer', 'Layout', 'Text'],
};
