/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Selector',
  name: 'Selector — Option descriptions',
  displayName: 'Selector — Option descriptions',
  description:
    'Options carry a description, so the dropdown draws a two-line row. The closed trigger is sized by padding, so it is the size token for a one-line value and exactly one line taller for a two-line one; both on the 4px rhythm. An InputGroup pins the row, so the value folds back onto one line there.',
  displayNameAr: 'Selector — أوصاف الخيارات',
  descriptionAr: 'تحمل الخيارات وصفاً، فترسم القائمة المنسدلة صفاً من سطرين. يُحدَّد حجم المشغّل المغلق بالحشو، فيكون بحجم رمز التصميم لقيمة من سطر واحد وأطول بسطر واحد بالضبط لقيمة من سطرين؛ وكلاهما على إيقاع 4px. يثبّت InputGroup الصف، فتعود القيمة إلى سطر واحد هناك.',
  isReady: true,
  order: 5,
  aspectRatio: 16 / 9,
  componentsUsed: ['Selector', 'SelectorOption', 'InputGroup', 'Button', 'Stack'],
};
