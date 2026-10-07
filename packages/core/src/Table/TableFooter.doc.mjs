/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TableFooter',
  subComponentOf: 'Table',
  displayName: 'Table Footer',
  isHiddenFromOverview: true,
  description:
    '<tfoot> wrapper for children mode. Holds summary or total rows beneath the body. A row must sit inside a section: <table> cannot contain a <tr> directly, because the HTML parser inserts an implied <tbody> when it parses server-rendered markup and React does not when it renders on the client, so the two trees mismatch on hydration. Children mode only: the data-driven data={...} path renders a header and a body, never a footer.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The <tfoot> rows.',
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
    targets: [{className: 'solo-table-footer'}],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'غلاف <tfoot> لوضع العناصر الفرعية. يحتوي صفوف الملخص أو الإجمالي أسفل جسم الجدول. يجب أن يقع الصف داخل قسم: لا يمكن أن يحتوي <table> على <tr> مباشرةً، لأن محلل HTML يُدرج <tbody> ضمنيًا عند تحليل الترميز المعروض على الخادم بينما لا يفعل React ذلك عند العرض على العميل، فتتعارض الشجرتان أثناء الترطيب (hydration). لوضع العناصر الفرعية فقط: مسار data={...} المعتمد على البيانات يعرض ترويسة وجسمًا، ولا يعرض تذييلًا أبدًا.',
  propDescriptions: {
    children: 'صفوف <tfoot>.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأحجام)، تُدمج مع أصناف المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
};

export const docsDense = {
  name: 'TableFooter',
  isHiddenFromOverview: true,
  displayName: 'Table Footer',
  description: '<tfoot> wrapper for children mode; holds summary rows',
  propDescriptions: {
    children: 'The <tfoot> rows.',
    className: 'Tailwind classes for layout customization',
  },
};
