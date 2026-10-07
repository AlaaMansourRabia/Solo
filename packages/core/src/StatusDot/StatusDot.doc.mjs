/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Dot',
    required: true,
    description: 'Painted status dot that carries the selected semantic variant.',
  },
  {
    name: 'Status icon',
    required: false,
    description: 'Optional caller-supplied icon rendered inside the dot.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'StatusDot',
  displayName: 'Status Dot',
  category: 'Feedback & Status',
  keywords: ["statusdot","dot","indicator","status","signal","presence","availability","online","pip"],
  props: [
    {
      name: 'variant',
      type: "'success' | 'warning' | 'error' | 'accent' | 'neutral'",
      description: 'Semantic color variant.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label surfaced via aria-label.',
      required: true,
    },
    {
      name: 'isPulsing',
      type: 'boolean',
      description:
        'Enables a pulse animation; respects prefers-reduced-motion: reduce.',
      default: 'false',
    },
    {
      name: 'tooltip',
      type: 'string',
      description:
        'Tooltip text shown on hover to explain the status meaning.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        'Optional icon rendered centered inside the dot, painted in currentColor (the variant\'s ink). Gives the status a non-color mark, so use a different icon per status. Booleans and empty strings are ignored, so `cond && <Icon />` is safe. Same contract as AvatarStatusDot.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-status-dot', visualProps: ['variant']},
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {className: 'solo-statusdot', visualProps: ['variant'], deprecatedFor: 'status-dot'},
    ],
  },
  usage: {
    anatomy,
    description:
      'A small colored dot that communicates status like online/offline presence or severity levels. Supports five semantic variants and an optional pulse animation. Always pair with a visible text label, as color alone should not carry meaning.',
    bestPractices: [
      { guidance: true, description: 'Use StatusDot as a binary present/absent signal; avoid encoding many distinct states in a single dot, since color and size alone cannot reliably distinguish them.' },
      { guidance: true, description: 'Always pair with a visible text label so status is not conveyed by color alone.' },
      { guidance: true, description: 'Provide a descriptive `label` prop for screen reader accessibility.' },
      { guidance: true, description: 'Pair the dot with an icon that carries the status as a distinct shape when it must stand on its own without adjacent text, so meaning survives without color.' },
      { guidance: true, description: 'If you can\'t add a label or an icon, make sure the status is conveyed elsewhere accessibly (e.g. adjacent text, a table column, or a live region).' },
      { guidance: false, description: 'Rely on color alone to communicate status; StatusDot is not fully accessible in isolation, so the builder must make the status distinguishable in context via a label, an icon, or an accessible alternative.' },
      { guidance: false, description: 'Use the pulse animation for purely decorative purposes; reserve it for states that require immediate attention.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'StatusDot',
  displayName: 'Status Dot',
  props: [
    {
      name: 'variant',
      type: "'success' | 'warning' | 'error' | 'accent' | 'neutral'",
      description: '语义颜色变体。',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: '通过 aria-label 暴露的无障碍标签。',
      required: true,
    },
    {
      name: 'isPulsing',
      type: 'boolean',
      description:
        '启用脉冲动画；尊重 prefers-reduced-motion: reduce 设置。',
      default: 'false',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        '可选图标，居中渲染于圆点内，以 currentColor（变体的前景色）着色。为状态提供非颜色标记，请为每个状态使用不同图标。布尔值和空字符串会被忽略，因此 `cond && <Icon />` 是安全的。与 AvatarStatusDot 的契约一致。',
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-status-dot', visualProps: ['variant']},
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {className: 'solo-statusdot', visualProps: ['variant'], deprecatedFor: 'status-dot'},
    ],
  },
  usage: {
    anatomy,
    description:
      'A small colored dot that communicates status like online/offline presence or severity levels. Supports five semantic variants and an optional pulse animation. Always pair with a visible text label, as color alone should not carry meaning.',
    bestPractices: [
      { guidance: true, description: 'Use StatusDot as a binary present/absent signal; avoid encoding many distinct states in a single dot, since color and size alone cannot reliably distinguish them.' },
      { guidance: true, description: 'Always pair with a visible text label so status is not conveyed by color alone.' },
      { guidance: true, description: 'Provide a descriptive `label` prop for screen reader accessibility.' },
      { guidance: true, description: 'Pair the dot with an icon that carries the status as a distinct shape when it must stand on its own without adjacent text, so meaning survives without color.' },
      { guidance: true, description: 'If you can\'t add a label or an icon, make sure the status is conveyed elsewhere accessibly (e.g. adjacent text, a table column, or a live region).' },
      { guidance: false, description: 'Rely on color alone to communicate status; StatusDot is not fully accessible in isolation, so the builder must make the status distinguishable in context via a label, an icon, or an accessible alternative.' },
      { guidance: false, description: 'Use the pulse animation for purely decorative purposes; reserve it for states that require immediate attention.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'نقطة ملوّنة صغيرة تنقل الحالة مثل الحضور المتصل/غير المتصل أو مستويات الخطورة، وتدعم خمسة أنماط دلالية وحركة نبض اختيارية.',
  propDescriptions: {
    variant: 'نمط اللون الدلالي.',
    label: 'التسمية القابلة للوصول المعروضة عبر aria-label.',
    isPulsing: 'يفعّل حركة النبض؛ ويحترم prefers-reduced-motion: reduce.',
    tooltip: 'نص التلميح المعروض عند التمرير لشرح معنى الحالة.',
    icon: 'أيقونة اختيارية تُعرض في وسط النقطة، مرسومة بلون currentColor (لون حبر النمط). تمنح الحالة علامة غير لونية، لذا استخدم أيقونة مختلفة لكل حالة. تُتجاهل القيم المنطقية والنصوص الفارغة، لذا فإن `cond && <Icon />` آمن. العقد نفسه المتبع في AvatarStatusDot.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأحجام)، تُدمج مع أصناف المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'نقطة ملوّنة صغيرة تنقل الحالة مثل الحضور المتصل/غير المتصل أو مستويات الخطورة. تدعم خمسة أنماط دلالية وحركة نبض اختيارية. اقرنها دائمًا بتسمية نصية مرئية، إذ لا ينبغي أن يحمل اللون وحده المعنى.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم StatusDot كإشارة ثنائية للوجود/الغياب؛ وتجنب ترميز حالات متعددة مختلفة في نقطة واحدة، لأن اللون والحجم وحدهما لا يمكنهما التمييز بينها بشكل موثوق.',
      },
      {
        guidance: true,
        description: 'اقرنها دائمًا بتسمية نصية مرئية كي لا تُنقل الحالة باللون وحده.',
      },
      {
        guidance: true,
        description: 'وفّر خاصية `label` وصفية لإمكانية الوصول عبر قارئ الشاشة.',
      },
      {
        guidance: true,
        description: 'اقرن النقطة بأيقونة تحمل الحالة كشكل مميز عندما يجب أن تقف بمفردها دون نص مجاور، كي يبقى المعنى قائمًا دون الاعتماد على اللون.',
      },
      {
        guidance: true,
        description: 'إذا لم تتمكن من إضافة تسمية أو أيقونة، فتأكد من نقل الحالة في مكان آخر بطريقة قابلة للوصول (مثل نص مجاور، أو عمود في جدول، أو منطقة حيّة).',
      },
      {
        guidance: false,
        description: 'الاعتماد على اللون وحده لنقل الحالة؛ فـ StatusDot ليس قابلًا للوصول بالكامل بمعزل عن غيره، لذا يجب على المطوّر جعل الحالة قابلة للتمييز في سياقها عبر تسمية أو أيقونة أو بديل قابل للوصول.',
      },
      {
        guidance: false,
        description: 'استخدام حركة النبض لأغراض زخرفية بحتة؛ احتفظ بها للحالات التي تتطلب انتباهًا فوريًا.',
      },
    ],
    anatomy: [
      {
        name: 'النقطة',
        required: true,
        description: 'نقطة حالة مرسومة تحمل النمط الدلالي المحدد.',
      },
      {
        name: 'أيقونة الحالة',
        required: false,
        description: 'أيقونة اختيارية يوفّرها المستدعي وتُعرض داخل النقطة.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Small colored dot indicator for status display (online/offline, severity, etc).',
  usage: {
    anatomy,
    description:
      'A small colored dot that communicates status like online/offline presence or severity levels. Supports five semantic variants and an optional pulse animation. Always pair with a visible text label, as color alone should not carry meaning.',
    bestPractices: [
      { guidance: true, description: 'Use StatusDot as a binary present/absent signal; avoid encoding many distinct states in a single dot, since color and size alone cannot reliably distinguish them.' },
      { guidance: true, description: 'Always pair with a visible text label so status is not conveyed by color alone.' },
      { guidance: true, description: 'Provide a descriptive `label` prop for screen reader accessibility.' },
      { guidance: true, description: 'Pair the dot with an icon that carries the status as a distinct shape when it must stand on its own without adjacent text, so meaning survives without color.' },
      { guidance: true, description: 'If you can\'t add a label or an icon, make sure the status is conveyed elsewhere accessibly (e.g. adjacent text, a table column, or a live region).' },
      { guidance: false, description: 'Rely on color alone to communicate status; StatusDot is not fully accessible in isolation, so the builder must make the status distinguishable in context via a label, an icon, or an accessible alternative.' },
      { guidance: false, description: 'Use the pulse animation for purely decorative purposes; reserve it for states that require immediate attention.' },
    ],
  },
  propDescriptions: {
    variant: 'Semantic color variant.',
    label: 'Accessible label via aria-label.',
    isPulsing: 'Pulse animation; respects prefers-reduced-motion: reduce.',
    tooltip: 'Tooltip text on hover to explain status meaning.',
    icon: 'Optional ReactNode rendered centered in the dot (currentColor ink); a non-color mark for the status, use a different icon per status. Booleans/empty strings ignored (safe for cond && <Icon/>). Same contract as AvatarStatusDot.',
    className: 'Tailwind layout classes; merged via cn(), so conflicting utilities override defaults.',
  },
};