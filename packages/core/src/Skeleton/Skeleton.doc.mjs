/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Placeholder',
    required: true,
    description: 'Painted shape that stands in for content while it loads.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Skeleton',
  displayName: 'Skeleton',
  category: 'Feedback & Status',
  keywords: ["skeleton","placeholder","loading","shimmer","pulse","loader","bone","ghost","preloader"],
  props: [
    {
      name: 'width',
      type: 'number | string',
      description: 'Width in pixels (number) or CSS value (string).',
      default: "'100%'",
    },
    {
      name: 'height',
      type: 'number | string',
      description: 'Height in pixels (number) or CSS value (string).',
      default: "'100%'",
    },
    {
      name: 'radius',
      type: "'none' | 0 | 1 | 2 | 3 | 4 | 'rounded'",
      description: 'Border radius using design token scale. Use none for sharp corners, rounded for fully rounded (avatars, pills, circles).',
      default: '3',
    },
    {
      name: 'index',
      type: 'number',
      description:
        'Index for staggered animation timing. For element at index n, animation starts at DELAY_TIME + (STAGGER_TIME × n).',
      default: '0',
    },
  ],
  playground: {
    // Skeleton width/height default to '100%', which collapses to a zero-size
    // (invisible) element in the properties-tab preview. Give the example
    // explicit pixel dimensions so the shimmer placeholder is visible.
    defaults: {
      width: 320,
      height: 80,
    },
  },
  theming: {
    targets: [
      {className: 'solo-skeleton'},
    ],
  },
  usage: {
    anatomy,
    description:
      'An animated shimmer placeholder that previews the shape of content while it loads. Use it to build loading screens that match the layout of the real content. For content with unknown dimensions, use Spinner instead.',
    bestPractices: [
      {guidance: true, description: 'Match the size and shape of the content being loaded to create a realistic placeholder.'},
      {guidance: true, description: 'Stagger multiple skeletons with the `index` prop for a natural wave animation.'},
      {guidance: false, description: 'Use when the content dimensions are unknown; use Spinner instead.'},
      {guidance: false, description: 'Combine with a Spinner on the same content area; pick one loading pattern.'},
      {guidance: false, description: 'Show skeletons indefinitely; if loading takes too long, show an error or empty state instead.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Skeleton',
  displayName: 'Skeleton',
  props: [
    {
      name: 'width',
      type: 'number | string',
      description: '像素宽度（数字）或 CSS 值（字符串）。',
      default: "'100%'",
    },
    {
      name: 'height',
      type: 'number | string',
      description: '像素高度（数字）或 CSS 值（字符串）。',
      default: "'100%'",
    },
    {
      name: 'radius',
      type: "'none' | 0 | 1 | 2 | 3 | 4 | 'rounded'",
      description: '使用设计令牌的边框圆角。使用 none 表示直角，rounded 表示完全圆角（头像、药丸形、圆形）。',
      default: '3',
    },
    {
      name: 'index',
      type: 'number',
      description:
        '交错动画时序的索引。对于索引为 n 的元素，动画在 DELAY_TIME + (STAGGER_TIME × n) 时开始。',
      default: '0',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-skeleton'},
    ],
  },
  usage: {
    anatomy,
    description:
      'An animated shimmer placeholder that previews the shape of content while it loads. Use it to build loading screens that match the layout of the real content. For content with unknown dimensions, use Spinner instead.',
    bestPractices: [
      {guidance: true, description: 'Match the size and shape of the content being loaded to create a realistic placeholder.'},
      {guidance: true, description: 'Stagger multiple skeletons with the `index` prop for a natural wave animation.'},
      {guidance: false, description: 'Use when the content dimensions are unknown; use Spinner instead.'},
      {guidance: false, description: 'Combine with a Spinner on the same content area; pick one loading pattern.'},
      {guidance: false, description: 'Show skeletons indefinitely; if loading takes too long, show an error or empty state instead.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'عنصر نائب متحرّك بتأثير لامع يعرض شكل المحتوى مسبقًا أثناء تحميله.',
  propDescriptions: {
    width: 'العرض بالبكسل (رقم) أو قيمة CSS (نص).',
    height: 'الارتفاع بالبكسل (رقم) أو قيمة CSS (نص).',
    radius:
      'نصف قطر الحدود وفق مقياس رموز التصميم. استخدم none للزوايا الحادّة، وrounded للاستدارة الكاملة (الصور الرمزية والكبسولات والدوائر).',
    index:
      'فهرس لتوقيت الحركة المتدرّج. للعنصر ذي الفهرس n تبدأ الحركة عند DELAY_TIME + (STAGGER_TIME × n).',
  },
  usage: {
    description:
      'عنصر نائب متحرّك بتأثير لامع يعرض شكل المحتوى مسبقًا أثناء تحميله. استخدمه لبناء شاشات تحميل تطابق تخطيط المحتوى الفعلي. للمحتوى ذي الأبعاد غير المعروفة، استخدم Spinner بدلًا منه.',
    bestPractices: [
      {guidance: true, description: 'طابِق حجم المحتوى الجاري تحميله وشكله لإنشاء عنصر نائب واقعي.'},
      {guidance: true, description: 'درّج عدة عناصر Skeleton باستخدام الخاصية `index` للحصول على حركة موجية طبيعية.'},
      {guidance: false, description: 'استخدامه عندما تكون أبعاد المحتوى غير معروفة؛ استخدم Spinner بدلًا منه.'},
      {guidance: false, description: 'دمجه مع Spinner في منطقة المحتوى نفسها؛ اختر نمط تحميل واحدًا.'},
      {guidance: false, description: 'عرض الهياكل النائبة إلى ما لا نهاية؛ إذا استغرق التحميل وقتًا طويلًا، فاعرض خطأً أو حالة فارغة بدلًا من ذلك.'},
    ],
    anatomy: [
      {name: 'العنصر النائب', required: true, description: 'شكل مرسوم يحلّ محل المحتوى أثناء تحميله.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    anatomy,
    description:
      'An animated shimmer placeholder that previews the shape of content while it loads. Use it to build loading screens that match the layout of the real content. For content with unknown dimensions, use Spinner instead.',
    bestPractices: [
      {guidance: true, description: 'Match the size and shape of the content being loaded to create a realistic placeholder.'},
      {guidance: true, description: 'Stagger multiple skeletons with the `index` prop for a natural wave animation.'},
      {guidance: false, description: 'Use when the content dimensions are unknown; use Spinner instead.'},
      {guidance: false, description: 'Combine with a Spinner on the same content area; pick one loading pattern.'},
      {guidance: false, description: 'Show skeletons indefinitely; if loading takes too long, show an error or empty state instead.'},
    ],
  },
  propDescriptions: {
    width: 'Width in pixels (number) or CSS value (string).',
    height: 'Height in pixels (number) or CSS value (string).',
    radius: 'Border radius using design tokens. none for sharp, 0-4 for scale, rounded for pills.',
    index: 'Index for staggered animation timing. Element at index n starts at DELAY_TIME + (STAGGER_TIME \u00d7 n).',
  },
};
