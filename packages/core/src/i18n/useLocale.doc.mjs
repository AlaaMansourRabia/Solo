/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useLocale',
  displayName: 'useLocale',
  category: 'utilities',
  keywords: [
    'i18n',
    'internationalization',
    'localization',
    'locale',
    'language',
    'provider',
    'hook',
  ],
  params: [],
  returns: [
    {
      name: 'locale',
      type: 'Locale',
      description:
        "The active InternationalizationProvider BCP 47 locale. Falls back to 'en' when no provider is present.",
    },
  ],
  usage: {
    description:
      'Reads the authoritative Solo locale. Use it to thread the provider locale into pure formatting helpers and sibling-package APIs; do not derive a second locale from navigator.language or a hardcoded literal.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass the returned locale to pure Solo helpers or package APIs that require an explicit locale.',
      },
      {
        guidance: false,
        description:
          'Use navigator.language or a hardcoded display locale as a fallback; InternationalizationProvider is the locale source.',
      },
    ],
  },
  relatedComponents: ['InternationalizationProvider'],
  relatedHooks: ['useCollator', 'useTranslator', 'useDirection'],
  importPath: '@solo/core',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يقرأ اللغة والإعدادات الإقليمية المعتمدة في Solo.',
  returnDescriptions: {
    locale: 'الإعدادات الإقليمية النشطة بصيغة BCP 47 من InternationalizationProvider. تعود إلى \'en\' عند غياب المزوّد.',
  },
  usage: {
    description: 'يقرأ الإعدادات الإقليمية المعتمدة في Solo. استخدمه لتمرير الإعدادات الإقليمية للمزوّد إلى دوال التنسيق المساعدة النقية وواجهات برمجة الحزم الشقيقة؛ ولا تشتق إعدادات إقليمية ثانية من navigator.language أو من قيمة حرفية مثبّتة.',
    bestPractices: [
      {guidance: true, description: 'مرّر الإعدادات الإقليمية المُرجعة إلى دوال Solo المساعدة النقية أو واجهات برمجة الحزم التي تتطلب إعدادات إقليمية صريحة.'},
      {guidance: false, description: 'استخدام navigator.language أو إعدادات عرض إقليمية مثبّتة كبديل احتياطي؛ فـ InternationalizationProvider هو مصدر الإعدادات الإقليمية.'},
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    "Returns the active InternationalizationProvider locale, falling back to 'en' without a provider.",
  usage: {
    description:
      'Use as the sole locale source for pure formatting helpers and sibling-package APIs.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Thread this locale into pure helpers requiring an explicit locale.',
      },
      {
        guidance: false,
        description:
          'Fall back to navigator.language or a hardcoded display locale.',
      },
    ],
  },
  returnDescriptions: {
    locale: "active provider BCP 47 locale; 'en' without a provider.",
  },
};
