/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ChatComposer',
  subComponentOf: 'Chat',
  displayName: 'Chat Composer',
  description:
    'Layout shell for a chat composer. Arranges named slots (drawer, header, input, footer, send) with page-radius container, elevation, a keyboard-only editor focus ring, and concentric inner radius for child elements.',
  usage: {
    description:
      'ChatComposer is the message-entry shell for a chat surface. It coordinates a controlled or uncontrolled draft, provides a default token-capable input and send/stop action, and arranges optional drawer, header, footer, and status content. Custom inputs and send controls can join the same value, submission, disabled, stop, and focus contract through useChatComposerContext().',
    anatomy: [
      {name: 'Composer frame', required: true, description: 'Outer composition root that groups the body with an optional status message above or below it.'},
      {name: 'Composer body', required: true, description: 'Rounded, elevated surface containing the header, input, and footer.'},
      {name: 'Drawer', required: false, description: 'Content before the body for attachments or other expandable context, typically ChatComposerDrawer.'},
      {name: 'Header', required: false, description: 'Row for start-aligned actions and end-aligned contextual information.'},
      {name: 'Input', required: true, description: 'Default ChatComposerInput or a custom editor connected through useChatComposerContext().'},
      {name: 'Footer', required: true, description: 'Row for caller-supplied footer and send actions plus the primary action.'},
      {name: 'Send or stop action', required: true, description: 'Default ChatSendButton or a custom sendButton; it submits the current draft or requests interruption.'},
      {name: 'Status message', required: false, description: 'Error or warning feedback rendered before or after the composer body.'},
    ],
  },
  playground: {
    wrapper: {component: 'Stack', props: {width: 480}},
  },
  props: [
    {
      name: 'onSubmit',
      type: '(value: string) => void',
      description: 'Called when the user submits a message.',
      required: true,
    },
    {
      name: 'onStop',
      type: '() => void',
      description: 'Called when the user requests to stop generation.',
    },
    {
      name: 'isStopShown',
      type: 'boolean',
      description: 'Whether the stop button is shown instead of the send button.',
      default: 'false',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled input value.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Change handler for controlled mode.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when the input is empty.',
      default: "'Type a message...'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the composer.',
      default: 'false',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: 'Visual density.',
      default: "'balanced'",
    },
    {
      name: 'elevation',
      type: "'none' | 'low'",
      description:
        "Resting elevation of the composer body. `low` (the default) keeps today's raised look: low at rest, bumping to med on hover / focus. `none` flattens it and draws a border. Keyboard focus in the editor adds the shared focus ring in either presentation; pointer focus does not add that ring.",
      default: "'low'",
    },
    {
      name: 'drawer',
      type: 'ReactNode',
      description: 'Slot: collapsible drawer above the input: attachments, context chips, etc. Use ChatComposerDrawer.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Drawer content',
        },
      ],
    },
    {
      name: 'headerActions',
      type: 'ReactNode',
      description: 'Slot: left-aligned header actions (attach, mention buttons). Use icon-only size="sm" buttons.',
      slotElements: [
        {
          __element: 'Button',
          props: {
            label: 'Action',
            variant: 'ghost',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'headerContext',
      type: 'ReactNode',
      description: 'Slot: right-aligned contextual info in the header (context window usage, ProgressBar, supporting text).',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Context',
        },
      ],
    },
    {
      name: 'input',
      type: 'ReactNode',
      description: 'Slot: custom input element. Replaces the default input. Use ChatComposerInput for trigger menus/tokens, or wire any input (plain textarea, rich editor) to the composition contract via useChatComposerContext(): read value/onChange/onSubmit/canSend and register a focus control on inputControlRef so body-click-to-focus works.',
      slotElements: [
        {
          __element: 'TextInput',
          props: {
            label: 'Input',
            placeholder: 'Type here...',
          },
        },
      ],
    },
    {
      name: 'footerActions',
      type: 'ReactNode',
      description: 'Slot: left-aligned footer actions (model selector, etc).',
      slotElements: [
        {
          __element: 'Button',
          props: {
            label: 'Action',
            variant: 'ghost',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'sendActions',
      type: 'ReactNode',
      description: 'Slot: actions to the left of the send button.',
      slotElements: [
        {
          __element: 'Button',
          props: {
            label: 'Action',
            variant: 'ghost',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'sendButton',
      type: 'ReactNode',
      description: 'Slot: custom send button. Replaces the default send/stop button.',
      slotElements: [
        {
          __element: 'Button',
          props: {
            label: 'Action',
            variant: 'ghost',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'status',
      type: "{ type: 'error' | 'warning'; message?: string }",
      description: 'Status message rendered below (or above) the composer.',
    },
    {
      name: 'statusPosition',
      type: "'top' | 'bottom'",
      description: 'Where to render the status.',
      default: "'bottom'",
    },
  ],
};

export const docsZh = {
  name: 'ChatComposer',
  displayName: 'Chat Composer',
  description: '聊天编写器布局外壳。排列命名插槽（附件、标题栏、输入、页脚、发送），带有页面圆角容器和同心内圆角。',
  propDescriptions: {
    onSubmit: '用户提交消息时调用。',
    onStop: '用户请求停止生成时调用。',
    isStopShown: '是否显示停止按钮。',
    value: '受控输入值。',
    onChange: '受控模式的输入值变更时调用。序列化字符串包含标记占位符。',
    placeholder: '输入为空时显示的占位文本。',
    isDisabled: '禁用编写器。',
    density: '视觉密度。',
    elevation:
      '编写器主体的静止高度。low（默认）保持当前的抬起外观——静止时 low，悬停/聚焦时升至 med。none 会将其扁平化并绘制边框。编辑器通过键盘获得焦点时，两种呈现方式都会显示共享焦点环；指针聚焦不会显示该焦点环。',
    drawer: '插槽：输入上方的可折叠抽屉——附件、上下文标签等。使用 ChatComposerDrawer。',
    headerActions: '插槽：标题左侧操作按钮（附件、提及按钮）。使用仅图标 size="sm" 按钮。',
    headerContext: '插槽：标题右侧上下文信息（上下文窗口使用情况、ProgressBar、辅助文本）。',
    input: '插槽：自定义输入元素。替换默认输入。使用 ChatComposerInput 实现触发菜单/标记，或通过 useChatComposerContext() 将任意输入（纯 textarea、富文本编辑器）接入组合契约——读取 value/onChange/onSubmit/canSend，并在 inputControlRef 上注册聚焦控制，使点击空白处聚焦生效。',
    footerActions: '插槽：左对齐的页脚操作（模型选择器等）。',
    sendActions: '插槽：发送按钮左侧的操作。',
    sendButton: '插槽：自定义发送按钮。替换默认的发送/停止按钮。',
    status: '编写器下方（或上方）的状态消息。',
    statusPosition: '状态渲染位置。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'هيكل تخطيط لمحرّر رسائل المحادثة. يرتّب خانات مسمّاة (drawer وheader وinput وfooter وsend) ضمن حاوية بنصف قطر الصفحة، مع ارتفاع ظلّي، وحلقة تركيز للمحرّر تظهر مع لوحة المفاتيح فقط، ونصف قطر داخلي متّحد المركز للعناصر الفرعية.',
  propDescriptions: {
    onSubmit: 'يُستدعى عندما يرسل المستخدم رسالة.',
    onStop: 'يُستدعى عندما يطلب المستخدم إيقاف التوليد.',
    isStopShown: 'ما إذا كان زر الإيقاف يُعرض بدلًا من زر الإرسال.',
    value: 'قيمة الإدخال في الوضع المتحكَّم به.',
    onChange: 'معالج التغيير في الوضع المتحكَّم به.',
    placeholder: 'نص إرشادي يظهر عندما يكون حقل الإدخال فارغًا.',
    isDisabled: 'يعطّل محرّر الرسائل.',
    density: 'الكثافة المرئية.',
    elevation: 'الارتفاع الظلّي لجسم المحرّر في وضع السكون. `low` (الافتراضي) يحافظ على المظهر المرتفع الحالي: منخفض في السكون ويرتفع إلى med عند التمرير / التركيز. `none` يسطّحه ويرسم حدًّا. يضيف تركيز لوحة المفاتيح في المحرّر حلقة التركيز المشتركة في كلا العرضين؛ أما تركيز المؤشر فلا يضيف تلك الحلقة.',
    drawer: 'خانة: درج قابل للطي فوق حقل الإدخال: المرفقات، ورقائق السياق، وغيرها. استخدم ChatComposerDrawer.',
    headerActions: 'خانة: إجراءات الترويسة المحاذاة إلى البداية (أزرار الإرفاق والإشارة). استخدم أزرارًا بأيقونات فقط وsize="sm".',
    headerContext: 'خانة: معلومات سياقية محاذاة إلى النهاية في الترويسة (استخدام نافذة السياق، وProgressBar، ونص داعم).',
    input: 'خانة: عنصر إدخال مخصص. يحل محل حقل الإدخال الافتراضي. استخدم ChatComposerInput لقوائم المشغّلات/الرموز، أو اربط أي حقل إدخال (textarea عادي، أو محرّر نصوص غني) بعقد التركيب عبر useChatComposerContext(): اقرأ value/onChange/onSubmit/canSend وسجّل عنصر تحكم في التركيز على inputControlRef كي يعمل التركيز عند النقر على الجسم.',
    footerActions: 'خانة: إجراءات التذييل المحاذاة إلى البداية (محدِّد النموذج، وغيره).',
    sendActions: 'خانة: إجراءات تسبق زر الإرسال (على يساره في التخطيط من اليسار إلى اليمين).',
    sendButton: 'خانة: زر إرسال مخصص. يحل محل زر الإرسال/الإيقاف الافتراضي.',
    status: 'رسالة حالة تُعرض أسفل (أو أعلى) محرّر الرسائل.',
    statusPosition: 'موضع عرض الحالة.',
  },
  usage: {
    description: 'ChatComposer هو هيكل إدخال الرسائل لواجهة المحادثة. ينسّق مسودة متحكَّمًا بها أو غير متحكَّم بها، ويوفّر حقل إدخال افتراضيًا يدعم الرموز وإجراء إرسال/إيقاف، ويرتّب محتوى اختياريًا للدرج والترويسة والتذييل والحالة. يمكن لحقول الإدخال وعناصر تحكم الإرسال المخصصة الانضمام إلى عقد القيمة والإرسال والتعطيل والإيقاف والتركيز نفسه عبر useChatComposerContext().',
    anatomy: [
      {
        name: 'إطار المحرّر',
        required: true,
        description: 'جذر التركيب الخارجي الذي يجمع الجسم مع رسالة حالة اختيارية أعلاه أو أسفله.',
      },
      {
        name: 'جسم المحرّر',
        required: true,
        description: 'سطح مستدير الحواف ومرتفع يحتوي على الترويسة وحقل الإدخال والتذييل.',
      },
      {
        name: 'الدرج',
        required: false,
        description: 'محتوى قبل الجسم للمرفقات أو سياق قابل للتوسيع آخر، وعادةً ما يكون ChatComposerDrawer.',
      },
      {
        name: 'الترويسة',
        required: false,
        description: 'صف للإجراءات المحاذاة إلى البداية والمعلومات السياقية المحاذاة إلى النهاية.',
      },
      {
        name: 'حقل الإدخال',
        required: true,
        description: 'ChatComposerInput الافتراضي أو محرّر مخصص متصل عبر useChatComposerContext().',
      },
      {
        name: 'التذييل',
        required: true,
        description: 'صف لإجراءات التذييل والإرسال التي يوفّرها المستدعي بالإضافة إلى الإجراء الرئيسي.',
      },
      {
        name: 'إجراء الإرسال أو الإيقاف',
        required: true,
        description: 'ChatSendButton الافتراضي أو sendButton مخصص؛ يرسل المسودة الحالية أو يطلب المقاطعة.',
      },
      {
        name: 'رسالة الحالة',
        required: false,
        description: 'ملاحظات خطأ أو تحذير تُعرض قبل جسم المحرّر أو بعده.',
      },
    ],
  },
};

export const docsDense = {
  name: 'ChatComposer',
  displayName: 'Chat Composer',
  description: 'composer layout shell; named slots (drawer/header/input/footer/send) w/ page-radius + concentric inner radius',
  propDescriptions: {
    onSubmit: 'submit msg handler',
    onStop: 'stop generation handler',
    isStopShown: 'whether the stop button is shown',
    value: 'controlled input value',
    onChange: 'controlled change handler',
    placeholder: 'placeholder when empty',
    isDisabled: 'disabled; use during streaming or unmet prereqs',
    density: 'visual density',
    elevation:
      'resting elevation of composer body: low (default; low→med on hover/focus) | none (flat with border); keyboard-focused editor gets the shared ring in either mode; pointer focus does not',
    drawer: 'slot: collapsible drawer above input: attachments, context chips, etc.; use ChatComposerDrawer',
    headerActions: 'slot: left header actions (attach, mention); icon-only sm buttons',
    headerContext: 'slot: right header context info (window usage, ProgressBar, text)',
    input: 'slot: custom input; replaces default. use ChatComposerInput for triggers/tokens, or wire any input via useChatComposerContext() (value/onChange/onSubmit/canSend + register focus on inputControlRef)',
    footerActions: 'slot: left footer actions (model selector etc)',
    sendActions: 'slot: actions left of send btn',
    sendButton: 'slot: custom send btn; replaces default',
    status: 'status msg below/above composer',
    statusPosition: 'status render position',
  },
};
