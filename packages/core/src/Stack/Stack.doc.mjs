/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Stack container',
    required: true,
    description: 'Layout container that arranges content along one flex axis.',
  },
  {
    name: 'Item',
    required: false,
    description: 'Optional StackItem wrapper that controls one item in the stack.',
  },
  {
    name: 'Content',
    required: false,
    description: 'Caller-supplied content rendered by a Stack or StackItem.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Stack',
  displayName: 'Stack',
  group: 'Layout',
  category: 'Layout',
  keywords: ["stack","hstack","vstack","flexbox","flex","spacing","gap","horizontal","vertical","row","column"],
  theming: {
    targets: [
      {className: 'solo-stack', visualProps: ['direction', 'gap', 'wrap']},
      {className: 'solo-stack-item', visualProps: ['size']},
    ],
  },
  components: [
    {
      name: 'Stack',
      displayName: 'Stack',
      description:
        'Unified stack layout component with a direction prop. Use direction="horizontal" for left-to-right flow or direction="vertical" (default) for top-to-bottom. For convenience, HStack and VStack are pre-configured wrappers.',
      playground: {
        defaults: {
          direction: 'horizontal',
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
          name: 'direction',
          type: "'horizontal' | 'vertical'",
          description:
            "Direction of the stack layout. 'horizontal' flows items left-to-right (like HStack), 'vertical' flows top-to-bottom (like VStack). Note: the value is 'horizontal', NOT 'row'.",
          default: "'vertical'",
        },
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
            'Inner padding on all sides, using the spacing scale. Pass as a JSX number expression e.g. padding={3}.',
        },
        {
          name: 'paddingInline',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inline (horizontal) padding. Overrides padding on the inline axis when both are set.',
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
            'Block (vertical) padding. Overrides padding on the block axis when both are set.',
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
            'Enables scrollable overflow (overflow: auto).',
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
          description: "Maximum width of the stack container.",
        },
        {
          name: 'minHeight',
          type: 'SizeValue',
          description: "Minimum height of the stack container.",
        },
        {
          name: 'hAlign',
          type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | 'stretch'",
          description: "Horizontal alignment. When direction='horizontal': main-axis (justify-content). When direction='vertical': cross-axis (align-items).",
        },
        {
          name: 'vAlign',
          type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | 'stretch'",
          description: "Vertical alignment. When direction='horizontal': cross-axis (align-items). When direction='vertical': main-axis (justify-content).",
        },
        {
          name: 'justify',
          type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
          description: "Main-axis alignment alias. Resolves to hAlign (horizontal) or vAlign (vertical). Note: use 'between', NOT 'space-between'.",
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end' | 'stretch'",
          description: 'Cross-axis alignment alias. Mirrors CSS align-items.',
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
    },
    {name: 'HStack'},
    {name: 'VStack'},
    {name: 'StackItem'},
  ],
  usage: {
    anatomy,
    description:
      'Stack arranges items in a row or column with consistent spacing. Use the gap prop to control the space between items.',
    bestPractices: [
      { guidance: true, description: 'Use the gap prop for spacing between items; don\'t add margins manually.' },
      { guidance: true, description: 'Use StackItem with size="fill" to make one item stretch and fill the leftover space.' },
      { guidance: false, description: 'Nest stacks inside stacks; try wrap="wrap" first to let items flow to the next line.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Stack',
  displayName: 'Stack',
  group: 'Layout',
  theming: {
    targets: [
      {className: 'solo-stack', visualProps: ['direction', 'gap', 'wrap']},
      {className: 'solo-stack-item', visualProps: ['size']},
    ],
  },
  components: [
    {name: 'HStack'},
    {name: 'VStack'},
    {name: 'StackItem'},
  ],
  usage: {
    anatomy,
    description:
      'Stack arranges items in a row or column with consistent spacing. Use the gap prop to control the space between items.',
    bestPractices: [
      { guidance: true, description: 'Use the gap prop for spacing between items; don\'t add margins manually.' },
      { guidance: true, description: 'Use StackItem with size="fill" to make one item stretch and fill the leftover space.' },
      { guidance: false, description: 'Nest stacks inside stacks; try wrap="wrap" first to let items flow to the next line.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يرتّب Stack العناصر في صف أو عمود بتباعد متسق، مع التحكم في المسافة بينها عبر الخاصية gap.',
  usage: {
    description: 'يرتّب Stack العناصر في صف أو عمود بتباعد متسق. استخدم الخاصية gap للتحكم في المسافة بين العناصر.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم الخاصية gap للتباعد بين العناصر؛ ولا تُضف هوامش يدويًا.',
      },
      {
        guidance: true,
        description: 'استخدم StackItem مع size="fill" لجعل عنصر واحد يتمدد ويملأ المساحة المتبقية.',
      },
      {
        guidance: false,
        description: 'تداخل الحزم داخل حزم أخرى؛ جرّب wrap="wrap" أولًا للسماح للعناصر بالانتقال إلى السطر التالي.',
      },
    ],
    anatomy: [
      {
        name: 'حاوية الحزمة',
        required: true,
        description: 'حاوية تخطيط ترتّب المحتوى على محور flex واحد.',
      },
      {
        name: 'العنصر',
        required: false,
        description: 'غلاف StackItem اختياري يتحكم في عنصر واحد داخل الحزمة.',
      },
      {
        name: 'المحتوى',
        required: false,
        description: 'محتوى يوفره المستدعي ويعرضه Stack أو StackItem.',
      },
    ],
  },
  components: [
    {
      name: 'Stack',
      displayName: 'حزمة',
      description: 'مكوّن تخطيط حزمة موحّد مع الخاصية direction. استخدم direction="horizontal" للتدفق من اليسار إلى اليمين أو direction="vertical" (الافتراضي) للتدفق من الأعلى إلى الأسفل. ولمزيد من السهولة، يتوفر HStack و VStack كغلافين مُعدّين مسبقًا.',
      propDescriptions: {
        direction: 'اتجاه تخطيط الحزمة. يرتّب \'horizontal\' العناصر من اليسار إلى اليمين (مثل HStack)، ويرتّبها \'vertical\' من الأعلى إلى الأسفل (مثل VStack). ملاحظة: القيمة هي \'horizontal\' وليست \'row\'.',
        gap: 'خطوة التباعد (قيمة رقمية حرفية): 0 أو 0.5 أو 1 أو 1.5 أو 2 أو 3 أو 4 أو 5 أو 6 أو 8 أو 10. مرّرها كتعبير رقمي في JSX مثل gap={4}، وليس كسلسلة نصية مثل gap="4".',
        padding: 'الحشو الداخلي على جميع الجوانب باستخدام مقياس التباعد. مرّره كتعبير رقمي في JSX مثل padding={3}.',
        paddingInline: 'الحشو المضمّن (الأفقي). يتجاوز padding على المحور المضمّن عند تعيين كليهما.',
        paddingInlineStart: 'حشو بداية المحور المضمّن باستخدام مقياس التباعد (اليسار في LTR، واليمين في RTL). يتجاوز paddingInline و padding على تلك الحافة فقط.',
        paddingInlineEnd: 'حشو نهاية المحور المضمّن باستخدام مقياس التباعد (اليمين في LTR، واليسار في RTL). يتجاوز paddingInline و padding على تلك الحافة فقط.',
        paddingBlock: 'الحشو الكتلي (الرأسي). يتجاوز padding على المحور الكتلي عند تعيين كليهما.',
        paddingBlockStart: 'حشو بداية المحور الكتلي (الأعلى) باستخدام مقياس التباعد. يتجاوز paddingBlock و padding على تلك الحافة فقط.',
        paddingBlockEnd: 'حشو نهاية المحور الكتلي (الأسفل) باستخدام مقياس التباعد. يتجاوز paddingBlock و padding على تلك الحافة فقط.',
        isScrollable: 'يفعّل الفيض القابل للتمرير (overflow: auto).',
        width: 'عرض حاوية الحزمة. تُعامَل الأرقام كبكسلات، وتُستخدم السلاسل النصية كما هي (مثل \'100%\').',
        height: 'ارتفاع حاوية الحزمة. تُعامَل الأرقام كبكسلات، وتُستخدم السلاسل النصية كما هي (مثل \'100%\').',
        maxWidth: 'الحد الأقصى لعرض حاوية الحزمة.',
        minHeight: 'الحد الأدنى لارتفاع حاوية الحزمة.',
        hAlign: 'المحاذاة الأفقية. عندما تكون direction=\'horizontal\': المحور الرئيسي (justify-content). وعندما تكون direction=\'vertical\': المحور المتقاطع (align-items).',
        vAlign: 'المحاذاة الرأسية. عندما تكون direction=\'horizontal\': المحور المتقاطع (align-items). وعندما تكون direction=\'vertical\': المحور الرئيسي (justify-content).',
        justify: 'اسم بديل لمحاذاة المحور الرئيسي. يُحوَّل إلى hAlign (أفقي) أو vAlign (رأسي). ملاحظة: استخدم \'between\' وليس \'space-between\'.',
        align: 'اسم بديل لمحاذاة المحور المتقاطع. يطابق align-items في CSS.',
        wrap: 'سلوك الالتفاف في flex.',
        as: 'عنصر HTML الذي تُعرض به حاوية الحزمة.',
        children: 'محتوى الحزمة.',
      },
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Stack layout primitives for horizontal/vertical sequences using flexbox w/ themed spacing tokens.',
  usage: {
    anatomy,
    description:
      'Stack arranges items in a row or column with consistent spacing. Use the gap prop to control the space between items.',
    bestPractices: [
      { guidance: true, description: 'Use the gap prop for spacing between items; don\'t add margins manually.' },
      { guidance: true, description: 'Use StackItem with size="fill" to make one item stretch and fill the leftover space.' },
      { guidance: false, description: 'Nest stacks inside stacks; try wrap="wrap" first to let items flow to the next line.' },
    ],
  },
  components: [
    {name: 'HStack'},
    {name: 'VStack'},
    {name: 'StackItem'},
  ],
};