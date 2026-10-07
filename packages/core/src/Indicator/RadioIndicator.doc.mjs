/**
 * RadioIndicator — a member of the Indicator family (see ./Indicator.doc.mjs for the
 * family's usage, anatomy and theming). Split out of Indicator.doc.mjs so the
 * docs site can load one doc file per family member.
 */

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'RadioIndicator',
  subComponentOf: 'Indicator',
  group: 'Indicator',
  category: 'Form Controls',
  importPath: '@solo/core/Indicator',
  keywords: ['radio', 'indicator', 'selected', 'circle', 'dot', 'single selection', 'themeable'],
  displayName: 'Radio Indicator',
  description:
    'The radio visual: a circle with a filled inner dot when selected. Draws in both states; an unselected radio is an empty circle, which is what lets it stand in for a checkmark in a selection slot.',
  props: [
    {
      name: 'state',
      type: "'unchecked' | 'checked'",
      description:
        'Which state to draw. Radio belongs to the singleSelection family, which has no partial state.',
      required: true,
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Control size: 20px or 24px.',
      default: "'md'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Whether the owning control is disabled. Purely visual; the owner keeps the real disabled semantics.',
      default: 'false',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Rendered inside the chrome INSTEAD of the state mark.',
    },
  ],
  playground: {
    defaults: {state: 'checked'},
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'العنصر المرئي لزر الاختيار: دائرة بنقطة داخلية ممتلئة عند التحديد. يُرسم في كلتا الحالتين؛ فزر الاختيار غير المحدد دائرة فارغة، وهذا ما يتيح له أن يحل محل علامة الاختيار في فتحة التحديد.',
  propDescriptions: {
    state: 'الحالة المراد رسمها. ينتمي زر الاختيار إلى عائلة singleSelection التي لا تملك حالة جزئية.',
    size: 'حجم عنصر التحكم: 20px أو 24px.',
    isDisabled: 'ما إذا كان عنصر التحكم المالك معطَّلًا. مرئي فقط؛ إذ يحتفظ المالك بدلالات التعطيل الفعلية.',
    children: 'يُعرض داخل الإطار بدلًا من علامة الحالة.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  name: 'RadioIndicator',
  displayName: 'Radio Indicator',
  description:
    'Radio visual: a circle with a filled inner dot when selected. Draws in both states; an unselected radio is an empty circle, which is what lets it stand in for a checkmark in a selection slot.',
  propDescriptions: {
    state: 'which state to draw. Radio belongs to the singleSelection family, which has no partial state.',
    size: 'control size: 20px or 24px.',
    isDisabled: 'whether the owner is disabled. Purely visual; the owner keeps the real disabled semantics.',
    children: 'rendered inside the chrome INSTEAD of the state mark.',
  },
};
