/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */

const anatomy = [
  {
    name: 'Shared dialog',
    required: true,
    description:
      'One native dialog that owns modality, focus, dismissal, and lifecycle for the complete flow.',
  },
  {
    name: 'Sheet panels',
    required: true,
    description:
      'Direct BottomSheet children; exactly one is interactive while a previous panel may remain visible and inert during a handoff.',
  },
  {
    name: 'Scrim',
    required: false,
    description:
      'Native dialog backdrop shown by the default scrim-backed modal presentation.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'BottomSheetSwitcher',
  displayName: 'Bottom Sheet Switcher',
  group: 'BottomSheet',
  category: 'Overlay',
  keywords: ['bottom sheet', 'switcher', 'multi-step', 'flow', 'wizard'],
  playground: {
    overlay: true,
    overlayControl: {
      stateProp: 'activeSheet',
      openValue: 'details',
    },
    defaults: {
      activeSheet: null,
      children: [
        {
          __element: 'BottomSheet',
          props: {
            sheetId: 'details',
            label: 'Setup details',
            height: 'hug',
          },
          children: {
            __element: 'Section',
            props: {padding: 4},
            children: {
              __element: 'VStack',
              props: {gap: 2},
              children: [
                {
                  __element: 'Heading',
                  props: {level: 3},
                  children: 'Setup details',
                },
                {
                  __element: 'Text',
                  props: {type: 'body'},
                  children: 'Add the essential information for this setup.',
                },
                {
                  __element: 'Text',
                  props: {type: 'supporting'},
                  children: 'You can review these details before saving.',
                },
              ],
            },
          },
        },
        {
          __element: 'BottomSheet',
          props: {
            sheetId: 'preferences',
            label: 'Choose preferences',
            height: 'hug',
          },
          children: {
            __element: 'Section',
            props: {padding: 4},
            children: {
              __element: 'VStack',
              props: {gap: 2},
              children: [
                {
                  __element: 'Heading',
                  props: {level: 3},
                  children: 'Choose preferences',
                },
                {
                  __element: 'Text',
                  props: {type: 'body'},
                  children: 'Select how this setup should behave.',
                },
                {
                  __element: 'Text',
                  props: {type: 'supporting'},
                  children:
                    'Notifications can be sent immediately, daily, or weekly.',
                },
                {
                  __element: 'Text',
                  props: {type: 'supporting'},
                  children: 'You can update these preferences later.',
                },
              ],
            },
          },
        },
        {
          __element: 'BottomSheet',
          props: {
            sheetId: 'confirm',
            label: 'Confirm setup',
            height: 'hug',
          },
          children: {
            __element: 'Section',
            props: {padding: 4},
            children: {
              __element: 'VStack',
              props: {gap: 2},
              children: [
                {
                  __element: 'Heading',
                  props: {level: 3},
                  children: 'Confirm setup',
                },
                {
                  __element: 'Text',
                  props: {type: 'body'},
                  children: 'Everything is ready to save.',
                },
              ],
            },
          },
        },
      ],
    },
  },
  description:
    'Coordinates multiple BottomSheets as a mutually exclusive flow. One activeSheet ID selects the only interactive sheet; during a handoff, the new sheet enters above the inert previous sheet. If the new sheet is shorter, the previous sheet simultaneously moves down until their top edges align, then fades after both transforms complete. The switcher owns one shared native <dialog>: modal flows call showModal() once for one top-layer boundary and one ::backdrop across the whole flow, while no-scrim flows use a non-modal show() shell. Its ref and shared DOM props target that dialog.',
  props: [
    {
      name: 'ref',
      type: 'Ref<HTMLDialogElement>',
      description: 'Ref forwarded to the one shared native dialog.',
    },
    {
      name: 'onCancel',
      type: '(event: SyntheticEvent<HTMLDialogElement>) => void',
      description:
        'Called before the switcher handles a native dialog cancel request. Calling preventDefault() keeps the controlled flow open.',
    },
    {
      name: 'activeSheet',
      type: 'string | null',
      description:
        "ID of the interactive BottomSheet, or null when the flow should close. Match a nested BottomSheet's unique sheetId; the previous sheet may remain visually present and inert while the new sheet enters, simultaneously align downward behind a shorter step, then fade away.",
      required: true,
    },
    {
      name: 'onActiveSheetChange',
      type: '(activeSheet: string | null) => void',
      description:
        "Called with null when the active sheet dismisses according to its purpose. Child BottomSheets may use purpose='form' or purpose='required' to limit implicit dismissal while flow controls can still use the same state setter to switch sheets or close the flow.",
      required: true,
    },
    {
      name: 'hasScrim',
      type: 'boolean',
      description:
        "Whether the shared dialog is modal. true uses showModal() once for one native ::backdrop, focus trap, scroll lock, and click-to-dismiss when the active BottomSheet has purpose='info'. false uses show() with no backdrop and leaves the page interactive; avoid transformed, contained, or clipping ancestors because the non-modal dialog remains in its containing context.",
      default: 'true',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'BottomSheets identified by unique sheetId values.',
      required: true,
    },
  ],
  usage: {
    anatomy,
    description:
      "Coordinates a multi-step bottom-sheet flow in one shared dialog; set activeSheet to a nested BottomSheet's sheetId to open or switch steps, and to null to close.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Use when each step depends on the previous one and only one step needs attention at a time.',
      },
      {
        guidance: true,
        description:
          'Give every child a unique sheetId and non-empty label, choose its purpose to match dismissal requirements, and follow the WAI-ARIA Dialog (Modal) pattern for scrim-backed flows: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/.',
      },
      {
        guidance: false,
        description:
          "Don't split information across sheets when people need to compare it; use a full-page layout that keeps the relevant content visible together instead.",
      },
      {
        guidance: false,
        description:
          "Don't use the switcher when multiple panels must stay interactive or visible together; activeSheet intentionally selects one interactive step.",
      },
    ],
  },
  examples: [
    {
      label: 'Three-step flow',
      code: `const [activeSheet, setActiveSheet] = useState(null);

<>
  <Button label="Start" onClick={() => setActiveSheet('details')} />
  <BottomSheetSwitcher
    activeSheet={activeSheet}
    onActiveSheetChange={setActiveSheet}>
    <BottomSheet sheetId="details" label="Details" height="hug">
      <SetupDetails />
      <Button label="Continue" onClick={() => setActiveSheet('preferences')} />
    </BottomSheet>
    <BottomSheet sheetId="preferences" label="Preferences" height="hug">
      <Preferences />
      <Button label="Back" onClick={() => setActiveSheet('details')} />
      <Button label="Continue" onClick={() => setActiveSheet('confirm')} />
    </BottomSheet>
    <BottomSheet sheetId="confirm" label="Confirm" height="hug">
      <Confirmation />
      <Button label="Back" onClick={() => setActiveSheet('preferences')} />
      <Button label="Done" onClick={() => setActiveSheet(null)} />
    </BottomSheet>
  </BottomSheetSwitcher>
</>`,
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'ينسّق عدة مكوّنات BottomSheet ضمن تدفق متنافٍ لا يُعرض فيه إلا واحد. يحدد معرّف activeSheet واحد اللوحة التفاعلية الوحيدة؛ وأثناء التسليم تدخل اللوحة الجديدة فوق اللوحة السابقة غير التفاعلية (inert). إذا كانت اللوحة الجديدة أقصر، تتحرك اللوحة السابقة إلى الأسفل في الوقت نفسه حتى تتطابق حافتاهما العلويتان، ثم تتلاشى بعد اكتمال التحويلين. يملك المبدِّل عنصر <dialog> أصليًا مشتركًا واحدًا: التدفقات النمطية تستدعي showModal() مرة واحدة للحصول على حد واحد في الطبقة العليا و::backdrop واحد عبر التدفق كله، بينما تستخدم التدفقات التي بلا غطاء (scrim) غلافًا غير نمطي عبر show(). يستهدف ref وخصائص DOM المشتركة ذلك العنصر dialog.',
  propDescriptions: {
    ref: 'مرجع (ref) يُمرَّر إلى عنصر dialog الأصلي المشترك الوحيد.',
    onCancel: 'يُستدعى قبل أن يعالج المبدِّل طلب إلغاء مربع الحوار الأصلي. استدعاء preventDefault() يُبقي التدفق المتحكَّم به مفتوحًا.',
    activeSheet: 'معرّف BottomSheet التفاعلي، أو null عندما يجب إغلاق التدفق. طابِقْه مع sheetId الفريد لأحد مكوّنات BottomSheet المتداخلة؛ وقد تبقى اللوحة السابقة ظاهرة وغير تفاعلية أثناء دخول اللوحة الجديدة، وتنزاح إلى الأسفل في الوقت نفسه خلف خطوة أقصر، ثم تتلاشى.',
    onActiveSheetChange: 'يُستدعى بالقيمة null عندما تُغلق اللوحة النشطة وفقًا لغرضها. يمكن لمكوّنات BottomSheet الأبناء استخدام purpose=\'form\' أو purpose=\'required\' لتقييد الإغلاق الضمني، بينما تظل عناصر التحكم في التدفق قادرة على استخدام دالة تعيين الحالة نفسها للتبديل بين اللوحات أو إغلاق التدفق.',
    hasScrim: 'ما إذا كان مربع الحوار المشترك نمطيًا (modal). القيمة true تستدعي showModal() مرة واحدة للحصول على ::backdrop أصلي واحد وحبس التركيز وقفل التمرير والإغلاق بالنقر عندما تكون قيمة purpose للوحة BottomSheet النشطة \'info\'. القيمة false تستخدم show() دون خلفية وتُبقي الصفحة تفاعلية؛ تجنّب العناصر الأسلاف ذات التحويلات أو الاحتواء أو القص لأن مربع الحوار غير النمطي يبقى ضمن سياقه الحاوي.',
    children: 'مكوّنات BottomSheet المعرَّفة بقيم sheetId فريدة.',
  },
  usage: {
    description: 'ينسّق تدفقًا متعدد الخطوات من اللوحات السفلية داخل مربع حوار مشترك واحد؛ عيّن activeSheet إلى sheetId لأحد مكوّنات BottomSheet المتداخلة لفتح الخطوات أو التبديل بينها، وإلى null للإغلاق.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدمه عندما تعتمد كل خطوة على سابقتها ولا تحتاج إلا خطوة واحدة إلى الانتباه في كل مرة.',
      },
      {
        guidance: true,
        description: 'امنح كل ابن sheetId فريدًا وlabel غير فارغ، واختر purpose بما يطابق متطلبات الإغلاق، واتبع نمط WAI-ARIA Dialog (Modal) في التدفقات المدعومة بغطاء: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/.',
      },
      {
        guidance: false,
        description: 'لا توزّع المعلومات على عدة لوحات عندما يحتاج المستخدمون إلى مقارنتها؛ استخدم بدلًا من ذلك تخطيطًا بملء الصفحة يُبقي المحتوى ذا الصلة ظاهرًا معًا.',
      },
      {
        guidance: false,
        description: 'لا تستخدم المبدِّل عندما يجب أن تبقى عدة لوحات تفاعلية أو ظاهرة معًا؛ إذ يختار activeSheet عمدًا خطوة تفاعلية واحدة.',
      },
    ],
    anatomy: [
      {
        name: 'مربع الحوار المشترك',
        required: true,
        description: 'عنصر dialog أصلي واحد يملك النمطية والتركيز والإغلاق ودورة الحياة للتدفق كاملًا.',
      },
      {
        name: 'لوحات الأوراق',
        required: true,
        description: 'أبناء BottomSheet مباشرون؛ واحد منها فقط تفاعلي، بينما قد تبقى لوحة سابقة ظاهرة وغير تفاعلية أثناء التسليم.',
      },
      {
        name: 'الغطاء',
        required: false,
        description: 'خلفية مربع الحوار الأصلية التي تظهر في العرض النمطي الافتراضي المدعوم بغطاء.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'controller with one shared native dialog for mutually exclusive multi-step BottomSheets',
  usage: {
    anatomy,
    description:
      "Coordinates a multi-step bottom-sheet flow in one shared dialog; set activeSheet to a nested BottomSheet's sheetId to open or switch steps, and to null to close.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Use when each step depends on the previous one and only one step needs attention at a time.',
      },
      {
        guidance: true,
        description:
          'Give every child a unique sheetId and non-empty label, choose its purpose to match dismissal requirements, and follow the WAI-ARIA Dialog (Modal) pattern for scrim-backed flows: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/.',
      },
      {
        guidance: false,
        description:
          "Don't split information across sheets when people need to compare it; use a full-page layout that keeps the relevant content visible together instead.",
      },
      {
        guidance: false,
        description:
          "Don't use the switcher when multiple panels must stay interactive or visible together; activeSheet intentionally selects one interactive step.",
      },
    ],
  },
};
