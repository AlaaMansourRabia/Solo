/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'DateTimeInput',
  displayName: 'Date Time Input',
  group: 'DateInput',
  category: 'Form Controls',
  keywords: [
    'datetimepicker',
    'datetime',
    'datepicker',
    'timepicker',
    'calendar',
    'schedule',
    'event',
    'deadline',
    'timestamp',
  ],
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text.',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text displayed below the label.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Show an "(optional)" indicator next to the label.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Mark the field as required.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disable the input and picker.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the field focusable via aria-disabled (activation stays blocked). Use this instead of wrapping a disabled DateTimeInput in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'value',
      type: 'ISODateTimeString',
      description:
        'Selected datetime in ISO 8601 format (YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS).',
    },
    {
      name: 'onChange',
      type: '(value: ISODateTimeString | undefined) => void',
      description: 'Callback invoked when the selected datetime changes.',
      required: true,
    },
    {
      name: 'changeAction',
      type: '(value: ISODateTimeString | undefined) => void | Promise<void>',
      description:
        'Async action fired after onChange. Drives optimistic UI updates via useTransition.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Whether the input is in a loading state. Disables interaction and shows a spinner.',
      default: 'false',
    },
    {
      name: 'min',
      type: 'ISODateTimeString',
      description:
        'Minimum selectable datetime. Constrains both date and time selection.',
    },
    {
      name: 'max',
      type: 'ISODateTimeString',
      description:
        'Maximum selectable datetime. Constrains both date and time selection.',
    },
    {
      name: 'dateConstraints',
      type: 'ReadonlyArray<(date: Date) => boolean>',
      description:
        'Array of custom constraint functions that disable specific dates.',
    },
    {
      name: 'hasSeconds',
      type: 'boolean',
      description:
        "Include seconds in the time portion. Keeps Solo's time field even when nativePicker selects native surfaces, because iOS has no seconds wheel.",
      default: 'false',
    },
    {
      name: 'hourFormat',
      type: "'12h' | '24h'",
      description:
        "Hour display format. '12h' shows AM/PM; '24h' uses 24-hour notation.",
      default: "'12h'",
    },
    {
      name: 'timeIncrement',
      type: '1 | 5 | 10 | 15 | 30',
      description:
        "Minute step for arrow keys in Solo's typed time field. A non-default value keeps the Solo time field in nativePicker modes because iOS treats native step as validation, not picker cadence. Ignored by the Solo touch sheet, which uses wheels.",
      default: '1',
    },
    {
      name: 'timeOptionInterval',
      type: '5 | 10 | 15 | 30 | 60',
      description:
        "Minute cadence for the preset-time combobox on Solo's fine-pointer time field. Setting it keeps that Solo time field even in nativePicker modes because the OS picker has no equivalent preset list. The Solo touch sheet uses wheels.",
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Shows a clear button when a datetime value is set.',
      default: 'false',
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        'Placeholder text shown in the date portion when no date is selected.',
      default: "'Select a date'",
    },
    {
      name: 'timePlaceholder',
      type: 'string',
      description:
        'Placeholder text shown in the time portion when no time is selected. On touch, this appears in the closed time segment before a time is chosen.',
      default: "'Select a time'",
    },
    {
      name: 'timeLabel',
      type: 'string',
      description:
        'Accessible label for the time portion. Defaults to "{label} time" so it is tied to the field label and localizable.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size of the input control.',
      default: "'md'",
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Status indicator object for error, warning, or success states with a message.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Tooltip text displayed via an info icon at the end of the label.',
    },
    {
      name: 'numberOfMonths',
      type: '1 | 2',
      description:
        "Number of months displayed simultaneously in Solo's pointer calendar popover. Ignored by native date controls and the mobile touch sheet, whose Date panel always shows one swipe-paged month at a time.",
      default: '1',
    },
    {
      name: 'weekStartsOn',
      type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'",
      description:
        'First day of week in Solo calendars. A number (0 = Sunday to 6 = Saturday) or a three-letter day name. Ignored by native date controls.',
      default: '0',
    },
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'",
      description:
        "Which surfaces draw the date and time pickers. 'adaptive-native' (the default) uses Solo's typed fields and popovers on a fine pointer and browser/OS controls on a coarse pointer — with per-segment Solo fallbacks: hasSeconds, non-default timeIncrement, or timeOptionInterval retain Solo's time field because iOS cannot express them faithfully; 'native' always uses both browser/OS controls with no fallback; 'adaptive-bottom-sheet' uses popovers on a fine pointer and Solo's coordinated bottom sheet on a coarse pointer; 'popover' and 'bottom-sheet' force that Solo surface on every pointer. Every value opens pickers; typed-only fields are TimeInput's alone. Use a non-native presentation when numberOfMonths, weekStartsOn, or visible dateConstraints behavior matters. Constraints are enforced on commit; min/max are forwarded as hints. hourFormat formats the closed time, while the OS picker follows the user's locale.",
      default: "'adaptive-native'",
    },
    {
      name: 'nativePicker',
      type: "'touch' | 'always' | 'never'",
      description:
        "Deprecated: use presentation ('touch' = 'adaptive-native', 'always' = 'native', 'never' = 'adaptive-bottom-sheet'). Still works exactly as released; presentation wins when both are set.",
      default: "'touch'",
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
        className: 'solo-date-time-input',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
      {
        className: 'solo-date-time-input-date-segment',
        visualProps: ['size', 'status'],
      },
      {
        className: 'solo-date-time-input-time-segment',
        visualProps: ['size', 'status'],
      },
      {className: 'solo-date-time-input-toggle-icon', states: ['state']},
      {className: 'solo-date-time-input-clock-icon'},
      {className: 'solo-date-time-input-time-listbox'},
      {className: 'solo-date-time-input-time-option'},
    ],
  },
  usage: {
    description:
      'DateTimeInput combines date and time selection in one field. With presentation="adaptive-native" (the default), mouse/trackpad devices use Solo typed fields and popovers, while coarse-pointer devices use browser/OS date and time controls in the same two-segment field. presentation="native" uses both native controls on every pointer; presentation="adaptive-bottom-sheet" keeps Solo\'s own surfaces — pointer fields on fine pointers and the coordinated Date/Time bottom sheet on coarse pointers; "popover" and "bottom-sheet" force one Solo surface on every pointer. The closed segments stay side by side when at least 400px is available and wrap into full-width rows below 400px, independent of viewport width. Use it for scheduling, event creation, deadline setting, or any form field that needs a specific datetime.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide clear labels and descriptions so users understand what datetime is expected.',
      },
      {
        guidance: true,
        description:
          'Use min and max to restrict selectable datetimes to valid ranges.',
      },
      {
        guidance: true,
        description:
          'Use hasClear when the datetime is optional so the user can reset it.',
      },
      {
        guidance: true,
        description:
          "Choose the hour format (12h or 24h) that matches your audience's locale.",
      },
      {
        guidance: false,
        description:
          'Use DateTimeInput when only a date is needed; use DateInput instead.',
      },
      {
        guidance: false,
        description:
          'Use DateTimeInput when only a time is needed; use TimeInput instead.',
      },
      {
        guidance: false,
        description:
          'Hide the label without surrounding context that makes the field purpose obvious.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled DateTimeInput in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy: [
      {
        name: 'Label',
        required: true,
        description:
          'Text above the input describing what datetime is expected.',
      },
      {
        name: 'Date input',
        required: true,
        description:
          'A typed date field with calendar popover on the fine-pointer Solo surface, a real input type=date in native modes, or a read-only segment opening the Solo touch sheet under presentation="adaptive-bottom-sheet" on a coarse pointer.',
      },
      {
        name: 'Calendar icon',
        required: true,
        description:
          'A button that opens the active date surface: the platform picker, Solo calendar popover, or Solo touch sheet.',
      },
      {
        name: 'Date picker',
        required: false,
        description:
          'The browser/OS picker in native modes, an Solo month-grid popover on a fine pointer, or the Date panel of the Solo bottom sheet on a coarse pointer with presentation="adaptive-bottom-sheet".',
      },
      {
        name: 'Time input',
        required: true,
        description:
          'A real input type=time for the default minute-precision native mode, a text/combobox time field when seconds, custom increments, or preset options are requested, or a read-only segment opening accessible time wheels under presentation="adaptive-bottom-sheet" on a coarse pointer.',
      },
      {
        name: 'Time options popover',
        required: false,
        description:
          "A list of preset times at the timeOptionInterval cadence. Setting the prop retains Solo's text/combobox time field even when nativePicker otherwise selects native controls; the Solo touch sheet uses wheels instead.",
      },
      {
        name: 'Clear button',
        required: false,
        description: 'A × button that resets the datetime value.',
      },
      {
        name: 'Status message',
        required: false,
        description: 'An error, warning, or success message below the inputs.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'DateTimeInput',
  displayName: 'Date Time Input',
  usage: {
    description:
      'DateTimeInput combines date and time selection in one field. With presentation="adaptive-native" (the default), mouse/trackpad devices use Solo typed fields and popovers, while coarse-pointer devices use browser/OS date and time controls in the same two-segment field. presentation="native" uses both native controls on every pointer; presentation="adaptive-bottom-sheet" keeps Solo\'s own surfaces — pointer fields on fine pointers and the coordinated Date/Time bottom sheet on coarse pointers; "popover" and "bottom-sheet" force one Solo surface on every pointer. The closed segments stay side by side when at least 400px is available and wrap into full-width rows below 400px, independent of viewport width. Use it for scheduling, event creation, deadline setting, or any form field that needs a specific datetime.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide clear labels and descriptions so users understand what datetime is expected.',
      },
      {
        guidance: true,
        description:
          'Use min and max to restrict selectable datetimes to valid ranges.',
      },
      {
        guidance: true,
        description:
          'Use hasClear when the datetime is optional so the user can reset it.',
      },
      {
        guidance: true,
        description:
          "Choose the hour format (12h or 24h) that matches your audience's locale.",
      },
      {
        guidance: false,
        description:
          'Use DateTimeInput when only a date is needed; use DateInput instead.',
      },
      {
        guidance: false,
        description:
          'Use DateTimeInput when only a time is needed; use TimeInput instead.',
      },
      {
        guidance: false,
        description:
          'Hide the label without surrounding context that makes the field purpose obvious.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled DateTimeInput in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  props: [
    {name: 'label', type: 'string', description: '标签文本。', required: true},
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: '视觉隐藏标签。',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: '显示在标签下方的辅助文本。',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: '在标签旁显示"(optional)"指示器。',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: '将字段标记为必填。',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: '禁用输入框和选择器。',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        '说明输入框为何被禁用。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示提示，并通过 aria-disabled 保持日期和时间字段可聚焦（仍阻止输入和激活）。请使用此属性，而不是用 Tooltip 包裹已禁用的 DateTimeInput。',
    },
    {
      name: 'value',
      type: 'ISODateTimeString',
      description: '选中的日期时间，ISO 8601 格式。',
    },
    {
      name: 'onChange',
      type: '(value: ISODateTimeString | undefined) => void',
      description: '选中日期时间变更时调用的回调。',
      required: true,
    },
    {
      name: 'changeAction',
      type: '(value: ISODateTimeString | undefined) => void | Promise<void>',
      description:
        '在 onChange 之后触发的异步操作。通过 useTransition 驱动乐观更新。',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: '输入框是否处于加载状态。禁用交互并显示加载指示器。',
      default: 'false',
    },
    {
      name: 'min',
      type: 'ISODateTimeString',
      description: '可选择的最早日期时间。同时约束日期和时间选择。',
    },
    {
      name: 'max',
      type: 'ISODateTimeString',
      description: '可选择的最晚日期时间。同时约束日期和时间选择。',
    },
    {
      name: 'dateConstraints',
      type: 'ReadonlyArray<(date: Date) => boolean>',
      description: '自定义约束函数数组，用于禁用特定日期。',
    },
    {
      name: 'hasSeconds',
      type: 'boolean',
      description:
        '在时间部分包含秒。即使 nativePicker 选择原生界面，也会保留 Solo 时间字段，因为 iOS 没有秒滚轮。',
      default: 'false',
    },
    {
      name: 'hourFormat',
      type: "'12h' | '24h'",
      description: "控制显示格式。'12h' 显示 AM/PM；'24h' 使用 24 小时制。",
      default: "'12h'",
    },
    {
      name: 'timeIncrement',
      type: '1 | 5 | 10 | 15 | 30',
      description:
        'Solo 可输入时间字段中箭头键的分钟步长。非默认值会在 nativePicker 模式下保留 Solo 时间字段，因为 iOS 将原生 step 视为验证规则，而不是选择器步长。Solo 触摸面板使用滚轮。',
      default: '1',
    },
    {
      name: 'timeOptionInterval',
      type: '5 | 10 | 15 | 30 | 60',
      description: 'Solo 精确指针时间字段中预设时间组合框的分钟间隔。设置后，即使在 nativePicker 模式下也保留 Solo 时间字段，因为系统选择器没有等效的预设列表。Solo 触摸面板使用滚轮。',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: '当有值时显示清除按钮。',
      default: 'false',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: '日期部分未选择日期时显示的占位符文本。',
      default: "'Select a date'",
    },
    {
      name: 'timePlaceholder',
      type: 'string',
      description:
        '时间部分未选择时间时显示的占位符文本。在触摸设备上，这会显示在未选择时间的闭合时间段中。',
      default: "'Select a time'",
    },
    {
      name: 'timeLabel',
      type: 'string',
      description:
        '时间部分的无障碍标签。默认为“{label} time”，与字段标签关联且可本地化。',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: '输入控件的尺寸。',
      default: "'md'",
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: '错误、警告或成功状态的状态指示对象，附带消息。',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: '通过标签末尾的信息图标显示的提示文本。',
    },
    {
      name: 'numberOfMonths',
      type: '1 | 2',
      description:
        'Solo 指针日历弹出层中同时显示的月份数量。原生日期控件和移动触摸面板会忽略此属性；触摸面板的日期部分一次显示一个可滑动月份。',
      default: '1',
    },
    {
      name: 'weekStartsOn',
      type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'",
      description:
        'Solo 日历中每周的起始日。可为数字（0=周日……6=周六）或三字母星期缩写。原生日期控件会忽略此属性。',
      default: '0',
    },
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'",
      description:
        "选择由哪些界面绘制日期和时间选择器。'adaptive-native'（默认）在精细指针上使用 Solo 文本字段与弹出层、在粗指针上使用浏览器/操作系统控件，并按段回退：hasSeconds、非默认 timeIncrement 或 timeOptionInterval 会保留 Solo 时间字段；'native' 始终使用两个原生控件且不回退；'adaptive-bottom-sheet' 在精细指针上用弹出层、在粗指针上用 Solo 协调底部面板；'popover' 与 'bottom-sheet' 在任何指针上强制使用对应 Solo 界面。每个值都会打开选择器；仅文本字段的呈现只属于 TimeInput。需要 numberOfMonths、weekStartsOn 或可见 dateConstraints 行为时请使用非原生呈现。约束会在提交时执行，min/max 作为提示传给原生控件。hourFormat 格式化关闭状态的时间，而操作系统选择器遵循用户区域设置。",
      default: "'adaptive-native'",
    },
    {
      name: 'nativePicker',
      type: "'touch' | 'always' | 'never'",
      description:
        "已弃用：请使用 presentation（'touch'='adaptive-native'、'always'='native'、'never'='adaptive-bottom-sheet'）。仍按已发布行为工作；同时设置时以 presentation 为准。",
      default: "'touch'",
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
        className: 'solo-date-time-input',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
      {
        className: 'solo-date-time-input-date-segment',
        visualProps: ['size', 'status'],
      },
      {
        className: 'solo-date-time-input-time-segment',
        visualProps: ['size', 'status'],
      },
      {className: 'solo-date-time-input-toggle-icon', states: ['state']},
      {className: 'solo-date-time-input-clock-icon'},
      {className: 'solo-date-time-input-time-listbox'},
      {className: 'solo-date-time-input-time-option'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يجمع DateTimeInput اختيار التاريخ والوقت في حقل واحد، ويُستخدم للجدولة وإنشاء الأحداث وتحديد المواعيد النهائية وأي حقل نموذج يتطلب تاريخًا ووقتًا محددين.',
  propDescriptions: {
    label: 'نص التسمية.',
    isLabelHidden: 'يُخفي التسمية بصريًا.',
    description: 'نص مساعد يُعرض أسفل التسمية.',
    isOptional: 'يعرض مؤشر "(optional)" بجوار التسمية.',
    isRequired: 'يضع علامة على الحقل بأنه مطلوب.',
    isDisabled: 'يعطّل حقل الإدخال وأداة الاختيار.',
    disabledMessage: 'يشرح سبب تعطيل حقل الإدخال. مع isDisabled، يعرض تلميحًا عند التمرير أو التركيز بلوحة المفاتيح ويُبقي الحقل قابلًا للتركيز عبر aria-disabled (مع بقاء التفعيل محظورًا). استخدمه بدلًا من تغليف DateTimeInput معطَّل داخل Tooltip؛ إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    value: 'التاريخ والوقت المحدَّدان بتنسيق ISO 8601 (YYYY-MM-DDTHH:MM أو YYYY-MM-DDTHH:MM:SS).',
    onChange: 'دالة استدعاء تُنفَّذ عند تغيّر التاريخ والوقت المحدَّدين.',
    changeAction: 'إجراء غير متزامن يُنفَّذ بعد onChange. يقود تحديثات الواجهة التفاؤلية عبر useTransition.',
    isLoading: 'ما إذا كان حقل الإدخال في حالة التحميل. يعطّل التفاعل ويعرض مؤشر دوران.',
    min: 'أدنى تاريخ ووقت قابلين للاختيار. يقيّد اختيار التاريخ والوقت معًا.',
    max: 'أقصى تاريخ ووقت قابلين للاختيار. يقيّد اختيار التاريخ والوقت معًا.',
    dateConstraints: 'مصفوفة من دوال القيود المخصّصة التي تعطّل تواريخ محددة.',
    hasSeconds: 'يُضمّن الثواني في جزء الوقت. يُبقي حقل الوقت الخاص بـ Solo حتى عندما يختار nativePicker الأسطح الأصلية، لأن iOS لا يوفّر عجلة للثواني.',
    hourFormat: 'تنسيق عرض الساعة. يعرض \'12h\' صباحًا/مساءً (AM/PM)؛ ويستخدم \'24h\' تنسيق 24 ساعة.',
    timeIncrement: 'خطوة الدقائق لمفاتيح الأسهم في حقل الوقت المكتوب الخاص بـ Solo. القيمة غير الافتراضية تُبقي حقل الوقت الخاص بـ Solo في أوضاع nativePicker لأن iOS يعامل الخطوة الأصلية كقاعدة تحقق لا كإيقاع لأداة الاختيار. تتجاهلها الورقة اللمسية في Solo التي تستخدم العجلات.',
    timeOptionInterval: 'إيقاع الدقائق لمربع التحرير والسرد للأوقات المعدّة مسبقًا في حقل الوقت الخاص بـ Solo للمؤشرات الدقيقة. تعيينها يُبقي حقل الوقت الخاص بـ Solo حتى في أوضاع nativePicker لأن أداة اختيار نظام التشغيل لا تملك قائمة أوقات معدّة مكافئة. تستخدم الورقة اللمسية في Solo العجلات.',
    hasClear: 'يعرض زر مسح عند تعيين قيمة للتاريخ والوقت.',
    placeholder: 'نص إرشادي يُعرض في جزء التاريخ عند عدم اختيار أي تاريخ.',
    timePlaceholder: 'نص إرشادي يُعرض في جزء الوقت عند عدم اختيار أي وقت. على الأجهزة اللمسية، يظهر في مقطع الوقت المغلق قبل اختيار الوقت.',
    timeLabel: 'الاسم القابل للوصول لجزء الوقت. القيمة الافتراضية "{label} time" بحيث يرتبط بتسمية الحقل ويكون قابلًا للترجمة.',
    size: 'حجم عنصر التحكم في الإدخال.',
    status: 'كائن مؤشر الحالة لحالات الخطأ أو التحذير أو النجاح مع رسالة.',
    labelTooltip: 'نص تلميح يُعرض عبر أيقونة معلومات في نهاية التسمية.',
    numberOfMonths: 'عدد الأشهر المعروضة في آنٍ واحد في نافذة التقويم المنبثقة الخاصة بـ Solo للمؤشرات. تتجاهله عناصر التحكم الأصلية للتاريخ والورقة اللمسية على الأجهزة المحمولة، التي تعرض لوحة التاريخ فيها شهرًا واحدًا في كل مرة مع التنقّل بالسحب.',
    weekStartsOn: 'أول أيام الأسبوع في تقويمات Solo. رقم (0 = الأحد حتى 6 = السبت) أو اسم يوم من ثلاثة أحرف. تتجاهله عناصر التحكم الأصلية للتاريخ.',
    presentation: 'الأسطح التي ترسم أدوات اختيار التاريخ والوقت. يستخدم \'adaptive-native\' (الافتراضي) الحقول المكتوبة والنوافذ المنبثقة الخاصة بـ Solo مع المؤشر الدقيق، وعناصر تحكم المتصفح/نظام التشغيل مع المؤشر الخشن — مع بدائل Solo لكل مقطع: تُبقي hasSeconds أو timeIncrement غير الافتراضي أو timeOptionInterval حقلَ الوقت الخاص بـ Solo لأن iOS لا يستطيع تمثيلها بدقة؛ ويستخدم \'native\' دائمًا عنصري تحكم المتصفح/نظام التشغيل كليهما دون بدائل؛ ويستخدم \'adaptive-bottom-sheet\' النوافذ المنبثقة مع المؤشر الدقيق والورقة السفلية المنسّقة الخاصة بـ Solo مع المؤشر الخشن؛ ويفرض \'popover\' و\'bottom-sheet\' سطح Solo المعني على كل أنواع المؤشرات. كل قيمة تفتح أدوات الاختيار؛ أما الحقول المكتوبة فقط فتخص TimeInput وحده. استخدم عرضًا غير أصلي عندما يكون سلوك numberOfMonths أو weekStartsOn أو dateConstraints المرئي مهمًا. تُطبَّق القيود عند الاعتماد؛ وتُمرَّر min/max كتلميحات. يُنسّق hourFormat الوقت المغلق، بينما تتبع أداة اختيار نظام التشغيل إعدادات لغة المستخدم.',
    nativePicker: 'مُهمَل: استخدم presentation (\'touch\' = \'adaptive-native\'، و\'always\' = \'native\'، و\'never\' = \'adaptive-bottom-sheet\'). لا يزال يعمل تمامًا كما أُصدر؛ وتكون الأولوية لـ presentation عند تعيين كليهما.',
    width: 'عرض الحقل (الرقم = بكسلات، والسلسلة النصية تُستخدم كما هي، مثل "100%"). يحدّد حجم الحقل بأكمله (التسمية وعنصر التحكم والحالة) لتبقى متحاذية.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز أي أداة متعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'يجمع DateTimeInput اختيار التاريخ والوقت في حقل واحد. مع presentation="adaptive-native" (الافتراضي)، تستخدم أجهزة الفأرة ولوحة اللمس الحقولَ المكتوبة والنوافذ المنبثقة الخاصة بـ Solo، بينما تستخدم أجهزة المؤشر الخشن عناصر تحكم التاريخ والوقت الخاصة بالمتصفح/نظام التشغيل داخل الحقل ذي المقطعين نفسه. يستخدم presentation="native" عنصري التحكم الأصليين على كل أنواع المؤشرات؛ ويُبقي presentation="adaptive-bottom-sheet" أسطح Solo الخاصة — حقول المؤشر مع المؤشرات الدقيقة والورقة السفلية المنسّقة للتاريخ/الوقت مع المؤشرات الخشنة؛ ويفرض "popover" و"bottom-sheet" سطحًا واحدًا من Solo على كل أنواع المؤشرات. تبقى المقاطع المغلقة متجاورة عند توفر 400px على الأقل، وتلتف إلى صفوف بعرض كامل دون 400px، بصرف النظر عن عرض نافذة العرض. استخدمه للجدولة وإنشاء الأحداث وتحديد المواعيد النهائية أو أي حقل نموذج يحتاج إلى تاريخ ووقت محددين.',
    bestPractices: [
      {
        guidance: true,
        description: 'قدّم تسميات وأوصافًا واضحة ليفهم المستخدمون التاريخ والوقت المتوقَّعين.',
      },
      {
        guidance: true,
        description: 'استخدم min وmax لقصر التواريخ والأوقات القابلة للاختيار على النطاقات الصالحة.',
      },
      {
        guidance: true,
        description: 'استخدم hasClear عندما يكون التاريخ والوقت اختياريين ليتمكن المستخدم من إعادة تعيينهما.',
      },
      {
        guidance: true,
        description: 'اختر تنسيق الساعة (12h أو 24h) الذي يطابق إعدادات اللغة والمنطقة لجمهورك.',
      },
      {
        guidance: false,
        description: 'استخدام DateTimeInput عندما يلزم التاريخ فقط؛ استخدم DateInput بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'استخدام DateTimeInput عندما يلزم الوقت فقط؛ استخدم TimeInput بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'إخفاء التسمية دون سياق محيط يجعل الغرض من الحقل واضحًا.',
      },
      {
        guidance: false,
        description: 'تغليف DateTimeInput معطَّل داخل Tooltip لشرح سبب تعطيله؛ إذ تبتلع المشغّلات المعطَّلة أحداث التمرير التي يحتاجها المغلِّف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'التسمية',
        required: true,
        description: 'نص أعلى حقل الإدخال يصف التاريخ والوقت المتوقَّعين.',
      },
      {
        name: 'حقل إدخال التاريخ',
        required: true,
        description: 'حقل تاريخ مكتوب مع نافذة تقويم منبثقة على سطح Solo للمؤشر الدقيق، أو حقل input type=date حقيقي في الأوضاع الأصلية، أو مقطع للقراءة فقط يفتح الورقة اللمسية الخاصة بـ Solo ضمن presentation="adaptive-bottom-sheet" مع المؤشر الخشن.',
      },
      {
        name: 'أيقونة التقويم',
        required: true,
        description: 'زر يفتح سطح التاريخ النشط: أداة اختيار المنصة، أو نافذة التقويم المنبثقة الخاصة بـ Solo، أو الورقة اللمسية الخاصة بـ Solo.',
      },
      {
        name: 'أداة اختيار التاريخ',
        required: false,
        description: 'أداة اختيار المتصفح/نظام التشغيل في الأوضاع الأصلية، أو نافذة منبثقة بشبكة شهرية من Solo مع المؤشر الدقيق، أو لوحة التاريخ في الورقة السفلية الخاصة بـ Solo مع المؤشر الخشن عند presentation="adaptive-bottom-sheet".',
      },
      {
        name: 'حقل إدخال الوقت',
        required: true,
        description: 'حقل input type=time حقيقي للوضع الأصلي الافتراضي بدقة الدقائق، أو حقل وقت نصي/مربع تحرير وسرد عند طلب الثواني أو الخطوات المخصّصة أو الخيارات المعدّة مسبقًا، أو مقطع للقراءة فقط يفتح عجلات وقت قابلة للوصول ضمن presentation="adaptive-bottom-sheet" مع المؤشر الخشن.',
      },
      {
        name: 'نافذة خيارات الوقت المنبثقة',
        required: false,
        description: 'قائمة بأوقات معدّة مسبقًا بإيقاع timeOptionInterval. تعيين هذه الخاصية يُبقي حقل الوقت النصي/مربع التحرير والسرد الخاص بـ Solo حتى عندما يختار nativePicker عناصر التحكم الأصلية؛ أما الورقة اللمسية الخاصة بـ Solo فتستخدم العجلات بدلًا من ذلك.',
      },
      {
        name: 'زر المسح',
        required: false,
        description: 'زر × يعيد تعيين قيمة التاريخ والوقت.',
      },
      {
        name: 'رسالة الحالة',
        required: false,
        description: 'رسالة خطأ أو تحذير أو نجاح أسفل حقول الإدخال.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'combined date + time picker with calendar popover and time input',
  usage: {
    description:
      'DateTimeInput combines date and time selection. presentation="adaptive-native" (default) uses browser/OS date+time controls on coarse pointers and Solo pointer fields on fine pointers; "native" uses both native controls everywhere; "adaptive-bottom-sheet" uses Solo\'s coordinated bottom sheet on coarse pointers and pointer fields on fine pointers; "popover"/"bottom-sheet" force one Solo surface everywhere. Closed segments stay side by side when at least 400px is available and wrap below 400px.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide clear labels + descriptions so users understand what datetime is expected.',
      },
      {
        guidance: true,
        description:
          'Use min and max to restrict selectable datetimes to valid ranges.',
      },
      {
        guidance: true,
        description:
          'Use hasClear when the datetime is optional so the user can reset it.',
      },
      {
        guidance: true,
        description:
          "Choose the hour format (12h or 24h) that matches your audience's locale.",
      },
      {
        guidance: false,
        description:
          'Use DateTimeInput when only a date is needed; use DateInput instead.',
      },
      {
        guidance: false,
        description:
          'Use DateTimeInput when only a time is needed; use TimeInput instead.',
      },
      {
        guidance: false,
        description:
          'Hide the label without surrounding context that makes the field purpose obvious.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled DateTimeInput in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    label: 'label text',
    isLabelHidden: 'visually hide label',
    description: 'helper text below label',
    isOptional: 'show "(optional)" indicator',
    isRequired: 'mark field required',
    isDisabled: 'disable input+picker',
    disabledMessage:
      'reason shown in a tooltip on hover/focus when disabled; keeps fields focusable via aria-disabled',
    value: 'selected datetime ISO 8601',
    onChange: 'callback on datetime change',
    changeAction: 'async action after onChange; drives optimistic UI',
    isLoading: 'loading state; disables interaction, shows spinner',
    min: 'min selectable datetime (ISO)',
    max: 'max selectable datetime (ISO)',
    dateConstraints: 'custom constraint fns to disable specific dates',
    hasSeconds:
      'include seconds; retains Solo time field because iOS native picker has no seconds wheel',
    hourFormat: "display format. '12h' shows AM/PM; '24h' uses 24-hour",
    timeIncrement:
      'minute step for Solo typed field; non-default retains Solo time field in native modes because iOS native step is validation-only',
    timeOptionInterval:
      'preset-time combobox cadence; setting it retains Solo time field because native pickers have no equivalent list',
    hasClear: 'Shows clear button when datetime is set',
    placeholder: 'date-portion placeholder when empty',
    timePlaceholder:
      'time-portion placeholder when empty; shown on touch closed time segment',
    timeLabel:
      'accessible label for the time input; defaults to "{label} time"',
    size: 'input control size',
    status: 'error/warning/success status w/ message',
    labelTooltip: 'tooltip text via info icon at label end',
    numberOfMonths:
      'Solo pointer-calendar months shown simultaneously; ignored by native date controls and the mobile touch sheet',
    weekStartsOn:
      'first day of week in Solo calendars (0=Sunday, or name e.g. "mon"); ignored by native date controls',
    presentation:
      "date+time surfaces: 'adaptive-native' (default) = Solo popovers fine / browser/OS coarse w/ per-segment fallbacks (seconds/timeIncrement/timeOptionInterval); 'native' = browser/OS always, no fallback; 'adaptive-bottom-sheet' = popovers fine / coordinated sheet coarse; 'popover'/'bottom-sheet' force Solo. every value opens pickers (no typed-only value; that is TimeInput's).",
    nativePicker:
      "deprecated, use presentation: 'touch'='adaptive-native', 'always'='native', 'never'='adaptive-bottom-sheet'. still works as released; presentation wins if both set.",
    className: 'Tailwind classes for layout; merged via cn(), so conflicting utilities override defaults',
  },
};
