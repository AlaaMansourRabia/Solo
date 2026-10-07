/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useMergedRefs',
  displayName: 'useMergedRefs',
  keywords: [
    'ref',
    'refs',
    'merge',
    'forwardRef',
    'callback ref',
    'stable ref',
  ],
  params: [
    {
      name: 'refs',
      type: 'Array<Ref<T> | undefined>',
      description: 'Up to six refs that should all receive the same element.',
      required: true,
    },
  ],
  returns: [
    {
      name: 'ref',
      type: 'RefCallback<T>',
      description:
        'A merged callback ref that remains stable until an input ref changes.',
    },
  ],
  usage: {
    description:
      'Combines multiple object or callback refs into one stable callback ref. Use it when a component must forward a consumer ref while also attaching internal refs. Unlike calling mergeRefs during render, the callback identity stays stable across unrelated rerenders, so React does not detach and reattach the element.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use useMergedRefs when one element must receive both a forwarded ref and one or more internal refs.',
      },
      {
        guidance: false,
        description:
          'Call mergeRefs directly in a JSX ref prop; that creates a new callback on every render and forces unnecessary detach and attach work.',
      },
    ],
  },
  relatedComponents: [],
  relatedHooks: [],
  importPath: '@solo/core/hooks',
  category: 'utility',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يدمج عدة مراجع (refs) كائنية أو استدعائية في مرجع استدعائي واحد مستقر.',
  paramDescriptions: {
    refs: 'حتى ستة مراجع (refs) يجب أن تتلقى جميعها العنصر نفسه.',
  },
  returnDescriptions: {
    ref: 'مرجع استدعائي مدمج يبقى مستقرًا حتى يتغير أحد المراجع المُدخلة.',
  },
  usage: {
    description: 'يدمج عدة مراجع (refs) كائنية أو استدعائية في مرجع استدعائي واحد مستقر. استخدمه عندما يجب على المكوّن تمرير مرجع المستهلك مع إرفاق مراجع داخلية أيضًا. بخلاف استدعاء mergeRefs أثناء العرض، تبقى هوية دالة الاستدعاء مستقرة عبر عمليات إعادة العرض غير المرتبطة، لذا لا يفصل React العنصر ثم يعيد إرفاقه.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم useMergedRefs عندما يجب أن يتلقى عنصر واحد مرجعًا مُمرَّرًا ومرجعًا داخليًا واحدًا أو أكثر.',
      },
      {
        guidance: false,
        description: 'لا تستدعِ mergeRefs مباشرةً في الخاصية ref في JSX؛ فذلك يُنشئ دالة استدعاء جديدة في كل عرض ويفرض عمليات فصل وإرفاق غير ضرورية.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Combines object/callback refs into one stable callback ref. Identity changes only when an input ref changes, avoiding detach/attach churn from inline mergeRefs calls.',
  paramDescriptions: {
    refs: 'refs that should all receive the same element.',
  },
  returnDescriptions: {
    ref: 'stable merged callback ref; changes only when an input ref changes.',
  },
  usage: {
    description:
      'Use when one element needs a forwarded consumer ref plus internal refs. Keeps the callback stable across unrelated rerenders.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for a forwarded ref plus internal measurement, focus, or anchor refs.',
      },
      {
        guidance: false,
        description:
          'Call mergeRefs inline in JSX; it forces ref detach/attach on every render.',
      },
    ],
  },
};
