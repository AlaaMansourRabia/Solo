/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Step',
  name: 'Step — Indicator',
  displayName: 'Step — Indicator',
  description:
    'Everything the indicator prop accepts: the auto default, an always-number badge, a custom ReactNode, and none, each on its own completed Step so the prop is the only difference between them. Every variant occupies the same 16px box, so a step swapping its number for a check as it completes never shifts the label beside it. The last cell shows that a custom node can be live rather than static: a Spinner on a step that is in progress, shaded `inherit` so it picks up the step\'s own tint like any other glyph.',
  displayNameAr: 'Step — المؤشر',
  descriptionAr: 'كل ما تقبله الخاصية indicator: القيمة auto الافتراضية، وشارة رقم دائمة، وReactNode مخصّص، وnone، كلٌّ على Step مكتمل خاص به بحيث تكون الخاصية هي الفرق الوحيد بينها. يشغل كل نمط الصندوق نفسه بحجم 16px، فلا تُزيح الخطوةُ التسميةَ المجاورة عند استبدال رقمها بعلامة صح عند اكتمالها. توضّح الخلية الأخيرة أن العقدة المخصّصة يمكن أن تكون حيّة لا ثابتة: Spinner على خطوة قيد التقدّم، مظلّل بـ `inherit` ليأخذ لون الخطوة نفسها مثل أي رمز آخر.',
  isReady: true,
  order: 2,
  aspectRatio: 4 / 3,
  componentsUsed: ['Stepper', 'Step', 'Icon', 'Spinner', 'Text'],
};
