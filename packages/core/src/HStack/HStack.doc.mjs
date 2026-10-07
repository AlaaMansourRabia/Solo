/**
 * HStack — a member of the Stack family (see ../Stack/Stack.doc.mjs for the family's
 * overview). Split out so the docs site can load one doc file per family member.
 */

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'HStack',
  subComponentOf: 'Stack',
  group: 'Layout',
  category: 'Layout',
  isHiddenFromOverview: true,
  displayName: 'H Stack',
  description:
    'Horizontal stack for arranging items left-to-right. Supports polymorphic rendering.',
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
      type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
      description: 'Horizontal (main-axis) alignment of items.',
    },
    {
      name: 'vAlign',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: 'Vertical (cross-axis) alignment of items.',
      default: "'stretch'",
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
      description: 'Main-axis alignment alias for hAlign. Mirrors CSS justify-content.',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: 'Cross-axis alignment alias for vAlign. Mirrors CSS align-items.',
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
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],    
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'HStack',
  subComponentOf: 'Stack',
  group: 'Layout',
  category: 'Layout',
  isHiddenFromOverview: true,
  displayName: 'H Stack',
  description:
    '水平堆叠组件，将元素从左到右排列。支持多态渲染。',
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
      type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
      description: '水平（主轴）对齐方式。',
    },
    {
      name: 'vAlign',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: '元素的垂直（交叉轴）对齐方式。',
      default: "'stretch'",
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
      description: 'hAlign 的别名。对应 CSS justify-content。',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: 'vAlign 的别名。对应 CSS align-items。',
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
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'مكدّس أفقي لترتيب العناصر من اليسار إلى اليمين. يدعم العرض متعدد الأشكال.',
  propDescriptions: {
    gap: 'درجة التباعد (رقم حرفي): 0، 0.5، 1، 1.5، 2، 3، 4، 5، 6، 8، 10. مرّرها كتعبير رقمي في JSX، مثل gap={4}، وليس كنص مثل gap="4".',
    padding: 'الحشوة الداخلية من جميع الجهات، باستخدام مقياس التباعد (0، 0.5، 1، 1.5، 2، 3، 4، 5، 6، 8، 10). تطابق خاصية padding في Card وLayoutContent وLayoutPanel. مرّرها كتعبير رقمي في JSX، مثل padding={3}.',
    paddingInline: 'الحشوة السطرية (الأفقية)، باستخدام مقياس التباعد. تتجاوز padding على المحور السطري عند تعيين الاثنتين.',
    paddingInlineStart: 'الحشوة عند بداية المحور السطري، باستخدام مقياس التباعد (اليسار في LTR، واليمين في RTL). تتجاوز paddingInline وpadding على تلك الحافة فقط.',
    paddingInlineEnd: 'الحشوة عند نهاية المحور السطري، باستخدام مقياس التباعد (اليمين في LTR، واليسار في RTL). تتجاوز paddingInline وpadding على تلك الحافة فقط.',
    paddingBlock: 'الحشوة الكتلية (الرأسية)، باستخدام مقياس التباعد. تتجاوز padding على المحور الكتلي عند تعيين الاثنتين.',
    paddingBlockStart: 'الحشوة عند بداية المحور الكتلي (الأعلى)، باستخدام مقياس التباعد. تتجاوز paddingBlock وpadding على تلك الحافة فقط.',
    paddingBlockEnd: 'الحشوة عند نهاية المحور الكتلي (الأسفل)، باستخدام مقياس التباعد. تتجاوز paddingBlock وpadding على تلك الحافة فقط.',
    isScrollable: 'يفعّل الفائض القابل للتمرير (overflow: auto). يطابق isScrollable في LayoutContent وLayoutPanel.',
    width: 'عرض حاوية المكدّس. تُعامَل الأرقام كبكسلات، وتُستخدم النصوص كما هي (مثل \'100%\').',
    height: 'ارتفاع حاوية المكدّس. تُعامَل الأرقام كبكسلات، وتُستخدم النصوص كما هي (مثل \'100%\').',
    maxWidth: 'الحد الأقصى لعرض حاوية المكدّس. تُعامَل الأرقام كبكسلات، وتُستخدم النصوص كما هي (مثل \'100%\').',
    minHeight: 'الحد الأدنى لارتفاع حاوية المكدّس. تُعامَل الأرقام كبكسلات، وتُستخدم النصوص كما هي (مثل \'100%\').',
    hAlign: 'المحاذاة الأفقية (على المحور الرئيسي) للعناصر.',
    vAlign: 'المحاذاة الرأسية (على المحور المتقاطع) للعناصر.',
    justify: 'اسم بديل لـ hAlign للمحاذاة على المحور الرئيسي. يحاكي justify-content في CSS.',
    align: 'اسم بديل لـ vAlign للمحاذاة على المحور المتقاطع. يحاكي align-items في CSS.',
    wrap: 'سلوك الالتفاف في flex.',
    as: 'عنصر HTML الذي تُعرض به حاوية المكدّس.',
    children: 'محتوى المكدّس.',
    className: 'فئات Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  name: 'HStack',
  isHiddenFromOverview: true,
  displayName: 'H Stack',
  description: 'Horizontal stack; left-to-right, polymorphic rendering.',
  propDescriptions: {
    gap: 'Number literal spacing step: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10. Use gap={4} not gap="4".',
    width: "Width of container. Numbers=pixels, strings=as-is (e.g. '100%').",
    height: "Height of container. Numbers=pixels, strings=as-is (e.g. '100%').",
    hAlign: 'Horizontal (main-axis) alignment.',
    vAlign: 'Vertical (cross-axis) alignment.',
    justify: 'Main-axis alignment alias for hAlign. Mirrors CSS justify-content.',
    align: 'Cross-axis alignment alias for vAlign. Mirrors CSS align-items.',
    wrap: 'Flex wrap behavior.',
    as: 'HTML element to render as container.',
    children: 'Stack content.',
    className: 'Tailwind layout classes; merged via cn(), so conflicting utilities override defaults.',
  },
};
