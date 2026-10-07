/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'RadioList',
  displayName: 'Radio List',
  group: 'Radio',
  category: 'Form Controls',
  keywords: ["radiolist","radio","radiogroup","radiobutton","optionlist","singlechoice","choicelist"],
  theming: {
    targets: [
      {className: 'solo-radio-list', visualProps: ['orientation', 'size']},
      {className: 'solo-radio-list-item', visualProps: ['size'], states: ['selected', 'disabled']},
      {className: 'solo-radio-indicator', visualProps: ['size'], states: ['checked', 'disabled']},
      {className: 'solo-radio-indicator-dot', visualProps: ['size']},
      {className: 'solo-radio', visualProps: ['size'], states: ['checked', 'disabled'], deprecatedFor: 'radio-indicator'},
      {className: 'solo-radio-dot', visualProps: ['size'], deprecatedFor: 'radio-indicator-dot'},
    ],
  },
  description: 'Radio group container with field integration for label, description, and status.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text for the radio group (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'The currently selected value.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback fired when the selected value changes.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'RadioListItem elements.',
      slotElements: [
        {
          __element: 'RadioListItem',
          props: {
            label: 'Option',
            value: 'option',
          },
        },
      ],
      required: true,
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
      description: 'Description text displayed below the label.',
    },
    {
      name: 'orientation',
      type: "'vertical' | 'horizontal'",
      description: 'Layout direction of the radio items.',
      default: "'vertical'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether all radio items are disabled.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute shared by the radio inputs, useful for form submissions. When omitted, a unique internal name still groups the radios.',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the group is disabled. Applies to the whole-group disabled state (isDisabled), not per item. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the radios focusable via aria-disabled (selection stays blocked). Use this instead of wrapping a disabled RadioList in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Whether the radio group is required.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Whether the field is optional (mutually exclusive with isRequired).',
      default: 'false',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: 'Status indicator ({ type, message }).',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Size of the radio controls.',
      default: "'md'",
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text for an info icon next to the label.',
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
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [
    {name: 'RadioListItem'},
  ],
  usage: {
    accessibility: [
      {
        name: 'Radio circle',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Rest', 'Hover', 'Pointer down', 'Selected'],
        description:
          'The circle edge (unselected) and fill (selected) must have at least 3:1 contrast with the surface behind them. For Hover and Pointer down, measure the final colors after the tint and the pressed overlay are applied.',
      },
    ],
    description:
      'A group of options where only one can be selected at a time. All options are visible at once, making it easy to compare choices. Use it when users need to pick one option from a small set.',
    bestPractices: [
      { guidance: true, description: 'Keep the number of options small: typically 2 to 7 choices.' },
      { guidance: true, description: 'Use clear, concise labels that differentiate each option at a glance.' },
      { guidance: true, description: "Pre-select a default option when there's a sensible default; don't leave the group empty unless the choice is optional." },
      { guidance: false, description: 'Use when multiple selections are needed; use CheckboxList instead.' },
      { guidance: false, description: 'Use for long lists; use Selector for better discoverability.' },
      { guidance: false, description: 'Use horizontal layout with more than 4 options; it wraps awkwardly.' },
      { guidance: false, description: 'Wrap a disabled RadioList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.' },
    ],
    anatomy: [
      {name: 'Header', required: false, description: 'Optional heading above the radio list.'},
      {name: 'Children', required: true, description: 'The radio list items rendered as selectable options.'},
      {name: 'Label/Value', required: true, description: 'The text label and associated value for each radio item.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'A group of options where only one can be selected at a time. All options are visible at once, making it easy to compare choices. Use it when users need to pick one option from a small set.',
    bestPractices: [
      { guidance: true, description: 'Keep the number of options small: typically 2 to 7 choices.' },
      { guidance: true, description: 'Use clear, concise labels that differentiate each option at a glance.' },
      { guidance: true, description: "Pre-select a default option when there's a sensible default; don't leave the group empty unless the choice is optional." },
      { guidance: false, description: 'Use when multiple selections are needed; use CheckboxList instead.' },
      { guidance: false, description: 'Use for long lists; use Selector for better discoverability.' },
      { guidance: false, description: 'Use horizontal layout with more than 4 options; it wraps awkwardly.' },
      { guidance: false, description: 'Wrap a disabled RadioList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.' },
    ],
    anatomy: [
      {name: 'Header', required: false, description: 'Optional heading above the radio list.'},
      {name: 'Children', required: true, description: 'The radio list items rendered as selectable options.'},
      {name: 'Label/Value', required: true, description: 'The text label and associated value for each radio item.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حاوية مجموعة أزرار اختيار مع تكامل الحقل للتسمية والوصف والحالة.',
  propDescriptions: {
    label: 'نص التسمية لمجموعة أزرار الاختيار (يُعرض دائمًا لأغراض إمكانية الوصول).',
    value: 'القيمة المحدَّدة حاليًا.',
    onChange: 'دالة استدعاء تُنفَّذ عند تغيّر القيمة المحدَّدة.',
    children: 'عناصر RadioListItem.',
    isLabelHidden: 'ما إذا كان يجب إخفاء التسمية بصريًا.',
    description: 'نص وصفي يُعرض أسفل التسمية.',
    orientation: 'اتجاه تخطيط عناصر أزرار الاختيار.',
    isDisabled: 'ما إذا كانت جميع عناصر أزرار الاختيار معطَّلة.',
    htmlName: 'سمة name في HTML المشتركة بين حقول أزرار الاختيار، وهي مفيدة لإرسال النماذج. عند حذفها، يظل اسم داخلي فريد يجمع أزرار الاختيار.',
    disabledMessage: 'توضّح سبب تعطيل المجموعة. تنطبق على حالة تعطيل المجموعة بأكملها (isDisabled)، لا على كل عنصر. مع isDisabled، تُظهر تلميحًا عند التمرير أو تركيز لوحة المفاتيح وتُبقي أزرار الاختيار قابلة للتركيز عبر aria-disabled (مع بقاء التحديد محظورًا). استخدمها بدلًا من تغليف RadioList معطَّل داخل Tooltip، إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    isRequired: 'ما إذا كانت مجموعة أزرار الاختيار مطلوبة.',
    isOptional: 'ما إذا كان الحقل اختياريًا (لا يجتمع مع isRequired).',
    status: 'مؤشر الحالة ({ type, message }).',
    size: 'حجم عناصر التحكم لأزرار الاختيار.',
    labelTooltip: 'نص التلميح لأيقونة معلومات بجوار التسمية.',
    width: 'عرض الحقل (رقم = بكسل، وتُستخدم السلسلة النصية كما هي، مثل "100%"). يحدّد حجم الحقل بأكمله (التسمية وعنصر التحكم والحالة) لتبقى متحاذية.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'مجموعة من الخيارات لا يمكن تحديد سوى خيار واحد منها في كل مرة. تكون جميع الخيارات مرئية في آن واحد، مما يسهّل المقارنة بينها. استخدمه عندما يحتاج المستخدمون إلى اختيار خيار واحد من مجموعة صغيرة.',
    bestPractices: [
      {
        guidance: true,
        description: 'اجعل عدد الخيارات صغيرًا: عادةً من 2 إلى 7 خيارات.',
      },
      {
        guidance: true,
        description: 'استخدم تسميات واضحة وموجزة تميّز كل خيار بنظرة سريعة.',
      },
      {
        guidance: true,
        description: 'حدّد خيارًا افتراضيًا مسبقًا عندما يكون هناك خيار افتراضي منطقي؛ لا تترك المجموعة فارغة إلا إذا كان الاختيار اختياريًا.',
      },
      {
        guidance: false,
        description: 'الاستخدام عند الحاجة إلى تحديدات متعددة؛ استخدم CheckboxList بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'الاستخدام مع القوائم الطويلة؛ استخدم Selector لقابلية اكتشاف أفضل.',
      },
      {
        guidance: false,
        description: 'استخدام التخطيط الأفقي مع أكثر من 4 خيارات؛ إذ يلتف بشكل غير مناسب.',
      },
      {
        guidance: false,
        description: 'تغليف RadioList معطَّل داخل Tooltip لتوضيح سبب تعطيله؛ إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'الترويسة',
        required: false,
        description: 'عنوان اختياري أعلى قائمة أزرار الاختيار.',
      },
      {
        name: 'الأبناء',
        required: true,
        description: 'عناصر قائمة أزرار الاختيار المعروضة كخيارات قابلة للتحديد.',
      },
      {
        name: 'التسمية/القيمة',
        required: true,
        description: 'التسمية النصية والقيمة المرتبطة بها لكل عنصر زر اختيار.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Radio group component for single-value selection from list of options.',
  usage: {
    description:
      'A group of options where only one can be selected at a time. All options are visible at once, making it easy to compare choices. Use it when users need to pick one option from a small set.',
    bestPractices: [
      { guidance: true, description: 'Keep the number of options small: typically 2 to 7 choices.' },
      { guidance: true, description: 'Use clear, concise labels that differentiate each option at a glance.' },
      { guidance: true, description: "Pre-select a default option when there's a sensible default; don't leave the group empty unless the choice is optional." },
      { guidance: false, description: 'Use when multiple selections are needed; use CheckboxList instead.' },
      { guidance: false, description: 'Use for long lists; use Selector for better discoverability.' },
      { guidance: false, description: 'Use horizontal layout with more than 4 options; it wraps awkwardly.' },
      { guidance: false, description: 'Wrap a disabled RadioList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.' },
    ],
    anatomy: [
      {name: 'Header', required: false, description: 'Optional heading above the radio list.'},
      {name: 'Children', required: true, description: 'The radio list items rendered as selectable options.'},
      {name: 'Label/Value', required: true, description: 'The text label and associated value for each radio item.'},
    ],
  },
};
