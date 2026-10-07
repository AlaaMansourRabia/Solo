/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'Code',
  displayName: 'Code',
  group: 'Code',
  category: 'Content',
  description:
    'Inline code element with a monospace font and muted background. Use it for short code references within prose.',
  usage: {
    description:
      'Code marks short inline references such as function names, variables, file paths, and command-line flags. Use CodeBlock for standalone or multi-line snippets.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use Code for short technical terms inside prose, such as a function name, prop, file path, or command-line flag.',
      },
      {
        guidance: true,
        description:
          "Set size to 'inherit' when inline code should match the surrounding text size and line height.",
      },
      {
        guidance: false,
        description:
          'Use Code for multi-line or standalone snippets. Use CodeBlock instead so readers get appropriate block formatting and syntax support.',
      },
      {
        guidance: false,
        description:
          'Use Code as an interactive copy or navigation control. Pair it with the appropriate Button or Link when an action is required.',
      },
    ],
    anatomy: [
      {
        name: 'Container',
        required: true,
        description:
          'The semantic code element that contains the inline code content and paints the background, typography, padding, and radius.',
      },
    ],
  },
  playground: {
    defaults: {
      children: 'const count = 0',
    },
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The inline code content.',
      required: true,
    },
    {
      name: 'color',
      type: "'primary' | 'secondary' | 'inherit'",
      description:
        "Text color. Use 'inherit' to take the surrounding text color.",
      default: "'primary'",
    },
    {
      name: 'size',
      type: "'inherit'",
      description:
        "Set to 'inherit' to take the surrounding font size and line height. Omit it to use the code type-scale size.",
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description: 'Ref forwarded to the semantic code element.',
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
        'Inline styles for the root element. Prefer className: its classes merge with the component classes and stay overridable, while inline styles always win over className.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  theming: {
    targets: [{className: 'solo-code', visualProps: ['color']}],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'عنصر شيفرة مضمّن بخط ثابت العرض وخلفية خافتة. استخدمه للإشارات البرمجية القصيرة داخل النص.',
  propDescriptions: {
    children: 'محتوى الشيفرة المضمّنة.',
    color: 'لون النص. استخدم \'inherit\' لاعتماد لون النص المحيط.',
    size: 'عيّنه إلى \'inherit\' لاعتماد حجم الخط وارتفاع السطر المحيطَين. أغفِله لاستخدام حجم مقياس الطباعة الخاص بالشيفرة.',
    ref: 'مرجع (ref) يُمرَّر إلى عنصر code الدلالي.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتغلب الأداة المتعارضة على الافتراضية.',
    style: 'أنماط مضمّنة للعنصر الجذر. فضّل className: إذ تُدمج أصنافه مع أصناف المكوّن وتبقى قابلة للتجاوز، بينما تتغلب الأنماط المضمّنة دائمًا على className.',
    'data-testid': 'محدِّد اختبار لأطر الاختبار الآلي.',
  },
  usage: {
    description: 'يميّز Code الإشارات المضمّنة القصيرة مثل أسماء الدوال والمتغيرات ومسارات الملفات وخيارات سطر الأوامر. استخدم CodeBlock للمقتطفات المستقلة أو متعددة الأسطر.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم Code للمصطلحات التقنية القصيرة داخل النص، مثل اسم دالة أو خاصية أو مسار ملف أو خيار سطر أوامر.',
      },
      {
        guidance: true,
        description: 'عيّن size إلى \'inherit\' عندما يجب أن تطابق الشيفرة المضمّنة حجم النص المحيط وارتفاع سطره.',
      },
      {
        guidance: false,
        description: 'استخدم Code للمقتطفات متعددة الأسطر أو المستقلة. استخدم CodeBlock بدلًا منه كي يحصل القرّاء على تنسيق كتلي مناسب ودعم لتلوين الصياغة.',
      },
      {
        guidance: false,
        description: 'استخدم Code عنصرَ تحكم تفاعليًا للنسخ أو التنقّل. اقرنه بـ Button أو Link المناسب عندما يلزم إجراء.',
      },
    ],
    anatomy: [
      {
        name: 'الحاوية',
        required: true,
        description: 'عنصر code الدلالي الذي يحتوي محتوى الشيفرة المضمّنة ويرسم الخلفية والطباعة والحشوة ونصف قطر الزوايا.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'inline semantic code for short technical references in prose; CodeBlock handles standalone or multi-line snippets',
  usage: {
    description:
      'Use for short function names, variables, paths, and CLI flags inside prose. Use CodeBlock for standalone or multi-line snippets.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use for short technical references inside prose.',
      },
      {
        guidance: true,
        description:
          "Set size='inherit' to match surrounding text size and line height.",
      },
      {
        guidance: false,
        description:
          'Use for multi-line or standalone snippets; use CodeBlock instead.',
      },
      {
        guidance: false,
        description:
          'Use as an interactive control; pair with Button or Link for actions.',
      },
    ],
  },
  propDescriptions: {
    children: 'inline code content.',
    color:
      'text color: primary, secondary, or inherited from surrounding text.',
    size: "set to 'inherit' to take the surrounding font size and line height.",
    ref: 'ref forwarded to the semantic code element.',
    className:
      'Tailwind layout classes (a string), not an inline style object; merged via cn(), so conflicting utilities override defaults.',
    style: 'inline styles for the root; prefer className.',
    'data-testid': 'test selector for automated testing frameworks.',
  },
};
