/**
 * VStack — a member of the Stack family (see ../Stack/Stack.doc.mjs for the family's
 * overview). Split out so the docs site can load one doc file per family member.
 */

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'VStack',
  subComponentOf: 'Stack',
  group: 'Layout',
  category: 'Layout',
  isHiddenFromOverview: true,
  displayName: 'V Stack',
  description:
    'Vertical stack for arranging items top-to-bottom. Supports polymorphic rendering.',
  playground: {
    defaults: {
      gap: 2,
      children: [
        {__element: 'Card', props: {padding: 3}, children: 'Item 1'},
        {__element: 'Card', props: {padding: 3}, children: 'Item 2'},
        {__element: 'Card', props: {padding: 3}, children: 'Item 3'},
      ],
    },
  },
  props: [
    {
      name: 'gap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Spacing step (number literal): 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10. Pass as a JSX number expression e.g. gap={4}, NOT a string like gap="4".',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Inner padding on all sides, using the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10). Matches the padding prop on Card, LayoutContent, and LayoutPanel. Pass as a JSX number expression e.g. padding={3}.',
    },
    {
      name: 'paddingInline',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Inline (horizontal) padding, using the spacing scale. Overrides padding on the inline axis when both are set.',
    },
    {
      name: 'paddingInlineStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Inline-start padding, using the spacing scale (left in LTR, right in RTL). Overrides paddingInline and padding on that edge only.',
    },
    {
      name: 'paddingInlineEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Inline-end padding, using the spacing scale (right in LTR, left in RTL). Overrides paddingInline and padding on that edge only.',
    },
    {
      name: 'paddingBlock',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Block (vertical) padding, using the spacing scale. Overrides padding on the block axis when both are set.',
    },
    {
      name: 'paddingBlockStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Block-start (top) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
    },
    {
      name: 'paddingBlockEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Block-end (bottom) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
    },
    {
      name: 'isScrollable',
      type: 'boolean',
      description:
        'Enables scrollable overflow (overflow: auto). Matches isScrollable on LayoutContent and LayoutPanel.',
      default: 'false',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: "Width of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: "Height of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: "Maximum width of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: "Minimum height of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
    },
    {
      name: 'hAlign',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: 'Horizontal (cross-axis) alignment of items.',
      default: "'stretch'",
    },
    {
      name: 'vAlign',
      type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
      description: 'Vertical (main-axis) alignment of items.',
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
      description: 'Main-axis alignment alias for vAlign. Mirrors CSS justify-content.',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: 'Cross-axis alignment alias for hAlign. Mirrors CSS align-items.',
    },
    {
      name: 'wrap',
      type: "'nowrap' | 'wrap' | 'wrap-reverse'",
      description: 'Flex wrap behavior.',
      default: "'nowrap'",
    },
    {
      name: 'as',
      type: 'ElementType',
      description: 'HTML element to render as the stack container.',
      default: "'div'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Stack content.',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'VStack',
  subComponentOf: 'Stack',
  group: 'Layout',
  category: 'Layout',
  isHiddenFromOverview: true,
  displayName: 'V Stack',
  description:
    '垂直堆叠组件，将元素从上到下排列。支持多态渲染。',
  props: [
    {
      name: 'gap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        '间距步进（数字字面量）：0、0.5、1、1.5、2、3、4、5、6、8、10。在 JSX 中使用数字表达式 e.g. gap={4}，不要使用字符串 gap="4"。',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: '堆叠容器的宽度。数字按像素处理，字符串原样使用（如 \'100%\'）。',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: '堆叠容器的高度。数字按像素处理，字符串原样使用（如 \'100%\'）。',
    },
    {
      name: 'hAlign',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: '元素的水平（交叉轴）对齐方式。',
      default: "'stretch'",
    },
    {
      name: 'vAlign',
      type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
      description: '垂直（主轴）对齐方式。',
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
      description: 'vAlign 的别名。对应 CSS justify-content。',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: 'hAlign 的别名。对应 CSS align-items。',
    },
    {
      name: 'wrap',
      type: "'nowrap' | 'wrap' | 'wrap-reverse'",
      description: 'Flex 换行行为。',
      default: "'nowrap'",
    },
    {
      name: 'as',
      type: 'ElementType',
      description: '作为堆叠容器渲染的 HTML 元素。',
      default: "'div'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: '堆叠内容。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'مكدّس عمودي لترتيب العناصر من الأعلى إلى الأسفل. يدعم العرض متعدد الأشكال.',
  propDescriptions: {
    gap: 'خطوة التباعد (قيمة رقمية حرفية): 0، 0.5، 1، 1.5، 2، 3، 4، 5، 6، 8، 10. مرِّرها كتعبير رقمي في JSX مثل gap={4}، وليس كنص مثل gap="4".',
    padding: 'الحشو الداخلي من جميع الجوانب، باستخدام مقياس التباعد (0، 0.5، 1، 1.5، 2، 3، 4، 5، 6، 8، 10). يطابق الخاصية padding في Card وLayoutContent وLayoutPanel. مرِّرها كتعبير رقمي في JSX مثل padding={3}.',
    paddingInline: 'الحشو الأفقي (inline)، باستخدام مقياس التباعد. يتجاوز padding على المحور الأفقي عند ضبط كليهما.',
    paddingInlineStart: 'حشو بداية المحور الأفقي، باستخدام مقياس التباعد (اليسار في LTR، واليمين في RTL). يتجاوز paddingInline وpadding على تلك الحافة فقط.',
    paddingInlineEnd: 'حشو نهاية المحور الأفقي، باستخدام مقياس التباعد (اليمين في LTR، واليسار في RTL). يتجاوز paddingInline وpadding على تلك الحافة فقط.',
    paddingBlock: 'الحشو العمودي (block)، باستخدام مقياس التباعد. يتجاوز padding على المحور العمودي عند ضبط كليهما.',
    paddingBlockStart: 'حشو بداية المحور العمودي (الأعلى)، باستخدام مقياس التباعد. يتجاوز paddingBlock وpadding على تلك الحافة فقط.',
    paddingBlockEnd: 'حشو نهاية المحور العمودي (الأسفل)، باستخدام مقياس التباعد. يتجاوز paddingBlock وpadding على تلك الحافة فقط.',
    isScrollable: 'يفعّل الفيض القابل للتمرير (overflow: auto). يطابق isScrollable في LayoutContent وLayoutPanel.',
    width: 'عرض حاوية المكدّس. تُعامل الأرقام كبكسلات، وتُستخدم النصوص كما هي (مثل \'100%\').',
    height: 'ارتفاع حاوية المكدّس. تُعامل الأرقام كبكسلات، وتُستخدم النصوص كما هي (مثل \'100%\').',
    maxWidth: 'أقصى عرض لحاوية المكدّس. تُعامل الأرقام كبكسلات، وتُستخدم النصوص كما هي (مثل \'100%\').',
    minHeight: 'أدنى ارتفاع لحاوية المكدّس. تُعامل الأرقام كبكسلات، وتُستخدم النصوص كما هي (مثل \'100%\').',
    hAlign: 'المحاذاة الأفقية (المحور المتقاطع) للعناصر.',
    vAlign: 'المحاذاة العمودية (المحور الرئيسي) للعناصر.',
    justify: 'اسم بديل لمحاذاة المحور الرئيسي vAlign. يحاكي justify-content في CSS.',
    align: 'اسم بديل لمحاذاة المحور المتقاطع hAlign. يحاكي align-items في CSS.',
    wrap: 'سلوك الالتفاف في flex.',
    as: 'عنصر HTML الذي يُعرض كحاوية للمكدّس.',
    children: 'محتوى المكدّس.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  name: 'VStack',
  isHiddenFromOverview: true,
  displayName: 'V Stack',
  description: 'Vertical stack; top-to-bottom, polymorphic rendering.',
  propDescriptions: {
    gap: 'Number literal spacing step: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10. Use gap={4} not gap="4".',
    width: "Width of container. Numbers=pixels, strings=as-is (e.g. '100%').",
    height: "Height of container. Numbers=pixels, strings=as-is (e.g. '100%').",
    hAlign: 'Horizontal (cross-axis) alignment.',
    vAlign: 'Vertical (main-axis) alignment.',
    justify: 'Main-axis alignment alias for vAlign. Mirrors CSS justify-content.',
    align: 'Cross-axis alignment alias for hAlign. Mirrors CSS align-items.',
    wrap: 'Flex wrap behavior.',
    as: 'HTML element to render as container.',
    children: 'Stack content.',
  },
};
