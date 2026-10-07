/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuRadioItem',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Radio Item',
  isHiddenFromOverview: true,
  description:
    'A single option in a DropdownMenuRadioGroup (role="menuitemradio"). Must be used inside a DropdownMenuRadioGroup.',
  playground: {
    defaults: {
      value: 'option-1',
      label: 'Option 1',
    },
    wrapper: {
      component: 'DropdownMenuRadioGroup',
      props: {
        value: 'option-1',
        label: 'Radio group',
      },
    },
  },
  props: [
    {
      name: 'value',
      required: true,
      type: 'string',
      description:
        "The value this item represents within its group. The group's value matches against this to determine the checked state.",
    },
    {
      name: 'label',
      required: true,
      type: 'ReactNode',
      description: 'Primary label text identifying the option.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Secondary description text displayed below the label.',
    },
    {
      name: 'icon',
      type: 'ReactNode | IconType',
      description:
        'Icon to display before the label. See the Icon docs (`IconName`) for valid semantic names.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      default: 'false',
      description:
        'Whether this individual radio item is disabled. Disabled items stay focusable (via aria-disabled) so they remain discoverable by keyboard and assistive technology, but selection is blocked.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content to render after the label and description, such as a badge or metadata.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description:
        'Ref forwarded to the row root, the element carrying role="menuitemradio". Register the row with an element-keyed observer or overlay.',
    },
  ],
};

export const docsZh = {
  name: 'DropdownMenuRadioItem',
  isHiddenFromOverview: true,
  displayName: 'Dropdown Menu Radio Item',
  description:
    'DropdownMenuRadioGroup 中的单个选项（role="menuitemradio"）。必须在 DropdownMenuRadioGroup 内使用。',
  propDescriptions: {
    value: '该项在组内代表的值。组的 value 与之匹配以确定勾选状态。',
    label: '标识该选项的主标签文本。',
    description: '显示在标签下方的次要描述文本。',
    icon: '显示在标签前的图标。',
    isDisabled: '该单选项是否禁用。',
    endContent: '在标签和描述之后渲染的内容。',
    ref: '转发到行根元素（带 role="menuitemradio" 的元素）的 ref。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'خيار واحد ضمن DropdownMenuRadioGroup (role="menuitemradio"). يجب استخدامه داخل DropdownMenuRadioGroup.',
  propDescriptions: {
    value: 'القيمة التي يمثّلها هذا العنصر ضمن مجموعته. تُطابَق قيمة المجموعة مع هذه القيمة لتحديد حالة التحديد.',
    label: 'نص التسمية الأساسي الذي يعرّف الخيار.',
    description: 'نص وصفي ثانوي يُعرض أسفل التسمية.',
    icon: 'أيقونة تُعرض قبل التسمية. راجع توثيق Icon (`IconName`) للاطلاع على الأسماء الدلالية الصالحة.',
    isDisabled: 'ما إذا كان عنصر زر الاختيار هذا معطَّلًا. تبقى العناصر المعطَّلة قابلة للتركيز (عبر aria-disabled) كي تظل قابلة للاكتشاف بلوحة المفاتيح والتقنيات المساعدة، لكن التحديد يكون ممنوعًا.',
    endContent: 'محتوى يُعرض بعد التسمية والوصف، مثل شارة أو بيانات وصفية.',
    ref: 'مرجع (ref) يُمرَّر إلى جذر الصف، أي العنصر الذي يحمل role="menuitemradio". سجّل الصف لدى مراقِب أو طبقة متراكبة مفتاحها العنصر.',
  },
};

export const docsDense = {
  name: 'DropdownMenuRadioItem',
  isHiddenFromOverview: true,
  displayName: 'Dropdown Menu Radio Item',
  description: 'one option in a DropdownMenuRadioGroup (menuitemradio)',
  propDescriptions: {
    value: "item's value within the group (matched vs group value)",
    label: 'primary label text',
    description: 'secondary text below label',
    icon: 'icon before label',
    isDisabled: 'disabled; stays focusable via aria-disabled',
    endContent: 'content after label+description',
    ref: 'forwarded to the row root (the role="menuitemradio" element)',
  },
};
