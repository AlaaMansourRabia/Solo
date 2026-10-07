/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TableRow',
  subComponentOf: 'Table',
  displayName: 'Table Row',
  isHiddenFromOverview: true,
  description: '<tr> wrapper that reads TableContext to apply striped, hover, and divider styles when used inside Table.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Row cell elements.',
      required: true,
    },
    {
      name: 'isHeaderRow',
      type: 'boolean',
      description:
        'Marks the row as the header row, which skips the striped and hover styling meant for body rows.',
    },
  ],
};

export const docsZh = {
  name: 'TableRow',
  isHiddenFromOverview: true,
  displayName: 'Table Row',
  description: '<tr> 包装器，读取 TableContext 以在 Table 内部使用时应用条纹、悬停和分隔线样式。',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: '行单元格元素。',
      required: true,
    },
    {
      name: 'isHeaderRow',
      type: 'boolean',
      description:
        '将该行标记为表头行，跳过仅用于表体行的斑马纹和悬停样式。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'غلاف <tr> يقرأ TableContext لتطبيق أنماط التخطيط المتناوب والتمرير والفواصل عند استخدامه داخل Table.',
  propDescriptions: {
    children: 'عناصر خلايا الصف.',
    isHeaderRow:
      'يحدّد الصف بوصفه صف الترويسة، مما يتخطّى أنماط التناوب والتمرير المخصّصة لصفوف المتن.',
  },
};

export const docsDense = {
  name: 'TableRow',
  isHiddenFromOverview: true,
  displayName: 'Table Row',
  description: '<tr> wrapper; reads TableContext for striped/hover/divider styles.',
  propDescriptions: {
    children: 'Row cell elements.',
    isHeaderRow: 'header row: skips striped/hover body-row styling',
  },
};
