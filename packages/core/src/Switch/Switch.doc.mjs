/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Field',
    required: true,
    description: 'Container arranging the switch, label, and feedback.',
  },
  {
    name: 'Track',
    required: true,
    description: 'Pill-shaped surface that shows the off or on state.',
  },
  {
    name: 'Thumb',
    required: true,
    description: 'Indicator that moves across the track when state changes.',
  },
  {
    name: 'Label',
    required: true,
    description: 'Text identifying the setting controlled by the switch.',
  },
  {
    name: 'Description',
    required: false,
    description: 'Helper text below the label.',
  },
  {
    name: 'Spinner',
    required: false,
    description: 'Loading indicator shown inside the thumb while busy.',
  },
  {
    name: 'Status message',
    required: false,
    description: 'Error, warning, or success message below the switch.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Switch',
  displayName: 'Switch',
  category: 'Form Controls',
  keywords: [
    'switch',
    'toggle',
    'onoff',
    'flipswitch',
    'boolean',
    'toggleswitch',
  ],
  props: [
    {
      name: 'ref',
      type: 'React.Ref<HTMLInputElement>',
      description: 'Ref forwarded to the underlying <input> element.',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the switch (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'value',
      type: 'boolean',
      description: 'Whether the switch is on or off.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the switch state changes.',
    },
    {
      name: 'changeAction',
      type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>',
      description:
        'Async action fired after onChange. Triggers optimistic UI and shows a loading spinner until the promise resolves.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Whether the switch is in a loading state, showing a spinner inside the thumb.',
      default: 'false',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hides the label while keeping it accessible to screen readers.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed below the label.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the switch is disabled.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description:
        'Size variant controlling track and thumb dimensions. sm (32x20px) matches sm checkbox/radio vertical rhythm; md (40x24px, default) matches md checkbox/radio vertical rhythm.',
      default: "'md'",
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for the underlying checkbox input, useful for form submissions (submits "on" when the switch is on).',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the switch is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the switch focusable via aria-disabled (toggling stays blocked). Use this instead of wrapping a disabled Switch in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Whether the field is optional. Mutually exclusive with isRequired.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Whether the switch is required. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Status indicator with type and message. Displays a colored message box below the switch and sets aria-invalid when type is "error".',
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the switch receives focus.',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the switch loses focus.',
    },
    {
      name: 'labelIcon',
      type: 'ReactNode | IconType',
      description:
        'Icon displayed before the label text. See the Icon docs (`IconName`) for valid semantic names.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Tooltip text shown in an info icon at the end of the label.',
    },
    {
      name: 'labelPosition',
      type: "'start' | 'end'",
      description:
        'Which side of the switch the label appears on. "start" places the label before the switch.',
      default: "'end'",
    },
    {
      name: 'labelSpacing',
      type: "'hug' | 'spread'",
      description:
        'Spacing behavior between label and switch. "hug" places them next to each other; "spread" pushes them to opposite ends of the container (full width).',
      default: "'hug'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'solo-switch',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {
        className: 'solo-switch-thumb',
        visualProps: ['size'],
        states: ['checked'],
      },
      {
        className: 'solo-switch-field',
        visualProps: ['labelPosition', 'labelSpacing'],
      },
      {className: 'solo-switch-label'},
    ],
  },
  usage: {
    accessibility: [
      {
        name: 'Track and thumb',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Rest', 'Hover', 'Pointer down'],
        description:
          'The on and off tracks must each have at least 3:1 contrast with the surface behind them, and the thumb with its track. For Hover and Pointer down, measure the final colors after the tint and the pressed overlay are applied.',
      },
    ],
    anatomy,
    description:
      'A toggle control for on/off states that take effect immediately. Supports labels, descriptions, loading states, and validation. Use it for settings or preferences that apply instantly. For changes requiring a form submission, use a checkbox instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for settings that apply immediately; the toggle should take effect without a separate save action.',
      },
      {
        guidance: true,
        description:
          'Pair with a clear, concise label that describes the setting being controlled.',
      },
      {
        guidance: false,
        description:
          'Use for options that require a form submission to take effect; use a checkbox instead.',
      },
      {
        guidance: false,
        description:
          "Use a switch for multi-state values; it's strictly on/off.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled switch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Switch',
  displayName: 'Switch',
  props: [
    {
      name: 'ref',
      type: 'React.Ref<HTMLInputElement>',
      description: '转发至底层 <input> 元素的 ref。',
    },
    {
      name: 'label',
      type: 'string',
      description: '开关的标签文本（始终渲染以确保无障碍性）。',
      required: true,
    },
    {
      name: 'value',
      type: 'boolean',
      description: '开关是开启还是关闭。',
      required: true,
    },
    {
      name: 'onChange',
      type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void',
      description: '开关状态变化时触发的回调。',
    },
    {
      name: 'changeAction',
      type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>',
      description:
        '在 onChange 之后触发的异步操作。触发乐观 UI 并显示加载旋转器直到 Promise 完成。',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: '开关是否处于加载状态，在滑块内显示旋转器。',
      default: 'false',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: '视觉上隐藏标签，同时保持屏幕阅读器的无障碍性。',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: '显示在标签下方的描述文本。',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: '开关是否被禁用。',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: '控制轨道和滑块尺寸的尺寸变体。sm（32x20px）与 sm 复选框/单选框的垂直节奏一致；md（40x24px，默认）与 md 复选框/单选框的垂直节奏一致。',
      default: "'md'",
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        '底层复选框输入的 HTML name 属性，用于表单提交（开启时提交 "on"）。',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the switch is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the switch focusable via aria-disabled (toggling stays blocked). Use this instead of wrapping a disabled Switch in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: '字段是否为可选。与 isRequired 互斥。',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: '开关是否为必填。与 isOptional 互斥。',
      default: 'false',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        '带类型和消息的状态指示器。在开关下方显示彩色消息框，当类型为 "error" 时设置 aria-invalid。',
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: '开关获得焦点时触发的回调。',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: '开关失去焦点时触发的回调。',
    },
    {
      name: 'labelIcon',
      type: 'ReactNode | IconType',
      description: '显示在标签文本前面的图标。',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: '在标签末尾的信息图标中显示的工具提示文本。',
    },
    {
      name: 'labelPosition',
      type: "'start' | 'end'",
      description: '标签出现在开关的哪一侧。"start" 将标签放在开关前面。',
      default: "'end'",
    },
    {
      name: 'labelSpacing',
      type: "'hug' | 'spread'",
      description:
        '标签和开关之间的间距行为。"hug" 将它们并排放置；"spread" 将它们推到容器的两端（全宽）。"default" 是 "hug" 的已弃用别名。',
      default: "'hug'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: '字段宽度（数字为像素，字符串按原样使用，如 "100%"）。作用于整个字段（标签、控件和状态），使其保持对齐。',
    },
  ],
  theming: {
    targets: [
      {
        className: 'solo-switch',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {
        className: 'solo-switch-thumb',
        visualProps: ['size'],
        states: ['checked'],
      },
      {
        className: 'solo-switch-field',
        visualProps: ['labelPosition', 'labelSpacing'],
      },
      {className: 'solo-switch-label'},
    ],
  },
  usage: {
    description:
      'A toggle control for on/off states that take effect immediately. Supports labels, descriptions, loading states, and validation. Use it for settings or preferences that apply instantly. For changes requiring a form submission, use a checkbox instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for settings that apply immediately; the toggle should take effect without a separate save action.',
      },
      {
        guidance: true,
        description:
          'Pair with a clear, concise label that describes the setting being controlled.',
      },
      {
        guidance: false,
        description:
          'Use for options that require a form submission to take effect; use a checkbox instead.',
      },
      {
        guidance: false,
        description:
          "Use a switch for multi-state values; it's strictly on/off.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled switch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'مفتاح تبديل لحالات التشغيل/الإيقاف التي تسري فورًا، يدعم التسميات والأوصاف وحالات التحميل والتحقق، ويناسب الإعدادات والتفضيلات التي تُطبَّق مباشرةً.',
  propDescriptions: {
    ref: 'مرجع يُمرَّر إلى عنصر <input> الأساسي.',
    label: 'نص تسمية المفتاح (يُعرض دائمًا لأغراض إمكانية الوصول).',
    value: 'ما إذا كان المفتاح في وضع التشغيل أو الإيقاف.',
    onChange: 'دالة استدعاء تُطلق عند تغيّر حالة المفتاح.',
    changeAction:
      'إجراء غير متزامن يُطلق بعد onChange. يفعّل واجهة متفائلة ويعرض مؤشر تحميل دوّارًا حتى يُحسم الوعد (promise).',
    isLoading: 'ما إذا كان المفتاح في حالة تحميل، مع عرض مؤشر دوّار داخل المقبض.',
    isLabelHidden: 'يُخفي التسمية بصريًا مع إبقائها قابلة للوصول لقارئ الشاشة.',
    description: 'نص الوصف المعروض أسفل التسمية.',
    isDisabled: 'ما إذا كان المفتاح معطَّلًا.',
    size:
      'نمط الحجم الذي يتحكم في أبعاد المسار والمقبض. sm ‏(32x20px) يطابق الإيقاع العمودي لمربع الاختيار/زر الاختيار sm؛ وmd ‏(40x24px، الافتراضي) يطابق الإيقاع العمودي لمربع الاختيار/زر الاختيار md.',
    htmlName:
      'سمة name في HTML لحقل مربع الاختيار الأساسي، مفيدة لإرسال النماذج (يُرسل "on" عندما يكون المفتاح مشغّلًا).',
    disabledMessage:
      'يوضّح سبب تعطيل المفتاح. مع isDisabled يعرض تلميحًا عند المرور أو تركيز لوحة المفاتيح ويُبقي المفتاح قابلًا للتركيز عبر aria-disabled (مع بقاء التبديل محظورًا). استخدمه بدلًا من تغليف Switch معطَّل في Tooltip؛ إذ تبتلع عناصر التحكم المعطَّلة أحداث المرور التي يحتاجها Tooltip الخارجي.',
    isOptional: 'ما إذا كان الحقل اختياريًا. لا يجتمع مع isRequired.',
    isRequired: 'ما إذا كان المفتاح مطلوبًا. لا يجتمع مع isOptional.',
    status:
      'مؤشر حالة بنوع ورسالة. يعرض مربع رسالة ملوّنًا أسفل المفتاح ويعيّن aria-invalid عندما يكون النوع "error".',
    onFocus: 'دالة استدعاء تُطلق عندما يتلقى المفتاح التركيز.',
    onBlur: 'دالة استدعاء تُطلق عندما يفقد المفتاح التركيز.',
    labelIcon:
      'أيقونة تُعرض قبل نص التسمية. راجع توثيق Icon (`IconName`) لمعرفة الأسماء الدلالية الصالحة.',
    labelTooltip: 'نص تلميح يظهر في أيقونة معلومات عند نهاية التسمية.',
    labelPosition: 'الجانب الذي تظهر فيه التسمية من المفتاح. "start" تضع التسمية قبل المفتاح.',
    labelSpacing:
      'سلوك التباعد بين التسمية والمفتاح. "hug" تضعهما متجاورين؛ و"spread" تدفعهما إلى طرفي الحاوية المتقابلين (بالعرض الكامل).',
    width:
      'عرض الحقل (الرقم = بكسلات، والسلسلة تُستخدم كما هي، مثل "100%"). يحدّد حجم الحقل كاملًا (التسمية وعنصر التحكم والحالة) لتبقى متحاذية.',
  },
  usage: {
    description:
      'مفتاح تبديل لحالات التشغيل/الإيقاف التي تسري فورًا. يدعم التسميات والأوصاف وحالات التحميل والتحقق. استخدمه للإعدادات أو التفضيلات التي تُطبَّق مباشرةً. أما التغييرات التي تتطلب إرسال نموذج فاستخدم لها مربع اختيار بدلًا منه.',
    bestPractices: [
      {
        guidance: true,
        description:
          'استخدمه للإعدادات التي تُطبَّق فورًا؛ إذ ينبغي أن يسري التبديل دون إجراء حفظ منفصل.',
      },
      {
        guidance: true,
        description: 'اقرنه بتسمية واضحة وموجزة تصف الإعداد الذي يتحكم فيه.',
      },
      {
        guidance: false,
        description: 'لا تستخدمه لخيارات تتطلب إرسال نموذج لتسري؛ استخدم مربع اختيار بدلًا منه.',
      },
      {
        guidance: false,
        description: 'لا تستخدم مفتاح التبديل لقيم متعددة الحالات؛ فهو تشغيل/إيقاف حصرًا.',
      },
      {
        guidance: false,
        description:
          'لا تغلّف مفتاحًا معطَّلًا في Tooltip لتوضيح سبب تعطيله؛ إذ تبتلع عناصر التحكم المعطَّلة أحداث المرور التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'الحقل',
        required: true,
        description: 'حاوية ترتّب المفتاح والتسمية والملاحظات.',
      },
      {
        name: 'المسار',
        required: true,
        description: 'سطح على شكل كبسولة يُظهر حالة الإيقاف أو التشغيل.',
      },
      {
        name: 'المقبض',
        required: true,
        description: 'مؤشر يتحرك عبر المسار عند تغيّر الحالة.',
      },
      {
        name: 'التسمية',
        required: true,
        description: 'نص يعرّف الإعداد الذي يتحكم فيه المفتاح.',
      },
      {
        name: 'الوصف',
        required: false,
        description: 'نص مساعد أسفل التسمية.',
      },
      {
        name: 'المؤشر الدوّار',
        required: false,
        description: 'مؤشر تحميل يظهر داخل المقبض أثناء الانشغال.',
      },
      {
        name: 'رسالة الحالة',
        required: false,
        description: 'رسالة خطأ أو تحذير أو نجاح أسفل المفتاح.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Toggle switch for boolean values w/ integrated label support.',
  usage: {
    description:
      'A toggle control for on/off states that take effect immediately. Supports labels, descriptions, loading states, and validation. Use it for settings or preferences that apply instantly. For changes requiring a form submission, use a checkbox instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for settings that apply immediately; the toggle should take effect without a separate save action.',
      },
      {
        guidance: true,
        description:
          'Pair with a clear, concise label that describes the setting being controlled.',
      },
      {
        guidance: false,
        description:
          'Use for options that require a form submission to take effect; use a checkbox instead.',
      },
      {
        guidance: false,
        description:
          "Use a switch for multi-state values; it's strictly on/off.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled switch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    ref: 'ref forwarded to underlying <input>',
    label: 'Label text (always rendered for a11y).',
    value: 'Whether switch is on or off.',
    onChange: 'Fired when switch state changes.',
    changeAction:
      'Async action after onChange; triggers optimistic UI + loading spinner until resolved.',
    isLoading: 'Loading state; shows spinner in thumb.',
    isLabelHidden: 'Visually hides label; still accessible to screen readers.',
    description: 'Description text below label.',
    isDisabled: 'Whether switch is disabled.',
    htmlName: 'HTML name attr for the checkbox; submits "on" when on.',
    isOptional: 'Whether field is optional; mutually exclusive w/ isRequired.',
    isRequired: 'Whether switch is required; mutually exclusive w/ isOptional.',
    status:
      'Status indicator w/ type + message; colored message box, sets aria-invalid on error.',
    onFocus: 'Fired when switch receives focus.',
    onBlur: 'Fired when switch loses focus.',
    labelIcon: 'Icon before label text.',
    labelTooltip: 'Tooltip text in info icon at label end.',
    labelPosition: 'Which side label appears; "start" places before switch.',
    labelSpacing:
      'Spacing behavior; "hug" places next to each other, "spread" pushes to opposite ends (full width).',
  },
};
