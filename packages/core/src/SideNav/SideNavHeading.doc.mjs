/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'SideNavHeading',
  subComponentOf: 'SideNav',
  displayName: 'Side Nav Heading',
  isHiddenFromOverview: true,
  description: 'Product/suite/account heading with smart interaction boundary logic for links and a menu popover.',
  playground: {
    defaults: {heading: 'Acme Console', subheading: 'Production'},
  },
  props: [
    {
      name: 'heading',
      type: 'string',
      description: 'Product/app name.',
      required: true,
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Product/app icon.',
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
      name: 'headingHref',
      type: 'string',
      description: 'Link for the heading.',
    },
    {
      name: 'superheading',
      type: 'string',
      description: 'Text above the heading.',
    },
    {
      name: 'superheadingHref',
      type: 'string',
      description: 'Link for the superheading.',
    },
    {
      name: 'subheading',
      type: 'string',
      description: 'Text below the heading.',
    },
    {
      name: 'subheadingHref',
      type: 'string',
      description: 'Link for the subheading.',
    },
    {
      name: 'as',
      type: 'ElementType',
      description:
        'Custom link component rendered instead of <a> for the heading links (e.g. Next.js Link). Overrides the LinkProvider default; must accept href, className, style, and children.',
    },
    {
      name: 'menu',
      type: 'ReactNode',
      description: 'Menu content rendered inside a popover.',
      slotElements: [
        {
          __element: 'Button',
          props: {
            label: 'Action',
            variant: 'ghost',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'headerEndContent',
      type: 'ReactNode',
      description: 'Content rendered at the trailing edge of the heading row, between text and chevron. Useful for badges, status indicators, or compact action buttons. Hidden when collapsed.',
      slotElements: [
        {
          __element: 'Button',
          props: {
            label: 'Action',
            variant: 'ghost',
            size: 'sm',
          },
        },
      ],
    },
  ],
};

export const docsZh = {
  name: 'SideNavHeading',
  isHiddenFromOverview: true,
  displayName: 'Side Nav Heading',
  description: '产品/套件/账户头部，具有智能交互边界逻辑，支持链接和菜单弹出框。',
  props: [
    {
      name: 'heading',
      type: 'string',
      description: '产品/应用名称。',
      required: true,
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: '产品/应用图标。',
    },
    {
      name: 'headingHref',
      type: 'string',
      description: '标题的链接。',
    },
    {
      name: 'superheading',
      type: 'string',
      description: '标题上方的文本。',
    },
    {
      name: 'superheadingHref',
      type: 'string',
      description: '上方标题的链接。',
    },
    {
      name: 'subheading',
      type: 'string',
      description: '标题下方的文本。',
    },
    {
      name: 'subheadingHref',
      type: 'string',
      description: '下方标题的链接。',
    },
    {
      name: 'as',
      type: 'ElementType',
      description:
        '用于替代 <a> 渲染标题链接的自定义链接组件（如 Next.js Link）。覆盖 LinkProvider 的默认值；必须接受 href、className、style 和 children。',
    },
    {
      name: 'menu',
      type: 'ReactNode',
      description: '在弹出框内渲染的菜单内容。',
    },
    {
      name: 'headerEndContent',
      type: 'ReactNode',
      description: '在标题行尾部渲染的内容，位于文本和箭头之间。适用于徽章、状态指示器或紧凑操作按钮。折叠时隐藏。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'عنوان المنتج/المجموعة/الحساب مع منطق ذكي لحدود التفاعل للروابط ونافذة منبثقة لقائمة.',
  propDescriptions: {
    heading: 'اسم المنتج/التطبيق.',
    icon: 'أيقونة المنتج/التطبيق.',
    headingHref: 'رابط العنوان.',
    superheading: 'نص أعلى العنوان.',
    superheadingHref: 'رابط النص العلوي.',
    subheading: 'نص أسفل العنوان.',
    subheadingHref: 'رابط النص السفلي.',
    as: 'مكوّن رابط مخصّص يُعرض بدلًا من <a> لروابط العنوان (مثل Next.js Link). يتجاوز القيمة الافتراضية لـ LinkProvider؛ ويجب أن يقبل href وclassName وstyle وchildren.',
    menu: 'محتوى القائمة المعروض داخل نافذة منبثقة.',
    headerEndContent: 'محتوى يُعرض عند الحافة الختامية لصف العنوان، بين النص وعلامة السهم. مفيد للشارات أو مؤشرات الحالة أو أزرار الإجراءات المدمجة. يُخفى عند الطيّ.',
  },
};

export const docsDense = {
  name: 'SideNavHeading',
  isHiddenFromOverview: true,
  displayName: 'Side Nav Heading',
  description: 'Product/suite/account heading w/ smart interaction boundary logic for links + menu popover.',
  propDescriptions: {
    heading: 'Product/app name.',
    icon: 'Product/app icon.',
    headingHref: 'Link for heading.',
    superheading: 'Text above heading.',
    superheadingHref: 'Link for superheading.',
    subheading: 'Text below heading.',
    subheadingHref: 'Link for subheading.',
    as: 'custom link component instead of <a>; overrides LinkProvider',
    menu: 'Menu content rendered inside popover.',
    headerEndContent: 'Content at trailing edge of heading row. For badges, status indicators, action buttons. Hidden when collapsed.',
  },
};
