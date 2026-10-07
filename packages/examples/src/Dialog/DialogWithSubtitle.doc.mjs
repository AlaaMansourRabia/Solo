/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Dialog',
  alsoExampleFor: ['useImperativeDialog'],
  name: 'Dialog — Required',
  displayName: 'Dialog — Required',
  description:
    'Cannot be dismissed by Escape or backdrop click; the user must explicitly choose an action. Uses purpose="required". Use for ownership transfers, legal acknowledgements, or critical decisions where skipping is not an option.',
  displayNameAr: 'Dialog — مطلوب',
  descriptionAr: 'لا يمكن إغلاقه بالمفتاح Escape أو بالنقر على الخلفية؛ يجب على المستخدم اختيار إجراء صراحةً. يستخدم purpose="required". استخدمه لنقل الملكية أو الإقرارات القانونية أو القرارات الحرجة التي لا يمكن تخطّيها.',
  isReady: true,
  order: 5,
  aspectRatio: 4 / 3,
  componentsUsed: ['Dialog', 'Layout', 'Button', 'Text'],
};
