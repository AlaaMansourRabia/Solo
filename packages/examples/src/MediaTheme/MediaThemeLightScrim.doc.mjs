/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'MediaTheme',
  name: 'MediaTheme — Light Scrim',
  displayName: 'MediaTheme — Light Scrim',
  description:
    'A light scrim over an image. Use MediaTheme mode="light" so text and ghost buttons use dark-on-light tokens.',
  displayNameAr: 'MediaTheme — غشاء فاتح',
  descriptionAr: 'غشاء فاتح فوق صورة. استخدم MediaTheme mode="light" ليستخدم النص وأزرار ghost رموز تصميم داكنة على فاتح.',
  isReady: true,
  order: 2,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'MediaTheme',
    'AspectRatio',
    'Button',
    'Section',
    'Layout',
    'Text',
  ],
};
