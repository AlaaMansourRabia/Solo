/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'SelectorOption',
  subComponentOf: 'Selector',
  displayName: 'Selector Option',
  isHiddenFromOverview: true,
  description:
    'Helper component for custom item rendering inside an Selector renderOption prop.',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Primary label text for the item.',
      required: true,
    },
    {
      name: 'icon',
      type: 'ReactNode | IconType',
      description:
        'Icon displayed before the label. See the Icon docs (`IconName`) for valid semantic names.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Secondary description text displayed below the label.',
    },
    {
      name: 'layout',
      type: "'stacked' | 'inline'",
      description:
        "How the label and description sit together. 'stacked' puts the description on its own line; 'inline' keeps both on one line so the row fits a fixed-height host. Inside a Selector trigger the trigger's padding sizes itself to whichever layout you pick, so both land on the 4px rhythm; an InputGroup pins the row height and forces 'inline'.",
      default: "'stacked'",
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Additional content rendered after the label and description.',
    },
  ],
};

export const docsZh = {
  name: 'SelectorOption',
  isHiddenFromOverview: true,
  displayName: 'Selector Option',
  description:
    '用于在 Selector 的 renderOption 渲染函数中自定义选项渲染的辅助组件。',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: '选项的主标签文本。',
      required: true,
    },
    {
      name: 'icon',
      type: 'ReactNode | IconType',
      description: '显示在标签前的图标。',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: '显示在标签下方的次要描述文本。',
    },
    {
      name: 'layout',
      type: "'stacked' | 'inline'",
      description: "标签与描述的排列方式。'stacked' 将描述放在单独一行；'inline' 将两者保持在同一行，使该行适配固定高度的容器。在 Selector 触发器内，触发器的内边距会根据所选布局自动调整，二者都落在 4px 节奏上；InputGroup 会固定行高并强制使用 'inline'。",
      default: "'stacked'",
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: '在标签和描述之后渲染的附加内容。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'مكوّن مساعد لعرض العناصر المخصّص داخل الخاصية renderOption في Selector.',
  propDescriptions: {
    label: 'نص التسمية الأساسي للعنصر.',
    icon: 'أيقونة تُعرض قبل التسمية. راجع توثيق Icon (`IconName`) لمعرفة الأسماء الدلالية الصالحة.',
    description: 'نص وصفي ثانوي يُعرض أسفل التسمية.',
    layout:
      'طريقة تموضع التسمية والوصف معًا. يضع \'stacked\' الوصف في سطر مستقل؛ بينما يُبقي \'inline\' كليهما في سطر واحد ليتّسع الصف لمضيف ثابت الارتفاع. داخل مشغّل Selector تتكيّف الحشوة الداخلية للمشغّل مع التخطيط الذي تختاره، فيستقر كلاهما على إيقاع 4px؛ أما InputGroup فيثبّت ارتفاع الصف ويفرض \'inline\'.',
    endContent: 'محتوى إضافي يُعرض بعد التسمية والوصف.',
  },
};

export const docsDense = {
  name: 'SelectorOption',
  isHiddenFromOverview: true,
  displayName: 'Selector Option',
  description:
    'Helper component for custom item rendering inside Selector renderOption prop.',
  propDescriptions: {
    label: 'Primary label text for item.',
    icon: 'Icon displayed before label.',
    description: 'Secondary description text below label.',
    endContent: 'Additional content after label+description.',
  },
};
