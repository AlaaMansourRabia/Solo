/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useTypeahead',
  displayName: 'useTypeahead',
  keywords: [
    'typeahead',
    'type to focus',
    'first character',
    'keyboard',
    'search',
    'jump',
    'menu',
    'listbox',
    'select',
    'apg',
    'accessibility',
    'a11y',
  ],
  params: [
    {
      name: 'options',
      type: 'UseTypeaheadOptions',
      description: 'Configuration object.',
      required: true,
    },
    {
      name: 'options.getItemLabels',
      type: '() => ReadonlyArray<string | null | undefined>',
      description:
        "Returns the item labels in DOM order. A null or empty entry marks a non-matchable slot and keeps indices aligned with the caller's items.",
      required: true,
    },
    {
      name: 'options.onMatch',
      type: '(index: number) => void',
      description:
        "Called with the index of the matched item so the caller can focus or select it; typically useListFocus's focusItem.",
      required: true,
    },
    {
      name: 'options.getCurrentIndex',
      type: '() => number',
      description:
        'The index to search from, usually the focused item, so repeated presses of one letter cycle through matches. A negative value means nothing is current.',
      default: '() => -1',
    },
    {
      name: 'options.resetMs',
      type: 'number',
      description:
        'Milliseconds of inactivity after which the typed buffer resets.',
      default: '750',
    },
    {
      name: 'options.isDisabled',
      type: '(index: number) => boolean',
      description: 'Whether an index should be skipped, e.g. disabled items.',
    },
  ],
  returns: [
    {
      name: 'onKeyDown',
      type: '(e: React.KeyboardEvent | KeyboardEvent) => boolean',
      description:
        'Keydown handler. Returns true when it consumed a printable character, so the caller can stop its own key handling.',
    },
    {
      name: 'reset',
      type: '() => void',
      description:
        'Clears the pending buffer, e.g. when the collection closes.',
    },
  ],
  usage: {
    description:
      "Adds APG type-to-focus search to a collection: printable keystrokes are buffered (resetting after a pause), and the first item whose label starts with the buffer is reported through onMatch. Pressing the same letter repeatedly cycles through the matches rather than filtering deeper. It moves nothing itself; pair it with the collection's own focus management, most often useListFocus or useGridFocus.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Wire onMatch to the focus manager you already have (useListFocus.focusItem) instead of moving focus yourself.',
      },
      {
        guidance: true,
        description:
          'Let it see the key event first and fall through to arrow-key navigation only when it returns false.',
      },
      {
        guidance: true,
        description:
          'Pass getCurrentIndex so repeated presses of one letter walk through matches instead of sticking on the first.',
      },
      {
        guidance: false,
        description:
          'Use it on a text input; the field already receives the characters, and typeahead would fight the value.',
      },
    ],
  },
  relatedComponents: ['DropdownMenu', 'Selector', 'TreeList'],
  relatedHooks: ['useListFocus', 'useGridFocus', 'useTreeFocus'],
  importPath: '@solo/core/hooks',
  category: 'focus',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يضيف إلى مجموعة عناصر بحث APG بالكتابة لنقل التركيز: تُخزَّن ضغطات المفاتيح القابلة للطباعة مؤقتًا، ويُبلَّغ عن أول عنصر تبدأ تسميته بالنص المخزَّن عبر onMatch، دون أن ينقل الخطّاف أي شيء بنفسه.',
  paramDescriptions: {
    options: 'كائن الإعداد.',
    'options.getItemLabels': 'يُرجع تسميات العناصر بترتيب DOM. يشير الإدخال null أو الفارغ إلى خانة غير قابلة للمطابقة ويُبقي الفهارس متوافقة مع عناصر المستدعي.',
    'options.onMatch': 'يُستدعى بفهرس العنصر المطابق لكي يتمكن المستدعي من تركيزه أو تحديده؛ وعادةً ما يكون focusItem من useListFocus.',
    'options.getCurrentIndex': 'الفهرس الذي يبدأ منه البحث، وعادةً العنصر المُركَّز، لكي تتنقل الضغطات المتكررة لحرف واحد بين المطابقات. القيمة السالبة تعني عدم وجود عنصر حالي.',
    'options.resetMs': 'عدد الملّي ثواني من عدم النشاط التي يُعاد بعدها تعيين النص المخزَّن.',
    'options.isDisabled': 'ما إذا كان ينبغي تخطي فهرس ما، مثل العناصر المعطَّلة.',
  },
  returnDescriptions: {
    onKeyDown: 'معالج keydown. يُرجع true عندما يستهلك حرفًا قابلًا للطباعة، لكي يتمكن المستدعي من إيقاف معالجته الخاصة للمفتاح.',
    reset: 'يمسح النص المخزَّن المعلّق، مثلًا عند إغلاق المجموعة.',
  },
  usage: {
    description: 'يضيف إلى مجموعة عناصر بحث APG بالكتابة لنقل التركيز: تُخزَّن ضغطات المفاتيح القابلة للطباعة مؤقتًا (ويُعاد تعيينها بعد توقف)، ويُبلَّغ عن أول عنصر تبدأ تسميته بالنص المخزَّن عبر onMatch. يؤدي الضغط المتكرر على الحرف نفسه إلى التنقل بين المطابقات بدلًا من تضييق الترشيح. لا ينقل أي شيء بنفسه؛ استخدمه مع إدارة التركيز الخاصة بالمجموعة، وغالبًا useListFocus أو useGridFocus.',
    bestPractices: [
      {
        guidance: true,
        description: 'اربط onMatch بمدير التركيز الموجود لديك بالفعل (useListFocus.focusItem) بدلًا من نقل التركيز بنفسك.',
      },
      {
        guidance: true,
        description: 'دعه يتلقى حدث المفتاح أولًا، ولا تنتقل إلى التنقّل بمفاتيح الأسهم إلا عندما يُرجع false.',
      },
      {
        guidance: true,
        description: 'مرّر getCurrentIndex لكي تتنقل الضغطات المتكررة لحرف واحد بين المطابقات بدلًا من البقاء عند الأولى.',
      },
      {
        guidance: false,
        description: 'استخدامه على حقل إدخال نصي؛ فالحقل يتلقى الأحرف بالفعل، والإكمال بالكتابة سيتعارض مع القيمة.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'APG type-to-focus search for a collection. Buffers printable keys (resets after pause), matches labels by prefix, reports index via onMatch. Same letter pressed repeatedly cycles matches. Moves nothing itself; pair w/ useListFocus / useGridFocus.',
  paramDescriptions: {
    options: 'config.',
    'options.getItemLabels':
      'item labels in DOM order; null / empty = non-matchable slot, indices stay aligned.',
    'options.onMatch':
      'called w/ matched index so caller focuses / selects (e.g. useListFocus focusItem).',
    'options.getCurrentIndex':
      'index to search from (usually focused item) so repeat presses cycle. negative = nothing current.',
    'options.resetMs': 'ms of inactivity before typed buffer resets.',
    'options.isDisabled': 'whether an index is skipped (e.g. disabled items).',
  },
  returnDescriptions: {
    onKeyDown:
      'keydown handler; true = consumed a printable char, caller can stop its own handling.',
    reset: 'clears pending buffer (e.g. on close).',
  },
  usage: {
    description:
      'Type-to-jump for menus / listboxes / trees. Buffered prefix match w/ APG same-letter cycling; reports index, caller owns focus.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Wire onMatch to existing focus manager (useListFocus.focusItem), do not move focus yourself.',
      },
      {
        guidance: true,
        description:
          'Give it the key event first; fall through to arrow navigation when it returns false.',
      },
      {
        guidance: true,
        description:
          'Pass getCurrentIndex so repeat presses walk matches instead of sticking on first.',
      },
      {
        guidance: false,
        description: 'Use on a text input; field already gets the characters.',
      },
    ],
  },
};
