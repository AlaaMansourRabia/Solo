/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Grid container',
    required: true,
    description:
      'Two-dimensional layout container that arranges caller-supplied items in rows and columns.',
  },
  {
    name: 'Spanning item',
    required: false,
    description:
      "Optional GridSpan wrapper that changes one item's column or row participation.",
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Grid',
  displayName: 'Grid',
  group: 'Layout',
  category: 'Layout',
  keywords: ["grid","columns","responsive","auto-fill","auto-fit","masonry","tiles","row","col","simplegrid","responsive grid","card grid"],
  usage: {
    anatomy,
    description:
      'A CSS grid layout container for arranging children in rows and columns. Use Grid for card galleries, dashboards, and any multi-column layout. Supports fixed column counts and responsive columns that reflow based on available width.',
    bestPractices: [
      { guidance: true, description: 'Use responsive columns for layouts that should adapt to screen size: `columns={{minWidth: 280}}`.' },
      { guidance: true, description: 'Cap the column count with `max` to prevent rows from getting too wide on large screens.' },
      { guidance: true, description: 'Use `repeat: \'fill\'` (the default) for consistent item widths. Use `\'fit\'` when items should stretch to fill leftover space.' },
      { guidance: false, description: 'Write manual CSS grid; Grid handles spacing and responsive behavior for you.' },
      { guidance: false, description: 'Use `HStack` with wrapping for grids; use Grid instead.' },
      { guidance: true, description: 'Track templates use CSS-variable indirection (not raw inline styles), so `className` overrides of the column template (`grid-cols-*`, including under responsive variants) take effect.' },
    ],
  },
  theming: {
    targets: [
      {className: 'solo-grid', visualProps: ['align', 'columns', 'gap', 'justify']},
      {className: 'solo-grid-span'},
    ],
  },
  playground: {
    defaults: {
      columns: 3,
      gap: 2,
      children: [
        {__element: 'Card', props: {padding: 4}, children: 'Item 1'},
        {__element: 'Card', props: {padding: 4}, children: 'Item 2'},
        {__element: 'Card', props: {padding: 4}, children: 'Item 3'},
      ],
    },
  },
  description: 'Grid container with fixed or responsive columns.',
  props: [
    {
      name: 'columns',
      type: "number | {minWidth: number, max?: number, repeat?: 'fill' | 'fit'}",
      description: 'Column configuration. Use a number for fixed columns (e.g. `columns={3}`). Use an object for responsive columns: `minWidth` sets the minimum column width in px, `repeat` controls track behavior (`"fill"` preserves empty tracks for consistent widths, `"fit"` collapses empty tracks so items stretch; defaults to `"fill"`), and `max` caps the maximum number of columns.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: 'Container width. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: 'Container height. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: 'Maximum container width. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: 'Minimum container height. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'gap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Spacing between all items.',
    },
    {
      name: 'rowGap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Row spacing; overrides `gap` for the row axis.',
    },
    {
      name: 'columnGap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Column spacing; overrides `gap` for the column axis.',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: 'Vertical alignment of items.',
      default: "'stretch'",
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description: 'Horizontal alignment of items.',
      default: "'stretch'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Grid content.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [
    {name: 'GridSpan'},
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    anatomy,
    description:
      'A CSS grid layout container for arranging children in rows and columns. Use Grid for card galleries, dashboards, and any multi-column layout. Supports fixed column counts and responsive columns that reflow based on available width.',
    bestPractices: [
      { guidance: true, description: 'Use responsive columns for layouts that should adapt to screen size: `columns={{minWidth: 280}}`.' },
      { guidance: true, description: 'Cap the column count with `max` to prevent rows from getting too wide on large screens.' },
      { guidance: true, description: 'Use `repeat: \'fill\'` (the default) for consistent item widths. Use `\'fit\'` when items should stretch to fill leftover space.' },
      { guidance: false, description: 'Write manual CSS grid; Grid handles spacing and responsive behavior for you.' },
      { guidance: false, description: 'Use `HStack` with wrapping for grids; use Grid instead.' },
      { guidance: true, description: 'Track templates use CSS-variable indirection (not raw inline styles), so `className` overrides of the column template (`grid-cols-*`, including under responsive variants) take effect.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حاوية شبكة بأعمدة ثابتة أو متجاوبة.',
  propDescriptions: {
    columns: 'إعداد الأعمدة. استخدم رقمًا للأعمدة الثابتة (مثل `columns={3}`). واستخدم كائنًا للأعمدة المتجاوبة: يحدد `minWidth` الحد الأدنى لعرض العمود بوحدة px، ويتحكم `repeat` في سلوك المسارات (`"fill"` يحتفظ بالمسارات الفارغة لعروض متسقة، و `"fit"` يطوي المسارات الفارغة لكي تتمدد العناصر؛ والقيمة الافتراضية `"fill"`)، ويضع `max` حدًا أقصى لعدد الأعمدة.',
    width: 'عرض الحاوية. تُعامَل الأرقام كبكسلات، وتُستخدم السلاسل النصية كما هي.',
    height: 'ارتفاع الحاوية. تُعامَل الأرقام كبكسلات، وتُستخدم السلاسل النصية كما هي.',
    maxWidth: 'الحد الأقصى لعرض الحاوية. تُعامَل الأرقام كبكسلات، وتُستخدم السلاسل النصية كما هي.',
    minHeight: 'الحد الأدنى لارتفاع الحاوية. تُعامَل الأرقام كبكسلات، وتُستخدم السلاسل النصية كما هي.',
    gap: 'التباعد بين جميع العناصر.',
    rowGap: 'التباعد بين الصفوف؛ يتجاوز `gap` على محور الصفوف.',
    columnGap: 'التباعد بين الأعمدة؛ يتجاوز `gap` على محور الأعمدة.',
    align: 'المحاذاة الرأسية للعناصر.',
    justify: 'المحاذاة الأفقية للعناصر.',
    children: 'محتوى الشبكة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث يتجاوز أي صنف متعارض القيمة الافتراضية.',
  },
  usage: {
    description: 'حاوية تخطيط شبكي بـ CSS لترتيب العناصر الفرعية في صفوف وأعمدة. استخدم Grid لمعارض البطاقات ولوحات المعلومات وأي تخطيط متعدد الأعمدة. يدعم أعدادًا ثابتة من الأعمدة وأعمدة متجاوبة يُعاد توزيعها بحسب العرض المتاح.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم الأعمدة المتجاوبة للتخطيطات التي ينبغي أن تتكيف مع حجم الشاشة: `columns={{minWidth: 280}}`.',
      },
      {
        guidance: true,
        description: 'ضع حدًا أقصى لعدد الأعمدة باستخدام `max` لمنع الصفوف من أن تصبح عريضة جدًا على الشاشات الكبيرة.',
      },
      {
        guidance: true,
        description: 'استخدم `repeat: \'fill\'` (الافتراضي) لعروض عناصر متسقة. واستخدم `\'fit\'` عندما ينبغي أن تتمدد العناصر لملء المساحة المتبقية.',
      },
      {
        guidance: false,
        description: 'كتابة شبكة CSS يدويًا؛ إذ يتولى Grid التباعد والسلوك المتجاوب نيابةً عنك.',
      },
      {
        guidance: false,
        description: 'استخدام `HStack` مع الالتفاف لإنشاء الشبكات؛ استخدم Grid بدلًا من ذلك.',
      },
      {
        guidance: true,
        description: 'تستخدم قوالب المسارات إحالة عبر متغيرات CSS (لا أنماطًا مضمّنة خامًا)، لذا تسري تجاوزات `className` لقالب الأعمدة (`grid-cols-*`، بما في ذلك ضمن الأنماط المتجاوبة).',
      },
    ],
    anatomy: [
      {
        name: 'حاوية الشبكة',
        required: true,
        description: 'حاوية تخطيط ثنائية الأبعاد ترتّب العناصر التي يوفرها المستدعي في صفوف وأعمدة.',
      },
      {
        name: 'عنصر ممتد',
        required: false,
        description: 'غلاف GridSpan اختياري يغيّر عدد الأعمدة أو الصفوف التي يشغلها عنصر واحد.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'CSS Grid-based layout w/ responsive column support.',
  usage: {
    anatomy,
    description: 'A CSS grid layout container for arranging children in rows and columns. Use Grid for card galleries, dashboards, and any multi-column layout. Supports fixed column counts and responsive columns that reflow based on available width.',
    bestPractices: [
      { guidance: true, description: 'Use responsive columns for layouts that should adapt to screen size: columns={{minWidth: 280}}.' },
      { guidance: true, description: 'Cap the column count with max to prevent rows from getting too wide on large screens.' },
      { guidance: true, description: 'Use repeat: \'fill\' (the default) for consistent item widths. Use \'fit\' when items should stretch to fill leftover space.' },
      { guidance: false, description: 'Write manual CSS grid; Grid handles spacing and responsive behavior for you.' },
      { guidance: false, description: 'Use HStack with wrapping for grids; use Grid instead.' },
      { guidance: true, description: 'track templates use CSS-var indirection, not inline styles, so className grid-cols-* overrides (incl. responsive variants) work.' },
    ],
  },
};
