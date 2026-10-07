/**
 * MobileNavToggle — a member of the MobileNav family (see MobileNav.doc.mjs for the family's
 * overview). Split out so the docs site can load one doc file per family member.
 */

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'MobileNavToggle',
  subComponentOf: 'MobileNav',
  group: 'Navigation',
  category: 'Navigation',
  displayName: 'Mobile Nav Toggle',
  description:
    'Hamburger button that opens/closes the mobile nav drawer. Reads open state from AppShell context automatically: does NOT accept isOpen or onOpenChange props. Renders nothing above the mobile breakpoint.',
  // The toggle renders null unless AppShell mobile context reports an
  // enabled mobile viewport — the default context outside AppShell never
  // does, so the Properties preview was an empty stage. appShellMobile
  // has the preview simulate that context instead.
  playground: {
    appShellMobile: true,
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Custom content to render instead of the default hamburger icon.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the toggle button.',
      default: "'Open navigation'",
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'زر قائمة (هامبرغر) يفتح درج التنقّل المحمول أو يغلقه. يقرأ حالة الفتح من سياق AppShell تلقائيًا: لا يقبل الخاصيتين isOpen أو onOpenChange. لا يعرض شيئًا فوق نقطة التوقف الخاصة بالأجهزة المحمولة.',
  propDescriptions: {
    children: 'محتوى مخصّص يُعرض بدلًا من أيقونة الهامبرغر الافتراضية.',
    label: 'التسمية القابلة للوصول لزر التبديل.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  name: 'MobileNavToggle',
  description:
    'Hamburger button that opens/closes mobile nav drawer. Reads open state from AppShell context automatically. Renders nothing above mobile breakpoint.',
};
