/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'SelectableCard',
  displayName: 'Selectable Card',
  group: 'Card',
  category: 'Container',
  keywords: ['card', 'selectable', 'toggle', 'checkbox', 'radio', 'selection'],
  usage: {
    description: 'A card that toggles between selected and unselected states with an accent border. For navigation use ClickableCard.',
    bestPractices: [
      {guidance: true, description: 'Use for plan pickers, filter chips, or option grids.'},
      {guidance: true, description: 'For single-select track one ID; for multi-select use a Set.'},
      {guidance: true, description: 'When focused, toggle selection with Space or Enter.'},
      {guidance: false, description: 'Use for navigation; use ClickableCard for that.'},
    ],
    anatomy: [
      {name: 'Container', required: true, description: 'Interactive div with accent border on selection.'},
      {name: 'Content', required: true, description: 'Children rendered inside the card.'},
    ],
  },
  props: [
    {name: 'label', type: 'string', description: 'Accessibility label.', required: true},
    {name: 'isSelected', type: 'boolean', description: 'Controlled selection state.', required: true},
    {name: 'onChange', type: '(isSelected: boolean) => void', description: 'Called when toggled.', required: true},
    {name: 'isDisabled', type: 'boolean', description: 'Disables the card.', default: 'false'},
    {name: 'children', type: 'ReactNode', description: 'Card content.'},
    {name: 'padding', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Inner padding.', default: '4'},
    {name: 'variant', type: "'default' | 'transparent' | 'muted' | 'blue' | 'cyan' | 'gray' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'", description: 'Background color variant.', default: "'default'"},
    {name: 'elevation', type: "'none' | 'low' | 'med' | 'high'", description: 'Resting shadow depth. The selection ring composes on top, so a selected card keeps its shadow.', default: "'none'"},
    {name: 'width', type: 'SizeValue', description: 'Card width.'},
    {name: 'height', type: 'SizeValue', description: 'Card height.'},
    {name: 'maxWidth', type: 'SizeValue', description: 'Maximum card width.'},
    {name: 'className', type: 'string', description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.'},
  ],
  theming: {
    container: true,
    targets: [{className: 'solo-selectable-card', visualProps: ['selected', 'variant']}],
    vars: [
      {name: '--selectable-card-ring-color', description: 'Colour of the selection ring drawn for a variant a theme added. The built-in variants each ring in their own border token and ignore this; a theme that adds a variant sets it in the same rule as that variant\'s `backgroundColor`, because no token the component could pick is guaranteed to contrast with a fill it cannot know.', default: 'var(--color-accent)'},
    ],
  },
  playground: {
    defaults: {
      label: 'Pro plan',
      isSelected: true,
      padding: 4,
      children: {
        __element: 'VStack',
        props: {gap: 1},
        children: [
          {__element: 'Heading', props: {level: 3}, children: 'Pro plan'},
          {__element: 'Text', props: {type: 'body'}, children: '$29/month, unlimited projects and priority support.'},
        ],
      },
    },
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'بطاقة تتبدّل بين حالتي التحديد وعدم التحديد مع حدّ بلون التمييز.',
  propDescriptions: {
    label: 'تسمية إمكانية الوصول.',
    isSelected: 'حالة التحديد المتحكَّم بها.',
    onChange: 'يُستدعى عند التبديل.',
    isDisabled: 'يعطّل البطاقة.',
    children: 'محتوى البطاقة.',
    padding: 'الحشوة الداخلية.',
    variant: 'نمط لون الخلفية.',
    elevation: 'عمق الظل في وضع السكون. تُركَّب حلقة التحديد فوقه، فتحتفظ البطاقة المحددة بظلها.',
    width: 'عرض البطاقة.',
    height: 'ارتفاع البطاقة.',
    maxWidth: 'الحد الأقصى لعرض البطاقة.',
    className: 'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'بطاقة تتبدّل بين حالتي التحديد وعدم التحديد مع حدّ بلون التمييز. للتنقّل استخدم ClickableCard.',
    bestPractices: [
      {guidance: true, description: 'استخدمها لمحددات الخطط، أو رقائق التصفية، أو شبكات الخيارات.'},
      {guidance: true, description: 'للتحديد الفردي تتبّع معرّفًا واحدًا؛ وللتحديد المتعدد استخدم Set.'},
      {guidance: true, description: 'عند التركيز، بدّل التحديد بالمفتاح Space أو Enter.'},
      {guidance: false, description: 'لا تستخدمها للتنقّل؛ استخدم ClickableCard لذلك.'},
    ],
    anatomy: [
      {name: 'الحاوية', required: true, description: 'عنصر div تفاعلي بحدّ بلون التمييز عند التحديد.'},
      {name: 'المحتوى', required: true, description: 'العناصر الأبناء المعروضة داخل البطاقة.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Card toggling between selected/unselected states w/ accent border. For navigation use ClickableCard instead.',
  usage: {
    description: 'Card toggling between selected/unselected states w/ accent border. For navigation use ClickableCard instead.',
    bestPractices: [
      {guidance: true, description: 'Use for plan pickers, filter chips, option grids.'},
      {guidance: true, description: 'For single-select track one ID; for multi-select use a Set.'},
      {guidance: true, description: 'When focused, toggle selection with Space or Enter.'},
      {guidance: false, description: 'Use for navigation; use ClickableCard instead.'},
    ],
  },
  propDescriptions: {
    label: 'accessibility label',
    isSelected: 'controlled selection state',
    onChange: 'called when toggled',
    isDisabled: 'disables card',
    padding: 'inner padding',
    variant: 'background color variant',
    elevation: 'resting shadow depth: none|low|med|high; selection ring composes on top',
    width: 'card width',
    height: 'card height',
    maxWidth: 'max card width',
  },
};
