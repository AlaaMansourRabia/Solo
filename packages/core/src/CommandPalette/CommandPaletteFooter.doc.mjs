/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'CommandPaletteFooter',
  subComponentOf: 'CommandPalette',
  displayName: 'Command Palette Footer',
  isHiddenFromOverview: true,
  description: 'Footer showing keyboard navigation hints. Renders default arrow/Enter/Escape hints when no children are provided.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Custom footer content. When omitted, renders default keyboard hints via Kbd.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
};

export const docsZh = {
  name: 'CommandPaletteFooter',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Footer',
  description: '显示键盘导航提示的页脚。未提供子元素时渲染默认方向键/Enter/Escape 提示。',
  propDescriptions: {
    children: '自定义页脚内容。省略时通过 Kbd 渲染默认键盘提示。',
    className: '用于布局自定义的 Tailwind 类，通过 cn() 与组件类合并，冲突的工具类会覆盖默认值。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'تذييل يعرض تلميحات التنقّل بلوحة المفاتيح. يعرض تلميحات الأسهم وEnter وEscape الافتراضية عند عدم توفير عناصر أبناء.',
  propDescriptions: {
    children: 'محتوى تذييل مخصّص. عند إغفاله تُعرض تلميحات لوحة المفاتيح الافتراضية عبر Kbd.',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'CommandPaletteFooter',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Footer',
  description: 'footer w/ kbd hints; default=arrow/Enter/Escape hints via Kbd',
  propDescriptions: {
    children: 'custom content; default renders kbd hints',
    className: 'Tailwind layout classes; merged via cn(), so conflicting utilities override defaults',
  },
};
