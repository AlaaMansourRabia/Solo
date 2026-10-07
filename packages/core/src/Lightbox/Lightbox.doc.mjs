/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Viewer overlay',
    required: true,
    description:
      'Full-viewport dialog overlay that contains the active media and controls.',
  },
  {
    name: 'Media',
    required: true,
    description: 'Active image or video presented inside the viewer.',
  },
  {
    name: 'Close button',
    required: true,
    description: 'Button that closes the viewer.',
  },
  {
    name: 'Previous button',
    required: false,
    description: 'Gallery button that moves to the previous media item.',
  },
  {
    name: 'Next button',
    required: false,
    description: 'Gallery button that moves to the next media item.',
  },
  {
    name: 'Caption',
    required: false,
    description: 'Caller-provided caption displayed below the active media.',
  },
  {
    name: 'Counter',
    required: false,
    description: 'Current position and total shown in gallery mode.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Lightbox',
  displayName: 'Lightbox',
  category: 'Overlay',
  keywords: [
    'lightbox',
    'image',
    'video',
    'viewer',
    'gallery',
    'zoom',
    'fullscreen',
    'media',
    'photo',
    'preview',
  ],
  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the lightbox is open.',
      required: true,
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Callback when the lightbox open state changes.',
      required: true,
    },
    {
      name: 'media',
      // Left as the named type on purpose: the shape carries `caption?:
      // ReactNode`, so spelling it out makes the docsite playground parse the
      // whole prop as an editable *string*, which would feed the preview text
      // where a media object belongs. The shape and its legal values live in
      // the description instead.
      type: 'LightboxMedia | LightboxMedia[]',
      description:
        "Media to display. Pass a single object for one item, or an array for gallery mode with prev/next navigation. Each item is {src: string, alt: string, caption?: ReactNode, type?: 'image' | 'video'}; type defaults to 'image', and zoom/pan is disabled for 'video'.",
      required: true,
    },
    {
      name: 'index',
      type: 'number',
      description: 'Current index in gallery mode (when media is an array).',
    },
    {
      name: 'onIndexChange',
      type: '(index: number) => void',
      description:
        'Callback when the gallery index changes via prev/next navigation.',
    },
    {
      name: 'hasZoom',
      type: 'boolean',
      description:
        'Enable zoom on double-click, or Enter/Space/+/- via keyboard (images only). When zoomed, drag or use arrow keys to pan.',
      default: 'false',
    },
    {
      name: 'defaultIndex',
      type: 'number',
      description:
        'Initial image index in gallery mode for uncontrolled usage.',
      default: '0',
    },
    {
      name: 'hasAutoPlay',
      type: 'boolean',
      description:
        'Automatically start video playback when a video media item is shown.',
      default: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [{className: 'solo-lightbox', visualProps: []}],
  },
  usage: {
    anatomy,
    description:
      'A fullscreen overlay for viewing images and videos at full resolution. Supports single-item and gallery modes with prev/next navigation, optional zoom and pan for images, and native video controls.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always provide alt text for every image for screen reader accessibility.',
      },
      {
        guidance: true,
        description:
          'Use gallery mode with onIndexChange for multi-image sets.',
      },
      {
        guidance: true,
        description:
          'Enable hasZoom only when viewing high-resolution images that benefit from close inspection.',
      },
      {
        guidance: false,
        description:
          'Use the lightbox for non-image content; it is specialized for images.',
      },
      {
        guidance: false,
        description:
          'Nest interactive content inside captions; keep them plain text.',
      },
    ],
  },
  // The lightbox opens via showModal() and renders nothing while closed —
  // overlay mode gives the Properties preview an open trigger instead of an
  // empty stage, mirroring MobileNav.
  playground: {
    overlay: true,
    defaults: {
      isOpen: false,
      media: {
        src: '/template-assets/light-scene-horizontal-1.png',
        alt: 'Coastal shoreline with ocean waves',
        caption:
          'A scenic coastline with waves rolling onto a sandy beach beneath a clear sky.',
      },
    },
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Lightbox',
  displayName: 'Lightbox',
  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      description: '灯箱是否打开。',
      required: true,
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: '灯箱打开状态变化时的回调。',
      required: true,
    },
    {
      name: 'media',
      type: 'LightboxMedia | LightboxMedia[]',
      description:
        "要显示的媒体。传入单个对象或数组（用于画廊模式的上一张/下一张导航）。每项为 {src, alt, caption?, type?: 'image' | 'video'}；type 默认为 'image'，'video' 禁用缩放/平移。",
      required: true,
    },
    {
      name: 'index',
      type: 'number',
      description: '画廊模式中当前索引。',
    },
    {
      name: 'onIndexChange',
      type: '(index: number) => void',
      description: '通过上一张/下一张导航更改画廊索引时的回调。',
    },
    {
      name: 'hasZoom',
      type: 'boolean',
      description: '启用双击缩放（仅图片）。缩放后可拖动平移。',
      default: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  theming: {
    targets: [{className: 'solo-lightbox', visualProps: []}],
  },
  usage: {
    anatomy,
    description:
      'A fullscreen overlay for viewing images and videos at full resolution. Supports single-item and gallery modes with prev/next navigation, optional zoom and pan for images, and native video controls.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always provide alt text for every image for screen reader accessibility.',
      },
      {
        guidance: true,
        description:
          'Use gallery mode with onIndexChange for multi-image sets.',
      },
      {
        guidance: true,
        description:
          'Enable hasZoom only when viewing high-resolution images that benefit from close inspection.',
      },
      {
        guidance: false,
        description:
          'Use the lightbox for non-image content; it is specialized for images.',
      },
      {
        guidance: false,
        description:
          'Nest interactive content inside captions; keep them plain text.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'طبقة متراكبة بملء الشاشة لعرض الصور ومقاطع الفيديو بدقتها الكاملة، مع دعم وضع العنصر الواحد ووضع المعرض.',
  propDescriptions: {
    isOpen: 'ما إذا كان العارض مفتوحًا.',
    onOpenChange: 'دالة استدعاء عند تغيّر حالة فتح العارض.',
    media: 'الوسائط المراد عرضها. مرّر كائنًا واحدًا لعنصر واحد، أو مصفوفة لوضع المعرض مع التنقّل بين السابق والتالي. كل عنصر هو {src: string, alt: string, caption?: ReactNode, type?: \'image\' | \'video\'}؛ القيمة الافتراضية لـ type هي \'image\'، ويُعطَّل التكبير والتحريك لـ \'video\'.',
    index: 'الفهرس الحالي في وضع المعرض (عندما تكون media مصفوفة).',
    onIndexChange: 'دالة استدعاء عند تغيّر فهرس المعرض عبر التنقّل بين السابق والتالي.',
    hasZoom: 'تفعيل التكبير بالنقر المزدوج، أو عبر Enter/Space/+/- من لوحة المفاتيح (للصور فقط). عند التكبير، اسحب أو استخدم مفاتيح الأسهم للتحريك.',
    defaultIndex: 'فهرس الصورة الأولي في وضع المعرض للاستخدام غير المتحكَّم به.',
    hasAutoPlay: 'بدء تشغيل الفيديو تلقائيًا عند عرض عنصر وسائط من نوع فيديو.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'طبقة متراكبة بملء الشاشة لعرض الصور ومقاطع الفيديو بدقتها الكاملة. تدعم وضع العنصر الواحد ووضع المعرض مع التنقّل بين السابق والتالي، والتكبير والتحريك الاختياريين للصور، وعناصر التحكم الأصلية في الفيديو.',
    bestPractices: [
      {guidance: true, description: 'وفّر دائمًا نصًا بديلًا لكل صورة لإتاحة الوصول لقارئ الشاشة.'},
      {guidance: true, description: 'استخدم وضع المعرض مع onIndexChange لمجموعات الصور المتعددة.'},
      {guidance: true, description: 'فعّل hasZoom فقط عند عرض صور عالية الدقة تستفيد من الفحص عن قرب.'},
      {guidance: false, description: 'استخدام العارض لمحتوى غير الصور؛ فهو متخصص في الصور.'},
      {guidance: false, description: 'تضمين محتوى تفاعلي داخل التعليقات التوضيحية؛ أبقِها نصًا عاديًا.'},
    ],
    anatomy: [
      {name: 'طبقة العارض', required: true, description: 'طبقة متراكبة لمربع حوار تملأ منفذ العرض وتحتوي على الوسائط النشطة وعناصر التحكم.'},
      {name: 'الوسائط', required: true, description: 'الصورة أو الفيديو النشط المعروض داخل العارض.'},
      {name: 'زر الإغلاق', required: true, description: 'زر يُغلق العارض.'},
      {name: 'زر السابق', required: false, description: 'زر في المعرض ينتقل إلى عنصر الوسائط السابق.'},
      {name: 'زر التالي', required: false, description: 'زر في المعرض ينتقل إلى عنصر الوسائط التالي.'},
      {name: 'التعليق التوضيحي', required: false, description: 'تعليق توضيحي يوفّره المستدعي ويُعرض أسفل الوسائط النشطة.'},
      {name: 'العدّاد', required: false, description: 'الموضع الحالي والإجمالي، يُعرضان في وضع المعرض.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Fullscreen overlay for viewing images and videos at full resolution with gallery navigation and zoom.',
  usage: {
    anatomy,
    description:
      'A fullscreen overlay for viewing images and videos at full resolution. Supports single-item and gallery modes with prev/next navigation, optional zoom and pan for images, and native video controls.',
    bestPractices: [
      {guidance: true, description: 'Always provide alt text for every image.'},
      {
        guidance: true,
        description:
          'Use gallery mode with onIndexChange for multi-image sets.',
      },
      {
        guidance: true,
        description:
          'Enable hasZoom only when viewing high-resolution images that benefit from close inspection.',
      },
      {
        guidance: false,
        description: 'Use for non-image content; specialized for images.',
      },
      {
        guidance: false,
        description:
          'Nest interactive content inside captions; keep them plain text.',
      },
    ],
  },
  propDescriptions: {
    isOpen: 'Whether the lightbox is open.',
    onOpenChange: 'Callback when open state changes.',
    media: 'Single media object or array for gallery mode.',
    index: 'Current index in gallery mode.',
    onIndexChange: 'Callback when gallery index changes.',
    hasZoom:
      'Enable zoom (double-click, Enter/Space, or +/-) and pan (drag or arrow keys) for images.',
    className: 'Tailwind classes for layout customization.',
  },
};
