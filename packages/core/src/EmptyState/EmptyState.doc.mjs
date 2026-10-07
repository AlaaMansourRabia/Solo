/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'EmptyState',
  displayName: 'Empty State',
  category: 'Content',
  keywords: ["emptystate","empty","placeholder","nodata","blank","noresults","illustration","blankslate"],
  props: [
    {
      name: 'title',
      type: 'string',
      description:
        'Primary message rendered as an <h3> heading inside the empty state.',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      description:
        'Optional secondary text providing additional context below the title.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        'Optional icon or illustration displayed above the title; rendered as decorative (aria-hidden="true").',
      slotElements: [{__element: 'Icon', props: {icon: 'check', size: 'sm'}}],
    },
    {
      name: 'actions',
      type: 'ReactNode',
      description:
        'Optional action buttons displayed below the description, laid out horizontally by default and stacked vertically when isCompact is true.',
      slotElements: [{__element: 'Button', props: {label: 'Action', variant: 'secondary'}}],
    },
    {
      name: 'headingLevel',
      type: '1 | 2 | 3 | 4 | 5 | 6',
      description:
        'Controls only the rendered HTML heading tag (h1-h6) so the title fits the document outline. This is a semantic change for accessibility and does not change the visual size of the title, which stays fixed regardless of level.',
      default: '3',
    },
    {
      name: 'isCompact',
      type: 'boolean',
      description:
        'Enables the compact variant with reduced spacing for constrained content areas.',
      default: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  playground: {
    defaults: {
      title: 'No results found',
      description: 'Try adjusting your search or filter criteria.',
      actions: {__element: 'Button', props: {label: 'Clear filters', variant: 'secondary'}},
    },
  },
  theming: {
    targets: [
      {className: 'solo-empty-state', visualProps: ['variant']},
      {className: 'solo-empty-state-title', visualProps: ['variant']},
      {className: 'solo-empty-state-description', visualProps: ['variant']},
    ],
  },
  usage: {
    description: 'EmptyState shows a placeholder when a content area has no data. Use it for empty lists, zero search results, first-time setups, or cleared inboxes. Always include a title and a next step so the user is not stuck.',
    bestPractices: [
      { guidance: true, description: 'Include a clear title and a call-to-action button so users know how to proceed.' },
      { guidance: true, description: 'Use an illustration or icon that reinforces the context of the empty state.' },
      { guidance: true, description: 'Use the compact variant inside cards or sidebars where space is limited.' },
      { guidance: false, description: 'Leave an empty state without guidance; always explain what happened and what the user can do next.' },
      { guidance: false, description: 'Use a generic message like "No data"; be specific about what is empty and why.' },
      { guidance: false, description: 'Use an EmptyState for error messages that require immediate action; use a Banner instead.' },
    ],
    anatomy: [
      {name: 'Icon', required: false, description: 'A visual cue above the title that reinforces the context, like a search icon for no results.'},
      {name: 'Title', required: true, description: 'Primary message explaining what is empty: "No projects yet" not "No data".'},
      {name: 'Description', required: false, description: 'Additional context explaining why it is empty or what the user can do.'},
      {name: 'Actions', required: false, description: 'One or two buttons guiding the user to a next step, like "Create project" or "Clear filters".'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'EmptyState',
  displayName: 'Empty State',
  props: [
    {
      name: 'title',
      type: 'string',
      description:
        '在空状态内部渲染为 <h3> 标题的主要信息。',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      description:
        '可选的辅助文本，在标题下方提供额外上下文。',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        '可选的图标或插图，显示在标题上方；渲染为装饰性元素（aria-hidden="true"）。',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      description:
        '可选的操作按钮，显示在描述下方，默认水平排列，isCompact 为 true 时垂直堆叠。',
    },
    {
      name: 'headingLevel',
      type: '1 | 2 | 3 | 4 | 5 | 6',
      description:
        '仅控制渲染的 HTML 标题标签（h1-h6），使标题适配文档大纲。这是用于无障碍的语义变化，不会改变标题的视觉大小，标题大小始终固定，与级别无关。',
      default: '3',
    },
    {
      name: 'isCompact',
      type: 'boolean',
      description:
        '启用紧凑变体，减少间距，适用于空间受限的内容区域。',
      default: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-empty-state', visualProps: ['variant']},
      {className: 'solo-empty-state-title', visualProps: ['variant']},
      {className: 'solo-empty-state-description', visualProps: ['variant']},
    ],
  },
  usage: {
    description: 'EmptyState shows a placeholder when a content area has no data. Use it for empty lists, zero search results, first-time setups, or cleared inboxes. Always include a title and a next step so the user is not stuck.',
    bestPractices: [
      { guidance: true, description: 'Include a clear title and a call-to-action button so users know how to proceed.' },
      { guidance: true, description: 'Use an illustration or icon that reinforces the context of the empty state.' },
      { guidance: true, description: 'Use the compact variant inside cards or sidebars where space is limited.' },
      { guidance: false, description: 'Leave an empty state without guidance; always explain what happened and what the user can do next.' },
      { guidance: false, description: 'Use a generic message like "No data"; be specific about what is empty and why.' },
      { guidance: false, description: 'Use an EmptyState for error messages that require immediate action; use a Banner instead.' },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض EmptyState عنصرًا نائبًا عندما لا تحتوي منطقة المحتوى على بيانات، مع عنوان وخطوة تالية دائمًا كي لا يعلق المستخدم.',
  propDescriptions: {
    title: 'الرسالة الأساسية المعروضة كعنوان <h3> داخل الحالة الفارغة.',
    description: 'نص ثانوي اختياري يقدّم سياقًا إضافيًا أسفل العنوان.',
    icon: 'أيقونة أو رسم توضيحي اختياري يُعرض أعلى العنوان؛ ويُعرض كعنصر زخرفي (aria-hidden="true").',
    actions: 'أزرار إجراءات اختيارية تُعرض أسفل الوصف، مرتبة أفقيًا افتراضيًا ومكدّسة عموديًا عندما تكون isCompact صحيحة.',
    headingLevel: 'يتحكم فقط في وسم عنوان HTML المعروض (h1-h6) كي يتلاءم العنوان مع مخطط المستند. هذا تغيير دلالي لإمكانية الوصول ولا يغيّر الحجم المرئي للعنوان، الذي يبقى ثابتًا بغض النظر عن المستوى.',
    isCompact: 'يفعّل النمط المضغوط بتباعد أقل لمناطق المحتوى المحدودة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأحجام)، تُدمج مع أصناف المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'يعرض EmptyState عنصرًا نائبًا عندما لا تحتوي منطقة المحتوى على بيانات. استخدمه للقوائم الفارغة، أو نتائج البحث الصفرية، أو الإعداد لأول مرة، أو صناديق الوارد التي أُفرغت. أدرج دائمًا عنوانًا وخطوة تالية كي لا يعلق المستخدم.',
    bestPractices: [
      {
        guidance: true,
        description: 'أدرج عنوانًا واضحًا وزر دعوة لاتخاذ إجراء كي يعرف المستخدمون كيفية المتابعة.',
      },
      {
        guidance: true,
        description: 'استخدم رسمًا توضيحيًا أو أيقونة تعزّز سياق الحالة الفارغة.',
      },
      {
        guidance: true,
        description: 'استخدم النمط المضغوط داخل البطاقات أو الأشرطة الجانبية حيث المساحة محدودة.',
      },
      {
        guidance: false,
        description: 'ترك حالة فارغة دون إرشاد؛ اشرح دائمًا ما حدث وما يمكن للمستخدم فعله بعد ذلك.',
      },
      {
        guidance: false,
        description: 'استخدام رسالة عامة مثل "لا توجد بيانات"؛ كن محددًا بشأن ما هو فارغ وسبب ذلك.',
      },
      {
        guidance: false,
        description: 'استخدام EmptyState لرسائل الخطأ التي تتطلب إجراءً فوريًا؛ استخدم Banner بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'الأيقونة',
        required: false,
        description: 'إشارة مرئية أعلى العنوان تعزّز السياق، مثل أيقونة بحث عند عدم وجود نتائج.',
      },
      {
        name: 'العنوان',
        required: true,
        description: 'الرسالة الأساسية التي توضح ما هو فارغ: "لا توجد مشاريع بعد" بدلًا من "لا توجد بيانات".',
      },
      {
        name: 'الوصف',
        required: false,
        description: 'سياق إضافي يوضح سبب كونه فارغًا أو ما يمكن للمستخدم فعله.',
      },
      {
        name: 'الإجراءات',
        required: false,
        description: 'زر أو زران يوجّهان المستخدم إلى خطوة تالية، مثل "إنشاء مشروع" أو "مسح عوامل التصفية".',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'placeholder when a content area has no data: icon, title, description, action buttons',
  usage: {
    description: 'EmptyState shows a placeholder for empty lists, zero search results, first-time setups. Always include a title and next step.',
    bestPractices: [
      { guidance: true, description: 'Include a clear title + call-to-action button so users know how to proceed.' },
      { guidance: true, description: 'Use an illustration or icon that reinforces the context of the empty state.' },
      { guidance: true, description: 'Use the compact variant inside cards or sidebars where space is limited.' },
      { guidance: false, description: 'Leave an empty state without guidance; always explain what happened and what user can do next.' },
      { guidance: false, description: 'Use a generic message like "No data"; be specific about what is empty and why.' },
      { guidance: false, description: 'Use an EmptyState for error messages that require immediate action; use a Banner instead.' },
    ],
  },
  propDescriptions: {
    title: 'Primary msg rendered as heading (h1-h6) inside empty state.',
    headingLevel: 'Controls only HTML heading tag (h1-h6) for document outline; does not change visual title size.',
    description: 'Optional secondary text w/ additional context below title.',
    icon: 'Optional icon/illustration above title; rendered decorative (aria-hidden="true").',
    actions: 'Optional action buttons below description; horizontal by default, vertical when isCompact.',
    isCompact: 'Enables compact variant w/ reduced spacing for constrained areas.',
    className: 'Tailwind classes for layout customization; merged via cn(), so conflicting utilities override defaults.',
  },
};
