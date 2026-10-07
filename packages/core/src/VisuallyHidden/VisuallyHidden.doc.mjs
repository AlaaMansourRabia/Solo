

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'VisuallyHidden',
  displayName: 'VisuallyHidden',
  category: 'Utility',
  keywords: ["visually hidden","sr-only","screen reader","accessibility","a11y","aria-live","hidden label","assistive technology"],
  props: [
    {
      name: 'children',
      required: true,
      type: 'ReactNode',
      description: 'Content exposed to assistive technology while hidden from sight.',
    },
    {
      name: 'as',
      type: 'ElementType',
      description: 'HTML tag to render as. Use a block element for live regions.',
      default: "'span'",
    },
  ],
  usage: {
    description: 'Renders content in the accessibility tree while hiding it visually. Use for accessible names on icon-only controls, aria-live announcement regions, and supplementary screen-reader context. Deliberately has no styling props; the whole point is to stay invisible.',
    bestPractices: [
      { guidance: true, description: 'Use to give icon-only buttons and controls an accessible name that screen readers announce.' },
      { guidance: true, description: 'Render as a block element (as="div") with aria-live to announce dynamic updates like drag-and-drop or result counts.' },
      { guidance: false, description: 'Use it to hide content from everyone; it stays in the accessibility tree; use conditional rendering or `hidden` to remove content entirely.' },
      { guidance: false, description: 'Put interactive controls inside it; the content is not visible and cannot receive pointer input.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'VisuallyHidden',
  displayName: 'VisuallyHidden',
  props: [
    {
      name: 'children',
      required: true,
      type: 'ReactNode',
      description: '对辅助技术公开但对视觉隐藏的内容。',
    },
    {
      name: 'as',
      type: 'ElementType',
      description: '要渲染的 HTML 标签。实时区域请使用块级元素。',
      default: "'span'",
    },
  ],
  usage: {
    description: 'Renders content in the accessibility tree while hiding it visually. Use for accessible names on icon-only controls, aria-live announcement regions, and supplementary screen-reader context.',
    bestPractices: [
      { guidance: true, description: 'Use to give icon-only buttons and controls an accessible name that screen readers announce.' },
      { guidance: true, description: 'Render as a block element (as="div") with aria-live to announce dynamic updates like drag-and-drop or result counts.' },
      { guidance: false, description: 'Use it to hide content from everyone; it stays in the accessibility tree; use conditional rendering or `hidden` to remove content entirely.' },
      { guidance: false, description: 'Put interactive controls inside it; the content is not visible and cannot receive pointer input.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض المحتوى في شجرة إمكانية الوصول مع إخفائه بصريًا، للأسماء القابلة للوصول ومناطق الإعلانات وسياق قارئ الشاشة الإضافي.',
  propDescriptions: {
    children: 'محتوى يُكشف للتقنيات المساعدة مع إخفائه عن الأنظار.',
    as: 'وسم HTML الذي يُعرض به. استخدم عنصرًا كتليًا للمناطق الحية.',
  },
  usage: {
    description: 'يعرض المحتوى في شجرة إمكانية الوصول مع إخفائه بصريًا. استخدمه للأسماء القابلة للوصول في عناصر التحكم ذات الأيقونة فقط، ومناطق إعلانات aria-live، والسياق الإضافي لقارئ الشاشة. لا يحتوي عمدًا على خصائص تنسيق؛ فالغاية كلها أن يبقى غير مرئي.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدمه لمنح الأزرار وعناصر التحكم ذات الأيقونة فقط اسمًا قابلًا للوصول يعلنه قارئ الشاشة.',
      },
      {
        guidance: true,
        description: 'اعرضه كعنصر كتلي (as="div") مع aria-live للإعلان عن التحديثات الديناميكية مثل السحب والإفلات أو أعداد النتائج.',
      },
      {
        guidance: false,
        description: 'استخدامه لإخفاء المحتوى عن الجميع؛ فهو يبقى في شجرة إمكانية الوصول؛ استخدم العرض الشرطي أو `hidden` لإزالة المحتوى كليًا.',
      },
      {
        guidance: false,
        description: 'وضع عناصر تحكم تفاعلية داخله؛ فالمحتوى غير مرئي ولا يمكنه تلقي إدخال المؤشر.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'renders content in the a11y tree while hiding it visually (sr-only)',
  usage: {
    description: 'Renders content in the accessibility tree while hiding it visually. Use for accessible names on icon-only controls, aria-live announcement regions, and supplementary screen-reader context.',
    bestPractices: [
      { guidance: true, description: 'Use to give icon-only buttons and controls an accessible name that screen readers announce.' },
      { guidance: true, description: 'Render as a block element (as="div") with aria-live to announce dynamic updates like drag-and-drop or result counts.' },
      { guidance: false, description: 'Use it to hide content from everyone; it stays in the accessibility tree; use conditional rendering or `hidden` to remove content entirely.' },
      { guidance: false, description: 'Put interactive controls inside it; the content is not visible and cannot receive pointer input.' },
    ],
  },
  propDescriptions: {
    children: 'content exposed to AT while visually hidden',
    as: 'HTML tag to render as; block element for live regions',
  },
};
