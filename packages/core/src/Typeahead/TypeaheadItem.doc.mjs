/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'TypeaheadItem',
  subComponentOf: 'Typeahead',
  displayName: 'Typeahead Item',
  description: 'Default dropdown item renderer for typeahead results. Shows label with optional icon, description, and avatar. Exported for use in custom renderItem implementations.',
  props: [
    {
      name: 'item',
      type: 'T',
      description: 'The search result item to render. T extends SearchableItem ({id, label, element?, auxiliaryData?}).',
      required: true,
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon or avatar to display before the label.',
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
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed below the label.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether this item is visually disabled.',
      default: 'false',
    },
    {
      name: 'group',
      type: 'string',
      description: 'Group label for grouping items visually.',
    },
  ],
};

export const docsZh = {
  name: 'TypeaheadItem',
  displayName: 'Typeahead Item',
  description: '预输入结果的默认下拉项渲染器。显示标签以及可选的图标、描述和头像。导出供自定义 renderItem 实现使用。',
  props: [
    {
      name: 'item',
      type: 'T',
      description: '要渲染的搜索结果项。T 继承自 SearchableItem（{id, label, element?, auxiliaryData?}）。',
      required: true,
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: '在标签前显示的图标或头像。',
    },
    {
      name: 'description',
      type: 'string',
      description: '显示在标签下方的描述文本。',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: '此项是否在视觉上被禁用。',
      default: 'false',
    },
    {
      name: 'group',
      type: 'string',
      description: '用于视觉分组的分组标签。',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'أداة العرض الافتراضية لعناصر القائمة المنسدلة في نتائج typeahead. تعرض التسمية مع أيقونة ووصف وصورة رمزية اختيارية. مُصدَّرة للاستخدام في تطبيقات renderItem المخصصة.',
  propDescriptions: {
    item: 'عنصر نتيجة البحث المراد عرضه. يمتد T من SearchableItem ({id, label, element?, auxiliaryData?}).',
    icon: 'أيقونة أو صورة رمزية تُعرض قبل التسمية.',
    description: 'نص وصفي يُعرض أسفل التسمية.',
    isDisabled: 'ما إذا كان هذا العنصر معطَّلًا بصريًا.',
    group: 'تسمية المجموعة لتجميع العناصر بصريًا.',
  },
};

export const docsDense = {
  name: 'TypeaheadItem',
  displayName: 'Typeahead Item',
  description: 'Default dropdown item renderer. Label w/ optional icon, description, avatar. Exported for custom renderItem.',
  propDescriptions: {
    item: 'Search result item to render.',
    icon: 'Icon/avatar before label.',
    description: 'Text below label.',
    isDisabled: 'Visually disabled.',
    group: 'Group label for visual grouping.',
  },
};
