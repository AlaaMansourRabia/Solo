/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'LayoutHeader',
  subComponentOf: 'Layout',
  displayName: 'Layout Header',
  isHiddenFromOverview: true,
  description: 'Top bar for page titles, app bars, and toolbars.',
  playground: {
    defaults: {
      children: 'Page Title',
      hasDivider: true,
    },
    wrapper: {
      component: 'Layout',
    },
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Header content.',
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description: 'Border at bottom edge.',
      default: 'false',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: 'Header height. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the landmark element.',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Internal padding of the header using the spacing scale. Overrides the default padding from the layout container.',
    },
    {
      name: 'paddingBlockEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Block-end (bottom) padding, using the spacing scale. Overrides padding on that edge only; paddingBlockEnd={0} docks the last child on the header bottom edge.',
    },
    {
      name: 'role',
      type: 'AriaRole',
      description: 'ARIA landmark role.',
    },
  ],
};

export const docsZh = {
  name: 'LayoutHeader',
  isHiddenFromOverview: true,
  displayName: 'Layout Header',
  description: '用于页面标题、应用栏和工具栏的顶部栏。',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: '页眉内容。',
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description: '底部边缘的边框。',
      default: 'false',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: '页眉高度。数字类型会被解释为像素值，字符串类型按原样使用。',
    },
    {
      name: 'label',
      type: 'string',
      description: '地标元素的无障碍标签。',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        '使用间距比例的页眉内边距。覆盖布局容器的默认内边距。',
    },
    {
      name: 'paddingBlockEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        '块结束（底部）内边距，使用间距刻度。仅在该边上覆盖 padding；paddingBlockEnd={0} 将最后一个子元素停靠在页眉底边。',
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
  description: 'شريط علوي لعناوين الصفحات وأشرطة التطبيقات وأشرطة الأدوات.',
  propDescriptions: {
    children: 'محتوى الترويسة.',
    hasDivider: 'حد عند الحافة السفلية.',
    height: 'ارتفاع الترويسة. تُعامَل الأرقام كبكسلات، وتُستخدم النصوص كما هي.',
    label: 'التسمية القابلة للوصول لعنصر المَعلَم.',
    padding: 'الحشوة الداخلية للترويسة باستخدام مقياس التباعد. تتجاوز الحشوة الافتراضية القادمة من حاوية التخطيط.',
    paddingBlockEnd: 'الحشوة عند نهاية المحور الكتلي (الأسفل)، باستخدام مقياس التباعد. تتجاوز padding على تلك الحافة فقط؛ وتُلصق paddingBlockEnd={0} العنصر الابن الأخير بالحافة السفلية للترويسة.',
    role: 'دور المَعلَم في ARIA.',
  },
};

export const docsDense = {
  name: 'LayoutHeader',
  isHiddenFromOverview: true,
  displayName: 'Layout Header',
  description: 'Top bar for page titles, app bars, toolbars.',
  propDescriptions: {
    children: 'Header content.',
    hasDivider: 'Border at bottom edge.',
    height: 'Header height.',
    label: 'Accessible label for landmark element.',
    padding: 'internal padding (spacing step); overrides the layout default',
    paddingBlockEnd:
      'Block-end (bottom) padding override; wins over padding on that edge. 0 docks the last child on the header bottom edge.',
    role: 'ARIA landmark role.',
  },
};
