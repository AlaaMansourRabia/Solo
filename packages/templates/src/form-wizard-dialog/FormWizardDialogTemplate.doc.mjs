/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Dialog Wizard',
  displayName: 'Dialog Wizard',
  description:
    'Step through a short flow in a dialog, overlay, or popup launched from the page underneath, which stays where it was. Compact step markers and a pinned action row inside a constrained width, rather than the full page a wizard usually gets. Best for two to four short steps — setup, invite, schedule, onboarding — where losing the context underneath would cost more than the flow is worth.',
  displayNameAr: 'معالج في مربع حوار',
  descriptionAr:
    'انتقل عبر تدفق قصير داخل مربع حوار أو طبقة متراكبة أو نافذة منبثقة تُفتح من الصفحة الأساسية التي تبقى في مكانها. مؤشرات خطوات مضغوطة وصف إجراءات مثبّت ضمن عرض محدود، بدلًا من الصفحة الكاملة التي يحظى بها المعالج عادة. الأنسب لخطوتين إلى أربع خطوات قصيرة — الإعداد، والدعوة، والجدولة، والتهيئة — حين تكون خسارة السياق الأساسي أكثر كلفة من قيمة التدفق نفسه.',
  keywords: ['setup', 'invite', 'schedule', 'onboarding'],
  isReady: true,
  category: 'Form - Wizard Dialog',
  order: 15,
  filter: 'Form',
  previewAspectRatio: 16 / 10,
  slug: 'form-wizard-dialog',
};
