/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'CollapsibleGroup',
  subComponentOf: 'Collapsible',
  displayName: 'Collapsible Group',
  isHiddenFromOverview: true,
  description: 'Coordinates multiple Collapsible instances so only one (single mode) or any number (multiple mode) can be open at a time. Renders no wrapper DOM element unless dividers are enabled.',
  props: [
    {
      name: 'type',
      type: "'single' | 'multiple'",
      description: 'Whether one or many items can be open simultaneously.',
      default: "'single'",
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      description: 'Default open item(s) for uncontrolled usage. Use a string for single mode and an array for multiple mode.',
    },
    {
      name: 'value',
      type: 'string | string[]',
      description: 'Controlled open item(s).',
    },
    {
      name: 'onChange',
      type: '(value: string | string[]) => void',
      description: 'Callback invoked when the set of open items changes.',
    },
    {
      name: 'hasDividers',
      type: 'boolean',
      description: "Whether to draw hairline dividers between the group's items. When set, the group renders a wrapper div and items default to 'balanced' density. Pair with bare Collapsible children; Card-wrapped items provide their own separation.",
      default: 'false',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: "Row density controlling trigger and content block padding on the group's items. Defaults to 'balanced' when dividers are shown; otherwise items keep their default unpadded look.",
    },
    {
      name: 'chevronPosition',
      type: "'start' | 'end'",
      description: "Logical position shared by the group's direct Collapsible items. `end` is the default trailing indicator; `start` is a leading disclosure arrow that points inward when collapsed (mirrored under RTL) and down when expanded. An individual Collapsible can still override it.",
      default: "'end'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Collapsible instances to coordinate.',
      required: true,
      slotElements: [
        {
          __element: 'Collapsible',
          props: {
            trigger: 'Section',
          },
          children: 'Content',
        },
      ],
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description:
        'Ref forwarded to the group wrapper when hasDividers renders one.',
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
        'Inline styles for the group wrapper when hasDividers renders one. Prefer className: its classes merge with the component classes and stay overridable, while inline styles always win over className.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description:
        'Test selector forwarded to the group wrapper when hasDividers renders one.',
    },
  ],
};

export const docsZh = {
  name: 'CollapsibleGroup',
  isHiddenFromOverview: true,
  displayName: 'Collapsible Group',
  description: '协调多个 Collapsible 实例，使同一时间只有一个（single 模式）或任意数量（multiple 模式）可以展开。除非启用 dividers，否则不渲染包裹 DOM 元素。',
  props: [
    {
      name: 'type',
      type: "'single' | 'multiple'",
      description: '是否允许同时展开一个或多个项目。',
      default: "'single'",
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      description: '非受控模式下默认展开的项目。single 模式使用字符串，multiple 模式使用数组。',
    },
    {
      name: 'value',
      type: 'string | string[]',
      description: '受控展开的项目。',
    },
    {
      name: 'onChange',
      type: '(value: string | string[]) => void',
      description: '展开项目集合变更时调用的回调。',
    },
    {
      name: 'hasDividers',
      type: 'boolean',
      description: "是否在组项目之间绘制细线分隔线。启用后组会渲染一个包裹 div，且项目默认使用 'balanced' 密度。适合搭配裸 Collapsible 子项使用；用 Card 包裹的项目自带视觉分隔。",
      default: 'false',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: "控制组内项目触发器和内容块内边距的行密度。显示分隔线时默认为 'balanced'；否则项目保持默认的无内边距外观。",
    },
    {
      name: 'chevronPosition',
      type: "'start' | 'end'",
      description: "组内直接 Collapsible 项目的逻辑箭头位置。`end` 是默认的尾随指示器；`start` 是前置展开箭头，折叠时指向内容（RTL 下镜像），展开时向下。单个 Collapsible 仍可覆盖此设置。",
      default: "'end'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: '需要协调的 Collapsible 实例。',
      required: true,
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'ينسّق بين عدة نسخ من Collapsible بحيث يمكن فتح واحدة فقط (الوضع الفردي) أو أي عدد منها (الوضع المتعدد) في الوقت نفسه. لا يعرض أي عنصر DOM مغلِّف ما لم تُفعَّل الفواصل.',
  propDescriptions: {
    type: 'ما إذا كان يمكن فتح عنصر واحد أو عدة عناصر في آن واحد.',
    defaultValue: 'العنصر (أو العناصر) المفتوحة افتراضيًا في الاستخدام غير المتحكَّم به. استخدم نصًا للوضع الفردي ومصفوفة للوضع المتعدد.',
    value: 'العنصر (أو العناصر) المفتوحة المتحكَّم بها.',
    onChange: 'دالة استدعاء تُنفَّذ عند تغيّر مجموعة العناصر المفتوحة.',
    hasDividers: 'ما إذا كان سيتم رسم فواصل رفيعة بين عناصر المجموعة. عند تعيينها، تعرض المجموعة عنصر div مغلِّفًا وتأخذ العناصر الكثافة \'balanced\' افتراضيًا. استخدمها مع عناصر Collapsible أبناء مجردة؛ فالعناصر المغلَّفة بـ Card توفّر فصلها الخاص.',
    density: 'كثافة الصفوف التي تتحكم في حشوة المشغّل وكتلة المحتوى في عناصر المجموعة. القيمة الافتراضية \'balanced\' عند عرض الفواصل؛ وإلا تحتفظ العناصر بمظهرها الافتراضي بلا حشوة.',
    chevronPosition: 'الموضع المنطقي المشترك بين عناصر Collapsible المباشرة في المجموعة. `end` هو المؤشر الختامي الافتراضي؛ و`start` سهم إفصاح بادئ يشير إلى الداخل عند الطي (معكوسًا في وضع RTL) وإلى الأسفل عند التوسيع. لا يزال بإمكان Collapsible فردي تجاوزه.',
    children: 'نسخ Collapsible المراد التنسيق بينها.',
    ref: 'مرجع (ref) يُمرَّر إلى غلاف المجموعة عندما يعرضه hasDividers.',
    className: 'فئات Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
    style: 'أنماط مضمَّنة لغلاف المجموعة عندما يعرضه hasDividers. فضّل className: إذ تُدمج فئاته مع فئات المكوّن وتبقى قابلة للتجاوز، بينما تتغلّب الأنماط المضمَّنة دائمًا على className.',
    'data-testid': 'محدِّد اختبار يُمرَّر إلى غلاف المجموعة عندما يعرضه hasDividers.',
  },
};

export const docsDense = {
  name: 'CollapsibleGroup',
  isHiddenFromOverview: true,
  displayName: 'Collapsible Group',
  description: 'coordinates multiple Collapsible instances; single or multiple open. no wrapper DOM unless dividers enabled.',
  propDescriptions: {
    type: 'one or many items open simultaneously',
    defaultValue: 'default open item(s) (uncontrolled); string for single, array for multiple',
    value: 'controlled open item(s)',
    onChange: 'callback on open items change',
    hasDividers: "draw hairline dividers between items; enables wrapper div + 'balanced' density; use bare Collapsible children",
    density: "row padding 'compact' | 'balanced' | 'spacious'; defaults 'balanced' with dividers, else unpadded",
    chevronPosition: "logical chevron position for direct items: 'end' (default trailing, down/up) | 'start' (leading, inward/down with RTL mirroring); per-item prop wins",
    children: 'Collapsible instances to coordinate',
  },
};
