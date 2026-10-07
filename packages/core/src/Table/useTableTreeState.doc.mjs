/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'useTableTreeState',
  subComponentOf: 'Table',
  displayName: 'useTableTreeState',
  description:
    'State management companion for useTableTreeData. Owns the expanded set (controlled or uncontrolled) and flattens nested data into the visible row array; collapsed subtrees are unmounted, not hidden, so the table body contains exactly the visible rows. Returns expandAll/collapseAll helpers, the aggregate isAllExpanded state (true/false/indeterminate) for a header expand-all control, and a ready-to-use config for the tree plugin. Note: because collapsed rows unmount, cell-local React state inside collapsed subtrees is lost on collapse; lift state that must survive.',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description:
        'Nested data: rows may carry child rows under childrenKey. Flat data (no children anywhere) makes the plugin a no-op, so it can be adopted before the data becomes hierarchical.',
      required: true,
    },
    {
      name: 'idKey',
      type: '(keyof T & string) | ((item: T) => string | number)',
      description:
        'Row ID accessor: property name or function returning a unique id.',
      required: true,
    },
    {
      name: 'childrenKey',
      type: 'string',
      description: 'Property holding each row\'s children array.',
      default: "'children'",
    },
    {
      name: 'defaultExpandedIds',
      type: 'Iterable<string>',
      description:
        'Initial expanded row ids for uncontrolled mode. Ignored when expandedIds is provided.',
    },
    {
      name: 'expandedIds',
      type: 'ReadonlySet<string>',
      description:
        'Controlled set of expanded row ids. Pair with onExpandedIdsChange.',
    },
    {
      name: 'onExpandedIdsChange',
      type: '(ids: ReadonlySet<string>) => void',
      description:
        'Called with the next expanded set whenever expansion changes (both modes). In lazy-loading setups, trigger the children fetch here.',
    },
    {
      name: 'isItemExpandable',
      type: '(item: T) => boolean',
      description:
        'Should this row show an expander? Overrides the default non-empty-children check; use for lazy loading, where a row is expandable before its children have been fetched.',
    },
    {
      name: 'sortSiblings',
      type: '(siblings: T[]) => T[]',
      description:
        'Sort each sibling group independently during flattening; children always stay directly under their parent. Pass applySort from useTableSortableState to compose with column sorting.',
    },
    {
      name: 'indent',
      type: "'sm' | 'md' | 'lg'",
      description:
        'Indent step per level (spacing-3 / spacing-4 / spacing-6), forwarded to useTableTreeData.',
      default: "'md'",
    },
    {
      name: 'treeColumnKey',
      type: 'string',
      description:
        'Column that carries the indent + expander, forwarded to useTableTreeData. Defaults to the first column.',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'مرافق لإدارة الحالة لـ useTableTreeData. يملك مجموعة العناصر الموسّعة (متحكَّم بها أو غير متحكَّم بها) ويسطّح البيانات المتداخلة إلى مصفوفة الصفوف المرئية؛ تُزال الأشجار الفرعية المطوية من التركيب ولا تُخفى فقط، لذا يحتوي جسم الجدول على الصفوف المرئية بالضبط. يُرجع الدالتين المساعدتين expandAll/collapseAll، والحالة الإجمالية isAllExpanded (true/false/indeterminate) لعنصر تحكم توسيع الكل في العنوان، وإعدادًا جاهزًا للاستخدام لإضافة الشجرة. ملاحظة: لأن الصفوف المطوية تُزال من التركيب، تُفقد حالة React المحلية للخلايا داخل الأشجار الفرعية المطوية عند الطي؛ لذا ارفع الحالة التي يجب أن تبقى.',
  propDescriptions: {
    data: 'بيانات متداخلة: قد تحمل الصفوف صفوفًا فرعية تحت childrenKey. البيانات المسطّحة (بلا عناصر فرعية في أي مكان) تجعل الإضافة بلا أثر، لذا يمكن اعتمادها قبل أن تصبح البيانات هرمية.',
    idKey: 'دالة الوصول إلى معرّف الصف: اسم خاصية أو دالة تُرجع معرّفًا فريدًا.',
    childrenKey: 'الخاصية التي تحمل مصفوفة العناصر الفرعية لكل صف.',
    defaultExpandedIds: 'معرّفات الصفوف الموسّعة مبدئيًا في الوضع غير المتحكَّم به. تُتجاهل عند توفير expandedIds.',
    expandedIds: 'مجموعة متحكَّم بها من معرّفات الصفوف الموسّعة. استخدمها مع onExpandedIdsChange.',
    onExpandedIdsChange: 'يُستدعى بالمجموعة الموسّعة التالية كلما تغيّر التوسيع (في كلا الوضعين). في إعدادات التحميل الكسول، ابدأ جلب العناصر الفرعية هنا.',
    isItemExpandable: 'هل ينبغي أن يعرض هذا الصف زر توسيع؟ يتجاوز الفحص الافتراضي لوجود عناصر فرعية غير فارغة؛ استخدمه للتحميل الكسول، حيث يكون الصف قابلًا للتوسيع قبل جلب عناصره الفرعية.',
    sortSiblings: 'يفرز كل مجموعة أشقاء بشكل مستقل أثناء التسطيح؛ وتبقى العناصر الفرعية دائمًا أسفل أصلها مباشرة. مرّر applySort من useTableSortableState للتركيب مع فرز الأعمدة.',
    indent: 'خطوة الإزاحة لكل مستوى (spacing-3 / spacing-4 / spacing-6)، تُمرَّر إلى useTableTreeData.',
    treeColumnKey: 'العمود الذي يحمل الإزاحة وزر التوسيع، يُمرَّر إلى useTableTreeData. القيمة الافتراضية العمود الأول.',
  },
};

export const docsDense = {
  name: 'useTableTreeState',
  displayName: 'useTableTreeState',
  description:
    'State companion for useTableTreeData. Owns expanded set (controlled or uncontrolled), flattens nested data to visible rows (collapsed subtrees unmounted, not hidden). Returns {visibleData, treeConfig, expandedIds, isAllExpanded, expandAll, collapseAll} (isAllExpanded = true/false/indeterminate for a header expand-all control). Cell-local state in collapsed subtrees is lost on collapse; lift state that must survive.',
  propDescriptions: {
    data: 'nested data; rows carry child rows under childrenKey. Flat data => plugin is a no-op.',
    idKey: 'row ID accessor: property name or fn returning unique id',
    childrenKey: "property holding children array. Defaults to 'children'.",
    defaultExpandedIds: 'initial expanded ids (uncontrolled)',
    expandedIds: 'controlled expanded set; pair with onExpandedIdsChange',
    onExpandedIdsChange:
      'called with next expanded set on change (both modes); trigger lazy children fetch here',
    isItemExpandable:
      'overrides non-empty-children expandability check (lazy loading)',
    sortSiblings:
      'sorts each sibling group during flattening; pass applySort from useTableSortableState',
    indent: "indent step per level: 'sm' | 'md' | 'lg'. Defaults to 'md'.",
    treeColumnKey: 'column carrying indent + expander. Defaults to first column.',
  },
};
