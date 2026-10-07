/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'useTablePagination',
  subComponentOf: 'Table',
  displayName: 'useTablePagination',
  description: 'Headless pagination plugin for Table. Call with a config object: `useTablePagination({ page, onPageChange, totalItems })`. Returns a TablePlugin to pass to `<Table plugins={{ pagination: paginationPlugin }} />`.',
  usage: {
    description: 'Call useTablePagination with a config object containing page state and callback. Pass the returned plugin to Table via the plugins prop.',
  },
  props: [
    {
      name: 'page',
      type: 'number',
      description: 'Current page number (1-based).',
      required: true,
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      description: 'Called when the page changes.',
      required: true,
    },
    {
      name: 'totalItems',
      type: 'number',
      description: 'Total number of items across all pages. Used to calculate total page count.',
    },
    {
      name: 'totalPages',
      type: 'number',
      description: 'Total number of pages. Use when you know the page count but not item count.',
    },
    {
      name: 'hasMore',
      type: 'boolean',
      description: 'Whether more pages exist. Use for cursor-based pagination where the total is unknown.',
    },
    {
      name: 'pageSize',
      type: 'number',
      description: 'Number of items per page.',
      default: '10',
    },
    {
      name: 'onPageSizeChange',
      type: '(pageSize: number) => void',
      description: 'Called when the user changes the page size. Shows a page size dropdown when provided with pageSizeOptions.',
    },
    {
      name: 'pageSizeOptions',
      type: 'number[]',
      description: 'Available page size options. Shows a page size selector when provided.',
    },
    {
      name: 'variant',
      type: "'pages' | 'count' | 'compact' | 'dots' | 'none'",
      description: 'Visual variant for the pagination controls.',
      default: "'pages'",
    },
    {
      name: 'position',
      type: "'below' | 'above' | 'both' | 'none'",
      description: 'Where to render pagination controls relative to the table.',
      default: "'below'",
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      description: 'Horizontal alignment of the pagination controls.',
      default: "'center'",
    },
    {
      name: 'label',
      type: 'string',
      description: "Accessible name for the pagination nav landmark. With position='both' the two navs get distinct names (the label suffixed as '(top)' and '(bottom)') so same-type landmarks stay unique (axe landmark-unique).",
      default: "'Table pagination'",
    },
  ],
};

export const docsZh = {
  name: 'useTablePagination',
  displayName: 'useTablePagination',
  description: '无头分页插件。支持客户端切片、服务器端分页和游标分页。自动渲染 Pagination 控件。',
  props: [
    {
      name: 'page',
      type: 'number',
      description: '当前页码（从 1 开始）。',
      required: true,
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      description: '页面更改时调用。',
      required: true,
    },
    {
      name: 'totalItems',
      type: 'number',
      description: '所有页面的总项目数。用于计算总页数。',
    },
    {
      name: 'pageSize',
      type: 'number',
      description: '每页项目数。',
      default: '10',
    },
    {
      name: 'variant',
      type: "'pages' | 'count' | 'compact' | 'dots' | 'none'",
      description: '分页控件的视觉变体。',
      default: "'pages'",
    },
    {
      name: 'position',
      type: "'below' | 'above' | 'both' | 'none'",
      description: '分页控件相对于表格的渲染位置。',
      default: "'below'",
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'إضافة ترقيم صفحات بلا واجهة لـ Table. استدعِها بكائن إعدادات: `useTablePagination({ page, onPageChange, totalItems })`. تُرجع TablePlugin لتمريرها إلى `<Table plugins={{ pagination: paginationPlugin }} />`.',
  propDescriptions: {
    page: 'رقم الصفحة الحالية (يبدأ من 1).',
    onPageChange: 'تُستدعى عند تغيّر الصفحة.',
    totalItems: 'إجمالي عدد العناصر عبر جميع الصفحات. يُستخدم لحساب إجمالي عدد الصفحات.',
    totalPages: 'إجمالي عدد الصفحات. استخدمها عندما تعرف عدد الصفحات دون عدد العناصر.',
    hasMore: 'ما إذا كانت هناك صفحات إضافية. استخدمها لترقيم الصفحات المعتمد على المؤشر حين يكون الإجمالي غير معروف.',
    pageSize: 'عدد العناصر في كل صفحة.',
    onPageSizeChange: 'تُستدعى عندما يغيّر المستخدم حجم الصفحة. تعرض قائمة منسدلة لحجم الصفحة عند تمريرها مع pageSizeOptions.',
    pageSizeOptions: 'خيارات حجم الصفحة المتاحة. تعرض محدِّدًا لحجم الصفحة عند تمريرها.',
    variant: 'النمط المرئي لعناصر التحكم في ترقيم الصفحات.',
    position: 'موضع عرض عناصر التحكم في ترقيم الصفحات بالنسبة إلى الجدول.',
    align: 'المحاذاة الأفقية لعناصر التحكم في ترقيم الصفحات.',
    label: 'الاسم القابل للوصول لمَعلم التنقّل الخاص بترقيم الصفحات. مع position=\'both\' يحصل عنصرا التنقّل على اسمين مختلفين (تُضاف إلى التسمية اللاحقة \'(top)\' و\'(bottom)\') كي تبقى المَعالم من النوع نفسه فريدة (axe landmark-unique).',
  },
  usage: {
    description: 'استدعِ useTablePagination بكائن إعدادات يحتوي على حالة الصفحة ودالة الاستدعاء، ثم مرّر الإضافة المُرجعة إلى Table عبر الخاصية plugins.',
  },
};

export const docsDense = {
  name: 'useTablePagination',
  displayName: 'useTablePagination',
  description: 'Headless pagination plugin. Client-side slicing, server-side, or cursor-based. Auto-renders Pagination above/below/both.',
  propDescriptions: {
    page: 'Current page (1-based).',
    onPageChange: 'Called on page change.',
    totalItems: 'Total items across all pages.',
    pageSize: 'Items per page. Default 10.',
    variant: "Pagination variant: 'pages'|'count'|'compact'|'dots'|'none'.",
    position: "Render position: 'below'|'above'|'both'|'none'.",
    label: "Accessible name for the nav landmark; position='both' emits '<label> (top)' / '<label> (bottom)'.",
  },
};
