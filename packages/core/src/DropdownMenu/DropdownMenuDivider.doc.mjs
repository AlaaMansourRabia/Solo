/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuDivider',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Divider',
  isHiddenFromOverview: true,
  description:
    'A horizontal rule separating groups of rows in a compound menu. Renders role="separator", so it is never a stop in the arrow-key order. The data-driven equivalent is the `{type: "divider"}` entry in `items`; both modes render this component, so they look and theme identically.',
  props: [
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [{className: 'solo-dropdown-menu-divider'}],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'خط أفقي يفصل بين مجموعات الصفوف في قائمة مركّبة. يعرض role="separator"، لذا لا يكون أبدًا محطة في ترتيب التنقّل بمفاتيح الأسهم. والمكافئ القائم على البيانات هو العنصر `{type: "divider"}` في `items`؛ ويعرض كلا الوضعين هذا المكوّن، لذا يبدوان ويتأثران بالسمة بشكل متطابق.',
  propDescriptions: {
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز أي أداة متعارضة القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'DropdownMenuDivider',
  isHiddenFromOverview: true,
  displayName: 'Dropdown Menu Divider',
  description:
    'separator row for compound menus; compound peer of the data API\'s {type: "divider"}',
  propDescriptions: {
    className: 'Tailwind classes applied after the menu spacing',
  },
};
