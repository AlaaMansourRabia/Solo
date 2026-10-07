/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Trigger area',
    required: true,
    description:
      'Caller-provided region that accepts right-click, keyboard context-menu, and long-press input.',
  },
  {
    name: 'Pointer menu surface',
    required: false,
    description:
      'Cursor-positioned menu panel used by the pointer presentation.',
  },
  {
    name: 'Pointer action row',
    required: false,
    description:
      'DropdownMenu-owned action, selectable option, or submenu row in the pointer presentation.',
  },
  {
    name: 'Touch sheet frame',
    required: false,
    description:
      'BottomSheet panel, content area, handle, and optional scrim that host touch actions.',
  },
  {
    name: 'Touch menu surface',
    required: false,
    description:
      'ContextMenu-owned content panel rendered inside the touch sheet frame.',
  },
  {
    name: 'Touch action list',
    required: false,
    description: 'Spacious List that groups data-driven touch actions.',
  },
  {
    name: 'Touch action row',
    required: false,
    description:
      'ListItem button used for a data-driven action or drill-in entry in the touch presentation.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ContextMenu',
  displayName: 'Context Menu',
  group: 'ContextMenu',
  category: 'Action',
  isHiddenFromOverview: true,
  keywords: [
    'contextmenu',
    'right-click',
    'menu',
    'popover',
    'actions',
    'context',
  ],
  theming: {
    targets: [{className: 'solo-context-menu'}],
    vars: [
      {
        name: '--_dropdown-menu-radius',
        description: 'Border radius of the menu popup',
        default: 'var(--radius-container)',
        private: true,
      },
      {
        name: '--_dropdown-menu-padding',
        description: 'Inner padding of the menu popup',
        default: 'var(--spacing-1)',
        private: true,
      },
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_dropdown-menu-radius']},
      {property: 'padding', vars: ['--_dropdown-menu-padding']},
    ],
  },
  description:
    'A context menu that appears on right-click at the cursor position. Wraps trigger content as children.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'The trigger area: right-click on this content to open the menu.',
      required: true,
    },
    {
      name: 'items',
      type: 'ContextMenuOption[]',
      description:
        'Array of menu entries. Each entry is one of: an action item `{label, onClick?, icon?, isDisabled?, variant?, items?}` (nested `items` open a flyout in popover presentation and drill into a new view in bottom-sheet presentation; variant `"destructive"` renders it in the error color), a divider `{type: "divider"}`, or a section `{type: "section", title?, items: [...action items]}`.',
      required: true,
    },
    {
      name: 'menuContent',
      type: 'ReactNode',
      description:
        'Custom JSX menu content for compound mode. Use instead of items for dynamic or stateful menus.',
    },
    {
      name: 'menuWidth',
      type: 'number | string',
      description: 'Custom menu width.',
      default: "'160px'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size of menu items: controls padding density.',
      default: "'md'",
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name for the menu surface, announced when it opens.',
      default: "'Context menu'",
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Callback fired when the menu opens or closes.',
    },
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'adaptive'",
      description:
        'Presentation policy. `popover` opens at the pointer position, `bottom-sheet` always uses an action sheet, and `adaptive` uses the BottomSheet at 768px and below when the primary pointer is coarse.',
      default: "'popover'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'When true, right-click shows the native browser context menu instead.',
      default: 'false',
    },
    {
      name: 'triggerAs',
      type: "'div' | 'span'",
      description:
        "The element the trigger wrapper renders as. 'div' is a block; 'span' an inline wrapper, so a reference inside prose can own a context menu without breaking the text flow.",
      default: "'div'",
    },
  ],
  components: [{name: 'ContextMenuItem'}],
  usage: {
    anatomy,
    description:
      'A right-click context menu that appears at the cursor position. Use to provide contextual actions for specific elements or regions without cluttering the UI with visible buttons.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep menu items concise and action-oriented; users expect quick access to contextual actions.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to group related actions when the menu has many items.',
      },
      {
        guidance: true,
        description:
          'Use `presentation="adaptive"` when right-click should remain cursor-positioned on desktop while long-press opens a reachable BottomSheet on compact touch devices.',
      },
      {
        guidance: true,
        description:
          'Ensure all context menu actions are also accessible via other UI elements for keyboard-only users.',
      },
      {
        guidance: true,
        description:
          'Keep a visible MoreMenu or equivalent trigger for important mobile actions; long-press must not be the only route.',
      },
      {
        guidance: false,
        description:
          'Use a ContextMenu as the only way to access important actions; not all users know to right-click.',
      },
      {
        guidance: false,
        description:
          'Place more than 10–12 items in a single menu without grouping them into sections.',
      },
    ],
  },
  playground: {
    defaults: {
      children: {
        __element: 'Card',
        props: {padding: 6},
        children: {
          __element: 'Text',
          props: {color: 'secondary'},
          children: 'Right-click this area',
        },
      },
      items: [
        {label: 'Edit'},
        {label: 'Duplicate'},
        {type: 'divider'},
        {label: 'Delete'},
      ],
    },
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      '右键点击时在光标位置出现的上下文菜单。用于为特定元素或区域提供上下文操作，而不使 UI 杂乱。',
    bestPractices: [
      {guidance: true, description: '保持菜单项简洁和面向操作。'},
      {guidance: true, description: '有很多项时使用分组和分隔线。'},
      {
        guidance: true,
        description:
          '在桌面端需要光标定位、紧凑触控设备上需要 BottomSheet 时，使用 `presentation="adaptive"`。',
      },
      {
        guidance: true,
        description: '确保所有上下文菜单操作也可通过其他 UI 元素访问。',
      },
      {
        guidance: true,
        description:
          '重要的移动端操作还应提供可见的 MoreMenu 或同等入口，不要只依赖长按。',
      },
      {
        guidance: false,
        description: '将上下文菜单作为访问重要操作的唯一方式。',
      },
      {
        guidance: false,
        description: '在单个菜单中放置超过 10-12 个项而不分组。',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'قائمة سياقية تظهر عند النقر بزر الفأرة الأيمن في موضع المؤشر. تلتف حول محتوى المشغِّل بوصفه عناصر فرعية.',
  propDescriptions: {
    children: 'منطقة المشغِّل: انقر بزر الفأرة الأيمن على هذا المحتوى لفتح القائمة.',
    items: 'مصفوفة من إدخالات القائمة. كل إدخال هو أحد ما يلي: عنصر إجراء `{label, onClick?, icon?, isDisabled?, variant?, items?}` (تفتح `items` المتداخلة قائمة فرعية منبثقة في طريقة العرض المنبثقة وتنتقل إلى عرض جديد في طريقة عرض اللوحة السفلية؛ والنمط `"destructive"` يعرضه بلون الخطأ)، أو فاصل `{type: "divider"}`، أو قسم `{type: "section", title?, items: [...action items]}`.',
    menuContent: 'محتوى قائمة JSX مخصص للوضع المركّب. استخدمه بدلًا من items للقوائم الديناميكية أو ذات الحالة.',
    menuWidth: 'عرض مخصص للقائمة.',
    size: 'حجم عناصر القائمة: يتحكم في كثافة الحشو.',
    label: 'الاسم القابل للوصول لسطح القائمة، يُعلن عند فتحها.',
    onOpenChange: 'دالة استدعاء تُنفَّذ عند فتح القائمة أو إغلاقها.',
    presentation: 'سياسة طريقة العرض. تفتح `popover` عند موضع المؤشر، وتستخدم `bottom-sheet` دائمًا لوحة إجراءات، وتستخدم `adaptive` المكوّن BottomSheet عند 768px وأقل عندما يكون المؤشر الأساسي غير دقيق.',
    isDisabled: 'عند تعيينها إلى true، يُظهر النقر بزر الفأرة الأيمن قائمة المتصفح السياقية الأصلية بدلًا من ذلك.',
    triggerAs: 'العنصر الذي يُعرض به غلاف المشغِّل. \'div\' عنصر كتلي؛ و \'span\' غلاف مضمّن، بحيث يمكن لمرجع داخل النص أن يمتلك قائمة سياقية دون كسر تدفق النص.',
  },
  usage: {
    description: 'قائمة سياقية بالنقر بزر الفأرة الأيمن تظهر في موضع المؤشر. استخدمها لتوفير إجراءات سياقية لعناصر أو مناطق محددة دون ازدحام الواجهة بأزرار مرئية.',
    bestPractices: [
      {
        guidance: true,
        description: 'اجعل عناصر القائمة موجزة وموجهة نحو الإجراء؛ إذ يتوقع المستخدمون وصولًا سريعًا إلى الإجراءات السياقية.',
      },
      {
        guidance: true,
        description: 'استخدم الأقسام والفواصل لتجميع الإجراءات المترابطة عندما تحتوي القائمة على عناصر كثيرة.',
      },
      {
        guidance: true,
        description: 'استخدم `presentation="adaptive"` عندما ينبغي أن يبقى النقر بزر الفأرة الأيمن في موضع المؤشر على سطح المكتب بينما يفتح الضغط المطوّل BottomSheet يسهل الوصول إليه على أجهزة اللمس المدمجة.',
      },
      {
        guidance: true,
        description: 'تأكد من إمكانية الوصول إلى جميع إجراءات القائمة السياقية عبر عناصر واجهة أخرى أيضًا للمستخدمين المعتمدين على لوحة المفاتيح فقط.',
      },
      {
        guidance: true,
        description: 'أبقِ MoreMenu مرئيًا أو مشغِّلًا مكافئًا للإجراءات المهمة على الأجهزة المحمولة؛ يجب ألا يكون الضغط المطوّل هو المسار الوحيد.',
      },
      {
        guidance: false,
        description: 'استخدام ContextMenu كطريقة وحيدة للوصول إلى الإجراءات المهمة؛ فليس كل المستخدمين يعرفون النقر بزر الفأرة الأيمن.',
      },
      {
        guidance: false,
        description: 'وضع أكثر من 10–12 عنصرًا في قائمة واحدة دون تجميعها في أقسام.',
      },
    ],
    anatomy: [
      {
        name: 'منطقة المشغِّل',
        required: true,
        description: 'منطقة يوفرها المستدعي تستقبل النقر بزر الفأرة الأيمن ومفتاح القائمة السياقية في لوحة المفاتيح والضغط المطوّل.',
      },
      {
        name: 'سطح قائمة المؤشر',
        required: false,
        description: 'لوحة قائمة في موضع المؤشر تُستخدم في طريقة العرض بالمؤشر.',
      },
      {
        name: 'صف إجراء المؤشر',
        required: false,
        description: 'صف إجراء أو خيار قابل للتحديد أو قائمة فرعية يملكه DropdownMenu في طريقة العرض بالمؤشر.',
      },
      {
        name: 'إطار لوحة اللمس',
        required: false,
        description: 'لوحة BottomSheet ومنطقة المحتوى والمقبض والغطاء الاختياري التي تستضيف إجراءات اللمس.',
      },
      {
        name: 'سطح قائمة اللمس',
        required: false,
        description: 'لوحة محتوى يملكها ContextMenu تُعرض داخل إطار لوحة اللمس.',
      },
      {
        name: 'قائمة إجراءات اللمس',
        required: false,
        description: 'قائمة List فسيحة تجمع إجراءات اللمس المستندة إلى البيانات.',
      },
      {
        name: 'صف إجراء اللمس',
        required: false,
        description: 'زر ListItem يُستخدم لإجراء مستند إلى البيانات أو إدخال انتقال تفصيلي في طريقة العرض باللمس.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'right-click context menu at cursor position',
  usage: {
    anatomy,
    description:
      'A right-click context menu that appears at the cursor position. Use to provide contextual actions for specific elements or regions.',
    bestPractices: [
      {guidance: true, description: 'Keep items concise and action-oriented.'},
      {
        guidance: true,
        description: 'Group related actions with sections and dividers.',
      },
      {
        guidance: true,
        description:
          'Use adaptive presentation for cursor popover on desktop and BottomSheet on compact touch.',
      },
      {
        guidance: true,
        description:
          'Ensure actions are also accessible via other UI elements.',
      },
      {
        guidance: true,
        description: 'Keep a visible mobile entry point for important actions.',
      },
      {
        guidance: false,
        description: 'Use as the only way to access important actions.',
      },
      {
        guidance: false,
        description: 'Place more than 10–12 items without grouping.',
      },
    ],
  },
};
