/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Progress bar',
    required: true,
    description: 'Container arranging the label row and progress track.',
  },
  {
    name: 'Label',
    required: true,
    description:
      'Text naming the operation, optionally hidden visually while remaining accessible.',
  },
  {
    name: 'Value text',
    required: false,
    description:
      'Formatted determinate value shown beside the label when requested.',
  },
  {
    name: 'Track',
    required: true,
    description:
      'Remaining-progress rail that carries the progressbar semantics.',
  },
  {
    name: 'Fill',
    required: true,
    description:
      'Painted segment showing completed progress or indeterminate movement.',
  },
  {
    name: 'Mark',
    required: false,
    description: 'Labeled target tick positioned on a determinate track.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ProgressBar',
  displayName: 'Progress Bar',
  category: 'Feedback & Status',
  keywords: [
    'progressbar',
    'progress',
    'loader',
    'loading',
    'linear',
    'determinate',
    'indeterminate',
    'meter',
  ],
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'accessible label',
      required: true,
    },
    {
      name: 'value',
      type: 'number',
      description: 'Current value (ignored when indeterminate).',
      default: '0',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum value.',
      default: '100',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label (remains accessible).',
      default: 'false',
    },
    {
      name: 'hasValueLabel',
      type: 'boolean',
      description: 'Show formatted value text (ignored when indeterminate).',
      default: 'false',
    },
    {
      name: 'formatValueLabel',
      type: '(value: number, max: number) => string',
      description:
        'Custom value label formatter; defaults to a percentage string.',
    },
    {
      name: 'variant',
      type: "'accent' | 'success' | 'warning' | 'error' | 'neutral'",
      description: 'Semantic color variant.',
      default: "'accent'",
    },
    {
      name: 'isIndeterminate',
      type: 'boolean',
      description: 'Animated loading indicator for unknown progress.',
      default: 'false',
    },
    {
      name: 'marks',
      type: 'ReadonlyArray<{value: number; label: string}>',
      description:
        "Fixed target marks drawn on the track at values in the same 0..max scale as value (e.g. a goal line). They stay visible whether progress is below or past them, and take their color from what they sit on: a mark inside the filled area uses the fill variant's on-color (on-accent, on-warning, on-error, and so on), a mark still out on the bare track uses the primary text color (the secondary one on a disabled bar, which dims everything it draws). Each mark requires a label: it is the mark's accessible name and the text revealed via a tooltip on hover/focus. Ignored when indeterminate.",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Visually disabled state: grays out the fill and text. Use for canceled or inactive operations.',
      default: 'false',
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
      {className: 'solo-progress-bar', visualProps: ['variant']},
      {className: 'solo-progress-bar-fill', visualProps: ['variant']},
      {className: 'solo-progress-bar-track'},
      {
        className: 'solo-progress-bar-mark',
        visualProps: ['variant', 'placement'],
      },
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {
        className: 'solo-progressbar',
        visualProps: ['variant'],
        deprecatedFor: 'progress-bar',
      },
      {
        className: 'solo-progressbar-fill',
        visualProps: ['variant'],
        deprecatedFor: 'progress-bar-fill',
      },
      {
        className: 'solo-progressbar-track',
        deprecatedFor: 'progress-bar-track',
      },
      {
        className: 'solo-progressbar-mark',
        visualProps: ['variant', 'placement'],
        deprecatedFor: 'progress-bar-mark',
      },
    ],
    vars: [
      {
        name: '--_progressbar-mark-width',
        description: 'Target mark tick width',
        default: '2px',
        private: true,
      },
      {
        name: '--_progressbar-mark-height',
        description: 'Target mark tick height',
        default: '8px',
        private: true,
      },
    ],
    derived: [
      {property: 'width', vars: ['--_progressbar-mark-width'], replaces: true},
      {
        property: 'height',
        vars: ['--_progressbar-mark-height'],
        replaces: true,
      },
    ],
  },
  usage: {
    anatomy,
    description:
      "A horizontal bar showing the completion progress of a task. Use it for operations where the duration is known, or as an animated indicator when progress can't be calculated. Supports semantic color variants, value labels, and custom formatting.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use a determinate bar when the total amount of work is known, and indeterminate when it's not.",
      },
      {
        guidance: true,
        description:
          'Choose a color variant that matches the context: accent for general progress, success for completion, warning or error for alerts.',
      },
      {
        guidance: true,
        description:
          "Always provide a label, even if hidden; screen readers need it to announce what's loading.",
      },
      {
        guidance: false,
        description:
          'Place icons or labels inside the bar; compose them alongside it using layout components.',
      },
      {
        guidance: false,
        description:
          "Use a progress bar for instant actions; it's meant for operations that take noticeable time.",
      },
      {
        guidance: false,
        description:
          'Use multiple progress bars stacked together for the same operation; use one bar with a value label instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'ProgressBar',
  displayName: 'Progress Bar',
  props: [
    {
      name: 'label',
      type: 'string',
      description: '无障碍标签（必填）。',
      required: true,
    },
    {
      name: 'value',
      type: 'number',
      description: '当前值（不确定模式下忽略）。',
      default: '0',
    },
    {
      name: 'max',
      type: 'number',
      description: '最大值。',
      default: '100',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: '视觉上隐藏标签（仍保持无障碍可访问性）。',
      default: 'false',
    },
    {
      name: 'hasValueLabel',
      type: 'boolean',
      description: '显示格式化的值文本（不确定模式下忽略）。',
      default: 'false',
    },
    {
      name: 'formatValueLabel',
      type: '(value: number, max: number) => string',
      description: '自定义值标签格式化器；默认为百分比字符串。',
    },
    {
      name: 'variant',
      type: "'accent' | 'success' | 'warning' | 'error' | 'neutral'",
      description: '语义颜色变体。',
      default: "'accent'",
    },
    {
      name: 'isIndeterminate',
      type: 'boolean',
      description: '用于未知进度的动画加载指示器。',
      default: 'false',
    },
    {
      name: 'marks',
      type: 'ReadonlyArray<{value: number; label: string}>',
      description:
        '在轨道上按与 value 相同的 0..max 刻度绘制的固定目标标记（例如目标线）。无论进度低于还是超过它们都保持可见，并根据所处位置取色：位于已填充区域内的标记使用与填充变体配对的前景色（on-accent、on-warning、on-error 等），仍位于空轨道上的标记使用主文本颜色（禁用状态下会降为次要文本颜色，与其整体弱化的呈现保持一致）。每个标记都必须提供 label——它既是标记的无障碍名称，也是悬停/聚焦时通过工具提示显示的文本。不确定模式下忽略。',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        '视觉禁用状态——使填充条和文本变灰。用于已取消或不活跃的操作。',
      default: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-progress-bar', visualProps: ['variant']},
      {className: 'solo-progress-bar-fill', visualProps: ['variant']},
      {className: 'solo-progress-bar-track'},
      {
        className: 'solo-progress-bar-mark',
        visualProps: ['variant', 'placement'],
      },
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {
        className: 'solo-progressbar',
        visualProps: ['variant'],
        deprecatedFor: 'progress-bar',
      },
      {
        className: 'solo-progressbar-fill',
        visualProps: ['variant'],
        deprecatedFor: 'progress-bar-fill',
      },
      {
        className: 'solo-progressbar-track',
        deprecatedFor: 'progress-bar-track',
      },
      {
        className: 'solo-progressbar-mark',
        visualProps: ['variant', 'placement'],
        deprecatedFor: 'progress-bar-mark',
      },
    ],
    vars: [
      {
        name: '--_progressbar-mark-width',
        description: '目标标记刻度宽度',
        default: '2px',
        private: true,
      },
      {
        name: '--_progressbar-mark-height',
        description: '目标标记刻度高度',
        default: '8px',
        private: true,
      },
    ],
    derived: [
      {property: 'width', vars: ['--_progressbar-mark-width'], replaces: true},
      {
        property: 'height',
        vars: ['--_progressbar-mark-height'],
        replaces: true,
      },
    ],
  },
  usage: {
    anatomy,
    description:
      "A horizontal bar showing the completion progress of a task. Use it for operations where the duration is known, or as an animated indicator when progress can't be calculated. Supports semantic color variants, value labels, and custom formatting.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use a determinate bar when the total amount of work is known, and indeterminate when it's not.",
      },
      {
        guidance: true,
        description:
          'Choose a color variant that matches the context: accent for general progress, success for completion, warning or error for alerts.',
      },
      {
        guidance: true,
        description:
          "Always provide a label, even if hidden; screen readers need it to announce what's loading.",
      },
      {
        guidance: false,
        description:
          'Place icons or labels inside the bar; compose them alongside it using layout components.',
      },
      {
        guidance: false,
        description:
          "Use a progress bar for instant actions; it's meant for operations that take noticeable time.",
      },
      {
        guidance: false,
        description:
          'Use multiple progress bars stacked together for the same operation; use one bar with a value label instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'شريط أفقي يعرض تقدّم إنجاز مهمة، للعمليات معروفة المدة أو كمؤشر متحرك عندما يتعذر حساب التقدّم.',
  propDescriptions: {
    label: 'تسمية قابلة للوصول',
    value: 'القيمة الحالية (تُتجاهل في الوضع غير المحدد).',
    max: 'القيمة القصوى.',
    isLabelHidden: 'يُخفي التسمية بصريًا (مع بقائها قابلة للوصول).',
    hasValueLabel: 'يعرض نص القيمة المنسّق (يُتجاهل في الوضع غير المحدد).',
    formatValueLabel: 'دالة مخصصة لتنسيق تسمية القيمة؛ القيمة الافتراضية سلسلة نسبة مئوية.',
    variant: 'نمط اللون الدلالي.',
    isIndeterminate: 'مؤشر تحميل متحرك للتقدّم غير المعروف.',
    marks: 'علامات هدف ثابتة تُرسم على المسار عند قيم على المقياس نفسه 0..max الخاص بـ value (مثل خط الهدف). تظل مرئية سواء كان التقدّم أدناها أو تجاوزها، وتأخذ لونها مما تقع عليه: العلامة داخل المنطقة المملوءة تستخدم لون on الخاص بنمط التعبئة (on-accent و on-warning و on-error وما إلى ذلك)، والعلامة التي ما زالت على المسار المكشوف تستخدم لون النص الأساسي (والثانوي على الشريط المعطَّل، الذي يُخفت كل ما يرسمه). تتطلب كل علامة تسمية: فهي الاسم القابل للوصول للعلامة والنص الذي يظهر عبر تلميح عند التمرير أو التركيز. تُتجاهل في الوضع غير المحدد.',
    isDisabled: 'حالة معطَّلة بصريًا: تجعل التعبئة والنص رماديين. استخدمها للعمليات الملغاة أو غير النشطة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث يتجاوز أي صنف متعارض القيمة الافتراضية.',
  },
  usage: {
    description: 'شريط أفقي يعرض تقدّم إنجاز مهمة. استخدمه للعمليات معروفة المدة، أو كمؤشر متحرك عندما يتعذر حساب التقدّم. يدعم أنماط الألوان الدلالية وتسميات القيم والتنسيق المخصص.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم شريطًا محددًا عندما يكون إجمالي العمل معروفًا، وغير محدد عندما لا يكون كذلك.',
      },
      {
        guidance: true,
        description: 'اختر نمط لون يناسب السياق: accent للتقدّم العام، و success للإكمال، و warning أو error للتنبيهات.',
      },
      {
        guidance: true,
        description: 'وفّر تسمية دائمًا، حتى لو كانت مخفية؛ إذ يحتاجها قارئ الشاشة للإعلان عمّا يجري تحميله.',
      },
      {
        guidance: false,
        description: 'وضع أيقونات أو تسميات داخل الشريط؛ ركّبها بجانبه باستخدام مكوّنات التخطيط.',
      },
      {
        guidance: false,
        description: 'استخدام شريط التقدّم للإجراءات الفورية؛ فهو مخصص للعمليات التي تستغرق وقتًا ملحوظًا.',
      },
      {
        guidance: false,
        description: 'استخدام عدة أشرطة تقدّم مكدّسة معًا للعملية نفسها؛ استخدم شريطًا واحدًا مع تسمية قيمة بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'شريط التقدّم',
        required: true,
        description: 'حاوية ترتّب صف التسمية ومسار التقدّم.',
      },
      {
        name: 'التسمية',
        required: true,
        description: 'نص يسمّي العملية، ويمكن إخفاؤه بصريًا مع بقائه قابلًا للوصول.',
      },
      {
        name: 'نص القيمة',
        required: false,
        description: 'القيمة المحددة المنسّقة المعروضة بجانب التسمية عند الطلب.',
      },
      {
        name: 'المسار',
        required: true,
        description: 'سكة التقدّم المتبقي التي تحمل دلالات progressbar.',
      },
      {
        name: 'التعبئة',
        required: true,
        description: 'الجزء المرسوم الذي يُظهر التقدّم المكتمل أو الحركة غير المحددة.',
      },
      {
        name: 'العلامة',
        required: false,
        description: 'علامة هدف مُسمّاة موضوعة على مسار محدد.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Progress bar for displaying determinate or indeterminate progress.',
  usage: {
    anatomy,
    description:
      "A horizontal bar showing the completion progress of a task. Use it for operations where the duration is known, or as an animated indicator when progress can't be calculated. Supports semantic color variants, value labels, and custom formatting.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use a determinate bar when the total amount of work is known, and indeterminate when it's not.",
      },
      {
        guidance: true,
        description:
          'Choose a color variant that matches the context: accent for general progress, success for completion, warning or error for alerts.',
      },
      {
        guidance: true,
        description:
          "Always provide a label, even if hidden; screen readers need it to announce what's loading.",
      },
      {
        guidance: false,
        description:
          'Place icons or labels inside the bar; compose them alongside it using layout components.',
      },
      {
        guidance: false,
        description:
          "Use a progress bar for instant actions; it's meant for operations that take noticeable time.",
      },
      {
        guidance: false,
        description:
          'Use multiple progress bars stacked together for the same operation; use one bar with a value label instead.',
      },
    ],
  },
  propDescriptions: {
    label: 'accessible label',
    value: 'Current value (ignored when indeterminate).',
    max: 'Maximum value.',
    isLabelHidden: 'Visually hide label (remains accessible).',
    hasValueLabel: 'Show formatted value text (ignored when indeterminate).',
    formatValueLabel:
      'Custom value label formatter; defaults to percentage string.',
    variant: 'Semantic color variant.',
    isIndeterminate: 'Animated loading indicator for unknown progress.',
    marks:
      'Fixed target marks ({value, label?}) drawn on the track in the 0..max scale; stay visible past the fill. Marks inside the fill take the variant on-color; marks on the bare track take the primary text color (secondary when disabled). A label reveals a tooltip on hover/focus. Ignored when indeterminate.',
    isDisabled: 'Visually disabled: grays out fill and text.',
    className:
      'Tailwind classes for layout customization; merged via cn(), so conflicting utilities override defaults.',
  },
};
