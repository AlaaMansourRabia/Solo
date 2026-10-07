/**
 * StackItem — a member of the Stack family (see Stack.doc.mjs for the family's
 * overview). Split out so the docs site can load one doc file per family member.
 */

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'StackItem',
  subComponentOf: 'Stack',
  group: 'Layout',
  category: 'Layout',
  isHiddenFromOverview: true,
  displayName: 'Stack Item',
  description:
    'Stack item for controlling individual item behavior within a stack. Supports polymorphic rendering.',
  playground: {
    wrapper: {component: 'HStack', props: {gap: 2, width: 300}},
    defaults: {
      size: 'fill',
      children: {__element: 'Card', props: {padding: 3}, children: 'Fills the row'},
    },
  },
  props: [
    {
      name: 'size',
      type: "'static' | 'fill'",
      description:
        'Flex grow behavior: static keeps natural size, fill expands to consume remaining space.',
      default: "'static'",
    },
    {
      name: 'isScrollable',
      type: 'boolean',
      description:
        'Enables scrollable overflow (overflow: auto). StackItem already applies the flex min-height/min-width reset, so <StackItem size="fill" isScrollable> is a complete scroll region. Matches isScrollable on LayoutContent and LayoutPanel.',
      default: 'false',
    },
    {
      name: 'crossAlignSelf',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description:
        'Override the cross-axis alignment for this individual item, ignoring the parent stack alignment.',
    },
    {
      name: 'as',
      type: 'ElementType',
      description: 'HTML element to render as the item wrapper.',
      default: "'div'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Item content.',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'StackItem',
  subComponentOf: 'Stack',
  group: 'Layout',
  category: 'Layout',
  isHiddenFromOverview: true,
  displayName: 'Stack Item',
  description:
    '堆叠子元素，用于控制堆叠中单个元素的行为。支持多态渲染。',
  props: [
    {
      name: 'size',
      type: "'static' | 'fill'",
      description:
        'Flex 增长行为：static 保持自然尺寸，fill 扩展以占据剩余空间。',
      default: "'static'",
    },
    {
      name: 'crossAlignSelf',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description:
        '覆盖此元素的交叉轴对齐方式，忽略父堆叠的对齐设置。',
    },
    {
      name: 'as',
      type: 'ElementType',
      description: '作为子元素包装器渲染的 HTML 元素。',
      default: "'div'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: '子元素内容。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'عنصر Stack للتحكم في سلوك كل عنصر على حدة داخل المكدّس. يدعم العرض متعدد الأشكال.',
  propDescriptions: {
    size: 'سلوك تمدّد flex: تحافظ static على الحجم الطبيعي، وتتمدد fill لتشغل المساحة المتبقية.',
    isScrollable: 'تفعّل الفيض القابل للتمرير (overflow: auto). يطبّق StackItem بالفعل إعادة ضبط min-height/min-width الخاصة بـ flex، لذا فإن <StackItem size="fill" isScrollable> منطقة تمرير مكتملة. تطابق isScrollable في LayoutContent وLayoutPanel.',
    crossAlignSelf: 'تتجاوز المحاذاة على المحور المتعامد لهذا العنصر بعينه، متجاهلةً محاذاة المكدّس الأب.',
    as: 'عنصر HTML الذي يُعرض كغلاف للعنصر.',
    children: 'محتوى العنصر.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  name: 'StackItem',
  isHiddenFromOverview: true,
  displayName: 'Stack Item',
  description: 'Controls individual item behavior in stack; polymorphic rendering.',
  propDescriptions: {
    size: 'Flex grow: static=natural size, fill=expand to remaining space.',
    crossAlignSelf: 'Override cross-axis alignment for this item, ignoring parent.',
    as: 'HTML element to render as wrapper.',
    children: 'Item content.',
  },
};
