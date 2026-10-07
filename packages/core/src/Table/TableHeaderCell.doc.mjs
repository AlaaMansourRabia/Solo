/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TableHeaderCell',
  subComponentOf: 'Table',
  displayName: 'Table Header Cell',
  isHiddenFromOverview: true,
  description: '<th> wrapper that reads TableContext to apply density padding, semibold weight, secondary text color, and divider borders when used inside Table.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Header cell content.',
    },
    {
      name: 'scope',
      type: "'col' | 'row' | 'colgroup' | 'rowgroup'",
      description:
        'Which cells this header relates to.',
    },
    {
      name: 'contextMenuActions',
      type: 'TableContextActions',
      description:
        'Right-click actions rendered as a context menu around the cell content: an array of actions or a function returning one. Empty or undefined renders no menu.',
    },
  ],
};

export const docsZh = {
  name: 'TableHeaderCell',
  isHiddenFromOverview: true,
  displayName: 'Table Header Cell',
  description: '<th> 包装器，读取 TableContext 以在 Table 内部使用时应用密度内边距、半粗字重、次要文本颜色和分隔线边框。',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: '表头单元格内容。',
    },
    {
      name: 'scope',
      type: "'col' | 'row' | 'colgroup' | 'rowgroup'",
      description:
        '此标题单元格关联的单元格范围。',
    },
    {
      name: 'contextMenuActions',
      type: 'TableContextActions',
      description:
        '以右键上下文菜单形式包裹单元格内容的操作：操作数组或返回数组的函数。为空或未定义时不渲染菜单。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'غلاف لعنصر <th> يقرأ TableContext لتطبيق حشو الكثافة والوزن شبه العريض ولون النص الثانوي وحدود الفواصل عند استخدامه داخل Table.',
  propDescriptions: {
    children: 'محتوى خلية العنوان.',
    scope: 'الخلايا التي يرتبط بها هذا العنوان.',
    contextMenuActions: 'إجراءات النقر بزر الفأرة الأيمن المعروضة كقائمة سياقية حول محتوى الخلية: مصفوفة من الإجراءات أو دالة تُرجع مصفوفة. القيمة الفارغة أو undefined لا تعرض أي قائمة.',
  },
};

export const docsDense = {
  name: 'TableHeaderCell',
  isHiddenFromOverview: true,
  displayName: 'Table Header Cell',
  description: '<th> wrapper; reads TableContext for density padding, semibold weight, secondary color, dividers.',
  propDescriptions: {
    children: 'Header cell content.',
    scope: 'scope attr: which cells this header relates to',
    contextMenuActions: 'right-click context menu actions (array or fn); empty = no menu',
  },
};
