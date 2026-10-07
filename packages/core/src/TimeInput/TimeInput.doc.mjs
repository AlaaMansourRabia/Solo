/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TimeInput',
  displayName: 'Time Input',
  category: 'Form Controls',
  keywords: [
    'timeinput',
    'timepicker',
    'time',
    'clock',
    'hour',
    'minute',
    'ampm',
    'timeselect',
    'timefield',
    'schedule',
  ],

  usage: {
    description:
      "TimeInput uses a browser/OS time picker on coarse pointers by default and Solo's typed field on fine pointers. It converts values to a standard format and supports arrow-key adjustment on the typed surface. Use it in forms, scheduling flows, or any interface where users need to select a specific time.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Choose the hour format (12h or 24h) that matches your audience's locale: 12-hour with AM/PM for US-centric UIs, 24-hour for international or technical contexts.",
      },
      {
        guidance: true,
        description:
          'Set min and max constraints when the context has a valid range, like business hours or event windows, so users cannot submit an out-of-bounds time.',
      },
      {
        guidance: true,
        description:
          'Provide a description or placeholder that hints at the expected format or purpose, like "Business hours: 9 AM \u2013 5 PM".',
      },
      {
        guidance: true,
        description:
          'Use the status prop to surface validation errors inline: show a message like "Time must be during business hours" so users know exactly what to fix.',
      },
      {
        guidance: true,
        description:
          'Enable hasClear when the field is optional, so users can remove a previously selected time.',
      },
      {
        guidance: true,
        description:
          'Place TimeInput inside InputGroup when the time needs a single-line prefix or suffix addon, like a start/end label or timezone marker.',
      },
      {
        guidance: false,
        description:
          "Don't use TimeInput for combined date-and-time selection; pair it with a separate DateInput instead.",
      },
      {
        guidance: false,
        description:
          "Don't hide the label; even when space is tight, keep the label visible or provide a description so the purpose is clear.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled TimeInput in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy: [
      {
        name: 'Clock icon',
        required: false,
        description:
          'A leading clock icon that identifies the field and opens the browser/OS picker in native mode.',
      },
      {
        name: 'Time control',
        required: true,
        description:
          'A real input type=time in native modes, or Solo\'s editable text field for fine pointers, presentation="text-input", seconds, and custom increments.',
      },
      {
        name: 'Clear button',
        required: false,
        description:
          'A trailing button to reset the value, shown when hasClear is true and a value is set.',
      },
      {
        name: 'Status icon',
        required: false,
        description:
          'A trailing icon indicating error, warning, or success state.',
      },
      {
        name: 'Spinner',
        required: false,
        description:
          'Replaces trailing content during loading to show an async action is in progress.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text for the input (required for accessibility).',
      required: true,
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
      description: 'Description text displayed between the label and input.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Shows an "(optional)" indicator next to the label. Mutually exclusive with isRequired.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Marks the field as required and sets aria-required. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the input and suppresses interactions.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the field focusable via aria-disabled (activation stays blocked). Use this instead of wrapping a disabled TimeInput in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'value',
      type: 'ISOTimeString',
      description: 'Controlled time value in ISO format (HH:MM or HH:MM:SS).',
    },
    {
      name: 'onChange',
      type: '(value: ISOTimeString | undefined) => void',
      description:
        'Callback fired when the time changes. Receives undefined when the input is cleared.',
    },
    {
      name: 'changeAction',
      type: '(value: ISOTimeString | undefined) => void | Promise<void>',
      description:
        'Async action fired after onChange. Wrapped in a React transition to provide optimistic UI; triggers the loading spinner while pending.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Puts the input into a loading state, displaying a spinner.',
      default: 'false',
    },
    {
      name: 'min',
      type: 'ISOTimeString',
      description:
        'Minimum selectable time in ISO format. Values outside the range are rejected.',
    },
    {
      name: 'max',
      type: 'ISOTimeString',
      description:
        'Maximum selectable time in ISO format. Values outside the range are rejected.',
    },
    {
      name: 'hasSeconds',
      type: 'boolean',
      description: 'Includes seconds in the time display and parsing.',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        'Shows a clear button when a value is set and the input is not disabled.',
      default: 'false',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description:
        'Whether to focus the input automatically on mount.',
      default: 'false',
    },
    {
      name: 'hourFormat',
      type: "'12h' | '24h'",
      description:
        "Controls the display format. '12h' shows AM/PM (e.g. '2:30 PM'); '24h' uses 24-hour notation (e.g. '14:30').",
      default: "'12h'",
    },
    {
      name: 'increment',
      type: 'number',
      description:
        'Number of minutes to add or subtract when the user presses the up or down arrow key.',
      default: '1',
    },
    {
      name: 'presentation',
      type: "'text-input' | 'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'",
      description:
        "Which surface selects the time. 'adaptive-native' (the default) uses Solo's typed field on a fine pointer and the browser/OS input type=time on a coarse pointer — except hasSeconds or increment other than 1, which retain the typed field because iOS has no seconds wheel and treats step as validation rather than picker cadence; 'native' always uses the browser/OS control with no Solo fallback; 'adaptive-bottom-sheet' uses the typed field on a fine pointer and Solo's bottom-sheet time wheels on a coarse pointer; 'bottom-sheet' forces the wheels on every pointer; 'text-input' (like 'popover', which has no distinct TimeInput surface) keeps only the typed field. Native mode forwards min/max and enforces them on commit. hourFormat formats the closed value; the open OS picker follows the device locale.",
      default: "'adaptive-native'",
    },
    {
      name: 'nativePicker',
      type: "'touch' | 'always' | 'never'",
      description:
        "Deprecated: use presentation ('touch' = 'adaptive-native', 'always' = 'native', 'never' = 'text-input'). Still works exactly as released; presentation wins when both are set.",
      default: "'touch'",
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        'Placeholder text shown when no time is selected. When the input is focused and empty, a format hint overrides this text.',
      default: "'Select a time'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Controls the height of the input element.',
      default: "'md'",
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Status indicator that colors the border and displays an icon. When a message is provided it is rendered below the input.',
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
        'Tooltip text rendered as an info icon at the end of the label row.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
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
        className: 'solo-time-input',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'TimeInput',

  displayName: 'Time Input',
  props: [
    {
      name: 'label',
      type: 'string',
      description: '输入框的标签文本（无障碍性所必需）。',
      required: true,
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
      description: '显示在标签和输入框之间的描述文本。',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: '在标签旁显示"（可选）"指示器。与 isRequired 互斥。',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: '将字段标记为必填并设置 aria-required。与 isOptional 互斥。',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: '禁用输入框并抑制交互。',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        '说明输入框为何被禁用。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示提示，并通过 aria-disabled 保持输入框可聚焦（仍阻止输入和调整）。请使用此属性，而不是用 Tooltip 包裹已禁用的 TimeInput。',
    },
    {
      name: 'value',
      type: 'ISOTimeString',
      description: 'ISO 格式的受控时间值（HH:MM 或 HH:MM:SS）。',
    },
    {
      name: 'onChange',
      type: '(value: ISOTimeString | undefined) => void',
      description: '时间变化时触发的回调。输入被清除时接收 undefined。',
    },
    {
      name: 'changeAction',
      type: '(value: ISOTimeString | undefined) => void | Promise<void>',
      description:
        '在 onChange 之后触发的异步操作。包装在 React transition 中以提供乐观 UI；挂起时触发加载旋转器。',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: '使输入框进入加载状态，显示旋转器。',
      default: 'false',
    },
    {
      name: 'min',
      type: 'ISOTimeString',
      description: 'ISO 格式的最小可选时间。超出范围的值将被拒绝。',
    },
    {
      name: 'max',
      type: 'ISOTimeString',
      description: 'ISO 格式的最大可选时间。超出范围的值将被拒绝。',
    },
    {
      name: 'hasSeconds',
      type: 'boolean',
      description: '在时间显示和解析中包含秒。',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: '当有值且输入框未被禁用时显示清除按钮。',
      default: 'false',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description:
        '挂载时是否自动聚焦输入框。',
      default: 'false',
    },
    {
      name: 'hourFormat',
      type: "'12h' | '24h'",
      description:
        "控制显示格式。'12h' 显示 AM/PM（例如 '2:30 PM'）；'24h' 使用 24 小时制（例如 '14:30'）。",
      default: "'12h'",
    },
    {
      name: 'increment',
      type: 'number',
      description: '用户按上或下方向键时增加或减少的分钟数。',
      default: '1',
    },
    {
      name: 'presentation',
      type: "'text-input' | 'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'",
      description:
        "选择时间所用的界面。'adaptive-native'（默认）在精细指针上使用 Solo 文本字段、在粗指针上使用浏览器/操作系统 input type=time——但 hasSeconds 或 increment 不为 1 时保留文本字段；'native' 始终使用浏览器/操作系统控件且不回退；'adaptive-bottom-sheet' 在精细指针上用文本字段、在粗指针上用 Solo 底部滚轮选择器；'bottom-sheet' 在任何指针上强制使用滚轮；'text-input'（与无独立界面的 'popover' 相同）只保留文本字段。原生模式会传递 min/max 并在提交时强制校验。hourFormat 控制关闭状态的显示；打开的系统选择器遵循设备区域设置。",
      default: "'adaptive-native'",
    },
    {
      name: 'nativePicker',
      type: "'touch' | 'always' | 'never'",
      description:
        "已弃用：请使用 presentation（'touch'='adaptive-native'、'always'='native'、'never'='text-input'）。仍按已发布行为工作；同时设置时以 presentation 为准。",
      default: "'touch'",
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        '未选择时间时显示的占位符文本。当输入框聚焦且为空时，格式提示会覆盖此文本。',
      default: "'Select a time'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: '控制输入框元素的高度。',
      default: "'md'",
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        '为边框着色并显示图标的状态指示器。当提供消息时，消息渲染在输入框下方。',
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
      description: '在标签行末尾以信息图标形式渲染的工具提示文本。',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: '字段宽度（数字为像素，字符串按原样使用，如 "100%"）。作用于整个字段（标签、控件和状态），使其保持对齐。',
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
        className: 'solo-time-input',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
    ],
  },
  usage: {
    description:
      'TimeInput 默认在粗指针设备上使用浏览器/操作系统的时间选择器，在精细指针设备上使用 Solo 文本字段。它将时间转换为标准格式，并在文本字段界面支持方向键调整。适用于表单、排期流程和其他时间选择场景。',
    bestPractices: [
      {
        guidance: true,
        description:
          "Choose the hour format (12h or 24h) that matches your audience's locale: 12-hour with AM/PM for US-centric UIs, 24-hour for international or technical contexts.",
      },
      {
        guidance: true,
        description:
          'Set min and max constraints when the context has a valid range, like business hours or event windows, so users cannot submit an out-of-bounds time.',
      },
      {
        guidance: true,
        description:
          'Provide a description or placeholder that hints at the expected format or purpose, like "Business hours: 9 AM \u2013 5 PM".',
      },
      {
        guidance: true,
        description:
          'Use the status prop to surface validation errors inline: show a message like "Time must be during business hours" so users know exactly what to fix.',
      },
      {
        guidance: true,
        description:
          'Enable hasClear when the field is optional, so users can remove a previously selected time.',
      },
      {
        guidance: false,
        description:
          "Don't use TimeInput for combined date-and-time selection; pair it with a separate DateInput instead.",
      },
      {
        guidance: false,
        description:
          "Don't hide the label; even when space is tight, keep the label visible or provide a description so the purpose is clear.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled TimeInput in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy: [
      {
        name: 'Clock icon',
        required: false,
        description:
          '用于识别时间字段的前置时钟图标；在原生模式下也可打开浏览器/操作系统选择器。',
      },
      {
        name: 'Time control',
        required: true,
        description:
          '原生模式下使用真正的 input type=time；精细指针、presentation="text-input"、秒或自定义步进场景使用 Solo 可编辑文本字段。',
      },
      {
        name: 'Clear button',
        required: false,
        description:
          'A trailing button to reset the value, shown when hasClear is true and a value is set.',
      },
      {
        name: 'Status icon',
        required: false,
        description:
          'A trailing icon indicating error, warning, or success state.',
      },
      {
        name: 'Spinner',
        required: false,
        description:
          'Replaces trailing content during loading to show an async action is in progress.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حقل إدخال لتحديد وقت معيّن، يستخدم منتقي الوقت الخاص بالمتصفح/نظام التشغيل على المؤشرات غير الدقيقة وحقل Solo النصي على المؤشرات الدقيقة.',
  propDescriptions: {
    label: 'نص التسمية لحقل الإدخال (مطلوب لأغراض إمكانية الوصول).',
    isLabelHidden: 'يخفي التسمية بصريًا مع إبقائها متاحة لقارئات الشاشة.',
    description: 'نص الوصف المعروض بين التسمية وحقل الإدخال.',
    isOptional: 'يعرض مؤشر "(optional)" بجانب التسمية. لا يجتمع مع isRequired.',
    isRequired: 'يحدد الحقل على أنه مطلوب ويعيّن aria-required. لا يجتمع مع isOptional.',
    isDisabled: 'يعطّل حقل الإدخال ويمنع التفاعلات.',
    disabledMessage: 'يوضح سبب تعطيل حقل الإدخال. مع isDisabled، يعرض تلميحًا عند التمرير/تركيز لوحة المفاتيح ويُبقي الحقل قابلًا للتركيز عبر aria-disabled (مع بقاء التفعيل محظورًا). استخدمه بدلًا من تغليف TimeInput معطَّل داخل Tooltip، إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    value: 'قيمة الوقت المتحكَّم بها بتنسيق ISO (HH:MM أو HH:MM:SS).',
    onChange: 'دالة استدعاء تُطلَق عند تغيّر الوقت. تتلقى undefined عند مسح حقل الإدخال.',
    changeAction: 'إجراء غير متزامن يُطلَق بعد onChange. يُغلَّف في انتقال React لتوفير واجهة تفاؤلية؛ ويشغّل مؤشر التحميل الدوّار أثناء الانتظار.',
    isLoading: 'يضع حقل الإدخال في حالة تحميل، مع عرض مؤشر دوران.',
    min: 'أقل وقت قابل للتحديد بتنسيق ISO. تُرفض القيم خارج النطاق.',
    max: 'أقصى وقت قابل للتحديد بتنسيق ISO. تُرفض القيم خارج النطاق.',
    hasSeconds: 'يضمّن الثواني في عرض الوقت وتحليله.',
    hasClear: 'يعرض زر مسح عند تعيين قيمة وعندما لا يكون حقل الإدخال معطَّلًا.',
    hasAutoFocus: 'ما إذا كان يجب تركيز حقل الإدخال تلقائيًا عند التركيب.',
    hourFormat: 'يتحكم في تنسيق العرض. \'12h\' يعرض AM/PM (مثل \'2:30 PM\')؛ و\'24h\' يستخدم نظام 24 ساعة (مثل \'14:30\').',
    increment: 'عدد الدقائق المراد إضافتها أو طرحها عندما يضغط المستخدم على مفتاح السهم لأعلى أو لأسفل.',
    presentation: 'السطح الذي يُحدَّد منه الوقت. \'adaptive-native\' (الافتراضي) يستخدم حقل Solo النصي على المؤشر الدقيق وinput type=time الخاص بالمتصفح/نظام التشغيل على المؤشر غير الدقيق — باستثناء حالة hasSeconds أو increment بقيمة غير 1، إذ يُحتفظ بالحقل النصي لأن iOS لا يحتوي على عجلة للثواني ويعامل step كقيد تحقق لا كإيقاع للمنتقي؛ و\'native\' يستخدم دائمًا عنصر تحكم المتصفح/نظام التشغيل دون بديل من Solo؛ و\'adaptive-bottom-sheet\' يستخدم الحقل النصي على المؤشر الدقيق وعجلات الوقت في الورقة السفلية من Solo على المؤشر غير الدقيق؛ و\'bottom-sheet\' يفرض العجلات على كل المؤشرات؛ و\'text-input\' (مثل \'popover\' الذي لا يملك سطحًا مميزًا في TimeInput) يُبقي الحقل النصي فقط. يمرّر الوضع الأصلي min/max ويفرضهما عند الاعتماد. يُنسّق hourFormat القيمة المغلقة؛ بينما يتبع منتقي نظام التشغيل المفتوح لغة الجهاز وإعداداته الإقليمية.',
    nativePicker: 'مُهمَل: استخدم presentation (\'touch\' = \'adaptive-native\'، و\'always\' = \'native\'، و\'never\' = \'text-input\'). لا يزال يعمل تمامًا كما صدر؛ وتكون الغلبة لـ presentation عند تعيين كليهما.',
    placeholder: 'نص إرشادي يظهر عند عدم تحديد أي وقت. عندما يكون حقل الإدخال مُركَّزًا وفارغًا، يحل محل هذا النص تلميح بالتنسيق.',
    size: 'يتحكم في ارتفاع عنصر الإدخال.',
    status: 'مؤشر حالة يلوّن الحدّ ويعرض أيقونة. عند توفير رسالة تُعرض أسفل حقل الإدخال.',
    statusVariant: 'كيفية وضع رسالة الحالة بالنسبة إلى حقل الإدخال. attached تتراكب مباشرةً أسفل حقل الإدخال (بمعالجة ذات حدود)؛ وdetached تطفو أسفله كعنصر منفصل مع تباعد؛ وtooltip تخفي صندوق الرسالة وتُظهرها في تلميح على أيقونة الحالة.',
    labelTooltip: 'نص تلميح يُعرض كأيقونة معلومات في نهاية صف التسمية.',
    width: 'عرض الحقل (الرقم = بكسلات، والنص يُستخدم كما هو، مثل "100%"). يحدد حجم الحقل كاملًا (التسمية وعنصر التحكم والحالة) كي تبقى متحاذية.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمَج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداةُ المتعارضة القيمةَ الافتراضية.',
  },
  usage: {
    description: 'يستخدم TimeInput افتراضيًا منتقي الوقت الخاص بالمتصفح/نظام التشغيل على المؤشرات غير الدقيقة، وحقل Solo النصي على المؤشرات الدقيقة. يحوّل القيم إلى تنسيق قياسي ويدعم الضبط بمفاتيح الأسهم على السطح النصي. استخدمه في النماذج، ومسارات الجدولة، أو أي واجهة يحتاج فيها المستخدمون إلى تحديد وقت معيّن.',
    bestPractices: [
      {
        guidance: true,
        description: 'اختر تنسيق الساعة (12h أو 24h) الذي يطابق الإعدادات الإقليمية لجمهورك: نظام 12 ساعة مع AM/PM للواجهات الموجّهة إلى الولايات المتحدة، ونظام 24 ساعة للسياقات الدولية أو التقنية.',
      },
      {
        guidance: true,
        description: 'عيّن قيود min وmax عندما يكون للسياق نطاق صالح، مثل ساعات العمل أو نوافذ الفعاليات، كي لا يتمكن المستخدمون من إرسال وقت خارج الحدود.',
      },
      {
        guidance: true,
        description: 'قدّم وصفًا أو نصًا إرشاديًا يلمّح إلى التنسيق أو الغرض المتوقع، مثل "Business hours: 9 AM – 5 PM".',
      },
      {
        guidance: true,
        description: 'استخدم الخاصية status لإظهار أخطاء التحقق مضمّنةً: اعرض رسالة مثل "Time must be during business hours" كي يعرف المستخدمون بالضبط ما يجب إصلاحه.',
      },
      {
        guidance: true,
        description: 'فعّل hasClear عندما يكون الحقل اختياريًا، كي يتمكن المستخدمون من إزالة وقت محدد مسبقًا.',
      },
      {
        guidance: true,
        description: 'ضع TimeInput داخل InputGroup عندما يحتاج الوقت إلى إضافة بادئة أو لاحقة في سطر واحد، مثل تسمية بداية/نهاية أو علامة المنطقة الزمنية.',
      },
      {
        guidance: false,
        description: 'لا تستخدم TimeInput لتحديد التاريخ والوقت معًا؛ اقرنه بـ DateInput منفصل بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'لا تُخفِ التسمية؛ حتى عندما تكون المساحة محدودة، أبقِ التسمية مرئية أو قدّم وصفًا كي يكون الغرض واضحًا.',
      },
      {
        guidance: false,
        description: 'لا تغلّف TimeInput معطَّلًا داخل Tooltip لتوضيح سبب تعطيله؛ إذ تبتلع المشغّلات المعطَّلة أحداث التمرير التي يحتاجها المغلِّف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'أيقونة الساعة',
        required: false,
        description: 'أيقونة ساعة بادئة تعرّف الحقل وتفتح منتقي المتصفح/نظام التشغيل في الوضع الأصلي.',
      },
      {
        name: 'عنصر التحكم بالوقت',
        required: true,
        description: 'حقل input type=time حقيقي في الأوضاع الأصلية، أو حقل Solo النصي القابل للتحرير للمؤشرات الدقيقة، وpresentation="text-input"، والثواني، والزيادات المخصصة.',
      },
      {
        name: 'زر المسح',
        required: false,
        description: 'زر ختامي لإعادة تعيين القيمة، يظهر عندما تكون hasClear بقيمة true وتكون هناك قيمة معيّنة.',
      },
      {
        name: 'أيقونة الحالة',
        required: false,
        description: 'أيقونة ختامية تشير إلى حالة الخطأ أو التحذير أو النجاح.',
      },
      {
        name: 'مؤشر الدوران',
        required: false,
        description: 'يحل محل المحتوى الختامي أثناء التحميل للإشارة إلى أن إجراءً غير متزامن قيد التنفيذ.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Time input with browser/OS picker on touch by default and Solo typed-field fallbacks for seconds or custom increments.',
  usage: {
    description:
      'TimeInput uses a browser/OS picker on coarse pointers by default and Solo typed entry on fine pointers. It standardizes values and supports arrow-key adjustment on the typed surface.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Choose hour format (12h/24h) to match locale: 12h for US, 24h for international.',
      },
      {
        guidance: true,
        description:
          'Set min/max constraints for valid ranges like business hours.',
      },
      {
        guidance: true,
        description:
          'Provide description or placeholder hinting at expected format.',
      },
      {
        guidance: true,
        description: 'Use status prop for inline validation errors.',
      },
      {guidance: true, description: 'Enable hasClear for optional fields.'},
      {
        guidance: true,
        description:
          'Place inside InputGroup for a single-line prefix or suffix addon, like a label or timezone marker.',
      },
      {
        guidance: false,
        description:
          "Don't use for date-and-time; pair with DateInput instead.",
      },
      {
        guidance: false,
        description: "Don't hide the label; keep it visible for clarity.",
      },
      {
        guidance: false,
        description:
          "Don't wrap a disabled TimeInput in Tooltip; use the disabledMessage prop instead.",
      },
    ],
  },
  propDescriptions: {
    label: 'Label text (required for a11y).',
    isLabelHidden: 'Visually hides label; keeps screen reader access.',
    description: 'Description text between label+input.',
    isOptional:
      'Shows "(optional)" indicator. Mutually exclusive w/ isRequired.',
    isRequired:
      'Marks required+sets aria-required. Mutually exclusive w/ isOptional.',
    isDisabled: 'Disables input, suppresses interactions.',
    disabledMessage:
      'Reason shown in a tooltip on hover/focus when disabled; keeps input focusable via aria-disabled.',
    value: 'Controlled time in ISO format (HH:MM or HH:MM:SS).',
    onChange: 'Fired on time change. Receives undefined when cleared.',
    changeAction:
      'Async action after onChange in React transition; triggers spinner while pending.',
    isLoading: 'Loading state w/ spinner.',
    min: 'Min selectable time in ISO format. Out-of-range rejected.',
    max: 'Max selectable time in ISO format. Out-of-range rejected.',
    hasSeconds: 'Includes seconds in display+parsing.',
    hasClear: 'Shows clear button when value set+not disabled.',
    hasAutoFocus: 'auto-focus on mount',
    hourFormat:
      "Display format. '12h' shows AM/PM; '24h' uses 24-hour notation.",
    increment: 'Minutes to add/subtract on arrow up/down.',
    presentation:
      "picker surface: 'adaptive-native' (default) = typed field fine / browser/OS coarse (hasSeconds or increment!=1 retains typed); 'native' = browser/OS always, no fallback; 'adaptive-bottom-sheet' = typed fine / Solo wheel sheet coarse; 'bottom-sheet' = sheet always; 'text-input'/'popover' = typed field only.",
    nativePicker:
      "deprecated, use presentation: 'touch'='adaptive-native', 'always'='native', 'never'='text-input'. still works as released; presentation wins if both set.",
    placeholder: 'Placeholder when empty. Focused+empty shows format hint.',
    size: 'Input element height.',
    status: 'Colored border+icon. Message rendered below input.',
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon.',
    labelTooltip: 'Tooltip as info icon at label row end.',
    className:
      'Tailwind classes (a string, not an inline style object) for layout customization; merged via cn(), so conflicting utilities override defaults.',
  },
};
