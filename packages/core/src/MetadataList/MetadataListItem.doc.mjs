/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'MetadataListItem',
  subComponentOf: 'MetadataList',
  displayName: 'Metadata List Item',
  isHiddenFromOverview: true,
  description: 'A single labeled metadata value within an MetadataList.',
  playground: {
    defaults: {label: 'Status', children: 'Active'},
    wrapper: {component: 'MetadataList'},
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content value for this metadata item.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Label text for this metadata item.',
      required: true,
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon rendered before the label text.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
  ],
};

export const docsZh = {
  name: 'MetadataListItem',
  isHiddenFromOverview: true,
  displayName: 'Metadata List Item',
  description: 'MetadataList 中的单个带标签元数据值。',
  propDescriptions: {
    children: '此元数据项的内容值。',
    label: '此元数据项的标签文本。',
    icon: '标签文本前渲染的图标。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'قيمة بيانات وصفية واحدة ذات تسمية داخل MetadataList.',
  propDescriptions: {
    children: 'قيمة المحتوى لعنصر البيانات الوصفية هذا.',
    label: 'نص التسمية لعنصر البيانات الوصفية هذا.',
    icon: 'أيقونة تُعرض قبل نص التسمية.',
  },
};

export const docsDense = {
  name: 'MetadataListItem',
  isHiddenFromOverview: true,
  displayName: 'Metadata List Item',
  description: 'single labeled value in MetadataList',
  propDescriptions: {
    children: 'value content',
    label: 'label text',
    icon: 'icon before label',
  },
};
