/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Tab',
  subComponentOf: 'TabList',
  displayName: 'Tab',
  isHiddenFromOverview: true,
  description:
    'Individual tab item that renders as a button or an anchor link, with selected-state styling and optional icons.',
  // Tab requires TabList context; wrap it so the preview doesn't throw.
  playground: {
    defaults: {value: 'tab-1', label: 'Tab'},
    wrapper: {component: 'TabList', props: {value: 'tab-1'}},
  },
  props: [
    {
      name: 'value',
      type: 'string',
      description:
        'Unique value for this tab, matched against TabListContext.value.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for this tab. Used as visible text by default, or as aria-label when isLabelHidden is true.',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Whether the label is visually hidden. When true, only the icon and endContent are displayed, and label is used as aria-label for accessibility.',
      default: 'false',
    },
    {
      name: 'href',
      type: 'string',
      description:
        'URL to navigate to; when provided, the tab renders as an anchor element. Ignored in a TabList given an explicit role="tablist".',
    },
    {
      name: 'panelId',
      type: 'string',
      description:
        'Id of the panel this tab controls, wired up as aria-controls where the TabList speaks the tabs pattern. Put the same id on the panel element. No effect under the navigation pattern, and a development warning says so.',
    },
    {
      name: 'as',
      type: 'LinkComponentType',
      description:
        'Custom component to render instead of <a> for link tabs. Overrides the LinkProvider default. Only applies when href is provided.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon element shown when the tab is not selected.',
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
      name: 'selectedIcon',
      type: 'ReactNode',
      description:
        'Icon element shown when the tab is selected; falls back to icon if not provided.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'checkCircle',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content rendered after the label, such as a badge count or status dot.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'chevronDown',
            size: 'sm',
          },
        },
        {
          __element: 'Badge',
          props: {
            label: '3',
          },
        },
      ],
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
};

export const docsZh = {
  name: 'Tab',
  isHiddenFromOverview: true,
  displayName: 'Tab',
  description: '单个标签项，渲染为按钮或锚点链接，具有选中状态样式和可选图标。',
  props: [
    {
      name: 'value',
      type: 'string',
      description: '此标签的唯一值，与 TabListContext.value 进行匹配。',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        '此标签的无障碍标签。默认作为可见文本使用；当 isLabelHidden 为 true 时用作 aria-label。',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        '是否在视觉上隐藏标签。为 true 时，仅显示图标和 endContent，并将 label 用作无障碍 aria-label。',
      default: 'false',
    },
    {
      name: 'href',
      type: 'string',
      description: '要导航到的 URL；提供时，标签渲染为锚点元素。',
    },
    {
      name: 'panelId',
      type: 'string',
      description:
        'Id of the panel this tab controls, wired up as aria-controls where the TabList speaks the tabs pattern. Put the same id on the panel element. No effect under the navigation pattern, and a development warning says so.',
    },
    {
      name: 'as',
      type: 'LinkComponentType',
      description:
        '用于替代 <a> 渲染链接标签的自定义组件。覆盖 LinkProvider 的默认值。仅在提供 href 时生效。',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: '标签未选中时显示的图标元素。',
    },
    {
      name: 'selectedIcon',
      type: 'ReactNode',
      description: '标签选中时显示的图标元素；未提供时回退到 icon。',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: '在标签文本之后渲染的内容，例如徽章计数或状态点。',
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'عنصر علامة تبويب فردي يُعرض كزر أو كرابط، مع تنسيق لحالة التحديد وأيقونات اختيارية.',
  propDescriptions: {
    value: 'قيمة فريدة لعلامة التبويب هذه، تُطابَق مع TabListContext.value.',
    label:
      'التسمية القابلة للوصول لعلامة التبويب هذه. تُستخدم نصًا مرئيًا افتراضيًا، أو بوصفها aria-label عندما تكون isLabelHidden تساوي true.',
    isLabelHidden:
      'ما إذا كانت التسمية مخفية بصريًا. عندما تكون true تُعرض الأيقونة وendContent فقط، وتُستخدم label بوصفها aria-label لأغراض إمكانية الوصول.',
    href:
      'عنوان URL للانتقال إليه؛ عند توفيره تُعرض علامة التبويب كعنصر رابط. يُتجاهل في TabList المُعطى role="tablist" صريحًا.',
    panelId:
      'معرّف اللوحة التي تتحكم فيها علامة التبويب هذه، ويُربط بوصفه aria-controls حيث يتبع TabList نمط علامات التبويب. ضع المعرّف نفسه على عنصر اللوحة. لا أثر له في نمط التنقّل، ويُنبّه بذلك تحذير في وضع التطوير.',
    as:
      'مكوّن مخصّص يُعرض بدلًا من <a> لعلامات التبويب الرابطة. يتجاوز القيمة الافتراضية من LinkProvider. ينطبق فقط عند توفير href.',
    icon: 'عنصر أيقونة يظهر عندما لا تكون علامة التبويب محدّدة.',
    selectedIcon:
      'عنصر أيقونة يظهر عندما تكون علامة التبويب محدّدة؛ ويُستخدم icon بديلًا عند عدم توفيره.',
    endContent: 'محتوى يُعرض بعد التسمية، مثل عدد في شارة أو نقطة حالة.',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'Tab',
  isHiddenFromOverview: true,
  displayName: 'Tab',
  description:
    'Individual tab; renders as button or anchor w/ selected-state styling + optional icons.',
  propDescriptions: {
    value: 'Unique value matched against TabListContext.value.',
    label:
      'Accessible label; visible by default, aria-label when isLabelHidden.',
    isLabelHidden:
      'Visually hide label for icon-only tabs; label becomes aria-label.',
    href: 'URL; renders as <a> when provided.',
    as: 'Custom link component overriding LinkProvider; only w/ href.',
    icon: 'Icon shown when not selected.',
    selectedIcon: 'Icon shown when selected; falls back to icon.',
    endContent: 'Content after the label (badge, status dot, etc.).',
    className:
      'Tailwind classes (a string, not an inline style object) for layout customization; merged via cn(), so conflicting utilities override defaults.',
  },
};
