/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Input',
    required: true,
    description:
      'Bare combobox input. The caller supplies its visible field chrome and accessible name.',
  },
  {
    name: 'Loading status',
    required: false,
    description:
      'Named Spinner shown beside the input while an asynchronous source is pending, unless a composed owner takes over the busy indicator lane.',
  },
  {
    name: 'Dropdown',
    required: false,
    description:
      'Anchored listbox surface containing current search or bootstrap results.',
  },
  {
    name: 'Empty state',
    required: false,
    description:
      'Disabled listbox option shown after a completed search returns no results.',
  },
  {
    name: 'Result group heading',
    required: false,
    description: 'Visible label for a group of result options.',
  },
  {
    name: 'Result row',
    required: false,
    description:
      'Option wrapper that owns highlight, selection, pointer, and keyboard behavior.',
  },
  {
    name: 'Default item content',
    required: false,
    description:
      'TypeaheadItem label and optional supporting content rendered inside a result row.',
  },
  {
    name: 'Caller-rendered item content',
    required: false,
    description:
      'Caller content supplied through renderItem or item.element inside the stable result row.',
  },
  {
    name: 'Selected result state',
    required: false,
    description:
      'Selected row weight and trailing check shown when a result matches value.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'BaseTypeahead',
  subComponentOf: 'Typeahead',
  displayName: 'Base Typeahead',
  isHiddenFromOverview: true,
  description:
    'Composable combobox engine providing a bare input, search, keyboard navigation, and a styled result dropdown. It renders no input wrapper, border, or selected-value token. Typeahead and Tokenizer compose it for standard fields.',
  usage: {
    anatomy,
    description:
      'Composable combobox engine providing a bare input, search, keyboard navigation, and a styled result dropdown. It renders no input wrapper, border, or selected-value token. Typeahead and Tokenizer compose it for standard fields.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use Typeahead or Tokenizer for standard fields; they wrap BaseTypeahead with input chrome and selected-value rendering it intentionally omits.',
      },
      {
        guidance: true,
        description:
          'Provide your own visible label or aria-label and custom input wrapper so the bare combobox has an accessible name, focus treatment, border, and layout.',
      },
      {
        guidance: true,
        description:
          'Pass anchorRef pointing to your wrapper so the dropdown positions against your custom input chrome, not just the bare input element.',
      },
      {
        guidance: false,
        description:
          'Expect input chrome or selected-value rendering. BaseTypeahead is an engine; the caller owns those visible parts.',
      },
      {
        guidance: false,
        description:
          'Use BaseTypeahead when Typeahead or Tokenizer would suffice; the extra wrapper and styling work is only justified for truly custom compositions.',
      },
      {
        guidance: false,
        description:
          'Treat Escape as cancellation of pending source work. It hides the current popup, but a late response can reopen it.',
      },
    ],
  },
  props: [
    {
      name: 'searchSource',
      type: '{search(query: string): T[] | Promise<T[]>; bootstrap(): T[] | Promise<T[]>; cancel?(): void}',
      description: 'Data source (a SearchSource<T>) providing search and bootstrap methods; cancel aborts an in-flight search.',
      required: true,
    },
    {
      name: 'value',
      type: 'T | null',
      description: 'Currently selected item.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(item: T | null) => void',
      description: 'Called when the selection changes.',
      required: true,
    },
    {
      name: '__queryEntries',
      type: '(query: string, results: T[]) => T[]',
      description:
        `Internal wiring between Tokenizer and the base (not public API): entries derived from the query text rather than fetched, such as Tokenizer's "Create ..." row. Appended to the search results regardless of minQueryLength; receives those results so it can skip a duplicate.`,
    },
    {
      name: 'renderItem',
      type: '(item: T) => ReactNode',
      description: 'Custom render function for dropdown items.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Input placeholder text.',
      default: "'Search…'",
    },
    {
      name: 'hasEntriesOnFocus',
      type: 'boolean',
      description: 'Show bootstrap results on focus before typing.',
      default: 'false',
    },
    {
      name: 'maxMenuItems',
      type: 'number',
      description: 'Maximum dropdown items to display.',
      default: '10',
    },
    {
      name: 'menuWidth',
      type: 'number',
      description:
        'Requested dropdown width in pixels before viewport clamping.',
    },
    {
      name: 'minQueryLength',
      type: 'number',
      description:
        'Minimum query length before the search source is queried. Below it no search runs and the menu stays closed.',
      default: '1',
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
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the input is disabled.',
      default: 'false',
    },
    {
      name: 'isFocusableDisabled',
      type: 'boolean',
      description:
        'Keep a disabled input focusable with aria-disabled and readOnly so a caller-owned disabled reason remains discoverable. It blocks text entry, but when applied after results are already open, Enter can still select the highlighted option.',
      default: 'false',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Auto-focus the input on mount.',
      default: 'false',
    },
    {
      name: 'debounceMs',
      type: 'number',
      description:
        'Debounce delay in ms before triggering search. Set to 0 for synchronous sources.',
      default: '150',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size used to scale dropdown option padding.',
      default: "'md'",
    },
    {
      name: 'anchorRef',
      type: 'RefObject<HTMLElement | null>',
      description:
        'Ref to the anchor element for dropdown positioning. If not provided, the input itself is used.',
    },
    {
      name: 'inputClassName',
      type: 'string',
      description: 'Additional Tailwind classes for the input element.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
    {
      name: 'inputTabIndex',
      type: 'number',
      description:
        'Legacy input-specific alias for native tabIndex. When provided, it takes precedence; otherwise native tabIndex is preserved.',
    },
    {
      name: 'onKeyDown',
      type: '(e: React.KeyboardEvent<HTMLInputElement>) => void',
      description:
        'Additional keydown handler called before internal keyboard navigation. Call e.preventDefault() to skip internal handling.',
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
      name: 'inputId',
      type: 'string',
      description:
        'Legacy input-specific alias for native id. When provided, it takes precedence; otherwise native id is preserved.',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string',
      description:
        'Legacy input-specific alias for native aria-describedby. When provided, it takes precedence; otherwise the native attribute is preserved.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      description:
        'Legacy input-specific alias for native aria-labelledby. When provided, it takes precedence; otherwise the native attribute is preserved.',
    },
  ],
};

