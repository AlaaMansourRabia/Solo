/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useInteractiveRole',
  displayName: 'useInteractiveRole',
  keywords: [
    'role',
    'polymorphic',
    'link',
    'button',
    'inert',
    'href',
    'onClick',
    'element type',
    'as',
    'trigger',
    'semantics',
    'accessibility',
    'a11y',
  ],
  params: [
    {
      name: 'options',
      type: 'UseInteractiveRoleOptions',
      description: 'The interactivity inputs the component received.',
      required: true,
    },
    {
      name: 'options.href',
      type: 'string',
      description:
        'URL for navigation. Highest priority: with an href the component is a link.',
    },
    {
      name: 'options.onClick',
      type: '((...args: never[]) => unknown) | null',
      description:
        'Click handler. Resolves to a button, ahead of any context-provided role.',
    },
    {
      name: 'options.isDisabled',
      type: 'boolean',
      description:
        'When true, href is ignored for role resolution (a disabled link is an anti-pattern), so the role comes from onClick, then context, then inert.',
      default: 'false',
    },
  ],
  returns: [
    {
      name: 'role',
      type: "'link' | 'button' | 'inert'",
      description:
        'The element the component should render: an anchor, a button, or a non-interactive span/div.',
    },
  ],
  usage: {
    description:
      'Resolves what a polymorphic component should render as, in one place: href wins, then onClick, then an interactive trigger context supplied by a parent (Popover, DropdownMenu and friends), then inert. Use it in any component that is sometimes a link, sometimes a button, and sometimes plain content; Token, Thumbnail, Item and ClickableCard all do. Because context is part of the resolution, a component built on it becomes a valid trigger for new surfaces without changing.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Switch on the returned role to pick the element, and render an anchor only for "link" so keyboard and middle-click behavior come from the platform.',
      },
      {
        guidance: true,
        description:
          'Pass isDisabled through rather than dropping the href yourself; the hook already keeps disabled links out of the tab order.',
      },
      {
        guidance: false,
        description:
          'Add another ad-hoc href/onClick precedence check in a component; new trigger contexts are added here so every consumer inherits them.',
      },
    ],
  },
  relatedComponents: ['Token', 'Thumbnail', 'Item', 'ClickableCard'],
  relatedHooks: ['useClickableContainer'],
  importPath: '@solo/core/hooks',
  category: 'interaction',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يحدد في مكان واحد ما ينبغي أن يُعرض كمكوّن متعدد الأشكال: رابط أو زر أو محتوى خامل.',
  paramDescriptions: {
    options: 'مدخلات التفاعل التي تلقاها المكوّن.',
    'options.href': 'رابط URL للتنقّل. الأولوية القصوى: مع href يكون المكوّن رابطًا.',
    'options.onClick': 'معالج النقر. يُحدَّد كزر، متقدّمًا على أي دور يوفّره السياق.',
    'options.isDisabled': 'عند true يُتجاهل href في تحديد الدور (فالرابط المعطَّل نمط مضاد)، لذا يأتي الدور من onClick، ثم السياق، ثم الحالة الخاملة.',
  },
  returnDescriptions: {
    role: 'العنصر الذي ينبغي أن يعرضه المكوّن: رابط، أو زر، أو span/div غير تفاعلي.',
  },
  usage: {
    description: 'يحدد في مكان واحد ما ينبغي أن يُعرض كمكوّن متعدد الأشكال: يغلب href، ثم onClick، ثم سياق مُشغِّل تفاعلي يوفّره عنصر أب (Popover وDropdownMenu وما شابههما)، ثم الحالة الخاملة. استخدمه في أي مكوّن يكون أحيانًا رابطًا وأحيانًا زرًا وأحيانًا محتوى عاديًا؛ كما تفعل Token وThumbnail وItem وClickableCard. ولأن السياق جزء من التحديد، يصبح المكوّن المبني عليه مُشغِّلًا صالحًا لأسطح جديدة دون تغيير.',
    bestPractices: [
      {guidance: true, description: 'بدّل وفق الدور المُرجَع لاختيار العنصر، ولا تعرض رابطًا إلا للقيمة "link" كي يأتي سلوك لوحة المفاتيح والنقر بالزر الأوسط من المنصة.'},
      {guidance: true, description: 'مرّر isDisabled بدلًا من إسقاط href بنفسك؛ فالخطّاف يُبقي الروابط المعطَّلة خارج ترتيب Tab بالفعل.'},
      {guidance: false, description: 'إضافة فحص أولوية مخصّص آخر لـ href/onClick في مكوّن ما؛ إذ تُضاف سياقات المُشغِّل الجديدة هنا كي يرثها كل مستهلك.'},
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Resolves what a polymorphic component renders as: href -> link, onClick -> button, interactive trigger context -> its role, else inert. Single place the precedence lives.',
  paramDescriptions: {
    options: 'interactivity inputs the component received.',
    'options.href': 'navigation URL; highest priority.',
    'options.onClick': 'click handler; button, ahead of context role.',
    'options.isDisabled':
      'true = href ignored for resolution (disabled link is anti-pattern); falls to onClick / context / inert.',
  },
  returnDescriptions: {
    role: "element to render: 'link' (anchor), 'button', or 'inert' (span/div).",
  },
  usage: {
    description:
      'For components that are sometimes link, sometimes button, sometimes plain content (Token, Thumbnail, Item, ClickableCard). Context-aware, so consumers become valid triggers for new surfaces w/o changing.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Switch on returned role; render a real anchor for "link" so platform keyboard / middle-click behavior applies.',
      },
      {
        guidance: true,
        description:
          'Pass isDisabled through instead of dropping href yourself.',
      },
      {
        guidance: false,
        description:
          'Re-implement href/onClick precedence per component; new trigger contexts are added here.',
      },
    ],
  },
};
