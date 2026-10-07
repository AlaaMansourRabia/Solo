/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useMenuPress',
  displayName: 'useMenuPress',
  keywords: [
    'menu',
    'press',
    'release',
    'touch',
    'finger',
    'drag',
    'highlight',
    'pointer',
    'gesture',
    'listbox',
    'macos',
    'ios',
  ],
  params: [
    {
      name: 'options',
      type: 'UseMenuPressOptions',
      description: 'Configuration object.',
      required: true,
    },
    {
      name: 'options.menuRef',
      type: 'RefObject<HTMLElement | null>',
      description:
        'The menu or listbox root — the surface whose rows a press picks from.',
      required: true,
    },
    {
      name: 'options.itemSelector',
      type: 'string',
      description:
        'Selector matching the ENABLED rows. A pointer over anything else inside the menu (a divider, a heading, a disabled row) highlights nothing.',
      required: true,
    },
    {
      name: 'options.triggerRef',
      type: 'RefObject<HTMLElement | null>',
      description:
        'The control that opens the menu, when a press may start there.',
    },
    {
      name: 'options.onTriggerPress',
      type: '(pointerType: MenuPressPointerType) => boolean',
      description:
        'A mouse pressed the trigger, or a finger rested on it for the long-press delay: open the menu under the held pointer and return whether it opened. Return false when the press closed an open menu instead.',
    },
    {
      name: 'options.onHighlight',
      type: '(row: HTMLElement | null) => void',
      description:
        'Move the highlight; null clears it. Defaults to moving DOM focus with preventScroll onto the row, and onto the menu root when there is no row. A picker that highlights through aria-activedescendant supplies its own.',
    },
    {
      name: 'options.onActivate',
      type: '(row: HTMLElement, release: PointerEvent) => void',
      description:
        'Act on the row under the release. Defaults to dispatching a click on the row that carries the release button and modifier keys.',
    },
    {
      name: 'options.onDismiss',
      type: '() => void',
      description:
        'A MOUSE was released outside the menu with nothing acting: close it. A finger released outside leaves the menu open, so this is never called then.',
    },
    {
      name: 'options.getScroller',
      type: '() => HTMLElement | null',
      description:
        'The element to scroll while a tracked pointer rests near its top or bottom edge. Defaults to the menu root when it overflows.',
    },
    {
      name: 'options.longPressDelayMs',
      type: 'number',
      description:
        'How long a finger must rest on the trigger before the menu opens under it.',
      default: '500',
    },
    {
      name: 'options.isEnabled',
      type: 'boolean',
      description: 'Whether the model is live.',
      default: 'true',
    },
  ],
  returns: [
    {
      name: 'menuProps',
      type: '{onPointerDown; "data-solo-menu-press": ""}',
      description:
        'Spread onto the menu root. Claims presses that begin inside it and marks the root as carrying the press model.',
    },
    {
      name: 'triggerProps',
      type: '{onPointerDown; onContextMenu}',
      description:
        'Spread onto the trigger: a mouse press opens the menu at once; a finger held for the delay opens it with the finger still down.',
    },
    {
      name: 'isTriggerClickFromPress',
      type: '() => boolean',
      description:
        'Whether the click reaching the trigger belongs to the gesture that just pressed it. That press already opened or closed the menu, so the click must neither toggle nor reopen.',
    },
    {
      name: 'cancel',
      type: '() => void',
      description:
        'End the gesture in flight with nothing acting, for when the menu closes under it.',
    },
  ],
  usage: {
    description:
      'The press model of macOS and iOS menus, for any pointer: the row under the pointer when it is RELEASED is the row that acts, the highlight follows the pointer while it is held, a mouse opens the menu on press and can drag straight into it, and a finger held on the trigger opens it with the finger still down. The pointer is tracked at document level by pointerId, so a finger that slid off the row it landed on is still followed; the click the browser reports at the end of a touch, aimed at the row where the touch began, is swallowed so nothing acts twice. DropdownMenu, ContextMenu, DropdownMenuSubMenu, Selector and the menu bottom sheet already mount it; reach for it directly only when building a menu-like surface of your own.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass a selector for ENABLED rows only, so a disabled row or a divider under the pointer clears the highlight instead of lighting up.',
      },
      {
        guidance: true,
        description:
          'Let the default highlight move focus in a menu; supply onHighlight only for a listbox that must keep focus on its combobox and highlight through aria-activedescendant.',
      },
      {
        guidance: true,
        description:
          'Declare touch-action on the menu root: none when its rows fit, pan-y when it scrolls, so the browser — not the hook — decides when a finger is scrolling.',
      },
      {
        guidance: false,
        description:
          'Act on a row from its own pointerdown or pointerup handler as well; the hook already activates the row under the release, and a second path acts twice.',
      },
      {
        guidance: false,
        description:
          'Read a row click with detail 0 as a keyboard activation; the hook dispatches its pointer activation with detail 0 too. Use isMenuPressActivation() to tell them apart.',
      },
    ],
  },
  relatedComponents: ['DropdownMenu', 'ContextMenu', 'Selector'],
  relatedHooks: ['useListFocus', 'useTypeahead', 'useLongPress'],
  importPath: '@solo/core/hooks',
  category: 'interaction',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) ينفّذ نموذج الضغط في قوائم macOS وiOS لأي مؤشر، حيث يُنفَّذ الصف الواقع تحت المؤشر عند إفلاته.',
  paramDescriptions: {
    options: 'كائن الإعدادات.',
    'options.menuRef': 'جذر القائمة أو listbox — السطح الذي يختار الضغط من صفوفه.',
    'options.itemSelector': 'محدِّد يطابق الصفوف المفعَّلة فقط. وجود المؤشر فوق أي شيء آخر داخل القائمة (فاصل، أو عنوان، أو صف معطَّل) لا يُبرز شيئًا.',
    'options.triggerRef': 'عنصر التحكم الذي يفتح القائمة، عندما يمكن أن يبدأ الضغط منه.',
    'options.onTriggerPress': 'ضُغط المُشغِّل بالفأرة، أو استقر عليه إصبع طوال مدة الضغط المطوّل: افتح القائمة تحت المؤشر المضغوط وأرجِع ما إذا فُتحت. أرجِع false عندما يكون الضغط قد أغلق قائمة مفتوحة بدلًا من ذلك.',
    'options.onHighlight': 'تنقل الإبراز؛ وnull يزيله. افتراضيًا تنقل تركيز DOM مع preventScroll إلى الصف، وإلى جذر القائمة عند عدم وجود صف. المحدِّد الذي يُبرز عبر aria-activedescendant يوفّر دالته الخاصة.',
    'options.onActivate': 'تنفّذ إجراء الصف الواقع تحت موضع الإفلات. افتراضيًا ترسل نقرة إلى الصف تحمل زر الإفلات ومفاتيح التعديل.',
    'options.onDismiss': 'أُفلتت الفأرة خارج القائمة دون تنفيذ أي إجراء: أغلقها. أما إفلات الإصبع خارجها فيُبقي القائمة مفتوحة، لذا لا تُستدعى هذه الدالة حينها أبدًا.',
    'options.getScroller': 'العنصر الذي يُمرَّر بينما يستقر المؤشر المتتبَّع قرب حافته العلوية أو السفلية. افتراضيًا هو جذر القائمة عندما يتجاوز محتواه حجمه.',
    'options.longPressDelayMs': 'المدة التي يجب أن يستقر فيها الإصبع على المُشغِّل قبل أن تُفتح القائمة تحته.',
    'options.isEnabled': 'ما إذا كان النموذج نشطًا.',
  },
  returnDescriptions: {
    menuProps: 'تُنشر على جذر القائمة. تستحوذ على الضغطات التي تبدأ داخلها وتُعلِّم الجذر بأنه يعتمد نموذج الضغط.',
    triggerProps: 'تُنشر على المُشغِّل: ضغطة الفأرة تفتح القائمة فورًا؛ والإصبع المضغوط طوال المدة يفتحها بينما لا يزال الإصبع ملامسًا.',
    isTriggerClickFromPress: 'ما إذا كانت النقرة الواصلة إلى المُشغِّل تنتمي إلى الإيماءة التي ضغطته للتو. لقد فتح ذلك الضغط القائمة أو أغلقها مسبقًا، لذا يجب ألا تبدّلها النقرة ولا تعيد فتحها.',
    cancel: 'تُنهي الإيماءة الجارية دون تنفيذ أي إجراء، لاستخدامها عندما تُغلق القائمة أثناءها.',
  },
  usage: {
    description: 'نموذج الضغط في قوائم macOS وiOS لأي مؤشر: الصف الواقع تحت المؤشر عند إفلاته هو الصف الذي يُنفَّذ، ويتبع الإبراز المؤشر ما دام مضغوطًا، وتفتح الفأرة القائمة عند الضغط ويمكنها السحب مباشرة إليها، والإصبع المضغوط على المُشغِّل يفتحها بينما لا يزال ملامسًا. يُتتبَّع المؤشر على مستوى المستند عبر pointerId، فيبقى الإصبع الذي انزلق عن الصف الذي هبط عليه متتبَّعًا؛ وتُبتلع النقرة التي يُبلغ عنها المتصفح في نهاية اللمس والموجّهة إلى الصف الذي بدأ عنده اللمس، حتى لا يُنفَّذ شيء مرتين. يركّبه كل من DropdownMenu وContextMenu وDropdownMenuSubMenu وSelector والورقة السفلية للقائمة مسبقًا؛ فلا تلجأ إليه مباشرة إلا عند بناء سطح شبيه بالقائمة خاص بك.',
    bestPractices: [
      {
        guidance: true,
        description: 'مرّر محدِّدًا للصفوف المفعَّلة فقط، كي يزيل الصف المعطَّل أو الفاصل الواقع تحت المؤشر الإبرازَ بدلًا من أن يُضاء.',
      },
      {
        guidance: true,
        description: 'دع الإبراز الافتراضي ينقل التركيز داخل القائمة؛ ولا توفّر onHighlight إلا لـ listbox يجب أن يُبقي التركيز على combobox الخاص به ويُبرز عبر aria-activedescendant.',
      },
      {
        guidance: true,
        description: 'صرّح بـ touch-action على جذر القائمة: none عندما تتسع صفوفها، وpan-y عندما تكون قابلة للتمرير، كي يقرر المتصفح — لا الخطّاف — متى يكون الإصبع في حالة تمرير.',
      },
      {
        guidance: false,
        description: 'نفّذ إجراء الصف من معالج pointerdown أو pointerup الخاص به أيضًا؛ فالخطّاف يفعّل بالفعل الصف الواقع تحت موضع الإفلات، والمسار الثاني ينفّذ الإجراء مرتين.',
      },
      {
        guidance: false,
        description: 'عامِل نقرة الصف ذات detail 0 على أنها تفعيل بلوحة المفاتيح؛ فالخطّاف يرسل تفعيل المؤشر أيضًا بقيمة detail 0. استخدم isMenuPressActivation() للتمييز بينهما.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'macOS/iOS menu press model for any pointer: the row under the RELEASE acts, the highlight follows a held pointer, a mouse opens on press and drags in, a held finger opens with the finger down. Document-level pointerId tracking; the browser stray click after a touch is swallowed. Already mounted by DropdownMenu / ContextMenu / DropdownMenuSubMenu / Selector / menu bottom sheet.',
  paramDescriptions: {
    options: 'config.',
    'options.menuRef': 'menu / listbox root.',
    'options.itemSelector': 'selector for ENABLED rows; anything else clears.',
    'options.triggerRef': 'the control that opens the menu.',
    'options.onTriggerPress':
      'mouse press / held finger on trigger: open, return whether it opened (false = the press closed it).',
    'options.onHighlight':
      'move highlight (null clears); default = focus w/ preventScroll, menu root when no row.',
    'options.onActivate':
      'act on row under release; default = dispatch click w/ release button + modifiers.',
    'options.onDismiss': 'MOUSE released outside: close. Finger: never called.',
    'options.getScroller':
      'element to edge-autoscroll while tracking; default = menu root if it overflows.',
    'options.longPressDelayMs': 'finger hold before open, ms.',
    'options.isEnabled': 'false = inert.',
  },
  returnDescriptions: {
    menuProps: 'spread on menu root (claims presses, marks the root).',
    triggerProps: 'spread on trigger (press-open, held-finger open).',
    isTriggerClickFromPress:
      'true = the trigger click belongs to the press that already opened / closed; ignore it.',
    cancel: 'end the gesture w/o acting.',
  },
  usage: {
    description:
      'Release decides; highlight follows the pointer; mouse press-opens; held finger opens. Use directly only for a menu-like surface of your own.',
    bestPractices: [
      {
        guidance: true,
        description: 'itemSelector = ENABLED rows only.',
      },
      {
        guidance: true,
        description:
          'Default focus highlight in menus; onHighlight only for aria-activedescendant listboxes.',
      },
      {
        guidance: true,
        description:
          'touch-action on the root: none when rows fit, pan-y when it scrolls.',
      },
      {
        guidance: false,
        description:
          'Also act on pointerdown / pointerup in the row; the hook already acts on release.',
      },
      {
        guidance: false,
        description:
          'Treat a detail-0 row click as keyboard; the hook dispatches w/ detail 0 too — use isMenuPressActivation().',
      },
    ],
  },
};
