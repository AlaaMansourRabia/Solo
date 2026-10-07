/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Center',
  displayName: 'Center',
  group: 'Layout',
  category: 'Layout',
  isHiddenFromOverview: true,
  keywords: ["center","centered","centering","align","alignment","justify","flexbox","middle"],
  playground: {
    defaults: {
      width: 240,
      height: 120,
      children: {__element: 'Text', props: {type: 'body'}, children: 'Centered content'},
    },
  },
  props: [
    {
      name: 'axis',
      type: "'both' | 'horizontal' | 'vertical'",
      description:
        'Which Center mode to use. In horizontal writing, "horizontal" centers the flex main/inline axis and "vertical" centers the cross/block axis. In vertical writing, current single-axis behavior follows those logical flex axes rather than the physical names; "both" still centers both axes.',
      default: "'both'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: 'Container width (px or CSS value).',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: 'Container height (px or CSS value).',
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: 'Maximum container width (px or CSS value).',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: 'Minimum container height (px or CSS value).',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Inner padding on all sides, using the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10). Matches the padding prop on Stack, Card, LayoutContent, and LayoutPanel. Pass as a JSX number expression e.g. padding={3}.',
    },
    {
      name: 'paddingInline',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical inline-axis padding, using the spacing scale. Overrides padding on the inline axis when both are set.',
    },
    {
      name: 'paddingInlineStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical inline-start padding, using the spacing scale. Its resolved physical edge depends on writing mode and direction. Overrides paddingInline and padding on that edge only.',
    },
    {
      name: 'paddingInlineEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical inline-end padding, using the spacing scale. Its resolved physical edge depends on writing mode and direction. Overrides paddingInline and padding on that edge only.',
    },
    {
      name: 'paddingBlock',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical block-axis padding, using the spacing scale. Overrides padding on the block axis when both are set.',
    },
    {
      name: 'paddingBlockStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical block-start padding, using the spacing scale. Its resolved physical edge depends on writing mode. Overrides paddingBlock and padding on that edge only.',
    },
    {
      name: 'paddingBlockEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical block-end padding, using the spacing scale. Its resolved physical edge depends on writing mode. Overrides paddingBlock and padding on that edge only.',
    },
    {
      name: 'isInline',
      type: 'boolean',
      description: 'Use inline-flex (useful for text/icons).',
      default: 'false',
    },
    {
      name: 'children',
      required: true,
      type: 'ReactNode',
      description: 'Content to center.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-center', visualProps: ['axis']},
    ],
  },
  usage: {
    description:
      'Center aligns content to the middle of its container. Use it for empty states, loading screens, login forms, or any content that should sit in the center of the available space.',
    bestPractices: [
      {guidance: true, description: 'Use a single-axis value only in horizontal writing, or after verifying the active writing mode. In vertical writing, the current implementation follows flex main/cross axes rather than the physical prop names.'},
      {guidance: true, description: 'In horizontal writing, give Center height when using axis="vertical"; centering needs available space on the selected flex axis.'},
      {guidance: true, description: 'Use isInline to center small elements like icons or badges within a line of text without breaking the text flow.'},
      {guidance: true, description: 'Keep semantic structure and accessible names on the content. Center is a layout-only container and does not add a role or label.'},
      {guidance: false, description: 'Wrap large page sections in Center. Use Layout or AppShell for page-level structure.'},
      {guidance: false, description: 'Use Center for horizontal lists of items. Use Stack with hAlign="center" instead.'},
    ],
    anatomy: [
      {name: 'Container', required: true, description: 'A flexbox wrapper that aligns its children to the center along the chosen axis.'},
      {name: 'Content', required: true, description: 'Any children passed to Center. Typically a card, form, spinner, or empty state message.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Center',
  displayName: 'Center',
  usage: {
    description:
      'Center aligns content to the middle of its container. Use it for empty states, loading screens, login forms, or any content that should sit in the center of the available space.',
    bestPractices: [
      {guidance: true, description: 'Use a single-axis value only in horizontal writing, or after verifying the active writing mode. In vertical writing, the current implementation follows flex main/cross axes rather than the physical prop names.'},
      {guidance: true, description: 'In horizontal writing, give Center height when using axis="vertical"; centering needs available space on the selected flex axis.'},
      {guidance: true, description: 'Use isInline to center small elements like icons or badges within a line of text without breaking the text flow.'},
      {guidance: true, description: 'Keep semantic structure and accessible names on the content. Center is a layout-only container and does not add a role or label.'},
      {guidance: false, description: 'Wrap large page sections in Center. Use Layout or AppShell for page-level structure.'},
      {guidance: false, description: 'Use Center for horizontal lists of items. Use Stack with hAlign="center" instead.'},
    ],
  },
  props: [
    {name: 'axis', type: "'both' | 'horizontal' | 'vertical'", description: '选择 Center 模式。横向书写时，horizontal 对应 flex 主轴/行内轴，vertical 对应交叉轴/块轴；纵向书写时，当前单轴行为仍跟随这些逻辑 flex 轴，而不是属性名暗示的物理轴。', default: "'both'"},
    {name: 'width', type: 'SizeValue', description: '容器宽度（px 或 CSS 值）。'},
    {name: 'height', type: 'SizeValue', description: '容器高度（px 或 CSS 值）。'},
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: '容器最大宽度（px 或 CSS 值）。',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: '容器最小高度（px 或 CSS 值）。',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        '所有方向的内边距，使用间距刻度（0、0.5、1、1.5、2、3、4、5、6、8、10）。与 Stack、Card、LayoutContent 和 LayoutPanel 的 padding 属性一致。在 JSX 中使用数字表达式 e.g. padding={3}。',
    },
    {
      name: 'paddingInline',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '逻辑行内轴内边距，使用间距刻度。两者同时设置时在行内轴上覆盖 padding。',
    },
    {
      name: 'paddingInlineStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '逻辑行内起始内边距，使用间距刻度。解析后的物理边取决于书写模式和方向。仅在该边上覆盖 paddingInline 和 padding。',
    },
    {
      name: 'paddingInlineEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '逻辑行内结束内边距，使用间距刻度。解析后的物理边取决于书写模式和方向。仅在该边上覆盖 paddingInline 和 padding。',
    },
    {
      name: 'paddingBlock',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '逻辑块轴内边距，使用间距刻度。两者同时设置时在块轴上覆盖 padding。',
    },
    {
      name: 'paddingBlockStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '逻辑块起始内边距，使用间距刻度。解析后的物理边取决于书写模式。仅在该边上覆盖 paddingBlock 和 padding。',
    },
    {
      name: 'paddingBlockEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: '逻辑块结束内边距，使用间距刻度。解析后的物理边取决于书写模式。仅在该边上覆盖 paddingBlock 和 padding。',
    },
    {name: 'isInline', type: 'boolean', description: '使用 inline-flex（适用于文本/图标）。', default: 'false'},
    {name: 'children', type: 'ReactNode', description: '要居中的内容。', required: true},
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  theming: {
    targets: [
      {
        className: 'solo-center',
        visualProps: [
          'axis',
        ],
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يُوسِّط Center المحتوى داخل حاويته على أحد محوري flex أو كليهما.',
  propDescriptions: {
    axis: 'وضع Center المستخدم. في الكتابة الأفقية، يُوسِّط "horizontal" المحور الرئيسي/السطري لـ flex، ويُوسِّط "vertical" المحور المتقاطع/الكتلي. أما في الكتابة الرأسية، فيتبع السلوك الحالي أحادي المحور هذه المحاور المنطقية لـ flex لا الأسماء الفيزيائية؛ ويظل "both" يُوسِّط المحورين.',
    width: 'عرض الحاوية (px أو قيمة CSS).',
    height: 'ارتفاع الحاوية (px أو قيمة CSS).',
    maxWidth: 'الحد الأقصى لعرض الحاوية (px أو قيمة CSS).',
    minHeight: 'الحد الأدنى لارتفاع الحاوية (px أو قيمة CSS).',
    padding: 'الحشوة الداخلية من جميع الجهات، باستخدام مقياس التباعد (0، 0.5، 1، 1.5، 2، 3، 4، 5، 6، 8، 10). تطابق خاصية padding في Stack وCard وLayoutContent وLayoutPanel. مرّرها كتعبير رقمي في JSX، مثل padding={3}.',
    paddingInline: 'حشوة منطقية على المحور السطري، باستخدام مقياس التباعد. تتجاوز padding على المحور السطري عند تعيين الاثنتين.',
    paddingInlineStart: 'حشوة منطقية عند بداية المحور السطري، باستخدام مقياس التباعد. تعتمد الحافة الفيزيائية الناتجة على وضع الكتابة واتجاهها. تتجاوز paddingInline وpadding على تلك الحافة فقط.',
    paddingInlineEnd: 'حشوة منطقية عند نهاية المحور السطري، باستخدام مقياس التباعد. تعتمد الحافة الفيزيائية الناتجة على وضع الكتابة واتجاهها. تتجاوز paddingInline وpadding على تلك الحافة فقط.',
    paddingBlock: 'حشوة منطقية على المحور الكتلي، باستخدام مقياس التباعد. تتجاوز padding على المحور الكتلي عند تعيين الاثنتين.',
    paddingBlockStart: 'حشوة منطقية عند بداية المحور الكتلي، باستخدام مقياس التباعد. تعتمد الحافة الفيزيائية الناتجة على وضع الكتابة. تتجاوز paddingBlock وpadding على تلك الحافة فقط.',
    paddingBlockEnd: 'حشوة منطقية عند نهاية المحور الكتلي، باستخدام مقياس التباعد. تعتمد الحافة الفيزيائية الناتجة على وضع الكتابة. تتجاوز paddingBlock وpadding على تلك الحافة فقط.',
    isInline: 'استخدام inline-flex (مفيد للنصوص/الأيقونات).',
    children: 'المحتوى المراد توسيطه.',
    className: 'فئات Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'يحاذي Center المحتوى إلى منتصف حاويته. استخدمه للحالات الفارغة، وشاشات التحميل، ونماذج تسجيل الدخول، أو أي محتوى ينبغي أن يقع في منتصف المساحة المتاحة.',
    bestPractices: [
      {guidance: true, description: 'استخدم قيمة أحادية المحور في الكتابة الأفقية فقط، أو بعد التحقق من وضع الكتابة النشط. في الكتابة الرأسية، يتبع التنفيذ الحالي المحورين الرئيسي/المتقاطع لـ flex لا أسماء الخصائص الفيزيائية.'},
      {guidance: true, description: 'في الكتابة الأفقية، امنح Center ارتفاعًا عند استخدام axis="vertical"؛ إذ يحتاج التوسيط إلى مساحة متاحة على محور flex المحدد.'},
      {guidance: true, description: 'استخدم isInline لتوسيط العناصر الصغيرة مثل الأيقونات أو الشارات داخل سطر نصي دون كسر تدفق النص.'},
      {guidance: true, description: 'حافظ على البنية الدلالية والأسماء القابلة للوصول على المحتوى. Center حاوية تخطيط فقط ولا تضيف دورًا (role) أو تسمية.'},
      {guidance: false, description: 'تغليف أقسام الصفحة الكبيرة في Center. استخدم Layout أو AppShell لبنية مستوى الصفحة.'},
      {guidance: false, description: 'استخدام Center للقوائم الأفقية من العناصر. استخدم Stack مع hAlign="center" بدلًا من ذلك.'},
    ],
    anatomy: [
      {name: 'الحاوية', required: true, description: 'غلاف flexbox يحاذي عناصره الأبناء إلى المنتصف على المحور المختار.'},
      {name: 'المحتوى', required: true, description: 'أي عناصر أبناء تُمرَّر إلى Center. عادةً بطاقة، أو نموذج، أو مؤشر تحميل، أو رسالة حالة فارغة.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'centers content on one or both flex axes; single-axis names match physical axes only in horizontal writing',
  usage: {
    description:
      'Center aligns content to the middle of its container. Use for empty states, loading screens, login forms.',
    bestPractices: [
      {guidance: true, description: 'Use a single-axis value only in horizontal writing, or after verifying the active writing mode. In vertical writing, the current implementation follows flex main/cross axes rather than the physical prop names.'},
      {guidance: true, description: 'In horizontal writing, give Center height when using axis="vertical"; centering needs available space on the selected flex axis.'},
      {guidance: true, description: 'Use isInline to center small elements (icons, badges) within a line of text without breaking text flow.'},
      {guidance: true, description: 'Keep semantic structure and accessible names on the content; Center adds no role or label.'},
      {guidance: false, description: 'Wrap large page sections in Center. Use Layout or AppShell for page-level structure.'},
      {guidance: false, description: 'Use Center for horizontal lists of items. Use Stack with hAlign="center" instead.'},
    ],
  },
  propDescriptions: {
    axis: 'centering mode; outside horizontal writing, single-axis values follow flex main/cross axes',
    width: 'container width (px or CSS)',
    height: 'container height (px or CSS)',
    padding:
      'inner padding on all sides (spacing step: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10)',
    paddingInline: 'logical inline-axis padding; overrides padding on that axis',
    paddingInlineStart: 'logical inline-start padding; physical edge depends on writing mode and direction',
    paddingInlineEnd: 'logical inline-end padding; physical edge depends on writing mode and direction',
    paddingBlock: 'logical block-axis padding; overrides padding on that axis',
    paddingBlockStart: 'logical block-start padding; physical edge depends on writing mode',
    paddingBlockEnd: 'logical block-end padding; physical edge depends on writing mode',
    isInline: 'use inline-flex for text/icons',
    children: 'content to center',
    className: 'Tailwind classes for layout (margins, positioning, sizing); merged via cn(), so conflicting utilities override defaults',
  },
};
