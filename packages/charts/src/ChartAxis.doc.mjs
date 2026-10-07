/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ChartAxis',
  displayName: 'Chart Axis',
  group: 'Charts',
  category: 'Data Visualization',
  isHiddenFromOverview: true,
  keywords: ['chart', 'axis', 'ticks', 'labels', 'scale', 'data visualization'],

  usage: {
    description:
      'ChartAxis renders tick labels and optional edge and tick lines from the scales owned by a parent Chart. Use it in the Chart axes slot for physical top, right, bottom, or left plot edges.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use ChartAxis inside Chart so its labels, ticks, and edge line share the same scales and plot dimensions as the marks.',
      },
      {
        guidance: true,
        description:
          'Use tickFormat for product-specific units or locale formatting, and maxTicks or truncate when dense category labels need a bounded presentation.',
      },
      {
        guidance: false,
        description:
          'Use axis labels or a pointer tooltip as the only way to obtain important values. Give Chart an accessible name and preserve an equivalent data view or summary.',
      },
      {
        guidance: false,
        description:
          'Hide the edge line while showing tick marks. showTicks intentionally keeps the line visible so each mark has a grounded edge.',
      },
    ],
    accessibility: [
      {
        name: 'Chart alternative',
        category: 'Content',
        criterion: '1.1.1 Non-text Content',
        requirement: 'Required on the parent Chart',
        states: ['All'],
        description:
          'Chart owns the accessible image name and supported small-data table. Tick labels supplement that chart-level alternative rather than replacing it.',
      },
      {
        name: 'Label text integrity',
        category: 'Content',
        criterion: 'Unicode grapheme clusters',
        requirement: 'Required when truncate is set',
        states: ['Truncated labels'],
        description:
          'Truncation keeps emoji, joined emoji sequences, flags, and combining marks intact before appending the ellipsis.',
      },
    ],
    anatomy: [
      {
        name: 'Axis edge line',
        required: false,
        description:
          'Line along the selected plot edge. It is shown by default only on the bottom edge and whenever tick marks are shown.',
      },
      {
        name: 'Tick marks',
        required: false,
        description:
          'Short lines extending outward from each retained tick position.',
      },
      {
        name: 'Tick labels',
        required: true,
        description:
          'Formatted scale values or categories positioned outside the selected plot edge.',
      },
    ],
  },

  props: [
    {
      name: 'position',
      type: "'top' | 'right' | 'bottom' | 'left'",
      description: 'Physical plot edge on which to render the axis.',
      required: true,
    },
    {
      name: 'tickCount',
      type: 'number',
      description:
        'Approximate continuous-scale tick count. d3 chooses the final values.',
      default: '5',
    },
    {
      name: 'maxTicks',
      type: 'number',
      description:
        'Maximum displayed label count. Labels are evenly skipped when the generated set is larger.',
    },
    {
      name: 'tickFormat',
      type: '(value: unknown) => string',
      description:
        'Formats each retained tick. When omitted, continuous scales use d3 formatting and band scales use their category strings.',
    },
    {
      name: 'truncate',
      type: 'number',
      description:
        'Maximum content characters retained before an ellipsis is appended. User-perceived characters remain intact.',
    },
    {
      name: 'animated',
      type: 'boolean',
      description:
        'Whether tick position and visibility changes use the built-in transition.',
      default: 'true',
    },
    {
      name: 'showAxisLine',
      type: 'boolean',
      description:
        'Whether to draw the edge line. Tick marks force the line on so they remain grounded.',
      default: 'true for bottom; false for top, right, and left',
    },
    {
      name: 'showTicks',
      type: 'boolean',
      description: 'Whether to draw an outward mark at each retained tick.',
      default: 'false',
    },
  ],

  examples: [
    {
      label: 'Bottom and left axes',
      code: `import {Chart, ChartAxis, ChartGrid, bar} from '@solo/charts';

<Chart
  data={monthlyRevenue}
  xKey="month"
  series={[bar('revenue')]}
  grid={<ChartGrid horizontal />}
  axes={
    <>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" tickFormat={value => String(value)} />
    </>
  }
/>;`,
    },
    {
      label: 'Dense category labels',
      code: `<ChartAxis
  position="bottom"
  maxTicks={8}
  truncate={12}
  showTicks
/>;`,
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض ChartAxis تسميات العلامات وخط الحافة وخطوط العلامات الاختيارية على حافة المخطط المحددة اعتمادًا على المقاييس التي يملكها المكوّن الأب Chart.',
  propDescriptions: {
    position: 'حافة منطقة الرسم الفعلية التي يُعرض عليها المحور.',
    tickCount: 'العدد التقريبي للعلامات في المقاييس المتصلة، وتختار d3 القيم النهائية.',
    maxTicks: 'الحد الأقصى لعدد التسميات المعروضة. تُتخطّى التسميات بالتساوي عندما تكون المجموعة المولَّدة أكبر.',
    tickFormat: 'ينسّق كل علامة مُبقاة. عند إغفاله، تستخدم المقاييس المتصلة تنسيق d3 وتستخدم المقاييس الفئوية (band) نصوص فئاتها.',
    truncate: 'الحد الأقصى لعدد أحرف المحتوى المُبقاة قبل إلحاق علامة الحذف (…). تبقى الأحرف كما يدركها المستخدم سليمة.',
    animated: 'ما إذا كانت تغييرات موضع العلامات وظهورها تستخدم الانتقال المدمج.',
    showAxisLine: 'ما إذا كان يُرسم خط الحافة. تفرض علامات المحور إظهار الخط كي تبقى مرتكزة عليه.',
    showTicks: 'ما إذا كانت تُرسم علامة متجهة إلى الخارج عند كل علامة مُبقاة.',
  },
  usage: {
    description: 'يعرض ChartAxis تسميات العلامات وخط الحافة وخطوط العلامات الاختيارية انطلاقًا من المقاييس التي يملكها المكوّن الأب Chart. استخدمه في خانة المحاور في Chart لحواف منطقة الرسم الفعلية: العلوية أو اليمنى أو السفلية أو اليسرى.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم ChartAxis داخل Chart كي تتشارك تسمياته وعلاماته وخط حافته المقاييس وأبعاد منطقة الرسم نفسها مع العناصر المرسومة.',
      },
      {
        guidance: true,
        description: 'استخدم tickFormat للوحدات الخاصة بالمنتج أو للتنسيق وفق الإعدادات المحلية، واستخدم maxTicks أو truncate عندما تحتاج تسميات الفئات الكثيفة إلى عرض محدود.',
      },
      {
        guidance: false,
        description: 'اجعل تسميات المحور أو تلميح المؤشر الطريقة الوحيدة للحصول على القيم المهمة. امنح Chart اسمًا قابلًا للوصول، وحافظ على عرض مكافئ للبيانات أو ملخص لها.',
      },
      {
        guidance: false,
        description: 'أخفِ خط الحافة مع إظهار علامات المحور. تُبقي showTicks الخط ظاهرًا عمدًا كي ترتكز كل علامة على حافة.',
      },
    ],
    anatomy: [
      {
        name: 'خط حافة المحور',
        required: false,
        description: 'خط على امتداد حافة منطقة الرسم المحددة. يظهر افتراضيًا على الحافة السفلية فقط، وكلما ظهرت علامات المحور.',
      },
      {
        name: 'علامات المحور',
        required: false,
        description: 'خطوط قصيرة تمتد إلى الخارج من موضع كل علامة مُبقاة.',
      },
      {
        name: 'تسميات العلامات',
        required: true,
        description: 'قيم المقياس أو الفئات المنسَّقة، موضوعة خارج حافة منطقة الرسم المحددة.',
      },
    ],
  },
};
