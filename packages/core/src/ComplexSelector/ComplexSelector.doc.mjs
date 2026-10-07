/**
 * @file ComplexSelector.doc.mjs
 * @input ComplexSelector public API and composition contract
 * @output Exports full and dense component documentation
 * @position Core documentation consumed by CLI and Storybook autodocs
 *
 * SYNC: When modified, update ComplexSelector.tsx, tests, and stories.
 */

/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Field',
    required: true,
    description:
      'Field shell that provides the label and optional supporting field content.',
  },
  {
    name: 'Trigger',
    required: true,
    description:
      'Control that displays the current value or placeholder and opens the popup.',
  },
  {
    name: 'Icon-rendered start icon',
    required: false,
    description:
      'Optional leading semantic icon or icon component rendered through Icon.',
  },
  {
    name: 'Caller-rendered start content',
    required: false,
    description:
      'Optional arbitrary React content rendered directly at the start of the trigger.',
  },
  {
    name: 'Indicator icon',
    required: true,
    description:
      'Trailing chevron that rotates to reflect whether the popup is open.',
  },
  {
    name: 'Popup',
    required: true,
    description:
      'Mounted dialog surface that is painted and shown while open and hidden while closed.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ComplexSelector',
  displayName: 'Complex Selector',
  group: 'Selector',
  category: 'Form Controls',
  keywords: [
    'selector',
    'picker',
    'popover',
    'dialog',
    'custom',
    'rich',
    'matrix',
    'grid',
  ],
  theming: {
    targets: [
      {
        className: 'solo-complex-selector',
        visualProps: ['variant', 'size', 'status'],
      },
      {
        className: 'solo-complex-selector-indicator-icon',
        states: ['state'],
      },
      {className: 'solo-complex-selector-popup'},
    ],
  },
  components: [
    {
      name: 'ComplexSelector',
      displayName: 'Complex Selector',
      description:
        'An input or toolbar trigger and dialog-popover shell for custom selector content.',
      props: [
        {
          name: 'label',
          type: 'string',
          description: 'Label text for accessibility and the field label.',
          required: true,
        },
        {
          name: 'isLabelHidden',
          type: 'boolean',
          description:
            'Visually hides the field label while keeping it accessible.',
          default: 'false',
        },
        {
          name: 'description',
          type: 'string',
          description:
            'Helper text displayed below the label.',
        },
        {
          name: 'labelTooltip',
          type: 'string',
          description:
            'Tooltip text displayed next to the label.',
        },
        {
          name: 'isOptional',
          type: 'boolean',
          description:
            'Marks the field as optional.',
          default: 'false',
        },
        {
          name: 'isRequired',
          type: 'boolean',
          description:
            'Marks the field as required.',
          default: 'false',
        },
        {
          name: 'value',
          type: 'Value',
          description: 'Current controlled value.',
          required: true,
        },
        {
          name: 'onChange',
          type: '(value: Value) => void',
          description: 'Called when custom content commits a new value.',
        },
        {
          name: 'changeAction',
          type: '(value: Value) => void | Promise<void>',
          description:
            'Async action after onChange. ComplexSelector exposes optimistic value and busy state while pending.',
        },
        {
          name: 'children',
          type: '(value: Value, onChange: (value: Value) => void, close: () => void, state: ComplexSelectorRenderState) => ReactNode',
          description:
            'Custom dialog content. Receives positional value, onChange, close, and state helpers.',
          required: true,
        },
        {
          name: 'triggerLabel',
          type: 'ReactNode',
          description: 'Label/content shown in the closed trigger.',
        },
        {
          name: 'placeholder',
          type: 'ReactNode',
          description: 'Placeholder shown when triggerLabel is omitted.',
          default: "'Select...'",
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description: 'Disables the selector.',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          description: 'Shows loading state on the trigger.',
        },
        {
          name: 'status',
          type: "{type: 'warning' | 'error' | 'success', message?: string}",
          description: 'Validation status.',
        },
        {
          name: 'statusVariant',
          type: "'attached' | 'detached' | 'tooltip'",
          description:
            'How the status message is placed relative to the trigger. attached sits directly below the bordered input; a ghost selector detaches an attached status automatically. Use tooltip for compact toolbar controls.',
          default: "'attached'",
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          description: 'Exact trigger height: sm 28px, md 32px, or lg 36px.',
          default: "'md'",
        },
        {
          name: 'variant',
          type: "'input' | 'ghost'",
          description:
            'Visual trigger style. Input is the bordered form treatment; ghost matches toolbar buttons.',
          default: "'input'",
        },
        {
          name: 'startIcon',
          type: 'ReactNode | IconType',
          description: 'Icon displayed at the start of the trigger.',
        },
        {
          name: 'width',
          type: 'SizeValue',
          description: 'Width of the field.',
        },
        {
          name: 'placement',
          type: "'above' | 'below' | 'start' | 'end'",
          description: 'Popup placement.',
          default: "'below'",
        },
        {
          name: 'alignment',
          type: "'start' | 'center' | 'end'",
          description: 'Popup alignment along the placement axis.',
          default: "'start'",
        },
        {
          name: 'renderTrigger',
          type: '(props: ComplexSelectorRenderTriggerProps) => ReactNode',
          description:
            "Render the control the popup hangs off — a glyph in a list row, a chip, an icon button — instead of the selector's own field and button. Spread the given props ({ref, id, onClick, onKeyDown, aria-haspopup, aria-expanded, aria-controls, aria-busy}) onto it; the popup is anchored to that control and still labelled by `label`. The field chrome is not rendered. Pair with handleRef to open from a keystroke elsewhere.",
        },
        {
          name: 'handleRef',
          type: 'React.Ref<ComplexSelectorHandle>',
          description:
            'Imperative handle for programmatic control. Exposes open(), close(), toggle(), and isOpen().',
        },
        {
          name: 'onOpenChange',
          type: '(isOpen: boolean) => void',
          description:
            'Called whenever the surface opens or closes, however it happened — trigger, keyboard, light dismiss, Escape, close(), or the imperative handle.',
        },
        {
          name: 'contentClassName',
          type: 'string',
          description: 'Tailwind classes for the popup content container.',
        },
      ],
    },
  ],
  usage: {
    anatomy,
    description:
      'Use ComplexSelector when a selection needs richer custom content than a Selector option row. It is intentionally one component: ComplexSelector owns the field, trigger, popover, focus restore, and changeAction flow, while the content render prop owns the selector-specific accessible structure.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use variant="ghost" with a startIcon when the selector is triggered from a toolbar. Use alignment="end" when a wide surface should align its end edge to the trigger.',
      },
      {
        guidance: true,
        description:
          'For staged editors, keep draft state in the composed content and call the provided onChange helper only from Apply. Cancel or dismiss without committing.',
      },
      {
        guidance: true,
        description:
          'Compose the dialog content from the appropriate accessible structure for the job: RadioList for a simple choice, Calendar/date inputs for date picking, TreeList or a searchable list for hierarchy, or a custom grid when two-dimensional arrow navigation is useful.',
      },
      {
        guidance: true,
        description:
          'Use the provided onChange helper from children; it already calls both onChange and changeAction and updates optimistic busy state.',
      },
      {
        guidance: true,
        description:
          'Call close() from custom content when a selection should dismiss the popup. Keep it open for multi-step content or freeform entry flows.',
      },
      {
        guidance: true,
        description:
          'Use Solo focus hooks for custom content: useGridFocus for two-dimensional grids, useTreeFocus through TreeList for hierarchies, and useListFocus for custom linear collections.',
      },
      {
        guidance: true,
        description:
          'Evaluate custom content against WCAG 2.2: keyboard operation, focus visible/not obscured, names and roles, labels/instructions, target size, and contrast/non-text contrast are especially relevant for selector popovers.',
      },
      {
        guidance: false,
        description:
          'Do not rebuild trigger ARIA, popover focus management, or changeAction handling in product code.',
      },
      {
        guidance: false,
        description:
          'Do not use ComplexSelector for a plain single-column text list; use Selector instead.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'مكوّن ComplexSelector يوفّر مشغّلًا لحقل إدخال أو شريط أدوات مع غلاف نافذة منبثقة بنمط مربع حوار لعرض محتوى محدِّد مخصّص أغنى من صفوف خيارات Selector.',
  usage: {
    description: 'استخدم ComplexSelector عندما يحتاج الاختيار إلى محتوى مخصّص أغنى من صف خيار في Selector. وهو مكوّن واحد عن قصد: يتولّى ComplexSelector الحقل والمشغّل والنافذة المنبثقة واستعادة التركيز وتدفّق changeAction، بينما تتولّى خاصية العرض content البنية القابلة للوصول الخاصة بالمحدِّد.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم variant="ghost" مع startIcon عندما يُشغَّل المحدِّد من شريط أدوات. واستخدم alignment="end" عندما ينبغي أن تحاذي مساحة عريضة حافتها الختامية مع المشغّل.',
      },
      {
        guidance: true,
        description: 'في المحرّرات المرحلية، احتفظ بحالة المسودة داخل المحتوى المركّب واستدعِ الدالة المساعدة onChange المقدَّمة من زر التطبيق (Apply) فقط. ألغِ أو أغلق دون اعتماد التغييرات.',
      },
      {
        guidance: true,
        description: 'ركّب محتوى مربع الحوار من البنية القابلة للوصول المناسبة للمهمة: RadioList لاختيار بسيط، وCalendar أو حقول إدخال التاريخ لاختيار التاريخ، وTreeList أو قائمة قابلة للبحث للتسلسل الهرمي، أو شبكة مخصّصة عندما يكون التنقّل ثنائي الأبعاد بمفاتيح الأسهم مفيدًا.',
      },
      {
        guidance: true,
        description: 'استخدم الدالة المساعدة onChange المقدَّمة من children؛ فهي تستدعي بالفعل كلًّا من onChange وchangeAction وتحدّث حالة الانشغال التفاؤلية.',
      },
      {
        guidance: true,
        description: 'استدعِ close() من المحتوى المخصّص عندما ينبغي أن يُغلق الاختيار النافذة المنبثقة. وأبقِها مفتوحة للمحتوى متعدد الخطوات أو تدفّقات الإدخال الحر.',
      },
      {
        guidance: true,
        description: 'استخدم خطّافات التركيز في Solo للمحتوى المخصّص: useGridFocus للشبكات ثنائية الأبعاد، وuseTreeFocus عبر TreeList للتسلسلات الهرمية، وuseListFocus للمجموعات الخطية المخصّصة.',
      },
      {
        guidance: true,
        description: 'قيّم المحتوى المخصّص وفق WCAG 2.2: التشغيل بلوحة المفاتيح، وظهور التركيز وعدم حجبه، والأسماء والأدوار، والتسميات والتعليمات، وحجم الهدف، والتباين وتباين العناصر غير النصية، وهي معايير وثيقة الصلة بشكل خاص بالنوافذ المنبثقة للمحدِّدات.',
      },
      {
        guidance: false,
        description: 'لا تُعِد بناء سمات ARIA للمشغّل أو إدارة التركيز في النافذة المنبثقة أو معالجة changeAction في شيفرة المنتج.',
      },
      {
        guidance: false,
        description: 'لا تستخدم ComplexSelector لقائمة نصية بسيطة من عمود واحد؛ استخدم Selector بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'الحقل',
        required: true,
        description: 'غلاف الحقل الذي يوفّر التسمية والمحتوى الداعم الاختياري للحقل.',
      },
      {
        name: 'المشغّل',
        required: true,
        description: 'عنصر التحكم الذي يعرض القيمة الحالية أو النص الإرشادي ويفتح النافذة المنبثقة.',
      },
      {
        name: 'أيقونة البداية المعروضة عبر Icon',
        required: false,
        description: 'أيقونة دلالية بادئة اختيارية أو مكوّن أيقونة يُعرض عبر Icon.',
      },
      {
        name: 'محتوى البداية الذي يعرضه المستدعي',
        required: false,
        description: 'محتوى React اختياري عشوائي يُعرض مباشرةً في بداية المشغّل.',
      },
      {
        name: 'أيقونة المؤشّر',
        required: true,
        description: 'سهم ختامي يدور ليعكس ما إذا كانت النافذة المنبثقة مفتوحة.',
      },
      {
        name: 'النافذة المنبثقة',
        required: true,
        description: 'سطح مربع حوار مُركَّب يُرسم ويظهر أثناء الفتح ويُخفى أثناء الإغلاق.',
      },
    ],
  },
  components: [
    {
      name: 'ComplexSelector',
      displayName: 'محدِّد مركّب',
      description: 'مشغّل لحقل إدخال أو شريط أدوات مع غلاف نافذة منبثقة بنمط مربع حوار لمحتوى محدِّد مخصّص.',
      propDescriptions: {
        label: 'نص التسمية لإمكانية الوصول ولتسمية الحقل.',
        isLabelHidden: 'يُخفي تسمية الحقل بصريًا مع إبقائها قابلة للوصول.',
        description: 'نص مساعد يُعرض أسفل التسمية.',
        labelTooltip: 'نص تلميح يُعرض بجوار التسمية.',
        isOptional: 'يضع علامة على الحقل بأنه اختياري.',
        isRequired: 'يضع علامة على الحقل بأنه مطلوب.',
        value: 'القيمة الحالية المتحكَّم بها.',
        onChange: 'تُستدعى عندما يعتمد المحتوى المخصّص قيمة جديدة.',
        changeAction: 'إجراء غير متزامن بعد onChange. يعرض ComplexSelector قيمة تفاؤلية وحالة انشغال أثناء الانتظار.',
        children: 'محتوى مربع الحوار المخصّص. يتلقّى value وonChange وclose ودوال الحالة المساعدة كوسائط موضعية.',
        triggerLabel: 'التسمية أو المحتوى المعروض في المشغّل المغلق.',
        placeholder: 'النص الإرشادي المعروض عند حذف triggerLabel.',
        isDisabled: 'يعطّل المحدِّد.',
        isLoading: 'يعرض حالة التحميل على المشغّل.',
        status: 'حالة التحقق.',
        statusVariant: 'طريقة وضع رسالة الحالة بالنسبة إلى المشغّل. يضعها attached مباشرةً أسفل حقل الإدخال ذي الحدود؛ ويفصل المحدِّد ghost الحالة المرفقة تلقائيًا. استخدم tooltip لعناصر تحكم شريط الأدوات المدمجة.',
        size: 'الارتفاع الدقيق للمشغّل: sm بقيمة 28px، أو md بقيمة 32px، أو lg بقيمة 36px.',
        variant: 'النمط المرئي للمشغّل. input هو أسلوب النماذج ذو الحدود؛ وghost يطابق أزرار شريط الأدوات.',
        startIcon: 'أيقونة تُعرض في بداية المشغّل.',
        width: 'عرض الحقل.',
        placement: 'موضع النافذة المنبثقة.',
        alignment: 'محاذاة النافذة المنبثقة على امتداد محور الموضع.',
        renderTrigger: 'يعرض عنصر التحكم الذي تتعلّق به النافذة المنبثقة — رمزًا في صف قائمة، أو شريحة، أو زر أيقونة — بدلًا من الحقل والزر الخاصين بالمحدِّد. وزّع الخصائص المعطاة ({ref, id, onClick, onKeyDown, aria-haspopup, aria-expanded, aria-controls, aria-busy}) عليه؛ إذ تُثبَّت النافذة المنبثقة على ذلك العنصر وتظل مُسمّاة بواسطة `label`. لا يُعرض إطار الحقل. اقرنه مع handleRef للفتح بضغطة مفتاح من مكان آخر.',
        handleRef: 'مقبض أمري للتحكم البرمجي. يوفّر open() وclose() وtoggle() وisOpen().',
        onOpenChange: 'تُستدعى كلما فُتح السطح أو أُغلق، أيًّا كانت الطريقة — المشغّل، أو لوحة المفاتيح، أو الإغلاق الخفيف، أو Escape، أو close()، أو المقبض الأمري.',
        contentClassName: 'أصناف Tailwind لحاوية محتوى النافذة المنبثقة.',
      },
    },
  ],
};

