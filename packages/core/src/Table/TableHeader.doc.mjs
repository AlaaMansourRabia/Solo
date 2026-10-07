/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TableHeader',
  subComponentOf: 'Table',
  displayName: 'Table Header',
  isHiddenFromOverview: true,
  description:
    '<thead> wrapper for children mode. Holds the header row, whose cells are TableHeaderCell. A row must sit inside a section: <table> cannot contain a <tr> directly, because the HTML parser inserts an implied <tbody> when it parses server-rendered markup and React does not when it renders on the client, so the two trees mismatch on hydration. The data-driven data={...} mode renders this element itself whenever columns are supplied; in children mode it is yours to supply.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The <thead> rows.',
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
    targets: [{className: 'solo-table-header'}],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'غلاف <thead> لوضع العناصر الأبناء. يحتوي على صف الترويسة الذي تكون خلاياه من نوع TableHeaderCell. يجب أن يقع الصف داخل قسم: لا يمكن أن يحتوي <table> على <tr> مباشرةً، لأن محلّل HTML يُدرج <tbody> ضمنيًا عند تحليل الترميز المعروض على الخادم بينما لا يفعل React ذلك عند العرض على العميل، فتختلف الشجرتان أثناء الإماهة (hydration). يعرض الوضع المعتمد على البيانات data={...} هذا العنصر بنفسه متى زُوّدت الأعمدة؛ أما في وضع العناصر الأبناء فعليك توفيره.',
  propDescriptions: {
    children: 'صفوف <thead>.',
    className:
      'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأحجام)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتغلّب الأداة المتعارضة على القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'TableHeader',
  isHiddenFromOverview: true,
  displayName: 'Table Header',
  description: '<thead> wrapper for children mode; holds the header row',
  propDescriptions: {
    children: 'The <thead> rows.',
    className: 'Tailwind classes for layout customization',
  },
};
