/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Inline Wizard',
  displayName: 'Inline Wizard',
  description:
    'Accordion wizard stacking every step in one column: the active step expands in place while finished ones collapse to a single line carrying their result and a way back in. Steps that run themselves expand into a nested stepper that ticks check by check and halts the column where one fails. Best when later steps depend on what earlier ones decided.',
  displayNameAr: 'معالج ضمني',
  descriptionAr:
    'معالج على هيئة أكورديون يرصّ كل الخطوات في عمود واحد: تتوسّع الخطوة النشطة في مكانها بينما تنطوي الخطوات المكتملة إلى سطر واحد يحمل نتيجتها وطريقة للعودة إليها. أما الخطوات التي تُنفَّذ تلقائيًّا فتتوسّع إلى مؤشر خطوات متداخل يتقدّم فحصًا تلو الآخر ويوقف العمود عند أول فشل. الأنسب حين تعتمد الخطوات اللاحقة على قرارات الخطوات السابقة.',
  // Solo: Solo ships this template without keywords; added from its description.
  keywords: ['wizard', 'accordion', 'multi-step form', 'inline steps', 'stepper', 'onboarding', 'setup flow', 'collapsible steps'],
  isReady: true,
  category: 'Form - Wizard Inline',
  order: 17,
  filter: 'Form',
  previewAspectRatio: 16 / 10,
  slug: 'form-wizard-inline',
};
