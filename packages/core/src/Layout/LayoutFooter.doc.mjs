/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'LayoutFooter',
  subComponentOf: 'Layout',
  displayName: 'Layout Footer',
  isHiddenFromOverview: true,
  description: 'Bottom bar for action bars, pagination, and status bars.',
  playground: {
    defaults: {
      children: 'Footer content: status bar or actions',
      hasDivider: true,
    },
    wrapper: {
      component: 'Layout',
      slotProp: 'footer',
      props: {
        content: {
          __element: 'LayoutContent',
          props: {},
          children: 'Main content area',
        },
      },
    },
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Footer content.',
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description: 'Border at top edge.',
      default: 'false',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: 'Footer height. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Internal padding of the footer using the spacing scale. Overrides the default padding from the layout container.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the landmark element.',
    },
    {
      name: 'role',
      type: 'AriaRole',
      description: 'ARIA landmark role.',
    },
  ],
};

export const docsZh = {
  name: 'LayoutFooter',
  isHiddenFromOverview: true,
  displayName: 'Layout Footer',
  description: '用于操作栏、分页和状态栏的底部栏。',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: '页脚内容。',
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description: '顶部边缘的边框。',
      default: 'false',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: '页脚高度。数字类型会被解释为像素值，字符串类型按原样使用。',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        '使用间距比例的页脚内边距。覆盖布局容器的默认内边距。',
    },
    {
      name: 'label',
      type: 'string',
      description: '地标元素的无障碍标签。',
    },
    {
      name: 'role',
      type: 'AriaRole',
      description: 'ARIA 地标角色。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'شريط سفلي لأشرطة الإجراءات وترقيم الصفحات وأشرطة الحالة.',
  propDescriptions: {
    children: 'محتوى التذييل.',
    hasDivider: 'حدّ عند الحافة العلوية.',
    height: 'ارتفاع التذييل. تُعامَل الأرقام على أنها بكسلات، وتُستخدم السلاسل كما هي.',
    padding:
      'الحشو الداخلي للتذييل باستخدام مقياس التباعد. يتجاوز الحشو الافتراضي المستمد من حاوية التخطيط.',
    label: 'التسمية القابلة للوصول لعنصر المعلَم.',
    role: 'دور معلَم ARIA.',
  },
};

export const docsDense = {
  name: 'LayoutFooter',
  isHiddenFromOverview: true,
  displayName: 'Layout Footer',
  description: 'Bottom bar for action bars, pagination, status bars.',
  propDescriptions: {
    children: 'Footer content.',
    hasDivider: 'Border at top edge.',
    height: 'Footer height.',
    padding: 'internal padding (spacing step); overrides the layout default',
    label: 'Accessible label for landmark element.',
    role: 'ARIA landmark role.',
  },
};
