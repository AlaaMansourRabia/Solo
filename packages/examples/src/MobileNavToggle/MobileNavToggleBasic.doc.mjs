/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'MobileNavToggle',
  name: 'MobileNavToggle — Basic',
  displayName: 'MobileNavToggle — Basic',
  description:
    'A nav toggle with a custom icon and accessible label instead of the default hamburger. It opens a MobileNav drawer via the AppShell mobile context, which AppShell provides automatically.',
  displayNameAr: 'MobileNavToggle — أساسي',
  descriptionAr: 'مفتاح تنقّل بأيقونة مخصّصة وتسمية قابلة للوصول بدلًا من أيقونة القائمة الافتراضية. يفتح درج MobileNav عبر سياق الهاتف المحمول في AppShell، الذي يوفّره AppShell تلقائيًا.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'MobileNav',
    'MobileNavToggle',
    'AppShell',
    'SideNavItem',
    'SideNavSection',
    'Icon',
    'HStack',
    'Text',
  ],
};
