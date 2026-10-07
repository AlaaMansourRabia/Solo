/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Link',
  displayName: 'Link',
  category: 'Action',
  keywords: ["link","anchor","href","hyperlink","navigation","url","external","textlink"],
  playground: {
    defaults: {
      href: '#',
      children: 'Learn more',
    },
  },
  theming: {
    targets: [
      {className: 'solo-link', visualProps: ['color']},
    ],
  },
  components: [
    {
      name: 'Link',
      displayName: 'Link',
      description:
        'Styled anchor link with variants, external link support, and polymorphic rendering.',
      props: [
        {
          name: 'as',
          type: 'LinkComponentType',
          description: 'Custom component to render instead of <a>',
        },
        {
          name: 'label',
          type: 'string',
          description: 'Accessible label (aria-label). Only use when children are not self-descriptive (e.g. icon-only links). Omit for text links; the link text is the accessible name.',
        },
        {
          name: 'href',
          type: 'string',
          description:
            'Link destination URL. Solo-owned links and clickable surfaces block javascript:, vbscript:, and data:text/html after control-character removal, outer-whitespace trimming, and case-insensitive scheme inspection. The same rule covers native anchors, custom routers, Markdown links, and every activation method. Relative paths, fragments, protocol-relative URLs, HTTP(S), mailto, tel, safe custom schemes, and accepted downloads keep their existing behavior. A rejected destination renders inertly without invoking a custom router. There is no bypass prop; exceptional behavior requires caller-owned custom rendering outside this guarantee. Images and other resource URLs have separate policies.',
        },
        {
          name: 'hasUnderline',
          type: 'boolean',
          description: 'Always show underline',
          default: 'false',
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description: 'Disables the link',
          default: 'false',
        },
        {
          name: 'isExternalLink',
          type: 'boolean',
          description:
            'Opens in new tab with external icon and safe rel tokens',
          default: 'false',
        },
        {
          name: 'newTabLabel',
          type: 'string',
          description:
            'Screen-reader text announcing that an external link opens in a new tab. Override for localization.',
          default: "'(opens in new tab)'",
        },
        {
          name: 'target',
          type: 'string',
          description:
            'Where to open linked document. target="_blank" automatically adds noopener noreferrer.',
        },
        {
          name: 'rel',
          type: 'string',
          description:
            'Link relationship tokens. noopener noreferrer are merged automatically for target="_blank".',
        },
        {
          name: 'download',
          type: 'string | boolean',
          description:
            'Causes the browser to download the linked URL. A string specifies the suggested filename.',
        },
        {
          name: 'referrerPolicy',
          type: "'' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'",
          description: 'Referrer policy for the link.',
        },
        {
          name: 'onClick',
          type: '(event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void',
          description: 'Click event handler',
        },
        {
          name: 'tooltip',
          type: 'string',
          description: 'Tooltip text displayed on hover',
        },
        {
          name: 'isStandalone',
          type: 'boolean',
          description: 'Applies base font sizing',
          default: 'false',
        },
        {
          name: 'type',
          type: "'body' | 'large' | 'label' | 'supporting' | 'code' | 'display-1' | 'display-2' | 'display-3' | 'inherit'",
          description:
            "Semantic text type forwarded to Text; determines base typography. Use 'inherit' for an inline link inside an existing Text so it adopts the surrounding size and line-height. Themes may add custom types.",
          default: "'body'",
        },
        {
          name: 'size',
          type: "'4xs' | '3xs' | '2xs' | 'xsm' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'",
          description: 'Explicit font size override forwarded to Text.',
        },
        {
          name: 'weight',
          type: "'normal' | 'medium' | 'semibold' | 'bold'",
          description: 'Font weight override forwarded to Text.',
        },
        {
          name: 'color',
          type: "'primary' | 'secondary' | 'disabled' | 'placeholder' | 'accent' | 'inherit'",
          description: 'Text color forwarded to Text.',
          default: "'accent'",
        },
        {
          name: 'display',
          type: "'inline' | 'block'",
          description: 'Display type for Text.',
          default: "'inline'",
        },
        {
          name: 'maxLines',
          type: 'number',
          description: 'Maximum lines before truncation.',
          default: '0',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Link content',
          required: true,
        },
      ],    },
    {
      name: 'LinkProvider',
      isHiddenFromOverview: true,
      displayName: 'Link Provider',
      description:
        'Provider that sets the default link component for all Solo link-rendering components in the subtree. ' +
        'Wrap your app root to replace native <a> elements with your framework router (Next.js Link, React Router Link, etc.).',
      props: [
        {
          name: 'component',
          type: 'LinkComponentType',
          description:
            'Component to use for all link elements. It receives accepted `href` and `to` values under the shared navigation rule described on the Link `href` prop. Supported structured destinations, including their `protocol`, are checked without changing object identity. If either supplied destination is rejected, Solo renders inert content without invoking this component; it does not pass undefined or fall back to the other destination.',
          required: true,
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Subtree',
          required: true,
        },
      ],
    },
  ],
  usage: {
    accessibility: [
      {
        name: 'Link text',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Rest', 'Hover', 'Pointer down'],
        description:
          'Link text must have at least 4.5:1 contrast with the background behind it. For Pointer down, measure against the pressed overlay the link paints behind its text.',
      },
    ],
    description:
      'A styled anchor for inline and standalone text navigation. Supports external links, underline variants, tooltips, and custom link components for router integration. Use it for navigating between pages or to external URLs.',
    bestPractices: [
      { guidance: true, description: 'Write descriptive, concise link text that clearly communicates the destination.' },
      { guidance: true, description: 'Set `isStandalone` when the link appears outside of inline text, so it receives proper base font sizing.' },
      { guidance: true, description: 'Only set `label` when the link content is not descriptive text (e.g. an icon-only link). For text links, the visible text is already the accessible name; adding `label` overrides it for screen readers, which is harmful.' },
      { guidance: false, description: 'Use Link for actions that do not navigate; use a Button instead.' },
      { guidance: false, description: 'Use generic text like "click here" or "read more"; describe the destination.' },
      { guidance: false, description: 'Set `label` on text links; `aria-label` prevents assistive technology from reading the actual link content.' },
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'The visible text of the link.'},
      {name: 'Right icon', required: false, description: 'Icon placed after the label to indicate an action affordance.'},
      {name: 'Left icon', required: false, description: 'Icon placed before the label to represent meaning.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Link',
  displayName: 'Link',
  theming: {
    targets: [
      {className: 'solo-link', visualProps: ['color']},
    ],
  },
  components: [
    {
      name: 'Link',
      displayName: 'Link',
      description:
        '带有变体、外部链接支持和多态渲染的样式化锚点链接。',
      props: [
        {
          name: 'as',
          type: 'LinkComponentType',
          description: '用于替代 <a> 渲染的自定义组件',
        },
        {
          name: 'label',
          type: 'string',
          description: '无障碍标签（aria-label）。仅在子内容不是描述性文本时使用（如纯图标链接）。文本链接请省略此项。',
        },
        {
          name: 'href',
          type: 'string',
          description: '链接目标 URL',
        },
        {
          name: 'hasUnderline',
          type: 'boolean',
          description: '始终显示下划线',
          default: 'false',
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description: '禁用链接',
          default: 'false',
        },
        {
          name: 'isExternalLink',
          type: 'boolean',
          description: '在新标签页中打开，带外部图标和安全 rel 标记',
          default: 'false',
        },
        {
          name: 'newTabLabel',
          type: 'string',
          description: '向屏幕阅读器announce外部链接将在新标签页打开的文本。可覆盖以本地化。',
          default: "'(opens in new tab)'",
        },
        {
          name: 'target',
          type: 'string',
          description:
            '链接文档的打开位置。target="_blank" 会自动添加 noopener noreferrer。',
        },
        {
          name: 'rel',
          type: 'string',
          description:
            '链接关系标记。target="_blank" 会自动合并 noopener noreferrer。',
        },
        {
          name: 'download',
          type: 'string | boolean',
          description: '使浏览器下载链接的 URL。字符串值指定建议的文件名。',
        },
        {
          name: 'referrerPolicy',
          type: "'' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'",
          description: '链接的引用策略。',
        },
        {
          name: 'onClick',
          type: '(event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void',
          description: '点击事件处理器',
        },
        {
          name: 'tooltip',
          type: 'string',
          description: '悬停时显示的工具提示文本',
        },
        {
          name: 'isStandalone',
          type: 'boolean',
          description: '应用基础字体大小',
          default: 'false',
        },
        {
          name: 'type',
          type: "'body' | 'large' | 'label' | 'supporting' | 'code' | 'display-1' | 'display-2' | 'display-3' | 'inherit'",
          description:
            "转发给 Text 的语义文本类型，决定基础排版。在已有 Text 内的行内链接使用 'inherit'，以沿用周围文本的字号和行高。主题可添加自定义类型。",
          default: "'body'",
        },
        {
          name: 'size',
          type: "'4xs' | '3xs' | '2xs' | 'xsm' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'",
          description: '转发给 Text 的显式字号覆盖。',
        },
        {
          name: 'weight',
          type: "'normal' | 'medium' | 'semibold' | 'bold'",
          description: '转发给 Text 的字重覆盖。',
        },
        {
          name: 'color',
          type: "'primary' | 'secondary' | 'disabled' | 'placeholder' | 'accent' | 'inherit'",
          description: '转发给 Text 的文本颜色。',
          default: "'accent'",
        },
        {
          name: 'display',
          type: "'inline' | 'block'",
          description: 'Text 的显示类型。',
          default: "'inline'",
        },
        {
          name: 'maxLines',
          type: 'number',
          description: '截断前的最大行数。',
          default: '0',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: '链接内容',
          required: true,
        },
      ],
    },
    {
      name: 'LinkProvider',
      isHiddenFromOverview: true,
      displayName: 'Link Provider',
      description:
        '为子树中所有 Solo 链接组件设置默认链接组件的 Provider。',
      props: [
        {
          name: 'component',
          type: 'LinkComponentType',
          description: '用于所有链接元素的组件',
          required: true,
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: '子树',
          required: true,
        },
      ],
    },
  ],
  usage: {
    description:
      'A styled anchor for inline and standalone text navigation. Supports external links, underline variants, tooltips, and custom link components for router integration. Use it for navigating between pages or to external URLs.',
    bestPractices: [
      { guidance: true, description: 'Write descriptive, concise link text that clearly communicates the destination.' },
      { guidance: true, description: 'Set `isStandalone` when the link appears outside of inline text, so it receives proper base font sizing.' },
      { guidance: true, description: 'Only set `label` when the link content is not descriptive text (e.g. an icon-only link). For text links, the visible text is already the accessible name; adding `label` overrides it for screen readers, which is harmful.' },
      { guidance: false, description: 'Use Link for actions that do not navigate; use a Button instead.' },
      { guidance: false, description: 'Use generic text like "click here" or "read more"; describe the destination.' },
      { guidance: false, description: 'Set `label` on text links; `aria-label` prevents assistive technology from reading the actual link content.' },
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'The visible text of the link.'},
      {name: 'Right icon', required: false, description: 'Icon placed after the label to indicate an action affordance.'},
      {name: 'Left icon', required: false, description: 'Icon placed before the label to represent meaning.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'رابط منسّق للتنقّل النصي ضمن السياق أو بشكل مستقل، يدعم الروابط الخارجية ومكوّنات الروابط المخصّصة للتكامل مع الموجّه.',
  usage: {
    description: 'رابط منسّق للتنقّل النصي ضمن السياق أو بشكل مستقل. يدعم الروابط الخارجية وأنماط التسطير والتلميحات ومكوّنات الروابط المخصّصة للتكامل مع الموجّه. استخدمه للتنقّل بين الصفحات أو إلى عناوين URL خارجية.',
    bestPractices: [
      {guidance: true, description: 'اكتب نص رابط وصفيًا وموجزًا يوضّح الوجهة بجلاء.'},
      {guidance: true, description: 'عيّن `isStandalone` عندما يظهر الرابط خارج النص المضمّن، كي يحصل على حجم الخط الأساسي المناسب.'},
      {guidance: true, description: 'لا تعيّن `label` إلا عندما لا يكون محتوى الرابط نصًا وصفيًا (مثل رابط يحتوي على أيقونة فقط). في الروابط النصية يكون النص المرئي هو الاسم القابل للوصول بالفعل؛ وإضافة `label` تتجاوزه لدى قارئ الشاشة، وهذا ضار.'},
      {guidance: false, description: 'استخدام Link لإجراءات لا تتضمن تنقّلًا؛ استخدم Button بدلًا من ذلك.'},
      {guidance: false, description: 'استخدام نص عام مثل «انقر هنا» أو «اقرأ المزيد»؛ صِف الوجهة.'},
      {guidance: false, description: 'تعيين `label` على الروابط النصية؛ إذ يمنع `aria-label` التقنيات المساعدة من قراءة محتوى الرابط الفعلي.'},
    ],
    anatomy: [
      {name: 'التسمية', required: true, description: 'النص المرئي للرابط.'},
      {name: 'الأيقونة اليمنى', required: false, description: 'أيقونة توضع بعد التسمية للإشارة إلى إمكانية إجراء.'},
      {name: 'الأيقونة اليسرى', required: false, description: 'أيقونة توضع قبل التسمية لتمثيل المعنى.'},
    ],
  },
  components: [
    {
      name: 'Link',
      displayName: 'رابط',
      description: 'رابط منسّق بأنماط متعددة، مع دعم الروابط الخارجية والعرض متعدد الأشكال.',
      propDescriptions: {
        as: 'مكوّن مخصّص يُعرض بدلًا من <a>',
        label: 'التسمية القابلة للوصول (aria-label). لا تستخدمها إلا عندما لا تكون العناصر الفرعية وصفية بذاتها (مثل الروابط ذات الأيقونة فقط). احذفها في الروابط النصية؛ فنص الرابط هو الاسم القابل للوصول.',
        href: 'رابط URL لوجهة الرابط. تحظر الروابط والأسطح القابلة للنقر التي يملكها Solo المخططات javascript: وvbscript: وdata:text/html بعد إزالة أحرف التحكم وقص المسافات البيضاء الخارجية وفحص المخطط دون تمييز حالة الأحرف. تشمل القاعدة نفسها الروابط الأصلية والموجّهات المخصّصة وروابط Markdown وكل طرق التفعيل. تحتفظ المسارات النسبية والأجزاء وعناوين URL النسبية للبروتوكول وHTTP(S) وmailto وtel والمخططات المخصّصة الآمنة والتنزيلات المقبولة بسلوكها الحالي. تُعرض الوجهة المرفوضة بشكل خامل دون استدعاء موجّه مخصّص. لا توجد خاصية للتجاوز؛ إذ يتطلب السلوك الاستثنائي عرضًا مخصّصًا يملكه المستدعي خارج هذا الضمان. للصور وعناوين URL للموارد الأخرى سياسات منفصلة.',
        hasUnderline: 'إظهار التسطير دائمًا',
        isDisabled: 'تعطيل الرابط',
        isExternalLink: 'يفتح في علامة تبويب جديدة مع أيقونة الرابط الخارجي ورموز rel آمنة',
        newTabLabel: 'نص لقارئ الشاشة يُعلن أن الرابط الخارجي يفتح في علامة تبويب جديدة. تجاوزه لأغراض الترجمة.',
        target: 'المكان الذي يُفتح فيه المستند المرتبط. يضيف target="_blank" تلقائيًا noopener noreferrer.',
        rel: 'رموز علاقة الرابط. تُدمج noopener noreferrer تلقائيًا مع target="_blank".',
        download: 'يجعل المتصفح يُنزّل رابط URL المرتبط. تحدد السلسلة النصية اسم الملف المقترح.',
        referrerPolicy: 'سياسة المُحيل للرابط.',
        onClick: 'معالج حدث النقر',
        tooltip: 'نص التلميح المعروض عند التمرير فوق الرابط',
        isStandalone: 'يطبّق حجم الخط الأساسي',
        type: 'نوع النص الدلالي المُمرَّر إلى Text؛ يحدد الطباعة الأساسية. استخدم \'inherit\' لرابط مضمّن داخل Text موجود كي يتبنى الحجم وارتفاع السطر المحيطين. يمكن للسمات إضافة أنواع مخصّصة.',
        size: 'تجاوز صريح لحجم الخط يُمرَّر إلى Text.',
        weight: 'تجاوز لسماكة الخط يُمرَّر إلى Text.',
        color: 'لون النص المُمرَّر إلى Text.',
        display: 'نوع العرض لـ Text.',
        maxLines: 'الحد الأقصى لعدد الأسطر قبل الاقتطاع.',
        children: 'محتوى الرابط',
      },
    },
    {
      name: 'LinkProvider',
      displayName: 'مزوّد الروابط',
      description: 'مزوّد يعيّن مكوّن الرابط الافتراضي لجميع مكوّنات Solo التي تعرض روابط في الشجرة الفرعية. غلّف به جذر تطبيقك لاستبدال عناصر <a> الأصلية بموجّه إطار العمل لديك (Next.js Link أو React Router Link وغيرهما).',
      propDescriptions: {
        component: 'المكوّن المستخدم لجميع عناصر الروابط. يتلقى قيم `href` و`to` المقبولة وفق قاعدة التنقّل المشتركة الموصوفة في الخاصية `href` لـ Link. تُفحص الوجهات المهيكلة المدعومة، بما في ذلك `protocol` الخاص بها، دون تغيير هوية الكائن. إذا رُفضت أيٌّ من الوجهتين المقدَّمتين، يعرض Solo محتوى خاملًا دون استدعاء هذا المكوّن؛ ولا يمرّر undefined ولا يعود إلى الوجهة الأخرى.',
        children: 'الشجرة الفرعية',
      },
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Styled anchor links w/ multiple variants + polymorphic link infra for custom link components (Next.js Link, React Router Link, etc.).',
  usage: {
    description:
      'A styled anchor for inline and standalone text navigation. Supports external links, underline variants, tooltips, and custom link components for router integration. Use it for navigating between pages or to external URLs.',
    bestPractices: [
      { guidance: true, description: 'Write descriptive, concise link text that clearly communicates the destination.' },
      { guidance: true, description: 'Set `isStandalone` when the link appears outside of inline text, so it receives proper base font sizing.' },
      { guidance: true, description: 'Only set `label` when the link content is not descriptive text (e.g. an icon-only link). For text links, the visible text is already the accessible name; adding `label` overrides it for screen readers, which is harmful.' },
      { guidance: false, description: 'Use Link for actions that do not navigate; use a Button instead.' },
      { guidance: false, description: 'Use generic text like "click here" or "read more"; describe the destination.' },
      { guidance: false, description: 'Set `label` on text links; `aria-label` prevents assistive technology from reading the actual link content.' },
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'The visible text of the link.'},
      {name: 'Right icon', required: false, description: 'Icon placed after the label to indicate an action affordance.'},
      {name: 'Left icon', required: false, description: 'Icon placed before the label to represent meaning.'},
    ],
  },
  components: [
    {
      name: 'Link',
      displayName: 'Link',
      description:
        'Styled anchor link w/ variants, external link support, polymorphic rendering.',
      propDescriptions: {
        as: 'Custom component to render instead of <a>',
        label: 'Accessible label (aria-label). Only for non-text content like icon-only links.',
        href: 'Link destination URL. Shared rule blocks javascript:, vbscript:, data:text/html after scheme normalization on every Solo-owned navigation path. Ordinary URLs, fragments, safe custom schemes, and accepted downloads are preserved. Rejected => inert, no custom router. No bypass prop; exceptional caller-owned rendering is outside the guarantee. Image/resource policy is separate.',
        hasUnderline: 'Always show underline',
        isDisabled: 'Disables link',
        isExternalLink: 'Opens new tab w/ external icon and safe rel tokens',
        newTabLabel: 'SR text announcing an external link opens in a new tab',
        target:
          'Where to open linked document. target="_blank" auto-adds noopener noreferrer.',
        rel: 'Link relationship tokens. noopener noreferrer are merged for target="_blank".',
        onClick: 'Click event handler',
        tooltip: 'Tooltip text on hover',
        isStandalone: 'Applies base font sizing',
        type: "Text type forwarded to Text; 'inherit' for inline links inside Text",
        children: 'Link content',
      },
    },
    {
      name: 'LinkProvider',
      isHiddenFromOverview: true,
      displayName: 'Link Provider',
      description:
        'Provider setting default link component for all Solo links in subtree.',
      propDescriptions: {
        component: 'Component for all link elements. Accepted href/to follow the Link href rule; structured fields including protocol are checked, preserving identity. Either rejected => inert content, no router invocation or fallback.',
        children: 'Subtree',
      },
    },
  ],
};
