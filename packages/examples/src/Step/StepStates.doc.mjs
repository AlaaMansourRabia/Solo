/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Step',
  name: 'Step — States',
  displayName: 'Step — States',
  description:
    'Every state a single Step can land in, each shown as one Step in its own Stepper. Completed, current, and upcoming are derived by comparing the step index against the parent activeStep, so they are never set directly; isDisabled and status are the two a step declares itself. Status is a separate axis from progress, which is why a completed step can still carry a warning.',
  displayNameAr: 'Step — الحالات',
  descriptionAr: 'كل حالة يمكن أن تكون فيها Step واحدة، معروضة كل منها كـ Step في Stepper خاص بها. تُشتقّ الحالات المكتملة والحالية والقادمة بمقارنة فهرس الخطوة مع activeStep في الأب، فلا تُضبط مباشرة أبداً؛ أما isDisabled وstatus فهما ما تصرّح به الخطوة بنفسها. الحالة status محور منفصل عن التقدّم، ولهذا يمكن لخطوة مكتملة أن تحمل تحذيراً.',
  isReady: true,
  order: 3,
  aspectRatio: 4 / 3,
  componentsUsed: ['Stepper', 'Step', 'Text'],
};