export const docsZh = {
  name: 'BaseTypeahead',
  isHiddenFromOverview: true,
  displayName: 'Base Typeahead',
  description:
    '可组合的组合框引擎，提供裸输入框、搜索、键盘导航和带样式的结果下拉列表。它不渲染输入框包装、边框或已选值标记；Typeahead 和 Tokenizer 将其组合成标准字段。',
  props: [
    {
      name: 'searchSource',
      type: '{search(query: string): T[] | Promise<T[]>; bootstrap(): T[] | Promise<T[]>; cancel?(): void}',
      description: '提供搜索和引导方法的数据源（SearchSource<T>）；cancel 用于中止进行中的搜索。',
      required: true,
    },
    {
      name: 'value',
      type: 'T | null',
      description: '当前选中的项目。',
      required: true,
    },
    {
      name: 'onChange',
      type: '(item: T | null) => void',
      description: '选择变更时调用。',
      required: true,
    },
    {
      name: '__queryEntries',
      type: '(query: string, results: T[]) => T[]',
      description:
        'Tokenizer 与基础组件之间的内部连接（非公开 API）：由查询文本派生而非获取的条目，例如 Tokenizer 的“创建 ...”行。无论 minQueryLength 如何都会追加到搜索结果之后；会接收这些结果以便跳过重复项。',
    },
    {
      name: 'renderItem',
      type: '(item: T) => ReactNode',
      description: '下拉列表项的自定义渲染函数。',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: '输入框占位文本。',
      default: "'Search…'",
    },
    {
      name: 'hasEntriesOnFocus',
      type: 'boolean',
      description: '聚焦时在输入前显示引导结果。',
      default: 'false',
    },
    {
      name: 'maxMenuItems',
      type: 'number',
      description: '下拉列表显示的最大项目数。',
      default: '10',
    },
    {
      name: 'menuWidth',
      type: 'number',
      description: '视口限制前请求的下拉菜单像素宽度。',
    },
    {
      name: 'minQueryLength',
      type: 'number',
      description:
        '查询搜索源前的最小查询长度。低于该长度不会发起搜索，菜单保持关闭。',
      default: '1',
    },
    {
      name: 'emptySearchText',
      type: 'ReactNode',
      description:
        '查询无匹配结果时显示的内容。接受 ReactNode，因此可在无结果处放置链接或创建入口。会从 DOM 读取其渲染出的文本在礼貌性实时区域中播报；aria-hidden 的部分两处都不包含，不渲染任何文本的内容则不会播报。null 与 undefined 同样视为未提供，将回退到默认值；若要不渲染任何内容，请传入空字符串。',
      default: "'No results found'",
    },
    {
      name: 'emptySearchResultsText',
      type: 'string',
      description:
        '已弃用：改名为 emptySearchText，其类型由 string 放宽为 ReactNode，原有取值全部仍然有效。仍按已发布行为工作；两者同时设置时以 emptySearchText 为准。',
      default: "'No results found'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: '输入框是否被禁用。',
      default: 'false',
    },
    {
      name: 'isFocusableDisabled',
      type: 'boolean',
      description:
        '使用 aria-disabled 和只读状态保持禁用输入框可聚焦，以便访问调用方提供的禁用原因。它会阻止文本输入，但如果结果已打开，按 Enter 仍可选择高亮选项。',
      default: 'false',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: '挂载时自动聚焦输入框。',
      default: 'false',
    },
    {
      name: 'debounceMs',
      type: 'number',
      description: '触发搜索前的防抖延迟（毫秒）。同步数据源设置为 0。',
      default: '150',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: '用于调整下拉选项内边距的尺寸。',
      default: "'md'",
    },
    {
      name: 'anchorRef',
      type: 'RefObject<HTMLElement | null>',
      description: '用于下拉列表定位的锚点元素引用。未提供时使用输入框本身。',
    },
    {
      name: 'inputClassName',
      type: 'string',
      description: '输入元素的附加 Tailwind 类。',
    },
    {
      name: 'className',
      type: 'string',
      description: '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
    {
      name: 'inputTabIndex',
      type: 'number',
      description:
        '原生 tabIndex 的旧输入专用别名。提供时优先；未提供时保留原生属性。',
    },
    {
      name: 'onKeyDown',
      type: '(e: React.KeyboardEvent<HTMLInputElement>) => void',
      description:
        '在内部键盘导航之前调用的附加 keydown 处理函数。调用 e.preventDefault() 可跳过内部处理。',
    },
    {
      name: 'onChangeQuery',
      type: '(query: string) => void',
      description: '搜索查询文本变更时触发的回调。',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: '下拉列表打开或关闭时的回调。',
    },
    {
      name: 'inputId',
      type: 'string',
      description:
        '原生 id 的旧输入专用别名。提供时优先；未提供时保留原生属性。',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string',
      description:
        '原生 aria-describedby 的旧输入专用别名。提供时优先；未提供时保留原生属性。',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      description:
        '原生 aria-labelledby 的旧输入专用别名。提供时优先；未提供时保留原生属性。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'محرّك combobox قابل للتركيب يوفّر حقل إدخال مجردًا وبحثًا وتنقّلًا بلوحة المفاتيح وقائمة منسدلة منسّقة للنتائج. لا يعرض غلافًا لحقل الإدخال ولا حدًّا ولا رمزًا للقيمة المحددة. يركّبه Typeahead و Tokenizer للحقول القياسية.',
  propDescriptions: {
    searchSource: 'مصدر البيانات (SearchSource<T>) الذي يوفّر دالتي البحث والتهيئة الأولية؛ وتُلغي cancel البحث الجاري.',
    value: 'العنصر المحدد حاليًا.',
    onChange: 'يُستدعى عند تغيّر التحديد.',
    __queryEntries: 'ربط داخلي بين Tokenizer والمحرّك الأساسي (ليس واجهة برمجية عامة): إدخالات مشتقة من نص الاستعلام بدلًا من جلبها، مثل صف "Create ..." في Tokenizer. تُلحق بنتائج البحث بغض النظر عن minQueryLength؛ وتتلقى تلك النتائج لكي تتمكن من تخطي المكرر.',
    renderItem: 'دالة عرض مخصصة لعناصر القائمة المنسدلة.',
    placeholder: 'النص الإرشادي لحقل الإدخال.',
    hasEntriesOnFocus: 'يعرض نتائج التهيئة الأولية عند التركيز قبل الكتابة.',
    maxMenuItems: 'الحد الأقصى لعناصر القائمة المنسدلة المعروضة.',
    menuWidth: 'عرض القائمة المنسدلة المطلوب بالبكسل قبل تقييده بإطار العرض.',
    minQueryLength: 'الحد الأدنى لطول الاستعلام قبل استعلام مصدر البحث. دون هذا الحد لا يُجرى أي بحث وتبقى القائمة مغلقة.',
    emptySearchText: 'المحتوى المعروض عندما لا يطابق الاستعلام أي شيء. يقبل ReactNode، لذا يمكن أن تحمل النهاية المسدودة رابطًا أو صف إنشاء. يُعلَن في منطقة حية مهذبة بالنص الذي يعرضه، مقروءًا من DOM؛ وتبقى الأجزاء ذات aria-hidden خارج كليهما، والمحتوى الذي لا يعرض نصًا لا يُعلن شيئًا. تُعامَل null كأنها غير معطاة، مثل undefined، فيُستخدم الافتراضي؛ مرّر سلسلة نصية فارغة لعدم عرض أي شيء.',
    emptySearchResultsText: 'مهمل: أُعيدت تسميته إلى emptySearchText، الذي يقبل ReactNode بدلًا من سلسلة نصية، لذا تظل كل القيم الحالية صالحة. لا يزال يعمل تمامًا كما صدر؛ وتكون الأولوية لـ emptySearchText عند تعيين كليهما.',
    isDisabled: 'ما إذا كان حقل الإدخال معطَّلًا.',
    isFocusableDisabled: 'يُبقي حقل الإدخال المعطَّل قابلًا للتركيز باستخدام aria-disabled و readOnly لكي يظل سبب التعطيل الذي يملكه المستدعي قابلًا للاكتشاف. يمنع إدخال النص، لكن عند تطبيقه بعد أن تكون النتائج مفتوحة بالفعل، يظل بإمكان Enter تحديد الخيار المُبرز.',
    hasAutoFocus: 'يمنح حقل الإدخال التركيز تلقائيًا عند التركيب.',
    debounceMs: 'تأخير الارتداد بالملّي ثانية قبل تشغيل البحث. عيّنه إلى 0 للمصادر المتزامنة.',
    size: 'الحجم المستخدم لتحجيم حشو خيارات القائمة المنسدلة.',
    anchorRef: 'مرجع لعنصر المرساة لتحديد موضع القائمة المنسدلة. إذا لم يُوفَّر، يُستخدم حقل الإدخال نفسه.',
    inputClassName: 'أصناف Tailwind إضافية لعنصر الإدخال.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث يتجاوز أي صنف متعارض القيمة الافتراضية.',
    inputTabIndex: 'اسم بديل قديم خاص بحقل الإدخال للسمة الأصلية tabIndex. عند توفيره تكون له الأولوية؛ وإلا فتُحفظ tabIndex الأصلية.',
    onKeyDown: 'معالج keydown إضافي يُستدعى قبل التنقّل الداخلي بلوحة المفاتيح. استدعِ e.preventDefault() لتخطي المعالجة الداخلية.',
    onChangeQuery: 'دالة استدعاء تُنفَّذ عند تغيّر نص استعلام البحث.',
    onOpenChange: 'دالة استدعاء عند فتح القائمة المنسدلة أو إغلاقها.',
    inputId: 'اسم بديل قديم خاص بحقل الإدخال للسمة الأصلية id. عند توفيره تكون له الأولوية؛ وإلا فتُحفظ id الأصلية.',
    ariaDescribedBy: 'اسم بديل قديم خاص بحقل الإدخال للسمة الأصلية aria-describedby. عند توفيره تكون له الأولوية؛ وإلا فتُحفظ السمة الأصلية.',
    ariaLabelledBy: 'اسم بديل قديم خاص بحقل الإدخال للسمة الأصلية aria-labelledby. عند توفيره تكون له الأولوية؛ وإلا فتُحفظ السمة الأصلية.',
  },
  usage: {
    description: 'محرّك combobox قابل للتركيب يوفّر حقل إدخال مجردًا وبحثًا وتنقّلًا بلوحة المفاتيح وقائمة منسدلة منسّقة للنتائج. لا يعرض غلافًا لحقل الإدخال ولا حدًّا ولا رمزًا للقيمة المحددة. يركّبه Typeahead و Tokenizer للحقول القياسية.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم Typeahead أو Tokenizer للحقول القياسية؛ فهما يغلّفان BaseTypeahead بإطار حقل الإدخال وعرض القيمة المحددة اللذين يحذفهما عمدًا.',
      },
      {
        guidance: true,
        description: 'وفّر تسميتك المرئية الخاصة أو aria-label وغلافًا مخصصًا لحقل الإدخال لكي يحصل الـ combobox المجرد على اسم قابل للوصول ومعالجة للتركيز وحدّ وتخطيط.',
      },
      {
        guidance: true,
        description: 'مرّر anchorRef مشيرًا إلى الغلاف الخاص بك لكي تتموضع القائمة المنسدلة بالنسبة إلى إطار حقل الإدخال المخصص، لا إلى عنصر الإدخال المجرد فقط.',
      },
      {
        guidance: false,
        description: 'توقّع إطار حقل الإدخال أو عرض القيمة المحددة. فـ BaseTypeahead محرّك؛ والمستدعي يملك تلك الأجزاء المرئية.',
      },
      {
        guidance: false,
        description: 'استخدام BaseTypeahead عندما يكفي Typeahead أو Tokenizer؛ فالعمل الإضافي على الغلاف والتنسيق لا يُبرَّر إلا للتركيبات المخصصة فعلًا.',
      },
      {
        guidance: false,
        description: 'معاملة Escape كإلغاء لعمل المصدر المعلّق. فهو يُخفي النافذة المنبثقة الحالية، لكن استجابة متأخرة قد تعيد فتحها.',
      },
    ],
    anatomy: [
      {
        name: 'حقل الإدخال',
        required: true,
        description: 'حقل إدخال combobox مجرد. يوفّر المستدعي إطار الحقل المرئي والاسم القابل للوصول.',
      },
      {
        name: 'حالة التحميل',
        required: false,
        description: 'Spinner مُسمّى يُعرض بجانب حقل الإدخال أثناء انتظار مصدر غير متزامن، ما لم يتولَّ مالك مركّب مسار مؤشر الانشغال.',
      },
      {
        name: 'القائمة المنسدلة',
        required: false,
        description: 'سطح listbox مثبّت يحتوي على نتائج البحث الحالية أو نتائج التهيئة الأولية.',
      },
      {
        name: 'حالة الفراغ',
        required: false,
        description: 'خيار listbox معطَّل يُعرض بعد أن يُرجع بحث مكتمل عدم وجود نتائج.',
      },
      {
        name: 'عنوان مجموعة النتائج',
        required: false,
        description: 'تسمية مرئية لمجموعة من خيارات النتائج.',
      },
      {
        name: 'صف النتيجة',
        required: false,
        description: 'غلاف خيار يملك سلوك الإبراز والتحديد والمؤشر ولوحة المفاتيح.',
      },
      {
        name: 'محتوى العنصر الافتراضي',
        required: false,
        description: 'تسمية TypeaheadItem ومحتوى داعم اختياري يُعرضان داخل صف النتيجة.',
      },
      {
        name: 'محتوى العنصر الذي يعرضه المستدعي',
        required: false,
        description: 'محتوى المستدعي المُوفَّر عبر renderItem أو item.element داخل صف النتيجة الثابت.',
      },
      {
        name: 'حالة النتيجة المحددة',
        required: false,
        description: 'وزن الصف المحدد وعلامة الاختيار الختامية المعروضان عندما تطابق نتيجةٌ القيمة value.',
      },
    ],
  },
};

export const docsDense = {
  name: 'BaseTypeahead',
  isHiddenFromOverview: true,
  displayName: 'Base Typeahead',
  description:
    'Composable combobox engine providing a bare input and a styled result dropdown. Callers own input chrome and selected-value presentation.',
  usage: {
    bestPractices: [
      {
        guidance: true,
        description:
          'Use Typeahead or Tokenizer for standard fields; they add the input chrome and selected-value rendering BaseTypeahead omits.',
      },
      {
        guidance: true,
        description:
          'Provide a visible label or aria-label plus a custom wrapper with focus treatment, border, and layout.',
      },
      {
        guidance: true,
        description:
          'Pass anchorRef to your wrapper so the dropdown positions against your input chrome, not the bare input.',
      },
      {
        guidance: false,
        description:
          'Expect input chrome or selected-value rendering. The caller owns those visible parts.',
      },
      {
        guidance: false,
        description:
          'Use BaseTypeahead when Typeahead or Tokenizer suffice; extra work only pays off for custom compositions.',
      },
      {
        guidance: false,
        description:
          'Treat Escape as pending-work cancellation. It hides the popup, but a late response can reopen it.',
      },
    ],
  },
  propDescriptions: {
    searchSource: 'Data source w/ search+bootstrap methods.',
    value: 'Currently selected item.',
    onChange: 'Fired on selection change.',
    __queryEntries: 'internal (Tokenizer wiring): query-derived entries appended to results, e.g. Create row',
    renderItem: 'Custom dropdown item render.',
    placeholder: 'Input placeholder.',
    hasEntriesOnFocus: 'Bootstrap results on focus.',
    maxMenuItems: 'Max dropdown items.',
    menuWidth: 'Requested px width before viewport clamping.',
    minQueryLength:
      'Min query length before searching. Menu stays closed below it.',
    emptySearchText: 'Content when the query matched nothing. ReactNode.',
    emptySearchResultsText:
      'deprecated, use emptySearchText (ReactNode). still works as released; emptySearchText wins if both set.',
    isDisabled: 'Whether input disabled.',
    isFocusableDisabled:
      'Keeps disabled input focusable and blocks text entry; an already-open highlight can still be selected with Enter.',
    hasAutoFocus: 'Auto-focus on mount.',
    debounceMs: 'Search debounce ms. 0 for sync.',
    size: 'Dropdown option padding size.',
    anchorRef: 'Anchor for dropdown positioning. Defaults to input.',
    inputClassName: 'Additional Tailwind classes for input.',
    className: 'Standard BaseProps Tailwind classes for input.',
    inputTabIndex:
      'Legacy tabIndex alias; defined alias wins, otherwise native tabIndex passes through.',
    onKeyDown:
      'Keydown before internal nav. preventDefault() skips internal handling.',
    onChangeQuery: 'Fired on query text change.',
    onOpenChange: 'Fired on dropdown open/close.',
    inputId:
      'Legacy id alias; defined alias wins, otherwise native id passes through.',
    ariaDescribedBy:
      'Legacy aria-describedby alias; defined alias wins, otherwise native attribute passes through.',
    ariaLabelledBy:
      'Legacy aria-labelledby alias; defined alias wins, otherwise native attribute passes through.',
  },
};
