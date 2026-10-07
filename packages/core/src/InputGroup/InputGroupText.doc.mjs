/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'InputGroupText',
  subComponentOf: 'InputGroup',
  displayName: 'Input Group Text',
  isHiddenFromOverview: true,
  description: 'A prefix or suffix text element rendered inside InputGroup. Displays text or icons.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Text or icon content.',
      required: true,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'Inline styles.',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'عنصر نصي بادئ أو لاحق يُعرض داخل InputGroup. يعرض نصًا أو أيقونات.',
  propDescriptions: {
    children: 'محتوى نصي أو أيقونة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث يتجاوز أي صنف متعارض القيمة الافتراضية.',
    style: 'أنماط مضمّنة.',
  },
};

export const docsDense = {
  name: 'InputGroupText',
  isHiddenFromOverview: true,
  displayName: 'Input Group Text',
  description: 'prefix/suffix text/icon element',
  propDescriptions: {
    children: 'text or icon content',
    className: 'Tailwind classes',
    style: 'inline styles',
  },
};
