/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ToggleButton',
  displayName: 'Toggle Button',
  group: 'Button',
  category: 'Action',
  keywords: ["toggle","togglebutton","pressed","toolbar","formatting","segmented","button-group","exclusive","multi-select"],
  playground: {
    defaults: {
      value: 'option-1',
      label: 'Toggle Group',
    },
  },
  theming: {
    targets: [
      {className: 'solo-toggle-button-group'},
      {className: 'solo-toggle-button', states: ['isPressed'], visualProps: ['elevation']},
    ],
  },
  description: 'A button that toggles between pressed and unpressed states. Thin wrapper over Button with controlled toggle pattern, icon swap, and font weight emphasis.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the button. Used as visible text, or as aria-label for icon-only buttons.',
      required: true,
    },
    {
      name: 'isPressed',
      type: 'boolean',
      description: 'Whether the button is currently pressed. Ignored for a ToggleButtonGroup member with a value.',
    },
    {
      name: 'onPressedChange',
      type: '(isPressed: boolean, event: MouseEvent) => void',
      description: 'Called synchronously when pressed state should change. Receives the next state and the click event; call event.preventDefault() to skip pressedChangeAction. Without an Action, the callback produces no Action-pending feedback. Ignored for a ToggleButtonGroup member with a value.',
    },
    {
      name: 'pressedChangeAction',
      type: '(isPressed: boolean) => void | Promise<void>',
      description: 'Action handler for API- or navigation-backed toggles, run in a transition after the synchronous onPressedChange callback unless that callback calls event.preventDefault(). Works without onPressedChange. Shows an optimistic pressed state and a spinner while pending, and remains interruptible by re-clicks. Omit it for callback-only toggles with no Action-pending feedback. Ignored for a ToggleButtonGroup member with a value.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Button size. Defaults to group size when inside a group.',
      default: "'md'",
    },
    {
      name: 'elevation',
      type: "'none' | 'low' | 'med' | 'high'",
      description:
        'Resting shadow depth for floating (FAB-style) toggle buttons, mirroring Button. `none` is the default flat button; `low`/`med`/`high` map to the shadow token scale. Applies inside a ToggleButtonGroup as well — grouped children retain their own elevation.',
      default: "'none'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the button is disabled.',
      default: 'false',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Whether the button shows a loading spinner.',
      default: 'false',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon element. When provided without children, button becomes icon-only with tooltip from label.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'isIconOnly',
      type: 'boolean',
      description: 'When true, renders as a square icon-only button with `label` as the aria-label and an automatic tooltip from the label.',
      default: 'false',
    },
    {
      name: 'pressedIcon',
      type: 'ReactNode',
      description: 'Icon shown when pressed. Falls back to icon if not provided.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Visible content. If omitted with icon, button becomes icon-only.',
    },
    {
      name: 'tooltip',
      type: 'string',
      description: 'Tooltip text shown on hover.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Value identifier when used inside ToggleButtonGroup. Required in groups.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  components: [
    {name: 'ToggleButtonGroup'},
  ],
  usage: {
    description:
      'ToggleButton switches between selected and unselected states to represent a persistent on/off choice. Use it standalone for binary actions like bold, mute, or favorite, or inside a ToggleButtonGroup for single-select or multi-select toolbar controls.',
    accessibility: [
      {
        name: 'Text label',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Unselected', 'Selected', 'Hover', 'Pointer down'],
        description:
          'The label must have at least 4.5:1 contrast with the button background when selected and unselected. For Hover and Pointer down, measure the final background after the overlay is applied.',
      },
      {
        name: 'Essential icon or spinner arc',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Icon only', 'Loading'],
        description:
          'An icon-only ToggleButton must have at least 3:1 contrast between its icon and button background. The moving spinner arc must also meet 3:1. An icon beside a visible label does not need its own check.',
      },
      {
        name: 'Selected state indicator',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 if relied upon',
        states: ['Selected'],
        description:
          'The selected background must reach 3:1 only when users need it to tell selected from unselected. Label weight or a changed icon can also show selection.',
      },
      {
        name: 'Visible control boundary',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 if needed',
        states: ['Rest'],
        description:
          'The button edge needs 3:1 contrast only when users need it to see the control. A visible label or icon can show the control instead.',
      },
      {
        name: 'Keyboard focus indicator',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Focus visible'],
        description:
          'The focus outline must have at least 3:1 contrast with the area around the button. Check both selected and unselected states.',
      },
      {
        name: 'Disabled appearance',
        category: 'Color contrast',
        criterion: '1.4.3 and 1.4.11 exceptions',
        requirement: 'Not required',
        states: ['Disabled'],
        description:
          'Disabled controls do not need to meet these contrast ratios.',
      },
    ],
    bestPractices: [
      {guidance: true, description: 'Use a filled or colored icon for the pressed state so users can see the current state at a glance: an outline star vs a solid star, for example.'},
      {guidance: true, description: 'Keep the label identical between pressed and unpressed states. Let the visual treatment (icon, weight, background) communicate the change.'},
      {guidance: true, description: 'Wrap related toggles in a ToggleButtonGroup with an accessible label so screen readers announce them as a connected set.'},
      {guidance: false, description: "Don't use a ToggleButton for one-time actions like \"Submit\" or \"Delete\"; those are regular Buttons, not toggles."},
      {guidance: false, description: "Don't mix ToggleButtons with regular Buttons inside the same group; use only ToggleButtons in a ToggleButtonGroup."},
      {guidance: false, description: "Don't use a ToggleButton for on/off settings that persist across sessions; use a Switch instead, which better communicates \"setting\" semantics."},
    ],
    anatomy: [
      {name: 'Icon', required: false, description: 'A leading icon that represents the toggle action, like a star for favorite or bold "B" for formatting.'},
      {name: 'Pressed icon', required: false, description: 'An alternate icon shown when pressed: typically a filled version of the default icon to reinforce the active state.'},
      {name: 'Label', required: true, description: 'The visible text or accessible name. For icon-only toggles, used as the aria-label and auto-tooltip.'},
      {name: 'Spinner', required: false, description: 'Replaces the icon during async operations triggered by pressedChangeAction.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'ToggleButton switches between selected and unselected states to represent a persistent on/off choice. Use it standalone for binary actions like bold, mute, or favorite, or inside a ToggleButtonGroup for single-select or multi-select toolbar controls.',
    bestPractices: [
      {guidance: true, description: 'Use a filled or colored icon for the pressed state so users can see the current state at a glance: an outline star vs a solid star, for example.'},
      {guidance: true, description: 'Keep the label identical between pressed and unpressed states. Let the visual treatment (icon, weight, background) communicate the change.'},
      {guidance: true, description: 'Wrap related toggles in a ToggleButtonGroup with an accessible label so screen readers announce them as a connected set.'},
      {guidance: false, description: "Don't use a ToggleButton for one-time actions like \"Submit\" or \"Delete\"; those are regular Buttons, not toggles."},
      {guidance: false, description: "Don't mix ToggleButtons with regular Buttons inside the same group; use only ToggleButtons in a ToggleButtonGroup."},
      {guidance: false, description: "Don't use a ToggleButton for on/off settings that persist across sessions; use a Switch instead, which better communicates \"setting\" semantics."},
    ],
    anatomy: [
      {name: 'Icon', required: false, description: 'A leading icon that represents the toggle action, like a star for favorite or bold "B" for formatting.'},
      {name: 'Pressed icon', required: false, description: 'An alternate icon shown when pressed: typically a filled version of the default icon to reinforce the active state.'},
      {name: 'Label', required: true, description: 'The visible text or accessible name. For icon-only toggles, used as the aria-label and auto-tooltip.'},
      {name: 'Spinner', required: false, description: 'Replaces the icon during async operations triggered by pressedChangeAction.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'زر يتبدّل بين حالتي الضغط وعدم الضغط. غلاف رقيق فوق Button بنمط تبديل متحكَّم به، وتبديل للأيقونة، وإبراز بوزن الخط.',
  propDescriptions: {
    label: 'التسمية القابلة للوصول للزر. تُستخدم كنص مرئي، أو كقيمة aria-label للأزرار ذات الأيقونة فقط.',
    isPressed: 'ما إذا كان الزر مضغوطًا حاليًا. تُتجاهل لعضو ToggleButtonGroup له value.',
    onPressedChange: 'تُستدعى بشكل متزامن عندما يجب أن تتغير حالة الضغط. تتلقى الحالة التالية وحدث النقر؛ استدعِ event.preventDefault() لتخطي pressedChangeAction. دون Action، لا تُنتج دالة الاستدعاء أي ملاحظات لانتظار Action. تُتجاهل لعضو ToggleButtonGroup له value.',
    pressedChangeAction: 'معالج Action لمفاتيح التبديل المعتمدة على API أو التنقّل، يُنفَّذ ضمن انتقال بعد دالة الاستدعاء المتزامنة onPressedChange ما لم تستدعِ تلك الدالة event.preventDefault(). يعمل دون onPressedChange. يعرض حالة ضغط تفاؤلية ومؤشر تحميل أثناء الانتظار، ويبقى قابلًا للمقاطعة بإعادة النقر. احذفه لمفاتيح التبديل المعتمدة على دالة الاستدعاء فقط دون ملاحظات انتظار Action. يُتجاهل لعضو ToggleButtonGroup له value.',
    size: 'حجم الزر. القيمة الافتراضية هي حجم المجموعة عندما يكون داخل مجموعة.',
    elevation: 'عمق الظل في وضع السكون لأزرار التبديل العائمة (بأسلوب FAB)، على غرار Button. القيمة `none` هي الزر المسطح الافتراضي؛ وتقابل `low`/`med`/`high` مقياس رموز تصميم الظل. تنطبق داخل ToggleButtonGroup أيضًا — إذ تحتفظ العناصر الفرعية المجمّعة بارتفاعها الخاص.',
    isDisabled: 'ما إذا كان الزر معطَّلًا.',
    isLoading: 'ما إذا كان الزر يعرض مؤشر تحميل.',
    icon: 'عنصر الأيقونة. عند توفيره دون children، يصبح الزر بأيقونة فقط مع تلميح مأخوذ من label.',
    isIconOnly: 'عندما تكون صحيحة، يُعرض زرًا مربعًا بأيقونة فقط مع استخدام `label` كقيمة aria-label وتلميح تلقائي من التسمية.',
    pressedIcon: 'الأيقونة المعروضة عند الضغط. تعود إلى icon إذا لم تُوفَّر.',
    children: 'المحتوى المرئي. إذا حُذف مع وجود icon، يصبح الزر بأيقونة فقط.',
    tooltip: 'نص التلميح المعروض عند التمرير.',
    value: 'معرّف القيمة عند الاستخدام داخل ToggleButtonGroup. مطلوب في المجموعات.',
    'data-testid': 'محدِّد اختبار لأطر الاختبار الآلي.',
  },
  usage: {
    description: 'يتبدّل ToggleButton بين حالتي التحديد وعدم التحديد لتمثيل خيار تشغيل/إيقاف دائم. استخدمه منفردًا للإجراءات الثنائية مثل الخط العريض أو كتم الصوت أو المفضلة، أو داخل ToggleButtonGroup لعناصر تحكم شريط الأدوات ذات الاختيار الفردي أو المتعدد.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم أيقونة مملوءة أو ملوّنة لحالة الضغط كي يرى المستخدمون الحالة الحالية بنظرة واحدة: نجمة محددة مقابل نجمة مصمتة، على سبيل المثال.',
      },
      {
        guidance: true,
        description: 'أبقِ التسمية متطابقة بين حالتي الضغط وعدم الضغط. ودع المعالجة المرئية (الأيقونة، والوزن، والخلفية) تنقل التغيير.',
      },
      {
        guidance: true,
        description: 'غلّف مفاتيح التبديل المترابطة داخل ToggleButtonGroup مع تسمية قابلة للوصول كي تُعلنها برامج قراءة الشاشة كمجموعة مترابطة.',
      },
      {
        guidance: false,
        description: 'لا تستخدم ToggleButton للإجراءات التي تُنفَّذ مرة واحدة مثل "إرسال" أو "حذف"؛ فتلك أزرار Button عادية وليست مفاتيح تبديل.',
      },
      {
        guidance: false,
        description: 'لا تخلط بين ToggleButton وButton العادية داخل المجموعة نفسها؛ استخدم ToggleButton فقط داخل ToggleButtonGroup.',
      },
      {
        guidance: false,
        description: 'لا تستخدم ToggleButton لإعدادات التشغيل/الإيقاف التي تستمر عبر الجلسات؛ استخدم Switch بدلًا منه، فهو ينقل دلالة "الإعداد" بشكل أفضل.',
      },
    ],
    anatomy: [
      {
        name: 'الأيقونة',
        required: false,
        description: 'أيقونة بادئة تمثل إجراء التبديل، مثل نجمة للمفضلة أو "B" عريض للتنسيق.',
      },
      {
        name: 'أيقونة الضغط',
        required: false,
        description: 'أيقونة بديلة تظهر عند الضغط: عادةً نسخة مملوءة من الأيقونة الافتراضية لتعزيز الحالة النشطة.',
      },
      {
        name: 'التسمية',
        required: true,
        description: 'النص المرئي أو الاسم القابل للوصول. في مفاتيح التبديل ذات الأيقونة فقط، تُستخدم كقيمة aria-label وتلميح تلقائي.',
      },
      {
        name: 'مؤشر التحميل',
        required: false,
        description: 'يحل محل الأيقونة أثناء العمليات غير المتزامنة التي يُطلقها pressedChangeAction.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'toggle btn w/ pressed/unpressed states, icon swap, group integration for single/multi-select',
  usage: {
    description:
      'ToggleButton switches between selected/unselected for persistent on/off choices. Standalone for binary actions or in ToggleButtonGroup for single/multi-select toolbar controls.',
    bestPractices: [
      {guidance: true, description: 'Filled/colored icon for pressed state so users see current state at a glance.'},
      {guidance: true, description: 'Keep label identical between states. Let visual treatment communicate the change.'},
      {guidance: true, description: 'Wrap related toggles in ToggleButtonGroup with accessible label.'},
      {guidance: false, description: "Don't use ToggleButton for one-time actions; use regular Button for submit/delete."},
      {guidance: false, description: "Don't mix ToggleButtons with regular Buttons in the same group."},
      {guidance: false, description: "Don't use ToggleButton for persistent settings; use Switch instead."},
    ],
  },
};
