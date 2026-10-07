/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'SideNavSection',
  subComponentOf: 'SideNav',
  displayName: 'Side Nav Section',
  isHiddenFromOverview: true,
  description: 'Section grouping with an optional title, subtitle, and end content.',
  playground: {
    defaults: {
      title: 'Workspace',
      children: [
        {__element: 'SideNavItem', props: {label: 'Dashboard', isSelected: true}},
        {__element: 'SideNavItem', props: {label: 'Projects'}},
        {__element: 'SideNavItem', props: {label: 'Settings'}},
      ],
    },
  },
  props: [
    {
      name: 'title',
      type: 'string',
      description: 'Section title.',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'string',
      description: 'Section subtitle.',
    },
    {
      name: 'children',
      required: true,
      type: 'ReactNode',
      description: 'Section items.',
      slotElements: [
        {
          __element: 'SideNavItem',
          props: {
            label: 'Item',
          },
        },
      ],
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Right-side content in the section header.',
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
      name: 'isHeaderHidden',
      type: 'boolean',
      description: 'Visually hides the section header while keeping it accessible to screen readers.',
      default: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
};

export const docsZh = {
  name: 'SideNavSection',
  isHiddenFromOverview: true,
  displayName: 'Side Nav Section',
  description: '分组，支持可选的标题、副标题和尾部内容。',
  props: [
    {
      name: 'title',
      type: 'string',
      description: '分组标题。',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'string',
      description: '分组副标题。',
    },
    {
      name: 'children',
      required: true,
      type: 'ReactNode',
      description: '分组项目。',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: '分组头部的右侧内容。',
    },
    {
      name: 'isHeaderHidden',
      type: 'boolean',
      description: '视觉上隐藏分组头部，同时保持屏幕阅读器可访问。',
      default: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description: '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'تجميع للأقسام مع عنوان وعنوان فرعي ومحتوى ختامي اختيارية.',
  propDescriptions: {
    title: 'عنوان القسم.',
    subtitle: 'العنوان الفرعي للقسم.',
    children: 'عناصر القسم.',
    endContent: 'محتوى الجانب الأيمن في ترويسة القسم.',
    isHeaderHidden: 'يُخفي ترويسة القسم بصريًا مع إبقائها متاحة لقارئ الشاشة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'SideNavSection',
  isHiddenFromOverview: true,
  displayName: 'Side Nav Section',
  description: 'Section grouping w/ optional title, subtitle, end content.',
  propDescriptions: {
    title: 'Section title.',
    subtitle: 'Section subtitle.',
    children: 'Section items.',
    endContent: 'Right-side content in section header.',
    isHeaderHidden: 'Visually hides section header while keeping accessible to screen readers.',
    className: 'Tailwind classes for layout customization.',
  },
};
