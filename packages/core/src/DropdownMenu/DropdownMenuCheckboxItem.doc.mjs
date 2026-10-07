/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuCheckboxItem',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Checkbox Item',
  isHiddenFromOverview: true,
  description:
    'A checkable menu item (role="menuitemcheckbox") that toggles an independent boolean. Use for on/off options inside a DropdownMenu; for a one-of-N choice use DropdownMenuRadioGroup.',
  props: [
    {
      name: 'label',
      required: true,
      type: 'ReactNode',
      description: 'Primary label text identifying the item.',
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
      name: 'value',
      required: true,
      type: 'boolean',
      description: 'Whether the item is checked. Controlled; pair with onChange.',
    },
    {
      name: 'onChange',
      type: '(checked: boolean) => void',
      description: 'Callback fired with the next checked state when the item is toggled.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      default: 'false',
      description:
        'Whether the item is disabled. Disabled items stay focusable (via aria-disabled) so they remain discoverable by keyboard and assistive technology, but activation is blocked.',
    },
    {
      name: 'hasCloseOnSelect',
      type: 'boolean',
      default: 'false',
      description:
        'Whether toggling the item closes the menu. Checkbox items default to staying open so several can be toggled in a single session.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description:
        'Ref forwarded to the row root, the element carrying role="menuitemcheckbox". Register the row with an element-keyed observer or overlay.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content to render after the label and description, such as a keyboard shortcut hint or badge.',
    },
  ],
};

export const docsZh = {
  name: 'DropdownMenuCheckboxItem',
  isHiddenFromOverview: true,
  displayName: 'Dropdown Menu Checkbox Item',
  description:
    '可勾选的菜单项（role="menuitemcheckbox"），用于切换独立的布尔值。用于 DropdownMenu 中的开关选项；单选请使用 DropdownMenuRadioGroup。',
  propDescriptions: {
    label: '标识该项的主标签文本。',
    description: '显示在标签下方的次要描述文本。',
    icon: '显示在标签前的图标。',
    value: '该项是否被勾选。受控，与 onChange 搭配使用。',
    onChange: '切换该项时以下一个勾选状态触发的回调。',
    isDisabled: '该项是否禁用。',
    hasCloseOnSelect: '切换该项是否关闭菜单。默认保持打开。',
    ref: '转发到行根元素（带 role="menuitemcheckbox" 的元素）的 ref。',
    endContent: '在标签和描述之后渲染的内容。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'عنصر قائمة قابل للتحديد (role="menuitemcheckbox") يبدّل قيمة منطقية مستقلة. استخدمه لخيارات التشغيل/الإيقاف داخل DropdownMenu؛ ولاختيار واحد من عدة خيارات استخدم DropdownMenuRadioGroup.',
  propDescriptions: {
    label: 'نص التسمية الأساسي الذي يعرّف العنصر.',
    description: 'نص وصف ثانوي يُعرض أسفل التسمية.',
    icon: 'أيقونة تُعرض قبل التسمية. راجع توثيق Icon (`IconName`) للاطلاع على الأسماء الدلالية الصالحة.',
    value: 'ما إذا كان العنصر محددًا. متحكَّم به؛ استخدمه مع onChange.',
    onChange: 'دالة استدعاء تُطلق مع حالة التحديد التالية عند تبديل العنصر.',
    isDisabled: 'ما إذا كان العنصر معطَّلًا. تبقى العناصر المعطَّلة قابلة للتركيز (عبر aria-disabled) كي تظل قابلة للاكتشاف بلوحة المفاتيح والتقنيات المساعدة، لكن التفعيل يكون محظورًا.',
    hasCloseOnSelect: 'ما إذا كان تبديل العنصر يُغلق القائمة. تبقى عناصر مربعات الاختيار مفتوحة افتراضيًا كي يمكن تبديل عدة عناصر في جلسة واحدة.',
    ref: 'مرجع يُمرَّر إلى جذر الصف، وهو العنصر الذي يحمل role="menuitemcheckbox". سجّل الصف لدى مراقب أو طبقة متراكبة تعتمد على العناصر كمفاتيح.',
    endContent: 'محتوى يُعرض بعد التسمية والوصف، مثل تلميح لاختصار لوحة المفاتيح أو شارة.',
  },
};

export const docsDense = {
  name: 'DropdownMenuCheckboxItem',
  isHiddenFromOverview: true,
  displayName: 'Dropdown Menu Checkbox Item',
  description: 'checkable menu item (menuitemcheckbox); independent boolean toggle',
  propDescriptions: {
    label: 'primary label text',
    description: 'secondary text below label',
    icon: 'icon before label',
    value: 'checked state (controlled, w/ onChange)',
    onChange: 'fired w/ next checked state on toggle',
    isDisabled: 'disabled; stays focusable via aria-disabled',
    hasCloseOnSelect: 'close menu on toggle (default false, stays open)',
    ref: 'forwarded to the row root (the role="menuitemcheckbox" element)',
    endContent: 'content after label+description',
  },
};
