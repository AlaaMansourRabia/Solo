/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'CommandPaletteList',
  subComponentOf: 'CommandPalette',
  displayName: 'Command Palette List',
  isHiddenFromOverview: true,
  description: 'Scrollable results container. Renders as a listbox for ARIA. Contains CommandPaletteItem and CommandPaletteGroup children.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Items, groups, and empty states.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the listbox.',
      default: "'Commands'",
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  playground: {
    defaults: {
      children: [
        {__element: 'CommandPaletteItem', props: {value: 'home', onSelect: undefined}, children: 'Go Home'},
        {__element: 'CommandPaletteItem', props: {value: 'settings', onSelect: undefined}, children: 'Open Settings'},
        {__element: 'CommandPaletteItem', props: {value: 'profile', onSelect: undefined}, children: 'View Profile'},
      ],
    },
  },
};

export const docsZh = {
  name: 'CommandPaletteList',
  isHiddenFromOverview: true,
  displayName: 'Command Palette List',
  description: '可滚动的结果容器。作为 listbox 渲染以符合 ARIA 规范。',
  propDescriptions: {
    children: '条目、分组和空状态。',
    label: 'listbox 的无障碍标签。',
    className: '用于布局自定义的 Tailwind 类，通过 cn() 与组件类合并，冲突的工具类会覆盖默认值。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حاوية نتائج قابلة للتمرير. تُعرض بدور listbox لأغراض ARIA. تحتوي على عناصر فرعية من CommandPaletteItem وCommandPaletteGroup.',
  propDescriptions: {
    children: 'العناصر والمجموعات وحالات القائمة الفارغة.',
    label: 'التسمية القابلة للوصول لعنصر listbox.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتغلب الأداة المتعارضة على القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'CommandPaletteList',
  isHiddenFromOverview: true,
  displayName: 'Command Palette List',
  description: 'scrollable results container; role=listbox',
  propDescriptions: {
    children: 'items, groups, empty states',
    label: 'a11y label for listbox',
    className: 'Tailwind layout classes; merged via cn(), so conflicting utilities override defaults',
  },
};
