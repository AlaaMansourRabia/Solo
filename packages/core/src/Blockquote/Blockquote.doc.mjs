

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Blockquote',
  displayName: 'Blockquote',
  category: 'Content',
  keywords: ["blockquote","quote","citation","pullquote","quotation","cite","excerpt"],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content of the blockquote.',
      required: true,
    },
    {
      name: 'cite',
      type: 'ReactNode',
      description: 'Optional attribution for the quote. Rendered in a <cite> element after the quoted content.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  playground: {
    defaults: {
      children:
        'Design is not just what it looks like and feels like. Design is how it works.',
      cite: 'Steve Jobs',
    },
  },
  theming: {
    targets: [
      {className: 'solo-blockquote', visualProps: []},
    ],
  },
  usage: {
    description: 'A quotation block with a rule on its inline-start edge and secondary text color. Use to highlight quoted content, testimonials, or excerpts. The rule and padding are logical, so they move to the right edge in right-to-left locales.',
    anatomy: [
      {name: 'Rule', required: true, description: 'The border on the inline-start edge, drawn with --color-border-emphasized.'},
      {name: 'Quotation', required: true, description: 'The quoted content, passed as children. Renders inside the <blockquote> element.'},
      {name: 'Attribution', required: false, description: 'The source, passed as cite. Renders as a <cite> element below the quotation.'},
    ],
    bestPractices: [
      { guidance: true, description: 'Use for quoted text, testimonials, or highlighted excerpts from external sources.' },
      { guidance: true, description: 'Provide a cite prop when the source of the quote is known.' },
      { guidance: true, description: 'Pass the source through cite rather than typing it into children, so it renders as a semantic <cite> element that assistive technology can distinguish from the quotation.' },
      { guidance: false, description: 'Use for callout boxes or informational notes; use Banner for those.' },
      { guidance: false, description: 'Wrap the attribution in your own <footer>. A <footer> inside a <blockquote> becomes a contentinfo document landmark, and a page with several quotes then reports several page footers.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Blockquote',
  displayName: 'Blockquote',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: '引用块的内容。',
      required: true,
    },
    {
      name: 'cite',
      type: 'ReactNode',
      description: '引用的可选出处。在引用内容之后以 <cite> 元素渲染。',
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-blockquote', visualProps: []},
    ],
  },
  usage: {
    description: '带有行首边框和次要文本颜色的引用块。用于突出显示引用内容、推荐语或摘录。边框和内边距使用逻辑属性，因此在从右到左的语言环境中会移到右侧。',
    anatomy: [
      {name: '边框', required: true, description: '行首边缘的边框，使用 --color-border-emphasized 绘制。'},
      {name: '引用内容', required: true, description: '通过 children 传入的引用内容，渲染在 <blockquote> 元素内。'},
      {name: '出处', required: false, description: '通过 cite 传入的来源，在引用内容下方以 <cite> 元素渲染。'},
    ],
    bestPractices: [
      { guidance: true, description: '用于引用文本、推荐语或来自外部来源的高亮摘录。' },
      { guidance: true, description: '当引用来源已知时，提供 cite 属性。' },
      { guidance: true, description: '通过 cite 传入来源，而不是写在 children 里，这样它会渲染为语义化的 <cite> 元素，辅助技术可以将其与引用内容区分开。' },
      { guidance: false, description: '用于提示框或信息说明，应使用 Banner。' },
      { guidance: false, description: '自行用 <footer> 包裹出处。<blockquote> 内的 <footer> 会成为 contentinfo 文档地标，页面上有多个引用时就会报告多个页脚。' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'كتلة اقتباس ذات خط فاصل على الحافة البادئة ونص بلون ثانوي، مع إسناد اختياري لمصدر الاقتباس.',
  propDescriptions: {
    children: 'محتوى كتلة الاقتباس.',
    cite: 'إسناد اختياري لمصدر الاقتباس. يُعرض داخل عنصر <cite> بعد المحتوى المقتبس.',
    className:
      'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتغلب الأداة المتعارضة على القيمة الافتراضية.',
  },
  usage: {
    description: 'كتلة اقتباس ذات خط فاصل على حافتها البادئة ونص بلون ثانوي. استخدمها لإبراز المحتوى المقتبس أو الشهادات أو المقتطفات. يعتمد الخط الفاصل والحشو على الخصائص المنطقية، لذا ينتقلان إلى الحافة اليمنى في اللغات التي تُكتب من اليمين إلى اليسار (RTL).',
    anatomy: [
      {name: 'الخط الفاصل', required: true, description: 'الحدّ المرسوم على الحافة البادئة باستخدام --color-border-emphasized.'},
      {name: 'الاقتباس', required: true, description: 'المحتوى المقتبس، ويُمرَّر عبر children. يُعرض داخل عنصر <blockquote>.'},
      {name: 'الإسناد', required: false, description: 'المصدر، ويُمرَّر عبر cite. يُعرض كعنصر <cite> أسفل الاقتباس.'},
    ],
    bestPractices: [
      { guidance: true, description: 'استخدمه للنصوص المقتبسة أو الشهادات أو المقتطفات البارزة من مصادر خارجية.' },
      { guidance: true, description: 'وفّر الخاصية cite عندما يكون مصدر الاقتباس معروفًا.' },
      { guidance: true, description: 'مرّر المصدر عبر cite بدلًا من كتابته داخل children، حتى يُعرض كعنصر <cite> دلالي تستطيع التقنيات المساعدة تمييزه عن الاقتباس.' },
      { guidance: false, description: 'لا تستخدمه لمربعات التنبيه أو الملاحظات الإعلامية؛ استخدم Banner لذلك.' },
      { guidance: false, description: 'لا تغلّف الإسناد بعنصر <footer> خاص بك. فعنصر <footer> داخل <blockquote> يصبح معلمًا من نوع contentinfo للمستند، وعندها تُبلغ الصفحة التي تحتوي على عدة اقتباسات عن عدة تذييلات للصفحة.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'quotation block w/ inline-start rule, secondary text, optional citation',
  usage: {
    description: 'A quotation block with a rule on its inline-start edge and secondary text color. Use to highlight quoted content, testimonials, or excerpts.',
    bestPractices: [
      { guidance: true, description: 'Use for quoted text, testimonials, or highlighted excerpts.' },
      { guidance: true, description: 'Provide cite when source is known.' },
      { guidance: true, description: 'Pass the source via cite, not inside children.' },
      { guidance: false, description: 'Use for callouts/notes; use Banner instead.' },
      { guidance: false, description: 'Wrap the attribution in <footer>; it becomes a contentinfo landmark.' },
    ],
  },
  propDescriptions: {
    children: 'blockquote content',
    cite: 'optional attribution rendered as <cite> after the quote',
    className: 'Tailwind classes for layout; merged via cn(), so conflicting utilities override defaults',
  },
};
