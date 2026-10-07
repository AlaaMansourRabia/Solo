/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'SideNav',
  displayName: 'Side Nav',
  group: 'Navigation',
  category: 'Navigation',
  keywords: ["sidenav","sidebar","navigation","drawer","menu","nav","aside","sidemenu","navmenu","sider","treeview"],
  playground: {
    defaults: {
      children: [
        {__element: 'SideNavItem', props: {label: 'Dashboard', isSelected: true}},
        {__element: 'SideNavItem', props: {label: 'Projects'}},
        {__element: 'SideNavItem', props: {label: 'Settings'}},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'solo-side-nav', visualProps: ['mode']},
      {className: 'solo-side-nav-heading'},
      {className: 'solo-side-nav-item', visualProps: ['size'], states: ['selected', 'disabled']},
      {className: 'solo-side-nav-section'},
    ],
  },
  description: 'Container with five zones: header, topContent, children (scrollable), footer, and footerIcons. Supports collapsible and resizable modes.',
  props: [
    {
      name: 'header',
      type: 'ReactNode',
      description: 'Header area (typically SideNavHeading). Sticky.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Header',
        },
      ],
    },
    {
      name: 'topContent',
      type: 'ReactNode',
      description: 'Content below the header, e.g., a create button.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Top content',
        },
      ],
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Navigation sections and items. Scrollable.',
      slotElements: [
        {
          __element: 'SideNavItem',
          props: {
            label: 'Nav Item',
          },
        },
      ],
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description: 'Footer area above the icon bar.',
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
      name: 'footerIcons',
      type: 'ReactNode',
      description: "Footer icon bar. The row cascades a 'sm' size to the interactive children it contains, so its icons and the built-in collapse button come out one height; pass an explicit size on a child to opt out.",
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'collapsible',
      type: 'boolean | { defaultIsCollapsed?: boolean; isCollapsed?: boolean; onCollapsedChange?: (isCollapsed: boolean) => void; hasButton?: boolean; buttonLabel?: string }',
      description: 'Enables collapse behavior. true for uncontrolled with default toggle button, or an object for controlled mode and advanced config (defaultIsCollapsed, isCollapsed + onCollapsedChange, hasButton, buttonLabel). A controlled config can also be passed to a SideNavCollapseButton rendered outside this SideNav, so both share one state.',
      default: 'false',
    },
    {
      name: 'resizable',
      type: 'boolean | { defaultWidth?: number; minWidth?: number; maxWidth?: number; autoSaveId?: string; onWidthChange?: (width: number) => void; defaultIsCollapsed?: boolean; isCollapsed?: boolean; onCollapseChange?: (isCollapsed: boolean) => void }',
      description: 'Enables a resize handle at the inline-end edge. true for defaults (260px initial, 180-480px range), or a ResizableConfig object (defaultWidth, minWidth, maxWidth, autoSaveId for localStorage persistence of width and collapse state, onWidthChange). It can also own collapse state (defaultIsCollapsed, isCollapsed + onCollapseChange); when both props carry collapse state, resizable wins and a dev warning names the conflicting keys. The handle is hidden while collapsed.',
      default: 'false',
    },
    {
      name: 'handleRef',
      type: 'Ref<SideNavImperativeCollapseHandle>',
      description: 'Deprecated. Imperative collapse handle for SideNavCollapseButton instances rendered outside this SideNav; hand both the same controlled collapsible config instead. Separate from `ref`, which continues to expose the root HTMLElement.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [
    {name: 'SideNavHeading'},
    {name: 'SideNavItem'},
    {name: 'SideNavSection'},
    {name: 'SideNavCollapseButton'},
  ],
  usage: {
    description:
      'A sidebar navigation component for organizing application pages with sections, nested items, and icons. Use SideNav as the primary navigation when an app has 5 or more destinations or requires hierarchical grouping.',
    bestPractices: [
      {guidance: true, description: 'Use sections to group related navigation items and help users scan for their destination.'},
      {guidance: true, description: 'Pair outline and filled icon variants so the selected state is visually distinct.'},
      {guidance: true, description: 'Mark the current page with isSelected: it sets aria-current="page", so the current destination is announced rather than carried by color alone.'},
      {guidance: true, description: 'SideNav renders a navigation landmark, and a collapsible item follows the WAI-ARIA APG Disclosure pattern (https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): the toggle carries aria-expanded and aria-controls, and the group it owns is inert while collapsed. Keep item labels short; they name icon-only items unless a meaningful aria-label supplies more context.'},
      {guidance: true, description: 'While the nav is collapsed, an item with children shows them in a submenu flyout. On a device that can hover, pointing at the item opens it after a short delay and moving away closes it; a flyout opened by clicking stays open until it is dismissed. On touch, it opens on tap. Do not put an action in there that has no other route to it.'},
      {guidance: false, description: 'Include a SideNavHeading when a TopNav is already providing app identity; this duplicates branding.'},
      {guidance: false, description: 'Use for filtering content; use tabs or filter buttons instead.'},
    ],
    anatomy: [
      {name: 'Product icon and name', required: false, description: 'Branding area at the top of the nav.'},
      {name: 'Navigation items', required: true, description: 'Sections and groups of navigable links.'},
      {name: 'Collapse/expand toggle', required: false, description: 'Toggle to collapse or expand the side nav.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'A sidebar navigation component for organizing application pages with sections, nested items, and icons. Use SideNav as the primary navigation when an app has 5 or more destinations or requires hierarchical grouping.',
    bestPractices: [
      {guidance: true, description: 'Use sections to group related navigation items and help users scan for their destination.'},
      {guidance: true, description: 'Pair outline and filled icon variants so the selected state is visually distinct.'},
      {guidance: true, description: 'Mark the current page with isSelected: it sets aria-current="page", so the current destination is announced rather than carried by color alone.'},
      {guidance: true, description: 'SideNav renders a navigation landmark, and a collapsible item follows the WAI-ARIA APG Disclosure pattern (https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): the toggle carries aria-expanded and aria-controls, and the group it owns is inert while collapsed. Keep item labels short; they name icon-only items unless a meaningful aria-label supplies more context.'},
      {guidance: true, description: 'While the nav is collapsed, an item with children shows them in a submenu flyout. On a device that can hover, pointing at the item opens it after a short delay and moving away closes it; a flyout opened by clicking stays open until it is dismissed. On touch, it opens on tap. Do not put an action in there that has no other route to it.'},
      {guidance: false, description: 'Include a SideNavHeading when a TopNav is already providing app identity; this duplicates branding.'},
      {guidance: false, description: 'Use for filtering content; use tabs or filter buttons instead.'},
    ],
    anatomy: [
      {name: 'Product icon and name', required: false, description: 'Branding area at the top of the nav.'},
      {name: 'Navigation items', required: true, description: 'Sections and groups of navigable links.'},
      {name: 'Collapse/expand toggle', required: false, description: 'Toggle to collapse or expand the side nav.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حاوية من خمس مناطق: header، وtopContent، وchildren (قابلة للتمرير)، وfooter، وfooterIcons. تدعم وضعَي الطي وتغيير الحجم.',
  propDescriptions: {
    header: 'منطقة الترويسة (عادةً SideNavHeading). لاصقة.',
    topContent: 'محتوى أسفل الترويسة، مثل زر إنشاء.',
    children: 'أقسام التنقّل وعناصره. قابلة للتمرير.',
    footer: 'منطقة التذييل فوق شريط الأيقونات.',
    footerIcons: 'شريط أيقونات التذييل. يمرّر الصف الحجم \'sm\' إلى العناصر الفرعية التفاعلية التي يحتويها، فتظهر أيقوناته وزر الطي المدمج بارتفاع واحد؛ مرِّر حجمًا صريحًا على عنصر فرعي لاستثنائه.',
    collapsible: 'يفعّل سلوك الطي. true للوضع غير المتحكَّم به مع زر التبديل الافتراضي، أو كائن للوضع المتحكَّم به والإعدادات المتقدمة (defaultIsCollapsed، وisCollapsed مع onCollapsedChange، وhasButton، وbuttonLabel). ويمكن أيضًا تمرير إعداد متحكَّم به إلى SideNavCollapseButton معروض خارج SideNav هذا، فيتشارك الاثنان حالة واحدة.',
    resizable: 'يفعّل مقبض تغيير الحجم عند حافة نهاية المحور الأفقي. true للقيم الافتراضية (260px أوليًا، ونطاق 180-480px)، أو كائن ResizableConfig ‏(defaultWidth، وminWidth، وmaxWidth، وautoSaveId لحفظ العرض وحالة الطي في localStorage، وonWidthChange). ويمكنه أيضًا امتلاك حالة الطي (defaultIsCollapsed، وisCollapsed مع onCollapseChange)؛ وعندما تحمل كلتا الخاصيتين حالة الطي تكون الأولوية لـ resizable ويُصدر تحذير تطوير يسمّي المفاتيح المتعارضة. يُخفى المقبض أثناء الطي.',
    handleRef: 'مُهمَل. مقبض طي إلزامي لنسخ SideNavCollapseButton المعروضة خارج SideNav هذا؛ مرِّر بدلًا من ذلك إعداد collapsible المتحكَّم به نفسه إلى كليهما. منفصل عن `ref` الذي يستمر في كشف HTMLElement الجذر.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأحجام)، تُدمج مع أصناف المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'مكوّن تنقّل في شريط جانبي لتنظيم صفحات التطبيق بأقسام وعناصر متداخلة وأيقونات. استخدم SideNav كتنقّل أساسي عندما يحتوي التطبيق على 5 وجهات أو أكثر أو يتطلب تجميعًا هرميًا.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم الأقسام لتجميع عناصر التنقّل المترابطة ومساعدة المستخدمين على مسح وجهتهم بصريًا.',
      },
      {
        guidance: true,
        description: 'اقرن نمطَي الأيقونة المحددة والمملوءة كي تكون الحالة المحددة مميزة بصريًا.',
      },
      {
        guidance: true,
        description: 'حدّد الصفحة الحالية باستخدام isSelected: فهي تضبط aria-current="page"، فتُعلَن الوجهة الحالية بدلًا من الاعتماد على اللون وحده.',
      },
      {
        guidance: true,
        description: 'يعرض SideNav معلم تنقّل، ويتبع العنصر القابل للطي نمط Disclosure في WAI-ARIA APG ‏(https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): يحمل زر التبديل aria-expanded وaria-controls، وتكون المجموعة التي يملكها خاملة أثناء الطي. اجعل تسميات العناصر قصيرة؛ فهي تسمّي العناصر ذات الأيقونة فقط ما لم تقدّم aria-label ذات معنى سياقًا أكثر.',
      },
      {
        guidance: true,
        description: 'أثناء طي شريط التنقّل، يعرض العنصر الذي له عناصر فرعية تلك العناصر في قائمة فرعية منبثقة. على الأجهزة التي تدعم التمرير، يؤدي التأشير على العنصر إلى فتحها بعد تأخير قصير، والابتعاد عنه يغلقها؛ أما القائمة المنبثقة المفتوحة بالنقر فتبقى مفتوحة حتى تُغلق. وعلى الأجهزة اللمسية تُفتح بالنقر. لا تضع هناك إجراءً لا يمكن الوصول إليه بطريقة أخرى.',
      },
      {
        guidance: false,
        description: 'تضمين SideNavHeading عندما يوفّر TopNav هوية التطبيق بالفعل؛ فهذا يكرر العلامة التجارية.',
      },
      {
        guidance: false,
        description: 'استخدامه لتصفية المحتوى؛ استخدم علامات التبويب أو أزرار التصفية بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'أيقونة المنتج واسمه',
        required: false,
        description: 'منطقة العلامة التجارية في أعلى شريط التنقّل.',
      },
      {
        name: 'عناصر التنقّل',
        required: true,
        description: 'أقسام ومجموعات من الروابط القابلة للتنقّل.',
      },
      {
        name: 'مفتاح الطي/التوسيع',
        required: false,
        description: 'مفتاح تبديل لطي التنقّل الجانبي أو توسيعه.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    description:
      'A sidebar navigation component for organizing application pages with sections, nested items, and icons. Use SideNav as the primary navigation when an app has 5 or more destinations or requires hierarchical grouping.',
    bestPractices: [
      {guidance: true, description: 'Use sections to group related navigation items and help users scan for their destination.'},
      {guidance: true, description: 'Pair outline and filled icon variants so the selected state is visually distinct.'},
      {guidance: true, description: 'Mark the current page with isSelected: it sets aria-current="page", so the current destination is announced rather than carried by color alone.'},
      {guidance: true, description: 'SideNav renders a navigation landmark, and a collapsible item follows the WAI-ARIA APG Disclosure pattern (https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): the toggle carries aria-expanded and aria-controls, and the group it owns is inert while collapsed. Keep item labels short; they name icon-only items unless a meaningful aria-label supplies more context.'},
      {guidance: true, description: 'While the nav is collapsed, an item with children shows them in a submenu flyout. On a device that can hover, pointing at the item opens it after a short delay and moving away closes it; a flyout opened by clicking stays open until it is dismissed. On touch, it opens on tap. Do not put an action in there that has no other route to it.'},
      {guidance: false, description: 'Include a SideNavHeading when a TopNav is already providing app identity; this duplicates branding.'},
      {guidance: false, description: 'Use for filtering content; use tabs or filter buttons instead.'},
    ],
    anatomy: [
      {name: 'Product icon and name', required: false, description: 'Branding area at the top of the nav.'},
      {name: 'Navigation items', required: true, description: 'Sections and groups of navigable links.'},
      {name: 'Collapse/expand toggle', required: false, description: 'Toggle to collapse or expand the side nav.'},
    ],
  },
};
