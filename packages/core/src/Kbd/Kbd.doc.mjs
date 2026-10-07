/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Shortcut',
    required: true,
    description:
      'Group that presents the complete keyboard shortcut and its accessible name.',
  },
  {
    name: 'Key badge',
    required: true,
    description: 'Painted key badge rendered once for each key in the shortcut.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Kbd',
  displayName: 'Kbd',
  category: 'Content',
  keywords: ["kbd","keyboard","shortcut","hotkey","keybinding","keystroke","keycombo","modifier","accelerator"],
  props: [
    {
      name: 'keys',
      type: 'string',
      description:
        'Keyboard shortcut string. Use "+" to separate keys. Special keys: mod (Cmd on Mac), ctrl, alt, shift, enter, backspace, escape, tab, up, down, left, right, plus. Aliases: esc for escape and return for enter.',
      required: true,
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
        'Inline styles for the root element. Prefer className for styling: its classes merge with the component classes and stay overridable, while inline styles always win and cannot be overridden by className.',
    },
  ],
  theming: {
    targets: [{className: 'solo-kbd'}],
  },
  usage: {
    anatomy,
    description: 'Renders a keyboard shortcut as styled key badges. Use Kbd in tooltips, menus, and help text to show key combinations.',
    bestPractices: [
      { guidance: true, description: 'Place shortcuts near the action they trigger: in a tooltip, menu item, or inline instruction.' },
      { guidance: true, description: 'Use mod instead of ctrl or cmd; it automatically adapts to the user\'s platform.' },
      { guidance: false, description: 'Use Kbd as the only way to discover an action; shortcuts should supplement visible controls, not replace them.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Kbd',
  displayName: 'Kbd',
  props: [
    {
      name: 'keys',
      type: 'string',
      description:
        '键盘快捷键字符串。使用 "+" 分隔各按键。特殊按键：mod（Mac 上为 Cmd）、ctrl、alt、shift、enter、backspace、escape、tab、up、down、left、right、plus。别名：esc 等同于 escape，return 等同于 enter。',
      required: true,
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        '根元素的内联样式。建议优先使用 className 进行样式设置：其类会与组件类合并且可被覆盖，而内联样式始终优先，className 无法覆盖。',
    },
  ],
  theming: {
    targets: [{className: 'solo-kbd'}],
  },
  usage: {
    anatomy,
    description: 'Renders a keyboard shortcut as styled key badges. Use Kbd in tooltips, menus, and help text to show key combinations.',
    bestPractices: [
      { guidance: true, description: 'Place shortcuts near the action they trigger: in a tooltip, menu item, or inline instruction.' },
      { guidance: true, description: 'Use mod instead of ctrl or cmd; it automatically adapts to the user\'s platform.' },
      { guidance: false, description: 'Use Kbd as the only way to discover an action; shortcuts should supplement visible controls, not replace them.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض اختصار لوحة المفاتيح على شكل شارات مفاتيح منسّقة.',
  propDescriptions: {
    keys:
      'سلسلة اختصار لوحة المفاتيح. استخدم "+" للفصل بين المفاتيح. المفاتيح الخاصة: mod ‏(Cmd على Mac)، وctrl، وalt، وshift، وenter، وbackspace، وescape، وtab، وup، وdown، وleft، وright، وplus. الأسماء البديلة: esc بدلًا من escape، وreturn بدلًا من enter.',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
    style:
      'أنماط مضمّنة للعنصر الجذر. فضّل className للتنسيق: إذ تُدمج فئاته مع فئات المكوّن وتظل قابلة للتجاوز، بينما تتغلب الأنماط المضمّنة دائمًا ولا يمكن لـ className تجاوزها.',
  },
  usage: {
    description: 'يعرض اختصار لوحة المفاتيح على شكل شارات مفاتيح منسّقة. استخدم Kbd في التلميحات والقوائم والنصوص الإرشادية لإظهار تركيبات المفاتيح.',
    bestPractices: [
      {guidance: true, description: 'ضع الاختصارات بالقرب من الإجراء الذي تُفعّله: في تلميح، أو عنصر قائمة، أو تعليمات مضمّنة.'},
      {guidance: true, description: 'استخدم mod بدلًا من ctrl أو cmd؛ إذ يتكيف تلقائيًا مع منصة المستخدم.'},
      {guidance: false, description: 'لا تجعل Kbd الطريقة الوحيدة لاكتشاف إجراء ما؛ يجب أن تكمّل الاختصارات عناصر التحكم المرئية لا أن تحل محلها.'},
    ],
    anatomy: [
      {name: 'الاختصار', required: true, description: 'مجموعة تعرض اختصار لوحة المفاتيح كاملًا واسمه القابل للوصول.'},
      {name: 'شارة المفتاح', required: true, description: 'شارة مفتاح مرسومة تُعرض مرة واحدة لكل مفتاح في الاختصار.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Renders keyboard shortcut as styled key badges. Use in tooltips, menus + help text to show key combinations.',
  usage: {
    anatomy,
    description: 'Renders a keyboard shortcut as styled key badges. Use Kbd in tooltips, menus, and help text to show key combinations.',
    bestPractices: [
      { guidance: true, description: 'Place shortcuts near the action they trigger: in a tooltip, menu item, or inline instruction.' },
      { guidance: true, description: 'Use mod instead of ctrl or cmd; it automatically adapts to the user\'s platform.' },
      { guidance: false, description: 'Use Kbd as the only way to discover an action; shortcuts should supplement visible controls, not replace them.' },
    ],
  },
  propDescriptions: {
    keys: 'Shortcut string. "+" separates keys. Special: mod (Cmd on Mac), ctrl, alt, shift, enter, backspace, escape, tab, up, down, left, right, plus. Aliases: esc for escape, return for enter.',
    className: 'Tailwind classes for layout customization; merged via cn(), so conflicting utilities override defaults.',
    style: 'Inline styles for root element. Prefer className; inline styles always win and cannot be overridden by className.',
  },
};
