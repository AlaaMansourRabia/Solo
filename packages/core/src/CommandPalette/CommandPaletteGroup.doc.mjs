/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'CommandPaletteGroup',
  subComponentOf: 'CommandPalette',
  displayName: 'Command Palette Group',
  isHiddenFromOverview: true,
  description: 'Visual grouping with a heading label. Place inside CommandPaletteList.',
  props: [
    {
      name: 'heading',
      type: 'string',
      description: 'Group heading text.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'CommandPaletteItem children.',
      required: true,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  playground: {
    defaults: {
      heading: 'Navigation',
      children: [
        {__element: 'CommandPaletteItem', props: {value: 'home', onSelect: undefined}, children: 'Go Home'},
        {__element: 'CommandPaletteItem', props: {value: 'settings', onSelect: undefined}, children: 'Open Settings'},
        {__element: 'CommandPaletteItem', props: {value: 'profile', onSelect: undefined}, children: 'View Profile'},
      ],
    },
  },
};

export const docsZh = {
  name: 'CommandPaletteGroup',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Group',
  description: '带标题标签的视觉分组。放置在 CommandPaletteList 内。',
  propDescriptions: {
    heading: '分组标题文本。',
    children: 'CommandPaletteItem 子元素。',
    className: '用于布局自定义的 Tailwind 类，通过 cn() 与组件类合并，冲突的工具类会覆盖默认值。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'تجميع بصري مع تسمية عنوان. ضعه داخل CommandPaletteList.',
  propDescriptions: {
    heading: 'نص عنوان المجموعة.',
    children: 'عناصر CommandPaletteItem الأبناء.',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'CommandPaletteGroup',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Group',
  description: 'group w/ heading label; inside CommandPaletteList',
  propDescriptions: {
    heading: 'group heading text',
    children: 'CommandPaletteItem children',
    className: 'Tailwind layout classes; merged via cn(), so conflicting utilities override defaults',
  },
};
