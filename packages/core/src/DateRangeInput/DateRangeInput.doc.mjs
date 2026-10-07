/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'DateRangeInput',
  displayName: 'Date Range Input',
  group: 'DateInput',
  category: 'Form Controls',
  keywords: [
    'daterangepicker',
    'daterange',
    'range',
    'calendar',
    'filter',
    'analytics',
    'period',
    'schedule',
  ],
  props: [
    {name: 'label', type: 'string', description: 'Label text.', required: true},
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text displayed below the label.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Show an "(optional)" indicator.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Mark the field as required.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disable the trigger and picker.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the field focusable via aria-disabled (activation stays blocked). Use this instead of wrapping a disabled DateRangeInput in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'value',
      type: 'DateRange | null',
      description:
        'Selected date range or null. Import the `DateRange` type from `@solo/core/DateRangeInput`; it is `{start: ISODateString, end: ISODateString}`. Do NOT redeclare your own DateRange type; use the exported one so TypeScript structurally matches.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: DateRange | null) => void',
      description:
        'Callback when the range changes. Called with null on clear.',
      required: true,
    },
    {
      name: 'changeAction',
      type: '(value: DateRange | null) => void | Promise<void>',
      description:
        'Async action fired after onChange. Drives optimistic UI updates via useTransition.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Whether the input is in a loading state. Disables interaction and shows a spinner.',
      default: 'false',
    },
    {
      name: 'min',
      type: 'ISODateString',
      description:
        'Minimum selectable date. `ISODateString` is a template literal type (`\\`${number}${number}${number}${number}-${number}${number}-${number}${number}\\``). Pass a string literal like `"2026-01-28"`, not a runtime string variable. Import it from `@solo/core/Calendar` or use `as ISODateString` if computing the value dynamically.',
    },
    {
      name: 'max',
      type: 'ISODateString',
      description:
        'Maximum selectable date. Same template literal type as `min`: use a YYYY-MM-DD string literal or cast with `as ISODateString`.',
    },
    {
      name: 'dateConstraints',
      type: 'ReadonlyArray<(date: Date) => boolean>',
      description: 'Custom constraint functions to disable specific dates.',
    },
    {
      name: 'maxRangeSpan',
      type: 'number',
      description:
        'Maximum days a selected range may span, counting both endpoints (`7` = a 7-day window, start + 6). Once a start is picked, days beyond this distance are disabled so the range cannot stretch past the cap. Rolling window relative to the start; for fixed calendar bounds use `min`/`max`. Constrains selection only; it never rewrites a `value` already wider than the cap (flag that with `status`).',
    },
    {
      name: 'minRangeSpan',
      type: 'number',
      description:
        'Minimum days a selected range must span, counting both endpoints (`2` forbids a single-day range). Once a start is picked, days closer than this are disabled. Clicking the start again commits a one-day range when allowed, or cancels the in-progress selection when the minimum is longer. Defaults to 1 (same-day start and end allowed).',
    },
    {
      name: 'presets',
      type: 'ReadonlyArray<DateRangePreset>',
      description:
        'Preset ranges shown as quick-select options beside the calendar. A preset is disabled when either endpoint violates min, max, or dateConstraints, or when its span violates minRangeSpan or maxRangeSpan.',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Shows a clear button when a range is selected.',
      default: 'true',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text when no range is selected.',
      default: "'Select date range'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size of the trigger.',
      default: "'md'",
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: 'Status indicator for error, warning, or success states.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing; tooltip hides the message box and surfaces it in a tooltip on the status icon.',
      default: "'attached'",
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text via info icon at label end.',
    },
    {
      name: 'numberOfMonths',
      type: '1 | 2',
      description: 'Number of months in the calendar.',
      default: '2',
    },
    {
      name: 'weekStartsOn',
      type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'",
      description:
        'First day of week in the calendar. A number (0 = Sunday to 6 = Saturday) or a three-letter day name.',
      default: '0',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'solo-date-range-input',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
      {className: 'solo-date-range-input-toggle-icon', states: ['state']},
      {
        className: 'solo-date-range-input-clear-icon',
        deprecatedFor: 'input-clear-icon',
      },
      {className: 'solo-date-range-input-presets'},
      {
        className: 'solo-date-range-input-preset',
        states: ['selected', 'disabled'],
      },
    ],
  },
  usage: {
    description:
      'DateRangeInput lets users select a start and end date from a dual-month calendar popover. Use it for filtering data by time period, report generation, analytics dashboards, and booking flows.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use presets for common ranges like "Last 7 days" to speed up selection.',
      },
      {
        guidance: true,
        description:
          'Use min/max to constrain selectable dates to valid ranges.',
      },
      {
        guidance: true,
        description:
          'Keep hasClear enabled (default) so users can reset the filter.',
      },
      {
        guidance: true,
        description:
          'Provide clear labels and descriptions so users understand what the range controls.',
      },
      {
        guidance: false,
        description:
          'Use DateRangeInput when only a single date is needed; use DateInput instead.',
      },
      {
        guidance: false,
        description:
          'Hide the label without surrounding context that makes the purpose obvious.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled DateRangeInput in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy: [
      {
        name: 'Label',
        required: true,
        description:
          'Text above the trigger describing what date range is expected.',
      },
      {
        name: 'Field surface',
        required: true,
        description:
          'Bordered control containing the calendar toggle, range trigger, and end affordances.',
      },
      {
        name: 'Trigger button',
        required: true,
        description:
          'A button showing the formatted range or placeholder. Clicking opens the popover.',
      },
      {
        name: 'Calendar icon',
        required: true,
        description: 'A trailing icon that also opens the popover.',
      },
      {
        name: 'Calendar popover',
        required: true,
        description:
          'A dual-month calendar grid with range selection and hover preview.',
      },
      {
        name: 'Preset sidebar',
        required: false,
        description: 'A list of preset range options beside the calendar.',
      },
      {
        name: 'Preset button',
        required: false,
        description:
          'A quick-select action for one preset range, reflecting current and disabled states.',
      },
      {
        name: 'Clear button',
        required: false,
        description: 'A × button that resets the range to null.',
      },
      {
        name: 'Status message',
        required: false,
        description: 'An error, warning, or success message below the trigger.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يتيح DateRangeInput للمستخدمين تحديد تاريخ بداية وتاريخ نهاية من نافذة منبثقة تعرض تقويمًا بشهرين.',
  propDescriptions: {
    label: 'نص التسمية.',
    isLabelHidden: 'يخفي التسمية بصريًا.',
    description: 'نص مساعد يُعرض أسفل التسمية.',
    isOptional: 'يعرض مؤشر "(optional)".',
    isRequired: 'يحدد الحقل على أنه مطلوب.',
    isDisabled: 'يعطّل المشغّل والمحدِّد.',
    disabledMessage: 'يوضح سبب تعطيل حقل الإدخال. مع isDisabled، يعرض تلميحًا عند التمرير/تركيز لوحة المفاتيح ويُبقي الحقل قابلًا للتركيز عبر aria-disabled (مع بقاء التفعيل محظورًا). استخدمه بدلًا من تغليف DateRangeInput معطَّل داخل Tooltip، إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    value: 'نطاق التاريخ المحدد أو null. استورد النوع `DateRange` من `@solo/core/DateRangeInput`؛ وهو `{start: ISODateString, end: ISODateString}`. لا تُعِد تعريف نوع DateRange خاص بك؛ استخدم النوع المُصدَّر كي يتطابق TypeScript بنيويًا.',
    onChange: 'دالة استدعاء عند تغيّر النطاق. تُستدعى بـ null عند المسح.',
    changeAction: 'إجراء غير متزامن يُطلَق بعد onChange. يقود تحديثات الواجهة التفاؤلية عبر useTransition.',
    isLoading: 'ما إذا كان حقل الإدخال في حالة تحميل. يعطّل التفاعل ويعرض مؤشر دوران.',
    min: 'أقل تاريخ قابل للتحديد. `ISODateString` نوع قالب حرفي (`\\`${number}${number}${number}${number}-${number}${number}-${number}${number}\\``). مرّر نصًا حرفيًا مثل `"2026-01-28"`، لا متغيرًا نصيًا وقت التشغيل. استورده من `@solo/core/Calendar` أو استخدم `as ISODateString` إذا كنت تحسب القيمة ديناميكيًا.',
    max: 'أقصى تاريخ قابل للتحديد. نوع القالب الحرفي نفسه كما في `min`: استخدم نصًا حرفيًا بصيغة YYYY-MM-DD أو حوّل النوع بـ `as ISODateString`.',
    dateConstraints: 'دوال قيود مخصصة لتعطيل تواريخ معينة.',
    maxRangeSpan: 'أقصى عدد أيام يمكن أن يمتد عليه النطاق المحدد، مع احتساب الطرفين (`7` = نافذة من 7 أيام، البداية + 6). بعد اختيار البداية، تُعطَّل الأيام التي تتجاوز هذه المسافة كي لا يمتد النطاق إلى ما بعد الحد. هي نافذة متحركة نسبةً إلى البداية؛ وللحدود الثابتة في التقويم استخدم `min`/`max`. يقيّد التحديد فقط؛ ولا يعيد كتابة `value` أعرض من الحد أبدًا (أشِر إلى ذلك عبر `status`).',
    minRangeSpan: 'أقل عدد أيام يجب أن يمتد عليه النطاق المحدد، مع احتساب الطرفين (`2` يمنع نطاقًا من يوم واحد). بعد اختيار البداية، تُعطَّل الأيام الأقرب من هذه المسافة. النقر على البداية مرة أخرى يعتمد نطاقًا من يوم واحد عندما يكون مسموحًا، أو يلغي التحديد الجاري عندما يكون الحد الأدنى أطول. القيمة الافتراضية 1 (يُسمح بأن تكون البداية والنهاية في اليوم نفسه).',
    presets: 'نطاقات مُعدّة مسبقًا تُعرض كخيارات تحديد سريع بجانب التقويم. يُعطَّل النطاق المُعدّ مسبقًا عندما يخالف أيٌّ من طرفيه min أو max أو dateConstraints، أو عندما يخالف امتداده minRangeSpan أو maxRangeSpan.',
    hasClear: 'يعرض زر مسح عند تحديد نطاق.',
    placeholder: 'نص إرشادي عند عدم تحديد أي نطاق.',
    size: 'حجم المشغّل.',
    status: 'مؤشر الحالة لحالات الخطأ أو التحذير أو النجاح.',
    statusVariant: 'كيفية وضع رسالة الحالة بالنسبة إلى حقل الإدخال. attached تتراكب مباشرةً أسفل حقل الإدخال (بمعالجة ذات حدود)؛ وdetached تطفو أسفله كعنصر منفصل مع تباعد؛ وtooltip تخفي صندوق الرسالة وتُظهرها في تلميح على أيقونة الحالة.',
    labelTooltip: 'نص تلميح عبر أيقونة معلومات في نهاية التسمية.',
    numberOfMonths: 'عدد الأشهر في التقويم.',
    weekStartsOn: 'أول يوم في الأسبوع في التقويم. رقم (0 = الأحد حتى 6 = السبت) أو اسم يوم من ثلاثة أحرف.',
    width: 'عرض الحقل (الرقم = بكسلات، والنص يُستخدم كما هو، مثل "100%"). يحدد حجم الحقل كاملًا (التسمية وعنصر التحكم والحالة) كي تبقى متحاذية.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمَج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداةُ المتعارضة القيمةَ الافتراضية.',
  },
  usage: {
    description: 'يتيح DateRangeInput للمستخدمين تحديد تاريخ بداية وتاريخ نهاية من نافذة منبثقة تعرض تقويمًا بشهرين. استخدمه لتصفية البيانات حسب فترة زمنية، وإنشاء التقارير، ولوحات معلومات التحليلات، ومسارات الحجز.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم النطاقات المُعدّة مسبقًا للنطاقات الشائعة مثل "Last 7 days" لتسريع التحديد.',
      },
      {
        guidance: true,
        description: 'استخدم min/max لتقييد التواريخ القابلة للتحديد ضمن نطاقات صالحة.',
      },
      {
        guidance: true,
        description: 'أبقِ hasClear مفعّلة (الافتراضي) كي يتمكن المستخدمون من إعادة تعيين عامل التصفية.',
      },
      {
        guidance: true,
        description: 'قدّم تسميات وأوصافًا واضحة كي يفهم المستخدمون ما يتحكم فيه النطاق.',
      },
      {
        guidance: false,
        description: 'لا تستخدم DateRangeInput عندما تحتاج إلى تاريخ واحد فقط؛ استخدم DateInput بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'لا تُخفِ التسمية دون سياق محيط يجعل الغرض واضحًا.',
      },
      {
        guidance: false,
        description: 'لا تغلّف DateRangeInput معطَّلًا داخل Tooltip لتوضيح سبب تعطيله؛ إذ تبتلع المشغّلات المعطَّلة أحداث التمرير التي يحتاجها المغلِّف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'التسمية',
        required: true,
        description: 'نص أعلى المشغّل يصف نطاق التاريخ المتوقع.',
      },
      {
        name: 'سطح الحقل',
        required: true,
        description: 'عنصر تحكم ذو حدود يحتوي على مفتاح التقويم ومشغّل النطاق وعناصر النهاية.',
      },
      {
        name: 'زر المشغّل',
        required: true,
        description: 'زر يعرض النطاق المنسَّق أو النص الإرشادي. النقر عليه يفتح النافذة المنبثقة.',
      },
      {
        name: 'أيقونة التقويم',
        required: true,
        description: 'أيقونة لاحقة تفتح النافذة المنبثقة أيضًا.',
      },
      {
        name: 'نافذة التقويم المنبثقة',
        required: true,
        description: 'شبكة تقويم بشهرين مع تحديد النطاق ومعاينة عند التمرير.',
      },
      {
        name: 'الشريط الجانبي للنطاقات المُعدّة مسبقًا',
        required: false,
        description: 'قائمة بخيارات النطاقات المُعدّة مسبقًا بجانب التقويم.',
      },
      {
        name: 'زر النطاق المُعدّ مسبقًا',
        required: false,
        description: 'إجراء تحديد سريع لنطاق مُعدّ مسبقًا واحد، يعكس الحالة الحالية وحالة التعطيل.',
      },
      {
        name: 'زر المسح',
        required: false,
        description: 'زر × يعيد تعيين النطاق إلى null.',
      },
      {
        name: 'رسالة الحالة',
        required: false,
        description: 'رسالة خطأ أو تحذير أو نجاح أسفل المشغّل.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'date range picker with dual-month calendar popover and preset ranges',
  usage: {
    description:
      'DateRangeInput lets users select start+end dates from a dual-month calendar. Use for filtering, reports, analytics, and booking.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use presets for common ranges like "Last 7 days" to speed up selection.',
      },
      {
        guidance: true,
        description:
          'Use min/max to constrain selectable dates to valid ranges.',
      },
      {
        guidance: true,
        description:
          'Keep hasClear enabled (default) so users can reset the filter.',
      },
      {
        guidance: true,
        description:
          'Provide clear labels + descriptions so users understand what the range controls.',
      },
      {
        guidance: false,
        description:
          'Use DateRangeInput when only a single date is needed; use DateInput instead.',
      },
      {
        guidance: false,
        description:
          'Hide the label without surrounding context that makes the purpose obvious.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled DateRangeInput in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    label: 'label text',
    isLabelHidden: 'visually hide label',
    description: 'helper text below label',
    isOptional: 'show "(optional)" indicator',
    isRequired: 'mark field required',
    isDisabled: 'disable trigger+picker',
    disabledMessage:
      'reason shown in a tooltip on hover/focus when disabled; keeps trigger focusable via aria-disabled',
    value:
      'selected range {start, end} or null; import DateRange type from @solo/core/DateRangeInput (do not redeclare)',
    onChange: 'callback on range change; null on clear',
    min: 'min selectable date: ISODateString template literal type (YYYY-MM-DD); use string literal or cast `as ISODateString`',
    max: 'max selectable date: ISODateString template literal type (YYYY-MM-DD); use string literal or cast `as ISODateString`',
    dateConstraints: 'custom constraint fns to disable dates',
    maxRangeSpan:
      'max days a range may span, both endpoints counted (7 = a 7-day window); caps the window from the picked start. Selection-only; does not rewrite an over-wide value',
    minRangeSpan:
      'min days a range must span, both endpoints counted (2 forbids a single-day range); repeated start click commits one day when allowed, otherwise cancels; default 1',
    presets:
      'preset ranges as quick-select options; disabled when an endpoint or span violates the corresponding constraints',
    hasClear: 'clear button when range is set (default true)',
    placeholder: 'placeholder when empty',
    size: 'trigger size',
    status: 'error/warning/success status',
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon.',
    labelTooltip: 'tooltip via info icon at label end',
    numberOfMonths: 'months in calendar (default 2)',
    weekStartsOn:
      'first day of week in calendar (0=Sunday, or name e.g. "mon")',
    changeAction:
      'async action fired after onChange; drives optimistic UI updates via useTransition',
    isLoading: 'loading state; disables interaction + shows a spinner',
    className: 'Tailwind classes for layout',
  },
};
