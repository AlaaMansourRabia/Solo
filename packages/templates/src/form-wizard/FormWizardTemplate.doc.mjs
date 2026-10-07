/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Form Wizard',
  displayName: 'Form Wizard',
  description:
    'Linear multi-step form that moves through one panel at a time, with a horizontal progress track pinned above rather than running down a rail, so every step keeps the full content width for its fields. Only the current step renders, unlike an accordion where each section expands into one long scrolling form. Each advance is validated, and a step left broken stays flagged to jump back to.',
  displayNameAr: 'معالج النماذج',
  descriptionAr:
    'نموذج خطّي متعدد الخطوات ينتقل عبر لوحة واحدة في كل مرة، مع مسار تقدّم أفقي مثبّت في الأعلى بدلًا من شريط جانبي، لتحتفظ كل خطوة بكامل عرض المحتوى لحقولها. تُعرض الخطوة الحالية فقط، بخلاف الأكورديون الذي يتوسّع فيه كل قسم ضمن نموذج طويل واحد قابل للتمرير. يُتحقَّق من صحة كل انتقال، وتبقى الخطوة المتروكة بأخطاء مُعلَّمة للعودة إليها.',
  keywords: [
    'wizard',
    'stepper',
    'multi-step',
    'onboarding',
    'setup',
    'signup',
    'guided flow',
    'step-by-step',
    'workflow',
    'review step',
    'request flow',
  ],
  isReady: true,
  category: 'Form - Wizard',
  order: 16,
  filter: 'Form',
  previewAspectRatio: 16 / 10,
  slug: 'form-wizard',
};
