/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Divider group',
    required: true,
    description:
      'Separator group that arranges one or two rules around an optional label.',
  },
  {
    name: 'Rule',
    required: true,
    description:
      'Painted line segment; a second segment renders when a label is present.',
  },
  {
    name: 'Label',
    required: false,
    description: 'Optional content displayed between two rule segments.',
  },
];



/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Divider',
  displayName: 'Divider',
  category: 'Layout',
  keywords: ["divider","separator","hr","rule","line","border","spacer","horizontal rule"],
  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description: 'Orientation of the divider.',
      default: "'horizontal'",
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional label centered on the divider.',
    },
    {
      name: 'variant',
      type: "'subtle' | 'strong'",
      description: 'Visual weight of the divider line.',
      default: "'subtle'",
    },
    {
      name: 'isFullBleed',
      type: 'boolean',
      description:
        'Extend the divider to container edges with negative margins.',
      default: 'false',
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
      {className: 'solo-divider', visualProps: ['orientation', 'variant']},
    ],
  },
  usage: {
    anatomy,
    description: 'A visual separator that divides content into distinct sections. Use to create clear boundaries between groups of related content, or to demarcate interactive regions within a layout.',
    bestPractices: [
      { guidance: true, description: 'Use subtle dividers between related content sections and strong dividers for high-contrast boundaries.' },
      { guidance: true, description: 'Add a label to the divider when sections need a visible category heading.' },
      { guidance: false, description: 'Overuse dividers; rely on spacing and layout to separate content when possible.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Divider',
  displayName: 'Divider',
  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description: '分隔线的方向。',
      default: "'horizontal'",
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: '居中显示在分隔线上的可选标签。',
    },
    {
      name: 'variant',
      type: "'subtle' | 'strong'",
      description: '分隔线的视觉粗细。',
      default: "'subtle'",
    },
    {
      name: 'isFullBleed',
      type: 'boolean',
      description: '通过负边距将分隔线延伸至容器边缘。',
      default: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-divider', visualProps: ['orientation', 'variant']},
    ],
  },
  usage: {
    anatomy,
    description: 'A visual separator that divides content into distinct sections. Use to create clear boundaries between groups of related content, or to demarcate interactive regions within a layout.',
    bestPractices: [
      { guidance: true, description: 'Use subtle dividers between related content sections and strong dividers for high-contrast boundaries.' },
      { guidance: true, description: 'Add a label to the divider when sections need a visible category heading.' },
      { guidance: false, description: 'Overuse dividers; rely on spacing and layout to separate content when possible.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'فاصل مرئي يقسّم المحتوى إلى أقسام مميزة.',
  propDescriptions: {
    orientation: 'اتجاه الفاصل.',
    label: 'تسمية اختيارية في منتصف الفاصل.',
    variant: 'الثقل المرئي لخط الفاصل.',
    isFullBleed: 'يمدّ الفاصل حتى حواف الحاوية باستخدام هوامش سالبة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمَج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداةُ المتعارضة القيمةَ الافتراضية.',
  },
  usage: {
    description: 'فاصل مرئي يقسّم المحتوى إلى أقسام مميزة. استخدمه لإنشاء حدود واضحة بين مجموعات المحتوى المترابط، أو لتحديد المناطق التفاعلية ضمن التخطيط.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم فواصل خفيفة بين أقسام المحتوى المترابطة وفواصل قوية للحدود عالية التباين.',
      },
      {
        guidance: true,
        description: 'أضف تسمية إلى الفاصل عندما تحتاج الأقسام إلى عنوان فئة مرئي.',
      },
      {
        guidance: false,
        description: 'لا تُفرط في استخدام الفواصل؛ واعتمد على التباعد والتخطيط لفصل المحتوى متى أمكن.',
      },
    ],
    anatomy: [
      {
        name: 'مجموعة الفاصل',
        required: true,
        description: 'مجموعة فاصلة ترتّب خطًا أو خطين حول تسمية اختيارية.',
      },
      {
        name: 'الخط',
        required: true,
        description: 'مقطع خط مرسوم؛ ويُعرض مقطع ثانٍ عند وجود تسمية.',
      },
      {
        name: 'التسمية',
        required: false,
        description: 'محتوى اختياري يُعرض بين مقطعي الخط.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'visual separator w/ optional label, using Solo design tokens',
  usage: {
    anatomy,
    description: 'A visual separator that divides content into distinct sections. Use to create clear boundaries between groups of related content, or to demarcate interactive regions within a layout.',
    bestPractices: [
      { guidance: true, description: 'Use subtle dividers between related content sections and strong dividers for high-contrast boundaries.' },
      { guidance: true, description: 'Add a label to the divider when sections need a visible category heading.' },
      { guidance: false, description: 'Overuse dividers; rely on spacing and layout to separate content when possible.' },
    ],
  },
  propDescriptions: {
    orientation: 'divider orientation',
    label: 'optional centered label on divider',
    variant: 'visual weight of divider line',
    isFullBleed: 'extend to container edges w/ negative margins',
    className: 'Tailwind classes for layout; merged via cn(), so conflicting utilities override defaults',
  },
};
