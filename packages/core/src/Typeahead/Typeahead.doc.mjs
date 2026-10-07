/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Field',
    required: false,
    description:
      'Standalone Field shell that provides the label and optional supporting content; omitted inside InputGroup.',
  },
  {
    name: 'Input surface',
    required: true,
    description:
      'Painted control surface containing the editable input or the selected token.',
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
      'Optional arbitrary React content rendered directly at the start of the input surface.',
  },
  {
    name: 'Selected token',
    required: false,
    description:
      'Token that presents the selected item while the control is not in edit mode.',
  },
  {
    name: 'Spinner',
    required: false,
    description:
      'Loading indicator shown at the end of the input surface while a search is in flight.',
  },
  {
    name: 'Clear button',
    required: false,
    description:
      'Shared clear action that removes the selected item when hasClear is enabled.',
  },
  {
    name: 'Dropdown',
    required: false,
    description:
      'Anchored listbox surface containing the current search results.',
  },
  {
    name: 'Empty state',
    required: false,
    description: 'Message shown after a completed search returns no results.',
  },
  {
    name: 'Result row',
    required: false,
    description:
      'Stable option wrapper that owns highlight, selection, pointer, and keyboard behavior.',
  },
  {
    name: 'Default item content',
    required: false,
    description:
      'Standard TypeaheadItem label and supporting content rendered inside a result row when renderItem and item.element are absent.',
  },
  {
    name: 'Caller-rendered item content',
    required: false,
    description:
      'Caller-owned result content supplied through renderItem or item.element inside the stable result row.',
  },
  {
    name: 'Result group heading',
    required: false,
    description: 'Visible heading for a labeled group of result rows.',
  },
  {
    name: 'Selected result state',
    required: false,
    description:
      'Selected styling and trailing check presented on the current result row.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Typeahead',
  displayName: 'Typeahead',
  group: 'Typeahead',
  category: 'Form Controls',
  keywords: [
    'typeahead',
    'autocomplete',
    'combobox',
    'searchbox',
    'autosuggest',
    'select',
    'dropdown',
    'lookup',
    'searchable',
    'suggestion',
    'picker',
  ],
  description:
    'Styled typeahead with label, description, validation, and all field features. Wraps BaseTypeahead with Field for the primary use case.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the input.',
      required: true,
    },
    {
      name: 'searchSource',
      type: 'SearchSource<T>',
      description:
        'Data source providing search and bootstrap methods for populating the dropdown.',
      required: true,
    },
    {
      name: 'value',
      type: 'T | null',
      description: 'Currently selected item, or null if nothing is selected.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(item: T | null) => void',
      description: 'Called when the selection changes.',
      required: true,
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Input placeholder text.',
    },
    {
      name: 'hasEntriesOnFocus',
      type: 'boolean',
      description: 'Show bootstrap results on focus before typing.',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Show clear button to deselect the current value.',
      default: 'true',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the input.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the field focusable via aria-disabled (activation stays blocked). Use this instead of wrapping a disabled Typeahead in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'maxMenuItems',
      type: 'number',
      description: 'Maximum number of dropdown items to display.',
      default: '10',
    },
    {
      name: 'minQueryLength',
      type: 'number',
      description:
        'Minimum query length before the search source is queried. Below it no search runs and the menu stays closed.',
      default: '1',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Validation status object with type and message for error/warning/success states.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing.',
      default: "'attached'",
    },
    {
      name: 'renderItem',
      type: '(item: T) => ReactNode',
      description:
        'Custom render function for dropdown items. Default renders TypeaheadItem.',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hides the label while keeping it accessible.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text displayed below the label.',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the field as required.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Shows an optional indicator on the label.',
      default: 'false',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text shown on the label.',
    },
    {
      name: 'emptySearchText',
      type: 'ReactNode',
      description:
        'Content shown when the query matched nothing. Takes a ReactNode, so the dead end can carry a link or a create row. Announced in a polite live region as the text it renders, read from the DOM; aria-hidden parts stay out of both, and content that renders no text announces nothing. null counts as not given, like undefined, and falls through to the default; pass an empty string to render nothing.',
      default: "'No results found'",
    },
    {
      name: 'emptySearchResultsText',
      type: 'string',
      description:
        'Deprecated: renamed to emptySearchText, which takes a ReactNode rather than a string, so every existing value stays valid. Still works exactly as released; emptySearchText wins when both are set.',
      default: "'No results found'",
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Auto-focus the input on mount.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Input and token size.',
      default: "'md'",
    },
    {
      name: 'debounceMs',
      type: 'number',
      description:
        'Debounce delay in ms before triggering search. Set to 0 for synchronous sources.',
      default: '150',
    },
    {
      name: 'onChangeQuery',
      type: '(query: string) => void',
      description: 'Callback fired when the search query text changes.',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Callback when the dropdown opens or closes.',
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
      description: 'SVG icon component displayed at the start of the input.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [{name: 'BaseTypeahead'}, {name: 'TypeaheadItem'}],
  theming: {
    targets: [
      {className: 'solo-typeahead', visualProps: ['status', 'size']},
      {className: 'solo-typeahead-dropdown'},
      {className: 'solo-typeahead-empty-state'},
      {className: 'solo-typeahead-item'},
    ],
  },
  usage: {
    anatomy,
    description:
      'A searchable input for selecting a single item from a large or dynamic dataset. Results appear as the user types, with support for async data sources, debounced search, and custom item rendering. Use it when the option list is too large for a Selector dropdown.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide descriptive placeholder text that hints at what users can search for.',
      },
      {
        guidance: true,
        description:
          'Show suggestions on focus when users benefit from seeing popular or recent options before typing.',
      },
      {
        guidance: true,
        description:
          'Add a search delay for remote data sources to avoid excessive network requests.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup when the typeahead needs a single-line prefix or suffix addon.',
      },
      {
        guidance: false,
        description:
          'Use for short, static option lists; use Selector for better discoverability.',
      },
      {
        guidance: false,
        description: 'Use for multi-selection; use Tokenizer instead.',
      },
      {
        guidance: false,
        description:
          'Place multiple Typeaheads adjacent to each other without clear labels differentiating them.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Typeahead in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'A searchable input for selecting a single item from a large or dynamic dataset. Results appear as the user types, with support for async data sources, debounced search, and custom item rendering. Use it when the option list is too large for a Selector dropdown.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide descriptive placeholder text that hints at what users can search for.',
      },
      {
        guidance: true,
        description:
          'Show suggestions on focus when users benefit from seeing popular or recent options before typing.',
      },
      {
        guidance: true,
        description:
          'Add a search delay for remote data sources to avoid excessive network requests.',
      },
      {
        guidance: false,
        description:
          'Use for short, static option lists; use Selector for better discoverability.',
      },
      {
        guidance: false,
        description: 'Use for multi-selection; use Tokenizer instead.',
      },
      {
        guidance: false,
        description:
          'Place multiple Typeaheads adjacent to each other without clear labels differentiating them.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Typeahead in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حقل إكمال تلقائي منسَّق مع تسمية ووصف وتحقق وجميع ميزات الحقل. يغلّف BaseTypeahead داخل Field لحالة الاستخدام الأساسية.',
  propDescriptions: {
    label: 'التسمية القابلة للوصول لحقل الإدخال.',
    searchSource: 'مصدر بيانات يوفّر دالتي search وbootstrap لملء القائمة المنسدلة.',
    value: 'العنصر المحدد حاليًا، أو null إذا لم يُحدَّد شيء.',
    onChange: 'تُستدعى عند تغيّر الاختيار.',
    placeholder: 'النص الإرشادي لحقل الإدخال.',
    hasEntriesOnFocus: 'يعرض نتائج bootstrap عند التركيز قبل الكتابة.',
    hasClear: 'يعرض زر مسح لإلغاء تحديد القيمة الحالية.',
    isDisabled: 'يعطّل حقل الإدخال.',
    disabledMessage: 'يوضح سبب تعطيل حقل الإدخال. مع isDisabled، يعرض تلميحًا عند التمرير أو التركيز بلوحة المفاتيح ويُبقي الحقل قابلًا للتركيز عبر aria-disabled (مع بقاء التفعيل محظورًا). استخدمه بدلًا من تغليف Typeahead معطَّل داخل Tooltip، إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    maxMenuItems: 'الحد الأقصى لعدد عناصر القائمة المنسدلة المعروضة.',
    minQueryLength: 'الحد الأدنى لطول الاستعلام قبل الاستعلام من مصدر البحث. دونه لا يُنفَّذ أي بحث وتبقى القائمة مغلقة.',
    status: 'كائن حالة التحقق مع type وmessage لحالات الخطأ/التحذير/النجاح.',
    statusVariant: 'كيفية وضع رسالة الحالة بالنسبة إلى حقل الإدخال. attached تتداخل مباشرةً أسفل الحقل (بمعالجة ذات حدود)؛ وdetached تطفو أسفله كعنصر منفصل مع تباعد.',
    renderItem: 'دالة عرض مخصصة لعناصر القائمة المنسدلة. تعرض افتراضيًا TypeaheadItem.',
    isLabelHidden: 'يُخفي التسمية بصريًا مع إبقائها قابلة للوصول.',
    description: 'نص مساعد يُعرض أسفل التسمية.',
    isRequired: 'يحدد الحقل على أنه مطلوب.',
    isOptional: 'يعرض مؤشر الحقل الاختياري على التسمية.',
    labelTooltip: 'نص التلميح المعروض على التسمية.',
    emptySearchText: 'المحتوى المعروض عندما لا يطابق الاستعلام أي شيء. يقبل ReactNode، لذا يمكن أن يحمل هذا الطريق المسدود رابطًا أو صف إنشاء. يُعلَن في منطقة حيّة مهذبة بالنص الذي يعرضه، مقروءًا من DOM؛ وتبقى الأجزاء ذات aria-hidden خارج كليهما، والمحتوى الذي لا يعرض نصًا لا يُعلن شيئًا. تُعامل null كأنها غير مُعطاة، مثل undefined، فتعود إلى القيمة الافتراضية؛ مرِّر نصًا فارغًا كي لا يُعرض شيء.',
    emptySearchResultsText: 'مُهمَل: أُعيدت تسميته إلى emptySearchText، الذي يقبل ReactNode بدلًا من نص، لذا تبقى كل القيم الحالية صالحة. لا يزال يعمل تمامًا كما أُصدر؛ وتكون الأولوية لـ emptySearchText عند ضبط كليهما.',
    hasAutoFocus: 'يركّز تلقائيًا على حقل الإدخال عند التركيب.',
    size: 'حجم حقل الإدخال والرمز المحدد.',
    debounceMs: 'مدة التأخير بالمللي ثانية قبل إطلاق البحث. اضبطها على 0 للمصادر المتزامنة.',
    onChangeQuery: 'دالة استدعاء تُطلق عند تغيّر نص استعلام البحث.',
    onOpenChange: 'دالة استدعاء عند فتح القائمة المنسدلة أو إغلاقها.',
    width: 'عرض الحقل (الرقم = بكسلات، والنص يُستخدم كما هو، مثل "100%"). يحدد حجم الحقل بأكمله (التسمية وعنصر التحكم والحالة) كي تبقى متحاذية.',
    startIcon: 'مكوّن أيقونة SVG يُعرض في بداية حقل الإدخال.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأحجام)، تُدمج مع أصناف المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'حقل إدخال قابل للبحث لاختيار عنصر واحد من مجموعة بيانات كبيرة أو ديناميكية. تظهر النتائج أثناء كتابة المستخدم، مع دعم مصادر البيانات غير المتزامنة والبحث المؤجَّل وعرض العناصر المخصص. استخدمه عندما تكون قائمة الخيارات أكبر من أن تستوعبها قائمة Selector المنسدلة.',
    bestPractices: [
      {
        guidance: true,
        description: 'وفّر نصًا إرشاديًا وصفيًا يلمّح إلى ما يمكن للمستخدمين البحث عنه.',
      },
      {
        guidance: true,
        description: 'اعرض الاقتراحات عند التركيز عندما يستفيد المستخدمون من رؤية الخيارات الشائعة أو الحديثة قبل الكتابة.',
      },
      {
        guidance: true,
        description: 'أضف تأخيرًا للبحث مع مصادر البيانات البعيدة لتجنب طلبات الشبكة المفرطة.',
      },
      {
        guidance: true,
        description: 'استخدمه داخل InputGroup عندما يحتاج حقل الإكمال التلقائي إلى إضافة بادئة أو لاحقة في سطر واحد.',
      },
      {
        guidance: false,
        description: 'استخدامه لقوائم الخيارات القصيرة والثابتة؛ استخدم Selector لقابلية اكتشاف أفضل.',
      },
      {
        guidance: false,
        description: 'استخدامه للاختيار المتعدد؛ استخدم Tokenizer بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'وضع عدة حقول Typeahead متجاورة دون تسميات واضحة تميّز بينها.',
      },
      {
        guidance: false,
        description: 'تغليف Typeahead معطَّل داخل Tooltip لتوضيح سبب تعطيله؛ إذ تبتلع المشغِّلات المعطَّلة أحداث التمرير التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'الحقل',
        required: false,
        description: 'هيكل Field مستقل يوفّر التسمية والمحتوى المساند الاختياري؛ ويُحذف داخل InputGroup.',
      },
      {
        name: 'سطح الإدخال',
        required: true,
        description: 'سطح عنصر التحكم المرسوم الذي يحتوي على حقل الإدخال القابل للتحرير أو الرمز المحدد.',
      },
      {
        name: 'أيقونة البداية المعروضة عبر Icon',
        required: false,
        description: 'أيقونة دلالية بادئة اختيارية أو مكوّن أيقونة يُعرض عبر Icon.',
      },
      {
        name: 'محتوى البداية الذي يعرضه المستدعي',
        required: false,
        description: 'محتوى React اختياري عشوائي يُعرض مباشرةً في بداية سطح الإدخال.',
      },
      {
        name: 'الرمز المحدد',
        required: false,
        description: 'رمز يعرض العنصر المحدد عندما لا يكون عنصر التحكم في وضع التحرير.',
      },
      {
        name: 'مؤشر التحميل',
        required: false,
        description: 'مؤشر تحميل يظهر في نهاية سطح الإدخال أثناء تنفيذ البحث.',
      },
      {
        name: 'زر المسح',
        required: false,
        description: 'إجراء مسح مشترك يزيل العنصر المحدد عند تفعيل hasClear.',
      },
      {
        name: 'القائمة المنسدلة',
        required: false,
        description: 'سطح مربع قائمة مثبَّت يحتوي على نتائج البحث الحالية.',
      },
      {
        name: 'الحالة الفارغة',
        required: false,
        description: 'رسالة تظهر بعد أن يُرجع بحث مكتمل عدم وجود نتائج.',
      },
      {
        name: 'صف النتيجة',
        required: false,
        description: 'غلاف خيار ثابت يملك سلوك التمييز والتحديد والمؤشر ولوحة المفاتيح.',
      },
      {
        name: 'محتوى العنصر الافتراضي',
        required: false,
        description: 'تسمية TypeaheadItem القياسية والمحتوى المساند المعروضان داخل صف النتيجة عند غياب renderItem وitem.element.',
      },
      {
        name: 'محتوى العنصر الذي يعرضه المستدعي',
        required: false,
        description: 'محتوى نتيجة يملكه المستدعي ويُقدَّم عبر renderItem أو item.element داخل صف النتيجة الثابت.',
      },
      {
        name: 'عنوان مجموعة النتائج',
        required: false,
        description: 'عنوان مرئي لمجموعة ذات تسمية من صفوف النتائج.',
      },
      {
        name: 'حالة النتيجة المحددة',
        required: false,
        description: 'تنسيق التحديد وعلامة الاختيار اللاحقة المعروضان على صف النتيجة الحالي.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Searchable dropdown for single-item selection w/ keyboard navigation. Supports async+sync search via searchSource interface.',
  usage: {
    description:
      'A searchable input for selecting a single item from a large or dynamic dataset. Results appear as the user types, with support for async data sources, debounced search, and custom item rendering. Use it when the option list is too large for a Selector dropdown.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide descriptive placeholder text that hints at what users can search for.',
      },
      {
        guidance: true,
        description:
          'Show suggestions on focus when users benefit from seeing popular or recent options before typing.',
      },
      {
        guidance: true,
        description:
          'Add a search delay for remote data sources to avoid excessive network requests.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup when the typeahead needs a single-line prefix or suffix addon.',
      },
      {
        guidance: false,
        description:
          'Use for short, static option lists; use Selector for better discoverability.',
      },
      {
        guidance: false,
        description: 'Use for multi-selection; use Tokenizer instead.',
      },
      {
        guidance: false,
        description:
          'Place multiple Typeaheads adjacent to each other without clear labels differentiating them.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Typeahead in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};
