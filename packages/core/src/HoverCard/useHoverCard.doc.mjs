/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useHoverCard',
  displayName: 'useHoverCard',
  group: 'HoverCard',
  keywords: ['hovercard', 'hover', 'preview', 'card', 'tooltip', 'popup', 'floating', 'anchor'],
  params: [
    {name: 'placement', type: "'above' | 'below' | 'start' | 'end'", description: "Position relative to the trigger. Logical: start/end resolve against the popover\'s own inherited direction (RTL mirrors in pure CSS).", default: "'above'"},
    {name: 'alignment', type: "'start' | 'center' | 'end'", description: "Alignment along the placement axis. Logical: start/end resolve against the popover\'s own inherited direction (RTL mirrors in pure CSS).", default: "'center'"},
    {name: 'delay', type: 'number', description: 'Delay before showing the hover card on hover, in milliseconds.', default: '300'},
    {name: 'hideDelay', type: 'number', description: 'Delay before hiding after mouse or focus leaves, in milliseconds.', default: '200'},
    {name: 'focusTrigger', type: "'auto' | 'always' | 'never'", description: 'When focus should open the hover card. auto only attaches focus listeners to naturally focusable elements.', default: "'auto'"},
    {name: 'touchTrigger', type: "'auto' | 'tap' | 'none'", description: 'What a tap does where there is no hover. auto opens on tap unless the trigger performs an action of its own; tap always opens; none never opens on touch.', default: "'auto'"},
    {name: 'isEnabled', type: 'boolean', description: 'Whether hover and focus triggers are enabled.', default: 'true'},
    {name: 'label', type: 'string', description: 'Accessible name for the hover card popup. When provided, the popup is exposed as a named role="dialog"; when omitted, it falls back to role="group" (a group may validly be unnamed).'},
    {name: 'isOpen', type: 'boolean', description: 'Controlled open state. true force-shows, false force-hides, undefined lets hover/focus manage visibility.'},
    {name: 'isDefaultOpen', type: 'boolean', description: 'Whether the hover card should be shown on mount.', default: 'false'},
    {name: 'onShow', type: '() => void', description: 'Callback fired when the hover card becomes visible.'},
    {name: 'onHide', type: '() => void', description: 'Callback fired when the hover card is hidden.'},
  ],
  returns: [
    {name: 'ref', type: 'RefCallback<HTMLElement>', description: 'Combined ref that sets both position and interaction on the same trigger element.'},
    {name: 'positionRef', type: 'RefCallback<HTMLElement>', description: 'Ref for the positioning anchor element. Use when position and interaction live on different elements.'},
    {name: 'interactionRef', type: 'RefCallback<HTMLElement>', description: 'Ref for the hover/focus interaction element. Use with positionRef for split trigger patterns.'},
    {name: 'anchorId', type: 'string', description: 'CSS anchor name for advanced positioning cases.'},
    {name: 'describedBy', type: 'string', description: 'ID to compose into aria-describedby on the trigger.'},
    {name: 'renderHoverCard', type: "(children: ReactNode, props?: Omit<ContextRenderProps, 'positioning'>) => ReactNode", description: 'Render function for the anchor-positioned hover card content. The positioning opt-out is excluded: the hover card always derives its position from placement/alignment.'},
    {name: 'show', type: '() => void', description: 'Imperatively show the hover card immediately.'},
    {name: 'hide', type: '() => void', description: 'Imperatively hide the hover card immediately.'},
  ],
  usage: {
    description: 'Headless hook for hover-triggered floating cards. Builds on useLayer with hover/focus intent detection, configurable delays, safe hover behavior, and accessible aria-describedby linking. Use for rich previews on hover when you need full control over the trigger or rendered content.',
    bestPractices: [
      {guidance: true, description: 'Use for rich content previews such as user profiles, entity summaries, and link previews.'},
      {guidance: true, description: 'Prefer the HoverCard component for standard trigger-content pairs; use the hook for custom trigger patterns.'},
      {guidance: false, description: 'Use for simple text hints: use Tooltip or useTooltip instead.'},
    ],
  },
  relatedComponents: ['HoverCard', 'Tooltip', 'Popover'],
  relatedHooks: ['useLayer', 'useTooltip', 'usePopover'],
  importPath: '@solo/core/HoverCard',
  category: 'interaction',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) بلا واجهة لبطاقات عائمة تُفعَّل بالتمرير. يُبنى على useLayer مع اكتشاف نية التمرير/التركيز، ومهلات قابلة للضبط، وسلوك تمرير آمن، وربط aria-describedby قابل للوصول.',
  paramDescriptions: {
    placement: 'الموضع بالنسبة إلى المشغّل. قيم منطقية: تُحسب start/end وفق الاتجاه الموروث للنافذة المنبثقة نفسها (يُعكس RTL عبر CSS فقط).',
    alignment: 'المحاذاة على امتداد محور الموضع. قيم منطقية: تُحسب start/end وفق الاتجاه الموروث للنافذة المنبثقة نفسها (يُعكس RTL عبر CSS فقط).',
    delay: 'المهلة قبل إظهار بطاقة التمرير عند التمرير، بالمللي ثانية.',
    hideDelay: 'المهلة قبل الإخفاء بعد مغادرة المؤشر أو التركيز، بالمللي ثانية.',
    focusTrigger: 'متى يجب أن يفتح التركيزُ بطاقة التمرير. لا تُرفق auto مستمعي التركيز إلا بالعناصر القابلة للتركيز بطبيعتها.',
    touchTrigger: 'ما يفعله النقر حيث لا يتوفر التمرير. auto تفتح عند النقر ما لم يؤدِّ المشغّل إجراءً خاصًا به؛ وtap تفتح دائمًا؛ وnone لا تفتح أبدًا عند اللمس.',
    isEnabled: 'ما إذا كانت مشغّلات التمرير والتركيز مفعَّلة.',
    label: 'الاسم القابل للوصول للنافذة المنبثقة لبطاقة التمرير. عند توفيره تُعرَض النافذة كـ role="dialog" مسمّى؛ وعند حذفه تعود إلى role="group" (يجوز أن تكون المجموعة بلا اسم).',
    isOpen: 'حالة الفتح المتحكَّم بها. true تفرض الإظهار، وfalse تفرض الإخفاء، وundefined تترك إدارة الظهور للتمرير/التركيز.',
    isDefaultOpen: 'ما إذا كان يجب إظهار بطاقة التمرير عند التركيب.',
    onShow: 'دالة استدعاء تُنفَّذ عندما تصبح بطاقة التمرير مرئية.',
    onHide: 'دالة استدعاء تُنفَّذ عند إخفاء بطاقة التمرير.',
  },
  returnDescriptions: {
    ref: 'ref مدمج يضبط الموضع والتفاعل معًا على عنصر المشغّل نفسه.',
    positionRef: 'ref لعنصر الربط الموضعي. استخدمه عندما يكون الموضع والتفاعل على عنصرين مختلفين.',
    interactionRef: 'ref لعنصر تفاعل التمرير/التركيز. استخدمه مع positionRef لأنماط المشغّل المنفصلة.',
    anchorId: 'اسم الربط في CSS لحالات التموضع المتقدمة.',
    describedBy: 'معرّف يُضاف إلى aria-describedby على المشغّل.',
    renderHoverCard: 'دالة عرض لمحتوى بطاقة التمرير المتموضعة بالربط. يُستثنى خيار إلغاء التموضع: إذ تستمد بطاقة التمرير موضعها دائمًا من placement/alignment.',
    show: 'يُظهر بطاقة التمرير فورًا بشكل أمري.',
    hide: 'يُخفي بطاقة التمرير فورًا بشكل أمري.',
  },
  usage: {
    description: 'خطّاف (hook) بلا واجهة لبطاقات عائمة تُفعَّل بالتمرير. يُبنى على useLayer مع اكتشاف نية التمرير/التركيز، ومهلات قابلة للضبط، وسلوك تمرير آمن، وربط aria-describedby قابل للوصول. استخدمه للمعاينات الغنية عند التمرير حين تحتاج إلى تحكم كامل في المشغّل أو المحتوى المعروض.',
    bestPractices: [
      {guidance: true, description: 'استخدمه لمعاينات المحتوى الغني مثل الملفات الشخصية للمستخدمين، وملخصات الكيانات، ومعاينات الروابط.'},
      {guidance: true, description: 'فضّل المكوّن HoverCard لأزواج المشغّل والمحتوى القياسية؛ واستخدم الخطّاف لأنماط المشغّل المخصصة.'},
      {guidance: false, description: 'لا تستخدمه للتلميحات النصية البسيطة: استخدم Tooltip أو useTooltip بدلًا من ذلك.'},
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description: 'Headless hover-triggered floating cards. Builds on useLayer w/ hover/focus intent, delays, safe hover behavior, aria-describedby. Use for rich previews when trigger/content rendering needs full control.',
  paramDescriptions: {
    placement: 'position relative to trigger. logical: start/end follow the popover\'s inherited direction (RTL mirrors).',
    alignment: 'alignment along placement axis. logical: start/end follow the popover\'s inherited direction (RTL mirrors).',
    delay: 'show delay in ms.',
    hideDelay: 'hide delay after mouse/focus leave in ms.',
    focusTrigger: 'when focus opens hover card; auto = naturally focusable elements only.',
    touchTrigger: 'tap behavior with no hover; auto = tap unless trigger acts, tap = always, none = never.',
    isEnabled: 'whether hover/focus triggers are enabled.',
    label: 'accessible name for popup. with label: named role="dialog"; without: role="group".',
    isOpen: 'controlled open state: true force-show, false force-hide, undefined unmanaged.',
    isDefaultOpen: 'show on mount.',
    onShow: 'fires when hover card becomes visible.',
    onHide: 'fires when hover card hides.',
  },
  returnDescriptions: {
    ref: 'combined position + interaction ref.',
    positionRef: 'position anchor ref.',
    interactionRef: 'hover/focus interaction ref.',
    anchorId: 'CSS anchor name.',
    describedBy: 'ID for aria-describedby.',
    renderHoverCard: 'renders anchor-positioned hover card content.',
    show: 'show immediately.',
    hide: 'hide immediately.',
  },
  usage: {
    description: 'Headless hover-triggered floating cards. Builds on useLayer w/ hover/focus intent, delays, safe hover behavior, aria-describedby. Use for rich previews when trigger/content rendering needs full control.',
    bestPractices: [
      {guidance: true, description: 'Use for rich previews: profiles, entity summaries, link previews.'},
      {guidance: true, description: 'Prefer HoverCard for standard trigger-content pairs; use hook for custom trigger patterns.'},
      {guidance: false, description: 'Use for simple text hints: use Tooltip / useTooltip instead.'},
    ],
  },
};
