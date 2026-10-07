/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useListFocus',
  displayName: 'useListFocus',
  keywords: [
    'list',
    'focus',
    'keyboard',
    'navigation',
    'menu',
    'toolbar',
    'roving',
    'tabindex',
    'a11y',
    'arrow',
    'wai-aria',
  ],
  params: [
    {
      name: 'options',
      type: 'UseListFocusOptions',
      description:
        'Configuration object for list focus behavior. All fields are optional.',
      required: false,
    },
    {
      name: 'options.itemSelector',
      type: 'string',
      description: 'Selector for focusable items within the list.',
      default: '\'[role="menuitem"]\'',
      required: false,
    },
    {
      name: 'options.boundarySelector',
      type: 'string',
      description:
        "Selector identifying a list boundary, for lists that contain nested lists of the same kind (e.g. a menu with submenu flyouts). When set, item collection and key handling are scoped to this level's own container. Typically '[role=\"menu\"]'.",
      required: false,
    },
    {
      name: 'options.wrap',
      type: 'boolean',
      description: 'Whether arrow navigation wraps around at the ends.',
      default: 'true',
      required: false,
    },
    {
      name: 'options.onEscape',
      type: '() => void',
      description:
        'Callback when Escape key is pressed (e.g., close menu). Supplying it also consumes the key (preventDefault); without it Escape passes through to the surrounding layer.',
      required: false,
    },
    {
      name: 'options.orientation',
      type: "'horizontal' | 'vertical' | 'both'",
      description:
        "Navigation orientation. 'horizontal' uses ArrowLeft/ArrowRight, 'vertical' uses ArrowUp/ArrowDown, 'both' accepts all four arrows.",
      default: "'vertical'",
      required: false,
    },
    {
      name: 'options.hasHomeEnd',
      type: 'boolean',
      description: 'Whether Home/End jump to the first/last enabled item.',
      default: 'true',
      required: false,
    },
    {
      name: 'options.hasPaging',
      type: 'boolean',
      description:
        'Whether PageDown/PageUp page through a scrolling list: PageDown moves to the last enabled item fully visible in the container, and pressed there again one viewport further; PageUp mirrors it. Neither wraps; in a list that does not scroll they act as End/Home.',
      default: 'false',
      required: false,
    },
    {
      name: 'options.hasRovingTabIndex',
      type: 'boolean',
      description:
        'Opt into roving-tabindex ownership: the hook stamps a single tab stop (one item tabindex="0", the rest -1), repairs it as items mount/unmount or toggle disabled, and moves it with arrow navigation. When false, the hook only moves focus and never touches tabindex.',
      default: 'false',
      required: false,
    },
    {
      name: 'options.hasCaretGuard',
      type: 'boolean',
      description:
        'When true, arrow keys are not stolen from a nested text input/textarea whose caret is not at the boundary in the direction of travel (or that has a selection), and are never stolen from a nested contenteditable (rich-text editor / chat composer). Preserves inline text editing within the list.',
      default: 'false',
      required: false,
    },
  ],
  returns: [
    {
      name: 'listRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Ref to attach to the list container element.',
    },
    {
      name: 'handleKeyDown',
      type: '(e: React.KeyboardEvent) => void',
      description: 'Key down handler to attach to the list container.',
    },
    {
      name: 'handleFocus',
      type: '(e: React.FocusEvent) => void',
      description:
        'Focus handler for the container. Keeps the roving tab stop in sync when hasRovingTabIndex is enabled; a no-op otherwise, so it is always safe to attach.',
    },
    {
      name: 'focusItem',
      type: '(index: number) => void',
      description: 'Focus a specific item by index (clamped to valid range).',
    },
    {
      name: 'focusFirst',
      type: '() => boolean',
      description:
        'Focus the first enabled item. Returns true when an item was focused.',
    },
    {
      name: 'focusLast',
      type: '() => boolean',
      description:
        'Focus the last enabled item. Returns true when an item was focused.',
    },
    {
      name: 'ownsEvent',
      type: '(e: React.KeyboardEvent) => boolean',
      description:
        'Whether a key event belongs to this list level rather than a nested list sharing the same boundarySelector. Always true when no boundarySelector is set. Use to guard consumer-added key handling (Enter/Space, typeahead).',
    },
    {
      name: 'getItems',
      type: '() => HTMLElement[]',
      description:
        "This level's focusable items in DOM order (already scoped by boundarySelector). Build typeahead targets from this instead of re-querying.",
    },
  ],
  usage: {
    description:
      'Manages keyboard navigation within a linear list following WAI-ARIA menu/listbox/toolbar patterns. Supports arrow key navigation (vertical, horizontal, or both), Home/End for boundaries, optional wrap-around, RTL, and Escape to close. Opt into hasRovingTabIndex for composite widgets (toolbars, segmented controls, tab strips) that own a single tab stop. Suitable for dropdown menus, toolbars, and any 1D focusable list.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Set orientation to 'horizontal' for toolbars and tab bars, 'vertical' for dropdown menus.",
      },
      {
        guidance: true,
        description:
          'Provide an onEscape callback for menus/dropdowns to return focus to the trigger.',
      },
      {
        guidance: true,
        description:
          'Enable hasRovingTabIndex (and hasCaretGuard when the widget can contain text inputs) for toolbar-style composites that should be a single tab stop.',
      },
      {
        guidance: false,
        description:
          'Use for 2D grid navigation; prefer useGridFocus for grids and calendars.',
      },
    ],
  },
  relatedComponents: ['TabMenu', 'Toolbar'],
  relatedHooks: ['useGridFocus', 'useFocusTrap'],
  importPath: '@solo/core/hooks',
  category: 'focus',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description:
    'خطّاف (hook) يدير التنقّل بلوحة المفاتيح داخل قائمة خطية وفق أنماط WAI-ARIA للقوائم ومربعات القوائم وأشرطة الأدوات، ويناسب القوائم المنسدلة وأشرطة الأدوات وأي قائمة أحادية البعد قابلة للتركيز.',
  paramDescriptions: {
    options: 'كائن إعدادات سلوك التركيز في القائمة. جميع الحقول اختيارية.',
    'options.itemSelector': 'محدِّد العناصر القابلة للتركيز داخل القائمة.',
    'options.boundarySelector':
      'محدِّد يعرّف حدود القائمة، للقوائم التي تحتوي قوائم متداخلة من النوع نفسه (مثل قائمة بقوائم فرعية منبثقة). عند تعيينه يُقصَر جمع العناصر ومعالجة المفاتيح على حاوية هذا المستوى نفسه. عادةً \'[role="menu"]\'.',
    'options.wrap': 'ما إذا كان التنقّل بالأسهم يلتف عند الطرفين.',
    'options.onEscape':
      'دالة استدعاء عند الضغط على المفتاح Escape (مثل إغلاق القائمة). توفيرها يستهلك المفتاح أيضًا (preventDefault)؛ ودونها يمرّ Escape إلى الطبقة المحيطة.',
    'options.orientation':
      'اتجاه التنقّل. \'horizontal\' يستخدم ArrowLeft/ArrowRight، و\'vertical\' يستخدم ArrowUp/ArrowDown، و\'both\' يقبل الأسهم الأربعة.',
    'options.hasHomeEnd': 'ما إذا كان Home/End ينتقلان إلى أول/آخر عنصر مفعَّل.',
    'options.hasPaging':
      'ما إذا كان PageDown/PageUp يتنقّلان صفحةً صفحة في قائمة قابلة للتمرير: ينتقل PageDown إلى آخر عنصر مفعَّل ظاهر بالكامل في الحاوية، وعند الضغط عليه هناك مجددًا ينتقل منفذ عرض إضافيًا؛ ويعكس PageUp ذلك. لا يلتف أيٌّ منهما؛ وفي القائمة غير القابلة للتمرير يعملان كـ End/Home.',
    'options.hasRovingTabIndex':
      'يفعّل ملكية roving-tabindex: يضع الخطّاف محطة تنقّل واحدة بالمفتاح Tab (عنصر واحد tabindex="0" والبقية -1)، ويصلحها عند تركيب العناصر أو إزالتها أو تبديل تعطيلها، وينقلها مع التنقّل بالأسهم. عندما تكون false ينقل الخطّاف التركيز فقط ولا يمسّ tabindex أبدًا.',
    'options.hasCaretGuard':
      'عندما تكون true لا تُنتزع مفاتيح الأسهم من حقل إدخال نصي/textarea متداخل لا يكون مؤشر الكتابة فيه عند الحد في اتجاه الحركة (أو فيه تحديد)، ولا تُنتزع أبدًا من عنصر contenteditable متداخل (محرّر نص منسّق / أداة كتابة محادثة). يحافظ على تحرير النص المضمّن داخل القائمة.',
  },
  returnDescriptions: {
    listRef: 'مرجع يُربط بعنصر حاوية القائمة.',
    handleKeyDown: 'معالج ضغط المفاتيح المراد ربطه بحاوية القائمة.',
    handleFocus:
      'معالج التركيز للحاوية. يُبقي محطة التنقّل المتنقّلة متزامنة عند تفعيل hasRovingTabIndex؛ ولا يفعل شيئًا في غير ذلك، لذا فربطه آمن دائمًا.',
    focusItem: 'يركّز على عنصر محدّد بفهرسه (مقيّدًا بالنطاق الصالح).',
    focusFirst: 'يركّز على أول عنصر مفعَّل. يُعيد true عند التركيز على عنصر.',
    focusLast: 'يركّز على آخر عنصر مفعَّل. يُعيد true عند التركيز على عنصر.',
    ownsEvent:
      'ما إذا كان حدث المفتاح يخص مستوى القائمة هذا لا قائمة متداخلة تشترك في boundarySelector نفسه. يكون true دائمًا عند عدم تعيين boundarySelector. استخدمه لحماية معالجة المفاتيح التي يضيفها المستهلك (Enter/Space والبحث بالكتابة).',
    getItems:
      'العناصر القابلة للتركيز في هذا المستوى بترتيب DOM (مقيّدة مسبقًا بـ boundarySelector). ابنِ أهداف البحث بالكتابة منها بدلًا من إعادة الاستعلام.',
  },
  usage: {
    description:
      'يدير التنقّل بلوحة المفاتيح داخل قائمة خطية وفق أنماط WAI-ARIA للقوائم ومربعات القوائم وأشرطة الأدوات. يدعم التنقّل بمفاتيح الأسهم (عموديًا أو أفقيًا أو كليهما)، وHome/End للحدود، والالتفاف الاختياري، ووضع RTL، وEscape للإغلاق. فعّل hasRovingTabIndex لعناصر الواجهة المركّبة (أشرطة الأدوات وعناصر التحكم المقسّمة وشرائط علامات التبويب) التي تمتلك محطة تنقّل واحدة. يناسب القوائم المنسدلة وأشرطة الأدوات وأي قائمة أحادية البعد قابلة للتركيز.',
    bestPractices: [
      {
        guidance: true,
        description:
          'عيّن orientation إلى \'horizontal\' لأشرطة الأدوات وأشرطة علامات التبويب، وإلى \'vertical\' للقوائم المنسدلة.',
      },
      {
        guidance: true,
        description:
          'وفّر دالة الاستدعاء onEscape للقوائم والقوائم المنسدلة لإعادة التركيز إلى المشغّل.',
      },
      {
        guidance: true,
        description:
          'فعّل hasRovingTabIndex (وhasCaretGuard عندما قد يحتوي عنصر الواجهة على حقول إدخال نصية) للمكوّنات المركّبة بأسلوب شريط الأدوات التي ينبغي أن تكون محطة تنقّل واحدة.',
      },
      {
        guidance: false,
        description:
          'لا تستخدمه للتنقّل في الشبكات ثنائية البعد؛ وفضّل useGridFocus للشبكات والتقويمات.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Manages keyboard navigation within linear list following WAI-ARIA menu/listbox/toolbar patterns. Supports arrow key navigation (vertical / horizontal), Home/End for boundaries, optional wrap-around, Escape to close. Suitable for dropdown menus, toolbars, any 1D focusable list.',
  paramDescriptions: {
    options: 'config for list focus behavior. All fields optional.',
    'options.itemSelector': 'selector for focusable items in list.',
    'options.boundarySelector':
      'boundary selector for lists that contain nested lists (e.g. submenu flyouts); scopes items + key handling to this level.',
    'options.wrap': 'whether arrow navigation wraps around at ends.',
    'options.onEscape':
      'callback when Escape key pressed (e.g. close menu). Also consumes the key; without it Escape passes through to the surrounding layer.',
    'options.orientation':
      "navigation orientation. 'horizontal' uses ArrowLeft/ArrowRight, 'vertical' uses ArrowUp/ArrowDown, 'both' accepts all four arrows.",
    'options.hasHomeEnd': 'whether Home/End jump to first/last enabled item.',
    'options.hasPaging':
      'whether PageDown/PageUp page through a scrolling list (last/first fully visible item, then one viewport further; never wraps).',
    'options.hasRovingTabIndex':
      'opt into roving-tabindex ownership: hook stamps + repairs a single tab stop across items.',
    'options.hasCaretGuard':
      "when true, don't steal arrow keys from a nested text input/textarea mid-line or from a contenteditable.",
  },
  returnDescriptions: {
    listRef: 'ref to attach to list container element.',
    handleKeyDown: 'key down handler for list container.',
    handleFocus:
      'focus handler; keeps roving tab stop in sync when hasRovingTabIndex is on (else no-op).',
    focusItem: 'focus specific item by index (clamped to valid range).',
    focusFirst: 'focus first enabled item; returns true when focused.',
    focusLast: 'focus last enabled item; returns true when focused.',
    ownsEvent:
      "whether a key event is this level's vs a nested list's (boundarySelector); always true without one.",
    getItems:
      "this level's focusable items in DOM order, scoped by boundarySelector.",
  },
  usage: {
    description:
      'Manages keyboard navigation within linear list following WAI-ARIA menu/listbox/toolbar patterns. Supports arrow key navigation (vertical / horizontal), Home/End for boundaries, optional wrap-around, Escape to close. Suitable for dropdown menus, toolbars, any 1D focusable list.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Set orientation to 'horizontal' for toolbars + tab bars, 'vertical' for dropdown menus.",
      },
      {
        guidance: true,
        description:
          'Provide onEscape callback for menus/dropdowns to return focus to trigger.',
      },
      {
        guidance: true,
        description:
          'Enable hasRovingTabIndex (+ hasCaretGuard when widget can contain text inputs) for toolbar-style composites that should be a single tab stop.',
      },
      {
        guidance: false,
        description:
          'Use for 2D grid navigation; prefer useGridFocus for grids + calendars.',
      },
    ],
  },
};
