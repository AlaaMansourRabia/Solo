/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Dialog',
  alsoExampleFor: ['useImperativeDialog'],
  name: 'Dialog — Form',
  displayName: 'Dialog — Form',
  description:
    'Collects user input without navigating away from the page. Uses purpose="form" so clicking the backdrop won\'t close it. Use for editing profiles, creating items, or updating settings inline.',
  displayNameAr: 'Dialog — النموذج',
  descriptionAr: 'يجمع مدخلات المستخدم دون مغادرة الصفحة. يستخدم purpose="form" بحيث لا يؤدي النقر على الخلفية إلى إغلاقه. استخدمه لتعديل الملفات الشخصية أو إنشاء العناصر أو تحديث الإعدادات في مكانها.',
  isReady: true,
  order: 3,
  aspectRatio: 3 / 4,
  componentsUsed: ['Dialog', 'Layout', 'Button', 'TextInput', 'TextArea'],
};
