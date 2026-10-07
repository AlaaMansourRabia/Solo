/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useGridFocus',
  displayName: 'useGridFocus',
  keywords: [
    'grid',
    'focus',
    'keyboard',
    'navigation',
    'arrow',
    'calendar',
    'a11y',
    'wai-aria',
    'cells',
  ],
  params: [
    {
      name: 'options',
      type: 'UseGridFocusOptions',
      description: 'Configuration object for grid focus behavior.',
      required: true,
    },
    {
      name: 'options.columns',
      type: 'number',
      description:
        'Number of columns in the grid. Used for up/down navigation (moves by this many cells).',
      required: true,
    },
    {
      name: 'options.cellSelector',
      type: 'string',
      description:
        'Selector for cells within the grid. Should match ALL cell positions in DOM order (including disabled/empty) so grid geometry is preserved.',
      default: '\'button:not([disabled]), [tabindex]:not([tabindex="-1"])\'',
      required: false,
    },
    {
      name: 'options.isCellFocusable',
      type: '(cell: HTMLElement) => boolean',
      description:
        'Predicate for whether a matched cell can receive focus. Omit to treat every matched cell as focusable.',
      required: false,
    },
    {
      name: 'options.getFocusTarget',
      type: '(cell: HTMLElement) => HTMLElement | null',
      description:
        'Resolves the element to focus for a cell, e.g. a button inside a role="gridcell" wrapper. Omit to focus the cell itself.',
      required: false,
    },
    {
      name: 'options.onNavigateBefore',
      type: '(column: number, offset: number) => void',
      description:
        'Callback when navigation would go before the first cell. Receives the column index and offset (1 for horizontal, columns for vertical).',
      required: false,
    },
    {
      name: 'options.onNavigateAfter',
      type: '(column: number, offset: number) => void',
      description:
        'Callback when navigation would go after the last cell. Receives the column index and offset.',
      required: false,
    },
    {
      name: 'options.onPageUp',
      type: '() => void',
      description:
        'Callback for Page Up key (e.g., navigate to previous month in calendars).',
      required: false,
    },
    {
      name: 'options.onPageDown',
      type: '() => void',
      description:
        'Callback for Page Down key (e.g., navigate to next month in calendars).',
      required: false,
    },
    {
      name: 'options.hasRovingTabIndex',
      type: 'boolean',
      description:
        'Own a single roving tab stop across the grid: one focusable cell (its resolved focus target) carries tabindex="0", the rest -1. Stamped/repaired on render and moved with arrow navigation. Attach the returned handleFocus to the container onFocus.',
      default: 'false',
      required: false,
    },
  ],
  returns: [
    {
      name: 'gridRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Ref to attach to the grid container element.',
    },
    {
      name: 'handleKeyDown',
      type: '(e: React.KeyboardEvent) => void',
      description: 'Key down handler to attach to the grid container.',
    },
    {
      name: 'handleFocus',
      type: '(e: React.FocusEvent) => void',
      description:
        'Focus handler for the grid container. Keeps the roving tab stop in sync when hasRovingTabIndex is enabled; a no-op otherwise, so always safe to attach.',
    },
    {
      name: 'focusCell',
      type: '(index: number) => void',
      description: 'Focus a specific cell by index (clamped to valid range).',
    },
    {
      name: 'focusFirst',
      type: '() => void',
      description: 'Focus the first focusable cell in the grid.',
    },
    {
      name: 'focusLast',
      type: '() => void',
      description: 'Focus the last focusable cell in the grid.',
    },
  ],
  usage: {
    description:
      'Manages keyboard navigation within a 2D grid following the WAI-ARIA grid pattern. Supports arrow keys for cell-to-cell navigation, Home/End for row boundaries, Ctrl+Home/Ctrl+End for grid boundaries, and Page Up/Down for custom callbacks (e.g., month navigation in calendars). Boundary navigation callbacks allow cross-grid navigation.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for calendar date grids: wire onPageUp/onPageDown to month navigation and onNavigateBefore/onNavigateAfter for cross-month arrow key navigation.',
      },
      {
        guidance: true,
        description:
          'Attach both gridRef and handleKeyDown to the grid container element.',
      },
      {
        guidance: true,
        description:
          'For roving-tabindex grids (e.g. Calendar), set hasRovingTabIndex: true and attach handleFocus to the container onFocus; seed one focus target with tabindex=0 and the hook repairs and moves it.',
      },
      {
        guidance: false,
        description:
          'Use for simple linear lists; prefer useListFocus for 1D navigation.',
      },
    ],
  },
  relatedComponents: ['Calendar'],
  relatedHooks: ['useListFocus', 'useFocusTrap'],
  importPath: '@solo/core/hooks',
  category: 'focus',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يدير التنقّل بلوحة المفاتيح داخل شبكة ثنائية الأبعاد وفق نمط الشبكة في WAI-ARIA.',
  paramDescriptions: {
    options: 'كائن الإعدادات لسلوك التركيز في الشبكة.',
    'options.columns': 'عدد الأعمدة في الشبكة. يُستخدم للتنقّل للأعلى والأسفل (ينتقل بهذا العدد من الخلايا).',
    'options.cellSelector': 'محدِّد الخلايا داخل الشبكة. يجب أن يطابق جميع مواضع الخلايا بترتيب DOM (بما في ذلك المعطَّلة والفارغة) للحفاظ على هندسة الشبكة.',
    'options.isCellFocusable': 'دالة شرطية تحدد ما إذا كانت الخلية المطابقة قابلة لاستقبال التركيز. احذفها لاعتبار كل خلية مطابقة قابلة للتركيز.',
    'options.getFocusTarget': 'تحدد العنصر الذي يتلقى التركيز لخلية ما، مثل زر داخل غلاف role="gridcell". احذفها لتركيز الخلية نفسها.',
    'options.onNavigateBefore': 'دالة استدعاء عندما يتجاوز التنقّل ما قبل الخلية الأولى. تتلقى فهرس العمود والإزاحة (1 للتنقّل الأفقي، و columns للتنقّل العمودي).',
    'options.onNavigateAfter': 'دالة استدعاء عندما يتجاوز التنقّل ما بعد الخلية الأخيرة. تتلقى فهرس العمود والإزاحة.',
    'options.onPageUp': 'دالة استدعاء لمفتاح Page Up (مثل الانتقال إلى الشهر السابق في التقويمات).',
    'options.onPageDown': 'دالة استدعاء لمفتاح Page Down (مثل الانتقال إلى الشهر التالي في التقويمات).',
    'options.hasRovingTabIndex': 'يمتلك نقطة توقف Tab متنقلة واحدة عبر الشبكة: خلية واحدة قابلة للتركيز (هدف تركيزها المحدد) تحمل tabindex="0" والبقية -1. تُعيَّن وتُصلَح عند العرض وتنتقل مع التنقّل بالأسهم. اربط handleFocus المُعاد بـ onFocus الخاص بالحاوية.',
  },
  returnDescriptions: {
    gridRef: 'مرجع (ref) يُربط بعنصر حاوية الشبكة.',
    handleKeyDown: 'معالج ضغط المفاتيح الذي يُربط بحاوية الشبكة.',
    handleFocus: 'معالج التركيز لحاوية الشبكة. يُبقي نقطة توقف Tab المتنقلة متزامنة عند تفعيل hasRovingTabIndex؛ ولا يفعل شيئًا في غير ذلك، لذا يمكن ربطه بأمان دائمًا.',
    focusCell: 'ينقل التركيز إلى خلية محددة بالفهرس (مقيَّدًا بالنطاق الصالح).',
    focusFirst: 'ينقل التركيز إلى أول خلية قابلة للتركيز في الشبكة.',
    focusLast: 'ينقل التركيز إلى آخر خلية قابلة للتركيز في الشبكة.',
  },
  usage: {
    description:
      'يدير التنقّل بلوحة المفاتيح داخل شبكة ثنائية الأبعاد وفق نمط الشبكة في WAI-ARIA. يدعم مفاتيح الأسهم للتنقّل بين الخلايا، و Home/End لحدود الصف، و Ctrl+Home/Ctrl+End لحدود الشبكة، و Page Up/Down لدوال استدعاء مخصصة (مثل التنقّل بين الأشهر في التقويمات). تتيح دوال استدعاء التنقّل عند الحدود التنقّلَ بين شبكات متعددة.',
    bestPractices: [
      {
        guidance: true,
        description:
          'استخدمه لشبكات تواريخ التقويم: اربط onPageUp/onPageDown بالتنقّل بين الأشهر، و onNavigateBefore/onNavigateAfter للتنقّل بمفاتيح الأسهم عبر الأشهر.',
      },
      {
        guidance: true,
        description:
          'اربط كلًّا من gridRef و handleKeyDown بعنصر حاوية الشبكة.',
      },
      {
        guidance: true,
        description:
          'للشبكات ذات tabindex المتنقل (مثل Calendar)، عيّن hasRovingTabIndex: true واربط handleFocus بـ onFocus الخاص بالحاوية؛ وامنح هدف تركيز واحدًا tabindex=0 مبدئيًا، وسيتولى الخطّاف إصلاحه ونقله.',
      },
      {
        guidance: false,
        description:
          'لا تستخدمه للقوائم الخطية البسيطة؛ فضّل useListFocus للتنقّل أحادي البعد.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Manages keyboard navigation within 2D grid following WAI-ARIA grid pattern. Supports arrow keys for cell-to-cell navigation, Home/End for row boundaries, Ctrl+Home/Ctrl+End for grid boundaries, Page Up/Down for custom callbacks (e.g. month navigation in calendars). Boundary navigation callbacks allow cross-grid navigation.',
  paramDescriptions: {
    options: 'config for grid focus behavior.',
    'options.columns':
      '# columns in grid. Used for up/down navigation (moves by this many cells).',
    'options.cellSelector':
      'selector for grid cells in DOM order (incl. disabled/empty) so geometry is preserved.',
    'options.isCellFocusable':
      'predicate for whether a matched cell can take focus. Omit = all focusable.',
    'options.getFocusTarget':
      'resolve element to focus for a cell (e.g. button inside gridcell wrapper). Omit = focus the cell.',
    'options.onNavigateBefore':
      'callback when navigation would go before first cell. Receives column index + offset (1 for horizontal, columns for vertical).',
    'options.onNavigateAfter':
      'callback when navigation would go after last cell. Receives column index + offset.',
    'options.onPageUp':
      'callback for Page Up key (e.g. navigate to previous month in calendars).',
    'options.onPageDown':
      'callback for Page Down key (e.g. navigate to next month in calendars).',
    'options.hasRovingTabIndex':
      'own a single roving tab stop across the grid (one focus target tabindex=0, rest -1); repaired on render + moved with arrows. Attach handleFocus to onFocus. default false.',
  },
  returnDescriptions: {
    gridRef: 'ref to attach to grid container element.',
    handleKeyDown: 'key down handler for grid container.',
    handleFocus:
      'focus handler for grid container; syncs roving tab stop when hasRovingTabIndex on, else no-op.',
    focusCell: 'focus specific cell by index (clamped to valid range).',
    focusFirst: 'focus first focusable cell in grid.',
    focusLast: 'focus last focusable cell in grid.',
  },
  usage: {
    description:
      'Manages keyboard navigation within 2D grid following WAI-ARIA grid pattern. Supports arrow keys for cell-to-cell navigation, Home/End for row boundaries, Ctrl+Home/Ctrl+End for grid boundaries, Page Up/Down for custom callbacks (e.g. month navigation in calendars). Boundary navigation callbacks allow cross-grid navigation.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for calendar date grids: wire onPageUp/onPageDown to month navigation + onNavigateBefore/onNavigateAfter for cross-month arrow key navigation.',
      },
      {
        guidance: true,
        description:
          'Attach both gridRef + handleKeyDown to grid container element.',
      },
      {
        guidance: true,
        description:
          'For roving-tabindex grids (e.g. Calendar): hasRovingTabIndex: true + attach handleFocus to onFocus; seed one focus target tabindex=0, hook repairs + moves it.',
      },
      {
        guidance: false,
        description:
          'Use for simple linear lists; prefer useListFocus for 1D navigation.',
      },
    ],
  },
};
