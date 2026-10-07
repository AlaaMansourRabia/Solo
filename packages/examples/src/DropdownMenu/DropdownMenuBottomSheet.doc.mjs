/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'DropdownMenu',
  alsoExampleFor: ['BottomSheet', 'useMediaQuery'],
  name: 'DropdownMenu — Adaptive presentation',
  displayName: 'DropdownMenu — Adaptive presentation',
  description:
    'Chooses a bottom sheet for compact touch surfaces and an anchored popover otherwise. The media query is product policy, while DropdownMenu owns both presentations.',
  displayNameAr: 'DropdownMenu — عرض تكيّفي',
  descriptionAr: 'يختار ورقة سفلية لأسطح اللمس المضغوطة، ونافذة منبثقة مثبّتة في غير ذلك. استعلام الوسائط هو سياسة خاصة بالمنتج، بينما يملك DropdownMenu كلا طريقتي العرض.',
  isReady: true,
  order: 2,
  aspectRatio: 3 / 4,
  componentsUsed: ['DropdownMenu', 'Stack', 'Text', 'useMediaQuery'],
};
