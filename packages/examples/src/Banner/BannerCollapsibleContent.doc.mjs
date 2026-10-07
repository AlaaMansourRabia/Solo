/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Banner',
  name: 'Banner — Collapsible',
  displayName: 'Banner — Collapsible',
  description: 'Combine an action button, dismiss control, and a collapsible detail area in one banner. Children sit behind the toggle by default; `collapsible={{defaultIsOpen: true}}` starts it open, and `collapsible={false}` drops the toggle entirely. Use for complex notifications like config changes or deployment summaries.',
  displayNameAr: 'Banner — قابل للطي',
  descriptionAr: 'اجمع زر إجراء وعنصر تحكم للإغلاق ومنطقة تفاصيل قابلة للطي في لافتة واحدة. يكون المحتوى الفرعي مخفيًا خلف مفتاح التبديل افتراضيًا؛ تبدأ `collapsible={{defaultIsOpen: true}}` اللافتة مفتوحة، بينما تزيل `collapsible={false}` مفتاح التبديل كليًا. استخدمها للإشعارات المعقدة مثل تغييرات الإعدادات أو ملخصات النشر.',
  isReady: true,
  order: 2,
  aspectRatio: 16 / 9,
  componentsUsed: ['Banner', 'Button', 'List', 'Layout', 'Text'],
};
