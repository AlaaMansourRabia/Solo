/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Group',
    required: true,
    description: 'Container for the labeled checkbox group.',
  },
  {
    name: 'Group label',
    required: true,
    description: 'Text identifying what the checkbox options represent.',
  },
  {
    name: 'Description',
    required: false,
    description: 'Helper text below the group label.',
  },
  {
    name: 'Options list',
    required: true,
    description: 'List containing the available checkbox options.',
  },
  {
    name: 'Option row',
    required: true,
    description: 'Selectable row containing one option.',
  },
  {
    name: 'Checkbox',
    required: true,
    description: 'Selection indicator for an option.',
  },
  {
    name: 'Option label',
    required: true,
    description: 'Primary content identifying an option.',
  },
  {
    name: 'Option description',
    required: false,
    description: 'Secondary text below an option label.',
  },
  {
    name: 'End content',
    required: false,
    description: 'Caller-provided content at the end of an option row.',
  },
  {
    name: 'Spinner',
    required: false,
    description: 'Loading indicator shown inside the pending checkbox.',
  },
  {
    name: 'Status message',
    required: false,
    description: 'Error, warning, or success message below the group.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'CheckboxList',
  displayName: 'Checkbox List',
  group: 'Checkbox',
  category: 'Form Controls',
  isHiddenFromOverview: true,
  keywords: [
    'checkboxlist',
    'checkbox',
    'checkboxgroup',
    'multichoice',
    'multiselect',
    'checklist',
  ],
  description:
    'Checkbox group container with field integration for label, description, and status.',
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the checkbox group (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'CheckboxListItem elements.',
      slotElements: [
        {
          __element: 'CheckboxListItem',
          props: {
            label: 'Option',
            value: 'option',
          },
        },
      ],
      required: true,
    },
    {
      name: 'value',
      type: 'string[]',
      description: 'The currently selected values (collection mode).',
    },
    {
      name: 'onChange',
      type: '(values: string[]) => void',
      description: 'Callback fired when the selected values change.',
    },
    {
      name: 'changeAction',
      type: '(values: string[]) => void | Promise<void>',
      description:
        'Async action on change with optimistic updates. While the promise is pending, the toggled item shows a spinner inside its checkbox and is marked aria-busy.',
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
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: 'Spacing density for list items.',
      default: "'balanced'",
    },
    {
      name: 'hasDividers',
      type: 'boolean',
      description: 'Whether to show dividers between items.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether all checkbox items are disabled.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the group is disabled. Applies to the whole-group disabled state (isDisabled), not per item. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the checkboxes focusable via aria-disabled (toggling stays blocked). Use this instead of wrapping a disabled CheckboxList in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Whether all checkbox items are read-only. Displays the current state at full opacity but prevents interaction. Unlike isDisabled, read-only checkboxes are not visually dimmed.',
      default: 'false',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: 'Status indicator ({ type, message }).',
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
  components: [{name: 'CheckboxListItem'}],
  usage: {
    anatomy,
    description:
      'CheckboxList shows a small group of checkboxes so users can turn several options on or off at once. Place it in settings pages, filter panels, or forms where every choice should be visible without scrolling. For a single standalone checkbox (like "I agree to the terms"), use CheckboxInput instead. If only one option can be picked, use RadioList. If the list is long enough to need searching or scrolling, use MultiSelector instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the list short: three to seven options is the sweet spot. Beyond that, switch to MultiSelector which adds search and scrolling.',
      },
      {
        guidance: true,
        description:
          'Turn on dividers (hasDividers) when items have helper text underneath; without them the labels and descriptions blur together.',
      },
      {
        guidance: true,
        description:
          'Write a group label that says what the choices represent: "Export formats" tells users more than "Options".',
      },
      {
        guidance: false,
        description:
          'Show a CheckboxList when the user can only pick one thing; that is what RadioList is for.',
      },
      {
        guidance: false,
        description:
          'Put buttons or links inside the trailing slot (endContent); the whole row is already tappable, so a nested button creates two competing click targets.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled CheckboxList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  theming: {
    targets: [{className: 'solo-checkbox-list'}],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'CheckboxList shows a small group of checkboxes so users can turn several options on or off at once. Place it in settings pages, filter panels, or forms where every choice should be visible without scrolling. For a single standalone checkbox (like "I agree to the terms"), use CheckboxInput instead. If only one option can be picked, use RadioList. If the list is long enough to need searching or scrolling, use MultiSelector instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the list short: three to seven options is the sweet spot. Beyond that, switch to MultiSelector which adds search and scrolling.',
      },
      {
        guidance: true,
        description:
          'Turn on dividers (hasDividers) when items have helper text underneath; without them the labels and descriptions blur together.',
      },
      {
        guidance: true,
        description:
          'Write a group label that says what the choices represent: "Export formats" tells users more than "Options".',
      },
      {
        guidance: false,
        description:
          'Show a CheckboxList when the user can only pick one thing; that is what RadioList is for.',
      },
      {
        guidance: false,
        description:
          'Put buttons or links inside the trailing slot (endContent); the whole row is already tappable, so a nested button creates two competing click targets.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled CheckboxList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'حاوية مجموعة مربعات اختيار مدمجة مع الحقل لعرض التسمية والوصف والحالة.',
  propDescriptions: {
    label: 'نص تسمية مجموعة مربعات الاختيار (يُعرض دائمًا لأغراض إمكانية الوصول).',
    children: 'عناصر CheckboxListItem.',
    value: 'القيم المحددة حاليًا (وضع المجموعة).',
    onChange: 'دالة استدعاء تُنفَّذ عند تغيّر القيم المحددة.',
    changeAction:
      'إجراء غير متزامن عند التغيير مع تحديثات متفائلة. أثناء انتظار الوعد (promise)، يعرض العنصر الذي جرى تبديله مؤشر تحميل داخل مربع الاختيار الخاص به ويُوسَم بـ aria-busy.',
    isLabelHidden: 'ما إذا كان يجب إخفاء التسمية بصريًا.',
    description: 'نص الوصف المعروض أسفل التسمية.',
    density: 'كثافة التباعد لعناصر القائمة.',
    hasDividers: 'ما إذا كان يجب إظهار فواصل بين العناصر.',
    isDisabled: 'ما إذا كانت جميع مربعات الاختيار معطَّلة.',
    disabledMessage:
      'يوضّح سبب تعطيل المجموعة. ينطبق على حالة تعطيل المجموعة بأكملها (isDisabled)، لا على كل عنصر على حدة. مع isDisabled، يُظهر تلميحًا عند التمرير أو التركيز بلوحة المفاتيح ويُبقي مربعات الاختيار قابلة للتركيز عبر aria-disabled (مع بقاء التبديل ممنوعًا). استخدمها بدلًا من تغليف CheckboxList معطَّلة بـ Tooltip؛ فعناصر التحكم المعطَّلة تبتلع أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    isReadOnly:
      'ما إذا كانت جميع مربعات الاختيار للقراءة فقط. تعرض الحالة الحالية بكامل الوضوح لكنها تمنع التفاعل. وعلى خلاف isDisabled، لا تُعتَّم مربعات الاختيار المخصّصة للقراءة فقط بصريًا.',
    status: 'مؤشر الحالة ({ type, message }).',
    width:
      'عرض الحقل (number = بكسل، وتُستخدم string كما هي، مثل "100%"). يحدّد أبعاد الحقل بأكمله (التسمية وعنصر التحكم والحالة) لتبقى متحاذية.',
    className:
      'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتغلب الأداة المتعارضة على القيمة الافتراضية.',
  },
  usage: {
    description:
      'تعرض CheckboxList مجموعة صغيرة من مربعات الاختيار ليتمكن المستخدمون من تشغيل عدة خيارات أو إيقافها دفعة واحدة. ضعها في صفحات الإعدادات أو لوحات التصفية أو النماذج حيث ينبغي أن يكون كل خيار مرئيًا دون تمرير. لمربع اختيار منفرد (مثل "أوافق على الشروط")، استخدم CheckboxInput بدلًا منها. وإذا كان بالإمكان اختيار خيار واحد فقط، فاستخدم RadioList. وإذا كانت القائمة طويلة بما يكفي لتتطلب البحث أو التمرير، فاستخدم MultiSelector بدلًا منها.',
    bestPractices: [
      {
        guidance: true,
        description:
          'اجعل القائمة قصيرة: من ثلاثة إلى سبعة خيارات هو العدد الأمثل. وما يتجاوز ذلك، انتقل إلى MultiSelector الذي يضيف البحث والتمرير.',
      },
      {
        guidance: true,
        description:
          'فعّل الفواصل (hasDividers) عندما تحتوي العناصر على نص مساعد أسفلها؛ فبدونها تتداخل التسميات والأوصاف.',
      },
      {
        guidance: true,
        description:
          'اكتب تسمية للمجموعة توضّح ما تمثّله الخيارات: فعبارة "Export formats" تخبر المستخدمين أكثر من "Options".',
      },
      {
        guidance: false,
        description:
          'لا تعرض CheckboxList عندما لا يستطيع المستخدم اختيار سوى شيء واحد؛ فهذا هو الغرض من RadioList.',
      },
      {
        guidance: false,
        description:
          'لا تضع أزرارًا أو روابط داخل الخانة الختامية (endContent)؛ فالصف بأكمله قابل للنقر أصلًا، والزر المتداخل ينشئ هدفي نقر متنافسين.',
      },
      {
        guidance: false,
        description:
          'لا تغلّف CheckboxList معطَّلة بـ Tooltip لتوضيح سبب تعطيلها؛ فعناصر التحكم المعطَّلة تبتلع أحداث التمرير التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {name: 'المجموعة', required: true, description: 'حاوية مجموعة مربعات الاختيار ذات التسمية.'},
      {name: 'تسمية المجموعة', required: true, description: 'نص يحدّد ما تمثّله خيارات مربعات الاختيار.'},
      {name: 'الوصف', required: false, description: 'نص مساعد أسفل تسمية المجموعة.'},
      {name: 'قائمة الخيارات', required: true, description: 'قائمة تحتوي على خيارات مربعات الاختيار المتاحة.'},
      {name: 'صف الخيار', required: true, description: 'صف قابل للتحديد يحتوي على خيار واحد.'},
      {name: 'مربع الاختيار', required: true, description: 'مؤشر تحديد الخيار.'},
      {name: 'تسمية الخيار', required: true, description: 'المحتوى الأساسي الذي يعرّف الخيار.'},
      {name: 'وصف الخيار', required: false, description: 'نص ثانوي أسفل تسمية الخيار.'},
      {name: 'المحتوى الختامي', required: false, description: 'محتوى يوفّره المستدعي في نهاية صف الخيار.'},
      {name: 'مؤشر التحميل', required: false, description: 'مؤشر تحميل يظهر داخل مربع الاختيار قيد الانتظار.'},
      {name: 'رسالة الحالة', required: false, description: 'رسالة خطأ أو تحذير أو نجاح أسفل المجموعة.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Checkbox group component for multi-value selection. Collection mode (parent state) + standalone mode (per-item state).',
  usage: {
    description:
      'CheckboxList shows a small group of checkboxes so users can turn several options on or off at once. Place it in settings pages, filter panels, or forms where every choice should be visible without scrolling. For a single standalone checkbox (like "I agree to the terms"), use CheckboxInput instead. If only one option can be picked, use RadioList. If the list is long enough to need searching or scrolling, use MultiSelector instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the list short: three to seven options is the sweet spot. Beyond that, switch to MultiSelector which adds search and scrolling.',
      },
      {
        guidance: true,
        description:
          'Turn on dividers (hasDividers) when items have helper text underneath; without them the labels and descriptions blur together.',
      },
      {
        guidance: true,
        description:
          'Write a group label that says what the choices represent: "Export formats" tells users more than "Options".',
      },
      {
        guidance: false,
        description:
          'Show a CheckboxList when the user can only pick one thing; that is what RadioList is for.',
      },
      {
        guidance: false,
        description:
          'Put buttons or links inside the trailing slot (endContent); the whole row is already tappable, so a nested button creates two competing click targets.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled CheckboxList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};
