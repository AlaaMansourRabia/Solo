/** @type {import('@solo/docs-types').HookDoc} */
export const docs = {
  name: 'useScrollLock',
  displayName: 'useScrollLock',
  keywords: ['scroll', 'lock', 'modal', 'dialog', 'body', 'prevent', 'background', 'ios', 'safari', 'fixed', 'scrollbar', 'gutter', 'layout shift', 'reflow'],
  params: [
    {
      name: 'isLocked',
      type: 'boolean',
      description: 'whether body scroll should be locked.',
      required: true,
    },
  ],
  returns: [],
  usage: {
    description:
      'Locks body scroll when active by pinning the body with position: fixed. This prevents background scrolling behind modals and dialogs, which is necessary for iOS Safari where overscroll-behavior: contain does not work. Restores the original scroll position when unlocked. Pinning hides the document scrollbar, so where that scrollbar takes layout space (desktop) the hook holds its gutter open with scrollbar-gutter: stable for the duration of the lock. The page, including any position: fixed chrome, does not shift sideways.',
    bestPractices: [
      { guidance: true, description: 'Use when opening full-screen modals or dialogs to prevent background content from scrolling.' },
      { guidance: true, description: 'Pass the same boolean that controls dialog visibility (e.g., isOpen) as the isLocked parameter.' },
      { guidance: false, description: 'Use for non-modal overlays like popovers or tooltips; users should be able to scroll away from those.' },
    ],
  },
  relatedComponents: ['Dialog'],
  relatedHooks: ['useFocusTrap'],
  importPath: '@solo/core/hooks',
  category: 'layout',
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يقفل تمرير الصفحة أثناء تفعيله لمنع تمرير الخلفية خلف النوافذ المشروطة ومربعات الحوار.',
  paramDescriptions: {
    isLocked: 'ما إذا كان يجب قفل تمرير body.',
  },
  usage: {
    description:
      'يقفل تمرير body عند تفعيله عبر تثبيت body باستخدام position: fixed. يمنع ذلك تمرير الخلفية خلف النوافذ المشروطة ومربعات الحوار، وهو أمر ضروري في iOS Safari حيث لا يعمل overscroll-behavior: contain. يستعيد موضع التمرير الأصلي عند إلغاء القفل. يُخفي التثبيت شريط تمرير المستند، لذا حيث يشغل شريط التمرير مساحة في التخطيط (سطح المكتب) يُبقي الخطّاف هامشه مفتوحًا باستخدام scrollbar-gutter: stable طوال مدة القفل. لا تنزاح الصفحة جانبيًا، بما في ذلك أي عناصر واجهة ذات position: fixed.',
    bestPractices: [
      { guidance: true, description: 'استخدمه عند فتح النوافذ المشروطة أو مربعات الحوار بملء الشاشة لمنع تمرير محتوى الخلفية.' },
      { guidance: true, description: 'مرّر القيمة المنطقية نفسها التي تتحكم في ظهور مربع الحوار (مثل isOpen) كمعامل isLocked.' },
      { guidance: false, description: 'لا تستخدمه للطبقات المتراكبة غير المشروطة مثل النوافذ المنبثقة أو التلميحات؛ إذ يجب أن يتمكن المستخدمون من التمرير بعيدًا عنها.' },
    ],
  },
};

/** @type {import('@solo/docs-types').HookTranslationDoc} */
export const docsDense = {
  description:
    'Locks body scroll when active by pinning body w/ position: fixed. Prevents background scrolling behind modals + dialogs, necessary for iOS Safari where overscroll-behavior: contain does not work. Restores original scroll position when unlocked. Holds the hidden scrollbar\'s gutter open (scrollbar-gutter: stable) so the page (incl. position: fixed chrome) does not shift sideways.',
  paramDescriptions: {
    isLocked: 'whether body scroll should be locked.',
  },
  usage: {
    description:
      'Locks body scroll when active by pinning body w/ position: fixed. Prevents background scrolling behind modals + dialogs, necessary for iOS Safari where overscroll-behavior: contain does not work. Restores original scroll position when unlocked. Holds the hidden scrollbar\'s gutter open (scrollbar-gutter: stable) so the page (incl. position: fixed chrome) does not shift sideways.',
    bestPractices: [
      { guidance: true, description: 'Use when opening full-screen modals / dialogs to prevent background content from scrolling.' },
      { guidance: true, description: 'Pass same boolean that controls dialog visibility (e.g. isOpen) as isLocked parameter.' },
      { guidance: false, description: 'Use for non-modal overlays like popovers / tooltips; users should be able to scroll away from those.' },
    ],
  },
};
