/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'LayoutHeader',
  name: 'LayoutHeader — With Actions',
  displayName: 'LayoutHeader — With Actions',
  description:
    'A fixed page header with a title and a primary action, above scrollable content. Use LayoutHeader inside Layout for persistent page-level headers.',
  displayNameAr: 'LayoutHeader — مع الإجراءات',
  descriptionAr: 'ترويسة صفحة ثابتة بعنوان وإجراء أساسي فوق محتوى قابل للتمرير. استخدم LayoutHeader داخل Layout لترويسات دائمة على مستوى الصفحة.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'LayoutHeader',
    'Layout',
    'LayoutContent',
    'Center',
    'Card',
    'HStack',
    'Heading',
    'Button',
  ],
};
