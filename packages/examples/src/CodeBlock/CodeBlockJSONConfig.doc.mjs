/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'CodeBlock',
  name: 'Code — Config',
  displayName: 'Code — Config',
  description:
    'A JSON configuration file with a title bar and line numbers. The title prop adds a filename label in the header so readers know which file the code belongs to.',
  displayNameAr: 'Code — ملف التهيئة',
  descriptionAr: 'ملف تهيئة JSON مع شريط عنوان وأرقام أسطر. تضيف الخاصية title تسمية باسم الملف في الترويسة ليعرف القرّاء الملف الذي تنتمي إليه الشيفرة.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: ['CodeBlock'],
};
