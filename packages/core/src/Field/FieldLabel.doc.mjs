/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'FieldLabel',
  subComponentOf: 'Field',
  displayName: 'Field Label',
  isHiddenFromOverview: true,
  description: 'Standalone label component with optional/required indicators and tooltip support.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text.',
      required: true,
    },
    {
      name: 'inputID',
      type: 'string',
      description: 'ID of the input this label is for.',
      required: true,
    },
    {
      name: 'labelID',
      type: 'string',
      description:
        'The id applied to the label element itself (not the input it points at; that is inputID). A grouping control such as role="radiogroup" references it through aria-labelledby to take the label as its accessible name.',
    },
    {
      name: 'isGroupLabel',
      type: 'boolean',
      description:
        'Set when the field wraps a group of controls (e.g. a radiogroup) rather than a single input. The label renders as a <span> instead of a <label>, and the group takes it as its name via labelID + aria-labelledby.',
      default: 'false',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the associated input is disabled.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Show "Optional" indicator.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Show "Required" indicator.',
      default: 'false',
    },
    {
      name: 'labelIcon',
      type: 'ReactNode | IconType',
      description: 'Icon before the label text. See the Icon docs (`IconName`) for valid semantic names.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text for info icon at end of label.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description:
        'Description displayed below the label. Hidden along with the label when isLabelHidden is true.',
    },
    {
      name: 'descriptionID',
      type: 'string',
      description:
        'ID for the description element, for aria-describedby on the input.',
    },
  ],
};

export const docsZh = {
  name: 'FieldLabel',
  isHiddenFromOverview: true,
  displayName: 'Field Label',
  description: '独立的标签组件，支持可选/必填指示器和工具提示。',
  props: [
    {
      name: 'label',
      type: 'string',
      description: '标签文本。',
      required: true,
    },
    {
      name: 'inputID',
      type: 'string',
      description: '此标签关联的输入框 ID。',
      required: true,
    },
    {
      name: 'labelID',
      type: 'string',
      description:
        '应用于标签元素自身的 id（而非其指向的输入元素，那是 inputID）。分组控件（如 role="radiogroup"）可通过 aria-labelledby 引用它作为可访问名称。',
    },
    {
      name: 'isGroupLabel',
      type: 'boolean',
      description:
        '当字段包裹一组控件（如 radiogroup）而非单个输入时设置。标签渲染为 <span> 而非 <label>，分组通过 labelID + aria-labelledby 获取名称。',
      default: 'false',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: '视觉隐藏标签。',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: '关联的输入框是否禁用。',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: '显示"Optional"指示器。',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: '显示"Required"指示器。',
      default: 'false',
    },
    {
      name: 'labelIcon',
      type: 'ReactNode | IconType',
      description: '标签文本前的图标。',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: '标签末尾信息图标的工具提示文本。',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description:
        '显示在标签下方的描述。isLabelHidden 为 true 时与标签一起隐藏。',
    },
    {
      name: 'descriptionID',
      type: 'string',
      description:
        '描述元素的 ID，供输入元素的 aria-describedby 使用。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'مكوّن تسمية مستقل مع مؤشرات للحقول الاختيارية/المطلوبة ودعم للتلميحات.',
  propDescriptions: {
    label: 'نص التسمية.',
    inputID: 'معرّف حقل الإدخال الذي تخصه هذه التسمية.',
    labelID: 'المعرّف المطبَّق على عنصر التسمية نفسه (وليس على حقل الإدخال الذي تشير إليه؛ فذلك هو inputID). يشير إليه عنصر تحكم تجميعي مثل role="radiogroup" عبر aria-labelledby ليتخذ التسمية اسمًا قابلًا للوصول له.',
    isGroupLabel: 'اضبطه عندما يغلّف الحقل مجموعة من عناصر التحكم (مثل radiogroup) بدلًا من حقل إدخال واحد. تُعرض التسمية كعنصر <span> بدلًا من <label>، وتتخذها المجموعة اسمًا لها عبر labelID مع aria-labelledby.',
    isLabelHidden: 'يُخفي التسمية بصريًا.',
    isDisabled: 'ما إذا كان حقل الإدخال المرتبط معطَّلًا.',
    isOptional: 'يعرض مؤشر "Optional".',
    isRequired: 'يعرض مؤشر "Required".',
    labelIcon: 'أيقونة قبل نص التسمية. راجع توثيق Icon (`IconName`) للاطلاع على الأسماء الدلالية الصالحة.',
    labelTooltip: 'نص التلميح لأيقونة المعلومات في نهاية التسمية.',
    description: 'الوصف المعروض أسفل التسمية. يُخفى مع التسمية عندما تكون isLabelHidden صحيحة.',
    descriptionID: 'معرّف عنصر الوصف، لاستخدامه في aria-describedby على حقل الإدخال.',
  },
};

export const docsDense = {
  name: 'FieldLabel',
  isHiddenFromOverview: true,
  displayName: 'Field Label',
  description: 'Standalone label w/ optional/required indicators + tooltip support.',
  propDescriptions: {
    label: 'Label text.',
    inputID: 'ID of input this label is for.',
    labelID: 'id on the label element itself (for aria-labelledby on a group)',
    isGroupLabel: 'label names a group: renders <span>, group uses labelID + aria-labelledby',
    isLabelHidden: 'Visually hide label.',
    isDisabled: 'Associated input disabled.',
    isOptional: 'Show "Optional" indicator.',
    isRequired: 'Show "Required" indicator.',
    labelIcon: 'Icon before label text.',
    labelTooltip: 'Tooltip text for info icon at end of label.',
    description: 'description below the label; hidden with it',
    descriptionID: 'id for the description element (aria-describedby)',
  },
};
