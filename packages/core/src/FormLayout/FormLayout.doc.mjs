/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'FormLayout',
  displayName: 'Form Layout',
  group: 'Layout',
  category: 'Layout',
  keywords: ["formlayout","form","fieldset","formgroup","formcontainer","fields","vertical","horizontal"],
  props: [
    {
      name: 'direction',
      type: "'vertical' | 'horizontal' | 'horizontal-labels'",
      description:
        'Controls field arrangement. Vertical stacks top-to-bottom, horizontal arranges left-to-right with equal flex-grow, and horizontal-labels uses CSS Grid with labels to the left of inputs (collapses to vertical on narrow viewports <=480px).',
      default: "'vertical'",
    },
    {
      name: 'defaultOptionality',
      type: "'optional' | 'required'",
      description:
        'The state the form treats as its default, so only the exception shows an optional/required indicator. With "optional", only fields marked isRequired show an indicator; with "required", only fields marked isOptional do. A field that restates the default shows nothing. Under "required" the unmarked fields also expose aria-required so screen readers match the visual default; aria-required only, never the native required attribute. Leave unset for today\'s per-field behavior.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Form fields to arrange. Accepts Solo inputs (TextInput, Selector, etc.) and Field-wrapped custom controls.',
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
      {className: 'solo-form-layout', visualProps: ['direction']},
    ],
  },
  usage: {
    description: 'A layout container that arranges form fields with consistent spacing and direction. FormLayout handles where fields go, not state or submission. Wrap it in a <form> for that. Supports vertical (default), horizontal, and horizontal-labels directions, and can be nested to mix them.',
    bestPractices: [
      { guidance: true, description: 'Stack fields vertically for most forms. It\'s the easiest to scan top to bottom.' },
      { guidance: true, description: 'Nest a horizontal FormLayout inside a vertical one when fields naturally pair up, like First Name + Last Name or City + State + ZIP.' },
      { guidance: true, description: 'Use horizontal-labels for settings pages where labels sit beside their inputs.' },
      { guidance: false, description: 'Use FormLayout for form state or submission. It\'s just layout. Wrap it in a <form> for that.' },
      { guidance: false, description: 'Put unrelated fields side by side in a horizontal layout. Save it for fields that belong together.' },
      { guidance: false, description: 'Nest horizontal-labels inside another FormLayout. It uses CSS Grid and needs to be the outermost container.' },
    ],
    anatomy: [
      {name: 'Form title', required: false, description: 'Heading that describes the purpose of the form.'},
      {name: 'Fields', required: true, description: 'Input components with labels for collecting user data.'},
      {name: 'Footer', required: false, description: 'Contains confirmation buttons such as Submit or Cancel.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'FormLayout',
  displayName: 'Form Layout',
  props: [
    {
      name: 'direction',
      type: "'vertical' | 'horizontal' | 'horizontal-labels'",
      description:
        '控制字段排列方式。vertical 从上到下堆叠，horizontal 从左到右排列且等比弹性增长，horizontal-labels 使用 CSS Grid 将标签放在输入框左侧（在窄视口 <=480px 时折叠为垂直布局）。',
      default: "'vertical'",
    },
    {
      name: 'defaultOptionality',
      type: "'optional' | 'required'",
      description:
        '表单视为默认的状态，因此仅例外字段显示可选/必填指示器。设为 "optional" 时，仅标记 isRequired 的字段显示指示器；设为 "required" 时，仅标记 isOptional 的字段显示。与默认一致的字段不显示任何内容。设为 "required" 时，未标记的字段仍会暴露 aria-required，使屏幕阅读器与视觉默认一致——仅作用于 aria-required，不改变原生 required 属性。不设置则保持当前逐字段行为。',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        '要排列的表单字段。接受 Solo 输入组件（TextInput、Selector 等）和 Field 包装的自定义控件。',
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
      {className: 'solo-form-layout', visualProps: ['direction']},
    ],
  },
  usage: {
    description: 'A layout container that arranges form fields with consistent spacing and direction. FormLayout handles where fields go, not state or submission. Wrap it in a <form> for that. Supports vertical (default), horizontal, and horizontal-labels directions, and can be nested to mix them.',
    bestPractices: [
      { guidance: true, description: 'Stack fields vertically for most forms. It\'s the easiest to scan top to bottom.' },
      { guidance: true, description: 'Nest a horizontal FormLayout inside a vertical one when fields naturally pair up, like First Name + Last Name or City + State + ZIP.' },
      { guidance: true, description: 'Use horizontal-labels for settings pages where labels sit beside their inputs.' },
      { guidance: false, description: 'Use FormLayout for form state or submission. It\'s just layout. Wrap it in a <form> for that.' },
      { guidance: false, description: 'Put unrelated fields side by side in a horizontal layout. Save it for fields that belong together.' },
      { guidance: false, description: 'Nest horizontal-labels inside another FormLayout. It uses CSS Grid and needs to be the outermost container.' },
    ],
    anatomy: [
      {name: 'Form title', required: false, description: 'Heading that describes the purpose of the form.'},
      {name: 'Fields', required: true, description: 'Input components with labels for collecting user data.'},
      {name: 'Footer', required: false, description: 'Contains confirmation buttons such as Submit or Cancel.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'حاوية تخطيط ترتّب حقول النماذج بتباعد واتجاه متّسقين، دون أن تتولى الحالة أو الإرسال.',
  propDescriptions: {
    direction: 'يتحكم في ترتيب الحقول. vertical يكدّسها من الأعلى إلى الأسفل، وhorizontal يرتّبها من اليسار إلى اليمين بقيمة flex-grow متساوية، وhorizontal-labels يستخدم CSS Grid مع التسميات على يسار حقول الإدخال (ويتحول إلى الترتيب الرأسي على منافذ العرض الضيقة <=480px).',
    defaultOptionality: 'الحالة التي يعدّها النموذج افتراضية، بحيث لا يُظهر مؤشر optional/required إلا الاستثناء. مع "optional" لا تُظهر المؤشر إلا الحقول المعلَّمة بـ isRequired؛ ومع "required" لا تُظهره إلا الحقول المعلَّمة بـ isOptional. الحقل الذي يكرر القيمة الافتراضية لا يُظهر شيئًا. في وضع "required" تكشف الحقول غير المعلَّمة أيضًا aria-required كي يطابق قارئ الشاشة الافتراضي المرئي؛ وذلك عبر aria-required فقط، وليس سمة required الأصلية أبدًا. اتركه دون تعيين للحفاظ على السلوك الحالي لكل حقل على حدة.',
    children: 'حقول النموذج المراد ترتيبها. يقبل حقول إدخال Solo (TextInput وSelector وغيرها) وعناصر التحكم المخصّصة المغلّفة بـ Field.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'حاوية تخطيط ترتّب حقول النماذج بتباعد واتجاه متّسقين. يتولى FormLayout مواضع الحقول، لا الحالة أو الإرسال. غلّفه بعنصر <form> لذلك. يدعم الاتجاهات vertical (الافتراضي) وhorizontal وhorizontal-labels، ويمكن تضمينه داخل بعضه لمزجها.',
    bestPractices: [
      {guidance: true, description: 'كدّس الحقول رأسيًا في معظم النماذج. فهذا أسهل للمسح البصري من الأعلى إلى الأسفل.'},
      {guidance: true, description: 'ضمّن FormLayout أفقيًا داخل آخر رأسي عندما تتزاوج الحقول بطبيعتها، مثل الاسم الأول + اسم العائلة أو المدينة + الولاية + الرمز البريدي.'},
      {guidance: true, description: 'استخدم horizontal-labels لصفحات الإعدادات حيث تكون التسميات بجوار حقول الإدخال.'},
      {guidance: false, description: 'استخدام FormLayout لحالة النموذج أو إرساله. فهو مجرد تخطيط. غلّفه بعنصر <form> لذلك.'},
      {guidance: false, description: 'وضع حقول غير مترابطة جنبًا إلى جنب في تخطيط أفقي. احتفظ به للحقول التي تنتمي إلى بعضها.'},
      {guidance: false, description: 'تضمين horizontal-labels داخل FormLayout آخر. فهو يستخدم CSS Grid ويجب أن يكون الحاوية الخارجية.'},
    ],
    anatomy: [
      {name: 'عنوان النموذج', required: false, description: 'عنوان يصف الغرض من النموذج.'},
      {name: 'الحقول', required: true, description: 'مكوّنات إدخال ذات تسميات لجمع بيانات المستخدم.'},
      {name: 'التذييل', required: false, description: 'يحتوي على أزرار التأكيد مثل إرسال أو إلغاء.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Layout container for form fields w/ consistent spacing + direction.',
  usage: {
    description: 'A layout container that arranges form fields with consistent spacing and direction. FormLayout handles where fields go, not state or submission. Wrap it in a <form> for that. Supports vertical (default), horizontal, and horizontal-labels directions, and can be nested to mix them.',
    bestPractices: [
      { guidance: true, description: 'Stack fields vertically for most forms. It\'s the easiest to scan top to bottom.' },
      { guidance: true, description: 'Nest a horizontal FormLayout inside a vertical one when fields naturally pair up, like First Name + Last Name or City + State + ZIP.' },
      { guidance: true, description: 'Use horizontal-labels for settings pages where labels sit beside their inputs.' },
      { guidance: false, description: 'Use FormLayout for form state or submission. It\'s just layout. Wrap it in a <form> for that.' },
      { guidance: false, description: 'Put unrelated fields side by side in a horizontal layout. Save it for fields that belong together.' },
      { guidance: false, description: 'Nest horizontal-labels inside another FormLayout. It uses CSS Grid and needs to be the outermost container.' },
    ],
    anatomy: [
      {name: 'Form title', required: false, description: 'Heading that describes the purpose of the form.'},
      {name: 'Fields', required: true, description: 'Input components with labels for collecting user data.'},
      {name: 'Footer', required: false, description: 'Contains confirmation buttons such as Submit or Cancel.'},
    ],
  },
  propDescriptions: {
    direction: 'Field arrangement. Vertical stacks top-to-bottom, horizontal arranges left-to-right w/ equal flex-grow, horizontal-labels uses CSS Grid w/ labels left of inputs (collapses <=480px).',
    defaultOptionality: 'State the form treats as default, so only the exception is marked. "optional" → only isRequired fields show an indicator; "required" → only isOptional fields do. Under "required" unmarked fields also expose aria-required (aria only, not native required). Unset = per-field behavior.',
    children: 'Form fields to arrange. Accepts Solo inputs + Field-wrapped custom controls.',
    className: 'Tailwind classes for layout customization; merged via cn(), so conflicting utilities override defaults.',
  },
};
