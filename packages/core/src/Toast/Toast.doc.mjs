/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Toast',
  displayName: 'Toast',
  group: 'Toast',
  category: 'Overlay',
  hiddenComponents: ['ToastViewport'],
  keywords: [
    'toast',
    'notification',
    'snackbar',
    'alert',
    'message',
    'feedback',
    'status',
  ],

  playground: {
    defaults: {body: 'Changes saved'},
  },

  props: [
    {
      name: 'body',
      type: 'ReactNode',
      description: 'Primary message content.',
      required: true,
      slotElements: [
        {__element: 'Text', props: {type: 'body'}, children: 'Toast message'},
      ],
    },
    {
      name: 'type',
      type: "'info' | 'error'",
      description:
        "Toast type controlling background color. Error toasts persist until dismissed. useToast() defaults it to 'info'.",
      required: true,
    },
    {
      name: 'isAutoHide',
      type: 'boolean',
      description:
        'Whether the toast auto-dismisses. useToast() defaults it to true for info and false for error.',
      required: true,
    },
    {
      name: 'autoHideDuration',
      type: 'number',
      description:
        'Duration in ms before auto-dismiss. useToast() defaults it to 5000. Timed content must satisfy WCAG 2.2.1.',
      required: true,
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content rendered at the trailing end (e.g. Undo button, link). Keep action labels short.',
      slotElements: [
        {__element: 'Icon', props: {icon: 'chevronDown', size: 'sm'}},
        {__element: 'Badge', props: {label: '3'}},
      ],
    },
    {
      name: 'isExiting',
      type: 'boolean',
      description:
        'Plays the exit transition and disables swipe gestures. Set by ToastViewport while a toast leaves; leave it unset when rendering Toast directly.',
      default: 'false',
    },
    {
      name: 'onDismiss',
      type: '(reason: "auto" | "manual") => void',
      description: 'Callback fired when the toast is dismissed.',
      required: true,
    },
    {
      name: 'renderContent',
      type: '(toast: ToastContentRenderProps) => ReactNode',
      description:
        "Replaces the content of this toast's card with your own layout. Solo keeps the card, its solo-toast theme target, the live-region role and auto-hide behavior, then hands the renderer the message, endContent, resolved toast settings and a dismiss callback. The custom renderer owns every control in its layout: compose the control you want and call dismiss from it. Solo does not inject a fallback close into custom content. Per-toast: an app shares one layout by wrapping useToast and passing it on every call, while a toast raised by library code that never passes it renders as an ordinary Solo toast. The argument is {body, endContent, type, isAutoHide, autoHideDuration, dismiss}, where type is 'info' | 'error'.",
    },
  ],
  theming: {
    targets: [{className: 'solo-toast', visualProps: ['type']}],
    vars: [
      {
        name: '--_toast-slide-y',
        description:
          'Private block-axis offset inherited from ToastViewport for entry and exit motion',
        default: 'var(--spacing-2)',
        private: true,
      },
      {
        name: '--_toast-swipe-y',
        description: 'Private active swipe offset along the block axis',
        default: '0px',
        private: true,
      },
      {
        name: '--_toast-swipe-exit-y',
        description: 'Private completed-swipe exit offset',
        default: 'var(--_toast-swipe-y)',
        private: true,
      },
      {
        name: '--_toast-swipe-opacity',
        description: 'Private opacity feedback during an accepted swipe',
        default: '1',
        private: true,
      },
      {
        name: '--_toast-swipe-scale',
        description: 'Private scale feedback during an accepted swipe',
        default: '1',
        private: true,
      },
    ],
  },

  usage: {
    description:
      'Toast shows a brief, non-blocking notification to confirm an action or present temporary information. Use it for scenarios where the user needs feedback but not a decision, such as saving, deleting, or changing a status.\n\nFor production use, prefer the `useToast()` hook; it handles positioning, stacking, auto-dismiss, and deduplication via `ToastViewport`. Toasts stay within viewport and safe-area gutters, wrap long message content, and enter, exit, or swipe-dismiss toward their configured top or bottom edge. The vertical swipe uses the same spatial model as placement motion: top Toasts leave upward and bottom Toasts leave downward. Swipe waits for dominant edge-directed intent before cancelling native touch movement and reports the existing manual dismissal reason. Pen is supported as direct-contact input; mouse drag is excluded to avoid conflicting with desktop text selection, where the visible close control remains available. Set `isAutoHide: false` explicitly when an action or message must remain available. The `Toast` component renders the visual toast element inline and is useful for previews, documentation, and static showcases where the viewport lifecycle is not needed. Deduplication and lifecycle options belong to `showToast()` from `useToast()`, not to `Toast`: `uniqueID` (dedupe key), `collisionBehavior` (`overwrite` by default, or `ignore`) for when a toast with the same uniqueID is already shown, and `onHide(reason)`, fired when the toast is removed.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep messages short: only a few words that tell the user what happened, like "Changes saved" or "Message sent".',
      },
      {
        guidance: true,
        description:
          'Add a short undo action in the endContent slot for reversible operations. Set isAutoHide to false when the action must remain available.',
      },
      {
        guidance: true,
        description:
          'Use uniqueID to deduplicate toasts that fire from repeated actions, like clicking a save button multiple times.',
      },
      {
        guidance: true,
        description:
          "Use error type for failures that need attention but not immediate action; it persists until dismissed so the user won't miss it.",
      },
      {
        guidance: false,
        description:
          "Don't use a toast for critical errors that block the user. Use Banner for persistent, in-context messaging that requires acknowledgment.",
      },
      {
        guidance: false,
        description:
          "Don't put long or multi-line content in a toast; it disappears after 5 seconds and the user may not finish reading.",
      },
      {
        guidance: false,
        description:
          "Don't show form validation errors as toasts. Use inline field validation so the user can see exactly which field needs fixing.",
      },
    ],
    anatomy: [
      {
        name: 'Body',
        required: true,
        description:
          'The primary message text describing what happened or what the user should know.',
      },
      {
        name: 'End content',
        required: false,
        description:
          'A trailing action like an Undo button or a link, placed after the body text.',
      },
      {
        name: 'Dismiss button',
        required: true,
        description:
          'A close button that lets the user manually dismiss the toast before auto-hide.',
      },
    ],
  },
};

