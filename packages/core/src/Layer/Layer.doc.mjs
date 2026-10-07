/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'Layer',
  displayName: 'Layer',
  group: 'Utilities',
  category: 'Utility',
  keywords: [
    'layer',
    'overlay',
    'popover',
    'positioning',
    'anchor',
    'floating',
    'dropdown',
    'popper',
    'popup',
    'portal',
  ],
  usage: {
    description:
      'Layer utilities provide the app-level provider used by overlay systems. Use LayerProvider at the app root for toast/layer configuration; use higher-level Popover, HoverCard, or Tooltip APIs for most overlay UI. Rendered layer content, not the provider’s application subtree, uses theme body text defaults and exits ancestor surface/group membership. Establish intentional groups and complete required providers inside each layer.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use LayerProvider once near the app root when you need shared toast/layer configuration.',
      },
      {
        guidance: true,
        description:
          'Build on higher-level components like Popover, HoverCard, and Tooltip for common overlay patterns.',
      },
      {
        guidance: false,
        description:
          'Add nested LayerProvider instances: nested providers are ignored and add unnecessary tree depth.',
      },
    ],
  },
  components: [
    {
      name: 'LayerProvider',
      displayName: 'Layer Provider',
      description:
        'App-level provider for layer systems such as toast viewports and imperative modals. Nested providers pass through.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Application subtree that can use the shared layer context.',
          required: true,
        },
        {
          name: 'toast',
          type: 'LayerToastConfig',
          description:
            'Toast viewport configuration. Controls position, maxVisible, and inset for toasts shown through useToast.',
        },
      ],
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'توفّر أدوات Layer المزوّد على مستوى التطبيق الذي تستخدمه أنظمة الطبقات المتراكبة.',
  usage: {
    description: 'توفّر أدوات Layer المزوّد على مستوى التطبيق الذي تستخدمه أنظمة الطبقات المتراكبة. استخدم LayerProvider في جذر التطبيق لإعداد الإشعارات المنبثقة/الطبقات؛ واستخدم واجهات Popover أو HoverCard أو Tooltip الأعلى مستوى لمعظم واجهات الطبقات المتراكبة. يستخدم محتوى الطبقة المعروض — لا الشجرة الفرعية للتطبيق داخل المزوّد — إعدادات نص الجسم الافتراضية في السمة، ويخرج من عضوية السطح/المجموعة الخاصة بالعناصر السلف. أنشئ المجموعات المقصودة وأكمل المزوّدات المطلوبة داخل كل طبقة.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم LayerProvider مرة واحدة بالقرب من جذر التطبيق عندما تحتاج إلى إعداد مشترك للإشعارات المنبثقة/الطبقات.',
      },
      {
        guidance: true,
        description: 'ابنِ على المكوّنات الأعلى مستوى مثل Popover وHoverCard وTooltip لأنماط الطبقات المتراكبة الشائعة.',
      },
      {
        guidance: false,
        description: 'لا تُضِف نسخًا متداخلة من LayerProvider: إذ تُتجاهل المزوّدات المتداخلة وتضيف عمقًا غير ضروري إلى الشجرة.',
      },
    ],
  },
  components: [
    {
      name: 'LayerProvider',
      displayName: 'مزوّد الطبقات',
      description: 'مزوّد على مستوى التطبيق لأنظمة الطبقات مثل منافذ عرض الإشعارات المنبثقة ومربعات الحوار الأوامرية. المزوّدات المتداخلة تمرّر المحتوى كما هو.',
      propDescriptions: {
        children: 'الشجرة الفرعية للتطبيق التي يمكنها استخدام سياق الطبقات المشترك.',
        toast: 'إعداد منفذ عرض الإشعارات المنبثقة. يتحكم في position وmaxVisible وinset للإشعارات المنبثقة المعروضة عبر useToast.',
      },
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    description:
      'App-level provider for overlay systems. Use LayerProvider at app root for toast/layer config; use Popover/HoverCard/Tooltip for most overlay UI. Layer content uses theme body defaults and exits ancestor surface/group membership; establish intentional groups and complete required providers inside it. The application subtree is unchanged.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use LayerProvider once near app root for shared toast/layer config.',
      },
      {
        guidance: true,
        description: 'Use Popover/HoverCard/Tooltip for common overlay patterns.',
      },
      {
        guidance: false,
        description: 'Add nested LayerProvider instances.',
      },
    ],
  },
  components: [
    {
      name: 'LayerProvider',
      description: 'App-level provider for toast/layer systems.',
      propDescriptions: {
        children: 'application subtree using shared layer context',
        toast: 'toast viewport config: position, maxVisible, inset',
      },
    },
  ],
};
