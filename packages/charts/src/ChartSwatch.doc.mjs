/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ChartSwatch',
  displayName: 'Chart Swatch',
  group: 'Charts',
  category: 'Data Visualization',
  isHiddenFromOverview: true,
  keywords: [
    'chart',
    'swatch',
    'series',
    'legend',
    'tooltip',
    'data visualization',
  ],

  usage: {
    description:
      'ChartSwatch renders the small decorative mark that pairs a chart series color with its visible label. Use a square for bar series and a short line for other series, including line, dot, and area marks.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Place every swatch next to visible text that names the corresponding series. ChartSwatch is decorative and stays hidden from assistive technology.',
      },
      {
        guidance: true,
        description:
          'Use the square variant for bar series and the line variant for other mark types so legends and tooltips echo the plotted marks consistently.',
      },
      {
        guidance: false,
        description:
          'Use ChartSwatch as the accessible name or data alternative for a series. Its surrounding legend, tooltip, or chart must provide that information.',
      },
      {
        guidance: false,
        description:
          'Rely on arbitrary colors alone when multiple same-shaped series must be matched across a chart. Verify the complete chart and its labels together.',
      },
    ],
    accessibility: [
      {
        name: 'Decorative mark',
        category: 'Semantics',
        criterion: '1.1.1 Non-text Content',
        requirement: 'Built in',
        states: ['All'],
        description:
          'The swatch is hidden from assistive technology. Pair it with visible series text that supplies the accessible meaning.',
      },
      {
        name: 'Series distinction',
        category: 'Color contrast',
        criterion: '1.4.1 Use of Color; 1.4.11 Non-text Contrast',
        requirement: 'Consumer verification required',
        states: ['All'],
        description:
          'Choose colors and, when necessary, additional labels or mark distinctions that remain understandable on the rendered chart surface.',
      },
    ],
    anatomy: [
      {
        name: 'Series swatch',
        required: true,
        description:
          'Decorative square or short line painted with a caller-owned series color.',
      },
    ],
  },

  playground: {
    defaults: {
      color: '#3b82f6',
      variant: 'square',
    },
  },

  props: [
    {
      name: 'color',
      type: 'string',
      description:
        'CSS color used to paint the swatch. The caller owns palette selection and contrast on the rendered surface.',
      required: true,
    },
    {
      name: 'variant',
      type: "'square' | 'line'",
      description:
        'Mark shape: use square for bar series and line for other series types.',
      default: "'square'",
    },
  ],

  examples: [
    {
      label: 'Bar series swatch',
      code: `import {ChartSwatch} from '@solo/charts';

<ChartSwatch color="#3b82f6" variant="square" />;`,
    },
    {
      label: 'Series-driven swatch',
      code: `import {
  ChartSwatch,
  swatchVariantForType,
} from '@solo/charts';

<ChartSwatch
  color={series.color}
  variant={swatchVariantForType(series.type)}
/>;`,
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض ChartSwatch العلامة الزخرفية الصغيرة التي تربط لون سلسلة في المخطط بتسميتها الظاهرة.',
  propDescriptions: {
    color: 'لون CSS المستخدم لتلوين العيّنة. يتولى المستدعي اختيار لوحة الألوان وضمان التباين على السطح المعروض.',
    variant: 'شكل العلامة: استخدم square لسلاسل الأعمدة وline لأنواع السلاسل الأخرى.',
  },
  usage: {
    description: 'يعرض ChartSwatch العلامة الزخرفية الصغيرة التي تربط لون سلسلة في المخطط بتسميتها الظاهرة. استخدم مربعًا لسلاسل الأعمدة وخطًا قصيرًا للسلاسل الأخرى، بما فيها علامات الخطوط والنقاط والمساحات.',
    bestPractices: [
      {
        guidance: true,
        description: 'ضع كل عيّنة بجوار نص ظاهر يسمّي السلسلة المقابلة. ChartSwatch زخرفي ويبقى مخفيًا عن التقنيات المساعدة.',
      },
      {
        guidance: true,
        description: 'استخدم النمط square لسلاسل الأعمدة والنمط line لأنواع العلامات الأخرى كي تعكس وسائل الإيضاح والتلميحات العلاماتِ المرسومة باتساق.',
      },
      {
        guidance: false,
        description: 'استخدم ChartSwatch اسمًا قابلًا للوصول أو بديلًا للبيانات لسلسلة ما. يجب أن توفر وسيلة الإيضاح أو التلميح أو المخطط المحيط هذه المعلومات.',
      },
      {
        guidance: false,
        description: 'اعتمد على ألوان عشوائية وحدها عندما يلزم التمييز بين عدة سلاسل متماثلة الشكل في المخطط. تحقق من المخطط كاملًا مع تسمياته معًا.',
      },
    ],
    anatomy: [
      {
        name: 'عيّنة السلسلة',
        required: true,
        description: 'مربع أو خط قصير زخرفي ملوَّن بلون سلسلة يحدده المستدعي.',
      },
    ],
  },
};
