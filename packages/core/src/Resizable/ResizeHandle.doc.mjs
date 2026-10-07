/**
 * ResizeHandle — a member of the Resizable family (see Resizable.doc.mjs for the family's
 * overview). Split out so the docs site can load one doc file per family member.
 */

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'ResizeHandle',
  subComponentOf: 'Resizable',
  group: 'Resizable',
  category: 'Layout',
  displayName: 'Resize Handle',
  description:
    'Draggable separator between panels. Pill-grip design: invisible at rest, ' +
    'visible on hover (0.6 opacity), fully opaque during drag (1.0). Keyboard-accessible.',
  props: [
    {
      name: 'direction',
      type: "'horizontal' | 'vertical'",
      description:
        'Layout direction: determines cursor and indicator orientation.',
      default: "'horizontal'",
    },
    {
      name: 'position',
      type: "'inline' | 'overlay'",
      description:
        "Positioning mode. 'inline' puts the handle in normal flex flow between siblings; 'overlay' uses absolute positioning so the handle sits inside a parent panel's bounds, useful when the parent has overflow: clip.",
      default: "'inline'",
    },
    {
      name: 'isReversed',
      type: 'boolean',
      description:
        'Reverse drag direction. Use when the handle controls a panel on the end/right/bottom side.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the handle is interactive.',
      default: 'false',
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description:
        'Show a full-length 1px divider line through the handle. Use when adjacent panels share the same background.',
      default: 'false',
    },
    {
      name: 'isAlwaysVisible',
      type: 'boolean',
      description:
        'Show the pill grip at rest instead of only on hover. Use when discoverability is important.',
      default: 'true',
    },
    {
      name: 'pillPlacement',
      type: "'start' | 'end' | 'center' | 'auto'",
      description:
        'Which side of the divider the pill sits on. ' +
        'auto = content side (derived from isReversed), flips when collapsed. ' +
        'start = left/top, end = right/bottom, center = centered on divider.',
      default: "'auto'",
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the separator.',
      default: "'Resize handle'",
    },
    {
      name: 'resizable',
      type: 'ResizableProps',
      description:
        "Resize props from useResizable: connects handle to panel. Carries the region's axis ('horizontal' | 'vertical'), which must match this handle's direction.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Custom handle content. Overrides the default pill + divider.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'فاصل قابل للسحب بين اللوحات. تصميم بمقبض على شكل حبة: غير مرئي في حالة السكون، ومرئي عند التمرير (عتامة 0.6)، ومعتم بالكامل أثناء السحب (1.0). قابل للوصول بلوحة المفاتيح.',
  propDescriptions: {
    direction: 'اتجاه التخطيط: يحدد المؤشر واتجاه المقبض.',
    position: 'وضع التموضع. يضع \'inline\' المقبض في تدفق flex العادي بين العناصر الشقيقة؛ ويستخدم \'overlay\' التموضع المطلق كي يقع المقبض داخل حدود لوحة أب، وهو مفيد عندما يكون للأب overflow: clip.',
    isReversed: 'عكس اتجاه السحب. استخدمه عندما يتحكم المقبض في لوحة على جانب النهاية/اليمين/الأسفل.',
    isDisabled: 'ما إذا كان المقبض تفاعليًا.',
    hasDivider: 'عرض خط فاصل بعرض 1px على كامل الطول عبر المقبض. استخدمه عندما تتشارك اللوحات المتجاورة الخلفية نفسها.',
    isAlwaysVisible: 'عرض المقبض على شكل حبة في حالة السكون بدلًا من إظهاره عند التمرير فقط. استخدمه عندما تكون قابلية الاكتشاف مهمة.',
    pillPlacement: 'الجانب الذي يقع عليه المقبض من الفاصل. auto = جانب المحتوى (مشتق من isReversed)، وينقلب عند الطي. start = اليسار/الأعلى، وend = اليمين/الأسفل، وcenter = في منتصف الفاصل.',
    label: 'التسمية القابلة للوصول للفاصل.',
    resizable: 'خصائص تغيير الحجم من useResizable: تربط المقبض باللوحة. تحمل محور المنطقة (\'horizontal\' | \'vertical\')، ويجب أن يطابق اتجاه هذا المقبض.',
    children: 'محتوى مخصص للمقبض. يتجاوز المقبض الافتراضي على شكل حبة مع الفاصل.',
    className: 'فئات Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  name: 'ResizeHandle',
  description:
    'Draggable separator between panels. Pill-grip: invisible at rest, visible on hover (0.6 opacity), fully opaque during drag (1.0). Keyboard-accessible.',
  propDescriptions: {
    direction:
      'layout direction: determines cursor + indicator orientation',
    position:
      "'inline' = normal flex flow between siblings; 'overlay' = absolute, inside parent panel bounds (for overflow: clip)",
    isReversed:
      'reverse drag direction. Use when handle controls panel on end/right/bottom side',
    isDisabled: 'handle interactive?',
    hasDivider:
      'show full-length 1px divider line through handle. Use when adjacent panels share same background',
    isAlwaysVisible:
      'show pill grip at rest instead of only on hover. Use when discoverability important',
    pillPlacement:
      'which side of divider pill sits on. auto = content side (derived from isReversed), flips when collapsed; start = left/top, end = right/bottom, center = centered on divider',
    label: 'accessible label for separator',
    resizable: 'resize props from useResizable: connects handle to panel',
  },
};
