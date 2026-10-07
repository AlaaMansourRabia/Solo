/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'PowerSearch',
  displayName: 'Power Search',
  category: 'Form Controls',
  keywords: [
    'powersearch',
    'search',
    'searchbar',
    'filter',
    'filterbar',
    'faceted',
    'querybuilder',
    'structured',
    'omnibar',
  ],
  props: [
    {
      name: 'config',
      type: 'PowerSearchConfig',
      description:
        'Configuration defining available fields, operators, and their value types.',
      required: true,
    },
    {
      name: 'filters',
      type: 'ReadonlyArray<PowerSearchFilter>',
      description: 'Currently active filters.',
      required: true,
    },
    {
      name: 'onChange',
      type: "(filters: ReadonlyArray<PowerSearchFilter>, changeType: 'add' | 'edit' | 'remove', index: number) => void",
      description:
        "Called when filters change. changeType is 'add', 'edit', or 'remove'. index is the affected filter's position.",
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the search input.',
      default: "'Search'",
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hides the label while keeping it accessible.',
      default: 'true',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when no filters are selected.',
      default: "'Search...'",
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Auto-focus the input on mount.',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Show a clear-all button for removing all filters.',
      default: 'true',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description: 'Prevent adding, editing, or removing filters.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the entire component.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the search is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the input focusable via aria-disabled (input stays blocked). Use this instead of wrapping a disabled PowerSearch in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: 'Validation status object with type and optional message.',
    },
    {
      name: 'startIcon',
      type: 'ReactNode | IconType',
      description:
        'Icon to display at the start of the input, before any filter tokens. Forwarded to the internal Tokenizer. Accepts a semantic icon name, an SVG icon component, or a ReactNode directly.',
      slotElements: [{__element: 'Icon', props: {icon: 'search', size: 'sm'}}],
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing; tooltip renders no message box and surfaces the status through a tooltip on the on-field icon, for compact toolbar controls.',
      default: "'attached'",
    },
    {
      name: 'maxTokenLength',
      type: 'number',
      description: 'Max character length for filter value display in tokens.',
      default: '40',
    },
    {
      name: 'maxOperatorMenuItems',
      type: 'number',
      description:
        'Maximum suggestions shown in string and entity value typeaheads. Does not affect the main field search menu or enum value menus.',
      default: '10',
    },
    {
      name: 'maxSearchResults',
      type: 'number',
      description:
        'Max ranked results for a non-empty query. Does not affect a field value editor. Browsing with an empty query shows up to 1,000 fields.',
      default: '10',
    },
    {
      name: 'menuWidth',
      type: 'number',
      description:
        'Width in pixels for the main field/search menu. Does not affect field value editors.',
    },
    {
      name: 'popoverSaveButtonLabel',
      type: 'string',
      description: 'Label for the save button in the edit popover.',
      default: "'Apply'",
    },
    {
      name: 'timezoneID',
      type: 'string',
      description: 'Timezone ID for date formatting (e.g. "America/New_York").',
    },
    {
      name: 'handleRef',
      type: 'Ref<PowerSearchHandle>',
      description:
        'Imperative handle with focusTypeahead() and blurTypeahead() methods.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content to display at the end of the input row. Useful for action buttons or other controls.',
      slotElements: [
        {__element: 'Icon', props: {icon: 'chevronDown', size: 'sm'}},
        {__element: 'Badge', props: {label: '3'}},
      ],
    },
    {
      name: 'resultCount',
      type: 'number | string',
      description:
        'Number of results matching the current filters. When a number, formatted as "N results". When a string, displayed as-is. Changes are announced to screen readers via a polite live region.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size of the search input and tokens.',
      default: "'md'",
    },
    {
      name: 'components',
      type: 'PowerSearchComponents',
      description:
        "Per-type component overrides for token and editor rendering. Keys are operator value types (e.g. 'string', 'enum', 'date_absolute').",
    },
    {
      name: 'tokenOverflowBehavior',
      type: "'none' | 'unfocusedInline' | 'unfocusedLayer'",
      description: 'Controls how tokens overflow when the container is too narrow. Forwarded to Tokenizer.',
      default: "'none'",
    },
    {
      name: 'onFocus',
      type: '(e: React.FocusEvent) => void',
      description: 'Fires when focus enters the search input.',
    },
    {
      name: 'onBlur',
      type: '(e: React.FocusEvent) => void',
      description: 'Fires when focus leaves the search input.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  // `config` and `filters` are custom values the docsite preview cannot
  // generate automatically. Keep this small, but include an initial token so
  // the Properties tab demonstrates a realistic controlled PowerSearch.
  playground: {
    defaults: {
      config: {
        name: 'IssueSearch',
        fields: [
          {
            key: 'status',
            label: 'Status',
            defaultOperator: 'is',
            operators: [
              {
                key: 'is',
                label: 'is',
                value: {
                  type: 'enum',
                  values: [
                    {value: 'open', label: 'Open'},
                    {value: 'closed', label: 'Closed'},
                  ],
                },
              },
            ],
          },
          {
            key: 'title',
            label: 'Title',
            defaultOperator: 'contains',
            operators: [
              {key: 'contains', label: 'contains', value: {type: 'string'}},
            ],
          },
        ],
      },
      filters: [
        {
          field: 'status',
          operator: 'is',
          value: {type: 'enum', value: 'open'},
        },
      ],
    },
  },
  usage: {
    description:
      'PowerSearch is a structured filter bar where each token represents a field, operator, and value. Use it for complex multi-dimensional filtering when users need to combine multiple search criteria. For simple single-field search, use a text input instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Define clear, descriptive field names and aliases so users can quickly find the filter they need.',
      },
      {
        guidance: true,
        description:
          'Provide a result count to give users feedback on how their filters affect the data set.',
      },
      {
        guidance: false,
        description:
          'Use PowerSearch for simple keyword searches; a standard text input is more appropriate for single-field lookups.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled PowerSearch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  theming: {
    targets: [{className: 'solo-power-search'}],
  },
};

// -------------------------------------------------------
// Auto-generated translations below. Do not edit manually.
// Regenerate with the dense compression protocol.
// See .context/decisions/dense-compression-protocol.md
// -------------------------------------------------------

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'PowerSearch',
  displayName: 'Power Search',
  props: [
    {
      name: 'config',
      type: 'PowerSearchConfig',
      description: '定义可用字段、运算符及其值类型的配置。',
      required: true,
    },
    {
      name: 'filters',
      type: 'ReadonlyArray<PowerSearchFilter>',
      description: '当前活跃的过滤器。',
      required: true,
    },
    {
      name: 'onChange',
      type: "(filters: ReadonlyArray<PowerSearchFilter>, changeType: 'add' | 'edit' | 'remove', index: number) => void",
      description:
        "当过滤器变更时调用。changeType 为 'add'、'edit' 或 'remove'。index 为受影响的过滤器位置。",
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: '搜索输入框的无障碍标签。',
      default: "'Search'",
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: '视觉上隐藏标签，同时保持无障碍性。',
      default: 'true',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: '未选择过滤器时显示的占位文本。',
      default: "'Search...'",
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: '挂载时自动聚焦输入框。',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: '显示清除全部按钮以移除所有过滤器。',
      default: 'true',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description: '阻止添加、编辑或移除过滤器。',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: '禁用整个组件。',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the search is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the input focusable via aria-disabled (input stays blocked). Use this instead of wrapping a disabled PowerSearch in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: '带有类型和可选消息的验证状态对象。',
    },
    {
      name: 'startIcon',
      type: 'ReactNode | IconType',
      description:
        '在输入框开头（筛选 token 之前）显示的图标，转发给内部的 Tokenizer。接受语义图标名称、SVG 图标组件或直接传入 ReactNode。',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        '状态消息相对于输入框的放置方式。attached 直接叠加在输入框下方（带边框处理）；detached 作为独立元素浮于下方并留有间距；tooltip 不渲染消息框，而是通过输入框内状态图标的提示显示状态，适用于紧凑的工具栏控件。',
      default: "'attached'",
    },
    {
      name: 'maxTokenLength',
      type: 'number',
      description: '令牌中过滤器值显示的最大字符长度。',
      default: '40',
    },
    {
      name: 'maxOperatorMenuItems',
      type: 'number',
      description:
        '字符串和实体值预输入菜单中显示的最大建议数。不影响主字段搜索菜单或枚举值菜单。',
      default: '10',
    },
    {
      name: 'maxSearchResults',
      type: 'number',
      description:
        '非空查询的最大排名结果数。不影响字段值编辑器。使用空查询浏览时最多显示 1,000 个字段。',
      default: '10',
    },
    {
      name: 'menuWidth',
      type: 'number',
      description: '主字段/搜索菜单的像素宽度。不影响字段值编辑器。',
    },
    {
      name: 'popoverSaveButtonLabel',
      type: 'string',
      description: '编辑弹出窗口中保存按钮的标签。',
      default: "'Apply'",
    },
    {
      name: 'timezoneID',
      type: 'string',
      description: '用于日期格式化的时区 ID（例如 "America/New_York"）。',
    },
    {
      name: 'handleRef',
      type: 'Ref<PowerSearchHandle>',
      description:
        '提供 focusTypeahead() 和 blurTypeahead() 方法的命令式句柄。',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: '显示在输入行末尾的内容。适用于操作按钮或其他控件。',
    },
    {
      name: 'resultCount',
      type: 'number | string',
      description:
        '匹配当前过滤器的结果数量。数字类型时格式化为"N results"。字符串类型时按原样显示。数量变化会通过 polite 实时区域向屏幕阅读器播报。',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: '搜索输入框和标记的尺寸。',
      default: "'md'",
    },
    {
      name: 'components',
      type: 'PowerSearchComponents',
      description:
        "按类型覆盖令牌和编辑器渲染所用的组件。键为运算符的值类型（如 'string'、'enum'、'date_absolute'）。",
    },
    {
      name: 'tokenOverflowBehavior',
      type: "'none' | 'unfocusedInline' | 'unfocusedLayer'",
      description: '控制容器过窄时令牌的溢出方式。转发给 Tokenizer。',
      default: "'none'",
    },
    {
      name: 'onFocus',
      type: '(e: React.FocusEvent) => void',
      description: '焦点进入搜索输入框时触发。',
    },
    {
      name: 'onBlur',
      type: '(e: React.FocusEvent) => void',
      description: '焦点离开搜索输入框时触发。',
    },
    {
      name: 'className',
      type: 'string',
      description: '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  usage: {
    description:
      'PowerSearch is a structured filter bar where each token represents a field, operator, and value. Use it for complex multi-dimensional filtering when users need to combine multiple search criteria. For simple single-field search, use a text input instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Define clear, descriptive field names and aliases so users can quickly find the filter they need.',
      },
      {
        guidance: true,
        description:
          'Provide a result count to give users feedback on how their filters affect the data set.',
      },
      {
        guidance: false,
        description:
          'Use PowerSearch for simple keyword searches; a standard text input is more appropriate for single-field lookups.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled PowerSearch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'شريط ترشيح منظّم يمثّل فيه كل رمز حقلًا وعاملًا وقيمة، للترشيح المعقد متعدد الأبعاد عندما يحتاج المستخدمون إلى الجمع بين عدة معايير بحث.',
  propDescriptions: {
    config: 'إعداد يحدد الحقول المتاحة والعوامل وأنواع قيمها.',
    filters: 'المرشحات النشطة حاليًا.',
    onChange: 'يُستدعى عند تغيّر المرشحات. قيمة changeType هي \'add\' أو \'edit\' أو \'remove\'. وتمثّل index موضع المرشح المتأثر.',
    label: 'تسمية قابلة للوصول لحقل إدخال البحث.',
    isLabelHidden: 'يُخفي التسمية بصريًا مع إبقائها قابلة للوصول.',
    placeholder: 'النص الإرشادي المعروض عند عدم تحديد أي مرشحات.',
    hasAutoFocus: 'يمنح حقل الإدخال التركيز تلقائيًا عند التركيب.',
    hasClear: 'يعرض زر مسح الكل لإزالة جميع المرشحات.',
    isReadOnly: 'يمنع إضافة المرشحات أو تعديلها أو إزالتها.',
    isDisabled: 'يعطّل المكوّن بأكمله.',
    disabledMessage: 'يوضح سبب تعطيل البحث. مع isDisabled، يعرض تلميحًا عند التمرير أو تركيز لوحة المفاتيح ويُبقي حقل الإدخال قابلًا للتركيز عبر aria-disabled (مع بقاء الإدخال محظورًا). استخدمه بدلًا من تغليف PowerSearch معطَّل داخل Tooltip. فعناصر التحكم المعطَّلة تبتلع أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    status: 'كائن حالة التحقق يتضمن النوع ورسالة اختيارية.',
    startIcon: 'أيقونة تُعرض في بداية حقل الإدخال، قبل أي رموز ترشيح. تُمرَّر إلى Tokenizer الداخلي. تقبل اسم أيقونة دلاليًا، أو مكوّن أيقونة SVG، أو ReactNode مباشرة.',
    statusVariant: 'كيفية وضع رسالة الحالة بالنسبة إلى حقل الإدخال. attached تتداخل مباشرة أسفل حقل الإدخال (معالجة بحدود)؛ و detached تطفو أسفله كعنصر منفصل مع تباعد؛ و tooltip لا تعرض مربع رسالة وتُظهر الحالة عبر تلميح على الأيقونة داخل الحقل، لعناصر التحكم المدمجة في أشرطة الأدوات.',
    maxTokenLength: 'الحد الأقصى لعدد الأحرف لعرض قيمة المرشح داخل الرموز.',
    maxOperatorMenuItems: 'الحد الأقصى للاقتراحات المعروضة في الإكمال التلقائي لقيم السلاسل النصية والكيانات. لا يؤثر في قائمة البحث الرئيسية عن الحقول ولا في قوائم قيم التعداد.',
    maxSearchResults: 'الحد الأقصى للنتائج المرتبة لاستعلام غير فارغ. لا يؤثر في محرر قيمة الحقل. يعرض التصفح باستعلام فارغ ما يصل إلى 1,000 حقل.',
    menuWidth: 'العرض بالبكسل للقائمة الرئيسية للحقول/البحث. لا يؤثر في محررات قيم الحقول.',
    popoverSaveButtonLabel: 'تسمية زر الحفظ في النافذة المنبثقة للتعديل.',
    timezoneID: 'معرّف المنطقة الزمنية لتنسيق التواريخ (مثل "America/New_York").',
    handleRef: 'مقبض أوامري يتضمن الدالتين focusTypeahead() و blurTypeahead().',
    endContent: 'محتوى يُعرض في نهاية صف حقل الإدخال. مفيد لأزرار الإجراءات أو عناصر التحكم الأخرى.',
    resultCount: 'عدد النتائج المطابقة للمرشحات الحالية. عندما يكون رقمًا، يُنسَّق بصيغة "N results". وعندما يكون سلسلة نصية، يُعرض كما هو. تُعلَن التغييرات لقارئ الشاشة عبر منطقة حية مهذبة.',
    size: 'حجم حقل إدخال البحث والرموز.',
    components: 'تجاوزات للمكوّنات حسب النوع لعرض الرموز والمحررات. المفاتيح هي أنواع قيم العوامل (مثل \'string\' و \'enum\' و \'date_absolute\').',
    tokenOverflowBehavior: 'يتحكم في كيفية فيض الرموز عندما تكون الحاوية ضيقة جدًا. يُمرَّر إلى Tokenizer.',
    onFocus: 'يُنفَّذ عند دخول التركيز إلى حقل إدخال البحث.',
    onBlur: 'يُنفَّذ عند مغادرة التركيز حقل إدخال البحث.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث يتجاوز أي صنف متعارض القيمة الافتراضية.',
  },
  usage: {
    description: 'PowerSearch شريط ترشيح منظّم يمثّل فيه كل رمز حقلًا وعاملًا وقيمة. استخدمه للترشيح المعقد متعدد الأبعاد عندما يحتاج المستخدمون إلى الجمع بين عدة معايير بحث. أما للبحث البسيط في حقل واحد، فاستخدم حقل إدخال نصي بدلًا منه.',
    bestPractices: [
      {
        guidance: true,
        description: 'عرّف أسماء حقول وأسماء بديلة واضحة ووصفية حتى يتمكن المستخدمون من العثور بسرعة على المرشح الذي يحتاجونه.',
      },
      {
        guidance: true,
        description: 'وفّر عدد النتائج لإعطاء المستخدمين ملاحظات حول تأثير مرشحاتهم في مجموعة البيانات.',
      },
      {
        guidance: false,
        description: 'استخدام PowerSearch لعمليات البحث البسيطة بالكلمات المفتاحية؛ فحقل الإدخال النصي القياسي أنسب لعمليات البحث في حقل واحد.',
      },
      {
        guidance: false,
        description: 'تغليف PowerSearch معطَّل داخل Tooltip لتوضيح سبب تعطيله؛ فعناصر التحكم المعطَّلة تبتلع أحداث التمرير التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Structured filter bar where each token represents filter (field+operator+value). Users select fields from typeahead dropdown, configure operators+values in edit popover, manage filters as removable tokens.',
  usage: {
    description:
      'PowerSearch is a structured filter bar where each token represents a field, operator, and value. Use it for complex multi-dimensional filtering when users need to combine multiple search criteria. For simple single-field search, use a text input instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Define clear, descriptive field names and aliases so users can quickly find the filter they need.',
      },
      {
        guidance: true,
        description:
          'Provide a result count to give users feedback on how their filters affect the data set.',
      },
      {
        guidance: false,
        description:
          'Use PowerSearch for simple keyword searches; a standard text input is more appropriate for single-field lookups.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled PowerSearch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    config: 'Configuration defining available fields, operators, value types.',
    filters: 'Currently active filters.',
    onChange:
      "Called on filter change. changeType is 'add', 'edit', or 'remove'. index is affected filter position.",
    label: 'Accessible label for search input.',
    isLabelHidden: 'Visually hides label while keeping accessible.',
    placeholder: 'Text shown when no filters selected.',
    hasAutoFocus: 'Auto-focus input on mount.',
    hasClear: 'Show clear-all button for removing all filters.',
    isReadOnly: 'Prevent adding, editing, or removing filters.',
    isDisabled: 'Disables entire component.',
    status: 'Validation status object w/ type + optional message.',
    startIcon:
      'Icon at input start, before filter tokens. Forwarded to internal Tokenizer.',
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing.',
    maxTokenLength: 'Max char length for filter value display in tokens.',
    maxOperatorMenuItems:
      'Max suggestions in string/entity value typeaheads; excludes main field search + enum menus.',
    maxSearchResults:
      'Max ranked results for a non-empty query; excludes value editors.',
    menuWidth: 'Main field/search menu width in pixels.',
    popoverSaveButtonLabel: 'Label for save button in edit popover.',
    timezoneID: 'Timezone ID for date formatting (e.g. "America/New_York").',
    handleRef:
      'Imperative handle w/ focusTypeahead() + blurTypeahead() methods.',
    endContent:
      'Content at end of input row. Useful for action buttons or controls.',
    resultCount:
      'Result count matching current filters. Number formatted as "N results"; string displayed as-is.',
    size: 'Search input+token size.',
    components: "per-value-type token/editor component overrides (keys: 'string', 'enum', 'date_absolute', ...)",
    className:
      'Tailwind classes for layout customization; merged via cn(), so conflicting utilities override defaults.',
  },
};
