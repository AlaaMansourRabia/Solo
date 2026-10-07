/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Dialog',
    required: true,
    description: 'Modal surface that contains the command palette.',
  },
  {
    name: 'Input',
    required: true,
    description:
      'Search region containing the query field and its supporting visuals.',
  },
  {
    name: 'Search glyph',
    required: true,
    description: 'Search symbol rendered by Icon in the default Input.',
  },
  {
    name: 'Query field',
    required: true,
    description: 'Native text field used to enter a search query.',
  },
  {
    name: 'Loading spinner',
    required: false,
    description:
      'Spinner shown in the default Input while a search is pending.',
  },
  {
    name: 'List',
    required: true,
    description:
      'Scrollable listbox containing the current results or Empty state.',
  },
  {
    name: 'Item',
    required: false,
    description: 'Selectable command result rendered inside the List.',
  },
  {
    name: 'Group',
    required: false,
    description: 'Optional collection of Items that share a heading.',
  },
  {
    name: 'Group heading',
    required: false,
    description: 'Visible heading rendered for a Group.',
  },
  {
    name: 'Empty',
    required: false,
    description: 'Message shown when the current result set is empty.',
  },
  {
    name: 'Footer',
    required: false,
    description:
      'Footer region for default keyboard guidance or caller-provided content.',
  },
  {
    name: 'Keyboard shortcut',
    required: false,
    description:
      'Painted key badges rendered by Kbd in the default Footer guidance.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'CommandPalette',
  displayName: 'Command Palette',
  group: 'CommandPalette',
  category: 'Overlay',
  keywords: [
    'command',
    'spotlight',
    'launcher',
    'omnibox',
    'quicksearch',
    'palette',
    'finder',
    'search',
    'modal',
    'dialog',
    'navigation',
  ],
  description: 'Root component. Manages open state, search, keyboard navigation, and composition slots.',
  // Intentionally a contained isInline preview, not playground.overlay: the
  // component stays visible on load and knobs stay live, whereas a real
  // showModal() overlay makes the page inert — see ComponentPlaygroundConfig.overlay
  // in docs-types.ts.
  playground: {
    defaults: {
      isOpen: true,
      isInline: true,
      onOpenChange: undefined,
    },
  },
  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the command palette dialog is visible.',
      required: true,
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Called when the palette visibility changes.',
      required: true,
    },
    {
      name: 'searchSource',
      type: 'SearchSource<T>',
      description: 'Search source providing items via search(query) and bootstrap(). Use createStaticSource for static lists.',
      required: true,
    },
    {
      name: 'input',
      type: 'ReactNode',
      description: 'Input slot. Defaults to CommandPaletteInput with standard behavior.',
      default: '<CommandPaletteInput />',
      slotElements: [
        {
          __element: 'TextInput',
          props: {
            label: 'Input',
            placeholder: 'Type here...',
          },
        },
      ],
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description: 'Footer slot. Defaults to CommandPaletteFooter showing keyboard hints.',
      default: '<CommandPaletteFooter />',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Footer content',
        },
      ],
    },
    {
      name: 'renderItem',
      type: '(item: T, isSelected: boolean) => ReactNode',
      description: 'Per-item render function. Auto-grouping by auxiliaryData.group is preserved. When omitted, renders label text.',
    },
    {
      name: 'emptySearchText',
      type: 'ReactNode',
      description: 'Content shown when a search query returns no results.',
      default: "'No results'",
    },
    {
      name: 'emptyBootstrapText',
      type: 'ReactNode',
      description: 'Content shown when there is no search query and bootstrap() returns nothing.',
      default: "'Type to search'",
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled selected value for picker mode.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Called when the selected value changes in picker mode.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the command palette dialog.',
      default: "'Command palette'",
    },
    {
      name: 'width',
      type: 'number | string',
      description: 'Width of the dialog.',
      default: '640',
    },
    {
      name: 'maxHeight',
      type: 'number | string',
      description: 'Maximum height of the dialog.',
      default: '480',
    },
    {
      name: 'isInline',
      type: 'boolean',
      description: 'Renders command palette content inline without modal behavior. Automatically disables input auto-focus and initial highlighted-item auto-scroll. For documentation previews and showcases only.',
      default: 'false',
    },
  ],
  components: [
    {name: 'CommandPaletteInput'},
    {name: 'CommandPaletteList'},
    {name: 'CommandPaletteItem'},
    {name: 'CommandPaletteGroup'},
    {name: 'CommandPaletteFooter'},
    {name: 'CommandPaletteEmpty'},
  ],
  theming: {
    targets: [
      {className: 'solo-command-palette-empty'},
      {className: 'solo-command-palette-footer'},
      {className: 'solo-command-palette-group'},
      {className: 'solo-command-palette-group-heading'},
      {className: 'solo-command-palette-input'},
      {className: 'solo-command-palette-item'},
      {className: 'solo-command-palette-list'},
    ],
  },
  usage: {
    anatomy,
    description: 'CommandPalette is a searchable dialog for quick access to commands, navigation, and actions. Use it as a keyboard-driven launcher powered by SearchSource for filtering and selection.',
    bestPractices: [
      { guidance: true, description: 'Provide a searchSource with bootstrap results so users see useful options before typing.' },
      { guidance: true, description: 'Use auxiliaryData.group on items to automatically organize results into labeled sections.' },
      { guidance: false, description: 'Use CommandPalette for simple dropdowns or menus; use Menu or Selector for inline selections.' },
      { guidance: false, description: 'Add too many groups or items; curate results to keep the palette fast and scannable.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    anatomy,
    description: 'CommandPalette is a searchable dialog for quick access to commands, navigation, and actions. Use it as a keyboard-driven launcher powered by SearchSource for filtering and selection.',
    bestPractices: [
      { guidance: true, description: 'Provide a searchSource with bootstrap results so users see useful options before typing.' },
      { guidance: true, description: 'Use auxiliaryData.group on items to automatically organize results into labeled sections.' },
      { guidance: false, description: 'Use CommandPalette for simple dropdowns or menus; use Menu or Selector for inline selections.' },
      { guidance: false, description: 'Add too many groups or items; curate results to keep the palette fast and scannable.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'المكوّن الجذر. يدير حالة الفتح والبحث والتنقّل بلوحة المفاتيح وفتحات التركيب.',
  propDescriptions: {
    isOpen: 'ما إذا كان مربع حوار لوحة الأوامر ظاهرًا.',
    onOpenChange: 'تُستدعى عند تغيّر ظهور لوحة الأوامر.',
    searchSource: 'مصدر البحث الذي يوفّر العناصر عبر search(query) وbootstrap(). استخدم createStaticSource للقوائم الثابتة.',
    input: 'فتحة حقل الإدخال. القيمة الافتراضية CommandPaletteInput بالسلوك القياسي.',
    footer: 'فتحة التذييل. القيمة الافتراضية CommandPaletteFooter الذي يعرض تلميحات لوحة المفاتيح.',
    renderItem: 'دالة عرض لكل عنصر. يُحافَظ على التجميع التلقائي حسب auxiliaryData.group. عند حذفها يُعرض نص التسمية.',
    emptySearchText: 'المحتوى المعروض عندما لا يُرجع استعلام البحث أي نتائج.',
    emptyBootstrapText: 'المحتوى المعروض عند عدم وجود استعلام بحث وعندما لا تُرجع bootstrap() شيئًا.',
    value: 'القيمة المحددة المتحكَّم بها في وضع الاختيار.',
    onValueChange: 'تُستدعى عند تغيّر القيمة المحددة في وضع الاختيار.',
    label: 'التسمية القابلة للوصول لمربع حوار لوحة الأوامر.',
    width: 'عرض مربع الحوار.',
    maxHeight: 'أقصى ارتفاع لمربع الحوار.',
    isInline: 'يعرض محتوى لوحة الأوامر مضمّنًا دون سلوك نمطي (modal). يعطّل تلقائيًا التركيز التلقائي على حقل الإدخال والتمرير التلقائي إلى العنصر المميَّز الأولي. مخصص لمعاينات التوثيق والعروض التوضيحية فقط.',
  },
  usage: {
    description: 'CommandPalette مربع حوار قابل للبحث للوصول السريع إلى الأوامر والتنقّل والإجراءات. استخدمه كمُشغِّل يعتمد على لوحة المفاتيح ويعمل بواسطة SearchSource للتصفية والاختيار.',
    bestPractices: [
      {
        guidance: true,
        description: 'وفّر searchSource بنتائج bootstrap كي يرى المستخدمون خيارات مفيدة قبل الكتابة.',
      },
      {
        guidance: true,
        description: 'استخدم auxiliaryData.group على العناصر لتنظيم النتائج تلقائيًا في أقسام ذات تسميات.',
      },
      {
        guidance: false,
        description: 'استخدام CommandPalette للقوائم المنسدلة أو القوائم البسيطة؛ استخدم Menu أو Selector للاختيارات المضمّنة.',
      },
      {
        guidance: false,
        description: 'إضافة عدد كبير جدًا من المجموعات أو العناصر؛ انتقِ النتائج بعناية لتبقى اللوحة سريعة وسهلة المسح البصري.',
      },
    ],
    anatomy: [
      {
        name: 'مربع الحوار',
        required: true,
        description: 'سطح نمطي يحتوي على لوحة الأوامر.',
      },
      {
        name: 'حقل الإدخال',
        required: true,
        description: 'منطقة البحث التي تحتوي على حقل الاستعلام وعناصره المرئية المساندة.',
      },
      {
        name: 'رمز البحث',
        required: true,
        description: 'رمز البحث المعروض بواسطة Icon في Input الافتراضي.',
      },
      {
        name: 'حقل الاستعلام',
        required: true,
        description: 'حقل نصي أصلي يُستخدم لإدخال استعلام البحث.',
      },
      {
        name: 'مؤشر التحميل',
        required: false,
        description: 'مؤشر دوّار يظهر في Input الافتراضي أثناء انتظار البحث.',
      },
      {
        name: 'القائمة',
        required: true,
        description: 'مربع قائمة قابل للتمرير يحتوي على النتائج الحالية أو الحالة الفارغة.',
      },
      {
        name: 'العنصر',
        required: false,
        description: 'نتيجة أمر قابلة للاختيار تُعرض داخل القائمة.',
      },
      {
        name: 'المجموعة',
        required: false,
        description: 'مجموعة اختيارية من العناصر تشترك في عنوان واحد.',
      },
      {
        name: 'عنوان المجموعة',
        required: false,
        description: 'عنوان مرئي يُعرض للمجموعة.',
      },
      {
        name: 'الحالة الفارغة',
        required: false,
        description: 'رسالة تظهر عندما تكون مجموعة النتائج الحالية فارغة.',
      },
      {
        name: 'التذييل',
        required: false,
        description: 'منطقة التذييل لإرشادات لوحة المفاتيح الافتراضية أو لمحتوى يوفّره المستدعي.',
      },
      {
        name: 'اختصار لوحة المفاتيح',
        required: false,
        description: 'شارات مفاتيح مرسومة يعرضها Kbd ضمن إرشادات Footer الافتراضية.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'searchSource-driven command palette dialog; filtering, keyboard nav, grouping, selection; same SearchSource interface as Typeahead',
  usage: {
    anatomy,
    description: 'CommandPalette is a searchable dialog for quick access to commands, navigation, and actions. Use it as a keyboard-driven launcher powered by SearchSource for filtering and selection.',
    bestPractices: [
      { guidance: true, description: 'Provide a searchSource with bootstrap results so users see useful options before typing.' },
      { guidance: true, description: 'Use auxiliaryData.group on items to automatically organize results into labeled sections.' },
      { guidance: false, description: 'Use CommandPalette for simple dropdowns or menus; use Menu or Selector for inline selections.' },
      { guidance: false, description: 'Add too many groups or items; curate results to keep the palette fast and scannable.' },
    ],
  },
};
