/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'MetadataList',
  displayName: 'Metadata List',
  group: 'MetadataList',
  category: 'Table & List',
  keywords: ["metadata","description","definition","keyvalue","properties","details","attributes","summary"],
  theming: {
    targets: [
      {
        className: 'solo-metadata-list',
        visualProps: ['columns', 'orientation'],
      },
      {className: 'solo-metadata-list-item'},
    ],
  },
  description: 'Container for metadata items with column layout, orientation, and collapse support.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Metadata items (MetadataListItem components).',
      slotElements: [
        {
          __element: 'MetadataListItem',
          props: {
            label: 'Key',
          },
          children: 'Value',
        },
      ],
      required: true,
    },
    {
      name: 'columns',
      type: "'multi' | 'single' | number",
      description: 'Column layout mode.',
      default: "'single'",
    },
    {
      name: 'label',
      type: "{ position?: 'start' | 'top', width?: number | string }",
      description: "Label display configuration. position controls label placement, width sets a custom label column width. Defaults to { position: 'top' } for multi-column layouts.",
      default: "{ position: 'start' } (single-column) / { position: 'top' } (multi-column)",
    },
    {
      name: 'maxNumOfItems',
      type: 'number',
      description: 'Maximum items to show before collapsing with a show more/less toggle.',
    },
    {
      name: 'orientation',
      type: "'vertical' | 'horizontal'",
      description: 'Layout orientation. Horizontal mode flows items in a row with flex-wrap.',
      default: "'vertical'",
    },
    {
      name: 'title',
      type: 'ReactNode',
      description: 'Optional title or heading above the list.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [
    {name: 'MetadataListItem'},
  ],
  usage: {
    description:
      'MetadataList displays key-value pairs for object attributes like quality, condition, and status, in a structured layout. Use it for detail panels, settings summaries, and record information.',
    bestPractices: [
      { guidance: true, description: 'Choose label position based on content: "start" for short values, "top" for long or complex values.' },
      { guidance: true, description: 'Collapse long lists with `maxNumOfItems` to keep the page scannable.' },
      { guidance: false, description: 'Use for extensive form input; use a form layout instead.' },
      { guidance: false, description: "Use for data that doesn't have a clear key-value structure." },
    ],
    anatomy: [
      {name: 'Title', required: false, description: 'Optional title for the metadata list.'},
      {name: 'Label', required: true, description: 'The key label for each metadata entry.'},
      {name: 'Metadata', required: true, description: 'The value displayed in various formats.'},
      {name: 'Disclosure', required: false, description: 'Collapse/expand control for the list.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'MetadataList displays key-value pairs for object attributes like quality, condition, and status, in a structured layout. Use it for detail panels, settings summaries, and record information.',
    bestPractices: [
      { guidance: true, description: 'Choose label position based on content: "start" for short values, "top" for long or complex values.' },
      { guidance: true, description: 'Collapse long lists with `maxNumOfItems` to keep the page scannable.' },
      { guidance: false, description: 'Use for extensive form input; use a form layout instead.' },
      { guidance: false, description: "Use for data that doesn't have a clear key-value structure." },
    ],
    anatomy: [
      {name: 'Title', required: false, description: 'Optional title for the metadata list.'},
      {name: 'Label', required: true, description: 'The key label for each metadata entry.'},
      {name: 'Metadata', required: true, description: 'The value displayed in various formats.'},
      {name: 'Disclosure', required: false, description: 'Collapse/expand control for the list.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حاوية لعناصر البيانات الوصفية تدعم تخطيط الأعمدة والاتجاه والطي.',
  propDescriptions: {
    children: 'عناصر البيانات الوصفية (مكوّنات MetadataListItem).',
    columns: 'وضع تخطيط الأعمدة.',
    label: 'إعداد عرض التسمية. يتحكم position في موضع التسمية، ويعيّن width عرضًا مخصصًا لعمود التسمية. القيمة الافتراضية { position: \'top\' } في التخطيطات متعددة الأعمدة.',
    maxNumOfItems: 'أقصى عدد من العناصر يُعرض قبل الطي مع مفتاح عرض المزيد/الأقل.',
    orientation: 'اتجاه التخطيط. في الوضع الأفقي تتدفق العناصر في صف مع flex-wrap.',
    title: 'عنوان اختياري أعلى القائمة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمَج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداةُ المتعارضة القيمةَ الافتراضية.',
  },
  usage: {
    description: 'يعرض MetadataList أزواج المفتاح والقيمة لسمات الكائنات مثل الجودة والحالة والوضع، في تخطيط منظَّم. استخدمه للوحات التفاصيل، وملخصات الإعدادات، ومعلومات السجلات.',
    bestPractices: [
      {
        guidance: true,
        description: 'اختر موضع التسمية بناءً على المحتوى: "start" للقيم القصيرة، و"top" للقيم الطويلة أو المعقدة.',
      },
      {
        guidance: true,
        description: 'اطوِ القوائم الطويلة باستخدام `maxNumOfItems` للحفاظ على سهولة مسح الصفحة بصريًا.',
      },
      {
        guidance: false,
        description: 'لا تستخدمه لإدخال النماذج المطوَّل؛ استخدم تخطيط نموذج بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'لا تستخدمه لبيانات ليس لها بنية مفتاح وقيمة واضحة.',
      },
    ],
    anatomy: [
      {
        name: 'العنوان',
        required: false,
        description: 'عنوان اختياري لقائمة البيانات الوصفية.',
      },
      {
        name: 'التسمية',
        required: true,
        description: 'تسمية المفتاح لكل إدخال من البيانات الوصفية.',
      },
      {
        name: 'البيانات الوصفية',
        required: true,
        description: 'القيمة المعروضة بتنسيقات متنوعة.',
      },
      {
        name: 'الإفصاح',
        required: false,
        description: 'عنصر تحكم الطي/التوسيع للقائمة.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'label/value metadata display; column layout, collapse, orientation variants',
  usage: {
    description:
      'MetadataList displays key-value pairs for object attributes like quality, condition, and status, in a structured layout. Use it for detail panels, settings summaries, and record information.',
    bestPractices: [
      { guidance: true, description: 'Choose label position based on content: "start" for short values, "top" for long or complex values.' },
      { guidance: true, description: 'Collapse long lists with `maxNumOfItems` to keep the page scannable.' },
      { guidance: false, description: 'Use for extensive form input; use a form layout instead.' },
      { guidance: false, description: "Use for data that doesn't have a clear key-value structure." },
    ],
    anatomy: [
      {name: 'Title', required: false, description: 'Optional title for the metadata list.'},
      {name: 'Label', required: true, description: 'The key label for each metadata entry.'},
      {name: 'Metadata', required: true, description: 'The value displayed in various formats.'},
      {name: 'Disclosure', required: false, description: 'Collapse/expand control for the list.'},
    ],
  },
};
