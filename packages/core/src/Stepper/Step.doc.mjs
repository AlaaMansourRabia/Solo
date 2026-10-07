/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Step',
  subComponentOf: 'Stepper',
  displayName: 'Step',
  group: 'Stepper',
  category: 'Navigation',
  isHiddenFromOverview: true,
  description:
    "Individual step within a Stepper. Renders a progress-bar segment, an indicator, and a label with optional description. Progress (completed/active/not-started) is derived from the parent Stepper's activeStep and this step's step index.",
  props: [
    {
      name: 'step',
      type: 'number',
      description:
        'Zero-based index of this step. Used to derive progress (completed/active/not-started) relative to the parent activeStep.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Step label text. Kept to a single line and ellipsized when the step is narrower than the label, so a row of horizontal steps stays the same height and the track under them stays straight. The full string is still read out as part of the step, so a truncated label costs nothing in the accessible name — but short labels survive narrow layouts better.',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      description:
        'Optional description shown below the label for additional context.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Content rendered below the label and description. Useful in vertical steppers for form fields or detailed step content. In a compact horizontal Stepper, the content remains mounted to preserve local state while it is hidden with the expanded step details.',
    },
    {
      name: 'status',
      type: "'accent' | 'success' | 'warning' | 'error'",
      description:
        'Semantic color for the step. Controls color only and maps to the global Solo semantic tokens. Leave unset for the progress-derived default coloring.',
    },
    {
      name: 'indicator',
      type: "'auto' | 'number' | 'none' | ReactNode",
      description:
        "What to show as the step indicator. 'auto' shows a number until completed then a check, 'number' always shows a numbered badge, 'none' hides it, or pass any ReactNode (e.g. an Icon) for a fully custom indicator.",
      slotElements: [{__element: 'Icon', props: {icon: 'check', size: 'sm'}}],
      default: "'auto'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables interaction and dims the step indicator and label.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Marks the step as optional, appending an "Optional" affordance after the label.',
      default: 'false',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Trailing content rendered at the end of the label row.',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description:
        'Controls vertical padding of the step. Falls back to the stepper-level density when unset.',
    },
  ],
  // A Step reads its progress from the parent Stepper's context and throws
  // without one, so the preview needs a real Stepper around it. Without this
  // block Step inherits Stepper's playground, which renders it bare and hands
  // it the parent's `activeStep`. The wrapper is vertical because that is the
  // orientation where one step shows its whole anatomy — indicator, label, and
  // description stacked — and `step` matches the wrapper's `activeStep` so the
  // preview opens on the current step rather than an inert upcoming one.
  playground: {
    wrapper: {
      component: 'Stepper',
      props: {activeStep: 1, orientation: 'vertical'},
    },
    defaults: {
      step: 1,
      label: 'Billing address',
      description: 'Used for invoices and tax',
    },
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'خطوة فردية ضمن Stepper. تعرض مقطعًا من شريط التقدّم ومؤشرًا وتسمية مع وصف اختياري. يُشتق التقدّم (مكتملة/نشطة/لم تبدأ) من activeStep في Stepper الأب ومن فهرس step لهذه الخطوة.',
  propDescriptions: {
    step: 'فهرس هذه الخطوة بدءًا من الصفر. يُستخدم لاشتقاق التقدّم (مكتملة/نشطة/لم تبدأ) نسبةً إلى activeStep في الأب.',
    label: 'نص تسمية الخطوة. يُحصر في سطر واحد ويُختصر بعلامة حذف عندما تكون الخطوة أضيق من التسمية، بحيث يبقى صف الخطوات الأفقية بالارتفاع نفسه ويبقى المسار تحتها مستقيمًا. يُقرأ النص الكامل كجزء من الخطوة، لذا لا تخسر التسمية المقتطعة شيئًا من الاسم القابل للوصول — لكن التسميات القصيرة تصمد أفضل في التخطيطات الضيقة.',
    description: 'وصف اختياري يُعرض أسفل التسمية لسياق إضافي.',
    children: 'محتوى يُعرض أسفل التسمية والوصف. مفيد في Stepper العمودي لحقول النماذج أو المحتوى التفصيلي للخطوة. في Stepper الأفقي المدمج، يظل المحتوى مركَّبًا للحفاظ على الحالة المحلية بينما يُخفى مع تفاصيل الخطوة الموسَّعة.',
    status: 'اللون الدلالي للخطوة. يتحكم في اللون فقط ويرتبط برموز التصميم الدلالية العامة في Solo. اتركه دون تعيين للتلوين الافتراضي المشتق من التقدّم.',
    indicator: 'ما يُعرض كمؤشر للخطوة. \'auto\' يعرض رقمًا حتى الاكتمال ثم علامة صح، و\'number\' يعرض دائمًا شارة مرقّمة، و\'none\' يخفيه، أو مرّر أي ReactNode (مثل Icon) لمؤشر مخصص بالكامل.',
    isDisabled: 'يعطّل التفاعل ويخفّت مؤشر الخطوة وتسميتها.',
    isOptional: 'يحدد الخطوة على أنها اختيارية، ويُلحق إشارة "Optional" بعد التسمية.',
    endContent: 'محتوى ختامي يُعرض في نهاية صف التسمية.',
    density: 'يتحكم في الحشوة العمودية للخطوة. يرجع إلى الكثافة المحددة على مستوى Stepper عند عدم تعيينه.',
  },
};
