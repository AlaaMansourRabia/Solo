/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useAnnounce',
  displayName: 'useAnnounce',
  keywords: [
    'announce',
    'live region',
    'aria-live',
    'screen reader',
    'accessibility',
    'a11y',
    'status',
    'alert',
    'polite',
    'assertive',
    'visually hidden',
    'wcag',
  ],
  params: [],
  returns: [
    {
      name: 'announce',
      type: '(message: string, politeness?: "polite" | "assertive") => void',
      description:
        'Speaks a message through the shared live region. Politeness defaults to "polite"; an empty message clears any lingering status instead of announcing.',
    },
  ],
  usage: {
    description:
      'Imperatively announces a message to screen readers through a visually-hidden live region. Use it for state that is only conveyed visually; search result counts, "no results", loading and saved confirmations, validation errors (WCAG 4.1.3 Status Messages). The polite and assertive regions are created empty on first use and stay mounted, which is what makes announcements reliable: most screen readers ignore a live region that is inserted together with its content. Each message is cleared a couple of seconds after it is announced so stale status does not linger in the accessibility tree.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Reach for this instead of hand-rolling an aria-live div; a region rendered with its content usually does not announce at all.',
      },
      {
        guidance: true,
        description:
          'Keep "polite" for status and result counts; reserve "assertive" for errors and time-sensitive alerts, since it interrupts whatever the screen reader is saying.',
      },
      {
        guidance: true,
        description:
          'Announce the outcome, not the interaction; "12 results" rather than "search ran".',
      },
      {
        guidance: false,
        description:
          'Announce content that is already visible and correctly labeled in the DOM; that doubles up for screen reader users.',
      },
    ],
  },
  relatedComponents: ['VisuallyHidden', 'Toast'],
  relatedHooks: ['useClipboard'],
  importPath: '@solo/core/hooks',
  category: 'accessibility',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يعلن رسالة أوامريًا لقارئات الشاشة عبر منطقة حية مخفية بصريًا.',
  returnDescriptions: {
    announce: 'ينطق رسالة عبر المنطقة الحية المشتركة. مستوى التهذيب الافتراضي "polite"؛ والرسالة الفارغة تمسح أي حالة عالقة بدلًا من الإعلان.',
  },
  usage: {
    description: 'يعلن رسالة أوامريًا لقارئات الشاشة عبر منطقة حية مخفية بصريًا. استخدمه للحالة التي لا تُنقل إلا بصريًا؛ مثل أعداد نتائج البحث، و"لا توجد نتائج"، وتأكيدات التحميل والحفظ، وأخطاء التحقق (WCAG 4.1.3 Status Messages). تُنشأ المنطقتان polite وassertive فارغتين عند أول استخدام وتظلان مركَّبتين، وهذا ما يجعل الإعلانات موثوقة: إذ تتجاهل معظم قارئات الشاشة المنطقة الحية التي تُدرج مع محتواها. تُمسح كل رسالة بعد ثانيتين تقريبًا من إعلانها كي لا تبقى الحالة القديمة عالقة في شجرة إمكانية الوصول.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدمه بدلًا من كتابة عنصر div بـ aria-live يدويًا؛ فالمنطقة المعروضة مع محتواها عادةً لا تعلن شيئًا على الإطلاق.',
      },
      {
        guidance: true,
        description: 'احتفظ بـ "polite" للحالة وأعداد النتائج؛ وخصّص "assertive" للأخطاء والتنبيهات الحساسة للوقت، لأنه يقاطع كل ما يقوله قارئ الشاشة.',
      },
      {
        guidance: true,
        description: 'أعلن النتيجة لا التفاعل؛ "12 results" بدلًا من "search ran".',
      },
      {
        guidance: false,
        description: 'لا تعلن محتوى مرئيًا بالفعل ومسمّى بشكل صحيح في DOM؛ فذلك يكرّره لمستخدمي قارئات الشاشة.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Imperative screen-reader announcements via a visually-hidden live region. Polite + assertive regions created empty on first use + kept mounted, so announcements are reliable (most AT ignore a live region inserted together w/ its content). Messages auto-clear after ~2s.',
  returnDescriptions: {
    announce:
      'speaks message through shared live region. politeness defaults "polite"; empty message clears lingering status.',
  },
  usage: {
    description:
      'Announces visual-only state to screen readers: result counts, "no results", loading / saved confirmations, validation errors (WCAG 4.1.3). Regions mounted empty up front, so updates announce; text auto-clears so stale status does not linger in a11y tree.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use instead of hand-rolled aria-live div; region rendered w/ its content usually does not announce.',
      },
      {
        guidance: true,
        description:
          '"polite" for status / counts; "assertive" only for errors + time-sensitive alerts (it interrupts).',
      },
      {
        guidance: true,
        description:
          'Announce outcome, not interaction; "12 results", not "search ran".',
      },
      {
        guidance: false,
        description:
          'Announce content already visible + labeled in DOM; doubles up for AT users.',
      },
    ],
  },
};
