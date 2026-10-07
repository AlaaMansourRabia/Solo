/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useTheme',
  displayName: 'useTheme',
  group: 'Utilities',
  category: 'Utility',
  keywords: [
    'theme',
    'tokens',
    'color',
    'mode',
    'dark',
    'light',
    'provider',
    'data visualization',
    'canvas',
    'svg',
    'chart',
  ],
  params: [],
  returns: [
    {
      name: 'name',
      type: 'string',
      description:
        'Name of the nearest theme, or default when no provider is present.',
    },
    {
      name: 'mode',
      type: "'light' | 'dark'",
      description:
        'Resolved effective color mode. system mode is resolved to light or dark.',
    },
    {
      name: 'token',
      type: '(name: string) => string',
      description:
        'Resolve a single design token to its current CSS value for the effective mode.',
    },
    {
      name: 'tokens',
      type: 'Record<string, string>',
      description:
        'All tokens resolved for the current mode, including defaults and theme overrides. Stable until the active theme or mode changes; uses the same resolution logic as resolveThemeTokens(theme, {mode}).',
    },
  ],
  usage: {
    description:
      'Programmatic access to theme tokens for non-CSS consumers like SVG, canvas, Vega, D3, maps, or chart libraries that need values in JavaScript instead of CSS custom property references.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use tokens or token(name) when integrating theme colors into SVG attributes, canvas drawing, chart options, or other non-CSS configuration objects inside React components.',
      },
      {
        guidance: true,
        description:
          'Use resolveThemeTokens(theme, {mode}) for the same token resolution outside React hooks.',
      },
      {
        guidance: true,
        description:
          'Prefer CSS variables (e.g. `bg-(--color-accent)` in className) for ordinary component styling; use this hook only when JavaScript needs token values.',
      },
      {
        guidance: true,
        description:
          'Use data visualization tokens such as --color-data-categorical-blue for chart series instead of arbitrary UI colors.',
      },
      {
        guidance: false,
        description:
          'Hardcode light/dark colors in data visualizations: resolve them through the current theme instead.',
      },
      {
        guidance: false,
        description:
          'Assume the hook reflects every CSS cascade override. It resolves tokens for the current Theme mode; local media-surface overrides and arbitrary external CSS may not be represented.',
      },
    ],
  },
  relatedComponents: ['Theme'],
  relatedHooks: ['useMediaQuery'],
  importPath: '@solo/core/theme',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يوفّر وصولًا برمجيًا إلى رموز تصميم السمة للمستهلكين من خارج CSS مثل SVG و canvas و Vega و D3 والخرائط ومكتبات المخططات التي تحتاج إلى القيم في JavaScript.',
  returnDescriptions: {
    name: 'اسم أقرب سمة، أو default عند عدم وجود موفّر.',
    mode: 'وضع الألوان الفعلي بعد حلّه. يُحَل الوضع system إلى light أو dark.',
    token: 'يحلّ رمز تصميم واحدًا إلى قيمته الحالية في CSS للوضع الفعلي.',
    tokens: 'جميع رموز التصميم محلولة للوضع الحالي، بما في ذلك القيم الافتراضية وتجاوزات السمة. تبقى ثابتة حتى تتغير السمة أو الوضع النشط؛ وتستخدم منطق الحل نفسه الذي تستخدمه resolveThemeTokens(theme, {mode}).',
  },
  usage: {
    description: 'وصول برمجي إلى رموز تصميم السمة للمستهلكين من خارج CSS مثل SVG و canvas و Vega و D3 والخرائط ومكتبات المخططات التي تحتاج إلى القيم في JavaScript بدلًا من مراجع الخصائص المخصصة في CSS.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم tokens أو token(name) عند دمج ألوان السمة في سمات SVG أو الرسم على canvas أو خيارات المخططات أو كائنات الإعداد الأخرى غير المتعلقة بـ CSS داخل مكوّنات React.',
      },
      {
        guidance: true,
        description: 'استخدم resolveThemeTokens(theme, {mode}) للحصول على حل رموز التصميم نفسه خارج خطّافات React.',
      },
      {
        guidance: true,
        description: 'فضّل متغيرات CSS (مثل `bg-(--color-accent)` في className) لتنسيق المكوّنات العادي؛ واستخدم هذا الخطّاف فقط عندما تحتاج JavaScript إلى قيم رموز التصميم.',
      },
      {
        guidance: true,
        description: 'استخدم رموز تصميم عرض البيانات مثل --color-data-categorical-blue لسلاسل المخططات بدلًا من ألوان واجهة اعتباطية.',
      },
      {
        guidance: false,
        description: 'تثبيت ألوان الوضع الفاتح/الداكن مباشرة في عروض البيانات: بل احلّها عبر السمة الحالية بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'افتراض أن الخطّاف يعكس كل تجاوزات تسلسل CSS. فهو يحلّ رموز التصميم لوضع Theme الحالي؛ وقد لا تُمثَّل تجاوزات أسطح الوسائط المحلية و CSS الخارجي الاعتباطي.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Programmatic access to theme tokens for SVG/canvas/charts needing JS values instead of CSS vars.',
  returnDescriptions: {
    name: 'nearest theme name or default.',
    mode: 'resolved light/dark mode.',
    token: 'resolve one design token for effective mode.',
    tokens:
      'all tokens resolved for current mode; stable until theme/mode changes; same resolver as resolveThemeTokens.',
  },
  usage: {
    description:
      'Programmatic access to theme tokens for SVG/canvas/charts needing JS values instead of CSS vars.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use tokens/token(name) for SVG/canvas/chart config theme colors in React.',
      },
      {
        guidance: true,
        description:
          'Use resolveThemeTokens(theme, {mode}) outside React hooks.',
      },
      {
        guidance: true,
        description:
          'Prefer CSS vars (e.g. `bg-(--color-accent)`) for ordinary styling; use hook when JS needs values.',
      },
      {
        guidance: true,
        description: 'Use --color-data-* tokens for chart series.',
      },
      {
        guidance: false,
        description: 'Hardcode light/dark chart colors: resolve from current theme.',
      },
      {
        guidance: false,
        description:
          'Assume hook reflects arbitrary CSS cascade/media-surface overrides.',
      },
    ],
  },
};
