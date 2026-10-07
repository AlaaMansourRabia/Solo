/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'CheckboxInput',
  displayName: 'Checkbox Input',
  group: 'Checkbox',
  category: 'Form Controls',
  keywords: ["checkbox","check","toggle","tick","indeterminate","boolean","tristate"],
  props: [
    {
      name: 'ref',
      type: 'React.Ref<HTMLInputElement>',
      description:
        'Ref forwarded to the underlying <input> element.',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the checkbox (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Whether to visually hide the label (still accessible to screen readers).',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed below the label.',
    },
    {
      name: 'value',
      type: "boolean | 'indeterminate'",
      description:
        'Whether the checkbox is checked, unchecked, or indeterminate.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the checkbox state changes.',
    },
    {
      name: 'changeAction',
      type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>',
      description:
        'Async action on change. Fires after onChange if not prevented. Shows loading spinner while pending.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Whether the checkbox is in a loading state. Shows spinner and prevents interaction.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the checkbox is disabled.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for the underlying checkbox input, useful for form submissions (submits "on" when checked).',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the checkbox is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the checkbox focusable via aria-disabled (toggling stays blocked). Use this instead of wrapping a disabled CheckboxInput in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Whether the checkbox is read-only. Displays the current state at full opacity but prevents interaction. Unlike `isDisabled`, read-only checkboxes are not visually dimmed.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Whether the field is optional. Mutually exclusive with isRequired.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Whether the checkbox is required. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'The size of the checkbox. sm for compact layouts, md for default.',
      default: "'md'",
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the checkbox receives focus.',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the checkbox loses focus.',
    },
    {
      name: 'labelIcon',
      type: 'ReactNode | IconType',
      description:
        'Semantic icon name or custom content displayed before the label text. See the Icon docs (`IconName`) for valid semantic names.',
    },
    {
      name: 'status',
      type: "{type: 'error' | 'warning' | 'success', message?: string}",
      description:
        'Status indicator. Displays a colored message box below the checkbox and sets aria-invalid for errors.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-checkbox-input', visualProps: ['size']},
      {className: 'solo-checkbox-indicator', visualProps: ['size'], states: ['checked', 'disabled']},
      {className: 'solo-checkbox', visualProps: ['size'], states: ['checked', 'disabled'], deprecatedFor: 'checkbox-indicator'},
      {className: 'solo-checkbox-label'},
    ],
  },
  usage: {
    accessibility: [
      {
        name: 'Checkbox box',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Rest', 'Hover', 'Pointer down', 'Checked'],
        description:
          'The box edge (unchecked) and fill (checked) must have at least 3:1 contrast with the surface behind them. For Hover and Pointer down, measure the final colors after the tint and the pressed overlay are applied.',
      },
    ],
    description: 'CheckboxInput toggles a single on/off value. Use it for settings like "Enable notifications", terms acceptance, or opt-in choices. For multiple checkboxes in a group, use CheckboxList instead.',
    bestPractices: [
      { guidance: true, description: 'Always provide a visible label so the user knows what they are toggling. Use isLabelHidden only when surrounding context makes it obvious.' },
      { guidance: true, description: 'Add a description for choices that need extra context, like explaining what "Share usage data" actually shares.' },
      { guidance: true, description: 'Use the indeterminate state for "select all" checkboxes when only some items in a group are selected.' },
      { guidance: false, description: 'Use a checkbox for mutually exclusive choices; use RadioList when only one option can be selected.' },
      { guidance: false, description: 'Use a checkbox for actions that take effect immediately; use a toggle switch or button instead.' },
      { guidance: false, description: 'Wrap a disabled checkbox in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.' },
    ],
    anatomy: [
      { name: 'Checkbox', required: true, description: 'The check box itself: unchecked, checked, or indeterminate.' },
      { name: 'Label', required: true, description: 'Text describing what the checkbox controls. Always present for accessibility.' },
      { name: 'Description', required: false, description: 'Helper text below the label with additional context.' },
      { name: 'Status message', required: false, description: 'An error, warning, or success message below the checkbox.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'CheckboxInput',
  displayName: 'Checkbox Input',
  usage: {
    description: 'CheckboxInput toggles a single on/off value. Use it for settings like "Enable notifications", terms acceptance, or opt-in choices. For multiple checkboxes in a group, use CheckboxList instead.',
    bestPractices: [
      { guidance: true, description: 'Always provide a visible label so the user knows what they are toggling. Use isLabelHidden only when surrounding context makes it obvious.' },
      { guidance: true, description: 'Add a description for choices that need extra context, like explaining what "Share usage data" actually shares.' },
      { guidance: true, description: 'Use the indeterminate state for "select all" checkboxes when only some items in a group are selected.' },
      { guidance: false, description: 'Use a checkbox for mutually exclusive choices; use RadioList when only one option can be selected.' },
      { guidance: false, description: 'Use a checkbox for actions that take effect immediately; use a toggle switch or button instead.' },
      { guidance: false, description: 'Wrap a disabled checkbox in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.' },
    ],
  },
  props: [
    {name: 'ref', type: 'React.Ref<HTMLInputElement>', description: '转发至底层 <input> 元素的 ref。'},
    {name: 'label', type: 'string', description: '复选框的标签文本（始终为无障碍性而渲染）。', required: true},
    {name: 'isLabelHidden', type: 'boolean', description: '是否视觉隐藏标签（屏幕阅读器仍可访问）。', default: 'false'},
    {name: 'description', type: 'string', description: '显示在标签下方的描述文本。'},
    {name: 'value', type: "boolean | 'indeterminate'", description: '复选框是否为选中、未选中或不确定状态。', required: true},
    {name: 'onChange', type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void', description: '复选框状态变更时触发的回调。'},
    {
      name: 'changeAction',
      type:
        '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>',
      description: '异步变更操作。在 onChange 之后触发（未被阻止时）。等待期间显示加载旋转器。',
    },
    {name: 'isLoading', type: 'boolean', description: '复选框是否处于加载状态。显示旋转器并阻止交互。', default: 'false'},
    {name: 'isDisabled', type: 'boolean', description: '复选框是否禁用。', default: 'false'},
    {name: 'htmlName', type: 'string', description: '底层复选框输入的 HTML name 属性，用于表单提交（勾选时提交 "on"）。'},
    {name: 'disabledMessage', type: 'string', description: 'Explains why the checkbox is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the checkbox focusable via aria-disabled (toggling stays blocked). Use this instead of wrapping a disabled CheckboxInput in Tooltip: disabled controls swallow the hover events an external Tooltip needs.'},
    {name: 'isReadOnly', type: 'boolean', description: '复选框是否为只读。以完整不透明度显示当前状态但阻止交互。与 isDisabled 不同，只读复选框不会变暗。', default: 'false'},
    {name: 'isOptional', type: 'boolean', description: '字段是否可选。与 isRequired 互斥。', default: 'false'},
    {name: 'isRequired', type: 'boolean', description: '复选框是否必填。与 isOptional 互斥。', default: 'false'},
    {name: 'size', type: "'sm' | 'md'", description: '复选框尺寸。sm 用于紧凑布局，md 为默认。', default: "'md'"},
    {name: 'onFocus', type: '(e: FocusEvent<HTMLInputElement>) => void', description: '复选框获得焦点时触发的回调。'},
    {name: 'onBlur', type: '(e: FocusEvent<HTMLInputElement>) => void', description: '复选框失去焦点时触发的回调。'},
    {name: 'labelIcon', type: 'ReactNode | IconType', description: '标签文本前显示的语义图标名称或自定义内容。'},
    {
      name: 'status',
      type: "{type: 'error' | 'warning' | 'success', message?: string}",
      description: '状态指示器。在复选框下方显示彩色消息框，错误时设置 aria-invalid。',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: '字段宽度（数字为像素，字符串按原样使用，如 "100%"）。作用于整个字段（标签、控件和状态），使其保持对齐。',
    },
  ],
  theming: {
    targets: [
      {
        className: 'solo-checkbox-input',
        visualProps: [
          'size',
        ],
      },
      {className: 'solo-checkbox-indicator', visualProps: ['size'], states: ['checked', 'disabled']},
      {className: 'solo-checkbox', visualProps: ['size'], states: ['checked', 'disabled'], deprecatedFor: 'checkbox-indicator'},
      {className: 'solo-checkbox-label'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يبدّل CheckboxInput قيمة تشغيل/إيقاف واحدة، مثل الإعدادات أو قبول الشروط أو خيارات الاشتراك.',
  propDescriptions: {
    ref: 'مرجع (ref) يُمرَّر إلى عنصر <input> الأساسي.',
    label: 'نص التسمية لمربع الاختيار (يُعرض دائمًا لأغراض إمكانية الوصول).',
    isLabelHidden: 'ما إذا كان سيتم إخفاء التسمية بصريًا (مع بقائها متاحة لقارئات الشاشة).',
    description: 'نص وصفي يُعرض أسفل التسمية.',
    value: 'ما إذا كان مربع الاختيار محددًا، أو غير محدد، أو في حالة غير محددة جزئيًا.',
    onChange: 'دالة استدعاء تُنفَّذ عند تغيّر حالة مربع الاختيار.',
    changeAction: 'إجراء غير متزامن عند التغيير. يُنفَّذ بعد onChange ما لم يُمنع. يعرض مؤشر تحميل أثناء الانتظار.',
    isLoading: 'ما إذا كان مربع الاختيار في حالة التحميل. يعرض مؤشرًا دوّارًا ويمنع التفاعل.',
    isDisabled: 'ما إذا كان مربع الاختيار معطَّلًا.',
    htmlName: 'السمة name في HTML لحقل مربع الاختيار الأساسي، وهي مفيدة عند إرسال النماذج (يُرسل "on" عند التحديد).',
    disabledMessage: 'يوضّح سبب تعطيل مربع الاختيار. مع isDisabled، يعرض تلميحًا عند التمرير أو التركيز بلوحة المفاتيح ويُبقي مربع الاختيار قابلًا للتركيز عبر aria-disabled (مع بقاء التبديل ممنوعًا). استخدمه بدلًا من تغليف CheckboxInput معطَّل داخل Tooltip، إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    isReadOnly: 'ما إذا كان مربع الاختيار للقراءة فقط. يعرض الحالة الحالية بعتامة كاملة لكنه يمنع التفاعل. على عكس `isDisabled`، لا تظهر مربعات الاختيار للقراءة فقط باهتة بصريًا.',
    isOptional: 'ما إذا كان الحقل اختياريًا. لا يجتمع مع isRequired.',
    isRequired: 'ما إذا كان مربع الاختيار مطلوبًا. لا يجتمع مع isOptional.',
    size: 'حجم مربع الاختيار. sm للتخطيطات المدمجة، وmd للحجم الافتراضي.',
    onFocus: 'دالة استدعاء تُنفَّذ عندما يتلقى مربع الاختيار التركيز.',
    onBlur: 'دالة استدعاء تُنفَّذ عندما يفقد مربع الاختيار التركيز.',
    labelIcon: 'اسم أيقونة دلالية أو محتوى مخصص يُعرض قبل نص التسمية. راجع توثيق Icon (`IconName`) للاطلاع على الأسماء الدلالية الصالحة.',
    status: 'مؤشر الحالة. يعرض مربع رسالة ملوّنًا أسفل مربع الاختيار ويعيّن aria-invalid عند الأخطاء.',
    width: 'عرض الحقل (الرقم = بكسلات، والنص يُستخدم كما هو، مثل "100%"). يحدد حجم الحقل بالكامل (التسمية وعنصر التحكم والحالة) كي تبقى متحاذية.',
  },
  usage: {
    description: 'يبدّل CheckboxInput قيمة تشغيل/إيقاف واحدة. استخدمه لإعدادات مثل "تفعيل الإشعارات"، أو قبول الشروط، أو خيارات الاشتراك. لعدة مربعات اختيار ضمن مجموعة، استخدم CheckboxList بدلًا من ذلك.',
    bestPractices: [
      {guidance: true, description: 'وفّر دائمًا تسمية مرئية كي يعرف المستخدم ما الذي يبدّله. لا تستخدم isLabelHidden إلا عندما يجعل السياق المحيط ذلك واضحًا.'},
      {guidance: true, description: 'أضف description للخيارات التي تحتاج إلى سياق إضافي، مثل توضيح ما الذي يشاركه خيار "مشاركة بيانات الاستخدام" فعليًا.'},
      {guidance: true, description: 'استخدم الحالة غير المحددة جزئيًا لمربعات اختيار "تحديد الكل" عندما يكون بعض عناصر المجموعة فقط محددًا.'},
      {guidance: false, description: 'استخدام مربع اختيار للخيارات المتنافية؛ استخدم RadioList عندما لا يمكن تحديد سوى خيار واحد.'},
      {guidance: false, description: 'استخدام مربع اختيار لإجراءات تسري فورًا؛ استخدم مفتاح تبديل أو زرًا بدلًا من ذلك.'},
      {guidance: false, description: 'تغليف مربع اختيار معطَّل داخل Tooltip لتوضيح سبب تعطيله؛ إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.'},
    ],
    anatomy: [
      {name: 'مربع الاختيار', required: true, description: 'المربع نفسه: غير محدد، أو محدد، أو غير محدد جزئيًا.'},
      {name: 'التسمية', required: true, description: 'نص يصف ما يتحكم فيه مربع الاختيار. موجود دائمًا لأغراض إمكانية الوصول.'},
      {name: 'الوصف', required: false, description: 'نص مساعد أسفل التسمية يقدّم سياقًا إضافيًا.'},
      {name: 'رسالة الحالة', required: false, description: 'رسالة خطأ أو تحذير أو نجاح أسفل مربع الاختيار.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'single on/off toggle for settings, terms, and opt-in choices',
  usage: {
    description: 'CheckboxInput toggles a single on/off value. Use for settings, terms acceptance, opt-in choices. Use CheckboxList for groups.',
    bestPractices: [
      { guidance: true, description: 'Always provide a visible label so user knows what they\'re toggling. Use isLabelHidden only when surrounding context makes it obvious.' },
      { guidance: true, description: 'Add a description for choices that need extra context, e.g. what "Share usage data" actually shares.' },
      { guidance: true, description: 'Use the indeterminate state for "select all" checkboxes when only some items in a group are selected.' },
      { guidance: false, description: 'Use a checkbox for mutually exclusive choices; use RadioList when only one option can be selected.' },
      { guidance: false, description: 'Use a checkbox for actions that take effect immediately; use a toggle switch or button instead.' },
      { guidance: false, description: 'Wrap a disabled checkbox in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.' },
    ],
  },
  propDescriptions: {
    ref: 'ref forwarded to underlying <input>',
    label: 'label text; always rendered for a11y',
    isLabelHidden: 'visually hide label (still accessible to screen readers)',
    description: 'text below label',
    value: 'checked, unchecked, or indeterminate',
    onChange: 'callback on state change',
    changeAction: 'async action; fires after onChange, shows spinner while pending',
    isLoading: 'shows spinner + prevents interaction',
    isDisabled: 'disable checkbox',
    htmlName: 'HTML name attr for the checkbox; submits "on" when checked.',
    isOptional: 'mark field as optional (mutually exclusive w/ isRequired)',
    isRequired: 'mark field as required (mutually exclusive w/ isOptional)',
    size: 'sm (compact) or md (default)',
    onFocus: 'callback on focus',
    onBlur: 'callback on blur',
    labelIcon: 'semantic icon name or custom content before label text',
    status: 'error/warning/success with message; sets aria-invalid on error',
  },
};
