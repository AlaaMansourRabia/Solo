/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Message box',
    required: true,
    description: 'Painted container for the validation feedback.',
  },
  {
    name: 'Detached icon',
    required: false,
    description: 'Leading status glyph shown only by the detached variant.',
  },
  {
    name: 'Message text',
    required: true,
    description: 'Text describing the validation status.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'FieldStatus',
  displayName: 'Field Status',
  group: 'Field',
  category: 'Form Controls',
  isHiddenFromOverview: true,
  description:
    'Status message component for form field validation feedback. Messages are announced to screen readers through persistent live regions (assertive for errors, polite otherwise), so conditional mounting is safe.',
  theming: {
    targets: [
      {className: 'solo-field-status', visualProps: ['type', 'variant']},
      {className: 'solo-field-status-icon', visualProps: ['type']},
    ],
  },
  props: [
    {
      name: 'type',
      type: "'error' | 'warning' | 'success'",
      description: 'Status type.',
      required: true,
    },
    {
      name: 'message',
      type: 'string',
      description: 'Status message text.',
      required: true,
    },
    {
      name: 'id',
      type: 'string',
      description: 'ID for aria-describedby association.',
    },
    {
      name: 'variant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'Visual variant: attached overlaps the input, detached floats below, tooltip renders no message box (the input surfaces the status through a tooltip on its on-field icon).',
      default: "'attached'",
    },
  ],
  usage: {
    description:
      'FieldStatus renders validation feedback for fields and field-like controls. Use it directly for custom controls that need the same error, warning, or success presentation as Field.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use attached status below bordered inputs when the message belongs to that input.',
      },
      {
        guidance: true,
        description:
          'Use detached status for controls like checkboxes, switches, and custom controls where overlap would be visually awkward.',
      },
      {
        guidance: false,
        description:
          'Use FieldStatus for general alerts or page-level notices; use Banner or Toast instead.',
      },
    ],
    anatomy,
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'مكوّن رسالة حالة لتغذية التحقق الراجعة في حقول النماذج. تُعلَن الرسائل لقارئ الشاشة عبر مناطق حيّة دائمة (assertive للأخطاء، وpolite لغيرها)، لذا فإن التركيب المشروط آمن.',
  propDescriptions: {
    type: 'نوع الحالة.',
    message: 'نص رسالة الحالة.',
    id: 'المعرّف المستخدم للربط عبر aria-describedby.',
    variant: 'النمط المرئي: attached يتداخل مع حقل الإدخال، وdetached يطفو أسفله، وtooltip لا يعرض صندوق رسالة (إذ يُظهر حقل الإدخال الحالة عبر تلميح على أيقونته داخل الحقل).',
  },
  usage: {
    description: 'يعرض FieldStatus تغذية التحقق الراجعة للحقول وعناصر التحكم الشبيهة بالحقول. استخدمه مباشرةً لعناصر التحكم المخصّصة التي تحتاج إلى عرض الخطأ أو التحذير أو النجاح نفسه الذي يقدّمه Field.',
    bestPractices: [
      {guidance: true, description: 'استخدم الحالة المتصلة أسفل حقول الإدخال ذات الحدود عندما تخص الرسالة ذلك الحقل.'},
      {guidance: true, description: 'استخدم الحالة المنفصلة لعناصر التحكم مثل مربعات الاختيار ومفاتيح التبديل وعناصر التحكم المخصّصة حيث يبدو التداخل غير ملائم بصريًا.'},
      {guidance: false, description: 'استخدام FieldStatus للتنبيهات العامة أو الإشعارات على مستوى الصفحة؛ استخدم Banner أو Toast بدلًا من ذلك.'},
    ],
    anatomy: [
      {name: 'صندوق الرسالة', required: true, description: 'حاوية ملوّنة لتغذية التحقق الراجعة.'},
      {name: 'الأيقونة المنفصلة', required: false, description: 'رمز حالة بادئ لا يظهر إلا في النمط detached.'},
      {name: 'نص الرسالة', required: true, description: 'نص يصف حالة التحقق.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Validation feedback message for fields/custom controls. Supports error, warning, success and attached/detached variants. Announced via persistent live regions (assertive for errors, polite otherwise).',
  usage: {
    bestPractices: [
      {
        guidance: true,
        description:
          'Use attached status below bordered inputs when message belongs to that input.',
      },
      {
        guidance: true,
        description:
          'Use detached status for checkboxes, switches, and custom controls where overlap is visually awkward.',
      },
      {
        guidance: false,
        description:
          'Use FieldStatus for general alerts or page-level notices; use Banner or Toast instead.',
      },
    ],
    anatomy,
  },
  propDescriptions: {
    type: 'error/warning/success status tone',
    message: 'visible validation feedback text',
    id: 'id for aria-describedby association',
    variant: 'attached overlaps input; detached floats below',
  },
};
