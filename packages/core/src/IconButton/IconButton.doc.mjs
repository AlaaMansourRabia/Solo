/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'IconButton',
  displayName: 'Icon Button',
  group: 'Button',
  category: 'Action',
  keywords: ['icon-button', 'icon', 'button', 'toolbar', 'action', 'compact'],

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label. Used as aria-label (not rendered as visible text).',
      required: true,
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon element rendered inside the button. An Solo Icon with no explicit size defaults to sm for sm/md buttons and md for lg buttons.',
      required: true,
      slotElements: [{__element: 'Icon', props: {icon: 'check'}}],
    },
    {
      name: 'variant',
      type: "\'primary\' | \'secondary\' | \'ghost\' | \'destructive\'",
      description: 'Visual style variant.',
      default: "\'secondary\'",
    },
    {
      name: 'size',
      type: "\'sm\' | \'md\' | \'lg\'",
      description: 'Size variant.',
      default: "\'md\'",
    },
    {
      name: 'elevation',
      type: "'none' | 'low' | 'med' | 'high'",
      description:
        'Resting shadow depth. The most common FAB shape is an icon-only button, so raise it with `low`/`med`/`high` for a floating action button. `none` is the default flat button.',
      default: "'none'",
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Shows a loading spinner and disables interaction.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the button.',
      default: 'false',
    },
    {
      name: 'tooltip',
      type: 'string',
      description: 'Tooltip text shown on hover.',
    },
    {
      name: 'onClick',
      type: '(e: MouseEvent) => void',
      description: 'Standard click handler.',
    },
    {
      name: 'clickAction',
      type: '(e: MouseEvent) => void | Promise<void>',
      description: 'Async click handler with automatic loading state.',
    },
    {
      name: 'type',
      type: "'button' | 'submit' | 'reset'",
      description: 'HTML button type attribute.',
      default: "'button'",
    },
    {
      name: 'name',
      type: 'string',
      description: 'HTML name attribute for form submission.',
    },
    {
      name: 'value',
      type: 'string | number | readonly string[]',
      description: 'HTML value attribute for form submission.',
    },
    {
      name: 'form',
      type: 'string',
      description: 'Associates the button with a form element by ID.',
    },
    {
      name: 'isInterruptible',
      type: 'boolean',
      description: 'Keep the button clickable while a clickAction is pending: the spinner and aria-busy still show, but the button is not disabled and the action is not deduped, so a re-click lands and interrupts the in-flight action with a fresh one.',
      default: 'false',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        "Width of the button. Numbers are treated as pixels, strings are used as-is (e.g., '100%' for a full-width button). By default the icon-only button stays square.",
    },
    {
      name: 'href',
      type: 'string',
      description:
        'When provided, renders the button as a link element (<a> or custom link component). The destination follows the shared navigation rule described on the Link `href` prop.',
    },
    {
      name: 'as',
      type: 'ElementType',
      description:
        'Custom link component to use when href is provided (e.g. Next.js Link).',
    },
    {
      name: 'target',
      type: 'string',
      description: 'HTML target attribute when rendered as a link (e.g. "_blank").',
    },
    {
      name: 'rel',
      type: 'string',
      description: 'HTML rel attribute when rendered as a link (e.g. "noopener noreferrer").',
    },
  ],

  usage: {
    description: 'A button that shows only an icon with no visible text. Use IconButton in toolbars, table rows, and compact UI where space is tight and the icon is universally understood.',
    accessibility: [
      {
        name: 'Essential icon or spinner arc',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Rest', 'Hover', 'Pointer down', 'Loading'],
        description:
          'IconButton has no visible label. Its icon must have at least 3:1 contrast with the button background in Rest, Hover, and Pointer down. The moving spinner arc must also meet 3:1 while loading.',
      },
      {
        name: 'Visible control boundary',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 if needed',
        states: ['Rest'],
        description:
          'The button edge needs 3:1 contrast only when users need it to see the control.',
      },
      {
        name: 'Keyboard focus indicator',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Focus visible'],
        description:
          'The focus outline must have at least 3:1 contrast with the area around the button. Check the red outline on destructive buttons too.',
      },
      {
        name: 'Disabled appearance',
        category: 'Color contrast',
        criterion: '1.4.3 and 1.4.11 exceptions',
        requirement: 'Not required',
        states: ['Disabled'],
        description:
          'Disabled controls do not need to meet these contrast ratios.',
      },
    ],
    bestPractices: [
      { guidance: true, description: 'Make the aria-label specific: a trash icon labeled "Delete conversation" is clearer than just "Delete" for screen readers.' },
      { guidance: true, description: 'Add a tooltip: even a gear icon can mean Settings, Preferences, or Configure.' },
      { guidance: true, description: 'Use ghost in toolbars and dense areas to reduce visual clutter.' },
      { guidance: false, description: 'Use IconButton if the action isn\'t obvious from the icon alone; use Button with text.' },
      { guidance: false, description: 'Skip the tooltip; label only reaches screen readers, sighted users need the hover hint.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'زر يعرض أيقونة فقط دون نص مرئي، لأشرطة الأدوات وصفوف الجداول والواجهات المدمجة حيث المساحة محدودة والأيقونة مفهومة للجميع.',
  propDescriptions: {
    label: 'تسمية قابلة للوصول. تُستخدم كقيمة aria-label (ولا تُعرض كنص مرئي).',
    icon: 'عنصر الأيقونة المعروض داخل الزر. أيقونة Solo Icon دون حجم صريح تأخذ افتراضيًا sm للأزرار sm/md و md للأزرار lg.',
    variant: 'نمط التنسيق المرئي.',
    size: 'نمط الحجم.',
    elevation: 'عمق الظل في وضع السكون. الشكل الأكثر شيوعًا لزر الإجراء العائم (FAB) هو زر بأيقونة فقط، لذا ارفعه باستخدام `low`/`med`/`high` لزر إجراء عائم. القيمة `none` هي الزر المسطح الافتراضي.',
    isLoading: 'يعرض مؤشر تحميل ويعطّل التفاعل.',
    isDisabled: 'يعطّل الزر.',
    tooltip: 'نص التلميح المعروض عند التمرير.',
    onClick: 'معالج النقر القياسي.',
    clickAction: 'معالج نقر غير متزامن مع حالة تحميل تلقائية.',
    type: 'سمة type الخاصة بزر HTML.',
    name: 'سمة name في HTML لإرسال النماذج.',
    value: 'سمة value في HTML لإرسال النماذج.',
    form: 'يربط الزر بعنصر نموذج عبر المعرّف.',
    isInterruptible: 'يُبقي الزر قابلًا للنقر أثناء انتظار clickAction: يظل مؤشر التحميل و aria-busy ظاهرين، لكن الزر لا يُعطَّل ولا يُزال تكرار الإجراء، فتصل النقرة الجديدة وتقاطع الإجراء الجاري بإجراء جديد.',
    width: 'عرض الزر. تُعامَل الأرقام كبكسلات، وتُستخدم السلاسل النصية كما هي (مثل \'100%\' لزر بعرض كامل). افتراضيًا يبقى الزر ذو الأيقونة فقط مربعًا.',
    href: 'عند توفيره، يُعرض الزر كعنصر رابط (<a> أو مكوّن رابط مخصص). تتبع الوجهة قاعدة التنقّل المشتركة الموضحة في الخاصية `href` للمكوّن Link.',
    as: 'مكوّن رابط مخصص يُستخدم عند توفير href (مثل Next.js Link).',
    target: 'سمة target في HTML عند العرض كرابط (مثل "_blank").',
    rel: 'سمة rel في HTML عند العرض كرابط (مثل "noopener noreferrer").',
  },
  usage: {
    description: 'زر يعرض أيقونة فقط دون نص مرئي. استخدم IconButton في أشرطة الأدوات وصفوف الجداول والواجهات المدمجة حيث المساحة محدودة والأيقونة مفهومة للجميع.',
    bestPractices: [
      {
        guidance: true,
        description: 'اجعل aria-label محددًا: أيقونة سلة المهملات بتسمية "Delete conversation" أوضح لقارئ الشاشة من "Delete" وحدها.',
      },
      {
        guidance: true,
        description: 'أضف تلميحًا: فحتى أيقونة الترس قد تعني الإعدادات أو التفضيلات أو التهيئة.',
      },
      {
        guidance: true,
        description: 'استخدم ghost في أشرطة الأدوات والمناطق الكثيفة لتقليل الازدحام البصري.',
      },
      {
        guidance: false,
        description: 'استخدام IconButton إذا لم يكن الإجراء واضحًا من الأيقونة وحدها؛ استخدم Button مع نص.',
      },
      {
        guidance: false,
        description: 'إغفال التلميح؛ فالتسمية لا تصل إلا إلى قارئ الشاشة، والمستخدمون المبصرون يحتاجون إلى تلميح التمرير.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Button showing only an icon, no visible text. Use in toolbars, table rows, compact UI where space is tight + icon universally understood.',
  usage: {
    description: 'Button showing only an icon, no visible text. Use in toolbars, table rows, compact UI where space is tight + icon universally understood.',
    bestPractices: [
      { guidance: true, description: 'Make aria-label specific: trash icon labeled "Delete conversation" > just "Delete" for screen readers.' },
      { guidance: true, description: 'Add tooltip: even gear icon can mean Settings/Preferences/Configure.' },
      { guidance: true, description: 'Use ghost in toolbars + dense areas to reduce visual clutter.' },
      { guidance: false, description: "Use IconButton if action isn't obvious from icon alone; use Button w/ text instead." },
      { guidance: false, description: 'Skip tooltip: label only reaches screen readers; sighted users need hover hint.' },
    ],
  },
  propDescriptions: {
    label: 'accessible label; used as aria-label, not rendered as visible text',
    icon: 'icon element rendered inside button; unsized Solo Icon defaults to sm for sm/md buttons and md for lg',
    variant: 'visual style variant',
    size: 'size variant',
    elevation: 'resting shadow depth: none|low|med|high; raise for a floating action button (FAB)',
    isLoading: 'shows loading spinner + disables interaction',
    isDisabled: 'disables button',
    tooltip: 'tooltip text shown on hover',
    onClick: 'standard click handler',
    clickAction: 'async click handler w/ automatic loading state',
    type: 'HTML button type; defaults to "button"',
    name: 'HTML name for form submission',
    value: 'HTML value for form submission',
    form: 'associates button with form element by ID',
    width: "Width of button. Numbers=pixels, strings=as-is (e.g. '100%' for full-width). Default: square.",
    isInterruptible: 'keep clickable while clickAction is pending; a re-click interrupts the in-flight action',
    href: 'renders as a link (<a> or custom link component)',
    as: 'custom link component used with href (e.g. Next.js Link)',
    target: 'HTML target when rendered as a link',
    rel: 'HTML rel when rendered as a link',
  },
};
