/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TextInput',
  displayName: 'Text Input',
  category: 'Form Controls',
  keywords: ["textinput","textfield","input","search","clearable","prefix","suffix","adornment","validation"],
  props: [
    {
      name: 'type',
      type: "'text' | 'password' | 'email'",
      description:
        'The HTML input type.',
      default: "'text'",
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the input: always rendered for accessibility.',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'Current value of the input.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string, e: ChangeEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the input value changes.',
    },
    {
      name: 'changeAction',
      type: '(value: string, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>',
      description:
        'Async action fired after onChange (if not prevented). Triggers optimistic update and shows a loading spinner while pending.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size variant of the input.',
      default: "'md'",
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hides the label while keeping it accessible to screen readers.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed between the label and input.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Displays an "Optional" indicator next to the label. Mutually exclusive with isRequired.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Displays a "Required" indicator next to the label and sets aria-required. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'onEnter',
      type: '() => void',
      description:
        'Callback fired when the user presses the Enter key. IME-safe: Enter used to commit a Japanese/Chinese/Korean conversion does not fire it.',
    },
    {
      name: 'onKeyDown',
      type: '(e: KeyboardEvent<HTMLInputElement>) => void',
      description: 'Callback fired on keydown events on the input.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables the input, preventing interaction and dimming the element.',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Makes the input read-only: the value is shown at full opacity and still submits with the form, but cannot be edited. Unlike isDisabled, a read-only input is not dimmed and stays in the tab order. isDisabled takes precedence when both are set.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the input focusable via aria-disabled (the field becomes read-only). Use this instead of wrapping a disabled TextInput in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Puts the input in a loading state, showing a spinner and setting aria-busy.',
      default: 'false',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when the input is empty.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Tooltip text displayed in an info icon at the end of the label.',
    },
    {
      name: 'startIcon',
      type: 'ReactNode | IconType',
      description:
        'SVG icon component displayed at the start of the input. See the Icon docs (`IconName`) for valid semantic names.',
    },
    {
      name: 'status',
      type: "{type: 'error' | 'warning' | 'success', message?: string}",
      description:
        'Validation status: applies a colored border and status icon. If message is provided, displays a floating message below the input. Error type also sets aria-invalid.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing; tooltip hides the message box and surfaces it in a tooltip on the status icon.',
      default: "'attached'",
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        'Shows a clear (\u00d7) button when the input has a value. Clicking it clears the value and returns focus to the input.',
      default: 'false',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Automatically focuses the input on mount.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for the input, useful for form submissions.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
    {
      name: 'autoComplete',
      type: 'string',
      description:
        'The native autocomplete attribute, forwarded to the input unchanged. Does not affect the controlled value.',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-text-input', visualProps: ['size', 'status'], states: ['disabled', 'readonly']},
    ],
  },
  usage: {
    description:
      'TextInput collects short-form text like names, emails, or search queries. Use it for single-line values where the expected input is brief. Pair it with validation status to guide users through required or formatted fields.',
    bestPractices: [
      {guidance: true, description: 'Always provide a visible label so users know what the field is for. Only hide the label when surrounding context makes it obvious, like a search bar with a magnifying-glass icon.'},
      {guidance: true, description: 'Use validation status with a message to explain what went wrong: "Email must include @" is better than just turning the border red.'},
      {guidance: true, description: 'Size the input to match the expected content length so users can gauge how much to type: small for zip codes, medium for names, large for URLs.'},
      {guidance: true, description: 'Add a clear button for search and filter inputs so users can quickly reset without selecting all text.'},
      {guidance: false, description: "Don't use placeholder text as a replacement for a label; placeholders disappear on focus and are not reliably read by screen readers."},
      {guidance: false, description: "Don't use TextInput for multi-line content like comments or descriptions; use TextArea instead."},
      {guidance: false, description: "Don't mark every field as required; only flag mandatory fields so users are not overwhelmed by validation errors."},
      {guidance: false, description: "Don't wrap a disabled TextInput in Tooltip to explain why it's disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead."},
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'Text that identifies the field. Always rendered for accessibility even when visually hidden.'},
      {name: 'Description', required: false, description: 'Helper text between the label and the input that provides additional context or formatting hints.'},
      {name: 'Start icon', required: false, description: 'A leading icon inside the input that hints at the expected content, like a magnifying glass for search.'},
      {name: 'Placeholder', required: false, description: 'Hint text shown when the input is empty. Disappears on focus.'},
      {name: 'Clear button', required: false, description: 'A trailing × button that resets the value and returns focus to the input.'},
      {name: 'Spinner', required: false, description: 'Loading indicator that appears during async actions like server-side validation.'},
      {name: 'Status icon', required: false, description: 'A trailing icon (error, warning, or success) that communicates validation state.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'TextInput',
  displayName: 'Text Input',
  props: [
    {
      name: 'type',
      type: "'text' | 'password' | 'email'",
      description: 'HTML 输入框类型。',
      default: "'text'",
    },
    {
      name: 'label',
      type: 'string',
      description:
        '输入框的标签文本：始终渲染以确保无障碍性。',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: '输入框的当前值。',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string, e: ChangeEvent<HTMLInputElement>) => void',
      description: '输入框值变化时触发的回调。',
    },
    {
      name: 'changeAction',
      type: '(value: string, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>',
      description:
        '在 onChange 之后（如果未被阻止）触发的异步操作。触发乐观更新并在挂起时显示加载旋转器。',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: '输入框的尺寸变体。',
      default: "'md'",
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        '视觉上隐藏标签，同时保持屏幕阅读器的无障碍性。',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: '显示在标签和输入框之间的描述文本。',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        '在标签旁显示"可选"指示器。与 isRequired 互斥。',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        '在标签旁显示"必填"指示器并设置 aria-required。与 isOptional 互斥。',
      default: 'false',
    },
    {
      name: 'onEnter',
      type: '() => void',
      description: '用户按下 Enter 键时触发的回调。兼容输入法：用于确认日文/中文/韩文转换的 Enter 不会触发它。',
    },
    {
      name: 'onKeyDown',
      type: '(e: KeyboardEvent<HTMLInputElement>) => void',
      description: '输入框上发生 keydown 事件时触发的回调。',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        '禁用输入框，阻止交互并使元素变暗。',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        '将输入框设为只读：值以完整不透明度显示并仍随表单提交，但无法编辑。与 isDisabled 不同，只读输入框不会变暗，并保留在 Tab 顺序中。同时设置时 isDisabled 优先。',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        '说明输入框被禁用的原因。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持输入框可聚焦（字段变为只读）。请使用此属性，而不是用 Tooltip 包裹已禁用的 TextInput——已禁用的控件会吞掉外部 Tooltip 所需的悬停事件。',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        '使输入框进入加载状态，显示旋转器并设置 aria-busy。',
      default: 'false',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: '输入框为空时显示的占位符文本。',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        '在标签末尾的信息图标中显示的工具提示文本。',
    },
    {
      name: 'startIcon',
      type: 'ReactNode | IconType',
      description:
        '显示在输入框起始位置的 SVG 图标组件（例如来自 heroicons 或 lucide）。',
    },
    {
      name: 'status',
      type: "{type: 'error' | 'warning' | 'success', message?: string}",
      description:
        '验证状态：应用彩色边框和状态图标。如果提供了 message，在输入框下方显示浮动消息。错误类型还会设置 aria-invalid。',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        '状态消息相对于输入框的放置方式。attached 直接叠加在输入框下方（带边框处理）；detached 作为独立元素浮于下方并留有间距；tooltip 隐藏消息框，并在状态图标上以提示气泡形式显示。',
      default: "'attached'",
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: '输入有值时显示清除 (×) 按鈕。点击后清空值并将焦点返回输入框。',
      default: 'false',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: '挂载时自动聚焦输入框。',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        '输入框的 HTML name 属性，用于表单提交。',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: '字段宽度（数字为像素，字符串按原样使用，如 "100%"）。作用于整个字段（标签、控件和状态），使其保持对齐。',
    },
    {
      name: 'autoComplete',
      type: 'string',
      description:
        '原生 autocomplete 属性，原样转发给输入框。不影响受控的值。',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-text-input', visualProps: ['size', 'status'], states: ['disabled', 'readonly']},
    ],
  },
  usage: {
    description:
      'TextInput collects short-form text like names, emails, or search queries. Use it for single-line values where the expected input is brief. Pair it with validation status to guide users through required or formatted fields.',
    bestPractices: [
      {guidance: true, description: 'Always provide a visible label so users know what the field is for. Only hide the label when surrounding context makes it obvious, like a search bar with a magnifying-glass icon.'},
      {guidance: true, description: 'Use validation status with a message to explain what went wrong: "Email must include @" is better than just turning the border red.'},
      {guidance: true, description: 'Size the input to match the expected content length so users can gauge how much to type: small for zip codes, medium for names, large for URLs.'},
      {guidance: true, description: 'Add a clear button for search and filter inputs so users can quickly reset without selecting all text.'},
      {guidance: false, description: "Don't use placeholder text as a replacement for a label; placeholders disappear on focus and are not reliably read by screen readers."},
      {guidance: false, description: "Don't use TextInput for multi-line content like comments or descriptions; use TextArea instead."},
      {guidance: false, description: "Don't mark every field as required; only flag mandatory fields so users are not overwhelmed by validation errors."},
      {guidance: false, description: "Don't wrap a disabled TextInput in Tooltip to explain why it's disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead."},
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'Text that identifies the field. Always rendered for accessibility even when visually hidden.'},
      {name: 'Description', required: false, description: 'Helper text between the label and the input that provides additional context or formatting hints.'},
      {name: 'Start icon', required: false, description: 'A leading icon inside the input that hints at the expected content, like a magnifying glass for search.'},
      {name: 'Placeholder', required: false, description: 'Hint text shown when the input is empty. Disappears on focus.'},
      {name: 'Clear button', required: false, description: 'A trailing × button that resets the value and returns focus to the input.'},
      {name: 'Spinner', required: false, description: 'Loading indicator that appears during async actions like server-side validation.'},
      {name: 'Status icon', required: false, description: 'A trailing icon (error, warning, or success) that communicates validation state.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'يجمع TextInput نصوصًا قصيرة مثل الأسماء أو عناوين البريد الإلكتروني أو استعلامات البحث في حقل إدخال من سطر واحد.',
  propDescriptions: {
    type: 'نوع حقل الإدخال في HTML.',
    label: 'نص التسمية لحقل الإدخال: يُعرض دائمًا لدعم إمكانية الوصول.',
    value: 'القيمة الحالية لحقل الإدخال.',
    onChange: 'دالة استدعاء تُنفَّذ عند تغيّر قيمة حقل الإدخال.',
    changeAction:
      'إجراء غير متزامن يُنفَّذ بعد onChange (ما لم يُمنع). يُطلق تحديثًا متفائلًا ويعرض مؤشر تحميل دوّارًا أثناء الانتظار.',
    size: 'نمط حجم حقل الإدخال.',
    isLabelHidden:
      'يُخفي التسمية بصريًا مع إبقائها متاحة لقارئات الشاشة.',
    description: 'نص وصفي يُعرض بين التسمية وحقل الإدخال.',
    isOptional:
      'يعرض مؤشر "اختياري" بجوار التسمية. لا يُستخدم مع isRequired في آنٍ واحد.',
    isRequired:
      'يعرض مؤشر "مطلوب" بجوار التسمية ويضبط aria-required. لا يُستخدم مع isOptional في آنٍ واحد.',
    onEnter:
      'دالة استدعاء تُنفَّذ عندما يضغط المستخدم المفتاح Enter. آمنة مع محرّرات أسلوب الإدخال (IME): لا يُطلقها الضغط على Enter لتأكيد تحويل ياباني/صيني/كوري.',
    onKeyDown: 'دالة استدعاء تُنفَّذ عند أحداث keydown على حقل الإدخال.',
    isDisabled:
      'يعطّل حقل الإدخال، فيمنع التفاعل ويخفّت العنصر.',
    isReadOnly:
      'يجعل حقل الإدخال للقراءة فقط: تُعرض القيمة بعتامة كاملة وتُرسل مع النموذج، لكن لا يمكن تعديلها. بخلاف isDisabled، لا يُخفَّت حقل الإدخال للقراءة فقط ويبقى ضمن ترتيب التنقّل بالمفتاح Tab. تكون الأولوية لـ isDisabled عند ضبط الاثنين معًا.',
    disabledMessage:
      'يوضّح سبب تعطيل حقل الإدخال. مع isDisabled، يعرض تلميحًا عند التمرير أو التركيز بلوحة المفاتيح ويُبقي حقل الإدخال قابلًا للتركيز عبر aria-disabled (يصبح الحقل للقراءة فقط). استخدم هذه الخاصية بدلًا من تغليف TextInput معطَّل داخل Tooltip، إذ تبتلع العناصر المعطَّلة أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    isLoading:
      'يضع حقل الإدخال في حالة التحميل، فيعرض مؤشرًا دوّارًا ويضبط aria-busy.',
    placeholder: 'نص إرشادي يظهر عندما يكون حقل الإدخال فارغًا.',
    labelTooltip:
      'نص تلميح يُعرض في أيقونة معلومات عند نهاية التسمية.',
    startIcon:
      'مكوّن أيقونة SVG يُعرض في بداية حقل الإدخال. راجع توثيق Icon (`IconName`) لمعرفة الأسماء الدلالية الصالحة.',
    status:
      'حالة التحقق: تطبّق حدًّا ملوّنًا وأيقونة حالة. إذا قُدّمت message، تُعرض رسالة عائمة أسفل حقل الإدخال. يضبط نوع الخطأ أيضًا aria-invalid.',
    statusVariant:
      'طريقة تموضع رسالة الحالة بالنسبة إلى حقل الإدخال. يتراكب attached مباشرةً أسفل حقل الإدخال (بمعالجة ذات حدود)؛ ويطفو detached أسفله كعنصر مستقل مع تباعد؛ ويُخفي tooltip صندوق الرسالة ويُظهرها في تلميح على أيقونة الحالة.',
    hasClear:
      'يعرض زر مسح (×) عندما يحتوي حقل الإدخال على قيمة. يؤدي النقر عليه إلى مسح القيمة وإعادة التركيز إلى حقل الإدخال.',
    hasAutoFocus: 'يركّز على حقل الإدخال تلقائيًا عند التركيب.',
    htmlName:
      'السمة name في HTML لحقل الإدخال، وهي مفيدة لإرسال النماذج.',
    width:
      'عرض الحقل (رقم = بكسل، ويُستخدم النص كما هو، مثل "100%"). يحدّد حجم الحقل بأكمله (التسمية وعنصر التحكم والحالة) لتبقى متحاذية.',
    autoComplete:
      'السمة الأصلية autocomplete، تُمرَّر إلى حقل الإدخال دون تغيير. لا تؤثّر في القيمة المتحكَّم بها.',
  },
  usage: {
    description:
      'يجمع TextInput نصوصًا قصيرة مثل الأسماء أو عناوين البريد الإلكتروني أو استعلامات البحث. استخدمه للقيم ذات السطر الواحد حين يكون الإدخال المتوقّع موجزًا. اقرنه بحالة التحقق لإرشاد المستخدمين خلال الحقول المطلوبة أو ذات التنسيق المحدّد.',
    bestPractices: [
      {guidance: true, description: 'وفّر دائمًا تسمية مرئية ليعرف المستخدمون الغرض من الحقل. لا تُخفِ التسمية إلا إذا كان السياق المحيط يجعل الغرض واضحًا، كشريط بحث بأيقونة عدسة مكبّرة.'},
      {guidance: true, description: 'استخدم حالة التحقق مع رسالة توضّح الخطأ: "يجب أن يتضمّن البريد الإلكتروني @" أفضل من مجرد تحويل الحدّ إلى اللون الأحمر.'},
      {guidance: true, description: 'اضبط حجم حقل الإدخال ليطابق طول المحتوى المتوقّع كي يقدّر المستخدمون مقدار ما يكتبونه: صغير للرموز البريدية، ومتوسط للأسماء، وكبير لعناوين URL.'},
      {guidance: true, description: 'أضف زر مسح لحقول البحث والتصفية ليتمكّن المستخدمون من إعادة التعيين بسرعة دون تحديد النص كله.'},
      {guidance: false, description: 'لا تستخدم النص الإرشادي بديلًا عن التسمية؛ فالنصوص الإرشادية تختفي عند التركيز ولا تقرؤها قارئات الشاشة بشكل موثوق.'},
      {guidance: false, description: 'لا تستخدم TextInput للمحتوى متعدّد الأسطر كالتعليقات أو الأوصاف؛ استخدم TextArea بدلًا منه.'},
      {guidance: false, description: 'لا تجعل كل حقل مطلوبًا؛ حدّد الحقول الإلزامية فقط كي لا يُثقَل المستخدمون بأخطاء التحقق.'},
      {guidance: false, description: 'لا تغلّف TextInput معطَّلًا داخل Tooltip لتوضيح سبب تعطيله؛ فالعناصر المعطَّلة تبتلع أحداث التمرير التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.'},
    ],
    anatomy: [
      {name: 'التسمية', required: true, description: 'نص يعرّف الحقل. يُعرض دائمًا لدعم إمكانية الوصول حتى عند إخفائه بصريًا.'},
      {name: 'الوصف', required: false, description: 'نص مساعد بين التسمية وحقل الإدخال يقدّم سياقًا إضافيًا أو تلميحات حول التنسيق.'},
      {name: 'أيقونة البداية', required: false, description: 'أيقونة في مقدّمة حقل الإدخال تلمّح إلى المحتوى المتوقّع، كعدسة مكبّرة للبحث.'},
      {name: 'النص الإرشادي', required: false, description: 'نص تلميحي يظهر عندما يكون حقل الإدخال فارغًا. يختفي عند التركيز.'},
      {name: 'زر المسح', required: false, description: 'زر × في نهاية الحقل يعيد تعيين القيمة ويعيد التركيز إلى حقل الإدخال.'},
      {name: 'مؤشر التحميل', required: false, description: 'مؤشر تحميل يظهر أثناء الإجراءات غير المتزامنة مثل التحقق من جهة الخادم.'},
      {name: 'أيقونة الحالة', required: false, description: 'أيقونة في نهاية الحقل (خطأ أو تحذير أو نجاح) تعبّر عن حالة التحقق.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Text input for collecting user text w/ label, description, validation status, optional/required indicators.',
  usage: {
    description:
      'TextInput collects short-form text like names, emails, or search queries. Use it for single-line values where the expected input is brief. Pair it with validation status to guide users through required or formatted fields.',
    bestPractices: [
      {guidance: true, description: 'Always provide a visible label so users know what the field is for. Only hide the label when surrounding context makes it obvious, like a search bar with a magnifying-glass icon.'},
      {guidance: true, description: 'Use validation status with a message to explain what went wrong: "Email must include @" is better than just turning the border red.'},
      {guidance: true, description: 'Size the input to match the expected content length so users can gauge how much to type: small for zip codes, medium for names, large for URLs.'},
      {guidance: true, description: 'Add a clear button for search and filter inputs so users can quickly reset without selecting all text.'},
      {guidance: false, description: "Don't use placeholder text as a replacement for a label; placeholders disappear on focus and are not reliably read by screen readers."},
      {guidance: false, description: "Don't use TextInput for multi-line content like comments or descriptions; use TextArea instead."},
      {guidance: false, description: "Don't mark every field as required; only flag mandatory fields so users are not overwhelmed by validation errors."},
      {guidance: false, description: "Don't wrap a disabled TextInput in Tooltip to explain why it's disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead."},
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'Text that identifies the field. Always rendered for accessibility even when visually hidden.'},
      {name: 'Description', required: false, description: 'Helper text between the label and the input that provides additional context or formatting hints.'},
      {name: 'Start icon', required: false, description: 'A leading icon inside the input that hints at the expected content, like a magnifying glass for search.'},
      {name: 'Placeholder', required: false, description: 'Hint text shown when the input is empty. Disappears on focus.'},
      {name: 'Clear button', required: false, description: 'A trailing × button that resets the value and returns focus to the input.'},
      {name: 'Spinner', required: false, description: 'Loading indicator that appears during async actions like server-side validation.'},
      {name: 'Status icon', required: false, description: 'A trailing icon (error, warning, or success) that communicates validation state.'},
    ],
  },
  propDescriptions: {
    type: 'HTML input type.',
    label: 'Label text for input; always rendered for a11y.',
    value: 'Current input value.',
    onChange: 'Fired on input value change.',
    changeAction: 'Async action after onChange (if not prevented). Triggers optimistic update+spinner while pending.',
    size: 'Size variant of input.',
    isLabelHidden: 'Visually hides label; keeps screen reader access.',
    description: 'Description text between label+input.',
    isOptional: 'Shows "Optional" indicator. Mutually exclusive w/ isRequired.',
    isRequired: 'Shows "Required" indicator+sets aria-required. Mutually exclusive w/ isOptional.',
    isDisabled: 'Disables input, prevents interaction, dims element.',
    isReadOnly:
      'Read-only: value visible + still submits, but not editable. Unlike isDisabled: not dimmed, stays in tab order.',
    disabledMessage:
      'Explains why input is disabled. With isDisabled, shows tooltip on hover/focus + keeps input focusable via aria-disabled (field becomes read-only). Use instead of wrapping a disabled TextInput in Tooltip.',
    isLoading: 'Loading state w/ spinner+aria-busy.',
    placeholder: 'Placeholder when input empty.',
    labelTooltip: 'Tooltip in info icon at label end.',
    startIcon: 'SVG icon at input start (e.g. heroicons or lucide).',
    status: 'Validation status; colored border+icon. Message floats below. Error sets aria-invalid.',
    statusVariant: 'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon.',
    hasClear: 'Shows clear button when input has value. Clears value on click.',
    hasAutoFocus: 'Auto-focus input on mount.',
    htmlName: 'HTML name attr for form submissions.',
    autoComplete: 'Native autocomplete attr, forwarded unchanged. Does not affect the controlled value.',
  },
};
