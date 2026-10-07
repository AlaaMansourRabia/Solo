/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Glyph',
    required: true,
    description: 'Visual symbol rendered for the selected icon.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Icon',
  displayName: 'Icon',
  category: 'Content',
  keywords: [
    'icon',
    'svg',
    'glyph',
    'symbol',
    'pictogram',
    'graphic',
    'vector',
  ],
  playground: {
    // `icon` is required and its type can't be auto-generated, so the
    // properties-tab preview showed "Missing: icon". Seed a valid semantic
    // icon name so the interactive preview renders.
    defaults: {
      icon: 'search',
    },
  },
  props: [
    {
      name: 'icon',
      type: 'IconName | NamespacedIconName | IconType',
      description:
        'Semantic icon name or SVG component. Valid semantic names: close, chevronDown, chevronLeft, chevronRight, chevronsLeft, chevronsRight, check, success, error, warning, info, calendar, clock, externalLink, menu, moreHorizontal, search, arrowUp, arrowDown, arrowsUpDown, funnel, eyeSlash, viewColumns, copy, checkDouble, wrench, stop, microphone. A namespaced registry name (namespace:name) is also accepted. For any icon not in this list, pass an SVG component directly (e.g. import from lucide-react or @heroicons/react). Note: this prop is called `icon`, not `name`.',
      required: true,
    },
    {
      name: 'color',
      type: "'primary' | 'secondary' | 'tertiary' | 'disabled' | 'accent' | 'success' | 'error' | 'warning' | 'inherit' | 'blue' | 'red' | 'green' | 'gray' | 'cyan' | 'teal' | 'yellow' | 'orange' | 'pink' | 'purple'",
      description: 'Color variant mapped to Solo icon color tokens. The semantic values follow the theme roles; blue through purple are non-semantic palette colors.',
      default: "'inherit'",
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg'",
      description:
        'Icon size. An explicit value wins. When omitted, Icon uses the nearest default supplied by an owning Solo component for its icon slot, then falls back to md when no contextual default exists.',
      default: "Contextual; otherwise 'md'",
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name for a MEANINGFUL, standalone icon (a status glyph or icon-only indicator with no adjacent text). Setting it exposes the icon to screen readers as role="img" with this text as the accessible name (aria-label) and removes the default aria-hidden. Omit it (default) for decorative icons and the icon stays hidden from assistive tech (aria-hidden="true"). This is the accessible-name / alt-text prop for icons: one prop instead of manually setting aria-label + role + aria-hidden. An empty string is treated as decorative. Do not set it when an interactive parent (Button, IconButton, link) already names the control.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        "Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.",
    },
  ],
  theming: {
    targets: [{className: 'solo-icon', visualProps: ['color', 'size']}],
  },
  usage: {
    description:
      'Icons are small visual symbols that represent actions, objects, or concepts. They improve scannability and reinforce meaning alongside text. Supports both direct SVG components and semantic icon names that adapt to the active theme.',
    anatomy,
    bestPractices: [
      {
        guidance: true,
        description:
          'Use semantic icon names when available; they adapt to theme changes automatically.',
      },
      {
        guidance: true,
        description:
          "Override icons through the theme, not globally: defineTheme({icons: {close: <XMarkIcon />}}) scopes the swap to the active <Theme>, and extends shallow-merges it into derived themes. registerIcons() mutates a process-wide registry and warns in dev, so keep it for app bootstrap rather than making it a library's theming seam.",
      },
      {
        guidance: true,
        description:
          'Pair icons with text labels for accessibility; icon-only elements need an accessible label.',
      },
      {
        guidance: true,
        description:
          'For a meaningful standalone icon (no adjacent text), give it an accessible name via the `label` prop: it sets role="img" + aria-label and unhides the icon.',
      },
      {
        guidance: true,
        description:
          'Use color tokens for icon colors, not hardcoded hex values.',
      },
      {
        guidance: true,
        description:
          'Be mindful of context; decorative icons in compact components can distract rather than help.',
      },
      {
        guidance: false,
        description:
          'Use icons as the sole means of conveying meaning; always provide a text alternative.',
      },
      {
        guidance: false,
        description:
          'Resize icons with arbitrary pixel values; use the provided size props.',
      },
      {
        guidance: false,
        description:
          'Mix icon styles (e.g. outline and filled) within the same context.',
      },
      {
        guidance: false,
        description:
          'Render raw SVG elements; always wrap in Icon for consistent sizing and color.',
      },
      {
        guidance: false,
        description:
          'Pass a `name` prop; Icon uses `icon` (not `name`) to specify which icon to render.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Icon',
  displayName: 'Icon',
  props: [
    {
      name: 'icon',
      type: 'IconName | NamespacedIconName | IconType',
      description:
        '语义图标名称或 SVG 组件。有效语义名称：close, chevronDown, chevronLeft, chevronRight, chevronsLeft, chevronsRight, check, success, error, warning, info, calendar, clock, externalLink, menu, moreHorizontal, search, arrowUp, arrowDown, arrowsUpDown, funnel, eyeSlash, viewColumns, copy, checkDouble, wrench, stop, microphone。也接受命名空间注册名称（namespace:name）。列表之外的图标请直接传入 SVG 组件。',
      required: true,
    },
    {
      name: 'color',
      type: "'primary' | 'secondary' | 'tertiary' | 'disabled' | 'accent' | 'success' | 'error' | 'warning' | 'inherit' | 'blue' | 'red' | 'green' | 'gray' | 'cyan' | 'teal' | 'yellow' | 'orange' | 'pink' | 'purple'",
      description: '映射到 Solo 图标颜色令牌的颜色变体。语义值跟随主题角色；blue 到 purple 为非语义调色板颜色。',
      default: "'inherit'",
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg'",
      description:
        '图标尺寸。显式值优先。省略时，Icon 使用最近的 Solo 所属组件为其图标槽提供的默认尺寸；如果没有上下文默认值，则回退为 md。',
      default: "上下文默认值；否则为 'md'",
    },
    {
      name: 'label',
      type: 'string',
      description:
        '有含义的独立图标的可访问名称（无相邻文字的状态图标或纯图标指示器）。设置后会将图标以 role="img" 暴露给辅助技术，并以该文本作为可访问名称（aria-label），同时移除默认的 aria-hidden。省略（默认）用于装饰性图标，图标对辅助技术保持隐藏（aria-hidden="true"）。空字符串按装饰性处理。当交互式父元素（Button、IconButton、链接）已命名该控件时请勿设置。',
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  theming: {
    targets: [{className: 'solo-icon', visualProps: ['color', 'size']}],
  },
  usage: {
    description:
      'Icons are small visual symbols that represent actions, objects, or concepts. They improve scannability and reinforce meaning alongside text. Supports both direct SVG components and semantic icon names that adapt to the active theme.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use semantic icon names when available; they adapt to theme changes automatically.',
      },
      {
        guidance: true,
        description:
          'Pair icons with text labels for accessibility; icon-only elements need an accessible label.',
      },
      {
        guidance: true,
        description:
          'Use color tokens for icon colors, not hardcoded hex values.',
      },
      {
        guidance: true,
        description:
          'Be mindful of context; decorative icons in compact components can distract rather than help.',
      },
      {
        guidance: false,
        description:
          'Use icons as the sole means of conveying meaning; always provide a text alternative.',
      },
      {
        guidance: false,
        description:
          'Resize icons with arbitrary pixel values; use the provided size props.',
      },
      {
        guidance: false,
        description:
          'Mix icon styles (e.g. outline and filled) within the same context.',
      },
      {
        guidance: false,
        description:
          'Render raw SVG elements; always wrap in Icon for consistent sizing and color.',
      },
      {
        guidance: false,
        description:
          'Pass a `name` prop; Icon uses `icon` (not `name`) to specify which icon to render.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'الأيقونات رموز مرئية صغيرة تمثل الإجراءات أو الكائنات أو المفاهيم، وتدعم مكوّنات SVG المباشرة وأسماء الأيقونات الدلالية التي تتكيف مع السمة النشطة.',
  propDescriptions: {
    icon: 'اسم أيقونة دلالي أو مكوّن SVG. الأسماء الدلالية الصالحة: close، chevronDown، chevronLeft، chevronRight، chevronsLeft، chevronsRight، check، success، error، warning، info، calendar، clock، externalLink، menu، moreHorizontal، search، arrowUp، arrowDown، arrowsUpDown، funnel، eyeSlash، viewColumns، copy، checkDouble، wrench، stop، microphone. ويُقبل أيضًا اسم سجل بمساحة أسماء (namespace:name). لأي أيقونة غير موجودة في هذه القائمة، مرِّر مكوّن SVG مباشرةً (مثل الاستيراد من lucide-react أو @heroicons/react). ملاحظة: اسم هذه الخاصية `icon` وليس `name`.',
    color: 'نمط اللون المقابل لرموز تصميم ألوان الأيقونات في Solo. تتبع القيم الدلالية أدوار السمة؛ أما القيم من blue إلى purple فهي ألوان لوحة غير دلالية.',
    size: 'حجم الأيقونة. تكون الأولوية للقيمة الصريحة. عند حذفها، يستخدم Icon أقرب قيمة افتراضية يوفّرها مكوّن Solo المالك لفتحة الأيقونة الخاصة به، ثم يعود إلى md عند عدم وجود قيمة افتراضية سياقية.',
    label: 'الاسم القابل للوصول لأيقونة مستقلة ذات معنى (رمز حالة أو مؤشر بأيقونة فقط دون نص مجاور). ضبطه يكشف الأيقونة لبرامج قراءة الشاشة بالدور role="img" مع هذا النص كاسم قابل للوصول (aria-label) ويزيل aria-hidden الافتراضي. احذفه (الافتراضي) للأيقونات الزخرفية فتبقى الأيقونة مخفية عن التقنيات المساعدة (aria-hidden="true"). هذه هي خاصية الاسم القابل للوصول/النص البديل للأيقونات: خاصية واحدة بدلًا من ضبط aria-label وrole وaria-hidden يدويًا. يُعامَل النص الفارغ على أنه زخرفي. لا تضبطه عندما يكون هناك عنصر أب تفاعلي (Button، أو IconButton، أو رابط) يسمّي عنصر التحكم بالفعل.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأحجام)، تُدمج مع أصناف المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'الأيقونات رموز مرئية صغيرة تمثل الإجراءات أو الكائنات أو المفاهيم. تحسّن سهولة المسح البصري وتعزّز المعنى إلى جانب النص. تدعم مكوّنات SVG المباشرة وأسماء الأيقونات الدلالية التي تتكيف مع السمة النشطة.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم أسماء الأيقونات الدلالية عند توفرها؛ فهي تتكيف مع تغييرات السمة تلقائيًا.',
      },
      {
        guidance: true,
        description: 'تجاوز الأيقونات عبر السمة لا على مستوى عام: ‏defineTheme({icons: {close: <XMarkIcon />}}) يحصر الاستبدال في <Theme> النشطة، وextends يدمجه دمجًا سطحيًا في السمات المشتقة. أما registerIcons() فيعدّل سجلًا على مستوى العملية بأكملها ويُصدر تحذيرًا في بيئة التطوير، لذا احتفظ به لتهيئة التطبيق بدلًا من جعله نقطة تخصيص السمات في مكتبة.',
      },
      {
        guidance: true,
        description: 'اقرن الأيقونات بتسميات نصية لإمكانية الوصول؛ فالعناصر ذات الأيقونة فقط تحتاج إلى تسمية قابلة للوصول.',
      },
      {
        guidance: true,
        description: 'للأيقونة المستقلة ذات المعنى (دون نص مجاور)، امنحها اسمًا قابلًا للوصول عبر الخاصية `label`: فهي تضبط role="img" مع aria-label وتُظهر الأيقونة.',
      },
      {
        guidance: true,
        description: 'استخدم رموز تصميم الألوان لألوان الأيقونات، لا قيم hex ثابتة.',
      },
      {
        guidance: true,
        description: 'انتبه إلى السياق؛ فالأيقونات الزخرفية في المكوّنات المضغوطة قد تشتّت الانتباه بدلًا من أن تساعد.',
      },
      {
        guidance: false,
        description: 'استخدام الأيقونات كوسيلة وحيدة لنقل المعنى؛ وفّر دائمًا بديلًا نصيًا.',
      },
      {
        guidance: false,
        description: 'تغيير حجم الأيقونات بقيم بكسل عشوائية؛ استخدم خصائص الحجم المتوفرة.',
      },
      {
        guidance: false,
        description: 'الخلط بين أنماط الأيقونات (مثل المحددة والمملوءة) في السياق نفسه.',
      },
      {
        guidance: false,
        description: 'عرض عناصر SVG خام؛ غلّفها دائمًا داخل Icon للحصول على حجم ولون متسقين.',
      },
      {
        guidance: false,
        description: 'تمرير خاصية `name`؛ إذ يستخدم Icon الخاصية `icon` (وليس `name`) لتحديد الأيقونة المراد عرضها.',
      },
    ],
    anatomy: [
      {
        name: 'الرمز',
        required: true,
        description: 'الرمز المرئي المعروض للأيقونة المحددة.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Renders icons w/ Solo design system colors + sizes. Supports direct SVG icon components + semantic icon names that adapt to active theme.',
  usage: {
    description:
      'Icons are small visual symbols that represent actions, objects, or concepts. They improve scannability and reinforce meaning alongside text. Supports both direct SVG components and semantic icon names that adapt to the active theme.',
    anatomy,
    bestPractices: [
      {
        guidance: true,
        description:
          'Use semantic icon names when available; they adapt to theme changes automatically.',
      },
      {
        guidance: true,
        description:
          'Override icons via theme, not globally: defineTheme({icons: {close: <XMarkIcon />}}) scopes the swap to the active <Theme>; extends shallow-merges into derived themes. registerIcons() mutates a global registry and warns in dev: app bootstrap only, not a library theming seam.',
      },
      {
        guidance: true,
        description:
          'Pair icons with text labels for accessibility; icon-only elements need an accessible label.',
      },
      {
        guidance: true,
        description:
          'For a meaningful standalone icon (no adjacent text), set an accessible name via `label`: sets role="img" + aria-label, unhides icon.',
      },
      {
        guidance: true,
        description:
          'Use color tokens for icon colors, not hardcoded hex values.',
      },
      {
        guidance: true,
        description:
          'Be mindful of context; decorative icons in compact components can distract rather than help.',
      },
      {
        guidance: false,
        description:
          'Use icons as the sole means of conveying meaning; always provide a text alternative.',
      },
      {
        guidance: false,
        description:
          'Resize icons with arbitrary pixel values; use the provided size props.',
      },
      {
        guidance: false,
        description:
          'Mix icon styles (e.g. outline and filled) within the same context.',
      },
      {
        guidance: false,
        description:
          'Render raw SVG elements; always wrap in Icon for consistent sizing and color.',
      },
      {
        guidance: false,
        description:
          '`name` prop, which does not exist. Use `icon` to specify which icon to render.',
      },
    ],
  },
  propDescriptions: {
    icon: 'Semantic icon name or SVG component. Valid names: close, chevronDown, chevronLeft, chevronRight, chevronsLeft, chevronsRight, check, success, error, warning, info, calendar, clock, externalLink, menu, moreHorizontal, search, arrowUp, arrowDown, arrowsUpDown, funnel, eyeSlash, viewColumns, copy, checkDouble, wrench, stop, microphone. For others, pass an SVG component.',
    color: 'Color variant mapped to Solo icon color tokens. The semantic values follow the theme roles; blue through purple are non-semantic palette colors.',
    size: "explicit Icon size; otherwise nearest owning-component default, then 'md' when no contextual default exists",
    label:
      'Accessible name for a meaningful, standalone icon. Sets role="img" + aria-label and drops the default aria-hidden. Omit (default) for decorative icons (stays aria-hidden). Empty string = decorative. The accessible-name/alt-text prop for icons.',
    className:
      'Tailwind classes (color, size, opacity); merged with the base color/size classes via cn(), so conflicting utilities override them.',
  },
};
