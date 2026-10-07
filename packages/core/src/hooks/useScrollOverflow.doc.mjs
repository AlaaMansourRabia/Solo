/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useScrollOverflow',
  displayName: 'useScrollOverflow',
  keywords: ['scroll', 'overflow', 'carousel', 'fade', 'edge', 'horizontal', 'scrollable', 'resize'],
  params: [],
  returns: [
    {
      name: 'scrollRef',
      type: 'React.RefCallback<HTMLElement>',
      description: 'Ref callback to attach to the horizontally scrollable container element.',
    },
    {
      name: 'overflowStart',
      type: 'boolean',
      description: 'Whether content overflows the start edge (left in LTR, right in RTL).',
    },
    {
      name: 'overflowEnd',
      type: 'boolean',
      description: 'Whether content overflows the end edge (right in LTR, left in RTL).',
    },
    {
      name: 'hasOverflow',
      type: 'boolean',
      description: 'Whether the container has any scroll overflow at all (scrollWidth > clientWidth).',
    },
  ],
  usage: {
    description:
      'Tracks scroll overflow state for a horizontally scrollable container. Returns a ref callback and state booleans that update as the user scrolls or the container resizes. Uses scroll event listeners and ResizeObserver for reactive updates. Tolerance of 1px is applied to avoid sub-pixel false positives.',
    bestPractices: [
      { guidance: true, description: 'Use to show/hide scroll navigation buttons or fade edges on carousels and horizontal lists.' },
      { guidance: true, description: 'Apply the scrollRef to a container with overflow-x: auto or overflow-x: scroll.' },
      { guidance: false, description: 'Use for vertical scroll tracking; this hook only measures horizontal overflow.' },
    ],
  },
  relatedComponents: ['Carousel'],
  relatedHooks: ['useOverflow'],
  importPath: '@solo/core/hooks',
  category: 'layout',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يتتبّع حالة تجاوز التمرير لحاوية قابلة للتمرير أفقيًا.',
  paramDescriptions: {},
  returnDescriptions: {
    scrollRef: 'دالة استدعاء ref تُربط بعنصر الحاوية القابلة للتمرير أفقيًا.',
    overflowStart: 'ما إذا كان المحتوى يتجاوز حافة البداية (اليسار في LTR، واليمين في RTL).',
    overflowEnd: 'ما إذا كان المحتوى يتجاوز حافة النهاية (اليمين في LTR، واليسار في RTL).',
    hasOverflow: 'ما إذا كان للحاوية أي تجاوز في التمرير على الإطلاق (scrollWidth > clientWidth).',
  },
  usage: {
    description: 'يتتبّع حالة تجاوز التمرير لحاوية قابلة للتمرير أفقيًا. يُرجع دالة استدعاء ref وقيمًا منطقية للحالة تتحدّث أثناء تمرير المستخدم أو تغيّر حجم الحاوية. يستخدم مستمعي أحداث التمرير وResizeObserver للتحديثات التفاعلية، ويطبّق هامش تسامح قدره 1px لتجنّب النتائج الإيجابية الكاذبة الناتجة عن أجزاء البكسل.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدمه لإظهار/إخفاء أزرار التنقّل بالتمرير أو تلاشي الحواف في العروض الدوّارة والقوائم الأفقية.',
      },
      {
        guidance: true,
        description: 'طبّق scrollRef على حاوية ذات overflow-x: auto أو overflow-x: scroll.',
      },
      {
        guidance: false,
        description: 'استخدمه لتتبّع التمرير العمودي؛ فهذا الخطّاف يقيس التجاوز الأفقي فقط.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Tracks scroll overflow state for horizontally scrollable container. Returns ref callback + state booleans that update as user scrolls / container resizes. Uses scroll event listeners + ResizeObserver for reactive updates. Tolerance of 1px applied to avoid sub-pixel false positives.',
  returnDescriptions: {
    scrollRef: 'ref callback for horizontally scrollable container element.',
    overflowStart: 'whether content overflows start edge (left in LTR, right in RTL).',
    overflowEnd: 'whether content overflows end edge (right in LTR, left in RTL).',
    hasOverflow: 'whether container has any scroll overflow at all (scrollWidth > clientWidth).',
  },
  usage: {
    description:
      'Tracks scroll overflow state for horizontally scrollable container. Returns ref callback + state booleans that update as user scrolls / container resizes. Uses scroll event listeners + ResizeObserver for reactive updates. Tolerance of 1px applied to avoid sub-pixel false positives.',
    bestPractices: [
      { guidance: true, description: 'Use to show/hide scroll navigation buttons / fade edges on carousels + horizontal lists.' },
      { guidance: true, description: 'Apply scrollRef to container w/ overflow-x: auto / overflow-x: scroll.' },
      { guidance: false, description: 'Use for vertical scroll tracking; this hook only measures horizontal overflow.' },
    ],
  },
};
