/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Step',
  name: 'Step',
  displayName: 'Step',
  description:
    'A single Step, with every part it can render: the indicator, the label with its optional marker and trailing endContent, and the description beneath. A Step never sets its own completed/current state. It declares its index and derives the rest from the parent Stepper, so one Step in one Stepper is a complete example.',
  displayNameAr: 'Step — نظرة عامة',
  descriptionAr: 'Step واحد مع كل جزء يمكنه عرضه: المؤشر، والتسمية مع علامتها الاختيارية وendContent الختامي، والوصف أسفلها. لا يضبط Step حالته المكتملة/الحالية بنفسه، بل يصرّح بفهرسه ويشتقّ الباقي من Stepper الأب، لذا فإن Step واحداً في Stepper واحد مثال كامل.',
  isReady: true,
  order: 0,
  isShowcase: true,
  aspectRatio: 16 / 9,
  componentsUsed: ['Stepper', 'Step', 'Text'],
};
