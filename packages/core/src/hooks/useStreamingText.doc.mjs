/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useStreamingText',
  displayName: 'useStreamingText',
  keywords: ['streaming', 'text', 'typewriter', 'animation', 'ai', 'chat', 'markdown', 'reveal', 'llm', 'chunked'],
  params: [
    {
      name: 'targetText',
      type: 'string',
      description: 'The full target text to reveal. As new chunks arrive, update this value with the accumulated text.',
      required: true,
    },
    {
      name: 'isStreaming',
      type: 'boolean',
      description: 'Whether text is currently being streamed. When false, the hook returns the full targetText immediately.',
      required: true,
    },
    {
      name: 'options',
      type: 'UseStreamingTextOptions',
      description: 'Optional configuration for streaming behavior.',
      required: false,
    },
    {
      name: 'options.speed',
      type: "'natural' | 'fast' | 'instant'",
      description: "Speed preset for text reveal. 'natural' is steady ~2 chars/frame, 'fast' scales with backlog ~4 chars/frame, 'instant' returns full text with no animation.",
      default: "'natural'",
      required: false,
    },
  ],
  returns: [
    {
      name: 'displayedText',
      type: 'string',
      description: 'The portion of targetText to render. Grows steadily toward the full targetText during streaming, or equals targetText when not streaming.',
    },
  ],
  usage: {
    description:
      'Smooths bursty streamed text into a steady character-by-character reveal using requestAnimationFrame. Decouples arrival rate from display rate. Advances on word and syntax boundaries to avoid slicing mid-markdown or mid-word, preventing visual glitches with markdown renderers. Animation timing derives from Solo motion tokens via useTheme when available, with sensible fallbacks outside a theme provider. Snaps to full text when isStreaming becomes false.',
    bestPractices: [
      { guidance: true, description: 'Pass the accumulated text (not individual chunks) as targetText; the hook handles incremental reveal internally.' },
      { guidance: true, description: 'Set isStreaming to false when the stream completes to snap to the final text.' },
      { guidance: true, description: "Use speed='instant' for non-animated contexts like search results or when reduced motion is preferred." },
      { guidance: false, description: 'Use for static text that does not change; the hook adds unnecessary overhead for non-streaming content.' },
    ],
  },
  relatedComponents: ['Markdown'],
  relatedHooks: [],
  importPath: '@solo/core/hooks',
  category: 'streaming',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description:
    'خطّاف (hook) يحوّل النص المبثوث على دفعات متقطعة إلى ظهور ثابت حرفًا بحرف باستخدام requestAnimationFrame، ويقفز إلى النص الكامل عندما تصبح isStreaming تساوي false.',
  paramDescriptions: {
    targetText:
      'النص الهدف الكامل المراد إظهاره. مع وصول أجزاء جديدة، حدّث هذه القيمة بالنص المتراكم.',
    isStreaming:
      'ما إذا كان النص يُبث حاليًا. عندما تكون false يُعيد الخطّاف targetText كاملًا فورًا.',
    options: 'إعدادات اختيارية لسلوك البث.',
    'options.speed':
      'إعداد مسبق لسرعة إظهار النص. \'natural\' ثابتة بنحو حرفين لكل إطار، و\'fast\' تتدرّج مع المتأخر بنحو 4 أحرف لكل إطار، و\'instant\' تُعيد النص الكامل دون حركة.',
  },
  returnDescriptions: {
    displayedText:
      'الجزء المراد عرضه من targetText. ينمو بثبات نحو targetText الكامل أثناء البث، أو يساوي targetText عند عدم البث.',
  },
  usage: {
    description:
      'يحوّل النص المبثوث على دفعات متقطعة إلى ظهور ثابت حرفًا بحرف باستخدام requestAnimationFrame. يفصل معدّل الوصول عن معدّل العرض. يتقدّم عند حدود الكلمات والصياغة لتجنّب القطع في منتصف markdown أو منتصف الكلمة، ما يمنع الخلل البصري مع أدوات عرض markdown. يُشتق توقيت الحركة من رموز تصميم الحركة في Solo عبر useTheme عند توفّرها، مع قيم بديلة معقولة خارج موفّر السمة. يقفز إلى النص الكامل عندما تصبح isStreaming تساوي false.',
    bestPractices: [
      {
        guidance: true,
        description:
          'مرّر النص المتراكم (لا الأجزاء المنفردة) بوصفه targetText؛ إذ يتولى الخطّاف الإظهار التدريجي داخليًا.',
      },
      {
        guidance: true,
        description: 'عيّن isStreaming إلى false عند اكتمال البث للقفز إلى النص النهائي.',
      },
      {
        guidance: true,
        description:
          'استخدم speed=\'instant\' للسياقات غير المتحركة مثل نتائج البحث، أو عند تفضيل تقليل الحركة.',
      },
      {
        guidance: false,
        description:
          'لا تستخدمه للنص الثابت الذي لا يتغيّر؛ إذ يضيف الخطّاف عبئًا غير ضروري للمحتوى غير المبثوث.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Smooths bursty streamed text into steady character-by-character reveal using requestAnimationFrame. Decouples arrival rate from display rate. Advances on word + syntax boundaries to avoid slicing mid-markdown / mid-word, preventing visual glitches w/ markdown renderers. Animation timing derives from Solo motion tokens via useTheme when available, w/ sensible fallbacks outside theme provider. Snaps to full text when isStreaming becomes false.',
  paramDescriptions: {
    targetText: 'full target text to reveal. As new chunks arrive, update this value w/ accumulated text.',
    isStreaming: 'whether text currently being streamed. When false, hook returns full targetText immediately.',
    options: 'optional config for streaming behavior.',
    'options.speed': "speed preset for text reveal. 'natural' is steady ~2 chars/frame, 'fast' scales w/ backlog ~4 chars/frame, 'instant' returns full text w/ no animation.",
  },
  returnDescriptions: {
    displayedText: 'portion of targetText to render. Grows steadily toward full targetText during streaming / equals targetText when not streaming.',
  },
  usage: {
    description:
      'Smooths bursty streamed text into steady character-by-character reveal using requestAnimationFrame. Decouples arrival rate from display rate. Advances on word + syntax boundaries to avoid slicing mid-markdown / mid-word, preventing visual glitches w/ markdown renderers. Animation timing derives from Solo motion tokens via useTheme when available, w/ sensible fallbacks outside theme provider. Snaps to full text when isStreaming becomes false.',
    bestPractices: [
      { guidance: true, description: 'Pass accumulated text (not individual chunks) as targetText; hook handles incremental reveal internally.' },
      { guidance: true, description: 'Set isStreaming to false when stream completes to snap to final text.' },
      { guidance: true, description: "Use speed='instant' for non-animated contexts like search results / when reduced motion preferred." },
      { guidance: false, description: 'Use for static text that does not change; hook adds unnecessary overhead for non-streaming content.' },
    ],
  },
};
