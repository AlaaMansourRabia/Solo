/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Menu',
    required: true,
    description:
      'Menu container for nav-heading actions, with menu semantics and keyboard navigation.',
  },
  {
    name: 'Item',
    required: true,
    description: 'Selectable action or navigation link inside the Menu.',
  },
  {
    name: 'Icon',
    required: false,
    description: 'Optional Icon-rendered artwork shown before an Item label.',
  },
  {
    name: 'Text-rendered item label',
    required: false,
    description: 'String Item label rendered through Text.',
  },
  {
    name: 'Caller-rendered item label',
    required: false,
    description: 'Non-string Item label content rendered directly by the caller.',
  },
  {
    name: 'Item description',
    required: false,
    description: 'Optional supporting description rendered through Text.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'NavHeadingMenu',
  displayName: 'Nav Heading Menu',
  group: 'Navigation',
  category: 'Navigation',
  isHiddenFromOverview: true,
  hidden: false,
  keywords: ['nav', 'menu', 'navigation', 'heading', 'menu-item', 'popover'],
  usage: {
    anatomy,
    description:
      'Accessible menu container and items for nav heading popovers. ' +
      'NavHeadingMenu provides role="menu" with keyboard navigation; ' +
      'NavHeadingMenuItem renders individual selectable items. ' +
      'Pass as the menu prop of SideNavHeading or TopNavHeading.',
  },
  playground: {
    defaults: {
      children: [
        {__element: 'NavHeadingMenuItem', props: {label: 'Dashboard', href: '#'}},
        {__element: 'NavHeadingMenuItem', props: {label: 'Analytics', href: '#'}},
        {__element: 'NavHeadingMenuItem', props: {label: 'Settings', href: '#'}},
      ],
    },
  },
  props: [
    {name: 'children', type: 'ReactNode', required: true, description: 'Menu items.'},
    {name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls min-width and item padding.'},
    {name: 'minWidth', type: 'number | string', description: 'Minimum width override.'},
    {name: 'className', type: 'string', description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.'},
  ],
  theming: {
    targets: [
      {className: 'solo-nav-heading-menu', visualProps: ['size']},
      {className: 'solo-nav-heading-menu-item', visualProps: ['size']},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حاوية قائمة قابلة للوصول وعناصرها للنوافذ المنبثقة الخاصة بعناوين التنقّل، تُمرَّر كخاصية menu للمكوّن SideNavHeading أو TopNavHeading.',
  propDescriptions: {
    children: 'عناصر القائمة.',
    size: 'يتحكم في الحد الأدنى للعرض وحشو العناصر.',
    minWidth: 'تجاوز الحد الأدنى للعرض.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث يتجاوز أي صنف متعارض القيمة الافتراضية.',
  },
  usage: {
    description: 'حاوية قائمة قابلة للوصول وعناصرها للنوافذ المنبثقة الخاصة بعناوين التنقّل. يوفر NavHeadingMenu الدور role="menu" مع التنقّل بلوحة المفاتيح؛ ويعرض NavHeadingMenuItem عناصر فردية قابلة للتحديد. مرِّره كخاصية menu للمكوّن SideNavHeading أو TopNavHeading.',
    anatomy: [
      {
        name: 'القائمة',
        required: true,
        description: 'حاوية قائمة لإجراءات عنوان التنقّل، بدلالات القائمة والتنقّل بلوحة المفاتيح.',
      },
      {
        name: 'العنصر',
        required: true,
        description: 'إجراء قابل للتحديد أو رابط تنقّل داخل القائمة.',
      },
      {
        name: 'الأيقونة',
        required: false,
        description: 'رسم اختياري يُعرض عبر Icon قبل تسمية العنصر.',
      },
      {
        name: 'تسمية العنصر المعروضة عبر Text',
        required: false,
        description: 'تسمية عنصر نصية تُعرض عبر Text.',
      },
      {
        name: 'تسمية العنصر التي يعرضها المستدعي',
        required: false,
        description: 'محتوى تسمية عنصر غير نصي يعرضه المستدعي مباشرة.',
      },
      {
        name: 'وصف العنصر',
        required: false,
        description: 'وصف داعم اختياري يُعرض عبر Text.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Accessible menu container + items for nav heading popovers. NavHeadingMenu = role="menu" w/ keyboard nav; NavHeadingMenuItem renders selectable items.',
  usage: {
    anatomy,
    description:
      'Accessible menu container + items for nav heading popovers. NavHeadingMenu provides role="menu" w/ keyboard navigation; NavHeadingMenuItem renders individual selectable items. Pass as menu prop of SideNavHeading or TopNavHeading.',
  },
  propDescriptions: {
    size: 'controls min-width + item padding',
    minWidth: 'minimum width override',
  },
};
