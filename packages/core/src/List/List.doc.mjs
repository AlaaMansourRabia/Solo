/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'List',
  displayName: 'List',
  group: 'List',
  category: 'Table & List',
  keywords: ["list","listitem","listbox","menu","collection","items","ul","navlist"],
  theming: {
    targets: [
      {className: 'solo-list', visualProps: ['density', 'listStyle']},
      {className: 'solo-list-item'},
    ],
  },
  description: 'List container with density, dividers, and header support.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'List items (ListItem components).',
      slotElements: [
        {
          __element: 'ListItem',
          props: {
            label: 'List item',
          },
        },
      ],
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: 'Spacing density for items.',
      default: "'balanced'",
    },
    {
      name: 'hasDividers',
      type: 'boolean',
      description: 'Show dividers between items.',
      default: 'false',
    },
    {
      name: 'edgeCompensation',
      type: "'inline'",
      description:
        "Compensate for item content inset on each inline edge by cancelling the smaller of each item's built-in horizontal inset and the container's published inline padding. The margin reads the same variable the items derive their inline padding from, so it tracks density and theme padding overrides automatically without pulling rows outside zero-padding or full-bleed surfaces. Use under a section heading to bring row text toward the heading text. Content aligns when container padding is at least the item inset; smaller padding leaves some inset uncompensated. Omit to leave item positions unchanged.",
    },
    {
      name: 'header',
      type: 'ReactNode',
      description: 'Header content, associated with the list via aria-labelledby.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Header',
        },
      ],
    },
    {
      name: 'listStyle',
      type: "'none' | 'disc' | 'decimal' | 'circle'",
      description: "List marker style. 'decimal' renders an <ol> element instead of <ul>.",
      default: "'none'",
    },
    {
      name: 'start',
      type: 'number',
      description:
        "Starting number for ordered lists (listStyle='decimal'). Sets the CSS counter to begin at this value.",
      default: '1',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [
    {name: 'ListItem'},
  ],
  usage: {
    description:
      'A vertical collection of items with consistent spacing, dividers, and optional markers. Supports headers, icons, avatars, badges, and interactive items with click or link behavior. Use it to display ordered or unordered groups of related content.',
    bestPractices: [
      { guidance: true, description: 'Provide a header to label the list and give context to screen readers.' },
      { guidance: true, description: 'Use start and end content slots to add icons, avatars, or badges to each item.' },
      { guidance: false, description: 'Place interactive elements inside an interactive list item; it creates nested click targets and confusing focus behavior.' },
      { guidance: false, description: 'Use a list for a single item or for laying out unrelated content; lists imply a meaningful collection.' },
      { guidance: false, description: 'Mix clickable and non-clickable items in the same list without clear visual distinction.' },
    ],
    anatomy: [
      {name: 'List title', required: true, description: 'Heading that labels the list.'},
      {name: 'Description', required: false, description: 'Supplementary text below the title.'},
      {name: 'List items', required: true, description: 'Individual entries, which may include icons or images.'},
      {name: 'Item description', required: false, description: 'Additional detail for an individual list item.'},
    ],
  },
};
/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'A vertical collection of items with consistent spacing, dividers, and optional markers. Supports headers, icons, avatars, badges, and interactive items with click or link behavior. Use it to display ordered or unordered groups of related content.',
    bestPractices: [
      { guidance: true, description: 'Provide a header to label the list and give context to screen readers.' },
      { guidance: true, description: 'Use start and end content slots to add icons, avatars, or badges to each item.' },
      { guidance: false, description: 'Place interactive elements inside an interactive list item; it creates nested click targets and confusing focus behavior.' },
      { guidance: false, description: 'Use a list for a single item or for laying out unrelated content; lists imply a meaningful collection.' },
      { guidance: false, description: 'Mix clickable and non-clickable items in the same list without clear visual distinction.' },
    ],
    anatomy: [
      {name: 'List title', required: true, description: 'Heading that labels the list.'},
      {name: 'Description', required: false, description: 'Supplementary text below the title.'},
      {name: 'List items', required: true, description: 'Individual entries, which may include icons or images.'},
      {name: 'Item description', required: false, description: 'Additional detail for an individual list item.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حاوية قائمة تدعم الكثافة والفواصل والترويسة.',
  propDescriptions: {
    children: 'عناصر القائمة (مكوّنات ListItem).',
    density: 'كثافة التباعد للعناصر.',
    hasDividers: 'يعرض فواصل بين العناصر.',
    edgeCompensation: 'يعوّض الإزاحة الداخلية لمحتوى العناصر عند كل حافة أفقية بإلغاء الأصغر من بين الإزاحة الأفقية المدمجة لكل عنصر والحشو الأفقي المنشور للحاوية. يقرأ الهامش المتغير نفسه الذي تشتق منه العناصر حشوها الأفقي، فيتتبع الكثافة وتجاوزات حشو السمة تلقائيًا دون سحب الصفوف خارج الأسطح ذات الحشو الصفري أو الممتدة حتى الحواف. استخدمه أسفل عنوان قسم لتقريب نص الصفوف من نص العنوان. يتحاذى المحتوى عندما يكون حشو الحاوية مساويًا لإزاحة العنصر على الأقل؛ أما الحشو الأصغر فيترك جزءًا من الإزاحة دون تعويض. احذفه لإبقاء مواضع العناصر دون تغيير.',
    header: 'محتوى الترويسة، ويرتبط بالقائمة عبر aria-labelledby.',
    listStyle: 'نمط علامة القائمة. القيمة \'decimal\' تعرض عنصر <ol> بدلًا من <ul>.',
    start: 'رقم البداية للقوائم المرتبة (listStyle=\'decimal\'). يضبط عدّاد CSS ليبدأ من هذه القيمة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأحجام)، تُدمج مع أصناف المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'مجموعة عمودية من العناصر بتباعد متسق وفواصل وعلامات اختيارية. تدعم الترويسات والأيقونات والصور الرمزية والشارات والعناصر التفاعلية ذات سلوك النقر أو الرابط. استخدمها لعرض مجموعات مرتبة أو غير مرتبة من المحتوى المترابط.',
    bestPractices: [
      {
        guidance: true,
        description: 'وفّر ترويسة لتسمية القائمة وإعطاء سياق لبرامج قراءة الشاشة.',
      },
      {
        guidance: true,
        description: 'استخدم فتحتي محتوى البداية والنهاية لإضافة أيقونات أو صور رمزية أو شارات إلى كل عنصر.',
      },
      {
        guidance: false,
        description: 'وضع عناصر تفاعلية داخل عنصر قائمة تفاعلي؛ فهذا ينشئ أهداف نقر متداخلة وسلوك تركيز مربكًا.',
      },
      {
        guidance: false,
        description: 'استخدام قائمة لعنصر واحد أو لتخطيط محتوى غير مترابط؛ فالقوائم توحي بمجموعة ذات معنى.',
      },
      {
        guidance: false,
        description: 'الخلط بين عناصر قابلة للنقر وأخرى غير قابلة للنقر في القائمة نفسها دون تمييز مرئي واضح.',
      },
    ],
    anatomy: [
      {
        name: 'عنوان القائمة',
        required: true,
        description: 'عنوان يسمّي القائمة.',
      },
      {
        name: 'الوصف',
        required: false,
        description: 'نص تكميلي أسفل العنوان.',
      },
      {
        name: 'عناصر القائمة',
        required: true,
        description: 'إدخالات فردية قد تتضمن أيقونات أو صورًا.',
      },
      {
        name: 'وصف العنصر',
        required: false,
        description: 'تفاصيل إضافية لعنصر قائمة فردي.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Vertical list for rendering item collections w/ consistent spacing, dividers, marker styles. Composition model: List wraps ListItem sub-components.',
  usage: {
    description:
      'A vertical collection of items with consistent spacing, dividers, and optional markers. Supports headers, icons, avatars, badges, and interactive items with click or link behavior. Use it to display ordered or unordered groups of related content.',
    bestPractices: [
      { guidance: true, description: 'Provide a header to label the list and give context to screen readers.' },
      { guidance: true, description: 'Use start and end content slots to add icons, avatars, or badges to each item.' },
      { guidance: false, description: 'Place interactive elements inside an interactive list item; it creates nested click targets and confusing focus behavior.' },
      { guidance: false, description: 'Use a list for a single item or for laying out unrelated content; lists imply a meaningful collection.' },
      { guidance: false, description: 'Mix clickable and non-clickable items in the same list without clear visual distinction.' },
    ],
    anatomy: [
      {name: 'List title', required: true, description: 'Heading that labels the list.'},
      {name: 'Description', required: false, description: 'Supplementary text below the title.'},
      {name: 'List items', required: true, description: 'Individual entries, which may include icons or images.'},
      {name: 'Item description', required: false, description: 'Additional detail for an individual list item.'},
    ],
  },
};
