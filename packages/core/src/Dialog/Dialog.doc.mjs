/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Dialog',
  displayName: 'Dialog',
  group: 'Dialog',
  category: 'Overlay',
  keywords: ["dialog","modal","popup","overlay","lightbox","alert","confirm","prompt","backdrop","focus trap","imperative"],
  // Intentionally a contained isInline preview, not playground.overlay: the
  // component stays visible on load and knobs stay live, whereas a real
  // showModal() overlay makes the page inert — see ComponentPlaygroundConfig.overlay
  // in docs-types.ts.
  playground: {
    defaults: {
      isOpen: true,
      isInline: true,
      onOpenChange: undefined,
      width: 400,
      children: {
        __element: 'VStack', props: {gap: 2}, children: [
          {__element: 'Heading', props: {level: 3}, children: 'Dialog Title'},
          {__element: 'Text', props: {type: 'body'}, children: 'Are you sure you want to proceed? This action can be undone later from settings.'},
        ],
      },
    },
  },
  theming: {
    container: true,
    targets: [
      {className: 'solo-dialog', visualProps: ['variant']},
      {className: 'solo-dialog-header'},
      {className: 'solo-dialog-header-start-content'},
      {className: 'solo-dialog-header-title-block'},
      {className: 'solo-dialog-header-end-content'},
      {className: 'solo-dialog-header-close-icon'},
    ],
    vars: [
      {name: '--_dialog-radius', description: 'Border radius of the dialog', default: 'var(--radius-container)', private: true},
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_dialog-radius']},
      {property: 'padding', expand: 'container'},
    ],
  },
  description:
    'Modal dialog using the native <dialog> element. Modal and inline content starts with theme body text defaults. Ancestor surface/group membership ends as a whole, including group-owned state. Explicit props and unrelated contexts remain unchanged. Place intentional groups and complete required providers inside the dialog.',
  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the dialog is open.',
      required: true,
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => unknown',
      description: 'Callback when dialog visibility changes.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Dialog content.',
      required: true,
    },
    {
      name: 'width',
      type: 'number | string',
      description: 'Preferred width of the dialog in pixels or any CSS value. Standard dialogs clamp to their container and the dynamic viewport with spacing-token gutters so narrow viewports keep content on screen.',
      default: '400',
    },
    {
      name: 'maxHeight',
      type: 'number | string',
      description: 'Maximum height of the dialog. Defaults to a dynamic viewport value so browser UI changes are reflected where supported.',
      default: "'75dvh'",
    },
    {
      name: 'position',
      type: 'DialogPosition',
      description:
        'Static position for the dialog; centered by default when omitted. ' +
        'Use logical `start`/`end` for inline offsets so positioned dialogs mirror correctly under RTL.',
    },
    {
      name: 'variant',
      type: "'standard' | 'fullscreen'",
      description: 'Dialog variant: fullscreen expands to fill the entire viewport.',
      default: "'standard'",
    },
    {
      name: 'purpose',
      type: "'required' | 'form' | 'info'",
      description: 'Controls dismissal behavior: required disables Escape and backdrop click; form disables backdrop click after interaction; info allows both.',
      default: "'info'",
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Internal padding of the dialog using the spacing scale step.',
    },
    {
      name: 'isInline',
      type: 'boolean',
      description: 'Renders dialog content inline without the <dialog> element, backdrop, or modal behavior. For documentation previews and showcases only.',
      default: 'false',
    },
  ],
  components: [
    {name: 'DialogHeader'},
    {name: 'useImperativeDialog'},
  ],
  usage: {
    description: 'Dialog displays a modal overlay that blocks interaction with the page until the user responds. Use it for delete confirmations, edit forms, terms acceptance, or any decision that should not be skipped.\n\nFor cases where you want to show a dialog without managing open state, use the `useImperativeDialog` hook: call `dialog.show(content)` and render `dialog.element` in your tree.',
    bestPractices: [
      { guidance: true, description: 'Choose the right purpose: info for dismissable content, form to prevent accidental backdrop dismissal, required when the user must respond.' },
      { guidance: true, description: 'Include a clear title in the header so users immediately understand what the dialog is asking.' },
      { guidance: true, description: 'Use purpose="form" for dialogs with inputs so the user can\'t accidentally lose data by clicking the backdrop.' },
      { guidance: true, description: 'Keep dialogs focused on a single task; if the content grows beyond what fits, consider a full page instead.' },
      { guidance: false, description: 'Use a dialog for simple messages that could be shown inline or as a toast notification.' },
      { guidance: false, description: 'Nest dialogs inside other dialogs; restructure the flow into steps within a single dialog instead.' },
      { guidance: false, description: 'Use the fullscreen variant for simple confirmations; it is meant for complex content like editors or long forms.' },
    ],
    anatomy: [
      {name: 'Header', required: true, description: 'Title, optional subtitle, and close button. The title receives focus on open and labels the dialog via aria-labelledby.'},
      {name: 'Body', required: true, description: 'The main content area: text, forms, lists, or any layout.'},
      {name: 'Footer', required: false, description: 'Action buttons like Save/Cancel or Accept/Decline, aligned to the end.'},
      {name: 'Backdrop', required: true, description: 'Semi-transparent overlay behind the dialog that blocks page interaction.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description: 'Dialog displays a modal overlay that blocks interaction with the page until the user responds. Use it for delete confirmations, edit forms, terms acceptance, or any decision that should not be skipped.',
    bestPractices: [
      { guidance: true, description: 'Choose the right purpose: info for dismissable content, form to prevent accidental backdrop dismissal, required when the user must respond.' },
      { guidance: true, description: 'Include a clear title in the header so users immediately understand what the dialog is asking.' },
      { guidance: true, description: 'Use purpose="form" for dialogs with inputs so the user can\'t accidentally lose data by clicking the backdrop.' },
      { guidance: true, description: 'Keep dialogs focused on a single task; if the content grows beyond what fits, consider a full page instead.' },
      { guidance: false, description: 'Use a dialog for simple messages that could be shown inline or as a toast notification.' },
      { guidance: false, description: 'Nest dialogs inside other dialogs; restructure the flow into steps within a single dialog instead.' },
      { guidance: false, description: 'Use the fullscreen variant for simple confirmations; it is meant for complex content like editors or long forms.' },
    ],
    anatomy: [
      {name: 'Header', required: true, description: 'Title, optional subtitle, and close button. The title receives focus on open and labels the dialog via aria-labelledby.'},
      {name: 'Body', required: true, description: 'The main content area: text, forms, lists, or any layout.'},
      {name: 'Footer', required: false, description: 'Action buttons like Save/Cancel or Accept/Decline, aligned to the end.'},
      {name: 'Backdrop', required: true, description: 'Semi-transparent overlay behind the dialog that blocks page interaction.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'مربع حوار مشروط يستخدم عنصر <dialog> الأصلي. يبدأ المحتوى المشروط والمضمّن بالقيم الافتراضية لنص المتن في السمة. ينتهي الانتماء إلى أسطح أو مجموعات الأسلاف بالكامل، بما في ذلك الحالة التي تملكها المجموعة. تبقى الخصائص الصريحة والسياقات غير ذات الصلة دون تغيير. ضع المجموعات المقصودة والمزوّدات المطلوبة كاملةً داخل مربع الحوار.',
  propDescriptions: {
    isOpen: 'ما إذا كان مربع الحوار مفتوحًا.',
    onOpenChange: 'دالة استدعاء عند تغيّر ظهور مربع الحوار.',
    children: 'محتوى مربع الحوار.',
    width: 'العرض المفضّل لمربع الحوار بالبكسل أو بأي قيمة CSS. تتقيّد مربعات الحوار القياسية بحدود حاويتها ومنفذ العرض الديناميكي مع هوامش مستمدة من رموز تصميم المسافات كي تبقى المحتويات ظاهرة على منافذ العرض الضيقة.',
    maxHeight: 'الحد الأقصى لارتفاع مربع الحوار. القيمة الافتراضية قيمة ديناميكية لمنفذ العرض كي تنعكس تغييرات واجهة المتصفح حيثما كان ذلك مدعومًا.',
    position: 'موضع ثابت لمربع الحوار؛ يتوسّط افتراضيًا عند حذفه. استخدم القيمتين المنطقيتين `start`/`end` للإزاحات الأفقية كي تنعكس مربعات الحوار المتموضعة بشكل صحيح في وضع RTL.',
    variant: 'نمط مربع الحوار: fullscreen يتمدد ليملأ منفذ العرض بالكامل.',
    purpose: 'يتحكم في سلوك الإغلاق: required يعطّل Escape والنقر على الخلفية؛ وform يعطّل النقر على الخلفية بعد التفاعل؛ وinfo يسمح بكليهما.',
    padding: 'الحشو الداخلي لمربع الحوار باستخدام خطوة من مقياس المسافات.',
    isInline: 'يعرض محتوى مربع الحوار ضمن السياق دون عنصر <dialog> أو الخلفية أو السلوك المشروط. مخصّص لمعاينات التوثيق والعروض التوضيحية فقط.',
  },
  usage: {
    description: 'يعرض Dialog طبقة متراكبة مشروطة تمنع التفاعل مع الصفحة حتى يستجيب المستخدم. استخدمه لتأكيدات الحذف ونماذج التعديل وقبول الشروط، أو أي قرار لا ينبغي تخطيه.\n\nفي الحالات التي تريد فيها عرض مربع حوار دون إدارة حالة الفتح، استخدم الخطّاف (hook) `useImperativeDialog`: استدعِ `dialog.show(content)` واعرض `dialog.element` في شجرة المكوّنات.',
    bestPractices: [
      {guidance: true, description: 'اختر الغرض المناسب: info للمحتوى القابل للإغلاق، وform لمنع الإغلاق العرضي بالنقر على الخلفية، وrequired عندما يجب على المستخدم الاستجابة.'},
      {guidance: true, description: 'ضمّن عنوانًا واضحًا في الترويسة كي يفهم المستخدمون فورًا ما يطلبه مربع الحوار.'},
      {guidance: true, description: 'استخدم purpose="form" لمربعات الحوار التي تحتوي على حقول إدخال كي لا يفقد المستخدم بياناته عن طريق الخطأ بالنقر على الخلفية.'},
      {guidance: true, description: 'اجعل مربعات الحوار مركّزة على مهمة واحدة؛ وإذا تجاوز المحتوى ما يتسع له، ففكّر في استخدام صفحة كاملة بدلًا من ذلك.'},
      {guidance: false, description: 'استخدام مربع حوار للرسائل البسيطة التي يمكن عرضها ضمن السياق أو كإشعار منبثق.'},
      {guidance: false, description: 'تضمين مربعات حوار داخل مربعات حوار أخرى؛ أعد هيكلة التدفق إلى خطوات داخل مربع حوار واحد بدلًا من ذلك.'},
      {guidance: false, description: 'استخدام النمط fullscreen للتأكيدات البسيطة؛ فهو مخصّص للمحتوى المعقّد مثل المحررات أو النماذج الطويلة.'},
    ],
    anatomy: [
      {name: 'الترويسة', required: true, description: 'العنوان والعنوان الفرعي الاختياري وزر الإغلاق. يتلقى العنوان التركيز عند الفتح ويسمّي مربع الحوار عبر aria-labelledby.'},
      {name: 'المتن', required: true, description: 'منطقة المحتوى الرئيسية: نصوص أو نماذج أو قوائم أو أي تخطيط.'},
      {name: 'التذييل', required: false, description: 'أزرار الإجراءات مثل حفظ/إلغاء أو قبول/رفض، محاذاة إلى النهاية.'},
      {name: 'الخلفية المعتمة', required: true, description: 'طبقة متراكبة شبه شفافة خلف مربع الحوار تمنع التفاعل مع الصفحة.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'modal overlay that blocks page interaction until the user responds',
  usage: {
    description:
      'Dialog displays a modal overlay that blocks page interaction. Use for delete confirmations, edit forms, terms acceptance. Modal and inline content uses theme body defaults and exits ancestor surface/group membership as a whole; explicit props and unrelated contexts remain unchanged. Provide intentional groups and complete required providers inside the dialog.',
    bestPractices: [
      { guidance: true, description: 'Choose the right purpose: info for dismissable content, form to prevent accidental backdrop dismissal, required when user must respond.' },
      { guidance: true, description: 'Include a clear title in the header so users immediately understand what the dialog is asking.' },
      { guidance: true, description: 'Use purpose="form" for dialogs with inputs so user can\'t accidentally lose data by clicking the backdrop.' },
      { guidance: true, description: 'Keep dialogs focused on a single task; if content grows beyond what fits, consider a full page instead.' },
      { guidance: false, description: 'Use a dialog for simple messages that could be shown inline or as a toast notification.' },
      { guidance: false, description: 'Nest dialogs inside other dialogs; restructure the flow into steps within a single dialog instead.' },
      { guidance: false, description: 'Use the fullscreen variant for simple confirmations; it\'s meant for complex content like editors or long forms.' },
    ],
  },
};
