/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Section container',
    required: true,
    description: 'Painted container that groups a page region.',
  },
  {
    name: 'Consumer content',
    required: false,
    description: 'Caller-provided content rendered inside the section container.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Section',
  displayName: 'Section',
  group: 'Layout',
  category: 'Layout',
  keywords: ["section","panel","container","group","fieldset","region","block"],
  props: [
    {
      name: 'variant',
      type: "'section' | 'transparent' | 'muted'",
      description: 'Background variant applied to the section container.',
      default: "'section'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the section; a number is interpreted as pixels, a string is used as-is.',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description:
        'Height of the section; a number is interpreted as pixels, a string is used as-is.',
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: 'Maximum width of the section.',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: 'Minimum height of the section.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content rendered inside the section.',
    },
    {
      name: 'dividers',
      type: "Array<'top' | 'bottom' | 'start' | 'end'>",
      description: 'Which sides of the section have divider borders.',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Internal padding using the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10). Use padding={0} for edge-to-edge content.',
      default: '4',
    },
    {
      name: 'paddingInline',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Inline (horizontal) padding override. Overrides only the inline-axis padding while preserving block padding from `padding` or the container theme default. Accepts the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10).',
    },
    {
      name: 'paddingInlineStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Inline-start padding override (left in LTR, right in RTL). Overrides paddingInline and padding on that edge only.',
    },
    {
      name: 'paddingInlineEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Inline-end padding override (right in LTR, left in RTL). Overrides paddingInline and padding on that edge only.',
    },
    {
      name: 'paddingBlock',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Block (vertical) padding override. Overrides only the block-axis padding while preserving inline padding from `padding` or the container theme default. Accepts the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10).',
    },
    {
      name: 'paddingBlockStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Block-start (top) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
    },
    {
      name: 'paddingBlockEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Block-end (bottom) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    container: true,
    targets: [
      {className: 'solo-section', visualProps: ['variant']},
    ],
    derived: [
      {property: 'padding', expand: 'container'},
    ],
  },
  usage: {
    anatomy,
    description:
      'Section is the correct way to create page regions and group related content on a page. Use it for settings groups, form sections, sidebar areas, or any time you need visual separation between parts of a page. If you are tempted to use a Card for a page section, use Section instead.',
    bestPractices: [
      { guidance: true, description: 'Use Section for page-level grouping: settings panels, form groups, sidebar regions. These are sections of a page, not discrete items.' },
      { guidance: true, description: 'Start with the default variant. Use muted only to call attention to a specific region.' },
      { guidance: true, description: 'Add dividers between same-background sections that need separation.' },
      { guidance: true, description: 'Combine with a heading + Stack for a typical page section pattern.' },
      { guidance: false, description: 'Use Card when you mean Section. Cards are for discrete items (one notification, one profile). Sections are for page regions.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Section',
  displayName: 'Section',
  props: [
    {
      name: 'variant',
      type: "'section' | 'transparent' | 'muted'",
      description: '应用于区域容器的背景变体。',
      default: "'section'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        '区域的宽度；数字类型会被解释为像素值，字符串类型按原样使用。',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description:
        '区域的高度；数字类型会被解释为像素值，字符串类型按原样使用。',
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: '区域的最大宽度。',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: '区域的最小高度。',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: '在区域内部渲染的内容。',
    },
    {
      name: 'dividers',
      type: "Array<'top' | 'bottom' | 'start' | 'end'>",
      description: '区域的哪些边具有分隔线边框。',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '使用间距比例的内部内边距（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。使用 padding={0} 实现全宽内容。',
      default: '4',
    },
    {
      name: 'paddingInline',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '行内（水平）方向内边距覆盖。仅覆盖行内轴内边距，同时保留来自 padding 或容器主题默认值的块内边距。使用间距比例（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。',
    },
    {
      name: 'paddingInlineStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '行内起始内边距覆盖（LTR 中为左侧，RTL 中为右侧）。仅在该边上覆盖 paddingInline 和 padding。',
    },
    {
      name: 'paddingInlineEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '行内结束内边距覆盖（LTR 中为右侧，RTL 中为左侧）。仅在该边上覆盖 paddingInline 和 padding。',
    },
    {
      name: 'paddingBlock',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '块（垂直）方向内边距覆盖。仅覆盖块轴内边距，同时保留来自 padding 或容器主题默认值的行内内边距。使用间距比例（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。',
    },
    {
      name: 'paddingBlockStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '块起始（顶部）内边距，使用间距刻度。仅在该边上覆盖 paddingBlock 和 padding。',
    },
    {
      name: 'paddingBlockEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '块结束（底部）内边距，使用间距刻度。仅在该边上覆盖 paddingBlock 和 padding。',
    },
    {
      name: 'className',
      type: 'string',
      description: '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  theming: {
    container: true,
    targets: [
      {className: 'solo-section', visualProps: ['variant']},
    ],
    derived: [
      {property: 'padding', expand: 'container'},
    ],
  },
  usage: {
    anatomy,
    description:
      'Section is the correct way to create page regions and group related content on a page. Use it for settings groups, form sections, sidebar areas, or any time you need visual separation between parts of a page. If you are tempted to use a Card for a page section, use Section instead.',
    bestPractices: [
      { guidance: true, description: 'Use Section for page-level grouping: settings panels, form groups, sidebar regions. These are sections of a page, not discrete items.' },
      { guidance: true, description: 'Start with the default variant. Use muted only to call attention to a specific region.' },
      { guidance: true, description: 'Add dividers between same-background sections that need separation.' },
      { guidance: true, description: 'Combine with a heading + Stack for a typical page section pattern.' },
      { guidance: false, description: 'Use Card when you mean Section. Cards are for discrete items (one notification, one profile). Sections are for page regions.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يُعدّ Section الطريقة الصحيحة لإنشاء مناطق الصفحة وتجميع المحتوى المترابط فيها.',
  propDescriptions: {
    variant: 'نمط الخلفية المطبَّق على حاوية القسم.',
    width: 'عرض القسم؛ يُفسَّر الرقم بالبكسل، وتُستخدم السلسلة النصية كما هي.',
    height: 'ارتفاع القسم؛ يُفسَّر الرقم بالبكسل، وتُستخدم السلسلة النصية كما هي.',
    maxWidth: 'الحد الأقصى لعرض القسم.',
    minHeight: 'الحد الأدنى لارتفاع القسم.',
    children: 'المحتوى المعروض داخل القسم.',
    dividers: 'جوانب القسم التي تحتوي على حدود فاصلة.',
    padding: 'الحشوة الداخلية باستخدام مقياس التباعد (0، 0.5، 1، 1.5، 2، 3، 4، 5، 6، 8، 10). استخدم padding={0} للمحتوى الممتد من حافة إلى حافة.',
    paddingInline: 'تجاوز الحشوة السطرية (الأفقية). تتجاوز حشوة المحور السطري فقط مع الحفاظ على الحشوة الكتلية من `padding` أو من القيمة الافتراضية لسمة الحاوية. تقبل مقياس التباعد (0، 0.5، 1، 1.5، 2، 3، 4، 5، 6، 8، 10).',
    paddingInlineStart: 'تجاوز حشوة بداية السطر (اليسار في LTR، واليمين في RTL). تتجاوز paddingInline وpadding على تلك الحافة فقط.',
    paddingInlineEnd: 'تجاوز حشوة نهاية السطر (اليمين في LTR، واليسار في RTL). تتجاوز paddingInline وpadding على تلك الحافة فقط.',
    paddingBlock: 'تجاوز الحشوة الكتلية (العمودية). تتجاوز حشوة المحور الكتلي فقط مع الحفاظ على الحشوة السطرية من `padding` أو من القيمة الافتراضية لسمة الحاوية. تقبل مقياس التباعد (0، 0.5، 1، 1.5، 2، 3، 4، 5، 6، 8، 10).',
    paddingBlockStart: 'حشوة بداية الكتلة (الأعلى)، باستخدام مقياس التباعد. تتجاوز paddingBlock وpadding على تلك الحافة فقط.',
    paddingBlockEnd: 'حشوة نهاية الكتلة (الأسفل)، باستخدام مقياس التباعد. تتجاوز paddingBlock وpadding على تلك الحافة فقط.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'يُعدّ Section الطريقة الصحيحة لإنشاء مناطق الصفحة وتجميع المحتوى المترابط فيها. استخدمه لمجموعات الإعدادات، وأقسام النماذج، ومناطق الشريط الجانبي، أو في أي وقت تحتاج فيه إلى فصل بصري بين أجزاء الصفحة. إذا كنت تميل إلى استخدام Card لقسم من الصفحة، فاستخدم Section بدلًا منه.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم Section للتجميع على مستوى الصفحة: لوحات الإعدادات، ومجموعات النماذج، ومناطق الشريط الجانبي. فهذه أقسام من الصفحة، وليست عناصر مستقلة.',
      },
      {
        guidance: true,
        description: 'ابدأ بالنمط الافتراضي. استخدم muted فقط للفت الانتباه إلى منطقة محددة.',
      },
      {
        guidance: true,
        description: 'أضف فواصل بين الأقسام ذات الخلفية نفسها التي تحتاج إلى فصل.',
      },
      {
        guidance: true,
        description: 'اجمعه مع عنوان + Stack للحصول على نمط قسم صفحة نموذجي.',
      },
      {
        guidance: false,
        description: 'استخدام Card عندما تقصد Section. البطاقات مخصّصة للعناصر المستقلة (إشعار واحد، ملف شخصي واحد). أما الأقسام فمخصّصة لمناطق الصفحة.',
      },
    ],
    anatomy: [
      {
        name: 'حاوية القسم',
        required: true,
        description: 'حاوية مرسومة تجمع منطقة من الصفحة.',
      },
      {
        name: 'محتوى المستخدم',
        required: false,
        description: 'محتوى يوفّره المستدعي ويُعرض داخل حاوية القسم.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Page-level container for grouping content into regions. Use INSTEAD of Card for settings panels, form groups, and page sections.',
  usage: {
    anatomy,
    description:
      'Section creates page regions. Use for settings groups, form sections, sidebar areas. If you want to visually separate a part of a page, use Section, not Card. Cards are for discrete items (one profile, one notification).',
    bestPractices: [
      { guidance: true, description: 'Use Section for page-level grouping: settings panels, form groups, sidebar regions. Page sections, not discrete items.' },
      { guidance: true, description: 'Start w/ default variant. Use muted only to call attention to a specific region.' },
      { guidance: true, description: 'Add dividers between same-background sections that need separation.' },
      { guidance: true, description: 'Combine w/ heading + Stack for typical page section pattern.' },
      { guidance: false, description: 'Use Card when you mean Section. Cards = discrete items (one notification, one profile). Sections = page regions.' },
    ],
  },
  propDescriptions: {
    variant: 'Background variant applied to section container.',
    width: 'Section width; number interpreted as pixels, string used as-is.',
    height: 'Section height; number interpreted as pixels, string used as-is.',
    maxWidth: 'Maximum width of section.',
    minHeight: 'Minimum height of section.',
    children: 'Content rendered inside section.',
    dividers: 'Which sides of section have divider borders.',
    padding: 'Internal padding via spacing scale; 0 for edge-to-edge content.',
    paddingInline: 'Inline-axis padding override; preserves block padding from padding/theme.',
    paddingInlineStart: 'Inline-start (left in LTR) padding override; wins over paddingInline/padding on that edge.',
    paddingInlineEnd: 'Inline-end (right in LTR) padding override; wins over paddingInline/padding on that edge.',
    paddingBlock: 'Block-axis padding override; preserves inline padding from padding/theme.',
    paddingBlockStart: 'Block-start (top) padding override; wins over paddingBlock/padding on that edge.',
    paddingBlockEnd: 'Block-end (bottom) padding override; wins over paddingBlock/padding on that edge.',
    className: 'Tailwind classes for layout customization; merged via cn(), so conflicting utilities override defaults.',
  },
};
