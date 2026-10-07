/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ChatSystemMessage',
  subComponentOf: 'Chat',
  displayName: 'Chat System Message',
  description:
    'Centered system message for non-sender content like date separators, membership changes, and status notices. It is not a chat bubble; it has no avatar, no alignment, and no sender context. Use the divider variant for temporal breaks and default for inline status updates.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'System message content: factual text or React content such as a date, join/leave notice, or status change. Long default content wraps within the available width.',
      required: true,
    },
    {
      name: 'variant',
      type: "'default' | 'divider'",
      description:
        "Visual variant. 'default' renders centered text. 'divider' adds horizontal lines on each side via Divider: use for date separators and section breaks.",
      default: "'default'",
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        'Optional caller-provided icon content. Rendered before the message in the default variant; the divider variant currently does not render it. Wrap in Icon for consistent sizing.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-chat-system-message', visualProps: ['variant']},
    ],
  },
  usage: {
    description:
      'Use ChatSystemMessage for concise, non-sender content inside a chat transcript. Choose the default variant for factual status notices and the divider variant for date or section breaks. Long default content wraps within the available width. The component exposes status semantics and the divider branch includes a labelled separator.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the visible message concise and self-contained so it remains understandable without an icon.',
      },
      {
        guidance: true,
        description:
          'Use the divider variant for temporal or section boundaries and the default variant for factual status notices.',
      },
      {
        guidance: false,
        description:
          'Use ChatSystemMessage for sender-authored content; use ChatMessage and ChatMessageBubble instead.',
      },
      {
        guidance: false,
        description:
          'Use caller-provided icon artwork as the only source of meaning; the visible message must carry the same information.',
      },
    ],
    anatomy: [
      {
        name: 'System message',
        required: true,
        description:
          'The noninteractive status row that carries the chat-system-message theme target.',
      },
      {
        name: 'Content',
        required: true,
        description: 'The concise caller-provided message or divider label.',
      },
      {
        name: 'Icon content',
        required: false,
        description:
          'Rendered before the message in the default variant; the divider variant currently does not render it.',
      },
      {
        name: 'Divider',
        required: false,
        description:
          'A labelled horizontal Divider rendered by the divider variant.',
      },
    ],
  },
};

export const docsZh = {
  name: 'ChatSystemMessage',
  displayName: 'Chat System Message',
  description:
    '居中的系统消息，用于日期分隔、成员变更和状态通知等非发送者内容。没有头像、对齐或气泡。使用 divider 变体做时间分隔，default 做内联状态更新。',
  propDescriptions: {
    children:
      '事实性系统消息内容，如日期、加入/离开通知或状态变更；较长的 default 内容会在可用宽度内换行。',
    variant:
      "视觉变体。'default' 渲染居中文本。'divider' 通过 Divider 在两侧添加水平线，用于日期分隔和段落分隔。",
    icon: '可选的调用方图标内容。default 变体会在消息前渲染；divider 变体当前不会渲染。使用 Icon 包裹以获得一致的尺寸。',
    className: '用于布局自定义的 Tailwind 类。',
  },
  theming: {
    targets: [
      {className: 'solo-chat-system-message', visualProps: ['variant']},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'رسالة نظام متوسّطة للمحتوى غير الصادر عن مُرسِل، مثل فواصل التاريخ وتغييرات العضوية وإشعارات الحالة. وهي ليست فقاعة محادثة؛ فلا صورة رمزية لها ولا محاذاة ولا سياق مُرسِل. استخدم النمط divider للفواصل الزمنية والنمط default لتحديثات الحالة المضمّنة.',
  propDescriptions: {
    children:
      'محتوى رسالة النظام: نص وقائعي أو محتوى React مثل تاريخ، أو إشعار انضمام/مغادرة، أو تغيير في الحالة. يلتف المحتوى الطويل في النمط الافتراضي ضمن العرض المتاح.',
    variant:
      "النمط المرئي. يعرض 'default' نصًا متوسّطًا. ويضيف 'divider' خطوطًا أفقية على كل جانب عبر Divider: استخدمه لفواصل التاريخ وفواصل الأقسام.",
    icon:
      'محتوى أيقونة اختياري يوفّره المستدعي. يُعرض قبل الرسالة في النمط الافتراضي؛ ولا يعرضه النمط divider حاليًا. غلّفه بـ Icon للحصول على حجم متّسق.',
    className:
      'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتغلب الأداة المتعارضة على القيمة الافتراضية.',
  },
  usage: {
    description:
      'استخدم ChatSystemMessage للمحتوى الموجز غير الصادر عن مُرسِل داخل سجل المحادثة. اختر النمط الافتراضي لإشعارات الحالة الوقائعية والنمط divider لفواصل التاريخ أو الأقسام. يلتف المحتوى الطويل في النمط الافتراضي ضمن العرض المتاح. يوفّر المكوّن دلالات الحالة (status)، ويتضمن فرع divider فاصلًا ذا تسمية.',
    bestPractices: [
      {
        guidance: true,
        description:
          'اجعل الرسالة المرئية موجزة ومكتفية بذاتها كي تبقى مفهومة من دون أيقونة.',
      },
      {
        guidance: true,
        description:
          'استخدم النمط divider للحدود الزمنية أو حدود الأقسام، والنمط الافتراضي لإشعارات الحالة الوقائعية.',
      },
      {
        guidance: false,
        description:
          'لا تستخدم ChatSystemMessage للمحتوى الذي يكتبه المُرسِل؛ استخدم ChatMessage وChatMessageBubble بدلًا من ذلك.',
      },
      {
        guidance: false,
        description:
          'لا تعتمد على رسم الأيقونة الذي يوفّره المستدعي بوصفه المصدر الوحيد للمعنى؛ إذ يجب أن تحمل الرسالة المرئية المعلومات نفسها.',
      },
    ],
    anatomy: [
      {
        name: 'رسالة النظام',
        required: true,
        description:
          'صف الحالة غير التفاعلي الذي يحمل هدف السمة chat-system-message.',
      },
      {
        name: 'المحتوى',
        required: true,
        description: 'الرسالة الموجزة التي يوفّرها المستدعي أو تسمية الفاصل.',
      },
      {
        name: 'محتوى الأيقونة',
        required: false,
        description:
          'يُعرض قبل الرسالة في النمط الافتراضي؛ ولا يعرضه النمط divider حاليًا.',
      },
      {
        name: 'الفاصل',
        required: false,
        description:
          'فاصل Divider أفقي ذو تسمية يعرضه النمط divider.',
      },
    ],
  },
};

export const docsDense = {
  name: 'ChatSystemMessage',
  displayName: 'Chat System Message',
  description:
    'centered non-sender msg; divider variant for date breaks, default for status notices; accepts optional icon content',
  usage: {
    description:
      'Use for concise non-sender content in chat. Default is a factual status row; divider is a labelled date/section break.',
    bestPractices: [
      {
        guidance: true,
        description: 'Keep visible content concise and self-contained.',
      },
      {
        guidance: true,
        description:
          'Use divider for temporal/section boundaries and default for factual notices.',
      },
      {
        guidance: false,
        description:
          'Use for sender-authored content; use ChatMessage and ChatMessageBubble.',
      },
      {
        guidance: false,
        description: 'Rely on icon artwork as the only source of meaning.',
      },
    ],
  },
  propDescriptions: {
    children:
      'factual React content: date, join/leave, status change; long default content wraps',
    variant:
      'default=centered text, divider=horizontal lines via Divider for date/section breaks',
    icon: 'optional caller icon; rendered before default message; divider currently does not render it',
    className: 'additional Tailwind layout classes',
  },
};
