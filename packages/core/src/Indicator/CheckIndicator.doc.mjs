/**
 * CheckIndicator — a member of the Indicator family (see ./Indicator.doc.mjs for the
 * family's usage, anatomy and theming). Split out of Indicator.doc.mjs so the
 * docs site can load one doc file per family member.
 */

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'CheckIndicator',
  subComponentOf: 'Indicator',
  group: 'Indicator',
  category: 'Form Controls',
  importPath: '@solo/core/Indicator',
  keywords: ['check', 'checkmark', 'indicator', 'selected', 'chosen', 'mark', 'selection', 'themeable'],
  displayName: 'Check Indicator',
  description:
    'The mark on a chosen option: a checkmark by default, and nothing at all when unchosen, so a listbox shows no empty box beside every row. This is the indicator to replace to change what "chosen" looks like: mapping it to RadioIndicator gives every single-selection mark radio visuals, including an empty circle on unchosen rows. Unlike the checkbox and radio visuals it renders no chrome of its own (it IS the glyph), so a host\'s theme target lands on the same element as solo-icon.',
  props: [
    {
      name: 'state',
      type: "'unchecked' | 'checked'",
      description:
        'Which state to draw. The default renders nothing when unchecked; a replacement may draw in both states.',
      required: true,
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Control size, matching the other indicators.',
      default: "'md'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Whether the owning row is disabled. Purely visual; the owner keeps the real disabled semantics.',
      default: 'false',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Rendered INSTEAD of the mark, in every state: a host showing a pending Spinner passes it through whether or not the row is chosen.',
    },
  ],
  playground: {
    defaults: {state: 'checked'},
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'العلامة على الخيار المختار: علامة صح افتراضيًا، ولا شيء على الإطلاق عند عدم الاختيار، كي لا يُظهر مربع القائمة (listbox) مربعًا فارغًا بجانب كل صف. هذا هو المؤشر الذي يُستبدل لتغيير شكل "المختار": ربطه بـ RadioIndicator يمنح كل علامة اختيار فردي مظهر زر الاختيار، بما في ذلك دائرة فارغة على الصفوف غير المختارة. على عكس مظاهر مربع الاختيار وزر الاختيار، لا يعرض أي إطار خاص به (فهو الرمز نفسه)، لذا يقع هدف السمة لدى المضيف على العنصر نفسه الذي يحمل solo-icon.',
  propDescriptions: {
    state: 'الحالة المراد رسمها. لا يعرض الافتراضي شيئًا عند عدم التحديد؛ وقد يرسم البديل في الحالتين.',
    size: 'حجم عنصر التحكم، مطابقًا للمؤشرات الأخرى.',
    isDisabled: 'ما إذا كان الصف المالك معطَّلًا. مرئي فقط؛ إذ يحتفظ المالك بدلالات التعطيل الفعلية.',
    children: 'يُعرض بدلًا من العلامة، في كل الحالات: المضيف الذي يعرض Spinner أثناء الانتظار يمرّره سواء كان الصف مختارًا أم لا.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  name: 'CheckIndicator',
  displayName: 'Check Indicator',
  description:
    'The mark on a chosen option: a checkmark by default, nothing when unchosen. Map to RadioIndicator for radio visuals on single-selection marks. Renders no chrome of its own (it IS the glyph), so a theme target lands on the same element as solo-icon.',
  propDescriptions: {
    state: 'which state to draw. The default renders nothing when unchecked; a replacement may draw in both states.',
    size: 'control size, matching the other indicators.',
    isDisabled: 'whether the owning row is disabled. Purely visual; the owner keeps the real disabled semantics.',
    children: 'rendered INSTEAD of the mark, in every state; a host showing a pending Spinner passes it through whether or not the row is chosen.',
  },
};
