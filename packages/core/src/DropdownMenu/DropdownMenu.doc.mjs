/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Trigger button',
    required: true,
    description: 'Button that opens and closes the selected menu presentation.',
  },
  {
    name: 'Trigger indicator icon',
    required: false,
    description:
      'Optional trailing chevron shown by a labeled trigger when hasChevron is enabled.',
  },
  {
    name: 'Pointer menu surface',
    required: false,
    description:
      'Anchored top-level or nested menu panel used by the pointer presentation.',
  },
  {
    name: 'Pointer action row',
    required: false,
    description:
      'Action, selectable option, or submenu trigger row in an anchored menu.',
  },
  {
    name: 'Icon-rendered item icon',
    required: false,
    description:
      'Optional semantic or component icon rendered through Icon at the start of an action row.',
  },
  {
    name: 'Caller-rendered item start content',
    required: false,
    description:
      'Optional arbitrary React content rendered directly at the start of an action row.',
  },
  {
    name: 'Checkbox indicator',
    required: false,
    description:
      'Decorative shared checkbox indicator for a checkbox action row.',
  },
  {
    name: 'Radio indicator',
    required: false,
    description:
      'Decorative shared radio indicator with an additional menu-owned target.',
  },
  {
    name: 'Pointer section heading',
    required: false,
    description:
      'Heading that labels a data-driven section in an anchored menu.',
  },
  {
    name: 'Pointer divider',
    required: false,
    description: 'Divider between groups in an anchored menu.',
  },
  {
    name: 'Pointer submenu indicator icon',
    required: false,
    description:
      'Trailing chevron that identifies an action row as a nested flyout trigger.',
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
      'Menu-owned content panel rendered inside the touch sheet frame.',
  },
  {
    name: 'Touch heading',
    required: false,
    description:
      'Current action-sheet title, updated when a nested action view is opened.',
  },
  {
    name: 'Touch action list',
    required: false,
    description: 'Spacious List that groups actions in the touch presentation.',
  },
  {
    name: 'Touch action row',
    required: false,
    description:
      'ListItem button used for an action or drill-in entry in the touch presentation.',
  },
  {
    name: 'Touch divider',
    required: false,
    description: 'Divider between action groups in the touch presentation.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'DropdownMenu',
  displayName: 'Dropdown Menu',
  group: 'DropdownMenu',
  category: 'Action',
  keywords: [
    'dropdown',
    'menu',
    'popover',
    'select',
    'actions',
    'contextmenu',
    'overflow',
    'kebab',
    'menubutton',
  ],
  playground: {
    // `items` is required; without seeded entries the properties-tab preview
    // renders an empty trigger button. Provide a few actions so the preview
    // is meaningful.
    defaults: {
      button: {label: 'Actions'},
      presentation: 'popover',
      items: [
        {label: 'Edit project', icon: 'wrench'},
        {label: 'Duplicate project', icon: 'copy'},
        {label: 'Share project', icon: 'externalLink'},
        {label: 'Archive project', icon: 'stop'},
      ],
    },
  },
  theming: {
    targets: [
      {
        className: 'solo-dropdown-menu',
        visualProps: ['presentation'],
      },
      {
        className: 'solo-dropdown-menu-item',
        visualProps: ['size', 'variant'],
      },
      {
        className: 'solo-dropdown-menu-radio',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {className: 'solo-dropdown-menu-section-heading'},
      {className: 'solo-dropdown-menu-divider'},
      {className: 'solo-dropdown-menu-indicator-icon'},
    ],
    vars: [
      {
        name: '--_dropdown-menu-radius',
        description: 'Border radius of the menu popup',
        default: 'var(--radius-element)',
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
    'Action menu with a trigger button and anchored, bottom-sheet, or adaptive presentation.',
  props: [
    {
      name: 'button',
      type: 'DropdownMenuButtonProps',
      description:
        'Props for the trigger button (Button props except onClick). Mutually exclusive with `trigger`.',
      default: "{ label: 'Menu' }",
    },
    {
      name: 'renderTrigger',
      type: '(props: DropdownMenuTriggerProps) => ReactNode',
      description:
        'Render the control the menu hangs off — an IconButton, a chip, an avatar, a list row — instead of the built-in Button. Spread the given props onto it: they carry the press model (a mouse opens on press-down, a held finger opens with the finger down), the keyboard opens, the toggle click, and `aria-haspopup`/`aria-expanded`/`aria-controls`/`id`; the menu is then named by that control through `aria-labelledby`. Mutually exclusive with `button`.',
    },

    {
      name: 'items',
      type: 'DropdownMenuOption[]',
      description:
        'Array of menu entries. Each entry is one of: an action item `{label, onClick?, href?, target?, rel?, icon?, description?, endContent?, isDisabled?, variant?, hasCloseOnSelect?, id?}` (`href` makes the row a real link, so a modified click keeps the browser\'s meaning; variant `"destructive"` renders it in the error color; `endContent` holds trailing content such as a keyboard-shortcut hint; `id` is the row\'s stable React key, needed only when the array reorders or filters), a divider `{type: "divider"}`, or a section `{type: "section", title?, id?, items: [...action items]}`.',
      required: true,
    },
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'adaptive'",
      description:
        "Presentation surface for data-driven items. 'popover' stays anchored, 'bottom-sheet' always renders the actions in a modal BottomSheet, and 'adaptive' uses a BottomSheet on compact coarse-pointer layouts while remaining anchored elsewhere. Compound children currently support popover only.",
      default: "'popover'",
    },
    {
      name: 'isMenuOpen',
      type: 'boolean',
      description:
        'Controlled open state for the menu. Mounting with true renders the menu open without moving focus into it; focus moves to the first item only when the menu opens after mount.',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Callback fired when the open state changes.',
    },
    {
      name: 'menuWidth',
      type: 'number | string',
      description:
        'Minimum width for the popover presentation. Length values may grow for content; intrinsic and CSS-wide keywords select the preferred inline size. Every form is capped to the available viewport space. Defaults to matching the trigger width up to that cap.',
    },
    {
      name: 'menuMaxHeight',
      type: 'number',
      description:
        'Maximum height in pixels for the popover presentation, for a menu that must fit its rows. Lifts the default 300px cap; the viewport still bounds it.',
    },
    {
      name: 'placement',
      type: "'above' | 'below' | 'start' | 'end'",
      description:
        "Popover placement relative to the trigger. Ignored by the bottom-sheet presentation. Logical: start/end resolve against the menu's own inherited direction (RTL mirrors).",
      default: "'below'",
    },
    {
      name: 'alignment',
      type: "'start' | 'center' | 'end'",
      description:
        "Popover alignment along the placement axis. Ignored by the bottom-sheet presentation. Logical: start/end follow the menu's own inherited direction (RTL mirrors).",
      default: "'start'",
    },
    {
      name: 'onClick',
      type: '() => void',
      description:
        'Callback fired for accepted trigger activation. The trailing click from the same press that light-dismissed the menu is ignored.',
    },
    {
      name: 'hasChevron',
      type: 'boolean',
      description:
        'Whether to show a chevron icon on the trigger button. Set to false for icon-only triggers.',
      default: 'true',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Compound-mode menu content: DropdownMenuItem, DropdownMenuDivider, DropdownMenuSubMenu (a flyout on a laptop, a drilled-in view with a Back row on a phone), and the selectable items. Mutually exclusive with `items`.',
    },
  ],
  components: [{name: 'DropdownMenuItem'}],
  usage: {
    anatomy,
    description:
      'A dropdown menu that displays a list of actionable items in a popup triggered by a button. Use to present action options as a next step in a process, or to offer contextual actions without cluttering the interface. Like the menus of macOS and iOS, the row under the pointer when it is released is the row that acts, the highlight follows a held mouse or finger, a mouse opens it on press and can drag straight into it, and a finger held on the trigger opens it with the finger down.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep menu items concise and action-oriented so users can scan options quickly.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to group related actions when the menu has many items.',
      },
      {
        guidance: true,
        description:
          'For a short, flat action set, use presentation="bottom-sheet" when product policy calls for a modal touch surface.',
      },
      {
        guidance: true,
        description:
          'Use presentation="adaptive" when the same short action set should remain anchored on pointer layouts and become a BottomSheet on compact coarse-pointer layouts.',
      },
      {
        guidance: true,
        description:
          'For a hierarchy that cannot fit as adjacent flyouts on a compact touch surface, a product may explicitly use a drill-in interaction with a Back action.',
      },
      {
        guidance: true,
        description:
          'Choose presentation explicitly in product code. A compact, coarse-pointer, hover-free media query is one useful policy, but DropdownMenu does not impose a universal device breakpoint.',
      },
      {
        guidance: true,
        description:
          'When the content is no longer a short list of immediate actions, reevaluate the interaction and choose a component that matches the actual task; content traits alone do not determine the component.',
      },
      {
        guidance: false,
        description:
          'Use a DropdownMenu for navigation; use a navigation component instead.',
      },
      {
        guidance: false,
        description:
          'Place more than 10–12 items in a single menu without grouping them into sections.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'A dropdown menu that displays a list of actionable items in a popup triggered by a button. Use to present action options as a next step in a process, or to offer contextual actions without cluttering the interface.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep menu items concise and action-oriented so users can scan options quickly.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to group related actions when the menu has many items.',
      },
      {
        guidance: true,
        description:
          'For a short, flat action set, use presentation="bottom-sheet" when product policy calls for a modal touch surface.',
      },
      {
        guidance: true,
        description:
          'Use presentation="adaptive" when the same short action set should remain anchored on pointer layouts and become a BottomSheet on compact coarse-pointer layouts.',
      },
      {
        guidance: true,
        description:
          'For a hierarchy that cannot fit as adjacent flyouts on a compact touch surface, a product may explicitly use a drill-in interaction with a Back action.',
      },
      {
        guidance: true,
        description:
          'Choose presentation explicitly in product code. A compact, coarse-pointer, hover-free media query is one useful policy, but DropdownMenu does not impose a universal device breakpoint.',
      },
      {
        guidance: true,
        description:
          'When the content is no longer a short list of immediate actions, reevaluate the interaction and choose a component that matches the actual task; content traits alone do not determine the component.',
      },
      {
        guidance: false,
        description:
          'Use a DropdownMenu for navigation; use a navigation component instead.',
      },
      {
        guidance: false,
        description:
          'Place more than 10–12 items in a single menu without grouping them into sections.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'قائمة إجراءات بزر مشغّل وعرض مثبَّت، أو على شكل لوحة سفلية، أو متكيّف.',
  propDescriptions: {
    button: 'خصائص زر المشغّل (خصائص Button باستثناء onClick). لا تجتمع مع `trigger`.',
    renderTrigger: 'اعرض عنصر التحكم الذي تتعلّق به القائمة — IconButton، أو شريحة، أو صورة رمزية، أو صف قائمة — بدلًا من Button المدمج. وزّع الخصائص المعطاة عليه: فهي تحمل نموذج الضغط (تفتح الفأرة القائمة عند الضغط، وتفتحها الإصبع المضغوطة مع بقاء الإصبع على الشاشة)، وفتح القائمة بلوحة المفاتيح، ونقرة التبديل، و`aria-haspopup`/`aria-expanded`/`aria-controls`/`id`؛ ثم تُسمّى القائمة بواسطة عنصر التحكم ذاك عبر `aria-labelledby`. لا تجتمع مع `button`.',
    items: 'مصفوفة إدخالات القائمة. كل إدخال هو أحد ما يلي: عنصر إجراء `{label, onClick?, href?, target?, rel?, icon?, description?, endContent?, isDisabled?, variant?, hasCloseOnSelect?, id?}` (يجعل `href` الصف رابطًا حقيقيًا، فتحتفظ النقرة المعدَّلة بمعناها في المتصفح؛ ويعرضه النمط `"destructive"` بلون الخطأ؛ ويحمل `endContent` محتوى ختاميًا مثل تلميح اختصار لوحة المفاتيح؛ و`id` هو مفتاح React الثابت للصف، ولا يلزم إلا عند إعادة ترتيب المصفوفة أو تصفيتها)، أو فاصل `{type: "divider"}`، أو قسم `{type: "section", title?, id?, items: [...action items]}`.',
    presentation: 'سطح العرض للعناصر المعتمدة على البيانات. يبقى \'popover\' مثبَّتًا، ويعرض \'bottom-sheet\' الإجراءات دائمًا داخل BottomSheet مشروط، ويستخدم \'adaptive\' لوحة BottomSheet في التخطيطات المدمجة ذات المؤشر الخشن ويبقى مثبَّتًا في غيرها. تدعم العناصر الأبناء المركّبة حاليًا العرض popover فقط.',
    isMenuOpen: 'حالة الفتح المتحكَّم بها للقائمة. التركيب بالقيمة true يعرض القائمة مفتوحة دون نقل التركيز إليها؛ ولا ينتقل التركيز إلى العنصر الأول إلا عندما تُفتح القائمة بعد التركيب.',
    onOpenChange: 'دالة استدعاء تُنفَّذ عند تغيّر حالة الفتح.',
    menuWidth: 'الحد الأدنى للعرض في عرض popover. قد تتّسع القيم الطولية لتلائم المحتوى؛ وتختار الكلمات المفتاحية الجوهرية والعامة في CSS الحجم السطري المفضَّل. تُقيَّد كل الصيغ بالمساحة المتاحة في إطار العرض. افتراضيًا يطابق عرض المشغّل حتى ذلك الحد.',
    menuMaxHeight: 'الحد الأقصى للارتفاع بالبكسل في عرض popover، لقائمة يجب أن تتسع لصفوفها. يرفع الحد الافتراضي البالغ 300px؛ ويظل إطار العرض يقيّده.',
    placement: 'موضع النافذة المنبثقة بالنسبة إلى المشغّل. يتجاهله عرض bottom-sheet. منطقي: تُحسب start/end وفق الاتجاه الموروث للقائمة نفسها (تنعكس في RTL).',
    alignment: 'محاذاة النافذة المنبثقة على محور الموضع. يتجاهلها عرض bottom-sheet. منطقية: تتبع start/end الاتجاه الموروث للقائمة نفسها (تنعكس في RTL).',
    onClick: 'دالة استدعاء تُنفَّذ عند قبول تفعيل المشغّل. تُتجاهل النقرة اللاحقة الناتجة عن الضغطة نفسها التي أغلقت القائمة إغلاقًا خفيفًا.',
    hasChevron: 'ما إذا كان سيتم عرض أيقونة سهم على زر المشغّل. عيّنها إلى false للمشغّلات المقتصرة على أيقونة.',
    children: 'محتوى القائمة في الوضع المركّب: DropdownMenuItem، وDropdownMenuDivider، وDropdownMenuSubMenu (قائمة جانبية منبثقة على الحاسوب المحمول، وعرض تفصيلي مع صف رجوع على الهاتف)، والعناصر القابلة للتحديد. لا يجتمع مع `items`.',
  },
  usage: {
    description: 'قائمة منسدلة تعرض قائمة من العناصر القابلة للتنفيذ في نافذة منبثقة يشغّلها زر. استخدمها لعرض خيارات الإجراءات كخطوة تالية في عملية ما، أو لتقديم إجراءات سياقية دون ازدحام الواجهة. على غرار قوائم macOS وiOS، فإن الصف الواقع تحت المؤشر عند تحريره هو الصف الذي يُنفَّذ، ويتبع التمييزُ الفأرةَ أو الإصبع المضغوطة، وتفتحها الفأرة عند الضغط ويمكن السحب مباشرةً إليها، وتفتحها الإصبع المضغوطة على المشغّل مع بقاء الإصبع على الشاشة.',
    bestPractices: [
      {guidance: true, description: 'اجعل عناصر القائمة موجزة وموجّهة نحو الإجراء كي يتمكن المستخدمون من تصفّح الخيارات بسرعة.'},
      {guidance: true, description: 'استخدم الأقسام والفواصل لتجميع الإجراءات المترابطة عندما تحتوي القائمة على عناصر كثيرة.'},
      {guidance: true, description: 'لمجموعة إجراءات قصيرة ومسطّحة، استخدم presentation="bottom-sheet" عندما تتطلب سياسة المنتج سطح لمس مشروطًا.'},
      {guidance: true, description: 'استخدم presentation="adaptive" عندما ينبغي أن تبقى مجموعة الإجراءات القصيرة نفسها مثبَّتة في تخطيطات المؤشر وتصبح BottomSheet في التخطيطات المدمجة ذات المؤشر الخشن.'},
      {guidance: true, description: 'للتسلسل الهرمي الذي لا يتسع كقوائم جانبية متجاورة على سطح لمس مدمج، يمكن للمنتج أن يستخدم صراحةً تفاعل التعمّق مع إجراء رجوع.'},
      {guidance: true, description: 'اختر presentation صراحةً في شيفرة المنتج. استعلام الوسائط للأجهزة المدمجة ذات المؤشر الخشن وبدون تمرير هو سياسة مفيدة، لكن DropdownMenu لا يفرض نقطة توقّف عامة للأجهزة.'},
      {guidance: true, description: 'عندما لا يعود المحتوى قائمة قصيرة من الإجراءات الفورية، أعد تقييم التفاعل واختر مكوّنًا يلائم المهمة الفعلية؛ فخصائص المحتوى وحدها لا تحدد المكوّن.'},
      {guidance: false, description: 'استخدام DropdownMenu للتنقّل؛ استخدم مكوّن تنقّل بدلًا من ذلك.'},
      {guidance: false, description: 'وضع أكثر من 10–12 عنصرًا في قائمة واحدة دون تجميعها في أقسام.'},
    ],
    anatomy: [
      {name: 'زر المشغّل', required: true, description: 'زر يفتح عرض القائمة المحدد ويغلقه.'},
      {name: 'أيقونة مؤشر المشغّل', required: false, description: 'سهم ختامي اختياري يعرضه المشغّل ذو التسمية عند تفعيل hasChevron.'},
      {name: 'سطح قائمة المؤشر', required: false, description: 'لوحة قائمة مثبَّتة في المستوى الأعلى أو متداخلة يستخدمها عرض المؤشر.'},
      {name: 'صف إجراء المؤشر', required: false, description: 'صف إجراء، أو خيار قابل للتحديد، أو مشغّل قائمة فرعية في قائمة مثبَّتة.'},
      {name: 'أيقونة العنصر المعروضة عبر Icon', required: false, description: 'أيقونة دلالية أو أيقونة مكوّن اختيارية تُعرض عبر Icon في بداية صف الإجراء.'},
      {name: 'محتوى بداية العنصر الذي يعرضه المستدعي', required: false, description: 'محتوى React اختياري عشوائي يُعرض مباشرةً في بداية صف الإجراء.'},
      {name: 'مؤشر مربع الاختيار', required: false, description: 'مؤشر مربع اختيار مشترك زخرفي لصف إجراء من نوع مربع اختيار.'},
      {name: 'مؤشر زر الاختيار', required: false, description: 'مؤشر زر اختيار مشترك زخرفي مع هدف إضافي تملكه القائمة.'},
      {name: 'عنوان قسم المؤشر', required: false, description: 'عنوان يسمّي قسمًا معتمدًا على البيانات في قائمة مثبَّتة.'},
      {name: 'فاصل المؤشر', required: false, description: 'فاصل بين المجموعات في قائمة مثبَّتة.'},
      {name: 'أيقونة مؤشر القائمة الفرعية للمؤشر', required: false, description: 'سهم ختامي يحدد صف الإجراء كمشغّل لقائمة جانبية متداخلة.'},
      {name: 'إطار لوحة اللمس', required: false, description: 'لوحة BottomSheet ومنطقة المحتوى والمقبض والغطاء الاختياري التي تستضيف إجراءات اللمس.'},
      {name: 'سطح قائمة اللمس', required: false, description: 'لوحة محتوى تملكها القائمة وتُعرض داخل إطار لوحة اللمس.'},
      {name: 'عنوان اللمس', required: false, description: 'عنوان لوحة الإجراءات الحالي، ويُحدَّث عند فتح عرض إجراءات متداخل.'},
      {name: 'قائمة إجراءات اللمس', required: false, description: 'List فسيحة تجمع الإجراءات في عرض اللمس.'},
      {name: 'صف إجراء اللمس', required: false, description: 'زر ListItem يُستخدم لإجراء أو إدخال تعمّق في عرض اللمس.'},
      {name: 'فاصل اللمس', required: false, description: 'فاصل بين مجموعات الإجراءات في عرض اللمس.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'dropdown menu for actionable items in popup',
  usage: {
    anatomy,
    description:
      'A dropdown menu that displays a list of actionable items in a popup triggered by a button. Use to present action options as a next step in a process, or to offer contextual actions without cluttering the interface.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep menu items concise and action-oriented so users can scan options quickly.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to group related actions when the menu has many items.',
      },
      {
        guidance: true,
        description:
          'For a short, flat action set, use presentation="bottom-sheet" when product policy calls for a modal touch surface.',
      },
      {
        guidance: true,
        description:
          'Use presentation="adaptive" when the same short action set should remain anchored on pointer layouts and become a BottomSheet on compact coarse-pointer layouts.',
      },
      {
        guidance: true,
        description:
          'For a hierarchy that cannot fit as adjacent flyouts on a compact touch surface, a product may explicitly use a drill-in interaction with a Back action.',
      },
      {
        guidance: true,
        description:
          'Choose presentation explicitly in product code. A compact, coarse-pointer, hover-free media query is one useful policy, but DropdownMenu does not impose a universal device breakpoint.',
      },
      {
        guidance: true,
        description:
          'When the content is no longer a short list of immediate actions, reevaluate the interaction and choose a component that matches the actual task; content traits alone do not determine the component.',
      },
      {
        guidance: false,
        description:
          'Use a DropdownMenu for navigation; use a navigation component instead.',
      },
      {
        guidance: false,
        description:
          'Place more than 10–12 items in a single menu without grouping them into sections.',
      },
    ],
  },
};
