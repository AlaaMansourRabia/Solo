/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useEntryAnimation',
  displayName: 'useEntryAnimation',
  keywords: ['animation', 'entry', 'mount', 'transition', 'slide', 'fade', 'scale', 'motion', 'tailwind'],
  params: [
    {
      name: 'preset',
      type: "'slideDown' | 'slideUp' | 'fadeIn' | 'scaleIn'",
      description: 'Animation preset to apply on mount.',
      default: "'slideDown'",
      required: false,
    },
  ],
  returns: [
    {
      name: 'entryClassName',
      type: 'string | null',
      description: 'A Tailwind class string for the entry animation, or null if the element was rendered on initial page load (no animation needed). Pass it to cn() (which ignores null) when building className.',
    },
  ],
  usage: {
    description:
      'Returns a Tailwind class string (or null) for animating an element on mount. Only animates when the element is dynamically inserted after the initial page paint; elements rendered on page load are not animated. Uses Solo motion tokens (duration, easing) for consistent animation timing. Requires "use client"; does not support SSR.',
    bestPractices: [
      { guidance: true, description: 'Use for conditionally rendered elements like validation messages, toasts, or expanding sections.' },
      { guidance: true, description: 'Compose the returned class with your other classes via cn(styles.root, entryClassName) and pass the result as className; null is ignored.' },
      { guidance: false, description: 'Use for elements that should be visible on initial page load; they will not animate.' },
    ],
  },
  relatedComponents: ['FieldStatus'],
  relatedHooks: [],
  importPath: '@solo/core/hooks',
  category: 'animation',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يُعيد سلسلة أصناف Tailwind (أو null) لتحريك عنصر عند تركيبه.',
  paramDescriptions: {
    preset: 'الإعداد المسبق للحركة المراد تطبيقه عند التركيب.',
  },
  returnDescriptions: {
    entryClassName: 'سلسلة أصناف Tailwind لحركة الدخول، أو null إذا عُرض العنصر عند التحميل الأولي للصفحة (لا حاجة للحركة). مرّرها إلى cn() (الذي يتجاهل null) عند بناء className.',
  },
  usage: {
    description: 'يُعيد سلسلة أصناف Tailwind (أو null) لتحريك عنصر عند تركيبه. لا يحرّك العنصر إلا عند إدراجه ديناميكيًا بعد الرسم الأولي للصفحة؛ ولا تُحرَّك العناصر المعروضة عند تحميل الصفحة. يستخدم رموز تصميم الحركة في Solo (المدة، ومنحنى التسارع) لتوقيت حركة متناسق. يتطلب "use client"؛ ولا يدعم SSR.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدمه للعناصر المعروضة شرطيًا مثل رسائل التحقق أو الإشعارات المنبثقة أو الأقسام القابلة للتوسيع.',
      },
      {
        guidance: true,
        description: 'ركّب الصنف المُعاد مع أصنافك الأخرى عبر cn(styles.root, entryClassName) ومرّر الناتج كـ className؛ تُتجاهل null.',
      },
      {
        guidance: false,
        description: 'لا تستخدمه للعناصر التي ينبغي أن تكون مرئية عند التحميل الأولي للصفحة؛ فلن تتحرك.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Returns Tailwind class string (or null) for animating element on mount. Only animates when element dynamically inserted after initial page paint; elements rendered on page load not animated. Uses Solo motion tokens (duration, easing) for consistent timing. Requires "use client"; does not support SSR.',
  paramDescriptions: {
    preset: 'animation preset applied on mount.',
  },
  returnDescriptions: {
    entryClassName: 'Tailwind class string for entry animation / null if element rendered on initial page load (no animation needed); pass to cn() / className.',
  },
  usage: {
    description:
      'Returns Tailwind class string (or null) for animating element on mount. Only animates when element dynamically inserted after initial page paint; elements rendered on page load not animated. Uses Solo motion tokens (duration, easing) for consistent timing. Requires "use client"; does not support SSR.',
    bestPractices: [
      { guidance: true, description: 'Use for conditionally rendered elements like validation messages, toasts, expanding sections.' },
      { guidance: true, description: 'Compose returned class via cn(..., entryClassName) into className; null is ignored.' },
      { guidance: false, description: 'Use for elements that should be visible on initial page load; they will not animate.' },
    ],
  },
};
