/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Avatar',
  displayName: 'Avatar',
  group: 'Avatar',
  category: 'Content',
  keywords: ["avatar","profile","user","photo","thumbnail","initials","gravatar","pfp","userpic"],
  usage: {
    description:
      'Avatar represents a person or team with a profile photo, initials, or a default icon. Use it in comment headers, contact lists, chat messages, user cards, and anywhere you need to identify someone visually.',
    bestPractices: [
      {guidance: true, description: 'Always pass a name so the avatar can show initials if the photo fails to load, and so screen readers can announce who it represents.'},
      {guidance: true, description: 'Pick a size that matches the context: xsm or sm for inline mentions, md or lg for lists and cards, xl for profile headers.'},
      {guidance: true, description: 'Add a status dot when knowing someone\'s availability matters, like in chat or team views.'},
      {guidance: true, description: 'When wrapping an Avatar in your own Tooltip or HoverCard, set tooltip={false} so the built-in name tooltip does not overlap yours.'},
      {guidance: true, description: 'Give every interactive avatar (href or onClick) a name or alt. It is the control\'s accessible name, and it warns in development when it is missing.'},
      {guidance: false, description: 'Rely on a status label to name an interactive avatar. "Online" says nothing about where the link goes.'},
      {guidance: false, description: 'Use Avatar for logos, product images, or anything that isn\'t a person or team. Use an image or icon instead.'},
      {guidance: false, description: 'Use className to override shape. Use the shape prop instead so themes can control it globally.'},
    ],
    anatomy: [
      {name: 'Photo', required: false, description: 'The profile image, loaded from the src URL. Shown when available.'},
      {name: 'Initials', required: false, description: 'The first letter, digit or emoji of the first and last words of the name; punctuation is skipped. Shown when no photo is available. A name with no letters, digits or emoji shows the default icon instead.'},
      {name: 'Default icon', required: false, description: 'A generic person silhouette. Shown when there is no photo or name.'},
      {name: 'Status dot', required: false, description: 'A small indicator in the bottom-right corner showing availability (online, away, busy). Each variant pairs colour with a distinct shape so status does not rely on colour alone.'},
    ],
  },
  theming: {
    targets: [
      {className: 'solo-avatar', visualProps: ['size', 'shape']},
      {className: 'solo-avatar-fallback', visualProps: ['size']},
      {className: 'solo-avatar-status-dot', visualProps: ['variant']},
      {className: 'solo-avatar-status-dot-glyph', visualProps: ['shape']},
    ],
    vars: [
      {name: '--_avatar-group-overlap', description: 'Negative inline offset applied to every avatar stacked in an AvatarGroup; the group pads its start edge by the same amount so the first avatar stays inside it. Set from the group size; a more negative value tightens the stack.', default: 'set at runtime from the group avatar size (px)', private: true},
      {name: '--_avatar-radius', description: 'Border radius of the avatar wrapper, content, focus ring, and the AvatarGroupOverflow "+N" chip. Set per shape variant by shapeStyles.', default: 'var(--radius-full)', private: true},
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_avatar-radius']},
    ],
  },
  description: 'Displays a user avatar with image, initials fallback, and optional status indicator.',
  props: [
    {
      name: 'src',
      type: 'string',
      description: 'Primary image source URL.',
    },
    {
      name: 'fallbackSrc',
      type: 'string',
      description: 'Fallback image when primary fails.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'User name for initials and alt text.',
    },
    {
      name: 'alt',
      type: 'string',
      description: 'Alt text (falls back to name).',
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xl' | number",
      description: "Avatar size. Use a named size ('xsm' 20px, 'sm' 24px, 'md' 36px, 'lg' 48px, 'xl' 128px) or a numeric pixel value. Avatar shares Icon's abbreviated scale, but its tiers are larger because avatars align with media rather than glyphs. Inside an AvatarGroup the group's size wins and this prop is ignored.",
      default: "'md'",
    },
    {
      name: 'shape',
      type: "'circle' | 'rounded' | 'square'",
      description: "Shape variant of the avatar. 'circle' (default) stays fully round. 'rounded' uses the element radius token so it matches UI corner rounding and can be set globally via theme. 'square' has no radius. Status dot positioning adapts automatically: 4-o'clock on circle, bottom-right corner on rounded/square.",
      default: "'circle'",
    },
    {
      name: 'status',
      type: 'ReactNode',
      description: 'Corner content for status indicators. AvatarStatusDot reports its `label` to the avatar, which composes it into the accessible name (e.g. "Jane Doe, Online") so screen readers announce the status. Reporting goes through context, so it still works when the dot sits inside a wrapper component of your own.',
      slotElements: [
        {
          __element: 'AvatarStatusDot',
          props: {
            variant: 'success',
            label: 'Online',
          },
        },
      ],
    },
    {
      name: 'tooltip',
      type: 'string | boolean',
      description:
        "Tooltip shown on hover and keyboard focus. Omitted or true shows the avatar's name; a string shows that text instead; false shows no tooltip. Not auto-disabled when wrapped in your own Tooltip/HoverCard. Set tooltip={false} if you supply your own overlay. No tooltip is shown when tooltip is true/omitted and there is no name.",
      default: 'true',
    },
    {
      name: 'href',
      type: 'string',
      description:
        'When set, the avatar renders as an interactive link (`<a>` or a custom link component) pointing here. This follows the same element-swap rule as Button. Requires a meaningful accessible name via `alt` or `name`: an interactive avatar without one warns in development. Inside an AvatarGroup, interactive avatars share a single Tab stop and are reached with arrow keys.',
    },
    {
      name: 'as',
      type: 'ElementType',
      description:
        'Custom link component used when `href` is set (e.g. `next/link`). Overrides the provider-level LinkProvider default. Only applies with `href`.',
    },
    {
      name: 'target',
      type: 'string',
      description: 'Link target attribute. Only applies with `href`.',
    },
    {
      name: 'rel',
      type: 'string',
      description: 'Link rel attribute. Only applies with `href`.',
    },
    {
      name: 'onClick',
      type: '(e: MouseEvent) => void',
      description:
        'Click handler. When set without `href`, the avatar renders as a focusable `<button type="button">`. Requires a meaningful accessible name via `alt` or `name`: an interactive avatar without one warns in development.',
    },
  ],
  components: [
    {name: 'AvatarStatusDot'},
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'Avatar displays a user or entity\'s profile picture with automatic fallback to initials or a default icon. Use it alongside user information to visually represent people, teams, or entities throughout the interface.',
    bestPractices: [
      {guidance: true, description: 'Always provide a name prop so the component can generate meaningful initials and alt text when the image fails to load.'},
      {guidance: true, description: 'Use the status slot with AvatarStatusDot to indicate online presence or availability when relevant to the context.'},
      {guidance: true, description: 'Give every interactive avatar (href or onClick) a name or alt. It is the control\'s accessible name, and it warns in development when it is missing.'},
      {guidance: false, description: 'Use Avatar for decorative images or logos that aren\'t representing a person or entity. Use an image or icon component instead.'},
      {guidance: false, description: 'Override the circular shape. Avatars are always round to maintain visual consistency across the system.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض صورة رمزية للمستخدم مع صورة، وأحرف أولى كبديل، ومؤشر حالة اختياري.',
  propDescriptions: {
    src: 'رابط URL لمصدر الصورة الأساسية.',
    fallbackSrc: 'صورة بديلة عند فشل تحميل الصورة الأساسية.',
    name: 'اسم المستخدم لاستخراج الأحرف الأولى والنص البديل.',
    alt: 'النص البديل (يعود إلى name عند غيابه).',
    size: 'حجم الصورة الرمزية. استخدم حجمًا مسمّى (\'xsm\' 20px، و\'sm\' 24px، و\'md\' 36px، و\'lg\' 48px، و\'xl\' 128px) أو قيمة رقمية بالبكسل. يتشارك Avatar المقياس المختصر مع Icon، لكن مستوياته أكبر لأن الصور الرمزية تُحاذى مع الوسائط لا مع الرموز الطباعية. داخل AvatarGroup يكون الحجم للمجموعة وتُتجاهل هذه الخاصية.',
    shape: 'نمط شكل الصورة الرمزية. \'circle\' (الافتراضي) يبقى دائريًا بالكامل. \'rounded\' يستخدم رمز تصميم نصف قطر العنصر ليتطابق مع استدارة زوايا الواجهة ويمكن ضبطه على مستوى عام عبر السمة. \'square\' بلا استدارة. يتكيّف موضع نقطة الحالة تلقائيًا: عند موضع الساعة 4 في الدائري، وفي الزاوية السفلية اليمنى في rounded وsquare.',
    status: 'محتوى الزاوية لمؤشرات الحالة. يُبلغ AvatarStatusDot الصورة الرمزية بقيمة `label` الخاصة به، فتدمجها في الاسم القابل للوصول (مثل "Jane Doe, Online") ليُعلن قارئ الشاشة الحالة. يتم الإبلاغ عبر السياق، لذا يظل يعمل عندما تكون النقطة داخل مكوّن مُغلِّف خاص بك.',
    tooltip: 'تلميح يظهر عند التمرير فوق العنصر وعند تركيز لوحة المفاتيح. عند حذفه أو تعيينه إلى true يعرض اسم الصورة الرمزية؛ والسلسلة النصية تعرض ذلك النص بدلًا منه؛ وfalse لا يعرض تلميحًا. لا يُعطَّل تلقائيًا عند تغليفه بـ Tooltip أو HoverCard خاص بك. عيّن tooltip={false} إذا وفّرت طبقة متراكبة خاصة بك. لا يظهر أي تلميح عندما يكون tooltip هو true أو محذوفًا ولا يوجد name.',
    href: 'عند تعيينه، تُعرض الصورة الرمزية كرابط تفاعلي (`<a>` أو مكوّن رابط مخصّص) يشير إلى هذا العنوان. يتبع قاعدة استبدال العنصر نفسها المتبعة في Button. يتطلب اسمًا قابلًا للوصول ذا معنى عبر `alt` أو `name`: تُصدر الصورة الرمزية التفاعلية التي تفتقر إليه تحذيرًا أثناء التطوير. داخل AvatarGroup تتشارك الصور الرمزية التفاعلية نقطة توقف Tab واحدة ويُوصل إليها بمفاتيح الأسهم.',
    as: 'مكوّن رابط مخصّص يُستخدم عند تعيين `href` (مثل `next/link`). يتجاوز القيمة الافتراضية لـ LinkProvider على مستوى المزوّد. لا ينطبق إلا مع `href`.',
    target: 'سمة target للرابط. لا تنطبق إلا مع `href`.',
    rel: 'سمة rel للرابط. لا تنطبق إلا مع `href`.',
    onClick: 'معالج النقر. عند تعيينه دون `href` تُعرض الصورة الرمزية كعنصر `<button type="button">` قابل للتركيز. يتطلب اسمًا قابلًا للوصول ذا معنى عبر `alt` أو `name`: تُصدر الصورة الرمزية التفاعلية التي تفتقر إليه تحذيرًا أثناء التطوير.',
  },
  usage: {
    description: 'يمثّل Avatar شخصًا أو فريقًا بصورة ملف شخصي أو أحرف أولى أو أيقونة افتراضية. استخدمه في ترويسات التعليقات وقوائم جهات الاتصال ورسائل المحادثة وبطاقات المستخدمين، وفي أي مكان تحتاج فيه إلى التعريف بشخص بصريًا.',
    bestPractices: [
      {guidance: true, description: 'مرّر دائمًا name لكي تعرض الصورة الرمزية الأحرف الأولى إذا فشل تحميل الصورة، ولكي يُعلن قارئ الشاشة من تمثّله.'},
      {guidance: true, description: 'اختر حجمًا يناسب السياق: xsm أو sm للإشارات ضمن النص، وmd أو lg للقوائم والبطاقات، وxl لترويسات الملفات الشخصية.'},
      {guidance: true, description: 'أضف نقطة حالة عندما تكون معرفة توفّر الشخص مهمة، كما في المحادثات أو طرق عرض الفريق.'},
      {guidance: true, description: 'عند تغليف Avatar بـ Tooltip أو HoverCard خاص بك، عيّن tooltip={false} كي لا يتداخل تلميح الاسم المدمج مع تلميحك.'},
      {guidance: true, description: 'امنح كل صورة رمزية تفاعلية (href أو onClick) قيمة name أو alt. فهي الاسم القابل للوصول لعنصر التحكم، ويُصدر تحذيرًا أثناء التطوير عند غيابها.'},
      {guidance: false, description: 'الاعتماد على تسمية الحالة لتسمية صورة رمزية تفاعلية. فكلمة «متصل» لا تقول شيئًا عن وجهة الرابط.'},
      {guidance: false, description: 'استخدام Avatar للشعارات أو صور المنتجات أو أي شيء ليس شخصًا أو فريقًا. استخدم صورة أو أيقونة بدلًا من ذلك.'},
      {guidance: false, description: 'استخدام className لتجاوز الشكل. استخدم الخاصية shape بدلًا من ذلك كي تتمكن السمات من التحكم فيه على مستوى عام.'},
    ],
    anatomy: [
      {name: 'الصورة', required: false, description: 'صورة الملف الشخصي، تُحمَّل من رابط src. تظهر عند توفّرها.'},
      {name: 'الأحرف الأولى', required: false, description: 'أول حرف أو رقم أو رمز تعبيري من الكلمتين الأولى والأخيرة في الاسم؛ وتُتخطى علامات الترقيم. تظهر عند عدم توفّر صورة. الاسم الخالي من الحروف والأرقام والرموز التعبيرية يعرض الأيقونة الافتراضية بدلًا منها.'},
      {name: 'الأيقونة الافتراضية', required: false, description: 'صورة ظلية عامة لشخص. تظهر عند عدم وجود صورة أو اسم.'},
      {name: 'نقطة الحالة', required: false, description: 'مؤشر صغير في الزاوية السفلية اليمنى يوضّح التوفّر (متصل، بعيد، مشغول). يقرن كل نمط اللون بشكل مميّز كي لا تعتمد الحالة على اللون وحده.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'person/team avatar w/ photo → initials → icon fallback chain',
  usage: {
    description:
      'Avatar represents a person or team with a profile photo, initials, or a default icon. Falls back automatically. Use in comment headers, contact lists, chat, user cards.',
    bestPractices: [
      {guidance: true, description: 'Always pass a name for initials fallback and screen reader alt text.'},
      {guidance: true, description: 'Match size to context: xsm/sm inline, md/lg in lists, xl for profiles.'},
      {guidance: true, description: 'Add a status dot in chat or team views where availability matters.'},
      {guidance: true, description: 'When wrapping Avatar in your own Tooltip or HoverCard, set tooltip={false} so the built-in name tooltip does not overlap yours.'},
      {guidance: true, description: 'Interactive avatars (href/onClick) need name or alt; without one they warn in development.'},
      {guidance: false, description: 'Rely on a status label to name an interactive avatar. "Online" says nothing about where the link goes.'},
      {guidance: false, description: 'Use for logos or product images. Use an image or icon instead.'},
      {guidance: false, description: 'Force a square or custom shape. Avatars are always circular.'},
    ],
  },
  propDescriptions: {
    src: 'primary image source URL',
    fallbackSrc: 'fallback image when primary fails',
    name: 'user name for initials and alt text',
    alt: 'alt text; falls back to name',
    size: "avatar size. Named ('xsm' 20px, 'sm' 24px, 'md' 36px, 'lg' 48px, 'xl' 128px) or numeric px. An AvatarGroup's size overrides it.",
    status:
      'corner content for status indicators; AvatarStatusDot reports its `label`, composed into the avatar accessible name ("Jane Doe, Online"), at any nesting depth',
    tooltip:
      "hover/focus tooltip. true/omitted → name; string → that text; false → none. Owns its tooltip; set false when wrapping in your own Tooltip/HoverCard. Default true.",
    href: 'renders avatar as a link (<a>/custom). Needs alt/name for an accessible name; warns in development without one. Button-style element swap.',
    as: 'custom link component for href (e.g. Next Link). Only with href.',
    target: 'link target. Only with href.',
    rel: 'link rel. Only with href.',
    onClick: 'click handler → renders <button> when no href. Needs alt/name; warns in development without one.',
  },
  components: [
    {name: 'AvatarStatusDot', description: 'size-aware status indicator rendered in the Avatar corner'},
  ],
};
