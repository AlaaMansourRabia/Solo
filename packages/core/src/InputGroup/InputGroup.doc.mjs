/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'InputGroup',
  displayName: 'Input Group',
  group: 'Field',
  category: 'Form Controls',
  isHiddenFromOverview: true,
  keywords: [
    'inputgroup',
    'addon',
    'prefix',
    'suffix',
    'connected',
    'grouped',
    'input',
  ],
  theming: {
    targets: [
      {className: 'solo-input-group', visualProps: ['size', 'status']},
      {className: 'solo-input-group-text'},
    ],
  },
  description:
    'Groups an input with prefix/suffix addons in a visually connected container with shared border and focus ring.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'InputGroupText and compatible input children: TextInput, NumberInput, TimeInput, DateInput, Typeahead, Selector, or MultiSelector.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the group.',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text between label and input group.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disable the entire group.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Show "(optional)" indicator.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Mark the field as required.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Default size for inputs in the group.',
      default: "'md'",
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: 'Status indicator applied to the group border.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text at the end of the label.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector.',
    },
  ],
  components: [{name: 'InputGroupText'}],
  usage: {
    description:
      'InputGroup connects an input with prefix/suffix addons in a single visual unit. Use it for URL fields, currency inputs, search fields with action buttons, or any input that needs contextual decorations.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use text addons to show units, prefixes, or suffixes that clarify the input format (e.g., "$", "kg", "https://").',
      },
      {
        guidance: true,
        description:
          'Use InputGroupText for static prefixes/suffixes like "$", "kg", or "https://".',
      },
      {
        guidance: true,
        description:
          'Use InputGroup with compatible single-line inputs: TextInput, NumberInput, TimeInput, DateInput, Typeahead, Selector, and MultiSelector.',
      },
      {
        guidance: true,
        description:
          "Keep each inner input's label specific; grouped inputs automatically combine the group label with their own label and inherit the group description/status context.",
      },
      {
        guidance: false,
        description:
          "Don't put multiple text inputs in one group; use separate fields instead.",
      },
      {
        guidance: false,
        description:
          "Don't use InputGroup for unrelated inputs; it's for a single input with decorations.",
      },
      {
        guidance: false,
        description:
          "Don't use InputGroup with TextArea, Slider, Switch, CheckboxInput, or RadioList.",
      },
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'Text above the group.'},
      {
        name: 'Prefix addon',
        required: false,
        description: 'Content before the input (text, icon, or button).',
      },
      {
        name: 'Input',
        required: true,
        description:
          'The main input element (TextInput, NumberInput, TimeInput, DateInput, Typeahead, Selector, or MultiSelector).',
      },
      {
        name: 'Suffix addon',
        required: false,
        description: 'Content after the input (text, icon, or button).',
      },
      {
        name: 'Status message',
        required: false,
        description: 'An error, warning, or success message below the group.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يجمع حقل إدخال مع إضافات بادئة/لاحقة في حاوية متصلة بصريًا ذات حدود وحلقة تركيز مشتركة.',
  propDescriptions: {
    children: 'InputGroupText وعناصر إدخال فرعية متوافقة: TextInput أو NumberInput أو TimeInput أو DateInput أو Typeahead أو Selector أو MultiSelector.',
    label: 'التسمية القابلة للوصول للمجموعة.',
    isLabelHidden: 'إخفاء التسمية بصريًا.',
    description: 'نص مساعد بين التسمية ومجموعة الإدخال.',
    isDisabled: 'تعطيل المجموعة بأكملها.',
    isOptional: 'إظهار مؤشر "(optional)".',
    isRequired: 'تعليم الحقل بأنه مطلوب.',
    size: 'الحجم الافتراضي لحقول الإدخال في المجموعة.',
    status: 'مؤشر حالة يُطبَّق على حدود المجموعة.',
    labelTooltip: 'نص تلميح في نهاية التسمية.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
    'data-testid': 'محدِّد للاختبارات.',
  },
  usage: {
    description: 'يربط InputGroup حقل إدخال مع إضافات بادئة/لاحقة في وحدة مرئية واحدة. استخدمه لحقول URL، وحقول إدخال العملات، وحقول البحث ذات أزرار الإجراءات، أو أي حقل إدخال يحتاج إلى عناصر سياقية مكمّلة.',
    bestPractices: [
      {guidance: true, description: 'استخدم الإضافات النصية لعرض الوحدات أو البادئات أو اللاحقات التي توضّح تنسيق الإدخال (مثل "$" و"kg" و"https://").'},
      {guidance: true, description: 'استخدم InputGroupText للبادئات/اللاحقات الثابتة مثل "$" أو "kg" أو "https://".'},
      {guidance: true, description: 'استخدم InputGroup مع حقول الإدخال المتوافقة أحادية السطر: TextInput وNumberInput وTimeInput وDateInput وTypeahead وSelector وMultiSelector.'},
      {guidance: true, description: 'اجعل تسمية كل حقل إدخال داخلي محددة؛ إذ تجمع حقول الإدخال المجمّعة تلقائيًا تسمية المجموعة مع تسميتها الخاصة وترث سياق الوصف والحالة من المجموعة.'},
      {guidance: false, description: 'لا تضع عدة حقول إدخال نصية في مجموعة واحدة؛ استخدم حقولًا منفصلة بدلًا من ذلك.'},
      {guidance: false, description: 'لا تستخدم InputGroup لحقول إدخال غير مترابطة؛ فهو مخصّص لحقل إدخال واحد مع عناصر مكمّلة.'},
      {guidance: false, description: 'لا تستخدم InputGroup مع TextArea أو Slider أو Switch أو CheckboxInput أو RadioList.'},
    ],
    anatomy: [
      {name: 'التسمية', required: true, description: 'نص أعلى المجموعة.'},
      {name: 'الإضافة البادئة', required: false, description: 'محتوى قبل حقل الإدخال (نص أو أيقونة أو زر).'},
      {name: 'حقل الإدخال', required: true, description: 'عنصر الإدخال الرئيسي (TextInput أو NumberInput أو TimeInput أو DateInput أو Typeahead أو Selector أو MultiSelector).'},
      {name: 'الإضافة اللاحقة', required: false, description: 'محتوى بعد حقل الإدخال (نص أو أيقونة أو زر).'},
      {name: 'رسالة الحالة', required: false, description: 'رسالة خطأ أو تحذير أو نجاح أسفل المجموعة.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'groups input with prefix/suffix addons in a connected container',
  usage: {
    description:
      'InputGroup connects an input with addons. Use for URL fields, currency inputs, search with actions.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use text addons to show units, prefixes, or suffixes that clarify input format (e.g. "$", "kg", "https://").',
      },
      {
        guidance: true,
        description:
          'Use InputGroupText for static prefixes/suffixes like "$", "kg", or "https://".',
      },
      {
        guidance: true,
        description:
          'Use InputGroup with compatible single-line inputs: TextInput, NumberInput, TimeInput, DateInput, Typeahead, Selector, and MultiSelector.',
      },
      {
        guidance: true,
        description:
          "Keep each inner input's label specific; grouped inputs combine the group label with their own label and inherit group description/status.",
      },
      {
        guidance: false,
        description:
          "Don't put multiple text inputs in one group; use separate fields instead.",
      },
      {
        guidance: false,
        description:
          "Don't use InputGroup for unrelated inputs; it's for a single input with decorations.",
      },
      {
        guidance: false,
        description:
          "Don't use InputGroup with TextArea, Slider, Switch, CheckboxInput, or RadioList.",
      },
    ],
  },
};
