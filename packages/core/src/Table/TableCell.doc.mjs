/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TableCell',
  subComponentOf: 'Table',
  displayName: 'Table Cell',
  isHiddenFromOverview: true,
  description: '<td> wrapper that reads TableContext to apply density padding, font size, and divider borders when used inside Table.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Cell content.',
    },
    {
      name: 'scope',
      type: "'col' | 'row' | 'colgroup' | 'rowgroup'",
      description:
        'Which cells this cell relates to; set it on a <td> that acts as a row header.',
    },
    {
      name: 'headers',
      type: 'string',
      description:
        'Space-separated list of header cell IDs that describe this cell.',
    },
    {
      name: 'colSpan',
      type: 'number',
      description:
        'Number of columns this cell spans (standard HTML <td> attribute).',
    },
    {
      name: 'rowSpan',
      type: 'number',
      description:
        'Number of rows this cell spans (standard HTML <td> attribute).',
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
  name: 'TableCell',
  isHiddenFromOverview: true,
  displayName: 'Table Cell',
  description: '<td> 包装器，读取 TableContext 以在 Table 内部使用时应用密度内边距、字体大小和分隔线边框。',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: '单元格内容。',
    },
    {
      name: 'scope',
      type: "'col' | 'row' | 'colgroup' | 'rowgroup'",
      description:
        '此单元格关联的单元格范围；在充当行标题的 <td> 上设置。',
    },
    {
      name: 'headers',
      type: 'string',
      description:
        '描述此单元格的标题单元格 ID 列表（以空格分隔）。',
    },
    {
      name: 'colSpan',
      type: 'number',
      description:
        '此单元格跨越的列数（标准 HTML <td> 属性）。',
    },
    {
      name: 'rowSpan',
      type: 'number',
      description:
        '此单元格跨越的行数（标准 HTML <td> 属性）。',
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
  description: 'غلاف لعنصر <td> يقرأ TableContext لتطبيق الحشو وفق الكثافة وحجم الخط وحدود الفواصل عند استخدامه داخل Table.',
  propDescriptions: {
    children: 'محتوى الخلية.',
    scope: 'الخلايا التي ترتبط بها هذه الخلية؛ عيّنها على عنصر <td> يعمل كترويسة صف.',
    headers: 'قائمة مفصولة بمسافات بمعرّفات خلايا الترويسة التي تصف هذه الخلية.',
    colSpan: 'عدد الأعمدة التي تمتد عليها هذه الخلية (سمة HTML قياسية لعنصر <td>).',
    rowSpan: 'عدد الصفوف التي تمتد عليها هذه الخلية (سمة HTML قياسية لعنصر <td>).',
    contextMenuActions: 'إجراءات النقر بزر الفأرة الأيمن المعروضة كقائمة سياقية حول محتوى الخلية: مصفوفة من الإجراءات أو دالة تُرجع مصفوفة. القيمة الفارغة أو undefined لا تعرض أي قائمة.',
  },
};

export const docsDense = {
  name: 'TableCell',
  isHiddenFromOverview: true,
  displayName: 'Table Cell',
  description: '<td> wrapper; reads TableContext for density padding, font size, divider borders.',
  propDescriptions: {
    children: 'Cell content.',
    scope: 'scope attr for a <td> acting as a row header',
    headers: 'space-separated header cell IDs',
    colSpan: 'columns spanned',
    rowSpan: 'rows spanned',
    contextMenuActions: 'right-click context menu actions (array or fn); empty = no menu',
  },
};
