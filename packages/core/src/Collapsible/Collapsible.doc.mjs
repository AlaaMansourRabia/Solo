/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Collapsible',
  displayName: 'Collapsible',
  group: 'Collapsible',
  category: 'Container',
  keywords: ["accordion","collapse","expandable","disclosure","toggle","panel","foldable","expander","expand"],
  playground: {
    defaults: {
      trigger: 'Click to expand',
      children: {__element: 'Text', props: {type: 'body'}, children: 'This content is revealed when the collapsible is expanded. It can contain any components.'},
    },
  },
  theming: {
    targets: [
      {
        className: 'solo-collapsible',
        visualProps: ['density'],
        states: ['divided'],
      },
      {
        className: 'solo-collapsible-trigger',
        visualProps: ['density', 'chevronPosition'],
        states: ['open', 'disabled'],
      },
      {
        className: 'solo-collapsible-content',
        visualProps: ['density'],
        states: ['open'],
      },
      {className: 'solo-collapsible-group', visualProps: ['density']},
    ],
  },
  description: 'A primitive that makes any content collapsible: a trigger button toggles visibility of the content area, managing its own state or deferring to a parent CollapsibleGroup.',
  props: [
    {
      name: 'trigger',
      type: 'ReactNode',
      description: 'Content shown in the trigger area (always visible).',
      required: true,
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Trigger',
        },
      ],
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content that collapses and expands.',
    },
    {
      name: 'defaultIsOpen',
      type: 'boolean',
      description:
        'Default open state for standalone uncontrolled usage. Ignored when value binds the item to a surrounding CollapsibleGroup.',
      default: 'true',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description:
        'Controlled open state for standalone usage. Ignored when value binds the item to a surrounding CollapsibleGroup.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: "Disable the item so its trigger can't be toggled (dimmed, aria-disabled, and out of the tab order). Doesn't collapse an already-open item.",
      default: 'false',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description:
        'Callback invoked when standalone open state changes. A surrounding CollapsibleGroup owns grouped state and calls its onChange instead.',
    },
    {
      name: 'chevronPosition',
      type: "'start' | 'end'",
      description: 'Logical position of Collapsible\'s disclosure chevron. `end` (default) follows the label, pointing down when collapsed and up when expanded. `start` precedes the label, pointing inward toward content when collapsed (mirrored under RTL) and down when expanded. Inside a CollapsibleGroup this defaults to the group\'s chevronPosition.',
      default: "'end'",
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Identifier used for group coordination. When set inside a CollapsibleGroup, the group owns open state and its onChange is the notification callback.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref forwarded to the root collapsible element.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Inline styles. Prefer className: its classes merge with the component classes and stay overridable, while inline styles always win over className.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  components: [
    {name: 'CollapsibleGroup'},
  ],
  usage: {
    accessibility: [
      {
        name: 'Trigger label',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Rest', 'Pointer down'],
        description:
          'The trigger text must have at least 4.5:1 contrast with the surface behind it. For Pointer down, measure against the pressed overlay the trigger row paints while it is pressed.',
      },
    ],
    description: 'Collapsible hides and reveals content behind a trigger button. Use it in settings panels, FAQ pages, or detail views to keep the page scannable while letting users drill into sections they care about. Wrap multiple collapsibles in CollapsibleGroup for accordion behavior. For custom collapsible components, use the `useCollapsible` hook directly (`solo hook useCollapsible`).',
    bestPractices: [
      { guidance: true, description: 'Give every trigger a meaningful accessible name. Visible text usually supplies it; custom trigger content should include VisuallyHidden text when its visuals do not.' },
      { guidance: true, description: 'Use hasDividers on CollapsibleGroup for FAQ-style lists: built-in row hairlines with themed border tokens, no hand-rolled borders.' },
      { guidance: true, description: 'Wrap each Collapsible in an Card for visual separation in accordion layouts, or use CollapsibleGroup\'s hasDividers for flat lists; don\'t combine both.' },
      { guidance: true, description: 'Use CollapsibleGroup with type="single" for settings or FAQ pages where only one section should be open at a time.' },
      { guidance: true, description: 'Use type="multiple" when users need to compare content across sections, like feature lists or pricing tiers.' },
      { guidance: true, description: 'Start sections open (defaultIsOpen) when the content is likely needed on first view; don\'t make users click to see essential info.' },
      { guidance: false, description: 'Hide critical or required content behind a collapsible; users may not discover it.' },
      { guidance: false, description: 'Nest collapsibles more than two levels deep; it makes content hard to find and navigate.' },
      { guidance: false, description: 'Use a collapsible for a single short paragraph; just show the text directly instead.' },
    ],
    anatomy: [
      { name: 'Container', required: true, description: 'The root that contains one trigger and its controlled content and, in a divided group, paints the item divider.' },
      { name: 'Trigger', required: true, description: 'The always-visible button that toggles the content. Shows a label and a chevron indicator.' },
      { name: 'Chevron', required: false, description: 'Animated disclosure arrow. It follows the label by default; chevronPosition="start" moves it ahead of the label, points inward when collapsed (mirrored under RTL), and turns down when expanded.' },
      { name: 'Content', required: false, description: 'The area that hides or reveals when the trigger is clicked.' },
      { name: 'Group container', required: false, description: 'The CollapsibleGroup wrapper rendered when dividers are enabled. It contains the coordinated items and carries their density.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description: 'Collapsible hides and reveals content behind a trigger button. Use it in settings panels, FAQ pages, or detail views to keep the page scannable while letting users drill into sections they care about. Wrap multiple collapsibles in CollapsibleGroup for accordion behavior.',
    bestPractices: [
      { guidance: true, description: '确保每个触发器都有有意义的无障碍名称。可见文本通常可提供名称；若自定义视觉内容无法提供名称，请加入 VisuallyHidden 文本。' },
      { guidance: true, description: 'Use hasDividers on CollapsibleGroup for FAQ-style lists: built-in row hairlines with themed border tokens, no hand-rolled borders.' },
      { guidance: true, description: 'Wrap each Collapsible in an Card for visual separation in accordion layouts, or use CollapsibleGroup\'s hasDividers for flat lists; don\'t combine both.' },
      { guidance: true, description: 'Use CollapsibleGroup with type="single" for settings or FAQ pages where only one section should be open at a time.' },
      { guidance: true, description: 'Use type="multiple" when users need to compare content across sections, like feature lists or pricing tiers.' },
      { guidance: true, description: 'Start sections open (defaultIsOpen) when the content is likely needed on first view; don\'t make users click to see essential info.' },
      { guidance: false, description: 'Hide critical or required content behind a collapsible; users may not discover it.' },
      { guidance: false, description: 'Nest collapsibles more than two levels deep; it makes content hard to find and navigate.' },
      { guidance: false, description: 'Use a collapsible for a single short paragraph; just show the text directly instead.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'مكوّن أساسي يجعل أي محتوى قابلًا للطي: يبدّل زر مشغّل ظهور منطقة المحتوى، مع إدارة حالته بنفسه أو تفويضها إلى CollapsibleGroup أصل.',
  propDescriptions: {
    trigger: 'المحتوى المعروض في منطقة المشغّل (مرئي دائمًا).',
    children: 'المحتوى الذي يُطوى ويُوسَّع.',
    defaultIsOpen:
      'حالة الفتح الافتراضية للاستخدام المستقل غير المتحكَّم به. تُتجاهل عندما تربط value العنصر بـ CollapsibleGroup محيطة.',
    isOpen:
      'حالة الفتح المتحكَّم بها للاستخدام المستقل. تُتجاهل عندما تربط value العنصر بـ CollapsibleGroup محيطة.',
    isDisabled: 'يعطّل العنصر بحيث لا يمكن تبديل مشغّله (يُعتَّم، ويحمل aria-disabled، ويُستبعد من ترتيب التنقّل بالمفتاح Tab). لا يطوي عنصرًا مفتوحًا بالفعل.',
    onOpenChange:
      'دالة استدعاء تُنفَّذ عند تغيّر حالة الفتح في الاستخدام المستقل. أما CollapsibleGroup المحيطة فتملك الحالة المجمّعة وتستدعي onChange الخاصة بها بدلًا من ذلك.',
    chevronPosition: 'الموضع المنطقي لسهم الإفصاح في Collapsible. القيمة `end` (الافتراضية) تضعه بعد التسمية، متجهًا إلى الأسفل عند الطي وإلى الأعلى عند التوسيع. والقيمة `start` تضعه قبل التسمية، متجهًا إلى الداخل نحو المحتوى عند الطي (ومنعكسًا في وضع RTL) وإلى الأسفل عند التوسيع. داخل CollapsibleGroup تكون قيمته الافتراضية هي chevronPosition الخاصة بالمجموعة.',
    value:
      'معرّف يُستخدم للتنسيق ضمن المجموعة. عند تعيينه داخل CollapsibleGroup، تملك المجموعة حالة الفتح وتكون onChange الخاصة بها دالة استدعاء الإشعار.',
    ref: 'مرجع يُمرَّر إلى عنصر الجذر القابل للطي.',
    className:
      'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتغلب الأداة المتعارضة على القيمة الافتراضية.',
    style:
      'أنماط مضمّنة. فضّل className: إذ تُدمج أصنافها مع أصناف المكوّن وتبقى قابلة للتجاوز، بينما تتغلب الأنماط المضمّنة دائمًا على className.',
    'data-testid': 'محدِّد اختبار لأطر الاختبار الآلي.',
  },
  usage: {
    description: 'يُخفي Collapsible المحتوى ويكشفه خلف زر مشغّل. استخدمه في لوحات الإعدادات أو صفحات الأسئلة الشائعة أو طرق عرض التفاصيل لإبقاء الصفحة سهلة التصفح مع السماح للمستخدمين بالتعمق في الأقسام التي تهمهم. غلّف عدة عناصر قابلة للطي داخل CollapsibleGroup للحصول على سلوك الأكورديون. للمكوّنات المخصّصة القابلة للطي، استخدم الخطّاف (hook) `useCollapsible` مباشرةً (`solo hook useCollapsible`).',
    bestPractices: [
      { guidance: true, description: 'امنح كل مشغّل اسمًا قابلًا للوصول ذا معنى. عادةً ما يوفّره النص المرئي؛ أما محتوى المشغّل المخصّص فينبغي أن يتضمن نص VisuallyHidden عندما لا توفّره عناصره المرئية.' },
      { guidance: true, description: 'استخدم hasDividers على CollapsibleGroup لقوائم الأسئلة الشائعة: خطوط فاصلة رفيعة مدمجة بين الصفوف تستخدم رموز تصميم الحدود ذات السمة، دون حدود مصنوعة يدويًا.' },
      { guidance: true, description: 'غلّف كل Collapsible داخل Card للفصل البصري في تخطيطات الأكورديون، أو استخدم hasDividers الخاصة بـ CollapsibleGroup للقوائم المسطّحة؛ ولا تجمع بين الأسلوبين.' },
      { guidance: true, description: 'استخدم CollapsibleGroup مع type="single" في صفحات الإعدادات أو الأسئلة الشائعة حيث ينبغي ألا يُفتح سوى قسم واحد في كل مرة.' },
      { guidance: true, description: 'استخدم type="multiple" عندما يحتاج المستخدمون إلى مقارنة المحتوى عبر الأقسام، مثل قوائم الميزات أو فئات التسعير.' },
      { guidance: true, description: 'اجعل الأقسام مفتوحة في البداية (defaultIsOpen) عندما يُرجَّح أن يكون المحتوى مطلوبًا عند العرض الأول؛ ولا تجبر المستخدمين على النقر لرؤية المعلومات الأساسية.' },
      { guidance: false, description: 'لا تُخفِ المحتوى الحرج أو المطلوب خلف عنصر قابل للطي؛ فقد لا يكتشفه المستخدمون.' },
      { guidance: false, description: 'لا تُدخل العناصر القابلة للطي بعضها في بعض لأكثر من مستويين؛ فذلك يجعل المحتوى صعب الإيجاد والتنقّل.' },
      { guidance: false, description: 'لا تستخدم عنصرًا قابلًا للطي لفقرة قصيرة واحدة؛ بل اعرض النص مباشرةً بدلًا من ذلك.' },
    ],
    anatomy: [
      { name: 'الحاوية', required: true, description: 'الجذر الذي يحتوي على مشغّل واحد والمحتوى الذي يتحكم فيه، ويرسم فاصل العنصر عندما يكون ضمن مجموعة مقسّمة.' },
      { name: 'المشغّل', required: true, description: 'الزر المرئي دائمًا الذي يبدّل المحتوى. يعرض تسمية ومؤشر سهم.' },
      { name: 'السهم', required: false, description: 'سهم إفصاح متحرك. يأتي بعد التسمية افتراضيًا؛ وتنقله القيمة chevronPosition="start" إلى ما قبل التسمية، فيتجه إلى الداخل عند الطي (ومنعكسًا في وضع RTL) وإلى الأسفل عند التوسيع.' },
      { name: 'المحتوى', required: false, description: 'المنطقة التي تختفي أو تظهر عند النقر على المشغّل.' },
      { name: 'حاوية المجموعة', required: false, description: 'غلاف CollapsibleGroup الذي يُعرض عند تفعيل الفواصل. يحتوي على العناصر المنسّقة ويحمل كثافتها.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'hide/reveal content behind a trigger; group for accordion behavior',
  usage: {
    description: 'Collapsible hides and reveals content behind a trigger button. Use in settings, FAQs, or detail views. Wrap in CollapsibleGroup for accordion behavior.',
    bestPractices: [
      { guidance: true, description: 'Give every trigger a meaningful accessible name; add VisuallyHidden text when custom visuals do not.' },
      { guidance: true, description: 'Use hasDividers on CollapsibleGroup for FAQ-style lists: built-in row hairlines, no hand-rolled borders.' },
      { guidance: true, description: 'Wrap each Collapsible in an Card for visual separation, or use CollapsibleGroup\'s hasDividers for flat lists; not both.' },
      { guidance: true, description: 'Use CollapsibleGroup with type="single" for settings or FAQ pages where only one section should be open at a time.' },
      { guidance: true, description: 'Use type="multiple" when users need to compare across sections.' },
      { guidance: true, description: 'Start sections open (defaultIsOpen) when content is needed on first view.' },
      { guidance: false, description: 'Hide critical content behind a collapsible; users may not discover it.' },
      { guidance: false, description: 'Nest collapsibles more than two levels deep; makes content hard to find and navigate.' },
      { guidance: false, description: 'Use a collapsible for a single short paragraph; just show the text directly instead.' },
    ],
  },
};
