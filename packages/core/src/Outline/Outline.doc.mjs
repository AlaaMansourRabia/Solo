/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Outline',
    required: true,
    description:
      'Navigation container for the same-page heading links and indicator.',
  },
  {
    name: 'Heading link',
    required: true,
    description:
      'Anchor for one heading, indented by level and marked when active.',
  },
  {
    name: 'Label',
    required: true,
    description: 'Heading text displayed inside its heading link.',
  },
  {
    name: 'Indicator track',
    required: true,
    description: 'Painted vertical rule behind the active indicator.',
  },
  {
    name: 'Active indicator',
    required: true,
    description:
      'Sliding bar positioned beside the currently active heading link.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Outline',
  displayName: 'Outline',
  group: 'Outline',
  category: 'Navigation',
  keywords: [
    'outline',
    'table of contents',
    'toc',
    'heading navigation',
    'scroll spy',
    'documentation',
    'anchors',
    'sliding indicator',
  ],
  playground: {
    defaults: {
      items: [
        {id: 'overview', label: 'Overview', level: 2},
        {id: 'installation', label: 'Installation', level: 2},
        {id: 'configuration', label: 'Configuration', level: 3},
        {id: 'api-reference', label: 'API reference', level: 2},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'solo-outline', visualProps: ['density']},
      {className: 'solo-outline-indicator'},
      {className: 'solo-outline-item', visualProps: ['level'], states: ['active']},
    ],
  },
  components: [
    {
      name: 'Outline',
      displayName: 'Outline',
      description:
        'Document outline navigation with sliding indicator track. Renders a flat heading list as anchor links with a density variant and scroll-spy active state when uncontrolled.',
      props: [
        {
          name: 'items',
          type: 'OutlineItem[]',
          description:
            'Ordered heading items. Each item has id, label, and level (1-6). The id should match the target heading element id.',
          required: true,
        },
        {
          name: 'activeId',
          type: 'string',
          description:
            'Currently active heading id. Providing this prop makes active state controlled and disables built-in scroll-spy.',
        },
        {
          name: 'onActiveIdChange',
          type: '(id: string) => void',
          description:
            'Called when the active item changes from built-in scroll-spy or from an outline link click.',
        },
        {
          name: 'label',
          type: 'string',
          description: 'Accessible label for the nav landmark.',
          default: "'Table of contents'",
        },
        {
          name: 'density',
          type: "'default' | 'compact'",
          description: "Density variant controlling item padding. 'compact' for dense UIs, 'default' for standard spacing.",
          default: "'default'",
        },
        {
          name: 'onNavigateStart',
          type: '(id: string) => void',
          description:
            'Called with the item id when navigation begins, before the scroll starts. Pair with onNavigateEnd to drive an arrival effect (flash, ring, pulse) on the target heading.',
        },
        {
          name: 'onNavigateEnd',
          type: '(id: string) => void',
          description:
            'Called with the item id once the navigation resolves - when the smooth scroll settles, or when reduced motion turns it into an instant jump. Fires exactly once per onNavigateStart, including when the user interrupts the scroll, so a "navigating" state can never leak.',
        },
        {
          name: 'offset',
          type: 'number',
          description:
            "Height in px of a fixed header overlaying the top of the scroll root. Shifts both the activation line and the scroll landing by the same amount, so a heading activates exactly where navigating to it puts it - below the header, not underneath it. Composes with each heading's own scroll-margin-top (the header, then the breathing room below it); it does not replace it. Leave at 0 when nothing overlays the content and let scroll-margin-top do the work.",
          default: '0',
        },
        {
          name: 'scrollContainerRef',
          type: 'React.RefObject<HTMLElement | null>',
          description:
            'Scroll container to track, instead of auto-detecting the nearest scrollable ancestor. Use it when content scrolls inside a split pane, modal, or dashboard panel rather than the viewport.',
        },
        {
          name: 'hasScrollOnClick',
          type: 'boolean',
          description:
            'Whether activating an item smooth-scrolls to it. Set to false to own the scrolling yourself (virtualized content, a router): the Outline still updates the active item, the hash, and the navigate callbacks, but performs no scroll.',
          default: 'true',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
        },
      ],
      examples: [
        {
          label: 'Basic',
          code: `
import {Outline} from '@solo/core/Outline';

const items = [
  {id: 'overview', label: 'Overview', level: 2},
  {id: 'installation', label: 'Installation', level: 2},
  {id: 'theming', label: 'Theming', level: 2},
  {id: 'tokens', label: 'Tokens', level: 3},
  {id: 'accessibility', label: 'Accessibility', level: 2},
];

// Uncontrolled: built-in scroll-spy tracks the topmost visible heading.
<Outline items={items} />;
`,
        },
        {
          label: 'Compact (density="compact")',
          code: `
import {Outline} from '@solo/core/Outline';

// Dense sidebars use the compact variant; the sliding indicator
// automatically matches the shorter item height.
<Outline items={items} density="compact" />;
`,
        },
        {
          label: 'Controlled active section',
          code: `
import {useState} from 'react';
import {Outline} from '@solo/core/Outline';

function ControlledOutline() {
  const [activeId, setActiveId] = useState('overview');

  // Providing activeId disables built-in scroll-spy; you own the active state.
  return (
    <Outline
      items={items}
      activeId={activeId}
      onActiveIdChange={setActiveId}
    />
  );
}
`,
        },
        {
          label: 'Generate items from markdown',
          code: `
import {Markdown} from '@solo/core/Markdown';
import {createMarkdownHeadingLinks} from '@solo/core/Markdown/plugins';
import {Outline, useOutlineFromMarkdown} from '@solo/core/Outline';

const markdownRootId = 'guide';
const plugins = [
  createMarkdownHeadingLinks({headingIdPrefix: markdownRootId}),
];

function MarkdownOutline({markdown, isStreaming}) {
  // Pass the same plugin entry and finality to Markdown and Outline. Nested
  // headings consume the shared depth-first sequence, while Outline continues
  // to return root headings only.
  const items = useOutlineFromMarkdown(markdown, {
    plugins,
    isFinal: !isStreaming,
  });
  return (
    <>
      <Markdown id={markdownRootId} plugins={plugins}>{markdown}</Markdown>
      <Outline items={items} />
    </>
  );
}
`,
        },
        {
          label: 'Scoped scroll container (split pane, modal, panel)',
          code: `
import {useRef} from 'react';
import {Outline} from '@solo/core/Outline';

function PanelDocs() {
  const scrollContainerRef = useRef(null);

  // Without scrollContainerRef the outline auto-detects the nearest scrollable
  // ancestor, which is the viewport here - so the highlight would never move.
  return (
    <div style={{display: 'flex'}}>
      <div ref={scrollContainerRef} style={{overflowY: 'auto', height: 480}}>
        <h2 id="overview">Overview</h2>
        {/* ...content... */}
      </div>
      <Outline items={items} scrollContainerRef={scrollContainerRef} offset={64} />
    </div>
  );
}
`,
        },
        {
          label: 'Navigate callbacks (flash the heading on arrival)',
          code: `
import {useState} from 'react';
import {Outline} from '@solo/core/Outline';

function FlashOnArrival() {
  const [flashId, setFlashId] = useState(null);

  // onNavigateEnd fires once the smooth scroll settles - and once per
  // onNavigateStart even if the user scrolls away mid-jump, so this never
  // gets stuck.
  return (
    <Outline
      items={items}
      onNavigateStart={() => setFlashId(null)}
      onNavigateEnd={id => setFlashId(id)}
    />
  );
}
`,
        },
      ],
    },
  ],
  usage: {
    anatomy,
    description:
      'A table-of-contents sidebar for documentation pages, help centers, wikis, and long settings pages. Use it for navigation within a single page, not for app routes. Features a sliding indicator track that animates to the active heading. The list is a single tab stop: arrow keys move between headings, Home/End jump to the ends, and Enter/Space activate.',
    bestPractices: [
      {guidance: true, description: 'Pass a flat ordered list of headings and let level control indentation.'},
      {guidance: true, description: 'Use activeId when custom scroll logic owns the active section.'},
      {guidance: true, description: 'Use density="compact" in dense sidebars where vertical space is tight.'},
      {guidance: true, description: 'Use useOutlineFromMarkdown or useOutlineFromDOM when headings are generated from content. For linkable Markdown headings, pass the same createMarkdownHeadingLinks() entry to Markdown and Outline; configure headingIdPrefix on that plugin for multiple roots.'},
      {guidance: true, description: 'Pass scrollContainerRef when the content scrolls in a split pane, modal, or panel instead of the viewport.'},
      {guidance: true, description: 'Set offset to the height of a fixed header that overlays the content, so headings land below it instead of underneath it.'},
      {guidance: false, description: 'Use Outline for application navigation - use SideNav or TopNav for routes.'},
      {guidance: false, description: 'Use Outline for expandable hierarchy - use TreeList when nodes need expand and collapse.'},
      {guidance: false, description: 'Rely on onNavigateEnd to mean "arrived" - it also fires when the user interrupts the scroll.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Outline',
  displayName: 'Outline',
  group: 'Outline',
  theming: {
    targets: [
      {className: 'solo-outline', visualProps: ['density']},
      {className: 'solo-outline-indicator'},
      {className: 'solo-outline-item', visualProps: ['level'], states: ['active']},
    ],
  },
  components: [
    {
      name: 'Outline',
      displayName: 'Outline',
      description:
        '文档大纲导航，带有滑动指示器轨道。将扁平标题列表渲染为锚点链接，支持密度变体和非受控模式下的滚动监听。',
      props: [
        {
          name: 'items',
          type: 'OutlineItem[]',
          description:
            '有序标题项。每项包含 id、label 和 level (1-6)。id 应匹配目标标题元素的 id。',
          required: true,
        },
        {
          name: 'activeId',
          type: 'string',
          description:
            '当前激活的标题 id。提供后组件进入受控模式，并禁用内置滚动监听。',
        },
        {
          name: 'onActiveIdChange',
          type: '(id: string) => void',
          description: '当内置滚动监听或点击大纲链接改变激活项时调用。',
        },
        {
          name: 'label',
          type: 'string',
          description: 'nav 地标的无障碍标签。',
          default: "'Table of contents'",
        },
        {
          name: 'density',
          type: "'default' | 'compact'",
          description: "控制项目内边距的密度变体。'compact' 用于紧凑界面，'default' 为标准间距。",
          default: "'default'",
        },
        {
          name: 'onNavigateStart',
          type: '(id: string) => void',
          description: '导航开始时（滚动前）调用，传入项目 id。与 onNavigateEnd 搭配可在目标标题上实现到达效果（闪烁、描边、脉冲）。',
        },
        {
          name: 'onNavigateEnd',
          type: '(id: string) => void',
          description: '导航结束时调用（平滑滚动停止，或减弱动效将其变为瞬时跳转）。每次 onNavigateStart 必定对应一次调用，包括用户中途手动滚动打断的情况，因此“导航中”状态不会泄漏。',
        },
        {
          name: 'offset',
          type: 'number',
          description: '覆盖滚动根顶部的固定顶栏高度（px）。同时位移激活线与滚动落点，因此标题被激活的位置正是点击后停留的位置——落在顶栏下方，而非被顶栏遮住。它与每个标题自身的 scroll-margin-top 叠加（先顶栏，再留白），而非取代它。若没有元素覆盖内容，保持 0，交给 scroll-margin-top 处理。',
          default: '0',
        },
        {
          name: 'scrollContainerRef',
          type: 'React.RefObject<HTMLElement | null>',
          description: '要跟踪的滚动容器，替代自动探测最近的可滚动祖先。当内容在分栏、弹窗或面板中滚动而非视口时使用。',
        },
        {
          name: 'hasScrollOnClick',
          type: 'boolean',
          description: '激活项目时是否平滑滚动。设为 false 可自行接管滚动（虚拟列表、路由）：Outline 仍会更新激活项、hash 和导航回调，但不执行滚动。',
          default: 'true',
        },
        {
          name: 'className',
          type: 'string',
          description: '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
        },
      ],
    },
  ],
  usage: {
    anatomy,
    description:
      'A table-of-contents sidebar for documentation pages, help centers, wikis, and long settings pages. Use it for navigation within a single page, not for app routes.',
    bestPractices: [
      {guidance: true, description: 'Pass a flat ordered list of headings and let level control indentation.'},
      {guidance: true, description: 'Use activeId when custom scroll logic owns the active section.'},
      {guidance: true, description: 'Use density="compact" in dense sidebars where vertical space is tight.'},
      {guidance: true, description: 'Use useOutlineFromMarkdown or useOutlineFromDOM when headings are generated from content. For linkable Markdown headings, pass the same createMarkdownHeadingLinks() entry to Markdown and Outline; configure headingIdPrefix on that plugin for multiple roots.'},
      {guidance: false, description: 'Use Outline for application navigation - use SideNav or TopNav for routes.'},
      {guidance: false, description: 'Use Outline for expandable hierarchy - use TreeList when nodes need expand and collapse.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'شريط جانبي لجدول المحتويات يُستخدم للتنقّل داخل صفحة واحدة، مع مسار مؤشر منزلق يتحرك إلى العنوان النشط.',
  components: [
    {
      name: 'Outline',
      displayName: 'المخطط التفصيلي',
      description:
        'تنقّل في المخطط التفصيلي للمستند مع مسار مؤشر منزلق. يعرض قائمة مسطّحة من العناوين على شكل روابط مرجعية مع نمط للكثافة، وحالة نشطة تعتمد على تتبّع التمرير عندما يكون غير متحكَّم به.',
      propDescriptions: {
        items:
          'عناصر العناوين المرتبة. يحتوي كل عنصر على id وlabel وlevel ‏(1-6). يجب أن يطابق id معرّف عنصر العنوان المستهدف.',
        activeId:
          'معرّف العنوان النشط حاليًا. توفير هذه الخاصية يجعل الحالة النشطة متحكَّمًا بها ويعطّل تتبّع التمرير المدمج.',
        onActiveIdChange:
          'يُستدعى عند تغيّر العنصر النشط بسبب تتبّع التمرير المدمج أو النقر على رابط في المخطط التفصيلي.',
        label: 'التسمية القابلة للوصول لمَعلم nav.',
        density: 'نمط الكثافة الذي يتحكم في حشوة العناصر. \'compact\' للواجهات الكثيفة، و\'default\' للتباعد القياسي.',
        onNavigateStart:
          'يُستدعى بمعرّف العنصر عند بدء التنقّل، قبل بدء التمرير. اقرنه بـ onNavigateEnd لتشغيل تأثير وصول (وميض، أو حلقة، أو نبض) على العنوان المستهدف.',
        onNavigateEnd:
          'يُستدعى بمعرّف العنصر بمجرد اكتمال التنقّل - عند استقرار التمرير السلس، أو عندما تحوّله الحركة المخفّضة إلى قفزة فورية. يُنفَّذ مرة واحدة بالضبط لكل onNavigateStart، بما في ذلك عندما يقاطع المستخدم التمرير، فلا يمكن أن تبقى حالة "التنقّل" عالقة.',
        offset:
          'ارتفاع رأس ثابت بوحدة px يغطي أعلى جذر التمرير. يزيح خط التفعيل وموضع هبوط التمرير بالمقدار نفسه، فيُفعَّل العنوان تمامًا حيث يضعه التنقّل إليه - أسفل الرأس لا تحته. يتكامل مع scroll-margin-top الخاص بكل عنوان (الرأس، ثم المسافة الفاصلة أسفله)؛ ولا يحل محله. اتركه على 0 عندما لا يغطي شيء المحتوى، ودع scroll-margin-top يقوم بالمهمة.',
        scrollContainerRef:
          'حاوية التمرير المراد تتبّعها، بدلًا من الاكتشاف التلقائي لأقرب سلف قابل للتمرير. استخدمها عندما يتم تمرير المحتوى داخل لوحة مقسّمة، أو نافذة مشروطة، أو لوحة في لوحة معلومات بدلًا من منفذ العرض.',
        hasScrollOnClick:
          'ما إذا كان تفعيل عنصر يمرّر إليه بسلاسة. اضبطه على false لتتولى التمرير بنفسك (محتوى افتراضي، أو موجّه): يظل Outline يحدّث العنصر النشط، والـ hash، ودوال استدعاء التنقّل، لكنه لا يجري أي تمرير.',
        className:
          'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
      },
    },
  ],
  usage: {
    description:
      'شريط جانبي لجدول المحتويات لصفحات التوثيق، ومراكز المساعدة، والويكي، وصفحات الإعدادات الطويلة. استخدمه للتنقّل داخل صفحة واحدة، لا لمسارات التطبيق. يتميز بمسار مؤشر منزلق يتحرك بحركة متحركة إلى العنوان النشط. القائمة نقطة توقف واحدة لـ Tab: تنقل مفاتيح الأسهم بين العناوين، وتقفز Home/End إلى الطرفين، وتفعّل Enter/Space العنصر.',
    bestPractices: [
      {guidance: true, description: 'مرّر قائمة مسطّحة مرتبة من العناوين ودع level يتحكم في المسافة البادئة.'},
      {guidance: true, description: 'استخدم activeId عندما يتولى منطق تمرير مخصص تحديد القسم النشط.'},
      {guidance: true, description: 'استخدم density="compact" في الأشرطة الجانبية الكثيفة حيث تكون المساحة العمودية محدودة.'},
      {guidance: true, description: 'استخدم useOutlineFromMarkdown أو useOutlineFromDOM عندما تُولَّد العناوين من المحتوى. لعناوين Markdown القابلة للربط، مرّر مُدخل createMarkdownHeadingLinks() نفسه إلى Markdown وOutline؛ واضبط headingIdPrefix على ذلك المكوّن الإضافي عند وجود جذور متعددة.'},
      {guidance: true, description: 'مرّر scrollContainerRef عندما يتم تمرير المحتوى في لوحة مقسّمة أو نافذة مشروطة أو لوحة بدلًا من منفذ العرض.'},
      {guidance: true, description: 'اضبط offset على ارتفاع الرأس الثابت الذي يغطي المحتوى، لتهبط العناوين أسفله بدلًا من تحته.'},
      {guidance: false, description: 'لا تستخدم Outline للتنقّل في التطبيق - استخدم SideNav أو TopNav للمسارات.'},
      {guidance: false, description: 'لا تستخدم Outline للتسلسل الهرمي القابل للتوسيع - استخدم TreeList عندما تحتاج العُقد إلى التوسيع والطي.'},
      {guidance: false, description: 'لا تعتمد على onNavigateEnd بمعنى "الوصول" - فهو يُنفَّذ أيضًا عندما يقاطع المستخدم التمرير.'},
    ],
    anatomy: [
      {name: 'المخطط التفصيلي', required: true, description: 'حاوية التنقّل لروابط العناوين في الصفحة نفسها والمؤشر.'},
      {name: 'رابط العنوان', required: true, description: 'رابط مرجعي لعنوان واحد، بمسافة بادئة حسب المستوى ومميَّز عندما يكون نشطًا.'},
      {name: 'التسمية', required: true, description: 'نص العنوان المعروض داخل رابط العنوان الخاص به.'},
      {name: 'مسار المؤشر', required: true, description: 'خط عمودي مرسوم خلف المؤشر النشط.'},
      {name: 'المؤشر النشط', required: true, description: 'شريط منزلق يتموضع بجوار رابط العنوان النشط حاليًا.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Document outline/table-of-contents nav with sliding indicator track. Flat items array {id,label,level}; anchor links; density variant (default/compact); uncontrolled scroll-spy by scroll position (last heading past its resting line = offset + its own scroll-margin-top; first item at top, last at bottom); controlled with activeId; smooth-scroll on click that pins the active item until the next manual scroll. Single tab stop (roving tabindex): Arrow keys move, Home/End jump, Enter/Space activate. onNavigateStart/onNavigateEnd fire around the scroll. Scroll scoping via offset / scrollContainerRef / hasScrollOnClick.',
  usage: {
    anatomy,
    description:
      'A table-of-contents sidebar for documentation pages, help centers, wikis, and long settings pages. Use it for navigation within a single page, not for app routes.',
    bestPractices: [
      {guidance: true, description: 'Pass a flat ordered list of headings and let level control indentation.'},
      {guidance: true, description: 'Use activeId when custom scroll logic owns the active section.'},
      {guidance: true, description: 'Use density="compact" in dense sidebars where vertical space is tight.'},
      {guidance: true, description: 'Use useOutlineFromMarkdown or useOutlineFromDOM when headings are generated from content. For linkable Markdown headings, pass the same createMarkdownHeadingLinks() entry to Markdown and Outline; configure headingIdPrefix on that plugin for multiple roots.'},
      {guidance: true, description: 'Pass scrollContainerRef when the content scrolls in a split pane, modal, or panel instead of the viewport.'},
      {guidance: true, description: 'Set offset to the height of a fixed header that overlays the content, so headings land below it instead of underneath it.'},
      {guidance: false, description: 'Use Outline for application navigation - use SideNav or TopNav for routes.'},
      {guidance: false, description: 'Use Outline for expandable hierarchy - use TreeList when nodes need expand and collapse.'},
      {guidance: false, description: 'Rely on onNavigateEnd to mean "arrived" - it also fires when the user interrupts the scroll.'},
    ],
  },
  propDescriptions: {
    items: 'Ordered OutlineItem[]: {id,label,level}. id should match target heading DOM id.',
    activeId: 'Controlled active heading id. Disables built-in scroll-spy.',
    onActiveIdChange: 'Called when active id changes from scroll-spy or click.',
    label: "Accessible nav label. Default: 'Table of contents'.",
    density: "Density variant: 'default' (standard) or 'compact'. Default: 'default'.",
    onNavigateStart: 'Called with the id when navigation begins, before the scroll.',
    onNavigateEnd: 'Called with the id once the scroll settles. Fires exactly once per onNavigateStart, including on user interruption.',
    offset: 'Height in px of a fixed header overlaying the scroll root. Shifts BOTH the activation line and the scroll landing, so a heading activates where navigating to it lands it. Composes with (does not replace) each heading scroll-margin-top. Default: 0.',
    scrollContainerRef: 'RefObject of the scroll container to track, instead of the nearest scrollable ancestor. For split panes, modals, panels.',
    hasScrollOnClick: 'Whether activating an item smooth-scrolls to it. false = you own scrolling; active id, hash and callbacks still update. Default: true.',
    className: 'Tailwind classes for layout; merged via cn(), so conflicting utilities override defaults.',
  },
  components: [
    {
      name: 'Outline',
      displayName: 'Outline',
      description:
        'Document outline nav with sliding indicator. Renders heading anchors with a density variant, roving-tabindex keyboard nav, navigate callbacks, and scroll-spy active state when uncontrolled.',
      propDescriptions: {
        items: 'Ordered OutlineItem[]: {id,label,level}. id should match target heading DOM id.',
        activeId: 'Controlled active heading id. Disables built-in scroll-spy.',
        onActiveIdChange: 'Called when active id changes from scroll-spy or click.',
        label: "Accessible nav label. Default: 'Table of contents'.",
        density: "Density variant: 'default' | 'compact'. Default: 'default'.",
        onNavigateStart: 'Called with the id when navigation begins, before the scroll.',
        onNavigateEnd: 'Called with the id once the scroll settles. Fires exactly once per onNavigateStart, including on user interruption.',
        offset: 'Height in px of a fixed header overlaying the scroll root. Shifts both the activation line and the scroll landing. Composes with scroll-margin-top. Default: 0.',
        scrollContainerRef: 'RefObject of the scroll container to track, instead of the nearest scrollable ancestor.',
        hasScrollOnClick: 'Whether activating an item smooth-scrolls to it. Default: true.',
        className: 'Tailwind classes for layout; merged via cn(), so conflicting utilities override defaults.',
      },
    },
  ],
};
