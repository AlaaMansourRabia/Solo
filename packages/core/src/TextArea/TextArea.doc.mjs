/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Label',
    required: true,
    description: 'Text identifying the multi-line field.',
  },
  {
    name: 'Description',
    required: false,
    description: 'Helper text between the label and the input.',
  },
  {
    name: 'Input container',
    required: true,
    description: 'Painted boundary containing the text area and its overlays.',
  },
  {
    name: 'Text area',
    required: true,
    description: 'Multi-line control that displays and edits the value.',
  },
  {
    name: 'Placeholder',
    required: false,
    description: 'Hint text shown inside the empty text area.',
  },
  {
    name: 'Start icon',
    required: false,
    description:
      'Solo Icon rendered at the start when startIcon is a semantic name or icon component.',
  },
  {
    name: 'Custom start content',
    required: false,
    description:
      'Caller-provided ReactNode rendered at the start instead of an Solo Icon.',
  },
  {
    name: 'Spinner',
    required: false,
    description: 'Loading indicator shown at the end of the input container.',
  },
  {
    name: 'Status icon',
    required: false,
    description: 'Error, warning, or success icon shown inside the input.',
  },
  {
    name: 'Character counter',
    required: false,
    description:
      'Current and maximum character counts shown inside the input container.',
  },
  {
    name: 'Field status message',
    required: false,
    description:
      'Attached or detached error, warning, or success message associated with the field.',
  },
  {
    name: 'Tooltip status message',
    required: false,
    description:
      'Tooltip surface presenting the status message for the tooltip variant.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TextArea',
  displayName: 'Text Area',
  category: 'Form Controls',
  keywords: [
    'textarea',
    'textfield',
    'multiline',
    'comment',
    'message',
    'autoresize',
    'autosize',
    'charlimit',
  ],
  props: [
    {
      name: 'ref',
      type: 'React.Ref<HTMLTextAreaElement>',
      description: 'Ref forwarded to the underlying <textarea> element.',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the textarea. Always rendered for accessibility.',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'Current value of the textarea.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string, e: ChangeEvent<HTMLTextAreaElement>) => void',
      description: 'Callback fired when the textarea value changes.',
    },
    {
      name: 'changeAction',
      type: '(value: string, e: ChangeEvent<HTMLTextAreaElement>) => void | Promise<void>',
      description:
        'Async action fired after onChange inside a React transition. Enables optimistic updates via useOptimistic.',
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
      description: 'Helper text displayed between the label and textarea.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Displays an "Optional" indicator next to the label. Mutually exclusive with isRequired.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Displays a "Required" indicator next to the label and sets aria-required. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the textarea, preventing interaction.',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Makes the textarea read-only: the value is shown at full opacity and still submits with the form, but cannot be edited. Unlike isDisabled, a read-only textarea is not dimmed and stays in the tab order. isDisabled takes precedence when both are set.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the textarea is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the textarea focusable via aria-disabled (the field becomes read-only). Use this instead of wrapping a disabled TextArea in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Puts the textarea in a loading state, showing a spinner inside the input.',
      default: 'false',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when the textarea is empty.',
    },
    {
      name: 'rows',
      type: 'number',
      description: 'Number of visible text rows.',
      default: '3',
    },
    {
      name: 'maxLength',
      type: 'number',
      description:
        'Maximum number of characters allowed, counted as user-perceived characters: an emoji or flag sequence counts as one. When set, a character counter (current/max) is displayed inside the input container, anchored to the bottom-right beneath the text. Does not enforce the limit natively; when exceeded the counter turns red and shows a warning icon (a non-color cue), and screen-reader users hear the remaining/over-limit count announced. Consumers validating the limit should count with characterCount (exported from the package) so enforcement matches the displayed count.',
    },
    {
      name: 'status',
      type: "{ type: 'warning' | 'error' | 'success'; message?: string }",
      description:
        'Status indicator that applies a colored border and icon. An optional message is displayed in a floating box below the textarea.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing; tooltip hides the message box and surfaces it in a tooltip on the status icon.',
      default: "'attached'",
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Tooltip text displayed in an info icon at the end of the label.',
    },
    {
      name: 'startIcon',
      type: 'ReactNode | IconType',
      description:
        'Icon component rendered inside the leading edge of the textarea wrapper. See the Icon docs (`IconName`) for valid semantic names.',
    },
    {
      name: 'hasSpellCheck',
      type: 'boolean',
      description: 'Enables or disables browser spell checking.',
      default: 'true',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Automatically focuses the textarea on mount.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description:
        'Size of the textarea, affecting internal padding. Height is controlled by rows, not size.',
      default: "'md'",
    },
    {
      name: 'onPaste',
      type: '(e: ClipboardEvent<HTMLTextAreaElement>) => void',
      description: 'Callback fired when content is pasted into the textarea.',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'HTML name attribute for the textarea element, useful for form submissions.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLTextAreaElement>) => void',
      description: 'Callback fired when the textarea receives focus.',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLTextAreaElement>) => void',
      description: 'Callback fired when the textarea loses focus.',
    },
    {
      name: 'autoComplete',
      type: 'string',
      description:
        'The native autocomplete attribute, forwarded to the textarea unchanged. Does not affect the controlled value.',
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
      {
        className: 'solo-text-area',
        visualProps: ['size', 'status'],
        states: ['disabled', 'readonly'],
      },
      {className: 'solo-text-area-control'},
      {className: 'solo-text-area-counter'},
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {
        className: 'solo-textarea',
        visualProps: ['size', 'status'],
        states: ['disabled', 'readonly'],
        deprecatedFor: 'text-area',
      },
    ],
    vars: [
      {
        name: '--_textarea-inline-padding',
        description:
          "Inline padding of the textarea's text. The wrapper stays flush (padding: 0) so the native resize grip sits in the true corner; this var carries the inset on the inner <textarea>, and the start icon, status/spinner, and character counter align to it.",
        default: 'var(--spacing-2)',
        private: true,
      },
    ],
    derived: [
      {
        property: 'paddingInline',
        vars: ['--_textarea-inline-padding'],
        replaces: true,
      },
    ],
  },
  usage: {
    anatomy,
    description:
      'TextArea is a multi-line text input for collecting longer-form content like comments, descriptions, or messages. Use it when the expected input spans multiple lines. For shorter, single-line values, use TextInput.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a visible label so users know what to enter. If the label must be hidden, set isLabelHidden with a descriptive label for screen readers.',
      },
      {
        guidance: true,
        description:
          'Set maxLength with a character counter when there is a defined limit; it helps users stay within bounds before they submit.',
      },
      {
        guidance: true,
        description:
          'Use the status prop to surface validation feedback inline: show success when input is valid, warning for soft limits, and error for hard failures.',
      },
      {
        guidance: true,
        description:
          'Add a description or placeholder to clarify expected content, like "Describe the issue in detail," but never rely on placeholder alone as the only label.',
      },
      {
        guidance: false,
        description:
          'Avoid using TextArea for short, single-line values like names or emails; use TextInput instead.',
      },
      {
        guidance: false,
        description:
          "Don't rely solely on placeholder text to communicate the purpose of the field; placeholders disappear on focus and are not accessible labels.",
      },
      {
        guidance: false,
        description:
          "Don't show a status message without also setting the status type; the colored border and icon are what draw the user's attention to the message.",
      },
      {
        guidance: false,
        description:
          "Don't wrap a disabled TextArea in Tooltip to explain why it's disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.",
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'TextArea',
  displayName: 'Text Area',
  props: [
    {
      name: 'ref',
      type: 'React.Ref<HTMLTextAreaElement>',
      description: '转发至底层 <textarea> 元素的 ref。',
    },
    {
      name: 'label',
      type: 'string',
      description: '文本域的标签文本：始终渲染以确保无障碍性。',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: '文本域的当前值。',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string, e: ChangeEvent<HTMLTextAreaElement>) => void',
      description: '文本域值变化时触发的回调。',
    },
    {
      name: 'changeAction',
      type: '(value: string, e: ChangeEvent<HTMLTextAreaElement>) => void | Promise<void>',
      description:
        '在 React transition 内于 onChange 之后触发的异步操作。通过 useOptimistic 启用乐观更新。',
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
      description: '显示在标签和文本域之间的辅助文本。',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: '在标签旁显示"可选"指示器。与 isRequired 互斥。',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        '在标签旁显示"必填"指示器并设置 aria-required。与 isOptional 互斥。',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: '禁用文本域，阻止交互。',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        '将文本域设为只读：值以完整不透明度显示并仍随表单提交，但无法编辑。与 isDisabled 不同，只读文本域不会变暗，并保留在 Tab 顺序中。同时设置时 isDisabled 优先。',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        '说明文本域被禁用的原因。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持文本域可聚焦（字段变为只读）。请使用此属性，而不是用 Tooltip 包裹已禁用的 TextArea。',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: '使文本域进入加载状态，在输入框内显示旋转器。',
      default: 'false',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: '文本域为空时显示的占位符文本。',
    },
    {
      name: 'rows',
      type: 'number',
      description: '可见文本行数。',
      default: '3',
    },
    {
      name: 'maxLength',
      type: 'number',
      description:
        '允许的最大字符数。设置后，在文本域下方显示字符计数器（当前/最大）。不原生强制限制：超出时计数器显示错误样式。',
    },
    {
      name: 'status',
      type: "{ type: 'warning' | 'error' | 'success'; message?: string }",
      description:
        '应用彩色边框和图标的状态指示器。可选消息显示在文本域下方的浮动框中。',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        '状态消息相对于输入框的放置方式。attached 直接叠加在输入框下方（带边框处理）；detached 作为独立元素浮于下方并留有间距；tooltip 隐藏消息框，并在状态图标上以提示气泡形式显示。',
      default: "'attached'",
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: '在标签末尾的信息图标中显示的工具提示文本。',
    },
    {
      name: 'startIcon',
      type: 'ReactNode | IconType',
      description: '在文本域包装器前端内部渲染的图标组件。',
    },
    {
      name: 'hasSpellCheck',
      type: 'boolean',
      description: '启用或禁用浏览器拼写检查。',
      default: 'true',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: '挂载时自动聚焦文本域。',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: '文本域的尺寸，影响内部填充。高度由 rows 控制，而非 size。',
      default: "'md'",
    },
    {
      name: 'onPaste',
      type: '(e: ClipboardEvent<HTMLTextAreaElement>) => void',
      description: '内容粘贴到文本域时触发的回调。',
    },
    {
      name: 'htmlName',
      type: 'string',
      description: '文本域元素的 HTML name 属性，用于表单提交。',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: '字段宽度（数字为像素，字符串按原样使用，如 "100%"）。作用于整个字段（标签、控件和状态），使其保持对齐。',
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLTextAreaElement>) => void',
      description: '文本域获得焦点时触发的回调。',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLTextAreaElement>) => void',
      description: '文本域失去焦点时触发的回调。',
    },
    {
      name: 'autoComplete',
      type: 'string',
      description: '原生 autocomplete 属性，原样转发给文本域。不影响受控的值。',
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
      {
        className: 'solo-text-area',
        visualProps: ['size', 'status'],
        states: ['disabled', 'readonly'],
      },
      {className: 'solo-text-area-control'},
      {className: 'solo-text-area-counter'},
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {
        className: 'solo-textarea',
        visualProps: ['size', 'status'],
        states: ['disabled', 'readonly'],
        deprecatedFor: 'text-area',
      },
    ],
    vars: [
      {
        name: '--_textarea-inline-padding',
        description:
          '文本域文本的行内内边距。外层容器保持无内边距（padding: 0），使原生缩放手柄位于真正的角落；该变量在内部 <textarea> 上承载内边距，起始图标、状态/加载指示器和字符计数器都与之对齐。',
        default: 'var(--spacing-2)',
        private: true,
      },
    ],
    derived: [
      {
        property: 'paddingInline',
        vars: ['--_textarea-inline-padding'],
        replaces: true,
      },
    ],
  },
  usage: {
    description:
      'TextArea is a multi-line text input for collecting longer-form content like comments, descriptions, or messages. Use it when the expected input spans multiple lines. For shorter, single-line values, use TextInput.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a visible label so users know what to enter. If the label must be hidden, set isLabelHidden with a descriptive label for screen readers.',
      },
      {
        guidance: true,
        description:
          'Set maxLength with a character counter when there is a defined limit; it helps users stay within bounds before they submit.',
      },
      {
        guidance: true,
        description:
          'Use the status prop to surface validation feedback inline: show success when input is valid, warning for soft limits, and error for hard failures.',
      },
      {
        guidance: true,
        description:
          'Add a description or placeholder to clarify expected content, like "Describe the issue in detail," but never rely on placeholder alone as the only label.',
      },
      {
        guidance: false,
        description:
          'Avoid using TextArea for short, single-line values like names or emails; use TextInput instead.',
      },
      {
        guidance: false,
        description:
          "Don't rely solely on placeholder text to communicate the purpose of the field; placeholders disappear on focus and are not accessible labels.",
      },
      {
        guidance: false,
        description:
          "Don't show a status message without also setting the status type; the colored border and icon are what draw the user's attention to the message.",
      },
      {
        guidance: false,
        description:
          "Don't wrap a disabled TextArea in Tooltip to explain why it's disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.",
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حقل إدخال نصي متعدد الأسطر لجمع المحتوى الأطول مثل التعليقات أو الأوصاف أو الرسائل.',
  propDescriptions: {
    ref: 'مرجع يُمرَّر إلى عنصر <textarea> الأساسي.',
    label: 'نص تسمية حقل النص. يُعرض دائمًا لأغراض إمكانية الوصول.',
    value: 'القيمة الحالية لحقل النص.',
    onChange: 'دالة استدعاء تُنفَّذ عند تغيّر قيمة حقل النص.',
    changeAction: 'إجراء غير متزامن يُنفَّذ بعد onChange داخل انتقال React. يتيح التحديثات المتفائلة عبر useOptimistic.',
    isLabelHidden: 'يُخفي التسمية بصريًا مع إبقائها قابلة للوصول لقارئ الشاشة.',
    description: 'نص مساعد يُعرض بين التسمية وحقل النص.',
    isOptional: 'يعرض مؤشر "Optional" بجانب التسمية. لا يجتمع مع isRequired.',
    isRequired: 'يعرض مؤشر "Required" بجانب التسمية ويعيّن aria-required. لا يجتمع مع isOptional.',
    isDisabled: 'يعطّل حقل النص ويمنع التفاعل معه.',
    isReadOnly: 'يجعل حقل النص للقراءة فقط: تُعرض القيمة بعتامة كاملة وتظل تُرسل مع النموذج، لكن لا يمكن تحريرها. على عكس isDisabled، لا يُخفَت حقل النص المخصص للقراءة فقط ويبقى ضمن ترتيب Tab. تكون الأولوية لـ isDisabled عند تعيين كليهما.',
    disabledMessage: 'يوضح سبب تعطيل حقل النص. مع isDisabled، يعرض تلميحًا عند التمرير أو تركيز لوحة المفاتيح ويُبقي حقل النص قابلًا للتركيز عبر aria-disabled (ويصبح الحقل للقراءة فقط). استخدمه بدلًا من تغليف TextArea معطَّل داخل Tooltip. فعناصر التحكم المعطَّلة تبتلع أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    isLoading: 'يضع حقل النص في حالة التحميل، مع عرض مؤشر تحميل داخل حقل الإدخال.',
    placeholder: 'النص الإرشادي المعروض عندما يكون حقل النص فارغًا.',
    rows: 'عدد أسطر النص المرئية.',
    maxLength: 'الحد الأقصى المسموح به لعدد الأحرف، محسوبًا بالأحرف كما يدركها المستخدم: فالرمز التعبيري أو تسلسل العلم يُحسب حرفًا واحدًا. عند تعيينه، يُعرض عدّاد أحرف (الحالي/الأقصى) داخل حاوية الإدخال، مثبّتًا في الزاوية السفلية اليمنى أسفل النص. لا يفرض الحد بشكل أصلي؛ فعند تجاوزه يتحول العدّاد إلى اللون الأحمر ويعرض أيقونة تحذير (إشارة لا تعتمد على اللون)، ويسمع مستخدمو قارئ الشاشة إعلانًا بالعدد المتبقي أو الزائد. ينبغي للمستهلكين الذين يتحققون من الحد أن يحسبوا باستخدام characterCount (المُصدَّرة من الحزمة) لكي يتطابق الفرض مع العدد المعروض.',
    status: 'مؤشر حالة يطبّق حدًّا وأيقونة ملونين. تُعرض رسالة اختيارية في مربع عائم أسفل حقل النص.',
    statusVariant: 'كيفية وضع رسالة الحالة بالنسبة إلى حقل الإدخال. attached تتداخل مباشرة أسفل حقل الإدخال (معالجة بحدود)؛ و detached تطفو أسفله كعنصر منفصل مع تباعد؛ و tooltip تُخفي مربع الرسالة وتُظهرها في تلميح على أيقونة الحالة.',
    labelTooltip: 'نص تلميح يُعرض في أيقونة معلومات في نهاية التسمية.',
    startIcon: 'مكوّن أيقونة يُعرض داخل الحافة البادئة لغلاف حقل النص. راجع توثيق Icon (`IconName`) للاطلاع على الأسماء الدلالية الصالحة.',
    hasSpellCheck: 'يفعّل التدقيق الإملائي في المتصفح أو يعطّله.',
    hasAutoFocus: 'يمنح حقل النص التركيز تلقائيًا عند التركيب.',
    size: 'حجم حقل النص، ويؤثر في الحشو الداخلي. يتحكم rows في الارتفاع، وليس size.',
    onPaste: 'دالة استدعاء تُنفَّذ عند لصق محتوى في حقل النص.',
    htmlName: 'سمة name في HTML لعنصر حقل النص، مفيدة لإرسال النماذج.',
    width: 'عرض الحقل (الرقم = بكسلات، والسلسلة النصية تُستخدم كما هي، مثل "100%"). يحدد حجم الحقل بأكمله (التسمية وعنصر التحكم والحالة) لكي تبقى محاذية.',
    onFocus: 'دالة استدعاء تُنفَّذ عندما يتلقى حقل النص التركيز.',
    onBlur: 'دالة استدعاء تُنفَّذ عندما يفقد حقل النص التركيز.',
    autoComplete: 'سمة autocomplete الأصلية، تُمرَّر إلى حقل النص دون تغيير. لا تؤثر في القيمة المتحكَّم بها.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث يتجاوز أي صنف متعارض القيمة الافتراضية.',
  },
  usage: {
    description: 'TextArea حقل إدخال نصي متعدد الأسطر لجمع المحتوى الأطول مثل التعليقات أو الأوصاف أو الرسائل. استخدمه عندما يُتوقع أن يمتد الإدخال على عدة أسطر. أما للقيم الأقصر ذات السطر الواحد، فاستخدم TextInput.',
    bestPractices: [
      {
        guidance: true,
        description: 'وفّر تسمية مرئية لكي يعرف المستخدمون ما يجب إدخاله. وإذا وجب إخفاء التسمية، فعيّن isLabelHidden مع تسمية وصفية لقارئ الشاشة.',
      },
      {
        guidance: true,
        description: 'عيّن maxLength مع عدّاد أحرف عند وجود حد معرّف؛ فهو يساعد المستخدمين على البقاء ضمن الحدود قبل الإرسال.',
      },
      {
        guidance: true,
        description: 'استخدم الخاصية status لإظهار ملاحظات التحقق مضمّنة: اعرض success عندما يكون الإدخال صالحًا، و warning للحدود المرنة، و error للإخفاقات الصارمة.',
      },
      {
        guidance: true,
        description: 'أضف وصفًا أو نصًا إرشاديًا لتوضيح المحتوى المتوقع، مثل "Describe the issue in detail," لكن لا تعتمد أبدًا على النص الإرشادي وحده كتسمية وحيدة.',
      },
      {
        guidance: false,
        description: 'تجنّب استخدام TextArea للقيم القصيرة ذات السطر الواحد مثل الأسماء أو عناوين البريد الإلكتروني؛ استخدم TextInput بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'لا تعتمد على النص الإرشادي وحده لتوضيح الغرض من الحقل؛ فالنصوص الإرشادية تختفي عند التركيز وليست تسميات قابلة للوصول.',
      },
      {
        guidance: false,
        description: 'لا تعرض رسالة حالة دون تعيين نوع الحالة أيضًا؛ فالحدّ والأيقونة الملونان هما ما يلفت انتباه المستخدم إلى الرسالة.',
      },
      {
        guidance: false,
        description: 'لا تغلّف TextArea معطَّلًا داخل Tooltip لتوضيح سبب تعطيله؛ فعناصر التحكم المعطَّلة تبتلع أحداث التمرير التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'التسمية',
        required: true,
        description: 'نص يعرّف الحقل متعدد الأسطر.',
      },
      {
        name: 'الوصف',
        required: false,
        description: 'نص مساعد بين التسمية وحقل الإدخال.',
      },
      {
        name: 'حاوية الإدخال',
        required: true,
        description: 'حدود مرسومة تحتوي على منطقة النص وطبقاتها المتراكبة.',
      },
      {
        name: 'منطقة النص',
        required: true,
        description: 'عنصر تحكم متعدد الأسطر يعرض القيمة ويحررها.',
      },
      {
        name: 'النص الإرشادي',
        required: false,
        description: 'نص تلميح يُعرض داخل منطقة النص الفارغة.',
      },
      {
        name: 'أيقونة البداية',
        required: false,
        description: 'Solo Icon تُعرض في البداية عندما يكون startIcon اسمًا دلاليًا أو مكوّن أيقونة.',
      },
      {
        name: 'محتوى البداية المخصص',
        required: false,
        description: 'ReactNode يوفره المستدعي ويُعرض في البداية بدلًا من Solo Icon.',
      },
      {
        name: 'مؤشر التحميل',
        required: false,
        description: 'مؤشر تحميل يُعرض في نهاية حاوية الإدخال.',
      },
      {
        name: 'أيقونة الحالة',
        required: false,
        description: 'أيقونة خطأ أو تحذير أو نجاح تُعرض داخل حقل الإدخال.',
      },
      {
        name: 'عدّاد الأحرف',
        required: false,
        description: 'العدد الحالي والأقصى للأحرف معروضًا داخل حاوية الإدخال.',
      },
      {
        name: 'رسالة حالة الحقل',
        required: false,
        description: 'رسالة خطأ أو تحذير أو نجاح ملحقة أو منفصلة مرتبطة بالحقل.',
      },
      {
        name: 'رسالة الحالة في التلميح',
        required: false,
        description: 'سطح تلميح يعرض رسالة الحالة لنمط tooltip.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Multi-line text input for collecting longer user input.',
  usage: {
    description:
      'Multi-line input for comments, descriptions, messages. Use when input spans multiple lines; use TextInput for single-line.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Visible label or isLabelHidden with descriptive label for screen readers.',
      },
      {
        guidance: true,
        description: 'Set maxLength for character counter when a limit exists.',
      },
      {
        guidance: true,
        description:
          'Use status prop for inline validation: success, warning, error.',
      },
      {
        guidance: true,
        description:
          'Add description or placeholder for context; never placeholder alone as label.',
      },
      {
        guidance: false,
        description: 'Avoid TextArea for single-line values; use TextInput.',
      },
      {
        guidance: false,
        description:
          "Don't use placeholder as only label; disappears on focus, not accessible.",
      },
      {
        guidance: false,
        description:
          "Don't show status message without status type; border and icon draw attention.",
      },
      {
        guidance: false,
        description:
          "Don't wrap a disabled TextArea in Tooltip to explain the disabled state; use the disabledMessage prop instead.",
      },
    ],
  },
  propDescriptions: {
    ref: 'ref forwarded to underlying <textarea>.',
    label: 'Label text for textarea; always rendered for a11y.',
    value: 'Current textarea value.',
    onChange: 'Fired on textarea value change.',
    changeAction:
      'Async action after onChange in React transition. Enables useOptimistic.',
    isLabelHidden: 'Visually hides label; keeps screen reader access.',
    description: 'Helper text between label+textarea.',
    isOptional: 'Shows "Optional" indicator. Mutually exclusive w/ isRequired.',
    isRequired:
      'Shows "Required" indicator+sets aria-required. Mutually exclusive w/ isOptional.',
    isDisabled: 'Disables textarea, prevents interaction.',
    isReadOnly:
      'Read-only: value visible + still submits, but not editable. Unlike isDisabled: not dimmed, stays in tab order.',
    disabledMessage:
      'Explains why textarea is disabled. With isDisabled, shows tooltip on hover/focus + keeps textarea focusable via aria-disabled (field becomes read-only). Use instead of wrapping a disabled TextArea in Tooltip.',
    isLoading: 'Loading state w/ spinner inside input.',
    placeholder: 'Placeholder when textarea empty.',
    rows: 'Visible text rows.',
    maxLength:
      'Max chars allowed. Shows counter (current/max) inside the container, bottom-right beneath the text. No native enforcement; over-limit shows red + a warning icon and is announced to screen readers.',
    status:
      'Colored border+icon status. Optional floating message below textarea.',
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon.',
    labelTooltip: 'Tooltip in info icon at label end.',
    startIcon: 'Icon inside leading edge of textarea wrapper.',
    hasSpellCheck: 'Enables/disables browser spell checking.',
    hasAutoFocus: 'Auto-focus textarea on mount.',
    size: 'Textarea size; affects internal padding. Height controlled by rows.',
    onPaste: 'Fired on paste into textarea.',
    htmlName: 'HTML name attr for form submissions.',
    onFocus: 'Callback on focus.',
    onBlur: 'Callback on blur.',
    autoComplete: 'Native autocomplete attr, forwarded unchanged. Does not affect the controlled value.',
    className:
      'Tailwind classes (a string, not an inline style object) for layout customization; merged via cn(), so conflicting utilities override defaults.',
  },
};
