/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useAppShellMobile',
  displayName: 'useAppShellMobile',
  group: 'AppShell',
  category: 'layout',
  keywords: [
    'appshell',
    'mobile nav',
    'mobile drawer',
    'hamburger',
    'navigation toggle',
    'responsive navigation',
    'drawer state',
  ],
  params: [
    // useAppShellMobile takes no arguments; it reads AppShell context.
  ],
  returns: [
    {
      name: 'isMobile',
      type: 'boolean',
      description:
        'Whether the current viewport is below the AppShell mobile navigation breakpoint. Use this to synchronize AppShell-adjacent mobile UI with the same breakpoint as mobile nav.',
    },
    {
      name: 'isMobileNavOpen',
      type: 'boolean',
      description:
        'Whether the AppShell-managed mobile navigation drawer is open.',
    },
    {
      name: 'mobileNavId',
      type: 'string | undefined',
      description:
        'DOM id of the mobile navigation drawer, set by AppShell. Point aria-controls of a custom toggle at this so screen-reader users know which element the toggle expands. Undefined outside an AppShell that manages the drawer.',
    },
    {
      name: 'toggleMobileNav',
      type: '() => void',
      description:
        'Toggle the AppShell-managed mobile navigation drawer. No-ops when mobile nav is disabled.',
    },
    {
      name: 'openMobileNav',
      type: '() => void',
      description:
        'Open the AppShell-managed mobile navigation drawer. No-ops when mobile nav is disabled.',
    },
    {
      name: 'closeMobileNav',
      type: '() => void',
      description: 'Close the AppShell-managed mobile navigation drawer.',
    },
    {
      name: 'isMobileNavEnabled',
      type: 'boolean',
      description:
        'Whether AppShell mobile navigation is enabled and managed by AppShell. False when mobileNav is false, there is no nav content, or a fully custom mobileNav ReactNode owns the drawer.',
    },
    {
      name: 'hasAutoToggle',
      type: 'boolean',
      description:
        'Whether AppShell auto-toggle behavior is enabled. False when mobileNav hasToggle is set to false; combine with isMobile and isMobileNavEnabled before rendering custom toggles.',
    },
  ],
  usage: {
    description:
      'Hook for reading and controlling AppShell mobile navigation state from descendants of AppShell. Use it for custom mobile nav triggers, closing the drawer after route changes, or coordinating AppShell-adjacent mobile experiences with the same breakpoint used by mobile nav.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use inside the AppShell tree when building custom mobile navigation controls, route-aware nav items, or UI that should update at the same breakpoint as AppShell mobile nav.',
      },
      {
        guidance: true,
        description:
          'Prefer MobileNavToggle for the standard hamburger trigger: use this hook when you need custom placement, styling, or extra behavior.',
      },
      {
        guidance: true,
        description:
          'Call closeMobileNav after a custom mobile nav item changes route so the drawer dismisses cleanly.',
      },
      {
        guidance: false,
        description:
          'Use as a general responsive primitive when the UI is not inside AppShell or does not need to align with AppShell mobile nav: use useMediaQuery instead.',
      },
      {
        guidance: false,
        description:
          'Assume it throws outside AppShell. The hook returns safe defaults and no-op callbacks when no provider is present.',
      },
    ],
  },
  relatedComponents: [
    'AppShell',
    'MobileNav',
    'MobileNavToggle',
    'TopNav',
    'SideNav',
  ],
  relatedHooks: ['useMediaQuery'],
  importPath: '@solo/core/AppShell',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) لقراءة حالة التنقّل على الأجهزة المحمولة في AppShell والتحكم فيها من العناصر المتفرعة داخل AppShell.',
  returnDescriptions: {
    isMobile: 'ما إذا كان منفذ العرض الحالي دون نقطة التحوّل الخاصة بتنقّل AppShell على الأجهزة المحمولة. استخدمه لمزامنة واجهات الأجهزة المحمولة المجاورة لـ AppShell مع نقطة التحوّل نفسها المستخدمة في تنقّل الأجهزة المحمولة.',
    isMobileNavOpen: 'ما إذا كان درج التنقّل للأجهزة المحمولة الذي يديره AppShell مفتوحًا.',
    mobileNavId: 'معرّف DOM لدرج التنقّل للأجهزة المحمولة، يعيّنه AppShell. وجّه aria-controls في زر التبديل المخصّص إليه ليعرف مستخدمو قارئ الشاشة أي عنصر يوسّعه زر التبديل. تكون قيمته undefined خارج AppShell يدير الدرج.',
    toggleMobileNav: 'يبدّل حالة درج التنقّل للأجهزة المحمولة الذي يديره AppShell. لا يفعل شيئًا عندما يكون تنقّل الأجهزة المحمولة معطَّلًا.',
    openMobileNav: 'يفتح درج التنقّل للأجهزة المحمولة الذي يديره AppShell. لا يفعل شيئًا عندما يكون تنقّل الأجهزة المحمولة معطَّلًا.',
    closeMobileNav: 'يغلق درج التنقّل للأجهزة المحمولة الذي يديره AppShell.',
    isMobileNavEnabled: 'ما إذا كان تنقّل الأجهزة المحمولة في AppShell مفعَّلًا ويديره AppShell. تكون القيمة false عندما يكون mobileNav هو false، أو لا يوجد محتوى تنقّل، أو عندما يتولى ReactNode مخصّص بالكامل في mobileNav إدارة الدرج.',
    hasAutoToggle: 'ما إذا كان سلوك التبديل التلقائي في AppShell مفعَّلًا. تكون القيمة false عند تعيين hasToggle في mobileNav إلى false؛ اجمعه مع isMobile وisMobileNavEnabled قبل عرض أزرار تبديل مخصّصة.',
  },
  usage: {
    description: 'خطّاف (hook) لقراءة حالة التنقّل على الأجهزة المحمولة في AppShell والتحكم فيها من العناصر المتفرعة داخل AppShell. استخدمه لمشغّلات تنقّل مخصّصة على الأجهزة المحمولة، أو لإغلاق الدرج بعد تغيّر المسار، أو لتنسيق تجارب الأجهزة المحمولة المجاورة لـ AppShell مع نقطة التحوّل نفسها المستخدمة في تنقّل الأجهزة المحمولة.',
    bestPractices: [
      {guidance: true, description: 'استخدمه داخل شجرة AppShell عند بناء عناصر تحكم مخصّصة لتنقّل الأجهزة المحمولة، أو عناصر تنقّل تراعي المسار، أو واجهات ينبغي أن تتحدث عند نقطة التحوّل نفسها لتنقّل AppShell على الأجهزة المحمولة.'},
      {guidance: true, description: 'فضّل MobileNavToggle كمشغّل قياسي لقائمة الهامبرغر: استخدم هذا الخطّاف عندما تحتاج إلى موضع أو تنسيق مخصّص أو سلوك إضافي.'},
      {guidance: true, description: 'استدعِ closeMobileNav بعد أن يغيّر عنصر تنقّل مخصّص على الأجهزة المحمولة المسار، كي يُغلق الدرج بسلاسة.'},
      {guidance: false, description: 'استخدامه كأداة أساسية عامة للتجاوب عندما لا تكون الواجهة داخل AppShell أو لا تحتاج إلى التوافق مع تنقّل AppShell على الأجهزة المحمولة: استخدم useMediaQuery بدلًا من ذلك.'},
      {guidance: false, description: 'افتراض أنه يرمي خطأً خارج AppShell. يُرجع الخطّاف قيمًا افتراضية آمنة ودوال استدعاء لا تفعل شيئًا عند غياب المزوّد.'},
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Reads/controls AppShell mobile nav context. Use for custom triggers, closing drawer after route changes, or syncing AppShell-adjacent mobile UI to the same breakpoint as mobile nav.',
  returnDescriptions: {
    isMobile:
      'viewport below AppShell mobile nav breakpoint? Use to sync AppShell-adjacent mobile UI',
    isMobileNavOpen: 'AppShell-managed mobile nav drawer open?',
    mobileNavId:
      'DOM id of the drawer; point custom toggle aria-controls at it',
    toggleMobileNav: 'toggle drawer; no-op when mobile nav disabled',
    openMobileNav: 'open drawer; no-op when mobile nav disabled',
    closeMobileNav: 'close drawer',
    isMobileNavEnabled:
      'AppShell owns mobile nav? false when mobileNav=false, no nav content, or custom ReactNode owns drawer',
    hasAutoToggle:
      'auto-toggle enabled? false when mobileNav.hasToggle=false; combine w/ isMobile + isMobileNavEnabled before custom toggle render',
  },
  usage: {
    description:
      'Reads/controls AppShell mobile nav context. Use for custom triggers, closing drawer after route changes, or syncing AppShell-adjacent mobile UI to the same breakpoint as mobile nav.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use inside AppShell tree for custom nav controls, route-aware nav items, or UI that should update at AppShell mobile nav breakpoint.',
      },
      {
        guidance: true,
        description:
          'Prefer MobileNavToggle for standard hamburger; use hook for custom placement, styling, or extra behavior.',
      },
      {
        guidance: true,
        description:
          'Call closeMobileNav after custom mobile nav item changes route so drawer dismisses.',
      },
      {
        guidance: false,
        description:
          'Use as general responsive primitive when not inside AppShell / not aligning to AppShell mobile nav: use useMediaQuery instead.',
      },
      {
        guidance: false,
        description:
          'Assume it throws outside AppShell. Hook returns safe defaults + no-op callbacks without provider.',
      },
    ],
  },
};
