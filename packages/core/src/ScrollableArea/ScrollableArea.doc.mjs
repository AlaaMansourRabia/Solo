/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'ScrollableArea',
  displayName: 'Scrollable Area',
  category: 'Layout',
  keywords: ['scroll', 'overflow', 'viewport', 'logical axis', 'keyboard', 'overscroll', 'sticky', 'scrollbar', 'padding', 'full bleed'],
  usage: {
    description: 'Provides a native scroll viewport and a real observed content box. The viewport enters the tab order only while a requested logical axis is effectively scrollable, and containment applies only to effective axes.',
    bestPractices: [
      {guidance: true, description: 'Give every area a concise label that identifies the content keyboard users will scroll.'},
      {guidance: true, description: 'Choose `inline`, `block`, or `both` from content intent; the component maps the logical axes through writing mode and direction.'},
      {guidance: true, description: 'Keep the default `overscroll="allow"` for nested areas unless the interaction deliberately needs containment.'},
      {guidance: true, description: 'Use `useScrollableArea` instead when a component already owns both a viewport and a suitable content box, or when children must remain direct flex/grid items or retain a definite percentage block-size basis.'},
      {guidance: true, description: 'ScrollableArea owns one normal block content box with a 100% minimum size. Inline and both-axis modes use max-content inline sizing, so intrinsic inline layout is intentionally wider than the viewport.'},
      {guidance: true, description: 'Use logical padding props on the content box so nested full-bleed components receive the same inset geometry.'},
      {guidance: true, description: 'Set `isFullBleed` only when the viewport itself should reach an ancestor container edge; it is off by default.'},
      {guidance: true, description: 'Set `stickyContainment="always"` only when a fitting viewport should intentionally remain a Sticky boundary.'},
      {guidance: false, description: 'Hide the native scrollbar without another visible and operable overflow affordance.'},
      {guidance: false, description: 'Add another overflow wrapper around ScrollableArea; one native viewport should own scrolling.'},
    ],
    anatomy: [
      {name: 'Viewport', required: true, description: 'The root native scroll container, accessible name owner, focus target while effective, and `solo-scrollable-area` theme target.'},
      {name: 'Content box', required: true, description: 'A real inner layout box observed together with the viewport. For inline scrolling it uses max-content inline sizing with a 100% minimum.'},
    ],
  },
  props: [
    {name: 'axis', type: "'inline' | 'block' | 'both'", description: 'Logical axis or axes where native scrolling is allowed.', default: "'block'"},
    {name: 'label', type: 'string', description: 'Accessible name for the viewport when it becomes keyboard scrollable.', required: true},
    {name: 'role', type: "'group' | 'region'", description: 'Semantics for the named viewport.', default: "'group'"},
    {name: 'overscroll', type: "'allow' | 'contain'", description: 'Whether effective axes continue scrolling an ancestor at their edge.', default: "'allow'"},
    {name: 'width', type: 'SizeValue', description: 'Width of the viewport; a number is interpreted as pixels, a string is used as-is.'},
    {name: 'height', type: 'SizeValue', description: 'Height of the viewport; a number is interpreted as pixels, a string is used as-is.'},
    {name: 'maxWidth', type: 'SizeValue', description: 'Maximum width of the viewport.'},
    {name: 'minHeight', type: 'SizeValue', description: 'Minimum height of the viewport.'},
    {name: 'stickyContainment', type: "'whenScrollable' | 'always'", description: 'Whether fitting content passes Sticky ownership to an outer container or deliberately keeps this viewport as the CSS Sticky boundary.', default: "'whenScrollable'"},
    {name: 'padding', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Content padding on every logical edge; publishes matching inset geometry.', default: '0'},
    {name: 'paddingInline', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical inline-axis content padding; overrides `padding` on that axis.'},
    {name: 'paddingInlineStart', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical inline-start content padding; overrides broader padding values.'},
    {name: 'paddingInlineEnd', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical inline-end content padding; overrides broader padding values.'},
    {name: 'paddingBlock', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical block-axis content padding; overrides `padding` on that axis.'},
    {name: 'paddingBlockStart', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical block-start content padding; overrides broader padding values.'},
    {name: 'paddingBlockEnd', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical block-end content padding; overrides broader padding values.'},
    {name: 'isFullBleed', type: 'boolean', description: 'Lets the viewport escape inherited container padding without changing content padding.', default: 'false'},
    {name: 'children', type: 'ReactNode', description: 'Content rendered inside the observed content box.'},
    {name: 'className', type: 'string', description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.'},
  ],
  playground: {
    defaults: {
      axis: 'block',
      label: 'Scrollable example',
      children: 'Add enough content to exceed a constrained viewport.',
    },
  },
  theming: {
    targets: [
      {className: 'solo-scrollable-area', visualProps: ['axis']},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'يوفّر منفذ عرض تمرير أصليًا وصندوق محتوى حقيقيًا مُراقَبًا. لا يدخل منفذ العرض ترتيب التنقّل بالمفتاح Tab إلا حين يكون محور منطقي مطلوب قابلًا للتمرير فعليًا، ولا يُطبَّق الاحتواء إلا على المحاور الفعلية.',
  propDescriptions: {
    axis: 'المحور أو المحاور المنطقية التي يُسمح فيها بالتمرير الأصلي.',
    label: 'الاسم القابل للوصول لمنفذ العرض عندما يصبح قابلًا للتمرير بلوحة المفاتيح.',
    role: 'الدلالات الخاصة بمنفذ العرض المسمّى.',
    overscroll: 'ما إذا كانت المحاور الفعلية تواصل تمرير عنصر سلف عند بلوغ حافتها.',
    width: 'عرض منفذ العرض؛ يُفسَّر الرقم على أنه بكسلات، وتُستخدم السلسلة كما هي.',
    height: 'ارتفاع منفذ العرض؛ يُفسَّر الرقم على أنه بكسلات، وتُستخدم السلسلة كما هي.',
    maxWidth: 'الحد الأقصى لعرض منفذ العرض.',
    minHeight: 'الحد الأدنى لارتفاع منفذ العرض.',
    stickyContainment:
      'ما إذا كان المحتوى الملائم يمرّر ملكية Sticky إلى حاوية خارجية، أو يُبقي عمدًا منفذ العرض هذا حدًّا لـ CSS Sticky.',
    padding: 'حشو المحتوى على كل حافة منطقية؛ ويَنشر هندسة إزاحة مطابقة.',
    paddingInline: 'حشو المحتوى على المحور السطري المنطقي؛ يتجاوز `padding` على ذلك المحور.',
    paddingInlineStart: 'حشو المحتوى عند البداية السطرية المنطقية؛ يتجاوز قيم الحشو الأعم.',
    paddingInlineEnd: 'حشو المحتوى عند النهاية السطرية المنطقية؛ يتجاوز قيم الحشو الأعم.',
    paddingBlock: 'حشو المحتوى على المحور الكتلي المنطقي؛ يتجاوز `padding` على ذلك المحور.',
    paddingBlockStart: 'حشو المحتوى عند البداية الكتلية المنطقية؛ يتجاوز قيم الحشو الأعم.',
    paddingBlockEnd: 'حشو المحتوى عند النهاية الكتلية المنطقية؛ يتجاوز قيم الحشو الأعم.',
    isFullBleed: 'يتيح لمنفذ العرض تجاوز حشو الحاوية الموروث دون تغيير حشو المحتوى.',
    children: 'المحتوى المعروض داخل صندوق المحتوى المُراقَب.',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description:
      'يوفّر منفذ عرض تمرير أصليًا وصندوق محتوى حقيقيًا مُراقَبًا. لا يدخل منفذ العرض ترتيب التنقّل بالمفتاح Tab إلا حين يكون محور منطقي مطلوب قابلًا للتمرير فعليًا، ولا يُطبَّق الاحتواء إلا على المحاور الفعلية.',
    bestPractices: [
      {
        guidance: true,
        description: 'امنح كل منطقة تسمية موجزة تعرّف المحتوى الذي سيمرّره مستخدمو لوحة المفاتيح.',
      },
      {
        guidance: true,
        description:
          'اختر `inline` أو `block` أو `both` بحسب غرض المحتوى؛ إذ يربط المكوّن المحاور المنطقية عبر وضع الكتابة والاتجاه.',
      },
      {
        guidance: true,
        description:
          'أبقِ القيمة الافتراضية `overscroll="allow"` للمناطق المتداخلة ما لم يتطلب التفاعل الاحتواء عمدًا.',
      },
      {
        guidance: true,
        description:
          'استخدم `useScrollableArea` بدلًا منه عندما يمتلك مكوّن بالفعل منفذ عرض وصندوق محتوى مناسبًا، أو عندما يجب أن تبقى العناصر الأبناء عناصر flex/grid مباشرة أو تحتفظ بأساس محدّد للحجم الكتلي بالنسبة المئوية.',
      },
      {
        guidance: true,
        description:
          'يمتلك ScrollableArea صندوق محتوى كتليًا عاديًا واحدًا بحد أدنى للحجم 100%. يستخدم الوضعان السطري وثنائي المحور تحجيمًا سطريًا max-content، لذا يكون التخطيط السطري الجوهري أعرض من منفذ العرض عمدًا.',
      },
      {
        guidance: true,
        description:
          'استخدم خصائص الحشو المنطقية على صندوق المحتوى لتتلقى المكوّنات الممتدة بالكامل المتداخلة هندسة الإزاحة نفسها.',
      },
      {
        guidance: true,
        description:
          'عيّن `isFullBleed` فقط عندما ينبغي أن يبلغ منفذ العرض نفسه حافة حاوية سلف؛ وهي معطَّلة افتراضيًا.',
      },
      {
        guidance: true,
        description:
          'عيّن `stickyContainment="always"` فقط عندما ينبغي أن يبقى منفذ عرض ملائم حدًّا لـ Sticky عمدًا.',
      },
      {
        guidance: false,
        description: 'لا تُخفِ شريط التمرير الأصلي دون وسيلة فيض أخرى مرئية وقابلة للتشغيل.',
      },
      {
        guidance: false,
        description:
          'لا تُضف غلاف فيض آخر حول ScrollableArea؛ إذ ينبغي أن يتولى منفذ عرض أصلي واحد التمرير.',
      },
    ],
    anatomy: [
      {
        name: 'منفذ العرض',
        required: true,
        description:
          'حاوية التمرير الأصلية الجذرية، ومالكة الاسم القابل للوصول، وهدف التركيز حين تكون فعّالة، وهدف السمة `solo-scrollable-area`.',
      },
      {
        name: 'صندوق المحتوى',
        required: true,
        description:
          'صندوق تخطيط داخلي حقيقي يُراقَب مع منفذ العرض. في التمرير السطري يستخدم تحجيمًا سطريًا max-content بحد أدنى 100%.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'native logical-axis scroll viewport with conditional keyboard access, live edge state, and observed content geometry',
  usage: {
    description: 'Use for a complete viewport/content composition; use useScrollableArea for existing structure.',
    bestPractices: [
      {guidance: true, description: 'Always provide a concise label.'},
      {guidance: true, description: 'Prefer overscroll allow; contain only deliberate nested interactions.'},
      {guidance: true, description: 'Use content padding props to publish inset; use isFullBleed only for viewport escape.'},
      {guidance: false, description: 'Nest another overflow wrapper around it.'},
    ],
    anatomy: [
      {name: 'Viewport', required: true, description: 'native scrolling, conditional tab stop, and theme target'},
      {name: 'Content box', required: true, description: 'real observed layout box'},
    ],
  },
  propDescriptions: {
    axis: "logical scroll intent: 'inline' | 'block' (default) | 'both'",
    label: 'required accessible viewport name',
    role: "named viewport semantics: 'group' (default) | 'region'",
    overscroll: "edge behavior: 'allow' (default) | 'contain' on effective axes only",
    width: 'viewport width',
    height: 'viewport height',
    maxWidth: 'viewport maximum width',
    minHeight: 'viewport minimum height',
    stickyContainment: "fitting Sticky ownership: 'whenScrollable' (default) | 'always'",
    padding: 'content inset on every edge; defaults to 0 and publishes geometry',
    paddingInline: 'logical inline-axis content inset',
    paddingInlineStart: 'logical inline-start content inset',
    paddingInlineEnd: 'logical inline-end content inset',
    paddingBlock: 'logical block-axis content inset',
    paddingBlockStart: 'logical block-start content inset',
    paddingBlockEnd: 'logical block-end content inset',
    isFullBleed: 'opt-in viewport escape from inherited container padding',
    children: 'content inside the observed box',
    className: 'viewport sizing and native scrollbar presentation overrides',
  },
};
