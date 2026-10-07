/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Handle',
    required: true,
    description:
      'Focusable separator that owns pointer and keyboard resize interaction.',
  },
  {
    name: 'Grip pill',
    required: false,
    description:
      'Default visible grip indicator; custom handle content can replace it.',
  },
  {
    name: 'Grab zone',
    required: true,
    description:
      'Invisible enlarged pointer region aligned with the grip or divider.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'Resizable',
  displayName: 'Resizable',
  group: 'Resizable',
  category: 'Layout',
  keywords: [
    'resize',
    'resizable',
    'split',
    'splitter',
    'panel',
    'drag',
    'separator',
    'divider',
    'handle',
    'grip',
  ],
  usage: {
    anatomy,
    description:
      'Hook-based resizable panel system. useResizable() manages size state ' +
      'and ResizeHandle provides the interactive pill-grip separator. ' +
      'Pass resize props to existing layout components via their resizable prop.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use percent(value, {min: pixel(value)}) or percent(value, {max: pixel(value)}) when a percentage needs exactly one pixel floor or ceiling. Reuse Table’s pixel() helper; numbers, exact Npx, and pixel(value) remain pixels. State, persistence, callbacks, paint, and ARIA remain resolved pixels.',
      },
      {
        guidance: true,
        description:
          'Use useResizable() with existing Solo layout components. ' +
          'Pass the returned props to the resizable prop on LayoutPanel or SideNav.',
      },
      {
        guidance: true,
        description:
          'Provide an accessible label on each ResizeHandle when multiple ' +
          'handles exist (e.g. "Resize sidebar", "Resize terminal").',
      },
      {
        guidance: false,
        description:
          'Wrap panels in extra container components for resize. The hook-first ' +
          'architecture avoids extra DOM; use it directly on existing components.',
      },
    ],
  },
  theming: {
    targets: [
      {className: 'solo-resize-handle', visualProps: ['direction']},
      {className: 'solo-resize-handle-pill'},
    ],
  },
  components: [
    {
      name: 'useResizable',
      displayName: 'useResizable',
      description:
        'Hook that manages resize state for one or more panel regions. ' +
        'Returns size, isCollapsed, collapse/expand/resize methods, and props to pass to handles.',
      examples: [
        {
          label: 'Structured fixed pixels',
          code: `const region = useResizable({
  defaultSize: pixel(333),
  containerRef,
});`,
        },
        {
          label: 'One-time structured default',
          code: `import {useRef} from 'react';
import {ResizeHandle, useResizable} from '@solo/core/Resizable';
import {percent, pixel} from '@solo/core/Resizable/utils';

const containerRef = useRef<HTMLDivElement>(null);

const region = useResizable({
  defaultSize: percent(40, {min: pixel(333)}),
  containerRef,
});

<ResizeHandle direction="horizontal" resizable={region.props} />;`,
        },
        {
          label: 'Live percentage floor',
          code: `const region = useResizable({
  defaultSize: 0,
  minSize: percent(40, {min: pixel(333)}),
  containerRef,
});`,
        },
        {
          label: 'Live percentage ceiling',
          code: `const region = useResizable({
  defaultSize: 500,
  maxSize: percent(10, {max: pixel(400)}),
  containerRef,
});`,
        },
      ],
      props: [
        {
          name: 'defaultSize',
          type: 'SizeValue | ResizableSize',
          description:
            'Initial size. Numbers, exact Npx, and pixel(value) are pixels; exact N% has no additional pixel bound; percent(value, {min: pixel(value)}) or percent(value, {max: pixel(value)}) adds exactly one and resolves once.',
          default: '250',
        },
        {
          name: 'minSize',
          type: 'ResizableSize',
          description:
            'Live minimum. Numbers, exact Npx, and pixel(value) remain pixels; exact N% has no additional pixel bound; percent(value, {min: pixel(value)}) or percent(value, {max: pixel(value)}) adds exactly one.',
          default: '50',
        },
        {
          name: 'maxSize',
          type: 'ResizableSize',
          description:
            'Live maximum. Numbers, exact Npx, and pixel(value) remain pixels; exact N% has no additional pixel bound; percent(value, {min: pixel(value)}) or percent(value, {max: pixel(value)}) adds exactly one.',
          default: 'Infinity',
        },
        {
          name: 'collapsible',
          type: 'boolean',
          description: 'Whether the region can collapse to size 0.',
          default: 'false',
        },
        {
          name: 'collapsedSize',
          type: 'number',
          description: 'Pixel threshold that triggers collapse during drag.',
          default: '40',
        },
        {
          name: 'snaps',
          type: 'number[]',
          description: 'Pixel values to snap to during resize.',
        },
        {
          name: 'shrinkOrder',
          type: 'number',
          description: 'Cascade priority: lower number shrinks first.',
        },
        {
          name: 'autoSaveId',
          type: 'string',
          description:
            'Key for persisting sizes and collapse state to localStorage.',
        },
      ],
    },
    {name: 'ResizeHandle'},
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'نظام لوحات قابلة لتغيير الحجم قائم على الخطّافات (hooks): يدير useResizable() حالة الحجم، ويوفّر ResizeHandle الفاصل التفاعلي بمقبض على شكل كبسولة.',
  usage: {
    description:
      'نظام لوحات قابلة لتغيير الحجم قائم على الخطّافات (hooks). يدير useResizable() حالة الحجم، ويوفّر ResizeHandle الفاصل التفاعلي بمقبض على شكل كبسولة. مرّر خصائص تغيير الحجم إلى مكوّنات التخطيط الموجودة عبر خاصيتها resizable.',
    bestPractices: [
      {
        guidance: true,
        description:
          'استخدم percent(value, {min: pixel(value)}) أو percent(value, {max: pixel(value)}) عندما تحتاج نسبة مئوية إلى حد أدنى أو أقصى واحد بالبكسل بالضبط. أعد استخدام الدالة المساعدة pixel() من Table؛ وتبقى الأرقام وقيم Npx الدقيقة وpixel(value) بكسلات. وتبقى الحالة والحفظ ودوال الاستدعاء والرسم وARIA بكسلات محسوبة.',
      },
      {
        guidance: true,
        description:
          'استخدم useResizable() مع مكوّنات تخطيط Solo الموجودة. مرّر الخصائص المُعادة إلى الخاصية resizable في LayoutPanel أو SideNav.',
      },
      {
        guidance: true,
        description:
          'وفّر تسمية قابلة للوصول لكل ResizeHandle عند وجود عدة مقابض (مثل "Resize sidebar" و"Resize terminal").',
      },
      {
        guidance: false,
        description:
          'لا تغلّف اللوحات في مكوّنات حاوية إضافية لتغيير الحجم. تتجنب البنية القائمة على الخطّافات عناصر DOM الإضافية؛ استخدمها مباشرةً على المكوّنات الموجودة.',
      },
    ],
    anatomy: [
      {
        name: 'المقبض',
        required: true,
        description: 'فاصل قابل للتركيز يتولى تفاعل تغيير الحجم بالمؤشر ولوحة المفاتيح.',
      },
      {
        name: 'كبسولة الإمساك',
        required: false,
        description: 'مؤشر الإمساك المرئي الافتراضي؛ ويمكن لمحتوى مقبض مخصّص أن يحل محله.',
      },
      {
        name: 'منطقة الإمساك',
        required: true,
        description: 'منطقة مؤشر غير مرئية مكبّرة محاذاة للمقبض أو الفاصل.',
      },
    ],
  },
  components: [
    {
      name: 'useResizable',
      displayName: 'useResizable',
      description:
        'خطّاف (hook) يدير حالة تغيير الحجم لمنطقة لوحة واحدة أو أكثر. يُعيد size وisCollapsed ودوال collapse/expand/resize والخصائص التي تُمرَّر إلى المقابض.',
      propDescriptions: {
        defaultSize:
          'الحجم الأولي. الأرقام وقيم Npx الدقيقة وpixel(value) بكسلات؛ وقيمة N% الدقيقة بلا حد إضافي بالبكسل؛ وتضيف percent(value, {min: pixel(value)}) أو percent(value, {max: pixel(value)}) حدًّا واحدًا بالضبط وتُحسب مرة واحدة.',
        minSize:
          'الحد الأدنى الحي. تبقى الأرقام وقيم Npx الدقيقة وpixel(value) بكسلات؛ وقيمة N% الدقيقة بلا حد إضافي بالبكسل؛ وتضيف percent(value, {min: pixel(value)}) أو percent(value, {max: pixel(value)}) حدًّا واحدًا بالضبط.',
        maxSize:
          'الحد الأقصى الحي. تبقى الأرقام وقيم Npx الدقيقة وpixel(value) بكسلات؛ وقيمة N% الدقيقة بلا حد إضافي بالبكسل؛ وتضيف percent(value, {min: pixel(value)}) أو percent(value, {max: pixel(value)}) حدًّا واحدًا بالضبط.',
        collapsible: 'ما إذا كان يمكن طيّ المنطقة إلى الحجم 0.',
        collapsedSize: 'عتبة بالبكسل تُطلق الطيّ أثناء السحب.',
        snaps: 'قيم بالبكسل للالتقاط إليها أثناء تغيير الحجم.',
        shrinkOrder: 'أولوية التتابع: الرقم الأصغر يتقلّص أولًا.',
        autoSaveId: 'مفتاح لحفظ الأحجام وحالة الطيّ في localStorage.',
      },
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Hook-based resizable panel system. useResizable() manages size state; ResizeHandle provides interactive pill-grip separator.',
  usage: {
    anatomy,
    description:
      'Hook-based resizable panel system. useResizable() manages size state; ResizeHandle provides interactive pill-grip separator. Pass resize props to existing layout components via their resizable prop.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use useResizable() w/ existing Solo layout components. Pass returned props to resizable prop on LayoutPanel or SideNav.',
      },
      {
        guidance: true,
        description:
          'Provide accessible label on each ResizeHandle when multiple handles exist (e.g. "Resize sidebar", "Resize terminal").',
      },
      {
        guidance: false,
        description:
          'Wrap panels in extra container components for resize. Hook-first architecture avoids extra DOM; use it directly on existing components.',
      },
    ],
  },
  components: [
    {
      name: 'useResizable',
      description:
        'Hook managing resize state for one or more panel regions. Returns size, isCollapsed, collapse/expand/resize methods, + props to pass to handles.',
      propDescriptions: {
        defaultSize:
          'initial pixels, exact N%, or percent(value, {min: pixel(value)}) / percent(value, {max: pixel(value)}); resolves once',
        minSize:
          'live minimum: pixels, exact N%, or percent(value, {min: pixel(value)}) / percent(value, {max: pixel(value)})',
        maxSize:
          'live maximum: pixels, exact N%, or percent(value, {min: pixel(value)}) / percent(value, {max: pixel(value)})',
        collapsible: 'region can collapse to size 0?',
        collapsedSize: 'px threshold triggering collapse during drag',
        snaps: 'px values to snap to during resize',
        shrinkOrder: 'cascade priority: lower number shrinks first',
        autoSaveId: 'key for persisting sizes + collapse state to localStorage',
      },
    },
    {name: 'ResizeHandle'},
  ],
};
