/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'ClickableCard',
  displayName: 'Clickable Card',
  group: 'Card',
  category: 'Container',
  keywords: ['card', 'clickable', 'interactive', 'navigation', 'action', 'link'],
  usage: {
    description: 'An interactive card for navigation or action targets. Nested interactive elements work independently.',
    bestPractices: [
      {guidance: true, description: 'Use for cards that navigate to a detail page or trigger a single action.'},
      {guidance: true, description: 'Nest buttons or links freely inside; they handle their own events.'},
      {guidance: false, description: 'Use for toggling selection; use SelectableCard for that.'},
    ],
    anatomy: [
      {name: 'Container', required: true, description: 'Interactive div with hover/focus/active states.'},
      {name: 'Content', required: true, description: 'Children, which may include nested interactive elements.'},
    ],
  },
  props: [
    {name: 'label', type: 'string', description: 'Accessibility label.', required: true},
    {name: 'onClick', type: '(event: MouseEvent) => void', description: 'Click handler: fires on card surface only.'},
    {name: 'href', type: 'string', description: 'Navigation URL. Plain, new-tab, Cmd/Ctrl-click, and middle-click activation all follow the shared navigation rule described on the Link `href` prop.'},
    {name: 'target', type: 'string', description: 'Link target.', default: "'_self'"},
    {name: 'isDisabled', type: 'boolean', description: 'Disables the card, removes a link destination, and leaves the card out of the tab order.', default: 'false'},
    {name: 'children', type: 'ReactNode', description: 'Card content.'},
    {name: 'padding', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Inner padding.', default: '4'},
    {name: 'variant', type: "'default' | 'transparent' | 'muted' | 'blue' | 'cyan' | 'gray' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'", description: 'Background color variant.', default: "'default'"},
    {name: 'elevation', type: "'none' | 'low' | 'med' | 'high'", description: 'Resting shadow depth. Often raised to signal the whole card is clickable.', default: "'none'"},
    {name: 'width', type: 'SizeValue', description: 'Card width.'},
    {name: 'height', type: 'SizeValue', description: 'Card height.'},
    {name: 'maxWidth', type: 'SizeValue', description: 'Maximum card width.'},
    {name: 'className', type: 'string', description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.'},
  ],
  theming: {
    container: true,
    targets: [{className: 'solo-clickable-card', visualProps: ['variant']}],
  },
  playground: {
    defaults: {
      label: 'View product details',
      href: '#',
      padding: 4,
      children: {
        __element: 'VStack',
        props: {gap: 1},
        children: [
          {__element: 'Heading', props: {level: 3}, children: 'Wireless Headphones'},
          {__element: 'Text', props: {type: 'body'}, children: 'Noise-cancelling over-ear headphones with 30-hour battery life.'},
        ],
      },
    },
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'بطاقة تفاعلية لأهداف التنقّل أو الإجراءات، تعمل العناصر التفاعلية المتداخلة داخلها باستقلالية.',
  propDescriptions: {
    label: 'تسمية إمكانية الوصول.',
    onClick: 'معالج النقر: يُطلق عند النقر على سطح البطاقة فقط.',
    href:
      'عنوان URL للتنقّل. يتبع التفعيل العادي، وفي علامة تبويب جديدة، وبنقرة Cmd/Ctrl، وبالنقرة الوسطى جميعًا قاعدة التنقّل المشتركة الموضّحة في الخاصية `href` للمكوّن Link.',
    target: 'هدف الرابط.',
    isDisabled: 'يعطّل البطاقة، ويزيل وجهة الرابط، ويُخرج البطاقة من ترتيب التنقّل بالمفتاح Tab.',
    children: 'محتوى البطاقة.',
    padding: 'الحشو الداخلي.',
    variant: 'نمط لون الخلفية.',
    elevation: 'عمق الظل في حالة السكون. يُرفع غالبًا للإشارة إلى أن البطاقة كلها قابلة للنقر.',
    width: 'عرض البطاقة.',
    height: 'ارتفاع البطاقة.',
    maxWidth: 'الحد الأقصى لعرض البطاقة.',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description:
      'بطاقة تفاعلية لأهداف التنقّل أو الإجراءات. تعمل العناصر التفاعلية المتداخلة باستقلالية.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدمها للبطاقات التي تنتقل إلى صفحة تفاصيل أو تُطلق إجراءً واحدًا.',
      },
      {
        guidance: true,
        description: 'أدرج الأزرار أو الروابط داخلها بحرية؛ فهي تعالج أحداثها بنفسها.',
      },
      {
        guidance: false,
        description: 'لا تستخدمها لتبديل التحديد؛ استخدم SelectableCard لذلك.',
      },
    ],
    anatomy: [
      {
        name: 'الحاوية',
        required: true,
        description: 'عنصر div تفاعلي بحالات المرور والتركيز والتنشيط.',
      },
      {
        name: 'المحتوى',
        required: true,
        description: 'العناصر الأبناء، وقد تتضمن عناصر تفاعلية متداخلة.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Interactive card for navigation/action targets. Nested interactive elements work independently.',
  usage: {
    description: 'Interactive card for navigation/action targets. Nested interactive elements work independently.',
    bestPractices: [
      {guidance: true, description: 'Use for cards navigating to detail page or triggering single action.'},
      {guidance: true, description: 'Nest buttons/links freely inside; they handle own events.'},
      {guidance: false, description: 'Use for toggling selection; use SelectableCard instead.'},
    ],
  },
  propDescriptions: {
    label: 'accessibility label',
    onClick: 'click handler: fires on card surface only',
    href: 'navigation URL; every activation follows the shared navigation rule (see Link href)',
    target: 'link target',
    isDisabled: 'disables card, removes link destination, and leaves tab order',
    padding: 'inner padding',
    variant: 'background color variant',
    elevation: 'resting shadow depth: none|low|med|high; often raised to signal clickability',
    width: 'card width',
    height: 'card height',
    maxWidth: 'max card width',
  },
};
