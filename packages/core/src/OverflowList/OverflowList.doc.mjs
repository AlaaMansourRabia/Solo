/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'List',
    required: true,
    description: 'Visible horizontal list container for the currently shown content.',
  },
  {
    name: 'Items',
    required: true,
    description:
      'Caller-supplied items selected for visible display by the current width and count limits.',
  },
  {
    name: 'Overflow indicator',
    required: false,
    description:
      'Optional caller-rendered indicator for items collapsed by width or count limits.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'OverflowList',
  displayName: 'Overflow List',
  category: 'Table & List',
  keywords: [
    'overflow',
    'truncate',
    'collapse',
    'breadcrumb',
    'toolbar',
    'tag-list',
    'pill-list',
    'more',
    'clamp',
    'responsive',
  ],
  playground: {
    // children is required; without seeded items the properties-tab preview
    // renders an empty list. Provide a few items so the preview is meaningful.
    // `observeParent` measures the (full-width) preview container instead of
    // the list's own collapsed content box, so the row shows all items rather
    // than collapsing to one.
    defaults: {
      behavior: 'observeParent',
      children: [
        {__element: 'Button', props: {label: 'Overview', variant: 'secondary'}},
        {__element: 'Button', props: {label: 'Activity', variant: 'secondary'}},
        {__element: 'Button', props: {label: 'Settings', variant: 'secondary'}},
        {__element: 'Button', props: {label: 'Members', variant: 'secondary'}},
        {__element: 'Button', props: {label: 'Billing', variant: 'secondary'}},
      ],
    },
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Items to render. Each child should be a single element.',
      required: true,
    },
    {
      name: 'overflowRenderer',
      type: '(overflowItems: OverflowItem[]) => ReactNode',
      description:
        'Render function for the overflow indicator. Receives the list of hidden items (each with child and index). Only called when items are overflowing.',
    },
    {
      name: 'onOverflowChange',
      type: '(overflowItems: OverflowItem[]) => void',
      description:
        'Called whenever the collapsed set changes: with the collapsed items once something collapses, and with an empty array once the row widens back out. Membership and order changes report even when the count stays the same; unrelated re-renders and callback identity changes do not. Silent while nothing overflows, including on mount. Use stable React keys for dynamic items.',
    },
    {
      name: 'gap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Gap between items as a spacing token step (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10).',
      default: '2',
    },
    {
      name: 'minVisibleItems',
      type: 'number',
      description:
        'Minimum number of items to always show, even when overflowing.',
      default: '0',
    },
    {
      name: 'maxVisibleItems',
      type: 'number',
      description:
        'Maximum number of items to ever show, even when they all fit. The ceiling partner to minVisibleItems; extra items collapse into the overflow indicator. If less than minVisibleItems, the floor wins.',
      default: 'undefined (no cap)',
    },
    {
      name: 'maxRows',
      type: 'number',
      description:
        'Wrap items across up to this many rows before collapsing the rest into the overflow indicator. A number, not a boolean. Leave undefined (or set 1) for single-line behavior. Assumes uniform row height.',
      default: 'undefined (single line)',
    },
    {
      name: 'collapseFrom',
      type: "'start' | 'end'",
      description: 'Which end to collapse items from when overflow occurs.',
      default: "'end'",
    },
    {
      name: 'behavior',
      type: "'observeSelf' | 'observeParent'",
      description:
        "Controls which element is measured for available width. 'observeSelf' uses the container's own width. 'observeParent' observes the parent element, useful when the list should stay content-sized while still detecting available space.",
      default: "'observeSelf'",
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [{className: 'solo-overflow-list'}],
  },
  usage: {
    anatomy,
    description:
      'A horizontal list that automatically hides items when they exceed the available width. Use OverflowList for breadcrumbs, toolbars, tag lists, or any row that needs to collapse gracefully at smaller sizes.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a meaningful overflowRenderer: a "+N more" badge, a dropdown, or a count indicator.',
      },
      {
        guidance: true,
        description:
          'When the row already has its own menu, use onOverflowChange to feed the collapsed items into it instead of adding a second anchor with overflowRenderer.',
      },
      {
        guidance: true,
        description:
          'Set minVisibleItems to keep key items visible, and maxVisibleItems to cap the row at a fixed count regardless of available width.',
      },
      {
        guidance: true,
        description:
          'Use maxRows to let items wrap onto a bounded number of rows (e.g. a two-row tag cloud) before collapsing the rest into the indicator.',
      },
      {
        guidance: false,
        description:
          'Use OverflowList for a vertical stack; horizontal multi-row wrap is supported via maxRows, but items still flow left-to-right, not top-to-bottom.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'OverflowList',
  displayName: 'Overflow List',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: '要渲染的项目，每个子元素应为单一元素。',
      required: true,
    },
    {
      name: 'overflowRenderer',
      type: '(overflowItems: OverflowItem[]) => ReactNode',
      description:
        '溢出指示器的渲染函数。接收隐藏项目列表（每项包含 child 和 index）。仅在有溢出项时调用。',
    },
    {
      name: 'onOverflowChange',
      type: '(overflowItems: OverflowItem[]) => void',
      description:
        '折叠项集合变化时调用：发生折叠时传入折叠项，行重新变宽、全部放得下时传入空数组。没有溢出时（包括挂载时）不会调用。用于将折叠项交给周围界面已有的菜单，避免列表再挂载一个自己的指示器。',
    },
    {
      name: 'gap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        '项目间距，使用间距步进值（0、0.5、1、1.5、2、3、4、5、6、8、10）。',
      default: '2',
    },
    {
      name: 'minVisibleItems',
      type: 'number',
      description: '溢出时始终显示的最小项目数。',
      default: '0',
    },
    {
      name: 'maxVisibleItems',
      type: 'number',
      description:
        '始终显示的最大项目数（即使全部都能放下）。它是 minVisibleItems 的上限伙伴；多余项目会折叠进溢出指示器。若小于 minVisibleItems，则以下限为准。',
      default: 'undefined（无上限）',
    },
    {
      name: 'maxRows',
      type: 'number',
      description:
        '在将其余项目折叠进溢出指示器之前，允许项目换行到的最大行数。是数字而非布尔值。留空（或设为 1）表示单行。假定行高一致。',
      default: 'undefined（单行）',
    },
    {
      name: 'collapseFrom',
      type: "'start' | 'end'",
      description: '溢出时从哪一端开始折叠项目。',
      default: "'end'",
    },
    {
      name: 'behavior',
      type: "'observeSelf' | 'observeParent'",
      description:
        "控制测量可用宽度的元素。'observeSelf' 使用容器自身宽度；'observeParent' 观察父元素，适用于需要内容尺寸但仍检测可用空间的场景。",
      default: "'observeSelf'",
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  usage: {
    anatomy,
    description:
      'A horizontal list that automatically hides items when they exceed the available width. Use OverflowList for breadcrumbs, toolbars, tag lists, or any row that needs to collapse gracefully at smaller sizes.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a meaningful overflowRenderer: a "+N more" badge, a dropdown, or a count indicator.',
      },
      {
        guidance: true,
        description:
          'When the row already has its own menu, use onOverflowChange to feed the collapsed items into it instead of adding a second anchor with overflowRenderer.',
      },
      {
        guidance: true,
        description:
          'Set minVisibleItems to keep key items visible, and maxVisibleItems to cap the row at a fixed count regardless of available width.',
      },
      {
        guidance: true,
        description:
          'Use maxRows to let items wrap onto a bounded number of rows (e.g. a two-row tag cloud) before collapsing the rest into the indicator.',
      },
      {
        guidance: false,
        description:
          'Use OverflowList for a vertical stack; horizontal multi-row wrap is supported via maxRows, but items still flow left-to-right, not top-to-bottom.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'قائمة أفقية تُخفي العناصر تلقائيًا عندما تتجاوز العرض المتاح، مناسبة لمسار التنقّل وأشرطة الأدوات وقوائم الوسوم.',
  propDescriptions: {
    children: 'العناصر المراد عرضها. ينبغي أن يكون كل عنصر فرعي عنصرًا واحدًا.',
    overflowRenderer: 'دالة عرض لمؤشر الفائض. تتلقى قائمة العناصر المخفية (لكل منها child وindex). لا تُستدعى إلا عند فيض العناصر.',
    onOverflowChange: 'يُستدعى كلما تغيّرت مجموعة العناصر المطويّة: مع العناصر المطويّة بمجرد طيّ شيء ما، ومع مصفوفة فارغة بمجرد اتساع الصف مجددًا. تُبلَّغ تغييرات العضوية والترتيب حتى عندما يبقى العدد كما هو؛ أما إعادات العرض غير ذات الصلة وتغييرات هوية دالة الاستدعاء فلا. يبقى صامتًا ما دام لا يوجد فائض، بما في ذلك عند التركيب. استخدم مفاتيح React ثابتة للعناصر الديناميكية.',
    gap: 'المسافة بين العناصر كخطوة من رموز تصميم المسافات (0، 0.5، 1، 1.5، 2، 3، 4، 5، 6، 8، 10).',
    minVisibleItems: 'الحد الأدنى لعدد العناصر المعروضة دائمًا، حتى عند الفيض.',
    maxVisibleItems: 'الحد الأقصى لعدد العناصر المعروضة على الإطلاق، حتى لو اتسعت جميعها. هو الحد الأعلى المقابل لـ minVisibleItems؛ وتُطوى العناصر الإضافية في مؤشر الفائض. إذا كان أقل من minVisibleItems، يغلب الحد الأدنى.',
    maxRows: 'لفّ العناصر عبر هذا العدد من الصفوف كحد أقصى قبل طيّ البقية في مؤشر الفائض. قيمة رقمية لا منطقية. اتركه undefined (أو عيّنه إلى 1) لسلوك السطر الواحد. يفترض ارتفاعًا موحّدًا للصفوف.',
    collapseFrom: 'الطرف الذي تُطوى منه العناصر عند حدوث الفيض.',
    behavior: 'يتحكم في العنصر الذي يُقاس لمعرفة العرض المتاح. \'observeSelf\' يستخدم عرض الحاوية نفسها. و\'observeParent\' يراقب العنصر الأب، وهو مفيد عندما ينبغي أن تبقى القائمة بحجم محتواها مع الاستمرار في رصد المساحة المتاحة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'قائمة أفقية تُخفي العناصر تلقائيًا عندما تتجاوز العرض المتاح. استخدم OverflowList لمسار التنقّل وأشرطة الأدوات وقوائم الوسوم، أو أي صف يحتاج إلى الطيّ بسلاسة في الأحجام الأصغر.',
    bestPractices: [
      {guidance: true, description: 'وفّر overflowRenderer ذا معنى: شارة "+N more"، أو قائمة منسدلة، أو مؤشر عدد.'},
      {guidance: true, description: 'عندما يكون للصف قائمته الخاصة بالفعل، استخدم onOverflowChange لتغذيتها بالعناصر المطويّة بدلًا من إضافة مرساة ثانية عبر overflowRenderer.'},
      {guidance: true, description: 'عيّن minVisibleItems لإبقاء العناصر الأساسية ظاهرة، وmaxVisibleItems لتحديد سقف الصف بعدد ثابت بغض النظر عن العرض المتاح.'},
      {guidance: true, description: 'استخدم maxRows للسماح للعناصر بالالتفاف على عدد محدود من الصفوف (مثل سحابة وسوم من صفين) قبل طيّ البقية في المؤشر.'},
      {guidance: false, description: 'استخدام OverflowList لتكديس رأسي؛ فالالتفاف الأفقي متعدد الصفوف مدعوم عبر maxRows، لكن العناصر تظل تتدفق من اليسار إلى اليمين لا من الأعلى إلى الأسفل.'},
    ],
    anatomy: [
      {name: 'القائمة', required: true, description: 'حاوية القائمة الأفقية المرئية للمحتوى المعروض حاليًا.'},
      {name: 'العناصر', required: true, description: 'عناصر يوفّرها المستدعي وتُختار للعرض المرئي وفق قيود العرض والعدد الحالية.'},
      {name: 'مؤشر الفائض', required: false, description: 'مؤشر اختياري يعرضه المستدعي للعناصر المطويّة بسبب قيود العرض أو العدد.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'horizontal list w/ overflow indicator: hides items beyond container width',
  usage: {
    anatomy,
    description:
      'A horizontal list that automatically hides items when they exceed the available width. Use OverflowList for breadcrumbs, toolbars, tag lists, or any row that needs to collapse gracefully at smaller sizes.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a meaningful overflowRenderer: a "+N more" badge, a dropdown, or a count indicator.',
      },
      {
        guidance: true,
        description:
          'When the row already has its own menu, use onOverflowChange to feed the collapsed items into it instead of adding a second anchor with overflowRenderer.',
      },
      {
        guidance: true,
        description:
          'Set minVisibleItems to keep key items visible, and maxVisibleItems to cap the row at a fixed count regardless of available width.',
      },
      {
        guidance: true,
        description:
          'Use maxRows to let items wrap onto a bounded number of rows (e.g. a two-row tag cloud) before collapsing the rest into the indicator.',
      },
      {
        guidance: false,
        description:
          'Use OverflowList for a vertical stack; horizontal multi-row wrap is supported via maxRows, but items still flow left-to-right, not top-to-bottom.',
      },
    ],
  },
  propDescriptions: {
    children: 'items to render, each child should be a single element',
    overflowRenderer:
      'renders overflow indicator, receives hidden items w/ index',
    onOverflowChange:
      'fires w/ collapsed items when membership/order changes (empty once the row fits again); ignores unrelated renders/callback identity; stable React keys required for dynamic items',
    gap: 'item gap as spacing step',
    minVisibleItems: 'min items always shown even when overflowing',
    maxVisibleItems:
      'max items ever shown (cap); extra items collapse to indicator; min wins if smaller',
    maxRows:
      'wrap items across up to N rows then collapse rest (number, not boolean); undefined = single line',
    collapseFrom: 'which end to collapse from',
    behavior:
      'observeSelf (default) or observeParent for content-sized containers',
    className: 'Tailwind classes only (a string); merged via cn(), so conflicting utilities override defaults',
  },
};
