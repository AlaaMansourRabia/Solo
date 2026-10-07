/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Page Editor',
  displayName: 'Page Editor',
  description:
    'Three-pane authoring workspace: a source palette on one flank, a live canvas in the middle, and an inspector that retargets to whatever is selected. Drag and drop to reorder, edit to see it render immediately.',
  displayNameAr: 'محرّر الصفحات',
  descriptionAr:
    'مساحة تأليف من ثلاث لوحات: لوحة مصادر على أحد الجانبين، ولوحة رسم حيّة في الوسط، ولوحة فحص تتبدّل وفق العنصر المحدَّد. اسحب وأفلت لإعادة الترتيب، وعدّل لترى النتيجة فورًا.',
  keywords: [
    'builder',
    'composer',
    'drag and drop',
    'page builder',
    'wysiwyg editor',
  ],
  isReady: true,
  category: 'Tools - Page Editor',
  order: 30,
  filter: 'Tools',
  previewAspectRatio: 16 / 10,
  slug: 'editor',
};
