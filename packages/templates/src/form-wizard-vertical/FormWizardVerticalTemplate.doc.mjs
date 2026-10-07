/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Vertical Wizard',
  displayName: 'Vertical Wizard',
  description:
    'Multi-step wizard with the steps in a fixed left rail that stays visible while the form scrolls, plus a side panel whose guidance follows the focused field. Suits long or unequal steps carrying uploads, previews, and dense review metadata. As width tightens the guidance drops first, then the rail rotates into a horizontal stepper above the form.',
  displayNameAr: 'معالج عمودي',
  descriptionAr:
    'معالج متعدد الخطوات تظهر فيه الخطوات في شريط أيسر ثابت يبقى مرئيًّا بينما يُمرَّر النموذج، مع لوحة جانبية تتبع إرشاداتها الحقل الذي عليه التركيز. يناسب الخطوات الطويلة أو غير المتساوية التي تتضمن عمليات رفع ومعاينات وبيانات وصفية كثيفة للمراجعة. ومع تضيّق العرض تختفي الإرشادات أولًا، ثم يتحوّل الشريط إلى مؤشر خطوات أفقي فوق النموذج.',
  // Solo: Solo ships this template without keywords; added from its description.
  keywords: ['wizard', 'multi-step form', 'vertical stepper', 'left rail', 'guided setup', 'uploads', 'review step', 'onboarding'],
  isReady: true,
  category: 'Form - Wizard Vertical',
  order: 19,
  filter: 'Form',
  previewAspectRatio: 16 / 10,
  slug: 'form-wizard-vertical',
};
