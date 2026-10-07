/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'CodeBlock',
  name: 'Code — Snippet',
  displayName: 'Code — Snippet',
  description:
    'Short terminal commands with a copy button and no line numbers. Use for install instructions or one-liner commands that readers will paste directly.',
  displayNameAr: 'Code — مقتطف',
  descriptionAr: 'أوامر طرفية قصيرة مع زر نسخ ودون أرقام أسطر. استخدمها لتعليمات التثبيت أو الأوامر ذات السطر الواحد التي سيلصقها القرّاء مباشرة.',
  isReady: true,
  order: 4,
  aspectRatio: 16 / 9,
  componentsUsed: ['CodeBlock', 'Stack'],
};
