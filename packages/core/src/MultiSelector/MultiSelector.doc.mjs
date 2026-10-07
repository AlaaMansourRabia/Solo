/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Field',
    required: false,
    description:
      'Standalone Field shell that provides the label and optional supporting content; omitted inside InputGroup.',
  },
  {
    name: 'Trigger',
    required: true,
    description:
      'Painted control that displays the current selection or placeholder and opens the selection surface when editable.',
  },
  {
    name: 'Icon-rendered start icon',
    required: false,
    description:
      'Optional leading semantic icon or icon component rendered through Icon.',
  },
  {
    name: 'Caller-rendered start content',
    required: false,
    description:
      'Optional arbitrary React content rendered directly at the start of the trigger.',
  },
  {
    name: 'Trigger clear button',
    required: false,
    description:
      'Shared clear action that removes every selected value when hasClear is enabled.',
  },
  {
    name: 'Status icon',
    required: false,
    description:
      'Status glyph shown in place of the disclosure indicator for attached or tooltip status.',
  },
  {
    name: 'Indicator icon',
    required: false,
    description:
      'Trailing chevron shown when status presentation does not replace it; reflects collapsed or expanded state.',
  },
  {
    name: 'Search row',
    required: false,
    description:
      'Panel header with a borderless search input and optional clear action.',
  },
  {
    name: 'Search icon',
    required: false,
    description:
      'Leading magnifier rendered through Icon inside the search row.',
  },
  {
    name: 'Search clear button',
    required: false,
    description:
      'Shared clear action shown in the search row while a query is present.',
  },
  {
    name: 'Option row',
    required: false,
    description:
      'Selectable row for an option or the optional select-all choice.',
  },
  {
    name: 'Option checkbox indicator',
    required: false,
    description:
      'CheckboxInput indicator that presents each row’s selected, unselected, or indeterminate state.',
  },
  {
    name: 'Option divider',
    required: false,
    description:
      'Divider supplied in the public options data to separate adjacent option groups.',
  },
  {
    name: 'Section heading',
    required: false,
    description: 'Visible heading for a labeled group of option rows.',
  },
  {
    name: 'Empty state',
    required: false,
    description:
      'Message shown when the shared panel content has no options or no search matches.',
  },
  {
    name: 'Pointer popup',
    required: false,
    description:
      'Anchored painted surface that hosts the shared panel content for popover presentation.',
  },
  {
    name: 'Touch sheet heading',
    required: false,
    description:
      'Heading above the shared panel content in bottom-sheet presentation.',
  },
  {
    name: 'Touch sheet',
    required: false,
    description:
      'BottomSheet surface that hosts the same panel content for bottom-sheet presentation.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'MultiSelector',
  displayName: 'Multi Selector',
  group: 'Selector',
  category: 'Form Controls',
  keywords: [
    'multiselect',
    'checkbox',
    'dropdown',
    'multi',
    'picker',
    'checklist',
    'facet',
    'filter',
    'select',
  ],
  playground: {
    defaults: {
      label: 'Fruit',
      options: [
        {value: 'apple', label: 'Apple'},
        {value: 'orange', label: 'Orange'},
        {value: 'banana', label: 'Banana'},
      ],
      value: [],
    },
  },
  theming: {
    targets: [
      {
        className: 'solo-multi-selector',
        visualProps: ['variant', 'size', 'status'],
        states: ['disabled', 'readonly'],
      },
      {
        className: 'solo-multi-selector-clear-icon',
        deprecatedFor: 'input-clear-icon',
      },
      {className: 'solo-multi-selector-empty-state'},
      {className: 'solo-multi-selector-search'},
      {className: 'solo-multi-selector-section-heading'},
      {
        className: 'solo-multi-selector-indicator-icon',
        states: ['state'],
      },
      {
        className: 'solo-multi-selector-option',
        visualProps: ['size'],
        states: ['select-all', 'selected', 'disabled'],
      },
      {className: 'solo-multi-selector-popup'},
    ],
  },
  components: [
    {
      name: 'MultiSelector',
      displayName: 'Multi Selector',
      description:
        'Multi-select dropdown with checkboxes for choosing multiple items.',
      props: [
        {
          name: 'label',
          type: 'string',
          description: 'Label text for accessibility.',
          required: true,
        },
        {
          name: 'options',
          type: 'MultiSelectorOptionType[]',
          description:
            'Array of items: strings, objects with value/label/icon/disabled, dividers, or sections.',
          required: true,
        },
        {
          name: 'value',
          type: 'string[]',
          description: 'Currently selected values.',
          required: true,
        },
        {
          name: 'onChange',
          type: '(value: string[]) => void',
          description: 'Callback fired when the selection changes.',
          required: true,
        },
        {
          name: 'changeAction',
          type: '(value: string[]) => void | Promise<void>',
          description: 'Async action on change. Fires after onChange.',
        },
        {
          name: 'placeholder',
          type: 'string',
          description: 'Placeholder text shown when no value is selected.',
          default: "'Select...'",
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          description: 'Size variant for the selector.',
          default: "'md'",
        },
        {
          name: 'variant',
          type: "'input' | 'ghost'",
          description:
            'Visual trigger style. input is the bordered input treatment for forms; ghost is borderless and matches ghost buttons for toolbar usage.',
          default: "'input'",
        },
        {
          name: 'triggerDisplay',
          type: "'count' | 'labels' | 'badges'",
          description: 'How to display selected items in the trigger.',
          default: "'count'",
        },
        {
          name: 'formatValue',
          type: '(items: {value: string; label: string}[]) => string',
          description:
            'Formats the trigger text when triggerDisplay="count" or "labels". Receives the selected items (value plus resolved label); the count is items.length. Not used by triggerDisplay="badges".',
        },
        {
          name: 'maxBadges',
          type: 'number',
          description:
            'Maximum badges to show before "+N". Only for triggerDisplay="badges".',
          default: '3',
        },
        {
          name: 'hasSelectAll',
          type: 'boolean',
          description: 'Whether to show a select-all checkbox.',
        },
        {
          name: 'selectAllLabel',
          type: 'string',
          description: 'Label for the select-all checkbox.',
          default: "'Select all'",
        },
        {
          name: 'hasSearch',
          type: 'boolean',
          description:
            'Whether to show a search input for filtering options. As the user types, the match count (or "No results found") is announced to screen readers via a polite live region. The search field has built-in affordances: a leading magnifier icon and, once a query is typed, a trailing clear (✕) button that resets the query and returns focus to the input.',
        },
        {
          name: 'searchPlaceholder',
          type: 'string',
          description: 'Placeholder text for the search input.',
          default: "'Search...'",
        },
        {
          name: 'emptyText',
          type: 'ReactNode',
          description:
            'Content shown in the dropdown panel when there are no options to show, and announced in a polite live region when the panel opens. The announcement is the text this content renders, read from the DOM, so an element is announced as written and aria-hidden parts are left out of both. Not shown while isLoading.',
          default: "'No options'",
        },
        {
          name: 'emptySearchText',
          type: 'ReactNode',
          description:
            'Content shown in the dropdown panel when a search query matches no options, and announced in a polite live region at the same time. The announcement is the text this content renders, read from the DOM, so an element is announced as written and aria-hidden parts are left out of both.',
          default: "'No results found'",
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description: 'Disables the selector.',
        },
        {
          name: 'isReadOnly',
          type: 'boolean',
          description:
            'Makes the selector read-only: the selected values stay visible, focusable, and included in form submission, and retain their combobox identity with aria-readonly. The selection surface, clear action, and disclosure indicator are removed. Unlike isDisabled, the control is not dimmed. isDisabled takes precedence when both are set.',
          default: 'false',
        },
        {
          name: 'htmlName',
          type: 'string',
          description:
            'The HTML name attribute for form submissions. Renders one hidden input per selected value, like a native multi-select.',
        },
        {
          name: 'disabledMessage',
          type: 'string',
          description:
            'Explains why the selector is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the trigger focusable via aria-disabled (activation stays blocked). Use this instead of wrapping a disabled MultiSelector in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
        },
        {
          name: 'isLabelHidden',
          type: 'boolean',
          description: 'Visually hides the label while keeping it accessible.',
        },
        {
          name: 'description',
          type: 'string',
          description: 'Helper text displayed below the label.',
        },
        {
          name: 'labelTooltip',
          type: 'string',
          description:
            'Tooltip text shown in an info icon at the end of the label.',
        },
        {
          name: 'isOptional',
          type: 'boolean',
          description: 'Marks the field as optional.',
        },
        {
          name: 'isRequired',
          type: 'boolean',
          description: 'Marks the field as required.',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          description: 'Shows a loading spinner in the trigger.',
        },
        {
          name: 'status',
          type: "{type: 'error' | 'warning' | 'success', message?: string}",
          description: 'Validation status with an optional message.',
        },
        {
          name: 'statusVariant',
          type: "'attached' | 'detached' | 'tooltip'",
          description:
            'How the status message is placed relative to the input. attached overlaps directly below the bordered input and is only valid for the input variant; ghost selectors detach attached status messages by default. Use tooltip for compact toolbar controls.',
          default:
            "'attached' for input selectors; 'detached' for ghost selectors",
        },
        {
          name: 'renderOption',
          type: '(option: MultiSelectorOptionData) => ReactNode',
          description:
            'Custom render function for each selectable option in the dropdown. Not called for dividers, sections, or the select-all row.',
        },
        {
          name: 'indicatorPosition',
          type: "'start' | 'end'",
          description:
            'Which edge of the option row carries the checkbox. end pushes it to the far edge of the row, including on the select-all row.',
          default: "'start'",
        },
        {
          name: 'presentation',
          type: "'popover' | 'bottom-sheet' | 'adaptive'",
          description:
            'How the option list is presented. adaptive uses a bottom sheet on compact touch screens and an anchored popover otherwise.',
          default: "'popover'",
        },
        {
          name: 'width',
          type: 'SizeValue',
          description:
            'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
        },
        {
          name: 'startIcon',
          type: 'IconType | ReactNode',
          description: 'Icon displayed at the start of the selector trigger.',
        },
        {
          name: 'hasClear',
          type: 'boolean',
          description: 'Shows a clear button when values are selected.',
          default: 'false',
        },
        {
          name: 'isDefaultOpen',
          type: 'boolean',
          description: 'Whether the dropdown starts open on mount.',
          default: 'false',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
        },
      ],
    },
  ],
  usage: {
    anatomy,
    description:
      'A checkbox dropdown for selecting multiple values from a list. Selected items can display as a count, labels, or badges. Use it for filtering or when presenting a finite set of options where multiple choices are needed.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for a moderate, finite set of options where multiple choices are needed.',
      },
      {
        guidance: true,
        description:
          'Enable search filtering when the list exceeds ~15 options.',
      },
      {
        guidance: true,
        description:
          'Use renderOption for custom option rows; the checkbox affordance remains owned by MultiSelector.',
      },
      {
        guidance: true,
        description:
          'Enable select-all when most users will want all or nearly all options selected.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup only when the control needs a short prefix or suffix addon as part of one decorated input surface; prefer count or labels trigger display so the group stays single-line.',
      },
      {
        guidance: true,
        description:
          'Use variant="ghost" when a multi-selector sits in a toolbar with ghost buttons. If validation status is needed there, prefer statusVariant="tooltip" so the toolbar height stays compact.',
      },
      {
        guidance: true,
        description:
          'Use presentation="adaptive" when the multi-selector should become a bottom sheet on compact touch screens.',
      },
      {
        guidance: false,
        description: 'Use for single-value selection; use Selector instead.',
      },
      {
        guidance: false,
        description: 'Show more than ~20 options without enabling search.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled MultiSelector in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  components: [
    {
      name: 'MultiSelector',
      displayName: 'Multi Selector',
      description: '带复选框的多选下拉框，用于从列表中选择多项。',
      propDescriptions: {
        label: '无障碍标签文本。',
        options:
          '项目数组——字符串、带 value/label/icon/disabled 的对象、分隔线或分组。',
        value: '当前选中的值。',
        onChange: '选择变化时触发的回调。',
        changeAction: '变化时的异步操作，在 onChange 之后触发。',
        placeholder: '未选择值时显示的占位文本。',
        size: '选择器的尺寸变体。',
        triggerDisplay: '在触发器中显示选中项的方式。',
        formatValue:
          '格式化 triggerDisplay="count" 或 "labels" 时的触发器文本。接收选中项（value 及解析后的 label），数量为 items.length。triggerDisplay="badges" 不使用此属性。',
        maxBadges:
          '显示"+N"之前的最大徽章数。仅适用于 triggerDisplay="badges"。',
        hasSelectAll: '是否显示全选复选框。',
        selectAllLabel: '全选复选框的标签。',
        hasSearch: '是否显示用于过滤选项的搜索输入。',
        searchPlaceholder: '搜索输入的占位文本。',
        emptyText: '没有可显示的选项时，下拉面板中显示的内容。',
        emptySearchText: '搜索查询未匹配到任何选项时，下拉面板中显示的内容。',
        isDisabled: '禁用选择器。',
        isReadOnly:
          '将选择器设为只读：保留当前值、焦点顺序和表单提交，但移除选择面板、清除操作和展开指示器。与 isDisabled 不同，只读控件不会变暗；两者同时设置时 isDisabled 优先。',
        htmlName:
          '用于表单提交的 HTML name 属性。为每个已选值渲染一个隐藏输入，类似原生多选。',
        disabledMessage:
          '解释选择器被禁用的原因。与 isDisabled 一起使用时，悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持触发器可聚焦（仍无法激活）。请使用此属性，而不是用 Tooltip 包裹被禁用的选择器。',
        isLabelHidden: '视觉上隐藏标签同时保持其可访问性。',
        description: '标签下方显示的辅助文本。',
        labelTooltip: '在标签末尾信息图标中显示的提示文本。',
        isOptional: '将字段标记为可选。',
        isRequired: '将字段标记为必填。',
        isLoading: '在触发器中显示加载旋转器。',
        status: '带可选消息的验证状态。',
        statusVariant:
          '状态消息的放置方式：attached 直接叠加在输入框下方；detached 作为独立元素浮于下方并留有间距。',
        renderOption:
          '每个可选选项的自定义渲染函数。不会用于分隔线、分组或全选行。',
        presentation:
          '选项列表的呈现方式：锚定弹出框、底部抽屉，或根据紧凑触控屏自适应。',
        className: '用于布局自定义的 Tailwind 类，通过 cn() 与组件类合并，冲突的工具类会覆盖默认值。',
      },
    },
  ],
  usage: {
    description:
      'A checkbox dropdown for selecting multiple values from a list. Selected items can display as a count, labels, or badges. Use it for filtering or when presenting a finite set of options where multiple choices are needed.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for a moderate, finite set of options where multiple choices are needed.',
      },
      {
        guidance: true,
        description:
          'Enable search filtering when the list exceeds ~15 options.',
      },
      {
        guidance: true,
        description:
          'Use renderOption for custom option rows; the checkbox affordance remains owned by MultiSelector.',
      },
      {
        guidance: true,
        description:
          'Enable select-all when most users will want all or nearly all options selected.',
      },
      {
        guidance: false,
        description: 'Use for single-value selection; use Selector instead.',
      },
      {
        guidance: false,
        description: 'Show more than ~20 options without enabling search.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled MultiSelector in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'قائمة منسدلة بمربعات اختيار لتحديد قيم متعددة من قائمة، مع عرض العناصر المحددة كعدد أو تسميات أو شارات.',
  usage: {
    description: 'قائمة منسدلة بمربعات اختيار لتحديد قيم متعددة من قائمة. يمكن عرض العناصر المحددة كعدد أو تسميات أو شارات. استخدمها للتصفية أو عند عرض مجموعة محدودة من الخيارات تتطلب اختيارات متعددة.',
    bestPractices: [
      {guidance: true, description: 'استخدمه لمجموعة معتدلة ومحدودة من الخيارات تتطلب اختيارات متعددة.'},
      {guidance: true, description: 'فعّل التصفية بالبحث عندما تتجاوز القائمة نحو 15 خيارًا.'},
      {guidance: true, description: 'استخدم renderOption لصفوف الخيارات المخصصة؛ ويظل مربع الاختيار مملوكًا لـ MultiSelector.'},
      {guidance: true, description: 'فعّل "تحديد الكل" عندما يرغب معظم المستخدمين في تحديد كل الخيارات أو جلّها.'},
      {guidance: true, description: 'استخدمه داخل InputGroup فقط عندما يحتاج عنصر التحكم إلى إضافة قصيرة سابقة أو لاحقة كجزء من سطح إدخال مزخرف واحد؛ وفضّل عرض المشغّل بالعدد أو التسميات كي تبقى المجموعة في سطر واحد.'},
      {guidance: true, description: 'استخدم variant="ghost" عندما يكون المحدِّد المتعدد في شريط أدوات مع أزرار ghost. إذا احتجت إلى حالة التحقق هناك، ففضّل statusVariant="tooltip" كي يبقى ارتفاع شريط الأدوات مدمجًا.'},
      {guidance: true, description: 'استخدم presentation="adaptive" عندما ينبغي أن يصبح المحدِّد المتعدد لوحة سفلية على شاشات اللمس المدمجة.'},
      {guidance: false, description: 'استخدامه لتحديد قيمة واحدة؛ استخدم Selector بدلًا من ذلك.'},
      {guidance: false, description: 'عرض أكثر من نحو 20 خيارًا دون تفعيل البحث.'},
      {guidance: false, description: 'تغليف MultiSelector معطَّل داخل Tooltip لتوضيح سبب تعطيله؛ إذ تبتلع المشغّلات المعطَّلة أحداث التمرير التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.'},
    ],
    anatomy: [
      {name: 'الحقل', required: false, description: 'غلاف Field مستقل يوفّر التسمية والمحتوى الداعم الاختياري؛ ويُحذف داخل InputGroup.'},
      {name: 'المشغّل', required: true, description: 'عنصر تحكم مرسوم يعرض التحديد الحالي أو النص الإرشادي ويفتح سطح التحديد عندما يكون قابلًا للتعديل.'},
      {name: 'أيقونة البداية المعروضة عبر Icon', required: false, description: 'أيقونة دلالية بادئة اختيارية أو مكوّن أيقونة يُعرض عبر Icon.'},
      {name: 'محتوى البداية الذي يعرضه المستدعي', required: false, description: 'محتوى React اختياري عشوائي يُعرض مباشرةً في بداية المشغّل.'},
      {name: 'زر مسح المشغّل', required: false, description: 'إجراء مسح مشترك يزيل كل القيم المحددة عند تفعيل hasClear.'},
      {name: 'أيقونة الحالة', required: false, description: 'رمز الحالة المعروض مكان مؤشر الإفصاح للحالة المرفقة أو حالة التلميح.'},
      {name: 'أيقونة المؤشر', required: false, description: 'سهم ختامي يُعرض عندما لا يحلّ عرض الحالة محله؛ ويعكس حالة الطي أو التوسيع.'},
      {name: 'صف البحث', required: false, description: 'ترويسة اللوحة مع حقل بحث بلا حدود وإجراء مسح اختياري.'},
      {name: 'أيقونة البحث', required: false, description: 'عدسة مكبّرة بادئة تُعرض عبر Icon داخل صف البحث.'},
      {name: 'زر مسح البحث', required: false, description: 'إجراء مسح مشترك يُعرض في صف البحث أثناء وجود استعلام.'},
      {name: 'صف الخيار', required: false, description: 'صف قابل للتحديد لخيار ما أو لخيار "تحديد الكل" الاختياري.'},
      {name: 'مؤشر مربع اختيار الخيار', required: false, description: 'مؤشر CheckboxInput الذي يعرض حالة كل صف: محدد، أو غير محدد، أو غير محدد جزئيًا.'},
      {name: 'فاصل الخيارات', required: false, description: 'فاصل يُوفَّر في بيانات الخيارات العامة للفصل بين مجموعات الخيارات المتجاورة.'},
      {name: 'عنوان القسم', required: false, description: 'عنوان مرئي لمجموعة مسمّاة من صفوف الخيارات.'},
      {name: 'الحالة الفارغة', required: false, description: 'رسالة تُعرض عندما لا يحتوي محتوى اللوحة المشترك على خيارات أو لا توجد نتائج مطابقة للبحث.'},
      {name: 'النافذة المنبثقة للمؤشر', required: false, description: 'سطح مرسوم مثبَّت يستضيف محتوى اللوحة المشترك في عرض popover.'},
      {name: 'عنوان لوحة اللمس', required: false, description: 'عنوان فوق محتوى اللوحة المشترك في عرض bottom-sheet.'},
      {name: 'لوحة اللمس', required: false, description: 'سطح BottomSheet يستضيف محتوى اللوحة نفسه في عرض bottom-sheet.'},
    ],
  },
  components: [
    {
      name: 'MultiSelector',
      displayName: 'المحدِّد المتعدد',
      description: 'قائمة منسدلة متعددة التحديد بمربعات اختيار لاختيار عناصر متعددة.',
      propDescriptions: {
        label: 'نص التسمية لأغراض إمكانية الوصول.',
        options: 'مصفوفة عناصر: نصوص، أو كائنات تحتوي على value/label/icon/disabled، أو فواصل، أو أقسام.',
        value: 'القيم المحددة حاليًا.',
        onChange: 'دالة استدعاء تُنفَّذ عند تغيّر التحديد.',
        changeAction: 'إجراء غير متزامن عند التغيير. يُنفَّذ بعد onChange.',
        placeholder: 'نص إرشادي يُعرض عند عدم تحديد أي قيمة.',
        size: 'نمط الحجم للمحدِّد.',
        variant: 'النمط المرئي للمشغّل. input هو معالجة حقل الإدخال ذات الحدود للنماذج؛ وghost بلا حدود ويطابق أزرار ghost للاستخدام في أشرطة الأدوات.',
        triggerDisplay: 'كيفية عرض العناصر المحددة في المشغّل.',
        formatValue: 'ينسّق نص المشغّل عندما تكون triggerDisplay="count" أو "labels". يتلقى العناصر المحددة (القيمة مع التسمية المحلولة)؛ والعدد هو items.length. لا تستخدمه triggerDisplay="badges".',
        maxBadges: 'الحد الأقصى للشارات المعروضة قبل "+N". فقط مع triggerDisplay="badges".',
        hasSelectAll: 'ما إذا كان سيتم عرض مربع اختيار "تحديد الكل".',
        selectAllLabel: 'تسمية مربع اختيار "تحديد الكل".',
        hasSearch: 'ما إذا كان سيتم عرض حقل بحث لتصفية الخيارات. أثناء الكتابة، يُعلَن عدد النتائج المطابقة (أو "لا توجد نتائج") لقارئات الشاشة عبر منطقة حية مهذبة (polite). لحقل البحث وسائل مدمجة: أيقونة عدسة مكبّرة بادئة، وبعد كتابة استعلام، زر مسح (✕) ختامي يعيد تعيين الاستعلام ويعيد التركيز إلى حقل الإدخال.',
        searchPlaceholder: 'نص إرشادي لحقل البحث.',
        emptyText: 'محتوى يُعرض في لوحة القائمة المنسدلة عند عدم وجود خيارات لعرضها، ويُعلَن في منطقة حية مهذبة عند فتح اللوحة. الإعلان هو النص الذي يعرضه هذا المحتوى مقروءًا من DOM، لذا يُعلَن العنصر كما هو مكتوب وتُستبعد الأجزاء ذات aria-hidden من كليهما. لا يُعرض أثناء isLoading.',
        emptySearchText: 'محتوى يُعرض في لوحة القائمة المنسدلة عندما لا يطابق استعلام البحث أي خيارات، ويُعلَن في منطقة حية مهذبة في الوقت نفسه. الإعلان هو النص الذي يعرضه هذا المحتوى مقروءًا من DOM، لذا يُعلَن العنصر كما هو مكتوب وتُستبعد الأجزاء ذات aria-hidden من كليهما.',
        isDisabled: 'يعطّل المحدِّد.',
        isReadOnly: 'يجعل المحدِّد للقراءة فقط: تبقى القيم المحددة مرئية وقابلة للتركيز ومضمَّنة في إرسال النموذج، وتحتفظ بهويتها كـ combobox مع aria-readonly. يُزال سطح التحديد وإجراء المسح ومؤشر الإفصاح. على عكس isDisabled، لا يصبح عنصر التحكم باهتًا. تأخذ isDisabled الأولوية عند تعيين الاثنتين.',
        htmlName: 'السمة name في HTML لإرسال النماذج. يعرض حقل إدخال مخفيًا واحدًا لكل قيمة محددة، مثل عنصر multi-select الأصلي.',
        disabledMessage: 'يوضّح سبب تعطيل المحدِّد. مع isDisabled، يعرض تلميحًا عند التمرير أو التركيز بلوحة المفاتيح ويُبقي المشغّل قابلًا للتركيز عبر aria-disabled (مع بقاء التفعيل ممنوعًا). استخدمه بدلًا من تغليف MultiSelector معطَّل داخل Tooltip، إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها Tooltip الخارجي.',
        isLabelHidden: 'يخفي التسمية بصريًا مع إبقائها قابلة للوصول.',
        description: 'نص مساعد يُعرض أسفل التسمية.',
        labelTooltip: 'نص تلميح يُعرض في أيقونة معلومات عند نهاية التسمية.',
        isOptional: 'يميّز الحقل بأنه اختياري.',
        isRequired: 'يميّز الحقل بأنه مطلوب.',
        isLoading: 'يعرض مؤشر تحميل دوّارًا في المشغّل.',
        status: 'حالة التحقق مع رسالة اختيارية.',
        statusVariant: 'كيفية وضع رسالة الحالة بالنسبة إلى حقل الإدخال. attached تتداخل مباشرةً أسفل حقل الإدخال ذي الحدود وهي صالحة فقط للنمط input؛ وتفصل محدِّدات ghost رسائل الحالة المرفقة افتراضيًا. استخدم tooltip لعناصر التحكم المدمجة في أشرطة الأدوات.',
        renderOption: 'دالة عرض مخصصة لكل خيار قابل للتحديد في القائمة المنسدلة. لا تُستدعى للفواصل أو الأقسام أو صف "تحديد الكل".',
        indicatorPosition: 'أي حافة من صف الخيار تحمل مربع الاختيار. end تدفعه إلى الحافة البعيدة من الصف، بما في ذلك صف "تحديد الكل".',
        presentation: 'كيفية عرض قائمة الخيارات. يستخدم adaptive لوحة سفلية على شاشات اللمس المدمجة ونافذة منبثقة مثبَّتة في غيرها.',
        width: 'عرض الحقل (الرقم = بكسلات، والنص يُستخدم كما هو، مثل "100%"). يحدد حجم الحقل بالكامل (التسمية وعنصر التحكم والحالة) كي تبقى متحاذية.',
        startIcon: 'أيقونة تُعرض في بداية مشغّل المحدِّد.',
        hasClear: 'يعرض زر مسح عند تحديد قيم.',
        isDefaultOpen: 'ما إذا كانت القائمة المنسدلة تبدأ مفتوحة عند التركيب.',
        className: 'فئات Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
      },
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'checkbox multi-select dropdown for finite sets like column toggles or filter facets',
  usage: {
    description:
      'A checkbox dropdown for selecting multiple values from a list. Selected items can display as a count, labels, or badges. Use it for filtering or when presenting a finite set of options where multiple choices are needed.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for a moderate, finite set of options where multiple choices are needed.',
      },
      {
        guidance: true,
        description:
          'Enable search filtering when the list exceeds ~15 options.',
      },
      {
        guidance: true,
        description:
          'renderOption for custom rows; checkbox affordance stays owned by MultiSelector.',
      },
      {
        guidance: true,
        description:
          'Enable select-all when most users will want all or nearly all options selected.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup only for a short prefix or suffix addon; prefer count or labels trigger display so the group stays single-line.',
      },
      {
        guidance: true,
        description:
          'Use variant="ghost" in toolbars with ghost buttons; prefer statusVariant="tooltip" for compact validation status.',
      },
      {
        guidance: false,
        description: 'Use for single-value selection; use Selector instead.',
      },
      {
        guidance: false,
        description: 'Show more than ~20 options without enabling search.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled MultiSelector in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  components: [
    {
      name: 'MultiSelector',
      displayName: 'Multi Selector',
      description: 'checkbox multi-select dropdown',
      propDescriptions: {
        label: 'a11y label',
        options:
          'items: strings, objects w/ value/label/icon/disabled, dividers, sections',
        value: 'selected values',
        onChange: 'callback on selection change',
        changeAction: 'async; fires after onChange',
        placeholder: 'text when nothing selected',
        size: 'size variant',
        variant:
          'visual trigger style: input bordered control or ghost toolbar control',
        triggerDisplay: 'how to show selected in trigger',
        formatValue:
          'formats count/labels trigger text; receives selected items',
        maxBadges: 'max badges before "+N"; badges mode only',
        hasSelectAll: 'show select-all checkbox',
        selectAllLabel: 'select-all label',
        hasSearch: 'show search input',
        searchPlaceholder: 'search placeholder',
        emptyText: 'panel content when there are no options',
        emptySearchText: 'panel content when the query matches nothing',
        isDisabled: 'disables selector',
        isReadOnly:
          'read-only: preserves values, focus + form submission; removes menu, clear + disclosure',
        htmlName: 'HTML name attr; one hidden input per selected value.',
        disabledMessage:
          'why disabled; w/ isDisabled shows tooltip on hover/focus, trigger stays focusable via aria-disabled; use instead of Tooltip wrapper',
        isLabelHidden: 'visually hides label',
        description: 'helper text below label',
        labelTooltip: 'info-icon tooltip text after the label',
        isOptional: 'marks optional',
        isRequired: 'marks required',
        isLoading: 'spinner in trigger',
        status: 'validation status w/ optional message',
        statusVariant:
          'status message placement; ghost detaches attached by default; use tooltip for compact toolbars.',
        renderOption:
          'custom render fn per selectable option; not dividers/sections/select-all',
        presentation:
          'popover, bottom-sheet, or compact-touch adaptive presentation',
        className: 'Tailwind layout classes (a string only); merged via cn(), so conflicting utilities override defaults',
      },
    },
  ],
};
