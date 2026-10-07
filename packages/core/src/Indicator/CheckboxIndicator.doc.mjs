/**
 * CheckboxIndicator — a member of the Indicator family (see ./Indicator.doc.mjs for the
 * family's usage, anatomy and theming). Split out of Indicator.doc.mjs so the
 * docs site can load one doc file per family member.
 */

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'CheckboxIndicator',
  subComponentOf: 'Indicator',
  group: 'Indicator',
  category: 'Form Controls',
  importPath: '@solo/core/Indicator',
  keywords: ['checkbox', 'indicator', 'checked', 'unchecked', 'indeterminate', 'box', 'checkmark', 'selection', 'themeable'],
  displayName: 'Checkbox Indicator',
  description:
    'The checkbox visual: a square box with a checkmark or an indeterminate bar. Decorative (aria-hidden); the owning control keeps the input, role, accessible name, focus, and keyboard behavior.',
  props: [
    {
      name: 'state',
      type: "'unchecked' | 'checked' | 'indeterminate'",
      description:
        'Which state to draw. An indicator draws in EVERY state: the unchecked box is an empty box, not nothing.',
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
        'Rendered inside the chrome INSTEAD of the state mark when the shallow `isRenderable(children)` check accepts the value. The helper excludes `null`, `undefined`, booleans, and the empty string; React elements and containers take the replacement path even when their descendants render nothing. CheckboxInput passes its loading Spinner through as `children={isBusy && <Spinner/>}`, so replacements should use the same helper rather than a nullish check.',
    },
  ],
  playground: {
    defaults: {state: 'checked'},
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'الشكل المرئي لمربع الاختيار: مربع بعلامة اختيار أو بشريط الحالة غير المحدّدة. زخرفي (aria-hidden)؛ إذ يحتفظ عنصر التحكم المالك بحقل الإدخال والدور والاسم القابل للوصول والتركيز وسلوك لوحة المفاتيح.',
  propDescriptions: {
    state:
      'الحالة المراد رسمها. يُرسم المؤشر في كل حالة: المربع غير المحدّد مربع فارغ، وليس لا شيء.',
    size: 'حجم عنصر التحكم: 20px أو 24px.',
    isDisabled:
      'ما إذا كان عنصر التحكم المالك معطَّلًا. بصري فقط؛ إذ يحتفظ المالك بدلالات التعطيل الفعلية.',
    children:
      'يُعرض داخل الإطار بدلًا من علامة الحالة عندما يقبل الفحص السطحي `isRenderable(children)` القيمة. تستثني الدالة المساعدة `null` و`undefined` والقيم المنطقية والسلسلة الفارغة؛ أما عناصر React والحاويات فتسلك مسار الاستبدال حتى لو لم تعرض أبناؤها شيئًا. يمرّر CheckboxInput مؤشر التحميل Spinner بالصيغة `children={isBusy && <Spinner/>}`، لذا ينبغي أن تستخدم البدائل الدالة المساعدة نفسها بدلًا من فحص القيم الفارغة.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  name: 'CheckboxIndicator',
  displayName: 'Checkbox Indicator',
  description:
    'Checkbox visual: a square box with a checkmark or indeterminate bar. Decorative (aria-hidden); the owner keeps input/role/name/focus/keyboard.',
  propDescriptions: {
    state: "which state to draw. An indicator draws in EVERY state: unchecked is an empty box, not nothing.",
    size: 'control size: 20px or 24px.',
    isDisabled: 'whether the owner is disabled. Purely visual; the owner keeps the real disabled semantics.',
    children: 'rendered inside the chrome INSTEAD of the state mark. CheckboxInput passes its loading Spinner through while a change action is pending, so a replacement must render children when present or the busy visual is lost.',
  },
};
