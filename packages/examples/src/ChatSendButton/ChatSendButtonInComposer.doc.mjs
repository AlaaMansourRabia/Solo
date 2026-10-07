/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ChatSendButton',
  name: 'ChatSendButton — In Composer',
  displayName: 'ChatSendButton — In Composer',
  description: 'Send button inside ChatComposer, where it reads state from context automatically. No wiring needed; the button enables when the input has content.',
  displayNameAr: 'ChatSendButton — داخل المحرّر',
  descriptionAr: 'زر إرسال داخل ChatComposer، حيث يقرأ الحالة من السياق تلقائياً. لا حاجة إلى أي توصيل؛ يُفعَّل الزر عندما يحتوي حقل الإدخال على محتوى.',
  isReady: true,
  order: 2,
  aspectRatio: 16 / 9,
  componentsUsed: ['Chat', 'ChatComposer', 'ChatSendButton', 'Layout'],
};
