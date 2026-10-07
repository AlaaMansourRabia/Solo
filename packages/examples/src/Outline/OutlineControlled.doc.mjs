/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Outline',
  name: 'Outline — Controlled',
  displayName: 'Outline — Controlled',
  description:
    'Drive the active section yourself with activeId and onActiveIdChange. Providing activeId disables the built-in scroll-spy so your own logic owns the highlight.',
  displayNameAr: 'Outline — متحكَّم به',
  descriptionAr: 'تحكّم في القسم النشط بنفسك عبر activeId وonActiveIdChange. يؤدي تمرير activeId إلى تعطيل تتبّع التمرير المدمج، فيتولّى منطقك الخاص التمييز.',
  isReady: true,
  order: 1,
  aspectRatio: 4 / 3,
  componentsUsed: ['Outline', 'Layout', 'Text', 'Button'],
};
