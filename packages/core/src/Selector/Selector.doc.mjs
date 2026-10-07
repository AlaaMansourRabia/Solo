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
      'Shared clear action that removes the selected value when hasClear is enabled.',
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
    description: 'Selectable row for one supplied option.',
  },
  {
    name: 'SelectorOption-rendered content',
    required: false,
    description:
      'Option content rendered with SelectorOption, either by the default renderer or by renderOption when it returns SelectorOption.',
  },
  {
    name: 'Bare caller-rendered option content',
    required: false,
    description:
      'Arbitrary content returned directly by renderOption without opting into SelectorOption.',
  },
  {
    name: 'Option selection indicator',
    required: false,
    description:
      'Resolved selection mark rendered for each option in its checked or unchecked state. Its layout space collapses when the resolved indicator draws nothing.',
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
  name: 'Selector',
  displayName: 'Selector',
  group: 'Selector',
  category: 'Form Controls',
  keywords: [
    'selector',
    'select',
    'dropdown',
    'combobox',
    'picker',
    'listbox',
    'chooser',
    'autocomplete',
    'option',
    'selectmenu',
  ],
  theming: {
    targets: [
      {
        className: 'solo-selector',
        visualProps: ['variant', 'size', 'status'],
        states: ['disabled', 'readonly'],
      },
      {className: 'solo-selector-option'},
      {
        className: 'solo-selector-option-row',
        visualProps: ['size'],
        states: ['selected', 'disabled'],
      },
      {className: 'solo-selector-search'},
      {className: 'solo-selector-section-heading'},
      {className: 'solo-selector-empty-state'},
      {
        className: 'solo-selector-clear-icon',
        deprecatedFor: 'input-clear-icon',
      },
      {className: 'solo-selector-indicator-icon', states: ['state']},
      {className: 'solo-selector-check'},
      {className: 'solo-selector-popup'},
    ],
  },
  description: 'Dropdown selector for choosing from a list of options.',
  playground: {
    defaults: {
      label: 'Fruit',
      options: [
        {value: 'apple', label: 'Apple'},
        {value: 'orange', label: 'Orange'},
        {value: 'banana', label: 'Banana'},
      ],
    },
  },
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text for accessibility.',
      required: true,
    },
    {
      name: 'options',
      type: 'SelectorOption[]',
      description:
        'Array of items: strings, objects with value/label/description/icon/disabled, dividers ({type: "divider"}), or sections ({type: "section", title, options}).',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'Currently selected value.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback fired when the selection changes.',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        'Shows a clear (×) button when a value is selected. When true, onChange also accepts null to signal the user cleared the selection.',
      default: 'false',
    },
    {
      name: 'hasSearch',
      type: 'boolean',
      description:
        'Whether to show a search input for filtering options. As the user types, the match count (or "No results found") is announced to screen readers via a polite live region. The search field has built-in affordances: a leading magnifier icon and, once a query is typed, a trailing clear (✕) button that resets the query and returns focus to the input.',
      default: 'false',
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
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the selector.',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Makes the selector read-only: the selected value stays visible, focusable, and included in form submission, and retains its combobox identity with aria-readonly. The selection surface, clear action, and disclosure indicator are removed. Unlike isDisabled, the control is not dimmed. isDisabled takes precedence when both are set.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for form submissions. Renders a hidden input carrying the selected value, like a native select.',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the selector is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the trigger focusable via aria-disabled (activation stays blocked). Use this instead of wrapping a disabled Selector in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
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
      name: 'isOptional',
      type: 'boolean',
      description: 'Marks the field as optional.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the field as required.',
      default: 'false',
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
      default: "'attached' for input selectors; 'detached' for ghost selectors",
    },
    {
      name: 'renderOption',
      type: '(option: SelectorOptionData) => ReactNode',
      description:
        'Custom render function for each selectable option in the dropdown. Use this instead of JSX children; dividers and sections are rendered by the selector.',
    },
    {
      name: 'renderValue',
      type: '(option: SelectorOptionData) => ReactNode',
      description:
        'Custom render function for the selected option inside the closed trigger. A one-line value follows the active size token, including compact or wide spacing scales with icons or a clear control. Padding accommodates the trigger line box, and each extra line grows the control by one line (28/32/36 for one line and 48/52/56 for two with the default tokens). Content inherits the trigger line height; content that sets a larger font should set its own line height so the trigger grows to fit it. Inside an InputGroup the group owns the row height: a SelectorOption folds onto one line and ellipsizes, and any taller node is cut off at the row.',
    },
    {
      name: 'indicatorPosition',
      type: "'start' | 'end'",
      description:
        'Which logical edge of the option row carries a rendered selection mark. An empty mark consumes no space, so selected and unselected labels may shift or have different available width. end is the house convention shared with Typeahead and CommandPalette.',
      default: "'end'",
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
      name: 'isLoading',
      type: 'boolean',
      description: 'Shows a loading spinner in the trigger.',
      default: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [{name: 'SelectorOption'}],
  usage: {
    description:
      'A dropdown selector for choosing a single value from a list of options. Supports labels, validation, descriptions, and required/optional states. Use it in forms and settings when presenting a moderate number of options. Keyboard typeahead matches a native select: typing on the focused closed trigger selects the matching option directly, repeated presses cycle through options sharing a first letter, and spaces count as match characters ("new y" reaches "New York"). With the menu open, typing moves the highlight and Enter commits. With hasSearch, typing on the closed trigger opens the popup and seeds the search input.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a visible label so users understand what they are selecting.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to organize options when the list exceeds ~8 items.',
      },
      {
        guidance: true,
        description:
          'Use renderOption for custom option rows. Do not pass SelectorOption directly as JSX children.',
      },
      {
        guidance: true,
        description:
          'Set a meaningful placeholder that hints at the expected selection (e.g. "Choose a country" not "Select...").',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup only when the selector needs a short prefix or suffix addon as part of one decorated input surface.',
      },
      {
        guidance: true,
        description:
          'Use variant="ghost" when a selector sits in a toolbar with ghost buttons. If validation status is needed there, prefer statusVariant="tooltip" so the toolbar height stays compact.',
      },
      {
        guidance: true,
        description:
          'Use presentation="adaptive" when the selector should become a bottom sheet on compact touch screens.',
      },
      {
        guidance: false,
        description:
          'Use for action menus; use Dropdown Menu for triggering commands or navigation.',
      },
      {
        guidance: false,
        description:
          'Use when there are only two options; use a SegmentedControl or radio buttons instead.',
      },
      {
        guidance: false,
        description:
          'Use Selector for navigation; links should be links, not dropdown options.',
      },
      {
        guidance: false,
        description:
          'Use for yes/no or on/off choices; use Switch or CheckboxInput instead.',
      },
      {
        guidance: false,
        description:
          'Put more than ~20 options without sections; consider Typeahead for large lists.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Selector in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy,
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'A dropdown selector for choosing a single value from a list of options. Supports labels, validation, descriptions, and required/optional states. Use it in forms and settings when presenting a moderate number of options. Keyboard typeahead matches a native select: typing on the focused closed trigger selects the matching option directly, repeated presses cycle through options sharing a first letter, and spaces count as match characters ("new y" reaches "New York"). With the menu open, typing moves the highlight and Enter commits. With hasSearch, typing on the closed trigger opens the popup and seeds the search input.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a visible label so users understand what they are selecting.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to organize options when the list exceeds ~8 items.',
      },
      {
        guidance: true,
        description:
          'Use renderOption for custom option rows. Do not pass SelectorOption directly as JSX children.',
      },
      {
        guidance: true,
        description:
          'Set a meaningful placeholder that hints at the expected selection (e.g. "Choose a country" not "Select...").',
      },
      {
        guidance: false,
        description:
          'Use for action menus; use Dropdown Menu for triggering commands or navigation.',
      },
      {
        guidance: false,
        description:
          'Use when there are only two options; use a SegmentedControl or radio buttons instead.',
      },
      {
        guidance: false,
        description:
          'Use Selector for navigation; links should be links, not dropdown options.',
      },
      {
        guidance: false,
        description:
          'Use for yes/no or on/off choices; use Switch or CheckboxInput instead.',
      },
      {
        guidance: false,
        description:
          'Put more than ~20 options without sections; consider Typeahead for large lists.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Selector in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy,
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'محدِّد منسدل للاختيار من قائمة خيارات.',
  propDescriptions: {
    label: 'نص التسمية لأغراض إمكانية الوصول.',
    options:
      'مصفوفة عناصر: سلاسل نصية، أو كائنات تحتوي value/label/description/icon/disabled، أو فواصل ({type: "divider"})، أو أقسام ({type: "section", title, options}).',
    value: 'القيمة المحدّدة حاليًا.',
    onChange: 'دالة استدعاء تُطلق عند تغيّر التحديد.',
    hasClear:
      'يعرض زر مسح (×) عند تحديد قيمة. عندما تكون true يقبل onChange أيضًا القيمة null للإشارة إلى أن المستخدم مسح التحديد.',
    hasSearch:
      'ما إذا كان يُعرض حقل بحث لتصفية الخيارات. أثناء الكتابة يُعلَن عدد النتائج المطابقة (أو "No results found") لقارئ الشاشة عبر منطقة حية مهذّبة. يتضمن حقل البحث وسائل مدمجة: أيقونة عدسة مكبّرة في البداية، وبعد كتابة استعلام زر مسح (✕) في النهاية يعيد تعيين الاستعلام ويعيد التركيز إلى الحقل.',
    searchPlaceholder: 'النص الإرشادي لحقل البحث.',
    emptyText:
      'المحتوى المعروض في لوحة القائمة المنسدلة عند عدم وجود خيارات لعرضها، ويُعلَن في منطقة حية مهذّبة عند فتح اللوحة. الإعلان هو النص الذي يعرضه هذا المحتوى مقروءًا من DOM، لذا يُعلَن العنصر كما كُتب وتُستبعد أجزاء aria-hidden من كليهما. لا يظهر أثناء isLoading.',
    emptySearchText:
      'المحتوى المعروض في لوحة القائمة المنسدلة عندما لا يطابق استعلام البحث أي خيار، ويُعلَن في الوقت نفسه في منطقة حية مهذّبة. الإعلان هو النص الذي يعرضه هذا المحتوى مقروءًا من DOM، لذا يُعلَن العنصر كما كُتب وتُستبعد أجزاء aria-hidden من كليهما.',
    placeholder: 'النص الإرشادي المعروض عند عدم تحديد قيمة.',
    size: 'نمط حجم المحدِّد.',
    variant:
      'نمط المشغّل المرئي. input هو معالجة حقل الإدخال ذي الحدود للنماذج؛ وghost بلا حدود ويطابق أزرار ghost للاستخدام في أشرطة الأدوات.',
    isDisabled: 'يعطّل المحدِّد.',
    isReadOnly:
      'يجعل المحدِّد للقراءة فقط: تبقى القيمة المحدّدة ظاهرة وقابلة للتركيز ومضمّنة في إرسال النموذج، ويحتفظ بهوية combobox مع aria-readonly. تُزال واجهة التحديد وإجراء المسح ومؤشر الكشف. وعلى خلاف isDisabled لا يُعتَّم عنصر التحكم. وتكون الأولوية لـ isDisabled عند تعيين الاثنين.',
    htmlName:
      'سمة name في HTML لإرسال النماذج. يعرض حقل إدخال مخفيًا يحمل القيمة المحدّدة، مثل عنصر select الأصلي.',
    disabledMessage:
      'يوضّح سبب تعطيل المحدِّد. مع isDisabled يعرض تلميحًا عند المرور أو تركيز لوحة المفاتيح ويُبقي المشغّل قابلًا للتركيز عبر aria-disabled (مع بقاء التفعيل محظورًا). استخدمه بدلًا من تغليف Selector معطَّل في Tooltip؛ إذ تبتلع عناصر التحكم المعطَّلة أحداث المرور التي يحتاجها Tooltip الخارجي.',
    isLabelHidden: 'يُخفي التسمية بصريًا مع إبقائها قابلة للوصول.',
    description: 'نص مساعد يُعرض أسفل التسمية.',
    isOptional: 'يميّز الحقل بأنه اختياري.',
    isRequired: 'يميّز الحقل بأنه مطلوب.',
    status: 'حالة التحقق مع رسالة اختيارية.',
    statusVariant:
      'كيفية وضع رسالة الحالة بالنسبة إلى حقل الإدخال. attached تتداخل مباشرةً أسفل الحقل ذي الحدود وهي صالحة للنمط input فقط؛ وتفصل محدِّدات ghost رسائل الحالة attached افتراضيًا. استخدم tooltip لعناصر التحكم المدمجة في أشرطة الأدوات.',
    renderOption:
      'دالة عرض مخصّصة لكل خيار قابل للتحديد في القائمة المنسدلة. استخدمها بدلًا من عناصر JSX الأبناء؛ إذ يعرض المحدِّد الفواصل والأقسام بنفسه.',
    renderValue:
      'دالة عرض مخصّصة للخيار المحدّد داخل المشغّل المغلق. تتبع القيمة ذات السطر الواحد رمز تصميم الحجم النشط، بما في ذلك مقاييس التباعد المدمجة أو الواسعة مع الأيقونات أو عنصر المسح. يستوعب الحشو صندوق سطر المشغّل، وكل سطر إضافي يزيد ارتفاع عنصر التحكم بسطر واحد (28/32/36 لسطر واحد و48/52/56 لسطرين مع رموز التصميم الافتراضية). يرث المحتوى ارتفاع سطر المشغّل؛ والمحتوى الذي يعيّن خطًا أكبر ينبغي أن يعيّن ارتفاع سطره الخاص لينمو المشغّل ليلائمه. داخل InputGroup تتولى المجموعة ارتفاع الصف: يُطوى SelectorOption في سطر واحد ويُقتطع بعلامة حذف، وأي عقدة أطول تُقص عند حدود الصف.',
    indicatorPosition:
      'أيّ حافة منطقية لصف الخيار تحمل علامة التحديد المعروضة. لا تشغل العلامة الفارغة أي مساحة، لذا قد تنزاح التسميات المحدّدة وغير المحدّدة أو يختلف العرض المتاح لها. end هو العرف المعتمد المشترك مع Typeahead وCommandPalette.',
    presentation:
      'طريقة عرض قائمة الخيارات. adaptive تستخدم ورقة سفلية على شاشات اللمس المدمجة ونافذة منبثقة مثبّتة في غير ذلك.',
    width:
      'عرض الحقل (الرقم = بكسلات، والسلسلة تُستخدم كما هي، مثل "100%"). يحدّد حجم الحقل كاملًا (التسمية وعنصر التحكم والحالة) لتبقى متحاذية.',
    startIcon: 'أيقونة تُعرض في بداية مشغّل المحدِّد.',
    isLoading: 'يعرض مؤشر تحميل دوّارًا في المشغّل.',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description:
      'محدِّد منسدل لاختيار قيمة واحدة من قائمة خيارات. يدعم التسميات والتحقق والأوصاف وحالتي المطلوب والاختياري. استخدمه في النماذج والإعدادات عند عرض عدد متوسط من الخيارات. يطابق البحث بالكتابة عبر لوحة المفاتيح سلوك select الأصلي: الكتابة على المشغّل المغلق المُركَّز عليه تحدّد الخيار المطابق مباشرةً، والضغط المتكرر يتنقّل بين الخيارات التي تبدأ بالحرف نفسه، وتُحتسب المسافات ضمن أحرف المطابقة ("new y" تصل إلى "New York"). ومع فتح القائمة تنقل الكتابة الإبراز ويعتمد Enter الاختيار. ومع hasSearch تفتح الكتابة على المشغّل المغلق النافذة المنبثقة وتملأ حقل البحث.',
    bestPractices: [
      {
        guidance: true,
        description: 'وفّر تسمية مرئية ليفهم المستخدمون ما الذي يحدّدونه.',
      },
      {
        guidance: true,
        description: 'استخدم الأقسام والفواصل لتنظيم الخيارات عندما تتجاوز القائمة نحو 8 عناصر.',
      },
      {
        guidance: true,
        description:
          'استخدم renderOption لصفوف الخيارات المخصّصة. لا تمرّر SelectorOption مباشرةً كعناصر JSX أبناء.',
      },
      {
        guidance: true,
        description:
          'عيّن نصًا إرشاديًا ذا معنى يلمّح إلى الاختيار المتوقع (مثل "Choose a country" لا "Select...").',
      },
      {
        guidance: true,
        description:
          'استخدمه داخل InputGroup فقط عندما يحتاج المحدِّد إلى إضافة بادئة أو لاحقة قصيرة كجزء من سطح إدخال مزخرف واحد.',
      },
      {
        guidance: true,
        description:
          'استخدم variant="ghost" عندما يقع المحدِّد في شريط أدوات مع أزرار ghost. وإن لزمت حالة تحقق هناك ففضّل statusVariant="tooltip" ليبقى ارتفاع شريط الأدوات مدمجًا.',
      },
      {
        guidance: true,
        description:
          'استخدم presentation="adaptive" عندما ينبغي أن يصبح المحدِّد ورقة سفلية على شاشات اللمس المدمجة.',
      },
      {
        guidance: false,
        description: 'لا تستخدمه لقوائم الإجراءات؛ استخدم Dropdown Menu لتشغيل الأوامر أو التنقّل.',
      },
      {
        guidance: false,
        description:
          'لا تستخدمه عند وجود خيارين فقط؛ استخدم SegmentedControl أو أزرار الاختيار بدلًا منه.',
      },
      {
        guidance: false,
        description: 'لا تستخدم Selector للتنقّل؛ فالروابط ينبغي أن تكون روابط لا خيارات منسدلة.',
      },
      {
        guidance: false,
        description:
          'لا تستخدمه لاختيارات نعم/لا أو تشغيل/إيقاف؛ استخدم Switch أو CheckboxInput بدلًا منه.',
      },
      {
        guidance: false,
        description: 'لا تضع أكثر من نحو 20 خيارًا دون أقسام؛ وفكّر في Typeahead للقوائم الكبيرة.',
      },
      {
        guidance: false,
        description:
          'لا تغلّف Selector معطَّلًا في Tooltip لتوضيح سبب تعطيله؛ إذ تبتلع المشغّلات المعطَّلة أحداث المرور التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'الحقل',
        required: false,
        description:
          'غلاف Field مستقل يوفّر التسمية والمحتوى الداعم الاختياري؛ ويُحذف داخل InputGroup.',
      },
      {
        name: 'المشغّل',
        required: true,
        description:
          'عنصر تحكم مرسوم يعرض التحديد الحالي أو النص الإرشادي ويفتح واجهة التحديد عندما يكون قابلًا للتحرير.',
      },
      {
        name: 'أيقونة البداية المعروضة عبر Icon',
        required: false,
        description: 'أيقونة دلالية اختيارية في البداية أو مكوّن أيقونة يُعرض عبر Icon.',
      },
      {
        name: 'محتوى البداية الذي يعرضه المستدعي',
        required: false,
        description: 'محتوى React اختياري عشوائي يُعرض مباشرةً في بداية المشغّل.',
      },
      {
        name: 'زر مسح المشغّل',
        required: false,
        description: 'إجراء مسح مشترك يزيل القيمة المحدّدة عند تفعيل hasClear.',
      },
      {
        name: 'أيقونة الحالة',
        required: false,
        description: 'رمز الحالة المعروض مكان مؤشر الكشف للحالة attached أو tooltip.',
      },
      {
        name: 'أيقونة المؤشر',
        required: false,
        description: 'سهم في النهاية يظهر حين لا يحل عرض الحالة محله؛ ويعكس حالة الطيّ أو التوسيع.',
      },
      {
        name: 'صف البحث',
        required: false,
        description: 'ترويسة اللوحة مع حقل بحث بلا حدود وإجراء مسح اختياري.',
      },
      {
        name: 'أيقونة البحث',
        required: false,
        description: 'عدسة مكبّرة في البداية تُعرض عبر Icon داخل صف البحث.',
      },
      {
        name: 'زر مسح البحث',
        required: false,
        description: 'إجراء مسح مشترك يظهر في صف البحث ما دام هناك استعلام.',
      },
      {
        name: 'صف الخيار',
        required: false,
        description: 'صف قابل للتحديد لخيار مورَّد واحد.',
      },
      {
        name: 'محتوى معروض عبر SelectorOption',
        required: false,
        description:
          'محتوى الخيار المعروض باستخدام SelectorOption، إما عبر دالة العرض الافتراضية أو عبر renderOption عندما تُعيد SelectorOption.',
      },
      {
        name: 'محتوى خيار خام يعرضه المستدعي',
        required: false,
        description: 'محتوى عشوائي تُعيده renderOption مباشرةً دون اعتماد SelectorOption.',
      },
      {
        name: 'مؤشر تحديد الخيار',
        required: false,
        description:
          'علامة التحديد المحسوبة التي تُعرض لكل خيار في حالته المحدّدة أو غير المحدّدة. تنطوي مساحتها في التخطيط عندما لا يرسم المؤشر المحسوب شيئًا.',
      },
      {
        name: 'فاصل الخيارات',
        required: false,
        description: 'فاصل يُورَّد في بيانات options العامة للفصل بين مجموعات الخيارات المتجاورة.',
      },
      {
        name: 'عنوان القسم',
        required: false,
        description: 'عنوان مرئي لمجموعة مسمّاة من صفوف الخيارات.',
      },
      {
        name: 'الحالة الفارغة',
        required: false,
        description:
          'رسالة تظهر عندما لا يحتوي محتوى اللوحة المشترك على خيارات أو لا توجد نتائج بحث مطابقة.',
      },
      {
        name: 'النافذة المنبثقة للمؤشر',
        required: false,
        description: 'سطح مرسوم مثبّت يستضيف محتوى اللوحة المشترك في عرض النافذة المنبثقة.',
      },
      {
        name: 'عنوان ورقة اللمس',
        required: false,
        description: 'عنوان فوق محتوى اللوحة المشترك في عرض الورقة السفلية.',
      },
      {
        name: 'ورقة اللمس',
        required: false,
        description: 'سطح BottomSheet يستضيف محتوى اللوحة نفسه في عرض الورقة السفلية.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    description:
      'A dropdown selector for choosing a single value from a list of options. Supports labels, validation, descriptions, and required/optional states. Use it in forms and settings when presenting a moderate number of options. Keyboard typeahead matches a native select: typing on the focused closed trigger selects the matching option directly, repeated presses cycle through options sharing a first letter, and spaces count as match characters ("new y" reaches "New York"). With the menu open, typing moves the highlight and Enter commits. With hasSearch, typing on the closed trigger opens the popup and seeds the search input.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a visible label so users understand what they are selecting.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to organize options when the list exceeds ~8 items.',
      },
      {
        guidance: true,
        description:
          'renderOption for custom rows; do not pass SelectorOption as JSX children.',
      },
      {
        guidance: true,
        description:
          'Set a meaningful placeholder that hints at the expected selection (e.g. "Choose a country" not "Select...").',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup only when the selector needs a short prefix or suffix addon.',
      },
      {
        guidance: true,
        description:
          'Use variant="ghost" in toolbars with ghost buttons; prefer statusVariant="tooltip" for compact validation status.',
      },
      {
        guidance: false,
        description:
          'Use for action menus; use Dropdown Menu for triggering commands or navigation.',
      },
      {
        guidance: false,
        description:
          'Use when there are only two options; use a SegmentedControl or radio buttons instead.',
      },
      {
        guidance: false,
        description:
          'Use Selector for navigation; links should be links, not dropdown options.',
      },
      {
        guidance: false,
        description:
          'Use for yes/no or on/off choices; use Switch or CheckboxInput instead.',
      },
      {
        guidance: false,
        description:
          'Put more than ~20 options without sections; consider Typeahead for large lists.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Selector in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy,
  },
};
