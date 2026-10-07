/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TabList',
  displayName: 'Tab List',
  group: 'Tabs',
  category: 'Navigation',
  keywords: ["tabs","tabbar","tabstrip","navigation","tabpanel","tabgroup","segmented","navtabs","tab"],
  playground: {
    defaults: {
      value: 'tab-1',
    },
  },
  theming: {
    targets: [
      {className: 'solo-tab-list', visualProps: ['size']},
      {className: 'solo-tab-strip'},
      {className: 'solo-tab-scroll-button'},
      {className: 'solo-tab', states: ['selected']},
      {className: 'solo-tab-indicator', states: ['selected']},
      {className: 'solo-tab-menu'},
      {className: 'solo-tab-menu-dropdown'},
      {className: 'solo-tab-menu-item'},
    ],
    vars: [
      {name: '--_tab-indicator-bottom', description: 'Vertical offset of the selected-tab indicator from the tab bottom edge. A host that draws its own bottom divider (Toolbar) sets this so the indicator sits on the divider instead of above it.', default: '-1px', private: true},
    ],
  },
  description: 'Tab strip that provides TabListContext (value, onChange, size) to Tab and TabMenu children; a nav landmark, or the WAI-ARIA tabs pattern where role="tablist" asks for it.',
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'The currently selected tab value.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback fired when a tab is selected.',
      required: true,
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size variant applied to all child tabs.',
      default: "'md'",
    },
    {
      name: 'layout',
      type: "'hug' | 'fill'",
      description: "Layout mode for tab sizing. 'hug': each tab hugs its content width. 'fill': tabs stretch equally to fill the container width.",
      default: "'hug'",
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description: 'Whether to show a bottom border divider under the tab list.',
      default: 'false',
    },
    {
      name: 'isFullBleed',
      type: 'boolean',
      description: "Makes the tab strip escape its parent's container padding, extending to the container's content edges (cancels the nearest padded Layout container's --container-padding-* custom properties with negative margins). The inner strip pads back by the portion of the container inset that is not already supplied by the first or last tab stop, keeping edge labels aligned while a hasDivider underline spans the full content width. Matches Divider's isFullBleed: inline (start/end) edges only; block-edge docking stays with the surrounding layout.",
      default: 'false',
    },
    {
      name: 'role',
      type: 'AriaRole',
      description: "ARIA role for the strip. 'tablist' asks for the WAI-ARIA tabs pattern: role=\"tablist\" / role=\"tab\" and aria-selected, with each tab pointing at the panel it controls via its panelId; only tabs may live in a tablist strip, and an href on a tab is ignored there. Left unset, the strip is a nav landmark marking the current tab with aria-current. Any other value is passed through to the element unchanged.",
    },
    {
      name: 'overflow',
      type: "'auto' | 'scroll' | 'visible'",
      description: "What happens when the tabs are wider than the strip. 'auto' lets the component choose, which today always scrolls. 'scroll' scrolls the tabs horizontally, with edge fades and arrow affordances for pointers that can hover. 'visible' turns overflow handling off and lets the tabs spill out of the strip. The selected tab is always scrolled back into view.",
      default: "'auto'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Tab and TabMenu items to render inside the strip.',
      slotElements: [
        {
          __element: 'Tab',
          props: {
            label: 'Tab',
            value: 'tab',
          },
        },
      ],
      required: true,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [
    {name: 'Tab'},
    {name: 'TabMenu'},
  ],
  usage: {
    accessibility: [
      {
        name: 'Tab label',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Rest', 'Hover', 'Pointer down', 'Selected'],
        description:
          'Each label must have at least 4.5:1 contrast with the tab surface behind it. For Hover and Pointer down, measure the final background after the overlay layer is applied.',
      },
    ],
    description:
      'TabList provides tab-style navigation for organizing content into categorized sections. Use it to let users switch between related views without leaving the page, with overflow items handled by a built-in "more" menu.',
    bestPractices: [
      { guidance: true, description: 'Keep tab labels short and descriptive so users can quickly scan available sections.' },
      { guidance: true, description: 'Leave overflow handling on: a strip narrower than its tabs scrolls, and the selected tab is kept in view. Use TabMenu when you want a curated group of extra options rather than a scrolling strip.' },
      { guidance: true, description: 'When using hasDivider with action buttons alongside tabs, match the Button size to the TabList size (both md, both sm); the divided tab strip reserves space so tabs and same-size buttons align to a shared baseline above the rail.' },
      { guidance: true, description: 'Reach for role="tablist" when the strip switches panels in place, and give each tab a panelId pointing at the panel it opens: that link is how a screen reader gets from a tab to its content. Leave it off for navigation between views.' },
      { guidance: true, description: 'Set isFullBleed to stretch a tab bar inside a padded LayoutHeader, Card, or Section to the container\'s inline content edges, instead of reaching for negative-margin CSS.' },
      { guidance: false, description: 'Use tabs for sequential steps or workflows; use a stepper or wizard pattern instead.' },
      { guidance: false, description: 'Place more than 6–8 visible tabs before the overflow menu; prioritize the most important categories.' },
      { guidance: false, description: 'Confuse TabList with SegmentedControl or ToggleButton. TabList is for navigation between views. SegmentedControl and ToggleButton are input controls: SegmentedControl always has exactly one selected option, while ToggleButton can be toggled on or off.' },
    ],
    anatomy: [
      {name: 'Left Content', required: false, description: 'Most important area; hugs content width.'},
      {name: 'Center-Fill Content', required: false, description: 'Stretches to fill available space.'},
      {name: 'Right Content', required: false, description: 'Hugs content width.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'TabList provides tab-style navigation for organizing content into categorized sections. Use it to let users switch between related views without leaving the page, with overflow items handled by a built-in "more" menu.',
    bestPractices: [
      { guidance: true, description: 'Keep tab labels short and descriptive so users can quickly scan available sections.' },
      { guidance: true, description: 'Leave overflow handling on: a strip narrower than its tabs scrolls, and the selected tab is kept in view. Use TabMenu when you want a curated group of extra options rather than a scrolling strip.' },
      { guidance: true, description: 'When using hasDivider with action buttons alongside tabs, match the Button size to the TabList size (both md, both sm); the divided tab strip reserves space so tabs and same-size buttons align to a shared baseline above the rail.' },
      { guidance: true, description: 'Reach for role="tablist" when the strip switches panels in place, and give each tab a panelId pointing at the panel it opens: that link is how a screen reader gets from a tab to its content. Leave it off for navigation between views.' },
      { guidance: true, description: 'Set isFullBleed to stretch a tab bar inside a padded LayoutHeader, Card, or Section to the container\'s inline content edges, instead of reaching for negative-margin CSS.' },
      { guidance: false, description: 'Use tabs for sequential steps or workflows; use a stepper or wizard pattern instead.' },
      { guidance: false, description: 'Place more than 6–8 visible tabs before the overflow menu; prioritize the most important categories.' },
      { guidance: false, description: 'Confuse TabList with SegmentedControl or ToggleButton. TabList is for navigation between views. SegmentedControl and ToggleButton are input controls: SegmentedControl always has exactly one selected option, while ToggleButton can be toggled on or off.' },
    ],
    anatomy: [
      {name: 'Left Content', required: false, description: 'Most important area; hugs content width.'},
      {name: 'Center-Fill Content', required: false, description: 'Stretches to fill available space.'},
      {name: 'Right Content', required: false, description: 'Hugs content width.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'شريط علامات تبويب يوفّر TabListContext (value و onChange و size) للعناصر الفرعية Tab و TabMenu؛ وهو مَعلَم nav، أو نمط علامات التبويب في WAI-ARIA عندما يُطلب ذلك عبر role="tablist".',
  propDescriptions: {
    value: 'قيمة علامة التبويب المحددة حاليًا.',
    onChange: 'دالة استدعاء تُنفَّذ عند تحديد علامة تبويب.',
    size: 'نمط الحجم المطبّق على جميع علامات التبويب الفرعية.',
    layout: 'وضع التخطيط لتحجيم علامات التبويب. \'hug\': كل علامة تبويب تلائم عرض محتواها. \'fill\': تتمدد علامات التبويب بالتساوي لملء عرض الحاوية.',
    hasDivider: 'ما إذا كان سيُعرض فاصل حدّ سفلي أسفل قائمة علامات التبويب.',
    isFullBleed: 'يجعل شريط علامات التبويب يتجاوز حشو حاوية العنصر الأب، ممتدًا إلى حواف محتوى الحاوية (يُلغي الخصائص المخصصة --container-padding-* لأقرب حاوية Layout ذات حشو باستخدام هوامش سالبة). يُعيد الشريط الداخلي الحشو بمقدار الجزء من إزاحة الحاوية الذي لا توفره أول أو آخر علامة تبويب، فتبقى تسميات الحواف محاذية بينما يمتد خط hasDivider السفلي على كامل عرض المحتوى. يطابق isFullBleed في Divider: الحواف المضمّنة (البداية/النهاية) فقط؛ ويبقى الالتصاق بالحواف الكتلية للتخطيط المحيط.',
    role: 'دور ARIA للشريط. تطلب \'tablist\' نمط علامات التبويب في WAI-ARIA: role="tablist" / role="tab" و aria-selected، مع إشارة كل علامة تبويب إلى اللوحة التي تتحكم بها عبر panelId الخاص بها؛ ولا يجوز أن يحتوي شريط tablist إلا على علامات تبويب، ويُتجاهل href على علامة التبويب هناك. إذا تُركت دون تعيين، يكون الشريط مَعلَم nav يحدد علامة التبويب الحالية بـ aria-current. أي قيمة أخرى تُمرَّر إلى العنصر دون تغيير.',
    overflow: 'ما يحدث عندما تكون علامات التبويب أعرض من الشريط. تترك \'auto\' الاختيار للمكوّن، وهو حاليًا التمرير دائمًا. وتمرّر \'scroll\' علامات التبويب أفقيًا، مع تلاشٍ عند الحواف ومؤشرات أسهم للمؤشرات القادرة على التمرير فوق العناصر. وتُوقف \'visible\' معالجة الفيض وتترك علامات التبويب تتجاوز الشريط. تُعاد علامة التبويب المحددة دائمًا إلى نطاق العرض بالتمرير.',
    children: 'عناصر Tab و TabMenu المعروضة داخل الشريط.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث يتجاوز أي صنف متعارض القيمة الافتراضية.',
  },
  usage: {
    description: 'يوفّر TabList تنقّلًا بأسلوب علامات التبويب لتنظيم المحتوى في أقسام مصنّفة. استخدمه لتمكين المستخدمين من التبديل بين عروض مترابطة دون مغادرة الصفحة، مع معالجة العناصر الفائضة عبر قائمة "more" مدمجة.',
    bestPractices: [
      {
        guidance: true,
        description: 'اجعل تسميات علامات التبويب قصيرة ووصفية حتى يتمكن المستخدمون من استعراض الأقسام المتاحة بسرعة.',
      },
      {
        guidance: true,
        description: 'أبقِ معالجة الفيض مفعّلة: يُمرَّر الشريط الأضيق من علامات تبويبه، وتبقى علامة التبويب المحددة ظاهرة. استخدم TabMenu عندما تريد مجموعة منتقاة من الخيارات الإضافية بدلًا من شريط قابل للتمرير.',
      },
      {
        guidance: true,
        description: 'عند استخدام hasDivider مع أزرار إجراءات بجانب علامات التبويب، طابق حجم Button مع حجم TabList (كلاهما md، أو كلاهما sm)؛ إذ يحجز شريط علامات التبويب المفصول مساحة بحيث تصطف علامات التبويب والأزرار ذات الحجم نفسه على خط أساس مشترك فوق السكة.',
      },
      {
        guidance: true,
        description: 'استخدم role="tablist" عندما يبدّل الشريط اللوحات في مكانها، وامنح كل علامة تبويب panelId يشير إلى اللوحة التي تفتحها: فهذا الربط هو ما يُمكّن قارئ الشاشة من الانتقال من علامة التبويب إلى محتواها. واتركه دون تعيين للتنقّل بين العروض.',
      },
      {
        guidance: true,
        description: 'عيّن isFullBleed لمدّ شريط علامات التبويب داخل LayoutHeader أو Card أو Section ذات حشو إلى حواف المحتوى المضمّنة للحاوية، بدلًا من اللجوء إلى CSS بهوامش سالبة.',
      },
      {
        guidance: false,
        description: 'استخدام علامات التبويب للخطوات المتسلسلة أو مسارات العمل؛ استخدم نمط المراحل أو المعالج بدلًا من ذلك.',
      },
      {
        guidance: false,
        description: 'وضع أكثر من 6–8 علامات تبويب مرئية قبل قائمة الفائض؛ امنح الأولوية للفئات الأهم.',
      },
      {
        guidance: false,
        description: 'الخلط بين TabList و SegmentedControl أو ToggleButton. فـ TabList مخصص للتنقّل بين العروض. أما SegmentedControl و ToggleButton فهما عنصرا إدخال: يحتوي SegmentedControl دائمًا على خيار واحد محدد بالضبط، بينما يمكن تشغيل ToggleButton أو إيقافه.',
      },
    ],
    anatomy: [
      {
        name: 'المحتوى الأيسر',
        required: false,
        description: 'المنطقة الأهم؛ تلائم عرض المحتوى.',
      },
      {
        name: 'المحتوى الأوسط المالئ',
        required: false,
        description: 'يتمدد لملء المساحة المتاحة.',
      },
      {
        name: 'المحتوى الأيمن',
        required: false,
        description: 'يلائم عرض المحتوى.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Tab strip w/ overflow scrolling; nav landmark by default, WAI-ARIA tabs pattern under role="tablist".',
  usage: {
    description:
      'TabList provides tab-style navigation for organizing content into categorized sections. Use it to let users switch between related views without leaving the page, with overflow items handled by a built-in "more" menu.',
    bestPractices: [
      { guidance: true, description: 'Keep tab labels short and descriptive so users can quickly scan available sections.' },
      { guidance: true, description: 'Leave overflow handling on: a strip narrower than its tabs scrolls, and the selected tab is kept in view. Use TabMenu when you want a curated group of extra options rather than a scrolling strip.' },
      { guidance: true, description: 'When using hasDivider with action buttons alongside tabs, match the Button size to the TabList size (both md, both sm); the divided tab strip reserves space so tabs and same-size buttons align to a shared baseline above the rail.' },
      { guidance: true, description: 'Reach for role="tablist" when the strip switches panels in place, and give each tab a panelId pointing at the panel it opens: that link is how a screen reader gets from a tab to its content. Leave it off for navigation between views.' },
      { guidance: true, description: 'Set isFullBleed to stretch a tab bar inside a padded LayoutHeader, Card, or Section to the container\'s inline content edges, instead of reaching for negative-margin CSS.' },
      { guidance: false, description: 'Use tabs for sequential steps or workflows; use a stepper or wizard pattern instead.' },
      { guidance: false, description: 'Place more than 6–8 visible tabs before the overflow menu; prioritize the most important categories.' },
      { guidance: false, description: 'Confuse TabList with SegmentedControl or ToggleButton. TabList is for navigation between views. SegmentedControl and ToggleButton are input controls: SegmentedControl always has exactly one selected option, while ToggleButton can be toggled on or off.' },
    ],
    anatomy: [
      {name: 'Left Content', required: false, description: 'Most important area; hugs content width.'},
      {name: 'Center-Fill Content', required: false, description: 'Stretches to fill available space.'},
      {name: 'Right Content', required: false, description: 'Hugs content width.'},
    ],
  },
};
