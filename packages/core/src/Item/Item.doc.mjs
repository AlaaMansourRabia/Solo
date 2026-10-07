/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Item',
  displayName: 'Item',
  group: 'Item',
  category: 'Table & List',
  isHiddenFromOverview: true,
  keywords: [
    'item',
    'list-item',
    'media-object',
    'row',
    'cell',
    'entity',
    'contact',
    'notification',
    'preview',
  ],
  playground: {
    defaults: {
      label: 'Item label',
      description: 'Supporting text',
    },
  },
  theming: {
    targets: [{className: 'solo-item', visualProps: ['density', 'align']}],
    vars: [
      {
        name: '--_item-label-color',
        description:
          'Color of the label line. Unset by default (the label uses the primary text token); a parent sets it to recolor the label it renders, as the destructive dropdown/context menu item does.',
        default: 'var(--color-text-primary)',
        private: true,
      },
      {
        name: '--_item-description-color',
        description:
          'Companion to --_item-label-color for the secondary description line.',
        default: 'var(--color-text-secondary)',
        private: true,
      },
      {
        name: '--_item-inset-inline',
        description:
          'Inline inset of the row. Item derives its paddingInline from this variable, and List reads it to cancel the inset when edgeCompensation="inline". Set paddingInline on `item` in a theme and both stay in sync.',
        default: 'var(--spacing-2) (var(--spacing-3) for density="spacious")',
        private: true,
      },
    ],
    derived: [{property: 'paddingInline', vars: ['--_item-inset-inline']}],
  },
  components: [
    {
      name: 'Item',
      displayName: 'Item',
      description:
        'A universal item primitive that unifies the "start content + label + description + end content" layout pattern. Use as a building block for list items, menu items, contact rows, notifications, and more.',
      props: [
        {
          name: 'label',
          type: 'ReactNode',
          description:
            'Primary text identifying this item. Accepts string (auto-truncated) or ReactNode (for rich content).',
          required: true,
        },
        {
          name: 'marker',
          type: 'ReactNode',
          description:
            'Marker rendered before startContent as a direct flex child. Use for list bullets/counters that need custom baseline alignment.',
        },
        {
          name: 'startContent',
          type: 'ReactNode',
          description:
            'Content rendered before the label/description area, such as an icon, avatar, or checkbox.',
          slotElements: [
            {__element: 'Avatar', props: {name: 'Ada Lovelace', size: 'sm'}},
            {
              __element: 'Icon',
              props: {icon: 'info', size: 'sm', color: 'secondary'},
            },
          ],
        },
        {
          name: 'description',
          type: 'ReactNode',
          description:
            'Secondary text: subtitle, description, or supporting info.',
        },
        {
          name: 'endContent',
          type: 'ReactNode',
          description:
            'Content rendered after the label/description area, such as badges, metadata, timestamps, or action buttons.',
          slotElements: [
            {__element: 'Badge', props: {label: 3}},
            {
              __element: 'Text',
              props: {color: 'secondary'},
              children: '2h ago',
            },
          ],
        },
        {
          name: 'as',
          type: "'div' | 'li' | 'span' | ElementType",
          description:
            "What the root renders as: an HTML element, or a component for a caller that needs the root to be something else. A menu row that navigates passes the application's link component here, so the row's root IS the anchor. Give a component only when the row carries a role, and only when no interactive node sits in startContent or endContent.",
          default: "'div'",
        },
        {
          name: 'align',
          type: "'center' | 'start'",
          description: 'Vertical alignment of start/end content slots.',
          default: "'center'",
        },
        {
          name: 'density',
          type: "'compact' | 'balanced' | 'spacious'",
          description:
            'Spacing density. "compact" uses 4px block padding, "balanced" uses 8px, and "spacious" uses 12px block and inline padding.',
          default: "'balanced'",
        },
        {
          name: 'labelLines',
          type: 'number',
          description: 'Max lines before label truncates with ellipsis.',
        },
        {
          name: 'descriptionLines',
          type: 'number',
          description: 'Max lines before description truncates with ellipsis.',
        },
        {
          name: 'layout',
          type: "'stacked' | 'inline'",
          description:
            'How the label and description sit together. stacked puts the description on its own line below the label; inline keeps both on one line, description ellipsizing first, so the row fits a fixed-height host.',
          default: "'stacked'",
        },
        {
          name: 'onClick',
          type: '(event: MouseEvent) => void',
          description:
            'Click handler. Makes the item clickable with button semantics.',
        },
        {
          name: 'interactiveRef',
          type: 'RefObject<HTMLElement | null>',
          description:
            "Ref to a nested control (e.g. a checkbox in startContent) that owns the item's keyboard access and action. The row becomes an enlarged click/tap target that delegates surface clicks to it (useClickableContainer) and renders no invisible button/anchor, so the row adds no second tab stop (WCAG 4.1.2). Mutually exclusive with onClick/href; those are ignored when set.",
        },
        {
          name: 'href',
          type: 'string',
          description:
            'Link URL. Makes the item a link via an invisible anchor element. A row whose root is already a link component (see `as`) carries the address on that root instead, and no invisible anchor is rendered.',
        },
        {
          name: 'target',
          type: "'_blank' | '_self'",
          description:
            'Link target. Only used with href. target="_blank" automatically adds noopener noreferrer.',
        },
        {
          name: 'rel',
          type: 'string',
          description:
            'Link relationship tokens. noopener noreferrer are merged automatically for target="_blank".',
        },
        {
          name: 'isHighlighted',
          type: 'boolean',
          description: 'Highlighted state (hover/keyboard focus appearance).',
          default: 'false',
        },
        {
          name: 'isSelected',
          type: 'boolean',
          description: 'Selected state.',
          default: 'false',
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description: 'Disabled state.',
          default: 'false',
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLElement>',
          description: 'Ref forwarded to the root element.',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
        },
        {
          name: 'data-testid',
          type: 'string',
          description: 'Test selector for automated testing frameworks.',
        },
      ],
    },
  ],
  usage: {
    description:
      'A single, flexible item primitive that unifies the "start content + label + description + end content" pattern across Solo. Use it wherever you need a structured row: dropdown menus, selectors, contact lists, notifications, file browsers, and activity feeds.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use named slots (startContent, label, description, endContent) for the common layout. These cover the 80% case.',
      },
      {
        guidance: true,
        description:
          'Use density="compact" for menus and dense lists, "balanced" for standard rows, and "spacious" for roomier layouts.',
      },
      {
        guidance: true,
        description:
          'Set labelLines and descriptionLines to control truncation when content length varies.',
      },
      {
        guidance: true,
        description:
          'Use align="start" when start or end content is taller than a single line of text.',
      },
      {
        guidance: false,
        description:
          "Don't nest interactive elements (buttons, links) inside an interactive Item; it creates confusing focus and click targets.",
      },
      {
        guidance: false,
        description:
          "Don't use Item for navigation between views; use proper navigation components instead.",
      },
      {
        guidance: false,
        description:
          "Don't add read/unread or inbox-specific behavior directly; compose a thin wrapper like PreviewItem instead.",
      },
    ],
    anatomy: [
      {
        name: 'Marker',
        required: false,
        description:
          'Optional list bullet/counter rendered before start content.',
      },
      {
        name: 'Start content',
        required: false,
        description: 'Leading visual: avatar, icon, image, or checkbox.',
      },
      {
        name: 'Label',
        required: true,
        description: 'Primary text identifying the item.',
      },
      {
        name: 'Description',
        required: false,
        description: 'Secondary supporting text below the label.',
      },
      {
        name: 'End content',
        required: false,
        description:
          'End-aligned content: badges, timestamps, or action buttons.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  components: [
    {
      name: 'Item',
      displayName: 'Item',
      description:
        '通用项目原语，统一 "起始内容 + 标签 + 描述 + 结束内容" 布局模式。用作列表项、菜单项、联系人行、通知等的构建块。',
      propDescriptions: {
        label:
          '标识此项目的主要文本。接受字符串（自动截断）或 ReactNode（用于富内容）。',
        marker:
          '在 startContent 之前渲染的标记，作为直接 flex 子元素。用于需要自定义基线对齐的列表项目符号/计数器。',
        startContent: '在标签/描述区域之前渲染的内容，例如图标、头像或复选框。',
        description: '次要文本：副标题、描述或辅助信息。',
        endContent:
          '在标签/描述区域之后渲染的内容，例如徽章、元数据、时间戳或操作按钮。',
        as: '根元素的 HTML 元素。',
        align: '起始/结束内容插槽的垂直对齐方式。',
        density:
          '间距密度。"compact" 使用 4px 块内距，"balanced" 使用 8px，"spacious" 使用 12px 块内距和内联内距。',
        labelLines: '标签截断前的最大行数。',
        descriptionLines: '描述截断前的最大行数。',
        onClick: '点击处理函数。使项目可点击，具有按钮语义。',
        interactiveRef:
          '指向嵌套控件（如 startContent 中的复选框）的 ref，该控件承载项目的键盘访问和操作。行成为更大的点击/触摸目标，将表面点击委托给该控件（useClickableContainer），且不渲染不可见按钮/锚点，因此行不会增加第二个 Tab 停留点（WCAG 4.1.2）。与 onClick/href 互斥——设置后二者将被忽略。',
        href: '链接 URL。通过不可见锚点元素使项目成为链接。',
        target:
          '链接目标。仅与 href 一起使用。target="_blank" 会自动添加 noopener noreferrer。',
        rel: '链接关系标记。target="_blank" 会自动合并 noopener noreferrer。',
        isHighlighted: '高亮状态（悬停/键盘焦点外观）。',
        isSelected: '选中状态。',
        isDisabled: '禁用状态。',
        ref: '转发到根元素的引用。',
        className: '用于布局自定义的 Tailwind 类，通过 cn() 与组件类合并，冲突的工具类会覆盖默认值。',
        'data-testid': '自动化测试的选择器。',
      },
    },
  ],
  usage: {
    description:
      '通用项目原语，统一 Solo 中 "起始内容 + 标签 + 描述 + 结束内容" 的布局模式。适用于下拉菜单、选择器、联系人列表、通知、文件浏览器和活动流等场景。',
    bestPractices: [
      {
        guidance: true,
        description:
          '使用命名插槽（startContent、label、description、endContent）处理常见布局。',
      },
      {
        guidance: true,
        description:
          '菜单和密集列表使用 density="compact"，标准行使用 "balanced"，宽松布局使用 "spacious"。',
      },
      {
        guidance: true,
        description:
          '设置 labelLines 和 descriptionLines 控制内容长度不定时的截断。',
      },
      {
        guidance: true,
        description: '当起始或结束内容高于单行文本时使用 align="start"。',
      },
      {
        guidance: false,
        description: '不要在交互式 Item 内嵌套交互元素（按钮、链接）。',
      },
      {
        guidance: false,
        description: '不要使用 Item 进行视图间导航：使用适当的导航组件。',
      },
      {
        guidance: false,
        description:
          '不要直接添加已读/未读行为：组合一个薄包装器如 PreviewItem。',
      },
    ],
    anatomy: [
      {
        name: '标记',
        required: false,
        description: '在起始内容之前渲染的可选列表项目符号/计数器。',
      },
      {
        name: '起始内容',
        required: false,
        description: '前导视觉：头像、图标、图片或复选框。',
      },
      {name: '标签', required: true, description: '标识项目的主要文本。'},
      {name: '描述', required: false, description: '标签下方的次要辅助文本。'},
      {
        name: '结束内容',
        required: false,
        description: '末端对齐内容：徽章、时间戳或操作按钮。',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'عنصر أولي واحد ومرن يوحّد نمط "محتوى البداية + التسمية + الوصف + محتوى النهاية" عبر Solo، لاستخدامه حيثما احتجت إلى صف منظّم.',
  usage: {
    description:
      'عنصر أولي واحد ومرن يوحّد نمط "محتوى البداية + التسمية + الوصف + محتوى النهاية" عبر Solo. استخدمه حيثما احتجت إلى صف منظّم: القوائم المنسدلة والمحدِّدات وقوائم جهات الاتصال والإشعارات ومتصفحات الملفات وموجزات النشاط.',
    bestPractices: [
      {
        guidance: true,
        description:
          'استخدم الخانات المسمّاة (startContent وlabel وdescription وendContent) للتخطيط الشائع؛ فهي تغطي 80% من الحالات.',
      },
      {
        guidance: true,
        description:
          'استخدم density="compact" للقوائم والقوائم الكثيفة، و"balanced" للصفوف القياسية، و"spacious" للتخطيطات الأرحب.',
      },
      {
        guidance: true,
        description:
          'عيّن labelLines وdescriptionLines للتحكم في الاقتطاع عندما يتفاوت طول المحتوى.',
      },
      {
        guidance: true,
        description:
          'استخدم align="start" عندما يكون محتوى البداية أو النهاية أطول من سطر نصي واحد.',
      },
      {
        guidance: false,
        description:
          'لا تُدرج عناصر تفاعلية (أزرار أو روابط) داخل Item تفاعلي؛ فذلك ينشئ أهداف تركيز ونقر مربكة.',
      },
      {
        guidance: false,
        description:
          'لا تستخدم Item للتنقّل بين العروض؛ استخدم مكوّنات التنقّل المناسبة بدلًا من ذلك.',
      },
      {
        guidance: false,
        description:
          'لا تُضف سلوك المقروء/غير المقروء أو سلوكًا خاصًا بصندوق الوارد مباشرةً؛ ركّب بدلًا من ذلك غلافًا رقيقًا مثل PreviewItem.',
      },
    ],
    anatomy: [
      {
        name: 'العلامة',
        required: false,
        description: 'نقطة أو عدّاد قائمة اختياري يُعرض قبل محتوى البداية.',
      },
      {
        name: 'محتوى البداية',
        required: false,
        description: 'العنصر المرئي في البداية: صورة رمزية أو أيقونة أو صورة أو مربع اختيار.',
      },
      {
        name: 'التسمية',
        required: true,
        description: 'النص الأساسي الذي يعرّف العنصر.',
      },
      {
        name: 'الوصف',
        required: false,
        description: 'نص داعم ثانوي أسفل التسمية.',
      },
      {
        name: 'محتوى النهاية',
        required: false,
        description: 'محتوى محاذى إلى النهاية: شارات أو طوابع زمنية أو أزرار إجراءات.',
      },
    ],
  },
  components: [
    {
      name: 'Item',
      displayName: 'عنصر',
      description:
        'عنصر أولي شامل يوحّد نمط التخطيط "محتوى البداية + التسمية + الوصف + محتوى النهاية". استخدمه لبنةً لعناصر القوائم وعناصر القوائم المنسدلة وصفوف جهات الاتصال والإشعارات وغيرها.',
      propDescriptions: {
        label:
          'النص الأساسي الذي يعرّف هذا العنصر. يقبل سلسلة نصية (تُقتطع تلقائيًا) أو ReactNode (للمحتوى الغني).',
        marker:
          'علامة تُعرض قبل startContent كعنصر flex ابن مباشر. استخدمها لنقاط القوائم أو عدّاداتها التي تحتاج إلى محاذاة خط أساس مخصّصة.',
        startContent:
          'محتوى يُعرض قبل منطقة التسمية/الوصف، مثل أيقونة أو صورة رمزية أو مربع اختيار.',
        description: 'نص ثانوي: عنوان فرعي أو وصف أو معلومات داعمة.',
        endContent:
          'محتوى يُعرض بعد منطقة التسمية/الوصف، مثل الشارات أو البيانات الوصفية أو الطوابع الزمنية أو أزرار الإجراءات.',
        as:
          'ما يُعرض به الجذر: عنصر HTML، أو مكوّن لمستدعٍ يحتاج أن يكون الجذر شيئًا آخر. صف القائمة الذي ينتقل يمرّر هنا مكوّن الرابط الخاص بالتطبيق، فيكون جذر الصف هو الرابط نفسه. مرّر مكوّنًا فقط عندما يحمل الصف دورًا، وفقط عندما لا توجد عقدة تفاعلية في startContent أو endContent.',
        align: 'المحاذاة العمودية لخانتي محتوى البداية والنهاية.',
        density:
          'كثافة التباعد. "compact" تستخدم حشوًا كتليًا 4px، و"balanced" تستخدم 8px، و"spacious" تستخدم 12px حشوًا كتليًا وسطريًا.',
        labelLines: 'الحد الأقصى للأسطر قبل اقتطاع التسمية بعلامة حذف.',
        descriptionLines: 'الحد الأقصى للأسطر قبل اقتطاع الوصف بعلامة حذف.',
        layout:
          'كيفية تموضع التسمية والوصف معًا. stacked تضع الوصف في سطر مستقل أسفل التسمية؛ وinline تُبقيهما في سطر واحد مع اقتطاع الوصف أولًا، ليتسع الصف في مضيف ثابت الارتفاع.',
        onClick: 'معالج النقر. يجعل العنصر قابلًا للنقر بدلالات الزر.',
        interactiveRef:
          'مرجع إلى عنصر تحكم متداخل (مثل مربع اختيار في startContent) يمتلك الوصول بلوحة المفاتيح والإجراء الخاصين بالعنصر. يصبح الصف هدف نقر/لمس مكبّرًا يفوّض نقرات السطح إليه (useClickableContainer) ولا يعرض زرًا أو رابطًا غير مرئي، فلا يضيف الصف محطة تنقّل ثانية بالمفتاح Tab ‏(WCAG 4.1.2). لا يجتمع مع onClick/href؛ إذ يُتجاهلان عند تعيينه.',
        href:
          'عنوان URL للرابط. يجعل العنصر رابطًا عبر عنصر رابط غير مرئي. أما الصف الذي يكون جذره مكوّن رابط بالفعل (راجع `as`) فيحمل العنوان على ذلك الجذر، ولا يُعرض رابط غير مرئي.',
        target:
          'هدف الرابط. يُستخدم مع href فقط. تضيف target="_blank" القيمتين noopener noreferrer تلقائيًا.',
        rel: 'رموز علاقة الرابط. تُدمج noopener noreferrer تلقائيًا مع target="_blank".',
        isHighlighted: 'حالة الإبراز (مظهر المرور أو تركيز لوحة المفاتيح).',
        isSelected: 'حالة التحديد.',
        isDisabled: 'حالة التعطيل.',
        ref: 'مرجع يُمرَّر إلى العنصر الجذري.',
        className:
          'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
        'data-testid': 'محدِّد اختبار لأطر الاختبار الآلي.',
      },
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'universal item primitive w/ startContent+label+description+endContent layout. building block for list items, menu items, contacts, notifications',
  usage: {
    description:
      'Flexible item primitive unifying the "start content + label + description + end content" pattern. Use for structured rows in menus, lists, contacts, notifications, file browsers.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Named slots (startContent, label, description, endContent) for the 80% case.',
      },
      {
        guidance: true,
        description:
          'density="compact" for menus/dense lists, "balanced" for standard rows, "spacious" for roomier layouts.',
      },
      {
        guidance: true,
        description: 'labelLines/descriptionLines for truncation control.',
      },
      {
        guidance: true,
        description:
          'align="start" when start/end content is taller than one text line.',
      },
      {
        guidance: false,
        description: "Don't nest interactive elements inside interactive Item.",
      },
      {
        guidance: false,
        description: "Don't use for view navigation; use nav components.",
      },
      {
        guidance: false,
        description: "Don't add inbox-specific behavior; compose a wrapper.",
      },
    ],
  },
  components: [
    {
      name: 'Item',
      displayName: 'Item',
      description:
        'universal item primitive w/ startContent+label+description+endContent layout',
      propDescriptions: {
        label:
          'Primary text. String auto-truncates; ReactNode for rich content.',
        marker: 'List bullet/counter before startContent as direct flex child.',
        startContent:
          'Content before label/description: avatar, icon, checkbox, ReactNode.',
        description: 'Secondary text below label.',
        endContent:
          'Content after label/description: badges, timestamps, actions.',
        as: 'Root HTML element.',
        align: 'Vertical alignment of start/end content slots.',
        density:
          'Spacing: "compact" (4px), "balanced" (8px), or "spacious" (12px).',
        labelLines: 'Max label lines before truncation.',
        descriptionLines: 'Max description lines before truncation.',
        onClick: 'Click handler; enables button semantics.',
        interactiveRef:
          "Ref to a nested control that owns the item's keyboard access/action; row delegates surface clicks to it (useClickableContainer), no invisible button/anchor, no second tab stop (WCAG 4.1.2). Mutually exclusive with onClick/href.",
        href: 'Link URL; enables anchor semantics. Follows the shared navigation rule (see Link href).',
        target:
          'Link target, only with href. target="_blank" auto-adds noopener noreferrer.',
        rel: 'Link relationship tokens. noopener noreferrer are merged for target="_blank".',
        isHighlighted: 'Highlighted state.',
        isSelected: 'Selected state.',
        isDisabled: 'Disabled state.',
        className: 'Tailwind layout classes; merged via cn(), so conflicting utilities override defaults.',
        'data-testid': 'Test selector.',
      },
    },
  ],
};
