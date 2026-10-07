/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'usePopover',
  displayName: 'usePopover',
  group: 'Popover',
  keywords: [
    'popover',
    'popup',
    'dropdown',
    'floating',
    'anchor',
    'dialog',
    'overlay',
    'flyout',
  ],
  params: [
    {
      name: 'onShow',
      type: '() => void',
      description: 'Callback fired when the popover becomes visible.',
    },
    {
      name: 'onHide',
      type: '() => void',
      description:
        'Callback fired when the popover is hidden. Use this to return focus to the trigger when needed.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
    {
      name: 'hasLightDismiss',
      type: 'boolean',
      description: 'Whether clicking outside dismisses the popover.',
      default: 'true',
    },
    {
      name: 'hasEscapeDismiss',
      type: 'boolean',
      description:
        'Whether pressing Escape dismisses the popover. Only takes full effect together with hasLightDismiss: false, since native light dismiss also closes on Escape.',
      default: 'true',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description:
        'Whether to focus the first genuine content control when opened. Dialogs with none fall back to the labeled surface; the generated close control is excluded from initial focus.',
      default: 'true',
    },
    {
      name: 'hasCloseButton',
      type: 'boolean',
      description:
        'Whether to include a hidden close button that appears for keyboard users.',
      default: 'true',
    },
    {
      name: 'closeButtonLabel',
      type: 'string',
      description: 'Accessible label for the hidden close button.',
      default: "'Close popover'",
    },
    {
      name: 'dialogLabel',
      type: 'string',
      description:
        'Accessible label for the popover dialog (only applies when role is "dialog"). Provide one when there is no visible title.',
    },
    {
      name: 'role',
      type: "'dialog' | 'none'",
      description:
        'ARIA role on the content wrapper. Use "dialog" for genuine dialog content; use "none" for listbox/menu popups whose own content role should be exposed and whose trigger keeps DOM focus.',
      default: "'dialog'",
    },
    {
      name: 'isModal',
      type: 'boolean',
      description:
        'Whether a dialog-role popover is modal (aria-modal). Only applies when role is "dialog".',
      default: 'true',
    },
    {
      name: 'hasSurface',
      type: 'boolean',
      description:
        'Whether to apply the default popover surface background, radius, and shadow.',
      default: 'true',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Inner padding of the painted surface on the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10). Omit it and the hook paints no padding of its own; Popover passes 3 by default and 0 for a flush surface.',
    },
    {
      name: 'surfaceTarget',
      type: 'string',
      description:
        'Optional component-owned refinement target on the painted surface, without the solo- prefix. Use and document one when a direct hook composition needs distinct theme reachability. Do not use popover-surface; it is a deprecated compatibility alias of the canonical popover target.',
    },
  ],
  returns: [
    {
      name: 'triggerRef',
      type: '(el: HTMLElement | null) => void',
      description:
        'Ref callback to attach to the trigger element for CSS anchor positioning.',
    },
    {
      name: 'contentRef',
      type: 'RefObject<HTMLDivElement | null>',
      description:
        'Ref for the popover content container used by focus trapping.',
    },
    {
      name: 'anchorId',
      type: 'string',
      description: 'CSS anchor name for advanced positioning cases.',
    },
    {
      name: 'show',
      type: '(options?: {skipAutoFocus?: boolean}) => void',
      description:
        'Imperatively show the popover. skipAutoFocus preserves current focus for input-triggered popovers.',
    },
    {
      name: 'hide',
      type: '() => void',
      description: 'Imperatively hide the popover.',
    },
    {
      name: 'toggle',
      type: '() => void',
      description: 'Toggle the popover open or closed.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the popover is currently open.',
    },
    {
      name: 'id',
      type: 'string',
      description: 'Unique ID for aria-describedby or aria-controls.',
    },
    {
      name: 'render',
      type: '(children: ReactNode, props?: ContextRenderProps) => ReactNode',
      description:
        "Render function for anchor-positioned popover content. Pass placement and alignment here. Logical: start/end resolve against the popover's own inherited direction (RTL mirrors in pure CSS).",
    },
    {
      name: 'triggerProps',
      type: '{aria-haspopup: "dialog" | "true"; aria-expanded: boolean; aria-controls: string}',
      description:
        'ARIA attributes to spread onto the trigger element. aria-haspopup reflects the popover role.',
    },
  ],
  usage: {
    description:
      'Headless hook for click-triggered popovers with focus trapping. Combines useLayer with useFocusTrap, auto-focus, light dismiss, Escape handling, and an optional hidden close button for accessible dialog-like popover behavior. Every painted surface emits the canonical popover target and deprecated popover-surface compatibility alias. A custom composition needing a distinct stable seam should pass and document its own surfaceTarget.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for interactive content such as menus, pickers, forms, and command panels that need focus management.',
      },
      {
        guidance: true,
        description:
          'Prefer the Popover component for standard trigger-content pairs; use the hook for custom trigger patterns.',
      },
      {
        guidance: true,
        description:
          'Use popover as the broad surface target. Popover-surface remains supported compatibility output, but new theme source uses the canonical key.',
      },
      {
        guidance: true,
        description:
          'When a custom composition needs its own theme refinement, pass and document an owned surfaceTarget such as selector-popup. It refines the Popover surface rather than creating another anatomy part.',
      },
      {
        guidance: false,
        description:
          'Use for non-interactive hover previews: use useHoverCard or useTooltip instead.',
      },
    ],
  },
  relatedComponents: ['Popover', 'DropdownMenu', 'HoverCard'],
  relatedHooks: ['useLayer', 'useFocusTrap', 'useHoverCard', 'useTooltip'],
  importPath: '@solo/core/Popover',
  category: 'interaction',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) بلا واجهة للنوافذ المنبثقة التي تُفتح بالنقر مع حبس التركيز.',
  paramDescriptions: {
    onShow: 'دالة استدعاء تُطلَق عندما تصبح النافذة المنبثقة مرئية.',
    onHide: 'دالة استدعاء تُطلَق عند إخفاء النافذة المنبثقة. استخدمها لإعادة التركيز إلى المشغّل عند الحاجة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والتحجيم)، تُدمَج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداةُ المتعارضة القيمةَ الافتراضية.',
    hasLightDismiss: 'ما إذا كان النقر خارج النافذة المنبثقة يغلقها.',
    hasEscapeDismiss: 'ما إذا كان الضغط على Escape يغلق النافذة المنبثقة. لا يسري بالكامل إلا مع hasLightDismiss: false، لأن الإغلاق الخفيف الأصلي يُغلق أيضًا عند Escape.',
    hasAutoFocus: 'ما إذا كان يجب تركيز أول عنصر تحكم حقيقي في المحتوى عند الفتح. ترجع مربعات الحوار التي لا تحتوي على أي عنصر تحكم إلى السطح المسمّى؛ ويُستثنى عنصر الإغلاق المُولَّد من التركيز الأولي.',
    hasCloseButton: 'ما إذا كان يجب تضمين زر إغلاق مخفي يظهر لمستخدمي لوحة المفاتيح.',
    closeButtonLabel: 'تسمية قابلة للوصول لزر الإغلاق المخفي.',
    dialogLabel: 'تسمية قابلة للوصول لمربع حوار النافذة المنبثقة (تنطبق فقط عندما يكون role هو "dialog"). قدّمها عند عدم وجود عنوان مرئي.',
    role: 'دور ARIA على مغلِّف المحتوى. استخدم "dialog" لمحتوى مربعات الحوار الحقيقي؛ واستخدم "none" للنوافذ المنبثقة من نوع listbox/menu التي يجب كشف دور محتواها الخاص ويحتفظ مشغّلها بتركيز DOM.',
    isModal: 'ما إذا كانت النافذة المنبثقة ذات الدور dialog مشروطة (aria-modal). تنطبق فقط عندما يكون role هو "dialog".',
    hasSurface: 'ما إذا كان يجب تطبيق خلفية سطح النافذة المنبثقة الافتراضية ونصف قطرها وظلها.',
    padding: 'الحشوة الداخلية للسطح المرسوم على مقياس التباعد (0، 0.5، 1، 1.5، 2، 3، 4، 5، 6، 8، 10). عند إغفالها لا يرسم الخطّاف أي حشوة خاصة به؛ ويمرّر Popover القيمة 3 افتراضيًا و0 للسطح المتساوي مع الحواف.',
    surfaceTarget: 'هدف تحسين اختياري يملكه المكوّن على السطح المرسوم، دون البادئة solo-. استخدمه ووثّقه عندما يحتاج تركيب مباشر للخطّاف إلى إمكانية وصول مميزة من السمة. لا تستخدم popover-surface؛ فهو اسم مستعار متوافق ومُهمَل للهدف القياسي popover.',
  },
  returnDescriptions: {
    triggerRef: 'دالة استدعاء مرجعية (ref) تُرفق بعنصر المشغّل لتموضع CSS anchor.',
    contentRef: 'مرجع (ref) لحاوية محتوى النافذة المنبثقة يُستخدم لحبس التركيز.',
    anchorId: 'اسم مرساة CSS لحالات التموضع المتقدمة.',
    show: 'يعرض النافذة المنبثقة أوامريًا. يحافظ skipAutoFocus على التركيز الحالي للنوافذ المنبثقة التي يشغّلها حقل إدخال.',
    hide: 'يخفي النافذة المنبثقة أوامريًا.',
    toggle: 'يبدّل النافذة المنبثقة بين الفتح والإغلاق.',
    isOpen: 'ما إذا كانت النافذة المنبثقة مفتوحة حاليًا.',
    id: 'معرّف فريد لـ aria-describedby أو aria-controls.',
    render: 'دالة عرض لمحتوى النافذة المنبثقة المتموضع بالمرساة. مرّر placement وalignment هنا. منطقي: تُحسَم start/end وفق الاتجاه الموروث للنافذة المنبثقة نفسها (ينعكس في RTL عبر CSS فقط).',
    triggerProps: 'سمات ARIA لنشرها على عنصر المشغّل. تعكس aria-haspopup دور النافذة المنبثقة.',
  },
  usage: {
    description: 'خطّاف (hook) بلا واجهة للنوافذ المنبثقة التي تُفتح بالنقر مع حبس التركيز. يجمع useLayer مع useFocusTrap والتركيز التلقائي والإغلاق الخفيف ومعالجة Escape وزر إغلاق مخفي اختياري لسلوك نافذة منبثقة شبيه بمربع الحوار وقابل للوصول. يُصدر كل سطح مرسوم الهدف القياسي popover والاسم المستعار المتوافق المُهمَل popover-surface. ينبغي للتركيب المخصص الذي يحتاج إلى نقطة ربط ثابتة مميزة أن يمرّر surfaceTarget خاصًا به ويوثّقه.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدمه للمحتوى التفاعلي مثل القوائم والمحدِّدات والنماذج ولوحات الأوامر التي تحتاج إلى إدارة التركيز.',
      },
      {
        guidance: true,
        description: 'فضّل مكوّن Popover لأزواج المشغّل والمحتوى القياسية؛ واستخدم الخطّاف لأنماط المشغّلات المخصصة.',
      },
      {
        guidance: true,
        description: 'استخدم popover كهدف السطح العام. يظل popover-surface مخرجًا متوافقًا مدعومًا، لكن مصادر السمات الجديدة تستخدم المفتاح القياسي.',
      },
      {
        guidance: true,
        description: 'عندما يحتاج تركيب مخصص إلى تحسين خاص به في السمة، مرّر surfaceTarget مملوكًا ووثّقه مثل selector-popup. فهو يحسّن سطح Popover بدلًا من إنشاء جزء آخر في البنية.',
      },
      {
        guidance: false,
        description: 'لا تستخدمه لمعاينات التمرير غير التفاعلية: استخدم useHoverCard أو useTooltip بدلًا من ذلك.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Headless click-triggered popovers w/ focus trap, auto-focus, light dismiss, Escape, optional hidden close button. Every surface emits canonical popover plus deprecated popover-surface compatibility output. Custom compositions needing a distinct seam pass/document an owned surfaceTarget.',
  paramDescriptions: {
    onShow: 'fires when popover becomes visible.',
    onHide: 'fires when popover hides; use to return focus when needed.',
    className: 'Tailwind classes for content wrapper, after default surface.',
    hasLightDismiss: 'whether outside click dismisses popover.',
    hasEscapeDismiss:
      'whether Escape dismisses; full effect only w/ hasLightDismiss false.',
    hasAutoFocus:
      'focus genuine content on open; dialog surface fallback; generated close excluded.',
    hasCloseButton: 'whether hidden keyboard close button is included.',
    closeButtonLabel: 'label for hidden close button.',
    dialogLabel: 'accessible label for popover dialog (role="dialog" only).',
    role: 'content wrapper ARIA role; "none" for listbox/menu popups.',
    isModal: 'whether a dialog-role popover is modal (aria-modal).',
    hasSurface: 'apply default surface background/radius/shadow.',
    padding: 'spacing-scale padding on the painted surface; omit for none.',
    surfaceTarget:
      'optional owned refinement target; document it and do not use deprecated popover-surface.',
  },
  returnDescriptions: {
    triggerRef: 'trigger ref for CSS anchor positioning.',
    contentRef: 'content container ref for focus trap.',
    anchorId: 'CSS anchor name.',
    show: 'show popover; skipAutoFocus preserves current focus.',
    hide: 'hide popover.',
    toggle: 'toggle open/closed.',
    isOpen: 'whether currently open.',
    id: 'unique ARIA id.',
    render: 'renders anchor-positioned popover content.',
    triggerProps: 'ARIA attrs for trigger.',
  },
  usage: {
    description:
      'Headless click-triggered popovers w/ focus trap, auto-focus, light dismiss, Escape, optional hidden close button. Every surface emits canonical popover plus deprecated popover-surface compatibility output. Custom compositions needing a distinct seam pass/document an owned surfaceTarget.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for menus, pickers, forms, command panels needing focus management.',
      },
      {
        guidance: true,
        description:
          'Prefer Popover for standard trigger-content pairs; use hook for custom trigger patterns.',
      },
      {
        guidance: true,
        description:
          'Use canonical popover for broad surface theming; deprecated popover-surface is compatibility output only.',
      },
      {
        guidance: true,
        description:
          'For component-specific reachability, pass and document an owned surfaceTarget; it refines the same surface.',
      },
      {
        guidance: false,
        description:
          'Use for non-interactive hover previews: use useHoverCard / useTooltip instead.',
      },
    ],
  },
};