// -------------------------------------------------------
// Auto-generated translations below. Do not edit manually.
// Regenerate with the dense compression protocol.
// See .context/decisions/dense-compression-protocol.md
// -------------------------------------------------------

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  propDescriptions: {
    body: '主要消息内容。',
    type: "Toast 类型，控制背景颜色。error toast 持续显示直到关闭。useToast() 默认为 'info'。",
    isAutoHide: '是否自动关闭。useToast() 对 info 默认为 true，对 error 默认为 false。',
    autoHideDuration:
      '自动关闭前的持续时间（毫秒）。useToast() 默认为 5000。定时内容必须符合 WCAG 2.2.1。',
    endContent: '尾部渲染的内容（如撤销按钮、链接）。操作标签应保持简短。',
    isExiting: '播放退出过渡并禁用滑动手势。由 ToastViewport 在 toast 离开时设置；直接渲染 Toast 时无需设置。',
    onDismiss: 'toast 被关闭时触发的回调，参数为关闭原因（"auto" 或 "manual"）。',
    renderContent:
      "用你自己的布局替换该 toast 卡片内部的内容。Solo 保留卡片本身、solo-toast 主题目标、实时区域角色和自动关闭行为，并把消息、endContent、解析后的 toast 设置和 dismiss 回调交给渲染函数。自定义渲染函数完全拥有布局中的控件：请组合所需的控件并通过它调用 dismiss。Solo 不会向自定义内容注入后备关闭按钮。按 toast 单独设置：应用可通过封装 useToast 并在每次调用时传入来共享同一套布局；而由库代码发起、从不传入该参数的 toast 会渲染为普通的 Solo toast。传入参数为 {body, endContent, type, isAutoHide, autoHideDuration, dismiss}，其中 type 为 'info' | 'error'。",
  },
  usage: {
    description:
      'Toast 显示简短的非阻塞通知，用于确认操作或呈现临时信息。适用于用户需要反馈但不需要做决定的场景，如保存、删除或状态变更。\n\n生产环境中推荐使用 `useToast()` hook，它通过 `ToastViewport` 处理定位、堆叠、自动关闭和去重。Toast 会保持在视口和安全区域边距内，较长的消息会换行，并根据配置的顶部或底部边缘进入、退出或滑动关闭。垂直滑动与位置动效使用同一空间模型：顶部 Toast 向上离开，底部 Toast 向下离开。只有在动作明确朝向关闭边缘时才会接管原生触摸移动，滑动关闭继续报告现有的 manual 原因。触控笔属于直接接触输入，因此支持相同手势；鼠标拖动会与桌面文本选择冲突，所以不启用，关闭按钮始终可用。当操作或消息必须持续可用时，请显式设置 `isAutoHide: false`。`Toast` 组件以内联方式渲染 toast 视觉元素，适用于不需要视口生命周期的预览、文档和静态展示。去重和生命周期选项属于 `useToast()` 返回的 `showToast()`，而非 `Toast`：`uniqueID`（去重键）、`collisionBehavior`（默认 `overwrite`，或 `ignore`，用于已显示相同 uniqueID 的 toast 时）以及 toast 被移除时触发的 `onHide(reason)`。',
    bestPractices: [
      {
        guidance: true,
        description:
          '保持消息简短，只需几个词告诉用户发生了什么，如"更改已保存"或"消息已发送"。',
      },
      {
        guidance: true,
        description:
          '在 endContent 插槽中添加简短的撤销操作，用于可逆操作。当操作必须持续可用时，将 isAutoHide 设置为 false。',
      },
      {
        guidance: true,
        description:
          '使用 uniqueID 去重重复操作触发的 toast，如多次点击保存按钮。',
      },
      {
        guidance: true,
        description:
          '对需要关注但不需要立即操作的错误使用 error 类型，它会持续显示直到关闭。',
      },
      {
        guidance: false,
        description:
          '不要对阻塞用户的严重错误使用 toast，使用 Banner 进行持久的上下文消息传递。',
      },
      {
        guidance: false,
        description:
          '不要在 toast 中放置长内容或多行内容，它会在5秒后消失，用户可能来不及阅读。',
      },
      {
        guidance: false,
        description:
          '不要将表单验证错误显示为 toast，使用内联字段验证让用户看到具体哪个字段需要修复。',
      },
    ],
    anatomy: [
      {
        name: '正文',
        required: true,
        description: '描述发生了什么或用户应该知道什么的主要消息文本。',
      },
      {
        name: '尾部内容',
        required: false,
        description: '正文后的尾随操作，如撤销按钮或链接。',
      },
      {
        name: '关闭按钮',
        required: true,
        description: '让用户在自动隐藏前手动关闭 toast 的关闭按钮。',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض Toast إشعارًا موجزًا غير معيق لتأكيد إجراء أو تقديم معلومات مؤقتة.',
  propDescriptions: {
    body: 'محتوى الرسالة الرئيسي.',
    type: 'نوع الإشعار المنبثق الذي يتحكم في لون الخلفية. تبقى إشعارات الخطأ حتى تُغلق. يجعل useToast() القيمة الافتراضية \'info\'.',
    isAutoHide: 'ما إذا كان الإشعار المنبثق يُغلق تلقائيًا. يجعل useToast() القيمة الافتراضية true للنوع info وfalse للنوع error.',
    autoHideDuration: 'المدة بالمللي ثانية قبل الإغلاق التلقائي. يجعل useToast() القيمة الافتراضية 5000. يجب أن يستوفي المحتوى المحدود زمنيًا معيار WCAG 2.2.1.',
    endContent: 'محتوى يُعرض في الطرف الختامي (مثل زر Undo أو رابط). أبقِ تسميات الإجراءات قصيرة.',
    isExiting: 'يشغّل انتقال الخروج ويعطّل إيماءات السحب. يعيّنه ToastViewport أثناء مغادرة الإشعار المنبثق؛ اتركه دون تعيين عند عرض Toast مباشرةً.',
    onDismiss: 'دالة استدعاء تُطلَق عند إغلاق الإشعار المنبثق.',
    renderContent: 'يستبدل محتوى بطاقة هذا الإشعار المنبثق بتخطيطك الخاص. يحتفظ Solo بالبطاقة، وهدف السمة solo-toast الخاص بها، ودور المنطقة الحية، وسلوك الإخفاء التلقائي، ثم يسلّم دالة العرض الرسالةَ وendContent وإعدادات الإشعار المحسومة ودالة استدعاء للإغلاق. تملك دالة العرض المخصصة كل عنصر تحكم في تخطيطها: ركّب عنصر التحكم الذي تريده واستدعِ dismiss منه. لا يحقن Solo زر إغلاق احتياطيًا في المحتوى المخصص. يُطبَّق لكل إشعار على حدة: يتشارك التطبيق تخطيطًا واحدًا بتغليف useToast وتمريره في كل استدعاء، بينما يُعرض الإشعار الذي تطلقه شيفرة مكتبة لا تمرّره كإشعار Solo عادي. الوسيط هو {body, endContent, type, isAutoHide, autoHideDuration, dismiss}، حيث type هو \'info\' | \'error\'.',
  },
  usage: {
    description: 'يعرض Toast إشعارًا موجزًا غير معيق لتأكيد إجراء أو تقديم معلومات مؤقتة. استخدمه في الحالات التي يحتاج فيها المستخدم إلى ملاحظات لا إلى قرار، مثل الحفظ أو الحذف أو تغيير الحالة.\n\nللاستخدام في بيئة الإنتاج، فضّل الخطّاف `useToast()`؛ فهو يتولى التموضع والتكديس والإغلاق التلقائي وإزالة التكرار عبر `ToastViewport`. تبقى الإشعارات المنبثقة ضمن هوامش منفذ العرض والمنطقة الآمنة، وتلتف محتويات الرسائل الطويلة، وتدخل وتخرج أو تُغلق بالسحب باتجاه الحافة العليا أو السفلى المهيأة لها. يستخدم السحب العمودي النموذج المكاني نفسه لحركة التموضع: تغادر إشعارات الأعلى إلى الأعلى، وإشعارات الأسفل إلى الأسفل. ينتظر السحب نية واضحة باتجاه الحافة قبل إلغاء حركة اللمس الأصلية، ويُبلغ عن سبب الإغلاق اليدوي الموجود. القلم مدعوم كإدخال بالتلامس المباشر؛ ويُستثنى السحب بالفأرة لتجنب التعارض مع تحديد النص على سطح المكتب، حيث يظل زر الإغلاق المرئي متاحًا. عيّن `isAutoHide: false` صراحةً عندما يجب أن يظل إجراء أو رسالة متاحين. يعرض المكوّن `Toast` عنصر الإشعار المرئي مضمّنًا، وهو مفيد للمعاينات والتوثيق والعروض الثابتة التي لا تحتاج إلى دورة حياة منفذ العرض. تنتمي خيارات إزالة التكرار ودورة الحياة إلى `showToast()` من `useToast()`، لا إلى `Toast`: `uniqueID` (مفتاح إزالة التكرار)، و`collisionBehavior` (`overwrite` افتراضيًا، أو `ignore`) لحالة وجود إشعار معروض بالفعل بالمعرّف uniqueID نفسه، و`onHide(reason)` الذي يُطلَق عند إزالة الإشعار.',
    bestPractices: [
      {
        guidance: true,
        description: 'أبقِ الرسائل قصيرة: بضع كلمات فقط تخبر المستخدم بما حدث، مثل "Changes saved" أو "Message sent".',
      },
      {
        guidance: true,
        description: 'أضف إجراء تراجع قصيرًا في خانة endContent للعمليات القابلة للعكس. عيّن isAutoHide إلى false عندما يجب أن يظل الإجراء متاحًا.',
      },
      {
        guidance: true,
        description: 'استخدم uniqueID لإزالة تكرار الإشعارات المنبثقة الناتجة عن إجراءات متكررة، مثل النقر على زر الحفظ عدة مرات.',
      },
      {
        guidance: true,
        description: 'استخدم النوع error للإخفاقات التي تحتاج إلى انتباه لا إلى إجراء فوري؛ فهو يبقى حتى يُغلق كي لا يفوّته المستخدم.',
      },
      {
        guidance: false,
        description: 'لا تستخدم إشعارًا منبثقًا للأخطاء الحرجة التي تعيق المستخدم. استخدم Banner للرسائل الدائمة ضمن السياق التي تتطلب إقرارًا.',
      },
      {
        guidance: false,
        description: 'لا تضع محتوى طويلًا أو متعدد الأسطر في إشعار منبثق؛ فهو يختفي بعد 5 ثوانٍ وقد لا يُنهي المستخدم القراءة.',
      },
      {
        guidance: false,
        description: 'لا تعرض أخطاء التحقق في النماذج كإشعارات منبثقة. استخدم التحقق المضمّن في الحقول كي يرى المستخدم بالضبط أي حقل يحتاج إلى إصلاح.',
      },
    ],
    anatomy: [
      {
        name: 'الجسم',
        required: true,
        description: 'نص الرسالة الرئيسي الذي يصف ما حدث أو ما يجب أن يعرفه المستخدم.',
      },
      {
        name: 'المحتوى الختامي',
        required: false,
        description: 'إجراء ختامي مثل زر Undo أو رابط، يوضع بعد نص الجسم.',
      },
      {
        name: 'زر الإغلاق',
        required: true,
        description: 'زر إغلاق يتيح للمستخدم إغلاق الإشعار المنبثق يدويًا قبل الإخفاء التلقائي.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'toast notification w/ auto-dismiss, stacking, dedup, smooth animations; MediaTheme inverted surface',
  usage: {
    description:
      'Brief non-blocking notification for action confirmations and temporary info. Use where user needs feedback not decisions: saves, deletes, status changes. useToast() hook for production (safe-area positioning, responsive message wrapping, stacking, auto-dismiss, dedup via ToastViewport). Enters, exits, or swipe-dismisses toward configured edge; touch is claimed only after dominant edge-directed intent; swipe reports manual. Pen uses the direct-contact gesture; mouse drag stays off to preserve text selection and the close control remains available. Set isAutoHide false explicitly for must-remain actions/messages. Toast renders inline for previews/docs/static showcases.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Short messages, a few words: "Changes saved", "Message sent".',
      },
      {
        guidance: true,
        description:
          'Short Undo action in endContent for reversible ops; set isAutoHide false when it must remain available.',
      },
      {
        guidance: true,
        description: 'uniqueID to dedup repeated action toasts.',
      },
      {
        guidance: true,
        description:
          'Error type for failures needing attention; persists until dismissed.',
      },
      {
        guidance: false,
        description:
          "Don't use for critical blocking errors. Use Banner for persistent in-context messaging.",
      },
      {
        guidance: false,
        description:
          "Don't put long/multi-line content; disappears in 5s, user may not finish reading.",
      },
      {
        guidance: false,
        description:
          "Don't show form validation errors. Use inline field validation instead.",
      },
    ],
  },
  propDescriptions: {
    body: 'primary message content',
    type: 'toast type; controls bg color; error persists until dismissed',
    isAutoHide: 'auto-dismiss; true for info, false for error',
    autoHideDuration:
      'ms before auto-dismiss; timed content must satisfy WCAG 2.2.1',
    endContent:
      'trailing end content (undo btn, link); keep action labels short',
    isExiting: 'plays exit transition, disables swipe; set by ToastViewport',
    renderContent: 'custom inner layout; receives content, resolved settings + dismiss callback; no injected fallback control',
  },
};
