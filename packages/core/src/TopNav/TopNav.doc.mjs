/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TopNav',
  displayName: 'Top Nav',
  group: 'Navigation',
  category: 'Navigation',
  keywords: ["topnav","navbar","appbar","header","toolbar","navigation","menubar","topbar"],
  playground: {
    defaults: {
      label: 'Navigation',
      heading: {__element: 'TopNavHeading', props: {heading: 'My App'}},
    },
  },
  theming: {
    targets: [
      {className: 'solo-top-nav', states: ['mode']},
      {className: 'solo-top-nav-item', states: ['mode', 'selected']},
      {className: 'solo-top-nav-heading'},
      {className: 'solo-top-nav-mega-menu', states: ['mode']},
      {className: 'solo-top-nav-mega-menu-item', states: ['mode']},
      {className: 'solo-top-nav-mega-menu-featured-card'},
      {className: 'solo-top-nav-menu'},
    ],
  },
  description: 'Main navigation bar container with slot-based layout. Children are accepted as an alias for startContent.',
  props: [
    {
      name: 'heading',
      type: 'ReactNode',
      description: 'Heading slot content (logo, brand): positioned at the left edge of the nav bar.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
            weight: 'bold',
          },
          children: 'Heading',
        },
      ],
    },
    {
      name: 'startContent',
      type: 'ReactNode',
      description: 'Start content slot for navigation items or breadcrumbs: positioned after the heading, left-aligned.',
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
      name: 'children',
      type: 'ReactNode',
      description: 'Alias for startContent. Prefer startContent when composing with heading, centerContent, or endContent; children keeps the common React nav-item pattern from silently dropping items.',
      slotElements: [
        {
          __element: 'TopNavItem',
          props: {
            label: 'Home',
            href: '#',
          },
        },
      ],
    },
    {
      name: 'centerContent',
      type: 'ReactNode',
      description: 'Center content slot (tabs, search bar, primary navigation): when provided, switches the layout to a three-column CSS grid for true horizontal centering.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
            weight: 'bold',
          },
          children: 'Center',
        },
      ],
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'End content slot for search, icons, or user profile: positioned at the right edge.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'chevronDown',
            size: 'sm',
          },
        },
        {
          __element: 'Badge',
          props: {
            label: '3',
          },
        },
      ],
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the navigation landmark, applied as aria-label on the <nav> element.',
      default: "'Top navigation'",
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [
    {name: 'TopNavHeading'},
    {name: 'TopNavItem'},
    {name: 'TopNavMenu'},
    {name: 'TopNavMegaMenu'},
    {name: 'TopNavMegaMenuItem'},
    {name: 'TopNavMegaMenuFeaturedCard'},
  ],
  usage: {
    description:
      'TopNav is a horizontal navigation bar for product-level navigation in application headers. Use TopNav for 5 or fewer always-visible navigation items, or minimal navigation paired with search and controls. For complex navigation hierarchies, use a sidebar; to filter content, use tabs or filter buttons instead.',
    bestPractices: [
      {guidance: true, description: 'Include a product logo and name in the heading slot to clearly identify the application.'},
      {guidance: true, description: 'Limit primary navigation items to 5 or fewer for quick scanning and minimal cognitive load.'},
      {guidance: false, description: 'Avoid using TopNav to filter page content; use Tabs or filter controls instead.'},
      {guidance: false, description: 'Avoid deeply nested navigation hierarchies; keep menus to one level of depth.'},
    ],
    anatomy: [
      {name: 'Product icon and name', required: true, description: 'Identifies the product in the navigation bar.'},
      {name: 'Navigation items', required: true, description: 'Primary links for product-level destinations.'},
      {name: 'More menu', required: false, description: 'Overflow menu for additional navigation items.'},
      {name: 'Flex area', required: false, description: 'Flexible region for search, primary action buttons, or other controls.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'TopNav is a horizontal navigation bar for product-level navigation in application headers. Use TopNav for 5 or fewer always-visible navigation items, or minimal navigation paired with search and controls. For complex navigation hierarchies, use a sidebar; to filter content, use tabs or filter buttons instead.',
    bestPractices: [
      {guidance: true, description: 'Include a product logo and name in the heading slot to clearly identify the application.'},
      {guidance: true, description: 'Limit primary navigation items to 5 or fewer for quick scanning and minimal cognitive load.'},
      {guidance: false, description: 'Avoid using TopNav to filter page content; use Tabs or filter controls instead.'},
      {guidance: false, description: 'Avoid deeply nested navigation hierarchies; keep menus to one level of depth.'},
    ],
    anatomy: [
      {name: 'Product icon and name', required: true, description: 'Identifies the product in the navigation bar.'},
      {name: 'Navigation items', required: true, description: 'Primary links for product-level destinations.'},
      {name: 'More menu', required: false, description: 'Overflow menu for additional navigation items.'},
      {name: 'Flex area', required: false, description: 'Flexible region for search, primary action buttons, or other controls.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حاوية شريط التنقّل الرئيسي بتخطيط قائم على الفتحات. تُقبل العناصر الفرعية كاسم بديل لـ startContent.',
  propDescriptions: {
    heading: 'محتوى فتحة العنوان (الشعار، العلامة التجارية): يتموضع عند الحافة اليسرى لشريط التنقّل.',
    startContent: 'فتحة المحتوى البادئ لعناصر التنقّل أو مسار التنقّل: تتموضع بعد العنوان، بمحاذاة اليسار.',
    children: 'اسم بديل لـ startContent. فضّل startContent عند التركيب مع heading أو centerContent أو endContent؛ إذ يمنع children نمط عناصر التنقّل الشائع في React من إسقاط العناصر بصمت.',
    centerContent: 'فتحة المحتوى الأوسط (علامات التبويب، شريط البحث، التنقّل الأساسي): عند توفيرها، يتحول التخطيط إلى شبكة CSS من ثلاثة أعمدة لتوسيط أفقي حقيقي.',
    endContent: 'فتحة المحتوى الختامي للبحث أو الأيقونات أو الملف الشخصي للمستخدم: تتموضع عند الحافة اليمنى.',
    label: 'التسمية القابلة للوصول لمَعلم التنقّل، تُطبَّق كـ aria-label على عنصر <nav>.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'TopNav شريط تنقّل أفقي للتنقّل على مستوى المنتج في ترويسات التطبيقات. استخدم TopNav لخمسة عناصر تنقّل ظاهرة دائمًا أو أقل، أو لتنقّل بسيط مقترن بالبحث وعناصر التحكم. للتسلسلات الهرمية المعقّدة للتنقّل، استخدم شريطًا جانبيًا؛ ولتصفية المحتوى، استخدم علامات التبويب أو أزرار التصفية بدلًا من ذلك.',
    bestPractices: [
      {guidance: true, description: 'ضمّن شعار المنتج واسمه في فتحة العنوان للتعريف بالتطبيق بوضوح.'},
      {guidance: true, description: 'اقصر عناصر التنقّل الأساسية على 5 أو أقل لتسهيل المسح السريع وتقليل العبء الذهني.'},
      {guidance: false, description: 'تجنّب استخدام TopNav لتصفية محتوى الصفحة؛ استخدم Tabs أو عناصر تحكم التصفية بدلًا من ذلك.'},
      {guidance: false, description: 'تجنّب التسلسلات الهرمية للتنقّل شديدة التداخل؛ أبقِ القوائم بمستوى عمق واحد.'},
    ],
    anatomy: [
      {name: 'أيقونة المنتج واسمه', required: true, description: 'يعرّف بالمنتج في شريط التنقّل.'},
      {name: 'عناصر التنقّل', required: true, description: 'روابط أساسية لوجهات على مستوى المنتج.'},
      {name: 'قائمة المزيد', required: false, description: 'قائمة فائض لعناصر التنقّل الإضافية.'},
      {name: 'المنطقة المرنة', required: false, description: 'منطقة مرنة للبحث أو أزرار الإجراءات الأساسية أو عناصر التحكم الأخرى.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Top navigation bar for app headers w/ slot-based layout+companion nav item components.',
  usage: {
    description:
      'TopNav is a horizontal navigation bar for product-level navigation in application headers. Use TopNav for 5 or fewer always-visible navigation items, or minimal navigation paired with search and controls. For complex navigation hierarchies, use a sidebar; to filter content, use tabs or filter buttons instead.',
    bestPractices: [
      {guidance: true, description: 'Include a product logo and name in the heading slot to clearly identify the application.'},
      {guidance: true, description: 'Limit primary navigation items to 5 or fewer for quick scanning and minimal cognitive load.'},
      {guidance: false, description: 'Avoid using TopNav to filter page content; use Tabs or filter controls instead.'},
      {guidance: false, description: 'Avoid deeply nested navigation hierarchies; keep menus to one level of depth.'},
    ],
    anatomy: [
      {name: 'Product icon and name', required: true, description: 'Identifies the product in the navigation bar.'},
      {name: 'Navigation items', required: true, description: 'Primary links for product-level destinations.'},
      {name: 'More menu', required: false, description: 'Overflow menu for additional navigation items.'},
      {name: 'Flex area', required: false, description: 'Flexible region for search, primary action buttons, or other controls.'},
    ],
  },
};
