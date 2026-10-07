/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Stepper',
  name: 'Stepper — Custom Content',
  displayName: 'Stepper — Custom Content',
  description:
    'A vertical stepper where each step owns a slice of the page. The content slot takes any node (form fields, a summary panel, a banner), so a stepper is not limited to multi-step forms. Rendering the slot only for the active step is what makes the flow expand one step at a time.',
  displayNameAr: 'Stepper — محتوى مخصّص',
  descriptionAr: 'Stepper عمودي تمتلك فيه كل خطوة جزءًا من الصفحة. تقبل فتحة المحتوى أي عقدة (حقول نموذج، لوحة ملخص، لافتة)، لذا لا يقتصر Stepper على النماذج متعددة الخطوات. إن عرض الفتحة للخطوة النشطة فقط هو ما يجعل المسار يتوسّع خطوة واحدة في كل مرة.',
  isReady: true,
  order: 1,
  aspectRatio: 4 / 3,
  componentsUsed: [
    'Stepper',
    'TextInput',
    'Button',
    'Text',
    'Card',
    'Badge',
    'Banner',
  ],
};
