/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Collapsible',
  name: 'Collapsible — FAQ',
  displayName: 'Collapsible — FAQ',
  registry: {aliases: ['collapsible/divided-accordion']},
  description:
    "FAQ built with hasDividers: row hairlines and density padding with no custom CSS. Questions set their own type — body at semibold, not the trigger's default 17px large — so a list of questions reads as rows rather than a stack of headings, and question and answer separate on weight and color instead of size.",
  displayNameAr: 'Collapsible — الأسئلة الشائعة',
  descriptionAr: 'أسئلة شائعة مبنية باستخدام hasDividers: خطوط رفيعة بين الصفوف وحشو حسب الكثافة دون أي CSS مخصّص. تحدّد الأسئلة خطّها بنفسها — نص أساسي بوزن شبه عريض، لا الحجم الكبير 17px الافتراضي للمشغّل — فتُقرأ قائمة الأسئلة كصفوف لا ككومة من العناوين، ويتمايز السؤال عن الإجابة بالوزن واللون بدلاً من الحجم.',
  isReady: true,
  order: 2,
  aspectRatio: 4 / 3,
  componentsUsed: ['Collapsible', 'CollapsibleGroup', 'Text', 'Link', 'Stack'],
};
