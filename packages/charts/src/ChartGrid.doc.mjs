/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ChartGrid',
  displayName: 'Chart Grid',
  group: 'Charts',
  category: 'Data Visualization',
  isHiddenFromOverview: true,
  keywords: ['chart', 'grid', 'guides', 'axis', 'ticks', 'data visualization'],

  usage: {
    description:
      'ChartGrid draws horizontal and vertical guide lines from the scales owned by a parent Chart. Use it in the Chart grid slot so guides share the plot dimensions and tick values used by the chart.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pair ChartGrid with ChartAxis when readers need labelled values beside the guide lines.',
      },
      {
        guidance: true,
        description:
          'Use horizontal guides for value comparison and add vertical guides only when they help readers align categories or continuous x values.',
      },
      {
        guidance: false,
        description:
          'Use grid lines as the only way to communicate a value or distinction. Keep meaningful chart information in labels, marks, and the parent Chart alternative.',
      },
      {
        guidance: false,
        description:
          'Expect tickCount to thin categorical band centers. It requests density only for continuous scales; categorical vertical guides render once per band.',
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
          'Chart owns the accessible image name and supported small-data table. Grid lines supplement that chart-level alternative rather than replacing it.',
      },
      {
        name: 'Visual-only guides',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: 'Do not carry information alone',
        states: ['Horizontal', 'Vertical', 'Combined'],
        description:
          'Grid lines are supporting guides. Preserve visible labels, marks, or another qualifying cue so understanding does not depend on the grid alone.',
      },
    ],
    anatomy: [
      {
        name: 'Grid lines',
        required: false,
        description:
          'Horizontal lines at continuous y ticks and vertical lines at x ticks or categorical band centers.',
      },
    ],
  },

  props: [
    {
      name: 'horizontal',
      type: 'boolean',
      description:
        'Whether to draw horizontal guides at continuous y ticks other than zero.',
      default: 'true',
    },
    {
      name: 'vertical',
      type: 'boolean',
      description:
        'Whether to draw vertical guides at continuous x ticks or categorical band centers.',
      default: 'false',
    },
    {
      name: 'tickCount',
      type: 'number',
      description:
        'Approximate guide count requested from continuous scales. It does not thin categorical band centers.',
      default: '5',
    },
  ],

  examples: [
    {
      label: 'Horizontal guides',
      code: `import {Chart, ChartGrid, bar} from '@solo/charts';

<Chart
  data={monthlyRevenue}
  xKey="month"
  series={[bar('revenue')]}
  grid={<ChartGrid />}
/>;`,
    },
    {
      label: 'Horizontal and vertical guides',
      code: `<Chart
  data={monthlyRevenue}
  xKey="month"
  series={[bar('revenue')]}
  grid={<ChartGrid horizontal vertical tickCount={6} />}
/>;`,
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يرسم ChartGrid خطوطًا إرشادية أفقية ورأسية مستمدة من مقاييس المكوّن الأب Chart.',
  propDescriptions: {
    horizontal: 'ما إذا كان سيتم رسم خطوط إرشادية أفقية عند علامات المحور y المستمرة باستثناء الصفر.',
    vertical: 'ما إذا كان سيتم رسم خطوط إرشادية رأسية عند علامات المحور x المستمرة أو عند مراكز نطاقات الفئات.',
    tickCount: 'العدد التقريبي للخطوط الإرشادية المطلوب من المقاييس المستمرة. لا يقلّل مراكز نطاقات الفئات.',
  },
  usage: {
    description: 'يرسم ChartGrid خطوطًا إرشادية أفقية ورأسية من المقاييس التي يملكها المكوّن الأب Chart. استخدمه في موضع الشبكة داخل Chart كي تتشارك الخطوط الإرشادية أبعاد منطقة الرسم وقيم العلامات التي يستخدمها المخطط.',
    bestPractices: [
      {guidance: true, description: 'اقرن ChartGrid بـ ChartAxis عندما يحتاج القرّاء إلى قيم مُسمّاة بجانب الخطوط الإرشادية.'},
      {guidance: true, description: 'استخدم الخطوط الإرشادية الأفقية لمقارنة القيم، وأضف الخطوط الرأسية فقط عندما تساعد القرّاء على محاذاة الفئات أو قيم x المستمرة.'},
      {guidance: false, description: 'استخدام خطوط الشبكة كوسيلة وحيدة لإيصال قيمة أو تمييز. أبقِ معلومات المخطط المهمة في التسميات والعلامات والبديل النصي للمكوّن الأب Chart.'},
      {guidance: false, description: 'توقّع أن يقلّل tickCount مراكز نطاقات الفئات. فهو يطلب الكثافة للمقاييس المستمرة فقط؛ أما الخطوط الرأسية للفئات فتُعرض مرة واحدة لكل نطاق.'},
    ],
    anatomy: [
      {name: 'خطوط الشبكة', required: false, description: 'خطوط أفقية عند علامات y المستمرة وخطوط رأسية عند علامات x أو مراكز نطاقات الفئات.'},
    ],
  },
};
