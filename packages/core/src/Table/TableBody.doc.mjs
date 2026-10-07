/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TableBody',
  subComponentOf: 'Table',
  displayName: 'Table Body',
  isHiddenFromOverview: true,
  description:
    '<tbody> wrapper for children mode. Holds the data rows. A row must sit inside a section: <table> cannot contain a <tr> directly, because the HTML parser inserts an implied <tbody> when it parses server-rendered markup and React does not when it renders on the client, so rows written straight into Table mismatch on hydration. The data-driven data={...} mode renders this element itself; in children mode it is yours to supply.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The <tbody> rows.',
      required: true,
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [{className: 'solo-table-body'}],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'غلاف <tbody> لوضع العناصر الفرعية. يحتوي على صفوف البيانات. يجب أن يقع الصف داخل قسم: لا يمكن أن يحتوي <table> على <tr> مباشرةً، لأن محلّل HTML يُدرج <tbody> ضمنيًا عند تحليل الترميز المعروض من الخادم بينما لا يفعل React ذلك عند العرض على العميل، فتتعارض الصفوف المكتوبة مباشرةً داخل Table أثناء الإماهة. يعرض وضع البيانات data={...} هذا العنصر بنفسه؛ أما في وضع العناصر الفرعية فعليك توفيره.',
  propDescriptions: {
    children: 'صفوف <tbody>.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'TableBody',
  isHiddenFromOverview: true,
  displayName: 'Table Body',
  description: '<tbody> wrapper for children mode; holds the data rows; children mode does not add one for you',
  propDescriptions: {
    children: 'The <tbody> rows.',
    className: 'Tailwind classes for layout customization',
  },
};
