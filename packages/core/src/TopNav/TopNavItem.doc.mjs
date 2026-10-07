/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TopNavItem',
  subComponentOf: 'TopNav',
  displayName: 'Top Nav Item',
  isHiddenFromOverview: true,
  description: 'Navigation link item for use in TopNav startContent: renders as an anchor with hover and selected states.',
  playground: {
    defaults: {label: 'Projects', href: '#', isSelected: true},
  },
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the nav item. Rendered as visible text by default. When isIconOnly is true, used as aria-label instead.',
      required: true,
    },
    {
      name: 'href',
      type: 'string',
      description: 'Navigation target URL.',
    },
    {
      name: 'target',
      type: 'string',
      description:
        "Where to open the linked document (e.g. '_blank'). Dropped when the item is disabled.",
    },
    {
      name: 'rel',
      type: 'string',
      description:
        'Link relationship.',
    },
    {
      name: 'download',
      type: 'string | boolean',
      description:
        'Causes the browser to download the linked URL. A string suggests the filename.',
    },
    {
      name: 'referrerPolicy',
      type: "'' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'",
      description:
        'Referrer policy for the link.',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description: 'Whether this nav item is currently selected. Sets aria-current="page" and applies highlighted styles.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the nav item is disabled. Sets aria-disabled, drops href/target so the item cannot navigate, and prevents interaction.',
      default: 'false',
    },
    {
      name: 'isIconOnly',
      type: 'boolean',
      description: 'Renders the item as a square icon-only element. When true, label becomes the aria-label and visible text is hidden. Requires icon to be set.',
      default: 'false',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Optional icon to display before the label.',
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
      description: 'Custom content to render instead of the label text.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description:
        'Size variant for the nav item. Has no effect in horizontal mode; controls height and padding in drawer mode.',
      default: "'md'",
    },
    {
      name: 'as',
      type: 'LinkComponentType',
      description: 'Custom component to render instead of <a>. Overrides the provider-level default set by LinkProvider. Must accept href, className, style, and children props.',
    },
  ],
};

export const docsZh = {
  name: 'TopNavItem',
  isHiddenFromOverview: true,
  displayName: 'Top Nav Item',
  description: '用于 TopNav startContent 的导航链接项，渲染为具有悬停和选中状态的锚点。',
  props: [
    {
      name: 'label',
      type: 'string',
      description: '导航项的无障碍标签。用作可见文本，或作为仅图标项的 aria-label。',
      required: true,
    },
    {
      name: 'href',
      type: 'string',
      description: '导航目标 URL。',
    },
    {
      name: 'target',
      type: 'string',
      description:
        "打开链接文档的位置（如 '_blank'）。禁用时忽略。",
    },
    {
      name: 'rel',
      type: 'string',
      description:
        '链接关系。',
    },
    {
      name: 'download',
      type: 'string | boolean',
      description:
        '使浏览器下载链接的 URL。字符串值指定建议的文件名。',
    },
    {
      name: 'referrerPolicy',
      type: "'' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'",
      description:
        '链接的引用策略。',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description: '此导航项是否为当前选中状态。设置 aria-current="page" 并应用高亮样式。',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: '导航项是否被禁用。设置 aria-disabled，移除 href/target 使其无法导航，并阻止交互。',
      default: 'false',
    },
    {
      name: 'isIconOnly',
      type: 'boolean',
      description: '将该项渲染为正方形纯图标元素。为 true 时，label 用作 aria-label 并隐藏可见文本。需要设置 icon。',
      default: 'false',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: '在标签前显示的可选图标。如果在没有子元素的情况下提供，项目变为仅图标模式。',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: '替代标签文本渲染的自定义内容。省略且提供了图标时，项目变为仅图标模式。',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description:
        '导航项的尺寸变体。在水平模式下无效；在抽屉模式下控制高度和内边距。',
      default: "'md'",
    },
    {
      name: 'as',
      type: 'LinkComponentType',
      description: '替代 <a> 渲染的自定义组件。覆盖 LinkProvider 设置的提供者级别默认值。必须接受 href、className、style 和 children 属性。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'عنصر رابط تنقّل للاستخدام في startContent الخاص بـ TopNav: يُعرض كرابط مرساة مع حالتي التمرير والتحديد.',
  propDescriptions: {
    label: 'التسمية القابلة للوصول لعنصر التنقّل. تُعرض افتراضيًا نصًا مرئيًا. وعندما تكون isIconOnly صحيحة، تُستخدم كقيمة aria-label بدلًا من ذلك.',
    href: 'عنوان URL لوجهة التنقّل.',
    target: 'مكان فتح المستند المرتبط (مثل \'_blank\'). يُحذف عندما يكون العنصر معطَّلًا.',
    rel: 'علاقة الرابط.',
    download: 'يجعل المتصفح يُنزّل عنوان URL المرتبط. يقترح النص اسم الملف.',
    referrerPolicy: 'سياسة المُحيل للرابط.',
    isSelected: 'ما إذا كان عنصر التنقّل هذا محددًا حاليًا. يضبط aria-current="page" ويطبّق أنماط التمييز.',
    isDisabled: 'ما إذا كان عنصر التنقّل معطَّلًا. يضبط aria-disabled، ويحذف href/target كي لا يتمكن العنصر من التنقّل، ويمنع التفاعل.',
    isIconOnly: 'يعرض العنصر كعنصر مربع بأيقونة فقط. عندما تكون صحيحة، تصبح label قيمة aria-label ويُخفى النص المرئي. يتطلب ضبط icon.',
    icon: 'أيقونة اختيارية تُعرض قبل التسمية.',
    children: 'محتوى مخصص يُعرض بدلًا من نص التسمية.',
    size: 'حجم عنصر التنقّل. ليس له تأثير في الوضع الأفقي؛ ويتحكم في الارتفاع والحشو في وضع الدرج.',
    as: 'مكوّن مخصص يُعرض بدلًا من <a>. يتجاوز القيمة الافتراضية على مستوى المزوّد التي يضبطها LinkProvider. يجب أن يقبل الخصائص href وclassName وstyle وchildren.',
  },
};

export const docsDense = {
  name: 'TopNavItem',
  isHiddenFromOverview: true,
  displayName: 'Top Nav Item',
  description: 'Nav link for TopNav startContent; renders as anchor w/ hover+selected states.',
  propDescriptions: {
    label: 'Visible text or aria-label when isIconOnly is true.',
    href: 'Navigation URL.',
    target: 'link target',
    rel: 'link rel',
    download: 'download the linked URL; string = suggested filename',
    referrerPolicy: 'link referrer policy',
    isSelected: 'Sets aria-current="page"+highlighted styles.',
    isDisabled: 'Sets aria-disabled, drops href/target (no navigation), prevents interaction.',
    icon: 'Icon before label.',
    children: 'Custom content instead of label text.',
    size: 'size; no effect horizontally, sets height/padding in drawer mode',
    as: 'Custom link component. Overrides LinkProvider default. Must accept href, className, style, children.',
  },
};
