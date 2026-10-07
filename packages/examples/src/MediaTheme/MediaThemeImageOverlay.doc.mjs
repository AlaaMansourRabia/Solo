/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'MediaTheme',
  name: 'MediaTheme — Image Overlay',
  displayName: 'MediaTheme — Image Overlay',
  description:
    'A common image card pattern: place text and actions over a dark gradient and wrap the overlay content in MediaTheme mode="dark".',
  displayNameAr: 'MediaTheme — طبقة فوق الصورة',
  descriptionAr: 'نمط شائع لبطاقات الصور: ضع النص والإجراءات فوق تدرّج داكن، ولُفّ محتوى الطبقة داخل MediaTheme mode="dark".',
  isReady: true,
  order: 1,
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
