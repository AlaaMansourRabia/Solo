/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useHotkeys',
  displayName: 'useHotkeys',
  keywords: ['hotkey', 'shortcut', 'keyboard', 'keydown', 'command', 'palette', 'mod', 'cmd', 'ctrl', 'kbd'],
  params: [
    {
      name: 'hotkeys',
      type: 'Hotkey[]',
      description:
        'Shortcut registrations. Each entry: `{ keys, onPress, allowInInputs?, isDisabled? }`. `keys` is a "+"-separated combo like "mod+k", "shift+/", "escape"; "mod" is ⌘ on macOS and Ctrl elsewhere. `onPress` receives the KeyboardEvent after preventDefault(). `allowInInputs` (default false) lets the hotkey fire while typing in inputs/textareas/selects/contenteditable. `isDisabled` temporarily disables the entry.',
      required: true,
    },
  ],
  returns: [],
  usage: {
    description:
      'Registers global keyboard shortcuts with a single window keydown listener per hook instance. Handlers live in a ref, so re-renders never re-subscribe. Skips events from typing targets (input, textarea, select, contenteditable) unless allowInInputs, skips defaultPrevented events, and calls preventDefault() on match. SSR-safe.',
    bestPractices: [
      { guidance: true, description: 'Use for app-level shortcuts like command palettes (mod+k), help overlays (shift+/), and navigation keys.' },
      { guidance: true, description: 'Pair with the Kbd component to display the same combo you register; both resolve "mod" per platform identically.' },
      { guidance: true, description: 'Use isDisabled to suspend shortcuts while a modal or wizard owns the keyboard, instead of unmounting the hook.' },
      { guidance: false, description: 'Use for focus-scoped keyboard navigation inside a widget; use useListFocus or useGridFocus instead.' },
    ],
  },
  relatedComponents: ['Kbd'],
  relatedHooks: ['useListFocus', 'useGridFocus'],
  importPath: '@solo/core/hooks',
  category: 'interaction',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'يسجّل اختصارات لوحة مفاتيح عامة بمستمع keydown واحد على window لكل نسخة من الخطّاف (hook).',
  paramDescriptions: {
    hotkeys: 'تسجيلات الاختصارات. كل إدخال: `{ keys, onPress, allowInInputs?, isDisabled? }`. `keys` تركيبة مفصولة بـ "+" مثل "mod+k" و"shift+/" و"escape"؛ و"mod" هو ⌘ على macOS وCtrl في غيره. يتلقى `onPress` الحدث KeyboardEvent بعد preventDefault(). يتيح `allowInInputs` (الافتراضي false) تنفيذ الاختصار أثناء الكتابة في حقول input/textarea/select/contenteditable. ويعطّل `isDisabled` الإدخال مؤقتًا.',
  },
  usage: {
    description: 'يسجّل اختصارات لوحة مفاتيح عامة بمستمع keydown واحد على window لكل نسخة من الخطّاف. تعيش المعالجات في ref، لذا لا تؤدي إعادة العرض إلى إعادة الاشتراك أبدًا. يتخطى الأحداث القادمة من أهداف الكتابة (input وtextarea وselect وcontenteditable) ما لم يُعيَّن allowInInputs، ويتخطى الأحداث التي تكون قيمة defaultPrevented فيها true، ويستدعي preventDefault() عند المطابقة. آمن مع SSR.',
    bestPractices: [
      {guidance: true, description: 'استخدمه لاختصارات مستوى التطبيق مثل لوحات الأوامر (mod+k) وطبقات المساعدة المتراكبة (shift+/) ومفاتيح التنقّل.'},
      {guidance: true, description: 'اقرنه بالمكوّن Kbd لعرض التركيبة نفسها التي تسجّلها؛ إذ يحلّ كلاهما "mod" حسب المنصة بالطريقة نفسها.'},
      {guidance: true, description: 'استخدم isDisabled لتعليق الاختصارات أثناء امتلاك مربع حوار مشروط أو معالج خطوات للوحة المفاتيح، بدلًا من إلغاء تركيب الخطّاف.'},
      {guidance: false, description: 'استخدامه للتنقّل بلوحة المفاتيح المحصور بالتركيز داخل عنصر واجهة؛ استخدم useListFocus أو useGridFocus بدلًا من ذلك.'},
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Global keyboard shortcuts w/ one window keydown listener per hook instance. Handlers kept in ref; re-renders never re-subscribe. Skips typing targets (input/textarea/select/contenteditable) unless allowInInputs, skips defaultPrevented and IME key events (even with allowInInputs), preventDefault() on match. "mod" = ⌘ on macOS, Ctrl elsewhere. SSR-safe.',
  paramDescriptions: {
    hotkeys:
      'array of { keys, onPress, allowInInputs?, isDisabled? }. keys = "+"-separated combo ("mod+k", "shift+/", "escape").',
  },
  usage: {
    description:
      'Global keyboard shortcuts w/ one window keydown listener per hook instance. Handlers kept in ref; re-renders never re-subscribe. Skips typing targets unless allowInInputs, skips defaultPrevented and IME key events (even with allowInInputs), preventDefault() on match. SSR-safe.',
    bestPractices: [
      { guidance: true, description: 'Use for app-level shortcuts: command palettes (mod+k), help overlays (shift+/), navigation keys.' },
      { guidance: true, description: 'Pair w/ Kbd component to display same combo registered; both resolve "mod" per platform identically.' },
      { guidance: true, description: 'Use isDisabled to suspend shortcuts while modal/wizard owns keyboard, instead of unmounting hook.' },
      { guidance: false, description: 'Use for focus-scoped keyboard nav inside widget; use useListFocus / useGridFocus instead.' },
    ],
  },
};
