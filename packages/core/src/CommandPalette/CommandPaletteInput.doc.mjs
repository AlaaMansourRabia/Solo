/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'CommandPaletteInput',
  subComponentOf: 'CommandPalette',
  displayName: 'Command Palette Input',
  isHiddenFromOverview: true,
  description:
    'Search input slot. Auto-focuses on mount. Wires to command palette context when used inside CommandPalette.',
  props: [
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text for the input.',
      default: "'Search...'",
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for the combobox input, announced by screen readers. Falls back to the placeholder text when omitted.',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description:
        'Auto-focus the input when mounted. Automatically disabled when inside an inline command palette.',
      default: 'true',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content rendered at the trailing end of the input, after the spinner. Use for clear buttons or keyboard shortcut hints.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'chevronDown',
            size: 'sm',
          },
        },
        {
          __element: 'Badge',
          props: {
            label: '3',
          },
        },
      ],
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Search value. When omitted inside CommandPalette, reads from context.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description:
        'Called when search value changes. When omitted inside CommandPalette, writes to context.',
    },
    {
      name: 'onChange',
      type: '(event: ChangeEvent<HTMLInputElement>) => void',
      description:
        'Native change handler for the input element. Runs after onValueChange.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  playground: {
    defaults: {
      placeholder: 'Search commands, files, or actions...',
      hasAutoFocus: false,
    },
  },
};

export const docsZh = {
  name: 'CommandPaletteInput',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Input',
  description:
    '搜索输入插槽。挂载时自动聚焦。在 CommandPalette 内使用时连接到上下文。',
  propDescriptions: {
    placeholder: '输入框的占位文本。',
    label: '组合框输入的无障碍标签，供屏幕阅读器朗读。省略时回退到占位文本。',
    hasAutoFocus: '挂载时自动聚焦输入框。内联命令面板中自动禁用。',
    endContent: '渲染在输入框末尾的内容，位于加载指示器之后。',
    value: '搜索值。在 CommandPalette 内省略时从上下文读取。',
    onValueChange: '搜索值变化时调用。在 CommandPalette 内省略时写入上下文。',
    onChange: '输入元素的原生 change 处理函数，在 onValueChange 之后调用。',
    className: '用于布局自定义的 Tailwind 类，通过 cn() 与组件类合并，冲突的工具类会覆盖默认值。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'خانة حقل إدخال البحث. يتلقى التركيز تلقائيًا عند التركيب. يرتبط بسياق لوحة الأوامر عند استخدامه داخل CommandPalette.',
  propDescriptions: {
    placeholder: 'النص الإرشادي لحقل الإدخال.',
    label: 'تسمية قابلة للوصول لحقل إدخال combobox، يعلنها قارئ الشاشة. تعود إلى النص الإرشادي عند حذفها.',
    hasAutoFocus: 'يمنح حقل الإدخال التركيز تلقائيًا عند تركيبه. يُعطَّل تلقائيًا داخل لوحة أوامر مضمّنة.',
    endContent: 'محتوى يُعرض في الطرف الختامي لحقل الإدخال، بعد مؤشر التحميل. استخدمه لأزرار المسح أو تلميحات اختصارات لوحة المفاتيح.',
    value: 'قيمة البحث. عند حذفها داخل CommandPalette، تُقرأ من السياق.',
    onValueChange: 'يُستدعى عند تغيّر قيمة البحث. عند حذفه داخل CommandPalette، يكتب إلى السياق.',
    onChange: 'معالج التغيير الأصلي لعنصر الإدخال. يُنفَّذ بعد onValueChange.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث يتجاوز أي صنف متعارض القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'CommandPaletteInput',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Input',
  description:
    'search input; auto-focus on mount; wires to context inside CommandPalette',
  propDescriptions: {
    placeholder: 'input placeholder text',
    label: 'accessible label for the combobox; falls back to placeholder',
    hasAutoFocus: 'auto-focus on mount; auto-disabled in inline mode',
    endContent: 'trailing content after spinner',
    value: 'search value; reads context when omitted inside palette',
    onValueChange:
      'called on change; writes context when omitted inside palette',
    onChange: 'native input change handler; runs after onValueChange',
    className: 'Tailwind layout classes; merged via cn(), so conflicting utilities override defaults',
  },
};
