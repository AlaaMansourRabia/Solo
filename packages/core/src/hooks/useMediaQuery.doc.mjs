/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useMediaQuery',
  displayName: 'useMediaQuery',
  keywords: ['responsive', 'breakpoint', 'media', 'mobile', 'desktop', 'screen', 'matchmedia'],
  params: [
    {
      name: 'query',
      type: 'string',
      description: 'CSS media query string to evaluate.',
      required: true,
    },
  ],
  returns: [
    {
      name: 'matches',
      type: 'boolean',
      description: 'Whether the media query currently matches. Always false on first render (SSR-safe).',
    },
  ],
  usage: {
    description: 'SSR-safe media query hook that subscribes to window.matchMedia changes. Returns whether the given media query matches. Always returns false on first render for SSR compatibility.',
    bestPractices: [
      { guidance: true, description: 'Use for responsive layout switching based on viewport width, color scheme, or motion preferences.' },
      { guidance: true, description: 'Prefer Solo responsive tokens and component props over manual breakpoint logic when possible.' },
      { guidance: false, description: 'Use for server-rendered content that must match on first paint; the hook always returns false initially.' },
    ],
  },
  relatedComponents: [],
  relatedHooks: ['useImageMode'],
  importPath: '@solo/core/hooks',
  category: 'media',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) آمن مع SSR لاستعلامات الوسائط يشترك في تغييرات window.matchMedia ويُرجع ما إذا كان الاستعلام مطابقًا، ويُرجع دائمًا false في العرض الأول للتوافق مع SSR.',
  paramDescriptions: {
    query: 'نص استعلام وسائط CSS المراد تقييمه.',
  },
  returnDescriptions: {
    matches: 'ما إذا كان استعلام الوسائط مطابقًا حاليًا. دائمًا false في العرض الأول (آمن مع SSR).',
  },
  usage: {
    description: 'خطّاف آمن مع SSR لاستعلامات الوسائط يشترك في تغييرات window.matchMedia. يُرجع ما إذا كان استعلام الوسائط المُعطى مطابقًا. يُرجع دائمًا false في العرض الأول للتوافق مع SSR.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدمه للتبديل المتجاوب في التخطيط بناءً على عرض إطار العرض أو نظام الألوان أو تفضيلات الحركة.',
      },
      {
        guidance: true,
        description: 'فضّل رموز التصميم المتجاوبة في Solo وخصائص المكوّنات على منطق نقاط التوقف اليدوي متى أمكن.',
      },
      {
        guidance: false,
        description: 'استخدامه للمحتوى المعروض على الخادم الذي يجب أن يتطابق عند الرسم الأول؛ إذ يُرجع الخطّاف دائمًا false في البداية.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description: 'SSR-safe media query hook subscribing to window.matchMedia changes. Returns whether given media query matches. Always returns false on first render for SSR compatibility.',
  paramDescriptions: {
    query: 'CSS media query string to evaluate.',
  },
  returnDescriptions: {
    matches: 'whether media query currently matches. Always false on first render (SSR-safe).',
  },
  usage: {
    description: 'SSR-safe media query hook subscribing to window.matchMedia changes. Returns whether given media query matches. Always returns false on first render for SSR compatibility.',
    bestPractices: [
      { guidance: true, description: 'Use for responsive layout switching based on viewport width, color scheme, or motion preferences.' },
      { guidance: true, description: 'Prefer Solo responsive tokens + component props over manual breakpoint logic when possible.' },
      { guidance: false, description: 'Use for server-rendered content that must match on first paint; hook always returns false initially.' },
    ],
  },
};
