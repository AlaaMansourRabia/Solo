/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Stepper',
  name: 'Stepper — Checkout Progress',
  displayName: 'Stepper — Checkout Progress',
  description:
    'The default stepper: a horizontal track where every step owns an equal segment of the progress bar above its label. The default auto indicator resolves itself per step: a check once the step is done, a ring on the current step, a number for the ones still ahead. Click any step to jump.',
  displayNameAr: 'Stepper — تقدّم الدفع',
  descriptionAr: 'Stepper الافتراضي: مسار أفقي تمتلك فيه كل خطوة مقطعًا متساويًا من شريط التقدّم فوق تسميتها. يحدّد المؤشر الافتراضي auto شكله لكل خطوة: علامة صح بعد اكتمال الخطوة، وحلقة على الخطوة الحالية، ورقم للخطوات المتبقية. انقر على أي خطوة للانتقال إليها.',
  isReady: true,
  order: 0,
  isShowcase: true,
  aspectRatio: 16 / 9,
  componentsUsed: ['Stepper'],
};
