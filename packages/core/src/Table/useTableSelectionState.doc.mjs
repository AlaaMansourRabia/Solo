/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'useTableSelectionState',
  subComponentOf: 'Table',
  displayName: 'useTableSelectionState',
  description:
    'State management companion for useTableSelection. Returns selectionConfig for the behaviour plugin plus selectionState for selection-aware UI such as TableSelectionToolbar. Handles disabled/selectable row filtering for select-all automatically: disabled rows are frozen (preserved across select-all/deselect-all), non-selectable rows are excluded.',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description: 'The full data array rendered in the table.',
      required: true,
    },
    {
      name: 'idKey',
      type: '(keyof T & string) | ((item: T) => string)',
      description:
        'Key extractor: property name or function returning a unique string ID.',
      required: true,
    },
    {
      name: 'selectedKeys',
      type: 'Set<string>',
      description: 'Controlled set of selected item IDs.',
      required: true,
    },
    {
      name: 'setSelectedKeys',
      type: 'Dispatch<SetStateAction<Set<string>>>',
      description: 'Setter for the controlled selected keys.',
      required: true,
    },
    {
      name: 'getIsItemSelectable',
      type: '(item: T) => boolean',
      description:
        'Should this row show a checkbox? Non-selectable rows are excluded from select-all.',
      default: '() => true',
    },
    {
      name: 'getIsItemEnabled',
      type: '(item: T) => boolean',
      description:
        'Is this row checkbox interactive? Disabled rows are frozen: select-all preserves their state.',
      default: '() => true',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'رفيق لإدارة الحالة لـ useTableSelection. يُرجع selectionConfig لإضافة السلوك بالإضافة إلى selectionState للواجهات المراعية للتحديد مثل TableSelectionToolbar. يتولى تلقائيًا تصفية الصفوف المعطَّلة/القابلة للتحديد عند تحديد الكل: تُجمَّد الصفوف المعطَّلة (تُحفظ حالتها عبر تحديد الكل/إلغاء تحديد الكل)، وتُستبعد الصفوف غير القابلة للتحديد.',
  propDescriptions: {
    data: 'مصفوفة البيانات الكاملة المعروضة في الجدول.',
    idKey: 'مستخرج المفتاح: اسم خاصية أو دالة تُرجع معرّفًا نصيًا فريدًا.',
    selectedKeys: 'مجموعة متحكَّم بها من معرّفات العناصر المحددة.',
    setSelectedKeys: 'دالة التعيين للمفاتيح المحددة المتحكَّم بها.',
    getIsItemSelectable: 'هل ينبغي أن يعرض هذا الصف مربع اختيار؟ تُستبعد الصفوف غير القابلة للتحديد من تحديد الكل.',
    getIsItemEnabled: 'هل مربع اختيار هذا الصف تفاعلي؟ تُجمَّد الصفوف المعطَّلة: يحافظ تحديد الكل على حالتها.',
  },
};

export const docsDense = {
  name: 'useTableSelectionState',
  displayName: 'useTableSelectionState',
  description:
    'State companion for useTableSelection. Returns selectionConfig for the behavior plugin + selectionState for selection-aware UI. Handles disabled/selectable row filtering for select-all automatically: disabled rows frozen (state preserved across select-all/deselect-all), non-selectable rows excluded.',
  propDescriptions: {
    data: 'full data array rendered in table',
    idKey: 'key extractor: property name or fn returning unique string ID',
    selectedKeys: 'controlled set of selected item IDs',
    setSelectedKeys: 'setter for controlled selected keys',
    getIsItemSelectable:
      'Returns whether row shows checkbox; non-selectable rows excluded from select-all. Defaults to () => true.',
    getIsItemEnabled:
      'Returns whether row checkbox is interactive; disabled rows frozen: select-all preserves their state. Defaults to () => true.',
  },
};
