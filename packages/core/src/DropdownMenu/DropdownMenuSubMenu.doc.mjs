/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuSubMenu',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Submenu',
  isHiddenFromOverview: true,
  description:
    'A single menu row that reveals a nested flyout of its own items. The row adopts DropdownMenuItem semantics (label / icon / description / isDisabled); its children become the flyout content. Opens inline-end with viewport auto-flip; Right/Enter/Space opens and focuses the first item, Left/Escape closes and returns focus to the trigger (Right/Left swap in RTL). On a phone (a coarse pointer, decided when the menu opened) the row drills in instead: its rows replace the menu\'s rows in the same box, led by a Back row named "Back to <parent>", and Back, Escape or ArrowLeft return to the row. For data-driven menus, give a menu item a nested `items` array instead of using this component directly.',
  playground: {
    defaults: {label: 'Move to'},
  },
  props: [
    {
      name: 'label',
      required: true,
      type: 'ReactNode',
      description: 'Primary label text for the trigger row.',
    },
    {
      name: 'icon',
      type: 'ReactNode | IconType',
      description:
        'Icon to display before the label. See the Icon docs (`IconName`) for valid semantic names.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Secondary description text displayed below the label.',
    },
    {
      name: 'children',
      required: true,
      type: 'ReactNode',
      description:
        'The flyout menu items: the same components used at the top level (DropdownMenuItem, nested DropdownMenuSubMenu, selectable items).',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      default: 'false',
      description:
        'A disabled submenu renders its trigger row but never opens the flyout.',
    },
    {
      name: 'hasSpinner',
      type: 'boolean',
      default: 'false',
      description:
        "Show a spinner in place of the caret, e.g. while a lazy submenu's children are loading.",
    },
    {
      name: 'menuWidth',
      type: 'number | string',
      description:
        'Minimum flyout width. The flyout may grow for its content, but it is capped to the available viewport space. Defaults to intrinsic sizing (min 160px).',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Called when the flyout opens or closes.',
    },
    {
      name: 'presentation',
      type: "'flyout' | 'drill-in' | 'adaptive'",
      description:
        "How the sub-menu shows its rows. 'flyout' opens them beside the row; 'drill-in' replaces the menu's rows with them and a Back row, in the same box; 'adaptive' drills in when a finger opened the menu (a coarse pointer, decided when the menu opened) and flies out otherwise.",
      default: "'adaptive'",
    },
    {
      name: 'menuDataTestId',
      type: 'string',
      description: 'Test id for the flyout menu (data-testid on the trigger row stays on the row).',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'صف قائمة واحد يكشف عن قائمة فرعية متداخلة منبثقة تضم عناصرها الخاصة. يتبنّى الصف دلالات DropdownMenuItem ‏(label / icon / description / isDisabled)؛ وتصبح عناصره الأبناء محتوى القائمة الفرعية. تُفتح في اتجاه inline-end مع قلب تلقائي بحسب منفذ العرض؛ تفتح Right/Enter/Space القائمة وتنقل التركيز إلى العنصر الأول، وتغلقها Left/Escape وتعيد التركيز إلى المشغّل (تتبادل Right/Left في وضع RTL). على الهاتف (مؤشر خشن، يُحدَّد عند فتح القائمة) ينتقل الصف إلى الداخل بدلًا من ذلك: تحل صفوفه محل صفوف القائمة في المربع نفسه، ويتقدّمها صف رجوع باسم "Back to <parent>"، وتعيد Back أو Escape أو ArrowLeft إلى الصف. للقوائم المعتمدة على البيانات، امنح عنصر القائمة مصفوفة `items` متداخلة بدلًا من استخدام هذا المكوّن مباشرة.',
  propDescriptions: {
    label: 'نص التسمية الأساسي لصف المشغّل.',
    icon: 'أيقونة تُعرض قبل التسمية. راجع توثيق Icon (`IconName`) لمعرفة الأسماء الدلالية الصالحة.',
    description: 'نص وصف ثانوي يُعرض أسفل التسمية.',
    children:
      'عناصر القائمة الفرعية: المكوّنات نفسها المستخدمة في المستوى الأعلى (DropdownMenuItem، وDropdownMenuSubMenu المتداخل، والعناصر القابلة للتحديد).',
    isDisabled: 'القائمة الفرعية المعطَّلة تعرض صف المشغّل لكنها لا تفتح القائمة المنبثقة أبدًا.',
    hasSpinner: 'يعرض مؤشر تحميل دوّارًا مكان السهم، مثلًا أثناء تحميل عناصر قائمة فرعية كسولة التحميل.',
    menuWidth:
      'الحد الأدنى لعرض القائمة الفرعية. قد تتسع لتناسب محتواها، لكنها محدودة بالمساحة المتاحة في منفذ العرض. القيمة الافتراضية هي التحجيم الذاتي (بحد أدنى 160px).',
    onOpenChange: 'يُستدعى عند فتح القائمة الفرعية أو إغلاقها.',
    presentation:
      'طريقة عرض القائمة الفرعية لصفوفها. \'flyout\' تفتحها بجوار الصف؛ و\'drill-in\' تستبدل بها صفوف القائمة مع صف رجوع في المربع نفسه؛ و\'adaptive\' تنتقل إلى الداخل عندما يفتح إصبعٌ القائمة (مؤشر خشن، يُحدَّد عند فتح القائمة) وتنبثق جانبيًا في غير ذلك.',
    menuDataTestId: 'معرّف الاختبار للقائمة الفرعية (تبقى data-testid على صف المشغّل خاصة بالصف).',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش، والموضع، والتحجيم)، تُدمج مع فئات المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'DropdownMenuSubMenu',
  isHiddenFromOverview: true,
  displayName: 'Dropdown Menu Submenu',
  description:
    'menu row that reveals a nested flyout of its own children/items (single component, not Sub/SubTrigger/SubContent); drills in on a phone',
  propDescriptions: {
    label: 'primary label text for the trigger row',
    icon: 'icon before label',
    description: 'secondary text below label',
    children: 'flyout menu items (same components as top level)',
    isDisabled: 'renders trigger but never opens',
    hasSpinner: 'spinner instead of caret for async children',
    menuWidth:
      'minimum flyout width, capped to the viewport (default: content, min 160px)',
    onOpenChange: 'called when flyout opens/closes',
    presentation:
      "'flyout' beside the row | 'drill-in' replaces the rows + Back row | 'adaptive' (default) drills in on a coarse pointer",
    menuDataTestId: 'test id for the flyout menu',
    className: 'Tailwind classes for the trigger row',
  },
};
