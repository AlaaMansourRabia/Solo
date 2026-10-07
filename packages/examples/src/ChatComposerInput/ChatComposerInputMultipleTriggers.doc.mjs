/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ChatComposerInput',
  name: 'ChatComposerInput — Multiple Triggers',
  displayName: 'ChatComposerInput — Multiple Triggers',
  description:
    'Chat input with both @ mentions and / commands. Each trigger type renders tokens in a distinct color so users can tell them apart at a glance.',
  displayNameAr: 'ChatComposerInput — مُشغِّلات متعددة',
  descriptionAr: 'حقل إدخال محادثة يدعم إشارات @ وأوامر / معًا. يعرض كل نوع مُشغِّل رموزه بلون مميز حتى يتمكن المستخدمون من التمييز بينها بنظرة سريعة.',
  isReady: true,
  order: 4,
  aspectRatio: 16 / 9,
  componentsUsed: ['ChatComposer', 'ChatComposerInput', 'Typeahead', 'Layout', 'Text'],
};
