/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'CodeBlock',
  name: 'Code — Terminal',
  displayName: 'Code — Terminal',
  description:
    'A dark terminal-style command block: a bash CodeBlock wrapped in SyntaxTheme with the GitHub Dark preset, copy button on, and no line numbers. Use for shell sessions or CLI output that should read as a terminal even on light pages. Reach for a dark syntax preset instead of hand-rolling a dark box with custom CSS.',
  displayNameAr: 'Code — الطرفية',
  descriptionAr: 'كتلة أوامر داكنة على طراز الطرفية: CodeBlock بلغة bash ملفوفة داخل SyntaxTheme مع الإعداد المسبق GitHub Dark، وزر النسخ مفعَّل، ودون أرقام أسطر. استخدمها لجلسات الصدفة أو مخرجات CLI التي يجب أن تبدو كطرفية حتى على الصفحات الفاتحة. استعن بإعداد مسبق داكن للصياغة بدلاً من بناء صندوق داكن يدوياً باستخدام CSS مخصّص.',
  isReady: true,
  order: 5,
  aspectRatio: 16 / 9,
  componentsUsed: ['CodeBlock', 'SyntaxTheme'],
};
