/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useCollapsible',
  displayName: 'useCollapsible',
  group: 'Collapsible',
  keywords: ['collapsible', 'collapse', 'expand', 'toggle', 'accordion', 'disclosure', 'fold'],
  params: [
    {
      name: 'isCollapsible',
      type: "boolean | CollapsibleConfig",
      description: 'Enable collapsible behavior. true = self-managed (starts open). Pass config object for controlled mode or custom defaults.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Unique identifier within an CollapsibleGroup. When present and inside a group, state is managed by the group.',
    },
  ],
  returns: [
    {
      name: 'isEnabled',
      type: 'boolean',
      description: 'Whether collapsible behavior is active.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the content is currently expanded.',
    },
    {
      name: 'toggle',
      type: '() => void',
      description: 'Toggle open/closed state. Dispatches to group, controlled callback, or internal state.',
    },
  ],
  usage: {
    description: 'Reusable hook that encapsulates the collapsible state machine. Supports three modes: group-controlled (inside CollapsibleGroup), controlled (isOpen + onOpenChange), and uncontrolled (self-managed with defaultIsOpen). Used internally by Card and Section.',
    bestPractices: [
      {guidance: true, description: 'Use the hook directly when building custom collapsible components that need Solo collapsible behavior without Collapsible wrapper.'},
      {guidance: true, description: 'For accordion behavior, wrap items in CollapsibleGroup and pass unique value props.'},
      {guidance: false, description: 'Pass local isOpen, defaultIsOpen, or onOpenChange expecting them to run for a value-bound group item; the group owns that state and notification path.'},
      {guidance: false, description: 'Implement your own open/close state when useCollapsible already provides it; the hook handles group coordination automatically.'},
    ],
  },
  relatedComponents: ['Collapsible', 'Card', 'Section'],
  relatedHooks: [],
  importPath: '@solo/core/Collapsible',
  category: 'interaction',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) قابل لإعادة الاستخدام يغلّف آلة حالة الطي والتوسيع، ويدعم الأوضاع المتحكَّم بها من المجموعة والمتحكَّم بها وغير المتحكَّم بها.',
  paramDescriptions: {
    isCollapsible: 'تفعيل سلوك الطي. true = إدارة ذاتية (يبدأ مفتوحًا). مرّر كائن إعدادات للوضع المتحكَّم به أو لقيم افتراضية مخصصة.',
    value: 'معرّف فريد داخل CollapsibleGroup. عند وجوده داخل مجموعة، تتولى المجموعة إدارة الحالة.',
  },
  returnDescriptions: {
    isEnabled: 'ما إذا كان سلوك الطي مفعَّلًا.',
    isOpen: 'ما إذا كان المحتوى موسَّعًا حاليًا.',
    toggle: 'يبدّل حالة الفتح/الإغلاق، ويوجّه التغيير إلى المجموعة أو دالة الاستدعاء المتحكَّم بها أو الحالة الداخلية.',
  },
  usage: {
    description: 'خطّاف (hook) قابل لإعادة الاستخدام يغلّف آلة حالة الطي والتوسيع. يدعم ثلاثة أوضاع: متحكَّم به من المجموعة (داخل CollapsibleGroup)، ومتحكَّم به (isOpen + onOpenChange)، وغير متحكَّم به (إدارة ذاتية مع defaultIsOpen). يستخدمه Card وSection داخليًا.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم الخطّاف مباشرةً عند بناء مكوّنات قابلة للطي مخصصة تحتاج إلى سلوك الطي في Solo دون الغلاف Collapsible.',
      },
      {
        guidance: true,
        description: 'لسلوك الأكورديون، غلّف العناصر في CollapsibleGroup ومرّر خصائص value فريدة.',
      },
      {
        guidance: false,
        description: 'مرّر isOpen أو defaultIsOpen أو onOpenChange محليًا متوقعًا أن تعمل لعنصر مجموعة مرتبط بـ value؛ فالمجموعة تملك تلك الحالة ومسار الإشعار.',
      },
      {
        guidance: false,
        description: 'نفّذ حالة فتح/إغلاق خاصة بك عندما يوفرها useCollapsible بالفعل؛ فالخطّاف يتولى تنسيق المجموعة تلقائيًا.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description: 'Encapsulates collapsible state machine. 3 modes: group-controlled (inside CollapsibleGroup), controlled (isOpen + onOpenChange), uncontrolled (self-managed w/ defaultIsOpen). Used internally by Card + Section.',
  paramDescriptions: {
    isCollapsible: 'enable collapsible behavior. true = self-managed (starts open). Pass config object for controlled mode / custom defaults.',
    value: 'unique id within CollapsibleGroup. When present + inside group, state managed by group.',
  },
  returnDescriptions: {
    isEnabled: 'whether collapsible behavior active.',
    isOpen: 'whether content currently expanded.',
    toggle: 'toggle open/closed. Dispatches to group, controlled callback / internal state.',
  },
  usage: {
    description: 'Encapsulates collapsible state machine. 3 modes: group-controlled (inside CollapsibleGroup), controlled (isOpen + onOpenChange), uncontrolled (self-managed w/ defaultIsOpen). Used internally by Card + Section.',
    bestPractices: [
      {guidance: true, description: 'Use directly when building custom collapsible components needing Solo collapsible behavior w/o Collapsible wrapper.'},
      {guidance: true, description: 'For accordion behavior, wrap items in CollapsibleGroup + pass unique value props.'},
      {guidance: false, description: 'Pass local open state or callbacks expecting them to run for a value-bound group item; the group owns state + notifications.'},
      {guidance: false, description: 'Implement your own open/close state when useCollapsible already provides it; hook handles group coordination automatically.'},
    ],
  },
};
