/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'CommandPaletteItem',
  subComponentOf: 'CommandPalette',
  displayName: 'Command Palette Item',
  isHiddenFromOverview: true,
  description: 'A selectable item. Accepts arbitrary children for full rendering control. Registers with context for keyboard navigation when inside CommandPalette.',
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'Unique value for identification and selection.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Item content: render icons, descriptions, keyboard shortcuts, etc.',
      required: true,
    },
    {
      name: 'onSelect',
      type: '(value: string) => void',
      description: 'Called when this item is selected via click or Enter.',
    },
    {
      name: 'isHighlighted',
      type: 'boolean',
      description: 'Whether this item has keyboard focus. Derived from context when inside CommandPalette.',
      default: 'false',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description: 'Whether this item is selected in picker mode.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the item is non-interactive.',
      default: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  playground: {
    defaults: {
      value: 'go-home',
      children: 'Go to Dashboard',
    },
  },
};

export const docsZh = {
  name: 'CommandPaletteItem',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Item',
  description: '可选择的条目。接受任意子元素以实现完整的渲染控制。',
  propDescriptions: {
    value: '用于标识和选择的唯一值。',
    children: '条目内容——渲染图标、描述、键盘快捷键等。',
    onSelect: '通过点击或 Enter 选择此条目时调用。',
    isHighlighted: '此条目是否具有键盘焦点。在 CommandPalette 内从上下文派生。',
    isSelected: '此条目在选择器模式下是否被选中。',
    isDisabled: '条目是否为非交互状态。',
    className: '用于布局自定义的 Tailwind 类，通过 cn() 与组件类合并，冲突的工具类会覆盖默认值。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'عنصر قابل للتحديد. يقبل عناصر أبناء عشوائية للتحكم الكامل في العرض. يُسجَّل في السياق للتنقّل بلوحة المفاتيح عند وجوده داخل CommandPalette.',
  propDescriptions: {
    value: 'قيمة فريدة للتعريف والتحديد.',
    children: 'محتوى العنصر: اعرض الأيقونات والأوصاف واختصارات لوحة المفاتيح وغيرها.',
    onSelect: 'يُستدعى عند تحديد هذا العنصر بالنقر أو بالمفتاح Enter.',
    isHighlighted:
      'ما إذا كان هذا العنصر يحظى بتركيز لوحة المفاتيح. يُشتق من السياق عند وجوده داخل CommandPalette.',
    isSelected: 'ما إذا كان هذا العنصر محدّدًا في وضع الانتقاء.',
    isDisabled: 'ما إذا كان العنصر غير تفاعلي.',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'CommandPaletteItem',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Item',
  description: 'selectable item; arbitrary children; registers w/ context for kbd nav',
  propDescriptions: {
    value: 'unique id for selection',
    children: 'item content: icons, descriptions, shortcuts',
    onSelect: 'called on click or Enter',
    isHighlighted: 'keyboard focus; derived from context inside palette',
    isSelected: 'selected in picker mode',
    isDisabled: 'non-interactive',
    className: 'Tailwind layout classes; merged via cn(), so conflicting utilities override defaults',
  },
};
