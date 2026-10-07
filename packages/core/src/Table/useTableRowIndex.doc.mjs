/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'useTableRowIndex',
  subComponentOf: 'Table',
  displayName: 'useTableRowIndex',
  description:
    'Hook that returns a TablePlugin which prepends a right-aligned, monospaced row-number column. Numbering follows the rendered data order (reflecting the current sort / filter / pagination view) and starts at 1 by default. Solo renderCell receives only the row item, so the plugin takes the rendered data array to derive each ordinal.',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description:
        'The data array currently rendered by the table (post sort/filter/page). Numbering follows this order.',
      required: true,
    },
    {
      name: 'getRowKey',
      type: '(item: T) => string',
      description:
        'Optional key extractor returning a unique string per row. When provided, index lookup is keyed by the returned string; otherwise items are matched by reference identity. Memoize with useCallback for a stable plugin identity.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Header label for the index column.',
      default: "'#'",
    },
    {
      name: 'startFrom',
      type: 'number',
      description: 'First index value.',
      default: '1',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يُرجع TablePlugin يضيف في البداية عمودًا لأرقام الصفوف محاذى إلى اليمين بخط أحادي المسافة. يتبع الترقيم ترتيب البيانات المعروضة (بما يعكس عرض الفرز / الترشيح / ترقيم الصفحات الحالي) ويبدأ من 1 افتراضيًا. لا يتلقى renderCell في Solo سوى عنصر الصف، لذا تأخذ الإضافة مصفوفة البيانات المعروضة لاشتقاق رقم كل صف.',
  propDescriptions: {
    data: 'مصفوفة البيانات المعروضة حاليًا في الجدول (بعد الفرز/الترشيح/الصفحة). يتبع الترقيم هذا الترتيب.',
    getRowKey: 'دالة اختيارية لاستخراج المفتاح تُرجع سلسلة نصية فريدة لكل صف. عند توفيرها، يعتمد البحث عن الفهرس على السلسلة المُرجعة؛ وإلا فتُطابق العناصر بهوية المرجع. احفظها باستخدام useCallback للحصول على هوية ثابتة للإضافة.',
    label: 'تسمية العنوان لعمود الفهرس.',
    startFrom: 'قيمة الفهرس الأولى.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Returns a TablePlugin that prepends a right-aligned monospaced row-number column. Numbering follows the rendered data order (current sort/filter/page view), 1-based by default. Pass the rendered data array; renderCell only receives the item so the plugin derives ordinals from it.',
  propDescriptions: {
    data: 'The rendered data array (post sort/filter/page). Numbering follows this order.',
    getRowKey: 'Optional key extractor returning a unique string per row; otherwise items match by reference.',
    label: "Header label for the index column. Default '#'.",
    startFrom: 'First index value. Default 1.',
  },
};
