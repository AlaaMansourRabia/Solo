/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'CodeBlock',
  displayName: 'Code Block',
  category: 'Content',
  keywords: [
    'code', 'syntax', 'highlight', 'snippet', 'prism', 'shiki',
    'pre', 'monospace', 'codeblock', 'inline',
  ],
  description: 'Fenced code block with syntax highlighting. Use for multi-line code snippets.',
  props: [
    {
      name: 'code',
      type: 'string',
      description: 'The code string to display.',
      required: true,
    },
    {
      name: 'language',
      type: 'string',
      description: 'Language for syntax highlighting. Use "plaintext" to disable.',
      default: "'plaintext'",
    },
    {
      name: 'title',
      type: 'string',
      description: 'Filename or label shown in the header bar.',
    },
    {
      name: 'hasLanguageLabel',
      type: 'boolean',
      description: 'Show the language name in the header bar. Hidden when language is "plaintext".',
      default: 'true',
    },
    {
      name: 'hasLineNumbers',
      type: 'boolean',
      description: 'Show a line number gutter.',
      default: 'false',
    },
    {
      name: 'highlightLines',
      type: 'number[]',
      description: '1-indexed line numbers to highlight.',
    },
    {
      name: 'hasCopyButton',
      type: 'boolean',
      description: 'Show a copy-to-clipboard button.',
      default: 'true',
    },
    {
      name: 'onCopy',
      type: '() => void',
      description: 'Callback after the code is copied.',
    },
    {
      name: 'isWrapped',
      type: 'boolean',
      description: 'Wrap long lines instead of enabling horizontal scroll.',
      default: 'false',
    },
    {
      name: 'maxHeight',
      type: 'number | string',
      description: 'Max height before the block scrolls vertically.',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Text size variant.',
      default: "'md'",
    },
    {
      name: 'width',
      type: 'string',
      description: "Width of the code block. Any CSS width value. 'fit-content' (default) shrinks to longest line. '100%' fills parent width.",
      default: "'fit-content'",
    },
    {
      name: 'container',
      type: "'card' | 'section'",
      description: "Container presentation style. 'card' (default): border and radius with the muted syntax background for a standalone card look. 'section': no border or radius and a transparent background so the block blends into the card or panel it's embedded in.",
      default: "'card'",
    },
    {
      name: 'tokenizer',
      type: '(code: string, language: string) => Array<{type: string; start: number; end: number}>',
      description: 'Custom tokenizer override for unsupported languages.',
    },
    {
      name: 'syntaxTheme',
      type: 'SyntaxThemeDefinition',
      description: 'Per-instance syntax theme override. Shorthand for wrapping the block in <SyntaxTheme theme={...}>. Accepts a preset from @solo/core/theme/syntax or a theme created with defineSyntaxTheme(). Defaults to the nearest SyntaxTheme ancestor or the theme-level syntax colors.',
    },
    {
      name: 'highlightMode',
      type: "'auto' | 'ranges' | 'spans'",
      description: 'Syntax highlighting rendering mode.',
      default: "'auto'",
    },
    {
      name: 'isCollapsible',
      type: 'boolean',
      description: 'Allow collapsing the code body into just the header bar. Starts expanded; a visible header becomes clickable when the code exceeds collapsibleThreshold lines. Headerless blocks never collapse, and removing the header expands a previously collapsed block.',
      default: 'false',
    },
    {
      name: 'collapsibleThreshold',
      type: 'number',
      description: 'Minimum number of lines before the collapse toggle appears. Below this threshold the code block renders normally even when isCollapsible is true.',
      default: '10',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLPreElement>',
      description: 'Ref forwarded to the root code-block element.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description: 'Inline styles. Prefer className: its classes merge with the component classes and stay overridable, while inline styles always win over className.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  components: [
    {name: 'Code'},
  ],
  playground: {
    defaults: {
      code: "import {Button} from '@solo/core/Button';\n\nexport function App() {\n  return <Button label=\"Hello\" variant=\"primary\" />;\n}",
      language: 'tsx',
      hasCopyButton: true,
    },
  },
  theming: {
    targets: [
      {className: 'solo-code-block', visualProps: ['size', 'language', 'container']},
      {className: 'solo-code-block-header', visualProps: ['size', 'language', 'container']},
      {className: 'solo-code-block-title', visualProps: ['size', 'language']},
      {className: 'solo-code-block-copy-button'},
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {className: 'solo-codeblock', visualProps: ['size', 'language', 'container'], deprecatedFor: 'code-block'},
      {className: 'solo-codeblock-header', visualProps: ['size', 'language', 'container'], deprecatedFor: 'code-block-header'},
      {className: 'solo-codeblock-title', visualProps: ['size', 'language'], deprecatedFor: 'code-block-title'},
      {className: 'solo-codeblock-copy-button', deprecatedFor: 'code-block-copy-button'},
    ],
    vars: [
      {name: '--_codeblock-gutter-width', description: 'Width of the line-number gutter, computed from the digit count of the last line so the code column starts at a stable offset.', default: '2ch', private: true},
    ],
  },
  usage: {
    description: 'CodeBlock renders syntax-highlighted code with line numbers, a copy button, and optional collapsible sections. Use CodeBlock for multi-line snippets like source files, terminal commands, and configuration examples. Use Code for inline references to function names, variables, or CLI flags within body text.',
    bestPractices: [
      {guidance: true, description: 'Set the language prop to match the code content so syntax highlighting is accurate. Use "plaintext" when the language is unknown.'},
      {guidance: true, description: 'Add a title when the code represents a file. It gives readers context and appears in the header bar alongside the copy button.'},
      {guidance: true, description: 'Use Code for short inline references like function names or CLI flags, and CodeBlock for standalone multi-line snippets.'},
      {guidance: false, description: 'Enable line numbers on short snippets (under 5 lines) where they add clutter without helping navigation.'},
      {guidance: false, description: 'Nest a code block inside a scrollable container. Use the maxHeight prop instead, which handles overflow natively.'},
    ],
    anatomy: [
      {name: 'Header Bar', required: false, description: 'Shows the title, visible language label, and copy button when a header is present. A title or visible language label creates the header; the copy button alone floats at the top-end of a headerless block.'},
      {name: 'Header Title', required: false, description: 'Groups the optional title, visible language label, and collapsible chevron inside the header bar.'},
      {name: 'Line Numbers', required: false, description: 'Numbered gutter along the left edge. Enable with hasLineNumbers.'},
      {name: 'Code Body', required: true, description: 'The syntax-highlighted code content.'},
      {name: 'Highlighted Lines', required: false, description: 'Background accent on specific lines to draw attention.'},
      {name: 'Copy Button', required: false, description: 'Copies the code string to the clipboard. Shown by default.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description: 'CodeBlock displays syntax-highlighted code snippets with optional line numbers, copy button, and collapsible sections. Use CodeBlock for fenced multi-line code and Code for inline code within prose.',
    bestPractices: [
      { guidance: true, description: 'Set the language prop to enable syntax highlighting. Use "plaintext" when the language is unknown or not supported.' },
      { guidance: true, description: 'Use Code for short inline code references within body text, and CodeBlock for standalone multi-line snippets.' },
      { guidance: false, description: 'Enable line numbers for short snippets where they add visual noise without aiding comprehension.' },
      { guidance: false, description: 'Wrap code blocks in a scrollable container when isWrapped or maxHeight already handles overflow.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'كتلة شيفرة مسوّرة مع تلوين نحوي. استخدمها لمقتطفات الشيفرة متعددة الأسطر.',
  propDescriptions: {
    code: 'سلسلة الشيفرة المراد عرضها.',
    language: 'اللغة المستخدمة في التلوين النحوي. استخدم "plaintext" لتعطيله.',
    title: 'اسم الملف أو التسمية المعروضة في شريط الترويسة.',
    hasLanguageLabel: 'يعرض اسم اللغة في شريط الترويسة. يُخفى عندما تكون اللغة "plaintext".',
    hasLineNumbers: 'يعرض هامشًا لأرقام الأسطر.',
    highlightLines: 'أرقام الأسطر المراد إبرازها (يبدأ الترقيم من 1).',
    hasCopyButton: 'يعرض زر النسخ إلى الحافظة.',
    onCopy: 'دالة استدعاء تُنفَّذ بعد نسخ الشيفرة.',
    isWrapped: 'يلفّ الأسطر الطويلة بدلًا من تفعيل التمرير الأفقي.',
    maxHeight: 'الحد الأقصى للارتفاع قبل أن تُمرَّر الكتلة عموديًا.',
    size: 'نمط حجم النص.',
    width:
      'عرض كتلة الشيفرة. أي قيمة عرض CSS. \'fit-content\' (الافتراضي) يتقلّص إلى أطول سطر. و\'100%\' يملأ عرض العنصر الأب.',
    container:
      'نمط عرض الحاوية. \'card\' (الافتراضي): حدود ونصف قطر مع خلفية نحوية خافتة لمظهر بطاقة مستقلة. \'section\': بلا حدود أو نصف قطر وبخلفية شفافة لتندمج الكتلة في البطاقة أو اللوحة المضمّنة فيها.',
    tokenizer: 'مُجزّئ مخصّص يتجاوز الافتراضي للغات غير المدعومة.',
    syntaxTheme:
      'تجاوز لسمة التلوين النحوي لكل نسخة. اختصار لتغليف الكتلة في <SyntaxTheme theme={...}>. يقبل إعدادًا مسبقًا من @solo/core/theme/syntax أو سمة مُنشأة بـ defineSyntaxTheme(). القيمة الافتراضية أقرب سلف SyntaxTheme أو ألوان التلوين النحوي على مستوى السمة.',
    highlightMode: 'وضع عرض التلوين النحوي.',
    isCollapsible:
      'يسمح بطيّ متن الشيفرة إلى شريط الترويسة فقط. تبدأ الكتلة موسّعة؛ ويصبح الترويسة المرئية قابلة للنقر عندما تتجاوز الشيفرة collapsibleThreshold سطرًا. لا تُطوى الكتل بلا ترويسة أبدًا، وإزالة الترويسة توسّع الكتلة المطوية سابقًا.',
    collapsibleThreshold:
      'الحد الأدنى لعدد الأسطر قبل ظهور مفتاح الطيّ. دون هذا الحد تُعرض كتلة الشيفرة بشكل عادي حتى لو كانت isCollapsible تساوي true.',
    ref: 'مرجع يُمرَّر إلى عنصر كتلة الشيفرة الجذري.',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
    style:
      'أنماط مضمّنة. يُفضَّل className: إذ تُدمج فئاته مع فئات المكوّن وتبقى قابلة للتجاوز، بينما تتغلب الأنماط المضمّنة دائمًا على className.',
    'data-testid': 'محدِّد اختبار لأطر الاختبار الآلي.',
  },
  usage: {
    description:
      'يعرض CodeBlock شيفرة ملوّنة نحويًا مع أرقام الأسطر وزر نسخ وأقسام قابلة للطيّ اختياريًا. استخدم CodeBlock للمقتطفات متعددة الأسطر مثل الملفات المصدرية وأوامر الطرفية وأمثلة الإعدادات. واستخدم Code للإشارات المضمّنة إلى أسماء الدوال أو المتغيرات أو خيارات CLI داخل النص.',
    bestPractices: [
      {
        guidance: true,
        description:
          'عيّن الخاصية language لتطابق محتوى الشيفرة حتى يكون التلوين النحوي دقيقًا. استخدم "plaintext" عندما تكون اللغة غير معروفة.',
      },
      {
        guidance: true,
        description:
          'أضف title عندما تمثّل الشيفرة ملفًا؛ فهو يمنح القرّاء سياقًا ويظهر في شريط الترويسة بجانب زر النسخ.',
      },
      {
        guidance: true,
        description:
          'استخدم Code للإشارات المضمّنة القصيرة مثل أسماء الدوال أو خيارات CLI، وCodeBlock للمقتطفات المستقلة متعددة الأسطر.',
      },
      {
        guidance: false,
        description:
          'لا تفعّل أرقام الأسطر في المقتطفات القصيرة (أقل من 5 أسطر) حيث تضيف ازدحامًا دون أن تساعد في التنقّل.',
      },
      {
        guidance: false,
        description:
          'لا تُدرج كتلة شيفرة داخل حاوية قابلة للتمرير. استخدم بدلًا من ذلك الخاصية maxHeight التي تعالج الفيض أصلًا.',
      },
    ],
    anatomy: [
      {
        name: 'شريط الترويسة',
        required: false,
        description:
          'يعرض العنوان وتسمية اللغة المرئية وزر النسخ عند وجود ترويسة. يُنشئ العنوان أو تسمية اللغة المرئية الترويسة؛ أما زر النسخ وحده فيطفو في الطرف العلوي النهائي للكتلة التي بلا ترويسة.',
      },
      {
        name: 'عنوان الترويسة',
        required: false,
        description: 'يجمع العنوان الاختياري وتسمية اللغة المرئية وسهم الطيّ داخل شريط الترويسة.',
      },
      {
        name: 'أرقام الأسطر',
        required: false,
        description: 'هامش مرقّم على طول الحافة اليسرى. فعّله عبر hasLineNumbers.',
      },
      {
        name: 'متن الشيفرة',
        required: true,
        description: 'محتوى الشيفرة الملوّن نحويًا.',
      },
      {
        name: 'الأسطر المُبرزة',
        required: false,
        description: 'خلفية مميِّزة على أسطر محدّدة للفت الانتباه.',
      },
      {
        name: 'زر النسخ',
        required: false,
        description: 'ينسخ سلسلة الشيفرة إلى الحافظة. يظهر افتراضيًا.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'syntax-highlighted code block via CSS Custom Highlight API (0-DOM overhead); span-based fallback; Code for inline code in prose',
  usage: {
    description: 'CodeBlock renders syntax-highlighted code with line numbers, a copy button, and optional collapsible sections. Use CodeBlock for multi-line snippets like source files, terminal commands, and configuration examples. Use Code for inline references to function names, variables, or CLI flags within body text.',
    bestPractices: [
      {guidance: true, description: 'Set the language prop to match the code content so syntax highlighting is accurate. Use "plaintext" when the language is unknown.'},
      {guidance: true, description: 'Add a title when the code represents a file. It gives readers context and appears in the header bar alongside the copy button.'},
      {guidance: true, description: 'Use Code for short inline references like function names or CLI flags, and CodeBlock for standalone multi-line snippets.'},
      {guidance: false, description: 'Enable line numbers on short snippets (under 5 lines) where they add clutter without helping navigation.'},
      {guidance: false, description: 'Nest a code block inside a scrollable container. Use the maxHeight prop instead, which handles overflow natively.'},
    ],
  },
};
