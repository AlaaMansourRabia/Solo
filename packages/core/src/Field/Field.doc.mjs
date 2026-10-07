/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Field',
  displayName: 'Field',
  group: 'Field',
  category: 'Form Controls',
  keywords: ["field","formfield","formgroup","formcontrol","label","input","required","optional","helpertext","hint"],
  playground: {
    defaults: {
      label: 'Email address',
      inputID: 'email-input',
      description: 'Use Field for controls that do not already provide field under the hood.',
      descriptionID: 'email-help',
      children: {
        __element: 'input',
        props: {
          id: 'email-input',
          'aria-describedby': 'email-help',
          placeholder: 'you@example.com',
          type: 'email',
        },
      },
    },
  },
  theming: {
    targets: [
      {className: 'solo-field', visualProps: ['layout']},
      {className: 'solo-field-label'},
      {className: 'solo-field-status', visualProps: ['type', 'variant']},
      {
        className: 'solo-input-status-icon',
        visualProps: ['size', 'status'],
      },
      {className: 'solo-input-clear-button'},
      {className: 'solo-input-clear-icon'},
    ],
    vars: [
      {name: '--_field-radius', description: 'Border radius of input fields', default: 'var(--radius-element)', private: true},
      {name: '--_field-status-overlap', description: 'Amount an attached FieldStatus extends behind the lower half of the control. Set from the rendered control size.', default: 'calc(var(--size-element-md) / 2)', private: true},
      {name: '--_input-clear-hit-inset', description: 'Outset of the clear (\u2715) button\'s invisible hit area, applied to a ::after overlay. 0 on a fine pointer; negative on a coarse one, which grows the 20px button to the 24px touch target without changing what is drawn.', default: '0px', private: true},
      {name: '--_input-clear-hit-content', description: 'Whether the clear (\u2715) button\'s invisible hit overlay exists. `none` on a fine pointer, so no ::after is generated and hover still reaches the glyph; `""` on a coarse one, where the overlay provides the 24px touch target.', default: 'none', private: true},
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_field-radius']},
    ],
  },
  description: 'Low-level form field wrapper for custom controls that need a label, description, and optional/required indicators.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text for the field (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'inputID',
      type: 'string',
      description: 'ID for the input element (used for the label htmlFor attribute).',
      required: true,
    },
    {
      name: 'labelID',
      type: 'string',
      description: 'ID applied to the label element itself for group accessibility.',
    },
    {
      name: 'isGroupLabel',
      type: 'boolean',
      description: 'Renders the label as a span for control groups (radiogroup, checkbox list).',
      default: 'false',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The input or control to render.',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label (still accessible to screen readers).',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the associated input is disabled. Propagates disabled styling to the label.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed between the label and input.',
    },
    {
      name: 'descriptionID',
      type: 'string',
      description: 'ID for the description element (use for aria-describedby on the input).',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Whether the field is optional (mutually exclusive with isRequired).',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Whether the field is required (mutually exclusive with isOptional).',
      default: 'false',
    },
    {
      name: 'labelIcon',
      type: 'ReactNode | IconType',
      description: 'Icon to display before the label text. See the Icon docs (`IconName`) for valid semantic names.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text to display in an info icon at the end of the label.',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string, messageID?: string}",
      description: 'Status indicator with type and optional message. When message is set, displays a colored status box. messageID is for wiring aria-describedby on the input.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached'",
      description: 'How the status message renders relative to the input. Attached overlaps the input border; detached floats below.',
      default: "'attached'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: 'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned. Prefer this over setting width via className/style, which only size the inner control box.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref forwarded to the root element.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'Inline styles applied to the root element. They take priority over the component classes and className.',
    },
  ],
  components: [
    {name: 'FieldLabel'},
    {name: 'FieldStatus'},
  ],
  usage: {
    description: 'Field is a low-level wrapper for custom, native, or third-party controls that do not already provide field label, description, and status UI. Use it when you need the Field shell around a control you own; use styled Solo inputs like TextInput, Typeahead, and Select directly when they already expose label, description, and validation props.',
    bestPractices: [
      { guidance: true, description: 'Wrap custom controls, native inputs, or third-party widgets that need labeling, helper text, optional/required indicators, or validation status.' },
      { guidance: true, description: 'Always provide a label for accessibility, even if visually hidden with isLabelHidden.' },
      { guidance: true, description: 'Use inputID and descriptionID to connect the label and description to the inner control with htmlFor and aria-describedby.' },
      { guidance: false, description: 'Nest Field around styled inputs such as TextInput, Typeahead, Select, DateInput, or TextArea; those components already render their own Field shell.' },
      { guidance: false, description: 'Use the attached status variant on non-bordered controls such as sliders, switches, or checkboxes; use detached so the message does not overlap the control.' },
      { guidance: false, description: 'Set both isOptional and isRequired on the same field.' },
      { guidance: false, description: 'Hide the label without providing an alternative way for the user to understand the field purpose.' },
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'Text identifying the field. Always rendered for accessibility, optionally hidden visually.'},
      {name: 'Description', required: false, description: 'Helper text between the label and input explaining what to enter.'},
      {name: 'Control slot', required: true, description: 'A custom, native, or third-party control that does not already render a field shell.'},
      {name: 'Status message', required: false, description: 'Inline validation feedback showing error, warning, or success with a message.'},
      {name: 'Optional/Required indicator', required: false, description: 'Badge next to the label showing whether the field is optional or required.'},
      {name: 'Label tooltip', required: false, description: 'Info icon at the end of the label with a tooltip explaining the field.'},
    ],
  },
  examples: [
    {
      label: 'Wrap a custom control',
      code: `
function CustomSliderField() {
  return (
    <Field
      label="Confidence"
      inputID="confidence-slider"
      description="Choose how strict the review should be."
      descriptionID="confidence-help"
      status={{type: 'success', message: 'Recommended default'}}
      statusVariant="detached">
      <input
        id="confidence-slider"
        type="range"
        min={0}
        max={100}
        defaultValue={60}
        aria-describedby="confidence-help"
      />
    </Field>
  );
}
`,
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description: 'Field is a low-level wrapper for custom, native, or third-party controls that do not already provide field label, description, and status UI. Use it when you need the Field shell around a control you own; use styled Solo inputs like TextInput, Typeahead, and Select directly when they already expose label, description, and validation props.',
    bestPractices: [
      { guidance: true, description: 'Wrap custom controls, native inputs, or third-party widgets that need labeling, helper text, optional/required indicators, or validation status.' },
      { guidance: true, description: 'Always provide a label for accessibility, even if visually hidden with isLabelHidden.' },
      { guidance: true, description: 'Use inputID and descriptionID to connect the label and description to the inner control with htmlFor and aria-describedby.' },
      { guidance: false, description: 'Nest Field around styled inputs such as TextInput, Typeahead, Select, DateInput, or TextArea; those components already render their own Field shell.' },
      { guidance: false, description: 'Use the attached status variant on non-bordered controls such as sliders, switches, or checkboxes; use detached so the message does not overlap the control.' },
      { guidance: false, description: 'Set both isOptional and isRequired on the same field.' },
      { guidance: false, description: 'Hide the label without providing an alternative way for the user to understand the field purpose.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'مغلِّف منخفض المستوى لحقول النماذج مخصص لعناصر التحكم المخصصة التي تحتاج إلى تسمية ووصف ومؤشرات اختياري/مطلوب.',
  propDescriptions: {
    label: 'نص التسمية للحقل (يُعرض دائمًا لأغراض إمكانية الوصول).',
    inputID: 'معرّف عنصر الإدخال (يُستخدم للسمة htmlFor في التسمية).',
    labelID: 'معرّف يُطبَّق على عنصر التسمية نفسه لإمكانية وصول المجموعات.',
    isGroupLabel: 'يعرض التسمية كعنصر span لمجموعات عناصر التحكم (radiogroup، وقائمة مربعات الاختيار).',
    children: 'حقل الإدخال أو عنصر التحكم المراد عرضه.',
    isLabelHidden: 'يخفي التسمية بصريًا (مع بقائها متاحة لقارئات الشاشة).',
    isDisabled: 'ما إذا كان حقل الإدخال المرتبط معطَّلًا. ينقل تنسيق التعطيل إلى التسمية.',
    description: 'نص الوصف المعروض بين التسمية وحقل الإدخال.',
    descriptionID: 'معرّف عنصر الوصف (استخدمه لـ aria-describedby على حقل الإدخال).',
    isOptional: 'ما إذا كان الحقل اختياريًا (لا يجتمع مع isRequired).',
    isRequired: 'ما إذا كان الحقل مطلوبًا (لا يجتمع مع isOptional).',
    labelIcon: 'أيقونة تُعرض قبل نص التسمية. راجع توثيق Icon (`IconName`) للأسماء الدلالية الصالحة.',
    labelTooltip: 'نص تلميح يُعرض في أيقونة معلومات في نهاية التسمية.',
    status: 'مؤشر حالة بنوع ورسالة اختيارية. عند تعيين الرسالة، يُعرض صندوق حالة ملوَّن. يُستخدم messageID لربط aria-describedby على حقل الإدخال.',
    statusVariant: 'كيفية عرض رسالة الحالة بالنسبة إلى حقل الإدخال. Attached تتراكب على حدّ حقل الإدخال؛ وdetached تطفو أسفله.',
    width: 'عرض الحقل (الرقم = بكسلات، والنص يُستخدم كما هو، مثل "100%"). يحدد حجم الحقل كاملًا (التسمية وعنصر التحكم والحالة) كي تبقى متحاذية. فضّله على تعيين العرض عبر className/style، اللذين يحددان حجم صندوق عنصر التحكم الداخلي فقط.',
    ref: 'مرجع (ref) يُمرَّر إلى العنصر الجذر.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمَج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداةُ المتعارضة القيمةَ الافتراضية.',
    style: 'أنماط مضمّنة تُطبَّق على العنصر الجذر. لها الأولوية على أصناف المكوّن وclassName.',
  },
  usage: {
    description: 'Field مغلِّف منخفض المستوى لعناصر التحكم المخصصة أو الأصلية أو الخارجية التي لا توفّر بالفعل واجهة تسمية الحقل ووصفه وحالته. استخدمه عندما تحتاج إلى هيكل Field حول عنصر تحكم تملكه؛ واستخدم حقول إدخال Solo المنسَّقة مثل TextInput وTypeahead وSelect مباشرةً عندما تتيح بالفعل خصائص التسمية والوصف والتحقق.',
    bestPractices: [
      {
        guidance: true,
        description: 'غلّف به عناصر التحكم المخصصة، أو حقول الإدخال الأصلية، أو الأدوات الخارجية التي تحتاج إلى تسمية أو نص مساعد أو مؤشرات اختياري/مطلوب أو حالة تحقق.',
      },
      {
        guidance: true,
        description: 'قدّم دائمًا تسمية لأغراض إمكانية الوصول، حتى لو كانت مخفية بصريًا باستخدام isLabelHidden.',
      },
      {
        guidance: true,
        description: 'استخدم inputID وdescriptionID لربط التسمية والوصف بعنصر التحكم الداخلي عبر htmlFor وaria-describedby.',
      },
      {
        guidance: false,
        description: 'لا تضع Field حول حقول الإدخال المنسَّقة مثل TextInput أو Typeahead أو Select أو DateInput أو TextArea؛ فهذه المكوّنات تعرض هيكل Field الخاص بها بالفعل.',
      },
      {
        guidance: false,
        description: 'لا تستخدم نمط الحالة attached مع عناصر التحكم التي لا حدود لها مثل أشرطة التمرير أو مفاتيح التبديل أو مربعات الاختيار؛ استخدم detached كي لا تتراكب الرسالة على عنصر التحكم.',
      },
      {
        guidance: false,
        description: 'لا تعيّن isOptional وisRequired معًا على الحقل نفسه.',
      },
      {
        guidance: false,
        description: 'لا تُخفِ التسمية دون توفير طريقة بديلة تساعد المستخدم على فهم الغرض من الحقل.',
      },
    ],
    anatomy: [
      {
        name: 'التسمية',
        required: true,
        description: 'نص يعرّف الحقل. يُعرض دائمًا لأغراض إمكانية الوصول، ويمكن إخفاؤه بصريًا اختياريًا.',
      },
      {
        name: 'الوصف',
        required: false,
        description: 'نص مساعد بين التسمية وحقل الإدخال يوضح ما يجب إدخاله.',
      },
      {
        name: 'خانة عنصر التحكم',
        required: true,
        description: 'عنصر تحكم مخصص أو أصلي أو خارجي لا يعرض هيكل حقل بالفعل.',
      },
      {
        name: 'رسالة الحالة',
        required: false,
        description: 'ملاحظات تحقق مضمّنة تعرض خطأً أو تحذيرًا أو نجاحًا مع رسالة.',
      },
      {
        name: 'مؤشر اختياري/مطلوب',
        required: false,
        description: 'شارة بجانب التسمية توضح ما إذا كان الحقل اختياريًا أو مطلوبًا.',
      },
      {
        name: 'تلميح التسمية',
        required: false,
        description: 'أيقونة معلومات في نهاية التسمية مع تلميح يشرح الحقل.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Low-level field shell for custom controls needing label/description/status.',
  usage: {
    description: 'Field wraps custom/native/third-party controls lacking field UI. Use TextInput, Typeahead, Select, DateInput, or TextArea directly when they already expose label/description/status props.',
    bestPractices: [
      { guidance: true, description: 'Wrap custom controls/widgets that need labeling, helper text, optional/required indicators, or validation status.' },
      { guidance: true, description: 'Always provide a label; visually hide it only when context is clear.' },
      { guidance: true, description: 'Wire inputID/descriptionID to htmlFor and aria-describedby on the inner control.' },
      { guidance: false, description: 'Nest Field around styled inputs; it double-renders labels and status UI.' },
      { guidance: false, description: 'Use attached status on sliders/switches/checkboxes; use detached so messages do not overlap.' },
      { guidance: false, description: 'Set both isOptional and isRequired on the same field.' },
      { guidance: false, description: 'Hide the label without another way to understand field purpose.' },
    ],
  },
};
