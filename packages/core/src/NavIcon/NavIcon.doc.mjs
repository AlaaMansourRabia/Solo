/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Container',
    required: true,
    description: 'Circular painted container for the supplied icon.',
  },
  {
    name: 'Icon',
    required: true,
    description: 'Caller-supplied visual content rendered inside the container.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'NavIcon',
  displayName: 'Nav Icon',
  group: 'Navigation',
  category: 'Navigation',
  isHiddenFromOverview: true,
  hidden: false,
  keywords: ["navicon","iconbutton","toolbar icon","appbar icon","nav button"],
  props: [
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        'The icon element to render inside the circular background. Should be an Icon or similar icon component.',
      required: true,
      slotElements: [{__element: 'Icon', props: {icon: 'check', size: 'sm'}}],
    },
  ],
  theming: {
    targets: [
      {className: 'solo-nav-icon'},
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {className: 'solo-navicon', deprecatedFor: 'nav-icon'},
    ],
  },
  usage: {
    anatomy,
    description:
      'NavIcon is a circular icon container with an accent-colored background. Use it in navigation headers such as TopNavHeading and PageNavHeader to visually identify a section or application.',
    bestPractices: [
      { guidance: true, description: 'Use in navigation headers to provide a recognizable visual anchor for the section.' },
      { guidance: true, description: 'Pass an Icon or similarly sized icon component to ensure proper proportions.' },
      { guidance: false, description: 'Use NavIcon for interactive purposes; it is a display-only container, not a button.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'NavIcon',
  displayName: 'Nav Icon',
  props: [
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        '在圆形背景内渲染的图标元素。应为 Icon 或类似的图标组件。',
      required: true,
    },
  ],
  theming: {
    targets: [
      {className: 'solo-nav-icon'},
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {className: 'solo-navicon', deprecatedFor: 'nav-icon'},
    ],
  },
  usage: {
    anatomy,
    description:
      'NavIcon is a circular icon container with an accent-colored background. Use it in navigation headers such as TopNavHeading and PageNavHeader to visually identify a section or application.',
    bestPractices: [
      { guidance: true, description: 'Use in navigation headers to provide a recognizable visual anchor for the section.' },
      { guidance: true, description: 'Pass an Icon or similarly sized icon component to ensure proper proportions.' },
      { guidance: false, description: 'Use NavIcon for interactive purposes; it is a display-only container, not a button.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'NavIcon حاوية أيقونة دائرية بخلفية بلون التمييز، تُستخدم في ترويسات التنقّل لتعريف قسم أو تطبيق بصريًا.',
  propDescriptions: {
    icon:
      'عنصر الأيقونة المعروض داخل الخلفية الدائرية. ينبغي أن يكون Icon أو مكوّن أيقونة مشابهًا.',
  },
  usage: {
    description:
      'NavIcon حاوية أيقونة دائرية بخلفية بلون التمييز. استخدمها في ترويسات التنقّل مثل TopNavHeading وPageNavHeader لتعريف قسم أو تطبيق بصريًا.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدمها في ترويسات التنقّل لتوفير مرتكز بصري يسهل تمييزه للقسم.',
      },
      {
        guidance: true,
        description: 'مرّر Icon أو مكوّن أيقونة بحجم مماثل لضمان التناسب الصحيح.',
      },
      {
        guidance: false,
        description: 'لا تستخدم NavIcon لأغراض تفاعلية؛ فهي حاوية للعرض فقط وليست زرًا.',
      },
    ],
    anatomy: [
      {
        name: 'الحاوية',
        required: true,
        description: 'حاوية دائرية ملوّنة للأيقونة المورّدة.',
      },
      {
        name: 'الأيقونة',
        required: true,
        description: 'محتوى مرئي يوفّره المستدعي ويُعرض داخل الحاوية.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Circular icon container w/ accent background for navigation headers.',
  usage: {
    anatomy,
    description:
      'NavIcon is a circular icon container with an accent-colored background. Use it in navigation headers such as TopNavHeading and PageNavHeader to visually identify a section or application.',
    bestPractices: [
      { guidance: true, description: 'Use in navigation headers to provide a recognizable visual anchor for the section.' },
      { guidance: true, description: 'Pass an Icon or similarly sized icon component to ensure proper proportions.' },
      { guidance: false, description: 'Use NavIcon for interactive purposes; it is a display-only container, not a button.' },
    ],
  },
  propDescriptions: {
    icon: 'Icon element inside circular background. Should be Icon or similar.',
  },
};
