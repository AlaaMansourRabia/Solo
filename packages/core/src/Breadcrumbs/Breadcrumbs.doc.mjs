/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Breadcrumbs',
  displayName: 'Breadcrumbs',
  group: 'Breadcrumbs',
  category: 'Navigation',
  keywords: ["breadcrumbs","breadcrumb","navigation","nav","crumbs","trail","path","hierarchy","wayfinding","steps"],
  usage: {
    description:
      'Breadcrumbs show a trail of links from the root to the current page. Use them at the top of detail pages, settings panels, or anywhere the user needs to see where they are and navigate back up.',
    bestPractices: [
      {guidance: true, description: 'Place breadcrumbs above the page heading so the user sees their location before reading the content.'},
      {guidance: true, description: 'Keep labels short and match the page titles they link to: "Settings" not "Application Settings Page".'},
      {guidance: true, description: 'Use the supporting variant in dense UIs like admin panels or sidebars where the breadcrumb should be subtle.'},
      {guidance: true, description: 'Make the last item plain text, not a link; it represents the current page. The component does this automatically when you set isCurrent.'},
      {guidance: true, description: 'The component implements the WAI-ARIA APG Breadcrumb pattern: a labelled nav landmark wrapping an ordered list, with aria-current="page" on the current item. A crumb with a menu additionally implements the APG Menu Button pattern, opening on Enter, Space or ArrowDown and closing on Escape.'},
      {guidance: true, description: 'Give each trail its own label when a page renders more than one, so the nav landmarks stay distinguishable in a screen reader landmark list.'},
      {guidance: false, description: 'Use breadcrumbs as the primary navigation. They supplement a sidebar or top nav, not replace it.'},
      {guidance: false, description: 'Show breadcrumbs on top-level pages that have no parent; they add clutter without helping the user.'},
      {guidance: false, description: 'Let the trail grow beyond 5 levels. If you need more, consider simplifying the page hierarchy instead.'},
      {guidance: true, description: 'The built-in slash separator mirrors automatically in RTL. For a custom separator, leave Unicode-mirrored angle quotes such as › alone; mirror arrows and Icon separators once with rtlStyles.mirror.'},
      {guidance: false, description: 'Mirror a separator the bidi algorithm already mirrors. An angle-quote glyph such as › is Bidi_Mirrored, so it flips under RTL on its own and rtlStyles.mirror would flip it back. An arrow glyph such as → and any Icon separator are not, so those do need rtlStyles.mirror through className.'},
    ],
    anatomy: [
      {name: 'Trail', required: true, description: 'The ordered list of links from root to current page.'},
      {name: 'Item', required: true, description: 'A single step in the trail. Renders as a link or plain text for the current page.'},
      {name: 'Separator', required: true, description: 'The character between items. Defaults to "/" but can be customized.'},
      {name: 'Icon', required: false, description: 'An optional icon before an item label, like a home icon on the first item.'},
    ],
  },
  theming: {
    targets: [
      {className: 'solo-breadcrumb-item', visualProps: ['variant']},
      {
        className: 'solo-breadcrumb-item-menu-trigger',
        visualProps: ['variant'],
      },
      {className: 'solo-breadcrumb-menu'},
      {className: 'solo-breadcrumbs', visualProps: ['variant']},
    ],
  },
  description: 'Navigation container that renders a <nav> with an ordered list of breadcrumb items.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'BreadcrumbItem elements to render inside the breadcrumb trail.',
      slotElements: [
        {
          __element: 'BreadcrumbItem',
          props: {
            href: '#',
          },
          children: 'Page',
        },
      ],
      required: true,
    },
    {
      name: 'separator',
      type: 'ReactNode',
      description: 'Separator rendered between breadcrumb items. The built-in slash mirrors automatically in RTL.',
      default: "'/'",
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'chevronRight',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'variant',
      type: "'default' | 'supporting'",
      description: 'Visual variant: supporting is smaller with secondary text styling.',
      default: "'default'",
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the nav landmark (aria-label).',
      default: "'Breadcrumb'",
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [
    {
      name: 'BreadcrumbItem',
      displayName: 'Breadcrumb Item',
      description: 'Individual breadcrumb item. Renders as a link when href is provided, or as plain text for the current page.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Label content for the breadcrumb item.',
          required: true,
        },
        {
          name: 'href',
          type: 'string',
          description: 'URL the breadcrumb links to; omit for non-navigable items.',
        },
        {
          name: 'onClick',
          type: '(e: MouseEvent) => void',
          description: 'Click handler for the breadcrumb item.',
        },
        {
          name: 'isCurrent',
          type: 'boolean',
          description:
            'Marks this item as the current page, applying aria-current="page". When omitted, the last item is auto-detected if no item is explicitly current; pass false to opt out.',
        },
        {
          name: 'startIcon',
          type: 'ReactNode',
          description: 'Icon rendered before the item label.',
        },
        {
          name: 'as',
          type: 'LinkComponentType',
          description: 'Custom link component to render instead of <a>. Overrides the provider-level default from LinkProvider. Only applies to non-current items.',
        },
        {
          name: 'menu',
          type: 'DropdownMenuOption[] | ReactNode',
          description:
            'Menu opened when the item is activated, using the same item API as DropdownMenu/MoreMenu/ContextMenu (a DropdownMenuOption[] array or composed DropdownMenuItem children). Renders a link-styled menu trigger with a chevron and aria-haspopup="menu". Takes precedence over href/onClick.',
        },
        {
          name: 'menuSize',
          type: "'sm' | 'md' | 'lg'",
          description:
            "Size passed to the menu items. Defaults from the breadcrumb variant ('supporting' → 'sm', otherwise 'md').",
        },
      ],
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'Breadcrumbs show a trail of links from the root to the current page. Use them at the top of detail pages, settings panels, or anywhere the user needs to see where they are and navigate back up.',
    bestPractices: [
      {guidance: true, description: 'Place breadcrumbs above the page heading so the user sees their location before reading the content.'},
      {guidance: true, description: 'Keep labels short and match the page titles they link to: "Settings" not "Application Settings Page".'},
      {guidance: true, description: 'Use the supporting variant in dense UIs like admin panels or sidebars where the breadcrumb should be subtle.'},
      {guidance: true, description: 'Make the last item plain text, not a link; it represents the current page. The component does this automatically when you set isCurrent.'},
      {guidance: true, description: 'The component implements the WAI-ARIA APG Breadcrumb pattern: a labelled nav landmark wrapping an ordered list, with aria-current="page" on the current item. A crumb with a menu additionally implements the APG Menu Button pattern, opening on Enter, Space or ArrowDown and closing on Escape.'},
      {guidance: true, description: 'Give each trail its own label when a page renders more than one, so the nav landmarks stay distinguishable in a screen reader landmark list.'},
      {guidance: false, description: 'Use breadcrumbs as the primary navigation. They supplement a sidebar or top nav, not replace it.'},
      {guidance: false, description: 'Show breadcrumbs on top-level pages that have no parent; they add clutter without helping the user.'},
      {guidance: false, description: 'Let the trail grow beyond 5 levels. If you need more, consider simplifying the page hierarchy instead.'},
      {guidance: true, description: 'The built-in slash separator mirrors automatically in RTL. For a custom separator, leave Unicode-mirrored angle quotes such as › alone; mirror arrows and Icon separators once with rtlStyles.mirror.'},
      {guidance: false, description: 'Mirror a separator the bidi algorithm already mirrors. An angle-quote glyph such as › is Bidi_Mirrored, so it flips under RTL on its own and rtlStyles.mirror would flip it back. An arrow glyph such as → and any Icon separator are not, so those do need rtlStyles.mirror through className.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حاوية تنقّل تعرض عنصر <nav> يضم قائمة مرتّبة من عناصر مسار التنقّل.',
  propDescriptions: {
    children: 'عناصر BreadcrumbItem التي تُعرض داخل مسار التنقّل.',
    separator: 'الفاصل الذي يُعرض بين عناصر مسار التنقّل. تنعكس الشرطة المائلة المدمجة تلقائيًا في وضع RTL.',
    variant: 'النمط المرئي: النمط supporting أصغر حجمًا وبتنسيق نص ثانوي.',
    label: 'التسمية القابلة للوصول لمعلم التنقّل nav (aria-label).',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتغلب الأداة المتعارضة على القيمة الافتراضية.',
  },
  usage: {
    description:
      'يعرض مسار التنقّل سلسلة من الروابط تبدأ من الجذر وتنتهي بالصفحة الحالية. استخدمه أعلى صفحات التفاصيل أو لوحات الإعدادات، أو في أي موضع يحتاج فيه المستخدم إلى معرفة موقعه والعودة إلى المستويات الأعلى.',
    bestPractices: [
      {guidance: true, description: 'ضع مسار التنقّل فوق عنوان الصفحة ليرى المستخدم موقعه قبل قراءة المحتوى.'},
      {guidance: true, description: 'اجعل التسميات قصيرة ومطابقة لعناوين الصفحات التي تشير إليها: "Settings" وليس "Application Settings Page".'},
      {guidance: true, description: 'استخدم النمط supporting في الواجهات الكثيفة مثل لوحات الإدارة أو الأشرطة الجانبية حيث ينبغي أن يكون مسار التنقّل غير لافت.'},
      {guidance: true, description: 'اجعل العنصر الأخير نصًا عاديًا لا رابطًا؛ فهو يمثّل الصفحة الحالية. يفعل المكوّن ذلك تلقائيًا عند تعيين isCurrent.'},
      {guidance: true, description: 'يطبّق المكوّن نمط Breadcrumb من WAI-ARIA APG: معلم nav ذو تسمية يغلّف قائمة مرتّبة، مع aria-current="page" على العنصر الحالي. ويطبّق العنصر الذي يحتوي على قائمة أيضًا نمط Menu Button من APG، إذ يُفتح بالمفاتيح Enter أو Space أو ArrowDown ويُغلق بالمفتاح Escape.'},
      {guidance: true, description: 'امنح كل مسار تسمية خاصة به عندما تعرض الصفحة أكثر من مسار واحد، كي تبقى معالم nav قابلة للتمييز في قائمة المعالم لدى قارئ الشاشة.'},
      {guidance: false, description: 'لا تستخدم مسار التنقّل بوصفه التنقّل الأساسي. فهو يكمّل الشريط الجانبي أو شريط التنقّل العلوي ولا يحل محلهما.'},
      {guidance: false, description: 'لا تعرض مسار التنقّل في الصفحات ذات المستوى الأعلى التي ليس لها صفحة أصل؛ فهو يضيف ازدحامًا دون أن يفيد المستخدم.'},
      {guidance: false, description: 'لا تدع المسار يتجاوز 5 مستويات. إذا احتجت إلى المزيد، ففكّر في تبسيط التسلسل الهرمي للصفحات بدلًا من ذلك.'},
      {guidance: true, description: 'ينعكس فاصل الشرطة المائلة المدمج تلقائيًا في وضع RTL. عند استخدام فاصل مخصّص، اترك علامات الاقتباس الزاوية المنعكسة في Unicode مثل › كما هي؛ واعكس الأسهم وفواصل Icon مرة واحدة باستخدام rtlStyles.mirror.'},
      {guidance: false, description: 'لا تعكس فاصلًا تعكسه خوارزمية الاتجاه الثنائي (bidi) أصلًا. فرمز علامة الاقتباس الزاوية مثل › يحمل الخاصية Bidi_Mirrored، لذا ينقلب تلقائيًا في وضع RTL، وسيعيده rtlStyles.mirror إلى وضعه الأصلي. أما رمز السهم مثل → وأي فاصل من نوع Icon فليست كذلك، ولذا تحتاج إلى rtlStyles.mirror عبر className.'},
    ],
    anatomy: [
      {name: 'المسار', required: true, description: 'القائمة المرتّبة من الروابط بدءًا من الجذر وحتى الصفحة الحالية.'},
      {name: 'العنصر', required: true, description: 'خطوة واحدة في المسار. يُعرض كرابط، أو كنص عادي للصفحة الحالية.'},
      {name: 'الفاصل', required: true, description: 'الرمز الموجود بين العناصر. القيمة الافتراضية "/" ويمكن تخصيصه.'},
      {name: 'الأيقونة', required: false, description: 'أيقونة اختيارية قبل تسمية العنصر، مثل أيقونة الصفحة الرئيسية على العنصر الأول.'},
    ],
  },
  components: [
    {
      name: 'BreadcrumbItem',
      displayName: 'عنصر مسار التنقّل',
      description: 'عنصر فردي في مسار التنقّل. يُعرض كرابط عند توفير href، أو كنص عادي للصفحة الحالية.',
      propDescriptions: {
        children: 'محتوى تسمية عنصر مسار التنقّل.',
        href: 'عنوان URL الذي يشير إليه عنصر مسار التنقّل؛ احذفه للعناصر غير القابلة للتنقّل.',
        onClick: 'معالج النقر لعنصر مسار التنقّل.',
        isCurrent:
          'يحدّد هذا العنصر بوصفه الصفحة الحالية، مع تطبيق aria-current="page". عند حذفها، يُكتشف العنصر الأخير تلقائيًا إذا لم يُحدَّد أي عنصر صراحةً كعنصر حالي؛ مرّر false لإلغاء ذلك.',
        startIcon: 'أيقونة تُعرض قبل تسمية العنصر.',
        as: 'مكوّن رابط مخصّص يُعرض بدلًا من <a>. يتجاوز القيمة الافتراضية المحددة على مستوى الموفّر من LinkProvider. لا ينطبق إلا على العناصر غير الحالية.',
        menu:
          'قائمة تُفتح عند تفعيل العنصر، باستخدام واجهة العناصر نفسها المستخدمة في DropdownMenu/MoreMenu/ContextMenu (مصفوفة DropdownMenuOption[] أو عناصر DropdownMenuItem فرعية مركّبة). يعرض مشغّل قائمة بنمط الرابط مع سهم chevron و aria-haspopup="menu". تتقدّم على href/onClick.',
        menuSize:
          "الحجم المُمرَّر إلى عناصر القائمة. يُستمد افتراضيًا من نمط مسار التنقّل ('supporting' ← 'sm'، وإلا 'md').",
      },
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'link trail from root to current page for wayfinding',
  usage: {
    description:
      'Breadcrumbs show a trail of links from root to current page. Use at the top of detail pages, settings, or nested content.',
    bestPractices: [
      {guidance: true, description: 'Place above the page heading so user sees location before reading content.'},
      {guidance: true, description: 'Keep labels short + matching page titles they link to: "Settings" not "Application Settings Page".'},
      {guidance: true, description: 'Use supporting variant in dense UIs where the breadcrumb should be subtle.'},
      {guidance: true, description: 'Last item plain text, not a link; represents current page; done automatically when you set isCurrent.'},
      {guidance: true, description: 'Implements APG Breadcrumb: labelled nav landmark + ol + aria-current="page". A menu crumb also implements APG Menu Button (Enter/Space/ArrowDown to open, Escape to close).'},
      {guidance: true, description: 'Give each trail its own label when a page renders more than one.'},
      {guidance: false, description: 'Use as primary navigation; breadcrumbs supplement, not replace, a main nav.'},
      {guidance: false, description: 'Show on top-level pages with no parent.'},
      {guidance: false, description: 'Let the trail exceed 5 levels; simplify the hierarchy instead.'},
      {guidance: true, description: 'Built-in / mirrors automatically in RTL. Leave bidi-mirrored › alone; mirror custom arrows and Icons once.'},
      {guidance: false, description: 'Mirror a separator that already mirrors itself: › is Bidi_Mirrored and flips under RTL on its own. → and Icon separators are not, so those need rtlStyles.mirror via className.'},
    ],
  },
};
