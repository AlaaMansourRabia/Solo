/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ChatMessageMetadata',
  subComponentOf: 'Chat',
  displayName: 'Chat Message Metadata',
  description:
    'Composable metadata row for chat messages. Renders timestamp, footer content, and delivery status in a single row. Direction reverses for user sender. Omits the row when both slots are omitted or non-rendering scalars and status is omitted.',
  props: [
    {
      name: 'timestamp',
      type: 'ReactNode',
      description: 'Timestamp content: a string or Timestamp component.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Just now',
        },
      ],
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description: 'Footer content: model info, reaction buttons, copy button.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Footer content',
        },
      ],
    },
    {
      name: 'status',
      type: "'sending' | 'sent' | 'delivered' | 'read' | 'error'",
      description: 'Message delivery status. Shows icon + label.',
    },
  ],
  usage: {
    description:
      'Place ChatMessageMetadata below a message or in the last ChatMessageBubble metadata slot to show a timestamp, footer content, and optional delivery status. Non-rendering scalar slots (booleans and empty strings) create no separator; numeric zero remains visible. Composite React content remains caller-owned.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Put metadata in the last bubble metadata slot when the message uses bubbles, so it follows the bubble content.',
      },
      {
        guidance: true,
        description:
          'Pass timestamp and footer content independently; separators are omitted for non-rendering scalar slots. Composite React nodes are used as supplied.',
      },
      {
        guidance: false,
        description:
          'Do not supply footer actions without their own accessible names and interaction behavior; the metadata row does not own those controls.',
      },
      {
        guidance: false,
        description:
          'Do not put the same metadata on both a bubble and its enclosing message.',
      },
    ],
    anatomy: [
      {
        name: 'Metadata row',
        required: true,
        description: 'Sender-aware line containing the visible metadata items.',
      },
      {
        name: 'Timestamp',
        required: false,
        description:
          'Caller-supplied time content at the start of the logical sequence.',
      },
      {
        name: 'Footer',
        required: false,
        description:
          'Caller-supplied information or actions between time and status.',
      },
      {
        name: 'Status',
        required: false,
        description:
          'Localized delivery icon and text when a status is supplied.',
      },
    ],
  },
};

export const docsZh = {
  name: 'ChatMessageMetadata',
  displayName: 'Chat Message Metadata',
  description:
    '可组合的消息元数据行。渲染时间戳、页脚内容和发送状态。用户消息方向反转。',
  propDescriptions: {
    timestamp: '时间戳内容，字符串或 Timestamp 组件。',
    footer: '页脚内容：模型信息、反应按钮、复制按钮。',
    status: '消息发送状态。显示图标和标签。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'صف بيانات وصفية قابل للتركيب لرسائل المحادثة. يعرض الطابع الزمني ومحتوى التذييل وحالة التسليم في صف واحد. ينعكس الاتجاه عندما يكون المرسل هو المستخدم. يُحذف الصف عندما تكون كلتا الخانتين محذوفتين أو قيمًا بسيطة لا تُعرض، وتكون الحالة محذوفة.',
  propDescriptions: {
    timestamp: 'محتوى الطابع الزمني: نص أو مكوّن Timestamp.',
    footer: 'محتوى التذييل: معلومات النموذج، وأزرار التفاعل، وزر النسخ.',
    status: 'حالة تسليم الرسالة. تعرض أيقونة + تسمية.',
  },
  usage: {
    description: 'ضع ChatMessageMetadata أسفل الرسالة أو في خانة البيانات الوصفية لآخر ChatMessageBubble لعرض الطابع الزمني ومحتوى التذييل وحالة تسليم اختيارية. لا تُنشئ الخانات ذات القيم البسيطة التي لا تُعرض (القيم المنطقية والنصوص الفارغة) أي فاصل؛ ويظل الصفر الرقمي مرئيًا. يظل محتوى React المركّب من مسؤولية المستدعي.',
    bestPractices: [
      {
        guidance: true,
        description: 'ضع البيانات الوصفية في خانة البيانات الوصفية لآخر فقاعة عندما تستخدم الرسالة الفقاعات، بحيث تأتي بعد محتوى الفقاعة.',
      },
      {
        guidance: true,
        description: 'مرّر الطابع الزمني ومحتوى التذييل بشكل مستقل؛ تُحذف الفواصل للخانات ذات القيم البسيطة التي لا تُعرض. تُستخدم عُقد React المركّبة كما هي.',
      },
      {
        guidance: false,
        description: 'لا توفّر إجراءات تذييل دون أسماء قابلة للوصول وسلوك تفاعل خاص بها؛ فصف البيانات الوصفية لا يملك عناصر التحكم تلك.',
      },
      {
        guidance: false,
        description: 'لا تضع البيانات الوصفية نفسها على الفقاعة وعلى الرسالة المحيطة بها معًا.',
      },
    ],
    anatomy: [
      {
        name: 'صف البيانات الوصفية',
        required: true,
        description: 'سطر يراعي المرسل ويحتوي على عناصر البيانات الوصفية المرئية.',
      },
      {
        name: 'الطابع الزمني',
        required: false,
        description: 'محتوى الوقت الذي يوفّره المستدعي في بداية التسلسل المنطقي.',
      },
      {
        name: 'التذييل',
        required: false,
        description: 'معلومات أو إجراءات يوفّرها المستدعي بين الوقت والحالة.',
      },
      {
        name: 'الحالة',
        required: false,
        description: 'أيقونة ونص تسليم مترجمان عند توفير حالة.',
      },
    ],
  },
};

export const docsDense = {
  name: 'ChatMessageMetadata',
  displayName: 'Chat Message Metadata',
  description:
    'composable metadata row; renders timestamp · footer · status; reverses for user sender',
  propDescriptions: {
    timestamp: 'timestamp content; string or Timestamp',
    footer: 'footer content; model info, reaction btns, copy btn',
    status: 'delivery status; shows icon+label',
  },
};
