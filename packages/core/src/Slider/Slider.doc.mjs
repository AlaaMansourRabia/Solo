/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Label',
    required: true,
    description:
      'Text identifying the numeric setting controlled by the slider.',
  },
  {
    name: 'Description',
    required: false,
    description: 'Helper text between the label and the slider control.',
  },
  {
    name: 'Slider',
    required: true,
    description:
      'Control row containing the track, thumb or thumbs, and optional text value.',
  },
  {
    name: 'Interactive control',
    required: true,
    description:
      'Pointer and keyboard interaction surface containing the rail, fill, marks, and thumbs.',
  },
  {
    name: 'Track',
    required: true,
    description: 'Background rail representing the available numeric range.',
  },
  {
    name: 'Filled range',
    required: true,
    description:
      'Accent segment from the minimum to a single value, or between two range values.',
  },
  {
    name: 'Tick mark',
    required: false,
    description: 'Position marker supplied through the marks collection.',
  },
  {
    name: 'Mark label',
    required: false,
    description: 'Optional text displayed beside a tick mark.',
  },
  {
    name: 'Thumb',
    required: true,
    description:
      'Draggable value indicator; range mode renders a minimum and maximum thumb.',
  },
  {
    name: 'Value display',
    required: false,
    description:
      'Formatted current value shown beside the slider when valueDisplay is text.',
  },
  {
    name: 'Value tooltip',
    required: false,
    description:
      'Formatted current value shown in a tooltip when valueDisplay is tooltip.',
  },
  {
    name: 'Status message',
    required: false,
    description: 'Error, warning, or success message below the slider.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Slider',
  displayName: 'Slider',
  category: 'Form Controls',
  keywords: [
    'slider',
    'range',
    'slidebar',
    'trackbar',
    'scrubber',
    'knob',
    'thumb',
    'rangeslider',
  ],
  playground: {
    defaults: {
      label: 'Volume',
      value: 50,
      // Give the properties-tab preview a defined width so the track has room
      // to render and stays draggable/interactive (the slider track grows to
      // fill its container, which can collapse without an explicit width).
      width: 300,
    },
  },
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'value',
      type: 'number | [number, number]',
      description:
        'Current value: a `number` for single thumb mode or `[number, number]` for range mode. Range mode also accepts minStepsBetweenThumbs (number, default 0), the minimum number of steps kept between the thumbs so they cannot overlap.',
      required: true,
    },
    {
      name: 'onChange',
      type: '((value: number) => void) | ((value: [number, number]) => void)',
      description: 'Callback fired on value change during drag.',
    },
    {
      name: 'onChangeEnd',
      type: '((value: number) => void) | ((value: [number, number]) => void)',
      description: 'Callback fired when drag ends.',
    },
    {
      name: 'min',
      type: 'number',
      description: 'Minimum value.',
      default: '0',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum value.',
      default: '100',
    },
    {
      name: 'step',
      type: 'number',
      description: 'Step increment.',
      default: '1',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description: 'Orientation of the slider.',
      default: "'horizontal'",
    },
    {
      name: 'formatValue',
      type: '(value: number) => string',
      description:
        'Custom value formatting function used for display and `aria-valuetext`.',
    },
    {
      name: 'valueDisplay',
      type: "'tooltip' | 'text' | 'none'",
      description: 'How the current value is displayed.',
      default: "'tooltip'",
    },
    {
      name: 'marks',
      type: 'Array<{ value: number; label?: string }>',
      description:
        'Tick marks at specified positions with optional labels. Unfilled marks use the track color; marks inside the filled region (at or behind the thumb, or between the thumbs in range mode) use the fill color.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the slider is disabled.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for form submissions. Renders hidden inputs carrying the current value (two entries in range mode).',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the slider is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the thumb focusable via aria-disabled (value changes stay blocked). Use this instead of wrapping a disabled Slider in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Whether the field is optional.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Whether the field is required.',
      default: 'false',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Whether to visually hide the label.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text rendered below the label.',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Status indicator object (`{ type, message }`) for validation feedback.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text for an info icon displayed next to the label.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
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
      {
        className: 'solo-slider',
        visualProps: ['orientation'],
        states: ['disabled'],
      },
      {
        className: 'solo-slider-control',
        visualProps: ['orientation'],
        states: ['disabled'],
      },
      {className: 'solo-slider-track', visualProps: ['orientation']},
      {
        className: 'solo-slider-thumb',
        visualProps: ['orientation'],
        states: ['disabled'],
      },
    ],
  },
  usage: {
    accessibility: [
      {
        name: 'Thumb',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Rest', 'Hover', 'Pointer down'],
        description:
          'The thumb must have at least 3:1 contrast with the track and the surface behind it. Pointer down is the whole drag: measure the thumb with the pressed overlay applied.',
      },
    ],
    anatomy,
    description:
      'A draggable control for selecting a numeric value or range within defined bounds. Supports single value and range selection, tick marks, custom value formatting, and vertical orientation. Use it when users need to explore a continuous range, such as volume, price, or percentage.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always provide a label, even if visually hidden, so the slider is accessible to screen readers.',
      },
      {
        guidance: true,
        description:
          'Format values with meaningful units like "$50" or "75%" instead of raw numbers.',
      },
      {
        guidance: false,
        description:
          'Use for precise numeric entry; pair with a text input or use NumberInput instead.',
      },
      {
        guidance: false,
        description:
          'Set a step size so large that only a few positions are possible; use SegmentedControl or radio buttons instead.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled slider in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Slider',
  displayName: 'Slider',
  props: [
    {
      name: 'label',
      type: 'string',
      description: '标签文本（始终渲染以确保无障碍可访问性）。',
      required: true,
    },
    {
      name: 'value',
      type: 'number | [number, number]',
      description:
        '当前值——`number` 用于单滑块模式，`[number, number]` 用于范围模式。范围模式还接受 minStepsBetweenThumbs（number，默认 0），即两个滑块之间保持的最小步数，防止重叠。',
      required: true,
    },
    {
      name: 'onChange',
      type: '((value: number) => void) | ((value: [number, number]) => void)',
      description: '拖拽过程中值变更时触发的回调。',
    },
    {
      name: 'onChangeEnd',
      type: '((value: number) => void) | ((value: [number, number]) => void)',
      description: '拖拽结束时触发的回调。',
    },
    {
      name: 'min',
      type: 'number',
      description: '最小值。',
      default: '0',
    },
    {
      name: 'max',
      type: 'number',
      description: '最大值。',
      default: '100',
    },
    {
      name: 'step',
      type: 'number',
      description: '步进增量。',
      default: '1',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description: '滑块的方向。',
      default: "'horizontal'",
    },
    {
      name: 'formatValue',
      type: '(value: number) => string',
      description: '自定义值格式化函数，用于显示和 `aria-valuetext`。',
    },
    {
      name: 'valueDisplay',
      type: "'tooltip' | 'text' | 'none'",
      description: '当前值的显示方式。',
      default: "'tooltip'",
    },
    {
      name: 'marks',
      type: 'Array<{ value: number; label?: string }>',
      description:
        '在指定位置的刻度标记，带可选标签。未填充区域的标记使用轨道颜色；填充区域内的标记使用强调色。',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: '是否禁用滑块。',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        '用于表单提交的 HTML name 属性。渲染携带当前值的隐藏输入（范围模式下为两个条目）。',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the slider is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the thumb focusable via aria-disabled (value changes stay blocked). Use this instead of wrapping a disabled Slider in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: '字段是否为可选。',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: '字段是否为必填。',
      default: 'false',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: '是否在视觉上隐藏标签。',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: '标签下方渲染的描述文本。',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: '验证反馈的状态指示器对象（`{ type, message }`）。',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: '标签旁信息图标的提示文本。',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: '字段宽度（数字为像素，字符串按原样使用，如 "100%"）。作用于整个字段（标签、控件和状态），使其保持对齐。',
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
      {
        className: 'solo-slider',
        visualProps: ['orientation'],
        states: ['disabled'],
      },
      {
        className: 'solo-slider-control',
        visualProps: ['orientation'],
        states: ['disabled'],
      },
      {className: 'solo-slider-track', visualProps: ['orientation']},
      {
        className: 'solo-slider-thumb',
        visualProps: ['orientation'],
        states: ['disabled'],
      },
    ],
  },
  usage: {
    anatomy,
    description:
      'A draggable control for selecting a numeric value or range within defined bounds. Supports single value and range selection, tick marks, custom value formatting, and vertical orientation. Use it when users need to explore a continuous range, such as volume, price, or percentage.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always provide a label, even if visually hidden, so the slider is accessible to screen readers.',
      },
      {
        guidance: true,
        description:
          'Format values with meaningful units like "$50" or "75%" instead of raw numbers.',
      },
      {
        guidance: false,
        description:
          'Use for precise numeric entry; pair with a text input or use NumberInput instead.',
      },
      {
        guidance: false,
        description:
          'Set a step size so large that only a few positions are possible; use SegmentedControl or radio buttons instead.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled slider in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'عنصر تحكم قابل للسحب لتحديد قيمة رقمية أو نطاق ضمن حدود معيّنة.',
  propDescriptions: {
    label: 'نص التسمية (يُعرض دائمًا لأغراض إمكانية الوصول).',
    value: 'القيمة الحالية: `number` لوضع المقبض الواحد أو `[number, number]` لوضع النطاق. يقبل وضع النطاق أيضًا minStepsBetweenThumbs (رقم، الافتراضي 0)، وهو الحد الأدنى لعدد الخطوات المحفوظة بين المقبضين حتى لا يتداخلا.',
    onChange: 'دالة استدعاء تُنفَّذ عند تغيّر القيمة أثناء السحب.',
    onChangeEnd: 'دالة استدعاء تُنفَّذ عند انتهاء السحب.',
    min: 'القيمة الدنيا.',
    max: 'القيمة القصوى.',
    step: 'مقدار الزيادة في كل خطوة.',
    orientation: 'اتجاه شريط التمرير.',
    formatValue: 'دالة تنسيق مخصّصة للقيمة تُستخدم للعرض ولـ `aria-valuetext`.',
    valueDisplay: 'طريقة عرض القيمة الحالية.',
    marks: 'علامات تدريج في مواضع محددة مع تسميات اختيارية. تستخدم العلامات غير المملوءة لون المسار؛ أما العلامات الواقعة داخل المنطقة المملوءة (عند المقبض أو خلفه، أو بين المقبضين في وضع النطاق) فتستخدم لون التعبئة.',
    isDisabled: 'ما إذا كان شريط التمرير معطَّلًا.',
    htmlName: 'سمة name في HTML لإرسال النماذج. تعرض حقول إدخال مخفية تحمل القيمة الحالية (إدخالان في وضع النطاق).',
    disabledMessage: 'توضّح سبب تعطيل شريط التمرير. مع isDisabled، تُظهر تلميحًا عند التمرير أو تركيز لوحة المفاتيح وتُبقي المقبض قابلًا للتركيز عبر aria-disabled (مع بقاء تغيير القيمة محظورًا). استخدمها بدلًا من تغليف Slider معطَّل داخل Tooltip، إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    isOptional: 'ما إذا كان الحقل اختياريًا.',
    isRequired: 'ما إذا كان الحقل مطلوبًا.',
    isLabelHidden: 'ما إذا كان يجب إخفاء التسمية بصريًا.',
    description: 'نص وصفي يُعرض أسفل التسمية.',
    status: 'كائن مؤشر الحالة (`{ type, message }`) لملاحظات التحقق.',
    labelTooltip: 'نص التلميح لأيقونة معلومات تُعرض بجوار التسمية.',
    width: 'عرض الحقل (رقم = بكسل، وتُستخدم السلسلة النصية كما هي، مثل "100%"). يحدّد حجم الحقل بأكمله (التسمية وعنصر التحكم والحالة) لتبقى متحاذية.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'عنصر تحكم قابل للسحب لتحديد قيمة رقمية أو نطاق ضمن حدود معيّنة. يدعم تحديد قيمة واحدة أو نطاق، وعلامات التدريج، والتنسيق المخصّص للقيم، والاتجاه العمودي. استخدمه عندما يحتاج المستخدمون إلى استكشاف نطاق متصل، مثل مستوى الصوت أو السعر أو النسبة المئوية.',
    bestPractices: [
      {
        guidance: true,
        description: 'وفّر دائمًا تسمية، حتى لو كانت مخفية بصريًا، ليكون شريط التمرير قابلًا للوصول لقارئات الشاشة.',
      },
      {
        guidance: true,
        description: 'نسّق القيم بوحدات ذات معنى مثل "$50" أو "75%" بدلًا من الأرقام الخام.',
      },
      {
        guidance: false,
        description: 'الاستخدام لإدخال أرقام دقيقة؛ اقرنه بحقل إدخال نصي أو استخدم NumberInput بدلًا منه.',
      },
      {
        guidance: false,
        description: 'تعيين حجم خطوة كبير لدرجة لا تتيح سوى مواضع قليلة؛ استخدم SegmentedControl أو أزرار الاختيار بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'تغليف شريط تمرير معطَّل داخل Tooltip لتوضيح سبب تعطيله؛ إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'التسمية',
        required: true,
        description: 'نص يحدّد الإعداد الرقمي الذي يتحكم فيه شريط التمرير.',
      },
      {
        name: 'الوصف',
        required: false,
        description: 'نص مساعد بين التسمية وعنصر التحكم في شريط التمرير.',
      },
      {
        name: 'شريط التمرير',
        required: true,
        description: 'صف التحكم الذي يحتوي على المسار، والمقبض أو المقبضين، وقيمة نصية اختيارية.',
      },
      {
        name: 'عنصر التحكم التفاعلي',
        required: true,
        description: 'سطح التفاعل بالمؤشر ولوحة المفاتيح الذي يحتوي على السكة والتعبئة والعلامات والمقابض.',
      },
      {
        name: 'المسار',
        required: true,
        description: 'سكة الخلفية التي تمثّل النطاق الرقمي المتاح.',
      },
      {
        name: 'النطاق المملوء',
        required: true,
        description: 'مقطع مميّز من الحد الأدنى حتى قيمة واحدة، أو بين قيمتي النطاق.',
      },
      {
        name: 'علامة التدريج',
        required: false,
        description: 'علامة موضع تُوفَّر عبر مجموعة marks.',
      },
      {
        name: 'تسمية العلامة',
        required: false,
        description: 'نص اختياري يُعرض بجوار علامة التدريج.',
      },
      {
        name: 'المقبض',
        required: true,
        description: 'مؤشر قيمة قابل للسحب؛ يعرض وضع النطاق مقبضًا للحد الأدنى وآخر للحد الأقصى.',
      },
      {
        name: 'عرض القيمة',
        required: false,
        description: 'القيمة الحالية المنسّقة المعروضة بجوار شريط التمرير عندما تكون valueDisplay هي text.',
      },
      {
        name: 'تلميح القيمة',
        required: false,
        description: 'القيمة الحالية المنسّقة المعروضة في تلميح عندما تكون valueDisplay هي tooltip.',
      },
      {
        name: 'رسالة الحالة',
        required: false,
        description: 'رسالة خطأ أو تحذير أو نجاح أسفل شريط التمرير.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    anatomy,
    description:
      'A draggable control for selecting a numeric value or range within defined bounds. Supports single value and range selection, tick marks, custom value formatting, and vertical orientation. Use it when users need to explore a continuous range, such as volume, price, or percentage.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always provide a label, even if visually hidden, so the slider is accessible to screen readers.',
      },
      {
        guidance: true,
        description:
          'Format values with meaningful units like "$50" or "75%" instead of raw numbers.',
      },
      {
        guidance: false,
        description:
          'Use for precise numeric entry; pair with a text input or use NumberInput instead.',
      },
      {
        guidance: false,
        description:
          'Set a step size so large that only a few positions are possible; use SegmentedControl or radio buttons instead.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled slider in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    label: 'Label text (always rendered for a11y).',
    value:
      'Current value; number for single thumb, [number, number] for range (range also takes minStepsBetweenThumbs, default 0, to prevent overlap).',
    onChange: 'Fired on value change during drag.',
    onChangeEnd: 'Fired when drag ends.',
    min: 'Minimum value.',
    max: 'Maximum value.',
    step: 'Step increment.',
    orientation: 'Slider orientation.',
    formatValue: 'Custom value formatting fn for display + aria-valuetext.',
    valueDisplay: 'How current value is displayed.',
    marks:
      'Tick marks at specified positions w/ optional labels. Unfilled marks use the track color; filled marks use the accent color.',
    isDisabled: 'Whether slider is disabled.',
    htmlName:
      'HTML name attr; hidden inputs carry the value (two in range mode).',
    isOptional: 'Whether field is optional.',
    isRequired: 'Whether field is required.',
    isLabelHidden: 'Visually hide label.',
    description: 'Description text below label.',
    status: 'Status indicator ({type, message}) for validation feedback.',
    labelTooltip: 'Tooltip text for info icon next to label.',
    className: 'Tailwind layout classes; merged via cn(), so conflicting utilities override defaults.',
  },
};
