/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Toolbar',
  name: 'Toolbar — Card Header',
  displayName: 'Toolbar — Card Header',
  description:
    'A toolbar as a card header with a left-aligned title and icon actions on the right. Use Toolbar instead of LayoutHeader when your card header has interactive actions; Toolbar adds start/end slot layout, keyboard navigation, and automatic size cascading. If the header is just a title with no actions, a LayoutHeader or Section is enough.',
  displayNameAr: 'Toolbar — ترويسة البطاقة',
  descriptionAr: 'شريط أدوات كترويسة بطاقة بعنوان محاذى إلى البداية وإجراءات بأيقونات في النهاية. استخدم Toolbar بدلًا من LayoutHeader عندما تحتوي ترويسة البطاقة على إجراءات تفاعلية؛ إذ يضيف Toolbar تخطيط فتحتي البداية/النهاية والتنقّل بلوحة المفاتيح وتوريث الحجم تلقائيًا. إذا كانت الترويسة مجرد عنوان بلا إجراءات، فإن LayoutHeader أو Section يكفي.',
  isReady: true,
  order: 2,
  aspectRatio: 16 / 9,
  componentsUsed: ['Toolbar', 'Button', 'Icon', 'Text', 'Card', 'Section'],
};
