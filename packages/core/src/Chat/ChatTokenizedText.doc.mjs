/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ChatTokenizedText',
  subComponentOf: 'Chat',
  displayName: 'Chat Tokenized Text',
  isHiddenFromOverview: true,
  description:
    'Renders a text string with token patterns replaced by inline token content. Wrap any message body inside ChatMessageBubble to turn raw @mentions, #tags, or /commands into styled content. When no non-empty token matches or none are provided, the text renders as-is, so you can use ChatTokenizedText unconditionally on every message.',
  props: [
    {
      name: 'children',
      type: 'string',
      description:
        "The plain text message containing serialized token values. Patterns matching a token's value are replaced with inline token content.",
      required: true,
    },
    {
      name: 'tokens',
      type: 'ChatComposerToken[]',
      description:
        'Token definitions using the same type as composer input. Each non-empty value is matched literally. Empty values are ignored. Structured tokens render a Badge, while custom tokens render caller content.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [{className: 'solo-chat-tokenized-text'}],
  },
  usage: {
    description:
      'Use ChatTokenizedText inside a chat message when stored plain text contains serialized token values that should be projected as inline badges or caller-rendered token content. Unmatched text is preserved exactly and empty token values are ignored so rendering always finishes.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Reuse the same token definitions for composer insertion and message rendering so serialized values and visible labels stay aligned.',
      },
      {
        guidance: true,
        description:
          'Use non-empty, stable serialized values so every definition identifies real message text.',
      },
      {
        guidance: false,
        description:
          'Use token labels as a substitute for the surrounding message text; the complete message must remain understandable in reading order.',
      },
      {
        guidance: false,
        description:
          'Put component-owned interaction or accessibility behavior inside a custom token renderer; custom token content remains caller owned.',
      },
    ],
    anatomy: [
      {
        name: 'Tokenized text',
        required: true,
        description:
          'The inline root that preserves unmatched text and carries the chat-tokenized-text theme target.',
      },
      {
        name: 'Rendered token',
        required: false,
        description:
          'Inline token content rendered by Badge for structured tokens or by the caller for custom tokens.',
      },
    ],
  },
};

export const docsZh = {
  name: 'ChatTokenizedText',
  isHiddenFromOverview: true,
  displayName: 'Chat Tokenized Text',
  description:
    '渲染带有标记模式的文本，将匹配的模式替换为内联标记内容。在 ChatMessageBubble 内使用，将 @提及、#标签或 /命令显示为样式化内容。没有非空匹配标记时以纯文本渲染。',
  propDescriptions: {
    children:
      '包含序列化标记值的纯文本消息。匹配标记值的模式将被替换为内联标记内容。',
    tokens:
      '标记定义，与输入组件使用相同类型。空值会被忽略；其他值按调用者提供的顺序进行匹配。',
    className: '用于根文本包装器的额外 Tailwind 类。',
  },
  theming: {
    targets: [{className: 'solo-chat-tokenized-text'}],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض سلسلة نصية مع استبدال أنماط الرموز بمحتوى رموز مضمّن. غلّف أي نص رسالة داخل ChatMessageBubble لتحويل إشارات @ والوسوم # والأوامر / الخام إلى محتوى منسّق. عندما لا يتطابق أي رمز غير فارغ أو لا تُوفَّر أي رموز، يُعرض النص كما هو، لذا يمكنك استخدام ChatTokenizedText دون شروط على كل رسالة.',
  propDescriptions: {
    children: 'نص الرسالة العادي الذي يحتوي على قيم رموز مُسلسلة. تُستبدل الأنماط المطابقة لقيمة رمز ما بمحتوى رمز مضمّن.',
    tokens: 'تعريفات الرموز باستخدام النوع نفسه المستخدم في إدخال المحرّر. تُطابَق كل قيمة غير فارغة حرفيًا. وتُتجاهل القيم الفارغة. تعرض الرموز المهيكلة Badge، بينما تعرض الرموز المخصّصة محتوى المستدعي.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'استخدم ChatTokenizedText داخل رسالة محادثة عندما يحتوي النص العادي المخزَّن على قيم رموز مُسلسلة ينبغي عرضها كشارات مضمّنة أو كمحتوى رموز يعرضه المستدعي. يُحفظ النص غير المطابق كما هو تمامًا وتُتجاهل قيم الرموز الفارغة كي يكتمل العرض دائمًا.',
    bestPractices: [
      {guidance: true, description: 'أعد استخدام تعريفات الرموز نفسها لإدراجها في المحرّر ولعرض الرسائل كي تبقى القيم المُسلسلة والتسميات المرئية متوافقة.'},
      {guidance: true, description: 'استخدم قيمًا مُسلسلة غير فارغة وثابتة كي يحدد كل تعريف نصًا فعليًا في الرسالة.'},
      {guidance: false, description: 'استخدام تسميات الرموز بديلًا عن نص الرسالة المحيط؛ يجب أن تظل الرسالة كاملةً مفهومة بترتيب القراءة.'},
      {guidance: false, description: 'وضع سلوك تفاعل أو إمكانية وصول يملكه المكوّن داخل عارض رموز مخصّص؛ يظل محتوى الرموز المخصّصة ملكًا للمستدعي.'},
    ],
    anatomy: [
      {name: 'النص المرمَّز', required: true, description: 'الجذر المضمّن الذي يحفظ النص غير المطابق ويحمل هدف السمة chat-tokenized-text.'},
      {name: 'الرمز المعروض', required: false, description: 'محتوى رمز مضمّن يعرضه Badge للرموز المهيكلة أو يعرضه المستدعي للرموز المخصّصة.'},
    ],
  },
};

export const docsDense = {
  name: 'ChatTokenizedText',
  isHiddenFromOverview: true,
  displayName: 'Chat Tokenized Text',
  description:
    'renders text w/ literal token values replaced by inline content; empty values ignored',
  usage: {
    description:
      'Use for stored chat text containing serialized token values; unmatched text is preserved.',
    bestPractices: [
      {
        guidance: true,
        description: 'Reuse composer token definitions for display.',
      },
      {
        guidance: true,
        description: 'Use stable non-empty serialized values.',
      },
      {
        guidance: false,
        description:
          'Replace the surrounding message meaning with token labels.',
      },
      {
        guidance: false,
        description:
          'Move component-owned behavior into custom token renderers.',
      },
    ],
  },
  propDescriptions: {
    children:
      'plain text msg w/ serialized token values; matching patterns become inline content',
    tokens:
      'token defs; literal values matched in caller order; empty values ignored',
    className: 'additional Tailwind classes for root wrapper',
  },
};
