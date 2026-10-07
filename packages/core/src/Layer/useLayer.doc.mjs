/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useLayer',
  displayName: 'useLayer',
  group: 'Utilities',
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
  params: [
    {
      name: 'mode',
      type: "'context' | 'fixed'",
      description:
        'Positioning strategy: context uses CSS anchor positioning relative to a trigger ref; fixed uses explicit x/y coordinates.',
      required: true,
    },
    {
      name: 'onShow',
      type: '() => void',
      description: 'Callback fired when the layer becomes visible.',
    },
    {
      name: 'onHide',
      type: '() => void',
      description: 'Callback fired when the layer is hidden.',
    },
    {
      name: 'lightDismiss',
      type: 'boolean',
      description:
        'Whether clicking outside should dismiss the layer using native popover light-dismiss behavior.',
      default: 'false',
    },
    {
      name: 'lazyMount',
      type: 'boolean',
      description:
        'Context mode only. Wait until show() to resolve the inline/portal position and mount content; hide unmounts the content while the inert marker remains.',
      default: 'false',
    },
  ],
  returns: [
    {
      name: 'ref',
      type: 'RefCallback<HTMLElement> | undefined',
      description: 'Trigger ref for context mode. Undefined in fixed mode.',
    },
    {
      name: 'anchorId',
      type: 'string',
      description: 'CSS anchor name for context mode positioning.',
    },
    {
      name: 'show',
      type: '() => void',
      description: 'Imperatively show the layer.',
    },
    {
      name: 'hide',
      type: '() => void',
      description: 'Imperatively hide the layer.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the layer is currently open.',
    },
    {
      name: 'id',
      type: 'string',
      description:
        'Unique ID for aria-describedby or other ARIA relationships.',
    },
    {
      name: 'render',
      type: '(children: ReactNode, props: ContextRenderProps | FixedRenderProps) => ReactNode',
      description:
        'Render function for the popover element. Pass placement/alignment in context mode or x/y in fixed mode. Placement/alignment are logical: they map to the self-* position-area keyword family, which resolves against the popover\'s own inherited direction, so RTL contexts mirror automatically in pure CSS. Pass `positioning: "custom"` in context mode to author position styles yourself via `style` (e.g. explicit anchor() insets or an anchor-size() cover): the hook keeps the popover behavior and position-anchor wiring but derives no position styles, including the automatic RTL mirroring, which becomes your responsibility. Pass `offset` (a CSS length; a number is px) in context mode for clearance from the anchor: it applies to both edges of the placement axis, so the gap survives a flip. Layers are flush by default. Context mode first renders an inert `<template>` marker in matching server and client markup. The final layer stays at that JSX position if its parent is safe; otherwise it is portaled to the nearest ancestor outside paragraphs, links, buttons, inline formatting, and structurally restricted containers. The nearest safe host keeps CSS custom properties inheriting live, while the layer preserves direction and writing mode from its JSX position. By default this resolution occurs after hydration so closed-layer DOM remains available; `lazyMount` defers it until `show()` and unmounts the content again on hide while the marker remains. The Popover API promotes the layer to the top layer when shown, so it escapes ancestor clipping and stacking wherever it is hosted. When the layer would overflow the viewport, position-try fallbacks flip it to the opposite side; centered layers additionally slide along the alignment axis (span fallbacks) so they stay on-screen near viewport edges.',
    },
  ],
  usage: {
    description:
      'Core positioning hook for rendering overlay content using CSS Anchor Positioning and the Popover API. Use it as the foundation for custom popovers, hover cards, tooltips, and fixed-position layers when higher-level components are not enough. Both modes use theme body text defaults and end ancestor surface/group membership as a whole, including group-owned state. Explicit props and unrelated contexts remain unchanged. Apply intentional formatting through render styles or content, and establish complete content-local providers inside the rendered layer.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use context mode for anchor-positioned overlays relative to a trigger element, and fixed mode for manually positioned overlays at specific coordinates.',
      },
      {
        guidance: true,
        description:
          'Build on higher-level components like Popover, HoverCard, and Tooltip for common overlay patterns.',
      },
      {
        guidance: true,
        description:
          "Rely on the Popover API top layer to escape ancestor clipping and stacking, and host the layer near its trigger rather than in the body so it inherits the trigger's theme cascade and keeps a natural focus order.",
      },
      {
        guidance: false,
        description:
          'Implement ARIA patterns directly in a Layer unless you also own the full accessibility behavior.',
      },
    ],
  },
  relatedComponents: ['LayerProvider', 'Popover', 'HoverCard', 'Tooltip'],
  relatedHooks: ['usePopover', 'useHoverCard', 'useTooltip'],
  importPath: '@solo/core/Layer',
  category: 'interaction',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) التموضع الأساسي لعرض محتوى الطبقات المتراكبة باستخدام CSS Anchor Positioning وPopover API.',
  paramDescriptions: {
    mode: 'استراتيجية التموضع: context يستخدم تموضع المرساة في CSS نسبةً إلى مرجع العنصر المُشغِّل؛ وfixed يستخدم إحداثيات x/y صريحة.',
    onShow: 'دالة استدعاء تُنفَّذ عندما تصبح الطبقة مرئية.',
    onHide: 'دالة استدعاء تُنفَّذ عند إخفاء الطبقة.',
    lightDismiss: 'ما إذا كان النقر خارج الطبقة ينبغي أن يُغلقها باستخدام سلوك الإغلاق الخفيف الأصلي للنوافذ المنبثقة.',
    lazyMount: 'لوضع context فقط. ينتظر حتى استدعاء show() لتحديد الموضع المضمّن/المنقول وتركيب المحتوى؛ ويؤدي الإخفاء إلى إلغاء تركيب المحتوى مع بقاء العلامة الخاملة.',
  },
  returnDescriptions: {
    ref: 'مرجع العنصر المُشغِّل لوضع context. قيمته undefined في وضع fixed.',
    anchorId: 'اسم المرساة في CSS لتموضع وضع context.',
    show: 'يُظهر الطبقة برمجيًا.',
    hide: 'يُخفي الطبقة برمجيًا.',
    isOpen: 'ما إذا كانت الطبقة مفتوحة حاليًا.',
    id: 'معرّف فريد لـ aria-describedby أو علاقات ARIA الأخرى.',
    render: 'دالة العرض لعنصر النافذة المنبثقة. مرّر placement/alignment في وضع context أو x/y في وضع fixed. القيمتان placement/alignment منطقيتان: تُربطان بعائلة الكلمات المفتاحية self-* في position-area، التي تُحلّ وفق الاتجاه الموروث للنافذة المنبثقة نفسها، لذا تنعكس سياقات RTL تلقائيًا باستخدام CSS وحده. مرّر `positioning: "custom"` في وضع context لكتابة أنماط الموضع بنفسك عبر `style` (مثل إزاحات anchor() صريحة أو تغطية anchor-size()): يحتفظ الخطّاف بسلوك النافذة المنبثقة وربط position-anchor لكنه لا يشتق أي أنماط موضع، بما في ذلك الانعكاس التلقائي في RTL، الذي يصبح مسؤوليتك. مرّر `offset` (طول CSS؛ والرقم يُعامَل كـ px) في وضع context لإبعاد الطبقة عن المرساة: ينطبق على طرفي محور التموضع، لذا تبقى المسافة عند الانقلاب. الطبقات ملاصقة افتراضيًا. يعرض وضع context أولًا علامة `<template>` خاملة في ترميز متطابق بين الخادم والعميل. تبقى الطبقة النهائية في موضع JSX ذلك إذا كان أصلها آمنًا؛ وإلا فتُنقل إلى أقرب سلف خارج الفقرات والروابط والأزرار وعناصر التنسيق المضمّنة والحاويات المقيّدة بنيويًا. يحافظ أقرب مضيف آمن على توريث خصائص CSS المخصّصة بشكل حي، بينما تحافظ الطبقة على الاتجاه ونمط الكتابة من موضع JSX الخاص بها. افتراضيًا يحدث هذا التحديد بعد الإماهة كي يظل DOM الطبقة المغلقة متاحًا؛ ويؤجله `lazyMount` حتى `show()` ويلغي تركيب المحتوى مجددًا عند الإخفاء مع بقاء العلامة. ترفع Popover API الطبقة إلى الطبقة العليا عند إظهارها، فتفلت من قصّ الأسلاف وترتيب التكديس أينما استُضيفت. وعندما تتجاوز الطبقة منفذ العرض، تقلبها بدائل position-try إلى الجانب المقابل؛ كما تنزلق الطبقات المتوسّطة على محور المحاذاة (بدائل span) كي تبقى ظاهرة على الشاشة قرب حواف منفذ العرض.',
  },
  usage: {
    description: 'خطّاف (hook) التموضع الأساسي لعرض محتوى الطبقات المتراكبة باستخدام CSS Anchor Positioning وPopover API. استخدمه أساسًا للنوافذ المنبثقة المخصّصة وبطاقات التمرير والتلميحات والطبقات ثابتة الموضع عندما لا تكفي المكوّنات عالية المستوى. يستخدم كلا الوضعين القيم الافتراضية لنص المتن في السمة، وينهيان الانتماء إلى أسطح أو مجموعات الأسلاف بالكامل، بما في ذلك الحالة التي تملكها المجموعة. تبقى الخصائص الصريحة والسياقات غير ذات الصلة دون تغيير. طبّق التنسيق المقصود عبر أنماط العرض أو المحتوى، وأنشئ المزوّدات المحلية للمحتوى كاملةً داخل الطبقة المعروضة.',
    bestPractices: [
      {guidance: true, description: 'استخدم وضع context للطبقات المتراكبة المتموضعة بالمرساة نسبةً إلى عنصر مُشغِّل، ووضع fixed للطبقات المتراكبة المتموضعة يدويًا عند إحداثيات محددة.'},
      {guidance: true, description: 'ابنِ على المكوّنات عالية المستوى مثل Popover وHoverCard وTooltip لأنماط الطبقات المتراكبة الشائعة.'},
      {guidance: true, description: 'اعتمد على الطبقة العليا في Popover API للإفلات من قصّ الأسلاف وترتيب التكديس، واستضف الطبقة قرب العنصر المُشغِّل بدلًا من body كي ترث تسلسل سمة العنصر المُشغِّل وتحافظ على ترتيب تركيز طبيعي.'},
      {guidance: false, description: 'تطبيق أنماط ARIA مباشرةً في Layer ما لم تكن تتولى أيضًا سلوك إمكانية الوصول بالكامل.'},
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Core positioning hook for overlay content via CSS Anchor Positioning + Popover API. Foundation for custom popovers, hover cards, tooltips, fixed-position layers. Both modes use theme body defaults and end ancestor surface/group membership as a whole. Explicit props and unrelated contexts remain unchanged; establish intentional groups and complete required providers inside the rendered layer.',
  paramDescriptions: {
    mode: 'positioning strategy: context = CSS anchor relative to trigger; fixed = explicit x/y coords',
    onShow: 'fires when layer becomes visible.',
    onHide: 'fires when layer hides.',
    lightDismiss: 'whether native outside-click light-dismiss is enabled.',
    lazyMount:
      'context only: defer position resolution/content mounting until show; unmount on hide.',
  },
  returnDescriptions: {
    ref: 'trigger ref for context mode; undefined in fixed mode.',
    anchorId: 'CSS anchor name.',
    show: 'show layer.',
    hide: 'hide layer.',
    isOpen: 'whether layer is open.',
    id: 'unique ARIA id.',
    render:
      'renders popover element; pass placement/alignment or x/y. Placement/alignment logical: mapped to self-* position-area keywords resolved against the popover\'s inherited direction (RTL mirrors in pure CSS). `positioning: "custom"` (context mode) = author position styles yourself via `style`; keeps popover behavior + position-anchor wiring, derives nothing (incl. RTL mirroring, which becomes yours). `offset` (context mode) = clearance from the anchor as a CSS length (number = px), applied to both edges of the placement axis so it survives a flip; layers are flush by default. Context mode begins with an inert `<template>` marker for stable SSR/hydration, then keeps the final layer inline at a safe JSX position or portals it to the nearest safe ancestor; CSS custom properties keep inheriting from that host while direction and writing mode are preserved from the JSX position. `lazyMount` waits for show and unmounts content on hide while the marker remains. The Popover API top layer escapes clipping/stacking wherever it is hosted. Viewport overflow: flips to opposite side; centered layers also slide along the alignment axis (span fallbacks).',
  },
  usage: {
    description:
      'Core positioning hook for overlay content via CSS Anchor Positioning + Popover API. Foundation for custom popovers, hover cards, tooltips, fixed-position layers. Both modes use theme body defaults and end ancestor surface/group membership as a whole. Explicit props and unrelated contexts remain unchanged; establish intentional groups and complete required providers inside the rendered layer.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use context mode for trigger-anchored overlays; fixed mode for explicit coordinates.',
      },
      {
        guidance: true,
        description:
          'Build on Popover/HoverCard/Tooltip for common overlay patterns.',
      },
      {
        guidance: true,
        description:
          'Rely on the Popover API top layer to escape clipping/stacking; host the layer near its trigger (not in the body) to inherit the trigger theme cascade and natural focus order.',
      },
      {
        guidance: false,
        description:
          'Implement ARIA directly in Layer unless you own full accessibility behavior.',
      },
    ],
  },
};