export const docsDense = {
  name: 'ComplexSelector',
  displayName: 'Complex Selector',
  group: 'Selector',
  category: 'Form Controls',
  description:
    'Input/ghost trigger + dialog-popover shell for rich custom selectors. Content gets value/onChange/close/state; content owns semantics. Use focus hooks and evaluate custom content against WCAG 2.2.',
  usage: {
    anatomy,
    description:
      'Use when a selection needs richer custom content than a Selector row. One component: it owns field, trigger, popover, focus restore, and changeAction; the render prop owns the selector-specific accessible structure.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use variant="ghost" with a startIcon for a toolbar trigger. Use alignment="end" when a wide surface should align its end edge to the trigger.',
      },
      {
        guidance: true,
        description:
          'For staged editors, keep draft state in the composed content and call the provided onChange helper only from Apply. Cancel or dismiss without committing.',
      },
      {
        guidance: true,
        description:
          'Compose content from the right accessible structure: RadioList for a simple choice, Calendar/date inputs for dates, TreeList or a searchable list for hierarchy, a custom grid for 2D arrow navigation.',
      },
      {
        guidance: true,
        description:
          'Use the onChange helper from children; it calls both onChange and changeAction and updates optimistic busy state.',
      },
      {
        guidance: true,
        description:
          'Call close() from custom content when a selection should dismiss the popup. Keep it open for multi-step or freeform flows.',
      },
      {
        guidance: true,
        description:
          'Use Solo focus hooks: useGridFocus for 2D grids, useTreeFocus via TreeList for hierarchies, useListFocus for custom linear collections.',
      },
      {
        guidance: true,
        description:
          'Evaluate custom content against WCAG 2.2: keyboard operation, focus visible/not obscured, names and roles, labels/instructions, target size, and contrast.',
      },
      {
        guidance: false,
        description:
          'Do not rebuild trigger ARIA, popover focus management, or changeAction handling in product code.',
      },
      {
        guidance: false,
        description:
          'Do not use ComplexSelector for a plain single-column text list; use Selector instead.',
      },
    ],
  },
  propDescriptions: {
    label: 'Accessible field label.',
    isLabelHidden: 'Visually hide the label (still accessible).',
    description: 'Helper text below the label.',
    labelTooltip: 'Tooltip text next to the label.',
    isOptional: 'Mark the field optional.',
    isRequired: 'Mark the field required.',
    value: 'Controlled value.',
    onChange: 'Commit value.',
    changeAction: 'Async action after onChange; drives optimistic value/busy.',
    children: 'Render custom dialog content from (value,onChange,close,state).',
    triggerLabel: 'Closed trigger label/content.',
    variant: 'input for forms; ghost for toolbar triggers.',
    startIcon: 'Leading trigger icon.',
    placement: 'Popup placement.',
    alignment: 'Popup alignment.',
    renderTrigger:
      'Caller-rendered opener replacing the field+button; spread the given props; popup anchored to it, labelled by label.',
    handleRef: 'Imperative open/close/toggle handle.',
    onOpenChange: 'Notified on every open and close, whatever caused it.',
    accessibility:
      'Custom content must provide its own accessible structure. Use focus hooks and evaluate against WCAG 2.2.',
    statusVariant: 'Status placement: attached | detached | tooltip; ghost detaches attached.',
  },
};
