/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ChatDictationButton',
  name: 'ChatDictationButton — Basic',
  displayName: 'ChatDictationButton — Basic',
  description:
    'A dictation button wired to useChatDictation and placed in the sendActions slot of a ChatComposer. Click the microphone to transcribe speech into the input.',
  displayNameAr: 'ChatDictationButton — أساسي',
  descriptionAr: 'زر إملاء موصول بـ useChatDictation وموضوع في الفتحة sendActions ضمن ChatComposer. انقر على الميكروفون لتحويل الكلام إلى نص في حقل الإدخال.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'Chat',
    'ChatDictationButton',
    'ChatComposer',
    'ChatComposerInput',
  ],
};
