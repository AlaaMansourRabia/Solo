/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Layout container',
    required: true,
    description:
      'General layout primitive that places the header, start, content, end, and footer slots.',
  },
  {
    name: 'Header',
    required: false,
    description:
      'Optional LayoutHeader region supplied by the caller, typically in the header slot.',
  },
  {
    name: 'Panel',
    required: false,
    description:
      'Optional LayoutPanel region supplied by the caller in the start or end slot.',
  },
  {
    name: 'Content area',
    required: false,
    description:
      'Optional LayoutContent region supplied by the caller in the content slot.',
  },
  {
    name: 'Footer',
    required: false,
    description:
      'Optional LayoutFooter region supplied by the caller, typically in the footer slot.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Layout',
  displayName: 'Layout',
  group: 'Layout',
  category: 'Layout',
  keywords: ["layout","container","content","flex","box","wrapper","page","regions"],
  playground: {
    defaults: {
      header: {__element: 'LayoutHeader', props: {}, children: {__element: 'Heading', props: {level: 3}, children: 'Page Title'}},
      content: {__element: 'LayoutContent', props: {}, children: {__element: 'Text', props: {type: 'body', color: 'secondary'}, children: 'Main content area. This is the scrollable center section of the layout.'}},
      footer: {__element: 'LayoutFooter', props: {}, children: {__element: 'Text', props: {type: 'supporting', color: 'secondary'}, children: 'Footer: status bar or actions'}},
    },
  },
  theming: {
    targets: [
      {className: 'solo-layout', visualProps: ['height']},
      {className: 'solo-layout-content'},
      {className: 'solo-layout-footer'},
      {className: 'solo-layout-header'},
      {className: 'solo-layout-panel'},
    ],
  },
  description: 'General five-slot layout primitive for arranging header, start, content, end, and footer regions.',
  props: [
    {
      name: 'content',
      type: 'ReactNode',
      description:
        'Content slot (center). Accepts any ReactNode; use LayoutContent when a content region is needed. Children passed to `<Layout>` render here too: `<Layout>{main}</Layout>` is shorthand for `<Layout content={main} />`.',
      slotElements: [
        {
          __element: 'LayoutContent',
          props: {},
          children: 'Content',
        },
      ],
    },
    {
      name: 'header',
      type: 'ReactNode',
      description:
        'Header slot. Accepts any ReactNode; use LayoutHeader when a header region is needed.',
      slotElements: [
        {
          __element: 'LayoutHeader',
          props: {},
          children: 'Header',
        },
      ],
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description:
        'Footer slot. Accepts any ReactNode; use LayoutFooter when a footer region is needed.',
      slotElements: [
        {
          __element: 'LayoutFooter',
          props: {},
          children: 'Footer',
        },
      ],
    },
    {
      name: 'start',
      type: 'ReactNode',
      description:
        'Logical-start slot (left in LTR). Accepts any ReactNode; use LayoutPanel when a panel region is needed.',
      slotElements: [
        {
          __element: 'LayoutPanel',
          props: {},
          children: 'Panel',
        },
      ],
    },
    {
      name: 'end',
      type: 'ReactNode',
      description:
        'Logical-end slot (right in LTR). Accepts any ReactNode; use LayoutPanel when a panel region is needed.',
      slotElements: [
        {
          __element: 'LayoutPanel',
          props: {},
          children: 'Panel',
        },
      ],
    },
    {
      name: 'height',
      type: "'fill' | 'auto'",
      description: 'Height behavior: fill the container or grow with content.',
      default: "'fill'",
    },
    {
      name: 'contentWidth',
      type: 'SizeValue',
      description:
        'Maximum width of the aligned content within each slot (header, content, footer, panels), centered when narrower than the available space. Without panels, LayoutContent spans the available width so its scrollbar stays at the outer edge while its children align internally to contentWidth. With exactly one panel, the panel stays aligned to the contentWidth frame while LayoutContent extends to the opposite open edge. With both panels, contentWidth includes the complete middle composition. Percentage widths—including percentage-bearing calc(), min(), max(), and clamp() values—and intrinsic widths, plus bare var(...) values, retain the constrained composition; use calc(var(...)) for a variable guaranteed to resolve to a length. Dividers stay full-bleed. Numbers are treated as pixels, strings are used as-is (e.g. `60ch`). Common page widths: 640 for forms, settings, and text-focused pages; 960 for content pages and wider layouts.',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        "Padding at the layout's outer edges using the spacing scale.",
    },
    {
      name: 'defaultHasDividers',
      type: 'boolean',
      description:
        "Default divider visibility for LayoutHeader and LayoutFooter children. Headers and footers that don't pass `hasDivider` use this value; when unset, nested layouts inherit from their parent context.",
    },
  ],
  components: [
    {name: 'LayoutHeader'},
    {name: 'LayoutContent'},
    {name: 'LayoutFooter'},
    {name: 'LayoutPanel'},
    {name: 'Card'},
    {name: 'Section'},
  ],
  usage: {
    description:
      'Layout is a general five-slot primitive for arranging header, start, content, end, and footer regions within a page or bounded container. AppShell owns the page shell and app-wide navigation behavior; use HStack or VStack for simple directional stacking.',
    bestPractices: [
      { guidance: true, description: 'Use Layout when content needs named header, start, content, end, or footer regions.' },
      { guidance: true, description: 'Use HStack and VStack for simple directional stacking within a content area.' },
      { guidance: false, description: 'Use Layout for simple stacking layouts; use HStack or VStack instead.' },
      { guidance: false, description: 'Use Layout as the page shell or for app-wide navigation; use AppShell for that responsibility.' },
    ],
    anatomy,
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'Layout is a general five-slot primitive for arranging header, start, content, end, and footer regions within a page or bounded container. AppShell owns the page shell and app-wide navigation behavior; use HStack or VStack for simple directional stacking.',
    bestPractices: [
      { guidance: true, description: 'Use Layout when content needs named header, start, content, end, or footer regions.' },
      { guidance: true, description: 'Use HStack and VStack for simple directional stacking within a content area.' },
      { guidance: false, description: 'Use Layout for simple stacking layouts; use HStack or VStack instead.' },
      { guidance: false, description: 'Use Layout as the page shell or for app-wide navigation; use AppShell for that responsibility.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'عنصر تخطيط أولي عام بخمس خانات لترتيب مناطق الترويسة والبداية والمحتوى والنهاية والتذييل.',
  propDescriptions: {
    content:
      'خانة المحتوى (الوسط). تقبل أي ReactNode؛ استخدم LayoutContent عند الحاجة إلى منطقة محتوى. تُعرض هنا أيضًا العناصر الأبناء الممرّرة إلى `<Layout>`: فالصيغة `<Layout>{main}</Layout>` اختصار لـ `<Layout content={main} />`.',
    header: 'خانة الترويسة. تقبل أي ReactNode؛ استخدم LayoutHeader عند الحاجة إلى منطقة ترويسة.',
    footer: 'خانة التذييل. تقبل أي ReactNode؛ استخدم LayoutFooter عند الحاجة إلى منطقة تذييل.',
    start:
      'خانة البداية المنطقية (اليسار في LTR). تقبل أي ReactNode؛ استخدم LayoutPanel عند الحاجة إلى منطقة لوحة.',
    end:
      'خانة النهاية المنطقية (اليمين في LTR). تقبل أي ReactNode؛ استخدم LayoutPanel عند الحاجة إلى منطقة لوحة.',
    height: 'سلوك الارتفاع: ملء الحاوية أو النمو مع المحتوى.',
    contentWidth:
      'الحد الأقصى لعرض المحتوى المحاذى داخل كل خانة (الترويسة والمحتوى والتذييل واللوحات)، ويُوسَّط عندما يكون أضيق من المساحة المتاحة. بلا لوحات، يمتد LayoutContent على العرض المتاح ليبقى شريط التمرير عند الحافة الخارجية بينما تتحاذى عناصره الأبناء داخليًا وفق contentWidth. ومع لوحة واحدة بالضبط، تبقى اللوحة محاذاة لإطار contentWidth بينما يمتد LayoutContent إلى الحافة المفتوحة المقابلة. ومع اللوحتين، يشمل contentWidth التركيب الأوسط كاملًا. تحتفظ العروض النسبية (بما فيها قيم calc() وmin() وmax() وclamp() المتضمنة نسبًا مئوية) والعروض الجوهرية وقيم var(...) المجرّدة بالتركيب المقيّد؛ استخدم calc(var(...)) لمتغير مضمون أن يُحسب طولًا. تبقى الفواصل ممتدة بالكامل. تُعامَل الأرقام على أنها بكسلات، وتُستخدم السلاسل كما هي (مثل `60ch`). عروض الصفحات الشائعة: 640 للنماذج والإعدادات والصفحات النصية؛ و960 لصفحات المحتوى والتخطيطات الأعرض.',
    padding: 'الحشو عند الحواف الخارجية للتخطيط باستخدام مقياس التباعد.',
    defaultHasDividers:
      'الظهور الافتراضي للفواصل في العناصر الأبناء LayoutHeader وLayoutFooter. تستخدم الترويسات والتذييلات التي لا تمرّر `hasDivider` هذه القيمة؛ وعند عدم تعيينها ترث التخطيطات المتداخلة من سياق العنصر الأب.',
  },
  usage: {
    description:
      'Layout عنصر أولي عام بخمس خانات لترتيب مناطق الترويسة والبداية والمحتوى والنهاية والتذييل داخل صفحة أو حاوية محدودة. يتولى AppShell هيكل الصفحة وسلوك التنقّل على مستوى التطبيق؛ واستخدم HStack أو VStack للتكديس الاتجاهي البسيط.',
    bestPractices: [
      {
        guidance: true,
        description:
          'استخدم Layout عندما يحتاج المحتوى إلى مناطق مسمّاة للترويسة أو البداية أو المحتوى أو النهاية أو التذييل.',
      },
      {
        guidance: true,
        description: 'استخدم HStack وVStack للتكديس الاتجاهي البسيط داخل منطقة المحتوى.',
      },
      {
        guidance: false,
        description:
          'لا تستخدم Layout لتخطيطات التكديس البسيطة؛ استخدم HStack أو VStack بدلًا منه.',
      },
      {
        guidance: false,
        description:
          'لا تستخدم Layout هيكلًا للصفحة أو للتنقّل على مستوى التطبيق؛ استخدم AppShell لهذه المسؤولية.',
      },
    ],
    anatomy: [
      {
        name: 'حاوية التخطيط',
        required: true,
        description: 'عنصر تخطيط أولي عام يضع خانات الترويسة والبداية والمحتوى والنهاية والتذييل.',
      },
      {
        name: 'الترويسة',
        required: false,
        description: 'منطقة LayoutHeader اختيارية يوفّرها المستدعي، عادةً في خانة الترويسة.',
      },
      {
        name: 'اللوحة',
        required: false,
        description: 'منطقة LayoutPanel اختيارية يوفّرها المستدعي في خانة البداية أو النهاية.',
      },
      {
        name: 'منطقة المحتوى',
        required: false,
        description: 'منطقة LayoutContent اختيارية يوفّرها المستدعي في خانة المحتوى.',
      },
      {
        name: 'التذييل',
        required: false,
        description: 'منطقة LayoutFooter اختيارية يوفّرها المستدعي، عادةً في خانة التذييل.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'General five-slot primitive for arranging header, start, content, end, and footer regions. AppShell owns the page shell.',
  usage: {
    description:
      'Layout is a general five-slot primitive for arranging header, start, content, end, and footer regions within a page or bounded container. AppShell owns the page shell and app-wide navigation behavior; use HStack or VStack for simple directional stacking.',
    bestPractices: [
      { guidance: true, description: 'Use Layout when content needs named header, start, content, end, or footer regions.' },
      { guidance: true, description: 'Use HStack and VStack for simple directional stacking within a content area.' },
      { guidance: false, description: 'Use Layout for simple stacking layouts; use HStack or VStack instead.' },
      { guidance: false, description: 'Use Layout as the page shell or for app-wide navigation; use AppShell for that responsibility.' },
    ],
    anatomy,
  },
};
