/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Elapsed time',
    required: true,
    description:
      'Semantic time element containing a standardized elapsed duration.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'Timer',
  displayName: 'Timer',
  category: 'Content',
  keywords: [
    'timer',
    'elapsed',
    'duration',
    'seconds',
    'minutes',
    'hours',
    'stopwatch',
    'countdown',
    'remaining',
    'deadline',
    'waiting',
    'loading',
    'processing',
  ],
  props: [
    {
      name: 'startTime',
      type: 'number',
      description:
        "Unix time in milliseconds when the measured operation began. Omit it to start from this Timer's mount.",
    },
    {
      name: 'endTime',
      type: 'number',
      description:
        'Unix time in milliseconds to count down to. When set, Timer shows the time remaining (never below zero) instead of the time elapsed, stops at zero and calls onComplete.',
    },
    {
      name: 'onComplete',
      type: '() => void',
      description: 'Called once when a countdown (endTime) reaches zero.',
    },
    {
      name: 'format',
      type: "'elapsed' | 'clock'",
      description:
        'Standard duration representation. Elapsed uses compact units and drops seconds after one hour; clock uses m:ss or h:mm:ss.',
      default: "'elapsed'",
    },
    {
      name: 'type',
      type: "'body' | 'large' | 'label' | 'supporting' | 'code' | 'display-1' | 'display-2' | 'display-3' | 'inherit'",
      description:
        'Semantic text type. Uses the same typography behavior as Timestamp.',
      default: "'supporting'",
    },
    {
      name: 'size',
      type: "'4xs' | '3xs' | '2xs' | 'xsm' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'",
      description: 'Explicit font size override. Overrides the size from type.',
    },
    {
      name: 'color',
      type: "'primary' | 'secondary' | 'disabled' | 'placeholder' | 'accent' | 'inherit'",
      description: 'Text color.',
      default: "'secondary'",
    },
    {
      name: 'weight',
      type: "'normal' | 'medium' | 'semibold' | 'bold'",
      description: 'Font weight override.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Inline styles for the Text wrapper. Prefer className for styling.',
    },
  ],
  examples: [
    {
      label: 'Elapsed duration',
      code: '<Timer />',
    },
    {
      label: 'Stopwatch clock',
      code: '<Timer format="clock" />',
    },
    {
      label: 'Operation that started before mount',
      code: '<Timer startTime={operationStartedAt} />',
    },
    {
      label: 'Countdown to a deadline',
      code: '<Timer endTime={auctionEndsAt} format="clock" onComplete={closeBidding} />',
    },
    {
      label: 'Match surrounding text',
      code: `<Text>
  Processing for <Timer type="inherit" color="inherit" />
</Text>`,
    },
    {
      label: 'Prominent elapsed time',
      code: '<Timer type="body" size="lg" color="primary" weight="semibold" />',
    },
  ],
  theming: {
    targets: [{className: 'solo-timer'}],
  },
  usage: {
    anatomy,
    description:
      'Displays a live duration for active work without scheduling a React render on every tick: the time elapsed since startTime, or — with endTime — the time remaining until a deadline (a countdown). Elapsed format updates by second below one hour and by minute after one hour; clock format remains second-precise.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use elapsed for compact duration text that may span seconds, minutes, or hours.',
      },
      {
        guidance: true,
        description:
          'Use clock for stopwatch-like surfaces where seconds remain meaningful after an hour.',
      },
      {
        guidance: true,
        description:
          'Pass startTime when the operation began before Timer mounted so the display reflects the complete wait.',
      },
      {
        guidance: true,
        description:
          'Pass endTime for a countdown to a deadline (an auction closing, a session expiring, an offer ending); use onComplete to react when it reaches zero.',
      },
      {
        guidance: false,
        description:
          'Do not use Timer for dates, time zones, or relative calendar language; use Timestamp instead.',
      },
      {
        guidance: false,
        description:
          'Do not add aria-live unless hearing an announcement every tick is appropriate for the specific task.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض Timer مدة حيّة للعمل النشط دون جدولة عرض React مع كل نبضة: الوقت المنقضي منذ startTime، أو — مع endTime — الوقت المتبقي حتى موعد نهائي (عدّ تنازلي).',
  propDescriptions: {
    startTime: 'وقت Unix بالمللي ثانية عند بدء العملية المقاسة. احذفه للبدء من لحظة تركيب Timer هذا.',
    endTime: 'وقت Unix بالمللي ثانية للعدّ التنازلي حتى بلوغه. عند تعيينه يعرض Timer الوقت المتبقي (لا يقل عن الصفر) بدل الوقت المنقضي، ويتوقف عند الصفر ويستدعي onComplete.',
    onComplete: 'يُستدعى مرة واحدة عندما يصل العدّ التنازلي (endTime) إلى الصفر.',
    format: 'التمثيل القياسي للمدة. يستخدم elapsed وحدات مختصرة ويُسقط الثواني بعد ساعة واحدة؛ ويستخدم clock الصيغة m:ss أو h:mm:ss.',
    type: 'نوع النص الدلالي. يستخدم سلوك الطباعة نفسه المستخدم في Timestamp.',
    size: 'تجاوز صريح لحجم الخط. يتجاوز الحجم المستمد من type.',
    color: 'لون النص.',
    weight: 'تجاوز وزن الخط.',
    className: 'فئات Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
    style: 'أنماط مضمَّنة لغلاف Text. فضّل className للتنسيق.',
  },
  usage: {
    description: 'يعرض مدة حيّة للعمل النشط دون جدولة عرض React مع كل نبضة: الوقت المنقضي منذ startTime، أو — مع endTime — الوقت المتبقي حتى موعد نهائي (عدّ تنازلي). تتحدّث الصيغة elapsed كل ثانية قبل مرور ساعة وكل دقيقة بعدها؛ بينما تبقى الصيغة clock دقيقة على مستوى الثانية.',
    bestPractices: [
      {guidance: true, description: 'استخدم elapsed لنص مدة مختصر قد يمتد عبر ثوانٍ أو دقائق أو ساعات.'},
      {guidance: true, description: 'استخدم clock للأسطح الشبيهة بساعة الإيقاف حيث تبقى الثواني ذات معنى بعد مرور ساعة.'},
      {guidance: true, description: 'مرّر startTime عندما تكون العملية قد بدأت قبل تركيب Timer كي يعكس العرض مدة الانتظار الكاملة.'},
      {guidance: true, description: 'مرّر endTime للعدّ التنازلي حتى موعد نهائي (إغلاق مزاد، انتهاء جلسة، انتهاء عرض)؛ واستخدم onComplete للتصرّف عند بلوغه الصفر.'},
      {guidance: false, description: 'لا تستخدم Timer للتواريخ أو المناطق الزمنية أو لغة التقويم النسبية؛ استخدم Timestamp بدلًا من ذلك.'},
      {guidance: false, description: 'لا تضف aria-live ما لم يكن سماع إعلان مع كل نبضة مناسبًا للمهمة المحددة.'},
    ],
    anatomy: [
      {name: 'الوقت المنقضي', required: true, description: 'عنصر time دلالي يحتوي على مدة منقضية موحَّدة.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Standardized elapsed, stopwatch or countdown (endTime) duration with clock-derived, non-rendering DOM updates.',
  propDescriptions: {
    startTime:
      "operation start as Unix milliseconds; omit to count from Timer's mount",
    endTime: 'deadline as Unix milliseconds; switches to a countdown that stops at zero',
    onComplete: 'called once when the countdown reaches zero',
    format: 'elapsed compact units or clock stopwatch notation',
    type: 'semantic text type; defaults to supporting like Timestamp',
    size: 'explicit font size override',
    color: 'text color; defaults to secondary like Timestamp',
    weight: 'font weight override',
    className: 'Tailwind classes for the Text wrapper',
    style: 'inline styles for the Text wrapper',
  },
  usage: {
    anatomy,
    description:
      'Use for active-operation elapsed time when periodic React renders would add avoidable work.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use elapsed for compact durations and clock for stopwatch UI.',
      },
      {
        guidance: true,
        description: 'Pass startTime for work that began before mount.',
      },
      {
        guidance: false,
        description: 'Use Timestamp for dates and relative calendar language.',
      },
    ],
  },
};
