/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'AspectRatio',
  displayName: 'Aspect Ratio',
  category: 'Layout',
  keywords: ["aspect-ratio","ratio","proportion","responsive","embed","container","widescreen","thumbnail","letterbox","crop"],
  usage: {
    description:
      'Maintains a fixed width-to-height ratio for its children as its container resizes. Use it for media containers like videos, images, thumbnails, or any content that needs consistent proportions. It takes its width from the container and derives its height from the ratio, so it needs an ancestor with a definite width.',
    bestPractices: [
      {guidance: true, description: 'Express the ratio as a fraction for readability — `ratio={16 / 9}` rather than `ratio={1.78}`. It is a number, so the string form `ratio="16/9"` is a type error.'},
      {guidance: true, description: 'Use for media that needs consistent proportions across screen sizes.'},
      {guidance: true, description: 'Use `fit="cover"` for images and video so the component sizes the child; the child should not repeat `width`/`height`/`objectFit` styles.'},
      {guidance: true, description: 'Pass one child. With `fit` set, every direct child is stretched to fill the box, so put an overlay or caption inside a single wrapper child rather than passing it as a second child.'},
      {guidance: true, description: 'Describe media children with `alt`, or `alt=""` when the image is decorative. AspectRatio adds no role and no accessible name of its own, so the child carries the whole accessible description.'},
      {guidance: true, description: 'For a breakpoint-dependent ratio, override the ratio responsively: pass an `aspect-ratio` class via `className` under a `@media`/`@container` variant (e.g. `@max-[720px]:aspect-[3/2]`), or override `aspect-ratio` from your own unlayered CSS under a `@media`/`@container` rule; component styles live in the `solo-base` cascade layer, so unlayered consumer CSS wins. Keep the base ratio on the `ratio` prop and put only the responsive change in the variant class; the `ratio` declaration still applies outside the query.'},
      {guidance: false, description: 'Use for general layout containers; use standard layout components instead.'},
      {guidance: false, description: 'Nest AspectRatio containers; one level is sufficient.'},
      {guidance: false, description: 'Constrain the height on its own. The width comes from the container, so a `height` or `maxHeight` by itself clamps the box off ratio; pair it with `width: "auto"` to size from the height instead.'},
      {guidance: false, description: 'Place it in a shrink-to-fit parent such as `inline-flex`, `width: fit-content` or a floated box. It contributes no intrinsic width there and collapses to zero.'},
    ],
    anatomy: [
      {name: 'Ratio box', required: true, description: 'The outer element that holds the aspect ratio and clips overflow. Carries the `solo-aspect-ratio` theme target, and the elliptical clip when `shape` is `ellipse`.'},
      {name: 'Content slot', required: true, description: 'A wrapper that fills the ratio box and positions the child. With `fit` set it also sizes the child; without it the child styles itself.'},
    ],
  },
  props: [
    {
      name: 'ratio',
      type: 'number',
      description: 'Aspect ratio as width/height (e.g. 16/9, 1). Emitted as a class-level declaration (never inline), so `className` rules or unlayered consumer CSS can override it responsively.',
      required: true,
    },
    {
      name: 'shape',
      type: "'rectangle' | 'ellipse'",
      description: 'Container shape. Both respect the `ratio`. `ellipse` clips to an oval (a circle when `ratio={1}`).',
      default: "'rectangle'",
    },
    {
      name: 'fit',
      type: "'cover' | 'contain' | 'center'",
      description: 'How the child is sized inside the ratio box. `cover` fills and crops media, `contain` fills and letterboxes, `center` keeps the natural size centered. When omitted, the child styles itself.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content positioned absolutely to fill the container.',
      required: true,
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  playground: {
    defaults: {
      ratio: 16 / 9,
      children: {__element: 'Center', props: {height: '100%'}, children: {__element: 'Text', props: {color: 'secondary'}, children: '16:9'}},
    },
  },
  theming: {
    targets: [
      {className: 'solo-aspect-ratio', visualProps: ['shape']},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'AspectRatio',
  displayName: 'Aspect Ratio',
  usage: {
    description:
      'Maintains a fixed width-to-height ratio for its children as its container resizes. Use it for media containers like videos, images, thumbnails, or any content that needs consistent proportions. It takes its width from the container and derives its height from the ratio, so it needs an ancestor with a definite width.',
    bestPractices: [
      {guidance: true, description: 'Express the ratio as a fraction for readability — `ratio={16 / 9}` rather than `ratio={1.78}`. It is a number, so the string form `ratio="16/9"` is a type error.'},
      {guidance: true, description: 'Use for media that needs consistent proportions across screen sizes.'},
      {guidance: true, description: 'Use `fit="cover"` for images and video so the component sizes the child; the child should not repeat `width`/`height`/`objectFit` styles.'},
      {guidance: true, description: 'Pass one child. With `fit` set, every direct child is stretched to fill the box, so put an overlay or caption inside a single wrapper child rather than passing it as a second child.'},
      {guidance: true, description: 'Describe media children with `alt`, or `alt=""` when the image is decorative. AspectRatio adds no role and no accessible name of its own, so the child carries the whole accessible description.'},
      {guidance: true, description: 'For a breakpoint-dependent ratio, override the ratio responsively: pass an `aspect-ratio` class via `className` under a `@media`/`@container` variant (e.g. `@max-[720px]:aspect-[3/2]`), or override `aspect-ratio` from your own unlayered CSS under a `@media`/`@container` rule; component styles live in the `solo-base` cascade layer, so unlayered consumer CSS wins. Keep the base ratio on the `ratio` prop and put only the responsive change in the variant class; the `ratio` declaration still applies outside the query.'},
      {guidance: false, description: 'Use for general layout containers; use standard layout components instead.'},
      {guidance: false, description: 'Nest AspectRatio containers; one level is sufficient.'},
      {guidance: false, description: 'Constrain the height on its own. The width comes from the container, so a `height` or `maxHeight` by itself clamps the box off ratio; pair it with `width: "auto"` to size from the height instead.'},
      {guidance: false, description: 'Place it in a shrink-to-fit parent such as `inline-flex`, `width: fit-content` or a floated box. It contributes no intrinsic width there and collapses to zero.'},
    ],
    anatomy: [
      {name: 'Ratio box', required: true, description: 'The outer element that holds the aspect ratio and clips overflow. Carries the `solo-aspect-ratio` theme target, and the elliptical clip when `shape` is `ellipse`.'},
      {name: 'Content slot', required: true, description: 'A wrapper that fills the ratio box and positions the child. With `fit` set it also sizes the child; without it the child styles itself.'},
    ],
  },
  props: [
    {name: 'ratio', type: 'number', description: '宽高比，以宽/高表示（例如 16/9、1）。以类级声明输出（非内联样式），可通过 `className` 规则或未分层的（unlayered）消费者 CSS 做响应式覆盖。', required: true},
    {
      name: 'shape',
      type: "'rectangle' | 'ellipse'",
      description: '容器形状。两种形状都遵循 `ratio`。`ellipse` 裁剪为椭圆（`ratio={1}` 时为正圆）。',
      default: "'rectangle'",
    },
    {
      name: 'fit',
      type: "'cover' | 'contain' | 'center'",
      description: '子元素在比例框内的布局方式。`cover` 填满并裁剪媒体，`contain` 填满并留边，`center` 保持原始尺寸居中。省略时子元素自行设置样式。',
    },
    {name: 'children', type: 'ReactNode', description: '通过绝对定位填充容器的内容。', required: true},
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-aspect-ratio', visualProps: ['shape']},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يحافظ على نسبة ثابتة بين العرض والارتفاع لعناصره الفرعية عند تغيّر حجم حاويته.',
  propDescriptions: {
    ratio: 'نسبة الأبعاد على شكل العرض/الارتفاع (مثل 16/9 أو 1). تُصدَر كتصريح على مستوى الصنف (وليس مضمّنًا أبدًا)، لذا يمكن لقواعد `className` أو لـ CSS المستهلك غير المصنّف في طبقة تجاوزها بشكل متجاوب.',
    shape: 'شكل الحاوية. كلاهما يحترم `ratio`. يقصّ `ellipse` المحتوى على شكل بيضاوي (دائرة عندما تكون `ratio={1}`).',
    fit: 'كيفية تحجيم العنصر الفرعي داخل صندوق النسبة. `cover` يملأ ويقصّ الوسائط، و`contain` يملأ مع إضافة هوامش، و`center` يُبقي الحجم الطبيعي في المنتصف. عند الإغفال يتولى العنصر الفرعي تنسيق نفسه.',
    children: 'محتوى بموضع مطلق يملأ الحاوية.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمَج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداةُ المتعارضة القيمةَ الافتراضية.',
  },
  usage: {
    description: 'يحافظ على نسبة ثابتة بين العرض والارتفاع لعناصره الفرعية عند تغيّر حجم حاويته. استخدمه لحاويات الوسائط مثل مقاطع الفيديو والصور والصور المصغّرة، أو أي محتوى يحتاج إلى أبعاد متناسقة. يأخذ عرضه من الحاوية ويشتق ارتفاعه من النسبة، لذا يحتاج إلى عنصر سلف ذي عرض محدد.',
    bestPractices: [
      {
        guidance: true,
        description: 'عبّر عن النسبة بكسر لسهولة القراءة — `ratio={16 / 9}` بدلًا من `ratio={1.78}`. إنها قيمة رقمية، لذا فإن الصيغة النصية `ratio="16/9"` خطأ في النوع.',
      },
      {
        guidance: true,
        description: 'استخدمه للوسائط التي تحتاج إلى أبعاد متناسقة عبر أحجام الشاشات المختلفة.',
      },
      {
        guidance: true,
        description: 'استخدم `fit="cover"` للصور والفيديو كي يتولى المكوّن تحجيم العنصر الفرعي؛ ولا ينبغي للعنصر الفرعي تكرار أنماط `width`/`height`/`objectFit`.',
      },
      {
        guidance: true,
        description: 'مرّر عنصرًا فرعيًا واحدًا. عند تعيين `fit` يُمدَّد كل عنصر فرعي مباشر ليملأ الصندوق، لذا ضع الطبقة المتراكبة أو التعليق داخل عنصر فرعي مغلِّف واحد بدلًا من تمريره كعنصر فرعي ثانٍ.',
      },
      {
        guidance: true,
        description: 'صِف العناصر الفرعية من الوسائط باستخدام `alt`، أو `alt=""` عندما تكون الصورة زخرفية. لا يضيف AspectRatio أي دور أو اسم قابل للوصول خاص به، لذا يحمل العنصر الفرعي الوصف القابل للوصول بالكامل.',
      },
      {
        guidance: true,
        description: 'لنسبة تعتمد على نقاط التوقف، تجاوز النسبة بشكل متجاوب: مرّر صنف `aspect-ratio` عبر `className` ضمن متغيّر `@media`/`@container` (مثل `@max-[720px]:aspect-[3/2]`)، أو تجاوز `aspect-ratio` من CSS خاص بك غير مصنّف في طبقة ضمن قاعدة `@media`/`@container`؛ إذ توجد أنماط المكوّن في طبقة التتالي `solo-base`، لذا يتغلب CSS المستهلك غير المصنّف. أبقِ النسبة الأساسية في الخاصية `ratio` وضع التغيير المتجاوب فقط في صنف المتغيّر؛ فتصريح `ratio` يظل مطبَّقًا خارج الاستعلام.',
      },
      {
        guidance: false,
        description: 'لا تستخدمه لحاويات التخطيط العامة؛ استخدم مكوّنات التخطيط القياسية بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'لا تُداخِل حاويات AspectRatio؛ فمستوى واحد يكفي.',
      },
      {
        guidance: false,
        description: 'لا تقيّد الارتفاع وحده. يأتي العرض من الحاوية، لذا فإن `height` أو `maxHeight` وحده يُخرج الصندوق عن النسبة؛ اقرنه بـ `width: "auto"` للتحجيم انطلاقًا من الارتفاع بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'لا تضعه داخل عنصر أب يتقلص ليلائم محتواه مثل `inline-flex` أو `width: fit-content` أو صندوق عائم. فهو لا يساهم بعرض ذاتي هناك وينهار إلى الصفر.',
      },
    ],
    anatomy: [
      {
        name: 'صندوق النسبة',
        required: true,
        description: 'العنصر الخارجي الذي يحافظ على نسبة الأبعاد ويقصّ الفائض. يحمل هدف السمة `solo-aspect-ratio`، والقصّ البيضاوي عندما تكون قيمة `shape` هي `ellipse`.',
      },
      {
        name: 'خانة المحتوى',
        required: true,
        description: 'مغلِّف يملأ صندوق النسبة ويحدد موضع العنصر الفرعي. عند تعيين `fit` يحدد أيضًا حجم العنصر الفرعي؛ ومن دونه يتولى العنصر الفرعي تنسيق نفسه.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'maintains specific aspect ratio for children',
  usage: {
    description:
      'Maintains a fixed width-to-height ratio for its children as its container resizes. Use it for media containers like videos, images, thumbnails, or any content that needs consistent proportions. It takes its width from the container and derives its height from the ratio, so it needs an ancestor with a definite width.',
    bestPractices: [
      {guidance: true, description: 'Express the ratio as a fraction for readability — `ratio={16 / 9}` rather than `ratio={1.78}`. It is a number, so the string form `ratio="16/9"` is a type error.'},
      {guidance: true, description: 'Use for media that needs consistent proportions across screen sizes.'},
      {guidance: true, description: 'Use `fit="cover"` for images and video so the component sizes the child; the child should not repeat `width`/`height`/`objectFit` styles.'},
      {guidance: true, description: 'Pass one child. With `fit` set, every direct child is stretched to fill the box, so put an overlay or caption inside a single wrapper child rather than passing it as a second child.'},
      {guidance: true, description: 'Describe media children with `alt`, or `alt=""` when the image is decorative. AspectRatio adds no role and no accessible name of its own, so the child carries the whole accessible description.'},
      {guidance: true, description: 'For a breakpoint-dependent ratio, override the ratio responsively: pass an `aspect-ratio` class via `className` under a `@media`/`@container` variant (e.g. `@max-[720px]:aspect-[3/2]`), or override `aspect-ratio` from your own unlayered CSS under a `@media`/`@container` rule; component styles live in the `solo-base` cascade layer, so unlayered consumer CSS wins. Keep the base ratio on the `ratio` prop and put only the responsive change in the variant class; the `ratio` declaration still applies outside the query.'},
      {guidance: false, description: 'Use for general layout containers; use standard layout components instead.'},
      {guidance: false, description: 'Nest AspectRatio containers; one level is sufficient.'},
      {guidance: false, description: 'Constrain the height on its own. The width comes from the container, so a `height` or `maxHeight` by itself clamps the box off ratio; pair it with `width: "auto"` to size from the height instead.'},
      {guidance: false, description: 'Place it in a shrink-to-fit parent such as `inline-flex`, `width: fit-content` or a floated box. It contributes no intrinsic width there and collapses to zero.'},
    ],
    anatomy: [
      {name: 'Ratio box', required: true, description: 'The outer element that holds the aspect ratio and clips overflow. Carries the `solo-aspect-ratio` theme target, and the elliptical clip when `shape` is `ellipse`.'},
      {name: 'Content slot', required: true, description: 'A wrapper that fills the ratio box and positions the child. With `fit` set it also sizes the child; without it the child styles itself.'},
    ],
  },
  propDescriptions: {
    ratio: 'width/height ratio (e.g. 16/9, 1); class-level declaration (never inline) so className/unlayered-CSS @container overrides win',
    shape: "container shape: 'rectangle' (default) | 'ellipse' (circle at ratio 1)",
    fit: "child layout: 'cover' fill+crop | 'contain' fill+letterbox | 'center' natural size; omitted = child styles itself",
    children: 'content positioned absolutely to fill container',
    className: 'Tailwind classes for layout customization; merged via cn(), so conflicting utilities override defaults',
  },
};
