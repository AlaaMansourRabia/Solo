/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Tooltip surface',
    required: true,
    description: 'Painted overlay surface that presents the tooltip.',
  },
  {
    name: 'Tooltip text',
    required: true,
    description: 'Tooltip content rendered within the surface.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Tooltip',
  displayName: 'Tooltip',
  group: 'Tooltip',
  category: 'Overlay',
  playground: {
    defaults: {
      content: 'Helpful tooltip text',
      children: {__element: 'Button', props: {label: 'Hover me', variant: 'secondary'}},
    },
  },
  keywords: ["tooltip","hint","infotip","title","hover","flyout","balloon","helpertext"],
  components: [
    {
      name: 'Tooltip',
      displayName: 'Tooltip',
      description:
        'Component wrapper for tooltip display triggered on hover or focus.',      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Trigger element(s) that activate the tooltip.',
        },
        {
          name: 'anchorRef',
          type: 'RefObject<HTMLElement | null>',
          description: 'External anchor ref for sibling mode.',
        },
        {
          name: 'content',
          required: true,
          type: 'ReactNode',
          description: 'Tooltip content, typically short text.',
          slotElements: [{__element: 'Text', props: {type: 'body'}, children: 'Content text'}],
        },
        {
          name: 'placement',
          type: "'above' | 'below' | 'start' | 'end'",
          description: "Position relative to the anchor element. Logical: start/end resolve against the popover\'s own inherited direction (RTL mirrors in pure CSS).",
          default: "'above'",
        },
        {
          name: 'alignment',
          type: "'start' | 'center' | 'end'",
          description: "Alignment along the placement axis. Logical: start/end resolve against the popover\'s own inherited direction (RTL mirrors in pure CSS).",
          default: "'center'",
        },
        {
          name: 'delay',
          type: 'number',
          description: 'Show delay in milliseconds.',
          default: '200',
        },
        {
          name: 'hideDelay',
          type: 'number',
          description: 'Hide delay in milliseconds.',
          default: '0',
        },
        {
          name: 'focusTrigger',
          type: "'auto' | 'always' | 'never'",
          description: 'Controls when focus events trigger the tooltip.',
          default: "'auto'",
        },
        {
          name: 'touchTrigger',
          type: "'auto' | 'tap' | 'none'",
          description:
            'What a tap does where there is no hover. auto opens on tap unless the trigger performs an action of its own (a button, link, or form control), whose tap belongs to the control. tap always opens; use it for an info icon rendered as a button, whose only job is to reveal the tooltip. none never opens on touch.',
          default: "'auto'",
        },
        {
          name: 'isEnabled',
          type: 'boolean',
          description: 'Enables or disables the tooltip triggers.',
          default: 'true',
        },
        {
          name: 'onOpenChange',
          type: '(isOpen: boolean) => void',
          description:
            'Callback fired when tooltip visibility changes. Called with true when shown and false when hidden.',
        },
        {
          name: 'hasHoverIndication',
          type: "'auto' | boolean",
          description: 'Shows a dashed underline on the trigger element.',
          default: "'auto'",
        },
        {
          name: 'isDefaultOpen',
          type: 'boolean',
          description: 'Whether the tooltip should be shown on mount. Still dismissible.',
        },
        {
          name: 'isOpen',
          type: 'boolean',
          description: 'Controlled open state for the tooltip.',
        },
      ],
    },
  ],
  theming: {
    targets: [
      {className: 'solo-tooltip'},
    ],
  },
  usage: {
    anatomy,
    description:
      'A short text hint that appears on hover or focus, anchored to a trigger element. Use it to describe icon-only buttons, show the full text of truncated labels, or provide supplementary context without cluttering the UI.',
    bestPractices: [
      {guidance: true, description: 'Keep tooltip content concise: aim for under 140 characters of plain text.'},
      {guidance: true, description: 'Add a tooltip to icon-only buttons and controls that lack a visible label.'},
      {guidance: true, description: 'Set touchTrigger to tap when the trigger is a button whose only job is revealing the tooltip, such as an info icon: touch has no hover, and auto keeps the tap for triggers that perform an action.'},
      {guidance: false, description: 'Place interactive elements like links or buttons inside a tooltip; use HoverCard or Popover instead.'},
      {guidance: false, description: 'Use tooltips for essential information that users must see to complete a task.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Tooltip',
  displayName: 'Tooltip',
  components: [
    {
      name: 'Tooltip',
      displayName: 'Tooltip',
      description:
        '工具提示显示的组件包装器，通过悬停或聚焦触发。',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: '激活工具提示的触发元素。',
        },
        {
          name: 'anchorRef',
          type: 'RefObject<HTMLElement | null>',
          description: '兄弟模式的外部锚点引用。',
        },
        {
          name: 'content',
          required: true,
          type: 'ReactNode',
          description: '工具提示内容，通常是简短文本。',
        },
        {
          name: 'placement',
          type: "'above' | 'below' | 'start' | 'end'",
          description: '相对于锚点元素的位置。逻辑值：start/end 根据弹出层自身继承的方向解析（RTL 镜像）。',
          default: "'above'",
        },
        {
          name: 'alignment',
          type: "'start' | 'center' | 'end'",
          description: '沿放置轴的对齐方式。逻辑值：start/end 根据弹出层自身继承的方向解析（RTL 镜像）。',
          default: "'center'",
        },
        {
          name: 'delay',
          type: 'number',
          description: '显示延迟（毫秒）。',
          default: '200',
        },
        {
          name: 'hideDelay',
          type: 'number',
          description: '隐藏延迟（毫秒）。',
          default: '0',
        },
        {
          name: 'focusTrigger',
          type: "'auto' | 'always' | 'never'",
          description: '控制聚焦事件何时触发工具提示。',
          default: "'auto'",
        },
        {
          name: 'touchTrigger',
          type: "'auto' | 'tap' | 'none'",
          description:
            '在没有悬停的触摸设备上，轻点的行为。auto：轻点即打开，除非触发元素本身会执行操作（按钮、链接、表单控件），此时轻点归该控件所有。tap：始终轻点打开——适用于以按钮形式呈现、唯一作用就是显示工具提示的信息图标。none：触摸永不打开。',
          default: "'auto'",
        },
        {
          name: 'isEnabled',
          type: 'boolean',
          description: '启用或禁用工具提示触发器。',
          default: 'true',
        },
        {
          name: 'onOpenChange',
          type: '(isOpen: boolean) => void',
          description:
            '工具提示可见性变化时触发的回调。显示时传入 true，隐藏时传入 false。',
        },
        {
          name: 'hasHoverIndication',
          type: "'auto' | boolean",
          description: '在触发元素上显示虚线下划线。',
          default: "'auto'",
        },
        {
          name: 'isDefaultOpen',
          type: 'boolean',
          description: '是否在挂载时显示工具提示。仍然可以关闭。',
        },
        {
          name: 'isOpen',
          type: 'boolean',
          description: '提示的受控打开状态。',
        },
      ],
    },
  ],
  theming: {
    targets: [
      {className: 'solo-tooltip'},
    ],
  },
  usage: {
    anatomy,
    description:
      'A short text hint that appears on hover or focus, anchored to a trigger element. Use it to describe icon-only buttons, show the full text of truncated labels, or provide supplementary context without cluttering the UI.',
    bestPractices: [
      {guidance: true, description: 'Keep tooltip content concise: aim for under 140 characters of plain text.'},
      {guidance: true, description: 'Add a tooltip to icon-only buttons and controls that lack a visible label.'},
      {guidance: true, description: 'Set touchTrigger to tap when the trigger is a button whose only job is revealing the tooltip, such as an info icon: touch has no hover, and auto keeps the tap for triggers that perform an action.'},
      {guidance: false, description: 'Place interactive elements like links or buttons inside a tooltip; use HoverCard or Popover instead.'},
      {guidance: false, description: 'Use tooltips for essential information that users must see to complete a task.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'تلميح نصي قصير يظهر عند التمرير أو التركيز، مثبّت بعنصر مشغِّل، لوصف الأزرار ذات الأيقونة فقط أو إظهار النص الكامل للتسميات المقتطعة أو توفير سياق إضافي.',
  usage: {
    description: 'تلميح نصي قصير يظهر عند التمرير أو التركيز، مثبّت بعنصر مشغِّل. استخدمه لوصف الأزرار ذات الأيقونة فقط، أو إظهار النص الكامل للتسميات المقتطعة، أو توفير سياق إضافي دون ازدحام الواجهة.',
    bestPractices: [
      {
        guidance: true,
        description: 'اجعل محتوى التلميح موجزًا: استهدف أقل من 140 حرفًا من النص العادي.',
      },
      {
        guidance: true,
        description: 'أضف تلميحًا إلى الأزرار ذات الأيقونة فقط وعناصر التحكم التي تفتقر إلى تسمية مرئية.',
      },
      {
        guidance: true,
        description: 'عيّن touchTrigger إلى tap عندما يكون المشغِّل زرًا مهمته الوحيدة إظهار التلميح، كأيقونة المعلومات: فاللمس لا يدعم التمرير، وتحتفظ auto بالنقر للمشغِّلات التي تنفّذ إجراءً.',
      },
      {
        guidance: false,
        description: 'وضع عناصر تفاعلية مثل الروابط أو الأزرار داخل التلميح؛ استخدم HoverCard أو Popover بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'استخدام التلميحات لمعلومات أساسية يجب أن يراها المستخدمون لإكمال مهمة.',
      },
    ],
    anatomy: [
      {
        name: 'سطح التلميح',
        required: true,
        description: 'سطح طبقة متراكبة مرسوم يعرض التلميح.',
      },
      {
        name: 'نص التلميح',
        required: true,
        description: 'محتوى التلميح المعروض داخل السطح.',
      },
    ],
  },
  components: [
    {
      name: 'Tooltip',
      displayName: 'تلميح',
      description: 'مكوّن غلاف لعرض التلميح يُشغَّل عند التمرير أو التركيز.',
      propDescriptions: {
        children: 'العنصر (أو العناصر) المشغِّل الذي يفعّل التلميح.',
        anchorRef: 'مرجع مرساة خارجي لوضع العنصر الشقيق.',
        content: 'محتوى التلميح، وهو عادةً نص قصير.',
        placement: 'الموضع بالنسبة إلى عنصر المرساة. منطقي: تُحسب start/end وفق الاتجاه الموروث للنافذة المنبثقة نفسها (ينعكس في RTL باستخدام CSS فقط).',
        alignment: 'المحاذاة على محور الموضع. منطقي: تُحسب start/end وفق الاتجاه الموروث للنافذة المنبثقة نفسها (ينعكس في RTL باستخدام CSS فقط).',
        delay: 'تأخير الإظهار بالملّي ثانية.',
        hideDelay: 'تأخير الإخفاء بالملّي ثانية.',
        focusTrigger: 'يتحكم في متى تُشغّل أحداث التركيز التلميح.',
        touchTrigger: 'ما يفعله النقر حيث لا يوجد تمرير. تفتح auto عند النقر ما لم ينفّذ المشغِّل إجراءً خاصًا به (زر أو رابط أو عنصر تحكم في نموذج)، فيكون النقر حينها لعنصر التحكم. وتفتح tap دائمًا؛ استخدمها لأيقونة معلومات معروضة كزر مهمته الوحيدة إظهار التلميح. ولا تفتح none أبدًا عند اللمس.',
        isEnabled: 'يفعّل مشغِّلات التلميح أو يعطّلها.',
        onOpenChange: 'دالة استدعاء تُنفَّذ عند تغيّر ظهور التلميح. تُستدعى بالقيمة true عند الإظهار و false عند الإخفاء.',
        hasHoverIndication: 'يعرض خطًا سفليًا متقطعًا على العنصر المشغِّل.',
        isDefaultOpen: 'ما إذا كان ينبغي إظهار التلميح عند التركيب. يظل قابلًا للإغلاق.',
        isOpen: 'حالة الفتح المتحكَّم بها للتلميح.',
      },
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Hover/focus triggered tooltip for displaying short, non-interactive text anchored to trigger element.',
  usage: {
    anatomy,
    description:
      'A short text hint that appears on hover or focus, anchored to a trigger element. Use it to describe icon-only buttons, show the full text of truncated labels, or provide supplementary context without cluttering the UI.',
    bestPractices: [
      {guidance: true, description: 'Keep tooltip content concise: aim for under 140 characters of plain text.'},
      {guidance: true, description: 'Add a tooltip to icon-only buttons and controls that lack a visible label.'},
      {guidance: true, description: 'Set touchTrigger to tap when the trigger is a button whose only job is revealing the tooltip, such as an info icon: touch has no hover, and auto keeps the tap for triggers that perform an action.'},
      {guidance: false, description: 'Place interactive elements like links or buttons inside a tooltip; use HoverCard or Popover instead.'},
      {guidance: false, description: 'Use tooltips for essential information that users must see to complete a task.'},
    ],
  },
  components: [
    {
      name: 'Tooltip',
      displayName: 'Tooltip',
      description: 'Component wrapper for tooltip display on hover/focus.',
      propDescriptions: {
        children: 'Trigger element(s) that activate tooltip.',
        anchorRef: 'External anchor ref for sibling mode.',
        content: 'Tooltip content, typically short text.',
        placement: 'Position relative to anchor. Logical: start/end follow the popover\'s inherited direction (RTL mirrors).',
        alignment: 'Alignment along placement axis. Logical: start/end follow the popover\'s inherited direction (RTL mirrors).',
        delay: 'Show delay in ms.',
        hideDelay: 'Hide delay in ms.',
        focusTrigger: 'Controls when focus events trigger tooltip.',
        touchTrigger: 'Tap behavior where there is no hover. auto = tap opens unless the trigger acts (button/link/control); tap = always opens (info icon rendered as a button); none = never on touch.',
        isEnabled: 'Enables/disables tooltip triggers.',
        onOpenChange: 'Callback when visibility changes; true=shown, false=hidden.',
        hasHoverIndication: 'Dashed underline on trigger element.',
        isDefaultOpen: 'Show tooltip on mount. Still dismissible.',
      },
    },
  ],
};
