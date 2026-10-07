/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Table',
    required: true,
    description:
      'Semantic table element that groups the table sections, rows, and cells.',
  },
  {
    name: 'Scroll region',
    required: true,
    description:
      'Outer region that scrolls horizontally, enters the keyboard order, and contains overscroll only while the columns overflow.',
  },
  {
    name: 'Header section',
    required: false,
    description:
      'Column-heading section generated when data-driven columns are present or supplied with TableHeader in children mode.',
  },
  {
    name: 'Column header cell',
    required: false,
    description:
      'Cell that identifies one column and may contain sorting or bulk-selection controls.',
  },
  {
    name: 'Sort control',
    required: false,
    description:
      "Button that wraps a sortable column label and changes that column's sort direction.",
  },
  {
    name: 'Sort indicator glyph',
    required: false,
    description: 'Directional symbol rendered by Icon inside a Sort control.',
  },
  {
    name: 'Sort priority',
    required: false,
    description:
      'Number shown for a sorted column when multi-column sorting is active.',
  },
  {
    name: 'Selection control',
    required: false,
    description:
      'CheckboxInput rendered in the header and selectable body rows by the selection plugin.',
  },
  {
    name: 'Body section',
    required: true,
    description:
      'Section containing data rows or the current empty state; data-driven mode renders it automatically.',
  },
  {
    name: 'Row',
    required: false,
    description:
      'Repeated TableRow that groups cells in a standard header, body, or footer row.',
  },
  {
    name: 'Cell',
    required: false,
    description:
      'TableCell containing one value or caller-provided content in a standard body or footer row.',
  },
  {
    name: 'Default empty state',
    required: false,
    description:
      'Compact EmptyState shown for an empty data array unless it is replaced or disabled.',
  },
  {
    name: 'Expansion control',
    required: false,
    description:
      'Button in a leading cell that expands or collapses one expandable row.',
  },
  {
    name: 'Expansion glyph',
    required: false,
    description:
      'Directional symbol rendered by Icon inside an Expansion control.',
  },
  {
    name: 'Expanded detail panel',
    required: false,
    description:
      'Detail row and spanning cell rendered below an expanded row around caller-provided content.',
  },
  {
    name: 'Footer section',
    required: false,
    description:
      'Optional summary or totals section supplied with TableFooter in children mode.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Table',
  displayName: 'Table',
  group: 'Table',
  category: 'Table & List',
  keywords: ["table","datatable","datagrid","spreadsheet","sorting","virtualized","columns","rows","selection","pinning"],
  playground: {
    defaults: {
      data: [
        {name: 'Alice Chen', role: 'Engineer', status: 'Active'},
        {name: 'Bob Smith', role: 'Designer', status: 'Active'},
        {name: 'Carol Wu', role: 'PM', status: 'Away'},
      ],
      columns: [
        {key: 'name', header: 'Name'},
        {key: 'role', header: 'Role'},
        {key: 'status', header: 'Status'},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'solo-table'},
      {className: 'solo-table-scroll-wrapper'},
      {className: 'solo-table-header'},
      {className: 'solo-table-body'},
      {className: 'solo-table-footer'},
      {className: 'solo-table-row'},
      {className: 'solo-table-cell', visualProps: ['density']},
      {className: 'solo-table-header-cell', visualProps: ['density']},
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {className: 'solo-base-table', deprecatedFor: 'table'},
    ],
  },
  description: 'Styled, data-driven table with density, dividers, hover highlight, striped rows, and named plugin support. T must extend Record<string, unknown>.',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description: 'Array of data items to render as rows. T must extend Record<string, unknown> (use `interface MyRow extends Record<string, unknown>` for custom types).',
    },
    {
      name: 'columns',
      type: 'TableColumn<T>[]',
      description: 'Column definitions: each column has {key, header, width?, align?, renderCell?}. The `header` field sets the column heading text. If omitted, columns are auto-generated from data object keys. The `width` field is typed as `ColumnWidth` (not a number); use `proportional(n)` or `pixel(n)` helpers imported from `@solo/core/Table`. Example: `width: pixel(120)` for 120px fixed, `width: proportional(1)` for flex distribution.',
    },
    {
      name: 'idKey',
      type: '(keyof T & string) | ((item: T) => string | number)',
      description: 'Row key for React reconciliation. Pass a property name string or a function. Falls back to row index if omitted.',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: 'Row density controlling cell padding and font size.',
      default: "'balanced'",
    },
    {
      name: 'dividers',
      type: "'rows' | 'columns' | 'grid' | 'none'",
      description: 'Divider style rendered between cells.',
      default: "'rows'",
    },
    {
      name: 'isStriped',
      type: 'boolean',
      description: 'Applies a background wash to even-numbered rows.',
      default: 'false',
    },
    {
      name: 'hasHover',
      type: 'boolean',
      description: 'Applies a hover highlight background to rows on pointer devices.',
      default: 'false',
    },
    {
      name: 'verticalAlign',
      type: "'middle' | 'top' | 'bottom'",
      description: 'Vertical alignment for body row cells. Controls `vertical-align` on the `<td>` elements.',
      default: "'middle'",
    },
    {
      name: 'textOverflow',
      type: "'wrap' | 'truncate'",
      description: "How body cell text behaves when it exceeds the column width. 'wrap' lets text wrap and the row grow taller; 'truncate' clips with an ellipsis (default-rendered cells show a tooltip on hover when truncated). Header cells always truncate.",
      default: "'wrap'",
    },
    {
      name: 'plugins',
      type: 'Record<string, TablePlugin<T>>',
      description: 'Named plugins that extend table behavior via the transform pipeline. Converted to an ordered array internally.',
    },
    {
      name: 'rowIndexStart',
      type: 'number',
      description: 'ARIA row index (1-based) for the first rendered body row. The row ordinal is an accessibility concern independent of any visible index column, so setting this (or rowCount) makes the table emit aria-rowindex on body rows and aria-rowcount on the table. For a paginated/windowed view, pass the offset of the first visible row (e.g. (page - 1) * pageSize + 1) so aria-rowindex reflects position in the full dataset. Data-driven mode only.',
      default: '1',
    },
    {
      name: 'rowCount',
      type: 'number',
      description: 'Total number of body rows across all pages/windows, used for aria-rowcount so assistive tech can announce "row X of Y" against the full dataset. When omitted but rowIndexStart is set (windowed view with an unknown total), aria-rowcount is set to -1 per the ARIA unknown-count convention. Data-driven mode only.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Children mode: compose the table yourself from TableHeader / TableBody / TableFooter, each holding TableRow and TableCell, instead of using data-driven rendering. The children are passed straight to the <table>, so the section is yours to supply. A TableRow placed directly in Table emits <table><tr>, which is invalid HTML and mismatches on hydration (the parser inserts an implied <tbody> for server-rendered markup; React does not on the client). Data-driven mode renders the sections for you.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  components: [
    {name: 'TableHeader'},
    {name: 'TableBody'},
    {name: 'TableFooter'},
    {name: 'TableRow'},
    {name: 'TableCell'},
    {name: 'TableHeaderCell'},
    {name: 'useTableSelection'},
    {name: 'useTableSelectionState'},
    {name: 'TableSelectionToolbar'},
    {name: 'useTableSortable'},
    {name: 'useTableTreeData'},
    {name: 'useTableTreeState'},
    {name: 'useTablePagination'},
    {name: 'useTableColumnSettings'},
    {name: 'useTableFiltering'},
    {name: 'useTableFilterState'},
  ],
  usage: {
    description:
      'Table displays structured data in rows and columns with consistent dimensionality. It supports rich cell content, sorting, selection, pagination, and column management through a composable plugin system. Use Table for data sets with uniform structure; for simpler or inconsistent data, consider a list or card layout instead.',
    bestPractices: [
      { guidance: true, description: 'Use density and divider variants to match the information density and scanning needs of your data.' },
      { guidance: true, description: 'Compose rich cell content with Solo components like Badge, StatusDot, and Avatar via renderCell.' },
      { guidance: true, description: 'In children mode, put every row inside TableHeader, TableBody, or TableFooter. <table> cannot contain a <tr> directly: the HTML parser inserts an implied <tbody> for server-rendered markup and React does not on the client, so unwrapped rows mismatch on hydration.' },
      { guidance: true, description: 'Set explicit width on every column using proportional() or pixel(). proportional(1) gives equal flex distribution with a 120px minimum that prevents columns from collapsing on narrow viewports. Omitting width skips the minimum.' },
      { guidance: true, description: 'Use the data-driven API from React Server Components: proportional(), pixel(), and column definitions without function props are server-safe. Columns using renderCell (or any function prop) need the table wrapped in a "use client" component, since functions cannot cross the server-client boundary.' },
      { guidance: false, description: 'Use a table for data without consistent columns. Use a list or card layout for heterogeneous content.' },
      { guidance: false, description: 'Enable every plugin at once. Add only the features your use case requires to keep the interface focused.' },
      { guidance: false, description: 'Omit width on text-heavy columns; without an explicit proportional() width they have no minimum and can squish to near-zero on mobile.' },
    ],
    anatomy,
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'Table displays structured data in rows and columns with consistent dimensionality. It supports rich cell content, sorting, selection, pagination, and column management through a composable plugin system. Use Table for data sets with uniform structure; for simpler or inconsistent data, consider a list or card layout instead.',
    bestPractices: [
      { guidance: true, description: 'Use density and divider variants to match the information density and scanning needs of your data.' },
      { guidance: true, description: 'Compose rich cell content with Solo components like Badge, StatusDot, and Avatar via renderCell.' },
      { guidance: false, description: 'Use a table for data without consistent columns. Use a list or card layout for heterogeneous content.' },
      { guidance: false, description: 'Enable every plugin at once. Add only the features your use case requires to keep the interface focused.' },
    ],
    anatomy,
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'جدول منسّق يعتمد على البيانات يدعم الكثافة والفواصل وإبراز التمرير والصفوف المخططة والإضافات المسمّاة. يجب أن يمتد T من Record<string, unknown>.',
  propDescriptions: {
    data: 'مصفوفة عناصر البيانات المعروضة كصفوف. يجب أن يمتد T من Record<string, unknown> (استخدم `interface MyRow extends Record<string, unknown>` للأنواع المخصصة).',
    columns: 'تعريفات الأعمدة: لكل عمود {key, header, width?, align?, renderCell?}. يحدد الحقل `header` نص عنوان العمود. إذا حُذفت، تُولَّد الأعمدة تلقائيًا من مفاتيح كائن البيانات. نوع الحقل `width` هو `ColumnWidth` (وليس رقمًا)؛ استخدم الدالتين المساعدتين `proportional(n)` أو `pixel(n)` المستوردتين من `@solo/core/Table`. مثال: `width: pixel(120)` لعرض ثابت قدره 120px، و `width: proportional(1)` للتوزيع المرن.',
    idKey: 'مفتاح الصف لمطابقة React. مرّر اسم خاصية كسلسلة نصية أو دالة. يعود إلى فهرس الصف إذا حُذف.',
    density: 'كثافة الصفوف التي تتحكم في حشو الخلايا وحجم الخط.',
    dividers: 'نمط الفاصل المعروض بين الخلايا.',
    isStriped: 'يطبّق خلفية خفيفة على الصفوف الزوجية.',
    hasHover: 'يطبّق خلفية إبراز عند التمرير على الصفوف في الأجهزة ذات المؤشر.',
    verticalAlign: 'المحاذاة الرأسية لخلايا صفوف الجسم. يتحكم في `vertical-align` على عناصر `<td>`.',
    textOverflow: 'سلوك نص خلية الجسم عندما يتجاوز عرض العمود. تسمح \'wrap\' بالتفاف النص وازدياد ارتفاع الصف؛ وتقتطع \'truncate\' النص بعلامة حذف (تعرض الخلايا المعروضة افتراضيًا تلميحًا عند التمرير إذا اقتُطعت). تُقتطع خلايا العناوين دائمًا.',
    plugins: 'إضافات مسمّاة توسّع سلوك الجدول عبر مسار التحويل. تُحوَّل داخليًا إلى مصفوفة مرتبة.',
    rowIndexStart: 'فهرس صف ARIA (يبدأ من 1) لأول صف معروض في الجسم. ترتيب الصف مسألة تخص إمكانية الوصول ومستقلة عن أي عمود فهرس مرئي، لذا يؤدي تعيين هذه الخاصية (أو rowCount) إلى إصدار الجدول aria-rowindex على صفوف الجسم و aria-rowcount على الجدول. للعرض المقسّم إلى صفحات أو النوافذ، مرّر إزاحة أول صف مرئي (مثل (page - 1) * pageSize + 1) لكي يعكس aria-rowindex الموضع في مجموعة البيانات الكاملة. في الوضع المعتمد على البيانات فقط.',
    rowCount: 'إجمالي عدد صفوف الجسم عبر جميع الصفحات/النوافذ، ويُستخدم لـ aria-rowcount لكي تتمكن التقنيات المساعدة من إعلان "row X of Y" بالنسبة إلى مجموعة البيانات الكاملة. عند حذفه مع تعيين rowIndexStart (عرض نافذي بإجمالي غير معروف)، يُعيَّن aria-rowcount إلى -1 وفق اصطلاح ARIA للعدد غير المعروف. في الوضع المعتمد على البيانات فقط.',
    children: 'وضع العناصر الفرعية: ركّب الجدول بنفسك من TableHeader / TableBody / TableFooter، يحتوي كلٌّ منها على TableRow و TableCell، بدلًا من العرض المعتمد على البيانات. تُمرَّر العناصر الفرعية مباشرة إلى <table>، لذا يقع عليك توفير الأقسام. وضع TableRow مباشرة داخل Table يُنتج <table><tr>، وهو HTML غير صالح ويسبب عدم تطابق عند الترطيب (يُدرج المحلل <tbody> ضمنيًا للترميز المعروض على الخادم؛ بينما لا يفعل React ذلك على العميل). يعرض الوضع المعتمد على البيانات الأقسام نيابةً عنك.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والموضع، والحجم)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث يتجاوز أي صنف متعارض القيمة الافتراضية.',
  },
  usage: {
    description: 'يعرض Table البيانات المنظّمة في صفوف وأعمدة ببنية أبعاد متسقة. يدعم محتوى الخلايا الغني والفرز والتحديد وترقيم الصفحات وإدارة الأعمدة عبر نظام إضافات قابل للتركيب. استخدم Table لمجموعات البيانات ذات البنية الموحّدة؛ أما للبيانات الأبسط أو غير المتسقة، ففكّر في تخطيط قائمة أو بطاقات بدلًا من ذلك.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم أنماط الكثافة والفواصل لمطابقة كثافة المعلومات واحتياجات استعراض بياناتك.',
      },
      {
        guidance: true,
        description: 'ركّب محتوى خلايا غنيًا باستخدام مكوّنات Solo مثل Badge و StatusDot و Avatar عبر renderCell.',
      },
      {
        guidance: true,
        description: 'في وضع العناصر الفرعية، ضع كل صف داخل TableHeader أو TableBody أو TableFooter. لا يمكن أن يحتوي <table> على <tr> مباشرة: إذ يُدرج محلل HTML عنصر <tbody> ضمنيًا للترميز المعروض على الخادم بينما لا يفعل React ذلك على العميل، فتسبب الصفوف غير المغلّفة عدم تطابق عند الترطيب.',
      },
      {
        guidance: true,
        description: 'عيّن عرضًا صريحًا لكل عمود باستخدام proportional() أو pixel(). يمنح proportional(1) توزيعًا مرنًا متساويًا مع حد أدنى قدره 120px يمنع انطواء الأعمدة في أطر العرض الضيقة. حذف العرض يُلغي الحد الأدنى.',
      },
      {
        guidance: true,
        description: 'استخدم الواجهة البرمجية المعتمدة على البيانات من React Server Components: فالدوال proportional() و pixel() وتعريفات الأعمدة دون خصائص دوال آمنة على الخادم. أما الأعمدة التي تستخدم renderCell (أو أي خاصية دالة) فتحتاج إلى تغليف الجدول في مكوّن "use client"، لأن الدوال لا يمكنها عبور الحد بين الخادم والعميل.',
      },
      {
        guidance: false,
        description: 'استخدام جدول لبيانات بلا أعمدة متسقة. استخدم تخطيط قائمة أو بطاقات للمحتوى غير المتجانس.',
      },
      {
        guidance: false,
        description: 'تفعيل جميع الإضافات دفعة واحدة. أضف فقط الميزات التي تتطلبها حالة الاستخدام للحفاظ على تركيز الواجهة.',
      },
      {
        guidance: false,
        description: 'حذف العرض في الأعمدة كثيفة النص؛ فبدون عرض proportional() صريح لا يكون لها حد أدنى وقد تنضغط إلى ما يقارب الصفر على الأجهزة المحمولة.',
      },
    ],
    anatomy: [
      {
        name: 'الجدول',
        required: true,
        description: 'عنصر جدول دلالي يجمع أقسام الجدول وصفوفه وخلاياه.',
      },
      {
        name: 'منطقة التمرير',
        required: true,
        description: 'منطقة خارجية تُمرَّر أفقيًا وتدخل ترتيب لوحة المفاتيح وتحتوي التمرير الزائد فقط أثناء فيض الأعمدة.',
      },
      {
        name: 'قسم العناوين',
        required: false,
        description: 'قسم عناوين الأعمدة الذي يُولَّد عند وجود أعمدة معتمدة على البيانات أو يُوفَّر عبر TableHeader في وضع العناصر الفرعية.',
      },
      {
        name: 'خلية عنوان العمود',
        required: false,
        description: 'خلية تعرّف عمودًا واحدًا وقد تحتوي على عناصر تحكم الفرز أو التحديد الجماعي.',
      },
      {
        name: 'عنصر تحكم الفرز',
        required: false,
        description: 'زر يلتف حول تسمية عمود قابل للفرز ويغيّر اتجاه فرز ذلك العمود.',
      },
      {
        name: 'رمز مؤشر الفرز',
        required: false,
        description: 'رمز اتجاهي يعرضه Icon داخل عنصر تحكم الفرز.',
      },
      {
        name: 'أولوية الفرز',
        required: false,
        description: 'رقم يُعرض للعمود المفروز عند تفعيل الفرز متعدد الأعمدة.',
      },
      {
        name: 'عنصر تحكم التحديد',
        required: false,
        description: 'CheckboxInput تعرضه إضافة التحديد في العنوان وفي صفوف الجسم القابلة للتحديد.',
      },
      {
        name: 'قسم الجسم',
        required: true,
        description: 'قسم يحتوي على صفوف البيانات أو حالة الفراغ الحالية؛ ويعرضه الوضع المعتمد على البيانات تلقائيًا.',
      },
      {
        name: 'الصف',
        required: false,
        description: 'TableRow متكرر يجمع الخلايا في صف قياسي للعناوين أو الجسم أو التذييل.',
      },
      {
        name: 'الخلية',
        required: false,
        description: 'TableCell يحتوي على قيمة واحدة أو محتوى يوفره المستدعي في صف قياسي للجسم أو التذييل.',
      },
      {
        name: 'حالة الفراغ الافتراضية',
        required: false,
        description: 'EmptyState مدمجة تُعرض لمصفوفة بيانات فارغة ما لم تُستبدل أو تُعطَّل.',
      },
      {
        name: 'عنصر تحكم التوسيع',
        required: false,
        description: 'زر في خلية بادئة يوسّع صفًا واحدًا قابلًا للتوسيع أو يطويه.',
      },
      {
        name: 'رمز التوسيع',
        required: false,
        description: 'رمز اتجاهي يعرضه Icon داخل عنصر تحكم التوسيع.',
      },
      {
        name: 'لوحة التفاصيل الموسّعة',
        required: false,
        description: 'صف تفاصيل وخلية ممتدة يُعرضان أسفل الصف الموسّع حول محتوى يوفره المستدعي.',
      },
      {
        name: 'قسم التذييل',
        required: false,
        description: 'قسم اختياري للملخص أو الإجماليات يُوفَّر عبر TableFooter في وضع العناصر الفرعية.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Data-driven table w/ rich cell content via renderCell. Compose cells w/ Badge, StatusDot, Text, Avatar, layout primitives. BaseTable provides unstyled structural core w/ composable plugin pipeline.',
  usage: {
    description:
      'Table displays structured data in rows and columns with consistent dimensionality. It supports rich cell content, sorting, selection, pagination, and column management through a composable plugin system. Use Table for data sets with uniform structure; for simpler or inconsistent data, consider a list or card layout instead.',
    bestPractices: [
      { guidance: true, description: 'Use density and divider variants to match the information density and scanning needs of your data.' },
      { guidance: true, description: 'Compose rich cell content with Solo components like Badge, StatusDot, and Avatar via renderCell.' },
      { guidance: true, description: 'Children mode: wrap rows in TableHeader/TableBody/TableFooter. <table> cannot hold a <tr> directly; the parser adds an implied <tbody> for SSR markup, React does not on the client, so unwrapped rows mismatch on hydration.' },
      { guidance: true, description: 'Set explicit width on every column via proportional() or pixel(). proportional(1) = equal flex w/ 120px min preventing collapse on narrow viewports. Omitting width skips the minimum.' },
      { guidance: true, description: 'Data-driven API is RSC-safe: proportional(), pixel(), column defs w/o function props work in Server Components. renderCell (any function prop) requires a "use client" wrapper.' },
      { guidance: false, description: 'Use a table for data without consistent columns. Use a list or card layout for heterogeneous content.' },
      { guidance: false, description: 'Enable every plugin at once. Add only the features your use case requires to keep the interface focused.' },
      { guidance: false, description: 'Omit width on text-heavy columns; w/o explicit proportional() width they have no minimum and can squish to near-zero on mobile.' },
    ],
    anatomy,
  },
};