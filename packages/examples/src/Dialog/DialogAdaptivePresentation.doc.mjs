/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Dialog',
  alsoExampleFor: ['BottomSheet', 'useMediaQuery'],
  name: 'Dialog — Adaptive presentation',
  displayName: 'Dialog — Adaptive presentation',
  description:
    'Opt-in recipe for an AdaptiveDialog wrapper: Dialog remains the default everywhere, while touchPresentation="bottom-sheet" switches only at lg and below when pointer is coarse and hover is unavailable. Includes a deterministic presentation override for tests/unusual environments and notes that BottomSheet purpose controls swipe and scrim dismissal. Usage examples: touchPresentation="dialog" keeps Dialog, "fullscreen" chooses fullscreen Dialog, and "bottom-sheet" chooses BottomSheet only for the touch-oriented range. Keep presentation as the deterministic override. Do not use this by default for AlertDialog or destructive confirmations.',
  displayNameAr: 'Dialog — عرض متكيّف',
  descriptionAr: 'وصفة اختيارية لمغلّف AdaptiveDialog: يبقى Dialog هو الافتراضي في كل مكان، بينما يبدّل touchPresentation="bottom-sheet" العرض فقط عند lg وما دونه عندما يكون المؤشر غير دقيق والتمرير بالمؤشر غير متاح. يتضمن تجاوزًا حتميًا للعرض للاختبارات/البيئات غير المعتادة، ويوضّح أن purpose في BottomSheet يتحكم في الإغلاق بالسحب والنقر على الخلفية المعتمة. أمثلة الاستخدام: touchPresentation="dialog" يبقي Dialog، و"fullscreen" يختار Dialog بملء الشاشة، و"bottom-sheet" يختار BottomSheet فقط للنطاق الموجّه للّمس. أبقِ presentation تجاوزًا حتميًا. لا تستخدم هذا افتراضيًا مع AlertDialog أو تأكيدات الإجراءات الهدّامة.',
  isReady: true,
  order: 1,
  aspectRatio: 3 / 4,
  componentsUsed: [
    'Dialog',
    'DialogHeader',
    'BottomSheet',
    'Layout',
    'Button',
    'Text',
    'TextInput',
    'TextArea',
    'useMediaQuery',
  ],
};
