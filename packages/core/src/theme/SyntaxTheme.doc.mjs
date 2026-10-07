/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'SyntaxTheme',
  displayName: 'Syntax Theme',
  group: 'Utilities',
  category: 'Utility',
  isHiddenFromOverview: true,
  keywords: [
    'syntax',
    'highlighting',
    'code',
    'theme',
    'codeblock',
    'prism',
    'shiki',
  ],
  playground: {
    defaults: {
      theme: 'github-light',
      children: {
        __element: 'CodeBlock',
        props: {
          code: "const status = response.ok ? 'success' : 'error';",
          language: 'tsx',
          title: 'status.ts',
        },
      },
    },
  },
  usage: {
    description:
      'Applies syntax highlighting colors to CodeBlock and any code component in the subtree. By default, code components use the theme-level syntax colors (set via defineTheme({ syntax: ... })), which derive from the palette (--color-text-accent for keywords, --color-text-green for strings, etc.). SyntaxTheme lets you override those per-region. The system uses 14 semantic tokens (keyword, string, comment, number, function, type, variable, operator, constant, tag, attribute, property, punctuation, background) validated against 11 community themes. Custom themes are created with defineSyntaxTheme() and can use [light, dark] tuples for automatic color-scheme adaptation. Built-in presets: oneDarkPro, dracula, monokai, nord, tokyoNight, catppuccinMocha, githubLight, githubDark, solarizedLight, oneLight (import from @solo/core/theme/syntax).',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use the syntax field in defineTheme() for app-wide code styling. Use SyntaxTheme only when a specific section needs a different look.',
      },
      {
        guidance: true,
        description:
          'Pick from built-in presets or create a custom theme with defineSyntaxTheme() for brand-specific colors.',
      },
      {
        guidance: true,
        description:
          'Syntax themes support light-dark() tuples: each token can have different values for light and dark mode, resolved automatically by the color scheme.',
      },
      {
        guidance: true,
        description:
          'For a single CodeBlock, pass the syntaxTheme prop directly: it is shorthand for wrapping that block in SyntaxTheme. Use the SyntaxTheme wrapper when theming a whole region of code components.',
      },
    ],
  },
  props: [
    {
      name: 'theme',
      type: 'SyntaxThemeDefinition',
      required: true,
      description:
        'Syntax highlighting theme: a preset from @solo/core/theme/syntax or a custom theme created with defineSyntaxTheme().',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description:
        'Content subtree. All CodeBlock components within will use this syntax theme.',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يطبّق ألوان تمييز الصياغة على CodeBlock وأي مكوّن شيفرة في الشجرة الفرعية، متيحًا تجاوز ألوان الصياغة على مستوى السمة لكل منطقة على حدة.',
  propDescriptions: {
    theme: 'سمة تمييز الصياغة: إعداد مسبق من @solo/core/theme/syntax أو سمة مخصصة أُنشئت باستخدام defineSyntaxTheme().',
    children: 'الشجرة الفرعية للمحتوى. ستستخدم جميع مكوّنات CodeBlock بداخلها سمة الصياغة هذه.',
  },
  usage: {
    description: 'يطبّق ألوان تمييز الصياغة على CodeBlock وأي مكوّن شيفرة في الشجرة الفرعية. افتراضيًا تستخدم مكوّنات الشيفرة ألوان الصياغة على مستوى السمة (المضبوطة عبر defineTheme({ syntax: ... }))، المشتقة من لوحة الألوان (--color-text-accent للكلمات المفتاحية، و--color-text-green للنصوص، وغير ذلك). ويتيح لك SyntaxTheme تجاوزها لكل منطقة. يستخدم النظام 14 رمز تصميم دلاليًا (keyword، وstring، وcomment، وnumber، وfunction، وtype، وvariable، وoperator، وconstant، وtag، وattribute، وproperty، وpunctuation، وbackground) جرى التحقق منها مقابل 11 سمة مجتمعية. تُنشأ السمات المخصصة باستخدام defineSyntaxTheme() ويمكنها استخدام صفوف [light, dark] للتكيف التلقائي مع نظام الألوان. الإعدادات المسبقة المدمجة: oneDarkPro، وdracula، وmonokai، وnord، وtokyoNight، وcatppuccinMocha، وgithubLight، وgithubDark، وsolarizedLight، وoneLight (استوردها من @solo/core/theme/syntax).',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم الحقل syntax في defineTheme() لتنسيق الشيفرة على مستوى التطبيق بأكمله. واستخدم SyntaxTheme فقط عندما يحتاج قسم معين إلى مظهر مختلف.',
      },
      {
        guidance: true,
        description: 'اختر من الإعدادات المسبقة المدمجة أو أنشئ سمة مخصصة باستخدام defineSyntaxTheme() لألوان خاصة بالعلامة التجارية.',
      },
      {
        guidance: true,
        description: 'تدعم سمات الصياغة صفوف light-dark(): يمكن أن يكون لكل رمز قيم مختلفة للوضعين الفاتح والداكن، تُحسم تلقائيًا وفق نظام الألوان.',
      },
      {
        guidance: true,
        description: 'لمكوّن CodeBlock واحد، مرِّر الخاصية syntaxTheme مباشرةً: فهي اختصار لتغليف تلك الكتلة داخل SyntaxTheme. واستخدم غلاف SyntaxTheme عند تطبيق سمة على منطقة كاملة من مكوّنات الشيفرة.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    description:
      'Applies syntax highlighting colors to CodeBlock + any code component in subtree. By default code components use theme-level syntax colors (set via defineTheme({ syntax: ... })), which derive from palette (--color-text-accent for keywords, --color-text-green for strings, etc.); SyntaxTheme overrides those per-region. 14 semantic tokens (keyword, string, comment, number, function, type, variable, operator, constant, tag, attribute, property, punctuation, background) validated against 11 community themes. Custom themes created w/ defineSyntaxTheme(), can use [light, dark] tuples for automatic color-scheme adaptation. Built-in presets: oneDarkPro, dracula, monokai, nord, tokyoNight, catppuccinMocha, githubLight, githubDark, solarizedLight, oneLight (import from @solo/core/theme/syntax).',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use syntax field in defineTheme() for app-wide code styling. Use SyntaxTheme only when a specific section needs different look.',
      },
      {
        guidance: true,
        description:
          'Pick from built-in presets or create custom theme w/ defineSyntaxTheme() for brand-specific colors.',
      },
      {
        guidance: true,
        description:
          'Syntax themes support light-dark() tuples: each token can have different values for light/dark mode, resolved automatically by color scheme.',
      },
      {
        guidance: true,
        description:
          'Single CodeBlock: pass syntaxTheme prop (shorthand for wrapping in SyntaxTheme). Whole region of code components: wrap w/ SyntaxTheme.',
      },
    ],
  },
  propDescriptions: {
    theme:
      'syntax highlighting theme: preset from @solo/core/theme/syntax or custom theme created w/ defineSyntaxTheme()',
  },
};
