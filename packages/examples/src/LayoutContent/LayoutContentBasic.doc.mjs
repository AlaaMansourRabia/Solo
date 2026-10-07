/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'LayoutContent',
  name: 'LayoutContent — Basic',
  displayName: 'LayoutContent — Basic',
  description:
    'A scrollable main content area below a fixed header. Use LayoutContent inside Layout to get automatic padding and scroll containment for the primary content.',
  displayNameAr: 'LayoutContent — أساسي',
  descriptionAr: 'منطقة محتوى رئيسية قابلة للتمرير أسفل ترويسة ثابتة. استخدم LayoutContent داخل Layout للحصول على حشو تلقائي واحتواء للتمرير للمحتوى الأساسي.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'LayoutContent',
    'Layout',
    'LayoutHeader',
    'Center',
    'Card',
    'VStack',
    'Heading',
    'Text',
  ],
};
